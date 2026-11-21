const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const DocGia = require('../models/docGia.model');
const NhanVien = require('../models/nhanVien.model');
const GioHang = require('../models/gioHang.model');

// 1. Đăng ký tài khoản Độc giả
const register = async (req, res) => {
  try {
    const { tenDG, emailDG, matKhauDG, ngaySinhDG, gioiTinhDG, dienThoai, diaChi, hoLot } = req.body;

    if (!tenDG || !emailDG || !matKhauDG) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ: Tên độc giả (tenDG), Email (emailDG) và Mật khẩu (matKhauDG)!'
      });
    }

    const existingDocGia = await DocGia.findOne({ emailDG: emailDG.toLowerCase() });
    if (existingDocGia) {
      return res.status(400).json({
        success: false,
        message: 'Email này đã được sử dụng bởi một tài khoản độc giả khác!'
      });
    }

    // Tự động sinh mã độc giả maDG
    const count = await DocGia.countDocuments();
    const maDG = req.body.maDG || `DG-${String(count + 1).padStart(4, '0')}`;

    // Mã hóa mật khẩu bảo mật
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(matKhauDG, salt);

    const newDocGia = new DocGia({
      maDG,
      tenDG,
      emailDG: emailDG.toLowerCase(),
      matKhauDG: hashedPassword,
      ngaySinhDG: ngaySinhDG || '',
      gioiTinhDG: gioiTinhDG || 'Nam',
      hoLot: hoLot || '',
      dienThoai: dienThoai || '',
      diaChi: diaChi || '',
      trangThaiDG: true
    });

    await newDocGia.save();

    // Khởi tạo giỏ hàng rỗng GIOHANG cho độc giả (quan hệ 1-1 'so huu')
    const maGH = `GH-${maDG}`;
    const newGioHang = new GioHang({
      maGH,
      maDG,
      tongSoLuong: 0,
      chiTiet: []
    });
    await newGioHang.save();

    // Tạo JWT Token
    const token = jwt.sign(
      {
        id: newDocGia._id,
        code: newDocGia.maDG,
        role: 'DOCGIA',
        email: newDocGia.emailDG,
        name: newDocGia.tenDG
      },
      config.secret,
      { expiresIn: config.expiresIn }
    );

    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản độc giả thành công!',
      token,
      user: {
        maDG: newDocGia.maDG,
        tenDG: newDocGia.tenDG,
        emailDG: newDocGia.emailDG,
        gioiTinhDG: newDocGia.gioiTinhDG,
        role: 'DOCGIA'
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 2. Đăng nhập chung cho Độc giả và Thủ thư / Nhân viên
const login = async (req, res) => {
  try {
    const { email, password, matKhau } = req.body;
    const inputPass = matKhau || password;

    if (!email || !inputPass) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ Email và Mật khẩu!'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Bước 1: Kiểm tra trong bảng Độc giả (DocGia)
    const docGia = await DocGia.findOne({ emailDG: cleanEmail });
    if (docGia) {
      if (!docGia.trangThaiDG) {
        return res.status(403).json({
          success: false,
          message: 'Tài khoản độc giả này đã bị tạm khóa bởi thư viện!'
        });
      }

      const isMatch = await bcrypt.compare(inputPass, docGia.matKhauDG);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu đăng nhập không chính xác!'
        });
      }

      const token = jwt.sign(
        {
          id: docGia._id,
          code: docGia.maDG,
          role: 'DOCGIA',
          email: docGia.emailDG,
          name: docGia.tenDG
        },
        config.secret,
        { expiresIn: config.expiresIn }
      );

      return res.json({
        success: true,
        message: 'Đăng nhập thành công với vai trò Độc giả!',
        token,
        role: 'DOCGIA',
        user: {
          maDG: docGia.maDG,
          tenDG: docGia.tenDG,
          emailDG: docGia.emailDG,
          ngaySinhDG: docGia.ngaySinhDG,
          gioiTinhDG: docGia.gioiTinhDG,
          dienThoai: docGia.dienThoai,
          diaChi: docGia.diaChi,
          role: 'DOCGIA'
        }
      });
    }

    // Bước 2: Kiểm tra trong bảng Nhân viên (NhanVien)
    const nhanVien = await NhanVien.findOne({ emailNV: cleanEmail });
    if (nhanVien) {
      if (nhanVien.trangThaiNV === false) {
        return res.status(403).json({
          success: false,
          message: 'Tài khoản nhân viên này đang bị vô hiệu hóa!'
        });
      }

      const isMatch = await bcrypt.compare(inputPass, nhanVien.matKhauNV);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu đăng nhập không chính xác!'
        });
      }

      const token = jwt.sign(
        {
          id: nhanVien._id,
          code: nhanVien.maNV,
          role: 'NHANVIEN',
          email: nhanVien.emailNV,
          name: nhanVien.tenNV,
          chucVu: nhanVien.chucVuNV
        },
        config.secret,
        { expiresIn: config.expiresIn }
      );

      return res.json({
        success: true,
        message: 'Đăng nhập thành công với vai trò Cán bộ thư viện / Quản trị!',
        token,
        role: 'NHANVIEN',
        user: {
          maNV: nhanVien.maNV,
          tenNV: nhanVien.tenNV,
          emailNV: nhanVien.emailNV,
          chucVuNV: nhanVien.chucVuNV,
          role: 'NHANVIEN'
        }
      });
    }

    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy tài khoản tương ứng với Email đã cung cấp!'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 3. Lấy thông tin cá nhân hiện hành (Profile)
const getProfile = async (req, res) => {
  try {
    if (req.user.role === 'DOCGIA') {
      const docGia = await DocGia.findById(req.user.id).select('-matKhauDG');
      return res.json({
        success: true,
        role: 'DOCGIA',
        data: docGia
      });
    } else {
      const nhanVien = await NhanVien.findById(req.user.id).select('-matKhauNV');
      return res.json({
        success: true,
        role: 'NHANVIEN',
        data: nhanVien
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile
};

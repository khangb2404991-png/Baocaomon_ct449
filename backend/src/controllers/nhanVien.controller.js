const bcrypt = require('bcryptjs');
const NhanVien = require('../models/nhanVien.model');

const getAll = async (req, res) => {
  try {
    const list = await NhanVien.find().select('-matKhauNV').sort({ createdAt: -1 });
    return res.json({ success: true, total: list.length, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { tenNV, emailNV, matKhauNV, chucVuNV, ngaySinhNV, gioiTinhNV, soDienThoai, diaChi } = req.body;

    if (!tenNV || !emailNV || !matKhauNV) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ Tên nhân viên (tenNV), Email (emailNV) và Mật khẩu (matKhauNV)!'
      });
    }

    const existing = await NhanVien.findOne({ emailNV: emailNV.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email nhân viên này đã tồn tại!' });
    }

    const count = await NhanVien.countDocuments();
    const maNV = req.body.maNV || `NV-${String(count + 1).padStart(4, '0')}`;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(matKhauNV, salt);

    const nv = new NhanVien({
      maNV,
      tenNV,
      emailNV: emailNV.toLowerCase(),
      matKhauNV: hashedPassword,
      chucVuNV: chucVuNV || 'Thủ thư',
      ngaySinhNV: ngaySinhNV || '',
      gioiTinhNV: gioiTinhNV || 'Nam',
      soDienThoai: soDienThoai || '',
      diaChi: diaChi || '',
      trangThaiNV: true
    });

    await nv.save();

    return res.status(201).json({
      success: true,
      message: 'Thêm nhân sự cán bộ thư viện mới thành công!',
      data: {
        maNV: nv.maNV,
        tenNV: nv.tenNV,
        emailNV: nv.emailNV,
        chucVuNV: nv.chucVuNV
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    let nv = await NhanVien.findOne({ maNV: id });
    if (!nv && id.match(/^[0-9a-fA-F]{24}$/)) {
      nv = await NhanVien.findById(id);
    }

    if (!nv) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên!' });
    }

    if (req.body.matKhauNV) {
      const salt = await bcrypt.genSalt(10);
      req.body.matKhauNV = await bcrypt.hash(req.body.matKhauNV, salt);
    }

    Object.assign(nv, req.body);
    await nv.save();

    return res.json({ success: true, message: 'Cập nhật thông tin nhân viên thành công!', data: nv });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteNV = async (req, res) => {
  try {
    const { id } = req.params;
    let nv = await NhanVien.findOne({ maNV: id });
    if (!nv && id.match(/^[0-9a-fA-F]{24}$/)) {
      nv = await NhanVien.findById(id);
    }

    if (!nv) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên!' });
    }

    await NhanVien.deleteOne({ _id: nv._id });
    return res.json({ success: true, message: `Đã xóa cán bộ "${nv.tenNV}" thành công!` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAll,
  create,
  update,
  deleteNV
};

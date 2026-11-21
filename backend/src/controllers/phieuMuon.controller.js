const PhieuMuon = require('../models/phieuMuon.model');
const Sach = require('../models/sach.model');
const DocGia = require('../models/docGia.model');
const GioHang = require('../models/gioHang.model');

// 1. Lấy toàn bộ phiếu mượn (Admin)
const getAll = async (req, res) => {
  try {
    const { trangThaiPM, search } = req.query;
    const query = {};

    if (trangThaiPM && trangThaiPM !== 'ALL') {
      query.trangThaiPM = trangThaiPM;
    }
    if (search && search.trim()) {
      const kw = search.trim();
      query.$or = [
        { tenDG: { $regex: kw, $options: 'i' } },
        { emailDG: { $regex: kw, $options: 'i' } },
        { 'chiTiet.tenSach': { $regex: kw, $options: 'i' } }
      ];
    }

    const list = await PhieuMuon.find(query).sort({ createdAt: -1 });

    // Tính toán số lượng theo trạng thái
    const allBorrows = await PhieuMuon.find();
    const metrics = {
      choDuyet: allBorrows.filter(p => p.trangThaiPM === 'CHO_DUYET').length,
      dangMuon: allBorrows.filter(p => p.trangThaiPM === 'DANG_MUON').length,
      daTra: allBorrows.filter(p => p.trangThaiPM === 'DA_TRA').length,
      quaHan: allBorrows.filter(p => p.trangThaiPM === 'QUA_HAN').length
    };

    return res.json({
      success: true,
      total: list.length,
      metrics,
      data: list
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Lấy lịch sử mượn của độc giả hiện tại
const getMyBorrows = async (req, res) => {
  try {
    const maDG = req.user.code;
    const list = await PhieuMuon.find({ maDG }).sort({ createdAt: -1 });
    return res.json({ success: true, total: list.length, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Độc giả gửi yêu cầu mượn sách
const create = async (req, res) => {
  try {
    const maDG = (req.user && req.user.code) || req.body.maDG;
    const { items, hanTra } = req.body;

    if (!maDG || !items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp danh sách sách mượn!'
      });
    }

    const docGia = await DocGia.findOne({ maDG });
    const tenDG = docGia ? docGia.tenDG : 'Độc giả';
    const emailDG = docGia ? docGia.emailDG : '';

    const count = await PhieuMuon.countDocuments();
    const maPM = `PM-${Date.now().toString().slice(-6)}-${String(count + 1).padStart(2, '0')}`;

    let tongTienSach = 0;
    const chiTiet = [];

    for (const it of items) {
      const book = await Sach.findOne({ maSach: it.maSach });
      if (!book) {
        return res.status(404).json({ success: false, message: `Không tìm thấy sách: ${it.maSach}` });
      }
      const qty = it.soLuong || it.soLuongMuon || 1;
      const thanhTien = (book.donGia || 0) * qty;
      tongTienSach += thanhTien;

      chiTiet.push({
        maCTPM: `CTPM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        maSach: book.maSach,
        tenSach: book.tenSach,
        soLuongMuon: qty,
        thanhTien,
        tinhTrangSach: 'BINH_THUONG'
      });
    }

    // Mặc định hạn trả là 14 ngày nếu không chỉ định
    const returnDate = hanTra ? new Date(hanTra) : new Date(Date.now() + 14 * 24 * 3600 * 1000);

    const newPhieuMuon = new PhieuMuon({
      maPM,
      maDG,
      tenDG,
      emailDG,
      ngayMuon: new Date(),
      hanTra: returnDate,
      trangThaiPM: 'CHO_DUYET',
      tongTienSach,
      chiTiet
    });

    await newPhieuMuon.save();

    // Tự động làm rỗng giỏ hàng sau khi đặt mượn
    await GioHang.findOneAndUpdate({ maDG }, { chiTiet: [], tongSoLuong: 0 });

    return res.status(201).json({
      success: true,
      message: 'Gửi yêu cầu đăng ký mượn sách thành công! Vui lòng chờ thủ thư phê duyệt.',
      data: newPhieuMuon
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Thủ thư duyệt mượn
const approve = async (req, res) => {
  try {
    const { id } = req.params;
    let phieu = await PhieuMuon.findOne({ maPM: id });
    if (!phieu && id.match(/^[0-9a-fA-F]{24}$/)) {
      phieu = await PhieuMuon.findById(id);
    }

    if (!phieu) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu mượn!' });
    }

    if (phieu.trangThaiPM !== 'CHO_DUYET') {
      return res.status(400).json({ success: false, message: 'Phiếu mượn không ở trạng thái chờ duyệt!' });
    }

    // Trừ kho và tăng lượt mượn của các sách
    for (const item of phieu.chiTiet) {
      await Sach.findOneAndUpdate(
        { maSach: item.maSach },
        { 
          $inc: { 
            soLuong: -item.soLuongMuon,
            luotMuon: item.soLuongMuon 
          } 
        }
      );
    }

    phieu.trangThaiPM = 'DANG_MUON';
    phieu.maNV = (req.user && req.user.code) || 'NV-0001';
    phieu.tenNV = (req.user && req.user.name) || 'Thủ thư';
    phieu.ngayMuon = new Date();
    phieu.hanTra = new Date(Date.now() + 14 * 24 * 3600 * 1000);

    await phieu.save();

    return res.json({
      success: true,
      message: `Đã phê duyệt yêu cầu mượn sách thành công! Hạn trả: 14 ngày.`,
      data: phieu
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Thủ thư từ chối mượn
const reject = async (req, res) => {
  try {
    const { id } = req.params;
    let phieu = await PhieuMuon.findOne({ maPM: id });
    if (!phieu && id.match(/^[0-9a-fA-F]{24}$/)) {
      phieu = await PhieuMuon.findById(id);
    }

    if (!phieu) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu mượn!' });
    }

    phieu.trangThaiPM = 'TU_CHOI';
    phieu.maNV = (req.user && req.user.code) || 'NV-0001';
    phieu.tenNV = (req.user && req.user.name) || 'Thủ thư';
    await phieu.save();

    return res.json({
      success: true,
      message: 'Đã từ chối yêu cầu mượn sách!',
      data: phieu
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Thủ thư xác nhận hoàn tất trả sách
const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    let phieu = await PhieuMuon.findOne({ maPM: id });
    if (!phieu && id.match(/^[0-9a-fA-F]{24}$/)) {
      phieu = await PhieuMuon.findById(id);
    }

    if (!phieu) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu mượn!' });
    }

    // Trả lại số lượng tồn kho sách
    for (const item of phieu.chiTiet) {
      await Sach.findOneAndUpdate(
        { maSach: item.maSach },
        { $inc: { soLuong: item.soLuongMuon } }
      );
    }

    phieu.trangThaiPM = 'DA_TRA';
    phieu.ngayTraTT = new Date();
    await phieu.save();

    return res.json({
      success: true,
      message: 'Xác nhận hoàn tất trả sách thành công! Số lượng sách đã được hoàn lại kho.',
      data: phieu
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Độc giả hủy yêu cầu chờ duyệt
const cancel = async (req, res) => {
  try {
    const { id } = req.params;
    let phieu = await PhieuMuon.findOne({ maPM: id });
    if (!phieu && id.match(/^[0-9a-fA-F]{24}$/)) {
      phieu = await PhieuMuon.findById(id);
    }

    if (!phieu) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu mượn!' });
    }

    if (phieu.trangThaiPM !== 'CHO_DUYET') {
      return res.status(400).json({ success: false, message: 'Chỉ có thể hủy phiếu đang ở trạng thái chờ duyệt!' });
    }

    phieu.trangThaiPM = 'DA_HUY';
    await phieu.save();

    return res.json({
      success: true,
      message: 'Đã hủy yêu cầu mượn sách thành công!',
      data: phieu
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAll,
  getMyBorrows,
  create,
  approve,
  reject,
  returnBook,
  cancel
};

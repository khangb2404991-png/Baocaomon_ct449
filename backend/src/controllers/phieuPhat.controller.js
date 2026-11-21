const PhieuPhat = require('../models/phieuPhat.model');
const PhieuMuon = require('../models/phieuMuon.model');

// 1. Lấy toàn bộ phiếu phạt (kèm các thống kê KPI)
const getAll = async (req, res) => {
  try {
    const { trangThaiPP, search, fromDate, toDate } = req.query;
    const query = {};

    if (trangThaiPP && trangThaiPP !== 'ALL') {
      query.trangThaiPP = trangThaiPP;
    }
    if (search && search.trim()) {
      const kw = search.trim();
      query.$or = [
        { tenDocGia: { $regex: kw, $options: 'i' } },
        { emailDocGia: { $regex: kw, $options: 'i' } },
        { 'chiTiet.tenSach': { $regex: kw, $options: 'i' } },
        { 'chiTiet.lyDo': { $regex: kw, $options: 'i' } }
      ];
    }
    if (fromDate || toDate) {
      query.ngayLapPhat = {};
      if (fromDate) query.ngayLapPhat.$gte = new Date(fromDate);
      if (toDate) query.ngayLapPhat.$lte = new Date(toDate + 'T23:59:59.999Z');
    }

    const list = await PhieuPhat.find(query).sort({ createdAt: -1 });

    // Tính toán số liệu thống kê KPI
    const allFines = await PhieuPhat.find();
    const metrics = {
      unpaidCount: allFines.filter(p => p.trangThaiPP === 'CHUA_NOP').length,
      totalCount: allFines.length,
      paidCount: allFines.filter(p => p.trangThaiPP === 'DA_THU').length,
      overdueCount: allFines.filter(p => p.trangThaiPP === 'QUA_HAN').length,
      totalAmount: allFines.reduce((sum, p) => sum + (p.tongTienPhat || 0), 0)
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

// 2. Lấy thông tin chi tiết một phiếu phạt
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    let fine = await PhieuPhat.findOne({ maPP: id });
    if (!fine && id.match(/^[0-9a-fA-F]{24}$/)) {
      fine = await PhieuPhat.findById(id);
    }

    if (!fine) {
      return res.status(404).json({ success: false, message: `Không tìm thấy phiếu phạt với mã: ${id}` });
    }

    return res.json({ success: true, data: fine });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Lập biên bản phiếu phạt mới (Admin)
const create = async (req, res) => {
  try {
    const { maPM, maDG, tenDocGia, emailDocGia, tongTienPhat, ghiChu, chiTiet, trangThaiPP } = req.body;

    if (!maPM || !maDG || !chiTiet || !chiTiet.length) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ: Mã phiếu mượn (maPM), Mã độc giả (maDG) và Danh sách vi phạm (chiTiet)!'
      });
    }

    const count = await PhieuPhat.countDocuments();
    const maPP = req.body.maPP || `PP-${Date.now().toString().slice(-6)}-${String(count + 1).padStart(2, '0')}`;

    const formattedChiTiet = chiTiet.map((item, idx) => ({
      maCTPP: item.maCTPP || `CTPP-${Date.now()}-${idx + 1}`,
      maCTPM: item.maCTPM || '',
      maSach: item.maSach,
      tenSach: item.tenSach || 'Tài liệu vi phạm',
      tienPhat: Number(item.tienPhat) || 0,
      lyDo: item.lyDo || 'Vi phạm quy chế thư viện',
      soNgayTre: Number(item.soNgayTre) || 0,
      ghiChu: item.ghiChu || ''
    }));

    const total = tongTienPhat !== undefined 
      ? Number(tongTienPhat) 
      : formattedChiTiet.reduce((sum, item) => sum + item.tienPhat, 0);

    const newPhieuPhat = new PhieuPhat({
      maPP,
      maPM,
      maDG,
      tenDocGia: tenDocGia || 'Độc giả',
      emailDocGia: emailDocGia || '',
      maNV: (req.user && req.user.code) || req.body.maNV || 'NV-0001',
      tenNV: (req.user && req.user.name) || req.body.tenNV || 'Cán bộ thư viện',
      ngayLapPhat: new Date(),
      trangThaiPP: trangThaiPP || 'CHUA_NOP',
      tongTienPhat: total,
      ghiChu: ghiChu || '',
      chiTiet: formattedChiTiet
    });

    await newPhieuPhat.save();

    return res.status(201).json({
      success: true,
      message: 'Thiết lập biên bản phiếu phạt thành công!',
      data: newPhieuPhat
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Thủ thư xác nhận đã thu tiền phạt tại quầy
const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;
    let fine = await PhieuPhat.findOne({ maPP: id });
    if (!fine && id.match(/^[0-9a-fA-F]{24}$/)) {
      fine = await PhieuPhat.findById(id);
    }

    if (!fine) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu phạt!' });
    }

    fine.trangThaiPP = 'DA_THU';
    fine.ghiChu = (fine.ghiChu ? fine.ghiChu + ' | ' : '') + 'Đã thu tiền mặt tại quầy';
    await fine.save();

    return res.json({
      success: true,
      message: `Đã xác nhận thu thành công ${fine.tongTienPhat.toLocaleString('vi-VN')} VNĐ!`,
      data: fine
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  confirmPayment
};

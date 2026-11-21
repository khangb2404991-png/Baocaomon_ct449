const NhaXuatBan = require('../models/nhaXuatBan.model');
const Sach = require('../models/sach.model');

const getAll = async (req, res) => {
  try {
    const list = await NhaXuatBan.find().sort({ createdAt: -1 });
    return res.json({ success: true, total: list.length, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { maNXB, tenNXB, diaChi } = req.body;
    if (!tenNXB) {
      return res.status(400).json({ success: false, message: 'Tên nhà xuất bản (tenNXB) là bắt buộc!' });
    }

    const count = await NhaXuatBan.countDocuments();
    const finalCode = maNXB || `NXB-${String(count + 1).padStart(2, '0')}`;

    const nxb = new NhaXuatBan({
      maNXB: finalCode,
      tenNXB,
      diaChi: diaChi || ''
    });

    await nxb.save();
    return res.status(201).json({ success: true, message: 'Thêm Nhà xuất bản thành công!', data: nxb });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    let nxb = await NhaXuatBan.findOne({ maNXB: id });
    if (!nxb && id.match(/^[0-9a-fA-F]{24}$/)) {
      nxb = await NhaXuatBan.findById(id);
    }
    if (!nxb) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy Nhà xuất bản!' });
    }

    Object.assign(nxb, req.body);
    await nxb.save();
    return res.json({ success: true, message: 'Cập nhật NXB thành công!', data: nxb });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteNXB = async (req, res) => {
  try {
    const { id } = req.params;
    let nxb = await NhaXuatBan.findOne({ maNXB: id });
    if (!nxb && id.match(/^[0-9a-fA-F]{24}$/)) {
      nxb = await NhaXuatBan.findById(id);
    }
    if (!nxb) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy Nhà xuất bản!' });
    }

    // RÀNG BUỘC: Chặn xóa NXB nếu còn sách thuộc NXB này
    const bookCount = await Sach.countDocuments({ maNXB: nxb.maNXB });
    if (bookCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa NXB "${nxb.tenNXB}" vì còn ${bookCount} cuốn sách thuộc NXB này!`
      });
    }

    await NhaXuatBan.deleteOne({ _id: nxb._id });
    return res.json({ success: true, message: `Đã xóa NXB "${nxb.tenNXB}" thành công!` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAll,
  create,
  update,
  deleteNXB
};

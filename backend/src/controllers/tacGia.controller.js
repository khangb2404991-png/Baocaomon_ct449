const TacGia = require('../models/tacGia.model');
const Sach = require('../models/sach.model');

const getAll = async (req, res) => {
  try {
    const list = await TacGia.find().sort({ createdAt: -1 });
    return res.json({ success: true, total: list.length, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { maTG, tenTG } = req.body;
    if (!tenTG) {
      return res.status(400).json({ success: false, message: 'Tên tác giả (tenTG) là bắt buộc!' });
    }

    const count = await TacGia.countDocuments();
    const finalCode = maTG || `TG-${String(count + 1).padStart(2, '0')}`;

    const tg = new TacGia({
      maTG: finalCode,
      tenTG
    });

    await tg.save();
    return res.status(201).json({ success: true, message: 'Thêm Tác giả thành công!', data: tg });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    let tg = await TacGia.findOne({ maTG: id });
    if (!tg && id.match(/^[0-9a-fA-F]{24}$/)) {
      tg = await TacGia.findById(id);
    }
    if (!tg) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy Tác giả!' });
    }

    Object.assign(tg, req.body);
    await tg.save();
    return res.json({ success: true, message: 'Cập nhật tác giả thành công!', data: tg });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTG = async (req, res) => {
  try {
    const { id } = req.params;
    let tg = await TacGia.findOne({ maTG: id });
    if (!tg && id.match(/^[0-9a-fA-F]{24}$/)) {
      tg = await TacGia.findById(id);
    }
    if (!tg) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy Tác giả!' });
    }

    // RÀNG BUỘC: Chặn xóa Tác giả nếu còn sách liên kết
    const bookCount = await Sach.countDocuments({ maTG: tg.maTG });
    if (bookCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa tác giả "${tg.tenTG}" vì còn ${bookCount} cuốn sách thuộc tác giả này!`
      });
    }

    await TacGia.deleteOne({ _id: tg._id });
    return res.json({ success: true, message: `Đã xóa tác giả "${tg.tenTG}" thành công!` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAll,
  create,
  update,
  deleteTG
};

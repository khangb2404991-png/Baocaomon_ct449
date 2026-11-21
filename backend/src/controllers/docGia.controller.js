const DocGia = require('../models/docGia.model');

const getAll = async (req, res) => {
  try {
    const list = await DocGia.find().select('-matKhauDG').sort({ createdAt: -1 });
    return res.json({ success: true, total: list.length, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const toggleLock = async (req, res) => {
  try {
    const { id } = req.params;
    let docGia = await DocGia.findOne({ maDG: id });
    if (!docGia && id.match(/^[0-9a-fA-F]{24}$/)) {
      docGia = await DocGia.findById(id);
    }

    if (!docGia) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản độc giả!' });
    }

    docGia.trangThaiDG = !docGia.trangThaiDG;
    await docGia.save();

    const statusText = docGia.trangThaiDG ? 'MỞ KHÓA' : 'TẠM KHÓA';
    return res.json({
      success: true,
      message: `Đã ${statusText} tài khoản độc giả "${docGia.tenDG}" thành công!`,
      trangThaiDG: docGia.trangThaiDG
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    let docGia = await DocGia.findOne({ maDG: id });
    if (!docGia && id.match(/^[0-9a-fA-F]{24}$/)) {
      docGia = await DocGia.findById(id);
    }

    if (!docGia) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản độc giả!' });
    }

    // Không cho phép update password trực tiếp qua endpoint này
    delete req.body.matKhauDG;
    Object.assign(docGia, req.body);
    await docGia.save();

    return res.json({
      success: true,
      message: 'Cập nhật hồ sơ độc giả thành công!',
      data: docGia
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAll,
  toggleLock,
  update
};

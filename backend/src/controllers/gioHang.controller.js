const GioHang = require('../models/gioHang.model');
const Sach = require('../models/sach.model');

// Lấy giỏ hàng của độc giả
const getCart = async (req, res) => {
  try {
    const maDG = (req.user && req.user.code) || req.query.maDG;
    if (!maDG) {
      return res.status(400).json({ success: false, message: 'Thiếu mã độc giả (maDG) để truy vấn giỏ hàng!' });
    }

    let cart = await GioHang.findOne({ maDG });
    if (!cart) {
      cart = new GioHang({
        maGH: `GH-${maDG}`,
        maDG,
        tongSoLuong: 0,
        chiTiet: []
      });
      await cart.save();
    }

    return res.json({ success: true, data: cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Thêm sách vào giỏ
const addToCart = async (req, res) => {
  try {
    const maDG = (req.user && req.user.code) || req.body.maDG;
    const { maSach, soLuong = 1 } = req.body;

    if (!maDG || !maSach) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin maDG hoặc maSach!' });
    }

    const book = await Sach.findOne({ maSach });
    if (!book) {
      return res.status(404).json({ success: false, message: `Không tìm thấy sách với mã: ${maSach}` });
    }

    let cart = await GioHang.findOne({ maDG });
    if (!cart) {
      cart = new GioHang({
        maGH: `GH-${maDG}`,
        maDG,
        tongSoLuong: 0,
        chiTiet: []
      });
    }

    // Kiểm tra xem sách đã có trong giỏ chưa
    const existingIndex = cart.chiTiet.findIndex(item => item.maSach === maSach);
    const addQty = Math.max(1, parseInt(soLuong, 10));

    if (existingIndex > -1) {
      const currentQty = cart.chiTiet[existingIndex].soLuong;
      if (currentQty + addQty > book.soLuong) {
        return res.status(400).json({
          success: false,
          message: `Số lượng mượn vượt quá tồn kho (Hiện có: ${book.soLuong} quyển)!`
        });
      }
      cart.chiTiet[existingIndex].soLuong += addQty;
    } else {
      if (addQty > book.soLuong) {
        return res.status(400).json({
          success: false,
          message: `Số lượng mượn vượt quá tồn kho (Hiện có: ${book.soLuong} quyển)!`
        });
      }
      cart.chiTiet.push({
        maCTGH: `CTGH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        maSach: book.maSach,
        soLuong: addQty,
        tenSach: book.tenSach,
        donGia: book.donGia,
        hinhAnh: book.hinhAnh
      });
    }

    cart.tongSoLuong = cart.chiTiet.reduce((sum, item) => sum + item.soLuong, 0);
    await cart.save();

    return res.json({
      success: true,
      message: `Đã thêm sách "${book.tenSach}" vào giỏ mượn thành công!`,
      data: cart
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật số lượng của một sách trong giỏ
const updateCartItem = async (req, res) => {
  try {
    const maDG = (req.user && req.user.code) || req.body.maDG;
    const { maSach, soLuong } = req.body;

    let cart = await GioHang.findOne({ maDG });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Giỏ hàng không tồn tại!' });
    }

    const itemIndex = cart.chiTiet.findIndex(item => item.maSach === maSach);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Sách không có trong giỏ hàng!' });
    }

    const newQty = parseInt(soLuong, 10);
    if (newQty <= 0) {
      cart.chiTiet.splice(itemIndex, 1);
    } else {
      const book = await Sach.findOne({ maSach });
      if (book && newQty > book.soLuong) {
        return res.status(400).json({
          success: false,
          message: `Số lượng mượn vượt quá tồn kho (Hiện có: ${book.soLuong} quyển)!`
        });
      }
      cart.chiTiet[itemIndex].soLuong = newQty;
    }

    cart.tongSoLuong = cart.chiTiet.reduce((sum, item) => sum + item.soLuong, 0);
    await cart.save();

    return res.json({ success: true, message: 'Đã cập nhật giỏ hàng!', data: cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa một sách khỏi giỏ
const removeFromCart = async (req, res) => {
  try {
    const maDG = (req.user && req.user.code) || req.query.maDG;
    const { maSach } = req.params;

    let cart = await GioHang.findOne({ maDG });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Giỏ hàng không tồn tại!' });
    }

    cart.chiTiet = cart.chiTiet.filter(item => item.maSach !== maSach);
    cart.tongSoLuong = cart.chiTiet.reduce((sum, item) => sum + item.soLuong, 0);
    await cart.save();

    return res.json({ success: true, message: 'Đã xóa sách khỏi giỏ mượn!', data: cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa sạch giỏ hàng
const clearCart = async (req, res) => {
  try {
    const maDG = (req.user && req.user.code) || req.body.maDG;
    let cart = await GioHang.findOne({ maDG });
    if (cart) {
      cart.chiTiet = [];
      cart.tongSoLuong = 0;
      await cart.save();
    }
    return res.json({ success: true, message: 'Đã làm trống giỏ hàng!', data: cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};

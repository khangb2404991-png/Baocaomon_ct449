const express = require('express');
const router = express.Router();
const gioHangController = require('../controllers/gioHang.controller');
const { verifyToken } = require('../middlewares/authJwt');

// Cho phép dùng cả khi có token lẫn khi query theo maDG
router.get('/', gioHangController.getCart);
router.post('/add', gioHangController.addToCart);
router.put('/update', gioHangController.updateCartItem);
router.delete('/remove/:maSach', gioHangController.removeFromCart);
router.delete('/clear', gioHangController.clearCart);

module.exports = router;

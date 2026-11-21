const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const sachRoutes = require('./sach.routes');
const nhaXuatBanRoutes = require('./nhaXuatBan.routes');
const tacGiaRoutes = require('./tacGia.routes');
const gioHangRoutes = require('./gioHang.routes');
const phieuMuonRoutes = require('./phieuMuon.routes');
const phieuPhatRoutes = require('./phieuPhat.routes');
const docGiaRoutes = require('./docGia.routes');
const nhanVienRoutes = require('./nhanVien.routes');

router.use('/auth', authRoutes);
router.use('/sach', sachRoutes);
router.use('/nhaxb', nhaXuatBanRoutes);
router.use('/tacgia', tacGiaRoutes);
router.use('/giohang', gioHangRoutes);
router.use('/phieumuon', phieuMuonRoutes);
router.use('/phieuphat', phieuPhatRoutes);
router.use('/docgia', docGiaRoutes);
router.use('/nhanvien', nhanVienRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Book Lending System API Service is running smoothly!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

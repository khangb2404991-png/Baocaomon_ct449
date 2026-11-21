const mongoose = require('mongoose');

// Sub-document schema: CHITIETGIOHANG
const chiTietGioHangSchema = new mongoose.Schema({
  maCTGH: {
    type: String,
    required: true
  },
  maSach: {
    type: String,
    required: true,
    ref: 'Sach'
  },
  soLuong: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  tenSach: {
    type: String,
    default: ''
  },
  donGia: {
    type: Number,
    default: 0
  },
  hinhAnh: {
    type: String,
    default: ''
  }
}, { _id: false });

// Entity schema: GIOHANG (quan hệ 1-1 'so huu' với DOCGIA)
const gioHangSchema = new mongoose.Schema({
  maGH: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  maDG: {
    type: String,
    required: true,
    unique: true,
    ref: 'DocGia',
    index: true
  },
  tongSoLuong: {
    type: Number,
    default: 0
  },
  chiTiet: [chiTietGioHangSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('GioHang', gioHangSchema);

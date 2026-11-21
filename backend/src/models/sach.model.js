const mongoose = require('mongoose');

const sachSchema = new mongoose.Schema({
  maSach: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  tenSach: {
    type: String,
    required: true,
    trim: true
  },
  loai: {
    type: String,
    trim: true,
    default: 'Giáo trình'
  },
  namXB: {
    type: Number,
    default: new Date().getFullYear()
  },
  donGia: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  soLuong: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  trangThaiS: {
    type: Boolean,
    default: true
  },
  maNXB: {
    type: String,
    required: true,
    ref: 'NhaXuatBan',
    index: true
  },
  maTG: {
    type: String,
    required: true,
    ref: 'TacGia',
    index: true
  },
  // Các trường bổ sung phục vụ giao diện
  hinhAnh: {
    type: String,
    default: ''
  },
  moTa: {
    type: String,
    default: ''
  },
  luotMuon: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sach', sachSchema);

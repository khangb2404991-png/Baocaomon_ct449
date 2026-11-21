const mongoose = require('mongoose');

const docGiaSchema = new mongoose.Schema({
  maDG: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  tenDG: {
    type: String,
    required: true,
    trim: true
  },
  ngaySinhDG: {
    type: String,
    trim: true
  },
  emailDG: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  matKhauDG: {
    type: String,
    required: true
  },
  trangThaiDG: {
    type: Boolean,
    default: true
  },
  gioiTinhDG: {
    type: String,
    enum: ['Nam', 'Nữ', 'Khác'],
    default: 'Nam'
  },
  // Các trường bổ sung phục vụ hiển thị
  hoLot: {
    type: String,
    trim: true,
    default: ''
  },
  dienThoai: {
    type: String,
    trim: true,
    default: ''
  },
  diaChi: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true // Tự động quản lý createdAt, updatedAt tương ứng liên kết [cap nhat DG] với thực thể DATE
});

module.exports = mongoose.model('DocGia', docGiaSchema);

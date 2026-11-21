const mongoose = require('mongoose');

const nhanVienSchema = new mongoose.Schema({
  maNV: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  tenNV: {
    type: String,
    required: true,
    trim: true
  },
  ngaySinhNV: {
    type: String,
    trim: true
  },
  emailNV: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  matKhauNV: {
    type: String,
    required: true
  },
  chucVuNV: {
    type: String,
    required: true,
    default: 'Thủ thư'
  },
  gioiTinhNV: {
    type: String,
    enum: ['Nam', 'Nữ', 'Khác'],
    default: 'Nam'
  },
  // Các trường bổ sung phục vụ hiển thị
  soDienThoai: {
    type: String,
    trim: true,
    default: ''
  },
  diaChi: {
    type: String,
    trim: true,
    default: ''
  },
  trangThaiNV: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Tương ứng liên kết [cap nhat NV] với thực thể DATE
});

module.exports = mongoose.model('NhanVien', nhanVienSchema);

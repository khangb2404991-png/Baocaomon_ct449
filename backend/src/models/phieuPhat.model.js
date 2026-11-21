const mongoose = require('mongoose');

// Sub-document schema: CHITIETPHIEUPHAT (liên kết 'phat sinh' từ CHITIETPHIEUMUON)
const chiTietPhieuPhatSchema = new mongoose.Schema({
  maCTPP: {
    type: String,
    required: true
  },
  maCTPM: {
    type: String,
    default: ''
  },
  maSach: {
    type: String,
    required: true,
    ref: 'Sach'
  },
  tenSach: {
    type: String,
    required: true
  },
  tienPhat: {
    type: Number,
    required: true,
    default: 0
  },
  lyDo: {
    type: String,
    required: true
  },
  soNgayTre: {
    type: Number,
    default: 0
  },
  ghiChu: {
    type: String,
    default: ''
  }
}, { _id: false });

// Entity schema: PHIEUPHAT
const phieuPhatSchema = new mongoose.Schema({
  maPP: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  maPM: {
    type: String,
    required: true,
    ref: 'PhieuMuon',
    index: true
  },
  maDG: {
    type: String,
    required: true,
    ref: 'DocGia',
    index: true
  },
  tenDocGia: {
    type: String,
    default: ''
  },
  emailDocGia: {
    type: String,
    default: ''
  },
  maNV: {
    type: String,
    required: true,
    ref: 'NhanVien'
  },
  tenNV: {
    type: String,
    default: ''
  },
  ngayLapPhat: {
    type: Date,
    default: Date.now // Tương ứng liên kết [ngay lap phat] với thực thể DATE
  },
  trangThaiPP: {
    type: String,
    enum: ['CHUA_NOP', 'QUA_HAN', 'DA_THU'],
    default: 'CHUA_NOP',
    index: true
  },
  tongTienPhat: {
    type: Number,
    required: true,
    default: 0
  },
  ghiChu: {
    type: String,
    default: ''
  },
  chiTiet: [chiTietPhieuPhatSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('PhieuPhat', phieuPhatSchema);

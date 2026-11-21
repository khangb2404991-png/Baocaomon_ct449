const mongoose = require('mongoose');

// Sub-document schema: CHITIETPHIEUMUON
const chiTietPhieuMuonSchema = new mongoose.Schema({
  maCTPM: {
    type: String,
    required: true
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
  soLuongMuon: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  thanhTien: {
    type: Number,
    default: 0
  },
  tinhTrangSach: {
    type: String,
    enum: ['BINH_THUONG', 'TRE_HAN', 'HONG_SACH', 'MAT_SACH'],
    default: 'BINH_THUONG'
  }
}, { _id: false });

// Entity schema: PHIEUMUON
const phieuMuonSchema = new mongoose.Schema({
  maPM: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  maDG: {
    type: String,
    required: true,
    ref: 'DocGia',
    index: true
  },
  tenDG: {
    type: String,
    default: ''
  },
  emailDG: {
    type: String,
    default: ''
  },
  maNV: {
    type: String,
    ref: 'NhanVien',
    default: null
  },
  tenNV: {
    type: String,
    default: ''
  },
  ngayMuon: {
    type: Date,
    default: Date.now // Tương ứng liên kết [ngay muon] với thực thể DATE
  },
  hanTra: {
    type: Date,
    required: true
  },
  ngayTraTT: {
    type: Date,
    default: null
  },
  trangThaiPM: {
    type: String,
    enum: ['CHO_DUYET', 'DANG_MUON', 'DA_TRA', 'QUA_HAN', 'TU_CHOI', 'DA_HUY'],
    default: 'CHO_DUYET',
    index: true
  },
  tongTienSach: {
    type: Number,
    default: 0
  },
  chiTiet: [chiTietPhieuMuonSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('PhieuMuon', phieuMuonSchema);

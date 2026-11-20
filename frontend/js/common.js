/**
 * BOOK LENDING SYSTEM - COMMON JAVASCRIPT & SHARED STORE
 * Shared state, mock database, session manager & helper utilities.
 */

import booksData from './books.json';
import accountsData from './accounts.json';

const STORAGE_KEYS = {
  CURRENT_USER: 'bls_current_user',
  CURRENT_STAFF: 'bls_current_staff',
  CART: 'bls_cart',
  BOOKS: 'bls_books',
  BORROW_HISTORY: 'bls_borrow_history',
  READERS: 'bls_readers',
  STAFF_LIST: 'bls_staff_list',
  ACCOUNTS: 'bls_accounts',
  FINES: 'bls_fines'
};

// Helper: Normalize book properties to support both camelCase and lowercase
export function normalizeBook(b) {
  if (!b) return null;
  const id = b.maSach || b.masach || '';
  const title = b.tenSach || b.tensach || '';
  const author = b.tacGia || b.tacgia || '';
  const publisher = b.nhaXuatBan || b.nhaxuatban || '';
  const publisherCode = b.maNXB || b.manxb || 'NXB-01';
  const year = b.namXuatBan || b.namxuatban || 2024;
  const price = b.donGia !== undefined ? b.donGia : (b.dongia || 100000);
  const qty = b.soQuyen !== undefined ? b.soQuyen : (b.soquyen !== undefined ? b.soquyen : 5);
  const genre = b.theLoai || b.theloai || 'Khoa Học Máy Tính';
  const image = b.hinhAnh || b.hinhanh || '';
  const desc = b.moTa || b.mota || '';
  const status = b.trangThai !== undefined ? b.trangThai : (b.trangthai !== undefined ? b.trangthai : 1);
  const borrows = b.luotMuon !== undefined ? b.luotMuon : (b.luotmuon || 0);

  return {
    ...b,
    maSach: id,
    masach: id,
    tenSach: title,
    tensach: title,
    tacGia: author,
    tacgia: author,
    maNXB: publisherCode,
    manxb: publisherCode,
    nhaXuatBan: publisher,
    nhaxuatban: publisher,
    namXuatBan: year,
    namxuatban: year,
    donGia: price,
    dongia: price,
    soQuyen: qty,
    soquyen: qty,
    theLoai: genre,
    theloai: genre,
    hinhAnh: image,
    hinhanh: image,
    moTa: desc,
    mota: desc,
    trangThai: status,
    trangthai: status,
    luotMuon: borrows,
    luotmuon: borrows
  };
}

// Initial Sample Data (Seeded from 40 books in books.json)
const INITIAL_BOOKS = booksData.map(normalizeBook);

const INITIAL_CART = [
  {
    maSach: 'CS-0102',
    masach: 'CS-0102',
    tenSach: 'Thiết Kế Hệ Thống Phân Tán Quy Mô Lớn',
    tensach: 'Thiết Kế Hệ Thống Phân Tán Quy Mô Lớn',
    tacGia: 'Alex Xu',
    tacgia: 'Alex Xu',
    soLuong: 1,
    soluong: 1,
    khoCon: 6,
    soQuyen: 6,
    ngayThem: '2024-05-20',
    donGia: 240000,
    dongia: 240000,
    theLoai: 'Khoa Học Máy Tính',
    hinhAnh: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA3mI7md6yPHsCm3-bBSuP8XoKLHVOpxVSV6F1ld9AwCa6Hob6y7xv1kaCCs1utv3vHdISrD_rZhQYWTe4A6tgwHjV9GGNrxLeuJc2iSFpi7ZZv2gQn8IdIrAhNSqSJpJ8OBDY7Bizu2dq6LphMMIYzAF-NYPIOZwubpSGF4Ezv5AK52Oh3GBwphCMfP_6hlNFFNcsLfll8fV99WJY5b7r1oLVMon_1BCEkOPY6uU',
    hinhanh: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA3mI7md6yPHsCm3-bBSuP8XoKLHVOpxVSV6F1ld9AwCa6Hob6y7xv1kaCCs1utv3vHdISrD_rZhQYWTe4A6tgwHjV9GGNrxLeuJc2iSFpi7ZZv2gQn8IdIrAhNSqSJpJ8OBDY7Bizu2dq6LphMMIYzAF-NYPIOZwubpSGF4Ezv5AK52Oh3GBwphCMfP_6hlNFFNcsLfll8fV99WJY5b7r1oLVMon_1BCEkOPY6uU',
    badgeText: 'DISTRIB SYS',
    version: 'v2.4',
    badgeColor: '#1c69d4'
  },
  {
    maSach: 'CS-0205',
    masach: 'CS-0205',
    tenSach: 'Cấu Trúc Dữ Liệu & Giải Thuật Thực Chiến',
    tensach: 'Cấu Trúc Dữ Liệu & Giải Thuật Thực Chiến',
    tacGia: 'Robert C. Martin',
    tacgia: 'Robert C. Martin',
    soLuong: 1,
    soluong: 1,
    khoCon: 4,
    soQuyen: 4,
    ngayThem: '2024-05-21',
    donGia: 195000,
    dongia: 195000,
    theLoai: 'Khoa Học Máy Tính',
    hinhAnh: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEV1Z0jB7zK-gO9r7Z13U59w83K4lYgE4uW-4u97K9V-0j499B7Z13U59w83K4lYgE4uW-4u97K9V-0j499B7Z13U59w83K4lYgE4uW-4u97K9V-0j499B7Z13U59w83K4lYgE4uW-4u97K9V-0j499B7Z13U59w83K4lYgE4uW-4u97K9V-0j499B7Z13U59w83K4lYgE4uW-4u97K9V-0j499B7Z13U59w',
    hinhanh: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEV1Z0jB7zK-gO9r7Z13U59w83K4lYgE4uW-4u97K9V-0j499B7Z13U59w83K4lYgE4uW-4u97K9V-0j499B7Z13U59w83K4lYgE4uW-4u97K9V-0j499B7Z13U59w83K4lYgE4uW-4u97K9V-0j499B7Z13U59w83K4lYgE4uW-4u97K9V-0j499B7Z13U59w',
    badgeText: 'DATA STRUCT',
    version: 'v1.1',
    badgeColor: '#0066b1'
  },
  {
    maSach: 'SEC-0089',
    masach: 'SEC-0089',
    tenSach: 'An Toàn Thông Tin & Mạng Máy Tính',
    tensach: 'An Toàn Thông Tin & Mạng Máy Tính',
    tacGia: 'Vũ Quốc Đạt',
    tacgia: 'Vũ Quốc Đạt',
    soLuong: 1,
    soluong: 1,
    khoCon: 8,
    soQuyen: 8,
    ngayThem: '2024-05-22',
    donGia: 175000,
    dongia: 175000,
    theLoai: 'An Toàn Thông Tin',
    hinhAnh: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3MpoRa8vonRP0ObwAZVtIbO_JypMw-L6cOs0r74bzyQACVYj6TdOKtdJX-P9BX_HKTJVAaS2kOcr6UX6UkqZZMWnSC-LPqj3uXZKldHbxbK0Cbbg94jgyz6n85uxjx_Mzr4bPUmEdhIV7mHVLvT2AkTNkDL_3obzTgHRNgVApGBc3b323Kv7bXe6itvEWTWsP6Gp69lUHNFblGoeDq_iuFHlggY6d6zhLTaMe7-4',
    hinhanh: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3MpoRa8vonRP0ObwAZVtIbO_JypMw-L6cOs0r74bzyQACVYj6TdOKtdJX-P9BX_HKTJVAaS2kOcr6UX6UkqZZMWnSC-LPqj3uXZKldHbxbK0Cbbg94jgyz6n85uxjx_Mzr4bPUmEdhIV7mHVLvT2AkTNkDL_3obzTgHRNgVApGBc3b323Kv7bXe6itvEWTWsP6Gp69lUHNFblGoeDq_iuFHlggY6d6zhLTaMe7-4',
    badgeText: 'CYBER SEC',
    version: 'v3.0',
    badgeColor: '#e22718'
  }
];

const INITIAL_READERS = [
  {
    madocgia: 'DG-0842',
    holot: 'Nguyễn Văn',
    ten: 'An',
    ngaysinh: '14/03/2001',
    phai: 'Nam',
    dienthoai: '0912.483.991',
    email: 'an.nguyen92@outlook.com',
    diachi: '128 Đường 3/2, Ninh Kiều, Cần Thơ',
    status: 'active'
  },
  {
    madocgia: 'DG-0103',
    holot: 'Lê Thị',
    ten: 'Mai',
    ngaysinh: '28/08/1998',
    phai: 'Nữ',
    dienthoai: '0988.120.344',
    email: 'mai.lethi@gmail.com',
    diachi: 'Số 45 Trần Hưng Đạo, Hà Nội',
    status: 'active'
  },
  {
    madocgia: 'DG-0551',
    holot: 'Trần',
    ten: 'Hoàng Nam',
    ngaysinh: '05/11/1995',
    phai: 'Nam',
    dienthoai: '0903.654.789',
    email: 'nam.tranhoang@domain.vn',
    diachi: '89 Lý Tự Trọng, Quận 1, TP.HCM',
    status: 'locked'
  },
  {
    madocgia: 'DG-0914',
    holot: 'Phạm Quốc',
    ten: 'Bảo',
    ngaysinh: '22/01/2003',
    phai: 'Nam',
    dienthoai: '0971.884.223',
    email: 'baopham.tech@vnu.edu.vn',
    diachi: 'KĐT ĐHQG, Dĩ An, Bình Dương',
    status: 'active'
  }
];

const INITIAL_STAFF = [
  {
    msnv: 'MSNV-0042',
    hoten: 'Trần Minh Quang',
    hoTenNV: 'Trần Minh Quang',
    chucvu: 'Admin',
    chucVu: 'Admin',
    phone: '0901.889.001',
    soDienThoai: '0901.889.001',
    address: 'Thủ Đức, TP.HCM',
    diaChi: 'Thủ Đức, TP.HCM',
    status: 1,
    trangThai: 1
  },
  {
    msnv: 'MSNV-0012',
    hoten: 'Nguyễn Thùy Linh',
    hoTenNV: 'Nguyễn Thùy Linh',
    chucvu: 'ThuThu',
    chucVu: 'ThuThu',
    phone: '0918.232.115',
    soDienThoai: '0918.232.115',
    address: 'Quận 1, TP.HCM',
    diaChi: 'Quận 1, TP.HCM',
    status: 1,
    trangThai: 1
  },
  {
    msnv: 'MSNV-0089',
    hoten: 'Vũ Tiến Dũng',
    hoTenNV: 'Vũ Tiến Dũng',
    chucvu: 'ThuThu',
    chucVu: 'ThuThu',
    phone: '0973.551.492',
    soDienThoai: '0973.551.492',
    address: 'Bình Thạnh, TP.HCM',
    diaChi: 'Bình Thạnh, TP.HCM',
    status: 1,
    trangThai: 1
  },
  {
    msnv: 'MSNV-0004',
    hoten: 'Đặng Thu Thảo',
    hoTenNV: 'Đặng Thu Thảo',
    chucvu: 'ThuThu',
    chucVu: 'ThuThu',
    phone: '0932.110.887',
    soDienThoai: '0932.110.887',
    address: 'Hải Châu, Đà Nẵng',
    diaChi: 'Hải Châu, Đà Nẵng',
    status: 0,
    trangThai: 0
  }
];

const INITIAL_BORROW = [
  {
    maPhieuMuon: 'PM-8821',
    slipId: 'PM-8821',
    readerName: 'Nguyễn Văn An',
    tenDocGia: 'Nguyễn Văn An',
    readerPhone: '0912 345 678',
    sdt: '0912 345 678',
    readerId: 'DG-0842',
    maDocGia: 'DG-0842',
    bookTitle: 'Thiết Kế Hệ Thống Phân Tán Quy Mô Lớn',
    bookCode: 'CS-0102',
    qty: 1,
    tongSoLuong: 1,
    tongGiaTri: 240000,
    borrowDate: '24/05/2024',
    ngayMuon: '2024-05-24',
    dueDate: '07/06/2024',
    ngayTra: '2024-06-07',
    returnDate: null,
    staffName: 'Trần Văn B',
    nvPhuTrach: 'Trần Văn B',
    staffCode: 'MSNV-0012',
    msnv: 'MSNV-0012',
    status: 'pending',
    trangThai: 'CHO_DUYET',
    items: [
      {
        maSach: 'CS-0102',
        tenSach: 'Thiết Kế Hệ Thống Phân Tán Quy Mô Lớn',
        tacGia: 'Alex Xu',
        hinhAnh: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA3mI7md6yPHsCm3-bBSuP8XoKLHVOpxVSV6F1ld9AwCa6Hob6y7xv1kaCCs1utv3vHdISrD_rZhQYWTe4A6tgwHjV9GGNrxLeuJc2iSFpi7ZZv2gQn8IdIrAhNSqSJpJ8OBDY7Bizu2dq6LphMMIYzAF-NYPIOZwubpSGF4Ezv5AK52Oh3GBwphCMfP_6hlNFFNcsLfll8fV99WJY5b7r1oLVMon_1BCEkOPY6uU',
        soLuong: 1,
        donGia: 240000
      }
    ]
  },
  {
    maPhieuMuon: 'PM-8819',
    slipId: 'PM-8819',
    readerName: 'Lê Thị Bích',
    tenDocGia: 'Lê Thị Bích',
    readerPhone: '0988 123 456',
    sdt: '0988 123 456',
    readerId: 'DG-0103',
    maDocGia: 'DG-0103',
    bookTitle: 'An Toàn Thông Tin & Mạng Máy Tính',
    bookCode: 'SEC-0089',
    qty: 2,
    tongSoLuong: 2,
    tongGiaTri: 350000,
    borrowDate: '24/05/2024',
    ngayMuon: '2024-05-24',
    dueDate: '07/06/2024',
    ngayTra: '2024-06-07',
    returnDate: null,
    staffName: '---',
    nvPhuTrach: '---',
    staffCode: '---',
    msnv: '---',
    status: 'pending',
    trangThai: 'CHO_DUYET',
    items: [
      {
        maSach: 'SEC-0089',
        tenSach: 'An Toàn Thông Tin & Mạng Máy Tính',
        tacGia: 'Vũ Quốc Đạt',
        hinhAnh: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3MpoRa8vonRP0ObwAZVtIbO_JypMw-L6cOs0r74bzyQACVYj6TdOKtdJX-P9BX_HKTJVAaS2kOcr6UX6UkqZZMWnSC-LPqj3uXZKldHbxbK0Cbbg94jgyz6n85uxjx_Mzr4bPUmEdhIV7mHVLvT2AkTNkDL_3obzTgHRNgVApGBc3b323Kv7bXe6itvEWTWsP6Gp69lUHNFblGoeDq_iuFHlggY6d6zhLTaMe7-4',
        soLuong: 2,
        donGia: 175000
      }
    ]
  },
  {
    maPhieuMuon: 'PM-8790',
    slipId: 'PM-8790',
    readerName: 'Nguyễn Văn An',
    tenDocGia: 'Nguyễn Văn An',
    readerPhone: '0912 345 678',
    sdt: '0912 345 678',
    readerId: 'DG-0842',
    maDocGia: 'DG-0842',
    bookTitle: 'Cấu Trúc Dữ Liệu & Giải Thuật Thực Chiến',
    bookCode: 'CS-0205',
    qty: 1,
    tongSoLuong: 1,
    tongGiaTri: 195000,
    borrowDate: '18/05/2024',
    ngayMuon: '2024-05-18',
    dueDate: '01/06/2024',
    ngayTra: '2024-06-01',
    returnDate: null,
    staffName: 'Trần Văn B',
    nvPhuTrach: 'Trần Văn B',
    staffCode: 'MSNV-0012',
    msnv: 'MSNV-0012',
    status: 'borrowing',
    trangThai: 'DANG_MUON',
    items: [
      {
        maSach: 'CS-0205',
        tenSach: 'Cấu Trúc Dữ Liệu & Giải Thuật Thực Chiến',
        tacGia: 'Robert C. Martin',
        hinhAnh: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEV1Z0jB7zK-gO9r7Z13U59w83K4lYgE4uW-4u97K9V-0j499B7Z13U59w83K4lYgE4uW-4u97K9V-0j499B7Z13U59w83K4lYgE4uW-4u97K9V-0j499B7Z13U59w83K4lYgE4uW-4u97K9V-0j499B7Z13U59w',
        soLuong: 1,
        donGia: 195000
      }
    ]
  },
  {
    maPhieuMuon: 'PM-8650',
    slipId: 'PM-8650',
    readerName: 'Phạm Hoàng Nam',
    tenDocGia: 'Phạm Hoàng Nam',
    readerPhone: '0934 567 890',
    sdt: '0934 567 890',
    readerId: 'DG-0551',
    maDocGia: 'DG-0551',
    bookTitle: 'Trí Tuệ Nhân Tạo & Deep Learning Nâng Cao',
    bookCode: 'AI-0512',
    qty: 1,
    tongSoLuong: 1,
    tongGiaTri: 320000,
    borrowDate: '05/05/2024',
    ngayMuon: '2024-05-05',
    dueDate: '19/05/2024',
    ngayTra: '2024-05-19',
    returnDate: null,
    staffName: 'Nguyễn Thùy Linh',
    nvPhuTrach: 'Nguyễn Thùy Linh',
    staffCode: 'MSNV-0089',
    msnv: 'MSNV-0089',
    status: 'overdue',
    trangThai: 'QUA_HAN',
    items: [
      {
        maSach: 'AI-0512',
        tenSach: 'Trí Tuệ Nhân Tạo & Deep Learning Nâng Cao',
        tacGia: 'Ian Goodfellow',
        hinhAnh: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCngChpuUdtps-cHOlWwK_u6FmE9wRPrMmzUeQF1SlzWqpFRYIfZPtK1x-A5vywxkBBflMv7liufH1k2HjnN5Osp-qN4rKvVxTJAWwnH-5GlV2zzb9NXjUHHhao1nje6zZk2HWRRgGfhpIPtp4BMBJcXtv5XngBfCikB7LtsAatoMu9Fxk2_zOJroKkaPNYHao_SNUnHZNu2LChLFFB2aKhUqFfVBxG-h1duk5f_6g',
        soLuong: 1,
        donGia: 320000
      }
    ]
  },
  {
    maPhieuMuon: 'PM-8511',
    slipId: 'PM-8511',
    readerName: 'Nguyễn Văn An',
    tenDocGia: 'Nguyễn Văn An',
    readerPhone: '0912 345 678',
    sdt: '0912 345 678',
    readerId: 'DG-0842',
    maDocGia: 'DG-0842',
    bookTitle: 'Trí Tuệ Nhân Tạo & Deep Learning Nâng Cao',
    bookCode: 'AI-0512',
    qty: 2,
    tongSoLuong: 2,
    tongGiaTri: 640000,
    borrowDate: '01/04/2024',
    ngayMuon: '2024-04-01',
    dueDate: '14/04/2024',
    ngayTra: '2024-04-14',
    returnDate: '12/04/2024',
    staffName: 'Trần Văn B',
    nvPhuTrach: 'Trần Văn B',
    staffCode: 'MSNV-0012',
    msnv: 'MSNV-0012',
    status: 'returned',
    trangThai: 'DA_TRA',
    items: [
      {
        maSach: 'AI-0512',
        tenSach: 'Trí Tuệ Nhân Tạo & Deep Learning Nâng Cao',
        tacGia: 'Ian Goodfellow',
        hinhAnh: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCngChpuUdtps-cHOlWwK_u6FmE9wRPrMmzUeQF1SlzWqpFRYIfZPtK1x-A5vywxkBBflMv7liufH1k2HjnN5Osp-qN4rKvVxTJAWwnH-5GlV2zzb9NXjUHHhao1nje6zZk2HWRRgGfhpIPtp4BMBJcXtv5XngBfCikB7LtsAatoMu9Fxk2_zOJroKkaPNYHao_SNUnHZNu2LChLFFB2aKhUqFfVBxG-h1duk5f_6g',
        soLuong: 2,
        donGia: 320000
      }
    ]
  }
];

export const INITIAL_FINES = [
  {
    maPhieuPhat: 'PP-0001',
    maPhieuMuon: 'PM-8790',
    tenDocGia: 'Nguyễn Văn An',
    emailDocGia: 'an.nguyen@email.com',
    sdtDocGia: '0912 345 678',
    ngayMuon: '2024-05-18',
    ngayTra: '2024-06-01',
    ngayLap: '2026-11-20',
    ngayLapFormatted: '20/11/2026 (14:35:10)',
    tenNV: 'Trần Minh Quân',
    trangThai: 'CHUA_NOP',
    ghiChu: 'Độc giả mang sách trả trễ hạn. Sách "Kỹ thuật lập trình hệ thống C/C++" bị rách bìa trước mép ngoài 12cm.',
    soLuongViPham: 2,
    tienPhatTre: 30000,
    tienPhatHong: 45000,
    tongTienPhat: 75000,
    chiTiet: [
      {
        maSach: 'CS-0205',
        tenSach: 'Hệ điều hành & Kiến trúc máy tính',
        lyDo: 'TRẢ QUÁ HẠN (06 NGÀY x 5.000 VNĐ/NGÀY)',
        loaiViPham: 'late',
        tienPhat: 30000,
        ghiChu: 'Định mức: 5.000 VNĐ / ngày trễ'
      },
      {
        maSach: 'BK-CNTT-0812',
        tenSach: 'Kỹ thuật lập trình hệ thống C/C++',
        lyDo: 'LÀM HỎNG TRANG BÌA (30% GIÁ TRỊ SÁCH)',
        loaiViPham: 'damage',
        tienPhat: 45000,
        ghiChu: 'Biên bản thẩm định trang bìa rách 12cm'
      }
    ]
  }
];

// Centralized Storage Service
export const LibraryStore = {
  get(key, defaultValue) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('LocalStorage error:', e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  },

  getBooks() {
    const raw = this.get(STORAGE_KEYS.BOOKS, null);
    if (!raw || !Array.isArray(raw) || raw.length < INITIAL_BOOKS.length) {
      this.saveBooks(INITIAL_BOOKS);
      return INITIAL_BOOKS;
    }
    return raw.map(normalizeBook);
  },

  saveBooks(books) {
    this.set(STORAGE_KEYS.BOOKS, books);
  },

  getCart() {
    const raw = this.get(STORAGE_KEYS.CART, INITIAL_CART);
    const allBooks = this.getBooks();
    return (raw || []).map(item => {
      const id = item.maSach || item.masach;
      const matched = allBooks.find(b => (b.maSach || b.masach) === id);
      const hinh = item.hinhAnh || item.hinhanh || (matched ? (matched.hinhAnh || matched.hinhanh) : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA3mI7md6yPHsCm3-bBSuP8XoKLHVOpxVSV6F1ld9AwCa6Hob6y7xv1kaCCs1utv3vHdISrD_rZhQYWTe4A6tgwHjV9GGNrxLeuJc2iSFpi7ZZv2gQn8IdIrAhNSqSJpJ8OBDY7Bizu2dq6LphMMIYzAF-NYPIOZwubpSGF4Ezv5AK52Oh3GBwphCMfP_6hlNFFNcsLfll8fV99WJY5b7r1oLVMon_1BCEkOPY6uU');
      return {
        ...item,
        maSach: id,
        masach: id,
        tenSach: item.tenSach || item.tensach || (matched ? matched.tenSach : ''),
        tensach: item.tenSach || item.tensach || (matched ? matched.tenSach : ''),
        tacGia: item.tacGia || item.tacgia || (matched ? matched.tacGia : ''),
        tacgia: item.tacGia || item.tacgia || (matched ? matched.tacGia : ''),
        soLuong: item.soLuong !== undefined ? item.soLuong : (item.soluong || 1),
        soluong: item.soluong !== undefined ? item.soluong : (item.soLuong || 1),
        khoCon: item.khoCon !== undefined ? item.khoCon : (item.soQuyen !== undefined ? item.soQuyen : (matched ? matched.soQuyen : 5)),
        soQuyen: item.soQuyen !== undefined ? item.soQuyen : (item.khoCon !== undefined ? item.khoCon : (matched ? matched.soQuyen : 5)),
        soquyen: item.soquyen !== undefined ? item.soquyen : (item.khoCon !== undefined ? item.khoCon : (matched ? matched.soQuyen : 5)),
        donGia: item.donGia !== undefined ? item.donGia : (item.dongia !== undefined ? item.dongia : (matched ? matched.donGia : 100000)),
        dongia: item.dongia !== undefined ? item.dongia : (item.donGia !== undefined ? item.donGia : (matched ? matched.donGia : 100000)),
        theLoai: item.theLoai || item.theloai || (matched ? matched.theLoai : 'Khoa Học Máy Tính'),
        hinhAnh: hinh,
        hinhanh: hinh
      };
    });
  },

  saveCart(cart) {
    this.set(STORAGE_KEYS.CART, cart);
  },

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.soLuong || item.soluong || 1), 0);
  },

  addToCart(book, quantity = 1) {
    if (!book) return { success: false, message: 'Dữ liệu sách không hợp lệ' };
    const cart = this.getCart();
    const id = book.maSach || book.masach;
    const existing = cart.find(item => (item.maSach || item.masach) === id);
    const maxStock = book.soQuyen !== undefined ? book.soQuyen : (book.soquyen !== undefined ? book.soquyen : 5);
    const qty = Math.max(1, parseInt(quantity) || 1);

    if (existing) {
      const cur = existing.soLuong || existing.soluong || 1;
      if (cur + qty > maxStock && maxStock > 0) {
        return { success: false, message: `Kho chỉ còn tối đa ${maxStock} quyển (bạn đã có ${cur} quyển trong giỏ)!` };
      }
      existing.soLuong = cur + qty;
      existing.soluong = existing.soLuong;
    } else {
      if (qty > maxStock && maxStock > 0) {
        return { success: false, message: `Kho chỉ còn tối đa ${maxStock} quyển!` };
      }
      cart.push({
        maSach: id,
        masach: id,
        tenSach: book.tenSach || book.tensach,
        tensach: book.tenSach || book.tensach,
        tacGia: book.tacGia || book.tacgia,
        tacgia: book.tacGia || book.tacgia,
        soLuong: qty,
        soluong: qty,
        khoCon: maxStock,
        soQuyen: maxStock,
        soquyen: maxStock,
        ngayThem: new Date().toISOString().split('T')[0],
        donGia: book.donGia !== undefined ? book.donGia : (book.dongia || 100000),
        dongia: book.dongia !== undefined ? book.dongia : (book.donGia || 100000),
        theLoai: book.theLoai || book.theloai || 'Khoa Học Máy Tính',
        hinhAnh: book.hinhAnh || book.hinhanh || '',
        badgeText: (book.theLoai || book.theloai || 'TECH').substring(0, 8).toUpperCase(),
        version: 'v1.0',
        badgeColor: '#1c69d4'
      });
    }
    this.saveCart(cart);
    const newCount = this.getCartCount();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: newCount } }));
      const badge = document.getElementById('header-cart-badge');
      if (badge) {
        badge.textContent = String(newCount).padStart(2, '0');
      }
    }
    return { success: true, count: newCount, cart };
  },

  removeFromCart(bookId) {
    let cart = this.getCart();
    cart = cart.filter(item => (item.maSach || item.masach) !== bookId);
    this.saveCart(cart);
    const newCount = this.getCartCount();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: newCount } }));
      const badge = document.getElementById('header-cart-badge');
      if (badge) {
        badge.textContent = String(newCount).padStart(2, '0');
      }
    }
    return { success: true, count: newCount, cart };
  },

  clearCart() {
    this.saveCart([]);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: 0 } }));
      const badge = document.getElementById('header-cart-badge');
      if (badge) {
        badge.textContent = '00';
      }
    }
    return { success: true, count: 0, cart: [] };
  },

  getBorrowHistory() {
    const raw = this.get(STORAGE_KEYS.BORROW_HISTORY, INITIAL_BORROW);
    if (!raw || !Array.isArray(raw)) return INITIAL_BORROW;
    return raw.map(r => {
      let trangThai = r.trangThai;
      if (!trangThai) {
        if (r.status === 'pending') trangThai = 'CHO_DUYET';
        else if (r.status === 'borrowing') trangThai = 'DANG_MUON';
        else if (r.status === 'returned') trangThai = 'DA_TRA';
        else if (r.status === 'overdue') trangThai = 'QUA_HAN';
        else if (r.status === 'cancelled') trangThai = 'DA_HUY';
        else trangThai = 'CHO_DUYET';
      }
      let items = r.items;
      if (!items || !items.length) {
        items = [{
          maSach: r.bookCode || 'CS-0102',
          tenSach: r.bookTitle || 'Thiết Kế Hệ Thống Phân Tán Quy Mô Lớn',
          tacGia: r.tacGia || 'Alex Xu',
          hinhAnh: r.hinhAnh || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA3mI7md6yPHsCm3-bBSuP8XoKLHVOpxVSV6F1ld9AwCa6Hob6y7xv1kaCCs1utv3vHdISrD_rZhQYWTe4A6tgwHjV9GGNrxLeuJc2iSFpi7ZZv2gQn8IdIrAhNSqSJpJ8OBDY7Bizu2dq6LphMMIYzAF-NYPIOZwubpSGF4Ezv5AK52Oh3GBwphCMfP_6hlNFFNcsLfll8fV99WJY5b7r1oLVMon_1BCEkOPY6uU',
          soLuong: r.qty || 1,
          donGia: r.donGia || 240000
        }];
      }
      return {
        ...r,
        maPhieuMuon: r.maPhieuMuon || r.slipId || 'PM-0001',
        slipId: r.maPhieuMuon || r.slipId || 'PM-0001',
        tenDocGia: r.tenDocGia || r.readerName || 'Nguyễn Văn An',
        readerName: r.tenDocGia || r.readerName || 'Nguyễn Văn An',
        maDocGia: r.maDocGia || r.readerId || 'DG-0842',
        readerId: r.maDocGia || r.readerId || 'DG-0842',
        sdt: r.sdt || r.readerPhone || '0912 345 678',
        readerPhone: r.sdt || r.readerPhone || '0912 345 678',
        ngayMuon: r.ngayMuon || r.borrowDate || '2024-05-24',
        borrowDate: r.ngayMuon || r.borrowDate || '2024-05-24',
        ngayTra: r.ngayTra || r.dueDate || '2024-06-07',
        dueDate: r.ngayTra || r.dueDate || '2024-06-07',
        trangThai,
        status: r.status || (trangThai === 'CHO_DUYET' ? 'pending' : (trangThai === 'DANG_MUON' ? 'borrowing' : (trangThai === 'DA_TRA' ? 'returned' : 'pending'))),
        tongSoLuong: r.tongSoLuong !== undefined ? r.tongSoLuong : (r.qty || items.reduce((s, i) => s + (i.soLuong || 1), 0)),
        qty: r.tongSoLuong !== undefined ? r.tongSoLuong : (r.qty || 1),
        tongGiaTri: r.tongGiaTri !== undefined ? r.tongGiaTri : items.reduce((s, i) => s + ((i.donGia || 0) * (i.soLuong || 1)), 0),
        items
      };
    });
  },

  saveBorrowHistory(history) {
    this.set(STORAGE_KEYS.BORROW_HISTORY, history);
  },

  getBorrowRecords() {
    return this.getBorrowHistory();
  },

  saveBorrowRecords(records) {
    this.saveBorrowHistory(records);
  },

  createBorrowRecord(data) {
    const records = this.getBorrowRecords();
    const count = records.length + 1;
    const pad = String(count).padStart(4, '0');
    const maPhieuMuon = data.maPhieuMuon || `PM-${pad}`;

    const items = (data.items || []).map(i => ({
      maSach: i.maSach || i.masach || '',
      tenSach: i.tenSach || i.tensach || 'Tài liệu mượn',
      tacGia: i.tacGia || i.tacgia || '',
      hinhAnh: i.hinhAnh || i.hinhanh || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA3mI7md6yPHsCm3-bBSuP8XoKLHVOpxVSV6F1ld9AwCa6Hob6y7xv1kaCCs1utv3vHdISrD_rZhQYWTe4A6tgwHjV9GGNrxLeuJc2iSFpi7ZZv2gQn8IdIrAhNSqSJpJ8OBDY7Bizu2dq6LphMMIYzAF-NYPIOZwubpSGF4Ezv5AK52Oh3GBwphCMfP_6hlNFFNcsLfll8fV99WJY5b7r1oLVMon_1BCEkOPY6uU',
      soLuong: i.soLuong || i.soluong || 1,
      donGia: i.donGia || i.dongia || 0
    }));

    const totalQty = data.tongSoLuong || (items.length ? items.reduce((s, i) => s + (i.soLuong || 1), 0) : 1);
    const totalVal = data.tongGiaTri || items.reduce((s, i) => s + ((i.donGia || 0) * (i.soLuong || 1)), 0);

    const record = {
      maPhieuMuon,
      slipId: maPhieuMuon,
      maDocGia: data.maDocGia || 'DG-0842',
      readerId: data.maDocGia || 'DG-0842',
      tenDocGia: data.tenDocGia || 'Nguyễn Văn An',
      readerName: data.tenDocGia || 'Nguyễn Văn An',
      sdt: data.sdt || data.dienThoai || '0912 345 678',
      readerPhone: data.sdt || data.dienThoai || '0912 345 678',
      ngayMuon: data.ngayMuon || this.formatDate(new Date()),
      borrowDate: data.ngayMuon || this.formatDate(new Date()),
      ngayTra: data.ngayTra || this.formatDate(new Date(Date.now() + 14 * 86400000)),
      dueDate: data.ngayTra || this.formatDate(new Date(Date.now() + 14 * 86400000)),
      tongSoLuong: totalQty,
      qty: totalQty,
      tongGiaTri: totalVal,
      trangThai: 'CHO_DUYET',
      status: 'pending',
      items,
      bookTitle: items[0] ? items[0].tenSach : '',
      bookCode: items[0] ? items[0].maSach : '',
      nvPhuTrach: 'Trần Văn B',
      canBoTiepNhan: 'CB-104 (Trần Minh Thắng)',
      viTriKho: 'Kho Kỹ Thuật Máy Tính - Tầng 2, Dãy B4',
      ghiChu: 'Đăng ký trực tuyến qua hệ thống thư viện. Chờ thủ thư xét duyệt.'
    };

    records.unshift(record);
    this.saveBorrowRecords(records);
    return record;
  },

  updateBorrowStatus(maPhieuMuon, newStatus) {
    const list = this.getBorrowRecords();
    const idx = list.findIndex(r => r.maPhieuMuon === maPhieuMuon || r.slipId === maPhieuMuon);
    if (idx !== -1) {
      list[idx].trangThai = newStatus;
      if (newStatus === 'CHO_DUYET') list[idx].status = 'pending';
      if (newStatus === 'DANG_MUON') list[idx].status = 'borrowing';
      if (newStatus === 'DA_TRA') list[idx].status = 'returned';
      if (newStatus === 'QUA_HAN') list[idx].status = 'overdue';
      if (newStatus === 'DA_HUY') list[idx].status = 'cancelled';
      this.saveBorrowRecords(list);
      return { success: true };
    }
    return { success: false, message: 'Không tìm thấy phiếu mượn' };
  },

  formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return String(dateStr);
    }
  },

  getReaders() {
    return this.get(STORAGE_KEYS.READERS, INITIAL_READERS);
  },

  saveReaders(readers) {
    this.set(STORAGE_KEYS.READERS, readers);
  },

  getStaff() {
    const list = this.get(STORAGE_KEYS.STAFF_LIST, INITIAL_STAFF);
    if (!Array.isArray(list)) return [];
    return list.map(s => ({
      ...s,
      msnv: s.msnv || '',
      hoten: s.hoten || s.hoTenNV || '',
      hoTenNV: s.hoTenNV || s.hoten || '',
      chucvu: s.chucvu || s.chucVu || 'ThuThu',
      chucVu: s.chucVu || s.chucvu || 'ThuThu',
      phone: s.phone || s.soDienThoai || '',
      soDienThoai: s.soDienThoai || s.phone || '',
      address: s.address || s.diaChi || '',
      diaChi: s.diaChi || s.address || '',
      status: s.status !== undefined ? s.status : (s.trangThai !== undefined ? s.trangThai : 1),
      trangThai: s.trangThai !== undefined ? s.trangThai : (s.status !== undefined ? s.status : 1)
    }));
  },

  saveStaff(staff) {
    this.set(STORAGE_KEYS.STAFF_LIST, staff);
  },

  getFines() {
    return this.get(STORAGE_KEYS.FINES, INITIAL_FINES);
  },

  saveFines(fines) {
    this.set(STORAGE_KEYS.FINES, fines);
  },

  createFine(fineData) {
    const fines = this.getFines();
    const count = fines.length + 1;
    const pad = String(count).padStart(4, '0');
    const newFine = {
      maPhieuPhat: fineData.maPhieuPhat || `PP-${pad}`,
      ...fineData,
      ngayLap: fineData.ngayLap || new Date().toISOString()
    };
    fines.unshift(newFine);
    this.saveFines(fines);
    return { success: true, fine: newFine };
  },

  getCurrentUser() {
    return this.get(STORAGE_KEYS.CURRENT_USER, {
      id: 'DG-0842',
      name: 'Nguyễn Văn An',
      holot: 'Nguyễn Văn',
      ten: 'An',
      ngaysinh: '15/08/1998',
      phai: 'Nam',
      email: 'nguyenvanan.dev@gmail.com',
      dienthoai: '0912 345 678',
      diachi: 'Số 1 Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội',
      role: 'DOCGIA'
    });
  },

  setCurrentUser(user) {
    this.set(STORAGE_KEYS.CURRENT_USER, user);
  },

  getCurrentStaff() {
    return this.get(STORAGE_KEYS.CURRENT_STAFF, {
      msnv: 'MSNV-0042',
      name: 'Trần Minh Quang',
      title: 'THỦ THƯ TRƯỞNG',
      role: 'Admin'
    });
  },

  setCurrentStaff(staff) {
    this.set(STORAGE_KEYS.CURRENT_STAFF, staff);
  },

  formatCurrency(value) {
    if (typeof value !== 'number') value = Number(value) || 0;
    return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
  },

  showPopup(options) {
    return showPopup(options);
  },

  showConfirm(options) {
    return showConfirm(options);
  },

  showToast(message, type = 'info') {
    return showPopup({
      message: message,
      type: type,
      confirmText: 'ĐÃ HIỂU'
    });
  },

  getAccounts() {
    return this.get(STORAGE_KEYS.ACCOUNTS, accountsData);
  },

  saveAccounts(accounts) {
    this.set(STORAGE_KEYS.ACCOUNTS, accounts);
  },

  registerReader(formData) {
    const hoTen = (formData.hoTen || formData.hoten || `${formData.holot || ''} ${formData.ten || ''}`).trim();
    const password = String(formData.password || '').trim();
    const dienthoai = String(formData.dienthoai || formData.phone || formData.dienThoai || '').trim();
    const phai = formData.phai || 'Nam';
    const email = String(formData.email || '').trim();
    const diachi = String(formData.diachi || formData.diaChi || '').trim();
    const ngaysinh = formData.ngaysinh || formData.ngaySinh || '';

    // Yêu cầu bắt buộc: họ tên, password, số điện thoại
    if (!hoTen) {
      return { success: false, message: 'Vui lòng nhập Họ và Tên!' };
    }
    if (!password) {
      return { success: false, message: 'Vui lòng nhập Mật khẩu!' };
    }
    if (!dienthoai) {
      return { success: false, message: 'Vui lòng nhập Số điện thoại!' };
    }

    const accounts = this.getAccounts();

    // Kiểm tra trùng số điện thoại
    const cleanPhone = dienthoai.replace(/\s+/g, '');
    const existingPhone = accounts.find(a => 
      (a.phone && a.phone.replace(/\s+/g, '') === cleanPhone) ||
      (a.dienThoai && a.dienThoai.replace(/\s+/g, '') === cleanPhone)
    );
    if (existingPhone) {
      return { success: false, message: `Số điện thoại ${dienthoai} đã được sử dụng để đăng ký tài khoản!` };
    }

    if (email) {
      const existingEmail = accounts.find(a => a.email && a.email.toLowerCase() === email.toLowerCase());
      if (existingEmail) {
        return { success: false, message: `Địa chỉ email ${email} đã được đăng ký trên hệ thống!` };
      }
    }

    // Tách hoTen thành hoLot và ten để tương thích các bảng dữ liệu
    const parts = hoTen.split(/\s+/);
    let ten = '';
    let hoLot = '';
    if (parts.length > 1) {
      ten = parts.pop();
      hoLot = parts.join(' ');
    } else {
      ten = hoTen;
      hoLot = '';
    }

    // Tự động sinh mã độc giả
    const autoNum = Math.floor(1000 + Math.random() * 9000);
    const maDocGia = `DG-${autoNum}`;
    const nextAccId = `ACC-${String(accounts.length + 1).padStart(3, '0')}`;

    // Lưu tài khoản trực tiếp (KHÔNG BĂM MẬT KHẨU)
    const newAccount = {
      id: nextAccId,
      username: dienthoai, // Cho phép đăng nhập bằng số điện thoại hoặc mã độc giả
      email: email,
      phone: dienthoai,
      dienThoai: dienthoai,
      password: password, // Mật khẩu lưu dạng plain-text không băm
      role: 'user',
      roleName: 'Độc giả',
      maDocGia: maDocGia,
      hoLot: hoLot,
      ten: ten,
      hoTen: hoTen,
      ngaySinh: ngaysinh,
      phai: phai,
      diaChi: diachi,
      ngayTao: new Date().toISOString().split('T')[0],
      trangThai: 'active'
    };

    // Lưu vào danh mục tài khoản
    accounts.push(newAccount);
    this.saveAccounts(accounts);

    // Đồng bộ thêm vào danh mục độc giả để thủ thư quản lý
    const readers = this.getReaders();
    readers.unshift({
      madocgia: maDocGia,
      maDocGia: maDocGia,
      holot: hoLot,
      ten: ten,
      hoTen: hoTen,
      ngaysinh: ngaysinh,
      phai: phai,
      dienthoai: dienthoai,
      email: email,
      diachi: diachi,
      trangthai: 'HOAT_DONG',
      trangThai: 'HOAT_DONG'
    });
    this.saveReaders(readers);

    return {
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      account: newAccount,
      reader: newAccount
    };
  },

  authenticate(identifier, password) {
    if (!identifier || !password) {
      return { success: false, message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!' };
    }
    const accounts = this.getAccounts();
    const cleanId = String(identifier).trim().toLowerCase();
    const cleanIdNoSpace = cleanId.replace(/\s+/g, '');
    const cleanPass = String(password).trim();

    const account = accounts.find(acc => {
      const matchUsername = (acc.username || '').toLowerCase() === cleanId;
      const matchEmail = (acc.email || '').toLowerCase() === cleanId;
      const matchPhone = (acc.phone || '').replace(/\s+/g, '').toLowerCase() === cleanIdNoSpace ||
                         (acc.dienThoai || '').replace(/\s+/g, '').toLowerCase() === cleanIdNoSpace;
      const matchDocGia = (acc.maDocGia || '').toLowerCase() === cleanId;
      const matchMsnv = (acc.msnv || '').toLowerCase() === cleanId;
      return matchUsername || matchEmail || matchPhone || matchDocGia || matchMsnv;
    });

    if (!account) {
      return { success: false, message: 'Tài khoản không tồn tại trên hệ thống!' };
    }

    if (String(account.password) !== cleanPass) {
      return { success: false, message: 'Mật khẩu không chính xác!' };
    }

    if (account.role === 'admin') {
      const staffInfo = {
        msnv: account.msnv || 'MSNV-0042',
        name: account.hoTen || 'Trần Minh Quang',
        title: account.chucVu || 'THỦ THƯ TRƯỞNG',
        role: 'Admin',
        email: account.email,
        phone: account.phone
      };
      this.setCurrentStaff(staffInfo);
      this.setCurrentUser({
        ...account,
        name: account.hoTen,
        role: 'ADMIN'
      });
      return { success: true, role: 'admin', user: account, staff: staffInfo, redirect: '/admin/books' };
    } else {
      const userInfo = {
        id: account.maDocGia || 'DG-0842',
        maDocGia: account.maDocGia || 'DG-0842',
        name: account.hoTen || `${account.hoLot} ${account.ten}`,
        hoTen: account.hoTen || `${account.hoLot} ${account.ten}`,
        hoLot: account.hoLot || 'Nguyễn Văn',
        ten: account.ten || 'An',
        email: account.email,
        dienThoai: account.dienThoai || account.phone,
        diaChi: account.diaChi,
        ngaySinh: account.ngaySinh,
        phai: account.phai,
        role: 'DOCGIA'
      };
      this.setCurrentUser(userInfo);
      return { success: true, role: 'user', user: userInfo, redirect: '/home' };
    }
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_STAFF);
    window.location.href = '#/login';
  }
};

/**
 * Global In-App Popup Modal System
 * Replaces system alerts/confirms with modern dark-theme modals matching Stitch AI design
 */
export function showPopup(options, secondaryType = 'info') {
  if (typeof options === 'string') {
    options = { message: options, type: secondaryType };
  } else if (!options || typeof options !== 'object') {
    options = { message: String(options || '') };
  }

  const {
    title,
    message = '',
    type = 'info', // 'success' | 'warning' | 'error' | 'info' | 'danger'
    icon,
    confirmText = 'ĐỒNG Ý',
    cancelText = 'HỦY BỎ',
    showCancel = false,
    autoClose = 0,
    actions = null,
    onConfirm,
    onCancel
  } = options;

  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve(true);
      return;
    }

    // Clean up any existing popup modal
    const existing = document.getElementById('global-app-popup');
    if (existing) {
      existing.remove();
    }

    // Determine default Title, Icon, and Color based on notification type
    let defaultTitle = 'THÔNG BÁO HỆ THỐNG';
    let defaultIcon = 'info';
    let iconColor = 'text-[#1c69d4]';

    if (type === 'success') {
      defaultTitle = 'THÔNG BÁO THÀNH CÔNG';
      defaultIcon = 'check_circle';
      iconColor = 'text-[#0fa336]';
    } else if (type === 'warning') {
      defaultTitle = 'CẢNH BÁO';
      defaultIcon = 'warning';
      iconColor = 'text-[#f4b400]';
    } else if (type === 'error' || type === 'danger') {
      defaultTitle = 'THÔNG BÁO LỖI';
      defaultIcon = 'error';
      iconColor = 'text-[#e22718]';
    }

    const finalTitle = title || defaultTitle;
    const finalIcon = icon || defaultIcon;

    // Create backdrop wrapper
    const backdrop = document.createElement('div');
    backdrop.id = 'global-app-popup';
    backdrop.className = 'app-popup-backdrop';

    backdrop.innerHTML = `
      <div class="app-popup-container" role="dialog" aria-modal="true">
        <div class="app-popup-stripe">
          <div class="w-[16px] h-full bg-[#0066b1]"></div>
          <div class="w-[16px] h-full bg-[#1c69d4]"></div>
          <div class="w-[16px] h-full bg-[#e22718]"></div>
        </div>

        <div class="app-popup-header">
          <div class="app-popup-title">
            <span class="material-symbols-outlined text-[20px] ${iconColor}">${finalIcon}</span>
            <span>${finalTitle}</span>
          </div>
          <button type="button" class="app-popup-close" aria-label="Đóng" id="app-popup-btn-close">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div class="app-popup-body">
          ${message}
        </div>

        <div class="app-popup-footer" id="app-popup-actions-slot"></div>
      </div>
    `;

    document.body.appendChild(backdrop);

    // Trigger opening animation
    requestAnimationFrame(() => {
      backdrop.classList.add('active');
    });

    let autoCloseTimer = null;

    const close = (result = false) => {
      if (autoCloseTimer) clearTimeout(autoCloseTimer);
      backdrop.classList.remove('active');
      setTimeout(() => {
        backdrop.remove();
        resolve(result);
      }, 200);
    };

    // Close button event
    const closeBtn = backdrop.querySelector('#app-popup-btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (onCancel) onCancel();
        close(false);
      });
    }

    // Populate action buttons
    const actionsSlot = backdrop.querySelector('#app-popup-actions-slot');

    if (Array.isArray(actions) && actions.length > 0) {
      actions.forEach(act => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `app-popup-btn ${act.class || 'app-popup-btn-secondary'}`;
        if (act.icon) {
          btn.innerHTML = `<span class="material-symbols-outlined text-[16px]">${act.icon}</span><span>${act.text}</span>`;
        } else {
          btn.textContent = act.text;
        }
        btn.addEventListener('click', () => {
          if (typeof act.onClick === 'function') {
            act.onClick(close);
          } else {
            close(true);
          }
        });
        actionsSlot.appendChild(btn);
      });
    } else {
      if (showCancel) {
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'app-popup-btn app-popup-btn-secondary';
        cancelBtn.textContent = cancelText;
        cancelBtn.addEventListener('click', () => {
          if (onCancel) onCancel();
          close(false);
        });
        actionsSlot.appendChild(cancelBtn);
      }

      const confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      const isDanger = type === 'danger' || type === 'error';
      confirmBtn.className = `app-popup-btn ${isDanger ? 'app-popup-btn-danger' : 'app-popup-btn-primary'}`;
      confirmBtn.textContent = confirmText;
      confirmBtn.addEventListener('click', () => {
        if (onConfirm) onConfirm();
        close(true);
      });
      actionsSlot.appendChild(confirmBtn);

      // Focus confirm button for keyboard navigation
      setTimeout(() => {
        try { confirmBtn.focus(); } catch (e) {}
      }, 60);
    }

    // Click outside backdrop to close
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        if (onCancel) onCancel();
        close(false);
      }
    });

    // ESC key closes popup
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        window.removeEventListener('keydown', handleKeydown);
        if (onCancel) onCancel();
        close(false);
      }
    };
    window.addEventListener('keydown', handleKeydown);

    // Auto-close if timer specified
    if (autoClose > 0) {
      autoCloseTimer = setTimeout(() => {
        close(true);
      }, autoClose);
    }
  });
}

/**
 * Global Confirm Dialog Popup
 * Returns Promise<boolean> - true if confirmed, false if cancelled
 */
export function showConfirm(options) {
  if (typeof options === 'string') {
    options = { message: options };
  } else if (!options || typeof options !== 'object') {
    options = { message: String(options || '') };
  }

  return showPopup({
    title: options.title || 'XÁC NHẬN THAO TÁC',
    message: options.message,
    type: options.type || 'warning',
    confirmText: options.confirmText || 'XÁC NHẬN',
    cancelText: options.cancelText || 'HỦY BỎ',
    showCancel: true,
    icon: options.icon || (options.type === 'danger' ? 'warning' : 'help'),
    onConfirm: options.onConfirm,
    onCancel: options.onCancel
  });
}

// Global helper for toast notifications - mapped directly to in-app popup
export function showToast(message, type = 'info') {
  return showPopup({
    message: message,
    type: type,
    confirmText: 'ĐÃ HIỂU'
  });
}

// Bind to window for global access across components and intercept system alert
if (typeof window !== 'undefined') {
  window.LibraryStore = LibraryStore;
  window.showToast = showToast;
  window.showPopup = showPopup;
  window.showConfirm = showConfirm;

  // Intercept window.alert so no browser system alerts appear
  window.alert = function(msg) {
    showPopup({
      title: 'THÔNG BÁO HỆ THỐNG',
      message: msg,
      type: 'info'
    });
  };
}

export { STORAGE_KEYS, INITIAL_BOOKS };
export default LibraryStore;




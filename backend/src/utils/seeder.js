const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const DocGia = require('../models/docGia.model');
const NhanVien = require('../models/nhanVien.model');
const NhaXuatBan = require('../models/nhaXuatBan.model');
const TacGia = require('../models/tacGia.model');
const Sach = require('../models/sach.model');
const GioHang = require('../models/gioHang.model');
const PhieuMuon = require('../models/phieuMuon.model');
const PhieuPhat = require('../models/phieuPhat.model');

const seedData = async () => {
  try {
    console.log('[Seeder]: Kiểm tra dữ liệu khởi tạo trong MongoDB...');

    // 1. Seed Nhà Xuất Bản
    const nxbCount = await NhaXuatBan.countDocuments();
    if (nxbCount === 0) {
      console.log('[Seeder]: Đang nạp danh mục Nhà xuất bản...');
      const defaultNXBs = [
        { maNXB: 'NXB-01', tenNXB: 'NXB Bách Khoa Hà Nội', diaChi: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội' },
        { maNXB: 'NXB-02', tenNXB: 'NXB Thông Tin & Truyền Thông', diaChi: '115 Trần Duy Hưng, Cầu Giấy, Hà Nội' },
        { maNXB: 'NXB-03', tenNXB: 'NXB Trẻ', diaChi: '161B Lý Chính Thắng, Quận 3, TP. Hồ Chí Minh' },
        { maNXB: 'NXB-04', tenNXB: 'NXB Đại Học Quốc Gia', diaChi: '16 Hàng Chuối, Hai Bà Trưng, Hà Nội' }
      ];
      await NhaXuatBan.insertMany(defaultNXBs);
    }

    // 2. Seed Tác Giả
    const tgCount = await TacGia.countDocuments();
    if (tgCount === 0) {
      console.log('[Seeder]: Đang nạp danh mục Tác giả...');
      const defaultTGs = [
        { maTG: 'TG-01', tenTG: 'Alex Xu' },
        { maTG: 'TG-02', tenTG: 'Robert C. Martin' },
        { maTG: 'TG-03', tenTG: 'Vũ Quốc Đạt' },
        { maTG: 'TG-04', tenTG: 'Ian Goodfellow' },
        { maTG: 'TG-05', tenTG: 'Trần Văn Cường' },
        { maTG: 'TG-06', tenTG: 'Andrew Ng' },
        { maTG: 'TG-07', tenTG: 'TS. Lê Văn Thắng' }
      ];
      await TacGia.insertMany(defaultTGs);
    }

    // 3. Seed Sách
    const sachCount = await Sach.countDocuments();
    if (sachCount === 0) {
      console.log('[Seeder]: Đang nạp danh mục Sách từ books.json...');
      const booksPath = path.resolve(__dirname, '../../../frontend/js/books.json');
      let booksData = [];
      if (fs.existsSync(booksPath)) {
        booksData = JSON.parse(fs.readFileSync(booksPath, 'utf8'));
      }

      if (booksData.length > 0) {
        const formattedBooks = booksData.map((b, idx) => ({
          maSach: b.maSach || `CS-${String(idx + 1).padStart(4, '0')}`,
          tenSach: b.tenSach,
          loai: b.theLoai || 'Khoa Học Máy Tính',
          namXB: b.namXuatBan || 2023,
          donGia: b.donGia || 100000,
          soLuong: b.soQuyen !== undefined ? b.soQuyen : 5,
          trangThaiS: b.trangThai !== undefined ? Boolean(b.trangThai) : true,
          maNXB: b.maNXB || 'NXB-01',
          maTG: `TG-0${(idx % 7) + 1}`,
          hinhAnh: b.hinhAnh || '',
          moTa: b.moTa || '',
          luotMuon: b.luotMuon || 0
        }));
        await Sach.insertMany(formattedBooks);
      }
    }

    // 4. Seed Cán bộ Nhân viên / Thủ thư
    const nvCount = await NhanVien.countDocuments();
    if (nvCount === 0) {
      console.log('[Seeder]: Đang nạp tài khoản Cán bộ thư viện mẫu...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      const defaultNVs = [
        {
          maNV: 'NV-0001',
          tenNV: 'Trần Minh Quang',
          emailNV: 'admin@email.com',
          matKhauNV: hashedPassword,
          chucVuNV: 'Thủ thư trưởng',
          ngaySinhNV: '12/04/1988',
          gioiTinhNV: 'Nam',
          soDienThoai: '0912 345 678',
          diaChi: 'Cần Thơ',
          trangThaiNV: true
        },
        {
          maNV: 'NV-0012',
          tenNV: 'Trần Văn B',
          emailNV: 'tranvanb@email.com',
          matKhauNV: hashedPassword,
          chucVuNV: 'Thủ thư',
          ngaySinhNV: '15/09/1992',
          gioiTinhNV: 'Nam',
          soDienThoai: '0988 123 456',
          diaChi: 'Cần Thơ',
          trangThaiNV: true
        },
        {
          maNV: 'NV-0089',
          tenNV: 'Nguyễn Thùy Linh',
          emailNV: 'thuylinh@email.com',
          matKhauNV: hashedPassword,
          chucVuNV: 'Thủ thư',
          ngaySinhNV: '20/11/1995',
          gioiTinhNV: 'Nữ',
          soDienThoai: '0977 456 789',
          diaChi: 'Cần Thơ',
          trangThaiNV: true
        }
      ];
      await NhanVien.insertMany(defaultNVs);
    }

    // 5. Seed Độc giả
    const dgCount = await DocGia.countDocuments();
    if (dgCount === 0) {
      console.log('[Seeder]: Đang nạp tài khoản Độc giả mẫu...');
      const salt = await bcrypt.genSalt(10);
      const userPassword = await bcrypt.hash('123456', salt);

      const defaultDGs = [
        {
          maDG: 'DG-0001',
          tenDG: 'Nguyễn Văn An',
          hoLot: 'Nguyễn Văn',
          emailDG: 'user@email.com',
          matKhauDG: userPassword,
          ngaySinhDG: '15/08/1998',
          gioiTinhDG: 'Nam',
          dienThoai: '0912 345 678',
          diaChi: 'Số 1 Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội',
          trangThaiDG: true
        },
        {
          maDG: 'DG-0002',
          tenDG: 'Lê Hoàng Long',
          hoLot: 'Lê Hoàng',
          emailDG: 'long.le@email.com',
          matKhauDG: userPassword,
          ngaySinhDG: '10/02/2000',
          gioiTinhDG: 'Nam',
          dienThoai: '0988 777 666',
          diaChi: 'Ninh Kiều, Cần Thơ',
          trangThaiDG: true
        },
        {
          maDG: 'DG-0003',
          tenDG: 'Phạm Hoàng Nam',
          hoLot: 'Phạm Hoàng',
          emailDG: 'nam.pham@email.com',
          matKhauDG: userPassword,
          ngaySinhDG: '05/06/1999',
          gioiTinhDG: 'Nam',
          dienThoai: '0911 222 333',
          diaChi: 'Bình Thủy, Cần Thơ',
          trangThaiDG: true
        }
      ];
      await DocGia.insertMany(defaultDGs);

      // Khởi tạo giỏ hàng cho mỗi độc giả
      for (const dg of defaultDGs) {
        await GioHang.create({
          maGH: `GH-${dg.maDG}`,
          maDG: dg.maDG,
          tongSoLuong: 0,
          chiTiet: []
        });
      }
    }

    // 6. Seed Phiếu mượn mẫu
    const pmCount = await PhieuMuon.countDocuments();
    if (pmCount === 0) {
      console.log('[Seeder]: Đang nạp danh sách Phiếu mượn mẫu...');
      const defaultPMs = [
        {
          maPM: 'PM-20261105-012',
          maDG: 'DG-0001',
          tenDG: 'Nguyễn Văn An',
          emailDG: 'user@email.com',
          maNV: 'NV-0012',
          tenNV: 'Trần Văn B',
          ngayMuon: new Date('2026-11-05'),
          hanTra: new Date('2026-11-19'),
          trangThaiPM: 'DANG_MUON',
          tongTienSach: 240000,
          chiTiet: [
            {
              maCTPM: 'CTPM-001',
              maSach: 'CS-0102',
              tenSach: 'Thiết Kế Hệ Thống Phân Tán Quy Mô Lớn',
              soLuongMuon: 1,
              thanhTien: 240000,
              tinhTrangSach: 'BINH_THUONG'
            }
          ]
        },
        {
          maPM: 'PM-20261110-045',
          maDG: 'DG-0002',
          tenDG: 'Lê Hoàng Long',
          emailDG: 'long.le@email.com',
          ngayMuon: new Date('2026-11-10'),
          hanTra: new Date('2026-11-24'),
          trangThaiPM: 'CHO_DUYET',
          tongTienSach: 130000,
          chiTiet: [
            {
              maCTPM: 'CTPM-002',
              maSach: 'CS-0205',
              tenSach: 'Cấu Trúc Dữ Liệu & Giải Thuật Thực Chiến',
              soLuongMuon: 1,
              thanhTien: 130000,
              tinhTrangSach: 'BINH_THUONG'
            }
          ]
        }
      ];
      await PhieuMuon.insertMany(defaultPMs);
    }

    // 7. Seed Phiếu phạt mẫu
    const ppCount = await PhieuPhat.countDocuments();
    if (ppCount === 0) {
      console.log('[Seeder]: Đang nạp danh sách Phiếu phạt mẫu...');
      const defaultPPs = [
        {
          maPP: 'PP-20261125-0089',
          maPM: 'PM-20261105-012',
          maDG: 'DG-0001',
          tenDocGia: 'Nguyễn Văn An',
          emailDocGia: 'user@email.com',
          maNV: 'NV-0012',
          tenNV: 'Trần Văn B',
          ngayLapPhat: new Date('2026-11-25T09:30:00'),
          trangThaiPP: 'CHUA_NOP',
          tongTienPhat: 75000,
          ghiChu: 'Trả trễ 06 ngày, rách bìa trước mép ngoài.',
          chiTiet: [
            {
              maCTPP: 'CTPP-001',
              maCTPM: 'CTPM-001',
              maSach: 'CS-0102',
              tenSach: 'Thiết Kế Hệ Thống Phân Tán Quy Mô Lớn',
              tienPhat: 30000,
              lyDo: 'Trả trễ 06 ngày (5.000 VNĐ / ngày)',
              soNgayTre: 6,
              ghiChu: 'Trễ hạn 06 ngày'
            },
            {
              maCTPP: 'CTPP-002',
              maCTPM: 'CTPM-001',
              maSach: 'CS-0102',
              tenSach: 'Thiết Kế Hệ Thống Phân Tán Quy Mô Lớn',
              tienPhat: 45000,
              lyDo: 'Rách bìa trước mép ngoài (bồi thường phục hồi)',
              soNgayTre: 0,
              ghiChu: 'Bìa rách 10cm'
            }
          ]
        }
      ];
      await PhieuPhat.insertMany(defaultPPs);
    }

    console.log('[Seeder]: Quá trình nạp dữ liệu ban đầu hoàn tất xuất sắc!');
  } catch (error) {
    console.error('[Seeder Error]:', error);
  }
};

module.exports = seedData;

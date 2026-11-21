// frontend/js/profile.js
// User Profile & Borrow History Component Logic connected to MEVN Backend API

import { authApi, phieuMuonApi, docGiaApi } from './api.js';
import { LibraryStore, showToast, showPopup, showConfirm } from './common.js';
import { getHeader, getFooter } from './components.js';

export default {
  name: 'ProfileView',
  data() {
    return {
      form: {
        maDG: 'DG-0001',
        maDocGia: 'DG-0001',
        hoLot: 'Nguyễn Văn',
        ten: 'An',
        ngaySinh: '1998-08-15',
        phai: 'Nam',
        email: 'user@email.com',
        dienThoai: '0912 345 678',
        diaChi: 'Số 1 Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội',
        newPassword: ''
      },
      activeStatusFilter: 'ALL',
      currentPage: 1,
      pageSize: 6,
      borrowRecords: [],
      cartCount: LibraryStore.getCartCount()
    };
  },
  created() {
    this.loadData();
  },
  mounted() {
    window.addEventListener('cart-updated', (e) => {
      this.cartCount = e.detail && e.detail.count !== undefined ? e.detail.count : LibraryStore.getCartCount();
    });
  },
  computed: {
    headerHtml() {
      return getHeader('profile', { cartCount: this.cartCount });
    },
    footerHtml() {
      return getFooter();
    },
    counts() {
      const all = this.borrowRecords.length;
      const choDuyet = this.borrowRecords.filter(r => r.trangThai === 'CHO_DUYET').length;
      const dangMuon = this.borrowRecords.filter(r => r.trangThai === 'DANG_MUON').length;
      const daTra = this.borrowRecords.filter(r => r.trangThai === 'DA_TRA').length;
      const daHuy = this.borrowRecords.filter(r => r.trangThai === 'DA_HUY' || r.trangThai === 'QUA_HAN' || r.trangThai === 'TU_CHOI').length;
      const dangGiu = this.borrowRecords
        .filter(r => r.trangThai === 'DANG_MUON')
        .reduce((sum, r) => sum + (r.tongSoLuong || 1), 0);

      return { all, choDuyet, dangMuon, daTra, daHuy, dangGiu };
    },
    filteredRecords() {
      if (this.activeStatusFilter === 'ALL') {
        return this.borrowRecords;
      }
      return this.borrowRecords.filter(r => r.trangThai === this.activeStatusFilter);
    },
    totalPages() {
      return Math.ceil(this.filteredRecords.length / this.pageSize) || 1;
    },
    paginatedRecords() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredRecords.slice(start, start + this.pageSize);
    }
  },
  methods: {
    getHeader,
    getFooter,
    async loadData() {
      // 1. Tải hồ sơ người dùng
      try {
        const profileRes = await authApi.getProfile();
        if (profileRes && profileRes.data) {
          const u = profileRes.data;
          const fullName = u.tenDG || u.name || '';
          const parts = fullName.split(' ');
          const ten = parts.length > 1 ? parts.pop() : fullName;
          const hoLot = parts.join(' ');

          this.form = {
            ...this.form,
            maDG: u.maDG || 'DG-0001',
            maDocGia: u.maDG || 'DG-0001',
            hoLot: u.hoLot || hoLot || 'Nguyễn Văn',
            ten: ten || 'An',
            email: u.emailDG || u.email || '',
            dienThoai: u.dienThoai || '',
            diaChi: u.diaChi || '',
            ngaySinh: u.ngaySinhDG || '',
            phai: u.gioiTinhDG || 'Nam',
            newPassword: ''
          };
        }
      } catch (e) {
        const user = LibraryStore.getCurrentUser();
        if (user) {
          this.form = {
            ...this.form,
            ...user,
            hoLot: user.hoLot || 'Nguyễn Văn',
            ten: user.ten || 'An',
            newPassword: ''
          };
        }
      }

      // 2. Tải lịch sử phiếu mượn
      try {
        const borrowsRes = await phieuMuonApi.getMyBorrows();
        if (borrowsRes && borrowsRes.data) {
          this.borrowRecords = borrowsRes.data.map(b => {
            const items = (b.chiTiet || []).map(i => ({
              tenSach: i.tenSach || 'Tài liệu mượn',
              soLuong: i.soLuongMuon || 1,
              donGia: i.thanhTien ? Math.round(i.thanhTien / (i.soLuongMuon || 1)) : 0
            }));
            const totalQty = items.reduce((s, it) => s + (it.soLuong || 1), 0);

            return {
              maPhieuMuon: b.maPM,
              slipId: b.maPM,
              ngayMuon: b.ngayMuon ? new Date(b.ngayMuon).toLocaleDateString('vi-VN') : '',
              ngayTra: b.hanTra ? new Date(b.hanTra).toLocaleDateString('vi-VN') : '',
              trangThai: b.trangThaiPM,
              tongSoLuong: totalQty,
              tongGiaTri: b.tongTienSach || 0,
              items
            };
          });
          return;
        }
      } catch (e) {
        console.warn('API getMyBorrows error, using local fallback:', e.message);
      }

      this.borrowRecords = LibraryStore.getBorrowRecords();
    },
    async handleUpdateProfile() {
      const hoTen = `${this.form.hoLot} ${this.form.ten}`.trim();
      try {
        await docGiaApi.update(this.form.maDG, {
          tenDG: hoTen,
          hoLot: this.form.hoLot,
          dienThoai: this.form.dienThoai,
          diaChi: this.form.diaChi,
          ngaySinhDG: this.form.ngaySinh,
          gioiTinhDG: this.form.phai
        });

        // Cập nhật local storage
        const cur = JSON.parse(localStorage.getItem('user') || '{}');
        cur.tenDG = hoTen;
        cur.dienThoai = this.form.dienThoai;
        cur.diaChi = this.form.diaChi;
        localStorage.setItem('user', JSON.stringify(cur));

        showPopup({
          title: 'CẬP NHẬT HỒ SƠ THÀNH CÔNG',
          message: 'Dữ liệu hồ sơ độc giả của bạn đã được lưu thành công trên hệ thống!',
          type: 'success',
          icon: 'badge',
          confirmText: 'ĐỒNG Ý'
        });
      } catch (e) {
        showPopup({
          title: 'CẬP NHẬT THẤT BẠI',
          message: e.message || 'Không thể lưu hồ sơ!',
          type: 'error',
          confirmText: 'THỬ LẠI'
        });
      }
    },
    async handleLogout() {
      const confirmed = await showConfirm({
        title: 'XÁC NHẬN ĐĂNG XUẤT',
        message: 'Bạn có chắc chắn muốn kết thúc phiên làm việc và đăng xuất khỏi hệ thống Thư Viện?',
        type: 'danger',
        icon: 'logout',
        confirmText: 'ĐĂNG XUẤT',
        cancelText: 'HỦY BỎ'
      });

      if (confirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        LibraryStore.logout();
      }
    },
    setStatusFilter(status) {
      this.activeStatusFilter = status;
      this.currentPage = 1;
    },
    async cancelBorrowRequest(maPhieuMuon) {
      const confirmed = await showConfirm({
        title: 'XÁC NHẬN HỦY PHIẾU MƯỢN',
        message: 'Bạn có chắc chắn muốn hủy yêu cầu mượn tài liệu này?',
        type: 'danger',
        icon: 'cancel',
        confirmText: 'XÁC NHẬN HỦY',
        cancelText: 'QUAY LẠI'
      });

      if (confirmed) {
        try {
          await phieuMuonApi.cancel(maPhieuMuon);
          showPopup({
            title: 'ĐÃ HỦY PHIẾU MƯỢN',
            message: 'Yêu cầu mượn tài liệu đã được hủy thành công.',
            type: 'info',
            confirmText: 'ĐÃ HIỂU'
          });
          this.loadData();
        } catch (e) {
          showPopup({
            title: 'HỦY THẤT BẠI',
            message: e.message || 'Không thể hủy phiếu mượn này!',
            type: 'error',
            confirmText: 'ĐÃ HIỂU'
          });
        }
      }
    },
    goToPage(p) {
      if (p >= 1 && p <= this.totalPages) {
        this.currentPage = p;
      }
    },
    formatDate(dateStr) {
      return LibraryStore.formatDate(dateStr);
    }
  }
};

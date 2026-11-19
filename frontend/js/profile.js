// frontend/js/profile.js
// User Profile & Borrow History Component Logic

import { LibraryStore, showToast, showPopup, showConfirm } from './common.js';
import { getHeader, getFooter } from './components.js';

export default {
  name: 'ProfileView',
  data() {
    return {
      form: {
        maDocGia: 'DG-0842',
        hoLot: 'Nguyễn Văn',
        ten: 'An',
        ngaySinh: '1998-08-15',
        phai: 'Nam',
        email: 'nguyenvanan.dev@gmail.com',
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
      const daHuy = this.borrowRecords.filter(r => r.trangThai === 'DA_HUY' || r.trangThai === 'QUA_HAN').length;
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
    loadData() {
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
      this.borrowRecords = LibraryStore.getBorrowRecords();
    },
    handleUpdateProfile() {
      const updatedUser = {
        ...this.form,
        hoTen: `${this.form.hoLot} ${this.form.ten}`.trim()
      };
      
      LibraryStore.setCurrentUser(updatedUser);
      showPopup({
        title: 'CẬP NHẬT HỒ SƠ THÀNH CÔNG',
        message: 'Dữ liệu hồ sơ độc giả của bạn đã được lưu thành công trên hệ thống!',
        type: 'success',
        icon: 'badge',
        confirmText: 'ĐỒNG Ý'
      });
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
        const result = LibraryStore.updateBorrowStatus(maPhieuMuon, 'DA_HUY');
        if (result.success) {
          showPopup({
            title: 'ĐÃ HỦY PHIẾU MƯỢN',
            message: 'Yêu cầu mượn tài liệu đã được hủy thành công.',
            type: 'info',
            confirmText: 'ĐÃ HIỂU'
          });
          this.loadData();
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


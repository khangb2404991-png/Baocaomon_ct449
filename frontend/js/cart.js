// frontend/js/cart.js
// Cart Page Component Logic connected to MEVN Backend API

import { gioHangApi, phieuMuonApi } from './api.js';
import { LibraryStore, showToast, showPopup, showConfirm } from './common.js';
import { getHeader, getFooter } from './components.js';

export default {
  name: 'CartView',
  data() {
    // Current date in YYYY-MM-DD
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // +14 days
    const returnDay = new Date();
    returnDay.setDate(today.getDate() + 14);
    const returnStr = returnDay.toISOString().split('T')[0];

    return {
      cartItems: [],
      currentUser: null,
      borrowDate: todayStr,
      returnDate: returnStr,
      isModalOpen: false,
      modalDetails: {},
      cartCount: LibraryStore.getCartCount()
    };
  },
  created() {
    let user = null;
    if (typeof localStorage !== 'undefined') {
      try {
        const u = localStorage.getItem('user');
        if (u) user = JSON.parse(u);
      } catch (e) {}
    }
    this.currentUser = user || LibraryStore.getCurrentUser() || {
      maDG: 'DG-0001',
      maDocGia: 'DG-0001',
      tenDG: 'Nguyễn Văn An',
      dienThoai: '0912 345 678',
      diaChi: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội'
    };
    this.loadCart();
  },
  mounted() {
    window.addEventListener('cart-updated', (e) => {
      this.cartCount = e.detail && e.detail.count !== undefined ? e.detail.count : LibraryStore.getCartCount();
      this.loadCart();
    });
  },
  computed: {
    headerHtml() {
      return getHeader('cart', { cartCount: this.cartCount });
    },
    footerHtml() {
      return getFooter();
    },
    totalTitles() {
      return this.cartItems.length;
    },
    totalQty() {
      return this.cartItems.reduce((sum, item) => sum + (item.soLuong || item.soluong || 1), 0);
    },
    totalVal() {
      return this.cartItems.reduce((sum, item) => sum + ((item.donGia || item.dongia || 0) * (item.soLuong || item.soluong || 1)), 0);
    },
    remainingQuota() {
      return 5 - this.totalQty;
    },
    isQuotaExceeded() {
      return this.remainingQuota < 0;
    },
    isCartEmpty() {
      return this.cartItems.length === 0;
    }
  },
  methods: {
    getHeader,
    getFooter,
    async loadCart() {
      const maDG = this.currentUser.maDG || this.currentUser.maDocGia || 'DG-0001';
      try {
        const res = await gioHangApi.getCart(maDG);
        if (res && res.data) {
          const items = res.data.chiTiet || [];
          this.cartItems = items.map(item => ({
            maSach: item.maSach,
            tenSach: item.tenSach || 'Tài liệu mượn',
            tacGia: item.tacGia || 'Đang cập nhật',
            donGia: item.donGia || 100000,
            soLuong: item.soLuong || 1,
            khoCon: 10,
            hinhAnh: item.hinhAnh || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmDKfEDPCe0WmvcOnGfXYFmgYKb3L8fOMPSXvcKxvNypu3yQAnJwl9WIp01kK0GhIGJ16lqsWwSrApp2JU0MpfAQy55H_63VG0UF9ZkXWQeV4L4R0i-rWq2iUb9kTzwwXz_W39HK7ML6Bz0H6gHq1W9GDwBSTfvVFtr84aB-kgWU3JNnUZYG0I1hBt3XZX4Gk6gE2Nz2BlTpchOk552ctxYLJfd_HrNMTNDvBK2K8'
          }));
          this.cartCount = res.data.tongSoLuong !== undefined ? res.data.tongSoLuong : this.totalQty;
          LibraryStore.saveCart(this.cartItems);
          return;
        }
      } catch (e) {
        console.warn('API getCart error, falling back to local store:', e.message);
      }

      this.cartItems = LibraryStore.getCart();
      this.cartCount = LibraryStore.getCartCount();
    },
    async adjustQty(item, delta) {
      const cur = item.soLuong || 1;
      const newQty = cur + delta;
      const maSach = item.maSach;
      const maDG = this.currentUser.maDG || this.currentUser.maDocGia || 'DG-0001';

      if (newQty <= 0) {
        await this.removeItem(maSach);
        return;
      }

      const maxAllowed = item.khoCon !== undefined ? item.khoCon : 10;
      if (newQty > maxAllowed && maxAllowed > 0) {
        showPopup({
          title: 'GIỚI HẠN TỒN KHO',
          message: `Rất tiếc, tài liệu này trong kho chỉ còn tối đa <strong>${maxAllowed}</strong> quyển!`,
          type: 'warning',
          confirmText: 'ĐÃ HIỂU'
        });
        return;
      }

      try {
        const res = await gioHangApi.updateCartItem({
          maDG,
          maSach,
          soLuong: newQty
        });
        item.soLuong = newQty;
        this.cartCount = (res.data && res.data.tongSoLuong) || this.totalQty;
        LibraryStore.saveCart(this.cartItems);
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: this.cartCount } }));
      } catch (e) {
        item.soLuong = newQty;
        LibraryStore.saveCart(this.cartItems);
        this.cartCount = LibraryStore.getCartCount();
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: this.cartCount } }));
      }
    },
    async removeItem(maSach) {
      const maDG = this.currentUser.maDG || this.currentUser.maDocGia || 'DG-0001';
      try {
        const res = await gioHangApi.removeFromCart(maSach, maDG);
        this.cartItems = this.cartItems.filter(i => i.maSach !== maSach);
        this.cartCount = (res.data && res.data.tongSoLuong) !== undefined ? res.data.tongSoLuong : this.totalQty;
        LibraryStore.saveCart(this.cartItems);
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: this.cartCount } }));
      } catch (e) {
        const res = LibraryStore.removeFromCart(maSach);
        this.loadCart();
        this.cartCount = res.count;
      }

      showPopup({
        title: 'ĐÃ XÓA TÀI LIỆU',
        message: 'Đã xóa tài liệu khỏi danh sách mượn.',
        type: 'info',
        autoClose: 2000,
        confirmText: 'ĐÓNG'
      });
    },
    async clearAll() {
      const confirmed = await showConfirm({
        title: 'XÁC NHẬN LÀM TRỐNG GIỎ',
        message: 'Bạn có chắc chắn muốn xóa toàn bộ tài liệu khỏi giỏ sách mượn không?',
        type: 'danger',
        icon: 'delete',
        confirmText: 'XÓA TOÀN BỘ',
        cancelText: 'HỦY BỎ'
      });

      if (confirmed) {
        const maDG = this.currentUser.maDG || this.currentUser.maDocGia || 'DG-0001';
        try {
          await gioHangApi.clearCart(maDG);
        } catch (e) {}

        LibraryStore.clearCart();
        this.cartItems = [];
        this.cartCount = 0;
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: 0 } }));

        showPopup({
          title: 'ĐÃ LÀM TRỐNG GIỎ',
          message: 'Tất cả tài liệu đã được xóa khỏi giỏ sách.',
          type: 'info',
          confirmText: 'ĐỒNG Ý'
        });
      }
    },
    async submitBorrowOrder() {
      if (this.isCartEmpty) {
        showPopup({
          title: 'GIỎ SÁCH ĐANG TRỐNG',
          message: 'Bạn chưa có tài liệu nào trong giỏ. Vui lòng quay lại danh mục để chọn sách mượn!',
          type: 'warning',
          icon: 'shopping_bag',
          actions: [
            {
              text: 'ĐÓNG',
              class: 'app-popup-btn-secondary',
              onClick: (close) => close()
            },
            {
              text: 'ĐẾN TRANG CHỦ CHỌN SÁCH',
              class: 'app-popup-btn-primary',
              icon: 'home',
              onClick: (close) => {
                close();
                window.location.hash = '#/home';
              }
            }
          ]
        });
        return;
      }

      if (this.isQuotaExceeded) {
        showPopup({
          title: 'VƯỢT HẠN NGẠCH MƯỢN',
          message: `Bạn đang chọn <strong>${this.totalQty} quyển</strong>. Quy định thư viện chỉ cho phép mượn tối đa <strong>5 quyển</strong> mỗi lần. Vui lòng giảm số lượng!`,
          type: 'error',
          icon: 'warning',
          confirmText: 'ĐÃ HIỂU'
        });
        return;
      }

      const maDG = this.currentUser.maDG || this.currentUser.maDocGia || 'DG-0001';
      const readerName = this.currentUser.tenDG || this.currentUser.ten || this.currentUser.name || 'Độc giả';

      try {
        const payload = {
          maDG,
          hanTra: this.returnDate,
          items: this.cartItems.map(item => ({
            maSach: item.maSach,
            soLuong: item.soLuong || 1
          }))
        };

        const res = await phieuMuonApi.create(payload);
        const record = res.data;

        // Clear cart local & remote
        LibraryStore.clearCart();
        this.cartItems = [];
        this.cartCount = 0;
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: 0 } }));

        // Setup modal
        this.modalDetails = {
          maPhieuMuon: record.maPM || 'PM-NEW',
          docGia: readerName,
          viTri: 'Kho Kỹ Thuật Máy Tính - Tầng 2, Dãy B4',
          canBo: 'Trần Minh Thắng (Thủ thư phụ trách)',
          ghiChu: 'Đăng ký trực tuyến qua hệ thống thư viện. Chờ thủ thư xét duyệt.',
          ngayMuon: new Date(record.ngayMuon || Date.now()).toLocaleDateString('vi-VN'),
          ngayTra: new Date(record.hanTra || this.returnDate).toLocaleDateString('vi-VN'),
          tongSoLuong: this.totalQty,
          tongGiaTri: record.tongTienSach || this.totalVal
        };
        this.isModalOpen = true;

        showToast('HỆ THỐNG GHI NHẬN: Phiếu đăng ký mượn tài liệu của bạn đã được gửi thành công!', 'success');
      } catch (err) {
        showPopup({
          title: 'GỬI YÊU CẦU THẤT BẠI',
          message: err.message || 'Không thể tạo phiếu mượn lúc này!',
          type: 'error',
          confirmText: 'THỬ LẠI'
        });
      }
    },
    closeModal() {
      this.isModalOpen = false;
      this.$router.push('/profile');
    },
    getHeader,
    getFooter,
    formatCurrency(amount) {
      return LibraryStore.formatCurrency(amount);
    }
  }
};

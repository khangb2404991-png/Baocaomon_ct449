// frontend/js/cart.js
// Cart Page Component Logic

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
    this.currentUser = LibraryStore.getCurrentUser() || {
      maDocGia: 'DG-0842',
      hoLot: 'Nguyễn Văn',
      ten: 'An',
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
    loadCart() {
      this.cartItems = LibraryStore.getCart();
      this.cartCount = LibraryStore.getCartCount();
    },
    adjustQty(item, delta) {
      const cur = item.soLuong || item.soluong || 1;
      const newQty = cur + delta;
      const id = item.maSach || item.masach;

      if (newQty <= 0) {
        this.removeItem(id);
        return;
      }

      const maxAllowed = item.khoCon !== undefined ? item.khoCon : (item.soQuyen || 5);
      if (newQty > maxAllowed && maxAllowed > 0) {
        showPopup({
          title: 'GIỚI HẠN TỒN KHO',
          message: `Rất tiếc, tài liệu này trong kho chỉ còn tối đa <strong>${maxAllowed}</strong> quyển!`,
          type: 'warning',
          confirmText: 'ĐÃ HIỂU'
        });
        return;
      }

      item.soLuong = newQty;
      item.soluong = newQty;
      LibraryStore.saveCart(this.cartItems);
      this.cartCount = LibraryStore.getCartCount();
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: this.cartCount } }));
    },
    removeItem(maSach) {
      const res = LibraryStore.removeFromCart(maSach);
      this.loadCart();
      this.cartCount = res.count;
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
        LibraryStore.clearCart();
        this.loadCart();
        this.cartCount = 0;
        showPopup({
          title: 'ĐÃ LÀM TRỐNG GIỎ',
          message: 'Tất cả tài liệu đã được xóa khỏi giỏ sách.',
          type: 'info',
          confirmText: 'ĐỒNG Ý'
        });
      }
    },
    submitBorrowOrder() {
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

      const borrowData = {
        maDocGia: this.currentUser.maDocGia || this.currentUser.id || 'DG-0842',
        tenDocGia: (this.currentUser.hoLot ? `${this.currentUser.hoLot} ${this.currentUser.ten}` : (this.currentUser.ten || this.currentUser.hoTen || this.currentUser.name || 'Nguyễn Văn An')),
        sdt: this.currentUser.dienThoai || this.currentUser.dienthoai || '0912 345 678',
        ngayMuon: this.borrowDate,
        ngayTra: this.returnDate,
        items: this.cartItems.map(item => ({
          maSach: item.maSach || item.masach,
          tenSach: item.tenSach || item.tensach,
          tacGia: item.tacGia || item.tacgia,
          hinhAnh: item.hinhAnh || item.hinhanh,
          soLuong: item.soLuong || item.soluong || 1,
          donGia: item.donGia || item.dongia || 0
        })),
        tongSoLuong: this.totalQty,
        tongGiaTri: this.totalVal,
        trangThai: 'CHO_DUYET'
      };

      const record = LibraryStore.createBorrowRecord(borrowData);
      
      // Clear cart
      LibraryStore.clearCart();
      this.loadCart();
      this.cartCount = 0;

      // Setup modal
      this.modalDetails = {
        maPhieuMuon: record.maPhieuMuon,
        docGia: borrowData.tenDocGia,
        viTri: 'Kho Kỹ Thuật Máy Tính - Tầng 2, Dãy B4',
        canBo: 'Trần Minh Thắng (Thủ thư phụ trách)',
        ghiChu: 'Tình trạng nguyên vẹn, đã xác thực tài sản thư viện.',
        ngayMuon: record.ngayMuon,
        ngayTra: record.ngayTra,
        tongSoLuong: record.tongSoLuong,
        tongGiaTri: record.tongGiaTri
      };
      this.isModalOpen = true;

      showToast('HỆ THỐNG GHI NHẬN: Phiếu đăng ký mượn tài liệu của bạn đã được tạo thành công!', 'success');
    },
    closeModal() {
      this.isModalOpen = false;
    },
    getHeader,
    getFooter,
    formatCurrency(amount) {
      return LibraryStore.formatCurrency(amount);
    }
  }
};


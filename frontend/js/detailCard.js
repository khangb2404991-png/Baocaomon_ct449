/**
 * BOOK LENDING SYSTEM - DETAIL CARD VIEW CONTROLLER (detailCard.js)
 * Separated JavaScript logic for DetailCard.vue connected to MEVN Backend API
 */

import { sachApi, gioHangApi } from './api.js';
import { LibraryStore, showToast, showPopup } from './common.js';

function normalizeBookItem(b) {
  if (!b) return null;
  const authorName = (b.maTG && typeof b.maTG === 'object') ? b.maTG.tenTG : (b.tacGia || 'Đang cập nhật');
  const pubName = (b.maNXB && typeof b.maNXB === 'object') ? b.maNXB.tenNXB : (b.nhaXuatBan || 'Đang cập nhật');
  const pubCode = (b.maNXB && typeof b.maNXB === 'object') ? b.maNXB.maNXB : (b.maNXB || 'NXB-01');

  return {
    ...b,
    maSach: b.maSach || '',
    tenSach: b.tenSach || 'Tài liệu',
    tacGia: authorName,
    nhaXuatBan: pubName,
    maNXB: pubCode,
    theLoai: b.loai || b.theLoai || 'Khoa Học Máy Tính',
    namXuatBan: b.namXB || b.namXuatBan || 2024,
    donGia: b.donGia !== undefined ? b.donGia : 100000,
    soQuyen: b.soLuong !== undefined ? b.soLuong : (b.soQuyen !== undefined ? b.soQuyen : 5),
    luotMuon: b.luotMuon || 0,
    moTa: b.moTa || 'Tài liệu học tập và nghiên cứu chuyên khảo thuộc thư viện.',
    hinhAnh: b.hinhAnh || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmDKfEDPCe0WmvcOnGfXYFmgYKb3L8fOMPSXvcKxvNypu3yQAnJwl9WIp01kK0GhIGJ16lqsWwSrApp2JU0MpfAQy55H_63VG0UF9ZkXWQeV4L4R0i-rWq2iUb9kTzwwXz_W39HK7ML6Bz0H6gHq1W9GDwBSTfvVFtr84aB-kgWU3JNnUZYG0I1hBt3XZX4Gk6gE2Nz2BlTpchOk552ctxYLJfd_HrNMTNDvBK2K8'
  };
}

export default {
  name: 'DetailCardView',
  data() {
    return {
      book: {
        maSach: 'CS-0102',
        tenSach: 'HỆ ĐIỀU HÀNH & KIẾN TRÚC MÁY TÍNH',
        tacGia: 'TS. Nguyễn Văn Dũng, ThS. Lê Thị Mai Anh',
        theLoai: 'CÔNG NGHỆ THÔNG TIN',
        donGia: 185000,
        soQuyen: 8,
        namXuatBan: 2023,
        nhaXuatBan: 'Nhà Xuất Bản Kỹ Thuật - Điện Tử',
        hinhAnh: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDciQThz-C157nHdwRnCsiTqHaLg-Ek87e5Xtpo_1wpnXwreWeUhCabJ7LDwdwnM-apHfAW_hDuQyeDsz9xhCO6f8QJZLmW5tzwwzy3yYHuLuVU_jknkXpouHDc0Wd-IMSm0HFJUZXs115ncWmyOdCOb4xlAPuxXSV_oCC-0HfsL86kQDaRxczv1d8O9FISCcA9kHoJzsgBY316GgkspIqNcraRmqK1UnCJOEROwYk',
        moTa: 'Giáo trình cung cấp các kiến thức cơ sở và chuyên sâu toàn diện về nguyên lý hoạt động của hệ điều hành hiện đại, mô hình phần cứng máy tính và cơ chế tương tác tầng thấp giữa vi xử lý, bộ nhớ và hệ thống vào/ra (I/O).'
      },
      borrowQuantity: 1,
      cartCount: (typeof localStorage !== 'undefined' && !localStorage.getItem('token')) ? 0 : LibraryStore.getCartCount(),
      currentUser: (typeof localStorage !== 'undefined' && localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : LibraryStore.getCurrentUser(),
      isLoggedIn: typeof localStorage !== 'undefined' ? !!(localStorage.getItem('token') && localStorage.getItem('user')) : false
    };
  },
  computed: {
    formattedCartCount() {
      return String(this.cartCount !== undefined ? this.cartCount : 0).padStart(2, '0');
    }
  },
  created() {
    this.loadBook();
  },
  mounted() {
    window.addEventListener('cart-updated', this.onCartUpdated);
  },
  beforeUnmount() {
    window.removeEventListener('cart-updated', this.onCartUpdated);
  },
  watch: {
    '$route.params.id'() {
      this.loadBook();
    }
  },
  methods: {
    onCartUpdated(e) {
      this.cartCount = e.detail && e.detail.count !== undefined ? e.detail.count : LibraryStore.getCartCount();
    },
    async loadBook() {
      const bookId = this.$route && this.$route.params ? this.$route.params.id : null;
      if (bookId) {
        try {
          const res = await sachApi.getById(bookId);
          if (res && res.data) {
            this.book = normalizeBookItem(res.data);
            this.borrowQuantity = 1;
            return;
          }
        } catch (e) {
          console.warn('API getById error, trying local fallback:', e.message);
        }

        const allBooks = LibraryStore.getBooks();
        const found = allBooks.find(b => 
          (b.maSach && String(b.maSach).toLowerCase() === String(bookId).toLowerCase()) ||
          (b.masach && String(b.masach).toLowerCase() === String(bookId).toLowerCase())
        );
        if (found) {
          this.book = normalizeBookItem(found);
          this.borrowQuantity = 1;
          return;
        }
      }

      // Fallback
      const allBooks = LibraryStore.getBooks();
      if (allBooks && allBooks.length > 0) {
        this.book = normalizeBookItem(allBooks[0]);
        this.borrowQuantity = 1;
      }
    },
    decreaseQuantity() {
      if (this.borrowQuantity > 1) {
        this.borrowQuantity--;
      }
    },
    increaseQuantity() {
      const maxStock = this.book.soQuyen !== undefined ? this.book.soQuyen : 5;
      if (this.borrowQuantity < maxStock) {
        this.borrowQuantity++;
      } else {
        showToast(`Số lượng mượn tối đa là ${maxStock} quyển!`, 'warning');
      }
    },
    async handleAddToCart() {
      if (!this.isLoggedIn || !this.currentUser) {
        showPopup({
          title: 'YÊU CẦU ĐĂNG NHẬP',
          message: 'Vui lòng đăng nhập tài khoản độc giả để mượn tài liệu này!',
          type: 'warning',
          icon: 'lock',
          actions: [
            {
              text: 'ĐỂ SAU',
              class: 'app-popup-btn-secondary',
              onClick: (close) => close()
            },
            {
              text: 'ĐĂNG NHẬP NGAY',
              class: 'app-popup-btn-primary',
              icon: 'login',
              onClick: (close) => {
                close();
                this.$router.push('/login');
              }
            }
          ]
        });
        return;
      }

      const stock = this.book.soQuyen !== undefined ? this.book.soQuyen : 0;
      if (stock <= 0) {
        showPopup({
          title: 'TÀI LIỆU ĐÃ HẾT',
          message: 'Rất tiếc, tài liệu này hiện đã hết sách trong kho lưu trữ!',
          type: 'warning',
          icon: 'inventory_2',
          confirmText: 'ĐÃ HIỂU'
        });
        return;
      }

      const user = this.currentUser;
      const maDG = user.maDG;

      try {
        const res = await gioHangApi.addToCart({
          maDG,
          maSach: this.book.maSach,
          soLuong: this.borrowQuantity
        });

        const newCount = (res.data && res.data.tongSoLuong) || (this.cartCount + this.borrowQuantity);
        this.cartCount = newCount;
        LibraryStore.addToCart(this.book, this.borrowQuantity);

        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: newCount } }));
        const badge = document.getElementById('header-cart-badge');
        if (badge) badge.textContent = String(newCount).padStart(2, '0');

        const title = this.book.tenSach || 'Tài liệu';
        showPopup({
          title: 'MƯỢN TÀI LIỆU THÀNH CÔNG',
          message: `Đã thêm <strong>${this.borrowQuantity} quyển</strong> "${title}" vào giỏ mượn.<br><br><span class="text-[#8e9192]">Hiện tại trong giỏ mượn của bạn có:</span> <strong class="text-white">${newCount} quyển</strong>.`,
          type: 'success',
          icon: 'menu_book',
          actions: [
            {
              text: 'TIẾP TỤC CHỌN SÁCH',
              class: 'app-popup-btn-secondary',
              icon: 'arrow_back',
              onClick: (close) => close()
            },
            {
              text: `ĐẾN GIỎ HÀNG (${newCount})`,
              class: 'app-popup-btn-primary',
              icon: 'shopping_bag',
              onClick: (close) => {
                close();
                this.$router.push('/cart');
              }
            }
          ]
        });
      } catch (err) {
        showPopup({
          title: 'KHÔNG THỂ MƯỢN THÊM',
          message: err.message || 'Không thể thêm vào giỏ sách!',
          type: 'warning',
          confirmText: 'ĐÃ HIỂU'
        });
      }
    },
    async handleBorrowNow() {
      if (!this.isLoggedIn || !this.currentUser) {
        showPopup({
          title: 'YÊU CẦU ĐĂNG NHẬP',
          message: 'Vui lòng đăng nhập tài khoản độc giả để mượn tài liệu này!',
          type: 'warning',
          icon: 'lock',
          actions: [
            {
              text: 'ĐỂ SAU',
              class: 'app-popup-btn-secondary',
              onClick: (close) => close()
            },
            {
              text: 'ĐĂNG NHẬP NGAY',
              class: 'app-popup-btn-primary',
              icon: 'login',
              onClick: (close) => {
                close();
                this.$router.push('/login');
              }
            }
          ]
        });
        return;
      }

      const stock = this.book.soQuyen !== undefined ? this.book.soQuyen : 0;
      if (stock <= 0) {
        showPopup({
          title: 'TÀI LIỆU ĐÃ HẾT',
          message: 'Rất tiếc, tài liệu này hiện đã hết sách trong kho lưu trữ!',
          type: 'warning',
          icon: 'inventory_2',
          confirmText: 'ĐÃ HIỂU'
        });
        return;
      }

      const user = this.currentUser;
      const maDG = user.maDG;

      try {
        const res = await gioHangApi.addToCart({
          maDG,
          maSach: this.book.maSach,
          soLuong: this.borrowQuantity
        });
        const newCount = (res.data && res.data.tongSoLuong) || (this.cartCount + this.borrowQuantity);
        this.cartCount = newCount;
        LibraryStore.addToCart(this.book, this.borrowQuantity);

        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: newCount } }));
        showToast('Đang chuyển hướng đến giỏ mượn...', 'success');
        this.$router.push('/cart');
      } catch (e) {
        showToast(e.message || 'Không thể mượn sách!', 'warning');
      }
    },
    formatCurrency(val) {
      return LibraryStore.formatCurrency(val);
    }
  }
};

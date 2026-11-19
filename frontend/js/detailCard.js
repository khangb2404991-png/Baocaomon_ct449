/**
 * BOOK LENDING SYSTEM - DETAIL CARD VIEW CONTROLLER (detailCard.js)
 * Separated JavaScript logic for DetailCard.vue
 * Strictly adheres to Stitch AI design (design/detail_card.html)
 */

import { LibraryStore, showToast, showPopup } from './common.js';

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
        moTa: 'Giáo trình cung cấp các kiến thức cơ sở và chuyên sâu toàn diện về nguyên lý hoạt động của hệ điều hành hiện đại, mô hình phần cứng máy tính và cơ chế tương tác tầng thấp giữa vi xử lý, bộ nhớ và hệ thống vào/ra (I/O).\n\nNội dung bao gồm: Quản lý tiến trình (Process & Thread), cơ chế đồng bộ hóa dữ liệu và xử lý Deadlock; Cơ chế phân trang (Paging), bộ nhớ ảo (Virtual Memory) và thuật toán thay thế trang; Cấu trúc hệ thống tệp tin và an toàn hệ thống phân tán; Phân tích sâu kiến trúc vi xử lý đa nhân x86-64 và ARM hiện đại.'
      },
      borrowQuantity: 1,
      cartCount: LibraryStore.getCartCount(),
      currentUser: LibraryStore.getCurrentUser()
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
    loadBook() {
      const allBooks = LibraryStore.getBooks();
      const bookId = this.$route && this.$route.params ? this.$route.params.id : null;

      if (bookId) {
        const found = allBooks.find(b => 
          (b.maSach && String(b.maSach).toLowerCase() === String(bookId).toLowerCase()) ||
          (b.masach && String(b.masach).toLowerCase() === String(bookId).toLowerCase())
        );
        if (found) {
          this.book = { ...found };
          this.borrowQuantity = 1;
          return;
        }
      }

      // Fallback: If no bookId or bookId not found, use first book from store if available
      if (allBooks && allBooks.length > 0) {
        this.book = { ...allBooks[0] };
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
    handleAddToCart() {
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

      const res = LibraryStore.addToCart(this.book, this.borrowQuantity);
      if (res.success) {
        this.cartCount = res.count;
        const title = this.book.tenSach || 'Tài liệu';
        showPopup({
          title: 'MƯỢN TÀI LIỆU THÀNH CÔNG',
          message: `Đã thêm <strong>${this.borrowQuantity} quyển</strong> "${title}" vào giỏ mượn.<br><br><span class="text-[#8e9192]">Hiện tại trong giỏ mượn của bạn có:</span> <strong class="text-white">${res.count} quyển</strong>.`,
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
              text: `ĐẾN GIỎ HÀNG (${res.count})`,
              class: 'app-popup-btn-primary',
              icon: 'shopping_bag',
              onClick: (close) => {
                close();
                this.$router.push('/cart');
              }
            }
          ]
        });
      } else {
        showPopup({
          title: 'KHÔNG THỂ MƯỢN THÊM',
          message: res.message || 'Không thể thêm vào giỏ sách!',
          type: 'warning',
          confirmText: 'ĐÃ HIỂU'
        });
      }
    },
    handleBorrowNow() {
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

      const res = LibraryStore.addToCart(this.book, this.borrowQuantity);
      if (res.success) {
        this.cartCount = res.count;
        showToast('Đang chuyển hướng đến giỏ mượn...', 'success');
        this.$router.push('/cart');
      } else {
        showToast(res.message || 'Không thể mượn sách!', 'warning');
      }
    },
    formatCurrency(val) {
      return LibraryStore.formatCurrency(val);
    }
  }
};

// frontend/js/home.js
// Home View Component Logic

import { LibraryStore, showToast, showPopup } from './common.js';
import { getHeader, getFooter } from './components.js';

export default {
  name: 'HomeView',
  data() {
    return {
      allBooks: [],
      top10Books: [],
      startIndex: 0,
      filters: {
        search: '',
        genre: '',
        publisher: '',
        year: '',
        sort: 'latest'
      },
      currentPage: 1,
      pageSize: 8,
      cartCount: LibraryStore.getCartCount()
    };
  },
  created() {
    this.loadBooks();
    this.initTopBooks();
  },
  mounted() {
    window.addEventListener('cart-updated', (e) => {
      this.cartCount = e.detail && e.detail.count !== undefined ? e.detail.count : LibraryStore.getCartCount();
    });
  },
  computed: {
    headerHtml() {
      return getHeader('home', { cartCount: this.cartCount });
    },
    footerHtml() {
      return getFooter();
    },
    displayTopBooks() {
      if (!this.top10Books.length) return [];
      const result = [];
      const total = this.top10Books.length;
      for (let i = 0; i < 5; i++) {
        const idx = (this.startIndex + i) % total;
        result.push(this.top10Books[idx]);
      }
      return result;
    },
    topPageIndicator() {
      if (!this.top10Books.length) return '';
      const from = this.startIndex + 1;
      const to = Math.min(this.startIndex + 5, this.top10Books.length);
      return `TOP ${from} - ${to} / ${this.top10Books.length}`;
    },
    topBooks() {
      return this.displayTopBooks;
    },
    filteredBooks() {
      let result = [...this.allBooks];

      // Search query filter
      if (this.filters.search.trim()) {
        const query = this.filters.search.toLowerCase().trim();
        result = result.filter(book => 
          (book.tenSach && book.tenSach.toLowerCase().includes(query)) ||
          (book.tacGia && book.tacGia.toLowerCase().includes(query)) ||
          (book.theLoai && book.theLoai.toLowerCase().includes(query)) ||
          (book.maSach && book.maSach.toLowerCase().includes(query))
        );
      }

      // Genre filter
      if (this.filters.genre) {
        result = result.filter(book => {
          if (this.filters.genre === 'cntt') return book.theLoai && book.theLoai.toLowerCase().includes('công nghệ');
          if (this.filters.genre === 'ktqt') return book.theLoai && book.theLoai.toLowerCase().includes('kinh tế');
          if (this.filters.genre === 'khdl') return book.theLoai && (book.theLoai.toLowerCase().includes('dữ liệu') || book.theLoai.toLowerCase().includes('khoa học'));
          if (this.filters.genre === 'knpm') return book.theLoai && book.theLoai.toLowerCase().includes('phần mềm');
          if (this.filters.genre === 'vh') return book.theLoai && book.theLoai.toLowerCase().includes('văn học');
          return true;
        });
      }

      // Publisher filter
      if (this.filters.publisher) {
        result = result.filter(book => {
          if (this.filters.publisher === 'nxbtre') return book.nhaXuatBan && book.nhaXuatBan.toLowerCase().includes('trẻ');
          if (this.filters.publisher === 'nxbtttt') return book.nhaXuatBan && book.nhaXuatBan.toLowerCase().includes('thông tin');
          if (this.filters.publisher === 'nxbgd') return book.nhaXuatBan && book.nhaXuatBan.toLowerCase().includes('giáo dục');
          if (this.filters.publisher === 'nxbbk') return book.nhaXuatBan && book.nhaXuatBan.toLowerCase().includes('bách khoa');
          if (this.filters.publisher === 'nxbkd') return book.nhaXuatBan && book.nhaXuatBan.toLowerCase().includes('kim đồng');
          return true;
        });
      }

      // Year filter
      if (this.filters.year) {
        result = result.filter(book => String(book.namXuatBan) === String(this.filters.year));
      }

      // Sorting
      if (this.filters.sort === 'latest') {
        result.sort((a, b) => (b.namXuatBan || 0) - (a.namXuatBan || 0));
      } else if (this.filters.sort === 'popular') {
        result.sort((a, b) => (b.luotMuon || 0) - (a.luotMuon || 0));
      } else if (this.filters.sort === 'price-asc') {
        result.sort((a, b) => (a.donGia || 0) - (b.donGia || 0));
      }

      return result;
    },
    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.pageSize) || 1;
    },
    paginatedBooks() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredBooks.slice(start, start + this.pageSize);
    }
  },
  methods: {
    getHeader,
    getFooter,
    loadBooks() {
      this.allBooks = LibraryStore.getBooks();
      this.initTopBooks();
    },
    initTopBooks() {
      // Lấy đủ 10 sách có lượt mượn cao nhất và gán thứ hạng cố định
      const sorted = [...this.allBooks]
        .sort((a, b) => (b.luotMuon || 0) - (a.luotMuon || 0))
        .slice(0, 10);
      
      this.top10Books = sorted.map((book, idx) => ({
        ...book,
        rank: idx + 1
      }));
    },
    nextTopBook() {
      if (!this.top10Books.length) return;
      this.startIndex = (this.startIndex + 5) % this.top10Books.length;
    },
    prevTopBook() {
      if (!this.top10Books.length) return;
      this.startIndex = (this.startIndex - 5 + this.top10Books.length) % this.top10Books.length;
    },
    resetFilters() {
      this.filters = {
        search: '',
        genre: '',
        publisher: '',
        year: '',
        sort: 'latest'
      };
      this.currentPage = 1;
    },
    addToCart(book) {
      const stock = book.soQuyen !== undefined ? book.soQuyen : (book.soquyen || 0);
      if (!book || stock <= 0) {
        showPopup({
          title: 'TÀI LIỆU ĐÃ HẾT',
          message: 'Rất tiếc, tài liệu này hiện đã hết sách trong kho lưu trữ!',
          type: 'warning',
          icon: 'inventory_2',
          confirmText: 'ĐÃ HIỂU'
        });
        return;
      }

      const res = LibraryStore.addToCart(book);
      if (res.success) {
        this.cartCount = res.count;
        const title = book.tenSach || book.tensach || 'Tài liệu';
        showPopup({
          title: 'MƯỢN TÀI LIỆU THÀNH CÔNG',
          message: `Đã thêm tài liệu <strong>"${title}"</strong> vào giỏ mượn.<br><br><span class="text-[#8e9192]">Hiện tại trong giỏ mượn của bạn có:</span> <strong class="text-white">${res.count} quyển</strong>.`,
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
                window.location.hash = '#/cart';
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
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    },
    goToDetail(book) {
      if (!book) return;
      const id = book.maSach || book.masach;
      if (id) {
        this.$router.push(`/book/${id}`);
      }
    },
    formatCurrency(amount) {
      return LibraryStore.formatCurrency(amount);
    }
  }
};


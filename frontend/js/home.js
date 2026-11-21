// frontend/js/home.js
// Home View Component Logic connected to MEVN Backend API

import { sachApi, gioHangApi } from './api.js';
import { LibraryStore, showToast, showPopup } from './common.js';
import { getHeader, getFooter } from './components.js';

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
    moTa: b.moTa || '',
    hinhAnh: b.hinhAnh || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmDKfEDPCe0WmvcOnGfXYFmgYKb3L8fOMPSXvcKxvNypu3yQAnJwl9WIp01kK0GhIGJ16lqsWwSrApp2JU0MpfAQy55H_63VG0UF9ZkXWQeV4L4R0i-rWq2iUb9kTzwwXz_W39HK7ML6Bz0H6gHq1W9GDwBSTfvVFtr84aB-kgWU3JNnUZYG0I1hBt3XZX4Gk6gE2Nz2BlTpchOk552ctxYLJfd_HrNMTNDvBK2K8'
  };
}

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
    this.loadCartCount();
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
          (book.theLoai && book.theLoai.toLowerCase().includes(query))
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
    async loadBooks() {
      try {
        const res = await sachApi.getAll();
        if (res && res.data) {
          this.allBooks = res.data.map(normalizeBookItem);
          LibraryStore.saveBooks(this.allBooks);
        }
      } catch (e) {
        this.allBooks = LibraryStore.getBooks().map(normalizeBookItem);
      }
      this.initTopBooks();
    },
    async initTopBooks() {
      try {
        const res = await sachApi.getTop10();
        if (res && res.data && res.data.length) {
          this.top10Books = res.data.map((book, idx) => ({
            ...normalizeBookItem(book),
            rank: idx + 1
          }));
          return;
        }
      } catch (e) {}

      // Fallback
      const sorted = [...this.allBooks]
        .sort((a, b) => (b.luotMuon || 0) - (a.luotMuon || 0))
        .slice(0, 10);
      
      this.top10Books = sorted.map((book, idx) => ({
        ...book,
        rank: idx + 1
      }));
    },
    async loadCartCount() {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        this.cartCount = 0;
        const badge = document.getElementById('header-cart-badge');
        if (badge) badge.textContent = '00';
        return;
      }
      try {
        let user = null;
        if (typeof localStorage !== 'undefined') {
          const u = localStorage.getItem('user');
          if (u) user = JSON.parse(u);
        }
        if (user && user.maDG) {
          const cartRes = await gioHangApi.getCart(user.maDG);
          if (cartRes && cartRes.data) {
            this.cartCount = cartRes.data.tongSoLuong;
            const badge = document.getElementById('header-cart-badge');
            if (badge) badge.textContent = String(this.cartCount).padStart(2, '0');
          }
        }
      } catch (e) {}
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
    async addToCart(book) {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
      let user = null;
      if (typeof localStorage !== 'undefined') {
        const u = localStorage.getItem('user');
        if (u) user = JSON.parse(u);
      }

      if (!token || !user) {
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

      const stock = book.soQuyen !== undefined ? book.soQuyen : (book.soLuong || 0);
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

      const maDG = user.maDG;

      try {
        const res = await gioHangApi.addToCart({
          maDG,
          maSach: book.maSach,
          soLuong: 1
        });

        const newCount = (res.data && res.data.tongSoLuong) || (this.cartCount + 1);
        this.cartCount = newCount;
        LibraryStore.addToCart(book, 1);

        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: newCount } }));
        const badge = document.getElementById('header-cart-badge');
        if (badge) badge.textContent = String(newCount).padStart(2, '0');

        const title = book.tenSach || 'Tài liệu';
        showPopup({
          title: 'MƯỢN TÀI LIỆU THÀNH CÔNG',
          message: `Đã thêm tài liệu <strong>"${title}"</strong> vào giỏ mượn.<br><br><span class="text-[#8e9192]">Hiện tại trong giỏ mượn của bạn có:</span> <strong class="text-white">${newCount} quyển</strong>.`,
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
                window.location.hash = '#/cart';
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

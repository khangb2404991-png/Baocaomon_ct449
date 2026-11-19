// frontend/js/bookManagement.js
// Admin Book Management Component Logic

import { LibraryStore, showToast } from './common.js';
import { getAdminSidebar, getAdminHeader, getAdminFooter } from './components.js';

export default {
  name: 'BookManagementView',
  data() {
    return {
      books: [],
      filters: {
        search: '',
        nxb: '',
        status: '',
        genre: ''
      },
      currentPage: 1,
      pageSize: 5,
      selectedBook: null,
      isEditing: false,
      form: {
        maSach: '',
        tenSach: '',
        maNXB: 'NXB-01',
        nhaXuatBan: 'NXB Bách Khoa (NXB-01)',
        tacGia: '',
        theLoai: 'Khoa Học Máy Tính',
        donGia: 240000,
        soQuyen: 6,
        namXuatBan: 2023,
        hinhAnh: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmDKfEDPCe0WmvcOnGfXYFmgYKb3L8fOMPSXvcKxvNypu3yQAnJwl9WIp01kK0GhIGJ16lqsWwSrApp2JU0MpfAQy55H_63VG0UF9ZkXWQeV4L4R0i-rWq2iUb9kTzwwXz_W39HK7ML6Bz0H6gHq1W9GDwBSTfvVFtr84aB-kgWU3JNnUZYG0I1hBt3XZX4Gk6gE2Nz2BlTpchOk552ctxYLJfd_HrNMTNDvBK2K8',
        moTa: 'Tài liệu chuyên sâu về kiến trúc hệ thống phân tán, xử lý tải cao, caching, messaging queue và tối ưu hóa hạ tầng vi dịch vụ theo chuẩn kỹ thuật cao cấp.',
        trangThai: true
      }
    };
  },
  created() {
    this.loadBooks();
    if (this.books.length > 0) {
      this.selectBook(this.books[0]);
    }
  },
  computed: {
    filteredBooks() {
      let result = [...this.books];

      if (this.filters.search.trim()) {
        const q = this.filters.search.toLowerCase().trim();
        result = result.filter(b => 
          (b.tenSach && b.tenSach.toLowerCase().includes(q)) ||
          (b.maSach && b.maSach.toLowerCase().includes(q)) ||
          (b.tacGia && b.tacGia.toLowerCase().includes(q))
        );
      }

      if (this.filters.nxb) {
        result = result.filter(b => b.maNXB === this.filters.nxb || (b.nhaXuatBan && b.nhaXuatBan.includes(this.filters.nxb)));
      }

      if (this.filters.status !== '') {
        const isTrue = this.filters.status === '1';
        result = result.filter(b => (b.trangThai !== false) === isTrue);
      }

      if (this.filters.genre) {
        result = result.filter(b => b.theLoai && b.theLoai.toLowerCase().includes(this.filters.genre.toLowerCase()));
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
    getAdminSidebar,
    getAdminHeader,
    getAdminFooter,
    loadBooks() {
      this.books = LibraryStore.getBooks();
    },
    selectBook(book) {
      this.selectedBook = book;
      this.isEditing = true;
      this.form = {
        maSach: book.maSach,
        tenSach: book.tenSach,
        maNXB: book.maNXB || 'NXB-01',
        nhaXuatBan: book.nhaXuatBan || 'NXB Bách Khoa (NXB-01)',
        tacGia: book.tacGia || '',
        theLoai: book.theLoai || 'Khoa Học Máy Tính',
        donGia: book.donGia || 100000,
        soQuyen: book.soQuyen !== undefined ? book.soQuyen : 5,
        namXuatBan: book.namXuatBan || 2024,
        hinhAnh: book.hinhAnh || '',
        moTa: book.moTa || '',
        trangThai: book.trangThai !== false
      };
    },
    startAddBook() {
      this.selectedBook = null;
      this.isEditing = false;
      const autoId = 'CS-' + Math.floor(1000 + Math.random() * 9000);
      this.form = {
        maSach: autoId,
        tenSach: '',
        maNXB: 'NXB-01',
        nhaXuatBan: 'NXB Bách Khoa (NXB-01)',
        tacGia: '',
        theLoai: 'Khoa Học Máy Tính',
        donGia: 150000,
        soQuyen: 5,
        namXuatBan: 2024,
        hinhAnh: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSXMOcWBNygJRdwNn8mnvfkJFtB_zxBYyMz0zQhQMQ6EIM6p2Q62gRBQ0CFO9kpDvC9Q58fBGxI_pwnncDcDsKJijSP-EoK9Yajwu7-Y_1GY7vMaPjpi187HalaGHoLrBwgzTICQtdd-6sFoQ0jJRjF2VoA1D9FK6l7kiiMgvlrM7DVWNZDmLYr_SQS7SYCMB0iF1uHIlU3AqmkB7dgGnQrHaFysDQ_4fAa56pZEg',
        moTa: '',
        trangThai: true
      };
    },
    saveBook() {
      if (!this.form.tenSach) {
        showToast('Vui lòng nhập tên sách!', 'error');
        return;
      }

      if (this.isEditing) {
        const idx = this.books.findIndex(b => b.maSach === this.form.maSach);
        if (idx !== -1) {
          this.books[idx] = { ...this.books[idx], ...this.form };
          LibraryStore.saveBooks(this.books);
          showToast(`Đã cập nhật thông tin sách "${this.form.tenSach}"`, 'success');
        }
      } else {
        const newBook = { ...this.form, luotMuon: 0 };
        this.books.unshift(newBook);
        LibraryStore.saveBooks(this.books);
        this.selectBook(newBook);
        showToast(`Đã thêm mới tài liệu "${newBook.tenSach}" vào kho lưu trữ!`, 'success');
      }
    },
    toggleBookStatus(book) {
      book.trangThai = book.trangThai === false ? true : false;
      LibraryStore.saveBooks(this.books);
      showToast(`Đã chuyển trạng thái "${book.tenSach}" sang ${book.trangThai ? 'HIỂN THỊ' : 'NGỪNG PHỤC VỤ'}`, 'info');
    },
    resetFilters() {
      this.filters = { search: '', nxb: '', status: '', genre: '' };
      this.currentPage = 1;
    },
    goToPage(p) {
      if (p >= 1 && p <= this.totalPages) {
        this.currentPage = p;
      }
    },
    formatCurrency(val) {
      return LibraryStore.formatCurrency(val);
    }
  }
};


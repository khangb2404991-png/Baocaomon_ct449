// frontend/js/bookManagement.js
// Admin Book Management Component Logic connected to MEVN Backend API

import { sachApi, nhaxbApi, tacGiaApi } from './api.js';
import { LibraryStore, showToast, showPopup, showConfirm } from './common.js';
import { getAdminSidebar, getAdminHeader, getAdminFooter } from './components.js';

function normalizeBook(b) {
  if (!b) return null;
  const authorName = (b.maTG && typeof b.maTG === 'object') ? b.maTG.tenTG : (b.tacGia || 'Đang cập nhật');
  const pubName = (b.maNXB && typeof b.maNXB === 'object') ? b.maNXB.tenNXB : (b.nhaXuatBan || 'Đang cập nhật');
  const pubCode = (b.maNXB && typeof b.maNXB === 'object') ? b.maNXB.maNXB : (b.maNXB || 'NXB-01');
  const authorCode = (b.maTG && typeof b.maTG === 'object') ? b.maTG.maTG : (b.maTG || 'TG-01');

  return {
    ...b,
    maSach: b.maSach || '',
    tenSach: b.tenSach || 'Tài liệu',
    tacGia: authorName,
    maTG: authorCode,
    nhaXuatBan: pubName,
    maNXB: pubCode,
    theLoai: b.loai || b.theLoai || 'Khoa Học Máy Tính',
    loai: b.loai || b.theLoai || 'Khoa Học Máy Tính',
    namXuatBan: b.namXB || b.namXuatBan || 2024,
    namXB: b.namXB || b.namXuatBan || 2024,
    donGia: b.donGia !== undefined ? b.donGia : 100000,
    soQuyen: b.soLuong !== undefined ? b.soLuong : (b.soQuyen !== undefined ? b.soQuyen : 5),
    soLuong: b.soLuong !== undefined ? b.soLuong : (b.soQuyen !== undefined ? b.soQuyen : 5),
    luotMuon: b.luotMuon || 0,
    moTa: b.moTa || '',
    trangThai: b.trangThaiS !== undefined ? b.trangThaiS : (b.trangThai !== false),
    trangThaiS: b.trangThaiS !== undefined ? b.trangThaiS : (b.trangThai !== false),
    hinhAnh: b.hinhAnh || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmDKfEDPCe0WmvcOnGfXYFmgYKb3L8fOMPSXvcKxvNypu3yQAnJwl9WIp01kK0GhIGJ16lqsWwSrApp2JU0MpfAQy55H_63VG0UF9ZkXWQeV4L4R0i-rWq2iUb9kTzwwXz_W39HK7ML6Bz0H6gHq1W9GDwBSTfvVFtr84aB-kgWU3JNnUZYG0I1hBt3XZX4Gk6gE2Nz2BlTpchOk552ctxYLJfd_HrNMTNDvBK2K8'
  };
}

export default {
  name: 'BookManagementView',
  data() {
    return {
      books: [],
      publishers: [],
      authors: [],
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
        maTG: 'TG-01',
        nhaXuatBan: 'NXB Bách Khoa',
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
  },
  computed: {
    filteredBooks() {
      let result = [...this.books];

      if (this.filters.search.trim()) {
        const q = this.filters.search.toLowerCase().trim();
        result = result.filter(b => 
          (b.tenSach && b.tenSach.toLowerCase().includes(q)) ||
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
    async loadBooks() {
      try {
        const [booksRes, nxbRes, tgRes] = await Promise.allSettled([
          sachApi.getAll({ all: 'true' }),
          nhaxbApi.getAll(),
          tacGiaApi.getAll()
        ]);

        if (nxbRes.status === 'fulfilled' && nxbRes.value.data) {
          this.publishers = nxbRes.value.data;
        }
        if (tgRes.status === 'fulfilled' && tgRes.value.data) {
          this.authors = tgRes.value.data;
        }

        if (booksRes.status === 'fulfilled' && booksRes.value.data) {
          this.books = booksRes.value.data.map(normalizeBook);
          LibraryStore.saveBooks(this.books);
        } else {
          this.books = LibraryStore.getBooks().map(normalizeBook);
        }
      } catch (e) {
        this.books = LibraryStore.getBooks().map(normalizeBook);
      }

      if (this.books.length > 0 && !this.selectedBook) {
        this.selectBook(this.books[0]);
      }
    },
    selectBook(book) {
      this.selectedBook = book;
      this.isEditing = true;
      this.form = {
        maSach: book.maSach,
        tenSach: book.tenSach,
        maNXB: book.maNXB || 'NXB-01',
        maTG: book.maTG || 'TG-01',
        nhaXuatBan: book.nhaXuatBan || 'NXB Bách Khoa',
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
      const defaultNxb = (this.publishers && this.publishers.length > 0) ? this.publishers[0].maNXB : 'NXB-01';
      const defaultNxbName = (this.publishers && this.publishers.length > 0) ? this.publishers[0].tenNXB : 'NXB Bách Khoa Hà Nội';
      const defaultTg = (this.authors && this.authors.length > 0) ? this.authors[0].maTG : 'TG-01';
      this.form = {
        maSach: autoId,
        tenSach: '',
        maNXB: defaultNxb,
        maTG: defaultTg,
        nhaXuatBan: defaultNxbName,
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
    async saveBook() {
      if (!this.form.tenSach) {
        showToast('Vui lòng nhập tên sách!', 'error');
        return;
      }

      const foundNxb = (this.publishers || []).find(p => p.maNXB === this.form.maNXB);
      const payload = {
        maSach: this.form.maSach,
        tenSach: this.form.tenSach,
        loai: this.form.theLoai,
        namXB: parseInt(this.form.namXuatBan) || 2024,
        donGia: parseInt(this.form.donGia) || 100000,
        soLuong: parseInt(this.form.soQuyen) || 5,
        maNXB: this.form.maNXB || (foundNxb ? foundNxb.maNXB : 'NXB-01'),
        nhaXuatBan: foundNxb ? foundNxb.tenNXB : (this.form.nhaXuatBan || 'NXB Bách Khoa Hà Nội'),
        maTG: this.form.maTG || 'TG-01',
        moTa: this.form.moTa || '',
        hinhAnh: this.form.hinhAnh || '',
        trangThaiS: this.form.trangThai !== false
      };

      try {
        if (this.isEditing) {
          await sachApi.update(this.form.maSach, payload);
          showToast(`Đã cập nhật thông tin sách "${this.form.tenSach}"`, 'success');
        } else {
          await sachApi.create(payload);
          showToast(`Đã thêm mới tài liệu "${this.form.tenSach}" vào kho lưu trữ!`, 'success');
        }
        await this.loadBooks();
      } catch (err) {
        showPopup({
          title: 'LỖI THAO TÁC',
          message: err.message || 'Không thể lưu thông tin sách!',
          type: 'error',
          confirmText: 'ĐÃ HIỂU'
        });
      }
    },
    async toggleBookStatus(book) {
      const nextStatus = book.trangThai === false ? true : false;
      try {
        await sachApi.update(book.maSach, { trangThaiS: nextStatus });
        book.trangThai = nextStatus;
        showToast(`Đã chuyển trạng thái "${book.tenSach}" sang ${nextStatus ? 'HIỂN THỊ' : 'NGỪNG PHỤC VỤ'}`, 'info');
      } catch (err) {
        showPopup({
          title: 'KHÔNG THỂ CẬP NHẬT TRẠNG THÁI',
          message: err.message || 'Thao tác không thành công!',
          type: 'warning',
          confirmText: 'ĐÃ HIỂU'
        });
      }
    },
    async deleteBook(book) {
      const confirmed = await showConfirm({
        title: 'XÁC NHẬN XÓA TÀI LIỆU',
        message: `Bạn có chắc chắn muốn xóa tài liệu <strong>"${book.tenSach}"</strong> khỏi hệ thống?`,
        type: 'danger',
        icon: 'delete',
        confirmText: 'XÁC NHẬN XÓA',
        cancelText: 'HỦY'
      });

      if (confirmed) {
        try {
          await sachApi.delete(book.maSach);
          showToast(`Đã xóa tài liệu "${book.tenSach}" thành công!`, 'success');
          await this.loadBooks();
        } catch (err) {
          // Hiển thị rõ lỗi ràng buộc toàn vẹn từ Backend (HTTP 400)
          showPopup({
            title: 'RÀNG BUỘC TOÀN VẸN',
            message: err.message || 'Không thể xóa sách đang nằm trong phiếu mượn của độc giả!',
            type: 'error',
            confirmText: 'ĐÃ HIỂU'
          });
        }
      }
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

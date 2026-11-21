/**
 * BOOK LENDING SYSTEM - AUTHOR MANAGEMENT LOGIC (frontend/js/authorManagement.js)
 * Adheres strictly to CDM: TACGIA (1) --- sáng tác (N) --- SACH
 * No raw technical IDs displayed on UI (sequential indexing STT 01, 02...).
 */

import { tacGiaApi, sachApi } from './api.js';
import { getAdminSidebar, getAdminHeader, getAdminFooter } from './components.js';

export default {
  name: 'AuthorManagement',
  data() {
    return {
      authors: [
        {
          _id: '1',
          maTG: 'TG-01',
          tenTG: 'Alex Xu',
          soTacPham: 4,
          capNhat: '20/11/2026',
          trangThai: 'ĐANG LIÊN KẾT'
        },
        {
          _id: '2',
          maTG: 'TG-02',
          tenTG: 'Robert C. Martin',
          soTacPham: 3,
          capNhat: '20/11/2026',
          trangThai: 'ĐANG LIÊN KẾT'
        },
        {
          _id: '3',
          maTG: 'TG-03',
          tenTG: 'Vũ Quốc Đạt',
          soTacPham: 2,
          capNhat: '20/11/2026',
          trangThai: 'ĐANG LIÊN KẾT'
        },
        {
          _id: '4',
          maTG: 'TG-04',
          tenTG: 'Ian Goodfellow',
          soTacPham: 2,
          capNhat: '20/11/2026',
          trangThai: 'ĐANG LIÊN KẾT'
        }
      ],
      allBooks: [],
      searchQuery: '',
      sortBy: 'AZ', // 'AZ' | 'ZA' | 'COUNT_DESC'
      activeFilterTab: 'ALL', // 'ALL' | 'HAS_BOOKS' | 'NO_BOOKS'
      currentPage: 1,
      pageSize: 10,
      showModal: false,
      modalMode: 'add', // 'add' | 'edit'
      modalData: {
        _id: '',
        maTG: '',
        tenTG: ''
      },
      showBooksModal: false,
      selectedAuthor: null,
      authorBooks: [],
      loadingBooks: false,
      loading: false,
      toast: {
        show: false,
        message: '',
        type: 'info'
      }
    };
  },
  computed: {
    totalAuthors() {
      return this.authors.length;
    },
    totalWorks() {
      return this.authors.reduce((sum, a) => sum + (a.soTacPham || 0), 0);
    },
    hasBooksCount() {
      return this.authors.filter(a => (a.soTacPham || 0) > 0).length;
    },
    noBooksCount() {
      return this.authors.filter(a => (a.soTacPham || 0) === 0).length;
    },
    filteredAuthors() {
      const q = this.searchQuery.trim().toLowerCase();
      let result = this.authors.filter(a => {
        // Tab filter
        if (this.activeFilterTab === 'HAS_BOOKS' && (a.soTacPham || 0) <= 0) return false;
        if (this.activeFilterTab === 'NO_BOOKS' && (a.soTacPham || 0) > 0) return false;

        // Search query
        if (q) {
          const matchName = (a.tenTG || '').toLowerCase().includes(q);
          if (!matchName) return false;
        }

        return true;
      });

      // Sort
      if (this.sortBy === 'AZ') {
        result.sort((a, b) => (a.tenTG || '').localeCompare(b.tenTG || '', 'vi'));
      } else if (this.sortBy === 'ZA') {
        result.sort((a, b) => (b.tenTG || '').localeCompare(a.tenTG || '', 'vi'));
      } else if (this.sortBy === 'COUNT_DESC') {
        result.sort((a, b) => (b.soTacPham || 0) - (a.soTacPham || 0));
      }

      return result;
    },
    totalPages() {
      return Math.ceil(this.filteredAuthors.length / this.pageSize) || 1;
    },
    paginatedAuthors() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredAuthors.slice(start, start + this.pageSize);
    }
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this._keyHandler = (e) => {
      if (e.key === 'Escape') {
        if (this.showBooksModal) this.closeBooksModal();
        if (this.showModal) this.closeModal();
      }
    };
    window.addEventListener('keydown', this._keyHandler);
  },
  beforeUnmount() {
    if (this._keyHandler) {
      window.removeEventListener('keydown', this._keyHandler);
    }
  },
  methods: {
    getAdminSidebar,
    getAdminHeader,
    getAdminFooter,
    async fetchData() {
      this.loading = true;
      try {
        const [tgRes, sachRes] = await Promise.allSettled([
          tacGiaApi.getAll(),
          sachApi.getAll({ all: 'true' })
        ]);

        let bookList = [];
        if (sachRes.status === 'fulfilled' && sachRes.value && sachRes.value.data) {
          bookList = Array.isArray(sachRes.value.data) ? sachRes.value.data : (sachRes.value.data.books || []);
        }
        this.allBooks = bookList;

        if (tgRes.status === 'fulfilled' && tgRes.value && tgRes.value.data && tgRes.value.data.length > 0) {
          this.authors = tgRes.value.data.map((item, idx) => {
            const count = bookList.filter(b => {
              const bTgCode = (b.maTG && typeof b.maTG === 'object') ? b.maTG.maTG : b.maTG;
              const bTgName = (b.maTG && typeof b.maTG === 'object') ? b.maTG.tenTG : (b.tacGia || '');
              return bTgCode === item.maTG || (bTgName && item.tenTG && bTgName.toLowerCase().includes(item.tenTG.toLowerCase()));
            }).length;

            const updated = item.updatedAt ? new Date(item.updatedAt) : new Date();
            const day = String(updated.getDate()).padStart(2, '0');
            const month = String(updated.getMonth() + 1).padStart(2, '0');
            const year = updated.getFullYear();

            return {
              _id: item._id,
              maTG: item.maTG || `TG-0${idx + 1}`,
              tenTG: item.tenTG,
              soTacPham: count > 0 ? count : (item.soTacPham || 0),
              capNhat: `${day}/${month}/${year}`,
              trangThai: (count > 0 || (item.soTacPham || 0) > 0) ? 'ĐANG LIÊN KẾT' : 'CHƯA CÓ SÁCH'
            };
          });
        }
      } catch (err) {
        console.warn('API Error, using fallback authors data:', err.message);
      } finally {
        this.loading = false;
      }
    },
    setFilterTab(tab) {
      this.activeFilterTab = tab;
      this.currentPage = 1;
    },
    handleSearch() {
      this.currentPage = 1;
    },
    handleSortChange() {
      this.currentPage = 1;
    },
    openAddModal() {
      this.modalMode = 'add';
      this.modalData = {
        _id: '',
        maTG: '',
        tenTG: ''
      };
      this.showModal = true;
    },
    openEditModal(item) {
      this.modalMode = 'edit';
      this.modalData = {
        _id: item._id,
        maTG: item.maTG,
        tenTG: item.tenTG
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async saveAuthor() {
      const ten = (this.modalData.tenTG || '').trim();

      if (!ten) {
        this.showToastMsg('Vui lòng nhập họ tên tác giả!', 'warning');
        return;
      }

      try {
        if (this.modalMode === 'add') {
          await tacGiaApi.create({ tenTG: ten });
          await this.fetchData();
          this.showToastMsg(`Đã thêm mới tác giả "${ten}" thành công!`, 'success');
        } else {
          await tacGiaApi.update(this.modalData.maTG || this.modalData._id, { tenTG: ten });
          await this.fetchData();
          this.showToastMsg(`Đã cập nhật thông tin tác giả "${ten}"!`, 'success');
        }
        this.closeModal();
      } catch (err) {
        this.showToastMsg(err.message || 'Lỗi khi lưu dữ liệu!', 'error');
      }
    },
    async deleteAuthor(item) {
      if ((item.soTacPham || 0) > 0) {
        this.showToastMsg(`RÀNG BUỘC CDM: Không thể xóa tác giả "${item.tenTG}" vì còn ${item.soTacPham} tác phẩm liên kết!`, 'error');
        return;
      }

      if (confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tác giả "${item.tenTG}"?`)) {
        try {
          await tacGiaApi.delete(item.maTG || item._id);
          await this.fetchData();
          this.showToastMsg(`Đã xóa tác giả thành công!`, 'success');
        } catch (e) {
          this.showToastMsg(e.message || 'Lỗi khi xóa tác giả!', 'error');
        }
      }
    },
    async openBooksModal(author) {
      if (!author) return;
      this.selectedAuthor = author;
      this.showBooksModal = true;
      this.loadingBooks = true;
      this.authorBooks = [];

      try {
        let books = [];
        if (author.maTG) {
          const res = await sachApi.getAll({ maTG: author.maTG, all: 'true' });
          if (res && res.data) {
            books = Array.isArray(res.data) ? res.data : (res.data.books || []);
          }
        }

        const pCode = author.maTG;
        const pName = (author.tenTG || '').trim().toLowerCase();

        let filtered = books.filter(b => {
          const bCode = (b.maTG && typeof b.maTG === 'object') ? b.maTG.maTG : b.maTG;
          const bName = (b.maTG && typeof b.maTG === 'object') ? b.maTG.tenTG : (b.tacGia || '');
          return bCode === pCode || (bName && pName && bName.trim().toLowerCase() === pName);
        });

        // Fallback to allBooks cache if query returned empty but cached books might contain it
        if (filtered.length === 0 && this.allBooks && this.allBooks.length > 0) {
          filtered = this.allBooks.filter(b => {
            const bCode = (b.maTG && typeof b.maTG === 'object') ? b.maTG.maTG : b.maTG;
            const bName = (b.maTG && typeof b.maTG === 'object') ? b.maTG.tenTG : (b.tacGia || '');
            return bCode === pCode || (bName && pName && bName.trim().toLowerCase() === pName);
          });
        }

        this.authorBooks = filtered;
      } catch (err) {
        console.warn('Lỗi khi tải sách của Tác giả, sử dụng cache:', err.message);
        if (this.allBooks) {
          const pCode = author.maTG;
          const pName = (author.tenTG || '').trim().toLowerCase();
          this.authorBooks = this.allBooks.filter(b => {
            const bCode = (b.maTG && typeof b.maTG === 'object') ? b.maTG.maTG : b.maTG;
            const bName = (b.maTG && typeof b.maTG === 'object') ? b.maTG.tenTG : (b.tacGia || '');
            return bCode === pCode || (bName && pName && bName.trim().toLowerCase() === pName);
          });
        }
      } finally {
        this.loadingBooks = false;
      }
    },
    closeBooksModal() {
      this.showBooksModal = false;
      this.selectedAuthor = null;
      this.authorBooks = [];
    },
    formatPrice(val) {
      if (!val && val !== 0) return '0 ₫';
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    },
    exportCSV() {
      let csv = "\uFEFFSTT,HỌ TÊN TÁC GIẢ,SỐ TÁC PHẨM,CẬP NHẬT,TRẠNG THÁI\n";
      this.filteredAuthors.forEach((a, idx) => {
        csv += `"${idx + 1}","${a.tenTG}","${a.soTacPham || 0}","${a.capNhat}","${a.trangThai}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `DANH_SACH_TAC_GIA_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.showToastMsg('Đã xuất danh sách Tác giả ra file CSV thành công!', 'success');
    },
    goToPage(p) {
      if (p >= 1 && p <= this.totalPages) {
        this.currentPage = p;
      }
    },
    showToastMsg(message, type = 'info') {
      this.toast = {
        show: true,
        message,
        type
      };
      setTimeout(() => {
        this.toast.show = false;
      }, 3500);
    }
  }
};

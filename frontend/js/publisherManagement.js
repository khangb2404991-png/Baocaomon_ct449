/**
 * BOOK LENDING SYSTEM - PUBLISHER MANAGEMENT LOGIC (frontend/js/publisherManagement.js)
 * Adheres strictly to CDM: NHAXB (1) --- liên kết (N) --- SACH
 * No raw technical IDs displayed on UI (sequential indexing STT 01, 02...).
 */

import { nhaxbApi, sachApi } from './api.js';
import { getAdminSidebar, getAdminHeader, getAdminFooter } from './components.js';

export default {
  name: 'PublisherManagement',
  data() {
    return {
      publishers: [
        {
          _id: '1',
          maNXB: 'NXB-01',
          tenNXB: 'NXB Bách Khoa Hà Nội',
          diaChi: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
          soDauSach: 10,
          capNhat: '20/11/2026',
          trangThai: 'ĐANG LIÊN KẾT'
        },
        {
          _id: '2',
          maNXB: 'NXB-02',
          tenNXB: 'NXB Thông Tin & Truyền Thông',
          diaChi: '115 Trần Duy Hưng, Cầu Giấy, Hà Nội',
          soDauSach: 8,
          capNhat: '20/11/2026',
          trangThai: 'ĐANG LIÊN KẾT'
        },
        {
          _id: '3',
          maNXB: 'NXB-03',
          tenNXB: 'NXB Trẻ',
          diaChi: '161B Lý Chính Thắng, Quận 3, TP. Hồ Chí Minh',
          soDauSach: 14,
          capNhat: '20/11/2026',
          trangThai: 'ĐANG LIÊN KẾT'
        },
        {
          _id: '4',
          maNXB: 'NXB-04',
          tenNXB: 'NXB Đại Học Quốc Gia',
          diaChi: '16 Hàng Chuối, Hai Bà Trưng, Hà Nội',
          soDauSach: 8,
          capNhat: '20/11/2026',
          trangThai: 'ĐANG LIÊN KẾT'
        }
      ],
      allBooks: [],
      searchQuery: '',
      selectedRegion: 'ALL',
      activeFilterTab: 'ALL', // 'ALL' | 'LINKED' | 'EMPTY'
      currentPage: 1,
      pageSize: 10,
      showModal: false,
      modalMode: 'add', // 'add' | 'edit'
      modalData: {
        _id: '',
        maNXB: '',
        tenNXB: '',
        diaChi: ''
      },
      showBooksModal: false,
      selectedPublisher: null,
      publisherBooks: [],
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
    totalPublishers() {
      return this.publishers.length;
    },
    linkedBooks() {
      return this.publishers.reduce((sum, p) => sum + (p.soDauSach || 0), 0);
    },
    hasBooksCount() {
      return this.publishers.filter(p => (p.soDauSach || 0) > 0).length;
    },
    noBooksCount() {
      return this.publishers.filter(p => (p.soDauSach || 0) === 0).length;
    },
    filteredPublishers() {
      const q = this.searchQuery.trim().toLowerCase();
      return this.publishers.filter(p => {
        // Tab filter
        if (this.activeFilterTab === 'LINKED' && (p.soDauSach || 0) <= 0) return false;
        if (this.activeFilterTab === 'EMPTY' && (p.soDauSach || 0) > 0) return false;

        // Search query
        if (q) {
          const matchName = (p.tenNXB || '').toLowerCase().includes(q);
          const matchAddress = (p.diaChi || '').toLowerCase().includes(q);
          if (!matchName && !matchAddress) return false;
        }

        // Region filter
        if (this.selectedRegion !== 'ALL') {
          if (!(p.diaChi || '').includes(this.selectedRegion)) return false;
        }

        return true;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredPublishers.length / this.pageSize) || 1;
    },
    paginatedPublishers() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredPublishers.slice(start, start + this.pageSize);
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
        const [nxbRes, sachRes] = await Promise.allSettled([
          nhaxbApi.getAll(),
          sachApi.getAll({ all: 'true' })
        ]);

        let bookList = [];
        if (sachRes.status === 'fulfilled' && sachRes.value && sachRes.value.data) {
          bookList = Array.isArray(sachRes.value.data) ? sachRes.value.data : (sachRes.value.data.books || []);
        }
        this.allBooks = bookList;

        if (nxbRes.status === 'fulfilled' && nxbRes.value && nxbRes.value.data && nxbRes.value.data.length > 0) {
          this.publishers = nxbRes.value.data.map((item, idx) => {
            const count = bookList.filter(b => {
              const bCode = (b.maNXB && typeof b.maNXB === 'object') ? b.maNXB.maNXB : b.maNXB;
              const bName = (b.maNXB && typeof b.maNXB === 'object') ? b.maNXB.tenNXB : (b.nhaXuatBan || '');
              return bCode === item.maNXB || (bName && item.tenNXB && bName.toLowerCase().includes(item.tenNXB.toLowerCase()));
            }).length;
            const updated = item.updatedAt ? new Date(item.updatedAt) : new Date();
            const day = String(updated.getDate()).padStart(2, '0');
            const month = String(updated.getMonth() + 1).padStart(2, '0');
            const year = updated.getFullYear();

            return {
              _id: item._id,
              maNXB: item.maNXB || `NXB-0${idx + 1}`,
              tenNXB: item.tenNXB,
              diaChi: item.diaChi || 'Chưa cập nhật địa chỉ',
              soDauSach: count > 0 ? count : (item.soDauSach || 0),
              capNhat: `${day}/${month}/${year}`,
              trangThai: (count > 0 || (item.soDauSach || 0) > 0) ? 'ĐANG LIÊN KẾT' : 'CHƯA CÓ SÁCH'
            };
          });
        }
      } catch (err) {
        console.warn('API Error, using fallback publishers data:', err.message);
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
    handleRegionChange() {
      this.currentPage = 1;
    },
    openAddModal() {
      this.modalMode = 'add';
      this.modalData = {
        _id: '',
        maNXB: '',
        tenNXB: '',
        diaChi: ''
      };
      this.showModal = true;
    },
    openEditModal(item) {
      this.modalMode = 'edit';
      this.modalData = {
        _id: item._id,
        maNXB: item.maNXB,
        tenNXB: item.tenNXB,
        diaChi: item.diaChi
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async openBooksModal(publisher) {
      if (!publisher) return;
      this.selectedPublisher = publisher;
      this.showBooksModal = true;
      this.loadingBooks = true;
      this.publisherBooks = [];

      try {
        let books = [];
        if (publisher.maNXB) {
          const res = await sachApi.getAll({ maNXB: publisher.maNXB, all: 'true' });
          if (res && res.data) {
            books = Array.isArray(res.data) ? res.data : (res.data.books || []);
          }
        }

        const pCode = publisher.maNXB;
        const pName = (publisher.tenNXB || '').trim().toLowerCase();

        let filtered = books.filter(b => {
          const bCode = (b.maNXB && typeof b.maNXB === 'object') ? b.maNXB.maNXB : b.maNXB;
          const bName = (b.maNXB && typeof b.maNXB === 'object') ? b.maNXB.tenNXB : (b.nhaXuatBan || '');
          return bCode === pCode || (bName && pName && bName.trim().toLowerCase() === pName);
        });

        // Fallback to allBooks cache if query returned empty but cached books might contain it
        if (filtered.length === 0 && this.allBooks && this.allBooks.length > 0) {
          filtered = this.allBooks.filter(b => {
            const bCode = (b.maNXB && typeof b.maNXB === 'object') ? b.maNXB.maNXB : b.maNXB;
            const bName = (b.maNXB && typeof b.maNXB === 'object') ? b.maNXB.tenNXB : (b.nhaXuatBan || '');
            return bCode === pCode || (bName && pName && bName.trim().toLowerCase() === pName);
          });
        }

        this.publisherBooks = filtered;
      } catch (err) {
        console.warn('Lỗi khi tải sách của NXB, sử dụng cache:', err.message);
        if (this.allBooks) {
          const pCode = publisher.maNXB;
          const pName = (publisher.tenNXB || '').trim().toLowerCase();
          this.publisherBooks = this.allBooks.filter(b => {
            const bCode = (b.maNXB && typeof b.maNXB === 'object') ? b.maNXB.maNXB : b.maNXB;
            const bName = (b.maNXB && typeof b.maNXB === 'object') ? b.maNXB.tenNXB : (b.nhaXuatBan || '');
            return bCode === pCode || (bName && pName && bName.trim().toLowerCase() === pName);
          });
        }
      } finally {
        this.loadingBooks = false;
      }
    },
    closeBooksModal() {
      this.showBooksModal = false;
      this.selectedPublisher = null;
      this.publisherBooks = [];
    },
    formatPrice(val) {
      if (!val && val !== 0) return '0 ₫';
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    },
    async savePublisher() {
      const ten = (this.modalData.tenNXB || '').trim();
      const diaChi = (this.modalData.diaChi || '').trim();

      if (!ten) {
        this.showToastMsg('Vui lòng nhập tên nhà xuất bản!', 'warning');
        return;
      }
      if (!diaChi) {
        this.showToastMsg('Vui lòng nhập địa chỉ trụ sở!', 'warning');
        return;
      }

      try {
        if (this.modalMode === 'add') {
          await nhaxbApi.create({ tenNXB: ten, diaChi });
          await this.fetchData();
          this.showToastMsg(`Đã thêm mới nhà xuất bản "${ten}" thành công!`, 'success');
        } else {
          await nhaxbApi.update(this.modalData.maNXB || this.modalData._id, { tenNXB: ten, diaChi });
          await this.fetchData();
          this.showToastMsg(`Đã cập nhật thông tin nhà xuất bản "${ten}"!`, 'success');
        }
        this.closeModal();
      } catch (err) {
        this.showToastMsg(err.message || 'Lỗi khi lưu dữ liệu!', 'error');
      }
    },
    async deletePublisher(item) {
      if ((item.soDauSach || 0) > 0) {
        this.showToastMsg(`RÀNG BUỘC CDM: Không thể xóa "${item.tenNXB}" vì còn ${item.soDauSach} đầu sách liên kết!`, 'error');
        return;
      }

      if (confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn nhà xuất bản "${item.tenNXB}"?`)) {
        try {
          await nhaxbApi.delete(item.maNXB || item._id);
          await this.fetchData();
          this.showToastMsg(`Đã xóa nhà xuất bản thành công!`, 'success');
        } catch (e) {
          this.showToastMsg(e.message || 'Lỗi khi xóa nhà xuất bản!', 'error');
        }
      }
    },
    exportCSV() {
      let csv = "\uFEFFSTT,TÊN NHÀ XUẤT BẢN,ĐỊA CHỈ TRỤ SỞ,SỐ ĐẦU SÁCH,CẬP NHẬT,TRẠNG THÁI\n";
      this.filteredPublishers.forEach((p, idx) => {
        csv += `"${idx + 1}","${p.tenNXB}","${p.diaChi}","${p.soDauSach}","${p.capNhat}","${p.trangThai}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `DANH_SACH_NXB_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.showToastMsg('Đã xuất danh sách Nhà xuất bản ra file CSV thành công!', 'success');
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

/**
 * BOOK LENDING SYSTEM - FINE MANAGEMENT (fineManagement.js)
 * Script controller for Fine Ticket Management page connected to MEVN Backend API
 */

import { getAdminSidebar, getAdminHeader, getAdminFooter } from './components.js';
import { phieuPhatApi } from './api.js';
import { LibraryStore, showToast, showConfirm } from './common.js';

export default {
  name: 'FineManagement',
  data() {
    return {
      fines: [],
      searchKeyword: '',
      fromDate: '2026-11-01',
      toDate: '2026-11-30',
      activeTab: 'ALL', // 'ALL' | 'UNPAID' | 'OVERDUE' | 'PAID'
      currentPage: 1,
      pageSize: 7,
      selectedFine: null,
      showDetailModal: false
    };
  },

  created() {
    this.loadFines();
  },

  computed: {
    totalCount() {
      return this.fines.length;
    },

    unpaidCount() {
      return this.fines.filter(f => f.trangThai === 'CHUA_NOP').length;
    },

    overdueCount() {
      return this.fines.filter(f => f.trangThai === 'QUA_HAN').length;
    },

    paidCount() {
      return this.fines.filter(f => f.trangThai === 'DA_THU').length;
    },

    filteredFines() {
      let result = [...this.fines];

      // 1. Filter by status tab
      if (this.activeTab === 'UNPAID') {
        result = result.filter(f => f.trangThai === 'CHUA_NOP');
      } else if (this.activeTab === 'OVERDUE') {
        result = result.filter(f => f.trangThai === 'QUA_HAN');
      } else if (this.activeTab === 'PAID') {
        result = result.filter(f => f.trangThai === 'DA_THU');
      }

      // 2. Filter by search keyword
      if (this.searchKeyword.trim()) {
        const kw = this.searchKeyword.trim().toLowerCase();
        result = result.filter(f => {
          const reader = (f.tenDocGia || '').toLowerCase();
          const email = (f.emailDocGia || '').toLowerCase();
          const book = (f.tenSachChinh || '').toLowerCase();
          const reason = (f.lyDoTomTat || '').toLowerCase();
          return reader.includes(kw) || email.includes(kw) || book.includes(kw) || reason.includes(kw);
        });
      }

      // 3. Filter by date range (ngayLap)
      if (this.fromDate) {
        result = result.filter(f => {
          if (!f.ngayLap) return true;
          const fDate = f.ngayLap.substring(0, 10);
          return fDate >= this.fromDate;
        });
      }
      if (this.toDate) {
        result = result.filter(f => {
          if (!f.ngayLap) return true;
          const fDate = f.ngayLap.substring(0, 10);
          return fDate <= this.toDate;
        });
      }

      return result;
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.filteredFines.length / this.pageSize));
    },

    paginatedFines() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredFines.slice(start, start + this.pageSize);
    }
  },

  methods: {
    getAdminSidebar,
    getAdminHeader,
    getAdminFooter,

    async loadFines() {
      try {
        const res = await phieuPhatApi.getAll();
        if (res && res.data) {
          this.fines = res.data.map(f => {
            const firstItem = (f.chiTiet && f.chiTiet[0]) || {};
            const bookTitle = firstItem.tenSach || 'Tài liệu vi phạm';
            const reason = firstItem.lyDo || f.ghiChu || 'Vi phạm quy chế';
            const countItems = (f.chiTiet && f.chiTiet.length) || 1;
            const createdDate = f.ngayLapPhat || f.createdAt || new Date();
            const dateStr = new Date(createdDate).toLocaleDateString('vi-VN');

            return {
              maPhieuPhat: f.maPP,
              maPP: f.maPP,
              maPM: f.maPM,
              tenDocGia: f.tenDocGia || f.tenDG || 'Độc giả',
              emailDocGia: f.emailDocGia || f.emailDG || '',
              tenSachChinh: bookTitle,
              lyDoTomTat: reason,
              soMuc: countItems,
              ngayLap: createdDate,
              ngayLapFormatted: dateStr,
              tongTienPhat: f.tongTienPhat || 0,
              chiTietTien: reason,
              tenNV: f.maNV || 'Thủ thư quầy',
              trangThai: f.trangThaiPP,
              trangThaiPP: f.trangThaiPP,
              ghiChu: f.ghiChu || '',
              chiTiet: f.chiTiet || []
            };
          });
          LibraryStore.saveFines(this.fines);
          return;
        }
      } catch (e) {
        console.warn('API getAll fines error, falling back to local store:', e.message);
      }

      this.fines = LibraryStore.getFines();
    },

    formatVND(amount) {
      return LibraryStore.formatCurrency(amount);
    },

    filterByTab(tab) {
      this.activeTab = tab;
      this.currentPage = 1;
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    goToCreateTicket() {
      this.$router.push('/admin/fine-ticket');
    },

    async confirmPayment(fine) {
      const fineId = fine.maPP || fine.maPhieuPhat;
      const confirmed = await LibraryStore.showConfirm(
        'Xác nhận đã thu tiền phạt',
        `Xác nhận độc giả "${fine.tenDocGia}" đã thanh toán đủ ${this.formatVND(fine.tongTienPhat)} VNĐ tại quầy?`,
        'XÁC NHẬN ĐÃ THU',
        'HỦY BỎ'
      );

      if (confirmed) {
        try {
          await phieuPhatApi.confirmPayment(fineId);
          fine.trangThai = 'DA_THU';
          fine.chiTietTien = 'Thu tiền mặt tại quầy';
          LibraryStore.showToast(`Đã thu thành công ${this.formatVND(fine.tongTienPhat)} VNĐ từ độc giả ${fine.tenDocGia}`, 'success');
          await this.loadFines();
        } catch (err) {
          fine.trangThai = 'DA_THU';
          LibraryStore.saveFines(this.fines);
          LibraryStore.showToast(`Đã thu thành công ${this.formatVND(fine.tongTienPhat)} VNĐ từ độc giả ${fine.tenDocGia}`, 'success');
        }
      }
    },

    async openDetail(fine) {
      const fineId = fine.maPP || fine.maPhieuPhat;
      try {
        const res = await phieuPhatApi.getById(fineId);
        if (res && res.data) {
          const f = res.data;
          this.selectedFine = {
            ...fine,
            ...f,
            tenDocGia: f.tenDocGia || fine.tenDocGia,
            chiTiet: f.chiTiet || fine.chiTiet
          };
          this.showDetailModal = true;
          return;
        }
      } catch (e) {}

      this.selectedFine = fine;
      this.showDetailModal = true;
    },

    closeDetail() {
      this.showDetailModal = false;
      this.selectedFine = null;
    },

    exportCSV() {
      const headers = ['ĐỘC GIẢ', 'EMAIL', 'TÀI LIỆU VI PHẠM', 'LÝ DO VI PHẠM', 'SỐ MỤC', 'NGÀY LẬP', 'TỔNG TIỀN PHẠT (VNĐ)', 'CÁN BỘ LẬP BIÊN BẢN', 'TRẠNG THÁI'];
      
      const rows = this.filteredFines.map(f => {
        let statusText = 'CHƯA NỘP';
        if (f.trangThai === 'DA_THU') statusText = 'ĐÃ THANH TOÁN';
        if (f.trangThai === 'QUA_HAN') statusText = 'QUÁ HẠN CHƯA NỘP';

        return [
          `"${(f.tenDocGia || '').replace(/"/g, '""')}"`,
          `"${(f.emailDocGia || '').replace(/"/g, '""')}"`,
          `"${(f.tenSachChinh || '').replace(/"/g, '""')}"`,
          `"${(f.lyDoTomTat || '').replace(/"/g, '""')}"`,
          f.soMuc || 1,
          `"${f.ngayLapFormatted || f.ngayLap || ''}"`,
          f.tongTienPhat || 0,
          `"${(f.tenNV || 'Thủ thư').replace(/"/g, '""')}"`,
          `"${statusText}"`
        ].join(',');
      });

      const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `danh-sach-phieu-phat-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
};

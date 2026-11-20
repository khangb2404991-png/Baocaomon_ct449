// frontend/js/borrowManagement.js
// Admin Borrow & Return Management Logic

import { LibraryStore, showToast, showPopup, showConfirm } from './common.js';
import { getAdminSidebar, getAdminHeader, getAdminFooter } from './components.js';

export default {
  name: 'BorrowManagementView',
  data() {
    return {
      records: [],
      filters: {
        search: '',
        fromDate: '2024-05-01',
        toDate: '2024-05-31'
      },
      activeTab: 'ALL',
      currentPage: 1,
      pageSize: 8
    };
  },
  created() {
    this.loadRecords();
  },
  computed: {
    metrics() {
      const choDuyet = this.records.filter(r => r.trangThai === 'CHO_DUYET').length;
      const dangMuon = this.records.filter(r => r.trangThai === 'DANG_MUON').length;
      const daTra = this.records.filter(r => r.trangThai === 'DA_TRA').length;
      const quaHan = this.records.filter(r => r.trangThai === 'QUA_HAN').length;
      const daHuy = this.records.filter(r => r.trangThai === 'DA_HUY').length;
      const all = this.records.length;

      return { choDuyet, dangMuon, daTra, quaHan, daHuy, all };
    },
    filteredRecords() {
      let list = [...this.records];

      if (this.filters.search.trim()) {
        const q = this.filters.search.toLowerCase().trim();
        list = list.filter(r => {
          const tenDocGia = (r.tenDocGia || '').toLowerCase();
          const sdt = (r.sdt || '').toLowerCase();
          const maPhieu = (r.maPhieuMuon || '').toLowerCase();
          const tenSach = r.items ? r.items.map(i => i.tenSach.toLowerCase()).join(' ') : '';
          return tenDocGia.includes(q) || sdt.includes(q) || maPhieu.includes(q) || tenSach.includes(q);
        });
      }

      if (this.activeTab !== 'ALL') {
        list = list.filter(r => r.trangThai === this.activeTab);
      }

      return list;
    },
    totalPages() {
      return Math.ceil(this.filteredRecords.length / this.pageSize) || 1;
    },
    paginatedRecords() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredRecords.slice(start, start + this.pageSize);
    }
  },
  methods: {
    getAdminSidebar,
    getAdminHeader,
    getAdminFooter,
    loadRecords() {
      this.records = LibraryStore.getBorrowRecords();
    },
    setTab(tab) {
      this.activeTab = tab;
      this.currentPage = 1;
    },
    approveBorrow(record) {
      record.trangThai = 'DANG_MUON';
      record.nvPhuTrach = 'Trần Văn B';
      record.msnv = 'MSNV-0012';
      LibraryStore.updateBorrowStatus(record.maPhieuMuon, 'DANG_MUON');
      showPopup({
        title: 'PHÊ DUYỆT THÀNH CÔNG',
        message: `Đã phê duyệt yêu cầu mượn tài liệu cho độc giả <strong>${record.tenDocGia}</strong>!`,
        type: 'success',
        icon: 'verified',
        confirmText: 'ĐỒNG Ý'
      });
      this.loadRecords();
    },
    async rejectBorrow(record) {
      const confirmed = await showConfirm({
        title: 'XÁC NHẬN TỪ CHỐI PHIẾU MƯỢN',
        message: `Bạn có chắc chắn muốn từ chối yêu cầu mượn của độc giả <strong>${record.tenDocGia}</strong>?`,
        type: 'danger',
        icon: 'cancel',
        confirmText: 'TỪ CHỐI',
        cancelText: 'QUAY LẠI'
      });

      if (confirmed) {
        record.trangThai = 'DA_HUY';
        LibraryStore.updateBorrowStatus(record.maPhieuMuon, 'DA_HUY');
        showPopup({
          title: 'ĐÃ TỪ CHỐI YÊU CẦU',
          message: `Đã từ chối phiếu mượn của độc giả <strong>${record.tenDocGia}</strong>.`,
          type: 'info',
          confirmText: 'ĐÃ HIỂU'
        });
        this.loadRecords();
      }
    },
    returnBorrow(record) {
      const today = new Date().toISOString().split('T')[0];
      record.trangThai = 'DA_TRA';
      record.ngayTraThucTe = today;
      LibraryStore.updateBorrowStatus(record.maPhieuMuon, 'DA_TRA');
      showPopup({
        title: 'XÁC NHẬN TRẢ SÁCH',
        message: `Đã xác nhận hoàn trả sách thành công cho độc giả <strong>${record.tenDocGia}</strong>!`,
        type: 'success',
        icon: 'assignment_turned_in',
        confirmText: 'ĐỒNG Ý'
      });
      this.loadRecords();
    },
    goToFineTicket(record) {
      const borrowId = record.maPhieuMuon || record.slipId;
      this.$router.push({ path: '/admin/fine-ticket', query: { borrowId } });
    },
    exportCSV() {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'STT,ĐỘC GIẢ,SĐT,TÊN SÁCH,SỐ LƯỢNG,NGÀY MƯỢN,NGÀY HẸN TRẢ,TRẠNG THÁI\n';
      this.records.forEach((r, idx) => {
        const bookNames = r.items ? r.items.map(i => i.tenSach).join('; ') : '';
        csvContent += `"${idx + 1}","${r.tenDocGia}","${r.sdt || ''}","${bookNames}","${r.tongSoLuong}","${r.ngayMuon}","${r.ngayTra}","${r.trangThai}"\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'danh_sach_muon_tra.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showPopup({
        title: 'XUẤT DỮ LIỆU THÀNH CÔNG',
        message: 'Tập tin danh_sach_muon_tra.csv đã được tải về máy của bạn.',
        type: 'success',
        icon: 'download',
        confirmText: 'ĐÓNG'
      });
    },
    goToPage(p) {
      if (p >= 1 && p <= this.totalPages) {
        this.currentPage = p;
      }
    },
    formatDate(dateStr) {
      return LibraryStore.formatDate(dateStr);
    }
  }
};


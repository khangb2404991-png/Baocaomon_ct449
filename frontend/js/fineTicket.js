/**
 * BOOK LENDING SYSTEM - FINE TICKET CONTROLLER (fineTicket.js)
 * Separated JavaScript logic for FineTicket.vue
 * Strictly adheres to Stitch AI design (design/phieuphat.html) and CDM schema
 */

import { LibraryStore, showToast, showPopup, showConfirm } from './common.js';

export default {
  name: 'FineTicketView',
  data() {
    return {
      borrowRecords: [],
      selectedBorrowId: '',
      borrowRecord: null,
      readerEmail: 'an.nguyen@email.com',
      overdueDays: 6,
      violations: [],
      newBookTitle: '',
      newReason: 'Trả trễ hạn (06 ngày)',
      newFineAmount: 30000,
      ticketData: {
        currentTimestamp: '',
        staffName: 'Trần Minh Quân',
        staffRole: 'Thủ thư',
        trangThai: 'CHUA_NOP',
        ghiChu: 'Độc giả mang sách trả trễ hạn. Phát sinh biên bản thẩm định hư hại/quá hạn theo quy chế thư viện.'
      }
    };
  },
  computed: {
    summaryItemCount() {
      return String(this.violations.length).padStart(2, '0') + ' MỤC';
    },
    summaryLateFee() {
      return this.violations
        .filter(v => v.reasonType === 'late')
        .reduce((sum, v) => sum + (Number(v.amount) || 0), 0);
    },
    summaryDamageFee() {
      return this.violations
        .filter(v => v.reasonType !== 'late')
        .reduce((sum, v) => sum + (Number(v.amount) || 0), 0);
    },
    grandTotal() {
      return this.summaryLateFee + this.summaryDamageFee;
    },
    availableBooks() {
      if (!this.borrowRecord || !this.borrowRecord.items) return [];
      return this.borrowRecord.items.map(item => item.tenSach || item.tensach || 'Tài liệu');
    }
  },
  created() {
    this.updateCurrentTimestamp();
    this.loadBorrowData();
  },
  watch: {
    '$route.query.borrowId'() {
      this.loadBorrowData();
    }
  },
  methods: {
    updateCurrentTimestamp() {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      this.ticketData.currentTimestamp = `${dd}/${mm}/${yyyy} (${hh}:${min}:${ss})`;

      // Current staff name from store
      const currentStaff = LibraryStore.getCurrentStaff();
      if (currentStaff && currentStaff.name) {
        this.ticketData.staffName = currentStaff.name;
        this.ticketData.staffRole = currentStaff.title || currentStaff.role || 'Thủ thư';
      }
    },

    loadBorrowData() {
      this.borrowRecords = LibraryStore.getBorrowRecords();
      const queryId = this.$route.query.borrowId;

      let target = null;
      if (queryId) {
        target = this.borrowRecords.find(r => r.maPhieuMuon === queryId || r.slipId === queryId);
      }
      if (!target) {
        // Fallback: Ưu tiên tìm phiếu quá hạn hoặc đang mượn
        target = this.borrowRecords.find(r => r.trangThai === 'QUA_HAN') ||
                 this.borrowRecords.find(r => r.trangThai === 'DANG_MUON') ||
                 this.borrowRecords[0];
      }

      if (target) {
        this.borrowRecord = { ...target };
        this.selectedBorrowId = target.maPhieuMuon || target.slipId;

        // Lookup reader email
        const readers = LibraryStore.getReaders();
        const reader = readers.find(rd => rd.maDocGia === target.maDocGia || rd.id === target.readerId);
        if (reader && reader.email) {
          this.readerEmail = reader.email;
        } else if (target.email) {
          this.readerEmail = target.email;
        } else {
          const cleanName = (target.tenDocGia || 'docgia')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/\s+/g, '.');
          this.readerEmail = `${cleanName}@email.com`;
        }

        // Calculate overdue days
        if (target.ngayTra) {
          const due = new Date(target.ngayTra);
          const now = new Date();
          const diffDays = Math.ceil((now - due) / (1000 * 60 * 60 * 24));
          this.overdueDays = diffDays > 0 ? diffDays : (target.trangThai === 'QUA_HAN' ? 6 : 0);
        } else {
          this.overdueDays = target.trangThai === 'QUA_HAN' ? 6 : 0;
        }

        // Populate available books
        const books = this.availableBooks;
        if (books.length > 0) {
          this.newBookTitle = books[0];
        }

        // Initialize default violations strictly based on target's borrowed books
        this.violations = [];
        const primaryBook = books[0] || (target.items && target.items[0] ? target.items[0].tenSach : 'Tài liệu mượn');

        if (this.overdueDays > 0) {
          const lateDaysPad = String(this.overdueDays).padStart(2, '0');
          this.violations.push({
            id: 1,
            bookTitle: primaryBook,
            reason: `TRẢ QUÁ HẠN (${lateDaysPad} NGÀY x 5.000 VNĐ/NGÀY)`,
            reasonType: 'late',
            amount: this.overdueDays * 5000,
            note: 'Định mức: 5.000 VNĐ / ngày trễ'
          });
        }

        if (books.length > 1) {
          this.violations.push({
            id: 2,
            bookTitle: books[1],
            reason: 'LÀM HỎNG TRANG BÌA (30% GIÁ TRỊ SÁCH)',
            reasonType: 'damage',
            amount: 45000,
            note: 'Biên bản thẩm định trang bìa'
          });
        } else if (this.overdueDays === 0) {
          this.violations.push({
            id: 1,
            bookTitle: primaryBook,
            reason: 'LÀM HỎNG TRANG BÌA (30% GIÁ TRỊ SÁCH)',
            reasonType: 'damage',
            amount: 45000,
            note: 'Biên bản thẩm định hiện trường'
          });
        }

        this.newReason = `Trả trễ hạn (${String(this.overdueDays || 6).padStart(2, '0')} ngày)`;
        this.autoFillFine(this.newReason);
        this.ticketData.ghiChu = `Độc giả ${target.tenDocGia || 'mượn tài liệu'} trả sách trễ hạn. Phát sinh biên bản thẩm định hư hại/quá hạn theo quy chế thư viện.`;
      }
    },

    autoFillFine(reason) {
      if (!reason) return;
      if (reason.includes('trễ') || reason.includes('hạn')) {
        this.newFineAmount = this.overdueDays > 0 ? this.overdueDays * 5000 : 30000;
      } else if (reason.includes('rách') || reason.includes('hỏng')) {
        this.newFineAmount = 45000;
      } else if (reason.includes('mất')) {
        this.newFineAmount = 150000;
      } else {
        this.newFineAmount = 20000;
      }
    },

    addNewViolationRow() {
      if (!this.newBookTitle) {
        showToast('Vui lòng chọn tài liệu cần lập phạt!', 'warning');
        return;
      }
      const amount = Number(this.newFineAmount) || 0;
      if (amount <= 0) {
        showToast('Vui lòng nhập số tiền phạt hợp lệ (lớn hơn 0 VNĐ)!', 'warning');
        return;
      }

      const isLate = this.newReason.toLowerCase().includes('trễ') || this.newReason.toLowerCase().includes('hạn');
      this.violations.push({
        id: Date.now(),
        bookTitle: this.newBookTitle,
        reason: this.newReason.toUpperCase(),
        reasonType: isLate ? 'late' : 'damage',
        amount: amount,
        note: 'Phát sinh từ biên bản hiện trường'
      });

      showToast(`Đã thêm mục phạt cho "${this.newBookTitle}"`, 'success');
    },

    removeViolationRow(index) {
      this.violations.splice(index, 1);
    },

    submitFine() {
      if (!this.borrowRecord) {
        showToast('Không có thông tin phiếu mượn để lập phạt!', 'error');
        return;
      }
      if (this.violations.length === 0) {
        showToast('Vui lòng thêm ít nhất một mục vi phạm trước khi lập phiếu phạt!', 'warning');
        return;
      }

      const fineData = {
        maPhieuMuon: this.borrowRecord.maPhieuMuon || this.borrowRecord.slipId,
        tenDocGia: this.borrowRecord.tenDocGia || this.borrowRecord.readerName,
        emailDocGia: this.readerEmail,
        sdtDocGia: this.borrowRecord.sdt || this.borrowRecord.readerPhone || '',
        ngayMuon: this.borrowRecord.ngayMuon,
        ngayTra: this.borrowRecord.ngayTra,
        ngayLap: new Date().toISOString(),
        ngayLapFormatted: this.ticketData.currentTimestamp,
        tenNV: this.ticketData.staffName,
        trangThai: this.ticketData.trangThai,
        ghiChu: this.ticketData.ghiChu,
        soLuongViPham: this.violations.length,
        tienPhatTre: this.summaryLateFee,
        tienPhatHong: this.summaryDamageFee,
        tongTienPhat: this.grandTotal,
        chiTiet: this.violations
      };

      const res = LibraryStore.createFine(fineData);

      if (res.success) {
        showPopup({
          title: 'LẬP PHIẾU PHẠT THÀNH CÔNG',
          message: `Đã phát hành biên bản phiếu phạt cho độc giả <strong>${fineData.tenDocGia}</strong>.<br><br>` +
                   `<span class="text-[#8e9192]">Tổng số mục vi phạm:</span> <strong class="text-white">${fineData.soLuongViPham} mục</strong><br>` +
                   `<span class="text-[#8e9192]">Tổng tiền phạt:</span> <strong class="text-[#e22718] font-bold text-[16px]">${this.formatVND(this.grandTotal)} VNĐ</strong><br>` +
                   `<span class="text-[#8e9192]">Trạng thái:</span> <strong class="text-white">${this.ticketData.trangThai === 'DA_THU' ? 'ĐÃ THU TIỀN TẠI QUẦY' : 'CHƯA NỘP (GHI NỢ HỆ THỐNG)'}</strong>`,
          type: 'success',
          icon: 'gavel',
          confirmText: 'VỀ QUẢN LÝ MƯỢN TRẢ',
          onConfirm: () => {
            this.$router.push('/admin/borrows');
          }
        });
      } else {
        showToast('Có lỗi xảy ra khi lưu phiếu phạt!', 'error');
      }
    },

    goBack() {
      this.$router.push('/admin/borrows');
    },

    formatVND(number) {
      if (typeof number !== 'number') number = Number(number) || 0;
      return new Intl.NumberFormat('vi-VN').format(number);
    },

    formatDate(dateStr) {
      return LibraryStore.formatDate(dateStr);
    }
  }
};

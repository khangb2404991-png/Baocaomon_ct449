// frontend/js/readerManagement.js
// Admin Reader, Staff & Quick Borrow Management Component Logic connected to MEVN Backend API

import { docGiaApi, nhanVienApi, phieuMuonApi } from './api.js';
import { LibraryStore, showToast, showPopup, showConfirm } from './common.js';
import { getAdminSidebar, getAdminHeader, getAdminFooter } from './components.js';

export default {
  name: 'ReaderManagementView',
  data() {
    return {
      activeTab: 'tab-docgia',
      
      // Tab 1: Readers
      readers: [],
      readerSearch: '',
      readerFilter: 'all',
      readerPage: 1,
      readerPageSize: 4,
      isAddReaderModalOpen: false,
      readerForm: {
        maDocGia: 'DG-1092',
        hoLot: '',
        ten: '',
        phai: 'Nam',
        ngaySinh: '2002-05-15',
        dienThoai: '',
        email: '',
        diaChi: '',
        trangThai: 'HOAT_DONG'
      },

      // Tab 2: Quick Borrow Approval
      borrowRecords: [],
      borrowFilter: 'all',
      borrowSearch: '',

      // Tab 3: Staff Management
      staffList: [],
      staffSearch: '',
      staffFilter: 'all',
      staffRoleFilter: 'all',
      staffPage: 1,
      staffPageSize: 4,
      isStaffModalOpen: false,
      isEditingStaff: false,
      employeeForm: {
        msnv: '',
        hoTenNV: '',
        emailNV: '',
        password: 'Admin@2024Secure',
        chucVu: 'ThuThu',
        soDienThoai: '',
        diaChi: '',
        trangThai: 1
      }
    };
  },
  created() {
    this.loadAllData();
    if (this.$route && (this.$route.path === '/admin/staff' || this.$route.path === '/quanlynhansu' || this.$route.path === '/staff-management' || (this.$route.query && (this.$route.query.tab === 'staff' || this.$route.query.tab === 'nhanvien')))) {
      this.activeTab = 'tab-nhanvien';
    }
  },
  watch: {
    '$route.path'(newPath) {
      if (newPath === '/admin/staff' || newPath === '/quanlynhansu' || newPath === '/staff-management') {
        this.activeTab = 'tab-nhanvien';
      } else if (newPath === '/admin/readers' || newPath === '/quanlydocgia' || newPath === '/reader-management') {
        if (this.$route.query && (this.$route.query.tab === 'staff' || this.$route.query.tab === 'nhanvien')) {
          this.activeTab = 'tab-nhanvien';
        } else if (this.$route.query && (this.$route.query.tab === 'borrow' || this.$route.query.tab === 'muontra')) {
          this.activeTab = 'tab-muontra';
        } else {
          this.activeTab = 'tab-docgia';
        }
      }
    }
  },
  computed: {
    // Readers filtering & pagination
    filteredReaders() {
      let list = [...this.readers];
      if (this.readerSearch.trim()) {
        const q = this.readerSearch.toLowerCase().trim();
        list = list.filter(r => 
          (r.hoLot && r.hoLot.toLowerCase().includes(q)) ||
          (r.ten && r.ten.toLowerCase().includes(q)) ||
          (r.dienThoai && r.dienThoai.toLowerCase().includes(q)) ||
          (r.email && r.email.toLowerCase().includes(q))
        );
      }
      if (this.readerFilter === 'active') {
        list = list.filter(r => r.trangThai === 'HOAT_DONG');
      } else if (this.readerFilter === 'locked') {
        list = list.filter(r => r.trangThai === 'BI_KHOA');
      }
      return list;
    },
    totalReaderPages() {
      return Math.ceil(this.filteredReaders.length / this.readerPageSize) || 1;
    },
    paginatedReaders() {
      const start = (this.readerPage - 1) * this.readerPageSize;
      return this.filteredReaders.slice(start, start + this.readerPageSize);
    },

    // Borrow records filtering
    pendingBorrowCount() {
      return this.borrowRecords.filter(r => r.trangThai === 'CHO_DUYET').length;
    },
    filteredBorrows() {
      let list = [...this.borrowRecords];
      if (this.borrowSearch.trim()) {
        const q = this.borrowSearch.toLowerCase().trim();
        list = list.filter(r => 
          (r.tenDocGia && r.tenDocGia.toLowerCase().includes(q))
        );
      }
      if (this.borrowFilter === 'pending') {
        list = list.filter(r => r.trangThai === 'CHO_DUYET');
      } else if (this.borrowFilter === 'borrowing') {
        list = list.filter(r => r.trangThai === 'DANG_MUON');
      } else if (this.borrowFilter === 'overdue') {
        list = list.filter(r => r.trangThai === 'QUA_HAN');
      } else if (this.borrowFilter === 'returned') {
        list = list.filter(r => r.trangThai === 'DA_TRA');
      }
      return list;
    },

    // Staff filtering & pagination
    filteredStaff() {
      let list = (this.staffList || []).filter(s => !!s);
      if (this.staffSearch && this.staffSearch.trim()) {
        const q = this.staffSearch.toLowerCase().trim();
        list = list.filter(s => 
          ((s.hoTenNV || s.hoten || '').toLowerCase().includes(q)) ||
          ((s.soDienThoai || s.phone || '').toLowerCase().includes(q)) ||
          ((s.diaChi || s.address || '').toLowerCase().includes(q)) ||
          ((s.chucVu || s.chucvu || '').toLowerCase().includes(q))
        );
      }
      if (this.staffFilter === 'active') {
        list = list.filter(s => s.trangThai === 1 || s.status === 1);
      } else if (this.staffFilter === 'inactive') {
        list = list.filter(s => s.trangThai === 0 || s.status === 0);
      }

      if (this.staffRoleFilter === 'admin') {
        list = list.filter(s => (s.chucVu === 'Admin' || s.chucvu === 'Admin'));
      } else if (this.staffRoleFilter === 'thuthu') {
        list = list.filter(s => (s.chucVu === 'ThuThu' || s.chucvu === 'ThuThu'));
      }
      return list;
    },
    totalStaffPages() {
      return Math.ceil(this.filteredStaff.length / this.staffPageSize) || 1;
    },
    paginatedStaff() {
      const start = (this.staffPage - 1) * this.staffPageSize;
      return this.filteredStaff.slice(start, start + this.staffPageSize).filter(s => !!s);
    }
  },
  methods: {
    getAdminSidebar,
    getAdminHeader,
    getAdminFooter,
    async loadAllData() {
      // 1. Tải độc giả
      try {
        const docGiaRes = await docGiaApi.getAll();
        if (docGiaRes && docGiaRes.data) {
          this.readers = docGiaRes.data.map(d => {
            const parts = (d.tenDG || '').split(' ');
            const ten = parts.length > 1 ? parts.pop() : (d.tenDG || '');
            const hoLot = parts.join(' ');

            return {
              maDG: d.maDG,
              maDocGia: d.maDG,
              hoLot: d.hoLot || hoLot,
              ten: ten,
              phai: d.gioiTinhDG || 'Nam',
              ngaySinh: d.ngaySinhDG || '',
              dienThoai: d.dienThoai || '',
              email: d.emailDG || '',
              diaChi: d.diaChi || '',
              trangThai: d.trangThaiDG ? 'HOAT_DONG' : 'BI_KHOA'
            };
          });
        }
      } catch (e) {
        this.readers = LibraryStore.getReaders();
      }

      // 2. Tải phiếu mượn
      try {
        const pmRes = await phieuMuonApi.getAll();
        if (pmRes && pmRes.data) {
          this.borrowRecords = pmRes.data.map(r => ({
            maPhieuMuon: r.maPM,
            maPM: r.maPM,
            tenDocGia: r.tenDG || 'Độc giả',
            ngayMuon: r.ngayMuon ? new Date(r.ngayMuon).toLocaleDateString('vi-VN') : '',
            ngayTra: r.hanTra ? new Date(r.hanTra).toLocaleDateString('vi-VN') : '',
            trangThai: r.trangThaiPM,
            tongSoLuong: (r.chiTiet || []).reduce((s, it) => s + (it.soLuongMuon || 1), 0),
            items: r.chiTiet
          }));
        }
      } catch (e) {
        this.borrowRecords = LibraryStore.getBorrowRecords();
      }

      // 3. Tải nhân sự
      try {
        const nvRes = await nhanVienApi.getAll();
        if (nvRes && nvRes.data) {
          this.staffList = nvRes.data.map(n => ({
            msnv: n.maNV,
            maNV: n.maNV,
            hoTenNV: n.tenNV,
            hoten: n.tenNV,
            emailNV: n.emailNV,
            email: n.emailNV,
            chucVu: (n.chucVuNV && n.chucVuNV.toLowerCase().includes('admin')) ? 'Admin' : 'ThuThu',
            chucvu: (n.chucVuNV && n.chucVuNV.toLowerCase().includes('admin')) ? 'Admin' : 'ThuThu',
            chucVuNV: n.chucVuNV || 'Thủ thư',
            soDienThoai: n.soDienThoai || '',
            phone: n.soDienThoai || '',
            diaChi: n.diaChi || '',
            address: n.diaChi || '',
            status: n.trangThaiNV ? 1 : 0,
            trangThai: n.trangThaiNV ? 1 : 0
          }));
        }
      } catch (e) {
        this.staffList = LibraryStore.getStaff();
      }
    },

    switchTab(tab) {
      this.activeTab = tab;
      if (tab === 'tab-nhanvien' && this.$route && this.$route.path !== '/admin/staff') {
        this.$router.replace('/admin/staff').catch(() => {});
      } else if (tab === 'tab-docgia' && this.$route && this.$route.path !== '/admin/readers') {
        this.$router.replace('/admin/readers').catch(() => {});
      }
    },

    // Tab 1: Reader actions
    async toggleLockDocGia(reader) {
      const readerId = reader.maDG || reader.maDocGia;
      try {
        const res = await docGiaApi.toggleLock(readerId);
        reader.trangThai = res.trangThaiDG ? 'HOAT_DONG' : 'BI_KHOA';
        showToast(res.message || `Đã cập nhật trạng thái độc giả ${reader.hoLot} ${reader.ten}`, 'info');
      } catch (err) {
        showToast(err.message || 'Không thể đổi trạng thái tài khoản!', 'error');
      }
    },

    openAddReaderModal() {
      const autoId = 'DG-' + Math.floor(1000 + Math.random() * 9000);
      this.readerForm = {
        maDocGia: autoId,
        hoLot: '',
        ten: '',
        phai: 'Nam',
        ngaySinh: '2002-05-15',
        dienThoai: '',
        email: '',
        diaChi: '',
        trangThai: 'HOAT_DONG'
      };
      this.isAddReaderModalOpen = true;
    },

    closeAddReaderModal() {
      this.isAddReaderModalOpen = false;
    },

    saveNewReader() {
      if (!this.readerForm.hoLot || !this.readerForm.ten || !this.readerForm.dienThoai) {
        showToast('Vui lòng điền họ tên và số điện thoại!', 'error');
        return;
      }
      this.readers.unshift({ ...this.readerForm });
      LibraryStore.saveReaders(this.readers);
      showToast(`Đã cấp mới thẻ cho độc giả ${this.readerForm.hoLot} ${this.readerForm.ten} thành công!`, 'success');
      this.closeAddReaderModal();
    },

    exportReadersCSV() {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'HỌ LÓT,TÊN,NGÀY SINH,PHÁI,ĐIỆN THOẠI,EMAIL,ĐỊA CHỈ,TRẠNG THÁI\n';
      this.readers.forEach(r => {
        csvContent += `"${r.hoLot}","${r.ten}","${r.ngaySinh}","${r.phai}","${r.dienThoai}","${r.email || ''}","${r.diaChi}","${r.trangThai}"\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'danh_sach_doc_gia.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Đã xuất danh sách độc giả ra CSV!', 'success');
    },

    // Tab 2: Borrow quick actions
    filterMuonTra(status) {
      this.borrowFilter = status;
    },

    async approveBorrow(rec) {
      const maPM = rec.maPM || rec.maPhieuMuon;
      try {
        await phieuMuonApi.approve(maPM);
        showToast(`Đã duyệt mượn sách cho độc giả ${rec.tenDocGia}!`, 'success');
        await this.loadAllData();
      } catch (e) {
        showToast(e.message || 'Không thể duyệt mượn!', 'error');
      }
    },

    async rejectBorrow(rec) {
      const maPM = rec.maPM || rec.maPhieuMuon;
      const confirmed = await showConfirm({
        title: 'XÁC NHẬN TỪ CHỐI PHIẾU',
        message: `Bạn có chắc chắn muốn từ chối yêu cầu mượn của độc giả <strong>${rec.tenDocGia}</strong>?`,
        type: 'danger',
        icon: 'cancel',
        confirmText: 'TỪ CHỐI',
        cancelText: 'QUAY LẠI'
      });

      if (confirmed) {
        try {
          await phieuMuonApi.reject(maPM, 'Thủ thư từ chối yêu cầu');
          showToast(`Đã từ chối phiếu mượn của độc giả ${rec.tenDocGia}`, 'info');
          await this.loadAllData();
        } catch (e) {
          showToast(e.message || 'Không thể từ chối phiếu!', 'error');
        }
      }
    },

    async confirmReturn(rec) {
      const maPM = rec.maPM || rec.maPhieuMuon;
      try {
        await phieuMuonApi.returnBook(maPM);
        showToast(`Đã xác nhận hoàn trả sách cho độc giả ${rec.tenDocGia}!`, 'success');
        await this.loadAllData();
      } catch (e) {
        showToast(e.message || 'Không thể xác nhận trả sách!', 'error');
      }
    },

    goToFineTicket(rec) {
      const borrowId = rec.maPM || rec.maPhieuMuon;
      this.$router.push({ path: '/admin/fine-ticket', query: { borrowId } });
    },

    async approveAllPending() {
      const pending = this.borrowRecords.filter(r => r.trangThai === 'CHO_DUYET');
      if (pending.length === 0) {
        showToast('Không có yêu cầu nào đang chờ duyệt', 'info');
        return;
      }

      for (const r of pending) {
        try {
          await phieuMuonApi.approve(r.maPM || r.maPhieuMuon);
        } catch (e) {}
      }

      showToast(`Đã phê duyệt các yêu cầu chờ mượn!`, 'success');
      await this.loadAllData();
    },

    // Tab 3: Staff actions
    generateMSNV() {
      this.employeeForm.msnv = 'NV-' + String(Math.floor(100 + Math.random() * 900)).padStart(4, '0');
    },

    openAddStaffModal() {
      this.isEditingStaff = false;
      this.generateMSNV();
      this.employeeForm = {
        msnv: this.employeeForm.msnv,
        hoTenNV: '',
        emailNV: `staff${Math.floor(100 + Math.random() * 900)}@email.com`,
        password: 'Admin@2024Secure',
        chucVu: 'ThuThu',
        soDienThoai: '',
        diaChi: '',
        trangThai: 1
      };
      this.isStaffModalOpen = true;
    },

    openEditStaffModal(staff) {
      this.isEditingStaff = true;
      this.employeeForm = {
        msnv: staff.msnv || staff.maNV,
        hoTenNV: staff.hoTenNV || staff.hoten || '',
        emailNV: staff.emailNV || staff.email || '',
        password: staff.password || 'Admin@2024Secure',
        chucVu: staff.chucVu || staff.chucvu || 'ThuThu',
        soDienThoai: staff.soDienThoai || staff.phone || '',
        diaChi: staff.diaChi || staff.address || '',
        trangThai: staff.trangThai !== undefined ? staff.trangThai : (staff.status !== undefined ? staff.status : 1)
      };
      this.isStaffModalOpen = true;
    },

    closeStaffModal() {
      this.isStaffModalOpen = false;
      this.isEditingStaff = false;
    },

    async deleteStaff(staff) {
      const name = staff.hoTenNV || staff.hoten || 'cán bộ';
      const msnv = staff.msnv || staff.maNV;
      const confirmed = await showConfirm({
        title: 'XÁC NHẬN XÓA NHÂN SỰ',
        message: `Bạn có chắc chắn muốn xóa cán bộ nhân sự <strong>${name}</strong> khỏi hệ thống?`,
        type: 'danger',
        icon: 'delete',
        confirmText: 'XÓA NHÂN SỰ',
        cancelText: 'QUAY LẠI'
      });

      if (confirmed) {
        try {
          await nhanVienApi.delete(msnv);
          showToast(`Đã xóa nhân viên ${name} thành công!`, 'success');
          await this.loadAllData();
        } catch (e) {
          showToast(e.message || 'Không thể xóa cán bộ nhân sự này!', 'error');
        }
      }
    },

    exportStaffCSV() {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'HỌ TÊN,CHỨC VỤ,ĐIỆN THOẠI,ĐỊA CHỈ,TRẠNG THÁI\n';
      this.staffList.forEach(s => {
        const name = s.hoTenNV || s.hoten || '';
        const role = (s.chucVu === 'Admin' || s.chucvu === 'Admin') ? 'Quản trị viên' : 'Thủ thư';
        const phone = s.soDienThoai || s.phone || '';
        const addr = s.diaChi || s.address || '';
        const status = (s.trangThai === 1 || s.status === 1) ? 'Đang làm việc' : 'Đã nghỉ việc';
        csvContent += `"${name}","${role}","${phone}","${addr}","${status}"\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'danh_sach_nhan_su.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Đã xuất danh sách nhân sự ra CSV!', 'success');
    },

    async saveEmployee() {
      if (!this.employeeForm.hoTenNV || !this.employeeForm.soDienThoai) {
        showToast('Vui lòng nhập họ tên và số điện thoại nhân viên!', 'error');
        return;
      }

      if (!this.employeeForm.msnv) {
        this.generateMSNV();
      }

      const payload = {
        maNV: this.employeeForm.msnv,
        tenNV: this.employeeForm.hoTenNV,
        emailNV: this.employeeForm.emailNV || `${this.employeeForm.msnv.toLowerCase()}@email.com`,
        matKhauNV: this.employeeForm.password,
        chucVuNV: this.employeeForm.chucVu === 'Admin' ? 'Quản trị viên' : 'Thủ thư',
        soDienThoai: this.employeeForm.soDienThoai,
        diaChi: this.employeeForm.diaChi,
        trangThaiNV: this.employeeForm.trangThai === 1
      };

      try {
        if (this.isEditingStaff) {
          await nhanVienApi.update(this.employeeForm.msnv, payload);
          showToast(`Đã cập nhật hồ sơ cán bộ ${this.employeeForm.hoTenNV}`, 'success');
        } else {
          await nhanVienApi.create(payload);
          showToast(`Đã khởi tạo cán bộ nhân sự ${this.employeeForm.hoTenNV}!`, 'success');
        }
        await this.loadAllData();
        this.closeStaffModal();
      } catch (err) {
        showToast(err.message || 'Không thể lưu hồ sơ nhân sự!', 'error');
      }
    },

    formatDate(d) {
      return LibraryStore.formatDate(d);
    }
  }
};

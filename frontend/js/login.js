/**
 * BOOK LENDING SYSTEM - AUTHENTICATION MODULE (LOGIN)
 * Component Logic
 */

import { LibraryStore, showToast, showPopup } from './common.js';
import { getAuthHeader, getFooter } from './components.js';

export default {
  name: 'LoginView',
  data() {
    return {
      activeTab: 'login',
      isStaff: false,
      loginForm: {
        identifier: '',
        password: '',
        rememberMe: false
      },
      showPassword: false,
      regForm: {
        hoTen: '',
        holot: '',
        ten: '',
        ngaysinh: '',
        phai: 'Nam',
        dienthoai: '',
        email: '',
        diachi: '',
        password: '',
        agreed: true
      },
      showRegPassword: false
    };
  },
  computed: {
    identifierLabel() {
      return this.isStaff ? 'TÀI KHOẢN NHÂN VIÊN' : 'EMAIL HOẶC SỐ ĐIỆN THOẠI';
    },
    identifierPlaceholder() {
      return this.isStaff ? 'Nhập tài khoản nhân viên' : 'Nhập email hoặc SĐT';
    },
    roleStatusDesc() {
      return this.isStaff 
        ? 'Tư cách: Nhân viên / Quản trị viên' 
        : 'Tư cách: Độc giả';
    }
  },
  methods: {
    getAuthHeader,
    getFooter,
    switchAuthTab(tab) {
      this.activeTab = tab;
    },
    toggleStaffRole(val) {
      this.isStaff = typeof val === 'boolean' ? val : !this.isStaff;
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleRegPassword() {
      this.showRegPassword = !this.showRegPassword;
    },
    quickLogin(type) {
      if (type === 'admin') {
        this.loginForm.identifier = 'admin';
        this.loginForm.password = 'admin123';
        this.isStaff = true;
      } else {
        this.loginForm.identifier = 'user';
        this.loginForm.password = '123456';
        this.isStaff = false;
      }
      this.handleLogin();
    },
    handleLogin() {
      if (!this.loginForm.identifier || !this.loginForm.password) {
        showPopup({
          title: 'THIẾU THÔNG TIN',
          message: 'Vui lòng nhập đầy đủ tên đăng nhập (email hoặc số điện thoại) và mật khẩu.',
          type: 'warning',
          confirmText: 'ĐÃ HIỂU'
        });
        return;
      }

      const res = LibraryStore.authenticate(this.loginForm.identifier, this.loginForm.password);
      if (!res.success) {
        showPopup({
          title: 'ĐĂNG NHẬP THẤT BẠI',
          message: res.message || 'Tên đăng nhập hoặc mật khẩu không chính xác!',
          type: 'error',
          confirmText: 'THỬ LẠI'
        });
        return;
      }

      const roleTitle = res.role === 'admin' ? 'THỦ THƯ TRƯỞNG / QUẢN TRỊ VIÊN' : 'ĐỘC GIẢ HỆ THỐNG';
      showPopup({
        title: 'ĐĂNG NHẬP THÀNH CÔNG',
        message: `Chào mừng <strong>${res.user.hoTen}</strong><br><span class="text-[#8e9192]">Vai trò:</span> <span class="text-[#1c69d4] font-bold">${roleTitle}</span>.`,
        type: 'success',
        icon: 'login',
        autoClose: 1400,
        confirmText: 'VÀO HỆ THỐNG',
        onConfirm: () => {
          this.$router.push(res.redirect || (res.role === 'admin' ? '/admin/books' : '/home'));
        }
      }).then(() => {
        this.$router.push(res.redirect || (res.role === 'admin' ? '/admin/books' : '/home'));
      });
    },
    handleRegister() {
      const hoTen = (this.regForm.hoTen || `${this.regForm.holot || ''} ${this.regForm.ten || ''}`).trim();
      const password = (this.regForm.password || '').trim();
      const dienthoai = (this.regForm.dienthoai || '').trim();

      // Kiểm tra các trường bắt buộc theo yêu cầu: họ tên, password, số điện thoại
      if (!hoTen || !password || !dienthoai) {
        showPopup({
          title: 'THIẾU THÔNG TIN BẮT BUỘC',
          message: 'Vui lòng điền đầy đủ các thông tin bắt buộc: <strong>Họ và tên</strong>, <strong>Mật khẩu</strong> và <strong>Số điện thoại</strong> (*)!',
          type: 'warning',
          confirmText: 'ĐÃ HIỂU'
        });
        return;
      }

      const res = LibraryStore.registerReader({
        hoTen: hoTen,
        holot: this.regForm.holot,
        ten: this.regForm.ten,
        ngaysinh: this.regForm.ngaysinh,
        phai: this.regForm.phai || 'Nam',
        dienthoai: dienthoai,
        email: this.regForm.email,
        diachi: this.regForm.diachi,
        password: password
      });

      if (res.success) {
        showPopup({
          title: 'ĐĂNG KÝ TÀI KHOẢN THÀNH CÔNG',
          message: `Chúc mừng bạn đã tạo tài khoản độc giả thành công!<br><br><span class="text-[#8e9192]">Họ và tên:</span> <strong class="text-white">${hoTen}</strong><br><span class="text-[#8e9192]">Số điện thoại đăng nhập:</span> <strong class="text-[#1c69d4]">${dienthoai}</strong><br><span class="text-[#8e9192]">Mật khẩu:</span> <span class="font-mono text-white">${password}</span>`,
          type: 'success',
          confirmText: 'ĐĂNG NHẬP NGAY',
          onConfirm: () => {
            this.switchAuthTab('login');
            this.loginForm.identifier = dienthoai;
            this.loginForm.password = password;
            this.isStaff = false;
          }
        });
      } else {
        showPopup({
          title: 'ĐĂNG KÝ THẤT BẠI',
          message: res.message || 'Không thể tạo tài khoản mới!',
          type: 'error',
          confirmText: 'THỬ LẠI'
        });
      }
    }
  }
};

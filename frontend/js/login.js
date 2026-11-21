/**
 * BOOK LENDING SYSTEM - AUTHENTICATION MODULE (LOGIN)
 * Component Logic connected to MEVN Backend API
 */

import { authApi } from './api.js';
import { LibraryStore, showToast, showPopup } from './common.js';
import { getAuthHeader, getFooter } from './components.js';

export default {
  name: 'LoginView',
  data() {
    return {
      activeTab: 'login',
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
      return 'EMAIL HOẶC SỐ ĐIỆN THOẠI';
    },
    identifierPlaceholder() {
      return 'Nhập email hoặc SĐT đăng nhập';
    }
  },
  methods: {
    getAuthHeader,
    getFooter,
    switchAuthTab(tab) {
      this.activeTab = tab;
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleRegPassword() {
      this.showRegPassword = !this.showRegPassword;
    },
    async handleLogin() {
      if (!this.loginForm.identifier || !this.loginForm.password) {
        showPopup({
          title: 'THIẾU THÔNG TIN',
          message: 'Vui lòng nhập đầy đủ tên đăng nhập (email) và mật khẩu.',
          type: 'warning',
          confirmText: 'ĐÃ HIỂU'
        });
        return;
      }

      try {
        const res = await authApi.login(this.loginForm.identifier.trim(), this.loginForm.password.trim());

        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('user', JSON.stringify(res.user));

          // Đồng bộ với LibraryStore để tương thích các thành phần hiện hữu
          if (res.role === 'NHANVIEN') {
            LibraryStore.setCurrentStaff(res.user);
          } else {
            LibraryStore.setCurrentUser(res.user);
          }

          const roleTitle = res.role === 'NHANVIEN' ? 'THỦ THƯ TRƯỞNG / QUẢN TRỊ VIÊN' : 'ĐỘC GIẢ HỆ THỐNG';
          const userName = res.user.tenNV || res.user.tenDG || res.user.name || 'Người dùng';

          showPopup({
            title: 'ĐĂNG NHẬP THÀNH CÔNG',
            message: `Chào mừng <strong>${userName}</strong><br><span class="text-[#8e9192]">Vai trò:</span> <span class="text-[#1c69d4] font-bold">${roleTitle}</span>.`,
            type: 'success',
            icon: 'login',
            autoClose: 1400,
            confirmText: 'VÀO HỆ THỐNG',
            onConfirm: () => {
              if (res.role === 'NHANVIEN') {
                this.$router.push('/admin/books');
              } else {
                this.$router.push('/home');
              }
            }
          }).then(() => {
            if (res.role === 'NHANVIEN') {
              this.$router.push('/admin/books');
            } else {
              this.$router.push('/home');
            }
          });
        }
      } catch (err) {
        showPopup({
          title: 'ĐĂNG NHẬP THẤT BẠI',
          message: err.message || 'Tên đăng nhập hoặc mật khẩu không chính xác!',
          type: 'error',
          confirmText: 'THỬ LẠI'
        });
      }
    },
    async handleRegister() {
      const hoTen = (this.regForm.hoTen || `${this.regForm.holot || ''} ${this.regForm.ten || ''}`).trim();
      const password = (this.regForm.password || '').trim();
      const email = (this.regForm.email || '').trim();
      const dienthoai = (this.regForm.dienthoai || '').trim();

      // Kiểm tra các trường bắt buộc
      if (!hoTen || !password || !email) {
        showPopup({
          title: 'THIẾU THÔNG TIN BẮT BUỘC',
          message: 'Vui lòng điền đầy đủ các thông tin bắt buộc: <strong>Họ và tên</strong>, <strong>Email</strong> và <strong>Mật khẩu</strong> (*)!',
          type: 'warning',
          confirmText: 'ĐÃ HIỂU'
        });
        return;
      }

      try {
        const payload = {
          tenDG: hoTen,
          hoLot: this.regForm.holot,
          emailDG: email,
          matKhauDG: password,
          ngaySinhDG: this.regForm.ngaysinh,
          gioiTinhDG: this.regForm.phai || 'Nam',
          dienThoai: dienthoai,
          diaChi: this.regForm.diachi
        };

        const res = await authApi.register(payload);

        showPopup({
          title: 'ĐĂNG KÝ TÀI KHOẢN THÀNH CÔNG',
          message: `Chúc mừng bạn đã tạo tài khoản độc giả thành công!<br><br><span class="text-[#8e9192]">Họ và tên:</span> <strong class="text-white">${hoTen}</strong><br><span class="text-[#8e9192]">Email đăng nhập:</span> <strong class="text-[#1c69d4]">${email}</strong><br><span class="text-[#8e9192]">Mật khẩu:</span> <span class="font-mono text-white">${password}</span>`,
          type: 'success',
          confirmText: 'ĐĂNG NHẬP NGAY',
          onConfirm: () => {
            this.switchAuthTab('login');
            this.loginForm.identifier = email;
            this.loginForm.password = password;
          }
        });
      } catch (err) {
        showPopup({
          title: 'ĐĂNG KÝ THẤT BẠI',
          message: err.message || 'Không thể tạo tài khoản mới!',
          type: 'error',
          confirmText: 'THỬ LẠI'
        });
      }
    }
  }
};

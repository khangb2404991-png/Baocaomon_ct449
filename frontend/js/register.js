// frontend/js/register.js
// Registration Page Component Logic connected to MEVN Backend API

import { authApi } from './api.js';
import { LibraryStore, showToast, showPopup } from './common.js';
import { getAuthHeader, getFooter } from './components.js';

export default {
  name: 'RegisterView',
  data() {
    return {
      form: {
        hoTen: '',
        holot: '',
        ten: '',
        ngaysinh: '',
        phai: 'Nam',
        dienthoai: '',
        email: '',
        diachi: '',
        password: '',
        confirmAccurate: true
      },
      showPassword: false,
      loading: false
    };
  },
  methods: {
    getAuthHeader,
    getFooter,
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleRegister() {
      const hoTen = (this.form.hoTen || `${this.form.holot || ''} ${this.form.ten || ''}`).trim();
      const password = (this.form.password || '').trim();
      const email = (this.form.email || '').trim();
      const dienthoai = (this.form.dienthoai || '').trim();

      // Kiểm tra 3 trường bắt buộc: họ tên, password, email
      if (!hoTen || !password || !email) {
        showPopup({
          title: 'THIẾU THÔNG TIN BẮT BUỘC',
          message: 'Vui lòng nhập đầy đủ các thông tin bắt buộc: <strong>Họ và tên</strong>, <strong>Mật khẩu</strong> và <strong>Email</strong> (*)!',
          type: 'warning',
          confirmText: 'ĐÃ HIỂU'
        });
        return;
      }

      this.loading = true;

      try {
        const payload = {
          tenDG: hoTen,
          hoLot: this.form.holot,
          emailDG: email,
          matKhauDG: password,
          ngaySinhDG: this.form.ngaysinh,
          gioiTinhDG: this.form.phai || 'Nam',
          dienThoai: dienthoai,
          diaChi: this.form.diachi
        };

        const result = await authApi.register(payload);
        this.loading = false;

        showPopup({
          title: 'ĐĂNG KÝ TÀI KHOẢN THÀNH CÔNG',
          message: `Chúc mừng bạn đã tạo thẻ độc giả thành công!<br><br><span class="text-[#8e9192]">Họ và tên:</span> <strong class="text-white">${hoTen}</strong><br><span class="text-[#8e9192]">Email đăng nhập:</span> <strong class="text-[#1c69d4]">${email}</strong><br><span class="text-[#8e9192]">Mật khẩu:</span> <span class="font-mono text-white">${password}</span>`,
          type: 'success',
          confirmText: 'ĐĂNG NHẬP NGAY',
          onConfirm: () => {
            this.$router.push('/login');
          }
        });
      } catch (err) {
        this.loading = false;
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

// frontend/js/register.js
// Registration Page Component Logic

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
    handleRegister() {
      const hoTen = (this.form.hoTen || `${this.form.holot || ''} ${this.form.ten || ''}`).trim();
      const password = (this.form.password || '').trim();
      const dienthoai = (this.form.dienthoai || '').trim();

      // Kiểm tra 3 trường bắt buộc: họ tên, password, số điện thoại
      if (!hoTen || !password || !dienthoai) {
        showPopup({
          title: 'THIẾU THÔNG TIN BẮT BUỘC',
          message: 'Vui lòng nhập đầy đủ các thông tin bắt buộc: <strong>Họ và tên</strong>, <strong>Mật khẩu</strong> và <strong>Số điện thoại</strong> (*)!',
          type: 'warning',
          confirmText: 'ĐÃ HIỂU'
        });
        return;
      }

      this.loading = true;

      setTimeout(() => {
        const result = LibraryStore.registerReader({
          hoTen: hoTen,
          holot: this.form.holot,
          ten: this.form.ten,
          ngaysinh: this.form.ngaysinh,
          phai: this.form.phai || 'Nam',
          dienthoai: dienthoai,
          email: this.form.email,
          diachi: this.form.diachi,
          password: password
        });

        this.loading = false;

        if (result.success) {
          showPopup({
            title: 'ĐĂNG KÝ TÀI KHOẢN THÀNH CÔNG',
            message: `Chúc mừng bạn đã tạo thẻ độc giả thành công!<br><br><span class="text-[#8e9192]">Họ và tên:</span> <strong class="text-white">${hoTen}</strong><br><span class="text-[#8e9192]">Số điện thoại đăng nhập:</span> <strong class="text-[#1c69d4]">${dienthoai}</strong><br><span class="text-[#8e9192]">Mật khẩu:</span> <span class="font-mono text-white">${password}</span>`,
            type: 'success',
            confirmText: 'ĐĂNG NHẬP NGAY',
            onConfirm: () => {
              this.$router.push('/login');
            }
          });
        } else {
          showPopup({
            title: 'ĐĂNG KÝ THẤT BẠI',
            message: result.message || 'Không thể tạo tài khoản mới!',
            type: 'error',
            confirmText: 'THỬ LẠI'
          });
        }
      }, 400);
    }
  }
};


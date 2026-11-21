<template>
  <div class="min-h-screen bg-[#131313] text-[#e2e2e2] flex flex-col justify-between selection:bg-[#353535] selection:text-white">
    <!-- Header gọi từ hàm getAuthHeader() để đồng bộ -->
    <div v-html="getAuthHeader()"></div>

    <!-- Main Registration Viewport -->
    <main class="w-full bg-[#131313] min-h-[calc(100vh-64px)] flex flex-col justify-center items-center py-8 px-4">
      <div class="w-full max-w-[540px] flex flex-col">
        <div class="w-full bg-[#131313] border border-[#3c3c3c] rounded-none relative">
          <!-- Signature M-Stripe Flush Identifier -->
          <div class="flex h-[3px] w-full bg-[#0e0e0e]">
            <div class="w-16 h-full bg-[#0066b1]"></div>
            <div class="w-16 h-full bg-[#1c69d4]"></div>
            <div class="w-16 h-full bg-[#e22718]"></div>
            <div class="flex-1 h-full bg-[#1c69d4]"></div>
          </div>

          <div class="p-8">
            <!-- Header Title -->
            <div class="flex items-center justify-between mb-4">
              <h1 class="font-headline-md text-[16px] font-bold uppercase tracking-[1px] text-white">
                XÁC THỰC NGƯỜI DÙNG
              </h1>
            </div>

            <!-- Tabs Navigation -->
            <div class="border-b border-[#3c3c3c] flex items-center mb-6">
              <router-link 
                to="/login" 
                class="font-mono-data-md text-[11px] text-[#7e7e7e] uppercase py-3 flex-1 text-center cursor-pointer hover:text-white transition-colors">
                →] ĐĂNG NHẬP
              </router-link>
              <div class="font-mono-data-md text-[11px] text-white uppercase py-3 flex-1 text-center border-b-2 border-white relative font-semibold bg-[#1a1a1a]/40">
                :: ĐĂNG KÝ ĐỘC GIẢ
              </div>
            </div>

            <!-- Registration Mode Notice -->
            <div class="bg-[#0e0e0e] border border-[#262626] p-3 mb-5 flex items-center justify-between">
              <div class="flex flex-col text-left">
                <span class="font-mono-data-md text-[11px] text-[#bbbbbb] font-bold uppercase tracking-wider block">ĐĂNG KÝ THÀNH VIÊN</span>
                <span class="font-body-md text-[12px] text-[#7e7e7e]">Tư cách tài khoản: Độc giả thư viện</span>
              </div>
            </div>

            <!-- Reader Registration Form -->
            <form @submit.prevent="handleRegister" class="space-y-4" id="reader-registration-form">
              <!-- Họ và tên (Bắt buộc *) -->
              <div>
                <label class="font-mono-data-md text-[11px] text-[#bbbbbb] tracking-wider uppercase block mb-1.5 font-bold" for="hoten">
                  HỌ VÀ TÊN *
                </label>
                <input 
                  v-model="form.hoTen"
                  class="font-mono-data-md text-[14px] bg-[#0e0e0e] border border-[#3c3c3c] text-white p-3 w-full rounded-none focus:border-white focus:outline-none placeholder-[#7e7e7e] transition-colors" 
                  id="hoten" 
                  placeholder="Nhập họ và tên đầy đủ (VD: Nguyễn Văn An)..." 
                  required 
                  type="text">
              </div>

              <!-- Date of Birth & Gender -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="font-mono-data-md text-[11px] text-[#bbbbbb] tracking-wider uppercase block mb-1.5 font-bold" for="ngaysinh">
                    NGÀY SINH
                  </label>
                  <input 
                    v-model="form.ngaysinh"
                    class="font-mono-data-md text-[14px] bg-[#0e0e0e] border border-[#3c3c3c] text-white p-3 w-full rounded-none focus:border-white focus:outline-none [color-scheme:dark] transition-colors" 
                    id="ngaysinh" 
                    type="date">
                </div>
                <div>
                  <label class="font-mono-data-md text-[11px] text-[#bbbbbb] tracking-wider uppercase block mb-1.5 font-bold" for="phai">
                    GIỚI TÍNH
                  </label>
                  <div class="relative">
                    <select 
                      v-model="form.phai"
                      class="font-mono-data-md text-[14px] bg-[#0e0e0e] border border-[#3c3c3c] text-white p-3 w-full rounded-none focus:border-white focus:outline-none appearance-none cursor-pointer pr-10" 
                      id="phai">
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#bbbbbb]">
                      <span class="material-symbols-outlined text-[16px]">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Phone & Email -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="font-mono-data-md text-[11px] text-[#bbbbbb] tracking-wider uppercase block mb-1.5 font-bold" for="dienthoai">
                    SỐ ĐIỆN THOẠI *
                  </label>
                  <input 
                    v-model="form.dienthoai"
                    class="font-mono-data-md text-[14px] bg-[#0e0e0e] border border-[#3c3c3c] text-white p-3 w-full rounded-none focus:border-white focus:outline-none placeholder-[#7e7e7e] transition-colors" 
                    id="dienthoai" 
                    placeholder="09xx.xxx.xxx" 
                    required 
                    type="tel">
                </div>
                <div>
                  <label class="font-mono-data-md text-[11px] text-[#bbbbbb] tracking-wider uppercase block mb-1.5 font-bold" for="email">
                    ĐỊA CHỈ EMAIL
                  </label>
                  <input 
                    v-model="form.email"
                    class="font-mono-data-md text-[14px] bg-[#0e0e0e] border border-[#3c3c3c] text-white p-3 w-full rounded-none focus:border-white focus:outline-none placeholder-[#7e7e7e] transition-colors" 
                    id="email" 
                    placeholder="email@domain.com" 
                    type="email">
                </div>
              </div>

              <!-- Address -->
              <div>
                <label class="font-mono-data-md text-[11px] text-[#bbbbbb] tracking-wider uppercase block mb-1.5 font-bold" for="diachi">
                  ĐỊA CHỈ LIÊN HỆ
                </label>
                <input 
                  v-model="form.diachi"
                  class="font-mono-data-md text-[14px] bg-[#0e0e0e] border border-[#3c3c3c] text-white p-3 w-full rounded-none focus:border-white focus:outline-none placeholder-[#7e7e7e] transition-colors" 
                  id="diachi" 
                  placeholder="Nhập số nhà, đường, phường/xã, quận/huyện..." 
                  type="text">
              </div>

              <!-- Password -->
              <div>
                <label class="font-mono-data-md text-[11px] text-[#bbbbbb] tracking-wider uppercase block mb-1.5 font-bold" for="password">
                  MẬT KHẨU KHỞI TẠO *
                </label>
                <div class="relative w-full">
                  <input 
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="font-mono-data-md text-[14px] bg-[#0e0e0e] border border-[#3c3c3c] text-white p-3 pr-10 w-full rounded-none focus:border-white focus:outline-none placeholder-[#7e7e7e] transition-colors" 
                    id="password" 
                    placeholder="Nhập mật khẩu tài khoản" 
                    required>
                  <button 
                    @click="togglePassword"
                    aria-label="Toggle password visibility" 
                    class="absolute inset-y-0 right-0 flex items-center px-3 text-[#7e7e7e] hover:text-white transition-colors" 
                    id="toggle-pwd-btn" 
                    type="button">
                    <span class="material-symbols-outlined text-[16px]" id="eye-icon">
                      {{ showPassword ? 'visibility_off' : 'visibility' }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Confirmation Checkbox -->
              <div class="pt-2 pb-1">
                <label class="flex items-center gap-3 cursor-pointer group select-none">
                  <input 
                    v-model="form.confirmAccurate"
                    class="sr-only peer" 
                    id="confirm-accurate" 
                    required 
                    type="checkbox">
                  <span class="w-4 h-4 rounded-none border border-[#3c3c3c] bg-[#0e0e0e] peer-checked:bg-white peer-checked:border-white flex items-center justify-center shrink-0 transition-colors">
                    <span class="material-symbols-outlined text-[12px] text-black opacity-0 peer-checked:opacity-100 font-bold">check</span>
                  </span>
                  <span class="font-mono-data-md text-[11px] text-[#bbbbbb] tracking-wider uppercase font-medium group-hover:text-white transition-colors">
                    XÁC NHẬN THÔNG TIN ĐĂNG KÝ LÀ CHÍNH XÁC
                  </span>
                </label>
              </div>

              <!-- Submit Button -->
              <div class="pt-2">
                <button 
                  :disabled="loading"
                  class="bg-white text-black font-headline-md text-[14px] font-bold uppercase tracking-wider py-3.5 px-6 w-full rounded-none hover:bg-[#e6e6e6] active:bg-[#cccccc] transition-colors cursor-pointer text-center block disabled:opacity-50" 
                  type="submit">
                  <span v-if="!loading">ĐĂNG KÝ TÀI KHOẢN →</span>
                  <span v-else>ĐANG XỬ LÝ...</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Tech Support Footer Note -->
        <div class="text-center mt-5">
          <span class="font-body-md text-[12px] text-[#7e7e7e]">
            ? Hỗ trợ kỹ thuật: <a class="text-[#bbbbbb] hover:text-white underline" href="mailto:hotro@thuvien.edu.vn">hotro@thuvien.edu.vn</a>
          </span>
        </div>
      </div>
    </main>

    <!-- Footer gọi từ hàm getFooter() để đồng bộ -->
    <div v-html="getFooter()"></div>
  </div>
</template>

<script src="../js/register.js"></script>
<style scoped src="../css/register.css"></style>


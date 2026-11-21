<template>
  <div class="min-h-screen bg-surface flex flex-col justify-between">
    <!-- Header gọi từ hàm getAuthHeader() để đồng bộ -->
    <div v-html="getAuthHeader()"></div>

    <!-- Main Authentication Viewport -->
    <main class="w-full pt-16 bg-surface min-h-[calc(100vh-80px)]">
      <div class="flex flex-col w-full min-h-[calc(100vh-64px)] justify-center items-center px-margin py-space-xl bg-surface-container-lowest">
        
        <!-- Primary Authentication Instrument Card -->
        <div class="w-full max-w-[540px] bg-surface-container-low border border-outline-variant rounded-none relative shadow-2xl">
          <!-- Signature Cockpit 3-Stripe Flush Identifier -->
          <div class="flex h-[3px] w-full">
            <div class="w-12 h-full bg-[#0066b1]"></div>
            <div class="w-12 h-full bg-[#1c69d4]"></div>
            <div class="w-12 h-full bg-[#e22718]"></div>
          </div>

          <!-- Header Terminal Title -->
          <div class="px-space-lg pt-space-lg pb-space-md border-b border-outline-variant bg-surface-container-lowest">
            <div class="flex items-center justify-between">
              <h1 class="font-headline-md text-headline-md uppercase text-primary tracking-tight font-bold">
                XÁC THỰC NGƯỜI DÙNG
              </h1>
            </div>
          </div>

          <!-- Interactive Navigation Tabs -->
          <div class="flex w-full border-b border-outline-variant bg-surface-container-lowest" role="tablist">
            <button 
              type="button" 
              role="tab" 
              :aria-selected="activeTab === 'login'"
              @click="switchAuthTab('login')"
              class="flex-1 h-12 flex items-center justify-center font-label-caps text-label-caps uppercase transition-colors relative border-b-2"
              :class="activeTab === 'login' ? 'border-primary text-primary bg-surface-container font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface bg-surface-container-lowest'">
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px]">login</span>
                ĐĂNG NHẬP
              </span>
            </button>
            
            <button 
              type="button" 
              role="tab" 
              :aria-selected="activeTab === 'register'"
              @click="switchAuthTab('register')"
              class="flex-1 h-12 flex items-center justify-center font-label-caps text-label-caps uppercase transition-colors relative border-b-2 border-l border-outline-variant"
              :class="activeTab === 'register' ? 'border-primary text-primary bg-surface-container font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface bg-surface-container-lowest'">
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px]">app_registration</span>
                ĐĂNG KÝ ĐỘC GIẢ
              </span>
            </button>
          </div>

          <div class="p-space-lg">
            <!-- TAB 1: LOGIN MODULE -->
            <section v-if="activeTab === 'login'" aria-labelledby="tab-btn-login" class="flex flex-col space-y-space-md">
              <form class="space-y-space-md" @submit.prevent="handleLogin">
                <!-- Identifier Input -->
                <div class="flex flex-col space-y-1.5">
                  <label class="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider" for="login-identifier">
                    {{ identifierLabel }}
                  </label>
                  <div class="relative">
                    <input 
                      id="login-identifier" 
                      v-model="loginForm.identifier"
                      class="w-full h-12 bg-surface-container-lowest border border-outline-variant px-space-md font-mono-data-md text-mono-data-md text-primary placeholder:text-outline focus:outline-none focus:border-primary rounded-none transition-colors" 
                      :placeholder="identifierPlaceholder" 
                      required 
                      type="text">
                    <span class="material-symbols-outlined absolute right-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                      badge
                    </span>
                  </div>
                </div>

                <!-- Password Input -->
                <div class="flex flex-col space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label class="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider" for="login-password">
                      MẬT KHẨU
                    </label>
                    <a href="#" class="font-label-caps text-label-caps uppercase text-outline hover:text-primary transition-colors">
                      QUÊN MẬT KHẨU?
                    </a>
                  </div>
                  <div class="relative">
                    <input 
                      id="login-password" 
                      v-model="loginForm.password"
                      :type="showPassword ? 'text' : 'password'"
                      class="w-full h-12 bg-surface-container-lowest border border-outline-variant px-space-md font-mono-data-md text-mono-data-md text-primary placeholder:text-outline focus:outline-none focus:border-primary rounded-none transition-colors" 
                      placeholder="Nhập mật khẩu" 
                      required>
                    <button 
                      type="button" 
                      @click="togglePassword"
                      class="absolute right-space-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary focus:outline-none cursor-pointer">
                      <span class="material-symbols-outlined text-[18px]">
                        {{ showPassword ? 'visibility_off' : 'visibility' }}
                      </span>
                    </button>
                  </div>
                </div>

                <!-- Remember Identity -->
                <div class="flex items-center gap-2 pt-1">
                  <input 
                    id="remember-me" 
                    v-model="loginForm.rememberMe"
                    type="checkbox"
                    class="w-4 h-4 rounded-none bg-surface-container-lowest border border-outline-variant text-primary focus:ring-0 cursor-pointer accent-primary">
                  <label class="font-label-caps text-label-caps uppercase text-on-surface-variant cursor-pointer select-none" for="remember-me">
                    GHI NHỚ THIẾT BỊ TRUY CẬP NÀY
                  </label>
                </div>

                <!-- Action Button -->
                <button 
                  type="submit" 
                  class="w-full h-12 bg-primary hover:bg-[#bbbbbb] text-on-primary font-headline-md text-headline-md tracking-wider uppercase font-bold rounded-none border border-primary transition-colors flex items-center justify-center gap-space-sm mt-space-md cursor-pointer">
                  <span>ĐĂNG NHẬP</span>
                  <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </form>
            </section>

            <!-- TAB 2: REGISTER MODULE -->
            <section v-if="activeTab === 'register'" aria-labelledby="tab-btn-register" class="flex flex-col space-y-space-md">
              <form class="space-y-space-md" @submit.prevent="handleRegister">
                <!-- Họ và tên (Bắt buộc *) -->
                <div class="flex flex-col space-y-1.5">
                  <label class="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider" for="reg-hoten">
                    HỌ VÀ TÊN *
                  </label>
                  <input 
                    id="reg-hoten" 
                    v-model="regForm.hoTen"
                    class="w-full h-12 bg-surface-container-lowest border border-outline-variant px-space-md font-mono-data-md text-mono-data-md text-primary placeholder:text-outline focus:outline-none focus:border-primary rounded-none transition-colors" 
                    placeholder="VD: Nguyễn Văn An" 
                    required 
                    type="text">
                </div>

                <!-- 2-column: NGAYSINH & PHAI (3 options) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div class="flex flex-col space-y-1.5">
                    <label class="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider" for="reg-ngaysinh">
                      NGÀY SINH
                    </label>
                    <input 
                      id="reg-ngaysinh" 
                      v-model="regForm.ngaysinh"
                      class="w-full h-12 bg-surface-container-lowest border border-outline-variant px-space-md font-mono-data-md text-mono-data-md text-primary focus:outline-none focus:border-primary rounded-none [color-scheme:dark] transition-colors" 
                      type="date">
                  </div>
                  <div class="flex flex-col space-y-1.5">
                    <label class="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider" for="reg-phai">
                      GIỚI TÍNH
                    </label>
                    <select 
                      id="reg-phai" 
                      v-model="regForm.phai"
                      class="w-full h-12 bg-surface-container-lowest border border-outline-variant px-space-md font-mono-data-md text-mono-data-md text-primary focus:outline-none focus:border-primary rounded-none transition-colors cursor-pointer">
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                <!-- Phone Number (Bắt buộc *) -->
                <div class="flex flex-col space-y-1.5">
                  <label class="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider" for="reg-dienthoai">
                    SỐ ĐIỆN THOẠI *
                  </label>
                  <input 
                    id="reg-dienthoai" 
                    v-model="regForm.dienthoai"
                    class="w-full h-12 bg-surface-container-lowest border border-outline-variant px-space-md font-mono-data-md text-mono-data-md text-primary placeholder:text-outline focus:outline-none focus:border-primary rounded-none transition-colors" 
                    placeholder="VD: 0912345678" 
                    required 
                    type="tel">
                </div>

                <!-- Email Address (Tùy chọn) -->
                <div class="flex flex-col space-y-1.5">
                  <label class="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider" for="reg-email">
                    ĐỊA CHỈ EMAIL
                  </label>
                  <input 
                    id="reg-email" 
                    v-model="regForm.email"
                    class="w-full h-12 bg-surface-container-lowest border border-outline-variant px-space-md font-mono-data-md text-mono-data-md text-primary placeholder:text-outline focus:outline-none focus:border-primary rounded-none transition-colors" 
                    placeholder="name@example.com (tùy chọn)" 
                    type="email">
                </div>

                <!-- Address (Tùy chọn) -->
                <div class="flex flex-col space-y-1.5">
                  <label class="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider" for="reg-diachi">
                    ĐỊA CHỈ THƯỜNG TRÚ
                  </label>
                  <input 
                    id="reg-diachi" 
                    v-model="regForm.diachi"
                    class="w-full h-12 bg-surface-container-lowest border border-outline-variant px-space-md font-mono-data-md text-mono-data-md text-primary placeholder:text-outline focus:outline-none focus:border-primary rounded-none transition-colors" 
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện (tùy chọn)" 
                    type="text">
                </div>

                <!-- Password Setup (Bắt buộc *) -->
                <div class="flex flex-col space-y-1.5">
                  <label class="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider" for="reg-password">
                    MẬT KHẨU BẢO MẬT *
                  </label>
                  <div class="relative">
                    <input 
                      id="reg-password" 
                      v-model="regForm.password"
                      :type="showRegPassword ? 'text' : 'password'"
                      class="w-full h-12 bg-surface-container-lowest border border-outline-variant px-space-md font-mono-data-md text-mono-data-md text-primary placeholder:text-outline focus:outline-none focus:border-primary rounded-none transition-colors" 
                      placeholder="Nhập mật khẩu tài khoản" 
                      required>
                    <button 
                      type="button" 
                      @click="toggleRegPassword"
                      class="absolute right-space-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary focus:outline-none cursor-pointer">
                      <span class="material-symbols-outlined text-[18px]">
                        {{ showRegPassword ? 'visibility_off' : 'visibility' }}
                      </span>
                    </button>
                  </div>
                </div>

                <!-- Terms Declaration Checklist -->
                <div class="p-space-sm bg-surface-container-lowest border border-outline-variant">
                  <label class="flex items-start gap-space-sm cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      v-model="regForm.agreed"
                      class="mt-1 w-4 h-4 rounded-none bg-surface-container-lowest border border-outline-variant text-primary focus:ring-0 cursor-pointer accent-primary">
                    <span class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Tôi cam kết chấp hành toàn bộ nội quy thư viện, bảo quản tài liệu mượn đúng quy định và chịu trách nhiệm pháp lý đối với thông tin đã đăng ký.
                    </span>
                  </label>
                </div>

                <!-- Register Action Button -->
                <button 
                  type="submit" 
                  class="w-full h-12 bg-primary hover:bg-[#bbbbbb] text-on-primary font-headline-md text-headline-md tracking-wider uppercase font-bold rounded-none border border-primary transition-colors flex items-center justify-center gap-space-sm mt-space-md cursor-pointer">
                  <span>ĐĂNG KÝ TÀI KHOẢN</span>
                  <span class="material-symbols-outlined text-[20px]">how_to_reg</span>
                </button>
              </form>
            </section>
          </div>
        </div>

        <!-- Support Note -->
        <div class="w-full max-w-[540px] mt-space-md flex items-center justify-between text-on-surface-variant font-mono-data-md text-body-sm px-1">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px] text-outline">help_outline</span>
            <span>Hỗ trợ kỹ thuật: hotro@thuvien.edu.vn</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer gọi từ hàm getFooter() để đồng bộ -->
    <div v-html="getFooter()"></div>
  </div>
</template>

<script src="../js/login.js"></script>
<style scoped src="../css/login.css"></style>


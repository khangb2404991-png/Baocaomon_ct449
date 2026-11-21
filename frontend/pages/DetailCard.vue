<template>
  <div class="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between selection:bg-neutral-800 selection:text-white">

    <!-- ========================================== -->
    <!-- 1. GLOBAL TOP HEADER (STRICT SPECIFICATION) -->
    <!-- ========================================== -->
    <header class="sticky top-0 z-50 h-16 w-full bg-[#0A0A0A] border-b border-[#262626] px-8 flex items-center justify-between">
      <!-- Far Left: Logo & English Brand Name -->
      <a href="#/home" class="flex items-center gap-3 no-underline text-white">
        <div class="w-8 h-8 bg-white flex items-center justify-center text-black">
          <span class="material-symbols-outlined text-xl">menu_book</span>
        </div>
        <div class="flex flex-col">
          <span class="font-bold tracking-wider text-white text-sm font-display uppercase leading-tight">BOOK LENDING SYSTEM</span>
        </div>
      </a>

      <!-- Center: Plain Text Navigation (NO box/pill containers) -->
      <nav class="flex items-center gap-10">
        <a href="#/home" class="text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors duration-150 font-mono no-underline">TRANG CHỦ</a>
        <a href="#/cart" class="text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors duration-150 font-mono no-underline">GIỎ HÀNG ({{ formattedCartCount }})</a>
      </nav>

      <!-- Far Right: Unified User Profile Block -->
      <a v-if="isLoggedIn && currentUser" href="#/profile" class="inline-flex items-center gap-3 px-3.5 py-1.5 bg-[#141414] border border-[#2A2A2A] cursor-pointer hover:border-neutral-500 transition-colors no-underline text-white">
        <div class="w-6 h-6 bg-[#262626] flex items-center justify-center text-white">
          <span class="material-symbols-outlined text-sm">person</span>
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-medium text-white leading-tight">{{ currentUser.tenDG || currentUser.name || currentUser.hoTen || 'Độc giả' }}</span>
        </div>
      </a>
      <a v-else href="#/login" class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#141414] border border-[#2A2A2A] cursor-pointer hover:border-primary transition-colors no-underline text-white">
        <span class="material-symbols-outlined text-sm text-primary">login</span>
        <span class="text-sm font-medium text-primary leading-tight">ĐĂNG NHẬP</span>
      </a>
    </header>

    <!-- ========================================== -->
    <!-- 2. MAIN CONTAINER: CHI TIẾT SÁCH (BOOK DETAIL) -->
    <!-- ========================================== -->
    <main class="flex-1 w-full max-w-[1280px] mx-auto px-8 py-6">
      
      <!-- Top Navigation / Breadcrumb Bar -->
      <div class="flex items-center justify-between pb-6 border-b border-[#262626] mb-8">
        <a href="#/home" class="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors group no-underline">
          <span class="text-neutral-500 group-hover:text-white transition-colors">←</span>
          <span>QUAY LẠI TRANG CHỦ</span>
        </a>
      </div>

      <!-- Main 2-Column Detail Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- LEFT COLUMN (Book Cover Frame - 35% / 4 Cols on 12-col grid, or lg:col-span-5) -->
        <section class="lg:col-span-4 xl:col-span-4 flex flex-col gap-4">
          <!-- Book Cover Container -->
          <div class="border border-[#262626] bg-[#111111] p-4 flex flex-col h-full">
            <div class="relative w-full bg-[#0A0A0A] overflow-hidden border border-[#222222] flex items-center justify-center h-full aspect-[3/4]">
              <img :src="book.hinhAnh" :alt="book.tenSach" class="w-full h-full object-cover object-center">
            </div>
          </div>

          <!-- Technical Metadata Sidebar Box -->
          <div class="border border-[#262626] bg-[#111111] p-6 flex flex-col justify-between">
            <div class="flex flex-col">
              <span class="text-xs font-mono uppercase tracking-wider text-neutral-400">ĐƠN GIÁ SÁCH (GIÁ TRỊ NIÊM YẾT)</span>
              <div class="text-2xl font-bold font-mono text-white mt-2">{{ formatCurrency(book.donGia) }}</div>
              <div class="border-t border-[#262626] my-4"></div>
              <div class="flex justify-between items-center text-xs font-mono">
                <span class="text-neutral-400">PHÍ MƯỢN TẠI THƯ VIỆN:</span>
                <span class="text-white font-semibold">0 VNĐ (MIỄN PHÍ)</span>
              </div>
              <p class="text-xs text-neutral-400 mt-3 leading-relaxed font-mono">Đơn giá dùng làm căn cứ xác định giá trị tài liệu theo quy chế thư viện.</p>
            </div>
          </div>
        </section>

        <!-- RIGHT COLUMN (Book Specification & Borrow Actions Card - 65% / lg:col-span-8) -->
        <section class="lg:col-span-8 xl:col-span-8 border border-[#262626] bg-[#111111] overflow-hidden flex flex-col">
          <!-- Top Accent Line (Brand Identity stripe) -->
          <div class="technical-top-line"></div>

          <div class="p-8">
            <!-- Header Block -->
            <div class="space-y-3 pb-6 border-b border-[#262626]">
              <!-- Monospace Tag Row -->
              <div class="flex flex-wrap items-center gap-3">
                <span class="px-2.5 py-1 bg-[#141414] border border-[#262626] text-xs font-mono text-neutral-400 tracking-wider">
                  THỂ LOẠI: <span class="text-neutral-300">{{ (book.theLoai || 'CÔNG NGHỆ THÔNG TIN').toUpperCase() }}</span>
                </span>
              </div>

              <!-- Book Title -->
              <h1 class="text-2xl lg:text-3xl font-bold text-white font-display tracking-tight leading-tight uppercase">
                {{ book.tenSach }}
              </h1>
            </div>

            <!-- Technical Metadata Grid (2x2 sharp-bordered table/grid) -->
            <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 border border-[#262626] bg-[#0E0E0E]">
              <!-- Cell 1: Tác giả -->
              <div class="p-4 border-b sm:border-r border-[#262626] flex flex-col justify-between">
                <span class="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">TÁC GIẢ / NGUỒN GỐC</span>
                <span class="text-sm font-semibold text-white font-sans">{{ book.tacGia || 'Đang cập nhật' }}</span>
              </div>

              <!-- Cell 2: Nhà xuất bản -->
              <div class="p-4 border-b border-[#262626] flex flex-col justify-between">
                <span class="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">NHÀ XUẤT BẢN</span>
                <span class="text-sm font-semibold text-white font-sans">{{ book.nhaXuatBan || 'Nhà Xuất Bản Kỹ Thuật - Điện Tử' }}</span>
              </div>

              <!-- Cell 3: Năm xuất bản -->
              <div class="p-4 sm:border-r border-b sm:border-b-0 border-[#262626] flex flex-col justify-between">
                <span class="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">NĂM XUẤT BẢN</span>
                <span class="text-sm font-mono font-medium text-white">{{ book.namXuatBan || '2024' }}</span>
              </div>

              <!-- Cell 4: Số lượng còn lại -->
              <div class="p-4 flex flex-col justify-between bg-[#141414]">
                <span class="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">SỐ LƯỢNG CÒN TRONG KHO</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-lg font-mono font-bold text-white">{{ String(book.soQuyen !== undefined ? book.soQuyen : 0).padStart(2, '0') }}</span>
                  <span class="text-xs font-mono text-neutral-400 uppercase">QUYỂN CẢ HỆ THỐNG</span>
                </div>
              </div>
            </div>

            <!-- Borrow Action Bar -->
            <div class="mt-6 pt-6 border-t border-[#262626]">
              <div class="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
                <!-- Quantity Stepper -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px] font-mono uppercase tracking-wider text-neutral-400">SỐ LƯỢNG MƯỢN</label>
                  <div class="h-11 inline-flex items-center border border-[#333333] bg-[#0E0E0E]">
                    <button 
                      @click="decreaseQuantity"
                      :disabled="borrowQuantity <= 1"
                      type="button" 
                      class="w-10 h-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#1A1A1A] transition-colors border-r border-[#262626] text-base font-mono cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                      -
                    </button>
                    <span class="w-14 text-center font-mono text-sm font-bold text-white">{{ String(borrowQuantity).padStart(2, '0') }}</span>
                    <button 
                      @click="increaseQuantity"
                      :disabled="borrowQuantity >= (book.soQuyen || 1)"
                      type="button" 
                      class="w-10 h-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#1A1A1A] transition-colors border-l border-[#262626] text-base font-mono cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                      +
                    </button>
                  </div>
                </div>

                <!-- Primary CTA Button -->
                <button 
                  @click="handleAddToCart"
                  :disabled="book.soQuyen <= 0"
                  type="button" 
                  class="flex-1 h-11 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider px-6 flex items-center justify-center gap-2 hover:bg-neutral-200 active:bg-neutral-300 transition-colors shadow-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                  <span>THÊM VÀO GIỎ HÀNG</span>
                  <span>→</span>
                </button>

                <!-- Secondary CTA Button -->
                <button 
                  @click="handleBorrowNow"
                  :disabled="book.soQuyen <= 0"
                  type="button" 
                  class="h-11 bg-[#161616] border border-[#333333] text-white font-mono text-xs font-semibold uppercase tracking-wider px-6 flex items-center justify-center hover:bg-[#202020] hover:border-neutral-500 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                  <span>ĐĂNG KÝ MƯỢN NGAY</span>
                </button>
              </div>

              <!-- Contextual Policy Note below buttons -->
              <div class="mt-3 flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                <span v-if="book.soQuyen <= 0" class="text-[#e22718]">● Tài liệu hiện đã hết trong kho. Vui lòng quay lại sau!</span>
                <span v-else class="text-[#8e9192]">● Thời hạn mượn quy định: Tối đa 14 ngày kể từ ngày duyệt phiếu.</span>
              </div>
            </div>

            <!-- Divider -->
            <div class="h-[1px] w-full bg-[#262626] my-6"></div>

            <!-- Description Block (`MOTA`) -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                  MÔ TẢ NỘI DUNG SÁCH
                </h3>
              </div>

              <div class="text-sm text-neutral-300 leading-relaxed font-sans space-y-3 bg-[#0E0E0E] p-5 border border-[#222222]">
                <p>
                  {{ book.moTa || 'Giáo trình cung cấp các kiến thức cơ sở và chuyên sâu toàn diện về nguyên lý hoạt động của tài liệu và các cơ chế xử lý liên quan.' }}
                </p>
                <div class="pt-2 border-t border-[#1F1F1F] flex flex-wrap gap-4 text-xs font-mono text-neutral-400">
                  <span>ẤN BẢN: BÌA CỨNG KỸ THUẬT</span>
                  <span>|</span>
                  <span>NĂM TÁI BẢN: {{ book.namXuatBan || 2024 }}</span>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>

    </main>

    <!-- ========================================== -->
    <!-- 3. GLOBAL FOOTER (STRICT SPECIFICATION)    -->
    <!-- ========================================== -->
    <footer class="w-full border-t border-[#262626] bg-[#0A0A0A] py-6 px-8 mt-12">
      <div class="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        <!-- Far Left: Vertical Stacked Contact Info -->
        <div class="flex flex-col gap-2 font-mono text-xs text-neutral-400">
          <div>
            <span class="font-bold text-neutral-300 uppercase">LIÊN HỆ QUẢN LÝ THƯ VIỆN:</span>
            <span class="text-neutral-400 ml-1">quanly@thuvien.edu.vn | (0292) 3831 567</span>
          </div>
          <div>
            <span class="font-bold text-neutral-300 uppercase">LIÊN HỆ HỖ TRỢ KỸ THUẬT:</span>
            <span class="text-neutral-400 ml-1">hotro@thuvien.edu.vn</span>
          </div>
        </div>

        <!-- Far Right: Library Regulations -->
        <div class="text-left md:text-right font-mono text-xs text-neutral-400">
          <a href="#/home" class="font-bold text-neutral-300 uppercase hover:text-white transition-colors block mb-1 no-underline">
            QUY CHẾ THƯ VIỆN
          </a>
          <span class="text-neutral-400">Quy định mượn trả sách &amp; Bảo quản tài liệu</span>
        </div>

      </div>
    </footer>

  </div>
</template>

<script src="../js/detailCard.js"></script>
<style scoped src="../css/detailCard.css"></style>

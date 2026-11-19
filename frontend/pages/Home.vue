<template>
  <div class="min-h-screen bg-[#131313] text-[#e2e2e2] flex flex-col justify-between selection:bg-[#353535] selection:text-white">
    <!-- Header gọi từ hàm getHeader('home') tự động đồng bộ theo cartCount -->
    <div v-html="headerHtml"></div>

    <!-- Main Viewport -->
    <main class="w-full pt-16 bg-[#131313] min-h-[calc(100vh-80px)]">
      <div class="flex flex-col w-full">
        <!-- Telemetry Filter Console -->
        <section class="w-full bg-[#0e0e0e] border-b border-[#444748] px-6 lg:px-10 py-4">
          <div class="max-w-[1440px] mx-auto flex flex-col gap-2">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              <!-- Search Input -->
              <div class="lg:col-span-4 relative flex items-center">
                <span class="material-symbols-outlined absolute left-3 text-[#8e9192] text-[18px]">search</span>
                <input 
                  v-model="filters.search"
                  id="catalog-search" 
                  class="w-full bg-[#0d0d0d] border border-[#444748] pl-9 pr-3 py-2 text-white font-mono-data-md text-[14px] placeholder:text-[#8e9192] focus:outline-none focus:border-white transition-colors" 
                  placeholder="Tìm theo tên sách, tác giả, thể loại..." 
                  type="text">
              </div>

              <!-- Genre Dropdown -->
              <div class="lg:col-span-2">
                <select 
                  v-model="filters.genre"
                  class="w-full bg-[#0d0d0d] border border-[#444748] px-3 py-2 text-white font-mono-data-md text-[14px] focus:outline-none focus:border-white">
                  <option value="">Tất cả thể loại</option>
                  <option value="cntt">Công nghệ thông tin</option>
                  <option value="ktqt">Kinh tế - Quản trị</option>
                  <option value="khdl">Khoa học dữ liệu</option>
                  <option value="knpm">Kỹ thuật phần mềm</option>
                  <option value="vh">Văn học</option>
                </select>
              </div>

              <!-- Publisher Dropdown -->
              <div class="lg:col-span-2">
                <select 
                  v-model="filters.publisher"
                  class="w-full bg-[#0d0d0d] border border-[#444748] px-3 py-2 text-white font-mono-data-md text-[14px] focus:outline-none focus:border-white">
                  <option value="">Tất cả NXB</option>
                  <option value="nxbtre">NXB Trẻ</option>
                  <option value="nxbtttt">NXB Thông tin &amp; TT</option>
                  <option value="nxbgd">NXB Giáo dục</option>
                  <option value="nxbbk">NXB Bách Khoa</option>
                  <option value="nxbkd">NXB Kim Đồng</option>
                </select>
              </div>

              <!-- Publication Year Dropdown -->
              <div class="lg:col-span-1">
                <select 
                  v-model="filters.year"
                  class="w-full bg-[#0d0d0d] border border-[#444748] px-2 py-2 text-white font-mono-data-md text-[14px] focus:outline-none focus:border-white">
                  <option value="">Năm XB</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>

              <!-- Sorting Dropdown -->
              <div class="lg:col-span-2">
                <select 
                  v-model="filters.sort"
                  class="w-full bg-[#0d0d0d] border border-[#444748] px-3 py-2 text-white font-mono-data-md text-[14px] focus:outline-none focus:border-white">
                  <option value="latest">Mới nhất</option>
                  <option value="popular">Lượt mượn nhiều nhất</option>
                  <option value="price-asc">Đơn giá thấp đến cao</option>
                </select>
              </div>

              <!-- Reset Button -->
              <div class="lg:col-span-1">
                <button 
                  @click="resetFilters"
                  class="w-full bg-[#0d0d0d] border border-[#444748] py-2 px-2 text-[#e2e2e2] hover:text-white hover:border-white transition-colors font-mono-data-md text-[11px] uppercase text-center flex items-center justify-center gap-1 cursor-pointer" 
                  type="button">
                  <span class="material-symbols-outlined text-[14px]">refresh</span>
                  <span>Đặt lại</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Main Content Container -->
        <div class="w-full max-w-[1440px] mx-auto px-6 lg:px-10 py-10 flex flex-col gap-10">
          <!-- Section 1: TOP 10 SÁCH MƯỢN TRONG THÁNG -->
          <section class="flex flex-col gap-4">
            <!-- Section Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#444748] pb-2 gap-3">
              <div class="flex items-center gap-3">
                <div class="flex h-3 w-6 shrink-0">
                  <span class="w-2 h-full bg-[#0066b1]"></span>
                  <span class="w-2 h-full bg-[#1c69d4]"></span>
                  <span class="w-2 h-full bg-[#e22718]"></span>
                </div>
                <h2 class="font-headline-md text-[20px] font-bold uppercase tracking-tight text-white">
                  TOP 10 SÁCH MƯỢN TRONG THÁNG
                </h2>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 bg-[#0d0d0d] border border-[#444748] font-mono-data-md text-[12px] text-[#adc6ff] font-bold">
                  {{ topPageIndicator }}
                </span>
                <span class="px-2.5 py-1 bg-[#0d0d0d] border border-[#444748] font-mono-data-md text-[13px] text-white">
                  THÁNG 05/2024
                </span>
              </div>
            </div>

            <!-- Top 10 Books Container (Chỉ chuyển sách khi người dùng bấm nút) -->
            <div class="relative w-full">
              <!-- Nút điều hướng nổi bên trái -->
              <button 
                @click="prevTopBook"
                type="button"
                class="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-[#0d0d0d]/90 hover:bg-white text-white hover:text-black border border-[#444748] hover:border-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
                title="Tiến qua trái">
                <span class="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>

              <!-- 5-Column Grid (10 Sách Xoay Vòng Qua Nút Bấm) -->
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <article 
                  v-for="(book, index) in displayTopBooks" 
                  :key="index"
                  :class="[
                    'bg-[#1a1a1a] p-4 flex flex-col justify-between group hover:border-white transition-colors relative border',
                    book.rank === 1 ? 'border-[#e22718]' : (book.rank === 2 ? 'border-[#1c69d4]' : (book.rank === 3 ? 'border-[#0066b1]' : 'border-[#444748]'))
                  ]">
                  <!-- Top Rank Badge -->
                  <div 
                    :class="[
                      'absolute top-0 left-0 text-white px-2 py-0.5 font-mono-data-md text-[11px] font-bold z-10',
                      book.rank === 1 ? 'bg-[#e22718]' : (book.rank === 2 ? 'bg-[#1c69d4]' : (book.rank === 3 ? 'bg-[#0066b1]' : 'bg-[#0d0d0d] border border-[#444748] text-[#bbbbbb]'))
                    ]">
                    #{{ book.rank }} {{ book.rank <= 3 ? 'TOP' : '' }}
                  </div>

                  <div class="flex flex-col gap-2 mt-3 cursor-pointer" @click="goToDetail(book)">
                    <div class="relative w-full aspect-[3/4] bg-[#0d0d0d] overflow-hidden border border-[#444748]">
                      <img 
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        :src="book.hinhAnh" 
                        :alt="book.tenSach">
                    </div>
                    <div class="flex flex-col gap-0.5 min-w-0">
                      <h3 
                        class="font-headline-md text-[15px] font-bold text-white truncate group-hover:text-[#adc6ff] transition-colors" 
                        :title="book.tenSach">
                        {{ book.tenSach }}
                      </h3>
                      <p class="font-body-md text-[12px] text-[#bbbbbb] truncate">{{ book.tacGia }}</p>
                      <div class="flex items-center justify-between mt-1 pt-1 border-t border-[#444748]">
                        <span class="font-mono-data-md text-[11px] text-[#8e9192]">LƯỢT MƯỢN</span>
                        <span class="font-mono-data-md text-[13px] text-white font-bold">{{ book.luotMuon || 0 }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 pt-2 border-t border-[#444748]">
                    <button 
                      @click="addToCart(book)"
                      class="btn-borrow-action w-full py-2 bg-[#0d0d0d] hover:bg-white text-white hover:text-black border border-[#444748] hover:border-white font-mono-data-md text-[11px] uppercase font-bold transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5">
                      <span class="material-symbols-outlined text-[15px]">menu_book</span>
                      <span>MƯỢN TÀI LIỆU</span>
                    </button>
                  </div>
                </article>
              </div>

              <!-- Nút điều hướng nổi bên phải -->
              <button 
                @click="nextTopBook"
                type="button"
                class="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-[#0d0d0d]/90 hover:bg-white text-white hover:text-black border border-[#444748] hover:border-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
                title="Tiến qua phải">
                <span class="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </section>

          <!-- Section 2: TẤT CẢ SÁCH -->
          <section class="flex flex-col gap-4">
            <!-- Section Header -->
            <div class="flex items-center justify-between border-b border-[#444748] pb-2">
              <div class="flex items-center gap-3">
                <div class="w-1.5 h-5 bg-white"></div>
                <h2 class="font-headline-md text-[20px] font-bold uppercase tracking-tight text-white">
                  TẤT CẢ SÁCH
                </h2>
                <span class="bg-[#0d0d0d] border border-[#444748] text-[#bbbbbb] font-mono-data-md text-[14px] px-2 py-0.5 font-bold">
                  {{ filteredBooks.length }}
                </span>
              </div>
              <div class="flex items-center gap-1 font-mono-data-md text-[13px] text-[#8e9192]">
                <span>HIỂN THỊ: {{ paginatedBooks.length }} / {{ filteredBooks.length }} TÀI LIỆU</span>
              </div>
            </div>

            <!-- 4-Column Product Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <article 
                v-for="book in paginatedBooks" 
                :key="book.maSach"
                class="bg-[#1a1a1a] border border-[#444748] p-4 flex flex-col justify-between group hover:border-[#1c69d4] transition-colors">
                <div class="flex flex-col gap-2 cursor-pointer" @click="goToDetail(book)">
                  <div class="relative w-full aspect-[3/4] bg-[#0d0d0d] overflow-hidden border border-[#444748]">
                    <img 
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      :src="book.hinhAnh" 
                      :alt="book.tenSach">
                  </div>
                  <div class="flex flex-col gap-1 min-w-0">
                    <h3 
                      class="font-headline-md text-[15px] font-bold text-white line-clamp-1 group-hover:text-[#adc6ff] transition-colors" 
                      :title="book.tenSach">
                      {{ book.tenSach }}
                    </h3>
                    <p class="font-body-md text-[14px] text-[#bbbbbb] truncate">{{ book.tacGia }}</p>
                    <p class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">
                      {{ book.nhaXuatBan }} &nbsp; {{ book.namXuatBan }}
                    </p>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-[#444748] flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5">
                      <span 
                        :class="[
                          'w-1.5 h-1.5 inline-block',
                          book.soQuyen > 0 ? 'bg-[#1c69d4]' : 'bg-[#e22718]'
                        ]"></span>
                      <span 
                        :class="[
                          'font-mono-data-md text-[14px] font-bold',
                          book.soQuyen > 0 ? 'text-white' : 'text-[#e22718]'
                        ]">
                        {{ book.soQuyen > 0 ? `Còn ${book.soQuyen} quyển` : 'Hết sách' }}
                      </span>
                    </div>
                    <span class="font-mono-data-md text-[14px] text-white">
                      {{ formatCurrency(book.donGia) }}
                    </span>
                  </div>

                  <!-- Add to cart button (MƯỢN TÀI LIỆU) -->
                  <button 
                    v-if="book.soQuyen > 0"
                    @click="addToCart(book)"
                    class="btn-borrow-action w-full h-10 bg-[#0d0d0d] hover:bg-white text-white hover:text-black border border-[#444748] hover:border-white font-mono-data-md text-[11px] uppercase font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                    <span class="material-symbols-outlined text-[16px]">menu_book</span>
                    <span>MƯỢN TÀI LIỆU</span>
                  </button>
                  <button 
                    v-else
                    disabled
                    class="w-full h-10 bg-[#0d0d0d] border border-[#444748] text-[#8e9192] cursor-not-allowed font-mono-data-md text-[11px] uppercase font-bold flex items-center justify-center gap-1">
                    <span class="material-symbols-outlined text-[16px]">do_not_disturb_on</span>
                    <span>HẾT SÁCH</span>
                  </button>
                </div>
              </article>
            </div>
          </section>

          <!-- Pagination Module -->
          <div class="w-full border-t border-[#444748] pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <span class="font-mono-data-md text-[11px] uppercase text-[#8e9192]">VỊ TRÍ TRANG:</span>
              <span class="font-mono-data-md text-[14px] text-white font-bold">
                TRANG {{ currentPage }} / {{ totalPages }}
              </span>
              <span class="text-[#444748] font-mono-data-md text-[14px]">|</span>
              <span class="font-mono-data-md text-[13px] text-[#8e9192]">
                TỔNG CỘNG {{ filteredBooks.length }} TÀI LIỆU
              </span>
            </div>
            <div class="flex items-center gap-1 font-mono-data-md text-[13px]">
              <!-- Previous Page -->
              <button 
                :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)"
                class="h-9 px-3 bg-[#0d0d0d] border border-[#444748] text-white disabled:text-[#8e9192] disabled:cursor-not-allowed flex items-center justify-center cursor-pointer">
                <span class="material-symbols-outlined text-[16px]">chevron_left</span>
              </button>

              <!-- Page Buttons -->
              <button 
                v-for="p in totalPages" 
                :key="p"
                @click="goToPage(p)"
                :class="[
                  'h-9 w-9 font-bold flex items-center justify-center border transition-colors cursor-pointer',
                  currentPage === p ? 'bg-white text-black border-white' : 'bg-[#0d0d0d] text-white border-[#444748] hover:border-white'
                ]">
                {{ p }}
              </button>

              <!-- Next Page -->
              <button 
                :disabled="currentPage === totalPages"
                @click="goToPage(currentPage + 1)"
                class="h-9 px-3 bg-[#0d0d0d] border border-[#444748] text-white disabled:text-[#8e9192] disabled:cursor-not-allowed flex items-center justify-center hover:border-white transition-colors cursor-pointer">
                <span class="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer gọi từ hàm getFooter() để đồng bộ -->
    <div v-html="footerHtml"></div>
  </div>
</template>

<script src="../js/home.js"></script>
<style scoped src="../css/home.css"></style>


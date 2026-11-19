<template>
  <div class="bg-[#131313] font-body-md text-[#e2e2e2] antialiased min-h-screen">
    <!-- Admin Sidebar gọi từ hàm getAdminSidebar('books') để đồng bộ -->
    <div v-html="getAdminSidebar('books')"></div>

    <div class="pl-72 flex flex-col min-h-screen">
      <!-- Admin Header gọi từ hàm getAdminHeader() để đồng bộ -->
      <div v-html="getAdminHeader()"></div>

      <!-- Main Admin Content Area -->
      <main class="relative pt-16 flex-1 bg-[#131313]">
        <div class="flex flex-col w-full text-[#e2e2e2] bg-[#131313] font-body-md antialiased">
          <!-- Primary Filter and Action Toolbar -->
          <div class="w-full border-b border-[#444748] bg-[#1b1b1b] p-4 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
            <!-- Left Filter Matrix -->
            <div class="flex flex-wrap items-center gap-2 flex-1">
              <!-- Search Input -->
              <div class="relative min-w-[240px] flex-1 max-w-sm">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8e9192] text-[18px]">search</span>
                <input 
                  v-model="filters.search"
                  class="w-full h-10 pl-9 pr-3 bg-[#0e0e0e] border border-[#444748] text-white font-mono-data-md text-[13px] placeholder:text-[#8e9192] focus:border-white focus:outline-none rounded-none" 
                  placeholder="Tìm kiếm tên sách, tác giả..." 
                  type="text">
              </div>

              <!-- NXB Filter -->
              <div class="relative">
                <select 
                  v-model="filters.nxb"
                  class="h-10 bg-[#0e0e0e] border border-[#444748] text-white font-mono-data-md text-[13px] px-3 pr-8 focus:border-white focus:outline-none appearance-none cursor-pointer rounded-none">
                  <option value="">Tất cả nhà xuất bản</option>
                  <option value="NXB-01">NXB Bách Khoa Hà Nội</option>
                  <option value="NXB-02">NXB Thông Tin &amp; Truyền Thông</option>
                  <option value="NXB-03">NXB Trẻ</option>
                  <option value="NXB-04">NXB Giáo Dục Việt Nam</option>
                  <option value="NXB-05">O'Reilly Media / Pearson</option>
                </select>
                <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#8e9192] text-[16px]">expand_more</span>
              </div>

              <!-- TRANGTHAI Filter -->
              <div class="relative">
                <select 
                  v-model="filters.status"
                  class="h-10 bg-[#0e0e0e] border border-[#444748] text-white font-mono-data-md text-[13px] px-3 pr-8 focus:border-white focus:outline-none appearance-none cursor-pointer rounded-none">
                  <option value="">Tất cả trạng thái</option>
                  <option value="1">Hiển thị (Đang mượn)</option>
                  <option value="0">Ẩn (Ngừng phục vụ)</option>
                </select>
                <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#8e9192] text-[16px]">expand_more</span>
              </div>

              <!-- THELOAI Filter -->
              <div class="relative">
                <select 
                  v-model="filters.genre"
                  class="h-10 bg-[#0e0e0e] border border-[#444748] text-white font-mono-data-md text-[13px] px-3 pr-8 focus:border-white focus:outline-none appearance-none cursor-pointer rounded-none">
                  <option value="">Tất cả thể loại</option>
                  <option value="Khoa Học Máy Tính">Khoa Học Máy Tính</option>
                  <option value="Hệ Thống Phân Tán">Hệ Thống Phân Tán</option>
                  <option value="Trí Tuệ Nhân Tạo">Trí Tuệ Nhân Tạo</option>
                  <option value="Mạng & An Ninh">Mạng &amp; An Ninh</option>
                </select>
                <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#8e9192] text-[16px]">expand_more</span>
              </div>

              <!-- Reset Filters -->
              <button 
                @click="resetFilters"
                class="h-10 w-10 flex items-center justify-center bg-[#0e0e0e] border border-[#444748] text-[#8e9192] hover:text-white hover:border-[#8e9192] transition-colors rounded-none cursor-pointer" 
                title="Làm mới bộ lọc">
                <span class="material-symbols-outlined text-[18px]">filter_alt_off</span>
              </button>
            </div>

            <!-- Right Quick Actions -->
            <div class="flex items-center gap-2 justify-between xl:justify-end shrink-0">
              <div class="font-mono-data-md text-[13px] px-3 py-2 bg-[#0e0e0e] border border-[#444748] text-[#c4c7c8]">
                [ĐANG QUẢN LÝ: <span class="text-white font-bold">{{ books.length }}</span> ĐẦU SÁCH]
              </div>
              <button 
                @click="startAddBook"
                class="h-10 px-5 bg-white text-black hover:bg-[#bbbbbb] font-headline-md text-[13px] font-bold uppercase tracking-[1.5px] transition-colors rounded-none flex items-center gap-2 cursor-pointer" 
                id="btn-add-book">
                <span class="material-symbols-outlined text-[18px]">add</span>
                + THÊM SÁCH MỚI
              </button>
            </div>
          </div>

          <!-- Main Content Cockpit Grid (Split View) -->
          <div class="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
            <!-- Left Column: Data Table (7 cols) -->
            <section class="lg:col-span-7 xl:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-[#444748] bg-[#0e0e0e] overflow-hidden">
              <!-- Section Header -->
              <div class="px-4 py-2 bg-[#1b1b1b] border-b border-[#444748] flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 bg-white"></span>
                  <span class="font-headline-md text-[14px] uppercase tracking-wider font-bold text-white">
                    DANH SÁCH TÀI LIỆU
                  </span>
                </div>
                <div class="flex items-center gap-3 font-mono-data-md text-[11px] text-[#8e9192]">
                  <span>SẮP XẾP: TÊN SÁCH [A-Z]</span>
                  <span>BỘ NHỚ: LIVE</span>
                </div>
              </div>

              <!-- Table -->
              <div class="w-full overflow-x-auto">
                <table class="w-full text-left border-collapse font-body-md text-[13px]">
                  <thead>
                    <tr class="bg-[#1f1f1f] border-b border-[#444748] text-[#8e9192] font-mono-data-md text-[11px] tracking-wider uppercase">
                      <th class="py-3 px-2 font-semibold">ẢNH</th>
                      <th class="py-3 px-3 font-semibold">TÊN SÁCH &amp; TÁC GIẢ</th>
                      <th class="py-3 px-3 font-semibold">NXB &amp; NĂM</th>
                      <th class="py-3 px-3 text-right font-semibold">ĐƠN GIÁ</th>
                      <th class="py-3 px-3 text-center font-semibold">SỐ QUYỂN</th>
                      <th class="py-3 px-3 font-semibold">TRẠNG THÁI</th>
                      <th class="py-3 px-3 text-right font-semibold">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#444748] font-mono-data-md">
                    <tr 
                      v-for="b in paginatedBooks" 
                      :key="b.maSach"
                      @click="selectBook(b)"
                      :class="[
                        'book-table-row',
                        selectedBook && selectedBook.maSach === b.maSach ? 'active' : 'bg-[#0e0e0e]'
                      ]">
                      <td class="py-3 px-2">
                        <div class="w-9 h-12 border border-[#444748] bg-[#1b1b1b] overflow-hidden flex-shrink-0">
                          <img class="w-full h-full object-cover" :src="b.hinhAnh" :alt="b.tenSach">
                        </div>
                      </td>
                      <td class="py-3 px-3 font-body-md">
                        <div class="font-headline-md text-[14px] font-bold text-white leading-tight">
                          {{ b.tenSach }}
                        </div>
                        <div class="text-[12px] text-[#bbbbbb] font-mono-data-md flex items-center gap-1.5 mt-0.5">
                          <span>TG: {{ b.tacGia }}</span>
                          <span class="text-[#8e9192]">/</span>
                          <span class="text-[11px] px-1 bg-[#1f1f1f] border border-[#444748] text-[#bbbbbb]">
                            {{ b.theLoai }}
                          </span>
                        </div>
                      </td>
                      <td class="py-3 px-3 text-[12px]">
                        <div class="text-white font-medium">{{ b.nhaXuatBan }}</div>
                        <div class="text-[#8e9192] text-[11px]">Năm XB: {{ b.namXuatBan }}</div>
                      </td>
                      <td class="py-3 px-3 text-right text-white font-bold">
                        {{ formatCurrency(b.donGia) }}
                      </td>
                      <td class="py-3 px-3 text-center">
                        <span 
                          :class="[
                            'px-2 py-0.5 border font-bold',
                            b.soQuyen > 0 ? 'border-[#444748] bg-[#1f1f1f] text-white' : 'border-[#e22718] bg-[#e22718]/10 text-[#e22718]'
                          ]">
                          {{ b.soQuyen > 0 ? String(b.soQuyen).padStart(2, '0') : '00 (HẾT)' }}
                        </span>
                      </td>
                      <td class="py-3 px-3">
                        <div 
                          v-if="b.trangThai !== false"
                          class="status-badge-active">
                          <span class="w-1.5 h-1.5 bg-[#0fa336]"></span>
                          HIỂN THỊ
                        </div>
                        <div 
                          v-else
                          class="status-badge-inactive">
                          <span class="w-1.5 h-1.5 bg-[#8e9192]"></span>
                          NGỪNG PHỤC VỤ
                        </div>
                      </td>
                      <td class="py-3 px-3 text-right">
                        <div class="inline-flex items-center gap-2">
                          <button 
                            @click.stop="selectBook(b)"
                            class="text-white underline hover:text-[#adc6ff] font-mono-data-md text-[11px] font-bold cursor-pointer">
                            SỬA
                          </button>
                          <span class="text-[#444748]">|</span>
                          <button 
                            @click.stop="toggleBookStatus(b)"
                            :class="[
                              'font-mono-data-md text-[11px] cursor-pointer',
                              b.trangThai !== false ? 'text-[#8e9192] hover:text-[#e22718]' : 'text-[#1c69d4] hover:underline'
                            ]">
                            {{ b.trangThai !== false ? 'ẨN' : 'BẬT' }}
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Table Footer / Telemetry Pagination -->
              <div class="mt-auto border-t border-[#444748] bg-[#1b1b1b] px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div class="font-mono-data-md text-[12px] text-[#8e9192]">
                  HIỂN THỊ <span class="text-white font-bold">{{ paginatedBooks.length }}</span> TRÊN TỔNG SỐ <span class="text-white font-bold">{{ filteredBooks.length }}</span> ĐẦU SÁCH
                </div>
                <div class="flex items-center gap-1 font-mono-data-md text-[12px]">
                  <button 
                    :disabled="currentPage === 1"
                    @click="goToPage(currentPage - 1)"
                    class="w-8 h-8 flex items-center justify-center border border-[#444748] text-[#8e9192] hover:text-white hover:border-white transition-colors disabled:opacity-30 cursor-pointer">
                    <span class="material-symbols-outlined text-[16px]">chevron_left</span>
                  </button>
                  <button 
                    v-for="p in totalPages" 
                    :key="p"
                    @click="goToPage(p)"
                    :class="[
                      'w-8 h-8 flex items-center justify-center border font-bold cursor-pointer transition-colors',
                      currentPage === p ? 'border-white bg-white text-black' : 'border-[#444748] text-white hover:border-white'
                    ]">
                    {{ p }}
                  </button>
                  <button 
                    :disabled="currentPage === totalPages"
                    @click="goToPage(currentPage + 1)"
                    class="w-8 h-8 flex items-center justify-center border border-[#444748] text-[#8e9192] hover:text-white hover:border-white transition-colors disabled:opacity-30 cursor-pointer">
                    <span class="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </section>

            <!-- Right Column: Slide-over Inspector Form (5 cols) -->
            <aside class="lg:col-span-5 xl:col-span-5 bg-[#1b1b1b] flex flex-col relative border-l border-[#444748]">
              <!-- M-Stripe Flush Accent -->
              <div class="flex flex-row w-full h-[3px]">
                <div class="w-12 h-full bg-[#0066b1]"></div>
                <div class="w-12 h-full bg-[#1c69d4]"></div>
                <div class="w-12 h-full bg-[#e22718]"></div>
              </div>

              <!-- Panel Header -->
              <div class="px-4 py-2 border-b border-[#444748] flex items-center justify-between bg-[#1f1f1f]">
                <div class="flex items-center gap-2">
                  <span class="font-headline-md text-[14px] uppercase font-bold text-white">
                    {{ isEditing ? `CẬP NHẬT: ${form.tenSach || 'TÀI LIỆU'}` : 'THÊM MỚI TÀI LIỆU' }}
                  </span>
                </div>
              </div>

              <!-- Form Inputs Container -->
              <form @submit.prevent="saveBook" class="p-4 space-y-4 overflow-y-auto flex-1 text-[13px]" id="book-form">
                <!-- TENSACH Field -->
                <div class="flex flex-col gap-1">
                  <div class="flex items-center justify-between">
                    <label class="font-mono-data-md text-[11px] text-white uppercase font-bold">1. TÊN SÁCH (BẮT BUỘC) *</label>
                  </div>
                  <input 
                    v-model="form.tenSach"
                    class="h-10 px-3 bg-[#0e0e0e] border border-[#444748] text-white font-headline-md text-[14px] font-semibold focus:border-white focus:outline-none rounded-none" 
                    required 
                    type="text">
                </div>

                <!-- NXB Selection Field -->
                <div class="flex flex-col gap-1">
                  <div class="flex items-center justify-between">
                    <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">2. NHÀ XUẤT BẢN</label>
                  </div>
                  <div class="relative">
                    <select 
                      v-model="form.maNXB"
                      class="w-full h-10 px-3 pr-8 bg-[#0e0e0e] border border-[#444748] text-white font-mono-data-md text-[13px] focus:border-white focus:outline-none appearance-none rounded-none">
                      <option value="NXB-01">NXB Bách Khoa Hà Nội</option>
                      <option value="NXB-02">NXB Thông Tin &amp; Truyền Thông</option>
                      <option value="NXB-03">NXB Trẻ</option>
                      <option value="NXB-04">NXB Giáo Dục Việt Nam</option>
                      <option value="NXB-05">O'Reilly Media / Pearson</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#8e9192] text-[16px]">expand_more</span>
                  </div>
                </div>

                <!-- 2-column row: TACGIA & THELOAI -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div class="flex flex-col gap-1">
                    <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">3. TÁC GIẢ</label>
                    <input 
                      v-model="form.tacGia"
                      class="h-10 px-3 bg-[#0e0e0e] border border-[#444748] text-white font-mono-data-md focus:border-white focus:outline-none rounded-none" 
                      type="text">
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">4. THỂ LOẠI</label>
                    <div class="relative">
                      <select 
                        v-model="form.theLoai"
                        class="w-full h-10 px-3 pr-8 bg-[#0e0e0e] border border-[#444748] text-white font-mono-data-md text-[13px] focus:border-white focus:outline-none appearance-none rounded-none">
                        <option value="Khoa Học Máy Tính">Khoa Học Máy Tính</option>
                        <option value="Hệ Thống Phân Tán">Hệ Thống Phân Tán</option>
                        <option value="Mạng & An Ninh">Mạng &amp; An Ninh</option>
                        <option value="Trí Tuệ Nhân Tạo">Trí Tuệ Nhân Tạo</option>
                        <option value="Cơ Sở Dữ Liệu">Cơ Sở Dữ Liệu</option>
                      </select>
                      <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#8e9192] text-[16px]">expand_more</span>
                    </div>
                  </div>
                </div>

                <!-- 3-column row: DONGIA, SOQUYEN, NAMXUATBAN -->
                <div class="grid grid-cols-3 gap-2">
                  <div class="flex flex-col gap-1">
                    <label class="font-mono-data-md text-[10px] text-[#8e9192] uppercase">5. ĐƠN GIÁ (VNĐ)</label>
                    <input 
                      v-model="form.donGia"
                      class="h-10 px-2 bg-[#0e0e0e] border border-[#444748] text-white font-mono-data-md text-right focus:border-white focus:outline-none rounded-none" 
                      type="number">
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="font-mono-data-md text-[10px] text-[#8e9192] uppercase">6. SỐ LƯỢNG (KHO)</label>
                    <input 
                      v-model="form.soQuyen"
                      class="h-10 px-2 bg-[#0e0e0e] border border-[#444748] text-white font-mono-data-md text-center focus:border-white focus:outline-none rounded-none" 
                      type="number">
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="font-mono-data-md text-[10px] text-[#8e9192] uppercase">7. NĂM XB</label>
                    <input 
                      v-model="form.namXuatBan"
                      class="h-10 px-2 bg-[#0e0e0e] border border-[#444748] text-white font-mono-data-md text-center focus:border-white focus:outline-none rounded-none" 
                      type="number">
                  </div>
                </div>

                <!-- HINHANH Upload / URL Frame -->
                <div class="flex flex-col gap-1">
                  <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">8. TỆP BÌA TÀI LIỆU (HINHANH URL)</label>
                  <div class="flex items-start gap-2 p-2 border border-[#444748] bg-[#0e0e0e]">
                    <div class="w-16 h-20 border border-[#444748] bg-[#1b1b1b] shrink-0 overflow-hidden">
                      <img class="w-full h-full object-cover" :src="form.hinhAnh" :alt="form.tenSach">
                    </div>
                    <div class="flex-1 flex flex-col gap-1.5 min-w-0">
                      <input 
                        v-model="form.hinhAnh"
                        class="w-full h-8 px-2 bg-[#1f1f1f] border border-[#444748] text-[#8e9192] font-mono-data-md text-[11px] truncate focus:border-white focus:outline-none rounded-none" 
                        type="text">
                      <div class="flex items-center gap-2">
                        <span class="font-mono-data-md text-[10px] text-[#8e9192]">ĐỊNH DẠNG: PNG, WEBP, JPG</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- MOTA Field -->
                <div class="flex flex-col gap-1">
                  <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">9. TÓM TẮT NỘI DUNG (MOTA)</label>
                  <textarea 
                    v-model="form.moTa"
                    class="w-full p-2.5 bg-[#0e0e0e] border border-[#444748] text-white font-body-md text-[13px] focus:border-white focus:outline-none rounded-none resize-none leading-relaxed" 
                    rows="3"></textarea>
                </div>

                <!-- TRANGTHAI Toggle -->
                <div class="p-2 border border-[#444748] bg-[#0e0e0e] flex items-center justify-between">
                  <div class="flex flex-col">
                    <span class="font-headline-md text-[13px] font-bold text-white">TRẠNG THÁI HIỂN THỊ (TRANGTHAI)</span>
                    <span class="font-mono-data-md text-[11px] text-[#8e9192]">Cho phép bạn đọc tìm kiếm và đăng ký mượn sách</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      v-model="form.trangThai"
                      class="sr-only peer" 
                      type="checkbox">
                    <div class="w-12 h-6 bg-[#2a2a2a] peer-focus:outline-none border border-[#444748] peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#444748] after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0fa336]/30 peer-checked:border-[#0fa336]"></div>
                  </label>
                </div>

                <!-- Form Actions Sticky Tray -->
                <div class="pt-2 border-t border-[#444748] flex items-center justify-end gap-2">
                  <button 
                    @click="startAddBook"
                    class="h-10 px-4 bg-[#1f1f1f] border border-[#444748] hover:border-[#8e9192] text-[#bbbbbb] font-mono-data-md text-[11px] uppercase tracking-wider transition-colors rounded-none cursor-pointer" 
                    type="button">
                    LÀM MỚI FORM
                  </button>
                  <button 
                    class="h-10 px-6 bg-white text-black hover:bg-[#bbbbbb] font-headline-md text-[13px] font-bold uppercase tracking-[1.5px] transition-colors rounded-none flex items-center gap-2 cursor-pointer" 
                    type="submit">
                    <span>LƯU THÔNG TIN SÁCH</span>
                    <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </form>
            </aside>
          </div>
        </div>
      </main>

      <!-- Admin Footer gọi từ hàm getAdminFooter() để đồng bộ -->
      <div v-html="getAdminFooter()"></div>
    </div>
  </div>
</template>

<script src="../js/bookManagement.js"></script>
<style scoped src="../css/bookManagement.css"></style>


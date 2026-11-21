<template>
  <div class="bg-[#000000] font-mono text-[#e2e2e2] antialiased min-h-screen">
    <!-- Admin Sidebar gọi từ hàm getAdminSidebar('publishers') để đồng bộ -->
    <div v-html="getAdminSidebar('publishers')"></div>

    <div class="pl-72 flex flex-col min-h-screen bg-[#000000]">
      <!-- Admin Header gọi từ hàm getAdminHeader() để đồng bộ -->
      <div v-html="getAdminHeader()"></div>

      <!-- Main Admin Viewport -->
      <main class="relative pt-16 bg-[#000000] min-h-screen flex flex-col justify-between">
        <div class="flex flex-col w-full p-8 gap-6">

          <!-- 2. Page Title Header (Bold uppercase sans-serif + thin horizontal divider, no breadcrumb) -->
          <div class="flex flex-col gap-3 pb-3 border-b border-[#262626]">
            <h1 class="font-headline-md text-[28px] font-bold text-white tracking-tight uppercase leading-none">
              QUẢN LÝ NHÀ XUẤT BẢN
            </h1>
          </div>

          <!-- 3. 4-Column KPI Row (Exact same card structure as reference) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Card 1: Amber left bar + top-right dot -->
            <div class="bg-[#111111] border border-[#262626] border-l-[3px] border-l-[#F59E0B] p-4 flex flex-col justify-between h-[108px] rounded-none relative">
              <div class="flex items-center justify-between">
                <span class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold">TỔNG NHÀ XUẤT BẢN</span>
                <span class="w-2 h-2 bg-[#F59E0B]"></span>
              </div>
              <div class="flex items-baseline justify-between mt-auto">
                <span class="font-mono-data-md text-[28px] text-white font-bold leading-none">
                  {{ String(totalPublishers).padStart(2, '0') }}
                </span>
                <span class="font-mono-data-md text-[11px] text-[#F59E0B] font-medium tracking-wider">ĐANG HOẠT ĐỘNG</span>
              </div>
            </div>

            <!-- Card 2: Blue left bar + top-right dot -->
            <div class="bg-[#111111] border border-[#262626] border-l-[3px] border-l-[#3B82F6] p-4 flex flex-col justify-between h-[108px] rounded-none relative">
              <div class="flex items-center justify-between">
                <span class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold">ĐẦU SÁCH LIÊN KẾT</span>
                <span class="w-2 h-2 bg-[#3B82F6]"></span>
              </div>
              <div class="flex items-baseline justify-between mt-auto">
                <span class="font-mono-data-md text-[28px] text-white font-bold leading-none">
                  {{ String(linkedBooks).padStart(2, '0') }}
                </span>
                <span class="font-mono-data-md text-[11px] text-[#3B82F6] font-medium tracking-wider">TRONG KHO</span>
              </div>
            </div>

            <!-- Card 3: Green left bar + top-right dot -->
            <div class="bg-[#111111] border border-[#262626] border-l-[3px] border-l-[#10B981] p-4 flex flex-col justify-between h-[108px] rounded-none relative">
              <div class="flex items-center justify-between">
                <span class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold">ĐÃ CÓ SÁCH</span>
                <span class="w-2 h-2 bg-[#10B981]"></span>
              </div>
              <div class="flex items-baseline justify-between mt-auto">
                <span class="font-mono-data-md text-[28px] text-white font-bold leading-none">
                  {{ String(hasBooksCount).padStart(2, '0') }}
                </span>
                <span class="font-mono-data-md text-[11px] text-[#10B981] font-medium tracking-wider">SẴN SÀNG</span>
              </div>
            </div>

            <!-- Card 4: Red left bar + top-right dot -->
            <div class="bg-[#111111] border border-[#262626] border-l-[3px] border-l-[#EF4444] p-4 flex flex-col justify-between h-[108px] rounded-none relative">
              <div class="flex items-center justify-between">
                <span class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold">CHƯA CÓ SÁCH</span>
                <span class="w-2 h-2 bg-[#EF4444]"></span>
              </div>
              <div class="flex items-baseline justify-between mt-auto">
                <span class="font-mono-data-md text-[28px] text-white font-bold leading-none">
                  {{ String(noBooksCount).padStart(2, '0') }}
                </span>
                <span class="font-mono-data-md text-[11px] text-[#EF4444] font-medium tracking-wider">CẦN CẬP NHẬT</span>
              </div>
            </div>
          </div>

          <!-- 4. Filter & Action Box (2-row dark bordered container matching reference) -->
          <div class="flex flex-col bg-[#111111] border border-[#262626]">
            <!-- Top Row: Search, Region Dropdown & Action Buttons -->
            <div class="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-end border-b border-[#1f1f1f]">
              <!-- Input 1: Search -->
              <div class="lg:col-span-5 flex flex-col gap-1.5">
                <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">TÌM KIẾM NHÀ XUẤT BẢN / ĐỊA CHỈ</label>
                <div class="relative flex items-center">
                  <span class="material-symbols-outlined text-[18px] text-[#8e9192] absolute left-3 pointer-events-none">search</span>
                  <input 
                    v-model="searchQuery"
                    @input="handleSearch"
                    class="w-full h-11 bg-[#141414] border border-[#262626] pl-10 pr-3 font-mono-data-md text-[13px] text-white placeholder-[#666666] focus:outline-none focus:border-white rounded-none transition-colors" 
                    placeholder="Tìm theo Tên nhà xuất bản, địa chỉ..." 
                    type="text">
                </div>
              </div>

              <!-- Input 2: Region Dropdown -->
              <div class="lg:col-span-3 flex flex-col gap-1.5">
                <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">KHU VỰC</label>
                <div class="relative flex items-center">
                  <select 
                    v-model="selectedRegion"
                    @change="handleRegionChange"
                    class="w-full h-11 bg-[#141414] border border-[#262626] px-3 font-mono-data-md text-[13px] text-white focus:outline-none focus:border-white rounded-none appearance-none cursor-pointer">
                    <option value="ALL">Tất cả khu vực</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Miền Bắc">Miền Bắc</option>
                    <option value="Miền Nam">Miền Nam</option>
                  </select>
                  <span class="material-symbols-outlined text-[18px] text-[#8e9192] absolute right-3 pointer-events-none">expand_more</span>
                </div>
              </div>

              <!-- Right Action Buttons (clean icons without duplicate characters) -->
              <div class="lg:col-span-4 flex items-center justify-end gap-2.5">
                <!-- Solid White Primary CTA Button -->
                <button 
                  @click="openAddModal" 
                  type="button" 
                  class="h-11 px-5 bg-white text-black font-mono-data-md text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#cccccc] border border-white transition-colors rounded-none cursor-pointer select-none">
                  <span class="material-symbols-outlined text-[18px] font-bold">add</span>
                  <span>THÊM NHÀ XUẤT BẢN</span>
                </button>

                <!-- Secondary Dark Bordered Button -->
                <button 
                  @click="exportCSV" 
                  type="button" 
                  class="h-11 px-4 bg-[#141414] text-white border border-[#333333] hover:bg-[#262626] hover:border-white font-mono-data-md text-[12px] uppercase flex items-center gap-1.5 transition-colors rounded-none cursor-pointer select-none" 
                  title="Xuất danh sách ra tệp CSV">
                  <span class="material-symbols-outlined text-[18px]">download</span>
                  <span>CSV</span>
                </button>
              </div>
            </div>

            <!-- Bottom Row: Filter Tabs Strip -->
            <div class="px-4 py-2 flex items-center gap-2 overflow-x-auto bg-[#0a0a0a]">
              <!-- Tab Tất Cả -->
              <button 
                @click="setFilterTab('ALL')" 
                type="button" 
                :class="[
                  'px-4 py-2 font-mono-data-md text-[11px] uppercase tracking-wider cursor-pointer transition-colors',
                  activeFilterTab === 'ALL' ? 'text-white border-b-2 border-white font-bold bg-[#141414]' : 'text-[#8e9192] hover:text-white hover:bg-[#141414] border-b-2 border-transparent'
                ]">
                TẤT CẢ ({{ String(totalPublishers).padStart(2, '0') }})
              </button>

              <!-- Tab Đang Liên Kết -->
              <button 
                @click="setFilterTab('LINKED')" 
                type="button" 
                :class="[
                  'px-4 py-2 font-mono-data-md text-[11px] uppercase tracking-wider cursor-pointer transition-colors',
                  activeFilterTab === 'LINKED' ? 'text-white border-b-2 border-white font-bold bg-[#141414]' : 'text-[#8e9192] hover:text-white hover:bg-[#141414] border-b-2 border-transparent'
                ]">
                ĐANG LIÊN KẾT ({{ String(hasBooksCount).padStart(2, '0') }})
              </button>

              <!-- Tab Chưa Có Sách -->
              <button 
                @click="setFilterTab('EMPTY')" 
                type="button" 
                :class="[
                  'px-4 py-2 font-mono-data-md text-[11px] uppercase tracking-wider cursor-pointer transition-colors',
                  activeFilterTab === 'EMPTY' ? 'text-white border-b-2 border-white font-bold bg-[#141414]' : 'text-[#8e9192] hover:text-white hover:bg-[#141414] border-b-2 border-transparent'
                ]">
                CHƯA CÓ SÁCH ({{ String(noBooksCount).padStart(2, '0') }})
              </button>
            </div>
          </div>

          <!-- 5. Main Data Table & Pagination -->
          <div class="border border-[#262626] bg-[#111111] rounded-none overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-left font-mono-data-md">
                <!-- Dark Table Header (#141414) -->
                <thead>
                  <tr class="bg-[#141414] border-b border-[#262626]">
                    <th class="p-3.5 text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold w-16 text-center">STT</th>
                    <th class="p-3.5 text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold">TÊN NHÀ XUẤT BẢN</th>
                    <th class="p-3.5 text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold">ĐỊA CHỈ TRỤ SỞ</th>
                    <th class="p-3.5 text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold text-center w-32">SỐ ĐẦU SÁCH</th>
                    <th class="p-3.5 text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold text-center w-32">CẬP NHẬT</th>
                    <th class="p-3.5 text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold text-center w-40">TRẠNG THÁI</th>
                    <th class="p-3.5 text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold text-right w-48">THAO TÁC XỬ LÝ</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#1f1f1f]">
                  <tr v-if="filteredPublishers.length === 0">
                    <td colspan="7" class="p-8 text-center text-[#8e9192] text-[13px]">
                      Không tìm thấy nhà xuất bản nào phù hợp với bộ lọc hiện tại.
                    </td>
                  </tr>

                  <!-- Row is clickable to view publisher's books with hover effect -->
                  <tr 
                    v-for="(p, index) in paginatedPublishers" 
                    :key="p._id || p.maNXB"
                    @click="openBooksModal(p)"
                    :class="[
                      'clickable-row',
                      index % 2 === 0 ? 'bg-[#0d0d0d]' : 'bg-[#111111]'
                    ]"
                    title="Bấm vào để xem danh sách đầu sách của Nhà xuất bản này">
                    <!-- STT (Strict CDM Data Rule: Sequential index only, no raw IDs on UI) -->
                    <td class="p-3.5 text-center text-[#8e9192] text-[13px] font-bold">
                      {{ String((currentPage - 1) * pageSize + index + 1).padStart(2, '0') }}
                    </td>

                    <!-- TÊN NHÀ XUẤT BẢN -->
                    <td class="p-3.5 text-white font-headline-md font-bold text-[14px]">
                      <span class="hover:underline hover:text-[#3B82F6] transition-colors">{{ p.tenNXB }}</span>
                    </td>

                    <!-- ĐỊA CHỈ TRỤ SỞ -->
                    <td class="p-3.5 text-[#c4c7c8] text-[12px]">
                      {{ p.diaChi }}
                    </td>

                    <!-- SỐ ĐẦU SÁCH -->
                    <td class="p-3.5 text-center text-[14px] font-bold text-white">
                      <span class="inline-block px-2.5 py-0.5 bg-[#141414] border border-[#262626]">
                        {{ String(p.soDauSach || 0).padStart(2, '0') }}
                      </span>
                    </td>

                    <!-- CẬP NHẬT -->
                    <td class="p-3.5 text-center text-[12px] text-[#8e9192]">
                      {{ p.capNhat }}
                    </td>

                    <!-- TRẠNG THÁI (nowrap, no square brackets) -->
                    <td class="p-3.5 text-center whitespace-nowrap">
                      <span 
                        v-if="(p.soDauSach || 0) > 0"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#10B981]/10 border border-[#10B981] text-[#10B981] text-[11px] font-bold uppercase rounded-none whitespace-nowrap">
                        <span class="w-1.5 h-1.5 bg-[#10B981]"></span>
                        • ĐANG LIÊN KẾT
                      </span>
                      <span 
                        v-else
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black border border-[#8e9192] text-[#8e9192] text-[11px] uppercase rounded-none whitespace-nowrap">
                        <span class="w-1.5 h-1.5 bg-[#8e9192]"></span>
                        • CHƯA CÓ SÁCH
                      </span>
                    </td>

                    <!-- THAO TÁC XỬ LÝ (no square brackets, with @click.stop) -->
                    <td class="p-3.5 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <!-- Solid White Button for Edit -->
                        <button 
                          @click.stop="openEditModal(p)"
                          class="h-8 px-3 bg-white text-black font-mono-data-md text-[11px] font-bold hover:bg-[#cccccc] border border-white transition-colors rounded-none cursor-pointer" 
                          type="button">
                          SỬA →
                        </button>
                        <!-- Dark Red Button for Delete -->
                        <button 
                          @click.stop="deletePublisher(p)"
                          class="h-8 px-3 bg-[#2A0A0A] text-[#EF4444] border border-[#7F1D1D] hover:bg-[#EF4444] hover:text-white font-mono-data-md text-[11px] font-bold transition-colors rounded-none cursor-pointer" 
                          type="button">
                          XÓA
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination Bar at Bottom of Table -->
            <div class="p-3.5 bg-[#0a0a0a] border-t border-[#262626] flex flex-col md:flex-row items-center justify-between gap-3 text-[12px]">
              <div class="text-[#8e9192]">
                Hiển thị <span class="text-white font-bold">{{ paginatedPublishers.length }}</span> trên tổng số <span class="text-white font-bold">{{ filteredPublishers.length }}</span> bản ghi
              </div>
              <div class="flex items-center gap-1">
                <button 
                  :disabled="currentPage === 1"
                  @click="goToPage(1)" 
                  class="w-8 h-8 flex items-center justify-center bg-[#141414] border border-[#333333] text-white hover:border-white rounded-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" 
                  type="button" 
                  title="Trang đầu">&lt;&lt;</button>
                <button 
                  :disabled="currentPage === 1"
                  @click="goToPage(currentPage - 1)" 
                  class="w-8 h-8 flex items-center justify-center bg-[#141414] border border-[#333333] text-white hover:border-white rounded-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" 
                  type="button" 
                  title="Trang trước">&lt;</button>
                <button 
                  v-for="p in totalPages" 
                  :key="p"
                  @click="goToPage(p)"
                  :class="[
                    'w-8 h-8 flex items-center justify-center border font-bold rounded-none cursor-pointer transition-colors',
                    currentPage === p ? 'bg-white border-white text-black' : 'bg-[#141414] border-[#333333] text-white hover:border-white'
                  ]" 
                  type="button">
                  {{ p }}
                </button>
                <button 
                  :disabled="currentPage === totalPages"
                  @click="goToPage(currentPage + 1)" 
                  class="w-8 h-8 flex items-center justify-center bg-[#141414] border border-[#333333] text-white hover:border-white rounded-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" 
                  type="button" 
                  title="Trang sau">&gt;</button>
                <button 
                  :disabled="currentPage === totalPages"
                  @click="goToPage(totalPages)" 
                  class="w-8 h-8 flex items-center justify-center bg-[#141414] border border-[#333333] text-white hover:border-white rounded-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" 
                  type="button" 
                  title="Trang cuối">&gt;&gt;</button>
              </div>
            </div>
          </div>

        </div>

        <!-- 6. Bottom Global Footer (Identical to reference) -->
        <footer class="w-full border-t border-[#262626] bg-[#000000] py-6 px-8 flex flex-col sm:flex-row justify-between items-start gap-4 rounded-none mt-auto select-none">
          <div class="flex flex-col gap-2 text-left text-xs text-[#8e9192]">
            <div class="leading-relaxed">
              <strong class="font-bold text-white uppercase">LIÊN HỆ QUẢN LÝ THƯ VIỆN:</strong> 
              quanly@thuvien.edu.vn | (0292) 3831 567
            </div>
            <div class="leading-relaxed">
              <strong class="font-bold text-white uppercase">LIÊN HỆ HỖ TRỢ KỸ THUẬT:</strong> 
              hotro@thuvien.edu.vn
            </div>
          </div>
          <div class="flex flex-col items-start sm:items-end text-left sm:text-right text-xs">
            <a class="font-headline-md text-white font-bold uppercase tracking-wider hover:underline transition-colors no-underline" href="#/home">
              QUY CHẾ THƯ VIỆN
            </a>
            <span class="text-[#8e9192] mt-1">
              Quy định mượn trả sách &amp; Bảo quản tài liệu
            </span>
          </div>
        </footer>
      </main>
    </div>

    <!-- MODAL 1: THÊM / CẬP NHẬT NHÀ XUẤT BẢN -->
    <div 
      v-if="showModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      @click.self="closeModal">
      <div class="bg-[#111111] border border-[#262626] w-full max-w-lg p-6 flex flex-col gap-5 rounded-none shadow-2xl" @click.stop>
        <!-- Modal Header -->
        <div class="flex items-center justify-between pb-3 border-b border-[#262626]">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 bg-white"></span>
            <h2 class="font-headline-md text-[18px] font-bold text-white uppercase tracking-wider">
              {{ modalMode === 'add' ? 'THÊM NHÀ XUẤT BẢN MỚI' : 'CẬP NHẬT NHÀ XUẤT BẢN' }}
            </h2>
          </div>
          <button @click="closeModal" class="text-[#8e9192] hover:text-white transition-colors cursor-pointer" type="button" title="Đóng (ESC)">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Form Inputs -->
        <div class="flex flex-col gap-4 text-[13px]">
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] text-[#8e9192] uppercase tracking-wider">TÊN NHÀ XUẤT BẢN <span class="text-[#EF4444]">*</span></label>
            <input 
              v-model="modalData.tenNXB" 
              type="text" 
              placeholder="Nhập tên đầy đủ của nhà xuất bản..."
              class="h-11 bg-[#141414] border border-[#262626] px-3 text-white focus:outline-none focus:border-white transition-colors rounded-none placeholder-[#666666]">
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] text-[#8e9192] uppercase tracking-wider">ĐỊA CHỈ TRỤ SỞ <span class="text-[#EF4444]">*</span></label>
            <textarea 
              v-model="modalData.diaChi" 
              rows="3" 
              placeholder="Số nhà, tên đường, quận/huyện, tỉnh/thành phố..."
              class="bg-[#141414] border border-[#262626] p-3 text-white focus:outline-none focus:border-white transition-colors rounded-none placeholder-[#666666] resize-none"></textarea>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="flex items-center justify-end gap-3 pt-3 border-t border-[#262626]">
          <button 
            @click="closeModal" 
            type="button" 
            class="h-10 px-5 bg-[#141414] text-white border border-[#333333] hover:bg-[#262626] hover:border-white text-[12px] uppercase transition-colors rounded-none cursor-pointer">
            HỦY BỎ
          </button>
          <button 
            @click="savePublisher" 
            type="button" 
            class="h-10 px-6 bg-white text-black text-[12px] font-bold uppercase hover:bg-[#cccccc] transition-colors rounded-none cursor-pointer flex items-center gap-1.5">
            <span>LƯU DỮ LIỆU</span>
            <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL 2: DANH SÁCH ĐẦU SÁCH THUỘC NHÀ XUẤT BẢN -->
    <div 
      v-if="showBooksModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      @click.self="closeBooksModal">
      <div 
        class="bg-[#111111] border border-[#262626] w-full max-w-4xl p-6 flex flex-col gap-4 rounded-none shadow-2xl max-h-[90vh]"
        @click.stop>
        <!-- Modal Header -->
        <div class="flex items-start justify-between pb-3 border-b border-[#262626]">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 bg-[#3B82F6]"></span>
              <h2 class="font-headline-md text-[18px] font-bold text-white uppercase tracking-wider">
                {{ selectedPublisher?.tenNXB }}
              </h2>
              <span class="px-2 py-0.5 bg-[#3B82F6]/10 border border-[#3B82F6] text-[#3B82F6] font-mono-data-md text-[11px] font-bold uppercase rounded-none whitespace-nowrap">
                {{ publisherBooks.length }} ĐẦU SÁCH
              </span>
            </div>
            <p class="font-mono-data-md text-[12px] text-[#8e9192] flex items-center gap-1.5 pl-5">
              <span class="material-symbols-outlined text-[15px]">location_on</span>
              <span>{{ selectedPublisher?.diaChi || 'Chưa cập nhật địa chỉ trụ sở' }}</span>
            </p>
          </div>
          <button 
            @click="closeBooksModal" 
            class="text-[#8e9192] hover:text-white transition-colors cursor-pointer p-1" 
            type="button" 
            title="Đóng (ESC)">
            <span class="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <!-- Modal Body: Books Table (scrollable) -->
        <div class="overflow-y-auto max-h-[55vh] border border-[#262626] bg-[#0a0a0a] modal-scroll">
          <div v-if="loadingBooks" class="p-10 text-center text-[#8e9192] text-[13px] flex items-center justify-center gap-2 font-mono-data-md">
            <span class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            <span>Đang truy vấn danh mục sách từ máy chủ...</span>
          </div>

          <div v-else-if="publisherBooks.length === 0" class="p-10 text-center flex flex-col items-center justify-center gap-3">
            <span class="material-symbols-outlined text-[36px] text-[#444748]">menu_book</span>
            <p class="text-[#8e9192] text-[13px] font-mono-data-md">
              Nhà xuất bản này hiện chưa có đầu sách nào trong hệ thống.
            </p>
          </div>

          <table v-else class="w-full border-collapse text-left font-mono-data-md text-[13px]">
            <thead class="bg-[#141414] border-b border-[#262626] sticky top-0 z-10">
              <tr>
                <th class="p-3 text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold w-14 text-center">STT</th>
                <th class="p-3 text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold">TÊN SÁCH</th>
                <th class="p-3 text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold w-36">THỂ LOẠI</th>
                <th class="p-3 text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold text-center w-24">NĂM XB</th>
                <th class="p-3 text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold text-right w-32">ĐƠN GIÁ</th>
                <th class="p-3 text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold text-center w-24">TỒN KHO</th>
                <th class="p-3 text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold text-center w-36">TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#1f1f1f]">
              <tr 
                v-for="(book, bIdx) in publisherBooks" 
                :key="book._id || book.maSach || bIdx"
                :class="bIdx % 2 === 0 ? 'bg-[#0d0d0d]' : 'bg-[#111111]'">
                <!-- STT (Strict CDM Data Rule: Sequential index only, no raw IDs) -->
                <td class="p-3 text-center text-[#8e9192] font-bold text-[12px]">
                  {{ String(bIdx + 1).padStart(2, '0') }}
                </td>

                <!-- TÊN SÁCH (kèm ảnh bìa thumbnail nếu có) -->
                <td class="p-3 text-white font-headline-md font-semibold">
                  <div class="flex items-center gap-3">
                    <img 
                      v-if="book.hinhAnh" 
                      :src="book.hinhAnh" 
                      alt="cover" 
                      class="w-8 h-10 object-cover border border-[#333333] shrink-0 bg-black">
                    <div v-else class="w-8 h-10 bg-[#1c1c1c] border border-[#333333] flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-[16px] text-[#8e9192]">book</span>
                    </div>
                    <span class="line-clamp-2 leading-tight text-[13px]">{{ book.tenSach }}</span>
                  </div>
                </td>

                <!-- THỂ LOẠI -->
                <td class="p-3 text-[#c4c7c8] text-[12px]">
                  {{ book.loai || book.theLoai || 'Giáo trình' }}
                </td>

                <!-- NĂM XB -->
                <td class="p-3 text-center text-[12px] text-[#8e9192]">
                  {{ book.namXB || book.namXuatBan || '—' }}
                </td>

                <!-- ĐƠN GIÁ (formatted VNĐ) -->
                <td class="p-3 text-right text-white font-bold text-[12px]">
                  {{ formatPrice(book.donGia) }}
                </td>

                <!-- TỒN KHO -->
                <td class="p-3 text-center font-bold text-white text-[12px]">
                  {{ (book.soLuong !== undefined ? book.soLuong : book.soQuyen) || 0 }}
                </td>

                <!-- TRẠNG THÁI -->
                <td class="p-3 text-center whitespace-nowrap">
                  <span 
                    v-if="book.trangThaiS !== false && book.trangThai !== false"
                    class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#10B981]/10 border border-[#10B981] text-[#10B981] text-[10px] font-bold uppercase rounded-none whitespace-nowrap">
                    <span class="w-1.5 h-1.5 bg-[#10B981]"></span>
                    ĐANG PHỤC VỤ
                  </span>
                  <span 
                    v-else
                    class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-black border border-[#8e9192] text-[#8e9192] text-[10px] uppercase rounded-none whitespace-nowrap">
                    <span class="w-1.5 h-1.5 bg-[#8e9192]"></span>
                    NGỪNG PHỤC VỤ
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-between pt-3 border-t border-[#262626]">
          <div class="text-[12px] text-[#8e9192] font-mono-data-md">
            Tổng cộng: <span class="text-white font-bold">{{ publisherBooks.length }}</span> đầu sách liên kết
          </div>
          <button 
            @click="closeBooksModal" 
            type="button" 
            class="h-10 px-6 bg-white text-black font-mono-data-md text-[12px] font-bold uppercase hover:bg-[#cccccc] transition-colors rounded-none cursor-pointer">
            ĐÓNG
          </button>
        </div>
      </div>
    </div>

    <!-- TOAST NOTIFICATION -->
    <div 
      v-if="toast.show" 
      :class="[
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 font-mono-data-md text-[13px] shadow-2xl border',
        toast.type === 'error' ? 'bg-[#2A0A0A] border-[#EF4444] text-[#EF4444]' : (toast.type === 'success' ? 'bg-[#0a1a0f] border-[#10B981] text-[#10B981]' : (toast.type === 'warning' ? 'bg-[#1f1600] border-[#F59E0B] text-[#F59E0B]' : 'bg-[#111111] border-[#262626] text-white'))
      ]">
      <span class="material-symbols-outlined text-[18px]">
        {{ toast.type === 'error' ? 'error' : (toast.type === 'success' ? 'check_circle' : (toast.type === 'warning' ? 'warning' : 'info')) }}
      </span>
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script src="../js/publisherManagement.js"></script>
<style scoped src="../css/publisherManagement.css"></style>

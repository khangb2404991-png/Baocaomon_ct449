<template>
  <div class="bg-[#131313] font-body-md text-[#e2e2e2] antialiased min-h-screen">
    <!-- Admin Sidebar gọi từ hàm getAdminSidebar('fines') để đồng bộ -->
    <div v-html="getAdminSidebar('fines')"></div>

    <div class="pl-72 flex flex-col min-h-screen">
      <!-- Admin Header gọi từ hàm getAdminHeader() để đồng bộ -->
      <div v-html="getAdminHeader()"></div>

      <!-- Main Admin Viewport -->
      <main class="relative pt-16 flex-1 bg-[#131313] px-8 py-6 flex flex-col justify-between">
        <div class="flex flex-col w-full">
          <!-- Top Instrument Accent Bar (M-Stripe) -->
          <div class="flex items-center mb-6">
            <div class="w-4 h-[3px] bg-[#0066b1]"></div>
            <div class="w-4 h-[3px] bg-[#1c69d4]"></div>
            <div class="w-4 h-[3px] bg-[#e22718]"></div>
            <div class="h-[1px] flex-1 bg-[#444748]/30"></div>
          </div>

          <!-- Page Header -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div class="flex flex-col">
              <h1 class="font-sans-heading text-[28px] font-extrabold uppercase text-white tracking-tight">
                QUẢN LÝ PHIẾU PHẠT
              </h1>
            </div>
            <button 
              @click="goToCreateTicket"
              type="button"
              class="bg-white text-black font-title-sm text-[14px] font-bold px-4 h-[38px] flex items-center justify-center gap-2 hover:bg-[#c6c6c7] transition-colors cursor-pointer select-none border border-white">
              <span class="material-symbols-outlined text-[18px]">add</span>
              <span>LẬP PHIẾU PHẠT MỚI</span>
            </button>
          </div>

          <!-- 4 KPI Summary Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <!-- Card 1: Chưa Nộp Phạt (Amber) -->
            <div class="bg-[#1b1b1b] border border-[#444748]/30 border-l-2 border-l-[#D97706] p-4 relative flex flex-col justify-between h-[104px]">
              <div class="flex items-start justify-between">
                <span class="font-label-caps text-[11px] text-[#c4c7c8] uppercase tracking-wider font-semibold">CHƯA NỘP PHẠT</span>
                <div class="w-1.5 h-1.5 bg-[#D97706]"></div>
              </div>
              <div class="flex items-baseline justify-between mt-auto">
                <span class="font-mono-data-lg text-[24px] text-white font-bold">
                  {{ String(unpaidCount).padStart(2, '0') }}
                </span>
                <span class="font-label-caps text-[11px] text-[#D97706] uppercase tracking-wider font-semibold">GHI NỢ MỚI</span>
              </div>
            </div>

            <!-- Card 2: Tổng Phiếu Phạt (Blue) -->
            <div class="bg-[#1b1b1b] border border-[#444748]/30 border-l-2 border-l-[#2563EB] p-4 relative flex flex-col justify-between h-[104px]">
              <div class="flex items-start justify-between">
                <span class="font-label-caps text-[11px] text-[#c4c7c8] uppercase tracking-wider font-semibold">TỔNG PHIẾU PHẠT</span>
                <div class="w-1.5 h-1.5 bg-[#2563EB]"></div>
              </div>
              <div class="flex items-baseline justify-between mt-auto">
                <span class="font-mono-data-lg text-[24px] text-white font-bold">
                  {{ String(totalCount).padStart(2, '0') }}
                </span>
                <span class="font-label-caps text-[11px] text-[#2563EB] uppercase tracking-wider font-semibold">TRONG THÁNG</span>
              </div>
            </div>

            <!-- Card 3: Đã Thu Trong Tháng (Green) -->
            <div class="bg-[#1b1b1b] border border-[#444748]/30 border-l-2 border-l-[#16A34A] p-4 relative flex flex-col justify-between h-[104px]">
              <div class="flex items-start justify-between">
                <span class="font-label-caps text-[11px] text-[#c4c7c8] uppercase tracking-wider font-semibold">ĐÃ THU TRONG THÁNG</span>
                <div class="w-1.5 h-1.5 bg-[#16A34A]"></div>
              </div>
              <div class="flex items-baseline justify-between mt-auto">
                <span class="font-mono-data-lg text-[24px] text-white font-bold">
                  {{ String(paidCount).padStart(2, '0') }}
                </span>
                <span class="font-label-caps text-[11px] text-[#16A34A] uppercase tracking-wider font-semibold">HOÀN TẤT THU</span>
              </div>
            </div>

            <!-- Card 4: Quá Hạn Chưa Nộp (Red) -->
            <div class="bg-[#1b1b1b] border border-[#444748]/30 border-l-2 border-l-[#DC2626] p-4 relative flex flex-col justify-between h-[104px]">
              <div class="flex items-start justify-between">
                <span class="font-label-caps text-[11px] text-[#c4c7c8] uppercase tracking-wider font-semibold">QUÁ HẠN CHƯA NỘP</span>
                <div class="w-1.5 h-1.5 bg-[#DC2626]"></div>
              </div>
              <div class="flex items-baseline justify-between mt-auto">
                <span class="font-mono-data-lg text-[24px] text-white font-bold">
                  {{ String(overdueCount).padStart(2, '0') }}
                </span>
                <span class="font-label-caps text-[11px] text-[#DC2626] uppercase tracking-wider font-semibold">CẦN THU HỒI</span>
              </div>
            </div>
          </div>

          <!-- Search, Date Filter & Status Tabs Console -->
          <div class="bg-[#1b1b1b] border border-[#444748]/30 mb-6">
            <!-- Top Filter Row -->
            <div class="p-4 flex flex-col lg:flex-row items-stretch lg:items-end gap-3">
              <!-- Search Input -->
              <div class="flex-1 flex flex-col gap-1.5">
                <label class="font-label-caps text-[11px] text-[#8e9192] uppercase tracking-wider">TÌM KIẾM ĐỘC GIẢ / PHIẾU PHẠT</label>
                <div class="relative flex items-center">
                  <input 
                    v-model="searchKeyword"
                    class="w-full bg-[#0e0e0e] border border-[#444748]/40 text-white font-mono-data-md text-[13px] px-3 h-[40px] focus:outline-none focus:border-white transition-colors placeholder:text-[#8e9192]/60" 
                    placeholder="Tìm theo Tên độc giả, Email, Tên sách vi phạm..." 
                    type="text">
                </div>
              </div>

              <!-- From Date -->
              <div class="w-full lg:w-44 flex flex-col gap-1.5">
                <label class="font-label-caps text-[11px] text-[#8e9192] uppercase tracking-wider">TỪ NGÀY LẬP</label>
                <input 
                  v-model="fromDate"
                  class="w-full bg-[#0e0e0e] border border-[#444748]/40 text-white font-mono-data-md text-[13px] px-3 h-[40px] focus:outline-none focus:border-white transition-colors text-center [color-scheme:dark]" 
                  type="date">
              </div>

              <!-- To Date -->
              <div class="w-full lg:w-44 flex flex-col gap-1.5">
                <label class="font-label-caps text-[11px] text-[#8e9192] uppercase tracking-wider">ĐẾN NGÀY LẬP</label>
                <input 
                  v-model="toDate"
                  class="w-full bg-[#0e0e0e] border border-[#444748]/40 text-white font-mono-data-md text-[13px] px-3 h-[40px] focus:outline-none focus:border-white transition-colors text-center [color-scheme:dark]" 
                  type="date">
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-2">
                <button 
                  @click="currentPage = 1"
                  type="button"
                  class="h-[40px] px-5 bg-white text-black font-label-caps text-[11px] uppercase font-bold tracking-wider hover:bg-[#c6c6c7] transition-colors cursor-pointer select-none">
                  LỌC DỮ LIỆU
                </button>
                <button 
                  @click="exportCSV"
                  type="button"
                  class="h-[40px] px-4 bg-[#1f1f1f] border border-[#444748]/40 text-white font-label-caps text-[11px] uppercase tracking-wider hover:bg-[#2a2a2a] transition-colors cursor-pointer select-none flex items-center gap-1.5"
                  title="Xuất file CSV báo cáo">
                  <span>↓</span>
                  <span>CSV</span>
                </button>
              </div>
            </div>

            <!-- Status Tab Bar -->
            <div class="px-4 border-t border-[#444748]/30 flex flex-wrap gap-6 font-label-caps text-[11px] pt-3 pb-2 overflow-x-auto">
              <button 
                @click="filterByTab('ALL')"
                :class="[
                  'pb-2 tracking-wider transition-colors cursor-pointer whitespace-nowrap',
                  activeTab === 'ALL' ? 'text-white border-b-2 border-white font-bold' : 'text-[#c4c7c8] hover:text-white'
                ]"
                type="button">
                TẤT CẢ ({{ totalCount }})
              </button>
              <button 
                @click="filterByTab('UNPAID')"
                :class="[
                  'pb-2 tracking-wider transition-colors cursor-pointer whitespace-nowrap',
                  activeTab === 'UNPAID' ? 'text-white border-b-2 border-white font-bold' : 'text-[#c4c7c8] hover:text-white'
                ]"
                type="button">
                CHƯA NỘP ({{ unpaidCount }})
              </button>
              <button 
                @click="filterByTab('OVERDUE')"
                :class="[
                  'pb-2 tracking-wider transition-colors cursor-pointer whitespace-nowrap',
                  activeTab === 'OVERDUE' ? 'text-white border-b-2 border-white font-bold' : 'text-[#c4c7c8] hover:text-white'
                ]"
                type="button">
                QUÁ HẠN CHƯA NỘP ({{ overdueCount }})
              </button>
              <button 
                @click="filterByTab('PAID')"
                :class="[
                  'pb-2 tracking-wider transition-colors cursor-pointer whitespace-nowrap',
                  activeTab === 'PAID' ? 'text-white border-b-2 border-white font-bold' : 'text-[#c4c7c8] hover:text-white'
                ]"
                type="button">
                ĐÃ THANH TOÁN ({{ paidCount }})
              </button>
            </div>
          </div>

          <!-- Main Telemetry Data Table Container -->
          <div class="border border-[#444748]/30 bg-[#0e0e0e] overflow-x-auto">
            <table class="w-full border-collapse text-left min-w-[1100px]">
              <thead>
                <tr class="bg-[#1b1b1b] border-b border-[#444748]/30 font-label-caps text-[11px] text-[#8e9192] uppercase tracking-wider">
                  <th class="py-3 px-4 font-semibold">ĐỘC GIẢ VI PHẠM</th>
                  <th class="py-3 px-4 font-semibold">THÔNG TIN BIÊN BẢN &amp; VI PHẠM</th>
                  <th class="py-3 px-4 font-semibold text-center">SỐ MỤC</th>
                  <th class="py-3 px-4 font-semibold">NGÀY LẬP</th>
                  <th class="py-3 px-4 font-semibold">TỔNG TIỀN PHẠT</th>
                  <th class="py-3 px-4 font-semibold">CÁN BỘ LẬP BIÊN BẢN</th>
                  <th class="py-3 px-4 font-semibold text-center">TRẠNG THÁI</th>
                  <th class="py-3 px-4 font-semibold text-right">THAO TÁC XỬ LÝ</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#444748]/20 font-body-md text-[13px]">
                <tr 
                  v-for="(fine, idx) in paginatedFines" 
                  :key="fine.maPhieuPhat || idx"
                  :class="[
                    'hover:bg-[#1f1f1f]/50 transition-colors',
                    idx % 2 === 1 ? 'bg-[#1b1b1b]/40' : 'bg-[#0e0e0e]',
                    fine.trangThai === 'QUA_HAN' ? 'border-l-2 border-l-[#DC2626]' : ''
                  ]">
                  <!-- Độc giả -->
                  <td class="py-3 px-4 align-top">
                    <div :class="['font-sans-heading text-[14px] font-bold leading-tight', fine.trangThai === 'QUA_HAN' ? 'text-[#DC2626]' : 'text-white']">
                      {{ fine.tenDocGia }}
                    </div>
                    <div class="font-label-caps text-[11px] text-[#c4c7c8] font-mono mt-0.5">
                      {{ fine.emailDocGia }}
                    </div>
                  </td>

                  <!-- Thông tin biên bản & Vi phạm -->
                  <td class="py-3 px-4 align-top max-w-[280px]">
                    <div class="font-sans-heading text-white truncate font-semibold text-[14px]">
                      {{ fine.tenSachChinh }}
                    </div>
                    <div :class="[
                      'font-label-caps text-[11px] mt-0.5',
                      fine.trangThai === 'QUA_HAN' ? 'text-[#DC2626] font-bold' : (fine.trangThai === 'CHUA_NOP' ? 'text-[#D97706]' : 'text-[#c4c7c8]')
                    ]">
                      {{ fine.lyDoTomTat }}
                    </div>
                  </td>

                  <!-- Số mục -->
                  <td class="py-3 px-4 align-top text-center font-mono-data-md text-[13px] font-bold text-white tabular-nums">
                    {{ String(fine.soMuc || 1).padStart(2, '0') }}
                  </td>

                  <!-- Ngày lập -->
                  <td class="py-3 px-4 align-top">
                    <div class="font-mono-data-md text-[13px] text-[#c4c7c8] tabular-nums">
                      {{ fine.ngayLapFormatted || fine.ngayLap }}
                    </div>
                    <div v-if="fine.quaHanText" class="font-label-caps text-[10px] text-[#DC2626] font-semibold tabular-nums">
                      {{ fine.quaHanText }}
                    </div>
                  </td>

                  <!-- Tổng tiền phạt -->
                  <td class="py-3 px-4 align-top">
                    <div :class="['font-mono-data-md text-[14px] font-bold tabular-nums', fine.trangThai === 'QUA_HAN' ? 'text-[#DC2626]' : 'text-white']">
                      {{ formatVND(fine.tongTienPhat) }} VNĐ
                    </div>
                    <div class="font-label-caps text-[10px] text-[#8e9192] tabular-nums">
                      {{ fine.chiTietTien }}
                    </div>
                  </td>

                  <!-- Cán bộ lập -->
                  <td class="py-3 px-4 align-top">
                    <div class="font-sans-heading text-white font-semibold">
                      {{ fine.tenNV || 'Trần Văn B' }}
                    </div>
                  </td>

                  <!-- Trạng thái -->
                  <td class="py-3 px-4 align-top text-center">
                    <span 
                      v-if="fine.trangThai === 'CHUA_NOP'"
                      class="inline-flex items-center px-2 py-0.5 font-label-caps text-[11px] border border-[#D97706]/60 text-[#D97706] bg-[#D97706]/10 font-bold">
                      [ CHƯA NỘP ]
                    </span>
                    <span 
                      v-else-if="fine.trangThai === 'QUA_HAN'"
                      class="inline-flex items-center px-2 py-0.5 font-label-caps text-[11px] border border-[#DC2626] text-[#DC2626] bg-[#DC2626]/20 font-bold">
                      [ QUÁ HẠN NỘP ]
                    </span>
                    <span 
                      v-else-if="fine.trangThai === 'DA_THU'"
                      class="inline-flex items-center px-2 py-0.5 font-label-caps text-[11px] border border-[#16A34A]/60 text-[#16A34A] bg-[#16A34A]/10 font-semibold">
                      ■ ĐÃ THANH TOÁN
                    </span>
                  </td>

                  <!-- Thao tác xử lý -->
                  <td class="py-3 px-4 align-top text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button 
                        v-if="fine.trangThai === 'CHUA_NOP'"
                        @click="confirmPayment(fine)"
                        type="button"
                        class="bg-white text-black font-label-caps text-[11px] font-bold px-3 py-1.5 uppercase hover:bg-[#c6c6c7] transition-colors cursor-pointer border border-white">
                        XÁC NHẬN THU →
                      </button>
                      <button 
                        v-else-if="fine.trangThai === 'QUA_HAN'"
                        @click="confirmPayment(fine)"
                        type="button"
                        class="bg-[#DC2626] text-white font-label-caps text-[11px] font-bold px-3 py-1.5 uppercase hover:bg-[#b91c1c] transition-colors cursor-pointer border border-[#DC2626]">
                        XÁC NHẬN ĐÃ THU ✓
                      </button>
                      <span 
                        v-else-if="fine.trangThai === 'DA_THU'"
                        class="font-label-caps text-[11px] text-[#8e9192] uppercase tracking-wider font-semibold mr-1">
                        HOÀN TẤT
                      </span>

                      <button 
                        @click="openDetail(fine)"
                        type="button"
                        class="bg-[#1f1f1f] border border-[#444748]/40 text-white font-label-caps text-[11px] px-2.5 py-1.5 uppercase hover:bg-[#2a2a2a] transition-colors cursor-pointer">
                        CHI TIẾT
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="filteredFines.length === 0">
                  <td colspan="8" class="text-center py-8 text-[#8e9192] font-mono-data-md">
                    Không tìm thấy bản ghi phiếu phạt nào phù hợp với điều kiện lọc.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Bar -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-1 mt-1 font-label-caps text-[11px] text-[#8e9192]">
            <div>
              Hiển thị {{ paginatedFines.length > 0 ? (currentPage - 1) * pageSize + 1 : 0 }} - {{ Math.min(currentPage * pageSize, filteredFines.length) }} trên tổng số {{ filteredFines.length }} bản ghi
            </div>
            <div class="flex items-center gap-1 font-mono-data-md text-[13px]">
              <button 
                :disabled="currentPage === 1"
                @click="goToPage(1)"
                class="w-8 h-8 flex items-center justify-center bg-[#1b1b1b] border border-[#444748]/30 text-[#c4c7c8] hover:text-white hover:border-[#8e9192] disabled:opacity-30 transition-colors cursor-pointer"
                type="button">
                &lt;&lt;
              </button>
              <button 
                :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)"
                class="w-8 h-8 flex items-center justify-center bg-[#1b1b1b] border border-[#444748]/30 text-[#c4c7c8] hover:text-white hover:border-[#8e9192] disabled:opacity-30 transition-colors cursor-pointer"
                type="button">
                &lt;
              </button>
              <button 
                v-for="p in totalPages" 
                :key="p"
                @click="goToPage(p)"
                :class="[
                  'w-8 h-8 flex items-center justify-center font-bold cursor-pointer transition-colors',
                  currentPage === p ? 'bg-white text-black' : 'bg-[#1b1b1b] border border-[#444748]/30 text-[#c4c7c8] hover:text-white hover:border-[#8e9192]'
                ]"
                type="button">
                {{ p }}
              </button>
              <button 
                :disabled="currentPage === totalPages"
                @click="goToPage(currentPage + 1)"
                class="w-8 h-8 flex items-center justify-center bg-[#1b1b1b] border border-[#444748]/30 text-[#c4c7c8] hover:text-white hover:border-[#8e9192] disabled:opacity-30 transition-colors cursor-pointer"
                type="button">
                &gt;
              </button>
              <button 
                :disabled="currentPage === totalPages"
                @click="goToPage(totalPages)"
                class="w-8 h-8 flex items-center justify-center bg-[#1b1b1b] border border-[#444748]/30 text-[#c4c7c8] hover:text-white hover:border-[#8e9192] disabled:opacity-30 transition-colors cursor-pointer"
                type="button">
                &gt;&gt;
              </button>
            </div>
          </div>

          <!-- Operational Notes & Rules Panel (Giữ nguyên từ qlpp.html) -->
          <div class="mt-6 border-t border-[#444748]/30 pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-label-caps text-[11px] text-[#8e9192]">
            <div class="flex flex-col gap-1">
              <div>LIÊN HỆ QUẢN LÝ THƯ VIỆN: <span class="text-white">quanly@thuvien.edu.vn</span> | <span class="text-white">(0292) 3831 567</span></div>
              <div>LIÊN HỆ HỖ TRỢ KỸ THUẬT: <span class="text-white">hotro@thuvien.edu.vn</span></div>
            </div>
            <div class="flex flex-col md:items-end gap-1 text-right">
              <a class="text-white hover:underline uppercase font-bold tracking-wider no-underline" href="#">QUY CHẾ THƯ VIỆN →</a>
              <div class="text-[#c4c7c8]">Quy định mượn trả sách &amp; Bảo quản tài liệu</div>
            </div>
          </div>
        </div>

        <!-- Admin Footer gọi từ hàm getAdminFooter() để đồng bộ -->
        <div v-html="getAdminFooter()" class="mt-8"></div>
      </main>
    </div>

    <!-- MODAL XEM CHI TIẾT BIÊN BẢN PHIẾU PHẠT -->
    <div 
      v-if="showDetailModal && selectedFine"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div class="bg-[#141414] border border-[#444748] w-full max-w-xl p-6 flex flex-col gap-5 shadow-2xl relative">
        <div class="flex items-center justify-between pb-3 border-b border-[#262626]">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 bg-[#1c69d4]"></span>
            <h2 class="font-sans-heading text-[16px] font-bold text-white uppercase tracking-wider">
              CHI TIẾT BIÊN BẢN PHIẾU PHẠT
            </h2>
          </div>
          <button 
            @click="closeDetail"
            class="text-[#8e9192] hover:text-white material-symbols-outlined text-[20px] cursor-pointer"
            type="button">
            close
          </button>
        </div>

        <div class="space-y-4 font-mono-data-md text-[13px]">
          <div class="grid grid-cols-2 gap-4 bg-[#0e0e0e] p-3 border border-[#262626]">
            <div>
              <span class="text-[#8e9192] text-[11px] block uppercase">Độc giả vi phạm:</span>
              <strong class="text-white font-bold text-[14px]">{{ selectedFine.tenDocGia }}</strong>
              <div class="text-[#8e9192] text-[11px]">{{ selectedFine.emailDocGia }}</div>
            </div>
            <div>
              <span class="text-[#8e9192] text-[11px] block uppercase">Cán bộ lập biên bản:</span>
              <strong class="text-white font-bold">{{ selectedFine.tenNV || 'Trần Văn B' }}</strong>
              <div class="text-[#8e9192] text-[11px]">Ngày lập: {{ selectedFine.ngayLapFormatted || selectedFine.ngayLap }}</div>
            </div>
          </div>

          <div class="bg-[#0e0e0e] p-3 border border-[#262626] space-y-2">
            <div class="text-[#8e9192] text-[11px] uppercase tracking-wider">Tài liệu &amp; Nội dung vi phạm:</div>
            <div class="text-white font-bold text-[14px]">{{ selectedFine.tenSachChinh }}</div>
            <div class="text-[#D97706] text-[12px]">{{ selectedFine.lyDoTomTat }}</div>
            <div v-if="selectedFine.ghiChu" class="text-[#c4c7c8] text-[12px] italic border-t border-[#262626] pt-2 mt-2">
              Ghi chú: {{ selectedFine.ghiChu }}
            </div>
          </div>

          <div class="flex items-center justify-between p-3 bg-[#1b1b1b] border border-[#262626]">
            <span class="text-[#c4c7c8] uppercase font-bold">TỔNG TIỀN PHẠT:</span>
            <span class="text-[20px] font-bold text-white">{{ formatVND(selectedFine.tongTienPhat) }} VNĐ</span>
          </div>

          <div class="flex items-center justify-between pt-2">
            <span class="text-[#8e9192]">Trạng thái xử lý:</span>
            <span 
              v-if="selectedFine.trangThai === 'CHUA_NOP'"
              class="px-2 py-0.5 border border-[#D97706]/60 text-[#D97706] bg-[#D97706]/10 font-bold text-[11px]">
              CHƯA NỘP
            </span>
            <span 
              v-else-if="selectedFine.trangThai === 'QUA_HAN'"
              class="px-2 py-0.5 border border-[#DC2626] text-[#DC2626] bg-[#DC2626]/20 font-bold text-[11px]">
              QUÁ HẠN CHƯA NỘP
            </span>
            <span 
              v-else-if="selectedFine.trangThai === 'DA_THU'"
              class="px-2 py-0.5 border border-[#16A34A]/60 text-[#16A34A] bg-[#16A34A]/10 font-bold text-[11px]">
              ĐÃ THANH TOÁN
            </span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-[#262626]">
          <button 
            v-if="selectedFine.trangThai !== 'DA_THU'"
            @click="confirmPayment(selectedFine); closeDetail();"
            type="button"
            class="bg-white text-black font-label-caps text-[11px] font-bold px-4 py-2 uppercase hover:bg-[#c6c6c7] transition-colors cursor-pointer">
            XÁC NHẬN THU TIỀN TẠI QUẦY
          </button>
          <button 
            @click="closeDetail"
            type="button"
            class="bg-[#1f1f1f] text-white border border-[#444748] px-4 py-2 font-label-caps text-[11px] uppercase hover:bg-[#2a2a2a] transition-colors cursor-pointer">
            ĐÓNG
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="../js/fineManagement.js"></script>
<style scoped src="../css/fineManagement.css"></style>

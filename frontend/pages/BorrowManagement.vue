<template>
  <div class="bg-[#131313] font-body-md text-[#e2e2e2] antialiased min-h-screen">
    <!-- Admin Sidebar gọi từ hàm getAdminSidebar('borrow') để đồng bộ -->
    <div v-html="getAdminSidebar('borrow')"></div>

    <div class="pl-72 flex flex-col min-h-screen">
      <!-- Admin Header gọi từ hàm getAdminHeader() để đồng bộ -->
      <div v-html="getAdminHeader()"></div>

      <!-- Main Admin Viewport -->
      <main class="relative pt-16 bg-[#131313] min-h-screen flex flex-col justify-between">
        <div class="flex flex-col w-full">
          <!-- M-Stripe Master Identifier -->
          <div class="flex w-full h-[3px]">
            <div class="w-12 h-full bg-[#0066b1]"></div>
            <div class="w-12 h-full bg-[#1c69d4]"></div>
            <div class="w-12 h-full bg-[#e22718]"></div>
            <div class="flex-1 h-full bg-[#262626]"></div>
          </div>

          <div class="p-6 flex flex-col gap-6">
            <!-- Header Block -->
            <div class="flex flex-col md:flex-row md:items-end justify-between border-b border-[#3c3c3c] pb-4 gap-2">
              <div class="flex flex-col">
                <h1 class="font-headline-md text-[24px] font-bold text-white tracking-tight uppercase mt-1 leading-none">
                  QUẢN LÝ THEO DÕI MƯỢN TRẢ SÁCH
                </h1>
              </div>
            </div>

            <!-- 4 Compact Metric Boxes -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Box 1: Chờ Duyệt -->
              <div class="bg-[#1a1a1a] border border-[#3c3c3c] p-4 flex flex-col justify-between rounded-none border-l-2 border-l-[#f4b400]">
                <div class="flex items-center justify-between">
                  <span class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">CHỜ DUYỆT</span>
                  <span class="w-2 h-2 bg-[#f4b400]"></span>
                </div>
                <div class="flex items-baseline justify-between mt-2">
                  <span class="font-mono-data-md text-[24px] text-white font-bold">
                    {{ String(metrics.choDuyet).padStart(2, '0') }}
                  </span>
                  <span class="font-mono-data-md text-[11px] text-[#f4b400]">YÊU CẦU MỚI</span>
                </div>
              </div>

              <!-- Box 2: Đang Mượn -->
              <div class="bg-[#1a1a1a] border border-[#3c3c3c] p-4 flex flex-col justify-between rounded-none border-l-2 border-l-[#1c69d4]">
                <div class="flex items-center justify-between">
                  <span class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">ĐANG MƯỢN</span>
                  <span class="w-2 h-2 bg-[#1c69d4]"></span>
                </div>
                <div class="flex items-baseline justify-between mt-2">
                  <span class="font-mono-data-md text-[24px] text-white font-bold">
                    {{ String(metrics.dangMuon).padStart(2, '0') }}
                  </span>
                  <span class="font-mono-data-md text-[11px] text-[#1c69d4]">TRONG HẠN</span>
                </div>
              </div>

              <!-- Box 3: Đã Trả Trong Tháng -->
              <div class="bg-[#1a1a1a] border border-[#3c3c3c] p-4 flex flex-col justify-between rounded-none border-l-2 border-l-[#0fa336]">
                <div class="flex items-center justify-between">
                  <span class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">ĐÃ TRẢ TRONG THÁNG</span>
                  <span class="w-2 h-2 bg-[#0fa336]"></span>
                </div>
                <div class="flex items-baseline justify-between mt-2">
                  <span class="font-mono-data-md text-[24px] text-white font-bold">
                    {{ String(metrics.daTra).padStart(2, '0') }}
                  </span>
                  <span class="font-mono-data-md text-[11px] text-[#0fa336]">HOÀN TẤT TRẢ</span>
                </div>
              </div>

              <!-- Box 4: Quá Hạn Chưa Trả -->
              <div class="bg-[#1a1a1a] border border-[#3c3c3c] p-4 flex flex-col justify-between rounded-none border-l-2 border-l-[#e22718]">
                <div class="flex items-center justify-between">
                  <span class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">QUÁ HẠN CHƯA TRẢ</span>
                  <span class="w-2 h-2 bg-[#e22718]"></span>
                </div>
                <div class="flex items-baseline justify-between mt-2">
                  <span class="font-mono-data-md text-[24px] text-white font-bold">
                    {{ String(metrics.quaHan).padStart(2, '0') }}
                  </span>
                  <span class="font-mono-data-md text-[11px] text-[#e22718]">CẦN THU HỒI</span>
                </div>
              </div>
            </div>

            <!-- Filter & Segment Row -->
            <div class="flex flex-col gap-2 bg-[#0d0d0d] border border-[#3c3c3c] p-4">
              <!-- Search & Controls -->
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                <div class="lg:col-span-4 flex flex-col gap-1">
                  <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">TÌM KIẾM ĐỘC GIẢ / SÁCH</label>
                  <div class="relative flex items-center">
                    <span class="material-symbols-outlined text-[18px] text-[#8e9192] absolute left-3 pointer-events-none">search</span>
                    <input 
                      v-model="filters.search"
                      id="searchInput" 
                      class="w-full h-11 bg-[#1a1a1a] border border-[#3c3c3c] pl-10 pr-3 font-mono-data-md text-[13px] text-white placeholder-[#8e9192] focus:outline-none focus:border-[#1c69d4] rounded-none transition-colors" 
                      placeholder="Tìm theo Tên độc giả, SĐT, hoặc Tên sách..." 
                      type="text">
                  </div>
                </div>

                <div class="lg:col-span-5 flex flex-col sm:flex-row gap-2">
                  <div class="flex-1 flex flex-col gap-1">
                    <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">TỪ NGÀY (NGAYMUON)</label>
                    <input 
                      v-model="filters.fromDate"
                      class="w-full h-11 bg-[#1a1a1a] border border-[#3c3c3c] px-3 font-mono-data-md text-[13px] text-white focus:outline-none focus:border-[#1c69d4] rounded-none [color-scheme:dark]" 
                      type="date">
                  </div>
                  <div class="flex-1 flex flex-col gap-1">
                    <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">ĐẾN NGÀY (NGAYTRA)</label>
                    <input 
                      v-model="filters.toDate"
                      class="w-full h-11 bg-[#1a1a1a] border border-[#3c3c3c] px-3 font-mono-data-md text-[13px] text-white focus:outline-none focus:border-[#1c69d4] rounded-none [color-scheme:dark]" 
                      type="date">
                  </div>
                </div>

                <div class="lg:col-span-3 flex items-center gap-2">
                  <button 
                    @click="exportCSV"
                    class="h-11 px-4 bg-[#1a1a1a] text-white border border-[#3c3c3c] hover:bg-[#262626] hover:border-white font-mono-data-md text-[11px] uppercase flex items-center gap-1 transition-colors rounded-none cursor-pointer" 
                    title="Xuất CSV" 
                    type="button">
                    <span class="material-symbols-outlined text-[18px]">download</span>
                    XUẤT CSV
                  </button>
                </div>
              </div>

              <!-- Segment Tabs -->
              <div class="flex items-center gap-px bg-[#1a1a1a] border border-[#3c3c3c] p-0.5 mt-2 overflow-x-auto">
                <button 
                  @click="setTab('ALL')"
                  :class="[
                    'flex-shrink-0 px-4 py-2 font-mono-data-md text-[11px] uppercase cursor-pointer transition-colors',
                    activeTab === 'ALL' ? 'bg-[#2a2a2a] text-white border-b-2 border-white font-bold' : 'text-[#8e9192] hover:text-white hover:bg-[#262626]'
                  ]">
                  TẤT CẢ ({{ metrics.all }})
                </button>
                <button 
                  @click="setTab('CHO_DUYET')"
                  :class="[
                    'flex-shrink-0 px-4 py-2 font-mono-data-md text-[11px] uppercase cursor-pointer transition-colors',
                    activeTab === 'CHO_DUYET' ? 'bg-[#2a2a2a] text-white border-b-2 border-white font-bold' : 'text-[#8e9192] hover:text-white hover:bg-[#262626]'
                  ]">
                  CHỜ DUYỆT ({{ String(metrics.choDuyet).padStart(2, '0') }})
                </button>
                <button 
                  @click="setTab('DANG_MUON')"
                  :class="[
                    'flex-shrink-0 px-4 py-2 font-mono-data-md text-[11px] uppercase cursor-pointer transition-colors',
                    activeTab === 'DANG_MUON' ? 'bg-[#2a2a2a] text-white border-b-2 border-white font-bold' : 'text-[#8e9192] hover:text-white hover:bg-[#262626]'
                  ]">
                  ĐANG MƯỢN ({{ String(metrics.dangMuon).padStart(2, '0') }})
                </button>
                <button 
                  @click="setTab('QUA_HAN')"
                  :class="[
                    'flex-shrink-0 px-4 py-2 font-mono-data-md text-[11px] uppercase cursor-pointer transition-colors',
                    activeTab === 'QUA_HAN' ? 'bg-[#2a2a2a] text-white border-b-2 border-white font-bold' : 'text-[#8e9192] hover:text-white hover:bg-[#262626]'
                  ]">
                  QUÁ HẠN ({{ String(metrics.quaHan).padStart(2, '0') }})
                </button>
                <button 
                  @click="setTab('DA_TRA')"
                  :class="[
                    'flex-shrink-0 px-4 py-2 font-mono-data-md text-[11px] uppercase cursor-pointer transition-colors',
                    activeTab === 'DA_TRA' ? 'bg-[#2a2a2a] text-white border-b-2 border-white font-bold' : 'text-[#8e9192] hover:text-white hover:bg-[#262626]'
                  ]">
                  ĐÃ TRẢ ({{ String(metrics.daTra).padStart(2, '0') }})
                </button>
                <button 
                  @click="setTab('DA_HUY')"
                  :class="[
                    'flex-shrink-0 px-4 py-2 font-mono-data-md text-[11px] uppercase cursor-pointer transition-colors',
                    activeTab === 'DA_HUY' ? 'bg-[#2a2a2a] text-white border-b-2 border-white font-bold' : 'text-[#8e9192] hover:text-white hover:bg-[#262626]'
                  ]">
                  ĐÃ HỦY ({{ String(metrics.daHuy).padStart(2, '0') }})
                </button>
              </div>
            </div>

            <!-- Main Data Table Container -->
            <div class="border border-[#3c3c3c] bg-[#1a1a1a] rounded-none overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full border-collapse text-left">
                  <thead>
                    <tr class="bg-[#000000] border-b border-[#3c3c3c]">
                      <th class="p-3 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">ĐỘC GIẢ MƯỢN</th>
                      <th class="p-3 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">THÔNG TIN SÁCH</th>
                      <th class="p-3 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider text-right">SỐ LƯỢNG</th>
                      <th class="p-3 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">NGÀY MƯỢN</th>
                      <th class="p-3 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">NGÀY TRẢ / HẠN TRẢ</th>
                      <th class="p-3 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">NV PHỤ TRÁCH</th>
                      <th class="p-3 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider text-center">TRẠNG THÁI</th>
                      <th class="p-3 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider text-right">THAO TÁC XỬ LÝ</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#262626]">
                    <tr v-if="filteredRecords.length === 0">
                      <td colspan="8" class="p-6 text-center text-[#8e9192] font-mono-data-md">
                        Không có dữ liệu theo dõi mượn trả nào.
                      </td>
                    </tr>

                    <tr 
                      v-for="(r, idx) in paginatedRecords"
                      :key="r.maPhieuMuon"
                      :class="[
                        'transition-colors',
                        r.trangThai === 'QUA_HAN' ? 'bg-[#1a1a1a] hover:bg-[#222222] border-l-2 border-l-[#e22718]' : (idx % 2 === 0 ? 'bg-[#0d0d0d] hover:bg-[#1b1b1b]' : 'bg-[#1a1a1a] hover:bg-[#1b1b1b]')
                      ]">
                      <!-- Reader Info -->
                      <td class="p-3 align-top">
                        <div class="font-headline-md text-[14px] font-bold text-white">{{ r.tenDocGia }}</div>
                        <div class="font-mono-data-md text-[12px] text-[#8e9192]">{{ r.sdt || '0912 345 678' }}</div>
                      </td>

                      <!-- Book Info -->
                      <td class="p-3 align-top">
                        <div class="font-headline-md text-[14px] font-semibold text-white">
                          {{ r.items && r.items[0] ? r.items[0].tenSach : 'Tài liệu kỹ thuật' }}
                        </div>
                        <div class="text-[12px] text-[#8e9192] mt-0.5" v-if="r.items && r.items[0] && r.items[0].tacGia">
                          Tác giả: {{ r.items[0].tacGia }}
                        </div>
                      </td>

                      <!-- Qty -->
                      <td class="p-3 align-top text-right font-mono-data-md text-[14px] font-bold text-white">
                        {{ String(r.tongSoLuong || 1).padStart(2, '0') }}
                      </td>

                      <!-- Borrow Date -->
                      <td class="p-3 align-top font-mono-data-md text-[12px] text-white">
                        {{ formatDate(r.ngayMuon) }}
                      </td>

                      <!-- Due / Return Date -->
                      <td class="p-3 align-top">
                        <template v-if="r.trangThai === 'DA_TRA'">
                          <div class="font-mono-data-md text-[12px] text-[#0fa336] font-bold">
                            Đã trả: {{ formatDate(r.ngayTraThucTe || r.ngayTra) }}
                          </div>
                          <div class="font-mono-data-md text-[10px] text-[#8e9192] mt-0.5">Đúng hạn quy định</div>
                        </template>
                        <template v-else-if="r.trangThai === 'QUA_HAN'">
                          <div class="font-mono-data-md text-[12px] text-[#e22718] font-bold">
                            Hạn: {{ formatDate(r.ngayTra) }}
                          </div>
                          <div class="font-mono-data-md text-[10px] text-[#e22718] font-bold mt-0.5">Quá hạn</div>
                        </template>
                        <template v-else>
                          <div class="font-mono-data-md text-[12px] text-white">
                            Hạn: {{ formatDate(r.ngayTra) }}
                          </div>
                          <div class="font-mono-data-md text-[10px] text-[#1c69d4] mt-0.5">Trong hạn mượn</div>
                        </template>
                      </td>

                      <!-- Staff in charge -->
                      <td class="p-3 align-top">
                        <div class="font-headline-md text-[13px] text-white">
                          {{ r.nvPhuTrach || 'Trần Văn B' }}
                        </div>
                      </td>

                      <!-- Status Badge -->
                      <td class="p-3 align-top text-center">
                        <span 
                          v-if="r.trangThai === 'CHO_DUYET'"
                          class="inline-flex items-center gap-1.5 px-2 py-1 bg-[#f4b400]/10 border border-[#f4b400] text-[#f4b400] font-mono-data-md text-[10px] uppercase rounded-none">
                          <span class="w-1.5 h-1.5 bg-[#f4b400]"></span>
                          CHỜ DUYỆT
                        </span>
                        <span 
                          v-else-if="r.trangThai === 'DANG_MUON'"
                          class="inline-flex items-center gap-1.5 px-2 py-1 bg-[#1c69d4]/10 border border-[#1c69d4] text-[#1c69d4] font-mono-data-md text-[10px] uppercase rounded-none">
                          <span class="w-1.5 h-1.5 bg-[#1c69d4]"></span>
                          ĐANG MƯỢN
                        </span>
                        <span 
                          v-else-if="r.trangThai === 'QUA_HAN'"
                          class="inline-flex items-center gap-1.5 px-2 py-1 bg-[#e22718]/10 border border-[#e22718] text-[#e22718] font-mono-data-md text-[10px] uppercase rounded-none animate-pulse">
                          <span class="w-1.5 h-1.5 bg-[#e22718]"></span>
                          QUÁ HẠN
                        </span>
                        <span 
                          v-else-if="r.trangThai === 'DA_TRA'"
                          class="inline-flex items-center gap-1.5 px-2 py-1 bg-[#0fa336]/10 border border-[#0fa336] text-[#0fa336] font-mono-data-md text-[10px] uppercase rounded-none">
                          <span class="w-1.5 h-1.5 bg-[#0fa336]"></span>
                          ĐÃ TRẢ
                        </span>
                        <span 
                          v-else
                          class="inline-flex items-center gap-1.5 px-2 py-1 bg-black border border-[#8e9192] text-[#8e9192] font-mono-data-md text-[10px] uppercase rounded-none">
                          <span class="w-1.5 h-1.5 bg-[#8e9192]"></span>
                          ĐÃ HỦY
                        </span>
                      </td>

                      <!-- Actions -->
                      <td class="p-3 align-top text-right">
                        <!-- If CHO_DUYET -->
                        <div v-if="r.trangThai === 'CHO_DUYET'" class="flex items-center justify-end gap-1.5">
                          <button 
                            @click="approveBorrow(r)"
                            class="h-8 px-3 bg-white text-black font-mono-data-md text-[11px] font-bold hover:bg-[#bbbbbb] border border-white transition-colors rounded-none flex items-center gap-1 cursor-pointer" 
                            type="button">
                            DUYỆT MƯỢN →
                          </button>
                          <button 
                            @click="rejectBorrow(r)"
                            class="h-8 px-2.5 bg-black text-[#e22718] border border-[#e22718] hover:bg-[#e22718] hover:text-white font-mono-data-md text-[11px] transition-colors rounded-none cursor-pointer" 
                            type="button">
                            TỪ CHỐI
                          </button>
                        </div>

                        <!-- If DANG_MUON or QUA_HAN -->
                        <div v-else-if="r.trangThai === 'DANG_MUON' || r.trangThai === 'QUA_HAN'" class="flex items-center justify-end gap-1.5">
                          <button 
                            @click="returnBorrow(r)"
                            class="h-8 px-2.5 font-mono-data-md text-[11px] font-bold transition-colors rounded-none cursor-pointer border bg-[#1a1a1a] text-white border-white hover:bg-white hover:text-black flex items-center gap-1"
                            title="Xác nhận hoàn trả tài liệu đúng hạn/bình thường"
                            type="button">
                            <span>HOÀN TRẢ</span>
                            <span class="material-symbols-outlined text-[13px]">check</span>
                          </button>
                          <button 
                            @click="goToFineTicket(r)"
                            :class="[
                              'h-8 px-2.5 font-mono-data-md text-[11px] font-bold transition-colors rounded-none cursor-pointer border flex items-center gap-1',
                              r.trangThai === 'QUA_HAN' ? 'bg-[#e22718] text-white border-[#e22718] hover:bg-[#c00200]' : 'bg-[#222222] text-[#ffb4ab] border-[#ffb4ab]/40 hover:bg-[#e22718] hover:text-white hover:border-[#e22718]'
                            ]"
                            title="Lập phiếu phạt vi phạm hoặc quá hạn mượn"
                            type="button">
                            <span>LẬP PHIẾU PHẠT</span>
                            <span class="material-symbols-outlined text-[13px]">gavel</span>
                          </button>
                        </div>

                        <!-- If DA_TRA -->
                        <div v-else-if="r.trangThai === 'DA_TRA'">
                          <span class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">HOÀN TẤT</span>
                        </div>

                        <!-- If DA_HUY -->
                        <div v-else>
                          <span class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">ĐÃ TỪ CHỐI</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Table Footer & Pagination -->
              <div class="p-3 bg-[#0d0d0d] border-t border-[#3c3c3c] flex flex-col md:flex-row items-center justify-between gap-2">
                <div class="font-mono-data-md text-[12px] text-[#8e9192]">
                  Hiển thị <span class="text-white font-bold">{{ paginatedRecords.length }}</span> trên tổng số <span class="text-white font-bold">{{ filteredRecords.length }}</span> bản ghi
                </div>
                <div class="flex items-center gap-1 font-mono-data-md text-[12px]">
                  <button 
                    :disabled="currentPage === 1"
                    @click="goToPage(currentPage - 1)"
                    class="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] border border-[#3c3c3c] text-white hover:border-white disabled:opacity-30 cursor-pointer rounded-none" 
                    type="button">&lt;</button>
                  <button 
                    v-for="p in totalPages" 
                    :key="p"
                    @click="goToPage(p)"
                    :class="[
                      'w-8 h-8 flex items-center justify-center border font-bold cursor-pointer rounded-none transition-colors',
                      currentPage === p ? 'bg-white border-white text-black' : 'bg-[#1a1a1a] border-[#3c3c3c] text-white hover:border-white'
                    ]" 
                    type="button">
                    {{ p }}
                  </button>
                  <button 
                    :disabled="currentPage === totalPages"
                    @click="goToPage(currentPage + 1)"
                    class="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] border border-[#3c3c3c] text-white hover:border-white disabled:opacity-30 cursor-pointer rounded-none" 
                    type="button">&gt;</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Footer gọi từ hàm getAdminFooter() để đồng bộ -->
        <div v-html="getAdminFooter()"></div>
      </main>
    </div>
  </div>
</template>

<script src="../js/borrowManagement.js"></script>
<style scoped src="../css/borrowManagement.css"></style>


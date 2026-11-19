<template>
  <div class="bg-[#131313] font-body-md text-[#e2e2e2] antialiased min-h-screen">
    <!-- Admin Sidebar gọi từ hàm getAdminSidebar('readers') để đồng bộ -->
    <div v-html="getAdminSidebar('readers')"></div>

    <div class="pl-72 flex flex-col min-h-screen">
      <!-- Admin Header gọi từ hàm getAdminHeader() để đồng bộ -->
      <div v-html="getAdminHeader()"></div>

      <!-- Main Admin Viewport -->
      <main class="relative pt-16 flex-1 bg-[#131313]">
        <div class="flex flex-col w-full">
          <!-- Telemetry Bar & Module Identifier -->
          <div class="bg-[#0e0e0e] px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#444748]">
            <div class="flex items-center gap-4">
              <div class="flex flex-row">
                <div class="w-4 h-[3px] bg-[#0066b1]"></div>
                <div class="w-4 h-[3px] bg-[#1c69d4]"></div>
                <div class="w-4 h-[3px] bg-[#e22718]"></div>
              </div>
              <div class="flex flex-col">
                <h1 class="font-headline-md text-[20px] font-bold text-white tracking-tight uppercase">
                  QUẢN LÝ TÀI KHOẢN &amp; MƯỢN TRẢ
                </h1>
              </div>
            </div>
          </div>

          <!-- Sub-Navigation Instrument Tabs -->
          <div class="bg-[#0e0e0e] border-b border-[#444748] px-6 flex items-center justify-between overflow-x-auto">
            <div class="flex gap-1" id="subnav-tabs">
              <button 
                @click="switchTab('tab-docgia')"
                :class="[
                  'subnav-tab-btn',
                  activeTab === 'tab-docgia' ? 'active' : ''
                ]" 
                id="btn-tab-docgia">
                <span class="w-1.5 h-1.5 bg-[#1c69d4]"></span>
                <span>TÀI KHOẢN ĐỘC GIẢ</span>
                <span class="bg-[#0e0e0e] text-white px-1.5 py-0.5 border border-[#444748] font-mono-data-md text-[10px]">
                  {{ readers.length }}
                </span>
              </button>

              <button 
                @click="switchTab('tab-muontra')"
                :class="[
                  'subnav-tab-btn',
                  activeTab === 'tab-muontra' ? 'active' : ''
                ]" 
                id="btn-tab-muontra">
                <span class="w-1.5 h-1.5 bg-[#8e9192]"></span>
                <span>DUYỆT &amp; THEO DÕI MƯỢN TRẢ</span>
                <span class="bg-[#e22718] text-white px-1.5 py-0.5 font-mono-data-md text-[10px] font-bold">
                  {{ pendingBorrowCount }} CHỜ DUYỆT
                </span>
              </button>

              <button 
                @click="switchTab('tab-nhanvien')"
                :class="[
                  'subnav-tab-btn',
                  activeTab === 'tab-nhanvien' ? 'active' : ''
                ]" 
                id="btn-tab-nhanvien">
                <span class="w-1.5 h-1.5 bg-[#8e9192]"></span>
                <span>TÀI KHOẢN NHÂN SỰ</span>
                <span class="bg-[#0e0e0e] text-[#8e9192] px-1.5 py-0.5 border border-[#444748] font-mono-data-md text-[10px]">
                  {{ staffList.length }}
                </span>
              </button>
            </div>
          </div>

          <!-- Primary Viewport Grid Container -->
          <div class="p-6 bg-[#131313] flex flex-col gap-6">
            <!-- ============================================================== -->
            <!-- TAB 1: TÀI KHOẢN ĐỘC GIẢ (DOCGIA)                            -->
            <!-- ============================================================== -->
            <section v-if="activeTab === 'tab-docgia'" class="flex flex-col gap-4" id="tab-docgia">
              <!-- Section Header & Controls -->
              <div class="bg-[#1f1f1f] border border-[#444748] relative">
                <div class="absolute top-0 left-0 flex flex-row">
                  <div class="w-4 h-[2px] bg-[#0066b1]"></div>
                  <div class="w-4 h-[2px] bg-[#1c69d4]"></div>
                  <div class="w-4 h-[2px] bg-[#e22718]"></div>
                </div>
                <div class="p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-[#444748]">
                  <div class="flex items-center gap-4">
                    <span class="material-symbols-outlined text-[#1c69d4] text-[22px]">contacts_product</span>
                    <div>
                      <h2 class="font-headline-md text-[16px] font-bold text-white uppercase">
                        CƠ SỞ DỮ LIỆU ĐỘC GIẢ [DOCGIA]
                      </h2>
                      <p class="font-body-md text-[12px] text-[#8e9192]">
                        Tra cứu, điều chỉnh trạng thái và cấp phát quyền thành viên thư viện.
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button 
                      @click="openAddReaderModal"
                      class="bg-white text-black hover:bg-[#bbbbbb] px-4 py-2 font-mono-data-md text-[11px] font-bold flex items-center gap-1.5 transition-colors border border-white cursor-pointer">
                      <span class="material-symbols-outlined text-[16px]">person_add</span>
                      <span>+ THÊM ĐỘC GIẢ MỚI</span>
                    </button>
                    <button 
                      @click="exportReadersCSV"
                      class="bg-[#1b1b1b] text-white hover:bg-[#2a2a2a] px-3 py-2 border border-[#444748] font-mono-data-md text-[11px] flex items-center gap-1 transition-colors cursor-pointer">
                      <span class="material-symbols-outlined text-[16px]">file_download</span>
                      <span>XUẤT BẢNG CSV</span>
                    </button>
                  </div>
                </div>

                <!-- Filter & Search Toolbar -->
                <div class="p-4 bg-[#0e0e0e] flex flex-wrap items-center justify-between gap-4">
                  <div class="flex flex-wrap items-center gap-2 flex-1 min-w-[320px]">
                    <div class="relative flex-1 min-w-[240px]">
                      <span class="material-symbols-outlined absolute left-3 top-2.5 text-[#8e9192] text-[18px]">search</span>
                      <input 
                        v-model="readerSearch"
                        class="w-full bg-[#1b1b1b] border border-[#444748] pl-10 pr-4 py-2 text-white font-mono-data-md text-[13px] placeholder-[#8e9192] focus:border-[#1c69d4] focus:outline-none" 
                        id="docgia-search" 
                        placeholder="TÌM THEO TÊN, SỐ ĐIỆN THOẠI, EMAIL..." 
                        type="text">
                    </div>
                    <div class="flex items-center bg-[#1b1b1b] border border-[#444748] px-3 py-1.5">
                      <label class="font-mono-data-md text-[11px] text-[#8e9192] mr-2 uppercase">LỌC:</label>
                      <select 
                        v-model="readerFilter"
                        class="bg-transparent text-white font-mono-data-md text-[11px] focus:outline-none cursor-pointer" 
                        id="docgia-filter">
                        <option class="bg-[#0e0e0e] text-white" value="all">TẤT CẢ TRẠNG THÁI</option>
                        <option class="bg-[#0e0e0e] text-white" value="active">HOẠT ĐỘNG (BÌNH THƯỜNG)</option>
                        <option class="bg-[#0e0e0e] text-white" value="locked">BỊ KHÓA TÀI KHOẢN</option>
                      </select>
                    </div>
                  </div>
                  <div class="flex items-center gap-4 font-mono-data-md text-[12px] text-[#8e9192]">
                    <span>TỔNG BẢN GHI: <strong class="text-white font-bold">{{ readers.length }}</strong></span>
                    <span>|</span>
                    <span>HIỆN: <strong class="text-white font-bold">{{ paginatedReaders.length }} ĐỘC GIẢ</strong></span>
                  </div>
                </div>
              </div>

              <!-- Table Module: DOCGIA -->
              <div class="bg-[#0e0e0e] border border-[#444748] overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-[#1b1b1b] border-b border-[#444748]">
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">HỌ LÓT &amp; TÊN</th>
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">NGÀY SINH / PHÁI</th>
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">SỐ ĐIỆN THOẠI &amp; EMAIL</th>
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">ĐỊA CHỈ</th>
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider text-center">TRẠNG THÁI</th>
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider text-right">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#444748] font-mono-data-md text-[13px]">
                    <tr 
                      v-for="r in paginatedReaders" 
                      :key="r.maDocGia"
                      class="hover:bg-[#2a2a2a] transition-colors">
                      <td class="p-4">
                        <div class="font-headline-md text-[15px] text-white font-semibold">
                          {{ r.hoLot }} {{ r.ten }}
                        </div>
                      </td>
                      <td class="p-4 text-white">
                        <div>{{ formatDate(r.ngaySinh) }}</div>
                        <div class="font-mono-data-md text-[10px] text-[#8e9192]">PHÁI: {{ r.phai }}</div>
                      </td>
                      <td class="p-4 text-white">
                        <div class="text-white font-mono-data-md">{{ r.dienThoai }}</div>
                        <div class="text-[#8e9192] text-[12px]">{{ r.email }}</div>
                      </td>
                      <td class="p-4 font-body-md text-[13px] text-[#c4c7c8] max-w-[220px] truncate" :title="r.diaChi">
                        {{ r.diaChi }}
                      </td>
                      <td class="p-4 text-center">
                        <span 
                          v-if="r.trangThai === 'HOAT_DONG'"
                          class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#0066b1]/10 text-white border border-[#0066b1] font-mono-data-md text-[10px]">
                          <span class="w-1.5 h-1.5 bg-[#0066b1]"></span>
                          HOẠT ĐỘNG
                        </span>
                        <span 
                          v-else
                          class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#e22718]/10 text-[#e22718] border border-[#e22718] font-mono-data-md text-[10px]">
                          <span class="w-1.5 h-1.5 bg-[#e22718]"></span>
                          BỊ KHÓA
                        </span>
                      </td>
                      <td class="p-4 text-right">
                        <div class="flex items-center justify-end gap-1.5">
                          <button 
                            v-if="r.trangThai === 'HOAT_DONG'"
                            @click="toggleLockDocGia(r)"
                            title="Khóa tài khoản độc giả"
                            class="btn-action-icon btn-action-lock">
                            <span class="material-symbols-outlined">lock</span>
                          </button>
                          <button 
                            v-else
                            @click="toggleLockDocGia(r)"
                            title="Mở khóa tài khoản độc giả"
                            class="btn-action-icon btn-action-unlock">
                            <span class="material-symbols-outlined">lock_open</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Pagination -->
                <div class="p-4 bg-[#1b1b1b] border-t border-[#444748] flex flex-wrap items-center justify-between gap-4">
                  <div class="font-mono-data-md text-[12px] text-[#8e9192]">
                    HIỂN THỊ <span class="text-white font-bold">{{ paginatedReaders.length }}</span> TRÊN TỔNG SỐ <span class="text-white font-bold">{{ filteredReaders.length }}</span> ĐỘC GIẢ
                  </div>
                  <div class="flex items-center gap-1">
                    <button 
                      :disabled="readerPage === 1"
                      @click="readerPage--"
                      class="px-2 py-1 bg-[#1f1f1f] border border-[#444748] text-white disabled:opacity-40 cursor-pointer">&lt;</button>
                    <button 
                      v-for="p in totalReaderPages" 
                      :key="p"
                      @click="readerPage = p"
                      :class="[
                        'px-3 py-1 font-mono-data-md text-[12px] cursor-pointer',
                        readerPage === p ? 'bg-white text-black font-bold' : 'bg-[#1f1f1f] border border-[#444748] text-white'
                      ]">
                      {{ p }}
                    </button>
                    <button 
                      :disabled="readerPage === totalReaderPages"
                      @click="readerPage++"
                      class="px-2 py-1 bg-[#1f1f1f] border border-[#444748] text-white disabled:opacity-40 cursor-pointer">&gt;</button>
                  </div>
                </div>
              </div>
            </section>

            <!-- ============================================================== -->
            <!-- TAB 2: DUYỆT & THEO DÕI MƯỢN TRẢ (THEODOIMUONSACH)            -->
            <!-- ============================================================== -->
            <section v-if="activeTab === 'tab-muontra'" class="flex flex-col gap-4" id="tab-muontra">
              <!-- Section Header -->
              <div class="bg-[#1f1f1f] border border-[#444748] relative">
                <div class="absolute top-0 left-0 flex flex-row">
                  <div class="w-4 h-[2px] bg-[#0066b1]"></div>
                  <div class="w-4 h-[2px] bg-[#1c69d4]"></div>
                  <div class="w-4 h-[2px] bg-[#e22718]"></div>
                </div>
                <div class="p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-[#444748]">
                  <div class="flex items-center gap-4">
                    <span class="material-symbols-outlined text-[#e22718] text-[22px]">assignment_turned_in</span>
                    <div>
                      <h2 class="font-headline-md text-[16px] font-bold text-white uppercase">
                        BẢNG DUYỆT YÊU CẦU &amp; THEO DÕI MƯỢN TRẢ [THEODOIMUONSACH]
                      </h2>
                      <p class="font-body-md text-[12px] text-[#8e9192]">
                        Phê duyệt lệnh mượn tức thời, xác nhận hoàn trả và kiểm soát thời hạn lưu thông.
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button 
                      @click="approveAllPending"
                      class="bg-[#1c69d4] hover:bg-[#0066b1] text-white px-4 py-2 font-mono-data-md text-[11px] font-bold flex items-center gap-1.5 transition-colors border border-[#1c69d4] cursor-pointer">
                      <span class="material-symbols-outlined text-[16px]">done_all</span>
                      <span>DUYỆT NHANH TẤT CẢ CHỜ ({{ pendingBorrowCount }})</span>
                    </button>
                  </div>
                </div>

                <!-- Filter Sub-Nav by Status -->
                <div class="p-4 bg-[#0e0e0e] flex flex-wrap items-center justify-between gap-4">
                  <div class="flex flex-wrap items-center gap-1" id="muontra-status-filters">
                    <button 
                      @click="filterMuonTra('all')"
                      :class="[
                        'px-4 py-1.5 font-mono-data-md text-[11px] border cursor-pointer',
                        borrowFilter === 'all' ? 'bg-[#2a2a2a] text-white border-white font-bold' : 'bg-[#1f1f1f] text-[#8e9192] border-[#444748]'
                      ]">
                      TẤT CẢ ({{ borrowRecords.length }})
                    </button>
                    <button 
                      @click="filterMuonTra('pending')"
                      :class="[
                        'px-4 py-1.5 font-mono-data-md text-[11px] border cursor-pointer flex items-center gap-1',
                        borrowFilter === 'pending' ? 'bg-[#2a2a2a] text-[#e22718] border-[#e22718] font-bold' : 'bg-[#1f1f1f] text-[#e22718] border-[#444748]'
                      ]">
                      <span class="w-1.5 h-1.5 bg-[#e22718]"></span>
                      <span>CHỜ DUYỆT ({{ pendingBorrowCount }})</span>
                    </button>
                    <button 
                      @click="filterMuonTra('borrowing')"
                      :class="[
                        'px-4 py-1.5 font-mono-data-md text-[11px] border cursor-pointer flex items-center gap-1',
                        borrowFilter === 'borrowing' ? 'bg-[#2a2a2a] text-[#adc6ff] border-[#1c69d4] font-bold' : 'bg-[#1f1f1f] text-[#adc6ff] border-[#444748]'
                      ]">
                      <span class="w-1.5 h-1.5 bg-[#1c69d4]"></span>
                      <span>ĐANG MƯỢN</span>
                    </button>
                    <button 
                      @click="filterMuonTra('overdue')"
                      :class="[
                        'px-4 py-1.5 font-mono-data-md text-[11px] border cursor-pointer flex items-center gap-1',
                        borrowFilter === 'overdue' ? 'bg-[#2a2a2a] text-[#e22718] border-[#e22718] font-bold' : 'bg-[#1f1f1f] text-[#e22718] border-[#444748]'
                      ]">
                      <span class="w-1.5 h-1.5 bg-[#e22718]"></span>
                      <span>QUÁ HẠN</span>
                    </button>
                    <button 
                      @click="filterMuonTra('returned')"
                      :class="[
                        'px-4 py-1.5 font-mono-data-md text-[11px] border cursor-pointer flex items-center gap-1',
                        borrowFilter === 'returned' ? 'bg-[#2a2a2a] text-white border-white font-bold' : 'bg-[#1f1f1f] text-[#8e9192] border-[#444748]'
                      ]">
                      <span class="w-1.5 h-1.5 bg-[#8e9192]"></span>
                      <span>ĐÃ TRẢ</span>
                    </button>
                  </div>
                  <div class="relative w-full lg:w-72">
                    <span class="material-symbols-outlined absolute left-3 top-2.5 text-[#8e9192] text-[18px]">search</span>
                    <input 
                      v-model="borrowSearch"
                      class="w-full bg-[#1b1b1b] border border-[#444748] pl-10 pr-4 py-1.5 text-white font-mono-data-md text-[13px] placeholder-[#8e9192] focus:border-[#1c69d4] focus:outline-none" 
                      placeholder="TÌM THEO TÊN ĐỘC GIẢ, TÊN SÁCH..." 
                      type="text">
                  </div>
                </div>
              </div>

              <!-- Data Table: THEODOIMUONSACH -->
              <div class="bg-[#0e0e0e] border border-[#444748] overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-[#1b1b1b] border-b border-[#444748]">
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">ĐỘC GIẢ</th>
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">TÀI LIỆU MƯỢN</th>
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider text-center">S.LƯỢNG</th>
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">NGÀY MƯỢN / HẠN TRẢ</th>
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">NV TIẾP NHẬN</th>
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider text-center">TRẠNG THÁI</th>
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider text-right">THAO TÁC THỦ THƯ</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#444748] font-mono-data-md text-[13px]">
                    <tr 
                      v-for="rec in filteredBorrows" 
                      :key="rec.maPhieuMuon"
                      :class="[
                        'transition-colors',
                        rec.trangThai === 'CHO_DUYET' ? 'bg-[#e22718]/5 border-l-2 border-[#e22718]' : (rec.trangThai === 'QUA_HAN' ? 'bg-[#e22718]/10 border-l-2 border-[#e22718]' : 'hover:bg-[#1f1f1f]')
                      ]">
                      <td class="p-4">
                        <div class="font-headline-md text-[14px] font-bold text-white">{{ rec.tenDocGia }}</div>
                        <div class="font-mono-data-md text-[12px] text-[#8e9192]">{{ rec.sdt || '0912 345 678' }}</div>
                      </td>
                      <td class="p-4">
                        <div class="font-body-md text-[13px] font-bold text-white max-w-[240px] truncate" :title="rec.items && rec.items[0] ? rec.items[0].tenSach : ''">
                          {{ rec.items && rec.items[0] ? rec.items[0].tenSach : 'Tài liệu mượn' }}
                        </div>
                        <div class="text-[11px] text-[#8e9192] mt-0.5" v-if="rec.items && rec.items[0] && rec.items[0].tacGia">
                          Tác giả: {{ rec.items[0].tacGia }}
                        </div>
                      </td>
                      <td class="p-4 text-center font-bold text-white">
                        {{ String(rec.tongSoLuong || 1).padStart(2, '0') }}
                      </td>
                      <td class="p-4">
                        <div class="text-white font-mono-data-md">{{ formatDate(rec.ngayMuon) }}</div>
                        <div class="font-mono-data-md text-[11px] text-[#8e9192]">
                          HẠN: {{ formatDate(rec.ngayTra) }}
                        </div>
                      </td>
                      <td class="p-4">
                        <span v-if="rec.nvPhuTrach" class="text-[#1c69d4] font-mono-data-md font-bold">
                          {{ rec.nvPhuTrach }}
                        </span>
                        <span v-else class="font-mono-data-md text-[10px] text-[#8e9192] italic">
                          CHƯA TIẾP NHẬN
                        </span>
                      </td>
                      <td class="p-4 text-center">
                        <span 
                          v-if="rec.trangThai === 'CHO_DUYET'"
                          class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#e22718]/20 text-[#e22718] border border-[#e22718] font-mono-data-md text-[10px] font-bold">
                          <span class="w-1.5 h-1.5 bg-[#e22718]"></span>
                          CHỜ DUYỆT
                        </span>
                        <span 
                          v-else-if="rec.trangThai === 'DANG_MUON'"
                          class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#0066b1]/15 text-[#adc6ff] border border-[#0066b1] font-mono-data-md text-[10px]">
                          <span class="w-1.5 h-1.5 bg-[#1c69d4]"></span>
                          ĐANG MƯỢN
                        </span>
                        <span 
                          v-else-if="rec.trangThai === 'QUA_HAN'"
                          class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#e22718] text-white font-mono-data-md text-[10px] font-bold">
                          <span class="w-1.5 h-1.5 bg-white"></span>
                          QUÁ HẠN
                        </span>
                        <span 
                          v-else
                          class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#1f1f1f] text-[#8e9192] border border-[#444748] font-mono-data-md text-[10px]">
                          <span class="w-1.5 h-1.5 bg-[#8e9192]"></span>
                          ĐÃ TRẢ
                        </span>
                      </td>
                      <td class="p-4 text-right">
                        <div v-if="rec.trangThai === 'CHO_DUYET'" class="flex items-center justify-end gap-1">
                          <button 
                            @click="approveBorrow(rec)"
                            class="bg-white text-black hover:bg-[#bbbbbb] px-2.5 py-1.5 font-mono-data-md text-[10px] font-bold transition-colors cursor-pointer">
                            DUYỆT MƯỢN
                          </button>
                          <button 
                            @click="rejectBorrow(rec)"
                            class="bg-[#1f1f1f] text-[#e22718] hover:bg-[#e22718] hover:text-white border border-[#e22718] px-2 py-1.5 font-mono-data-md text-[10px] transition-colors cursor-pointer">
                            TỪ CHỐI
                          </button>
                        </div>
                        <div v-else-if="rec.trangThai === 'DANG_MUON' || rec.trangThai === 'QUA_HAN'">
                          <button 
                            @click="confirmReturn(rec)"
                            class="bg-[#2a2a2a] text-white hover:bg-white hover:text-black border border-[#444748] hover:border-white px-2.5 py-1.5 font-mono-data-md text-[10px] transition-colors cursor-pointer">
                            XÁC NHẬN ĐÃ TRẢ
                          </button>
                        </div>
                        <div v-else class="font-mono-data-md text-[10px] text-[#8e9192]">
                          ĐÃ HOÀN TẤT
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- ============================================================== -->
            <!-- TAB 3: TÀI KHOẢN NHÂN SỰ [NHANVIEN]                         -->
            <!-- ============================================================== -->
            <section v-if="activeTab === 'tab-nhanvien'" class="flex flex-col gap-4" id="tab-nhanvien">
              <!-- Section Header -->
              <div class="bg-[#1f1f1f] border border-[#444748] relative">
                <div class="absolute top-0 left-0 flex flex-row">
                  <div class="w-4 h-[2px] bg-[#0066b1]"></div>
                  <div class="w-4 h-[2px] bg-[#1c69d4]"></div>
                  <div class="w-4 h-[2px] bg-[#e22718]"></div>
                </div>
                <div class="p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-[#444748]">
                  <div class="flex items-center gap-4">
                    <span class="material-symbols-outlined text-[#1c69d4] text-[22px]">badge</span>
                    <div>
                      <h2 class="font-headline-md text-[16px] font-bold text-white uppercase">
                        CƠ SỞ DỮ LIỆU NHÂN SỰ [NHANVIEN]
                      </h2>
                      <p class="font-body-md text-[12px] text-[#8e9192]">
                        Tra cứu, cập nhật nhân sự và điều phối phân quyền tài khoản quản trị.
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button 
                      @click="openAddStaffModal"
                      class="bg-white text-black hover:bg-[#bbbbbb] px-4 py-2 font-mono-data-md text-[11px] font-bold flex items-center gap-1.5 transition-colors border border-white cursor-pointer">
                      <span class="material-symbols-outlined text-[16px]">person_add</span>
                      <span>+ THÊM NHÂN VIÊN MỚI</span>
                    </button>
                    <button 
                      @click="exportStaffCSV"
                      class="bg-[#1b1b1b] text-white hover:bg-[#2a2a2a] px-3 py-2 border border-[#444748] font-mono-data-md text-[11px] flex items-center gap-1 transition-colors cursor-pointer">
                      <span class="material-symbols-outlined text-[16px]">file_download</span>
                      <span>XUẤT BẢNG CSV</span>
                    </button>
                  </div>
                </div>

                <!-- Filter & Search Toolbar -->
                <div class="p-4 bg-[#0e0e0e] flex flex-wrap items-center justify-between gap-4">
                  <div class="flex flex-wrap items-center gap-2 flex-1 min-w-[320px]">
                    <div class="relative flex-1 min-w-[240px]">
                      <span class="material-symbols-outlined absolute left-3 top-2.5 text-[#8e9192] text-[18px]">search</span>
                      <input 
                        v-model="staffSearch"
                        class="w-full bg-[#1b1b1b] border border-[#444748] pl-10 pr-4 py-2 text-white font-mono-data-md text-[13px] placeholder-[#8e9192] focus:border-[#1c69d4] focus:outline-none" 
                        id="staff-search" 
                        placeholder="TÌM THEO TÊN, SỐ ĐIỆN THOẠI, ĐỊA CHỈ..." 
                        type="text">
                    </div>
                    <div class="flex items-center bg-[#1b1b1b] border border-[#444748] px-3 py-1.5">
                      <label class="font-mono-data-md text-[11px] text-[#8e9192] mr-2 uppercase">LỌC:</label>
                      <select 
                        v-model="staffFilter"
                        class="bg-transparent text-white font-mono-data-md text-[11px] focus:outline-none cursor-pointer" 
                        id="staff-filter">
                        <option class="bg-[#0e0e0e] text-white" value="all">TẤT CẢ TRẠNG THÁI</option>
                        <option class="bg-[#0e0e0e] text-white" value="active">ĐANG LÀM VIỆC</option>
                        <option class="bg-[#0e0e0e] text-white" value="inactive">ĐÃ THÔI VIỆC</option>
                      </select>
                    </div>
                  </div>
                  <div class="flex items-center gap-4 font-mono-data-md text-[12px] text-[#8e9192]">
                    <span>TỔNG BẢN GHI: <strong class="text-white font-bold">{{ staffList.length }}</strong></span>
                    <span>|</span>
                    <span>HIỆN: <strong class="text-white font-bold">{{ paginatedStaff.length }} NHÂN VIÊN</strong></span>
                  </div>
                </div>
              </div>

              <!-- Table Module: NHANVIEN -->
              <div class="bg-[#0e0e0e] border border-[#444748] overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-[#1b1b1b] border-b border-[#444748]">
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">HỌ TÊN CÁN BỘ</th>
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider text-center">CHỨC VỤ</th>
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">SỐ ĐIỆN THOẠI</th>
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider">ĐỊA CHỈ</th>
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider text-center">TRẠNG THÁI</th>
                      <th class="p-4 font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-wider text-right">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#444748] font-mono-data-md text-[13px]">
                    <tr 
                      v-for="s in paginatedStaff" 
                      :key="s.msnv"
                      class="hover:bg-[#2a2a2a] transition-colors">
                      <td class="p-4">
                        <div class="font-headline-md text-[15px] text-white font-semibold">
                          {{ s.hoTenNV || s.hoten || 'Nhân sự' }}
                        </div>
                        <div class="font-mono-data-md text-[10px] text-[#8e9192]">
                          {{ (s.chucVu === 'Admin' || s.chucvu === 'Admin') ? 'QUẢN TRỊ VIÊN' : 'THỦ THƯ TRỰC' }}
                        </div>
                      </td>
                      <td class="p-4 text-center">
                        <span 
                          :class="[
                            'inline-block px-2 py-0.5 font-mono-data-md text-[10px] font-bold text-white',
                            (s.chucVu === 'Admin' || s.chucvu === 'Admin') ? 'bg-[#e22718]' : 'bg-[#1c69d4]'
                          ]">
                          {{ String(s.chucVu || s.chucvu || 'THỦ THƯ').toUpperCase() }}
                        </span>
                      </td>
                      <td class="p-4 text-white font-mono-data-md">
                        {{ s.soDienThoai || s.phone || '---' }}
                      </td>
                      <td class="p-4 font-body-md text-[13px] text-[#c4c7c8] max-w-[220px] truncate" :title="s.diaChi || s.address">
                        {{ s.diaChi || s.address || '---' }}
                      </td>
                      <td class="p-4 text-center">
                        <span 
                          v-if="s.trangThai === 1 || s.status === 1"
                          class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#0066b1]/10 text-white border border-[#0066b1] font-mono-data-md text-[10px]">
                          <span class="w-1.5 h-1.5 bg-[#0066b1]"></span>
                          LÀM VIỆC
                        </span>
                        <span 
                          v-else
                          class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#e22718]/10 text-[#e22718] border border-[#e22718] font-mono-data-md text-[10px]">
                          <span class="w-1.5 h-1.5 bg-[#8e9192]"></span>
                          ĐÃ NGHỈ
                        </span>
                      </td>
                      <td class="p-4 text-right">
                        <div class="flex items-center justify-end gap-1.5">
                          <button 
                            @click="openEditStaffModal(s)"
                            title="Cập nhật thông tin cán bộ"
                            class="btn-action-icon btn-action-edit">
                            <span class="material-symbols-outlined">edit</span>
                          </button>
                          <button 
                            @click="deleteStaff(s)"
                            title="Xóa cán bộ nhân sự"
                            class="btn-action-icon btn-action-delete">
                            <span class="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Pagination -->
                <div class="p-4 bg-[#1b1b1b] border-t border-[#444748] flex flex-wrap items-center justify-between gap-4">
                  <div class="font-mono-data-md text-[12px] text-[#8e9192]">
                    HIỂN THỊ <span class="text-white font-bold">{{ paginatedStaff.length }}</span> TRÊN TỔNG SỐ <span class="text-white font-bold">{{ filteredStaff.length }}</span> NHÂN SỰ
                  </div>
                  <div class="flex items-center gap-1">
                    <button 
                      :disabled="staffPage === 1"
                      @click="staffPage--"
                      class="px-2 py-1 bg-[#1f1f1f] border border-[#444748] text-white disabled:opacity-40 cursor-pointer">&lt;</button>
                    <button 
                      v-for="p in totalStaffPages" 
                      :key="p"
                      @click="staffPage = p"
                      :class="[
                        'px-3 py-1 font-mono-data-md text-[12px] cursor-pointer',
                        staffPage === p ? 'bg-white text-black font-bold' : 'bg-[#1f1f1f] border border-[#444748] text-white'
                      ]">
                      {{ p }}
                    </button>
                    <button 
                      :disabled="staffPage === totalStaffPages"
                      @click="staffPage++"
                      class="px-2 py-1 bg-[#1f1f1f] border border-[#444748] text-white disabled:opacity-40 cursor-pointer">&gt;</button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- MODAL: THÊM / CẬP NHẬT NHÂN VIÊN (NHANVIEN) -->
          <div 
            v-if="isStaffModalOpen"
            class="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div class="bg-[#1f1f1f] border border-[#444748] w-full max-w-2xl relative shadow-2xl">
              <div class="absolute top-0 left-0 flex flex-row">
                <div class="w-6 h-[3px] bg-[#0066b1]"></div>
                <div class="w-6 h-[3px] bg-[#1c69d4]"></div>
                <div class="w-6 h-[3px] bg-[#e22718]"></div>
              </div>
              <div class="p-6 border-b border-[#444748] flex items-center justify-between">
                <div>
                  <span class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">HỒ SƠ NHÂN SỰ / {{ isEditingStaff ? 'CẬP NHẬT' : 'THÊM MỚI' }}</span>
                  <h3 class="font-headline-md text-[18px] font-bold text-white uppercase">{{ isEditingStaff ? 'CẬP NHẬT NHÂN VIÊN' : 'THÊM NHÂN VIÊN MỚI (NHANVIEN)' }}</h3>
                </div>
                <button 
                  @click="closeStaffModal"
                  class="text-[#8e9192] hover:text-white p-1 cursor-pointer">
                  <span class="material-symbols-outlined text-[24px]">close</span>
                </button>
              </div>

              <form @submit.prevent="saveEmployee" class="p-6 flex flex-col gap-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">HỌ VÀ TÊN NHÂN VIÊN *</label>
                    <input 
                      v-model="employeeForm.hoTenNV"
                      class="w-full bg-[#0e0e0e] border border-[#444748] px-3 py-2 text-white font-body-md text-[13px] focus:border-[#1c69d4] focus:outline-none" 
                      placeholder="Nhập họ và tên..." 
                      required 
                      type="text">
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">CHỨC VỤ / QUYỀN HẠN *</label>
                    <select 
                      v-model="employeeForm.chucVu"
                      class="w-full bg-[#0e0e0e] border border-[#444748] px-3 py-2 text-white font-mono-data-md text-[13px] focus:border-[#1c69d4] focus:outline-none cursor-pointer">
                      <option value="Admin">ADMIN (QUẢN TRỊ TOÀN QUYỀN)</option>
                      <option value="ThuThu">THỦ THƯ (QUẢN LÝ MƯỢN TRẢ &amp; SÁCH)</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">SỐ ĐIỆN THOẠI LIÊN HỆ *</label>
                    <input 
                      v-model="employeeForm.soDienThoai"
                      class="w-full bg-[#0e0e0e] border border-[#444748] px-3 py-2 text-white font-mono-data-md text-[13px] focus:border-[#1c69d4] focus:outline-none" 
                      placeholder="09xx.xxx.xxx" 
                      required 
                      type="tel">
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">MẬT KHẨU *</label>
                    <input 
                      v-model="employeeForm.password"
                      class="w-full bg-[#0e0e0e] border border-[#444748] px-3 py-2 text-white font-mono-data-md text-[13px] focus:border-[#1c69d4] focus:outline-none" 
                      placeholder="Mật khẩu" 
                      :required="!isEditingStaff" 
                      type="password">
                  </div>
                </div>

                <div class="flex flex-col gap-1">
                  <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">ĐỊA CHỈ THƯỜNG TRÚ</label>
                  <input 
                    v-model="employeeForm.diaChi"
                    class="w-full bg-[#0e0e0e] border border-[#444748] px-3 py-2 text-white font-body-md text-[13px] focus:border-[#1c69d4] focus:outline-none" 
                    placeholder="Địa chỉ nơi ở hoặc cơ quan..." 
                    type="text">
                </div>

                <div class="flex flex-col gap-1">
                  <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">TÌNH TRẠNG CÔNG TÁC</label>
                  <select 
                    v-model="employeeForm.trangThai"
                    class="w-full bg-[#0e0e0e] border border-[#444748] px-3 py-2 text-white font-mono-data-md text-[13px] focus:border-[#1c69d4] focus:outline-none cursor-pointer">
                    <option :value="1">ĐANG LÀM VIỆC (HOẠT ĐỘNG)</option>
                    <option :value="0">ĐÃ THÔI VIỆC (VÔ HIỆU HÓA)</option>
                  </select>
                </div>

                <div class="pt-4 border-t border-[#444748] flex items-center justify-end gap-2">
                  <button 
                    @click="closeStaffModal"
                    class="bg-[#1b1b1b] text-[#8e9192] hover:text-white px-6 py-2 border border-[#444748] font-mono-data-md text-[11px] transition-colors cursor-pointer" 
                    type="button">
                    HỦY
                  </button>
                  <button 
                    class="bg-white text-black hover:bg-[#bbbbbb] px-8 py-2 font-mono-data-md text-[11px] font-bold transition-colors border border-white cursor-pointer" 
                    type="submit">
                    {{ isEditingStaff ? 'LƯU CẬP NHẬT' : 'LƯU NHÂN VIÊN' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- MODAL: THÊM ĐỘC GIẢ MỚI (DOCGIA) -->
          <div 
            v-if="isAddReaderModalOpen"
            class="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div class="bg-[#1f1f1f] border border-[#444748] w-full max-w-2xl relative shadow-2xl">
              <div class="absolute top-0 left-0 flex flex-row">
                <div class="w-6 h-[3px] bg-[#0066b1]"></div>
                <div class="w-6 h-[3px] bg-[#1c69d4]"></div>
                <div class="w-6 h-[3px] bg-[#e22718]"></div>
              </div>
              <div class="p-6 border-b border-[#444748] flex items-center justify-between">
                <div>
                  <span class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">HỒ SƠ ĐỘC GIẢ / THÊM MỚI</span>
                  <h3 class="font-headline-md text-[18px] font-bold text-white uppercase">CẤP THẺ ĐỘC GIẢ (DOCGIA)</h3>
                </div>
                <button 
                  @click="closeAddReaderModal"
                  class="text-[#8e9192] hover:text-white p-1 cursor-pointer">
                  <span class="material-symbols-outlined text-[24px]">close</span>
                </button>
              </div>

              <form @submit.prevent="saveNewReader" class="p-6 flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                  <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">GIỚI TÍNH (PHAI) *</label>
                  <select 
                    v-model="readerForm.phai"
                    class="w-full bg-[#0e0e0e] border border-[#444748] px-3 py-2 text-white font-mono-data-md text-[13px] focus:border-[#1c69d4] focus:outline-none cursor-pointer">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">HỌ LÓT (HOLOT) *</label>
                    <input 
                      v-model="readerForm.hoLot"
                      class="w-full bg-[#0e0e0e] border border-[#444748] px-3 py-2 text-white font-body-md text-[13px] focus:border-[#1c69d4] focus:outline-none" 
                      placeholder="Ví dụ: Hoàng Đình" 
                      required 
                      type="text">
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">TÊN (TEN) *</label>
                    <input 
                      v-model="readerForm.ten"
                      class="w-full bg-[#0e0e0e] border border-[#444748] px-3 py-2 text-white font-body-md text-[13px] focus:border-[#1c69d4] focus:outline-none" 
                      placeholder="Ví dụ: Khang" 
                      required 
                      type="text">
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">NGÀY SINH (NGAYSINH) *</label>
                    <input 
                      v-model="readerForm.ngaySinh"
                      class="w-full bg-[#0e0e0e] border border-[#444748] px-3 py-2 text-white font-mono-data-md text-[13px] focus:border-[#1c69d4] focus:outline-none [color-scheme:dark]" 
                      required 
                      type="date">
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">SỐ ĐIỆN THOẠI (DIENTHOAI) *</label>
                    <input 
                      v-model="readerForm.dienThoai"
                      class="w-full bg-[#0e0e0e] border border-[#444748] px-3 py-2 text-white font-mono-data-md text-[13px] focus:border-[#1c69d4] focus:outline-none" 
                      placeholder="09xx.xxx.xxx" 
                      required 
                      type="tel">
                  </div>
                </div>

                <div class="flex flex-col gap-1">
                  <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase">ĐỊA CHỈ LIÊN LẠC (DIACHI)</label>
                  <input 
                    v-model="readerForm.diaChi"
                    class="w-full bg-[#0e0e0e] border border-[#444748] px-3 py-2 text-white font-body-md text-[13px] focus:border-[#1c69d4] focus:outline-none" 
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện..." 
                    type="text">
                </div>

                <div class="pt-4 border-t border-[#444748] flex items-center justify-end gap-2">
                  <button 
                    @click="closeAddReaderModal"
                    class="bg-[#1b1b1b] text-[#8e9192] hover:text-white px-6 py-2 border border-[#444748] font-mono-data-md text-[11px] transition-colors cursor-pointer" 
                    type="button">
                    HỦY
                  </button>
                  <button 
                    class="bg-white text-black hover:bg-[#bbbbbb] px-8 py-2 font-mono-data-md text-[11px] font-bold transition-colors border border-white cursor-pointer" 
                    type="submit">
                    LƯU ĐỘC GIẢ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Admin Footer gọi từ hàm getAdminFooter() để đồng bộ -->
        <div v-html="getAdminFooter()"></div>
      </main>
    </div>
  </div>
</template>

<script src="../js/readerManagement.js"></script>
<style scoped src="../css/readerManagement.css"></style>


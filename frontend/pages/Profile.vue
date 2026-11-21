<template>
  <div class="min-h-screen bg-[#0e0e0e] text-[#e2e2e2] flex flex-col justify-between selection:bg-white selection:text-black">
    <!-- Header gọi từ hàm getHeader('profile') tự động đồng bộ theo cartCount -->
    <div v-html="headerHtml"></div>

    <!-- Main Viewport -->
    <main class="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 pt-16 flex-1 bg-[#0e0e0e]">
      <div class="flex flex-col w-full py-8">
        <!-- System Status Telemetry Ticker -->
        <div class="flex items-center justify-between border-b border-[#353535] pb-3 mb-6 font-mono-data-md text-[11px] uppercase text-[#8e9192]">
          <div class="flex items-center gap-2">
            <div class="flex items-center">
              <div class="w-4 h-[3px] bg-[#0066b1]"></div>
              <div class="w-4 h-[3px] bg-[#1c69d4]"></div>
              <div class="w-4 h-[3px] bg-[#e22718]"></div>
            </div>
            <span class="tracking-widest text-[#e2e2e2]">MODULE: QUẢN LÝ ĐỘC GIẢ &amp; LỊCH SỬ GIAO DỊCH MƯỢN TRẢ</span>
          </div>
        </div>

        <!-- 2-Column Asymmetric Grid (Expanded for comfortable view without horizontal scroll) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- LEFT COLUMN: HỒ SƠ ĐỘC GIẢ (DOCGIA) -->
          <div class="lg:col-span-4 xl:col-span-4 2xl:col-span-3 flex flex-col bg-[#131313] border border-[#3c3c3c] relative">
            <!-- Technical Accent Stripe -->
            <div class="w-full flex h-[2px]">
              <div class="w-1/3 bg-[#0066b1]"></div>
              <div class="w-1/3 bg-[#1c69d4]"></div>
              <div class="w-1/3 bg-[#e22718]"></div>
            </div>
            
            <div class="p-6">
              <!-- Card Header -->
              <div class="flex items-center justify-between border-b border-[#262626] pb-4 mb-5">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-white text-[20px]">badge</span>
                  <h2 class="font-headline-md text-[16px] uppercase tracking-wider text-white font-bold">
                    THÔNG TIN CÁ NHÂN
                  </h2>
                </div>
              </div>

              <!-- Form Fields -->
              <form @submit.prevent="handleUpdateProfile" class="flex flex-col gap-4">
                <!-- Row 1: Họ & Tên Lót + Tên -->
                <div class="grid grid-cols-12 gap-3">
                  <div class="col-span-7 flex flex-col gap-1">
                    <label class="font-mono-data-md text-[11px] text-[#7e7e7e] uppercase">HỌ VÀ TÊN LÓT</label>
                    <input 
                      v-model="form.hoLot"
                      class="w-full h-11 px-3 bg-[#1a1a1a] border border-[#3c3c3c] text-white font-mono-data-md text-[14px] focus:border-[#1c69d4] focus:outline-none transition-colors" 
                      type="text">
                  </div>
                  <div class="col-span-5 flex flex-col gap-1">
                    <label class="font-mono-data-md text-[11px] text-[#7e7e7e] uppercase">TÊN</label>
                    <input 
                      v-model="form.ten"
                      class="w-full h-11 px-3 bg-[#1a1a1a] border border-[#3c3c3c] text-white font-mono-data-md text-[14px] focus:border-[#1c69d4] focus:outline-none transition-colors" 
                      type="text">
                  </div>
                </div>

                <!-- Row 2: Ngày sinh & Giới tính -->
                <div class="grid grid-cols-12 gap-3">
                  <div class="col-span-7 flex flex-col gap-1">
                    <label class="font-mono-data-md text-[11px] text-[#7e7e7e] uppercase">NGÀY SINH</label>
                    <input 
                      v-model="form.ngaySinh"
                      class="w-full h-11 px-3 bg-[#1a1a1a] border border-[#3c3c3c] text-white font-mono-data-md text-[14px] focus:border-[#1c69d4] focus:outline-none transition-colors [color-scheme:dark]" 
                      type="date">
                  </div>
                  <div class="col-span-5 flex flex-col gap-1">
                    <label class="font-mono-data-md text-[11px] text-[#7e7e7e] uppercase">GIỚI TÍNH</label>
                    <select 
                      v-model="form.phai"
                      class="w-full h-11 px-3 bg-[#1a1a1a] border border-[#3c3c3c] text-white font-mono-data-md text-[14px] focus:border-[#1c69d4] focus:outline-none transition-colors appearance-none cursor-pointer">
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                <!-- Field 3: Email -->
                <div class="flex flex-col gap-1">
                  <label class="font-mono-data-md text-[11px] text-[#7e7e7e] uppercase">ĐỊA CHỈ EMAIL</label>
                  <input 
                    v-model="form.email"
                    class="w-full h-11 px-3 bg-[#1a1a1a] border border-[#3c3c3c] text-white font-mono-data-md text-[14px] focus:border-[#1c69d4] focus:outline-none transition-colors" 
                    type="email">
                </div>

                <!-- Field 4: Điện thoại -->
                <div class="flex flex-col gap-1">
                  <label class="font-mono-data-md text-[11px] text-[#7e7e7e] uppercase">SỐ ĐIỆN THOẠI</label>
                  <input 
                    v-model="form.dienThoai"
                    class="w-full h-11 px-3 bg-[#1a1a1a] border border-[#3c3c3c] text-white font-mono-data-md text-[14px] focus:border-[#1c69d4] focus:outline-none transition-colors" 
                    type="tel">
                </div>

                <!-- Field 5: Địa chỉ -->
                <div class="flex flex-col gap-1">
                  <label class="font-mono-data-md text-[11px] text-[#7e7e7e] uppercase">ĐỊA CHỈ THƯỜNG TRÚ</label>
                  <textarea 
                    v-model="form.diaChi"
                    class="w-full p-3 bg-[#1a1a1a] border border-[#3c3c3c] text-white font-mono-data-md text-[14px] focus:border-[#1c69d4] focus:outline-none transition-colors resize-none leading-relaxed" 
                    rows="2"></textarea>
                </div>

                <!-- Field 6: Mật khẩu mới -->
                <div class="flex flex-col gap-1">
                  <label class="font-mono-data-md text-[11px] text-[#7e7e7e] uppercase">ĐỔI MẬT KHẨU MỚI</label>
                  <input 
                    v-model="form.newPassword"
                    class="w-full h-11 px-3 bg-[#1a1a1a] border border-[#3c3c3c] text-white font-mono-data-md text-[14px] placeholder-[#7e7e7e] focus:border-[#1c69d4] focus:outline-none transition-colors" 
                    placeholder="Để trống nếu không đổi" 
                    type="password">
                </div>

                <!-- Action Button -->
                <div class="pt-2 flex flex-col gap-2">
                  <button 
                    class="w-full h-12 bg-white hover:bg-[#c6c6c7] text-black font-mono-data-md text-[11px] uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 border border-white cursor-pointer" 
                    type="submit">
                    <span>CẬP NHẬT HỒ SƠ</span>
                    <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>

                  <!-- Nút đăng xuất dưới nút cập nhật hồ sơ -->
                  <button 
                    type="button"
                    @click="handleLogout"
                    class="w-full h-11 bg-[#1a1a1a] hover:bg-[#e22718] hover:border-[#e22718] text-[#c4c7c8] hover:text-white font-mono-data-md text-[11px] uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 border border-[#3c3c3c] cursor-pointer">
                    <span class="material-symbols-outlined text-[18px]">logout</span>
                    <span>ĐĂNG XUẤT TÀI KHOẢN</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- RIGHT COLUMN: THEO DÕI & LỊCH SỬ MƯỢN SÁCH (Phóng to không cần cuộn ngang) -->
          <div class="lg:col-span-8 xl:col-span-8 2xl:col-span-9 flex flex-col bg-[#131313] border border-[#3c3c3c]">
            <div class="p-6">
              <!-- Card Header -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#262626] pb-4 mb-5 gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-2.5 h-2.5 bg-[#1c69d4]"></div>
                  <h2 class="font-headline-md text-[20px] uppercase tracking-wider text-white font-bold">
                    LỊCH SỬ MƯỢN SÁCH
                  </h2>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-mono-data-md text-[11px] uppercase px-2.5 py-1 bg-[#1a1a1a] border border-[#3c3c3c] text-white">
                    TỔNG SỐ LƯỢT: {{ counts.all }}
                  </span>
                  <span class="font-mono-data-md text-[11px] uppercase px-2.5 py-1 bg-[#1a1a1a] border border-[#3c3c3c] text-[#bbbbbb]">
                    ĐANG GIỮ: {{ String(counts.dangGiu).padStart(2, '0') }}
                  </span>
                </div>
              </div>

              <!-- Filter Segmented Bar -->
              <div class="flex flex-wrap items-center gap-1 mb-6 border-b border-[#262626] pb-4">
                <button 
                  @click="setStatusFilter('ALL')"
                  :class="[
                    'px-4 py-2 font-mono-data-md text-[11px] uppercase transition-colors cursor-pointer',
                    activeStatusFilter === 'ALL' ? 'bg-[#262626] text-white border border-white' : 'bg-transparent text-[#bbbbbb] hover:text-white hover:bg-[#1a1a1a] border border-[#3c3c3c]'
                  ]">
                  TẤT CẢ ({{ counts.all }})
                </button>
                <button 
                  @click="setStatusFilter('CHO_DUYET')"
                  :class="[
                    'px-4 py-2 font-mono-data-md text-[11px] uppercase transition-colors cursor-pointer',
                    activeStatusFilter === 'CHO_DUYET' ? 'bg-[#262626] text-white border border-white' : 'bg-transparent text-[#bbbbbb] hover:text-white hover:bg-[#1a1a1a] border border-[#3c3c3c]'
                  ]">
                  CHỜ DUYỆT ({{ counts.choDuyet }})
                </button>
                <button 
                  @click="setStatusFilter('DANG_MUON')"
                  :class="[
                    'px-4 py-2 font-mono-data-md text-[11px] uppercase transition-colors cursor-pointer',
                    activeStatusFilter === 'DANG_MUON' ? 'bg-[#262626] text-white border border-white' : 'bg-transparent text-[#bbbbbb] hover:text-white hover:bg-[#1a1a1a] border border-[#3c3c3c]'
                  ]">
                  ĐANG MƯỢN ({{ counts.dangMuon }})
                </button>
                <button 
                  @click="setStatusFilter('DA_TRA')"
                  :class="[
                    'px-4 py-2 font-mono-data-md text-[11px] uppercase transition-colors cursor-pointer',
                    activeStatusFilter === 'DA_TRA' ? 'bg-[#262626] text-white border border-white' : 'bg-transparent text-[#bbbbbb] hover:text-white hover:bg-[#1a1a1a] border border-[#3c3c3c]'
                  ]">
                  ĐÃ TRẢ ({{ counts.daTra }})
                </button>
                <button 
                  @click="setStatusFilter('DA_HUY')"
                  :class="[
                    'px-4 py-2 font-mono-data-md text-[11px] uppercase transition-colors cursor-pointer',
                    activeStatusFilter === 'DA_HUY' ? 'bg-[#262626] text-white border border-white' : 'bg-transparent text-[#bbbbbb] hover:text-white hover:bg-[#1a1a1a] border border-[#3c3c3c]'
                  ]">
                  ĐÃ HỦY ({{ counts.daHuy }})
                </button>
              </div>

              <!-- Data Table Wrapper (Được phóng to tương thích hoàn toàn, không cần cuộn ngang) -->
              <div class="w-full overflow-x-auto border border-[#262626]">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-[#000000] border-b border-[#3c3c3c] font-mono-data-md text-[11px] text-[#7e7e7e] uppercase tracking-wider">
                      <th class="py-3 px-4 w-[36%]">SÁCH MƯỢN</th>
                      <th class="py-3 px-3 w-[11%] text-center">SỐ LƯỢNG</th>
                      <th class="py-3 px-3 w-[13%] text-center">NGÀY MƯỢN</th>
                      <th class="py-3 px-3 w-[16%]">NGÀY HẸN / TRẢ</th>
                      <th class="py-3 px-3 w-[13%] text-center">TRẠNG THÁI</th>
                      <th class="py-3 px-3 w-[11%] text-center">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#262626] font-mono-data-md text-[13px]">
                    <tr v-if="filteredRecords.length === 0">
                      <td colspan="6" class="py-8 text-center text-[#7e7e7e]">
                        Không có bản ghi mượn sách nào trong trạng thái này.
                      </td>
                    </tr>

                    <tr 
                      v-for="(rec, idx) in paginatedRecords" 
                      :key="rec.maPhieuMuon"
                      :class="[
                        'transition-colors',
                        idx % 2 === 0 ? 'bg-[#131313] hover:bg-[#1a1a1a]' : 'bg-[#0d0d0d] hover:bg-[#1a1a1a]'
                      ]">
                      <td class="py-3 px-4">
                        <div class="flex items-center gap-3">
                          <img 
                            class="w-[44px] h-[58px] object-cover shrink-0 border border-[#3c3c3c] bg-[#1a1a1a]" 
                            :src="rec.items && rec.items[0] && rec.items[0].hinhAnh ? rec.items[0].hinhAnh : 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8IHWIGnccWuKM4BdMQROuXVI3W9B5pKJQiYiiaLjAJeR_LUEcX-cvZfEs2WGtMGvkYj18_SKSFNL67veIYRiM9AExJf8vsWh4Nb_sn5EbERzQYPP5IYqelX21WykQ2KAthDo_BqfYnD8yiMsgypSQdrRR-e_kx6faPvgITTy8saYLf6KjjfZ-6Txel5Vt5llsUdU5bScYot91cJlzIypx7IIW_4Xk_2CXJnwziqE'" 
                            :alt="rec.items && rec.items[0] ? rec.items[0].tenSach : 'Tài liệu'">
                          <div class="flex flex-col min-w-0">
                            <span class="font-headline-md text-[14px] font-bold text-white truncate max-w-[280px] lg:max-w-[340px] xl:max-w-[420px] leading-tight" :title="rec.items && rec.items[0] ? rec.items[0].tenSach : 'Tài liệu'">
                              {{ rec.items && rec.items[0] ? rec.items[0].tenSach : 'Tài liệu mượn' }}
                              <span v-if="rec.items && rec.items.length > 1" class="text-[#8e9192] text-[12px]">
                                (+{{ rec.items.length - 1 }} khác)
                              </span>
                            </span>
                            <span class="font-body-md text-[12px] text-[#bbbbbb] truncate">
                              {{ rec.items && rec.items[0] && rec.items[0].tacGia ? rec.items[0].tacGia : 'Thư viện Trung tâm' }}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td class="py-3 px-3 text-center text-white font-mono-data-md whitespace-nowrap">
                        {{ String(rec.tongSoLuong || 1).padStart(2, '0') }} quyển
                      </td>
                      <td class="py-3 px-3 text-center text-white font-mono-data-md whitespace-nowrap">
                        {{ formatDate(rec.ngayMuon) }}
                      </td>
                      <td class="py-3 px-3 whitespace-nowrap">
                        <div class="flex flex-col">
                          <span class="text-white font-mono-data-md">{{ formatDate(rec.ngayTra) }}</span>
                          <span v-if="rec.trangThai === 'DANG_MUON'" class="font-mono-data-md text-[10px] text-[#1c69d4]">
                            HẠN: CÒN 7 NGÀY
                          </span>
                          <span v-else-if="rec.trangThai === 'DA_TRA'" class="font-mono-data-md text-[10px] text-[#0fa336]">
                            ĐÃ TRẢ ĐÚNG HẠN
                          </span>
                          <span v-else-if="rec.trangThai === 'QUA_HAN'" class="font-mono-data-md text-[10px] text-[#e22718]">
                            QUÁ HẠN
                          </span>
                        </div>
                      </td>
                      <td class="py-3 px-3 text-center whitespace-nowrap">
                        <span 
                          v-if="rec.trangThai === 'CHO_DUYET'"
                          class="inline-flex items-center justify-center px-2 py-0.5 border border-[#f4b400] text-[#f4b400] bg-[#f4b400]/10 font-mono-data-md text-[10px] uppercase">
                          CHỜ DUYỆT
                        </span>
                        <span 
                          v-else-if="rec.trangThai === 'DANG_MUON'"
                          class="inline-flex items-center justify-center px-2 py-0.5 border border-[#1c69d4] text-[#1c69d4] bg-[#1c69d4]/10 font-mono-data-md text-[10px] uppercase">
                          ĐANG MƯỢN
                        </span>
                        <span 
                          v-else-if="rec.trangThai === 'DA_TRA'"
                          class="inline-flex items-center justify-center px-2 py-0.5 border border-[#0fa336] text-[#0fa336] bg-[#0fa336]/10 font-mono-data-md text-[10px] uppercase">
                          ĐÃ TRẢ
                        </span>
                        <span 
                          v-else-if="rec.trangThai === 'DA_HUY'"
                          class="inline-flex items-center justify-center px-2 py-0.5 border border-[#8e9192] text-[#8e9192] bg-[#1a1a1a] font-mono-data-md text-[10px] uppercase">
                          ĐÃ HỦY
                        </span>
                        <span 
                          v-else-if="rec.trangThai === 'QUA_HAN'"
                          class="inline-flex items-center justify-center px-2 py-0.5 border border-[#e22718] text-[#e22718] bg-[#e22718]/10 font-mono-data-md text-[10px] uppercase">
                          QUÁ HẠN
                        </span>
                      </td>
                      <td class="py-3 px-3 text-center whitespace-nowrap">
                        <button 
                          v-if="rec.trangThai === 'CHO_DUYET'"
                          @click="cancelBorrowRequest(rec.maPhieuMuon)"
                          class="px-2.5 py-1 border border-[#e22718] text-[#e22718] hover:bg-[#e22718] hover:text-white font-mono-data-md text-[10px] uppercase transition-colors cursor-pointer">
                          HỦY YÊU CẦU
                        </button>
                        <span v-else class="font-mono text-[#7e7e7e]">—</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Table Footer / Pagination -->
              <div class="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-[#262626] gap-3">
                <div class="font-mono-data-md text-[11px] text-[#7e7e7e] uppercase">
                  HIỂN THỊ <span class="text-white">{{ paginatedRecords.length }}</span> TRÊN <span class="text-white">{{ filteredRecords.length }}</span> BẢN GHI THEO DÕI
                </div>
                <div class="flex items-center gap-1 font-mono-data-md text-[13px]">
                  <button 
                    :disabled="currentPage === 1"
                    @click="goToPage(currentPage - 1)"
                    class="w-8 h-8 flex items-center justify-center border border-[#3c3c3c] bg-[#1a1a1a] text-[#7e7e7e] hover:text-white hover:border-white transition-colors disabled:opacity-30 cursor-pointer">
                    <span class="material-symbols-outlined text-[16px]">chevron_left</span>
                  </button>
                  <button 
                    v-for="p in totalPages"
                    :key="p"
                    @click="goToPage(p)"
                    :class="[
                      'w-8 h-8 flex items-center justify-center border font-bold cursor-pointer transition-colors',
                      currentPage === p ? 'border-white bg-[#262626] text-white' : 'border-[#3c3c3c] bg-[#1a1a1a] text-[#bbbbbb] hover:text-white hover:border-white'
                    ]">
                    {{ p }}
                  </button>
                  <button 
                    :disabled="currentPage === totalPages"
                    @click="goToPage(currentPage + 1)"
                    class="w-8 h-8 flex items-center justify-center border border-[#3c3c3c] bg-[#1a1a1a] text-[#7e7e7e] hover:text-white hover:border-white transition-colors disabled:opacity-30 cursor-pointer">
                    <span class="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer gọi từ hàm getFooter() để đồng bộ -->
    <div v-html="footerHtml"></div>
  </div>
</template>

<script src="../js/profile.js"></script>
<style scoped src="../css/profile.css"></style>


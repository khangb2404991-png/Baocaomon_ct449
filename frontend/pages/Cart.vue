<template>
  <div class="min-h-screen bg-[#131313] text-[#e2e2e2] flex flex-col justify-between selection:bg-[#353535] selection:text-white">
    <!-- Header gọi từ hàm getHeader('cart') tự động đồng bộ theo cartCount -->
    <div v-html="headerHtml"></div>

    <!-- Main Viewport -->
    <main class="w-full pt-16 bg-[#0e0e0e] min-h-screen">
      <div class="flex flex-col w-full text-on-surface">
        <!-- TOP BAR / TELEMETRY STATUS -->
        <section class="w-full bg-[#0e0e0e] border-b border-[#444748] px-6 lg:px-10 py-4">
          <div class="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-2">
            <div class="flex items-center space-x-2">
              <span class="font-mono-data-md text-[11px] tracking-[0.15em] text-[#c4c7c8] uppercase">QUẢN LÝ MƯỢN TRẢ</span>
              <span class="text-[#8e9192] font-mono-data-md">/</span>
              <span class="font-mono-data-md text-[11px] tracking-[0.15em] text-white uppercase font-bold">GIỎ SÁCH &amp; THEO DÕI</span>
            </div>
          </div>
        </section>

        <!-- MAIN DUAL-COLUMN WORKSPACE -->
        <div class="w-full px-4 sm:px-6 lg:px-10 py-8 max-w-[1720px] mx-auto">
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <!-- LEFT COLUMN: CART TABLE (8 of 12 cols) -->
            <section class="xl:col-span-8 flex flex-col space-y-4">
              <!-- Module Header -->
              <div class="flex items-end justify-between border-b border-[#444748] pb-1.5">
                <div class="flex items-center space-x-2">
                  <div class="flex flex-col justify-center">
                    <div class="flex h-[3px] w-[48px] mb-1.5">
                      <div class="w-[16px] h-full bg-[#0066b1]"></div>
                      <div class="w-[16px] h-full bg-[#1c69d4]"></div>
                      <div class="w-[16px] h-full bg-[#e22718]"></div>
                    </div>
                    <h2 class="font-headline-md text-[20px] tracking-[0.05em] uppercase text-white font-bold">
                      GIỎ SÁCH HIỆN TẠI
                    </h2>
                  </div>
                </div>
                <span class="font-mono-data-md text-[11px] px-2 py-0.5 bg-[#2a2a2a] text-white border border-[#444748] uppercase">
                  [{{ String(totalTitles).padStart(2, '0') }} TÀI LIỆU]
                </span>
              </div>

              <!-- Inventory List Table Container -->
              <div class="bg-[#1b1b1b] border border-[#444748]">
                <div class="w-full overflow-x-auto">
                  <table class="w-full text-left border-collapse" id="cart-table">
                    <thead>
                      <tr class="bg-[#0e0e0e] border-b border-[#444748] font-mono-data-md text-[11px] text-[#c4c7c8] uppercase tracking-[0.1em]">
                        <th class="py-2.5 px-3 font-semibold w-[36%]">TÀI LIỆU MƯỢN</th>
                        <th class="py-2.5 px-3 font-semibold w-[18%]">TÁC GIẢ</th>
                        <th class="py-2.5 px-3 font-semibold text-center w-[12%]">KHO CÒN</th>
                        <th class="py-2.5 px-3 font-semibold text-center w-[13%]">SỐ LƯỢNG</th>
                        <th class="py-2.5 px-3 font-semibold text-center w-[11%]">NGÀY THÊM</th>
                        <th class="py-2.5 px-3 font-semibold text-right w-[10%]">THAO TÁC</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-[#444748] font-body-md text-[14px]">
                      <tr v-if="cartItems.length === 0">
                        <td colspan="6" class="py-8 text-center text-[#8e9192] font-mono-data-md">
                          Giỏ sách hiện đang trống. Hãy chọn thêm sách từ danh mục!
                        </td>
                      </tr>

                      <tr 
                        v-for="item in cartItems" 
                        :key="item.maSach || item.masach"
                        class="hover:bg-[#1f1f1f] transition-colors group">
                        <td class="py-3 px-3">
                          <div class="flex items-center space-x-3">
                            <img 
                              class="w-12 h-16 object-cover flex-shrink-0 border border-[#444748] bg-[#0e0e0e]" 
                              :src="item.hinhAnh || item.hinhanh || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA3mI7md6yPHsCm3-bBSuP8XoKLHVOpxVSV6F1ld9AwCa6Hob6y7xv1kaCCs1utv3vHdISrD_rZhQYWTe4A6tgwHjV9GGNrxLeuJc2iSFpi7ZZv2gQn8IdIrAhNSqSJpJ8OBDY7Bizu2dq6LphMMIYzAF-NYPIOZwubpSGF4Ezv5AK52Oh3GBwphCMfP_6hlNFFNcsLfll8fV99WJY5b7r1oLVMon_1BCEkOPY6uU'" 
                              :alt="item.tenSach || item.tensach">
                            <div class="flex flex-col min-w-0">
                              <span class="font-headline-md text-[14px] text-white font-bold truncate max-w-[280px] lg:max-w-[340px]" :title="item.tenSach || item.tensach">
                                {{ item.tenSach || item.tensach }}
                              </span>
                              <span class="font-mono-data-md text-[11px] text-[#8e9192]">
                                Đơn giá: {{ formatCurrency(item.donGia || item.dongia) }}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td class="py-3 px-3 text-[#e2e2e2] font-body-md text-[13px]">
                          {{ item.tacGia || item.tacgia }}
                        </td>
                        <td class="py-3 px-3 text-center whitespace-nowrap">
                          <span class="font-mono-data-md text-[11px] text-[#c4c7c8] bg-[#0e0e0e] px-2 py-0.5 border border-[#444748]">
                            {{ String(item.khoCon || item.soQuyen || 6).padStart(2, '0') }} quyển
                          </span>
                        </td>
                        <td class="py-3 px-3 text-center whitespace-nowrap">
                          <div class="inline-flex items-center border border-[#444748] bg-[#0e0e0e]">
                            <button 
                              @click="adjustQty(item, -1)"
                              aria-label="Decrease quantity" 
                              class="w-7 h-7 flex items-center justify-center font-mono-data-md text-white hover:bg-[#2a2a2a] transition-colors cursor-pointer" 
                              type="button">-</button>
                            <span class="w-8 text-center font-mono-data-md text-[12px] text-white font-bold">
                              {{ item.soLuong || item.soluong || 1 }}
                            </span>
                            <button 
                              @click="adjustQty(item, 1)"
                              aria-label="Increase quantity" 
                              class="w-7 h-7 flex items-center justify-center font-mono-data-md text-white hover:bg-[#2a2a2a] transition-colors cursor-pointer" 
                              type="button">+</button>
                          </div>
                        </td>
                        <td class="py-3 px-3 text-center font-mono-data-md text-[11px] text-[#c4c7c8] whitespace-nowrap">
                          {{ item.ngayThem || borrowDate }}
                        </td>
                        <td class="py-3 px-3 text-right whitespace-nowrap">
                          <button 
                            @click="removeItem(item.maSach || item.masach)"
                            class="font-mono-data-md text-[11px] px-2.5 py-1 uppercase tracking-wider text-[#c4c7c8] hover:text-[#e22718] hover:border-[#e22718] border border-transparent transition-colors cursor-pointer" 
                            type="button">
                            XÓA
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Table Bottom Bar -->
                <div class="bg-[#0e0e0e] border-t border-[#444748] p-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div class="flex items-center space-x-2 font-mono-data-md text-[12px] text-[#c4c7c8]">
                    <span class="w-2 h-2 bg-[#1c69d4]"></span>
                    <span>TỔNG SỐ SÁCH ĐĂNG KÝ: <strong class="text-white font-bold">{{ totalQty }} QUYỂN</strong></span>
                  </div>
                  <router-link 
                    to="/home"
                    class="font-mono-data-md text-[11px] uppercase tracking-wider text-white border border-[#444748] hover:border-white hover:bg-[#1f1f1f] px-4 py-1.5 transition-colors inline-flex items-center space-x-1">
                    <span>+ TIẾP TỤC CHỌN SÁCH TỪ DANH MỤC</span>
                  </router-link>
                </div>
              </div>

              <!-- System Policy Banner -->
              <div class="p-4 bg-[#1b1b1b] border-l-2 border-[#1c69d4] border border-[#444748] flex items-start space-x-4">
                <span class="material-symbols-outlined text-[#1c69d4] text-[20px] select-none mt-0.5">info</span>
                <div class="flex flex-col text-[12px] space-y-1">
                  <span class="font-headline-md text-[14px] text-white font-bold uppercase tracking-wider">
                    CHÚ Ý QUY CHUẨN MƯỢN TÀI LIỆU
                  </span>
                  <p class="text-[#c4c7c8]">
                    Mỗi độc giả được cấp hạn ngạch mượn lưu động tối đa 05 ấn bản vật lý cùng lúc. Thời hạn mỗi chu kỳ mượn là 14 ngày làm việc. Quá hạn chịu phí phạt kiểm kê 5.000 VNĐ / tài liệu / ngày.
                  </p>
                </div>
              </div>
            </section>

            <!-- RIGHT COLUMN: CONFIRMATION DOSSIER (4 of 12 cols) -->
            <section class="xl:col-span-4 flex flex-col">
              <div class="bg-[#1b1b1b] border border-[#444748] p-6 flex flex-col">
                <!-- Dossier Header -->
                <div class="flex flex-col mb-6">
                  <div class="flex h-[3px] w-[48px] mb-2">
                    <div class="w-[16px] h-full bg-[#0066b1]"></div>
                    <div class="w-[16px] h-full bg-[#1c69d4]"></div>
                    <div class="w-[16px] h-full bg-[#e22718]"></div>
                  </div>
                  <div class="flex items-center justify-between">
                    <h3 class="font-headline-md text-[20px] tracking-[0.05em] uppercase text-white font-bold">
                      PHIẾU ĐĂNG KÝ
                    </h3>
                    <span class="font-mono-data-md text-[11px] text-[#c4c7c8] border border-[#444748] px-1.5 py-0.5">
                      TIÊU CHUẨN
                    </span>
                  </div>
                </div>

                <!-- Reader Spec Sheet -->
                <div class="mb-6">
                  <span class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-[0.15em] block mb-2">
                    THÔNG TIN ĐỘC GIẢ
                  </span>
                  <div class="bg-[#0e0e0e] border border-[#444748] p-4 space-y-2 font-mono-data-md text-[12px]">
                    <div class="flex justify-between border-b border-[#444748]/50 pb-1">
                      <span class="text-[#c4c7c8]">HỌ VÀ TÊN:</span>
                      <span class="text-white font-semibold uppercase">
                        {{ currentUser.hoLot ? `${currentUser.hoLot} ${currentUser.ten}` : (currentUser.ten || currentUser.hoTen || 'Nguyễn Văn An') }}
                      </span>
                    </div>
                    <div class="flex justify-between border-b border-[#444748]/50 py-1">
                      <span class="text-[#c4c7c8]">ĐIỆN THOẠI:</span>
                      <span class="text-white">{{ currentUser.dienThoai || '0912 345 678' }}</span>
                    </div>
                    <div class="flex flex-col pt-1">
                      <span class="text-[#c4c7c8] text-[11px] mb-0.5">ĐỊA CHỈ:</span>
                      <span class="text-white text-[12px] truncate leading-tight">
                        {{ currentUser.diaChi || 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Date Control Fields -->
                <div class="mb-6 space-y-4">
                  <div>
                    <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-[0.15em] block mb-1.5" for="input-ngaymuon">
                      NGÀY MƯỢN (NGAYMUON) - KHÓA TỰ ĐỘNG
                    </label>
                    <div class="relative flex items-center">
                      <input 
                        v-model="borrowDate"
                        class="w-full h-10 bg-[#0e0e0e] border border-[#444748] px-4 font-mono-data-md text-[14px] text-white focus:outline-none cursor-not-allowed" 
                        id="input-ngaymuon" 
                        readonly 
                        type="text">
                      <span class="material-symbols-outlined text-[#8e9192] absolute right-3 text-[18px]">lock</span>
                    </div>
                  </div>
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <label class="font-mono-data-md text-[11px] text-[#8e9192] uppercase tracking-[0.15em]" for="input-ngaytra">
                        HẠN TRẢ ĐỀ XUẤT (NGAYTRA)
                      </label>
                      <span class="font-mono-data-md text-[10px] text-[#1c69d4] uppercase font-bold">MAX 14 NGÀY</span>
                    </div>
                    <div class="relative flex items-center">
                      <input 
                        v-model="returnDate"
                        class="w-full h-10 bg-[#0e0e0e] border border-[#444748] px-4 font-mono-data-md text-[14px] text-white focus:border-[#1c69d4] focus:outline-none [color-scheme:dark]" 
                        id="input-ngaytra" 
                        type="date">
                    </div>
                    <p class="font-mono-data-md text-[11px] text-[#c4c7c8] mt-1">
                      Khung thời gian mượn tiêu chuẩn: 14 ngày lịch tính từ thời điểm nhận tài liệu.
                    </p>
                  </div>
                </div>

                <!-- Telemetry Balance Calculations -->
                <div class="bg-[#0e0e0e] border border-[#444748] p-4 mb-6 space-y-2.5">
                  <div class="flex items-center justify-between text-[12px] font-body-md">
                    <span class="text-[#c4c7c8]">Tổng số đầu sách:</span>
                    <span class="font-mono-data-md text-white font-bold">{{ totalTitles }} tài liệu</span>
                  </div>
                  <div class="flex items-center justify-between text-[12px] font-body-md">
                    <span class="text-[#c4c7c8]">Tổng số lượng mượn (SUM):</span>
                    <span class="font-mono-data-md text-white font-bold">{{ totalQty }} quyển</span>
                  </div>
                  <div class="flex items-center justify-between text-[12px] font-body-md">
                    <span class="text-[#c4c7c8]">Giá trị bảo đảm hoàn trả:</span>
                    <span class="font-mono-data-md text-white font-bold">{{ formatCurrency(totalVal) }}</span>
                  </div>
                  <div class="h-px w-full bg-[#444748]"></div>
                  <div class="flex items-center justify-between text-[12px] font-body-md">
                    <span class="text-[#c4c7c8]">Hạn mức mượn khả dụng:</span>
                    <span 
                      :class="[
                        'font-mono-data-md font-bold',
                        !isQuotaExceeded ? 'text-[#0fa336]' : 'text-[#e22718]'
                      ]">
                      <template v-if="!isQuotaExceeded">
                        0{{ remainingQuota }} quyển ({{ totalQty }}/5)
                      </template>
                      <template v-else>
                        VƯỢT {{ Math.abs(remainingQuota) }} QUYỂN
                      </template>
                    </span>
                  </div>
                </div>

                <!-- Submission Action Trigger -->
                <button 
                  :disabled="isCartEmpty || isQuotaExceeded"
                  @click="submitBorrowOrder"
                  class="w-full h-12 bg-white hover:bg-[#bbbbbb] disabled:opacity-40 disabled:cursor-not-allowed text-black font-mono-data-md text-[11px] tracking-[0.15em] uppercase font-bold transition-colors flex items-center justify-center space-x-2 border border-white cursor-pointer" 
                  id="btn-submit-borrow" 
                  type="button">
                  <span>XÁC NHẬN ĐĂNG KÝ MƯỢN</span>
                  <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </section>
          </div>
        </div>

        <!-- MODAL / DETAIL DRAWER OVERLAY -->
        <div 
          v-if="isModalOpen"
          class="fixed inset-0 z-50 bg-black/80 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div class="bg-[#1b1b1b] border border-[#444748] max-w-xl w-full p-6 flex flex-col relative shadow-2xl">
            <!-- Top Accent Stripe -->
            <div class="flex h-[3px] w-[48px] mb-3">
              <div class="w-[16px] h-full bg-[#0066b1]"></div>
              <div class="w-[16px] h-full bg-[#1c69d4]"></div>
              <div class="w-[16px] h-full bg-[#e22718]"></div>
            </div>

            <!-- Prominent Success Header Banner -->
            <div class="flex items-center gap-3 bg-[#0fa336]/15 border border-[#0fa336] p-3 mb-4">
              <span class="material-symbols-outlined text-[#0fa336] text-[26px] shrink-0">check_circle</span>
              <div class="flex flex-col">
                <span class="font-headline-md text-[14px] text-white font-bold uppercase tracking-wider">
                  XÁC NHẬN ĐĂNG KÝ MƯỢN THÀNH CÔNG!
                </span>
                <span class="font-mono-data-md text-[11px] text-[#a0dfb0]">
                  Hệ thống đã tạo phiếu mượn và gửi yêu cầu tới thủ thư phê duyệt.
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between border-b border-[#444748] pb-2 mb-4">
              <span class="font-headline-md text-[16px] tracking-[0.05em] uppercase text-white font-bold">
                CHI TIẾT PHIẾU ĐĂNG KÝ MƯỢN
              </span>
              <button 
                @click="closeModal"
                aria-label="Close modal" 
                class="w-8 h-8 flex items-center justify-center text-[#c4c7c8] hover:text-white hover:bg-[#1f1f1f] transition-colors cursor-pointer" 
                type="button">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div class="space-y-2 font-mono-data-md text-[13px] mb-6">
              <div class="flex justify-between border-b border-[#444748] py-1">
                <span class="text-[#c4c7c8]">ĐỘC GIẢ LIÊN KẾT:</span>
                <span class="text-white font-semibold">{{ modalDetails.docGia }}</span>
              </div>
              <div class="flex justify-between border-b border-[#444748] py-1">
                <span class="text-[#c4c7c8]">TỔNG SỐ LƯỢNG:</span>
                <span class="text-white font-bold">{{ modalDetails.tongSoLuong || 1 }} quyển</span>
              </div>
              <div class="flex justify-between border-b border-[#444748] py-1">
                <span class="text-[#c4c7c8]">NGÀY MƯỢN / HẠN TRẢ:</span>
                <span class="text-white">{{ modalDetails.ngayMuon }} → {{ modalDetails.ngayTra }}</span>
              </div>
              <div class="flex justify-between border-b border-[#444748] py-1">
                <span class="text-[#c4c7c8]">VỊ TRÍ LƯU TRỮ:</span>
                <span class="text-white">{{ modalDetails.viTri }}</span>
              </div>
              <div class="flex justify-between border-b border-[#444748] py-1">
                <span class="text-[#c4c7c8]">CÁN BỘ TIẾP NHẬN:</span>
                <span class="text-white">{{ modalDetails.canBo }}</span>
              </div>
              <div class="flex justify-between py-1">
                <span class="text-[#c4c7c8]">TRẠNG THÁI HỆ THỐNG:</span>
                <span class="inline-flex items-center px-2 py-0.5 border border-[#f4b400] text-[#f4b400] bg-[#f4b400]/10 font-mono-data-md text-[11px] uppercase">
                  CHỜ PHÊ DUYỆT (CHO_DUYET)
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row justify-end gap-2 pt-3 border-t border-[#444748]">
              <a 
                href="#/profile"
                @click="closeModal"
                class="px-4 py-2 bg-white hover:bg-[#bbbbbb] text-black font-mono-data-md text-[11px] uppercase font-bold text-center no-underline cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">account_circle</span>
                <span>XEM LỊCH SỬ MƯỢN (HỒ SƠ)</span>
              </a>
              <button 
                @click="closeModal"
                class="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#444748] font-mono-data-md text-[11px] uppercase text-white cursor-pointer transition-colors" 
                type="button">
                ĐÓNG BẢNG ĐIỀU KHIỂN
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

<script src="../js/cart.js"></script>
<style scoped src="../css/cart.css"></style>


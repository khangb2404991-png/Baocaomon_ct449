<template>
  <div class="fine-ticket-view font-body-md text-[#e2e2e2] antialiased">
    <!-- Top Header -->
    <header class="fixed top-0 w-full z-50 bg-[#0e0e0e] border-b border-[#353535]">
      <div class="h-16 w-full px-8 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 bg-[#1f1f1f] border border-[#353535] flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-[18px]">library_books</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-headline-md text-[18px] tracking-wider text-white font-bold">BOOK LENDING SYSTEM</span>
            <span class="font-label-caps text-[11px] text-[#8e9192] bg-[#1f1f1f] px-1.5 py-0.5 border border-[#353535]">[ADMIN]</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="bg-[#1b1b1b] border border-[#2a2a2a] px-3.5 py-1.5 flex items-center gap-3">
            <div class="w-6 h-6 rounded-none bg-[#353535] flex items-center justify-center text-white">
              <span class="material-symbols-outlined text-[16px]">badge</span>
            </div>
            <div class="flex flex-col text-left">
              <span class="font-mono-data-md text-[12px] text-white leading-tight font-medium">{{ ticketData.staffName }}</span>
              <span class="font-label-caps text-[11px] text-[#8e9192] leading-tight">{{ ticketData.staffRole }}</span>
            </div>
          </div>
          <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <span class="material-symbols-outlined text-[#2f3131] text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Workspace -->
    <main class="w-full pt-16 bg-[#0e0e0e] min-h-screen flex flex-col justify-between">
      <div class="flex flex-col w-full">
        <div class="w-full max-w-[1280px] mx-auto px-6 py-6 space-y-6">
          
          <!-- Top Navigation & Breadcrumb -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#262626] pb-4">
            <div class="flex items-center gap-3">
              <button 
                @click="goBack"
                class="inline-flex items-center gap-2 font-mono-data-md text-[12px] tracking-wider text-[#8e9192] hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-0">
                <span class="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>QUAY LẠI QUẢN LÝ MƯỢN TRẢ</span>
              </button>
            </div>
          </div>

          <!-- Main 2-Column Workspace -->
          <div class="grid grid-cols-12 gap-6 items-start">
            
            <!-- ================= LEFT COLUMN (Col 8) ================= -->
            <div class="col-span-12 lg:col-span-8 space-y-6">
              
              <!-- CARD 1: Tra cứu Phiếu Mượn & Thông tin Độc Giả -->
              <div class="bg-[#111111] border border-[#262626] p-6 relative">
                <!-- Flush Top Technical Accent Hairline -->
                <div class="absolute top-0 left-0 flex h-[3px]">
                  <div class="w-5 bg-[#0066b1]"></div>
                  <div class="w-5 bg-[#1c69d4]"></div>
                  <div class="w-5 bg-[#e22718]"></div>
                </div>

                <div class="flex items-center justify-between pb-3 border-b border-[#262626]">
                  <h2 class="font-mono-data-md text-[11px] tracking-wider text-[#8e9192] uppercase font-semibold">
                    01. THÔNG TIN PHIẾU MƯỢN GỐC
                  </h2>
                </div>

                <!-- Read-only Technical Metadata Matrix -->
                <div class="mt-4 border border-[#262626] bg-[#0c0c0c] p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="space-y-1">
                    <div class="font-label-caps text-[11px] text-[#8e9192] uppercase">ĐỘC GIẢ</div>
                    <div class="font-mono-data-md text-[14px] text-white font-bold">
                      {{ borrowRecord ? (borrowRecord.tenDocGia || borrowRecord.readerName) : 'Nguyễn Văn An' }}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="font-label-caps text-[11px] text-[#8e9192] uppercase">EMAIL LIÊN HỆ</div>
                    <div class="font-mono-data-md text-[12px] text-neutral-300">
                      {{ readerEmail }}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="font-label-caps text-[11px] text-[#8e9192] uppercase">NGÀY MƯỢN / HẸN TRẢ</div>
                    <div class="font-mono-data-md text-[12px] text-neutral-300">
                      {{ borrowRecord ? formatDate(borrowRecord.ngayMuon) : '---' }} — {{ borrowRecord ? formatDate(borrowRecord.ngayTra) : '---' }}
                    </div>
                  </div>
                  <div class="space-y-1 pt-3 border-t border-[#1e1e1e]">
                    <div class="font-label-caps text-[11px] text-[#8e9192] uppercase">TRẠNG THÁI PHIẾU MƯỢN</div>
                    <div v-if="overdueDays > 0" class="inline-flex items-center gap-1.5 font-mono-data-md text-[12px] text-[#e22718] font-bold">
                      <span class="w-1.5 h-1.5 bg-[#e22718]"></span>
                      <span>[ĐANG MƯỢN - QUÁ HẠN]</span>
                    </div>
                    <div v-else class="inline-flex items-center gap-1.5 font-mono-data-md text-[12px] text-[#1c69d4] font-bold">
                      <span class="w-1.5 h-1.5 bg-[#1c69d4]"></span>
                      <span>[ĐANG TRONG HẠN MƯỢN]</span>
                    </div>
                  </div>
                  <div class="space-y-1 pt-3 border-t border-[#1e1e1e]">
                    <div class="font-label-caps text-[11px] text-[#8e9192] uppercase">SỐ LƯỢNG SÁCH MƯỢN</div>
                    <div class="font-mono-data-md text-[12px] text-white font-semibold">
                      {{ String(borrowRecord ? (borrowRecord.tongSoLuong || (borrowRecord.items ? borrowRecord.items.length : 1)) : 1).padStart(2, '0') }} QUYỂN
                    </div>
                  </div>
                  <div class="space-y-1 pt-3 border-t border-[#1e1e1e]">
                    <div class="font-label-caps text-[11px] text-[#8e9192] uppercase">SỐ NGÀY QUÁ HẠN</div>
                    <div :class="['font-mono-data-md text-[14px] font-bold', overdueDays > 0 ? 'text-[#e22718]' : 'text-[#0fa336]']">
                      {{ overdueDays > 0 ? String(overdueDays).padStart(2, '0') + ' NGÀY' : '00 NGÀY (TRONG HẠN)' }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- CARD 2: Danh sách sách vi phạm & Chi tiết phạt -->
              <div class="bg-[#111111] border border-[#262626] p-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#262626] gap-3">
                  <h2 class="font-mono-data-md text-[11px] tracking-wider text-[#8e9192] uppercase font-semibold">
                    02. DANH SÁCH SÁCH VI PHẠM &amp; HÌNH THỨC XỬ LÝ
                  </h2>
                </div>

                <!-- Violation Table -->
                <div class="overflow-x-auto border border-[#262626] mt-5">
                  <table class="w-full border-collapse font-mono-data-md text-[13px]" id="fineTable">
                    <thead>
                      <tr class="bg-[#161616] text-[#8e9192] border-b border-[#262626] text-left">
                        <th class="p-3 w-12 text-center font-label-caps text-[11px]">STT</th>
                        <th class="p-3 font-label-caps text-[11px]">TÊN SÁCH VI PHẠM</th>
                        <th class="p-3 font-label-caps text-[11px]">LÝ DO PHẠT</th>
                        <th class="p-3 text-right font-label-caps text-[11px] w-36">TIỀN PHẠT</th>
                        <th class="p-3 text-center font-label-caps text-[11px] w-24">THAO TÁC</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-[#262626]">
                      <tr v-if="violations.length === 0">
                        <td colspan="5" class="p-4 text-center text-[#8e9192] font-mono-data-md">
                          Chưa có mục vi phạm nào được thêm. Vui lòng thêm mục vi phạm phía dưới.
                        </td>
                      </tr>
                      <tr 
                        v-for="(row, idx) in violations" 
                        :key="row.id || idx"
                        :class="[idx % 2 === 0 ? 'bg-[#0f0f0f]' : 'bg-[#0c0c0c]', 'hover:bg-[#151515] transition-colors']">
                        <td class="p-3 text-center text-[#8e9192]">
                          {{ String(idx + 1).padStart(2, '0') }}
                        </td>
                        <td class="p-3">
                          <div class="text-white font-semibold">{{ row.bookTitle }}</div>
                        </td>
                        <td class="p-3">
                          <div class="text-neutral-300 text-[12px]">{{ row.reason }}</div>
                          <div class="text-[#8e9192] text-[11px] font-mono-data-md">{{ row.note || 'Biên bản xử lý hiện trường' }}</div>
                        </td>
                        <td class="p-3 text-right">
                          <span class="font-mono-data-md text-[14px] text-white font-bold">{{ formatVND(row.amount) }}</span>
                          <span class="text-[#8e9192] text-[11px]"> VNĐ</span>
                        </td>
                        <td class="p-3 text-center">
                          <button 
                            @click="removeViolationRow(idx)"
                            class="text-neutral-500 hover:text-[#e22718] font-mono-data-md text-[11px] uppercase transition-colors inline-flex items-center gap-1 bg-transparent border-0 cursor-pointer" 
                            title="Xóa dòng" 
                            type="button">
                            <span class="material-symbols-outlined text-[16px]">delete</span>
                            <span>XÓA</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Inline Form to Add Violation Line Item -->
                <div class="border border-dashed border-[#262626] bg-[#0e0e0e] p-4 mt-5 space-y-4" id="addViolationForm">
                  <div class="flex items-center justify-between border-b border-[#222222] pb-2">
                    <span class="font-label-caps text-[11px] text-[#8e9192] uppercase tracking-wider">
                      + THÊM DÒNG VI PHẠM MỚI VÀO PHIẾU PHẠT
                    </span>
                    <button 
                      type="button" 
                      @click="addNewViolationRow" 
                      class="border border-[#333333] hover:border-white bg-[#161616] px-3.5 py-1.5 font-mono-data-md text-[11px] text-white uppercase transition-colors inline-flex items-center gap-1.5 cursor-pointer font-bold tracking-wider">
                      <span class="material-symbols-outlined text-[14px]">add</span>
                      <span>THÊM DÒNG VI PHẠM</span>
                    </button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div class="md:col-span-4 space-y-1.5">
                      <label class="block font-label-caps text-[11px] text-[#8e9192] uppercase">
                        CHỌN SÁCH CẦN PHẠT (TỪ PHIẾU MƯỢN)
                      </label>
                      <select 
                        v-model="newBookTitle"
                        class="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#1c69d4] focus:outline-none text-white px-3 py-2 font-mono-data-md text-[13px]">
                        <option v-for="title in availableBooks" :key="title" :value="title">
                          {{ title }}
                        </option>
                        <option v-if="availableBooks.length === 0" value="Tài liệu mượn">
                          Tài liệu mượn
                        </option>
                      </select>
                    </div>

                    <div class="md:col-span-4 space-y-1.5">
                      <label class="block font-label-caps text-[11px] text-[#8e9192] uppercase">
                        LÝ DO VI PHẠM
                      </label>
                      <select 
                        v-model="newReason"
                        @change="autoFillFine(newReason)"
                        class="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#1c69d4] focus:outline-none text-white px-3 py-2 font-mono-data-md text-[13px]">
                        <option :value="`Trả trễ hạn (${String(overdueDays || 6).padStart(2, '0')} ngày)`">
                          Trả trễ hạn ({{ String(overdueDays || 6).padStart(2, '0') }} ngày)
                        </option>
                        <option value="Làm rách/hỏng tài liệu">Làm rách/hỏng tài liệu</option>
                        <option value="Làm mất sách (Bồi thường 150%)">Làm mất sách (Bồi thường 150%)</option>
                        <option value="Vi phạm quy chế mượn khác">Vi phạm quy chế mượn khác</option>
                      </select>
                    </div>

                    <div class="md:col-span-2 space-y-1.5">
                      <label class="block font-label-caps text-[11px] text-[#8e9192] uppercase">
                        TIỀN PHẠT (VNĐ)
                      </label>
                      <input 
                        v-model.number="newFineAmount"
                        class="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#1c69d4] focus:outline-none text-white px-3 py-2 font-mono-data-md text-[13px] text-right" 
                        step="5000" 
                        type="number">
                    </div>

                    <div class="md:col-span-2">
                      <button 
                        @click="addNewViolationRow"
                        class="w-full h-[38px] bg-[#222222] hover:bg-white hover:text-black border border-[#333333] hover:border-white text-white font-mono-data-md text-[11px] uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer" 
                        type="button">
                        <span class="material-symbols-outlined text-[15px]">done</span>
                        <span>ÁP DỤNG</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= RIGHT COLUMN (Col 4) ================= -->
            <div class="col-span-12 lg:col-span-4 space-y-6">
              
              <!-- CARD 3: Thông tin Phiếu Phạt & Nhân Viên Lập -->
              <div class="bg-[#111111] border border-[#262626] p-6 space-y-5">
                <div class="flex items-center justify-between pb-3 border-b border-[#262626]">
                  <h2 class="font-mono-data-md text-[11px] tracking-wider text-[#8e9192] uppercase font-semibold">
                    03. THIẾT LẬP BIÊN BẢN PHIẾU PHẠT
                  </h2>
                  <span class="w-2 h-2 bg-[#1c69d4]"></span>
                </div>

                <div class="space-y-4">
                  <!-- Ngày Lập Phiếu -->
                  <div class="space-y-1.5">
                    <label class="block font-label-caps text-[11px] text-[#8e9192] uppercase">
                      NGÀY LẬP PHIẾU
                    </label>
                    <div class="bg-[#0a0a0a] border border-[#262626] px-3.5 py-2 font-mono-data-md text-[13px] text-neutral-300 flex items-center justify-between">
                      <span>{{ ticketData.currentTimestamp }}</span>
                      <span class="material-symbols-outlined text-[16px] text-[#8e9192]">schedule</span>
                    </div>
                  </div>

                  <!-- Nhân Viên Lập -->
                  <div class="space-y-1.5">
                    <label class="block font-label-caps text-[11px] text-[#8e9192] uppercase">
                      CÁN BỘ LẬP BIÊN BẢN
                    </label>
                    <div class="bg-[#0a0a0a] border border-[#262626] px-3.5 py-2 font-mono-data-md text-[13px] text-neutral-200 flex items-center justify-between">
                      <span>{{ ticketData.staffName }}</span>
                      <span class="material-symbols-outlined text-[16px] text-[#8e9192]">verified_user</span>
                    </div>
                  </div>

                  <!-- Trạng Thái Thu Phạt -->
                  <div class="space-y-1.5">
                    <label class="block font-label-caps text-[11px] text-[#8e9192] uppercase">
                      TRẠNG THÁI THU PHẠT
                    </label>
                    <select 
                      v-model="ticketData.trangThai"
                      class="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#1c69d4] focus:outline-none text-white px-3 py-2 font-mono-data-md text-[13px]">
                      <option value="CHUA_NOP">CHƯA NỘP TIỀN (GHI NỢ HỆ THỐNG)</option>
                      <option value="DA_THU">ĐÃ THU TIỀN TẠI QUẦY (TIỀN MẶT)</option>
                    </select>
                  </div>

                  <!-- Ghi Chú Vi Phạm -->
                  <div class="space-y-1.5">
                    <label class="block font-label-caps text-[11px] text-[#8e9192] uppercase">
                      GHI CHÚ / NỘI DUNG VI PHẠM
                    </label>
                    <textarea 
                      v-model="ticketData.ghiChu"
                      class="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#1c69d4] focus:outline-none text-neutral-200 font-mono-data-md text-[13px] p-3 placeholder:text-[#444748] resize-none" 
                      placeholder="Nhập ghi chú chi tiết về tình trạng tài liệu hoặc lý do phát sinh phạt..." 
                      rows="3"></textarea>
                  </div>
                </div>
              </div>

              <!-- CARD 4: Tổng kết tài chính & Xác nhận lập phiếu -->
              <div class="bg-[#141414] border border-[#262626] p-6 space-y-6">
                <div class="flex items-center justify-between pb-3 border-b border-[#262626]">
                  <h2 class="font-mono-data-md text-[11px] tracking-wider text-[#8e9192] uppercase font-semibold">
                    TỔNG KẾT TÀI CHÍNH
                  </h2>
                </div>

                <!-- Financial Summary Rows -->
                <div class="space-y-3 font-mono-data-md text-[13px]">
                  <div class="flex justify-between items-center text-[#8e9192]">
                    <span>Tổng số mục vi phạm:</span>
                    <span class="text-white font-semibold">{{ summaryItemCount }}</span>
                  </div>
                  <div class="flex justify-between items-center text-[#8e9192]">
                    <span>Tiền phạt trả trễ:</span>
                    <span class="text-white font-semibold">{{ formatVND(summaryLateFee) }} VNĐ</span>
                  </div>
                  <div class="flex justify-between items-center text-[#8e9192]">
                    <span>Tiền phạt hỏng tài liệu / khác:</span>
                    <span class="text-white font-semibold">{{ formatVND(summaryDamageFee) }} VNĐ</span>
                  </div>
                  <div class="border-t border-[#262626] pt-4">
                    <div class="font-label-caps text-[11px] text-[#8e9192] uppercase tracking-wider">
                      TỔNG TIỀN PHẠT:
                    </div>
                    <div class="flex items-baseline justify-between mt-1">
                      <span class="font-mono-data-lg text-[32px] text-white font-bold tracking-tight">
                        {{ formatVND(grandTotal) }}
                      </span>
                      <span class="font-mono-data-md text-[16px] text-[#8e9192] font-bold">VNĐ</span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3 pt-2">
                  <button 
                    @click="submitFine"
                    class="w-full h-11 bg-white hover:bg-[#d8d8d8] text-black font-mono-data-md font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer border-0" 
                    type="button">
                    <span>XÁC NHẬN LẬP PHIẾU PHẠT</span>
                    <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                  <button 
                    @click="goBack"
                    class="w-full h-11 bg-[#161616] hover:bg-[#202020] border border-[#333333] hover:border-[#8e9192] text-[#8e9192] hover:text-white font-mono-data-md text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer" 
                    type="button">
                    <span class="material-symbols-outlined text-[15px]">close</span>
                    <span>HỦY BỎ &amp; QUAY LẠI</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="w-full bg-[#0e0e0e] border-t border-[#353535] py-6 px-8">
      <div class="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex flex-col gap-1 font-mono-data-md text-[12px] text-[#c4c7c8]">
          <div class="flex items-center gap-2">
            <span class="text-[#8e9192] font-label-caps text-[11px]">LIÊN HỆ QUẢN LÝ THƯ VIỆN:</span>
            <span class="text-white">quanly@thuvien.edu.vn</span>
            <span class="text-[#444748]">|</span>
            <span class="text-white">(0292) 3831 567</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[#8e9192] font-label-caps text-[11px]">LIÊN HỆ HỖ TRỢ KỸ THUẬT:</span>
            <span class="text-white">hotro@thuvien.edu.vn</span>
          </div>
        </div>
        <div class="flex flex-col md:items-end gap-0.5">
          <div class="font-label-caps text-[11px] tracking-widest text-white">QUY CHẾ THƯ VIỆN</div>
          <a class="font-body-md text-[12px] text-[#8e9192] hover:text-white transition-colors no-underline" href="#">
            Quy định mượn trả sách &amp; Xử lý vi phạm
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import fineTicketController from '../js/fineTicket.js';
export default fineTicketController;
</script>

<style scoped>
@import '../css/fineTicket.css';
</style>

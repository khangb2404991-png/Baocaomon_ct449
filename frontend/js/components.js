/**
 * BOOK LENDING SYSTEM - SHARED HEADER & FOOTER FUNCTIONS & COMPONENTS
 * Extracted directly from Stitch AI design files (Trangchu.html, QuanLySach.html, etc.)
 * Provides reusable functions (getHeader, getFooter, getAdminSidebar, getAdminHeader) 
 * that pages can call directly to ensure full synchronization across the application.
 */

import { h } from 'vue';
import { LibraryStore } from './common.js';

/**
 * 1. HÀM TẠO HEADER DÙNG CHUNG CHO ĐỘC GIẢ (Client Header)
 * Trích xuất nguyên bản từ design/Trangchu.html
 * @param {string} activeTab - Tab đang chọn: 'home' | 'cart' | 'profile' | 'login'
 * @param {object} options - Dữ liệu động (userName, cartCount)
 * @returns {string} Chuỗi HTML Header
 */
export function getHeader(activeTab = 'home', options = {}) {
  let currentUser = options.currentUser;
  if (!currentUser && typeof window !== 'undefined' && window.LibraryStore) {
    currentUser = window.LibraryStore.getCurrentUser();
  }
  const userName = options.userName || (currentUser ? (currentUser.name || currentUser.ten || 'Nguyễn Văn An') : 'Nguyễn Văn An');

  let cartCount = options.cartCount;
  if (cartCount === undefined && typeof window !== 'undefined' && window.LibraryStore) {
    cartCount = window.LibraryStore.getCartCount();
  }
  const cartFormatted = String(cartCount !== undefined ? cartCount : 3).padStart(2, '0');

  const isHome = activeTab === 'home';
  const isCart = activeTab === 'cart';

  const homeClass = isHome 
    ? "text-primary border-b-2 border-primary pb-1 font-label-caps text-label-caps uppercase tracking-wider font-bold transition-colors"
    : "text-[#bbbbbb] hover:text-primary font-label-caps text-label-caps uppercase tracking-wider transition-colors";

  const cartClass = isCart
    ? "text-primary border-b-2 border-primary pb-1 font-label-caps text-label-caps uppercase tracking-wider font-bold transition-colors"
    : "text-[#bbbbbb] hover:text-primary font-label-caps text-label-caps uppercase tracking-wider transition-colors";

  return `
    <header class="fixed top-0 left-0 right-0 z-50 h-16 w-full px-8 flex items-center justify-between border-b border-[#262626] bg-[#0A0A0A]">
      <div class="flex items-center gap-3 shrink-0">
        <a href="#/home" class="flex items-center gap-3 no-underline text-inherit">
          <div class="w-6 h-6 border border-primary flex items-center justify-center bg-transparent">
            <span class="material-symbols-outlined text-[16px] text-primary">menu_book</span>
          </div>
          <span class="font-headline-md text-headline-md tracking-wider uppercase text-primary font-bold text-[16px]">BOOK LENDING SYSTEM</span>
        </a>
      </div>
      <nav class="hidden md:flex items-center gap-10">
        <a class="${homeClass}" href="#/home">TRANG CHỦ</a>
        <a class="${cartClass}" href="#/cart" id="header-cart-link">GIỎ HÀNG (<span id="header-cart-badge">${cartFormatted}</span>)</a>
      </nav>
      <div class="flex items-center gap-space-sm shrink-0">
        <a href="#/profile" id="user-avatar-badge" onclick="window.location.hash='#/profile'" class="inline-flex items-center gap-3 px-3.5 py-1.5 bg-[#141414] border border-[#2A2A2A] text-inherit no-underline hover:border-primary hover:bg-[#1f1f1f] transition-colors cursor-pointer select-none">
          <div class="w-6 h-6 bg-[#262626] flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-primary text-[16px]">person</span>
          </div>
          <span class="font-body-md text-body-md text-primary font-medium">${userName}</span>
        </a>
      </div>
    </header>
  `;
}

/**
 * 2. HÀM TẠO FOOTER DÙNG CHUNG CHO TOÀN BỘ HỆ THỐNG (Footer)
 * Trích xuất nguyên bản từ design/Trangchu.html
 * @returns {string} Chuỗi HTML Footer
 */
export function getFooter() {
  return `
    <footer class="w-full border-t border-[#262626] bg-[#0A0A0A] py-6 px-8 mt-auto">
      <div class="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row items-start justify-between gap-space-md font-mono-data-md text-body-sm">
        <div class="flex flex-col gap-2 text-left text-[#bbbbbb]">
          <div>LIÊN HỆ QUẢN LÝ THƯ VIỆN: <span class="text-primary">quanly@thuvien.edu.vn</span> | (0292) 3831 567</div>
          <div>LIÊN HỆ HỖ TRỢ KỸ THUẬT: <span class="text-primary">hotro@thuvien.edu.vn</span></div>
        </div>
        <div class="flex flex-col gap-1 text-left md:text-right text-[#bbbbbb]">
          <a class="text-primary font-bold uppercase tracking-wider hover:underline" data-path="quy-dinh-thu-vien" href="#/home">QUY CHẾ THƯ VIỆN</a>
          <span class="text-body-sm text-[#bbbbbb]">Quy định mượn trả sách &amp; Bảo quản tài liệu</span>
        </div>
      </div>
    </footer>
  `;
}

/**
 * 3. HÀM TẠO HEADER DÀNH RIÊNG CHO TRANG ĐĂNG NHẬP / ĐĂNG KÝ
 * Trích xuất nguyên bản từ design/DangNhap.html
 * @returns {string} Chuỗi HTML Header
 */
export function getAuthHeader() {
  return `
    <header class="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0A0A0A] border-b border-[#262626] px-8 flex items-center justify-between">
      <div class="flex items-center gap-3 shrink-0">
        <a href="#/home" class="flex items-center gap-3 no-underline text-inherit">
          <div class="w-6 h-6 bg-white flex items-center justify-center text-black font-bold">
            <span class="material-symbols-outlined text-[18px] text-black">menu_book</span>
          </div>
          <span class="font-headline-md text-[15px] tracking-wider uppercase text-white font-bold">BOOK LENDING SYSTEM</span>
        </a>
      </div>
      <nav class="hidden md:flex items-center gap-10">
        <a href="#/home" class="font-label-caps text-label-caps uppercase tracking-wider text-[#888888] hover:text-white transition-colors">TRANG CHỦ</a>
        <a href="#/cart" class="font-label-caps text-label-caps uppercase tracking-wider text-[#888888] hover:text-white transition-colors">GIỎ HÀNG</a>
      </nav>
      <div class="inline-flex items-center gap-3 px-3.5 py-1.5 bg-[#141414] border border-[#2A2A2A] rounded-none select-none">
        <div class="w-6 h-6 bg-[#262626] flex items-center justify-center text-neutral-400">
          <span class="material-symbols-outlined text-[16px]">person</span>
        </div>
        <span class="font-mono-data-md text-sm text-white uppercase tracking-wider">XÁC THỰC HỆ THỐNG</span>
      </div>
    </header>
  `;
}

/**
 * 4. HÀM TẠO SIDEBAR DÙNG CHUNG CHO KHU VỰC QUẢN TRỊ (Admin Sidebar)
 * Trích xuất nguyên bản từ design/QuanLySach.html & QuanLyMuonTra(admin).html
 * @param {string} activeTab - 'books' | 'borrow' | 'readers'
 * @param {object} staffInfo - Thông tin nhân viên thủ thư
 * @returns {string} Chuỗi HTML Sidebar
 */
export function getAdminSidebar(activeTab = 'books', staffInfo = {}) {
  const isBooks = activeTab === 'books';
  const isBorrow = activeTab === 'borrow';
  const isFines = activeTab === 'fines';
  const isReaders = activeTab === 'readers';

  const staffName = staffInfo.name || staffInfo.hoten || 'Trần Minh Quang';
  const staffRole = staffInfo.role || staffInfo.chucvu || 'THỦ THƯ TRƯỞNG';

  const booksClass = isBooks
    ? "flex items-center px-space-md py-space-sm transition-colors bg-[#2a2a2a] text-white border-l-2 border-white font-semibold no-underline"
    : "flex items-center px-space-md py-space-sm text-[#c4c7c8] hover:bg-[#1b1b1b] hover:text-white transition-colors font-mono-data-md text-mono-data-md no-underline";

  const borrowClass = isBorrow
    ? "flex items-center px-space-md py-space-sm transition-colors bg-[#2a2a2a] text-white border-l-2 border-white font-semibold no-underline"
    : "flex items-center px-space-md py-space-sm text-[#c4c7c8] hover:bg-[#1b1b1b] hover:text-white transition-colors font-mono-data-md text-mono-data-md no-underline";

  const finesClass = isFines
    ? "flex items-center px-space-md py-space-sm transition-colors bg-[#2a2a2a] text-white border-l-2 border-white font-semibold no-underline"
    : "flex items-center px-space-md py-space-sm text-[#c4c7c8] hover:bg-[#1b1b1b] hover:text-white transition-colors font-mono-data-md text-mono-data-md no-underline";

  const readersClass = isReaders
    ? "flex items-center px-space-md py-space-sm transition-colors bg-[#2a2a2a] text-white border-l-2 border-white font-semibold no-underline"
    : "flex items-center px-space-md py-space-sm text-[#c4c7c8] hover:bg-[#1b1b1b] hover:text-white transition-colors font-mono-data-md text-mono-data-md no-underline";

  return `
    <aside class="fixed left-0 top-0 h-full w-72 bg-[#0e0e0e] border-r border-[#444748] z-50 flex flex-col justify-between">
      <div class="flex flex-col">
        <div class="relative pt-4 pb-4 px-space-md border-b border-[#444748] bg-[#0e0e0e]">
          <div class="absolute top-0 left-0 flex flex-row">
            <div class="w-4 h-[3px] bg-[#0066b1]"></div>
            <div class="w-4 h-[3px] bg-[#1c69d4]"></div>
            <div class="w-4 h-[3px] bg-[#e22718]"></div>
          </div>
          <div class="flex items-center justify-between">
            <span class="font-label-caps text-label-caps text-[#8e9192] uppercase tracking-wider">KHU VỰC QUẢN TRỊ</span>
          </div>
        </div>
        <div class="px-space-md py-space-sm">
          <span class="font-label-caps text-label-caps text-[#8e9192] uppercase">DANH MỤC ĐIỀU HÀNH</span>
        </div>
        <nav class="flex flex-col px-space-xs gap-0.5">
          <a class="${booksClass}" href="#/admin/books">
            <span class="w-2 h-2 mr-3 bg-[#444748]"></span>QUẢN LÝ SÁCH
          </a>
          <a class="${borrowClass}" href="#/admin/borrows">
            <span class="w-2 h-2 mr-3 bg-[#444748]"></span>QUẢN LÝ MƯỢN/TRẢ
          </a>
          <a class="${finesClass}" href="#/admin/fine-ticket">
            <span class="w-2 h-2 mr-3 bg-[#444748]"></span>QUẢN LÝ PHIẾU PHẠT
          </a>
          <a class="${readersClass}" href="#/admin/readers">
            <span class="w-2 h-2 mr-3 bg-[#444748]"></span>QUẢN LÝ TÀI KHOẢN
          </a>
        </nav>
      </div>
      <div class="border-t border-[#444748] p-space-md bg-[#0e0e0e]">
        <div class="flex items-center justify-between mb-3">
          <div class="flex flex-col">
            <span class="font-title-sm text-title-sm text-primary uppercase font-bold leading-tight">${staffName}</span>
            <span class="font-mono-data-md text-mono-data-md text-on-surface-variant text-[12px]">${staffRole}</span>
          </div>
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[#2f3131] text-[18px]">person</span>
          </div>
        </div>
        <a href="#/login" class="flex items-center justify-center w-full h-8 bg-[#1f1f1f] border border-[#3c3c3c] text-white hover:bg-[#e22718] hover:text-white font-label-caps text-[11px] tracking-widest uppercase transition-colors no-underline">
          <span class="material-symbols-outlined text-[16px] mr-1">logout</span>ĐĂNG XUẤT
        </a>
      </div>
    </aside>
  `;
}

/**
 * 5. HÀM TẠO HEADER DÙNG CHUNG CHO KHU VỰC QUẢN TRỊ (Admin Header)
 * Trích xuất nguyên bản từ design/QuanLySach.html
 * @returns {string} Chuỗi HTML Admin Header
 */
export function getAdminHeader() {
  return `
    <header class="fixed top-0 left-72 right-0 h-16 bg-[#000000] border-b border-[#262626] z-40 flex items-center justify-between px-8">
      <div class="flex items-center gap-6">
        <a href="#/admin/books" class="flex items-center gap-2 text-white font-bold uppercase tracking-wider font-headline-md text-[14px] no-underline">
          <span class="material-symbols-outlined text-primary text-[20px]">grid_view</span>
          <span>BOOK LENDING SYSTEM</span>
        </a>
      </div>
      <div class="flex items-center gap-4">
        <a href="#/home" class="font-label-caps text-label-caps text-[#8e9192] hover:text-white uppercase transition-colors no-underline">
          XEM GIAO DIỆN ĐỘC GIẢ →
        </a>
      </div>
    </header>
  `;
}

/**
 * 6. HÀM TẠO FOOTER DÙNG CHUNG CHO KHU VỰC QUẢN TRỊ (Admin Footer)
 * @returns {string} Chuỗi HTML Admin Footer
 */
export function getAdminFooter() {
  return `
    <footer class="w-full border-t border-[#262626] bg-[#0A0A0A] py-4 px-8 mt-auto font-mono-data-md text-[12px] text-[#8e9192] flex items-center justify-between">
      <span>BOOK LENDING MANAGEMENT SYSTEM - KHOA CÔNG NGHỆ THÔNG TIN</span>
      <span>PHIÊN BẢN 2.4.0 (VITE + VUE 3)</span>
    </footer>
  `;
}

// Global window bindings for direct access
if (typeof window !== 'undefined') {
  window.getHeader = getHeader;
  window.getFooter = getFooter;
  window.getAuthHeader = getAuthHeader;
  window.getAdminSidebar = getAdminSidebar;
  window.getAdminHeader = getAdminHeader;
  window.getAdminFooter = getAdminFooter;
}

// 7. VUE COMPONENTS WRAPPER (Tương thích cả gọi qua Component lẫn gọi trực tiếp hàm)
export const ClientHeader = {
  name: 'ClientHeader',
  props: {
    currentPage: { type: String, default: 'home' },
    title: { type: String, default: 'BOOK LENDING SYSTEM' }
  },
  render() {
    return h('div', {
      innerHTML: getHeader(this.currentPage)
    });
  }
};

export const ClientFooter = {
  name: 'ClientFooter',
  render() {
    return h('div', {
      innerHTML: getFooter()
    });
  }
};

export const AdminSidebar = {
  name: 'AdminSidebar',
  props: {
    currentPage: { type: String, default: 'books' }
  },
  render() {
    return h('div', {
      innerHTML: getAdminSidebar(this.currentPage)
    });
  }
};

export const AdminHeader = {
  name: 'AdminHeader',
  render() {
    return h('div', {
      innerHTML: getAdminHeader()
    });
  }
};

export const AdminFooter = {
  name: 'AdminFooter',
  render() {
    return h('div', {
      innerHTML: getAdminFooter()
    });
  }
};

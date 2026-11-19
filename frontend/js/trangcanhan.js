/**
 * BOOK LENDING SYSTEM - USER PROFILE & BORROW HISTORY (TRANG CA NHAN)
 * Vue 3 Application
 */

const { createApp, ref, computed } = Vue;

createApp({
  setup() {
    const user = ref(LibraryStore.getCurrentUser());
    const cartCount = ref(LibraryStore.getCartCount());

    const activeFilter = ref('ALL');

    // User's personal borrow history (loaded from design template)
    const historyList = ref([
      {
        id: 'PM-8821',
        title: 'Thiết Kế Hệ Thống Phân Tán Quy Mô Lớn',
        author: 'Alex Xu',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8IHWIGnccWuKM4BdMQROuXVI3W9B5pKJQiYiiaLjAJeR_LUEcX-cvZfEs2WGtMGvkYj18_SKSFNL67veIYRiM9AExJf8vsWh4Nb_sn5EbERzQYPP5IYqelX21WykQ2KAthDo_BqfYnD8yiMsgypSQdrRR-e_kx6faPvgITTy8saYLf6KjjfZ-6Txel5Vt5llsUdU5bScYot91cJlzIypx7IIW_4Xk_2CXJnwziqE',
        qty: 1,
        borrowDate: '24/05/2024',
        dueDate: '07/06/2024',
        dueNote: '',
        status: 'pending' // pending, borrowing, returned, overdue, cancelled
      },
      {
        id: 'PM-8790',
        title: 'Cấu Trúc Dữ Liệu & Giải Thuật Thực Chiến',
        author: 'Robert C. Martin',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi1LSDiiSVdXW1gKBr_8biwotExmJI2QkH_jcdCWltMu8a-DlstSv4V36cb2kelF9DznpNhKNrx7ewtjZg2JgkmG91NgUM2HX8WkflvgwwEWu_yKrBaHD940LpZJ_JQa7ya4LKoLxZgiu1XoyEn-1wBkj76-husPQiWP1uqOS2u_w9_O1w6hLv6lF5e0_omRkpqE3BoaFZnDy_PwAjtDZtkzI9bLMCST41WbkheC0',
        qty: 1,
        borrowDate: '18/05/2024',
        dueDate: '01/06/2024',
        dueNote: 'HẠN: CÒN 7 NGÀY',
        status: 'borrowing'
      },
      {
        id: 'PM-8742',
        title: 'An Toàn Thông Tin & Mạng Máy Tính Nâng Cao',
        author: 'Vũ Quốc Đạt',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3MpoRa8vonRP0ObwAZVtIbO_JypMw-L6cOs0r74bzyQACVYj6TdOKtdJX-P9BX_HKTJVAaS2kOcr6UX6UkqZZMWnSC-LPqj3uXZKldHbxbK0Cbbg94jgyz6n85uxjx_Mzr4bPUmEdhIV7mHVLvT2AkTNkDL_3obzTgHRNgVApGBc3b323Kv7bXe6itvEWTWsP6Gp69lUHNFblGoeDq_iuFHlggY6d6zhLTaMe7-4',
        qty: 1,
        borrowDate: '15/05/2024',
        dueDate: '29/05/2024',
        dueNote: 'HẠN: CÒN 4 NGÀY',
        status: 'borrowing'
      },
      {
        id: 'PM-8610',
        title: 'Trí Tuệ Nhân Tạo & Deep Learning',
        author: 'Ian Goodfellow',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCngChpuUdtps-cHOlWwK_u6FmE9wRPrMmzUeQF1SlzWqpFRYIfZPtK1x-A5vywxkBBflMv7liufH1k2HjnN5Osp-qN4rKvVxTJAWwnH-5GlV2zzb9NXjUHHhao1nje6zZk2HWRRgGfhpIPtp4BMBJcXtv5XngBfCikB7LtsAatoMu9Fxk2_zOJroKkaPNYHao_SNUnHZNu2LChLFFB2aKhUqFfVBxG-h1duk5f_6g',
        qty: 2,
        borrowDate: '01/04/2024',
        dueDate: '14/04/2024',
        dueNote: 'ĐÃ TRẢ: 12/04/2024',
        status: 'returned'
      },
      {
        id: 'PM-8502',
        title: 'Tối Ưu Hóa Truy Vấn CSDL SQL Server',
        author: 'Đỗ Thành Nhân',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA25doWwK45rNQ9wtRVnd7qAYJcBTpjKsUSh-XFUoDP8DqjS2Z4Iyp786IxYV6Utf0hSoOdBlWJXP_ZOMosGDeGJyyHuBWNhJQSbuAEHq_dtTjwGqE9OdmDxLOvmquogKBN1I5JD20Muj9gbq-Wu1HFaHqyhKXhMeXfzqEKvYmcU7DEz0iv0QcaMmKHRpd7V3RTAGjDaaY1nPOPQdpW2ng4FDohyxLht46w702YiV4',
        qty: 1,
        borrowDate: '10/03/2024',
        dueDate: '24/03/2024',
        dueNote: 'ĐÚNG HẠN',
        status: 'returned'
      },
      {
        id: 'PM-8321',
        title: 'Kiến Trúc Microservices & Docker Kubernetes',
        author: 'Sam Newman',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcGTsL7LlHbc-HIhNhuXwSAXptgWUM2JJS9_8Be3gKerh2nwbzW8x2G9CjBbyb7Ofng2ZWKxq6j6rGpATZklXTMg2jJU5D8BQOLcpuoCSDQ2h4pTDRL3CIQ5c_c6oZmp0eFxTJA8PN6vDBs8HCibUVw9RvxUYUaJsbZzbYy5wmCaKWuxQmjVbu38dsNFkzA1ErSdtVOWdc1GjfxIZebZYuOV61iGJu7eM2iP3NHFw',
        qty: 1,
        borrowDate: '15/01/2024',
        dueDate: '29/01/2024',
        dueNote: 'TRỄ 2 NGÀY (TRẢ 31/01)',
        status: 'overdue'
      }
    ]);

    // Computed Stats
    const totalBorrows = computed(() => historyList.value.length);
    const activeBorrows = computed(() => {
      return historyList.value.filter(i => i.status === 'borrowing').length;
    });

    // Filtering
    const filteredHistory = computed(() => {
      if (activeFilter.value === 'ALL') return historyList.value;
      if (activeFilter.value === 'PENDING') return historyList.value.filter(i => i.status === 'pending');
      if (activeFilter.value === 'BORROWING') return historyList.value.filter(i => i.status === 'borrowing');
      if (activeFilter.value === 'RETURNED') return historyList.value.filter(i => i.status === 'returned');
      if (activeFilter.value === 'CANCELLED') return historyList.value.filter(i => i.status === 'cancelled');
      return historyList.value;
    });

    function setFilter(filter) {
      activeFilter.value = filter;
    }

    function updateProfile() {
      user.value.name = `${user.value.holot} ${user.value.ten}`.trim();
      LibraryStore.setCurrentUser(user.value);
      LibraryStore.showToast('Dữ liệu hồ sơ độc giả đã được cập nhật thành công.');
    }

    async function cancelBorrow(item) {
      const confirmed = await LibraryStore.showConfirm({
        title: 'XÁC NHẬN HỦY PHIẾU MƯỢN',
        message: `Bạn có chắc chắn muốn hủy yêu cầu mượn "${item.title}"?`,
        type: 'danger'
      });
      if (confirmed) {
        item.status = 'cancelled';
        LibraryStore.showToast(`Đã hủy yêu cầu mượn tài liệu "${item.title}".`);
      }
    }

    return {
      user,
      cartCount,
      activeFilter,
      historyList,
      totalBorrows,
      activeBorrows,
      filteredHistory,
      setFilter,
      updateProfile,
      cancelBorrow
    };
  }
}).mount('#app');


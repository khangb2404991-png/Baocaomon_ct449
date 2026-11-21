/**
 * BOOK LENDING SYSTEM - CENTRALIZED API SERVICE (frontend/js/api.js)
 * Wraps native fetch with auto-token injection, 401/403 authorization handling,
 * and clean domain-specific endpoint helper objects.
 */

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) 
  ? import.meta.env.VITE_API_URL 
  : 'http://localhost:5000/api';

/**
 * Core HTTP Request Wrapper
 */
export async function apiRequest(endpoint, options = {}) {
  const url = new URL(API_BASE_URL + endpoint);
  
  if (options.params) {
    Object.keys(options.params).forEach(key => {
      const val = options.params[key];
      if (val !== undefined && val !== null && val !== '') {
        url.searchParams.append(key, val);
      }
    });
  }

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions = {
    method: options.method || 'GET',
    headers,
    ...options
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url.toString(), fetchOptions);

    // 401 Unauthorized: token expired or invalid
    if (response.status === 401) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
      }
      if (typeof window !== 'undefined' && !window.location.hash.includes('/login')) {
        window.location.hash = '#/login';
      }
    }

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      const errorMsg = (data && (data.message || data.error)) || `Lỗi hệ thống HTTP ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, error.message);
    throw error;
  }
}

// 1. Xác thực & Tài khoản (Auth API)
export const authApi = {
  login: (email, password) => apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password }
  }),
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: userData
  }),
  getProfile: () => apiRequest('/auth/profile', { method: 'GET' })
};

// 2. Danh mục Sách (Sach API)
export const sachApi = {
  getAll: (params) => apiRequest('/sach', { method: 'GET', params }),
  getTop10: () => apiRequest('/sach/top10', { method: 'GET' }),
  getById: (id) => apiRequest(`/sach/${id}`, { method: 'GET' }),
  create: (data) => apiRequest('/sach', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/sach/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/sach/${id}`, { method: 'DELETE' })
};

// 3. Nhà Xuất Bản (NXB API)
export const nhaxbApi = {
  getAll: () => apiRequest('/nhaxb', { method: 'GET' }),
  create: (data) => apiRequest('/nhaxb', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/nhaxb/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/nhaxb/${id}`, { method: 'DELETE' })
};

// 4. Tác Giả (TacGia API)
export const tacGiaApi = {
  getAll: () => apiRequest('/tacgia', { method: 'GET' }),
  create: (data) => apiRequest('/tacgia', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/tacgia/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/tacgia/${id}`, { method: 'DELETE' })
};

// 5. Giỏ Hàng (GioHang API)
export const gioHangApi = {
  getCart: (maDG) => apiRequest('/giohang', { method: 'GET', params: { maDG } }),
  addToCart: (data) => apiRequest('/giohang/add', { method: 'POST', body: data }),
  updateCartItem: (data) => apiRequest('/giohang/update', { method: 'PUT', body: data }),
  removeFromCart: (maSach, maDG) => apiRequest(`/giohang/remove/${maSach}`, { method: 'DELETE', params: { maDG } }),
  clearCart: (maDG) => apiRequest('/giohang/clear', { method: 'DELETE', params: { maDG } })
};

// 6. Phiếu Mượn (PhieuMuon API)
export const phieuMuonApi = {
  getAll: (params) => apiRequest('/phieumuon', { method: 'GET', params }),
  getMyBorrows: () => apiRequest('/phieumuon/my', { method: 'GET' }),
  getById: (id) => apiRequest(`/phieumuon/${id}`, { method: 'GET' }),
  create: (data) => apiRequest('/phieumuon', { method: 'POST', body: data }),
  approve: (id) => apiRequest(`/phieumuon/${id}/duyet`, { method: 'PUT' }),
  reject: (id, lyDo) => apiRequest(`/phieumuon/${id}/tuchoi`, { method: 'PUT', body: { lyDo } }),
  returnBook: (id) => apiRequest(`/phieumuon/${id}/tra`, { method: 'PUT' }),
  cancel: (id) => apiRequest(`/phieumuon/${id}/huy`, { method: 'PUT' })
};

// 7. Phiếu Phạt (PhieuPhat API)
export const phieuPhatApi = {
  getAll: (params) => apiRequest('/phieuphat', { method: 'GET', params }),
  getById: (id) => apiRequest(`/phieuphat/${id}`, { method: 'GET' }),
  create: (data) => apiRequest('/phieuphat', { method: 'POST', body: data }),
  confirmPayment: (id) => apiRequest(`/phieuphat/${id}/xac-nhan-thu`, { method: 'PUT' })
};

// 8. Độc Giả (DocGia API)
export const docGiaApi = {
  getAll: () => apiRequest('/docgia', { method: 'GET' }),
  toggleLock: (id) => apiRequest(`/docgia/${id}/toggle-lock`, { method: 'PUT' }),
  update: (id, data) => apiRequest(`/docgia/${id}`, { method: 'PUT', body: data })
};

// 9. Nhân Viên (NhanVien API)
export const nhanVienApi = {
  getAll: () => apiRequest('/nhanvien', { method: 'GET' }),
  create: (data) => apiRequest('/nhanvien', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/nhanvien/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/nhanvien/${id}`, { method: 'DELETE' })
};

export default {
  apiRequest,
  auth: authApi,
  sach: sachApi,
  nhaxb: nhaxbApi,
  tacGia: tacGiaApi,
  gioHang: gioHangApi,
  phieuMuon: phieuMuonApi,
  phieuPhat: phieuPhatApi,
  docGia: docGiaApi,
  nhanVien: nhanVienApi
};

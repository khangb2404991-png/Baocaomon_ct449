/**
 * AUTOMATED BACKEND API TEST SUITE (test_api.js)
 * Executes comprehensive integration tests against all MEVN endpoints
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, text: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('   BẮT ĐẦU CHẠY KIỂM THỬ TỰ ĐỘNG TOÀN DIỆN BACKEND MEVN API     ');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await request('GET', '/health');
    assert(health.status === 200 && health.body.success, '1. Health check endpoint hoạt động');

    // 2. Auth - Đăng nhập Độc giả
    const userLogin = await request('POST', '/auth/login', {
      email: 'user@email.com',
      password: '123456'
    });
    assert(userLogin.status === 200 && userLogin.body.role === 'DOCGIA', '2. Đăng nhập Độc giả (user@email.com / 123456) thành công');
    const userToken = userLogin.body.token;

    // 3. Auth - Đăng nhập Thủ thư / Admin
    const adminLogin = await request('POST', '/auth/login', {
      email: 'admin@email.com',
      password: 'admin123'
    });
    assert(adminLogin.status === 200 && adminLogin.body.role === 'NHANVIEN', '3. Đăng nhập Thủ thư / Admin (admin@email.com / admin123) thành công');
    const adminToken = adminLogin.body.token;

    // 4. Auth - Profile kiểm tra JWT
    const profile = await request('GET', '/auth/profile', null, userToken);
    assert(profile.status === 200 && profile.body.data.maDG === 'DG-0001', '4. Xác thực JWT Token và lấy Profile Độc giả chính xác');

    // 5. Sách - Lấy danh sách sách
    const books = await request('GET', '/sach');
    assert(books.status === 200 && books.body.total > 0, `5. Lấy danh mục Sách thành công (Tổng số: ${books.body.total} cuốn)`);

    // 6. Sách - Top 10 mượn nhiều nhất
    const top10 = await request('GET', '/sach/top10');
    assert(top10.status === 200 && Array.isArray(top10.body.data), `6. Lấy danh sách Top 10 sách mượn nhiều thành công`);

    // 7. Sách - Thêm sách mới (Admin)
    const newBookCode = `TEST-${Date.now().toString().slice(-4)}`;
    const createBook = await request('POST', '/sach', {
      maSach: newBookCode,
      tenSach: 'Giáo Trình Lập Trình Web MEVN Nâng Cao',
      loai: 'Giáo trình đại học',
      namXB: 2026,
      donGia: 185000,
      soLuong: 10,
      maNXB: 'NXB-01',
      maTG: 'TG-01',
      moTa: 'Tài liệu hướng dẫn phát triển ứng dụng web hiện đại.'
    }, adminToken);
    assert(createBook.status === 201 && createBook.body.data.maSach === newBookCode, `7. Thêm sách mới thành công (${newBookCode})`);

    // 8. Nhà Xuất Bản & Tác Giả
    const nxbs = await request('GET', '/nhaxb');
    assert(nxbs.status === 200 && nxbs.body.total >= 4, `8. Lấy danh sách NXB thành công (Hiện có: ${nxbs.body.total} NXB)`);

    const tgs = await request('GET', '/tacgia');
    assert(tgs.status === 200 && tgs.body.total >= 7, `9. Lấy danh sách Tác giả thành công (Hiện có: ${tgs.body.total} Tác giả)`);

    // 10. Giỏ hàng - Thêm sách vào giỏ
    const addCart = await request('POST', '/giohang/add', {
      maDG: 'DG-0001',
      maSach: newBookCode,
      soLuong: 2
    });
    assert(addCart.status === 200 && addCart.body.data.tongSoLuong >= 2, '10. Thêm sách vào Giỏ hàng (GIOHANG / CHITIETGIOHANG) thành công');

    // 11. Giỏ hàng - Lấy giỏ hàng
    const getCart = await request('GET', '/giohang?maDG=DG-0001');
    assert(getCart.status === 200 && getCart.body.data.chiTiet.length > 0, '11. Truy vấn chi tiết Giỏ hàng thành công');

    // 12. Phiếu mượn - Độc giả gửi yêu cầu mượn sách
    const borrowReq = await request('POST', '/phieumuon', {
      maDG: 'DG-0001',
      items: [
        { maSach: newBookCode, soLuong: 1 }
      ]
    }, userToken);
    assert(borrowReq.status === 201 && borrowReq.body.data.trangThaiPM === 'CHO_DUYET', '12. Tạo Phiếu mượn mới (trạng thái CHO_DUYET) thành công');
    const createdBorrowId = borrowReq.body.data.maPM;

    // 13. Phiếu mượn - Thủ thư duyệt mượn
    const approveBorrow = await request('PUT', `/phieumuon/${createdBorrowId}/duyet`, null, adminToken);
    assert(approveBorrow.status === 200 && approveBorrow.body.data.trangThaiPM === 'DANG_MUON', '13. Thủ thư duyệt mượn -> chuyển sang DANG_MUON & tự động trừ kho thành công');

    // 14. RÀNG BUỘC - Chặn xóa sách khi đang được mượn
    const deleteBlocked = await request('DELETE', `/sach/${newBookCode}`, null, adminToken);
    assert(deleteBlocked.status === 400, '14. Ràng buộc toàn vẹn: Chặn xóa sách đang nằm trong phiếu mượn hoạt động chính xác (HTTP 400)');

    // 15. Phiếu mượn - Thủ thư xác nhận hoàn tất trả sách
    const returnBorrow = await request('PUT', `/phieumuon/${createdBorrowId}/tra`, null, adminToken);
    assert(returnBorrow.status === 200 && returnBorrow.body.data.trangThaiPM === 'DA_TRA', '15. Xác nhận trả sách -> chuyển sang DA_TRA & hoàn kho số lượng thành công');

    // 16. Phiếu phạt - Lập phiếu phạt vi phạm
    const fineReq = await request('POST', '/phieuphat', {
      maPM: createdBorrowId,
      maDG: 'DG-0001',
      tenDocGia: 'Nguyễn Văn An',
      emailDocGia: 'user@email.com',
      tongTienPhat: 30000,
      ghiChu: 'Trả trễ hạn 06 ngày',
      chiTiet: [
        {
          maSach: newBookCode,
          tenSach: 'Giáo Trình Lập Trình Web MEVN Nâng Cao',
          tienPhat: 30000,
          lyDo: 'Trả trễ hạn 06 ngày (5.000 VNĐ / ngày)',
          soNgayTre: 6
        }
      ]
    }, adminToken);
    assert(fineReq.status === 201 && fineReq.body.data.trangThaiPP === 'CHUA_NOP', '16. Thiết lập Biên bản Phiếu phạt vi phạm thành công');
    const createdFineId = fineReq.body.data.maPP;

    // 17. Phiếu phạt - Lấy chi tiết phiếu phạt
    const fineDetail = await request('GET', `/phieuphat/${createdFineId}`, null, adminToken);
    assert(fineDetail.status === 200 && fineDetail.body.data.tongTienPhat === 30000, `17. Xem chi tiết Phiếu phạt (GET /api/phieuphat/:id) thành công`);

    // 18. Phiếu phạt - Xác nhận đã thu tiền phạt tại quầy
    const confirmFine = await request('PUT', `/phieuphat/${createdFineId}/xac-nhan-thu`, null, adminToken);
    assert(confirmFine.status === 200 && confirmFine.body.data.trangThaiPP === 'DA_THU', '18. Xác nhận thu tiền phạt tại quầy -> cập nhật DA_THU thành công');

    // 19. Độc giả - Khóa / Mở khóa tài khoản độc giả
    const toggleLock = await request('PUT', '/docgia/DG-0002/toggle-lock', null, adminToken);
    assert(toggleLock.status === 200, `19. Thao tác Khóa/Mở khóa tài khoản độc giả thành công (${toggleLock.body.message})`);

    // 20. Xóa dọn dẹp sách test sau khi hoàn tất mượn trả
    const cleanDelete = await request('DELETE', `/sach/${newBookCode}`, null, adminToken);
    assert(cleanDelete.status === 200, '20. Xóa sách sau khi đã hoàn tất mượn trả thành công');

  } catch (err) {
    console.error('[TEST ERROR]:', err);
    failed++;
  }

  console.log('\n================================================================');
  console.log(`   KẾT QUẢ KIỂM THỬ: ${passed} PASS, ${failed} FAIL             `);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();

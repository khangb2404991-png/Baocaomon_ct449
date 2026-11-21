/**
 * AUTOMATED INTEGRATION TEST: PUBLISHER - BOOK LINKING (CDM NHAXB 1 --- N SACH)
 * File: test_nxb_book_link.js
 * 
 * Tests the entire lifecycle:
 * 1. Admin login & JWT token acquisition
 * 2. Create new publisher (NXB)
 * 3. Verify publisher is queryable in GET /api/nhaxb
 * 4. Create new book linked to this publisher via maNXB
 * 5. Verify book is retrieved with matching maNXB
 * 6. Verify linked book count (soDauSach = 1)
 * 7. Attempt to delete publisher -> Expect HTTP 400 rejection (CDM delete constraint)
 * 8. Delete the book
 * 9. Delete the publisher -> Expect HTTP 200 success
 * 10. Verify cleanup
 */

const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = { raw: await response.text() };
  }

  return { status: response.status, ok: response.ok, data };
}

async function runTest() {
  console.log('========================================================================');
  console.log('  TESTING NHA XUAT BAN <-> SACH LINKAGE & CDM DELETE CONSTRAINT');
  console.log('========================================================================\n');

  let token = null;
  let testPublisher = null;
  let testBook = null;

  try {
    // 1. Admin Login
    console.log('[STEP 1] Logging in as Admin (admin@email.com)...');
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@email.com',
        password: 'admin123'
      }
    });

    if (!loginRes.ok || !loginRes.data.token) {
      throw new Error(`Admin login failed: ${JSON.stringify(loginRes.data)}`);
    }
    token = loginRes.data.token;
    console.log('  -> PASS: Logged in successfully. Token acquired.\n');

    const authHeaders = { Authorization: `Bearer ${token}` };

    // 2. Create new Publisher
    const testNxbCode = 'NXB-TEST-' + Math.floor(100 + Math.random() * 900);
    const testNxbName = 'NXB Công Nghệ Mới - ' + Date.now();
    console.log(`[STEP 2] Creating new publisher: "${testNxbName}" (${testNxbCode})...`);
    
    const createNxbRes = await request('/nhaxb', {
      method: 'POST',
      headers: authHeaders,
      body: {
        maNXB: testNxbCode,
        tenNXB: testNxbName,
        diaChi: '123 Đường Công Nghệ, Quận Cầu Giấy, Hà Nội'
      }
    });

    if (createNxbRes.status !== 201) {
      throw new Error(`Failed to create publisher: ${JSON.stringify(createNxbRes.data)}`);
    }
    testPublisher = createNxbRes.data.data;
    console.log(`  -> PASS: Publisher created with maNXB: ${testPublisher.maNXB}, _id: ${testPublisher._id}\n`);

    // 3. Verify publisher in GET /api/nhaxb
    console.log('[STEP 3] Verifying publisher exists in GET /api/nhaxb...');
    const listNxbRes = await request('/nhaxb');
    const foundNxb = (listNxbRes.data.data || []).find(p => p.maNXB === testPublisher.maNXB);
    if (!foundNxb) {
      throw new Error('Newly created publisher not found in /api/nhaxb listing!');
    }
    console.log(`  -> PASS: Publisher "${foundNxb.tenNXB}" is listed.\n`);

    // 4. Create new book linked to this publisher
    const testBookCode = 'CS-TEST-' + Math.floor(1000 + Math.random() * 9000);
    const testBookTitle = 'Kiến Trúc Microservices & Docker - ' + Date.now();
    console.log(`[STEP 4] Creating new book "${testBookTitle}" (${testBookCode}) linked to maNXB: ${testPublisher.maNXB}...`);

    const createBookRes = await request('/sach', {
      method: 'POST',
      headers: authHeaders,
      body: {
        maSach: testBookCode,
        tenSach: testBookTitle,
        loai: 'Khoa Học Máy Tính',
        namXB: 2026,
        donGia: 165000,
        soLuong: 10,
        maNXB: testPublisher.maNXB,
        maTG: 'TG-01',
        moTa: 'Tài liệu thử nghiệm liên kết Nhà xuất bản và Sách.'
      }
    });

    if (createBookRes.status !== 201) {
      throw new Error(`Failed to create book: ${JSON.stringify(createBookRes.data)}`);
    }
    testBook = createBookRes.data.data;
    console.log(`  -> PASS: Book created. maSach: ${testBook.maSach}, maNXB: ${testBook.maNXB}\n`);

    // 5. Query book list and verify linkage
    console.log('[STEP 5] Querying books (GET /api/sach?all=true) to verify linkage...');
    const getBooksRes = await request('/sach?all=true');
    const foundBook = (getBooksRes.data.data || []).find(b => b.maSach === testBook.maSach);
    if (!foundBook) {
      throw new Error('Test book not found in /api/sach?all=true!');
    }
    const linkedNxbCode = (foundBook.maNXB && typeof foundBook.maNXB === 'object') ? foundBook.maNXB.maNXB : foundBook.maNXB;
    if (linkedNxbCode !== testPublisher.maNXB) {
      throw new Error(`Book maNXB mismatch! Expected ${testPublisher.maNXB}, got ${linkedNxbCode}`);
    }
    console.log(`  -> PASS: Book correctly linked to publisher code: ${linkedNxbCode}\n`);

    // 6. Verify linked count
    console.log('[STEP 6] Calculating publisher linked books count (soDauSach)...');
    const allBooks = getBooksRes.data.data || [];
    const linkedCount = allBooks.filter(b => {
      const bCode = (b.maNXB && typeof b.maNXB === 'object') ? b.maNXB.maNXB : b.maNXB;
      return bCode === testPublisher.maNXB;
    }).length;

    if (linkedCount !== 1) {
      throw new Error(`Expected linked count to be 1, but got ${linkedCount}`);
    }
    console.log(`  -> PASS: Publisher linked book count is exactly 1 (State: ĐANG LIÊN KẾT).\n`);

    // 7. Verify CDM Foreign Key Delete Constraint: Attempt to delete publisher
    console.log(`[STEP 7] Testing CDM constraint: attempting to DELETE /api/nhaxb/${testPublisher.maNXB}...`);
    const deleteAttemptRes = await request(`/nhaxb/${testPublisher.maNXB}`, {
      method: 'DELETE',
      headers: authHeaders
    });

    if (deleteAttemptRes.status === 400 && deleteAttemptRes.data.success === false) {
      console.log(`  -> PASS: Server correctly rejected deletion with HTTP 400: "${deleteAttemptRes.data.message}"\n`);
    } else {
      throw new Error(`CDM constraint FAILED! Expected HTTP 400 rejection, but got HTTP ${deleteAttemptRes.status}: ${JSON.stringify(deleteAttemptRes.data)}`);
    }

    // 8. Delete the book
    console.log(`[STEP 8] Deleting test book (DELETE /api/sach/${testBook.maSach})...`);
    const deleteBookRes = await request(`/sach/${testBook.maSach}`, {
      method: 'DELETE',
      headers: authHeaders
    });

    if (!deleteBookRes.ok) {
      throw new Error(`Failed to delete test book: ${JSON.stringify(deleteBookRes.data)}`);
    }
    console.log(`  -> PASS: Test book deleted successfully.\n`);

    // 9. Delete publisher now that no books are linked
    console.log(`[STEP 9] Re-attempting to delete publisher (DELETE /api/nhaxb/${testPublisher.maNXB})...`);
    const deleteNxbRes = await request(`/nhaxb/${testPublisher.maNXB}`, {
      method: 'DELETE',
      headers: authHeaders
    });

    if (deleteNxbRes.status === 200 && deleteNxbRes.data.success === true) {
      console.log(`  -> PASS: Publisher deleted successfully with HTTP 200: "${deleteNxbRes.data.message}"\n`);
    } else {
      throw new Error(`Failed to delete publisher after books were unlinked: ${JSON.stringify(deleteNxbRes.data)}`);
    }

    // 10. Verify cleanup
    console.log('[STEP 10] Verifying publisher no longer exists in GET /api/nhaxb...');
    const finalListRes = await request('/nhaxb');
    const stillExists = (finalListRes.data.data || []).some(p => p.maNXB === testPublisher.maNXB);
    if (stillExists) {
      throw new Error('Deleted publisher still present in /api/nhaxb!');
    }
    console.log('  -> PASS: Cleanup verified. Publisher is completely removed.\n');

    console.log('========================================================================');
    console.log('  ALL 10 VERIFICATION STEPS PASSED (100% SUCCESSFUL)');
    console.log('  Publisher <-> Book CDM Foreign Key Linkage & Constraint fully validated!');
    console.log('========================================================================');

  } catch (err) {
    console.error('\n[TEST FAILED]:', err.message);
    process.exit(1);
  }
}

runTest();

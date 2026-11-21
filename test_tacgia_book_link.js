/**
 * AUTOMATED INTEGRATION TEST: AUTHOR - BOOK LINKING (CDM TACGIA 1 --- N SACH)
 * File: test_tacgia_book_link.js
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
  console.log('  TESTING TAC GIA <-> SACH LINKAGE & CDM DELETE CONSTRAINT');
  console.log('========================================================================\n');

  let token = null;
  let testAuthor = null;
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

    // 2. Create new Author
    const testTgCode = 'TG-TEST-' + Math.floor(100 + Math.random() * 900);
    const testTgName = 'Tác Giả Kiểm Thử - ' + Date.now();
    console.log(`[STEP 2] Creating new author: "${testTgName}" (${testTgCode})...`);
    
    const createTgRes = await request('/tacgia', {
      method: 'POST',
      headers: authHeaders,
      body: {
        maTG: testTgCode,
        tenTG: testTgName
      }
    });

    if (createTgRes.status !== 201) {
      throw new Error(`Failed to create author: ${JSON.stringify(createTgRes.data)}`);
    }
    testAuthor = createTgRes.data.data;
    console.log(`  -> PASS: Author created with maTG: ${testAuthor.maTG}, _id: ${testAuthor._id}\n`);

    // 3. Verify author in GET /api/tacgia
    console.log('[STEP 3] Verifying author exists in GET /api/tacgia...');
    const listTgRes = await request('/tacgia');
    const foundTg = (listTgRes.data.data || []).find(a => a.maTG === testAuthor.maTG);
    if (!foundTg) {
      throw new Error('Newly created author not found in /api/tacgia listing!');
    }
    console.log(`  -> PASS: Author "${foundTg.tenTG}" is listed.\n`);

    // 4. Update author name
    const updatedTgName = testTgName + ' (Đã cập nhật)';
    console.log(`[STEP 4] Updating author name to "${updatedTgName}"...`);
    const updateTgRes = await request(`/tacgia/${testAuthor.maTG}`, {
      method: 'PUT',
      headers: authHeaders,
      body: { tenTG: updatedTgName }
    });
    if (updateTgRes.status !== 200) {
      throw new Error(`Failed to update author: ${JSON.stringify(updateTgRes.data)}`);
    }
    console.log(`  -> PASS: Author name updated.\n`);

    // 5. Create new book linked to this author
    const testBookCode = 'CS-TG-' + Math.floor(1000 + Math.random() * 9000);
    const testBookTitle = 'Sách Thử Nghiệm Tác Giả - ' + Date.now();
    console.log(`[STEP 5] Creating new book "${testBookTitle}" (${testBookCode}) linked to maTG: ${testAuthor.maTG}...`);

    const createBookRes = await request('/sach', {
      method: 'POST',
      headers: authHeaders,
      body: {
        maSach: testBookCode,
        tenSach: testBookTitle,
        loai: 'Khoa Học Máy Tính',
        namXB: 2026,
        donGia: 180000,
        soLuong: 5,
        maNXB: 'NXB-01',
        maTG: testAuthor.maTG,
        moTa: 'Tài liệu thử nghiệm liên kết Tác giả và Sách.'
      }
    });

    if (createBookRes.status !== 201) {
      throw new Error(`Failed to create book: ${JSON.stringify(createBookRes.data)}`);
    }
    testBook = createBookRes.data.data;
    console.log(`  -> PASS: Book created. maSach: ${testBook.maSach}, maTG: ${testBook.maTG}\n`);

    // 6. Query books and verify linkage
    console.log('[STEP 6] Querying books (GET /api/sach?all=true) to verify linkage...');
    const getBooksRes = await request('/sach?all=true');
    const foundBook = (getBooksRes.data.data || []).find(b => b.maSach === testBook.maSach);
    if (!foundBook) {
      throw new Error('Test book not found in /api/sach?all=true!');
    }
    const linkedTgCode = (foundBook.maTG && typeof foundBook.maTG === 'object') ? foundBook.maTG.maTG : foundBook.maTG;
    if (linkedTgCode !== testAuthor.maTG) {
      throw new Error(`Book maTG mismatch! Expected ${testAuthor.maTG}, got ${linkedTgCode}`);
    }
    console.log(`  -> PASS: Book correctly linked to author code: ${linkedTgCode}\n`);

    // 7. Verify CDM Foreign Key Delete Constraint: Attempt to delete author
    console.log(`[STEP 7] Testing CDM constraint: attempting to DELETE /api/tacgia/${testAuthor.maTG}...`);
    const deleteAttemptRes = await request(`/tacgia/${testAuthor.maTG}`, {
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

    // 9. Delete author now that no books are linked
    console.log(`[STEP 9] Re-attempting to delete author (DELETE /api/tacgia/${testAuthor.maTG})...`);
    const deleteTgRes = await request(`/tacgia/${testAuthor.maTG}`, {
      method: 'DELETE',
      headers: authHeaders
    });

    if (deleteTgRes.status === 200 && deleteTgRes.data.success === true) {
      console.log(`  -> PASS: Author deleted successfully with HTTP 200: "${deleteTgRes.data.message}"\n`);
    } else {
      throw new Error(`Failed to delete author after books were unlinked: ${JSON.stringify(deleteTgRes.data)}`);
    }

    // 10. Verify cleanup
    console.log('[STEP 10] Verifying author no longer exists in GET /api/tacgia...');
    const finalListRes = await request('/tacgia');
    const stillExists = (finalListRes.data.data || []).some(a => a.maTG === testAuthor.maTG);
    if (stillExists) {
      throw new Error('Deleted author still present in /api/tacgia!');
    }
    console.log('  -> PASS: Cleanup verified. Author is completely removed.\n');

    console.log('========================================================================');
    console.log('  ALL 10 VERIFICATION STEPS PASSED (100% SUCCESSFUL)');
    console.log('  Author <-> Book CDM Foreign Key Linkage & Constraint fully validated!');
    console.log('========================================================================');

  } catch (err) {
    console.error('\n[TEST FAILED]:', err.message);
    process.exit(1);
  }
}

runTest();

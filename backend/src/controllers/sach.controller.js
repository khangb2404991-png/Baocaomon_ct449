const Sach = require('../models/sach.model');
const PhieuMuon = require('../models/phieuMuon.model');

// 1. Lấy danh sách sách (hỗ trợ phân trang, tìm kiếm, lọc thể loại, NXB, Tác giả)
const getAll = async (req, res) => {
  try {
    const { search, loai, maNXB, maTG, page = 1, limit = 12, all } = req.query;
    const query = {};

    if (search && search.trim()) {
      query.tenSach = { $regex: search.trim(), $options: 'i' };
    }
    if (loai && loai !== 'ALL') {
      query.loai = loai;
    }
    if (maNXB) {
      query.maNXB = maNXB;
    }
    if (maTG) {
      query.maTG = maTG;
    }

    // Nếu truyền all=true thì trả về tất cả không phân trang
    if (all === 'true') {
      const books = await Sach.find(query).sort({ createdAt: -1 });
      return res.json({
        success: true,
        total: books.length,
        data: books
      });
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Sach.countDocuments(query);
    const books = await Sach.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.json({
      success: true,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      data: books
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Lấy top 10 sách mượn nhiều nhất
const getTop10 = async (req, res) => {
  try {
    const topBooks = await Sach.find({ trangThaiS: true })
      .sort({ luotMuon: -1 })
      .limit(10);
    return res.json({
      success: true,
      data: topBooks
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Lấy chi tiết sách theo maSach hoặc _id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    let book = await Sach.findOne({ maSach: id });
    if (!book && id.match(/^[0-9a-fA-F]{24}$/)) {
      book = await Sach.findById(id);
    }

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy cuốn sách với mã: ${id}`
      });
    }

    return res.json({
      success: true,
      data: book
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Thêm sách mới (Admin)
const create = async (req, res) => {
  try {
    const { tenSach, donGia, soLuong, maNXB, maTG, loai, namXB, hinhAnh, moTa } = req.body;

    if (!tenSach || donGia === undefined || soLuong === undefined || !maNXB || !maTG) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ: Tên sách (tenSach), Đơn giá (donGia), Số lượng (soLuong), Nhà xuất bản (maNXB) và Tác giả (maTG)!'
      });
    }

    const count = await Sach.countDocuments();
    const maSach = req.body.maSach || `CS-${String(count + 1).padStart(4, '0')}`;

    const newBook = new Sach({
      maSach,
      tenSach,
      loai: loai || 'Giáo trình',
      namXB: namXB || new Date().getFullYear(),
      donGia: Number(donGia),
      soLuong: Number(soLuong),
      trangThaiS: req.body.trangThaiS !== undefined ? req.body.trangThaiS : true,
      maNXB,
      maTG,
      hinhAnh: hinhAnh || '',
      moTa: moTa || '',
      luotMuon: req.body.luotMuon || 0
    });

    await newBook.save();

    return res.status(201).json({
      success: true,
      message: 'Thêm sách mới vào thư viện thành công!',
      data: newBook
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Cập nhật sách
const update = async (req, res) => {
  try {
    const { id } = req.params;
    let book = await Sach.findOne({ maSach: id });
    if (!book && id.match(/^[0-9a-fA-F]{24}$/)) {
      book = await Sach.findById(id);
    }

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy sách với mã: ${id}`
      });
    }

    Object.assign(book, req.body);
    await book.save();

    return res.json({
      success: true,
      message: 'Cập nhật thông tin sách thành công!',
      data: book
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Xóa sách (Có ràng buộc kiểm tra sách đang mượn)
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    let book = await Sach.findOne({ maSach: id });
    if (!book && id.match(/^[0-9a-fA-F]{24}$/)) {
      book = await Sach.findById(id);
    }

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy sách với mã: ${id}`
      });
    }

    // RÀNG BUỘC: Kiểm tra sách có đang nằm trong phiếu mượn đang chờ duyệt hoặc đang mượn không
    const activeBorrow = await PhieuMuon.findOne({
      'chiTiet.maSach': book.maSach,
      trangThaiPM: { $in: ['CHO_DUYET', 'DANG_MUON'] }
    });

    if (activeBorrow) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa sách "${book.tenSach}" vì đang có độc giả đăng ký mượn hoặc đang mượn!`
      });
    }

    await Sach.deleteOne({ _id: book._id });

    return res.json({
      success: true,
      message: `Đã xóa sách "${book.tenSach}" thành công!`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAll,
  getTop10,
  getById,
  create,
  update,
  deleteBook
};

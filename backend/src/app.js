const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Middleware cấu hình CORS cho phép Frontend Vue 3 kết nối
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Chào mừng đến với Hệ Thống API Quản Lý Mượn Trả Sách (MEVN Stack)!',
    apiDocs: '/api/health',
    version: '1.0.0'
  });
});

// Gắn tất cả các routes vào tiền tố /api
app.use('/api', routes);

// Middleware xử lý lỗi 404 và lỗi toàn cục
app.use(notFound);
app.use(errorHandler);

module.exports = app;

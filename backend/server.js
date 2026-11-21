require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db.config');
const seedData = require('./src/utils/seeder');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Kết nối cơ sở dữ liệu MongoDB
    await connectDB();

    // 2. Tự động kiểm tra và nạp dữ liệu ban đầu nếu database trống
    await seedData();

    // 3. Khởi động lắng nghe kết nối HTTP
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`[BOOK LENDING BACKEND SERVER RUNNING]`);
      console.log(`>> Host: http://localhost:${PORT}`);
      console.log(`>> Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`>> Health check: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error(`[Server Startup Error]:`, error);
    process.exit(1);
  }
};

startServer();

const { spawn } = require('child_process');
const path = require('path');

console.log('[Runner]: Đang khởi động Backend Server (server.js)...');
const server = spawn('node', ['server.js'], { 
  cwd: __dirname, 
  stdio: 'inherit' 
});

server.on('error', (err) => {
  console.error('[Server Spawn Error]:', err);
});

// Chờ 4 giây để MongoDB kết nối và Seeder hoàn thành
setTimeout(() => {
  console.log('[Runner]: Bắt đầu chạy test suite (test_api.js)...');
  const tester = spawn('node', ['test_api.js'], { 
    cwd: __dirname, 
    stdio: 'inherit' 
  });

  tester.on('exit', (code) => {
    console.log(`[Runner]: Test hoàn tất với mã thoát: ${code}`);
    server.kill();
    process.exit(code);
  });
}, 4000);

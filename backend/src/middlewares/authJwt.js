const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

const verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'Không tìm thấy Token xác thực trong tiêu đề yêu cầu (Authorization Header)!'
    });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn phiên đăng nhập!'
      });
    }
    req.user = decoded;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'NHANVIEN') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Yêu cầu quyền Quản trị viên / Thủ thư (NHANVIEN) để thực hiện thao tác này!'
  });
};

const isDocGia = (req, res, next) => {
  if (req.user && req.user.role === 'DOCGIA') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Yêu cầu quyền Độc giả (DOCGIA) để thực hiện thao tác này!'
  });
};

module.exports = {
  verifyToken,
  isAdmin,
  isDocGia
};

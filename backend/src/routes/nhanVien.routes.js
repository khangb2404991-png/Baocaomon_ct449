const express = require('express');
const router = express.Router();
const nhanVienController = require('../controllers/nhanVien.controller');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');

router.get('/', verifyToken, isAdmin, nhanVienController.getAll);
router.post('/', verifyToken, isAdmin, nhanVienController.create);
router.put('/:id', verifyToken, isAdmin, nhanVienController.update);
router.delete('/:id', verifyToken, isAdmin, nhanVienController.deleteNV);

module.exports = router;

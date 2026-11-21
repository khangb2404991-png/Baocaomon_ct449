const express = require('express');
const router = express.Router();
const docGiaController = require('../controllers/docGia.controller');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');

router.get('/', verifyToken, isAdmin, docGiaController.getAll);
router.put('/:id/toggle-lock', verifyToken, isAdmin, docGiaController.toggleLock);
router.put('/:id', verifyToken, docGiaController.update);

module.exports = router;

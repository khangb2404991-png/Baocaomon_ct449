const express = require('express');
const router = express.Router();
const tacGiaController = require('../controllers/tacGia.controller');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');

router.get('/', tacGiaController.getAll);
router.post('/', verifyToken, isAdmin, tacGiaController.create);
router.put('/:id', verifyToken, isAdmin, tacGiaController.update);
router.delete('/:id', verifyToken, isAdmin, tacGiaController.deleteTG);

module.exports = router;

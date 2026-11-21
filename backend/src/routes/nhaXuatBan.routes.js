const express = require('express');
const router = express.Router();
const nhaXuatBanController = require('../controllers/nhaXuatBan.controller');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');

router.get('/', nhaXuatBanController.getAll);
router.post('/', verifyToken, isAdmin, nhaXuatBanController.create);
router.put('/:id', verifyToken, isAdmin, nhaXuatBanController.update);
router.delete('/:id', verifyToken, isAdmin, nhaXuatBanController.deleteNXB);

module.exports = router;

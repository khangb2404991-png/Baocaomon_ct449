const express = require('express');
const router = express.Router();
const phieuPhatController = require('../controllers/phieuPhat.controller');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');

router.get('/', verifyToken, isAdmin, phieuPhatController.getAll);
router.get('/:id', verifyToken, phieuPhatController.getById);
router.post('/', verifyToken, isAdmin, phieuPhatController.create);
router.put('/:id/xac-nhan-thu', verifyToken, isAdmin, phieuPhatController.confirmPayment);

module.exports = router;

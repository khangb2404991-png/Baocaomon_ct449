const express = require('express');
const router = express.Router();
const phieuMuonController = require('../controllers/phieuMuon.controller');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');

router.get('/', verifyToken, isAdmin, phieuMuonController.getAll);
router.get('/my', verifyToken, phieuMuonController.getMyBorrows);
router.post('/', verifyToken, phieuMuonController.create);

router.put('/:id/duyet', verifyToken, isAdmin, phieuMuonController.approve);
router.put('/:id/tuchoi', verifyToken, isAdmin, phieuMuonController.reject);
router.put('/:id/tra', verifyToken, isAdmin, phieuMuonController.returnBook);
router.put('/:id/huy', verifyToken, phieuMuonController.cancel);

module.exports = router;

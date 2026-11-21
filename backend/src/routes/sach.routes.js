const express = require('express');
const router = express.Router();
const sachController = require('../controllers/sach.controller');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');

router.get('/', sachController.getAll);
router.get('/top10', sachController.getTop10);
router.get('/:id', sachController.getById);

router.post('/', verifyToken, isAdmin, sachController.create);
router.put('/:id', verifyToken, isAdmin, sachController.update);
router.delete('/:id', verifyToken, isAdmin, sachController.deleteBook);

module.exports = router;

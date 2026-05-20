const express = require('express');
const {  getDailyStockStatus,  getDailyStockOut,  getLowStockAlert} = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/daily-stock-status', authMiddleware, getDailyStockStatus);
router.get('/daily-stock-out', authMiddleware, getDailyStockOut);
router.get('/low-stock-alert', authMiddleware, getLowStockAlert);


module.exports = router;
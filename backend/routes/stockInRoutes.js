const express = require('express');
const { addStockIn, getStockInHistory } = require('../controllers/stockInController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin', 'manager'), addStockIn);
router.get('/', authMiddleware, roleMiddleware('admin', 'manager'), getStockInHistory);


module.exports = router;
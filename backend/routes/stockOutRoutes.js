const express = require('express');
const {  addStockOut,  getStockOutHistory,  updateStockOut,  deleteStockOut} = require('../controllers/stockOutController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin', 'manager'), addStockOut);
router.get('/', authMiddleware, getStockOutHistory);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateStockOut);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteStockOut);


module.exports = router;
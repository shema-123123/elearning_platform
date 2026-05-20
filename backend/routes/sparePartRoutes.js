const express = require('express');
const {  createSparePart,  getSpareParts,  getSparePartById,  updateSparePart,  deleteSparePart} = require('../controllers/sparePartController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin', 'manager'), createSparePart);
router.get('/', authMiddleware, getSpareParts);
router.get('/:id', authMiddleware, getSparePartById);
router.put('/:id', authMiddleware, roleMiddleware('admin', 'manager'), updateSparePart);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteSparePart);


module.exports = router;
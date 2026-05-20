const express = require('express');
const { getUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('admin'), getUsers);
router.put('/:id/role', authMiddleware, roleMiddleware('admin'), updateUserRole);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteUser);


module.exports = router;
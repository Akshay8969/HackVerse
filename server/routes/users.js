const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllUsers, getUserById, updateUser, deleteUser, toggleBlockUser, getJudges,
} = require('../controllers/userController');

router.use(protect);

router.get('/judges', authorize('organizer', 'admin'), getJudges);
router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', authorize('admin'), getUserById);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);
router.put('/:id/block', authorize('admin'), toggleBlockUser);

module.exports = router;

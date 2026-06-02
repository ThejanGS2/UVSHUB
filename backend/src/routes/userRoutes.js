const express = require('express');
const {
  getUsers,
  getUser,
  updateProfile,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorise } = require('../middleware/auth');

const router = express.Router();

// Self-service profile update
router.put('/profile', protect, updateProfile);

// Admin-only user management
router
  .route('/')
  .get(protect, authorise('admin'), getUsers);

router
  .route('/:id')
  .get(protect, getUser)
  .delete(protect, authorise('admin'), deleteUser);

module.exports = router;

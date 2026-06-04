const express = require('express');
const { getPayments, approvePayment, createPayment } = require('../controllers/paymentController');
const { protect, authorise } = require('../middleware/auth');

const router = express.Router();

// All payment routes require authentication
router.use(protect);

// Student submit payment
router.post('/', createPayment);

// Admin-only actions
router.get('/', authorise('admin'), getPayments);
router.post('/:id/approve', authorise('admin'), approvePayment);

module.exports = router;

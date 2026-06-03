const express = require('express');
const { getPayments, approvePayment } = require('../controllers/paymentController');
const { protect, authorise } = require('../middleware/auth');

const router = express.Router();

// Only admin users can manage payments
router.use(protect);
router.use(authorise('admin'));

router.get('/', getPayments);
router.post('/:id/approve', approvePayment);

module.exports = router;

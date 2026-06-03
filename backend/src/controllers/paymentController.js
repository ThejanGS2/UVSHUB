const { prisma } = require('../config/db');

/**
 * @desc    Get all payments
 * @route   GET /api/v1/payments
 * @access  Private (Admin)
 */
const getPayments = async (req, res) => {
  const payments = await prisma.payments.findMany();
  
  // Convert BigInt for JSON serialization
  const serializedPayments = payments.map(p => ({
    ...p,
    id: p.id.toString(),
    Student_ID: p.Student_ID.toString(),
    Amount: p.Amount.toString(),
  }));

  res.status(200).json({ success: true, count: payments.length, data: serializedPayments });
};

/**
 * @desc    Approve a payment and enroll the student
 * @route   POST /api/v1/payments/:id/approve
 * @access  Private (Admin)
 */
const approvePayment = async (req, res) => {
  let paymentId;
  try {
    paymentId = BigInt(req.params.id);
  } catch (err) {
    const error = new Error('Invalid Payment ID format');
    error.statusCode = 400;
    throw error;
  }

  const payment = await prisma.payments.findUnique({
    where: { id: paymentId }
  });

  if (!payment) {
    const error = new Error('Payment not found');
    error.statusCode = 404;
    throw error;
  }

  // Find the student name to write in Enrollments
  const student = await prisma.student.findUnique({
    where: { Student_ID: payment.Student_ID }
  });

  if (!student) {
    const error = new Error('Student associated with this payment not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if enrollment already exists
  const existingEnrollment = await prisma.enrollments.findFirst({
    where: { Student_ID: payment.Student_ID }
  });

  if (existingEnrollment) {
    await prisma.payments.delete({ where: { id: paymentId } });
    return res.status(200).json({
      success: true,
      message: 'Payment approved, but student was already enrolled.'
    });
  }

  // Create enrollment
  const enrollment = await prisma.enrollments.create({
    data: {
      Student_ID: payment.Student_ID,
      Studnet_Name: student.Name,
      Subject_Name: payment.Subject
    }
  });

  // Delete the pending payment
  await prisma.payments.delete({
    where: { id: paymentId }
  });

  res.status(200).json({
    success: true,
    message: 'Payment approved and student successfully enrolled',
    data: {
      id: enrollment.id.toString(),
      Student_ID: enrollment.Student_ID.toString(),
      Studnet_Name: enrollment.Studnet_Name,
      Subject_Name: enrollment.Subject_Name
    }
  });
};

module.exports = { getPayments, approvePayment };

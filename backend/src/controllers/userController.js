const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
const getUsers = async (req, res) => {
  const users = await prisma.student.findMany();
  
  // Convert BigInt for JSON
  const serializedUsers = users.map(user => ({
    ...user,
    Student_ID: user.Student_ID.toString(),
    NIC: user.NIC ? user.NIC.toString() : null,
  }));

  res.status(200).json({ success: true, count: users.length, data: serializedUsers });
};

/**
 * @desc    Get user profile
 * @route   GET /api/v1/users/:id
 * @access  Private
 */
const getUser = async (req, res) => {
  const user = await prisma.student.findUnique({
    where: { id: req.params.id }
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Fetch enrolled courses manually since they just share Student_ID
  const enrolledCourses = await prisma.enrollments.findMany({
    where: { Student_ID: user.Student_ID }
  });

  // Convert BigInt for JSON
  const serializedUser = {
    ...user,
    Student_ID: user.Student_ID.toString(),
    NIC: user.NIC ? user.NIC.toString() : null,
    enrolledCourses: enrolledCourses.map(course => ({
      ...course,
      id: course.id.toString(),
      Student_ID: course.Student_ID ? course.Student_ID.toString() : null
    }))
  };

  res.status(200).json({ success: true, data: serializedUser });
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  const fieldsToUpdate = {};
  if (req.body.name) fieldsToUpdate.Name = req.body.name;
  if (req.body.whatsappNumber) fieldsToUpdate.Watsapp_Number = req.body.whatsappNumber;
  if (req.body.address) fieldsToUpdate.Address = req.body.address;
  if (req.body.guardianName) fieldsToUpdate.Gurdian_s_Name = req.body.guardianName;
  if (req.body.guardianNumber) fieldsToUpdate.Gurdians_Number = req.body.guardianNumber;

  const user = await prisma.student.update({
    where: { id: req.user.id },
    data: fieldsToUpdate,
  });

  // Convert BigInt for JSON
  const serializedUser = {
    ...user,
    Student_ID: user.Student_ID.toString(),
    NIC: user.NIC ? user.NIC.toString() : null,
  };

  res.status(200).json({ success: true, data: serializedUser });
};

/**
 * @desc    Delete user
 * @route   DELETE /api/v1/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
  // Allow admins to delete any user, but students can only delete themselves
  if (req.user.Role !== 'admin' && req.user.id !== req.params.id) {
    const error = new Error('Not authorised to delete this account');
    error.statusCode = 403;
    throw error;
  }

  try {
    await prisma.student.delete({
      where: { id: req.params.id }
    });
  } catch (err) {
    if (err.code === 'P2025') {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    throw err;
  }

  res.status(200).json({ success: true, data: {} });
};

module.exports = { getUsers, getUser, updateProfile, deleteUser };

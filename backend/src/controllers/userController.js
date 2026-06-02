const User = require('../models/User');

/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
const getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({ success: true, count: users.length, data: users });
};

/**
 * @desc    Get user profile
 * @route   GET /api/v1/users/:id
 * @access  Private
 */
const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).populate('enrolledCourses', 'title thumbnail');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({ success: true, data: user });
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  const fieldsToUpdate = { name: req.body.name, bio: req.body.bio, avatar: req.body.avatar };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
};

/**
 * @desc    Delete user
 * @route   DELETE /api/v1/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  await user.deleteOne();
  res.status(200).json({ success: true, data: {} });
};

module.exports = { getUsers, getUser, updateProfile, deleteUser };

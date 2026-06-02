const Course = require('../models/Course');

/**
 * @desc    Get all published courses
 * @route   GET /api/v1/courses
 * @access  Public
 */
const getCourses = async (req, res) => {
  const { category, level, search } = req.query;
  const filter = { isPublished: true };

  if (category) filter.category = category;
  if (level) filter.level = level;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const courses = await Course.find(filter)
    .populate('instructor', 'name avatar')
    .select('-lessons');

  res.status(200).json({ success: true, count: courses.length, data: courses });
};

/**
 * @desc    Get single course by ID
 * @route   GET /api/v1/courses/:id
 * @access  Public
 */
const getCourse = async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    'instructor',
    'name avatar bio'
  );

  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({ success: true, data: course });
};

/**
 * @desc    Create a new course
 * @route   POST /api/v1/courses
 * @access  Private (instructor, admin)
 */
const createCourse = async (req, res) => {
  req.body.instructor = req.user.id;
  const course = await Course.create(req.body);
  res.status(201).json({ success: true, data: course });
};

/**
 * @desc    Update a course
 * @route   PUT /api/v1/courses/:id
 * @access  Private (instructor, admin)
 */
const updateCourse = async (req, res) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }

  // Ensure only the owning instructor or admin can update
  if (
    course.instructor.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    const error = new Error('Not authorised to update this course');
    error.statusCode = 403;
    throw error;
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
};

/**
 * @desc    Delete a course
 * @route   DELETE /api/v1/courses/:id
 * @access  Private (instructor, admin)
 */
const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }

  if (
    course.instructor.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    const error = new Error('Not authorised to delete this course');
    error.statusCode = 403;
    throw error;
  }

  await course.deleteOne();
  res.status(200).json({ success: true, data: {} });
};

module.exports = { getCourses, getCourse, createCourse, updateCourse, deleteCourse };

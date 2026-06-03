const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @desc    Get all published courses (now mapping to Subjects)
 * @route   GET /api/v1/courses
 * @access  Public
 */
const getCourses = async (req, res) => {
  const { category, level, search } = req.query;
  const filter = {};

  // Map Mongoose filters to Prisma Subject schema
  if (category) filter.Medium = category;
  if (level) filter.Grade = parseFloat(level);
  if (search) filter.Name = { contains: search, mode: 'insensitive' };

  const courses = await prisma.subjects.findMany({
    where: filter
  });

  // Manually populate instructors since we don't have direct Prisma relations setup
  const instructorIds = courses.map(c => c.Instructor).filter(Boolean);
  let instructors = [];
  if (instructorIds.length > 0) {
    instructors = await prisma.student.findMany({
      where: { id: { in: instructorIds } },
      select: { id: true, Name: true }
    });
  }

  const serializedCourses = courses.map(course => {
    const instructorInfo = instructors.find(i => i.id === course.Instructor);
    return {
      ...course,
      id: course.id.toString(),
      Grade: parseFloat(course.Grade),
      Price: parseFloat(course.Price),
      instructor: instructorInfo || { id: course.Instructor, name: 'Unknown' }
    };
  });

  res.status(200).json({ success: true, count: serializedCourses.length, data: serializedCourses });
};

/**
 * @desc    Get single course by ID
 * @route   GET /api/v1/courses/:id
 * @access  Public
 */
const getCourse = async (req, res) => {
  let courseId;
  try {
    courseId = BigInt(req.params.id);
  } catch (err) {
    const error = new Error('Invalid Course ID format');
    error.statusCode = 400;
    throw error;
  }

  const course = await prisma.subjects.findUnique({
    where: { id: courseId }
  });

  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }

  // Manually populate instructor
  const instructor = await prisma.student.findUnique({
    where: { id: course.Instructor },
    select: { id: true, Name: true }
  });

  const serializedCourse = {
    ...course,
    id: course.id.toString(),
    Grade: parseFloat(course.Grade),
    Price: parseFloat(course.Price),
    instructor: instructor || { id: course.Instructor, name: 'Unknown' }
  };

  res.status(200).json({ success: true, data: serializedCourse });
};

/**
 * @desc    Create a new course
 * @route   POST /api/v1/courses
 * @access  Private (instructor, admin)
 */
const createCourse = async (req, res) => {
  // Support both old API payloads and new mapped schema
  const { title, name, level, grade, category, medium, price } = req.body;
  
  const course = await prisma.subjects.create({
    data: {
      Name: name || title, 
      Grade: parseFloat(grade || level || 0),
      Medium: medium || category || 'Unknown',
      Price: parseFloat(price || 0),
      Instructor: req.user.id
    }
  });

  const serializedCourse = {
    ...course,
    id: course.id.toString(),
    Grade: parseFloat(course.Grade),
    Price: parseFloat(course.Price),
  };

  res.status(201).json({ success: true, data: serializedCourse });
};

/**
 * @desc    Update a course
 * @route   PUT /api/v1/courses/:id
 * @access  Private (instructor, admin)
 */
const updateCourse = async (req, res) => {
  let courseId;
  try {
    courseId = BigInt(req.params.id);
  } catch (err) {
    const error = new Error('Invalid Course ID format');
    error.statusCode = 400;
    throw error;
  }

  let course = await prisma.subjects.findUnique({
    where: { id: courseId }
  });

  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }

  // Ensure only the owning instructor or admin can update
  if (course.Instructor !== req.user.id && req.user.Role !== 'admin') {
    const error = new Error('Not authorised to update this course');
    error.statusCode = 403;
    throw error;
  }

  const { title, name, level, grade, category, medium, price } = req.body;
  const updateData = {};
  if (name || title) updateData.Name = name || title;
  if (grade || level) updateData.Grade = parseFloat(grade || level);
  if (medium || category) updateData.Medium = medium || category;
  if (price) updateData.Price = parseFloat(price);

  course = await prisma.subjects.update({
    where: { id: courseId },
    data: updateData
  });

  const serializedCourse = {
    ...course,
    id: course.id.toString(),
    Grade: parseFloat(course.Grade),
    Price: parseFloat(course.Price),
  };

  res.status(200).json({ success: true, data: serializedCourse });
};

/**
 * @desc    Delete a course
 * @route   DELETE /api/v1/courses/:id
 * @access  Private (instructor, admin)
 */
const deleteCourse = async (req, res) => {
  let courseId;
  try {
    courseId = BigInt(req.params.id);
  } catch (err) {
    const error = new Error('Invalid Course ID format');
    error.statusCode = 400;
    throw error;
  }

  const course = await prisma.subjects.findUnique({
    where: { id: courseId }
  });

  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }

  if (course.Instructor !== req.user.id && req.user.Role !== 'admin') {
    const error = new Error('Not authorised to delete this course');
    error.statusCode = 403;
    throw error;
  }

  await prisma.subjects.delete({
    where: { id: courseId }
  });

  res.status(200).json({ success: true, data: {} });
};

module.exports = { getCourses, getCourse, createCourse, updateCourse, deleteCourse };

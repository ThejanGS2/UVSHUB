const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
} = require('../controllers/courseController');
const { protect, authorise } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getCourses)
  .post(protect, authorise('instructor', 'admin'), createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorise('instructor', 'admin'), updateCourse)
  .delete(protect, authorise('instructor', 'admin'), deleteCourse);

router.post('/:id/enroll', protect, enrollInCourse);

module.exports = router;

const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String },
  content: { type: String },
  duration: { type: Number, default: 0 }, // in minutes
  order: { type: Number, required: true },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    thumbnail: { type: String, default: '' },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['Programming', 'Design', 'Business', 'Marketing', 'Science', 'Other'],
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    price: { type: Number, default: 0 },
    lessons: [lessonSchema],
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    tags: [String],
  },
  { timestamps: true }
);

// Virtual for total duration
courseSchema.virtual('totalDuration').get(function () {
  return this.lessons.reduce((acc, l) => acc + l.duration, 0);
});

module.exports = mongoose.model('Course', courseSchema);

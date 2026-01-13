const asyncHandler = require('express-async-handler');
const Review = require('../models/reviewModel');
const Course = require('../models/courseModel');
const Enrollment = require('../models/enrollmentModel');

// @desc    Add a review
// @route   POST /api/reviews/:courseId
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const courseId = req.params.courseId;
  const userId = req.user._id;

  // 1. Check if user is enrolled
  const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
  if (!enrollment) {
    res.status(403);
    throw new Error('You must be enrolled to review this course');
  }

  // 2. Check if already reviewed
  const alreadyReviewed = await Review.findOne({ user: userId, course: courseId });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this course');
  }

  // 3. Create review
  const review = await Review.create({
    user: userId,
    course: courseId,
    rating,
    comment,
  });

  // 4. Mark enrollment as rated
  enrollment.isRated = true;
  await enrollment.save();

  // 5. Update course rating
  const reviews = await Review.find({ course: courseId });
  const numReviews = reviews.length;
  const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

  const course = await Course.findById(courseId);
  course.numReviews = numReviews;
  course.rating = avgRating.toFixed(1);
  await course.save();

  res.status(201).json(review);
});

// @desc    Get reviews for a course
// @route   GET /api/reviews/:courseId
// @access  Public
const getCourseReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ course: req.params.courseId }).populate('user', 'name avatar');
  res.json(reviews);
});

module.exports = {
  addReview,
  getCourseReviews,
};

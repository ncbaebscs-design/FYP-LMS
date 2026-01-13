const asyncHandler = require('express-async-handler');
const Enrollment = require('../models/enrollmentModel');
const Course = require('../models/courseModel');
const User = require('../models/userModel');
const { createNotification } = require('./notificationController');

// @desc    Get enrollment/progress for a course
// @route   GET /api/progress/:courseId
// @access  Private
const getProgress = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: req.params.courseId,
  });

  if (enrollment) {
    res.json(enrollment);
  } else {
    res.status(404);
    throw new Error('Enrollment not found');
  }
});

// @desc    Enroll in a course
// @route   POST /api/progress/:courseId
// @access  Private
const enrollCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.user._id;

  const exists = await Enrollment.findOne({ user: userId, course: courseId });

  if (exists) {
    return res.status(200).json(exists);
  }

  const enrollment = await Enrollment.create({
    user: userId,
    course: courseId,
  });

  // Sync with User model
  const user = await User.findById(userId);
  if (user) {
    const alreadyEnrolledInUser = user.enrolledCourses.some(id => id.toString() === courseId.toString());
    if (!alreadyEnrolledInUser) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }
  }

  res.status(201).json(enrollment);

  // Notify student
  const course = await Course.findById(courseId);
  await createNotification(
    userId,
    'Enrolled Successfully',
    `You are now enrolled in "${course.title}". Start learning now!`,
    'success',
    `/course/${courseId}/player`
  );
});

// @desc    Get logged in user enrollments
// @route   GET /api/progress/my-enrollments
// @access  Private
const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user._id }).populate({
    path: 'course',
    select: 'title thumbnail instructor price category duration',
    populate: {
      path: 'instructor',
      select: 'name avatar',
    }
  });
  res.json(enrollments);
});

// @desc    Mark lecture as completed
// @route   PUT /api/progress/:courseId/complete/:lectureId
// @access  Private
const completeLecture = asyncHandler(async (req, res) => {
  const { courseId, lectureId } = req.params;

  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: courseId,
  });

  if (enrollment) {
    if (!enrollment.completedLectures.includes(lectureId)) {
      enrollment.completedLectures.push(lectureId);
      
      const course = await Course.findById(courseId);
      
      // Calculate total lectures across all sections
      let totalLectures = 0;
      course.curriculum.forEach(section => {
        totalLectures += section.lectures.length;
      });

      const completedCount = enrollment.completedLectures.length;
      enrollment.progressPercentage = totalLectures > 0 ? (completedCount / totalLectures) * 100 : 0;

      if (enrollment.progressPercentage >= 100) {
        enrollment.isCompleted = true;
        enrollment.certificateUrl = `certificate-${enrollment._id}.pdf`;

        // Notify user about course completion
        await createNotification(
          req.user._id,
          'Congratulations! Course Complete!',
          `You have successfully completed "${course.title}". Download your certificate now!`,
          'success',
          `/course/${courseId}/player`
        );
      }

      await enrollment.save();
    }
    res.json(enrollment);
  } else {
    res.status(404);
    throw new Error('Enrollment not found');
  }
});

module.exports = {
  getProgress,
  enrollCourse,
  completeLecture,
  getMyEnrollments,
};

const express = require('express');
const router = express.Router();
const {
  getProgress,
  enrollCourse,
  completeLecture,
  getMyEnrollments,
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.route('/my-enrollments').get(protect, getMyEnrollments);
router.route('/:courseId').get(protect, getProgress).post(protect, enrollCourse);
router.route('/:courseId/complete/:lectureId').put(protect, completeLecture);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getInstructorStats, getEarningsStats } = require('../controllers/instructorController');
const { protect, instructor } = require('../middleware/authMiddleware');

router.get('/stats', protect, instructor, getInstructorStats);
router.get('/earnings', protect, instructor, getEarningsStats);

module.exports = router;

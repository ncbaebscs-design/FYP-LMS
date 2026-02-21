const express = require('express');
const router = express.Router();
const { generateCourseDescription } = require('../controllers/aiController');
const { protect, instructor } = require('../middleware/authMiddleware');

// Route for generation - restricted to instructors/admins
router.post('/generate-description', protect, instructor, generateCourseDescription);

module.exports = router;

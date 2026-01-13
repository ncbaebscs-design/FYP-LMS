const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  clearNotifications,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getNotifications)
  .delete(protect, clearNotifications);

router.route('/:id').put(protect, markAsRead);

module.exports = router;

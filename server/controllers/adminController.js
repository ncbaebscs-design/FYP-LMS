const asyncHandler = require('express-async-handler');
const Course = require('../models/courseModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalCourses = await Course.countDocuments();
  const totalOrders = await Order.find({ isPaid: true });
  const totalRevenue = totalOrders.reduce((acc, item) => acc + item.totalPrice, 0);

  res.json({
    totalUsers,
    totalCourses,
    totalRevenue,
    totalOrders: totalOrders.length,
    recentUsers: await User.find().select('name email role createdAt').sort({ createdAt: -1 }).limit(5)
  });
});

module.exports = {
  getAdminStats,
};

const asyncHandler = require('express-async-handler');
const Course = require('../models/courseModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Enrollment = require('../models/enrollmentModel');

// @desc    Get instructor stats
// @route   GET /api/instructor/stats
// @access  Private/Instructor
const getInstructorStats = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;

  // 1. Get all courses by this instructor
  const courses = await Course.find({ instructor: instructorId });
  const courseIds = courses.map(c => c._id);

  // 2. Get all successful orders for these courses
  const bookings = await Order.find({ 
    course: { $in: courseIds },
    isPaid: true 
  });

  // 3. Calculate total revenue
  const totalRevenue = bookings.reduce((acc, item) => acc + item.totalPrice, 0);

  // 4. Get total student count (unique enrollments across all instructor's courses)
  const totalStudents = await Enrollment.distinct('user', { 
    course: { $in: courseIds } 
  });

  res.json({
    totalCourses: courses.length,
    totalRevenue,
    totalStudents: totalStudents.length,
    rating: 0, // No reviews implemented yet, so set to 0 instead of fake 4.8
    recentSales: await Order.find({ course: { $in: courseIds }, isPaid: true })
        .populate('course', 'title')
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
  });
});

// @desc    Get instructor earnings info
// @route   GET /api/instructor/earnings
// @access  Private/Instructor
const getEarningsStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get courses to find orders
  const courses = await Course.find({ instructor: req.user._id });
  const courseIds = courses.map(c => c._id);

  // Get all paid orders for these courses
  const bookings = await Order.find({ 
    course: { $in: courseIds },
    isPaid: true 
  }).populate('course', 'title').populate('user', 'name').sort({ createdAt: -1 });

  // Retroactive balance check: if user.balance is 0 but they have bookings,
  // we should probably trust the bookings more for "Total Earnings",
  // but for "Available Balance", we'll track payouts later.
  // For now, let's just make sure the dashboard is accurate.
  const calculatedTotal = bookings.reduce((acc, b) => acc + b.totalPrice, 0);

  res.json({
    balance: user.balance || calculatedTotal, // Fallback for existing orders
    totalEarnings: Math.max(user.totalEarnings || 0, calculatedTotal),
    payoutHistory: [],
    recentTransactions: bookings.map(b => ({
      _id: b._id,
      courseTitle: b.course.title,
      studentName: b.user.name,
      amount: b.totalPrice,
      date: b.createdAt
    }))
  });
});

module.exports = {
  getInstructorStats,
  getEarningsStats,
};

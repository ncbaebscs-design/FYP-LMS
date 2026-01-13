const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Course = require('../models/courseModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { cartItems, totalPrice } = req.body;

  if (!cartItems || cartItems.length === 0) {
    res.status(400);
    throw new Error('No items in order');
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems: cartItems.map(item => ({
        course: item.course._id || item.course,
        price: item.course.price || item.price
      })),
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: 'DUMMY_PAYMENT_ID_' + Date.now(),
      status: 'COMPLETED',
      update_time: new Date().toISOString(),
      email_address: req.user.email,
    };

    const updatedOrder = await order.save();

    // Process each item in the order
    for (const item of order.orderItems) {
      const courseId = item.course;
      const price = item.price;

      // 1. Enroll user in the course
      const user = await User.findById(req.user._id);
      if (user) {
        if (!user.enrolledCourses.some(id => id.toString() === courseId.toString())) {
          user.enrolledCourses.push(courseId);
          await user.save();

          const Enrollment = require('../models/enrollmentModel');
          await Enrollment.create({
            user: req.user._id,
            course: courseId,
          });
        }
      }

      // 2. Credit the instructor
      const course = await Course.findById(courseId);
      if (course) {
        const instructor = await User.findById(course.instructor);
        if (instructor) {
          instructor.balance += price;
          instructor.totalEarnings += price;
          await instructor.save();
          
          const { createNotification } = require('./notificationController');
          await createNotification(
            instructor._id,
            'New Sale!',
            `You earned $${price} from a new enrollment in "${course.title}".`,
            'success',
            '/instructor/earnings'
          );
        }
      }
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('course', 'title thumbnail');
  res.json(orders);
});

module.exports = {
  addOrderItems,
  updateOrderToPaid,
  getMyOrders,
};

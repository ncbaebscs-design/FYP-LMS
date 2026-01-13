const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');

// @desc    Get all cart items for logged in user
// @route   GET /api/cart
// @access  Private
const getCartItems = asyncHandler(async (req, res) => {
  const cartItems = await Cart.find({ user: req.user._id }).populate('course');
  res.json(cartItems);
});

// @desc    Add course to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  const alreadyInCart = await Cart.findOne({ user: req.user._id, course: courseId });

  if (alreadyInCart) {
    res.status(400);
    throw new Error('Course already in cart');
  }

  const cartItem = await Cart.create({
    user: req.user._id,
    course: courseId,
  });

  const populatedItem = await cartItem.populate('course');
  res.status(201).json(populatedItem);
});

// @desc    Remove course from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const cartItem = await Cart.findById(req.params.id);

  if (cartItem) {
    if (cartItem.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }
    await cartItem.deleteOne();
    res.json({ message: 'Item removed from cart' });
  } else {
    res.status(404);
    throw new Error('Cart item not found');
  }
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  await Cart.deleteMany({ user: req.user._id });
  res.json({ message: 'Cart cleared' });
});

module.exports = {
  getCartItems,
  addToCart,
  removeFromCart,
  clearCart,
};

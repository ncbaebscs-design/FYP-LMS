const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/wishlistModel');

// @desc    Get all wishlist items for logged in user
// @route   GET /api/wishlist
// @access  Private
const getWishlistItems = asyncHandler(async (req, res) => {
  const wishlistItems = await Wishlist.find({ user: req.user._id }).populate('course');
  res.json(wishlistItems);
});

// @desc    Add course to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  const alreadyWishlisted = await Wishlist.findOne({ user: req.user._id, course: courseId });

  if (alreadyWishlisted) {
    res.status(400);
    throw new Error('Course already in wishlist');
  }

  const wishlistItem = await Wishlist.create({
    user: req.user._id,
    course: courseId,
  });

  const populatedItem = await wishlistItem.populate('course');
  res.status(201).json(populatedItem);
});

// @desc    Remove course from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlistItem = await Wishlist.findById(req.params.id);

  if (wishlistItem) {
    if (wishlistItem.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }
    await wishlistItem.deleteOne();
    res.json({ message: 'Item removed from wishlist' });
  } else {
    res.status(404);
    throw new Error('Wishlist item not found');
  }
});

module.exports = {
  getWishlistItems,
  addToWishlist,
  removeFromWishlist,
};

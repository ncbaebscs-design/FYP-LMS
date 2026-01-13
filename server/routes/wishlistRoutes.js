const express = require('express');
const router = express.Router();
const {
  getWishlistItems,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getWishlistItems)
  .post(protect, addToWishlist);

router.route('/:id').delete(protect, removeFromWishlist);

module.exports = router;

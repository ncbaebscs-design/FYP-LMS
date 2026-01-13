const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Course',
  },
}, {
  timestamps: true,
});

// Avoid duplicate courses in cart for same user
cartSchema.index({ user: 1, course: 1 }, { unique: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;

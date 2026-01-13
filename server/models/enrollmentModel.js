const mongoose = require('mongoose');

const enrollmentSchema = mongoose.Schema({
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
  completedLectures: [{
    type: mongoose.Schema.Types.ObjectId, // IDs of lectures/modules
  }],
  progressPercentage: {
    type: Number,
    default: 0,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  certificateUrl: {
    type: String,
  },
  isRated: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;

const asyncHandler = require('express-async-handler');
const Comment = require('../models/commentModel');
const { createNotification } = require('./notificationController');

// @desc    Get comments for a lecture
// @route   GET /api/comments/:courseId/:lectureId
// @access  Private
const getComments = asyncHandler(async (req, res) => {
  const { courseId, lectureId } = req.params;
  
  const comments = await Comment.find({ course: courseId, lectureId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });

  res.json(comments);
});

// @desc    Add a comment to a lecture
// @route   POST /api/comments/:courseId/:lectureId
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { courseId, lectureId } = req.params;
  const { content, parentComment } = req.body;

  if (!content) {
    res.status(400);
    throw new Error('Comment content is required');
  }

  const comment = await Comment.create({
    user: req.user._id,
    course: courseId,
    lectureId,
    content,
    parentComment: parentComment || null,
  });

  const populatedComment = await Comment.findById(comment._id).populate('user', 'name avatar');

  // Notify parent comment author if it's a reply
  if (parentComment) {
    const parent = await Comment.findById(parentComment);
    if (parent && parent.user.toString() !== req.user._id.toString()) {
      await createNotification(
        parent.user,
        'New Reply on your comment',
        `${req.user.name} replied to your comment: "${content.substring(0, 30)}..."`,
        'info',
        `/course/${courseId}/player`
      );
    }
  }

  res.status(201).json(populatedComment);
});

module.exports = {
  getComments,
  addComment,
};

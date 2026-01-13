const asyncHandler = require('express-async-handler');
const Course = require('../models/courseModel');
const Enrollment = require('../models/enrollmentModel');

// @desc    Fetch all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const { category, level, sort, search, limit } = req.query;
  
  const query = { isPublished: true };

  // Filtering
  if (category) query.category = category;
  if (level) query.level = level;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { subtitle: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
  }

  // Sorting
  let mongooseQuery = Course.find(query);
  
  if (sort === 'newest') {
    mongooseQuery = mongooseQuery.sort({ createdAt: -1 });
  } else if (sort === 'price-low') {
    mongooseQuery = mongooseQuery.sort({ price: 1 });
  } else if (sort === 'price-high') {
    mongooseQuery = mongooseQuery.sort({ price: -1 });
  }

  // Limit for Homepage
  if (limit) {
    mongooseQuery = mongooseQuery.limit(Number(limit));
  }

  const courses = await mongooseQuery.lean();

  // Add stats and handling popularity sort manually if needed (or we could use aggregation)
  const coursesWithStats = await Promise.all(courses.map(async (course) => {
    const enrolledCount = await Enrollment.countDocuments({ course: course._id });
    return { ...course, enrolledCount };
  }));

  // Handle popularity sort (enrolledCount) since it's a virtual/calculated field
  if (sort === 'popularity') {
    coursesWithStats.sort((a, b) => b.enrolledCount - a.enrolledCount);
  }

  res.json(coursesWithStats);
});

// @desc    Fetch single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'name avatar')
    .lean();
  
  if (course) {
    const enrolledCount = await Enrollment.countDocuments({ course: course._id });
    res.json({ ...course, enrolledCount });
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    subtitle,
    description,
    price,
    thumbnail,
    category,
    subCategory,
    topic,
    language,
    subtitleLanguage,
    level,
    duration,
    trailer,
    objectives,
    targetAudience,
    requirements,
    curriculum,
    welcomeMessage,
    congratulationsMessage,
    additionalInstructors,
    isPublished,
  } = req.body;

  const course = new Course({
    title,
    subtitle,
    description,
    instructor: req.user._id,
    price: price || 0,
    thumbnail,
    category,
    subCategory,
    topic,
    language,
    subtitleLanguage,
    level,
    duration,
    trailer,
    objectives,
    targetAudience,
    requirements,
    curriculum,
    welcomeMessage,
    congratulationsMessage,
    additionalInstructors,
    isPublished: isPublished || false,
  });

  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = asyncHandler(async (req, res) => {
  const {
    title,
    subtitle,
    description,
    price,
    thumbnail,
    category,
    subCategory,
    topic,
    language,
    subtitleLanguage,
    level,
    duration,
    trailer,
    objectives,
    targetAudience,
    requirements,
    curriculum,
    welcomeMessage,
    congratulationsMessage,
    additionalInstructors,
    isPublished,
  } = req.body;

  const course = await Course.findById(req.params.id);

  if (course) {
    course.title = title || course.title;
    course.subtitle = subtitle || course.subtitle;
    course.description = description || course.description;
    course.price = price !== undefined ? price : course.price;
    course.thumbnail = thumbnail || course.thumbnail;
    course.category = category || course.category;
    course.subCategory = subCategory || course.subCategory;
    course.topic = topic || course.topic;
    course.language = language || course.language;
    course.subtitleLanguage = subtitleLanguage || course.subtitleLanguage;
    course.level = level || course.level;
    course.duration = duration || course.duration;
    course.trailer = trailer || course.trailer;
    course.objectives = objectives || course.objectives;
    course.targetAudience = targetAudience || course.targetAudience;
    course.requirements = requirements || course.requirements;
    course.curriculum = curriculum || course.curriculum;
    course.welcomeMessage = welcomeMessage || course.welcomeMessage;
    course.congratulationsMessage = congratulationsMessage || course.congratulationsMessage;
    course.additionalInstructors = additionalInstructors || course.additionalInstructors;
    course.isPublished = isPublished !== undefined ? isPublished : course.isPublished;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    await course.deleteOne();
    res.json({ message: 'Course removed' });
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Fetch instructor courses
// @route   GET /api/courses/instructor/my-courses
// @access  Private/Instructor
const getInstructorCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id });
  res.json(courses);
});

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
};

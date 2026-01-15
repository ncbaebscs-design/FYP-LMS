const mongoose = require('mongoose');

const contentSchema = mongoose.Schema({
  type: {
    type: String,
    enum: ['video', 'image', 'file', 'text', 'description'],
    required: true,
  },
  data: { type: String, required: true }, // URL or text
  title: { type: String }, // Optional title for the content item
  duration: { type: Number, default: 0 },
}, { _id: true });

const lectureSchema = mongoose.Schema({
  title: { type: String, required: true },
  contents: [contentSchema],
}, { _id: true });

const sectionSchema = mongoose.Schema({
  title: { type: String, required: true },
  lectures: [lectureSchema],
}, { _id: true });

const courseSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
  },
  topic: {
    type: String,
  },
  language: {
    type: String,
    default: 'English',
  },
  subtitleLanguage: {
    type: String,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  duration: {
     value: { type: Number, default: 0 },
     unit: { type: String, default: 'Hours' },
  },
  trailer: {
    type: String, // URL
  },
  objectives: [{
    type: String,
  }],
  targetAudience: [{
    type: String,
  }],
  requirements: [{
    type: String,
  }],
  curriculum: [sectionSchema],
  welcomeMessage: {
    type: String,
  },
  congratulationsMessage: {
    type: String,
  },
  additionalInstructors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  isPublished: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;

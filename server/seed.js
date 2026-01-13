const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Course = require('./models/courseModel');

dotenv.config();

const courses = [
  {
    title: 'Ultimate React & Redux 2026',
    subtitle: 'Master React with Redux, Hooks, Context, and modern toolkits.',
    description: 'This comprehensive course takes you from beginner to advanced React developer. You will learn everything from basic JSX to complex state management with Redux Toolkit and asynchronous middleware.',
    price: 49.99,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
    category: 'Web Development',
    level: 'Intermediate',
    language: 'English',
    objectives: [
      'Build professional-level React applications',
      'Master Redux Toolkit for state management',
      'Implement authentication and protected routes',
      'Deploy applications to production'
    ],
    requirements: [
      'Basic knowledge of HTML/CSS',
      'Intermediate JavaScript (ES6+) knowledge'
    ],
    isPublished: true,
    curriculum: [
      {
        title: 'Introduction to React',
        lectures: [
          {
            title: 'Welcome to the Course',
            contents: [{ type: 'video', data: 'https://example.com/welcome' }]
          },
          {
            title: 'What is React?',
            contents: [{ type: 'text', data: 'React is a JavaScript library for building user interfaces.' }]
          }
        ]
      },
      {
        title: 'State and Props',
        lectures: [
          {
            title: 'Understanding Props',
            contents: [{ type: 'video', data: 'https://example.com/props' }]
          },
          {
            title: 'The useState Hook',
            contents: [{ type: 'video', data: 'https://example.com/usestate' }]
          }
        ]
      }
    ]
  },
  {
    title: 'Python for Data Science & AI',
    subtitle: 'The complete path from Python basics to Machine Learning.',
    description: 'Learn how to use Python for data analysis, visualization, and building machine learning models using Scikit-Learn and TensorFlow.',
    price: 59.99,
    thumbnail: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=2070&auto=format&fit=crop',
    category: 'Data Science',
    level: 'Beginner',
    language: 'English',
    objectives: [
      'Automate tasks with Python scripts',
      'Clean and analyze data with Pandas',
      'Create stunning visualizations with Matplotlib',
      'Build and train neural networks'
    ],
    requirements: [
      'No prior programming experience required'
    ],
    isPublished: true,
    curriculum: [
      {
        title: 'Python Fundamentals',
        lectures: [
          {
            title: 'Setup & Installation',
            contents: [{ type: 'video', data: 'https://example.com/setup' }]
          },
          {
            title: 'Variables and Data Types',
            contents: [{ type: 'text', data: 'Learn about ints, floats, strings, and booleans.' }]
          }
        ]
      }
    ]
  },
  {
    title: 'Modern UI/UX Design Essentials',
    subtitle: 'Design beautiful, user-centered apps from scratch.',
    description: 'Master Figma and learn the principles of modern UI/UX design. Learn how to create wireframes, prototypes, and high-fidelity designs.',
    price: 39.99,
    thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=2070&auto=format&fit=crop',
    category: 'Design',
    level: 'Beginner',
    language: 'English',
    objectives: [
      'Master Figma tools and features',
      'Apply color theory and typography principles',
      'Create responsive design layouts',
      'Build interactive prototypes'
    ],
    requirements: [
      'A computer with Figma access (free version)'
    ],
    isPublished: true,
    curriculum: [
      {
        title: 'Design Principles',
        lectures: [
          {
            title: 'Introduction to UI/UX',
            contents: [{ type: 'video', data: 'https://example.com/design-intro' }]
          }
        ]
      }
    ]
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Find or create an instructor
    let instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      console.log('No instructor found. Creating a default instructor...');
      instructor = await User.create({
        name: 'Dr. Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'instructor',
        avatar: 'https://i.pravatar.cc/150?u=jane'
      });
    }

    // Clear existing sample courses if needed (optional)
    // await Course.deleteMany({ instructor: instructor._id });

    const finalCourses = courses.map(course => ({
      ...course,
      instructor: instructor._id
    }));

    await Course.insertMany(finalCourses);
    console.log(`${finalCourses.length} Courses Seeded Successfully!`);

    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();

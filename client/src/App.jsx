import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getMe } from './store/slices/authSlice';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
// import PrivateRoute from './components/PrivateRoute'; // Will implement if needed, or just redirect in pages

import BecomeInstructor from './pages/BecomeInstructor.jsx';
import InstructorLayout from './components/InstructorLayout';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CreateCourse from './pages/instructor/CreateCourse';
import MyCourses from './pages/instructor/MyCourses';
import InstructorEarnings from './pages/instructor/Earnings';
import InstructorSettings from './pages/instructor/Settings';
import CourseDetails from './pages/CourseDetails';
import Checkout from './pages/Checkout';
import CoursePlayer from './pages/CoursePlayer';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Activity from './pages/Activity';
import Browse from './pages/Browse';
import Certificate from './pages/Certificate';

import Footer from './components/Footer';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/become-instructor" element={<BecomeInstructor />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route path="/course/:courseId/player" element={<CoursePlayer />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/course/:courseId/certificate" element={<Certificate />} />

            {/* Instructor Routes */}
            <Route path="/instructor" element={<InstructorLayout />}>
              <Route index element={<InstructorDashboard />} />
              <Route path="create-course" element={<CreateCourse />} />
              <Route path="my-courses" element={<MyCourses />} />
              <Route path="earnings" element={<InstructorEarnings />} />
              <Route path="settings" element={<InstructorSettings />} />
              {/* Routes for more can be added here */}
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

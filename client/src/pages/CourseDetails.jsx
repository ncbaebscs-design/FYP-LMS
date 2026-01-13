import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Star,
    Users,
    PlayCircle,
    CheckCircle2,
    Clock,
    Globe,
    BarChart,
    Calendar,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    ShoppingCart,
    Heart,
    ChevronRight
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist } from '../store/slices/wishlistSlice';
import { toast } from 'react-hot-toast';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedSection, setExpandedSection] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);

    const { items: cartItems } = useSelector((state) => state.cart);
    const { items: wishlistItems } = useSelector((state) => state.wishlist);

    const isInCart = cartItems.some(item => item.course._id === id);
    const isInWishlist = wishlistItems.some(item => item.course._id === id);

    const [relatedCourses, setRelatedCourses] = useState([]);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await axios.get(`/api/courses/${id}`);
                setCourse(data);

                // Fetch related courses
                const { data: related } = await axios.get(`/api/courses?category=${data.category}&limit=6`);
                setRelatedCourses(related.filter(c => c._id !== id).slice(0, 5));

                if (user) {
                    try {
                        const { data: progress } = await axios.get(`/api/progress/${id}`);
                        if (progress) setIsEnrolled(true);
                    } catch (e) {
                        // Not enrolled
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching course:', error);
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id, user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!course) return <div className="text-center py-20 text-gray-500">Course not found.</div>;

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (isInCart) {
            navigate('/cart');
            return;
        }
        try {
            await dispatch(addToCart(id)).unwrap();
            toast.success('Added to cart!');
        } catch (error) {
            toast.error(error || 'Failed to add to cart');
        }
    };

    const handleAddToWishlist = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (isInWishlist) {
            toast.success('Already in wishlist');
            return;
        }
        try {
            await dispatch(addToWishlist(id)).unwrap();
            toast.success('Added to wishlist!');
        } catch (error) {
            toast.error(error || 'Failed to add to wishlist');
        }
    };

    const handleEnroll = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (isEnrolled) {
            navigate(`/course/${id}/player`);
            return;
        }

        if (course.price === 0) {
            setEnrolling(true);
            try {
                await axios.post(`/api/progress/${id}`);
                setIsEnrolled(true);
                navigate(`/course/${id}/player`);
            } catch (error) {
                console.error('Enrollment failed:', error);
                toast.error('Failed to join course. Please try again.');
            } finally {
                setEnrolling(false);
            }
        } else {
            if (!isInCart) {
                try {
                    await dispatch(addToCart(id)).unwrap();
                } catch (error) {
                    console.error('Error adding to cart:', error);
                }
            }
            navigate(`/checkout/${id}`);
        }
    };

    const tabs = [
        { id: 'description', label: 'Description' },
        { id: 'curriculum', label: 'Curriculum' },
        { id: 'instructor', label: 'Instructor' },
        { id: 'reviews', label: 'Reviews' }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* BREADCRUMBS & HEADER */}
            <div className="bg-gray-50 border-b border-gray-100 py-4">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                        <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <Link to="/browse" className="hover:text-orange-500 transition-colors">Courses</Link>
                        <ChevronRight size={12} />
                        <span className="text-gray-900">{course.category}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight max-w-4xl">
                        {course.title}
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl pt-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* LEFT COLUMN: Main Content */}
                    <div className="lg:col-span-8">
                        {/* HERO MEDIA */}
                        <div className="aspect-video relative rounded-3xl overflow-hidden bg-gray-900 mb-8 border border-gray-100 shadow-2xl">
                            <img src={course.thumbnail} className="w-full h-full object-cover opacity-60" alt="Preview" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:scale-110 transition-transform group">
                                    <PlayCircle size={48} className="fill-white group-hover:fill-orange-500 transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* TAB NAVIGATION */}
                        <div className="flex border-b border-gray-100 mb-10 overflow-x-auto scrollbar-hide">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-8 py-4 font-black text-sm uppercase tracking-widest transition-all relative shrink-0 ${activeTab === tab.id ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* TAB CONTENT */}
                        <div className="space-y-12 min-h-[400px]">
                            {activeTab === 'description' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="prose prose-lg max-w-none">
                                        <h2 className="text-2xl font-black text-gray-900 mb-6">Course Description</h2>
                                        <div className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-10">
                                            {course.description}
                                        </div>

                                        <div className="bg-green-50 rounded-3xl p-8 border border-green-100">
                                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white">
                                                    <CheckCircle2 size={18} />
                                                </div>
                                                What you will learn in this course
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                                {course.objectives?.map((obj, i) => (
                                                    <div key={i} className="flex gap-3 items-start">
                                                        <CheckCircle2 className="text-green-500 mt-1 shrink-0" size={16} />
                                                        <span className="text-sm font-medium text-gray-700 leading-snug">{obj}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'curriculum' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h2 className="text-2xl font-black text-gray-900 mb-6">Course Content</h2>
                                    <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                                        {course.curriculum?.map((section, sIndex) => (
                                            <div key={section._id} className="border-b last:border-none">
                                                <button
                                                    onClick={() => setExpandedSection(expandedSection === sIndex ? null : sIndex)}
                                                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${expandedSection === sIndex ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}`}>
                                                            {expandedSection === sIndex ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                        </div>
                                                        <span className="font-bold text-gray-900">{section.title}</span>
                                                    </div>
                                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{section.lectures?.length} Lectures</span>
                                                </button>

                                                {expandedSection === sIndex && (
                                                    <div className="bg-white px-6 pb-6 space-y-2">
                                                        {section.lectures?.map((lecture, lIdx) => (
                                                            <div key={lecture._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group/item hover:bg-orange-50 transition-all cursor-default">
                                                                <div className="flex items-center gap-4">
                                                                    <PlayCircle size={18} className="text-gray-400 group-hover/item:text-orange-500" />
                                                                    <span className="text-sm font-bold text-gray-700">{lecture.title}</span>
                                                                </div>
                                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover/item:text-orange-500">Preview</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'instructor' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h2 className="text-2xl font-black text-gray-900 mb-8">About the Instructor</h2>
                                    <div className="bg-gray-50 rounded-[3rem] p-10 flex flex-col md:flex-row gap-10 items-start border border-gray-100">
                                        <div className="w-40 h-40 rounded-[2.5rem] bg-gray-200 overflow-hidden shrink-0 shadow-xl border-4 border-white">
                                            <img src={course.instructor?.avatar || 'https://via.placeholder.com/200'} className="w-full h-full object-cover" alt="Instructor" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-black text-gray-900 mb-2">{course.instructor?.name || 'Dev 7-Tutor'}</h3>
                                            <p className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-6">Expert Instructor & Content Creator</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                                                <div>
                                                    <p className="text-lg font-black text-gray-900">4.8</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Instructor Rating</p>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-gray-900">25,482</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Reviews</p>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-gray-900">158,452</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Students</p>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-gray-900">12</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Courses</p>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed mb-8">
                                                Passionate about teaching and building high-quality web applications. With over 10 years of experience in the industry, I've helped thousands of students master modern web technologies.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h2 className="text-2xl font-black text-gray-900 mb-10">Student Feedback</h2>
                                    <div className="flex flex-col md:flex-row gap-12 items-center mb-16 px-6">
                                        <div className="text-center">
                                            <p className="text-7xl font-black text-gray-900 mb-4 tracking-tighter">4.8</p>
                                            <div className="flex justify-center gap-1 text-yellow-400 mb-2">
                                                <Star size={20} fill="currentColor" />
                                                <Star size={20} fill="currentColor" />
                                                <Star size={20} fill="currentColor" />
                                                <Star size={20} fill="currentColor" />
                                                <Star size={20} fill="currentColor" />
                                            </div>
                                            <p className="text-xs font-black text-orange-500 uppercase tracking-widest">Course Rating</p>
                                        </div>
                                        <div className="flex-1 w-full space-y-3">
                                            {[
                                                { star: 5, percent: 85 },
                                                { star: 4, percent: 10 },
                                                { star: 3, percent: 3 },
                                                { star: 2, percent: 1 },
                                                { star: 1, percent: 1 }
                                            ].map((rating) => (
                                                <div key={rating.star} className="flex items-center gap-4">
                                                    <div className="flex gap-1 w-24">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star key={i} size={12} className={i < rating.star ? 'text-yellow-400 fill-currentColor' : 'text-gray-200'} />
                                                        ))}
                                                    </div>
                                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-orange-500" style={{ width: `${rating.percent}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-400 w-10 text-right">{rating.percent}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sticky Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-8 overflow-hidden">
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-5xl font-black text-gray-900">${course.price}</span>
                                    {course.oldPrice && <span className="text-gray-400 line-through text-xl mt-2">${course.oldPrice}</span>}
                                </div>
                                <p className="text-rose-500 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">2 days left at this price!</p>
                            </div>

                            <div className="space-y-4 mb-10">
                                <button
                                    onClick={handleAddToCart}
                                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl ${isInCart ? 'bg-gray-100 text-gray-900' : 'bg-orange-500 text-white shadow-orange-500/30 hover:bg-orange-600'
                                        }`}
                                >
                                    {isInCart ? 'Go to Cart' : 'Add to Cart'}
                                </button>
                                <button
                                    onClick={handleEnroll}
                                    className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm bg-gray-900 text-white shadow-xl shadow-gray-900/10 hover:bg-gray-800 transition-all"
                                >
                                    Buy Now
                                </button>
                                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">30-Day Money-Back Guarantee</p>
                            </div>

                            <div className="space-y-6">
                                <h4 className="font-black text-gray-900 text-sm uppercase tracking-widest border-b border-gray-50 pb-4">This course includes:</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <Clock size={18} className="text-orange-500" />
                                        <span>{course.duration?.value} {course.duration?.unit} on-demand video</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <Globe size={18} className="text-orange-500" />
                                        <span>Access on all devices</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <CheckCircle2 size={18} className="text-orange-500" />
                                        <span>Certificate of completion</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <Users size={18} className="text-orange-500" />
                                        <span>{course.enrolledCount} students enrolled</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RELATED COURSES */}
                {relatedCourses.length > 0 && (
                    <div className="mt-32 pt-20 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Related Courses</h2>
                            <button onClick={() => navigate('/browse')} className="text-orange-500 font-bold hover:translate-x-1 transition-transform">View All</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            {relatedCourses.map((course) => (
                                <CourseCardSmall key={course._id} course={course} navigate={navigate} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Internal Course Card for Related Section
const CourseCardSmall = ({ course, navigate }) => (
    <div
        className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col"
        onClick={() => {
            navigate(`/course/${course._id}`);
            window.scrollTo(0, 0);
        }}
    >
        <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
            <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.title} />
        </div>
        <div className="p-5 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-black text-orange-500 bg-orange-50 px-2 py-1 rounded-full uppercase tracking-widest">{course.category}</span>
                <span className="text-sm font-black text-gray-900">${course.price}</span>
            </div>
            <h4 className="font-black text-gray-900 text-sm leading-tight mb-4 line-clamp-2 h-10 group-hover:text-orange-500 transition-colors">
                {course.title}
            </h4>
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50 flex-wrap gap-2">
                <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={10} fill="currentColor" />
                    <span className="text-[10px] font-black text-gray-900">{course.rating || '4.8'}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Users size={10} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{course.enrolledCount || 0}</span>
                </div>
            </div>
        </div>
    </div>
);

export default CourseDetails;

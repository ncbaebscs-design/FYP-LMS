import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    Heart
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

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await axios.get(`/api/courses/${id}`);
                setCourse(data);

                // If user logged in, check if enrolled
                if (user) {
                    try {
                        const { data: progress } = await axios.get(`/api/progress/${id}`);
                        if (progress) setIsEnrolled(true);
                    } catch (e) {
                        // Not enrolled or error
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
            navigate('/checkout/' + id); // Go to checkout if already in cart
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
                alert('Failed to join course. Please try again.');
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

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header Hero Section */}
            <div className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row gap-12">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-orange-500/30">
                                {course.category}
                            </span>
                            <span className="text-gray-400 text-sm">•</span>
                            {course.rating && (
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <Star size={16} fill="currentColor" />
                                    <span className="font-bold">{course.rating}</span>
                                    <span className="text-gray-400 font-normal">({course.numReviews || 0} ratings)</span>
                                </div>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            {course.title}
                        </h1>
                        <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                            {course.subtitle}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                                <Users size={18} className="text-orange-500" />
                                <span>{course.enrolledCount || 0} enrolled</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe size={18} className="text-orange-500" />
                                <span>{course.language}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BarChart size={18} className="text-orange-500" />
                                <span>{course.level}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-orange-500" />
                                <span>Last updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-800 flex items-center gap-4">
                            <img
                                src={course.instructor?.avatar || 'https://via.placeholder.com/100'}
                                className="w-12 h-12 rounded-full border-2 border-orange-500 shadow-lg"
                                alt="Instructor"
                            />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Instructor</p>
                                <p className="text-lg font-bold hover:text-orange-500 cursor-pointer transition-colors">
                                    {course.instructor?.name || 'Instructor Name'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-96">
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 sticky top-24">
                            <div className="aspect-video relative overflow-hidden group">
                                <img src={course.thumbnail} className="w-full h-full object-cover" alt="Course" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="bg-white p-4 rounded-full shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
                                        <PlayCircle className="text-orange-500" size={32} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 text-gray-900">
                                <div className="flex items-end gap-2 mb-6">
                                    <span className="text-4xl font-black">${course.price}</span>
                                    {course.oldPrice && <span className="text-gray-400 line-through text-lg mb-1">${course.oldPrice}</span>}
                                    <span className="text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded text-xs ml-auto mb-2 tracking-widest">LIMITED OFFER</span>
                                </div>

                                {isEnrolled ? (
                                    <button
                                        onClick={() => navigate(`/course/${id}/player`)}
                                        className="w-full bg-green-600 text-white font-black py-4 rounded-xl shadow-lg shadow-green-500/30 transition-all hover:-translate-y-1 mb-4 flex justify-center items-center gap-2"
                                    >
                                        CONTINUE LEARNING <ArrowRight size={18} />
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => {
                                                if (isInCart) {
                                                    navigate('/checkout');
                                                } else {
                                                    handleAddToCart();
                                                }
                                            }}
                                            className={`w-full font-black py-4 rounded-xl shadow-lg transition-all hover:-translate-y-1 flex justify-center items-center gap-2 ${isInCart
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-orange-500 text-white shadow-orange-500/30'
                                                }`}
                                        >
                                            <ShoppingCart size={18} />
                                            {isInCart ? 'CONTINUE TO CHECKOUT' : 'ADD TO CART'}
                                        </button>
                                        <button
                                            onClick={handleEnroll}
                                            className="w-full bg-gray-900 text-white font-black py-4 rounded-xl shadow-lg shadow-gray-900/20 hover:bg-orange-600 transition-all flex justify-center items-center"
                                        >
                                            BUY NOW
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={handleAddToWishlist}
                                    className={`w-full mt-4 font-bold py-4 rounded-xl border transition-all flex items-center justify-center gap-2 ${isInWishlist
                                        ? 'bg-orange-50 border-orange-200 text-orange-600'
                                        : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50'
                                        }`}
                                >
                                    <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
                                    {isInWishlist ? 'WISHLISTED' : 'ADD TO WISHLIST'}
                                </button>

                                <div className="space-y-4">
                                    <p className="font-bold text-sm text-gray-500 uppercase tracking-widest">This course includes:</p>
                                    <div className="space-y-3 text-sm text-gray-700">
                                        <div className="flex items-center gap-3">
                                            <Clock size={16} className="text-orange-500" />
                                            <span>{course.duration?.value} {course.duration?.unit} of video</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-orange-500" />
                                            <span>Full lifetime access</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Globe size={16} className="text-orange-500" />
                                            <span>Access on mobile and TV</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <BarChart size={16} className="text-orange-500" />
                                            <span>Certificate of completion</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Content Body */}
            <div className="container mx-auto px-4 max-w-6xl mt-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2 space-y-16">
                    {/* Objectives Section */}
                    <section>
                        <h2 className="text-3xl font-black text-gray-800 mb-8 border-l-8 border-orange-500 pl-6">What you'll learn</h2>
                        <div className="bg-gray-50 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-100">
                            {course.objectives?.map((obj, i) => (
                                <div key={i} className="flex gap-3">
                                    <CheckCircle2 className="text-orange-500 shrink-0" size={20} />
                                    <span className="text-gray-700 leading-tight font-medium">{obj}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Requirements Section */}
                    <section>
                        <h2 className="text-3xl font-black text-gray-800 mb-6">Requirements</h2>
                        <ul className="list-disc pl-8 space-y-3 text-gray-600">
                            {course.requirements?.map((req, i) => (
                                <li key={i}>{req}</li>
                            ))}
                        </ul>
                    </section>

                    {/* Description Section */}
                    <section>
                        <h2 className="text-3xl font-black text-gray-800 mb-6">Description</h2>
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                            {course.description}
                        </div>
                    </section>

                    {/* Curriculum Section */}
                    <section>
                        <h2 className="text-3xl font-black text-gray-800 mb-8">Course Content</h2>
                        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                            {course.curriculum?.map((section, sIndex) => (
                                <div key={section._id} className="border-b last:border-none">
                                    <button
                                        onClick={() => setExpandedSection(expandedSection === sIndex ? null : sIndex)}
                                        className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            {expandedSection === sIndex ? <ChevronUp className="text-orange-500" size={20} /> : <ChevronDown className="text-gray-400" size={20} />}
                                            <span className="font-bold text-lg text-gray-800">{section.title}</span>
                                        </div>
                                        <span className="text-sm text-gray-400 font-medium">{section.lectures?.length} lectures</span>
                                    </button>

                                    {expandedSection === sIndex && (
                                        <div className="bg-gray-50 p-4 space-y-1">
                                            {section.lectures?.map((lecture) => (
                                                <div key={lecture._id} className="flex items-center gap-4 p-4 text-sm text-gray-600 hover:bg-white rounded-lg transition-colors cursor-default">
                                                    <PlayCircle size={16} className="text-gray-400" />
                                                    <span className="flex-1 font-medium">{lecture.title}</span>
                                                    <span className="text-[11px] font-bold text-gray-400">PREVIEW</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div >
    );
};

export default CourseDetails;

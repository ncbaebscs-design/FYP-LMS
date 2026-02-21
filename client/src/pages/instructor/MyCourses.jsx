import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, ChevronDown, MoreVertical, Star, Users, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeAction, setActiveAction] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get('/api/courses/my-courses');
                setCourses(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage and track your created courses</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search in your courses..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-64 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* Filters */}
            <div className="flex gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white">
                    <span>Sort by:</span>
                    <span className="text-gray-900">Latest</span>
                    <ChevronDown size={16} />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white">
                    <span>Category:</span>
                    <span className="text-gray-900">All Category</span>
                    <ChevronDown size={16} />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white">
                    <span>Rating:</span>
                    <span className="text-gray-900">4 Star & Up</span>
                    <ChevronDown size={16} />
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCourses.map((course) => (
                    <div key={course._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative">
                        <div className="aspect-video relative overflow-hidden">
                            <img
                                src={course.thumbnail || 'https://via.placeholder.com/300x200?text=Course+Thumbnail'}
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {!course.isPublished && (
                                <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                    Draft
                                </div>
                            )}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => setActiveAction(activeAction === course._id ? null : course._id)}
                                    className="p-1.5 bg-white/90 rounded-full shadow-lg text-gray-700 hover:text-orange-500"
                                >
                                    <MoreVertical size={18} />
                                </button>
                            </div>

                            {activeAction === course._id && (
                                <div className="absolute top-10 right-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
                                    <button
                                        onClick={() => navigate(`/instructor/edit-course/${course._id}`)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                                    >
                                        Edit Course
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Are you sure you want to delete this course?')) {
                                                try {
                                                    await axios.delete(`/api/courses/${course._id}`);
                                                    setCourses(courses.filter(c => c._id !== course._id));
                                                    toast.success('Course deleted successfully');
                                                } catch (error) {
                                                    console.error('Delete failed', error);
                                                    toast.error('Failed to delete course');
                                                }
                                            }
                                            setActiveAction(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Delete Course
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded">
                                {course.category || 'Development'}
                            </span>
                            <h3 className="text-sm font-semibold text-gray-800 h-10 line-clamp-2 mt-2 leading-tight">
                                {course.title}
                            </h3>

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                                    {course.rating && (
                                        <>
                                            <Star className="text-yellow-400 fill-yellow-400" size={14} />
                                            <span className="font-bold text-gray-700">{course.rating}</span>
                                            <span className="text-gray-400">({course.numReviews || 0})</span>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                                    <Users size={14} className="text-gray-400" />
                                    <span className="font-bold text-gray-700">0</span>
                                    <span className="text-gray-400">students</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-base font-bold text-orange-500">
                                    ${course.price || '0.00'}
                                </span>
                                <button
                                    onClick={() => navigate(`/course/${course._id}`)}
                                    className="text-[11px] font-bold text-gray-400 hover:text-orange-500 uppercase tracking-wider transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Placeholder */}
            {filteredCourses.length > 0 && (
                <div className="flex justify-center items-center gap-4 mt-12 pb-8">
                    <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 rounded-lg bg-orange-500 text-white font-bold text-sm">01</button>
                        <button className="w-10 h-10 rounded-lg text-gray-600 font-bold text-sm hover:bg-gray-50">02</button>
                        <button className="w-10 h-10 rounded-lg text-gray-600 font-bold text-sm hover:bg-gray-50">03</button>
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
                        <ArrowRight size={18} />
                    </button>
                </div>
            )}

            {filteredCourses.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="bg-white w-16 h-16 rounded-full flex justify-center items-center mx-auto mb-4 shadow-sm">
                        <Search className="text-gray-300" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">No courses found</h3>
                    <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
                    <button
                        onClick={() => navigate('/instructor/create-course')}
                        className="mt-6 px-6 py-2.5 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                    >
                        Create New Course
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyCourses;

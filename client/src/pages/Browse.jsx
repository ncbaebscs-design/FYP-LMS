import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Filter,
    ChevronDown,
    Star,
    Users,
    PlayCircle,
    Search,
    Loader2,
    SlidersHorizontal
} from 'lucide-react';

const Browse = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = ['Development', 'Business', 'Design', 'Marketing', 'Personal Development'];
    const levels = ['Beginner', 'Intermediate', 'Expert'];

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/api/courses?${searchParams.toString()}`);
                setCourses(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setLoading(false);
            }
        };
        fetchCourses();
    }, [searchParams]);

    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header / Search Area */}
            <div className="bg-white border-b border-gray-100 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Explore Courses</h1>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-grow relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search for courses, topics, or skills..."
                                value={searchParams.get('search') || ''}
                                onChange={(e) => updateFilter('search', e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                className="px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-sm text-gray-700"
                                value={searchParams.get('sort') || 'newest'}
                                onChange={(e) => updateFilter('sort', e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="popularity">Most Popular</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:w-64 shrink-0 space-y-8">
                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <SlidersHorizontal size={14} /> Category
                            </h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => updateFilter('category', '')}
                                    className={`w-full text-left px-4 py-2 text-sm font-bold rounded-xl transition-all ${!searchParams.get('category') ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'text-gray-500 hover:bg-white hover:text-gray-900'}`}
                                >
                                    All Categories
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => updateFilter('category', cat)}
                                        className={`w-full text-left px-4 py-2 text-sm font-bold rounded-xl transition-all ${searchParams.get('category') === cat ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'text-gray-500 hover:bg-white hover:text-gray-900'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Filter size={14} /> Difficulty Level
                            </h3>
                            <div className="space-y-2">
                                {levels.map(lvl => (
                                    <button
                                        key={lvl}
                                        onClick={() => updateFilter('level', searchParams.get('level') === lvl ? '' : lvl)}
                                        className={`w-full text-left px-4 py-2 text-sm font-bold rounded-xl transition-all ${searchParams.get('level') === lvl ? 'bg-orange-600/10 text-orange-600' : 'text-gray-500 hover:bg-white hover:text-gray-900'}`}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-grow">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <Loader2 className="animate-spin mb-4" size={40} />
                                <p className="font-black text-xs uppercase tracking-widest">Searching Courses...</p>
                            </div>
                        ) : courses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {courses.map((course) => (
                                    <div
                                        key={course._id}
                                        className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 cursor-pointer flex flex-col"
                                        onClick={() => navigate(`/course/${course._id}`)}
                                    >
                                        <div className="aspect-video relative overflow-hidden">
                                            <img
                                                src={course.thumbnail || 'https://via.placeholder.com/400x225?text=Course+Thumbnail'}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
                                                <PlayCircle className="text-white drop-shadow-lg" size={48} />
                                            </div>
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-lg">
                                                {course.level}
                                            </div>
                                        </div>

                                        <div className="p-6 flex-grow flex flex-col">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                                    {course.category}
                                                </span>
                                            </div>

                                            <h3 className="font-black text-gray-900 mb-3 line-clamp-2 h-12 leading-tight group-hover:text-orange-500 transition-colors text-lg">
                                                {course.title}
                                            </h3>

                                            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 mb-6 uppercase tracking-widest">
                                                {course.rating && (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="text-yellow-400 fill-yellow-400" size={14} />
                                                        <span className="text-gray-900">{course.rating}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    <Users size={14} />
                                                    <span>{course.enrolledCount} Students</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                                                <span className="text-2xl font-black text-gray-900">${course.price}</span>
                                                <span className="text-xs font-black text-orange-500 uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                    Enroll Now →
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                                <h3 className="text-xl font-black text-gray-900 mb-2">No courses found</h3>
                                <p className="text-gray-500">Try adjusting your filters or search terms to find what you're looking for.</p>
                                <button
                                    onClick={() => navigate('/browse')}
                                    className="mt-6 text-orange-500 font-black text-sm uppercase tracking-widest hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Browse;

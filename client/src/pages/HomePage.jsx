import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import heroImg from '../assets/hero.png'
import {
    Star,
    Users,
    PlayCircle,
    Loader2,
    Search,
    ChevronRight,
    Award,
    Briefcase,
    TrendingUp,
    Shield,
    CheckCircle2,
    Calendar,
    PenTool,
    Code,
    BarChart,
    Cpu,
    Target,
    Camera,
    Heart,
    Music,
    Globe
} from 'lucide-react';

const HomePage = () => {
    const [bestSelling, setBestSelling] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [recentlyAdded, setRecentlyAdded] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [bestRes, newestRes] = await Promise.all([
                    axios.get('/api/courses?sort=popularity&limit=8'),
                    axios.get('/api/courses?sort=newest&limit=6')
                ]);

                if (Array.isArray(bestRes.data)) {
                    setBestSelling(bestRes.data);
                    setFeatured(bestRes.data.slice(0, 4));
                }
                if (Array.isArray(newestRes.data)) {
                    setRecentlyAdded(newestRes.data);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching homepage data:', error);
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const categories = [
        { name: 'Design', icon: <PenTool size={20} />, count: '250+', color: 'bg-indigo-50 text-indigo-600' },
        { name: 'Development', icon: <Code size={20} />, count: '450+', color: 'bg-green-50 text-green-600' },
        { name: 'Marketing', icon: <TrendingUp size={20} />, count: '180+', color: 'bg-orange-50 text-orange-600' },
        // { name: 'IT & Software', icon: <Cpu size={20} />, count: '320+', color: 'bg-blue-50 text-blue-600' },
        { name: 'Personal Development', icon: <Target size={20} />, count: '210+', color: 'bg-rose-50 text-rose-600' },
        { name: 'Business', icon: <Briefcase size={20} />, count: '380+', color: 'bg-sky-50 text-sky-600' },
        // { name: 'Photography', icon: <Camera size={20} />, count: '120+', color: 'bg-amber-50 text-amber-600' },
        // { name: 'Health & Fitness', icon: <Heart size={20} />, count: '150+', color: 'bg-red-50 text-red-600' },
        // { name: 'Lifestyle', icon: <Globe size={20} />, count: '90+', color: 'bg-emerald-50 text-emerald-600' },
        // { name: 'Music', icon: <Music size={20} />, count: '110+', color: 'bg-purple-50 text-purple-600' },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
                <p className="font-black text-xs uppercase tracking-[0.2em] text-gray-400">Loading Excellence...</p>
            </div>
        );
    }

    return (
        <div className="bg-white">
            {/* HERO SECTION */}
            <div className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="max-w-xl">
                        <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter leading-[0.9]">
                            Learn with expert anytime <span className="text-orange-500 italic underline decoration-gray-100">anywhere</span>
                        </h1>
                        <p className="text-lg text-gray-500 font-medium mb-10 leading-relaxed max-w-md">
                            Our mission is to help people to find the best course online and learn with expert anytime, anywhere.
                        </p>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/browse')}
                                className="px-10 py-5 bg-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-900 transition-all shadow-xl shadow-orange-100"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                    <div className="relative hidden lg:block">
                        <div className="w-[600px] h-[450px] bg-gray-100 rounded-[3rem] overflow-hidden rotate-3 shadow-2xl relative">
                            {/* Hero Image */}
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <img src={heroImg} alt="Hero" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent"></div>
                        </div>
                        <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 animate-bounce">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Successful</p>
                                    <p className="text-lg font-black text-gray-900">25K+ Students</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50/50 -z-10 rounded-l-[10rem]"></div>
            </div>

            {/* TOP CATEGORIES */}
            <div className="container mx-auto px-4 py-24">
                <h2 className="text-4xl font-black text-gray-900 mb-12 text-center tracking-tight">Browse top category</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {categories.map((cat, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate(`/browse?category=${cat.name}`)}
                            className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all cursor-pointer group text-center"
                        >
                            <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                                {cat.icon}
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1 text-lg">{cat.name}</h3>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{cat.count} Courses</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* BEST SELLING COURSES */}
            <div className="bg-gray-50 py-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Best selling courses</h2>
                        <button
                            onClick={() => navigate('/browse?sort=popularity')}
                            className="text-orange-500 font-bold flex items-center gap-2 hover:translate-x-1 transition-transform"
                        >
                            View All <ChevronRight size={18} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {Array.isArray(bestSelling) && bestSelling.map((course) => (
                            <CourseCard key={course._id} course={course} navigate={navigate} />
                        ))}
                    </div>
                </div>
            </div>

            {/* FEATURED COURSES */}
            <div className="container mx-auto px-4 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {bestSelling.slice(0, 2).map((course, idx) => (
                        <div key={idx} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl flex flex-col md:flex-row group transition-all hover:shadow-2xl hover:shadow-gray-200">
                            <div className="w-full md:w-64 relative bg-gray-200 overflow-hidden shrink-0">
                                <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.title} />
                                <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Featured</div>
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2.5 py-1.5 rounded-full uppercase tracking-widest">
                                        {course.category}
                                    </span>
                                    <span className="text-xl font-black text-gray-900">${course.price}</span>
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-4 h-14 line-clamp-2 leading-tight">{course.title}</h3>
                                <div className="flex items-center gap-2 mb-6 text-yellow-400">
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-sm font-black text-gray-900">{course.rating || '4.8'}</span>
                                    <span className="text-gray-400 font-bold text-xs">({course.numReviews || 0} reviews)</span>
                                </div>
                                <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0 overflow-hidden">
                                            {course.instructor?.avatar && <img src={course.instructor.avatar} alt={course.instructor.name} className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Instructor</p>
                                            <p className="text-sm font-black text-gray-800">{course.instructor?.name || 'Trained Expert'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/course/${course._id}`)}
                                        className="bg-gray-100 hover:bg-orange-500 hover:text-white p-3 rounded-xl transition-all"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RECENTLY ADDED */}
            <div className="bg-white py-24 pt-0">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Recently added courses</h2>
                        <button onClick={() => navigate('/browse?sort=newest')} className="text-orange-500 font-bold hover:translate-x-1 transition-transform">See more</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {Array.isArray(recentlyAdded) && recentlyAdded.map((course) => (
                            <CourseCard key={course._id} course={course} navigate={navigate} />
                        ))}
                    </div>
                </div>
            </div>

            {/* INSTRUCTOR CTA */}
            <div className="container mx-auto px-4 py-24">
                <div className="bg-gray-900 rounded-[3rem] overflow-hidden flex flex-col lg:flex-row relative">
                    <div className="p-16 flex-1">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">Become an instructor</h2>
                        <p className="text-gray-400 text-lg mb-12 max-w-lg leading-relaxed">
                            Join the world's largest online learning marketplace and share your knowledge with millions of students.
                        </p>
                        <button
                            onClick={() => navigate('/become-instructor')}
                            className="bg-orange-500 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white hover:text-orange-500 transition-all shadow-2xl shadow-orange-500/20"
                        >
                            Get Started Now
                        </button>
                    </div>
                    <div className="flex-1 bg-gray-800/50 p-16 grid grid-cols-1 md:grid-cols-2 gap-8 content-center">
                        {[
                            { step: '1', title: 'Plan your curriculum', desc: 'Define your learning objectives and outline your course.' },
                            { step: '2', title: 'Record your video', desc: 'Use professional tools to create high-quality content.' },
                            { step: '3', title: 'Launch your course', desc: 'Publish your course and start reaching students worldwide.' },
                            { step: '4', title: 'Start learning', desc: 'Engage with your students and refine your teaching skills.' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-4">
                                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-black shrink-0">{item.step}</div>
                                <div>
                                    <h4 className="font-bold text-white mb-2">{item.title}</h4>
                                    <p className="text-sm text-gray-500 leading-tight">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* COMPANIES */}
            <div className="container mx-auto px-4 py-24 text-center">
                <p className="text-gray-400 font-black text-sm uppercase tracking-[0.3em] mb-12">6.3k trusted companies around the world</p>
                <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-30 grayscale contrast-125">
                    {['Netflix', 'YouTube', 'Google', 'Lenovo', 'Slack', 'Verizon'].map(brand => (
                        <span key={brand} className="text-2xl font-black text-gray-900 italic tracking-tighter">{brand}</span>
                    ))}
                </div>
            </div>

            {/* FINAL CTA */}
            <div className="bg-gray-900 py-32 mt-24">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
                        Start learning with 67.1k <br /> students around the world.
                    </h2>
                    <div className="flex items-center justify-center gap-6 mt-12">
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-orange-500 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-orange-500/30"
                        >
                            Join the family
                        </button>
                        <button
                            onClick={() => navigate('/browse')}
                            className="px-12 py-5 text-white font-black uppercase tracking-widest text-sm hover:text-orange-500 transition-all"
                        >
                            Browse all courses
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CourseCard = ({ course, navigate }) => (
    <div
        className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 cursor-pointer flex flex-col"
        onClick={() => navigate(`/course/${course._id}`)}
    >
        <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
            <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 text-[9px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-wider shadow-lg">
                {course.level}
            </div>
        </div>
        <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-black text-orange-500 bg-orange-50 px-2.5 py-1.5 rounded-full uppercase tracking-widest">
                    {course.category}
                </span>
            </div>
            <h3 className="font-black text-gray-900 mb-6 line-clamp-2 h-12 leading-tight group-hover:text-orange-500 transition-colors text-base">
                {course.title}
            </h3>
            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center gap-1.5 text-yellow-500">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[10px] font-black text-gray-900">{course.rating || '4.8'}</span>
                    <span className="text-gray-400 text-[10px] lowercase font-bold">({course.numReviews || 0} reviews)</span>
                </div>
                <div className="text-right">
                    <span className="text-xl font-black text-gray-900">${course.price}</span>
                </div>
            </div>
        </div>
    </div>
);

export default HomePage;

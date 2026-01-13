import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { updateProfile } from '../store/slices/authSlice';
import axios from 'axios';
import {
    PlayCircle,
    CheckCircle,
    Clock,
    Users,
    ArrowRight,
    Search,
    User,
    Settings as SettingsIcon,
    Camera,
    Loader2,
    Save
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading } = useSelector((state) => state.auth);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('courses');

    // Profile State
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        setName(user.name);
        setEmail(user.email);
        setAvatar(user.avatar);

        const fetchEnrollments = async () => {
            try {
                const { data } = await axios.get('/api/progress/my-enrollments');
                setEnrollments(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching enrollments:', error);
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, [user, navigate]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const { data } = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAvatar(data.filePath);
            toast.success('Photo uploaded! Save changes to apply.');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Upload failed. Try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            await dispatch(updateProfile({ name, email, avatar })).unwrap();
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error || 'Failed to update profile');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    const filteredEnrollments = enrollments.filter(e =>
        e.course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        {
            label: 'Enrolled Courses',
            count: enrollments.length,
            icon: PlayCircle,
            color: 'bg-orange-50 text-orange-600'
        },
        {
            label: 'Active Courses',
            count: enrollments.filter(e => e.progressPercentage > 0 && e.progressPercentage < 100).length,
            icon: Clock,
            color: 'bg-blue-50 text-blue-600'
        },
        {
            label: 'Completed Courses',
            count: enrollments.filter(e => e.isCompleted).length,
            icon: CheckCircle,
            color: 'bg-green-50 text-green-600'
        },
        {
            label: 'Course Instructors',
            count: [...new Set(enrollments.map(e => e.course.instructor?._id))].filter(Boolean).length,
            icon: Users,
            color: 'bg-purple-50 text-purple-600'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* User Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            <img
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                alt={user.name}
                                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                            {user.role === 'instructor' && (
                                <span className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border-2 border-white">
                                    Instructor
                                </span>
                            )}
                        </div>
                        <div className="text-center md:text-left flex-grow">
                            <h1 className="text-3xl font-black text-gray-900 mb-1">{user.name}</h1>
                            <p className="text-gray-500">{user.role.charAt(0).toUpperCase() + user.role.slice(1)} • {user.email}</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab(activeTab === 'courses' ? 'settings' : 'courses')}
                                className={`${activeTab === 'settings' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-100 shadow-sm'} font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2`}
                            >
                                {activeTab === 'settings' ? 'My Courses' : 'Edit Profile'}
                                {activeTab === 'settings' ? <PlayCircle size={18} /> : <SettingsIcon size={18} />}
                            </button>
                            <Link
                                to="/become-instructor"
                                className="hidden sm:flex bg-orange-50 text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-orange-100 transition-colors items-center gap-2"
                            >
                                Become Instructor <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 mt-8">
                {activeTab === 'courses' ? (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                                    <div className={`${stat.color} p-4 rounded-xl`}>
                                        <stat.icon size={28} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black text-gray-900 leading-none mb-1">{stat.count}</p>
                                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Courses Header & Search */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Let's start learning, {user.name.split(' ')[0]}</h2>
                                <p className="text-gray-500">Pick up where you left off.</p>
                            </div>
                            <div className="relative max-w-md w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search your courses..."
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Courses Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredEnrollments.map((enrollment) => (
                                <div key={enrollment._id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                                    <div className="aspect-video relative overflow-hidden">
                                        <img
                                            src={enrollment.course.thumbnail}
                                            alt={enrollment.course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                                {enrollment.course.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-800 mb-4 line-clamp-2 h-12 leading-tight group-hover:text-orange-500 transition-colors">
                                            {enrollment.course.title}
                                        </h3>

                                        <div className="mb-6">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Progress</span>
                                                <span className="text-sm font-black text-orange-600">{Math.round(enrollment.progressPercentage)}% Finished</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-orange-500 transition-all duration-1000 ease-out"
                                                    style={{ width: `${enrollment.progressPercentage}%` }}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/course/${enrollment.course._id}/player`)}
                                            className={`w-full font-bold py-3 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 ${enrollment.isCompleted && enrollment.isRated
                                                    ? 'bg-green-50 text-green-600 hover:bg-green-500 hover:text-white'
                                                    : enrollment.isCompleted && !enrollment.isRated
                                                        ? 'bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white shadow-lg shadow-orange-100'
                                                        : 'bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white'
                                                }`}
                                        >
                                            {enrollment.isCompleted && enrollment.isRated ? (
                                                <div className="flex items-center gap-2" onClick={(e) => { e.stopPropagation(); navigate(`/course/${enrollment.course._id}/certificate`); }}>
                                                    View Certificate <CheckCircle size={18} />
                                                </div>
                                            ) : enrollment.isCompleted && !enrollment.isRated ? (
                                                'Rate to View Certificate'
                                            ) : enrollment.progressPercentage === 0 ? (
                                                'Start Learning'
                                            ) : (
                                                'Watch Lecture'
                                            )}
                                            {(!enrollment.isCompleted || !enrollment.isRated) && <PlayCircle size={18} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {enrollments.length === 0 && (
                            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-dashed border-gray-300">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <PlayCircle size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No joined courses yet</h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Explore our wide range of courses and start your learning journey today!</p>
                                <Link to="/" className="inline-flex items-center gap-2 bg-orange-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-700 transition-colors">
                                    Explore Courses <ArrowRight size={18} />
                                </Link>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom duration-500">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Profile Settings</h2>
                                    <p className="text-gray-500 font-medium">Keep your account details up to date.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setActiveTab('courses')}
                                        className="text-sm font-bold text-gray-500 hover:text-gray-900 px-4 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isLoading || uploading}
                                        className="bg-orange-500 text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-gray-900 transition-all shadow-xl shadow-orange-100 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        SAVE CHANGES
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Avatar Section */}
                                <div className="flex items-center gap-8">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-3xl bg-gray-50 border border-gray-100 overflow-hidden shadow-inner flex items-center justify-center text-gray-300">
                                            {avatar ? (
                                                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={64} />
                                            )}
                                            {uploading && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                                                    <Loader2 size={32} className="animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        <label className="absolute -bottom-3 -right-3 bg-gray-900 text-white p-3 rounded-2xl cursor-pointer hover:bg-orange-500 transition-all shadow-xl shadow-gray-200">
                                            <Camera size={20} />
                                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                        </label>
                                    </div>
                                    <div className="flex-1 max-w-sm">
                                        <h4 className="font-bold text-gray-900 mb-1">Upload New Photo</h4>
                                        <p className="text-sm text-gray-400 font-medium leading-relaxed italic">Click the camera icon to select a file. Recommended size 400x400px. JPG or PNG.</p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Display Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your full name"
                                            className="w-full p-4 bg-gray-50 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-orange-500 outline-none transition-all ring-1 ring-gray-100"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email address"
                                            className="w-full p-4 bg-gray-50 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-orange-500 outline-none transition-all ring-1 ring-gray-100"
                                        />
                                    </div>
                                </div>

                                <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 flex items-start gap-4">
                                    <div className="bg-white p-2 rounded-xl text-orange-500 shadow-sm border border-orange-50">
                                        <ArrowRight size={20} />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-orange-900 text-sm">Security Tip</h5>
                                        <p className="text-xs text-orange-700 font-medium leading-relaxed mt-1">Make sure to use a professional photo to build trust with instructors and classmates.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

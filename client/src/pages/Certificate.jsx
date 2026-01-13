import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
    Award,
    Download,
    Share2,
    ArrowLeft,
    ShieldCheck,
    Calendar,
    User,
    BookOpen
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Certificate = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, progressRes] = await Promise.all([
                    axios.get(`/api/courses/${courseId}`),
                    axios.get(`/api/progress/${courseId}`)
                ]);

                if (!progressRes.data.isCompleted || !progressRes.data.isRated) {
                    toast.error('Complete and rate the course to view your certificate');
                    navigate(`/course/${courseId}/player`);
                    return;
                }

                setCourse(courseRes.data);
                setEnrollment(progressRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching certificate data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, navigate]);

    const handleDownload = () => {
        window.print(); // Simple way to "download" as PDF via print dialog
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 animate-in fade-in duration-700">
            <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center print:hidden">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={handleDownload}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2 shadow-xl shadow-gray-200"
                    >
                        <Download size={18} /> DOWNLOAD PDF
                    </button>
                    <button className="bg-white border border-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
                        <Share2 size={18} /> SHARE
                    </button>
                </div>
            </div>

            {/* Certificate Card */}
            <div className="max-w-4xl mx-auto bg-white p-1 md:p-2 rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-gray-100">
                {/* Decorative Borders */}
                <div className="absolute inset-4 border-4 border-orange-500/10 rounded-[2rem] pointer-events-none"></div>
                <div className="absolute inset-8 border border-orange-500/20 rounded-[1.5rem] pointer-events-none"></div>

                <div className="relative p-12 md:p-20 bg-white rounded-[2rem] flex flex-col items-center text-center">
                    {/* Logo/Icon */}
                    <div className="w-24 h-24 bg-orange-600 rounded-3xl flex items-center justify-center text-white mb-10 shadow-2xl rotate-3">
                        <Award size={48} />
                    </div>

                    <h1 className="text-gray-400 font-black text-xs uppercase tracking-[0.4em] mb-4">Certificate of Completion</h1>
                    <p className="text-gray-500 font-medium mb-12">This is to certify that</p>

                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 tracking-tighter">
                        {user.name}
                    </h2>

                    <div className="w-32 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mb-8"></div>

                    <p className="text-gray-500 font-medium mb-2 max-w-lg mx-auto leading-relaxed">
                        has successfully completed all the requirements for the course
                    </p>
                    <h3 className="text-2xl md:text-3xl font-black text-gray-800 mb-12 italic">
                        "{course.title}"
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full mt-10 border-t border-gray-100 pt-16">
                        <div className="flex flex-col items-center">
                            <Calendar className="text-orange-500 mb-2" size={20} />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date Issued</p>
                            <p className="font-bold text-gray-900">{new Date(enrollment.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <ShieldCheck className="text-orange-500 mb-2" size={24} />
                            <div className="w-24 h-px bg-gray-200 mb-2"></div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Official Verification</p>
                            <p className="text-[10px] text-gray-300 font-mono">ID: {enrollment._id.substring(0, 8).toUpperCase()}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                <User className="text-gray-400" size={20} />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Instructor</p>
                            <p className="font-bold text-gray-900">{course.instructor?.name || 'Authorized Instructor'}</p>
                        </div>
                    </div>

                    {/* Footer decoration */}
                    <div className="mt-20 flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Joined by 12,000+ students</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Certificate;

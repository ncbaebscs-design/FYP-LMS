import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
    Users,
    BookOpen,
    DollarSign,
    TrendingUp,
    PlusCircle,
    Layout,
    ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const InstructorDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/api/instructor/stats');
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching instructor stats:', error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
    );

    const statCards = [
        { title: 'Total Revenue', value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        { title: 'Total Courses', value: stats?.totalCourses || 0, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        { title: 'Instructor Rating', value: stats?.rating ? stats.rating.toFixed(1) : 'N/A', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Welcome Back, {user?.name.split(' ')[0]}!</h1>
                    <p className="text-gray-500 font-medium">Here's how your courses are performing today.</p>
                </div>
                <Link
                    to="/instructor/create-course"
                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-gray-200"
                >
                    <PlusCircle size={20} />
                    CREATE NEW COURSE
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">{stat.title}</h3>
                        <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Sales */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="font-black text-gray-900 flex items-center gap-2">
                            <DollarSign size={20} className="text-orange-500" />
                            Recent Sales
                        </h2>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last 5 Transactions</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Course</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stats?.recentSales?.length > 0 ? (
                                    stats.recentSales.map((sale) => (
                                        <tr key={sale._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900 text-sm">{sale.user?.name}</td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">{sale.course?.title}</td>
                                            <td className="px-6 py-4 text-gray-400 text-xs">{new Date(sale.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-black text-gray-900 text-sm">${sale.totalPrice?.toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-400 italic">No recent sales found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-orange-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-orange-200 group">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-2">Build Your Audience</h3>
                            <p className="text-orange-100 text-sm mb-6">Create more courses to increase your ranking and revenue.</p>
                            <Link to="/instructor/my-courses" className="inline-block bg-white text-orange-600 px-6 py-3 rounded-2xl font-bold text-xs hover:bg-gray-900 hover:text-white transition-all">
                                MANAGE COURSES
                            </Link>
                        </div>
                        <BookOpen size={120} className="absolute -bottom-4 -right-4 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                            <Layout size={18} className="text-purple-500" />
                            Instructor Resources
                        </h3>
                        <div className="space-y-4">
                            {[
                                'Teaching Center',
                                'Instructor Community',
                                'Success Stories',
                                'Help Center'
                            ].map((item, idx) => (
                                <a key={idx} href="#" className="flex items-center justify-between text-sm text-gray-500 font-medium hover:text-orange-600 group">
                                    {item}
                                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;

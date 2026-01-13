import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Users,
    BookOpen,
    DollarSign,
    TrendingUp,
    ShieldCheck,
    Settings,
    Activity,
    Mail
} from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchAdminStats = async () => {
            try {
                const { data } = await axios.get('/api/admin/stats');
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
                setLoading(false);
            }
        };
        fetchAdminStats();
    }, [user, navigate]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
    );

    const platformCards = [
        { title: 'Total Revenue', value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50' },
        { title: 'Total Courses', value: stats?.totalCourses || 0, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        { title: 'Total Orders', value: stats?.totalOrders || 0, icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Platform Overview</h1>
                        <p className="text-gray-500 font-medium">Control center for your LMS ecosystem.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors shadow-sm">
                        <Settings size={20} />
                    </button>
                    <button className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100">
                        GENERATE REPORT
                    </button>
                </div>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {platformCards.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                            <stat.icon size={24} />
                        </div>
                        <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">{stat.title}</h3>
                        <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* User Management Overview */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <div>
                            <h2 className="font-black text-gray-900 text-xl tracking-tight">Recent Users</h2>
                            <p className="text-gray-400 text-sm font-medium">New members who joined recently.</p>
                        </div>
                        <Link to="/admin/users" className="text-orange-500 font-black text-xs uppercase tracking-widest hover:text-orange-600 transition-colors">
                            VIEW ALL USERS
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">User Profile</th>
                                    <th className="px-8 py-5">Role</th>
                                    <th className="px-8 py-5">Joined Date</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stats?.recentUsers?.map((u) => (
                                    <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-black text-sm">
                                                    {u.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                                                    <p className="text-gray-400 text-xs flex items-center gap-1">
                                                        <Mail size={10} /> {u.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                                                    u.role === 'instructor' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-gray-100 text-gray-500'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-gray-400 text-xs font-medium">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="font-black text-xs text-gray-300 hover:text-gray-900">EDIT</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Health / Quick Links */}
                <div className="space-y-6">
                    <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-2">System Health</h3>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-xs">
                                    <span className="text-indigo-200">Database Connection</span>
                                    <span className="font-black">HEALTHY</span>
                                </div>
                                <div className="w-full bg-indigo-500 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-white w-[98%] h-full shadow-[0_0_8px_white]"></div>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-indigo-200">Storage Usage</span>
                                    <span className="font-black">12%</span>
                                </div>
                                <div className="w-full bg-indigo-500 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-white w-[12%] h-full shadow-[0_0_8px_white]"></div>
                                </div>
                            </div>
                            <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">
                                SYSTEM LOGS
                            </button>
                        </div>
                        <ShieldCheck size={160} className="absolute -bottom-10 -right-10 text-white/10 group-hover:scale-110 transition-transform duration-700" />
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                        <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                            <Settings size={20} className="text-gray-400" />
                            Admin Settings
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Platform Settings', icon: Activity },
                                { label: 'Revenue Controls', icon: DollarSign },
                                { label: 'Course Quality', icon: BookOpen },
                                { label: 'Support Tickets', icon: Mail }
                            ].map((item, idx) => (
                                <button key={idx} className="w-full flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all text-left group">
                                    <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors uppercase tracking-tight">{item.label}</span>
                                    <item.icon size={16} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

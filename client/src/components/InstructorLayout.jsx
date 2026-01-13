import { NavLink, Outlet, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    PlusCircle,
    BookOpen,
    DollarSign,
    Settings,
    LogOut,
    User as UserIcon
} from 'lucide-react';
import { useSelector } from 'react-redux';

const InstructorLayout = () => {
    const { user } = useSelector(state => state.auth);
    const navItems = [
        { path: '/instructor', icon: <LayoutDashboard size={20} />, label: 'Dashboard', end: true },
        { path: '/instructor/create-course', icon: <PlusCircle size={20} />, label: 'Create New Course' },
        { path: '/instructor/my-courses', icon: <BookOpen size={20} />, label: 'My Courses' },
        { path: '/instructor/earnings', icon: <DollarSign size={20} />, label: 'Earnings' },
        { path: '/instructor/settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-orange-500 flex items-center gap-2">
                        <span className="text-white">E-tutor</span>
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-orange-500 text-white shadow-lg'
                                    : 'text-gray-300 hover:bg-gray-800'
                                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
                        <LogOut size={20} />
                        Back to Home
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center px-8">
                    <h2 className="text-xl font-semibold text-gray-800">Instructor Portal</h2>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">Instructor</p>
                        </div>
                        {user?.avatar ? (
                            <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover border border-gray-100" />
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
                                <UserIcon size={20} />
                            </div>
                        )}
                    </div>
                </header>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default InstructorLayout;

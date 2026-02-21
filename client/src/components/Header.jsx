import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../store/slices/authSlice';
import { getCartItems } from '../store/slices/cartSlice';
import { getWishlistItems } from '../store/slices/wishlistSlice';
import { getNotifications, markAsRead } from '../store/slices/notificationSlice';
import {
    Search,
    Bell,
    Heart,
    ShoppingCart,
    ChevronDown,
    GraduationCap,
    Menu,
    X,
    User,
    Check,
    Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { items: cartItems } = useSelector((state) => state.cart);
    const { items: wishlistItems } = useSelector((state) => state.wishlist);
    const { notifications } = useSelector((state) => state.notifications);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const isExcludedPath = location.pathname.startsWith('/instructor') || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

    const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0;

    useEffect(() => {
        if (user) {
            dispatch(getCartItems());
            dispatch(getWishlistItems());
            dispatch(getNotifications());
        }
    }, [dispatch, user]);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    const handleMarkAsRead = (id) => {
        dispatch(markAsRead(id));
    };

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2 shrink-0 group">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-orange-200">
                        <span className="text-white font-black text-xl">E</span>
                    </div>
                    <span className="text-2xl font-black text-gray-900 tracking-tighter">
                        E-tutor
                    </span>
                </Link>

                {/* Browse & Search Section */}
                {!isExcludedPath && (
                    <div className="hidden lg:flex flex-1 items-center gap-4 max-w-xl mx-auto">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="What do you want learn..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (e.target.value.length > 2) {
                                        navigate(`/browse?search=${encodeURIComponent(e.target.value)}`);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
                                    }
                                }}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                            />
                        </div>
                    </div>
                )}

                {/* Right Side Actions */}
                <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden xl:flex items-center gap-1 mr-4 border-r border-gray-100 pr-4">
                        {isExcludedPath && (
                            <button className="p-2 text-gray-400 hover:text-orange-500 transition-all"><Search size={20} /></button>
                        )}

                        <button onClick={() => navigate('/cart')} className="p-2 text-gray-400 hover:text-orange-500 transition-all relative">
                            <ShoppingCart size={20} />
                            {cartItems.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full border border-white"></span>}
                        </button>
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="relative cursor-pointer" onClick={() => navigate('/dashboard')}>
                                {user.avatar ? (
                                    <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm" alt="Profile" />
                                ) : (
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                                        <User size={20} />
                                    </div>
                                )}
                            </div>
                            <button onClick={onLogout} className="text-sm font-black text-gray-500 hover:text-orange-500 transition-all uppercase tracking-widest">Logout</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/register" className="bg-orange-50 text-orange-500 px-6 py-3 rounded-xl text-sm font-black hover:bg-orange-500 hover:text-white transition-all uppercase tracking-widest hidden sm:block">
                                Create Account
                            </Link>
                            <Link to="/login" className="bg-orange-500 text-white px-8 py-3 rounded-xl text-sm font-black hover:bg-gray-900 transition-all shadow-lg shadow-orange-100 uppercase tracking-widest">
                                Sign In
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button className="lg:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100 p-4 space-y-4 animate-in slide-in-from-top duration-300">
                    {!isExcludedPath && (
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-xl text-sm outline-none"
                            />
                        </div>
                    )}
                    <nav className="flex flex-col gap-2">
                        <Link to="/" className="p-3 font-bold text-gray-600 hover:bg-orange-50 hover:text-orange-500 rounded-xl transition-colors">Browse Courses</Link>
                        {user && (
                            <>
                                <Link to="/dashboard" className="p-3 font-bold text-gray-600 hover:bg-orange-50 hover:text-orange-500 rounded-xl transition-colors">My Learning</Link>
                                {user.role === 'instructor' && <Link to="/instructor" className="p-3 font-bold text-gray-600 hover:bg-orange-50 hover:text-orange-500 rounded-xl transition-colors">Instructor Panel</Link>}
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;

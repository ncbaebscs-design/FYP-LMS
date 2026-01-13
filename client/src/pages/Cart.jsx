import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, clearCart } from '../store/slices/cartSlice';
import { Trash2, ShoppingBag, ArrowRight, PlayCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, isLoading } = useSelector((state) => state.cart);

    const total = items.reduce((acc, item) => acc + item.course.price, 0);

    const handleRemove = (id) => {
        dispatch(removeFromCart(id));
        toast.success('Removed from cart');
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag size={40} className="text-gray-300" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added any courses yet. Start exploring and find something you love!</p>
                <Link to="/" className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-xl font-black hover:bg-gray-900 transition-all shadow-xl shadow-orange-100 uppercase tracking-widest text-sm">
                    Browse Courses <ArrowRight size={18} />
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <h1 className="text-4xl font-black text-gray-900 mb-12 flex items-center gap-4">
                Shopping Cart
                <span className="text-lg font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{items.length} items</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    {items.map((item) => (
                        <div key={item._id} className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all group">
                            <div className="w-full sm:w-48 aspect-video rounded-2xl overflow-hidden shrink-0 relative">
                                <img src={item.course.thumbnail} alt={item.course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <PlayCircle className="text-white" size={32} />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-4 mb-2">
                                    <Link to={`/course/${item.course._id}`} className="text-xl font-black text-gray-900 hover:text-orange-500 transition-colors truncate block">
                                        {item.course.title}
                                    </Link>
                                    <button
                                        onClick={() => handleRemove(item._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 font-medium mb-4 line-clamp-2">{item.course.subtitle}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
                                            {item.course.category}
                                        </span>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
                                            {item.course.level}
                                        </span>
                                    </div>
                                    <span className="text-2xl font-black text-gray-900">${item.course.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => dispatch(clearCart())}
                        className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2 mt-4"
                    >
                        <Trash2 size={16} /> Clear all items
                    </button>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-gray-900 text-white p-8 rounded-[2rem] shadow-2xl sticky top-24">
                        <h3 className="text-xl font-black mb-8 border-b border-white/10 pb-4">Order Summary</h3>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-xs">
                                <span>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-xs">
                                <span>Discount</span>
                                <span>$0.00</span>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                <span className="text-lg font-black italic">Total Price</span>
                                <span className="text-4xl font-black text-orange-500">${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            disabled={isLoading}
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-orange-500 hover:bg-white hover:text-orange-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-orange-500/20 text-sm tracking-widest uppercase flex items-center justify-center gap-3 group"
                        >
                            Checkout Now
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

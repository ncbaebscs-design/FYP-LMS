import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { Heart, ShoppingBag, ArrowRight, PlayCircle, ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Wishlist = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.wishlist);
    const { items: cartItems } = useSelector((state) => state.cart);

    const handleRemove = (id) => {
        dispatch(removeFromWishlist(id));
        toast.success('Removed from wishlist');
    };

    const handleAddToCart = async (courseId) => {
        const isInCart = cartItems.some(item => item.course._id === courseId);
        if (isInCart) {
            toast.success('Already in cart');
            return;
        }
        try {
            await dispatch(addToCart(courseId)).unwrap();
            toast.success('Added to cart!');
        } catch (error) {
            toast.error(error || 'Failed to add to cart');
        }
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Heart size={40} className="text-gray-300" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Your wishlist is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Found something interesting? Add it to your wishlist so you don't lose track of it!</p>
                <Link to="/" className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-xl font-black hover:bg-gray-900 transition-all shadow-xl shadow-orange-100 uppercase tracking-widest text-sm">
                    Browse Courses <ArrowRight size={18} />
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <h1 className="text-4xl font-black text-gray-900 mb-12 flex items-center gap-4">
                My Wishlist
                <span className="text-lg font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{items.length} items</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                    <div key={item._id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-gray-100 transition-all group flex flex-col">
                        <div className="aspect-video relative overflow-hidden shrink-0">
                            <img src={item.course.thumbnail} alt={item.course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <PlayCircle className="text-white" size={48} />
                            </div>
                            <button
                                onClick={() => handleRemove(item._id)}
                                className="absolute top-4 right-4 p-2.5 bg-white text-orange-500 rounded-2xl shadow-xl hover:bg-orange-500 hover:text-white transition-all transform hover:-rotate-12"
                            >
                                <Heart size={20} fill="currentColor" />
                            </button>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                    {item.course.category}
                                </span>
                                <span className="text-xl font-black text-gray-900">${item.course.price}</span>
                            </div>
                            <Link to={`/course/${item.course._id}`} className="text-xl font-black text-gray-900 mb-3 hover:text-orange-500 transition-colors line-clamp-2">
                                {item.course.title}
                            </Link>
                            <p className="text-sm text-gray-500 font-medium mb-8 line-clamp-2">{item.course.subtitle}</p>

                            <div className="mt-auto pt-6 border-t border-gray-50 flex gap-3">
                                <button
                                    onClick={() => handleAddToCart(item.course._id)}
                                    className="flex-1 bg-gray-900 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-xl shadow-gray-100"
                                >
                                    <ShoppingCart size={16} /> Add to Cart
                                </button>
                                <Link
                                    to={`/course/${item.course._id}`}
                                    className="p-4 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl transition-all"
                                >
                                    <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;

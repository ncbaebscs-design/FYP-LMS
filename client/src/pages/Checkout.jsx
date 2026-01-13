import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { CreditCard, ShieldCheck, Lock, CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { clearCart } from '../store/slices/cartSlice';

const Checkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items: cartItems } = useSelector((state) => state.cart);

    const [checkoutItems, setCheckoutItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            if (id) {
                // Single course checkout
                try {
                    const { data } = await axios.get(`/api/courses/${id}`);
                    setCheckoutItems([{ course: data, price: data.price }]);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching course:', error);
                    setLoading(false);
                }
            } else {
                // Full cart checkout
                if (cartItems.length > 0) {
                    setCheckoutItems(cartItems.map(item => ({
                        course: item.course,
                        price: item.course.price
                    })));
                }
                setLoading(false);
            }
        };
        fetchItems();
    }, [id, cartItems]);

    const totalPrice = checkoutItems.reduce((acc, item) => acc + item.price, 0);

    const handlePayment = async () => {
        if (checkoutItems.length === 0) return;

        setIsProcessing(true);
        try {
            // 1. Create the order
            const { data: order } = await axios.post('/api/orders', {
                cartItems: checkoutItems,
                totalPrice: totalPrice
            });

            // 2. Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 3. Update order to paid
            await axios.put(`/api/orders/${order._id}/pay`);

            // Clear cart if it was a cart checkout
            if (!id) {
                dispatch(clearCart());
            }

            setIsProcessing(false);
            setIsSuccess(true);

            // 4. Redirect after success message
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);

        } catch (error) {
            console.error('Payment failed:', error);
            setIsProcessing(false);
            alert('Something went wrong with the payment simulation.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (checkoutItems.length === 0 && !isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
                <ShoppingBag size={64} className="text-gray-200 mb-6" />
                <h1 className="text-2xl font-black text-gray-900 mb-2">No items to checkout</h1>
                <p className="text-gray-500 mb-8">Your cart is empty or the course was not found.</p>
                <button onClick={() => navigate('/')} className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold">
                    Browse Courses
                </button>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-white p-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 animate-bounce">
                    <CheckCircle className="text-green-500" size={48} />
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-4 text-center">Payment Successful!</h1>
                <p className="text-xl text-gray-500 text-center mb-12 max-w-md">
                    Welcome to your new courses! You now have full lifetime access. Redirecting to your dashboard...
                </p>
                <div className="w-full max-w-sm space-y-4">
                    {checkoutItems.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                            <img src={item.course.thumbnail} className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                                <p className="text-[10px] font-bold text-orange-500 uppercase">Enrolled In</p>
                                <p className="font-bold text-gray-800 line-clamp-1 text-sm">{item.course.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Left Side: Payment Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h1 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <CreditCard size={28} className="text-orange-500" />
                            Checkout Method
                        </h1>

                        <div className="bg-orange-50 border-2 border-orange-500 p-6 rounded-xl flex items-center gap-4 cursor-default">
                            <div className="w-6 h-6 rounded-full border-4 border-orange-500 ring-2 ring-orange-200"></div>
                            <div className="flex-1">
                                <p className="font-black text-gray-900">Simulated Card Payment</p>
                                <p className="text-xs text-orange-600 font-bold tracking-widest uppercase mt-1">Free Sandbox Mode</p>
                            </div>
                            <CreditCard className="text-gray-400" size={24} />
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Card Holder Name</label>
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 font-medium">Test User</div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Expiry Date</label>
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 font-medium">12 / 29</div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">CVC</label>
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 font-medium">***</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 justify-center opacity-50 grayscale">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-6" alt="Visa" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-8" alt="Mastercard" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-6" alt="Paypal" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Electron.svg" className="h-6" alt="Electron" />
                    </div>
                </div>

                {/* Right Side: Order Summary */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-black text-gray-800 mb-8 pb-4 border-b border-gray-50">Order Summary</h2>

                        <div className="max-h-60 overflow-y-auto space-y-4 mb-8 pr-2 custom-scrollbar">
                            {checkoutItems.map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <img src={item.course.thumbnail} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-orange-500 uppercase mb-1 tracking-wider">{item.course.category}</p>
                                        <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight">{item.course.title}</p>
                                        <p className="mt-1 font-black text-gray-900">${item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="text-gray-900 font-bold">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg pt-6 border-t border-gray-200">
                                <span className="font-black text-gray-800 uppercase">Total</span>
                                <span className="font-black text-orange-500 text-2xl">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full mt-10 bg-orange-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-500/30 hover:bg-orange-600 transition-all flex justify-center items-center gap-3 disabled:bg-orange-300 disabled:scale-95"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    PROCESSING...
                                </>
                            ) : (
                                <>
                                    COMPLETE PURCHASE
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            <ShieldCheck size={14} className="text-green-500" />
                            30-Day Money Back Guarantee
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-400 text-sm justify-center">
                        <Lock size={16} />
                        <span>Secure SSL Encryption</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;

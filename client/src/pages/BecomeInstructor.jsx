import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { becomeInstructor } from '../store/slices/authSlice';
import {
    Award,
    Rocket,
    Globe,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';

const BecomeInstructor = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user && user.role === 'instructor') {
            navigate('/instructor');
        }
    }, [user, navigate]);

    const handleBecomeInstructor = () => {
        dispatch(becomeInstructor());
    };

    const benefits = [
        { icon: Award, title: 'Teach Your Way', desc: 'Publish the course you want, in the way you want, and always have control of your own content.' },
        { icon: Rocket, title: 'Inspire Learners', desc: 'Teach what you know and help learners explore their interests, gain new skills, and advance.' },
        { icon: Globe, title: 'Get Rewarded', desc: 'Expand your professional network, build your expertise, and earn money on each enrollment.' },
    ];

    return (
        <div className="min-h-screen bg-white animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="relative bg-gray-900 py-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500 skew-x-12 translate-x-32 opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                        Come teach <span className="text-orange-500 font-outline-2">with us</span>
                    </h1>
                    <p className="text-gray-400 text-xl font-medium mb-10 leading-relaxed">
                        Become an instructor and change lives — including your own. Join the world's largest online learning marketplace.
                    </p>
                    <button
                        onClick={handleBecomeInstructor}
                        className="bg-orange-500 text-white px-10 py-5 rounded-3xl text-xl font-black hover:bg-white hover:text-gray-900 transition-all shadow-2xl shadow-orange-500/20 flex items-center gap-3 mx-auto group"
                    >
                        GET STARTED <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Benefits Grid */}
            <div className="container mx-auto px-4 py-24 max-w-6xl">
                <h2 className="text-4xl font-black text-center text-gray-900 mb-16 tracking-tight">So many reasons to start</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {benefits.map((b, idx) => (
                        <div key={idx} className="text-center group">
                            <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-orange-500 mx-auto mb-8 group-hover:scale-110 transition-transform group-hover:bg-orange-500 group-hover:text-white border border-orange-100 shadow-sm">
                                <b.icon size={36} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tighter">{b.title}</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-50 py-24 border-y border-gray-100">
                <div className="container mx-auto px-4 text-center max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-6">
                        <CheckCircle2 size={14} /> SIMPLE 2-STEP PROCESS
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">You won’t have to do it alone</h2>
                    <p className="text-gray-500 font-medium mb-10 text-lg">
                        Our Instructor Support Team is here to help you through the process and provide tips along the way.
                    </p>
                    <button
                        onClick={handleBecomeInstructor}
                        className="bg-gray-900 text-white px-10 py-5 rounded-3xl text-lg font-black hover:bg-orange-600 transition-all"
                    >
                        AGREE & BECOME INSTRUCTOR
                    </button>
                    <p className="mt-6 text-xs text-gray-400 font-bold uppercase tracking-widest">
                        By clicking, you agree to our Instructor Terms & Conditions.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BecomeInstructor;

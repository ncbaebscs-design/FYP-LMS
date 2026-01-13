import React from 'react';
import { Link } from 'react-router-dom';
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    MapPin,
    Phone,
    Mail,
    Apple,
    Play
} from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 pt-24 pb-12 border-t border-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                                <span className="text-white font-black text-xl">E</span>
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter">E-tutor</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Empowering learners worldwide through high-quality online courses taught by industry leading experts.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links: Top Categories */}
                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Top Category</h4>
                        <ul className="space-y-4">
                            {['Design', 'Development', 'Marketing', 'Business', 'Lifestyle', 'Photography'].map((item) => (
                                <li key={item}>
                                    <Link to={`/browse?category=${item}`} className="text-gray-400 hover:text-orange-500 transition-colors text-sm font-medium">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links: Support */}
                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Quick Links</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Contact', 'Become Instructor', 'Terms & Conditions', 'Privacy Policy', 'Help Center'].map((item) => (
                                <li key={item}>
                                    <Link to="/" className="text-gray-400 hover:text-orange-500 transition-colors text-sm font-medium">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Download App */}
                    <div className="space-y-8">
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Download Our App</h4>
                        <div className="space-y-4">
                            <button className="w-full bg-gray-800 hover:bg-white hover:text-gray-900 text-white p-4 rounded-2xl flex items-center gap-4 transition-all group">
                                <Apple size={28} className="group-hover:text-gray-900" />
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">Download on the</p>
                                    <p className="text-lg font-black leading-none mt-1">App Store</p>
                                </div>
                            </button>
                            <button className="w-full bg-gray-800 hover:bg-white hover:text-gray-900 text-white p-4 rounded-2xl flex items-center gap-4 transition-all group">
                                <Play size={28} className="group-hover:text-gray-900" />
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">Get it on</p>
                                    <p className="text-lg font-black leading-none mt-1">Google Play</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-gray-500 text-xs font-medium">
                        © {new Date().getFullYear()} <span className="text-white">E-tutor</span>. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8 text-[11px] font-black text-gray-500 uppercase tracking-widest">
                        <Link to="/" className="hover:text-white transition-colors">Cookies</Link>
                        <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/" className="hover:text-white transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

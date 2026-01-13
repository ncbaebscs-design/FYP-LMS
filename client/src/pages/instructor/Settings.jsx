import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../../store/slices/authSlice';
import axios from 'axios';
import {
    User as UserIcon,
    Bell,
    Shield,
    CreditCard,
    Save,
    Camera,
    Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Settings = () => {
    const dispatch = useDispatch();
    const { user, isLoading } = useSelector((state) => state.auth);

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatar(user.avatar);
        }
    }, [user]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const { data } = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAvatar(data.filePath);
            toast.success('Photo uploaded! Save changes to apply.');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Upload failed. Try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            await dispatch(updateProfile({ name, email, avatar })).unwrap();
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error || 'Failed to update profile');
        }
    };

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Instructor Settings</h1>
                <p className="text-gray-500 font-medium">Manage your educational profile and preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Tabs Sidebar */}
                <div className="space-y-4">
                    {[
                        { label: 'Profile', icon: UserIcon, active: true },
                        { label: 'Notifications', icon: Bell },
                        { label: 'Privacy', icon: Shield },
                        { label: 'Payouts', icon: CreditCard }
                    ].map((tab, idx) => (
                        <button
                            key={idx}
                            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${tab.active ? 'bg-orange-500 text-white shadow-xl shadow-orange-100' : 'bg-white text-gray-400 hover:text-gray-900 border border-gray-50'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Form Area */}
                <div className="md:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-6 pb-6 border-b border-gray-50">
                            <div className="relative group">
                                <div className="w-24 h-24 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-500 overflow-hidden">
                                    {avatar ? (
                                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon size={48} />
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                                            <Loader2 size={24} className="animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 bg-gray-900 text-white p-2 rounded-xl cursor-pointer hover:bg-orange-500 transition-colors shadow-lg shadow-gray-200">
                                    <Camera size={16} />
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                </label>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Profile Photo</h4>
                                <p className="text-gray-400 text-xs font-medium italic">Click the camera icon to upload. Max size 5MB.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Display Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your full name"
                                    className="w-full p-4 bg-gray-50 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-orange-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    className="w-full p-4 bg-gray-50 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-orange-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Teaching Bio</label>
                            <textarea rows="4" placeholder="Tell students about your expertise..." className="w-full p-6 bg-gray-50 border-transparent rounded-3xl font-medium text-gray-600 focus:bg-white focus:border-orange-500 outline-none transition-all resize-none"></textarea>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleSave}
                                disabled={isLoading || uploading}
                                className="inline-flex items-center gap-2 bg-orange-500 text-white px-10 py-5 rounded-2xl font-black text-sm hover:bg-gray-900 transition-all shadow-xl shadow-orange-100 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                SAVE CHANGES
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

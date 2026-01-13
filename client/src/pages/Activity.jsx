import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Bell,
    CheckCircle,
    MessageCircle,
    ArrowRight,
    Clock,
    Trash2,
    Calendar,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Activity = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const { data } = await axios.get('/api/notifications');
            setActivities(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching activities:', error);
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`/api/notifications/${id}`);
            setActivities(activities.map(act => act._id === id ? { ...act, isRead: true } : act));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const clearAll = async () => {
        try {
            await axios.delete('/api/notifications');
            setActivities([]);
        } catch (error) {
            console.error('Error clearing activities:', error);
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'info':
                return <MessageCircle className="text-blue-500" size={20} />;
            case 'warning':
                return <Bell className="text-orange-500" size={20} />;
            default:
                return <Bell className="text-gray-500" size={20} />;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p className="font-bold text-xs uppercase tracking-widest">Loading Activity Feed...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Recent Activity</h1>
                    <p className="text-gray-500 font-medium">Keep track of your learning journey and community interactions.</p>
                </div>
                {activities.length > 0 && (
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={16} /> Clear All
                    </button>
                )}
            </div>

            {activities.length > 0 ? (
                <div className="space-y-6">
                    {activities.map((activity) => (
                        <div
                            key={activity._id}
                            onClick={() => !activity.isRead && markAsRead(activity._id)}
                            className={`group relative bg-white p-6 rounded-[2rem] border transition-all hover:shadow-2xl hover:shadow-gray-100 flex gap-6 ${activity.isRead ? 'border-gray-50 opacity-75' : 'border-orange-100 shadow-sm border-l-4 border-l-orange-500'}`}
                        >
                            <div className={`p-4 rounded-2xl h-fit ${activity.isRead ? 'bg-gray-50' : 'bg-orange-50'}`}>
                                {getActivityIcon(activity.type)}
                            </div>

                            <div className="flex-grow">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className={`font-black tracking-tight ${activity.isRead ? 'text-gray-700' : 'text-gray-900 text-lg'}`}>
                                        {activity.title}
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <Clock size={12} />
                                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                        </div>
                                        {!activity.isRead && <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>}
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm font-medium mb-4 leading-relaxed">
                                    {activity.message}
                                </p>

                                {activity.link && (
                                    <a
                                        href={activity.link}
                                        className="inline-flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-widest hover:text-gray-900 transition-colors group-hover:translate-x-1 transition-transform"
                                    >
                                        View Details <ChevronRight size={14} />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Calendar size={32} className="text-gray-200" />
                    </div>
                    <p className="text-gray-400 font-black text-xs uppercase tracking-widest">No activities recorded yet</p>
                    <p className="text-gray-400 text-sm mt-2">Start learning or join the discussion to see updates here!</p>
                </div>
            )}
        </div>
    );
};

export default Activity;

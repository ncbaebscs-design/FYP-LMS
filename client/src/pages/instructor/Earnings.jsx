import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    DollarSign,
    ArrowUpRight,
    CreditCard,
    Download,
    History,
    ChevronRight,
    Loader2
} from 'lucide-react';

const Earnings = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const { data } = await axios.get('/api/instructor/earnings');
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching earnings:', error);
                setLoading(false);
            }
        };
        fetchEarnings();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p className="font-bold text-xs uppercase tracking-widest">Loading Financial Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Financial Overview</h1>
                <p className="text-gray-500 font-medium">Manage your earnings and payout methods.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Balance</p>
                            <p className="text-3xl font-black text-gray-900 font-mono">${stats?.balance?.toFixed(2)}</p>
                        </div>
                    </div>
                    <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-gray-200">
                        WITHDRAW FUNDS
                    </button>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Lifetime Earnings</p>
                        <p className="text-3xl font-black text-gray-900 mb-4">${stats?.totalEarnings?.toFixed(2)}</p>
                        <div className="inline-flex items-center gap-1 text-green-500 font-bold text-xs">
                            <ArrowUpRight size={14} /> +0% THIS MONTH
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Payout Method</p>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-4">
                        <div className="bg-white p-2 rounded-lg border border-gray-100">
                            <CreditCard size={20} className="text-gray-400" />
                        </div>
                        <p className="font-bold text-gray-600 text-sm italic">No method linked</p>
                    </div>
                    <button className="text-orange-600 font-black text-xs uppercase tracking-widest hover:text-gray-900 transition-colors">
                        ADD PAYOUT METHOD
                    </button>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="font-black text-gray-900 text-xl tracking-tight">Recent Sales</h2>
                    <button className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-900">
                        <Download size={16} /> EXPORT CSV
                    </button>
                </div>

                {stats?.recentTransactions?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stats.recentTransactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-gray-900 text-sm">{tx.courseTitle}</p>
                                            <p className="text-[10px] text-gray-400 font-mono">{tx._id}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-medium text-gray-600">{tx.studentName}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm text-gray-500 font-medium">
                                                {new Date(tx.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-black text-green-600">+${tx.amount.toFixed(2)}</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-400 italic">
                        <DollarSign size={48} className="mx-auto text-gray-100 mb-4" />
                        No transactions recorded yet. Keep building your course to start earning!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Earnings;

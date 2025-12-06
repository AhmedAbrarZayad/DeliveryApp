import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../Hooks/useAuth';
import { useOutletContext } from 'react-router';

const History = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { isDarkMode } = useOutletContext();

    const { data: history = [], isLoading } = useQuery({
        queryKey: ['paymentHistory', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user?.email}`);
            return res.data;
        }
    });

    if (isLoading) {
        return (
            <div className={`min-h-screen flex justify-center items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Loading payment history...
            </div>
        );
    }


    return (
        <div className={`min-h-screen py-10 px-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto">
                <h1 className={`text-3xl font-bold mb-8 border-l-4 border-green-500 pl-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Payment History
                </h1>

                {history.length === 0 ? (
                    <div className={`flex flex-col items-center justify-center p-10 rounded-2xl shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No payments found.</p>
                    </div>
                ) : (
                    <div className={`overflow-hidden rounded-2xl shadow-xl border backdrop-blur-sm ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className={`uppercase tracking-wider font-semibold border-b ${isDarkMode ? 'bg-gray-900/80 text-gray-200 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                    <tr>
                                        <th className="px-6 py-4">Transaction ID / Parcel</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Customer Email</th>
                                        <th className="px-6 py-4">Date</th>
                                    </tr>
                                </thead>

                                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {history.map(payment => (
                                        <tr
                                            key={payment._id}
                                            className={`transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className={`font-medium text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {payment.transactionId}
                                                    </span>
                                                    <span className={`text-xs font-mono mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                        Parcel: {payment.parcelId}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`
                                                    inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                                                    ${payment.paymentStatus === "paid"
                                                        ? isDarkMode ? "bg-green-900/30 text-green-300 border-green-800" : "bg-green-50 text-green-700 border-green-200"
                                                        : isDarkMode ? "bg-yellow-900/30 text-yellow-300 border-yellow-800" : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                    }
                                                `}>
                                                    {payment.paymentStatus.toUpperCase()}
                                                </span>
                                            </td>

                                            <td className={`px-6 py-4 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                                ${payment.amount} <span className="text-xs text-gray-500 font-normal">{payment.currency?.toUpperCase()}</span>
                                            </td>

                                            <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {payment.customerEmail}
                                            </td>

                                            <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {new Date(payment.paymentDate).toLocaleString(undefined, {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short'
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

};

export default History;

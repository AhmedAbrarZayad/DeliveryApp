import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../Hooks/useAuth';

const History = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: history = [], isLoading } = useQuery({
        queryKey: ['paymentHistory', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user?.email}`);
            return res.data;
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-gray-700 dark:text-gray-300">
                Loading payment history...
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-10 px-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 border-l-4 border-green-500 pl-4">
                    Payment History
                </h1>

                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                        <p className="text-gray-600 dark:text-gray-300 text-lg">No payments found.</p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 dark:bg-gray-900/80 text-gray-600 dark:text-gray-200 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4">Transaction ID / Parcel</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Customer Email</th>
                                        <th className="px-6 py-4">Date</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {history.map(payment => (
                                        <tr
                                            key={payment._id}
                                            className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900 dark:text-white text-base">
                                                        {payment.transactionId}
                                                    </span>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">
                                                        Parcel: {payment.parcelId}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`
                                                    inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                                                    ${payment.paymentStatus === "paid"
                                                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                                                        : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800"
                                                    }
                                                `}>
                                                    {payment.paymentStatus.toUpperCase()}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 font-semibold text-gray-800 dark:text-white">
                                                ${payment.amount} <span className="text-xs text-gray-500 font-normal">{payment.currency?.toUpperCase()}</span>
                                            </td>

                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                                                {payment.customerEmail}
                                            </td>

                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
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

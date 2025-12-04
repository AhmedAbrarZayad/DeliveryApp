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
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 py-10 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-8">
                    Payment History
                </h1>

                {history.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-300 text-center">
                        No payments found.
                    </p>
                ) : (
                    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-300 dark:border-slate-700">
                        <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                            <thead className="bg-gray-200 dark:bg-slate-800 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-3 text-left">Transaction ID</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Amount</th>
                                    <th className="px-4 py-3 text-left">Customer Email</th>
                                    <th className="px-4 py-3 text-left">Parcel ID</th>
                                    <th className="px-4 py-3 text-left">Payment Date</th>
                                    <th className="px-4 py-3 text-left">Record ID</th>
                                </tr>
                            </thead>

                            <tbody>
                                {history.map(payment => (
                                    <tr 
                                        key={payment._id} 
                                        className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                                    >
                                        <td className="px-4 py-3">{payment.transactionId}</td>

                                        <td className="px-4 py-3">
                                            <span className={`
                                                text-xs px-2 py-1 rounded-full
                                                ${payment.paymentStatus === "paid"
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                                                }
                                            `}>
                                                {payment.paymentStatus}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            ${payment.amount} {payment.currency?.toUpperCase()}
                                        </td>

                                        <td className="px-4 py-3">{payment.customerEmail}</td>

                                        <td className="px-4 py-3">{payment.parcelId}</td>

                                        <td className="px-4 py-3">
                                            {new Date(payment.paymentDate).toLocaleString()}
                                        </td>

                                        <td className="px-4 py-3">{payment._id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );

};

export default History;

import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useAuth } from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import Swal from 'sweetalert2';
import { NavLink } from 'react-router';

const MyParcels = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: parcels = [], isLoading, refetch } = useQuery({
        queryKey: ['myParcels', user?.displayName],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?senderName=${user?.displayName}`);
            return res.data;
        }
    });

    const handleEdit = (id) => {
        console.log("Edit:", id);
    };

    const handleDelete = (id) => {
        console.log("Delete:", id);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/parcels/${id}`)
                    .then(res => {
                        console.log('Parcel deleted successfully:', res.data);
                        if (res.data.deletedCount > 0) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });
                        }
                    })
            }
        });
    };

    const handleView = (id) => {
        console.log("View details:", id);
    };

    if (isLoading) {
        return (
            <div className="text-center py-10">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-10 px-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white border-l-4 border-blue-500 pl-4">
                        My Parecels
                    </h2>
                    <NavLink
                        to="/dashboard/add-parcel"
                        className="btn btn-primary btn-sm md:btn-md shadow-lg text-white gap-2 normal-case"
                    >
                        <span>+</span> Book New Parcel
                    </NavLink>
                </div>

                {parcels.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No parcels found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't booked any parcels yet.</p>
                        <NavLink to="/dashboard/add-parcel" className="text-blue-600 hover:underline">
                            Book your first parcel now &rarr;
                        </NavLink>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 dark:bg-gray-900/80 text-gray-600 dark:text-gray-200 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4">#</th>
                                        <th className="px-6 py-4">Parcel Details</th>
                                        <th className="px-6 py-4">Receiver</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Est. Cost</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {parcels.map((p, index) => (
                                        <tr
                                            key={p._id}
                                            className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="px-6 py-4 text-gray-400 dark:text-gray-500 font-mono">
                                                {index + 1}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900 dark:text-white capitalize flex items-center gap-2">
                                                        {p.packageType}
                                                        {p.isFragile && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded border border-red-200" title="Fragile">⚠️ Fragile</span>}
                                                    </span>
                                                    <span className="text-xs text-xs text-gray-500 mt-1">
                                                        {p.weight}kg • {p.deliverySpeed}
                                                    </span>
                                                    <span className="text-xs text-gray-400 mt-0.5">
                                                        Created: {new Date(p.createdAt || Date.now()).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-800 dark:text-gray-200">{p.receiverName}</span>
                                                    <span className="text-xs text-gray-500">{p.receiverPhone}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center w-2 h-2 rounded-full ${p.deliveryStatus === 'delivered' ? 'bg-green-500' :
                                                            p.deliveryStatus === 'in-transit' ? 'bg-blue-500' :
                                                                p.deliveryStatus === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                                                        }`}></span>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                                        {p.deliveryStatus || 'Pending'}
                                                    </span>
                                                </div>

                                                {/* Payment Status Badge */}
                                                <div>
                                                    {(p.paymentMethod === 'cod-sender' || p.paymentMethod === 'cod-receiver') ? (
                                                        <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800">
                                                            {p.paymentMethod === 'cod-sender' ? 'COD (You)' : 'COD (Receiver)'}
                                                        </span>
                                                    ) : p.paymentStatus === "paid" ? (
                                                        <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                                                            PAID
                                                        </span>
                                                    ) : (
                                                        <NavLink
                                                            to={`payment/${p._id}`}
                                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
                                                        >
                                                            Pay Now &rarr;
                                                        </NavLink>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 font-semibold text-gray-800 dark:text-white">
                                                ${p.calculatedPrice.toFixed(2)}
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleView(p._id)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors" title="View Details">
                                                        <FiSearch size={18} />
                                                    </button>

                                                    {p.deliveryStatus === 'pending' && (
                                                        <>
                                                            <button onClick={() => handleEdit(p._id)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Edit Parcel">
                                                                <FiEdit size={18} />
                                                            </button>
                                                            <button onClick={() => handleDelete(p._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Cancel/Delete">
                                                                <FiTrash2 size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
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

export default MyParcels;

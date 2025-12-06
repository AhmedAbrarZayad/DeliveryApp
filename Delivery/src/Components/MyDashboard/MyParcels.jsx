import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useAuth } from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import Swal from 'sweetalert2';
import { NavLink, useOutletContext } from 'react-router';

const MyParcels = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { isDarkMode } = useOutletContext();

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
        <div className={`min-h-screen py-10 px-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className={`text-3xl font-bold border-l-4 border-blue-500 pl-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
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
                    <div className={`flex flex-col items-center justify-center p-16 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>No parcels found</h3>
                        <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>You haven't booked any parcels yet.</p>
                        <NavLink to="/dashboard/add-parcel" className="text-blue-600 hover:underline">
                            Book your first parcel now &rarr;
                        </NavLink>
                    </div>
                ) : (
                    <div className={`overflow-hidden rounded-2xl shadow-xl border ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'} backdrop-blur-sm`}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className={`uppercase tracking-wider font-semibold border-b ${isDarkMode ? 'bg-gray-900/80 text-gray-200 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                    <tr>
                                        <th className="px-6 py-4">#</th>
                                        <th className="px-6 py-4">Parcel Details</th>
                                        <th className="px-6 py-4">Receiver</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Est. Cost</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {parcels.map((p, index) => (
                                        <tr
                                            key={p._id}
                                            className={`transition-colors group ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                                        >
                                            <td className={`px-6 py-4 font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {index + 1}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className={`font-medium capitalize flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {p.packageType}
                                                        {p.isFragile && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded border border-red-200" title="Fragile">⚠️ Fragile</span>}
                                                    </span>
                                                    <span className="text-xs text-gray-500 mt-1">
                                                        {p.weight}kg • {p.deliverySpeed}
                                                    </span>
                                                    <span className="text-xs text-gray-400 mt-0.5">
                                                        Created: {new Date(p.createdAt || new Date()).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{p.receiverName}</span>
                                                    <span className="text-xs text-gray-500">{p.receiverPhone}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center w-2 h-2 rounded-full ${p.deliveryStatus === 'delivered' ? 'bg-green-500' :
                                                            p.deliveryStatus === 'in-transit' ? 'bg-blue-500' :
                                                                p.deliveryStatus === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                                                        }`}></span>
                                                    <span className={`text-sm font-medium capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {p.deliveryStatus || 'Pending'}
                                                    </span>
                                                </div>

                                                {/* Payment Status Badge */}
                                                <div>
                                                    {(p.paymentMethod === 'cod-sender' || p.paymentMethod === 'cod-receiver') ? (
                                                        <span className={`text-xs px-2 py-1 rounded border ${isDarkMode ? 'bg-orange-900/30 text-orange-300 border-orange-800' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                                                            {p.paymentMethod === 'cod-sender' ? 'COD (You)' : 'COD (Receiver)'}
                                                        </span>
                                                    ) : p.paymentStatus === "paid" ? (
                                                        <span className={`text-xs px-2 py-1 rounded border ${isDarkMode ? 'bg-green-900/30 text-green-300 border-green-800' : 'bg-green-100 text-green-700 border-green-200'}`}>
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

                                            <td className={`px-6 py-4 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                                ${p.calculatedPrice.toFixed(2)}
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => handleView(p._id)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-500 hover:text-green-600 hover:bg-green-900/30' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'}`} title="View Details">
                                                        <FiSearch size={18} />
                                                    </button>

                                                    {p.deliveryStatus === 'pending' && (
                                                        <>
                                                            <button onClick={() => handleEdit(p._id)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-500 hover:text-blue-600 hover:bg-blue-900/30' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`} title="Edit Parcel">
                                                                <FiEdit size={18} />
                                                            </button>
                                                            <button onClick={() => handleDelete(p._id)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-500 hover:text-red-600 hover:bg-red-900/30' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`} title="Cancel/Delete">
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

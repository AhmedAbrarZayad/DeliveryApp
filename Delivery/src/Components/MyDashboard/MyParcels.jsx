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
                    if(res.data.deletedCount > 0){
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
        // navigate(`/dashboard/parcel/${id}`);
    };

    if (isLoading) {
        return (
            <div className="text-center py-10">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Parcels</h2>

            {parcels.length === 0 ? (
                <p className="text-gray-400 text-center py-10">No parcels found.</p>
            ) : (
                <div className="overflow-x-auto shadow rounded-lg">
                    <table className="table table-zebra w-full">
                        <thead className="bg-slate-800 text-white">
                            <tr>
                                <th>#</th>
                                <th>Receiver</th>
                                <th>Pickup Address</th>
                                <th>Delivery Address</th>
                                <th>Package Type</th>
                                <th>Weight</th>
                                <th>Dimensions (L×W×H)</th>
                                <th>Fragile</th>
                                <th>Hazardous</th>
                                <th>Speed</th>
                                <th>Payment</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {parcels.map((p, index) => (
                                <tr key={p._id}>
                                    <td>{index + 1}</td>

                                    <td>
                                        <div>
                                            <p className="font-semibold">{p.receiverName}</p>
                                            <span className="text-sm text-gray-500">
                                                {p.receiverPhone}
                                            </span>
                                        </div>
                                    </td>

                                    <td>{p.pickupAddress}</td>
                                    <td>{p.deliveryAddress}</td>
                                    <td className="capitalize">{p.packageType}</td>
                                    <td>{p.weight} kg</td>
                                    <td>{p.length} × {p.width} × {p.height} cm</td>

                                    <td>
                                        {p.isFragile ? (
                                            <span className="text-red-500 font-semibold">Yes</span>
                                        ) : (
                                            <span className="text-gray-400">No</span>
                                        )}
                                    </td>

                                    <td>
                                        {p.isHazardous ? (
                                            <span className="text-red-500 font-semibold">Yes</span>
                                        ) : (
                                            <span className="text-gray-400">No</span>
                                        )}
                                    </td>

                                    <td className="capitalize">{p.deliverySpeed}</td>

                                    {/* ⭐ Payment Status Column Updated */}
                                    <td className="uppercase">
                                        {(p.paymentMethod === 'cod-sender' || p.paymentMethod === 'cod-receiver') ? (
                                            <span className="px-2 py-1 rounded-md text-xs font-semibold bg-yellow-500 text-white">
                                                {p.paymentMethod.toUpperCase()}
                                            </span>
                                        ) : p.paymentStatus === "paid" ? (
                                            <span className="px-2 py-1 rounded-md text-xs font-semibold bg-green-600 text-white">
                                                PAID
                                            </span>
                                        ) : (
                                            <NavLink 
                                                to={`payment/${p._id}`} 
                                                className="btn btn-sm btn-primary text-white"
                                            >
                                                Pay Now
                                            </NavLink>
                                        )}
                                    </td>

                                    <td>${p.calculatedPrice.toFixed(2)}</td>

                                    <td className="flex items-center gap-3">
                                        <button onClick={() => handleView(p._id)} className="text-green-500 hover:text-green-700">
                                            <FiSearch size={18} />
                                        </button>
                                        <button onClick={() => handleEdit(p._id)} className="text-blue-500 hover:text-blue-700">
                                            <FiEdit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700">
                                            <FiTrash2 size={18} />
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}
        </div>
    );
};

export default MyParcels;

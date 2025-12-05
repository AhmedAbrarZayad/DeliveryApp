import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useAuth } from '../../Hooks/useAuth';

const ApproveRiders = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { data: riders = [], isLoading } = useQuery({
        queryKey: ['riders', 'pending'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders?status=pending');
            return res.data;
        }
    });

    console.log('Pending Riders:', user);
    const handleApprove = async (id, email) => {
        await axiosSecure.patch(`/riders/${id}`, {email: email, status: 'approved' })
        .then((res) => {
            if(res.data.modifiedCount){
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Rider Approved Successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });
                queryClient.invalidateQueries(['riders', 'pending']);

            }
        })
    };

    const handleReject = async (id, email) => {
        await axiosSecure.patch(`/riders/${id}`, {email: email, status: 'rejected' })
        .then((res) => {
            if(res.data.modifiedCount){
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Rider Rejected Successfully!',
                    showConfirmButton: false,
                    timer: 1500
                })
                queryClient.invalidateQueries(['riders', 'pending']);

            }
        })
    };

    if (isLoading) return <p>Loading riders...</p>;

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Pending Riders</h2>
            {riders.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No pending riders</p>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {riders.map(rider => (
                        <div
                            key={rider._id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                backgroundColor: '#f9f9f9',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div>
                                <p style={{ margin: '0.2rem 0', fontWeight: 'bold' }}>{rider.fullName}</p>
                                <p style={{ margin: '0.2rem 0', color: '#555' }}>{rider.email}</p>
                                <p style={{ margin: '0.2rem 0', color: '#555' }}>{rider.phone}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => handleApprove(rider._id, rider.email)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        border: 'none',
                                        borderRadius: '5px',
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(rider._id, rider.email)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        border: 'none',
                                        borderRadius: '5px',
                                        backgroundColor: '#f44336',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApproveRiders;

import React from 'react';
import { useOutletContext } from 'react-router';
import { useAuth } from '../../Hooks/useAuth';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const BeARider = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            fullName: user?.displayName || "",
            email: user?.email || "",
            phone: "",
            address: "",
            nidNumber: "",
            drivingLicense: "",
            vehicleType: "",
            vehicleNumber: "",
            experience: "",
            emergencyContact: ""
        }
    });

    const { isDarkMode } = useOutletContext();

    const onSubmit = (data) => {
        console.log("Form Data:", data);
        axiosSecure.post('/rider', data)
            .then(res => {
                if (res.data.insertedId) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Application Submitted Successfully!',
                        showConfirmButton: false,
                        timer: 1500,
                        background: isDarkMode ? '#1f2937' : '#fff',
                        color: isDarkMode ? '#fff' : '#545454',
                    })
                    reset();
                }
            })
    };

    return (
        <div className={`min-h-screen flex items-center justify-center py-12 px-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
            <div className={`w-full max-w-2xl backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-100'} border`}>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Become a Rider</h1>
                    <p className="text-blue-100 opacity-90">Join our delivery network and start earning today</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                            <input
                                type="text"
                                {...register("fullName", { required: "Full name is required" })}
                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${isDarkMode ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-gray-200 bg-gray-50 text-gray-800'}`}
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                            <input
                                type="email"
                                {...register("email", { required: true })}
                                defaultValue={user?.email || ""}
                                readOnly
                                className={`w-full px-4 py-3 rounded-xl border cursor-not-allowed ${isDarkMode ? 'border-gray-600 bg-gray-700/30 text-gray-400' : 'border-gray-200 bg-gray-100 text-gray-500'}`}
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number</label>
                            <input
                                type="tel"
                                {...register("phone", { required: true })}
                                placeholder="01XXXXXXXXX"
                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${isDarkMode ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-gray-200 bg-gray-50 text-gray-800'}`}
                            />
                        </div>

                        {/* Vehicle Type */}
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Vehicle Type</label>
                            <select
                                {...register("vehicleType", { required: true })}
                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${isDarkMode ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-gray-200 bg-gray-50 text-gray-800'}`}
                            >
                                <option value="">Select vehicle type</option>
                                <option value="bike">Bike</option>
                                <option value="scooter">Scooter</option>
                                <option value="bicycle">Bicycle</option>
                            </select>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Address</label>
                        <input
                            type="text"
                            {...register("address", { required: true })}
                            placeholder="Your full address"
                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${isDarkMode ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-gray-200 bg-gray-50 text-gray-800'}`}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* NID */}
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>NID Number</label>
                            <input
                                type="text"
                                {...register("nidNumber", { required: true })}
                                placeholder="National ID number"
                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${isDarkMode ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-gray-200 bg-gray-50 text-gray-800'}`}
                            />
                        </div>

                        {/* License */}
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Driving License</label>
                            <input
                                type="text"
                                {...register("drivingLicense", { required: true })}
                                placeholder="License number"
                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${isDarkMode ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-gray-200 bg-gray-50 text-gray-800'}`}
                            />
                        </div>

                        {/* Vehicle Number */}
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Vehicle Number</label>
                            <input
                                type="text"
                                {...register("vehicleNumber", { required: true })}
                                placeholder="Plate number"
                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${isDarkMode ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-gray-200 bg-gray-50 text-gray-800'}`}
                            />
                        </div>

                        {/* Experience */}
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Experience (Years)</label>
                            <input
                                type="number"
                                {...register("experience", { required: true })}
                                placeholder="E.g. 2"
                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${isDarkMode ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-gray-200 bg-gray-50 text-gray-800'}`}
                            />
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="space-y-2">
                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Emergency Contact</label>
                        <input
                            type="tel"
                            {...register("emergencyContact", { required: true })}
                            placeholder="01XXXXXXXXX"
                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${isDarkMode ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-gray-200 bg-gray-50 text-gray-800'}`}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                        Submit Application
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BeARider;

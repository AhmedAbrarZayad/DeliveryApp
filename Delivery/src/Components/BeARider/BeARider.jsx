import React from 'react';
import { useAuth } from '../../Hooks/useAuth';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const BeARider = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit,reset } = useForm({
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

    const onSubmit = (data) => {
        console.log("Form Data:", data);
        axiosSecure.post('/rider', data)
        .then(res => {
            if(res.data.insertedId){
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Application Submitted Successfully!',
                    showConfirmButton: false,
                    timer: 1500
                })
                reset();
            }
        })
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 text-black">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl space-y-5 border border-gray-200"
            >
                <h1 className="text-2xl font-semibold text-center text-gray-800">Become a Rider</h1>
                <p className="text-center text-gray-500 text-sm">Provide the details below to apply as a rider.</p>

                {/* Full Name */}
                <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Full Name</label>
                    <input
                        type="text"
                        {...register("fullName", { required: true })}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                </div>
                {/* Email */}
                <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Email</label>
                    <input
                        type="email"
                        {...register("email", { required: true })}
                        defaultValue={user?.email || ""}
                        placeholder="you@example.com"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                </div>
                {/* Phone */}
                <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Phone Number</label>
                    <input
                        type="tel"
                        {...register("phone", { required: true })}
                        placeholder="01XXXXXXXXX"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                </div>

                {/* Address */}
                <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Address</label>
                    <input
                        type="text"
                        {...register("address", { required: true })}
                        placeholder="Your full address"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                </div>

                {/* NID */}
                <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">NID Number</label>
                    <input
                        type="text"
                        {...register("nidNumber", { required: true })}
                        placeholder="Your National ID number"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                </div>

                {/* License */}
                <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Driving License Number</label>
                    <input
                        type="text"
                        {...register("drivingLicense", { required: true })}
                        placeholder="Your license number"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                </div>

                {/* Vehicle Type */}
                <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Vehicle Type</label>
                    <select
                        {...register("vehicleType", { required: true })}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    >
                        <option value="">Select vehicle type</option>
                        <option value="bike">Bike</option>
                        <option value="scooter">Scooter</option>
                        <option value="bicycle">Bicycle</option>
                    </select>
                </div>

                {/* Vehicle Number */}
                <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Vehicle Number</label>
                    <input
                        type="text"
                        {...register("vehicleNumber", { required: true })}
                        placeholder="Plate number"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                </div>

                {/* Experience */}
                <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Riding Experience (Years)</label>
                    <input
                        type="number"
                        {...register("experience", { required: true })}
                        placeholder="Example: 2"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                </div>

                {/* Emergency Contact */}
                <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Emergency Contact Number</label>
                    <input
                        type="tel"
                        {...register("emergencyContact", { required: true })}
                        placeholder="01XXXXXXXXX"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-3 rounded-xl text-lg font-medium hover:bg-blue-700 transition-all shadow-md"
                >
                    Submit Application
                </button>
            </form>
        </div>
    );
};

export default BeARider;

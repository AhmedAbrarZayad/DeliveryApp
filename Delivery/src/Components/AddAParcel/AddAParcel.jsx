import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useAuth } from '../../Hooks/useAuth';

const AddAParcel = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm();

    const axiosSecure = useAxiosSecure();

    const { user } = useAuth();

    const { isDarkMode } = useOutletContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [calculatedPrice, setCalculatedPrice] = useState(0);
    const [packageDetails, setPackageDetails] = useState({
        packageType: '',
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        declaredValue: 0,
        isFragile: false,
        isHazardous: false,
        paymentStatus: 'pending'
    });

    // Watch form fields to update packageDetails
    const watchedFields = watch();

    useEffect(() => {
        setPackageDetails({
            packageType: watchedFields.packageType || '',
            weight: parseFloat(watchedFields.weight) || 0,
            length: parseFloat(watchedFields.length) || 0,
            width: parseFloat(watchedFields.width) || 0,
            height: parseFloat(watchedFields.height) || 0,
            declaredValue: parseFloat(watchedFields.declaredValue) || 0,
            isFragile: watchedFields.isFragile || false,
            isHazardous: watchedFields.isHazardous || false
        });
    }, [watchedFields.packageType, watchedFields.weight, watchedFields.length,
    watchedFields.width, watchedFields.height, watchedFields.declaredValue,
    watchedFields.isFragile, watchedFields.isHazardous]);

    const handleCalculatePrice = () => {
        const {
            packageType,
            weight,
            length,
            width,
            height,
            declaredValue,
            isFragile,
            isHazardous,
        } = packageDetails;

        // Validation
        if (!packageType) {
            alert('Please select a package type');
            return;
        }
        if (weight <= 0) {
            alert('Please enter a valid weight');
            return;
        }

        // Calculate volumetric weight (dimensional weight)
        const volumetricWeight = (length * width * height) / 5000;

        // Use the greater of actual weight or volumetric weight
        const chargeableWeight = Math.max(weight, volumetricWeight);

        // Base rate per kg based on package type
        let baseRatePerKg = 0;

        switch (packageType) {
            case 'document':
                baseRatePerKg = 5.00;
                break;
            case 'small':
                baseRatePerKg = 8.00;
                break;
            case 'medium':
                baseRatePerKg = 10.00;
                break;
            case 'heavy':
                baseRatePerKg = 15.00;
                break;
            case 'food':
                baseRatePerKg = 12.00;
                break;
            case 'electronics':
                baseRatePerKg = 18.00;
                break;
            case 'fragile':
                baseRatePerKg = 20.00;
                break;
            case 'custom':
                baseRatePerKg = 10.00;
                break;
            default:
                baseRatePerKg = 8.00;
        }

        // Calculate base price
        let totalPrice = chargeableWeight * baseRatePerKg;

        // Minimum charge
        const minimumCharge = 50.00; // ৳50 minimum
        totalPrice = Math.max(totalPrice, minimumCharge);

        // Add fragile handling fee (20% surcharge)
        if (isFragile) {
            totalPrice *= 1.20;
        }

        // Add hazardous material fee (30% surcharge)
        if (isHazardous) {
            totalPrice *= 1.30;
        }

        // Add insurance based on declared value (1% of declared value)
        if (declaredValue > 0) {
            const insuranceFee = declaredValue * 0.01;
            totalPrice += insuranceFee;
        }

        // Round to 2 decimal places
        const finalPrice = Math.round(totalPrice * 100) / 100;

        setCalculatedPrice(finalPrice);

        // Show breakdown in console
        console.log('Price Breakdown:', {
            chargeableWeight: chargeableWeight.toFixed(2) + ' kg',
            baseRate: '৳' + baseRatePerKg,
            basePrice: '৳' + (chargeableWeight * baseRatePerKg).toFixed(2),
            fragileCharge: isFragile ? '+20%' : 'None',
            hazardousCharge: isHazardous ? '+30%' : 'None',
            insurance: declaredValue > 0 ? '৳' + (declaredValue * 0.01).toFixed(2) : 'None',
            finalPrice: '৳' + finalPrice.toFixed(2)
        });
    };

    const handleParcelSubmit = async (data) => {
        setSubmitError('');
        setSubmitSuccess(false);
        setIsSubmitting(true);

        try {
            const parcelData = {
                ...data, calculatedPrice
            };
            console.log('Parcel Data:', parcelData);

            await axiosSecure.post('/parcels', parcelData)
                .then(res => {
                    console.log('Parcel created successfully:', res);
                });

            setSubmitSuccess(true);
            reset();
            setCalculatedPrice(0);
        } catch (error) {
            setSubmitError('Failed to create parcel. Please try again.');
            console.error('Parcel creation error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const pickupTime = watch('pickupTime');

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-gray-50 text-black'} py-12 px-4 transition-colors duration-300`}>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-block p-3 rounded-2xl bg-blue-600/10 mb-4">
                        <span className="text-4xl">📦</span>
                    </div>
                    <h1 className={`text-4xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Book a New Delivery
                    </h1>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fill in the details below to schedule your pickup</p>
                </div>

                <form onSubmit={handleSubmit(handleParcelSubmit)} className="space-y-8">
                    {/* Alerts */}
                    {submitError && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md relative" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline ml-2">{submitError}</span>
                        </div>
                    )}
                    {submitSuccess && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md relative" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline ml-2">Parcel created successfully! Redirecting...</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Sender Information */}
                        <div className={`rounded-2xl shadow-xl border overflow-hidden ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                            <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-100 bg-gray-50/50'}`}>
                                <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    <span>👤</span> Sender Details
                                </h2>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                                    <input
                                        type="text"
                                        defaultValue={user?.displayName || ''}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-slate-900/50 text-white border-slate-600 placeholder-slate-500' : 'bg-white text-gray-900 border-gray-300'}`}
                                        {...register('senderName', { required: 'Sender name is required' })}
                                    />
                                    {errors.senderName && <span className="text-red-500 text-xs mt-1">{errors.senderName.message}</span>}
                                </div>

                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                                    <input
                                        type="email"
                                        defaultValue={user?.email}
                                        readOnly
                                        className={`w-full px-4 py-3 border rounded-xl opacity-70 cursor-not-allowed ${isDarkMode ? 'bg-slate-900/50 text-white border-slate-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
                                        {...register('senderEmail')}
                                    />
                                </div>

                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone</label>
                                    <input
                                        type="tel"
                                        placeholder="+880 1XXX-XXXXXX"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-slate-900/50 text-white border-slate-600 placeholder-slate-500' : 'bg-white text-gray-900 border-gray-300'}`}
                                        {...register('senderPhone', { required: 'Phone number is required' })}
                                    />
                                    {errors.senderPhone && <span className="text-red-500 text-xs mt-1">{errors.senderPhone.message}</span>}
                                </div>

                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pickup Address</label>
                                    <textarea
                                        placeholder="Full address incl. house #, road #"
                                        className={`w-full px-4 py-3 border rounded-xl h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-slate-900/50 text-white border-slate-600 placeholder-slate-500' : 'bg-white text-gray-900 border-gray-300'}`}
                                        {...register('pickupAddress', { required: 'Pickup address is required' })}
                                    />
                                    {errors.pickupAddress && <span className="text-red-500 text-xs mt-1">{errors.pickupAddress.message}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Receiver Information */}
                        <div className={`rounded-2xl shadow-xl border overflow-hidden ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                            <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-100 bg-gray-50/50'}`}>
                                <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    <span>📍</span> Receiver Details
                                </h2>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                                    <input
                                        type="text"
                                        placeholder="Receiver Name"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-slate-900/50 text-white border-slate-600 placeholder-slate-500' : 'bg-white text-gray-900 border-gray-300'}`}
                                        {...register('receiverName', { required: 'Receiver name is required' })}
                                    />
                                    {errors.receiverName && <span className="text-red-500 text-xs mt-1">{errors.receiverName.message}</span>}
                                </div>

                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone</label>
                                    <input
                                        type="tel"
                                        placeholder="Receiver Phone"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-slate-900/50 text-white border-slate-600 placeholder-slate-500' : 'bg-white text-gray-900 border-gray-300'}`}
                                        {...register('receiverPhone', { required: 'Phone number is required' })}
                                    />
                                    {errors.receiverPhone && <span className="text-red-500 text-xs mt-1">{errors.receiverPhone.message}</span>}
                                </div>

                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Delivery Address</label>
                                    <textarea
                                        placeholder="Full address incl. house #, road #"
                                        className={`w-full px-4 py-3 border rounded-xl h-36 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-slate-900/50 text-white border-slate-600 placeholder-slate-500' : 'bg-white text-gray-900 border-gray-300'}`}
                                        {...register('deliveryAddress', { required: 'Delivery address is required' })}
                                    />
                                    {errors.deliveryAddress && <span className="text-red-500 text-xs mt-1">{errors.deliveryAddress.message}</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Package Details */}
                    <div className={`rounded-2xl shadow-xl border overflow-hidden ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                        <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-100 bg-gray-50/50'}`}>
                            <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                <span>📦</span> Package Details
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</label>
                                    <select
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-slate-900/50 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                        {...register('packageType', { required: 'Required' })}
                                    >
                                        <option value="">Select Type</option>
                                        <option value="document">📄 Document</option>
                                        <option value="small">📦 Small Parcel</option>
                                        <option value="medium">📦 Medium Parcel</option>
                                        <option value="heavy">📦 Heavy Parcel</option>
                                        <option value="food">🍔 Food Item</option>
                                        <option value="electronics">💻 Electronics</option>
                                        <option value="fragile">🔆 Glass/Fragile</option>
                                        <option value="custom">🎁 Custom</option>
                                    </select>
                                    {errors.packageType && <span className="text-red-500 text-xs mt-1">{errors.packageType.message}</span>}
                                </div>

                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.0"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-slate-900/50 text-white border-slate-600 placeholder-slate-500' : 'bg-white text-gray-900 border-gray-300'}`}
                                        {...register('weight', { required: 'Required', min: 0.1 })}
                                    />
                                    {errors.weight && <span className="text-red-500 text-xs mt-1">{errors.weight.message}</span>}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dimensions (L × W × H) cm</label>
                                <div className="grid grid-cols-3 gap-4">
                                    <input type="number" step="0.1" placeholder="L" className={`w-full px-4 py-3 border rounded-xl ${isDarkMode ? 'bg-slate-900/50 text-white border-slate-600 placeholder-slate-500' : 'bg-white text-gray-900 border-gray-300'}`} {...register('length')} />
                                    <input type="number" step="0.1" placeholder="W" className={`w-full px-4 py-3 border rounded-xl ${isDarkMode ? 'bg-slate-900/50 text-white border-slate-600 placeholder-slate-500' : 'bg-white text-gray-900 border-gray-300'}`} {...register('width')} />
                                    <input type="number" step="0.1" placeholder="H" className={`w-full px-4 py-3 border rounded-xl ${isDarkMode ? 'bg-slate-900/50 text-white border-slate-600 placeholder-slate-500' : 'bg-white text-gray-900 border-gray-300'}`} {...register('height')} />
                                </div>
                            </div>

                            <div className={`flex flex-wrap gap-6 p-4 rounded-xl border border-dashed ${isDarkMode ? 'border-slate-600 bg-slate-900/30' : 'border-gray-300 bg-gray-50/50'}`}>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" className="peer sr-only" {...register('isFragile')} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </div>
                                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Fragile Item</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Section */}
                    <div className={`rounded-2xl shadow-xl border overflow-hidden p-6 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'}`}>
                        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                            <div className="w-full md:w-1/2">
                                <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Estimated Cost</div>
                                <div className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                    {calculatedPrice > 0 ? `৳ ${calculatedPrice.toFixed(2)}` : '৳ 0.00'}
                                </div>
                                <button type="button" onClick={handleCalculatePrice} className="text-sm text-blue-500 hover:text-blue-600 hover:underline mt-1">
                                    Calculate Price
                                </button>
                            </div>

                            <div className="w-full md:w-1/2 flex flex-col gap-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select
                                        className={`w-full px-4 py-3 border rounded-xl ${isDarkMode ? 'bg-slate-900/50 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                        {...register('deliverySpeed', { required: 'Required' })}
                                    >
                                        <option value="standard">Standard Delivery</option>
                                        <option value="express">Express (Fast)</option>
                                    </select>
                                    <select
                                        className={`w-full px-4 py-3 border rounded-xl ${isDarkMode ? 'bg-slate-900/50 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                        {...register('paymentMethod', { required: 'Required' })}
                                    >
                                        <option value="cod-sender">COD (Sender)</option>
                                        <option value="cod-receiver">COD (Receiver)</option>
                                        <option value="card">Online Payment</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {isSubmitting ? 'Processing...' : 'Confirm & Book Parcel 🚀'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAParcel;
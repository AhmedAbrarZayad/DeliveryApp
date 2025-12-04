import React, { useState, useEffect } from 'react';
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

    const [isDarkMode] = useState(false);
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
        
        switch(packageType) {
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
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'} py-8 px-4`}>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        📦 Add New Parcel
                    </h1>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Fill in the details to create a delivery request</p>
                </div>

                <form onSubmit={handleSubmit(handleParcelSubmit)} className="space-y-6">
                    {/* Alerts */}
                    {submitError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <span>{submitError}</span>
                        </div>
                    )}
                    {submitSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            <span>✓ Parcel created successfully!</span>
                        </div>
                    )}

                    {/* Sender Information */}
                    <div className={`border rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            👤 Sender Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sender Name *</label>
                                <input
                                    type="text"
                                    defaultValue={user?.displayName || ''}
                                    className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                    {...register('senderName', { required: 'Sender name is required' })}
                                />
                                {errors.senderName && (
                                    <span className="text-red-400 text-sm mt-1">{errors.senderName.message}</span>
                                )}
                            </div>

                            <div>
                                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sender Email *</label>
                                <input
                                    type="email"
                                    placeholder="example@email.com"
                                    defaultValue={user?.email}
                                    className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                    {...register('senderEmail', { 
                                        required: 'Sender email is required',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                />
                                {errors.senderEmail && (
                                    <span className="text-red-400 text-sm mt-1">{errors.senderEmail.message}</span>
                                )}
                            </div>

                            <div>
                                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number *</label>
                                <input
                                    type="tel"
                                    placeholder="+880 1XXX-XXXXXX"
                                    className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                    {...register('senderPhone', { 
                                        required: 'Phone number is required',
                                        pattern: {
                                            value: /^[+]?[0-9]{10,15}$/,
                                            message: 'Invalid phone number'
                                        }
                                    })}
                                />
                                {errors.senderPhone && (
                                    <span className="text-red-400 text-sm mt-1">{errors.senderPhone.message}</span>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pickup Address *</label>
                                <textarea
                                    placeholder="House/Flat, Street, Area, City"
                                    className={`w-full px-4 py-2 border rounded-lg h-24 ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                    {...register('pickupAddress', { required: 'Pickup address is required' })}
                                />
                                {errors.pickupAddress && (
                                    <span className="text-red-400 text-sm mt-1">{errors.pickupAddress.message}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Receiver Information */}
                    <div className={`border rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            📍 Receiver Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Receiver Name *</label>
                                <input
                                    type="text"
                                    placeholder="Jane Smith"
                                    className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                    {...register('receiverName', { required: 'Receiver name is required' })}
                                />
                                {errors.receiverName && (
                                    <span className="text-red-400 text-sm mt-1">{errors.receiverName.message}</span>
                                )}
                            </div>

                            <div>
                                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number *</label>
                                <input
                                    type="tel"
                                    placeholder="+880 1XXX-XXXXXX"
                                    className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                    {...register('receiverPhone', { 
                                        required: 'Phone number is required',
                                        pattern: {
                                            value: /^[+]?[0-9]{10,15}$/,
                                            message: 'Invalid phone number'
                                        }
                                    })}
                                />
                                {errors.receiverPhone && (
                                    <span className="text-red-400 text-sm mt-1">{errors.receiverPhone.message}</span>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Delivery Address *</label>
                                <textarea
                                    placeholder="House/Flat, Street, Area, City"
                                    className={`w-full px-4 py-2 border rounded-lg h-24 ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                    {...register('deliveryAddress', { required: 'Delivery address is required' })}
                                />
                                {errors.deliveryAddress && (
                                    <span className="text-red-400 text-sm mt-1">{errors.deliveryAddress.message}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Package Details */}
                    <div className={`border rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            📦 Package Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Package Type *</label>
                                <select
                                    className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                    {...register('packageType', { required: 'Package type is required' })}
                                >
                                    <option value="">Select package type</option>
                                    <option value="document">📄 Document</option>
                                    <option value="small">📦 Small Parcel</option>
                                    <option value="medium">📦 Medium Parcel</option>
                                    <option value="heavy">📦 Heavy Parcel</option>
                                    <option value="food">🍔 Food Item</option>
                                    <option value="electronics">💻 Electronics</option>
                                    <option value="fragile">🔆 Glass/Fragile</option>
                                    <option value="custom">🎁 Custom Category</option>
                                </select>
                                {errors.packageType && (
                                    <span className="text-red-400 text-sm mt-1">{errors.packageType.message}</span>
                                )}
                            </div>

                            <div>
                                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Weight (kg) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                    {...register('weight', { 
                                        required: 'Weight is required',
                                        min: { value: 0.01, message: 'Weight must be greater than 0' }
                                    })}
                                />
                                {errors.weight && (
                                    <span className="text-red-400 text-sm mt-1">{errors.weight.message}</span>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dimensions (L × W × H) cm</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="Length"
                                        className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                        {...register('length')}
                                    />
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="Width"
                                        className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                        {...register('width')}
                                    />
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="Height"
                                        className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                        {...register('height')}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Declared Value (৳)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                    {...register('declaredValue')}
                                />
                            </div>

                            <div className="flex items-center gap-8 pt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5"
                                        {...register('isFragile')}
                                    />
                                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>🔆 Fragile Item</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5"
                                        {...register('isHazardous')}
                                    />
                                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>⚠️ Hazardous Material</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Pickup & Delivery Options */}
                    <div className={`border rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            🚚 Pickup & Delivery Options
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pickup Time *</label>
                                <select
                                    className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                    {...register('pickupTime', { required: 'Pickup time is required' })}
                                >
                                    <option value="">Select pickup time</option>
                                    <option value="asap">🚀 ASAP</option>
                                    <option value="scheduled">📅 Schedule Pickup</option>
                                </select>
                                {errors.pickupTime && (
                                    <span className="text-red-400 text-sm mt-1">{errors.pickupTime.message}</span>
                                )}
                            </div>

                            {pickupTime === 'scheduled' && (
                                <div>
                                    <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pickup Date & Time *</label>
                                    <input
                                        type="datetime-local"
                                        className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                        {...register('scheduledPickupTime', { 
                                            required: pickupTime === 'scheduled' ? 'Scheduled time is required' : false 
                                        })}
                                    />
                                    {errors.scheduledPickupTime && (
                                        <span className="text-red-400 text-sm mt-1">{errors.scheduledPickupTime.message}</span>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Delivery Speed *</label>
                                <select
                                    className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                    {...register('deliverySpeed', { required: 'Delivery speed is required' })}
                                >
                                    <option value="">Select delivery speed</option>
                                    <option value="standard">📦 Standard</option>
                                    <option value="sameday">⚡ Same Day</option>
                                    <option value="express">🚀 Express (2-4 hours)</option>
                                    <option value="nextday">📅 Next Day</option>
                                </select>
                                {errors.deliverySpeed && (
                                    <span className="text-red-400 text-sm mt-1">{errors.deliverySpeed.message}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className={`border rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            💳 Payment Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Payment Method *</label>
                                <select
                                    className={`w-full px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                    {...register('paymentMethod', { required: 'Payment method is required' })}
                                >
                                    <option value="">Select payment method</option>
                                    <option value="cod-sender">💵 Cash on Delivery (Sender Pays)</option>
                                    <option value="cod-receiver">💵 Cash on Delivery (Receiver Pays)</option>
                                    <option value="bkash">📱 bKash</option>
                                    <option value="nagad">📱 Nagad</option>
                                    <option value="card">💳 Credit/Debit Card</option>
                                </select>
                                {errors.paymentMethod && (
                                    <span className="text-red-400 text-sm mt-1">{errors.paymentMethod.message}</span>
                                )}
                            </div>

                            <div>
                                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Estimated Cost</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={calculatedPrice > 0 ? `৳ ${calculatedPrice.toFixed(2)}` : '৳ 0.00'}
                                        className={`flex-1 px-4 py-2 border rounded-lg ${isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                                        disabled
                                        readOnly
                                    />
                                    <button
                                        type="button"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        onClick={handleCalculatePrice}
                                    >
                                        Calculate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-lg shadow-xl p-6">
                        <button
                            type="submit"
                            className="w-full py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span>Creating Parcel...</span>
                            ) : (
                                <span>🚀 Create Parcel Request</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAParcel;
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams, useOutletContext } from 'react-router';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const Payment = () => {
  const axiosSecure = useAxiosSecure();
  const { id: parcelsId } = useParams();
  const { isDarkMode } = useOutletContext();

  const { data: parcel, isLoading } = useQuery({
    queryKey: ['parcels', parcelsId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelsId}`);
      return res.data;
    }
  });

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const handlePayment = async () => {
    const paymentInfo = {
      id: parcelsId,
      cost: parcel.calculatedPrice,
      parcelId: parcel._id,
      senderName: parcel.senderName,
      senderEmail: parcel.senderEmail,
    }

    const res = await axiosSecure.post('/create-checkout-session', paymentInfo);
    console.log('Checkout Session:', res.data);
    if (res.data && res.data.url) {
      window.location.href = res.data.url;
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <div className={`max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-2">Secure Checkout</h2>
          <p className="opacity-90">Complete your payment for parcel delivery</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <span className={`block text-xs uppercase tracking-wide mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sender</span>
              <span className={`block font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{parcel.senderName}</span>
            </div>
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <span className={`block text-xs uppercase tracking-wide mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receiver</span>
              <span className={`block font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{parcel.receiverName}</span>
            </div>

            <div className={`col-span-2 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <span className={`block text-xs uppercase tracking-wide mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Delivery Address</span>
              <span className={`block font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{parcel.deliveryAddress}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className={`flex justify-between items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Package Type</span>
              <span className="font-medium capitalize">{parcel.packageType}</span>
            </div>
            <div className={`flex justify-between items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Weight</span>
              <span className="font-medium">{parcel.weight} kg</span>
            </div>
            <div className={`flex justify-between items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span>Delivery Speed</span>
              <span className="font-medium capitalize">{parcel.deliverySpeed}</span>
            </div>

            <div className={`h-px my-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

            <div className="flex justify-between items-end">
              <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Total Amount</span>
              <span className={`text-4xl font-extrabold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                ${parcel.calculatedPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Pay with Stripe / Card
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Secured by Stripe • Refunds available within 24h
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;

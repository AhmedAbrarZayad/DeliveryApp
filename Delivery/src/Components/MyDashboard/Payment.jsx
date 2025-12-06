import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const Payment = () => {
  const axiosSecure = useAxiosSecure();
  const { id: parcelsId } = useParams();

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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center p-6 transition-colors duration-300">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-2">Secure Checkout</h2>
          <p className="opacity-90">Complete your payment for parcel delivery</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">Sender</span>
              <span className="block font-semibold text-gray-800 dark:text-gray-200">{parcel.senderName}</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">Receiver</span>
              <span className="block font-semibold text-gray-800 dark:text-gray-200">{parcel.receiverName}</span>
            </div>

            <div className="col-span-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">Delivery Address</span>
              <span className="block font-semibold text-gray-800 dark:text-gray-200">{parcel.deliveryAddress}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
              <span>Package Type</span>
              <span className="font-medium capitalize">{parcel.packageType}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
              <span>Weight</span>
              <span className="font-medium">{parcel.weight} kg</span>
            </div>
            <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
              <span>Delivery Speed</span>
              <span className="font-medium capitalize">{parcel.deliverySpeed}</span>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700 my-4"></div>

            <div className="flex justify-between items-end">
              <span className="text-lg font-bold text-gray-800 dark:text-white">Total Amount</span>
              <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
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

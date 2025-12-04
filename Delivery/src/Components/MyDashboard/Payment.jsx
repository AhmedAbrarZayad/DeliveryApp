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
    <div className="min-h-screen bg-linear-to-br from-purple-100 via-pink-100 to-yellow-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Summary</h2>

        <div className="space-y-2 text-gray-700 text-sm">
          <div className="flex justify-between">
            <span>Sender:</span>
            <span>{parcel.senderName}</span>
          </div>
          <div className="flex justify-between">
            <span>Receiver:</span>
            <span>{parcel.receiverName}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Address:</span>
            <span>{parcel.deliveryAddress}</span>
          </div>
          <div className="flex justify-between">
            <span>Package Type:</span>
            <span>{parcel.packageType}</span>
          </div>
          <div className="flex justify-between">
            <span>Weight:</span>
            <span>{parcel.weight} kg</span>
          </div>
          <div className="flex justify-between">
            <span>Dimensions:</span>
            <span>{parcel.length} × {parcel.width} × {parcel.height} cm</span>
          </div>
          <div className="flex justify-between">
            <span>Declared Value:</span>
            <span>${parcel.declaredValue}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Speed:</span>
            <span className="capitalize">{parcel.deliverySpeed}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span className="uppercase">{parcel.paymentMethod}</span>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-300 pt-4">
          <p className="text-lg font-semibold mb-2">Total Amount</p>
          <p className="text-3xl font-bold text-green-600">${parcel.calculatedPrice.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">*Amount calculated based on weight, speed, and package type.</p>
        </div>

        <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors" onClick={handlePayment}>
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Payment;

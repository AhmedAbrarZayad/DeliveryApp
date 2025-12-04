import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { NavLink, useSearchParams } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const PaymentSuccessful = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  console.log('Payment Successful Session ID:', sessionId);
  const axiosSecure = useAxiosSecure();
  useEffect(() => {
    if(sessionId){
        axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
        .then(res => {
            console.log('Payment confirmation response:', res.data);
        })
    }
  }, [sessionId, axiosSecure]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-3xl p-10 max-w-md w-full text-center border border-gray-200/50 dark:border-gray-700">
        
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 drop-shadow-md" />
        
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
          Payment Successful!
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Your payment has been processed successfully.  
          Thank you for your purchase!
        </p>

        <NavLink
          to="/dashboard"
          className="inline-block px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-xl text-lg font-medium transition-all shadow-md"
        >
          Go to Dashboard
        </NavLink>
      </div>
    </div>
  );
};

export default PaymentSuccessful;

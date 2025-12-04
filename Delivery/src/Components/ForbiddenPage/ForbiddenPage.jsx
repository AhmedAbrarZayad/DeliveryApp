import React from "react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md border border-red-200">
        <div className="text-red-600 text-7xl font-bold">403</div>
        <h1 className="text-3xl font-semibold mt-4 text-gray-800">Access Denied</h1>

        <p className="text-gray-600 mt-3">
          Sorry, you don't have permission to view this page.
        </p>

        <div className="mt-6">
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-red-700 transition font-medium"
          >
            Go Back Home
          </button>
        </div>
      </div>
    </div>
  );
}
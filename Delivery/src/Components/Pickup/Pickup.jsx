import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useRole from "../../Hooks/useRole";
import React from "react";

const Pickup = () => {
  const axiosSecure = useAxiosSecure();
  const { role, isLoading: roleLoading } = useRole();

  const { data: parcels = [], isLoading, refetch } = useQuery({
    queryKey: ["pendingParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/pending-parcels");
      return res.data;
    },
  });

  // Modal state
  const [selectedId, setSelectedId] = React.useState(null);

  const handlePick = async (id) => {
    console.log("Picking parcel with ID:", id);
    await axiosSecure.patch(`/pick-parcel/${id}`);
    refetch();
  };

  if (isLoading || roleLoading) {
    return (
      <div className="text-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Parcels for Pickup</h2>

      {parcels.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No pending parcels.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="table table-zebra w-full">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th>#</th>
                <th>Sender</th>
                <th>Pickup Address</th>
                <th>Receiver</th>
                <th>Delivery Address</th>
                <th>Package</th>
                <th>Weight</th>
                <th>Dimensions</th>
                <th>Fragile</th>
                <th>Hazardous</th>
                <th>Speed</th>
                <th>Price</th>
                {role === "rider" && <th>Pick</th>}
              </tr>
            </thead>

            <tbody>
              {parcels.map((p, index) => (
                <tr key={p._id}>
                  <td>{index + 1}</td>

                  <td>
                    <div className="font-semibold">{p.senderName}</div>
                    <div className="text-sm text-gray-500">{p.senderPhone}</div>
                  </td>

                  <td>{p.pickupAddress}</td>

                  <td>
                    <div className="font-semibold">{p.receiverName}</div>
                    <div className="text-sm text-gray-500">
                      {p.receiverPhone}
                    </div>
                  </td>

                  <td>{p.deliveryAddress}</td>

                  <td className="capitalize">{p.packageType}</td>

                  <td>{p.weight} kg</td>

                  <td>
                    {p.length} × {p.width} × {p.height} cm
                  </td>

                  <td>
                    {p.isFragile ? (
                      <span className="text-red-500 font-semibold">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>

                  <td>
                    {p.isHazardous ? (
                      <span className="text-red-500 font-semibold">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>

                  <td className="capitalize">{p.deliverySpeed}</td>

                  <td className="font-semibold text-green-700">
                    {p.calculatedPrice} ৳
                  </td>

                  {role === "rider" && (
                    <td>
                      <button
                        onClick={() => setSelectedId(p._id)}
                        className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Pick
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ==================== CONFIRMATION MODAL ==================== */}
      {selectedId && (
        <dialog id="confirmModal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Pickup</h3>
            <p className="mb-6">Are you sure you want to pick this parcel?</p>

            <div className="flex justify-end gap-3">
              <button className="btn btn-ghost" onClick={() => setSelectedId(null)}>
                Cancel
              </button>

              <button
                className="btn bg-blue-600 text-white hover:bg-blue-700"
                onClick={async () => {
                  await handlePick(selectedId);
                  setSelectedId(null);
                }}
              >
                Yes, Pick
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Pickup;

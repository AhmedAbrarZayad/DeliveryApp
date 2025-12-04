import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const UsersManagement = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch all users
  const { data: users = [], refetch, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // Update user role with confirmation & success notification
  const handleUpdateRole = async (id, newRole) => {
    const actionText =
      newRole === "admin" ? "promote this user to Admin" : "remove Admin role";

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${actionText}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (confirmResult.isConfirmed) {
      try {
        await axiosSecure.patch(`/users/${id}`, { role: newRole });
        refetch();

        Swal.fire({
          title: "Success",
          text:
            newRole === "admin"
              ? "User has been promoted to Admin."
              : "Admin role has been removed.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Failed to update role:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to update role. Please try again.",
          icon: "error",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-700 dark:text-gray-300">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-8">
          User Management
        </h1>

        {users.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-center">
            No users found.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-300 dark:border-slate-700">
            <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-200 dark:bg-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left">User ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Joined Date</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                  >
                    <td className="px-4 py-3">{user._id}</td>
                    <td className="px-4 py-3">{user.name || "N/A"}</td>
                    <td className="px-4 py-3">{user.email}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full
                          ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          }
                        `}
                      >
                        {user.role || "user"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full
                          ${
                            user.status === "active"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                          }
                        `}
                      >
                        {user.status || "active"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {/* Make Admin / Remove Admin */}
                        {user.role !== "admin" ? (
                          <button
                            onClick={() =>
                              handleUpdateRole(user._id, "admin")
                            }
                            className="text-purple-600 dark:text-purple-400 hover:underline text-xs"
                          >
                            Make Admin
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleUpdateRole(user._id, "user")
                            }
                            className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                          >
                            Remove Admin
                          </button>
                        )}

                        <button className="text-blue-600 dark:text-blue-400 hover:underline text-xs">
                          Edit
                        </button>

                        <button className="text-red-600 dark:text-red-400 hover:underline text-xs">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;

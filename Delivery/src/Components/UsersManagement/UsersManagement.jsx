import React from "react";
import { useOutletContext } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const UsersManagement = () => {
  const axiosSecure = useAxiosSecure();
  const { isDarkMode } = useOutletContext();

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
      background: isDarkMode ? '#1f2937' : '#fff',
      color: isDarkMode ? '#fff' : '#545454',
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
          background: isDarkMode ? '#1f2937' : '#fff',
          color: isDarkMode ? '#fff' : '#545454',
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-10 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 border-l-4 border-blue-500 pl-4">
          User Management
        </h1>

        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <p className="text-gray-600 dark:text-gray-300 text-lg">No users found.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 dark:bg-gray-900/80 text-gray-600 dark:text-gray-200 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4">Name / ID</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-white text-base">
                            {user.name || "N/A"}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">
                            {user._id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                            ${user.role === "admin"
                              ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                              : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                            }
                            `}
                        >
                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                            ${user.status === "active"
                              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                              : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                            }
                            `}
                        >
                          {user.status || "active"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                          : "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Make Admin / Remove Admin */}
                          {user.role !== "admin" ? (
                            <button
                              onClick={() =>
                                handleUpdateRole(user._id, "admin")
                              }
                              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium text-xs transition-colors"
                            >
                              Make Admin
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleUpdateRole(user._id, "user")
                              }
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-xs transition-colors"
                            >
                              Remove Admin
                            </button>
                          )}

                          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>

                          <button className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {/* Edit Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                          </button>

                          <button className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            {/* Delete Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;

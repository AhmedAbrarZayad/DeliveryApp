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
      <div className={`min-h-screen flex justify-center items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Loading users...
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-10 px-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 border-l-4 border-blue-500 pl-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          User Management
        </h1>

        {users.length === 0 ? (
          <div className={`flex flex-col items-center justify-center p-10 rounded-2xl shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No users found.</p>
          </div>
        ) : (
          <div className={`overflow-hidden rounded-2xl shadow-xl border backdrop-blur-sm ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className={`uppercase tracking-wider font-semibold border-b ${isDarkMode ? 'bg-gray-900/80 text-gray-200 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                  <tr>
                    <th className="px-6 py-4">Name / ID</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className={`transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`font-medium text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {user.name || "N/A"}
                          </span>
                          <span className={`text-xs font-mono mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {user._id}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                            user.role === "admin"
                              ? isDarkMode
                                ? "bg-purple-900/30 text-purple-300 border-purple-800"
                                : "bg-purple-50 text-purple-700 border-purple-200"
                              : isDarkMode
                              ? "bg-blue-900/30 text-blue-300 border-blue-800"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                            user.status === "active"
                              ? isDarkMode
                                ? "bg-green-900/30 text-green-300 border-green-800"
                                : "bg-green-50 text-green-700 border-green-200"
                              : isDarkMode
                              ? "bg-red-900/30 text-red-300 border-red-800"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {user.status || "active"}
                        </span>
                      </td>

                      <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
                              className={`font-medium text-xs transition-colors ${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'}`}
                            >
                              Make Admin
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleUpdateRole(user._id, "user")
                              }
                              className={`font-medium text-xs transition-colors ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                            >
                              Remove Admin
                            </button>
                          )}

                          <div className={`h-4 w-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>

                          <button className={`transition-colors ${isDarkMode ? 'text-gray-500 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'}`}>
                            {/* Edit Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                          </button>

                          <button className={`transition-colors ${isDarkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-500 hover:text-red-600'}`}>
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

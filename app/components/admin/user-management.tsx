"use client";
import { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { deleteUserAsync, fetchUsersAsync } from "@/app/redux/user/slice";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | "Candidate" | "Employer" | "Admin">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(null);

  const itemsPerPage = 6;
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.users);

  // ✅ Filtering
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role?.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  // ✅ Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ✅ Delete
  const handleDelete = (id: number) => {
    setSelectedUser({ id });
    setModalType("delete");
  };

  useEffect(() => {
    dispatch(fetchUsersAsync());
  }, [dispatch]);

  return (
    <div className="p-8 space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
      <p className="text-gray-600">Manage all registered users, their roles, and access.</p>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <input
          type="text"
          placeholder="🔍 Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
          className="border rounded-lg px-4 py-2 shadow-sm"
        >
          <option value="All">All Roles</option>
          <option value="Candidate">Candidate</option>
          <option value="Employer">Employer</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg border">
        {loading ? (
          <p className="p-4">Loading users...</p>
        ) : error ? (
          <p className="p-4 text-red-500">{error}</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Joined</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="p-3">{user.id}</td>
                  <td className="p-3 font-medium">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role?.toLowerCase() === "candidate"
                          ? "bg-blue-100 text-blue-600"
                          : user.role?.toLowerCase() === "employer"
                          ? "bg-green-100 text-green-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                 
                  <td className="p-3">{new Date(user.createdAt!).toLocaleDateString()}</td>
                  <td className="p-3 flex gap-3 justify-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        setSelectedUser(user);
                        setModalType("view");
                      }}
                      title="View User"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-yellow-500 hover:text-yellow-700"
                      onClick={() => {
                        setSelectedUser(user);
                        setModalType("edit");
                      }}
                      title="Edit User"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded-lg ${
              currentPage === i + 1 ? "bg-indigo-500 text-white" : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* View / Edit / Delete Modals */}
      {modalType === "view" && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">👤 User Details</h2>
            <p><b>Name:</b> {selectedUser.name}</p>
            <p><b>Email:</b> {selectedUser.email}</p>
            <p><b>Role:</b> {selectedUser.role}</p>
            <p><b>Status:</b> {selectedUser.isOnline ? "Online ✅" : "Offline ❌"}</p>
            <button
              onClick={() => setModalType(null)}
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {modalType === "delete" && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-bold text-red-600">⚠️ Confirm Delete</h2>
            <p className="mt-2">Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch(deleteUserAsync(selectedUser.id));
                  setModalType(null);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

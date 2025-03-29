import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Userlist = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      showToast('Error fetching users', 'error');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    document.getElementById('editModal').showModal();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      showToast('User deleted successfully', 'success');
    } catch (error) {
      showToast('Error deleting user', 'error');
    }
  };
  const handleUpdate = async () => {
    try {
      await axios.put(`https://reqres.in/api/users/${selectedUser.id}`, selectedUser);
  
      // Update the users state with the edited user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, ...selectedUser } : user
        )
      );
  
      showToast('User updated successfully', 'success');
      document.getElementById('editModal').close();
    } catch (error) {
      showToast('Error updating user', 'error');
    }
  };
  

  const showToast = (message, type) => {
    const newToast = { id: Date.now(), message, type };
    setToasts((prevToasts) => [...prevToasts, newToast]);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== newToast.id));
    }, 3000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">User List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="card bg-base-100 shadow-lg p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <img src={user.avatar} alt={user.first_name} className="w-16 h-16 rounded-full border-2 border-gray-300" />
              <div>
                <h2 className="text-xl font-semibold">{user.first_name} {user.last_name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button className="btn btn-outline btn-info mr-2" onClick={() => handleEdit(user)}>Edit</button>
              <button className="btn btn-outline btn-error" onClick={() => handleDelete(user.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <button 
          className="btn btn-outline mr-2" 
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="mx-2">Page {page} of {totalPages}</span>
        <button 
          className="btn btn-outline" 
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      <dialog id="editModal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Edit User</h3>
          <label className="block mt-4">First Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={selectedUser?.first_name || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, first_name: e.target.value })}
          />
          <label className="block mt-4">Last Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={selectedUser?.last_name || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, last_name: e.target.value })}
          />
          <label className="block mt-4">Email</label>
          <input
            type="email"
            className="input input-bordered w-full"
            value={selectedUser?.email || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
          />
          <div className="modal-action">
            <button className="btn btn-success" onClick={handleUpdate}>Save</button>
            <button className="btn" onClick={() => document.getElementById('editModal').close()}>Cancel</button>
          </div>
        </div>
      </dialog>

      {/* Toast Container */}
      <div className="toast toast-top toast-start">
        {toasts.map((toast) => (
          <div key={toast.id} className={`alert alert-${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Userlist;
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState(''); // Filter state
  const [roleFilter, setRoleFilter] = useState(''); // Role filter state
  const navigate = useNavigate();

  // Check if the user is authenticated and redirect if not
  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        navigate('/login');
      }
    };

    checkUser();
  }, [navigate]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('Failed to fetch users:', error.message);
      setError('Failed to fetch users');
    } else {
      setUsers(data);
    }
    setLoading(false);
  };

  const addUser = async (user) => {
    const { data, error } = await supabase.from('users').insert([user]);
    if (error) {
      console.error('Failed to add user:', error.message);
      setError('Failed to add user');
    } else {
      setUsers([...users, ...data]);
      setShowAddModal(false);
    }
  };

  const editUser = async (user) => {
    const { data, error } = await supabase.from('users').update(user).eq('id', user.id);
    if (error) {
      console.error('Failed to update user:', error.message);
      setError('Failed to update user');
    } else {
      setUsers(users.map((u) => (u.id === user.id ? data[0] : u)));
      setShowEditModal(false);
    }
  };

  const deleteUser = async (id) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete user:', error.message);
      setError('Failed to delete user');
    } else {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  // Filtered users based on the filter input and role filter
  const filteredUsers = users.filter((user) => {
    return (
      (user.first_name.toLowerCase().includes(filter.toLowerCase()) ||
        user.last_name.toLowerCase().includes(filter.toLowerCase()) ||
        user.email.toLowerCase().includes(filter.toLowerCase())) &&
      (roleFilter ? user.role.toLowerCase() === roleFilter.toLowerCase() : true)
    );
  });

  return (
    <div>
      {/* Use Navbar component */}
      <Navbar />

      {/* User Management Section */}
      <div className="min-h-screen bg-background p-6">
        {/* Filter and Add User Section */}
        <div className="flex justify-end items-center mb-6 space-x-4">
          {/* Filter Input */}
          <input
            type="text"
            placeholder="Filter by name, email..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
          />
          {/* Filter by Role */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>

          {/* Add User Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-main text-white px-6 py-2 rounded-md font-semibold hover:bg-bu transition-colors"
          >
            Add User
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error if any */}

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-3 px-4">First Name</th>
                <th className="py-3 px-4">Last Name</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{user.first_name}</td>
                  <td className="py-3 px-4">{user.last_name}</td>
                  <td className="py-3 px-4">{user.course}</td>
                  <td className="py-3 px-4">{user.year}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.role}</td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEditModal(true);
                      }}
                      className="text-white bg-blue-500 px-2 py-1 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-white bg-red-500 px-2 py-1 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && <UserModal closeModal={() => setShowAddModal(false)} saveUser={addUser} />}

      {/* Edit User Modal */}
      {showEditModal && (
        <UserModal
          closeModal={() => setShowEditModal(false)}
          saveUser={editUser}
          user={selectedUser}
        />
      )}
    </div>
  );
};

// Modal Component for Adding and Editing Users
const UserModal = ({ closeModal, saveUser, user }) => {
  const [formData, setFormData] = useState(
    user || { first_name: '', last_name: '', course: '', year: '', email: '', role: '' }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveUser(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">{user ? 'Edit User' : 'Add User'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Course</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Year</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-main text-white px-4 py-2 rounded-md hover:bg-bu transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;

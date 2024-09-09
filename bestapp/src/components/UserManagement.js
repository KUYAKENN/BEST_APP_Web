import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, first_name: 'John', middle_name: 'Michael', last_name: 'Doe', course: 'Computer Science', year: '2nd Year', email: 'john.doe@example.com', role: 'student', status: 'pending' },
    { id: 2, first_name: 'Jane', middle_name: 'Ann', last_name: 'Smith', course: 'Engineering', year: '3rd Year', email: 'jane.smith@example.com', role: 'instructor', status: 'active' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const isAuthenticated = true; // Replace this with actual authentication check
      if (!isAuthenticated) {
        navigate('/login');
      }
    };
    checkUser();
  }, [navigate]);

  const addUser = (user) => {
    const newUser = { ...user, id: users.length + 1, status: 'pending' };
    setUsers([...users, newUser]);
    setShowAddModal(false);
  };

  const editUser = (user) => {
    setUsers(users.map((u) => (u.id === user.id ? user : u)));
    setShowEditModal(false);
  };

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const acceptUser = (id) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, status: 'active' } : user)));
  };

  const rejectUser = (id) => {
    deleteUser(id);
  };

  const filteredUsers = users.filter((user) => {
    return (
      (user.first_name.toLowerCase().includes(filter.toLowerCase()) ||
        user.middle_name.toLowerCase().includes(filter.toLowerCase()) ||
        user.last_name.toLowerCase().includes(filter.toLowerCase()) ||
        user.email.toLowerCase().includes(filter.toLowerCase())) &&
      (roleFilter ? user.role.toLowerCase() === roleFilter.toLowerCase() : true)
    );
  });

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-background p-6">
        <div className="flex justify-end items-center mb-6 space-x-4">
          <input
            type="text"
            placeholder="Filter by name, email..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-main text-white px-6 py-2 rounded-md font-semibold hover:bg-bu transition-colors"
          >
            Add User
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-3 px-4">First Name</th>
                <th className="py-3 px-4">Middle Name</th>
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
                  <td className="py-3 px-4">{user.middle_name}</td>
                  <td className="py-3 px-4">{user.last_name}</td>
                  <td className="py-3 px-4">{user.course}</td>
                  <td className="py-3 px-4">{user.year}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.role}</td>
                  <td className="py-3 px-4 space-x-2">
                    {user.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => acceptUser(user.id)}
                          className="text-white bg-green-500 px-2 py-1 rounded-md hover:bg-green-700 transition-colors"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => rejectUser(user.id)}
                          className="text-white bg-red-500 px-2 py-1 rounded-md hover:bg-red-700 transition-colors"
                        >
                          ✗
                        </button>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && <UserModal closeModal={() => setShowAddModal(false)} saveUser={addUser} />}
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

const UserModal = ({ closeModal, saveUser, user }) => {
  const [formData, setFormData] = useState(
    user || { first_name: '', middle_name: '', last_name: '', course: '', year: '1st Year', email: '', role: 'student', password: '' }
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
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full overflow-y-auto max-h-[90vh]">
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
            <label className="block text-gray-700 mb-2">Middle Name</label>
            <input
              type="text"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
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
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
              required
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
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
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
              required
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
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

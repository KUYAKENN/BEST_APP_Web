import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { JWT } from 'google-auth-library';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const navigate = useNavigate();

  const auth = getAuth();
  const db = getFirestore();

  const sendNotification = async (token, accessToken, title, body) => {
    // // const serviceAccount = {
    // //   type: "service_account",
    // //   project_id: "bestapp-66e4d",
    // //   private_key_id: "7da75e0f7ff2d058f00d6c34f875dee486a43b43",
    // //   private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCwcCaTUNYOyet4\nDmZicDRzutTKpFFj+DgdQaBHqJPIYncruwkukMeu2RVymjv7pKx3w1woh2FFr2MA\nvs1R4k2UvILxX+15eJ1KBWS9glvCfjo5r0KpaAe5OiMWdyr+zznzs7VEbD5TfN4t\nsKycOxDv39j9vlyeStKclw3/Kh2e/qNUwATpof1UnbRV7XDuzjy0O+JdAcQkwQHD\nxdABB77OKWxqKR0D9LMZUbJtomsIBcTi7lnRjt00+UsWa2TfATX//E7Iw2DO+uds\nWm4AGju9d5ISLNOuLPIMFLHd9bO8Efkk8C9uetM8qUzmsb/79pFEOOjYDwhN6JYg\nXr8N57/hAgMBAAECggEALlpQcBxpGDqJD6Hs2Qi0ZwEa/V/c+CASkfEXTCwoIxln\nSIhbOa4Un8VtYo3Nm2dgXhhngkhK0FVq85us8km7awt5dTNn/qUm4Xb4R+dS9w5V\neqkmIL5xZQK2jCTjmUzU40b/pMmxOBrSfftv5Z2I7hQHfGZCC94JZdUzeqlUXdwE\nr5iua0qqxqBN8KASWlqFlTbfmmrn2LSSSvaXKAtlX6vwUAd9F8C2qV42Y350zz75\n7V+rVgN4hXQddnqpn6PtCzw3Zb1SogxsLHxIl8rqa3MvnzhuJL4gUrOaWdxGgNT2\nzXiUTbdtYe/Nb3n+S6/0XLSOubwlJZ82pBCgzaesHwKBgQDtXp0swOOxdqi7+90E\nLd3dniio3NZDRrBVJRDr+5jnRcrXoIDucAZxh91KH8HjnKZzpeHRV1qYsufUsLz7\nNhv7FIHpJPegWhwJsurinspL1wlOtGLNMoc6otruzQJr//ZShQVTDYPhzMqBKf+7\nbsVSQxvGWv5zdO/TksoaRbf9WwKBgQC+SULN3thcKJxlnV3eQvleLPz9yLiaN3xv\nODYxkuRZgWgD+6QEVSS8ZXuT5VaaeHPTc9DkXrcLNoxxHhCaeAWJcEAzCuvTQoCc\nXQcuPfv+SZhgm1oPNVKCxXbL+Rll22Jz/4JlwLM3F0fMvJAIFIPgqScEE/IcKaLL\nFV8alOXQcwKBgG4AUbBit2IPTkTHhHYiV1YTrF4M8VJ+GMtsgPoLP6G1yznADN/y\nlFnaj6eBLhYwC0c+0XZ1F+v5xMvhF8MHIVJq/4Uu936dI68u9gENe0xIG+0YVU0o\npFh9Dh5qbTvlg55cPMpvUfW7NQFEmFmhDNqBdQaoNpEE2PtgZD5mnsxPAoGAQOeY\nQ8RpJDYt8nMU24UYrcjGmoHmhaO7a+xOf+ZMwULkicdBkMDCAQjUeAPX4GSJjWyJ\nqfusj8SRbtwEacvah6CkJUTqX2rll3AbzOgTlg7gTMNwmpNji3tzI+vZf+au1EYo\n4jAycO4d7XW74yWsPes0ha2P/Y8uGfs2L0jugoUCgYEAuZNQvLt+7/JBsbsPTtQj\n7VrEDL/D90M+pe0TmMUO6GIxyk/nYHJPU5P7CWNJ2g6OUxWpEfk/7mA3mcW/RvX1\n+XUQAxyJQRqkA+QeoEz7ppyWRN+1GZ70SNlUcWdLBHUYIBXWT1nYNHrOTq82FWAk\nj5vr+KbEcLLfagDHppfpTBA=\n-----END PRIVATE KEY-----\n",
    // //   client_email: "firebase-adminsdk-ea55d@bestapp-66e4d.iam.gserviceaccount.com",
    // //   client_id: "117594879509475412432",
    // //   auth_uri: "https://accounts.google.com/o/oauth2/auth",
    // //   token_uri: "https://oauth2.googleapis.com/token",
    // //   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    // //   client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ea55d%40bestapp-66e4d.iam.gserviceaccount.com",
    // //   universe_domain: "googleapis.com"
    // // };
    
    // // // Define the scopes required for the access token
    // // const scopes = [
    // //   "https://www.googleapis.com/auth/userinfo.email",
    // //   "https://www.googleapis.com/auth/firebase.database",
    // //   "https://www.googleapis.com/auth/firebase.messaging",
    // // ];

    // // const jwtClient = new JWT(
    // //   serviceAccount.client_email,
    // //   undefined,
    // //   serviceAccount.private_key,
    // //   scopes,
    // //   undefined
    // // );
  
    // // Obtain an access token
    // const tokens = await jwtClient.authorize();
    // const accessToken = tokens.access_token;
  
    
    const serverKey = accessToken;
    const response = await fetch('https://fcm.googleapis.com/v1/projects/bestapp-66e4d/messages:send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serverKey} `,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message:{
          token: token,
            notification: {
              title: title,
              body: body,
            },
        }
      }),
    });
  
    const data = await response.json();
    console.log('Notification sent:', data);
  };

  // Check if the user is authenticated and redirect if not
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login'); // Redirect to login page if not logged in
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [auth, navigate]);
  
 
  // useEffect(() => {
  //   fetchUsers();
  // }, []);

    useEffect(() => {
      const unsubscribe = onSnapshot(
        collection(db, 'users'),
        (querySnapshot) => {
          const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          usersData.sort((a, b) => (a.verified ? 1 : -1));
          setUsers(usersData);
          setLoading(false);
        },
        (error) => {
          console.error('Failed to fetch users:', error.message);
          setError('Failed to fetch users');
          setLoading(false);
        }
      );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, []);
  // const fetchUsers = async () => {
  //   setLoading(true);
  //   try {
  //     const querySnapshot = await getDocs(collection(db, 'users'));
  //     const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //     usersData.sort((a, b) => (a.verified ? 1 : -1));
  //     setUsers(usersData);
  //   } catch (error) {
  //     console.error('Failed to fetch users:', error.message);
  //     setError('Failed to fetch users');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const acceptUser = async (user) => {
    const userDocRef = doc(db, 'users', user.id);
  
    try {
      await updateDoc(userDocRef, { verified: true });
      // fetchUsers();
      console.log(`User ${user.id} has been verified.`);
    } catch (error) {
      console.error('Error verifying user:', error.message);
    }
  };

  const addUser = async (user) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      const userId = userCredential.user.uid;
      user['verified'] = true;
      await setDoc(doc(db, 'users', userId), { ...user, id: userId });
      setUsers((prevUsers) => [...prevUsers, { id: userId, ...user }]);
      setShowAddModal(false);
      toast.success('User added successfully!');
    } catch (error) {
      console.error('Failed to add user:', error.message);
      toast.error(`Failed to add user: ${error.message}`);
      setError('Failed to add user');
    }
  };

  const editUser = async (user) => {
    const userDocRef = doc(db, 'users', user.id);
  
    try {
      await updateDoc(userDocRef, user);
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, ...user } : u))
      );
      setShowEditModal(false);
      toast.success('User updated successfully!');
    } catch (error) {
      console.error('Failed to update user:', error.message);
      toast.error(`Failed to update user: ${error.message}`);
      setError('Failed to update user');
    }
  };

  const deleteUser = async (id) => {
    const userDocRef = doc(db, 'users', id);
  
    try {
      await deleteDoc(userDocRef);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Failed to delete user:', error.message);
      toast.error(`Failed to delete user: ${error.message}`);
      setError('Failed to delete user');
    }
  };

  // Filtered users based on the filter input and role filter
  const filteredUsers = users.filter((user) => {
    return (
      (user.firstname?.toLowerCase().includes(filter.toLowerCase()) ||
        user.lastname?.toLowerCase().includes(filter.toLowerCase()) ||
        user.email?.toLowerCase().includes(filter.toLowerCase())) &&
      (roleFilter ? user.role.toLowerCase() === roleFilter.toLowerCase() : true)
    );
  });

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="min-h-screen bg-background p-6">
        <div className="flex flex-col md:flex-row md:justify-end md:items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="Filter by name, email..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-main w-full md:w-1/3"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-main w-full md:w-1/4"
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="instructor">Faculty</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-main text-white px-6 py-2 rounded-md font-semibold hover:bg-bu transition-colors w-full md:w-auto"
          >
            Add User
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
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
                    <td className="py-3 px-4">{user.firstname}</td>
                    <td className="py-3 px-4">{user.middlename}</td>
                    <td className="py-3 px-4">{user.lastname}</td>
                    <td className="py-3 px-4">{user.course}</td>
                    <td className="py-3 px-4">{user.year}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.role}</td>
                    <td className="py-3 px-4 space-x-2">
                      {user.verified ? (
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
                      ) : (
                        <>
                          <button
                            onClick={async () => {
                              await acceptUser(user);
                              sendNotification(user.token, user.accessToken , "Your registration has been accepted!", "You may now use your account to access full feature of BEST APP");
                            }}
                            className="text-white bg-green-500 px-2 py-1 rounded-md hover:bg-green-700 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={async () => {
                              await deleteUser(user.id);
                              sendNotification(user.token, user.accessToken, "Your registration has been rejected!", "Sorry, your application has been rejected, please contact our administrator.");
                            }}
                            className="text-white bg-red-500 px-2 py-1 rounded-md hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    user || { firstname: '', middlename: '', lastname: '', course: '', year: '', email: '', role: '', password: '' }
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
          {/* Form Fields */}
          {['firstname', 'middlename', 'lastname', 'course', 'email'].map((field, index) => (
            <div className="mb-4" key={index}>
              <label className="block text-gray-700 mb-2">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
                required={field !== 'middlename'}
              />
            </div>
          ))}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
              required
            >
              <option value="">Select Year</option>
              {['1st Year', '2nd Year', '3rd Year', '4th Year','Faculty'].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          {!user && (
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
          )}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
              required
            >
              {['student', 'instructor', 'admin'].map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
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

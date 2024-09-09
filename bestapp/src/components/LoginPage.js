import React, { useState } from 'react';
import bestLogo from '../assets/best.png'; // Import your logo
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Initialize Firebase Auth and Firestore
  const auth = getAuth();
  const db = getFirestore();

  // Handle login logic
  const handleLogin = async () => {
    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user details from Firestore to determine the role
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log(userData);
        // Check user role and redirect accordingly
        if (userData.role === 'admin') {
          navigate('/users'); // Redirect to User Management page for admin
        } else {
          setError('Invalid role privileges!');
        }
      } else {
        setError('User document does not exist');
      }
    } catch (error) {
      console.log(error.code);
      // Handle errors
      console.log(error);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="max-w-sm w-full bg-white shadow-lg rounded-lg p-6 sm:p-8 lg:p-10">
        {/* Logo and Title */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <img src={bestLogo} alt="BestApp Logo" className="h-16 w-16 sm:h-20 sm:w-20 object-contain" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-center text-main mb-4 sm:mb-6">Login to BestApp</h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Email Input */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-gray-700 font-medium mb-1 sm:mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-gray-700 font-medium mb-1 sm:mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-main text-white py-2 rounded-md font-semibold hover:bg-bu transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import Supabase client
import bestLogo from '../assets/best.png'; // Import your logo

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle login logic
  const handleLogin = async () => {
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError('Invalid email or password');
    } else {
      // Fetch user details to determine the role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', loginData.user.id)
        .single();

      if (userError) {
        setError('Failed to fetch user role');
      } else {
        // Check user role and redirect accordingly
        if (userData.role === 'admin') {
          navigate('/users'); // Redirect to User Management page for admin
        } else {
          navigate('/directory'); // Redirect to Directory page for other roles
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        {/* Logo and Title */}
        <div className="flex justify-center mb-6">
          <img src={bestLogo} alt="BestApp Logo" className="h-20 w-20 object-contain" />
        </div>
        <h2 className="text-2xl font-bold text-center text-main mb-6">Login to BestApp</h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
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

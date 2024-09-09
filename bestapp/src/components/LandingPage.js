// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bestLogo from '../assets/best.png'; // Import your logo
import { supabase } from '../supabaseClient'; // Import Supabase client

const Navbar = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to the home page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      {/* Logo and Branding */}
      <div className="flex items-center space-x-4">
        {/* Make the logo clickable to redirect to home/landing page */}
        <Link to="/">
          <img src={bestLogo} alt="BestApp Logo" className="h-12 w-12 object-contain" />
        </Link>
        <h1 className="text-3xl font-bold text-primary">
          <Link to="/">BestApp</Link>
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex space-x-6 items-center">
        <Link to="/users" className="text-lg text-main font-medium hover:text-accent transition-colors">
          User Management
        </Link>
        <Link to="/directory" className="text-lg text-main font-medium hover:text-accent transition-colors">
          Directory
        </Link>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="text-lg text-white bg-main px-4 py-2 rounded-md hover:bg-bu transition-colors"
        >
          Logout
        </button>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button className="text-main focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;

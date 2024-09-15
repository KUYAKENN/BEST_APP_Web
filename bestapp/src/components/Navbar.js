import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bestLogo from '../assets/best.png'; // Import your logo
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { onMessage } from 'firebase/messaging';
import { toast, ToastContainer } from "react-toastify";
import { messaging } from '../firebase/firebaseConfig';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate();
  const auth = getAuth();

  // Function to handle logout
  const handleLogout = async () => {
  
    try {
      await signOut(auth);
      console.log('User logged out successfully.');
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login'); // Redirect to login page if not logged in
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [auth, navigate]);

  // onMessage(messaging, (payload) => {
  //   console.
  //   // alert(payload.notification.title ?? 'New account registration');
  // });
  return (
    <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      {/* Logo and Branding */}
      <div className="flex items-center space-x-4">
        {/* Make the logo clickable to redirect to home/landing page */}
        <Link to="/users" className="flex items-center">
          <img src={bestLogo} alt="BestApp Logo" className="h-12 w-12 object-contain" />
          <h1 className="text-2xl font-bold text-primary ml-2">BestApp</h1>
        </Link>
      </div>

      {/* Navigation Links for Desktop */}
      <nav className="hidden md:flex space-x-8 items-center">
        <Link to="/users" className="text-lg text-gray-700 hover:text-main transition-colors duration-300">
          User Management
        </Link>
        <Link to="/directory" className="text-lg text-gray-700 hover:text-main transition-colors duration-300">
          Directory
        </Link>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="text-lg bg-main text-white px-4 py-2 rounded-md hover:bg-accent transition-colors duration-300"
        >
          Logout
        </button>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          className="text-main focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Toggle mobile menu
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 md:hidden">
          <Link
            to="/users"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-main transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            User Management
          </Link>
          <Link
            to="/directory"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-main transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Directory
          </Link>
          {/* Logout Button for Mobile */}
          <button
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-main transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      )}
      {/* <ToastContainer/> */}
    </header>
  );
};

export default Navbar;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserManagement from './components/UserManagement';
import Directory from './components/Directory'; // Import the Directory component
import LoginPage from './components/LoginPage'; // Import LoginPage

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route for the login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route path="/users" element={<UserManagement />} />
        <Route path="/directory" element={<Directory />} />

        {/* Redirect to UserManagement as the default landing page for authenticated users */}
        <Route path="/" element={<Navigate to="/users" />} />

        {/* Catch-all route to handle undefined routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;

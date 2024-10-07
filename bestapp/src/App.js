import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserManagement from './components/UserManagement';
import Directory from './components/Directory'; // Import the Directory component
import LoginPage from './components/LoginPage'; // Import 
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCx_rdyDQwo62aXQvAVbfI6V6OjJuF-twA",
  authDomain: "bestapp-66e4d.firebaseapp.com",
  projectId: "bestapp-66e4d",
  storageBucket: "bestapp-66e4d.appspot.com",
  messagingSenderId: "980959173211",
  appId: "1:980959173211:web:e101c44a09f70ddf8e7d7e",
  measurementId: "G-P0KW57G0DL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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

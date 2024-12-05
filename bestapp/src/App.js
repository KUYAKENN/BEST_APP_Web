import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserManagement from './components/UserManagement';
import Directory from './components/Directory'; // Import the Directory component
import LoginPage from './components/LoginPage'; // Import 
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getToken, getMessaging, onMessage} from "firebase/messaging";
import { toast, ToastContainer } from "react-toastify";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { messaging} from './firebase/firebaseConfig'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCx_rdyDQwo62aXQvAVbfI6V6OjJuF-twA",
//   authDomain: "bestapp-66e4d.firebaseapp.com",
//   projectId: "bestapp-66e4d",
//   storageBucket: "bestapp-66e4d.appspot.com",
//   messagingSenderId: "980959173211",
//   appId: "1:980959173211:web:e101c44a09f70ddf8e7d7e",
//   measurementId: "G-P0KW57G0DL"
// };
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//     .register('/firebase-messaging-sw.js')
//     .then((registration) => {
//       console.log('Service Worker registered with scope:', registration.scope);
//     })
//     .catch((error) => {
//       console.error('Service Worker registration failed:', error);
//     });
// }




const db = getFirestore();
const auth = getAuth();
// import { getToken } from "firebase/messaging";
// import { messaging } from "./firebase/firebaseConfig";

const  VITE_APP_VAPID_KEY = 'BIaL6wkWdoinVktvlusuJ-TcPSKIiduu_kO43RB1Sb-BUhyqpJa_hPlWTDzqsHhQh9muGIj3oZx06V9QNIvehGc';

async function requestPermission() {
  //requesting permission using Notification API
  
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: VITE_APP_VAPID_KEY,
    });
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        updateToken(token,user.uid);
        // console.log('HATDOG',user);
        unsubscribe();
      }
    });

    //We can send token to server
    console.log("Token generated : ", token);
  } else if (permission === "denied") {
    //notifications are blocked
    alert("You denied for the notification");
  }
}

const updateToken = async (token, userId) => {
  if(!auth.currentUser?.uid){
    return;
  }
  const userDocRef = doc(db, 'users', userId);

  try {
    await updateDoc(userDocRef, { token: token });
    // fetchUsers();
    console.log(`Token refreshed.`);
  } catch (error) {
    console.error('Error verifying user:', error.message);
  }
};


const App = () => {
  onMessage(messaging, (payload) => {
    // console.log("???")
    alert(payload.notification.title ?? 'New account registration');
  });
  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <>
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
    <ToastContainer />
    </>
    
  );
};

export default App;

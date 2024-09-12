import { initializeApp } from "firebase/app";

import { getMessaging } from "firebase/messaging";

//Firebase Config values imported from .env file
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

// Messaging service
export const messaging = getMessaging(app);
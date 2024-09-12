// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker
// "Default" Firebase configuration (prevents errors)
const defaultConfig ={
  apiKey: "AIzaSyCx_rdyDQwo62aXQvAVbfI6V6OjJuF-twA",
  authDomain: "bestapp-66e4d.firebaseapp.com",
  projectId: "bestapp-66e4d",
  storageBucket: "bestapp-66e4d.appspot.com",
  messagingSenderId: "980959173211",
  appId: "1:980959173211:web:e101c44a09f70ddf8e7d7e",
  measurementId: "G-P0KW57G0DL"
};

firebase.initializeApp(defaultConfig  );

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
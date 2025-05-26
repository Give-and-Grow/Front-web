importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDhMoSDeszZkXJtaZtk_kv4Yup55SZjuU0",
  authDomain: "givandgrow.firebaseapp.com",
  projectId: "givandgrow",
  storageBucket: "givandgrow.firebasestorage.app",
  messagingSenderId: "986845833863",
  appId: "1:986845833863:web:42052d0f838216bc38a622",
  measurementId: "G-1H9JDP5W24"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

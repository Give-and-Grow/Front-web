// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDhMoSDeszZkXJtaZtk_kv4Yup55SZjuU0",
  authDomain: "givandgrow.firebaseapp.com",
  projectId: "givandgrow",
  storageBucket: "givandgrow.firebasestorage.app",
  messagingSenderId: "986845833863",
  appId: "1:986845833863:web:42052d0f838216bc38a622",
  measurementId: "G-1H9JDP5W24"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted.');
      return null;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: 'BMmhMIJZfIPwZZazoerVM67q4lSjlMCfEb6y8po5DIkXg4PK6oCSEp9tQ3j8lV5__0VsQvh5Qm2Aer-ALjIW8Lo'
    });

    if (currentToken) {
      console.log('FCM Token:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (error) {
    console.error("Unable to get FCM token", error);
    return null;
  }
};


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "sorcererwardrobe.firebaseapp.com",
  projectId: "sorcererwardrobe",
  storageBucket: "sorcererwardrobe.firebasestorage.app",
  messagingSenderId: "703201222446",
  appId: "1:703201222446:web:2e39596908d653dd1aa4bf",
  measurementId: "G-2LR9LYDKV0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
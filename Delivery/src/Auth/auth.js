// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKRlJODc12vjQmTtsjZipNyxkFCgL3VjE",
  authDomain: "delivery-app-e0827.firebaseapp.com",
  projectId: "delivery-app-e0827",
  storageBucket: "delivery-app-e0827.firebasestorage.app",
  messagingSenderId: "726663207680",
  appId: "1:726663207680:web:c5792f5dbca4bdafd0b1e5",
  measurementId: "G-V0S97TG2JN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
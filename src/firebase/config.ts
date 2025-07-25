// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-i_Zdg5XSwQigPwtRXVBTdyAqgYiba9E",
  authDomain: "water-rats-tracker.firebaseapp.com",
  projectId: "water-rats-tracker",
  storageBucket: "water-rats-tracker.firebasestorage.app",
  messagingSenderId: "1051404356421",
  appId: "1:1051404356421:web:73a49036ee6e2b6ec84c2c",
  measurementId: "G-V0XK3TEP4V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
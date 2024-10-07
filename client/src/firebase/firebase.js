// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4mhN9qcNxQBQIe5fdqU4ajVoT5BC50Kc",
  authDomain: "employee-management-cdc1d.firebaseapp.com",
  projectId: "employee-management-cdc1d",
  storageBucket: "employee-management-cdc1d.appspot.com",
  messagingSenderId: "1050744431160",
  appId: "1:1050744431160:web:6d1f5b0e734e9bc74bfccd",
  measurementId: "G-VH6HFV37VX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config for campuswhispers-9edfe project
const firebaseConfig = {
  apiKey: "AIzaSyAerbM4QF9IiCnSnDZ1P9avBh_ACLslN8s",
  authDomain: "reach-a3176.firebaseapp.com",
  projectId: "reach-a3176",
  storageBucket: "reach-a3176.firebasestorage.app",
  messagingSenderId: "212707710810",
  appId: "1:212707710810:web:e91d2500b12d888e238563",
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
export const db = getFirestore(app);

console.log("Firebase initialized for campuswhispers-9edfe project");

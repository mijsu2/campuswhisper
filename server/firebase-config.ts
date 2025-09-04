import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase config for campuswhispers-9edfe project
const firebaseConfig = {
  apiKey: "AIzaSyAYQrEwrW2xOD4PyoQjDYwdCLIeLTn39IM",
  authDomain: "campuswhispers-9edfe.firebaseapp.com",
  projectId: "campuswhispers-9edfe",
  storageBucket: "campuswhispers-9edfe.firebasestorage.app",
  messagingSenderId: "1052127202505",
  appId: "1:1052127202505:web:3bd1125e620f70acc0d118"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
export const db = getFirestore(app);

console.log('Firebase initialized for campuswhispers-9edfe project');
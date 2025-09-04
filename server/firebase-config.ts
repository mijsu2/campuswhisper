import { initializeApp, getApps, App, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';

let app: App;

const initializeFirebase = () => {
  if (getApps().length === 0) {
    try {
      // Initialize with Google API key for campuswhispers-9edfe project
      const firebaseConfig = {
        apiKey: process.env.GOOGLE_API_KEY,
        authDomain: "campuswhispers-9edfe.firebaseapp.com",
        projectId: "campuswhispers-9edfe",
        storageBucket: "campuswhispers-9edfe.firebasestorage.app",
        messagingSenderId: "1052127202505",
        appId: "1:1052127202505:web:3bd1125e620f70acc0d118"
      };

      // For admin SDK, we need to use service account or application default credentials
      // If no service account is available, use application default credentials
      if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        const serviceAccount = {
          type: "service_account",
          project_id: "campuswhispers-9edfe",
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
        };
        
        app = initializeApp({
          credential: admin.credential.cert(serviceAccount as any),
          projectId: "campuswhispers-9edfe",
        });
      } else {
        // Use application default credentials or initialize without credentials for development
        app = initializeApp({
          projectId: "campuswhispers-9edfe",
        });
      }
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      throw error;
    }
  } else {
    app = getApps()[0];
  }
  
  return app;
};

export const getFirebaseApp = () => {
  if (!app) {
    initializeFirebase();
  }
  return app;
};

export const db = getFirestore(getFirebaseApp());
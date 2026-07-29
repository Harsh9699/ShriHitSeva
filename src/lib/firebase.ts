import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyCpTAzy2ulkHkJScRnCC78wOG64OzuJHXE",
  authDomain: "arboreal-magnet-8sx2c.firebaseapp.com",
  projectId: "arboreal-magnet-8sx2c",
  storageBucket: "arboreal-magnet-8sx2c.firebasestorage.app",
  messagingSenderId: "67190923601",
  appId: "1:67190923601:web:44874f82846b10f70ab370",
  firestoreDatabaseId: "ai-studio-e06360a1-9d48-4bbb-93c3-051c95b2a80d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

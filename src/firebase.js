// Firebase configuration and initialization

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZb8pMyg5O9oVnLFbRArd5SrucP6368Ac",
  authDomain: "attendance-c1406.firebaseapp.com",
  projectId: "attendance-c1406",
  storageBucket: "attendance-c1406.firebasestorage.app",
  messagingSenderId: "1075046645262",
  appId: "1:1075046645262:web:1e2f9ee169575083c8465f"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
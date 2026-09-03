// ============================================
// FILL THIS IN AFTER YOU CREATE YOUR FIREBASE PROJECT
// Project settings -> General -> Your apps -> Web app -> SDK setup and config
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEuKMVyJnbh9IJ8lWU_1RkRpB3Hmr33yw",
  authDomain: "fitness-club-nitn.firebaseapp.com",
  projectId: "fitness-club-nitn",
  storageBucket: "fitness-club-nitn.firebasestorage.app",
  messagingSenderId: "18793455409",
  appId: "1:18793455409:web:604c72472d6bd135215a10",
  measurementId: "G-SEE8NPEH04",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

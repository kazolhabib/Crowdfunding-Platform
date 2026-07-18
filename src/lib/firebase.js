import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMuw_2QNnkBL8oKcRVL746C-ntuFL9ssw",
  authDomain: "crowdfunding-platform-a4396.firebaseapp.com",
  projectId: "crowdfunding-platform-a4396",
  storageBucket: "crowdfunding-platform-a4396.firebasestorage.app",
  messagingSenderId: "835965349566",
  appId: "1:835965349566:web:e355ea178726691ef078ef",
  measurementId: "G-253DQJJ3T2"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };

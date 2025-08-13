// lib/firebase.js
import {
  getApp, getApps, initializeApp
} from "firebase/app";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "car-plate-tracker-5bb9a.firebaseapp.com",
  projectId: "car-plate-tracker-5bb9a",
  storageBucket: "car-plate-tracker-5bb9a.firebasestorage.app",
  messagingSenderId: "58358687104",
  appId: "1:58358687104:web:ce5711f33c506109780d65"
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Best-effort RN persistence (optional)
let auth;
try {
  const { initializeAuth, getReactNativePersistence } = require("firebase/auth");
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);

// --- expose a promise that resolves once a user exists
let _resolveAuthReady;
const authReady = new Promise((res) => (_resolveAuthReady = res));

onAuthStateChanged(auth, (user) => {
  if (!user) {
    signInAnonymously(auth).catch(() => {});
  } else {
    _resolveAuthReady && _resolveAuthReady(user);
  }
});

export { app, auth, authReady, db };


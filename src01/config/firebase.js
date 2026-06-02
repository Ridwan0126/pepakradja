import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6TccE84ngSF0QaJ3zHD4wDP-P2gAyTuY",
  authDomain: "diskumperindag-aae4f.firebaseapp.com",
  databaseURL: "https://diskumperindag-aae4f-default-rtdb.firebaseio.com",
  projectId: "diskumperindag-aae4f",
  storageBucket: "diskumperindag-aae4f.firebasestorage.app",
  messagingSenderId: "736500223311",
  appId: "1:736500223311:web:500b12da2a84e1bd3bc93a",
  measurementId: "G-WVWZ3F76VR",
};

let app = null;
let dbInstance = null;
let firebaseAuth = null;
let initPromise = null;

const initFirebase = async () => {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      console.log("[v0] Starting Firebase initialization...");

      app = initializeApp(firebaseConfig);
      console.log("[v0] Firebase app initialized successfully");

      dbInstance = getFirestore(app);
      console.log("[v0] Firestore database initialized successfully");

      // Enable offline persistence untuk Firestore
      try {
        await dbInstance.enablePersistence();
        console.log("[v0] Firestore offline persistence enabled");
      } catch (err) {
        if (err.code === "failed-precondition") {
          console.log("[v0] Multiple tabs open - offline persistence disabled");
        } else if (err.code === "unimplemented") {
          console.log("[v0] Browser does not support offline persistence");
        }
      }

      firebaseAuth = getAuth(app);
      console.log("[v0] Firebase Auth initialized");

      console.log("[v0] Firebase initialization complete!");
      return { app, dbInstance, firebaseAuth };
    } catch (error) {
      console.error("[v0] Firebase initialization failed:", error.message);
      dbInstance = null;
      throw new Error(`Firebase initialization failed: ${error.message}`);
    }
  })();

  return initPromise;
};

export const getDb = async () => {
  if (!initPromise) {
    await initFirebase();
  }

  if (!dbInstance) {
    try {
      await initPromise;
    } catch (err) {
      console.error("[v0] Error awaiting Firebase init:", err.message);
      throw new Error(
        "Firestore database not initialized. Check Firebase Console configuration."
      );
    }
  }

  if (!dbInstance) {
    throw new Error(
      "Firestore database not available. Ensure Cloud Firestore is enabled in Firebase Console."
    );
  }

  return dbInstance;
};

export const getApp = () => {
  if (!app) {
    throw new Error("Firebase app not initialized");
  }
  return app;
};

export const getAuthInstance = () => {
  if (!firebaseAuth) {
    throw new Error("Firebase Auth not initialized");
  }
  return firebaseAuth;
};

initFirebase().catch((err) => {
  console.error(
    "[v0] Firebase initialization error on module load:",
    err.message
  );
});

export default app;

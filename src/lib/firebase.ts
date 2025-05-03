import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore

// Your web app's Firebase configuration
// IMPORTANT: Populate these values from your Firebase project settings into your .env.local file.
// Copy src/.env.local.example to src/.env.local if you haven't already.
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// --- IMPORTANT ---
// Ensure environment variables are loaded correctly, especially in client-side components.
// Prefix browser-exposed variables with NEXT_PUBLIC_.

// Validate Firebase config - Throw clear errors if critical keys are missing
if (!firebaseConfig.apiKey) {
  console.error("Firebase API Key is missing!");
  throw new Error("Missing Firebase API Key. Ensure NEXT_PUBLIC_FIREBASE_API_KEY is set in your .env.local file. Refer to the README for setup instructions.");
}
if (!firebaseConfig.authDomain) {
    console.error("Firebase Auth Domain is missing!");
    throw new Error("Missing Firebase Auth Domain. Ensure NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is set in your .env.local file. Refer to the README for setup instructions.");
}
// Project ID is often optional but good practice to have
if (!firebaseConfig.projectId) {
    console.warn("Firebase projectId (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is missing in .env.local. While often optional, it's recommended for full Firebase functionality.");
}

// Initialize Firebase
let app;
if (!getApps().length) {
  try {
    console.log("Initializing Firebase app...");
    app = initializeApp(firebaseConfig);
    console.log("Firebase app initialized successfully.");
  } catch (error) {
    console.error("Firebase initialization error:", error);
    throw new Error(`Could not initialize Firebase. Please check your configuration in .env.local. Ensure all NEXT_PUBLIC_FIREBASE_* variables are correct. Original error: ${error instanceof Error ? error.message : String(error)}`);
  }
} else {
  app = getApp();
}

let auth: ReturnType<typeof getAuth>;
let db: ReturnType<typeof getFirestore>;

try {
    auth = getAuth(app);
    db = getFirestore(app); // Initialize Firestore
    // console.log("Firebase Auth and Firestore initialized successfully."); // Optional logging
} catch (error) {
    console.error("Firebase Auth/Firestore initialization error:", error);
    throw new Error(`Could not initialize Firebase services. Please check your Firebase project settings and .env.local configuration. Original error: ${error instanceof Error ? error.message : String(error)}`);
}

export { app, auth, db }; // Export db

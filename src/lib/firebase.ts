import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore'; // Example: if you need Firestore

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

// Validate Firebase config - Throw clear errors if critical keys are missing
// --- IMPORTANT ---
// If you're seeing errors below, check that you have created a src/.env.local file
// and copied the correct values from your Firebase project settings.
if (!firebaseConfig.apiKey) {
  console.error("Firebase API Key is missing!");
  // This error means the NEXT_PUBLIC_FIREBASE_API_KEY is not set in your environment.
  // Check your src/.env.local file.
  throw new Error("Missing Firebase API Key. Ensure NEXT_PUBLIC_FIREBASE_API_KEY is set in your .env.local file. Refer to the README for setup instructions.");
}
if (!firebaseConfig.authDomain) {
    console.error("Firebase Auth Domain is missing!");
    // This error means the NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is not set in your environment.
    // Check your src/.env.local file.
    throw new Error("Missing Firebase Auth Domain. Ensure NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is set in your .env.local file. Refer to the README for setup instructions.");
}
// Project ID is often optional but good practice to have
if (!firebaseConfig.projectId) {
    console.warn("Firebase projectId (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is missing in .env.local. While often optional, it's recommended for full Firebase functionality.");
}


// Initialize Firebase
let app;
// Prevent duplicate initialization in HMR scenarios
if (!getApps().length) {
  try {
    console.log("Initializing Firebase app...");
    app = initializeApp(firebaseConfig);
    console.log("Firebase app initialized successfully.");
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Provide a more user-friendly error message
    throw new Error(`Could not initialize Firebase. Please check your configuration in .env.local. Ensure all NEXT_PUBLIC_FIREBASE_* variables are correct. Original error: ${error instanceof Error ? error.message : String(error)}`);
  }
} else {
  app = getApp();
  // console.log("Using existing Firebase app instance."); // Usually not needed, can be noisy
}


let auth: ReturnType<typeof getAuth>;
try {
    auth = getAuth(app);
    // console.log("Firebase Auth initialized successfully."); // Usually not needed
} catch (error) {
    console.error("Firebase Auth initialization error:", error);
    // Provide a more user-friendly error message
    throw new Error(`Could not initialize Firebase Authentication. Please check your Firebase project settings and .env.local configuration. Original error: ${error instanceof Error ? error.message : String(error)}`);
}

// const db = getFirestore(app); // Example: Initialize Firestore

export { app, auth };
// export { app, auth, db }; // Example export with Firestore

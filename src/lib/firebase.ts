import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore'; // Example: if you need Firestore

// Your web app's Firebase configuration
// IMPORTANT: Populate these values in your .env.local file
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase config
if (!firebaseConfig.apiKey) {
  throw new Error("Missing Firebase API Key. Make sure NEXT_PUBLIC_FIREBASE_API_KEY is set in your .env.local file.");
}
if (!firebaseConfig.authDomain) {
    throw new Error("Missing Firebase Auth Domain. Make sure NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is set in your .env.local file.");
}
if (!firebaseConfig.projectId) {
    console.warn("Firebase projectId is missing. Some Firebase services might not work correctly if not explicitly set.");
}


// Initialize Firebase
let app;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Handle the error appropriately - maybe show a message to the user or log it
    throw new Error("Could not initialize Firebase. Please check your configuration in .env.local.");
  }
} else {
  app = getApp();
}


let auth: ReturnType<typeof getAuth>;
try {
    auth = getAuth(app);
} catch (error) {
    console.error("Firebase Auth initialization error:", error);
    // Handle the error appropriately
    throw new Error("Could not initialize Firebase Authentication. Please check your configuration in .env.local.");
}

// const db = getFirestore(app); // Example: Initialize Firestore

export { app, auth };
// export { app, auth, db }; // Example export with Firestore

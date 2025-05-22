
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
const requiredConfigKeys: Array<keyof FirebaseOptions> = [
  'apiKey',
  'authDomain',
  'projectId',
  'appId',
]; // storageBucket and messagingSenderId might be optional depending on usage

for (const key of requiredConfigKeys) {
  if (!firebaseConfig[key]) {
    const envVarName = `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`;
    const errorMessage = `Missing Firebase ${key}. Ensure ${envVarName} is set in your .env.local file. Refer to the README.md for setup instructions.`;
    console.error(`Firebase Config Error: ${errorMessage}`);
    throw new Error(errorMessage);
  }
}

// Warnings for potentially optional keys if not set, but present in config object
if (!firebaseConfig.storageBucket) {
    console.warn("Firebase storageBucket (NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) is missing in .env.local. This might be required for features like image uploads to Firebase Storage.");
}
if (!firebaseConfig.messagingSenderId) {
    console.warn("Firebase messagingSenderId (NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) is missing in .env.local. This might be required for Firebase Cloud Messaging features.");
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

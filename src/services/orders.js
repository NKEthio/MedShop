import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, hasFirebaseConfig } from './firebase';

export async function createOrder({ customer, items, total }) {
  if (!hasFirebaseConfig || !db) {
    throw new Error('Firebase is not configured. Check your VITE_FIREBASE_* values.');
  }

  const orderPayload = {
    customer,
    items,
    total,
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, 'orders'), orderPayload);
  return ref.id;
}

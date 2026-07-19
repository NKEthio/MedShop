import { collection, getDocs } from 'firebase/firestore';
import { db, hasFirebaseConfig } from './firebase';

export async function getProducts() {
  if (!hasFirebaseConfig || !db) {
    return [];
  }

  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

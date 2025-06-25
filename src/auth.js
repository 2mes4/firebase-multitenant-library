import { getFirebaseAuth } from './firebase-init.js';

export async function getCurrentUser() {
  const auth = getFirebaseAuth();
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        window.location.href = '/login';
        reject(new Error('Usuario no autenticado'));
      }
    });
  });
}
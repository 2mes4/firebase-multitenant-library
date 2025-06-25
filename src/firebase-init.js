// src/firebase-init.js

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let firebaseApp;
let firebaseAuth;
let firebaseDb;

export function initFirebase(config) {
  if (!getApps().length) {
    firebaseApp = initializeApp(config);
  } else {
    firebaseApp = getApp();
  }

  firebaseAuth = getAuth(firebaseApp);
  firebaseDb = getFirestore(firebaseApp);
}

export function getFirebaseApp() {
  return firebaseApp;
}

export function getFirebaseAuth() {
  return firebaseAuth;
}

export function getFirebaseDb() {
  return firebaseDb;
}

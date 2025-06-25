import { getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc } from 'firebase/firestore';
import { getCurrentUser } from './auth.js';
import { getStoredCompanyId, storeCompanyId } from './storage.js';
import { getFirebaseApp } from './firebase-init.js'; // Asegúrate de exponer la app de Firebase aquí

export async function getListOfCompanies() {
  const db = getFirestore(getFirebaseApp());
  const user = await getCurrentUser();
  const email = user.email;

  const snapshot = await getDocs(collection(db, 'companies'));
  const companies = [];

  for (const companyDoc of snapshot.docs) {
    const userRef = doc(db, 'companies', companyDoc.id, 'users', email);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      companies.push({ id: companyDoc.id, ...companyDoc.data() });
    }
  }

  return companies;
}

export async function getSelectedCompany() {
  const storedId = getStoredCompanyId();
  if (storedId) return storedId;

  const companies = await getListOfCompanies();

  if (companies.length === 1) {
    storeCompanyId(companies[0].id);
    return companies[0].id;
  }

  return null;
}

export async function selectCompany(companyId) {
  storeCompanyId(companyId);
}

export async function createCompany(name) {
  const db = getFirestore(getFirebaseApp());
  const user = await getCurrentUser();
  const email = user.email;

  const newCompanyRef = await addDoc(collection(db, 'companies'), {
    name,
    createdAt: new Date(),
  });

  const userRef = doc(db, 'companies', newCompanyRef.id, 'users', email);
  await setDoc(userRef, {
    role: 'owner',
    createdAt: new Date(),
  });

  return newCompanyRef.id;
}

export function getCompanyPath(path) {
  const companyId = getStoredCompanyId();
  if (!companyId) throw new Error('No hay empresa seleccionada');
  return `companies/${companyId}/${path}`;
}

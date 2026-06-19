import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDKpWuVrH1g4PI9rikeucMN1j__ZaVoM94',
  authDomain: 'ecotrace-e319e.firebaseapp.com',
  projectId: 'ecotrace-e319e',
  storageBucket: 'ecotrace-e319e.firebasestorage.app',
  messagingSenderId: '90038247533',
  appId: '1:90038247533:web:be99dd843f98b420cd5f64',
  measurementId: 'G-5H10YRJXND',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) getAnalytics(app);
    })
    .catch(() => {
      // Analytics is optional and can be blocked by browser privacy settings.
    });
}

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signOutUser = () => signOut(auth);
export const subscribeToAuth = (callback) => onAuthStateChanged(auth, callback);

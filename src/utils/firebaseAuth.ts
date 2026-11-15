import { getApp, getApps, initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export function isFirebaseGoogleConfigured(): boolean {
  return Boolean(
    firebaseConfig &&
      typeof firebaseConfig.apiKey === 'string' &&
      firebaseConfig.apiKey.length > 0 &&
      typeof firebaseConfig.authDomain === 'string' &&
      firebaseConfig.authDomain.length > 0 &&
      typeof firebaseConfig.projectId === 'string' &&
      firebaseConfig.projectId.length > 0
  );
}

function getFirebaseAuthInstance() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
}

export async function signInWithGooglePopup(): Promise<{ idToken: string }> {
  const auth = getFirebaseAuthInstance();
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
  provider.setCustomParameters({ prompt: 'select_account' });

  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();
  return { idToken };
}

export async function firebaseSignOut(): Promise<void> {
  try {
    if (getApps().length > 0) {
      await signOut(getAuth(getApp()));
    }
  } catch {
    // ignore sign-out cleanup failure
  }
}

import {
  type Auth,
  GoogleAuthProvider,
  type User,
  getAuth,
  onAuthStateChanged as _onAuthStateChanged,
  signInWithPopup,
  signOut as _signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";

const STORAGE_KEY_NAME = "dominion_user_display_name";
const STORAGE_KEY_EMAIL = "dominion_user_email";
const STORAGE_KEY_PHOTO = "dominion_user_photo_url";
const STORAGE_KEY_UID = "dominion_user_uid";

const firebaseConfig = {
  apiKey: String(import.meta.env["VITE_FIREBASE_API_KEY"] ?? ""),
  authDomain: String(import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] ?? ""),
  projectId: String(import.meta.env["VITE_FIREBASE_PROJECT_ID"] ?? ""),
  appId: String(import.meta.env["VITE_FIREBASE_APP_ID"] ?? ""),
};

let auth: Auth | null = null;

function isConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
}

function getFirebaseAuth(): Auth | null {
  if (auth) return auth;
  if (!isConfigured()) return null;
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    return auth;
  } catch (e) {
    console.warn("Firebase init failed:", e);
    return null;
  }
}

export async function signInWithGoogle(): Promise<User | null> {
  const a = getFirebaseAuth();
  if (!a) {
    console.warn("Firebase not configured — Google sign-in unavailable");
    return null;
  }
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(a, provider);
    persistUser(result.user);
    return result.user;
  } catch (e) {
    console.warn("Google sign-in failed:", e);
    return null;
  }
}

export async function signOut(): Promise<void> {
  const a = getFirebaseAuth();
  if (a) {
    try {
      await _signOut(a);
    } catch {
      /* ignore */
    }
  }
  clearPersistedUser();
}

export function getCurrentUser(): User | null {
  return getFirebaseAuth()?.currentUser ?? null;
}

export function onAuthStateChanged(
  callback: (user: User | null) => void,
): () => void {
  const a = getFirebaseAuth();
  if (!a) {
    callback(null);
    return () => {};
  }
  return _onAuthStateChanged(a, (user) => {
    if (user) persistUser(user);
    else clearPersistedUser();
    callback(user);
  });
}

export function getPersistedDisplayName(): string | null {
  return localStorage.getItem(STORAGE_KEY_NAME);
}

export function getPersistedPhotoURL(): string | null {
  return localStorage.getItem(STORAGE_KEY_PHOTO);
}

export function getPersistedEmail(): string | null {
  return localStorage.getItem(STORAGE_KEY_EMAIL);
}

export function getPersistedUID(): string | null {
  return localStorage.getItem(STORAGE_KEY_UID);
}

function persistUser(user: User): void {
  if (user.displayName)
    localStorage.setItem(STORAGE_KEY_NAME, user.displayName);
  if (user.email) localStorage.setItem(STORAGE_KEY_EMAIL, user.email);
  if (user.photoURL) localStorage.setItem(STORAGE_KEY_PHOTO, user.photoURL);
  localStorage.setItem(STORAGE_KEY_UID, user.uid);
}

function clearPersistedUser(): void {
  localStorage.removeItem(STORAGE_KEY_NAME);
  localStorage.removeItem(STORAGE_KEY_EMAIL);
  localStorage.removeItem(STORAGE_KEY_PHOTO);
  localStorage.removeItem(STORAGE_KEY_UID);
}

export function isFirebaseConfigured(): boolean {
  return isConfigured();
}

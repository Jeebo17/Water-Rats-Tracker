import { signInWithCustomToken, signOut } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth, app } from './config';
import { IS_DEV } from "./util";

const functions = getFunctions(app, 'us-central1');
const DISPLAY_NAME_STORAGE_KEY = 'waterRatsDisplayName';

export function getStoredDisplayName() {
  if (typeof window === 'undefined') return '';

  return window.localStorage.getItem(DISPLAY_NAME_STORAGE_KEY) ?? '';
}

export function setStoredDisplayName(displayName: string) {
  if (typeof window === 'undefined') return;

  const trimmedDisplayName = displayName.trim();

  if (trimmedDisplayName) {
    window.localStorage.setItem(DISPLAY_NAME_STORAGE_KEY, trimmedDisplayName);
    return;
  }

  window.localStorage.removeItem(DISPLAY_NAME_STORAGE_KEY);
}

export async function login(password: string, displayName: string) {
  if (IS_DEV) { console.log('login') };

  try {
    const fn = httpsCallable(functions, 'loginWithPassword');
    const res = await fn({ password });

    console.log('Function response:', res.data);

    const { token } = res.data as { token: string };
    if (!token) throw new Error('No token returned from function');

    await signInWithCustomToken(auth, token);
    setStoredDisplayName(displayName);
    console.log('Login successful!');
  } catch (err: any) {
    console.error('LOGIN ERROR:', err);
    throw err;
  }
}

export async function logout() {
  if (IS_DEV) { console.log('logout') };

  try {
    await signOut(auth);
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error);
  }
}
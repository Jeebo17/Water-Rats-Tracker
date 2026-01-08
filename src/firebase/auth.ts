import { signInWithCustomToken, signOut } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth, app } from './config';

const functions = getFunctions(app, 'us-central1');

export async function login(password: string) {
  console.log('Calling loginWithPassword function');

  try {
    const fn = httpsCallable(functions, 'loginWithPassword');
    const res = await fn({ password });

    console.log('Function response:', res.data);

    const { token } = res.data as { token: string };
    if (!token) throw new Error('No token returned from function');

    await signInWithCustomToken(auth, token);
    console.log('Login successful!');
  } catch (err: any) {
    console.error('LOGIN ERROR:', err);
    throw err;
  }
}

export async function logout() {
  try {
    await signOut(auth);
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error);
  }
}
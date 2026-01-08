import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions(undefined, 'us-central1');

export async function login(password: string) {
  console.log('Calling loginWithPassword function');

  const fn = httpsCallable(functions, 'loginWithPassword');
  const res = await fn({ password });

  console.log('Function response:', res.data);

  const { token } = res.data as { token: string };

  await signInWithCustomToken(getAuth(), token);
}

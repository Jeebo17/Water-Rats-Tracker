import { doc, getDoc } from 'firebase/firestore';
import { db } from './config';

const AUTH_COLLECTION = 'auth';
const AUTH_DOC = 'password';

// Check if password is correct
export const verifyPassword = async (password: string): Promise<boolean> => {
  try {
    const docRef = doc(db, AUTH_COLLECTION, AUTH_DOC);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.password === password;
    }
    
    return false;
  } catch (error) {
    console.error('Error verifying password:', error);

    return false;
  }
};

export const storeAuthSession = (password: string): void => {
  localStorage.setItem('waterRatsAuth', password);
};

export const checkAuthSession = async (): Promise<boolean> => {
  const storedPassword = localStorage.getItem('waterRatsAuth');
  if (!storedPassword) return false;
  
  return await verifyPassword(storedPassword);
};

export const clearAuthSession = (): void => {
  localStorage.removeItem('waterRatsAuth');
};
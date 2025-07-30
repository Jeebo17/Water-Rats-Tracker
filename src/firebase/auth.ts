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
    
    // If document doesn't exist, default password is "Test"
    return password === 'Test';
  } catch (error) {
    console.error('Error verifying password:', error);
    // Fallback to default password if Firebase fails
    return password === 'Test';
  }
};

// Store password in localStorage for session persistence
export const storeAuthSession = (password: string): void => {
  localStorage.setItem('waterRatsAuth', password);
};

// Check if user has valid session
export const checkAuthSession = async (): Promise<boolean> => {
  const storedPassword = localStorage.getItem('waterRatsAuth');
  if (!storedPassword) return false;
  
  return await verifyPassword(storedPassword);
};

// Clear auth session
export const clearAuthSession = (): void => {
  localStorage.removeItem('waterRatsAuth');
};
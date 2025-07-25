import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  arrayUnion,
  arrayRemove 
} from 'firebase/firestore';
import { db } from './config';
import { Session } from '../types';

const SESSIONS_COLLECTION = 'sessions';

// Get all sessions
export const getSessions = async (): Promise<Session[]> => {
  try {
    const q = query(collection(db, SESSIONS_COLLECTION), orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Session));
  } catch (error) {
    console.error('Error getting sessions:', error);
    throw error;
  }
};

// Add new session
export const addSession = async (session: Omit<Session, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), session);
    return docRef.id;
  } catch (error) {
    console.error('Error adding session:', error);
    throw error;
  }
};

// Update session
export const updateSession = async (sessionId: string, updates: Partial<Session>): Promise<void> => {
  try {
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(sessionRef, updates);
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  }
};

// Delete session
export const deleteSession = async (sessionId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, SESSIONS_COLLECTION, sessionId));
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};

// Sign up instructor for session
export const signUpInstructor = async (sessionId: string, instructorId: string): Promise<void> => {
  try {
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(sessionRef, {
      instructorIds: arrayUnion(instructorId)
    });
  } catch (error) {
    console.error('Error signing up instructor:', error);
    throw error;
  }
};

// Remove instructor from session
export const removeInstructor = async (sessionId: string, instructorId: string): Promise<void> => {
  try {
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(sessionRef, {
      instructorIds: arrayRemove(instructorId)
    });
  } catch (error) {
    console.error('Error removing instructor:', error);
    throw error;
  }
};
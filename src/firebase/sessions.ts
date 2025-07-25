import { 
  collection, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  arrayUnion,
  arrayRemove,
  where,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db } from './config';
import { Session } from '../types';


const SESSIONS_COLLECTION = 'sessions';

// Get all sessions
export const getSessions = async (): Promise<Session[]> => {
  console.log('Fetching sessions from Firestore...');
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

// Get all sessions for this current monday-sunday week based on the field dbDate
export const getSessionsForWeek = async (day: Date): Promise<Session[]> => {
  const dayOfWeek = day.getDay();
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;

  const startOfWeek = new Date(day);
  startOfWeek.setDate(day.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  try {
    const start = Timestamp.fromDate(startOfWeek);
    const end = Timestamp.fromDate(endOfWeek);

    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where('dbDate', '>=', start),
      where('dbDate', '<=', end),
      orderBy('dbDate', 'asc')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Session[];
  } catch (error) {
    console.error('Error getting sessions for week:', error);
    throw error;
  }
};

// Get next 5 upcoming sessions
export const getUpcomingSessions = async (): Promise<Session[]> => {
  try {
    const now = Timestamp.now();
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where('dbDate', '>=', now),
      orderBy('dbDate', 'asc'),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Session[];
  } catch (error) {
    console.error('Error getting upcoming sessions:', error);
    throw error;
  }
};

// Add new session
export const addSession = async (session: Session): Promise<void> => {
  try {
    const docRef = doc(db, SESSIONS_COLLECTION, session.id);
    await setDoc(docRef, session);
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
  console.log(`Deleting session with ID: ${sessionId}`);
  try {
    await deleteDoc(doc(db, SESSIONS_COLLECTION, sessionId));
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};

// Sign up leader for session
export const signUpleader = async (sessionId: string, leaderId: string): Promise<void> => {
  try {
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(sessionRef, {
      leaderIds: arrayUnion(leaderId)
    });
  } catch (error) {
    console.error('Error signing up leader:', error);
    throw error;
  }
};

// Remove leader from session
export const removeleader = async (sessionId: string, leaderId: string): Promise<void> => {
  try {
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(sessionRef, {
      leaderIds: arrayRemove(leaderId)
    });
  } catch (error) {
    console.error('Error removing leader:', error);
    throw error;
  }
};
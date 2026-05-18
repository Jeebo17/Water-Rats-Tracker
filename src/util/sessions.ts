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
import { IS_DEV } from "./util";


const SESSIONS_COLLECTION = 'sessions';

const normalizeLeaderName = (leaderName: string) => leaderName.trim();

// Get all sessions
export const getSessions = async (): Promise<Session[]> => {
  if (IS_DEV) { console.log('getSessions'); }
  
  try {
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      orderBy('startTime', 'asc')
    );
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

// Get all sessions for this current monday-sunday week based on the field startTime
export const getSessionsForWeek = async (day: Date): Promise<Session[]> => {
  if (IS_DEV) { console.log('getSessionsForWeek: ', day); }

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
      where('startTime', '>=', start),
      where('startTime', '<=', end),
      orderBy('startTime', 'asc')
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
  if (IS_DEV) { console.log('getUpcomingSessions'); }

  try {
    const now = Timestamp.now();
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where('startTime', '>=', now),
      orderBy('startTime', 'asc'),
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
  if (IS_DEV) { console.log('addSession: ', session); }

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
  if (IS_DEV) { console.log('updateSession: ', sessionId, updates); }

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
  if (IS_DEV) { console.log('deleteSession: ', sessionId); }

  try {
    await deleteDoc(doc(db, SESSIONS_COLLECTION, sessionId));
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};

// Sign up leader for session  
export const signUpLeader = async (sessionId: string, leaderName: string): Promise<void> => {
  const normalizedLeaderName = normalizeLeaderName(leaderName);
  if (!normalizedLeaderName) return;

  if (IS_DEV) { console.log('signUpLeader: ', sessionId, normalizedLeaderName); }

  try {
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(sessionRef, {
      leaderNames: arrayUnion(normalizedLeaderName),
      declinedLeaderNames: arrayRemove(normalizedLeaderName)
    });
  } catch (error) {
    console.error('Error signing up leader:', error);
    throw error;
  }
};

// Remove leader from session  
export const removeLeader = async (sessionId: string, leaderName: string): Promise<void> => {
  const normalizedLeaderName = normalizeLeaderName(leaderName);
  if (!normalizedLeaderName) return;

  if (IS_DEV) { console.log('removeLeader: ', sessionId, normalizedLeaderName); }

  try {
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(sessionRef, {
      leaderNames: arrayRemove(normalizedLeaderName),
      declinedLeaderNames: arrayRemove(normalizedLeaderName)
    });
  } catch (error) {
    console.error('Error removing leader:', error);
    throw error;
  }
};

// Mark leader as declined for session
export const declineLeader = async (sessionId: string, leaderName: string): Promise<void> => {
  const normalizedLeaderName = normalizeLeaderName(leaderName);
  if (!normalizedLeaderName) return;

  if (IS_DEV) { console.log('declineLeader: ', sessionId, normalizedLeaderName); }

  try {
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(sessionRef, {
      declinedLeaderNames: arrayUnion(normalizedLeaderName),
      leaderNames: arrayRemove(normalizedLeaderName)
    });
  } catch (error) {
    console.error('Error declining leader:', error);
    throw error;
  }
};

// duplicate session by id
export const duplicateSession = async (sessionId: string): Promise<void> => {
  if (IS_DEV) { console.log('duplicateSession: ', sessionId); }

  try {
    const sessionSnap = await getDocs(query(collection(db, SESSIONS_COLLECTION), where('id', '==', sessionId)));
    if (sessionSnap.empty) {
      throw new Error('Session not found');
    }
    const originalSession = sessionSnap.docs[0].data() as Session;

    const newSessionId = `${sessionId}-copy-${Date.now()}`;
    const newSession: Session = {
      ...originalSession,
      id: newSessionId,
      activity: `${originalSession.activity} (Copy)`,
    };
    const newSessionRef = doc(db, SESSIONS_COLLECTION, newSessionId);
    await setDoc(newSessionRef, newSession);
  } catch (error) {
    console.error('Error duplicating session:', error);
    throw error;
  } 
};
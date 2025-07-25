import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from './config';
import { Leader } from '../types';

const LEADERS_COLLECTION = 'leaders';

// Get all leaders
export const getLeaders = async (): Promise<Leader[]> => {
  try {
    const q = query(collection(db, LEADERS_COLLECTION), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Omit<Leader, 'id'>;
      return {
        id: doc.id,
        ...data
      };
    });
  } catch (error) {
    console.error('Error getting leaders:', error);
    throw error;
  }
};

// Add new leader
export const addLeader = async (leader: Omit<Leader, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, LEADERS_COLLECTION), leader);
    return docRef.id;
  } catch (error) {
    console.error('Error adding leader:', error);
    throw error;
  }
};

// Update leader
export const updateLeader = async (leaderId: string, updates: Partial<Leader>): Promise<void> => {
  try {
    const leaderRef = doc(db, LEADERS_COLLECTION, leaderId);
    await updateDoc(leaderRef, updates);
  } catch (error) {
    console.error('Error updating leader:', error);
    throw error;
  }
};

// Delete leader
export const deleteLeader = async (leaderId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, LEADERS_COLLECTION, leaderId));
  } catch (error) {
    console.error('Error deleting leader:', error);
    throw error;
  }
};
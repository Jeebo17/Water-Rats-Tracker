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
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        personalQualifications: data.personalQualifications || [],
        scoutingQualifications: data.scoutingQualifications || [],
        youngLeader: data.youngLeader || false
      } as Leader;
    });
  } catch (error) {
    console.error('Error getting leaders:', error);
    throw error;
  }
};

// Add new leader
export const addLeader = async (leader: Omit<Leader, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, LEADERS_COLLECTION), {
      name: leader.name,
      email: leader.email,
      phone: leader.phone,
      personalQualifications: leader.personalQualifications,
      scoutingQualifications: leader.scoutingQualifications,
      youngLeader: leader.youngLeader
    });
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
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.personalQualifications !== undefined) updateData.personalQualifications = updates.personalQualifications;
    if (updates.scoutingQualifications !== undefined) updateData.scoutingQualifications = updates.scoutingQualifications;
    if (updates.youngLeader !== undefined) updateData.youngLeader = updates.youngLeader;
    
    await updateDoc(leaderRef, updateData);
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
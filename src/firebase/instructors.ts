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
import { Instructor } from '../types';

const INSTRUCTORS_COLLECTION = 'instructors';

// Get all instructors
export const getInstructors = async (): Promise<Instructor[]> => {
  try {
    const q = query(collection(db, INSTRUCTORS_COLLECTION), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Instructor));
  } catch (error) {
    console.error('Error getting instructors:', error);
    throw error;
  }
};

// Add new instructor
export const addInstructor = async (instructor: Omit<Instructor, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, INSTRUCTORS_COLLECTION), instructor);
    return docRef.id;
  } catch (error) {
    console.error('Error adding instructor:', error);
    throw error;
  }
};

// Update instructor
export const updateInstructor = async (instructorId: string, updates: Partial<Instructor>): Promise<void> => {
  try {
    const instructorRef = doc(db, INSTRUCTORS_COLLECTION, instructorId);
    await updateDoc(instructorRef, updates);
  } catch (error) {
    console.error('Error updating instructor:', error);
    throw error;
  }
};

// Delete instructor
export const deleteInstructor = async (instructorId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, INSTRUCTORS_COLLECTION, instructorId));
  } catch (error) {
    console.error('Error deleting instructor:', error);
    throw error;
  }
};
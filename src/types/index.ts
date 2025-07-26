import { Timestamp } from 'firebase/firestore';

export interface Leader {
  name: string;
  email: string;
  phone: string;
}

export interface Location {
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  costPerSession: number;
  facilities: string[];
  safetyNotes: string;
  equipment: string[];
}

export interface Session {
  id: string;
  dbDate?: any; // Firestore Timestamp
  dbDate: Timestamp;
  date: string | "TBD";
  time: string | "TBD";
  activity: string;
  groupType: 'Squirrels' | 'Beavers' | 'Cubs' | 'Scouts' | 'Explorers' | 'Network' | 'External' | 'Mixed';
  location: string | "TBD";
  leaderNames?: string[];
  leaderInCharge: string;
  maxParticipants?: number;
  expectedAttendees?: number;
  cost?: number;
  status: 'Planning' | 'Confirmed' | 'Completed' | 'Cancelled';
  weatherConditions?: string;
  notes?: string;
  equipment?: string[];
}

export interface FinancialRecord {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: 'venue' | 'equipment' | 'session_fees' | 'insurance' | 'other';
  amount: number;
  description: string;
  location?: string;
  sessionId?: string;
}
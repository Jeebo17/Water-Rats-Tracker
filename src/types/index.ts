import { Timestamp } from 'firebase/firestore';

export interface Leader {
  id: string;
  name: string;
  email: string;
  phone: string;
  personalQualifications: string[];
  scoutingQualifications: string[];
  youngLeader: boolean;
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
  dbDate: Timestamp;
  date: string | "TBD";
  time: string | "TBD";
  activity: string;
  groupType: 'Squirrels' | 'Beavers' | 'Cubs' | 'Scouts' | 'Explorers' | 'Network' | 'External' | 'Mixed';
  location: string | "TBD";
  leaderNames?: string[];
  leaderInCharge: string;
  maxParticipants?: number | 0;
  expectedAttendees?: number | 0;
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
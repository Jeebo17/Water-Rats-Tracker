import { Timestamp } from 'firebase/firestore';

export interface Leader {
  name: string;
  email: string;
  phone: string;
}

export interface Destination {
  id: string;
  name: string;
  type: 'lake' | 'river' | 'pool' | 'sea';
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
  destinationId: string | "TBD";
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
  destinationId?: string;
  sessionId?: string;
}
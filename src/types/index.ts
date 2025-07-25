export interface Instructor {
  id: string;
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
  date: string;
  time: string;
  activity: string;
  groupType: 'Squirrels' | 'Beavers' | 'Cubs' | 'Scouts' | 'Explorers' | 'Network' | 'External';
  destinationId: string;
  instructorIds: string[]; // Multiple instructors can sign up
  maxParticipants: number;
  expectedAttendees: number;
  cost: number;
  status: 'planned' | 'confirmed' | 'completed' | 'cancelled';
  weatherConditions?: string;
  notes?: string;
  equipment: string[];
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
import { Leader, Destination, Session, FinancialRecord } from '../types';

export const leaders: Leader[] = [
  {
    name: 'Mark Thompson',
    email: 'mark.thompson@email.com',
    phone: '07111 222333'
  },
  {
    name: 'Sophie Chen',
    email: 'sophie.chen@email.com',
    phone: '07222 333444'
  },
  {
    name: 'James Parker',
    email: 'james.parker@email.com',
    phone: '07333 444555'
  }
];

export const destinations: Destination[] = [
  {
    id: '1',
    name: 'Clearwater Lake',
    type: 'lake',
    contactName: 'Robert Green',
    contactEmail: 'info@clearwaterlake.com',
    contactPhone: '01234 567890',
    address: 'Clearwater Lake, Lakeside Road, Somewhere, AB12 3CD',
    costPerSession: 150,
    facilities: ['Changing rooms', 'Car park', 'Café', 'Equipment storage'],
    safetyNotes: 'Life jackets mandatory. No swimming in north bay during nesting season (April-July).',
    equipment: ['SUP boards', 'Paddles', 'Life jackets', 'Wetsuits']
  },
  {
    id: '2',
    name: 'River Adventure Centre',
    type: 'river',
    contactName: 'Lisa Brown',
    contactEmail: 'bookings@riveradventure.co.uk',
    contactPhone: '01345 678901',
    address: 'River Adventure Centre, Mill Lane, Riverside, CD34 5EF',
    costPerSession: 200,
    facilities: ['Heated changing rooms', 'Equipment room', 'Briefing area', 'Parking'],
    safetyNotes: 'Check river levels before session. Grade 2 rapids - experienced swimmers only.',
    equipment: ['Kayaks', 'Paddles', 'Helmets', 'Buoyancy aids', 'Dry bags']
  },
  {
    id: '3',
    name: 'Marina Bay Sailing Club',
    type: 'lake',
    contactName: 'Captain Tom Harris',
    contactEmail: 'sailing@marinabay.org',
    contactPhone: '01456 789012',
    address: 'Marina Bay, Harbour View, Coastal Town, EF45 6GH',
    costPerSession: 120,
    facilities: ['Clubhouse', 'Boat park', 'Slipway', 'Rigging area'],
    safetyNotes: 'Check weather conditions. Safety boat always on water during sessions.',
    equipment: ['Dinghies', 'Sails', 'Life jackets', 'Safety boat']
  }
];

export const sessions: Session[] = [
  {
    id: '1',
    date: '2025-01-25',
    time: '10:00',
    activity: 'SUP Introduction',
    groupType: 'Cubs',
    destinationId: '1',
    leaderNames: ['2'],
    maxParticipants: 12,
    expectedAttendees: 8,
    cost: 150,
    status: 'Confirmed',
    weatherConditions: 'Sunny, light winds',
    notes: 'Focus on basic paddling technique and safety',
    equipment: ['SUP boards', 'Paddles', 'Life jackets']
  },
  {
    id: '2',
    date: '2025-02-01',
    time: '14:00',
    activity: 'Kayaking Skills',
    groupType: 'Scouts',
    destinationId: '2',
    leaderNames: ['3'],
    maxParticipants: 10,
    expectedAttendees: 6,
    cost: 200,
    status: 'Planning',
    equipment: ['Kayaks', 'Paddles', 'Helmets', 'Buoyancy aids']
  },
  {
    id: '3',
    date: '2025-02-08',
    time: '10:00',
    activity: 'Sailing Basics',
    groupType: 'Explorers',
    destinationId: '3',
    leaderNames: ['1', '2'],
    maxParticipants: 15,
    expectedAttendees: 12,
    cost: 120,
    status: 'Confirmed',
    equipment: ['Dinghies', 'Sails', 'Life jackets']
  },
  {
    id: '4',
    date: '2025-02-15',
    time: '09:30',
    activity: 'Water Safety Course',
    groupType: 'External',
    destinationId: '1',
    leaderNames: [],
    maxParticipants: 8,
    expectedAttendees: 8,
    cost: 150,
    status: 'Planning',
    notes: 'Need 2 leaders for this session',
    equipment: ['Life jackets', 'Rescue equipment']
  }
];

export const financialRecords: FinancialRecord[] = [
  {
    id: '1',
    date: '2025-01-25',
    type: 'expense',
    category: 'venue',
    amount: 150,
    description: 'Clearwater Lake session fee',
    destinationId: '1',
    sessionId: '1'
  },
  {
    id: '2',
    date: '2025-01-20',
    type: 'income',
    category: 'session_fees',
    amount: 240,
    description: 'Cubs SUP session fees (8 participants × £30)'
  },
  {
    id: '3',
    date: '2025-01-15',
    type: 'expense',
    category: 'equipment',
    amount: 85,
    description: 'New life jacket replacement'
  },
  {
    id: '4',
    date: '2025-01-10',
    type: 'expense',
    category: 'insurance',
    amount: 300,
    description: 'Annual activity insurance renewal'
  }
];
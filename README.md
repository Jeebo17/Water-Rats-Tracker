# Water Rats Session Management System

A simplified session management system for the Water Rats watersports group, designed to help leaders sign up for sessions and track group activities.

## Features

- **Session Management**: Create and manage watersports sessions for different scout groups
- **Leader Signup**: Simple interface for leaders to sign up for sessions
- **Group Types**: Support for Squirrels, Beavers, Cubs, Scouts, Explorers, Network, and External groups
- **Financial Tracking**: Monitor session costs and payments
- **Firebase Integration**: Real-time data synchronization across all users

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Firebase project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Copy your Firebase configuration
   - Update `src/firebase/config.ts` with your Firebase config

4. Start the development server:
   ```bash
   npm run dev
   ```

### Firebase Setup

1. Go to the Firebase Console
2. Create a new project
3. Enable Firestore Database
4. Go to Project Settings > General > Your apps
5. Add a web app and copy the configuration
6. Replace the config in `src/firebase/config.ts`

### Usage

- **Dashboard**: Overview of upcoming sessions and key metrics
- **Sessions**: View all sessions, filter by status/group, and sign up as leader
- **Leaders**: Manage leader information and view their upcoming sessions

## Technology Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Firebase for backend services
- Lucide React for icons
- Date-fns for date handling

## Contributing

This system is designed to be simple and user-friendly for scout leaders and leaders who may not be tech-savvy. When making changes, prioritize simplicity and clear visual feedback.
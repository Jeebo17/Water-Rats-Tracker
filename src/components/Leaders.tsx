import React from 'react';
import { 
  UserCheck, 
  Plus, 
  Phone, 
  Mail,
  Calendar
} from 'lucide-react';
import { leaders, sessions } from '../data/mockData';
import { leader } from '../types';
import { format } from 'date-fns';

const Leaders: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Leaders</h1>
          <p className="text-gray-600">View all leaders and their upcoming sessions</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-lg font-medium">
          <Plus className="w-5 h-5" />
          <span>Add leader</span>
        </button>
      </div>

      {/* Leaders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {leaders.map(leader => (
          <LeaderCard key={leader.name} leader={leader} />
        ))}
      </div>
    </div>
  );
};

interface LeaderCardProps {
  leader: leader;
}

const LeaderCard: React.FC<LeaderCardProps> = ({ leader }) => {
  const leaderSessions = sessions.filter(session => 
    session.leaderNames.includes(leader.name) && 
    new Date(session.date) >= new Date()
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {leader.name.split(' ').map(n => n.charAt(0)).join('')}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{leader.name}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{leaderSessions.length} upcoming sessions</span>
            </div>
          </div>
        </div>
        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Mail className="w-5 h-5" />
        </button>
      </div>

      {/* Contact Information */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-gray-600">
          <Mail className="w-5 h-5 mr-3" />
          <span>{leader.email}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Phone className="w-5 h-5 mr-3" />
          <span>{leader.phone}</span>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Upcoming Sessions
        </h4>
        {leaderSessions.length > 0 ? (
          <div className="space-y-2">
            {leaderSessions.slice(0, 3).map(session => (
              <div key={session.id} className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">{session.activity}</div>
                    <div className="text-sm text-gray-600">
                      {format(new Date(session.date), 'MMM d')} at {session.time}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {session.groupType}
                  </span>
                </div>
              </div>
            ))}
            {leaderSessions.length > 3 && (
              <div className="text-center text-sm text-gray-500 mt-2">
                +{leaderSessions.length - 3} more sessions
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">No upcoming sessions</p>
        )}
      </div>
    </div>
  );
};

export default Leaders;
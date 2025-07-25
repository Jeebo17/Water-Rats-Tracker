import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Plus, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  UserCheck,
} from 'lucide-react';
import { destinations } from '../data/mockData';
import { Session } from '../types';
import { getSessions, addSession, deleteSession } from '../firebase/sessions';
import { sessionsToAdd } from '../data/uploadedData';

const Sessions: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Planning' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');
  const [groupFilter, setGroupFilter] = useState<string>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);

  const groupTypes = ['All', 'Squirrels', 'Beavers', 'Cubs', 'Scouts', 'Explorers', 'Network', 'External', 'Mixed'];

  const filteredSessions = sessions.filter(session => {
    const matchesStatus = filter === 'All' || session.status === filter;
    const matchesGroup = groupFilter === 'All' || session.groupType === groupFilter;
    return matchesStatus && matchesGroup;
  });

  useEffect(() => {
    const fetchSessions = async () => {
      const sessions = await getSessions();
      setSessions(sessions);
    };

    fetchSessions();
  }, []);

  const handleNewSession = async () => {
    for (const session of sessionsToAdd) {
      await addSession(session);
    }
    const updatedSessions = await getSessions();
    setSessions(updatedSessions);
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Sessions</h1>
          <p className="text-gray-600">Manage watersports sessions and sign up as leader</p>
        </div> */}
          <div className="flex items-center w-full gap-4 sm:mt-0">
            <button 
              className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center sm:justify-start space-x-2 text-lg font-medium"
              onClick={handleNewSession}
            >
              <Plus className="w-5 h-5" />
              <span>New Session</span>
            </button>

            <button 
              className="w-12 h-12 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
      </div>

      {/* Filters */}
      {showFilterDropdown && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Status</h3>
              <div className="flex flex-wrap gap-2">
              {(['All', 'Planning', 'Confirmed', 'Completed', 'Cancelled'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  <span className="ml-2 text-xs opacity-75">
                    {status === 'All' ? sessions.length : sessions.filter(s => s.status === status).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Group</h3>
            <div className="flex flex-wrap gap-2">
              {groupTypes.map(group => (
                <button
                  key={group}
                  onClick={() => setGroupFilter(group)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    groupFilter === group
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {group.charAt(0).toUpperCase() + group.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Filters Summary */}
      <div className="flex items-center justify-between bg-gray-50 p-1 rounded-lg">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{filteredSessions.length}</span> sessions
          {filter !== 'All' && ` | Status: ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
          {groupFilter !== 'All' && ` | Group: ${groupFilter}`}
        </div>
      </div>

      {/* Sessions List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredSessions.map(session => (
          <SessionCard key={session.id} session={session} setSessions={setSessions} />
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No sessions found</h3>
          <p className="text-gray-600">Try adjusting your filters or create a new session.</p>
        </div>
      )}
    </div>
  );
};

interface SessionCardProps {
  session: Session;
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, setSessions }) => {
  const destination = destinations.find(d => d.id === session.destinationId);

  const statusConfig = {
    Planning: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    Confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    Completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    Cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle }
  };

  const groupTypeColors = {
    'Squirrels': 'bg-pink-100 text-pink-800',
    'Beavers': 'bg-orange-100 text-orange-800',
    'Cubs': 'bg-blue-100 text-blue-800',
    'Scouts': 'bg-green-100 text-green-800',
    'Explorers': 'bg-purple-100 text-purple-800',
    'Network': 'bg-indigo-100 text-indigo-800',
    'External': 'bg-gray-100 text-gray-800',
    'Mixed': 'bg-teal-100 text-teal-800'
  };

  const StatusIcon = session.status ? statusConfig[session.status]?.icon : Clock;
  const needsLeaders = !session.leaderNames || session.leaderNames.length === 0;

  const handleDeleteSession = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this session?');
    if (!confirmed) return;

    await deleteSession(session.id);
    const sessions = await getSessions();
    setSessions(sessions);
  }

  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow ${
      needsLeaders ? 'border-l-4 border-orange-400' : ''
    }`}>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Main Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">{session.activity}</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${groupTypeColors[session.groupType]}`}>
                  {session.groupType}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${statusConfig[session.status]?.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  <span>{session.status}</span>
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Edit className="w-5 h-5" />
              </button>
              <button 
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                onClick={handleDeleteSession}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-4">
            <div className="space-y-1">
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                <span className="text-lg">{format(new Date(session.date), 'EEEE, MMMM d, yyyy')}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-3 text-gray-400" />
                <span className="text-lg">{session.time}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                <span className="text-lg">{destination?.name || 'Unknown venue'}</span>
              </div>
            </div>

            <div className="space-y-3">
              {session.expectedAttendees ? (
                <div className="flex items-center text-gray-700">
                  <Users className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="text-lg">
                    {session.expectedAttendees}
                    {session.maxParticipants ? `/${session.maxParticipants}` : ''}
                    {' participants'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center text-gray-400 italic">
                  <Users className="w-5 h-5 mr-3" />
                  <span className="text-lg">Number of participants not set</span>
                </div>
              )}
              
              {/* <div className="flex items-center text-gray-700">
                <span className="text-lg font-semibold">Cost: £{session.cost}</span>
              </div> */}
            </div>

            <div className="flex items-center text-gray-700">
              <p className="mr-3 text-gray-400">LIC</p>
              <span className="text-lg">{session.leaderInCharge || 'Unknown LIC'}</span>
            </div>
          </div>

          {/* leaders Section */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center text-lg">
              <UserCheck className="w-5 h-5 mr-2" />
              Leaders
              {needsLeaders && (
                <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                  NEEDED
                </span>
              )}
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {(session.leaderNames?.length ?? 0)} Assigned
              </span>
            </h4>

            {session.leaderNames ? (
              <div className="space-y-2">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex gap-1">
                    {session.leaderNames && session.leaderNames.map((leader, idx) => (
                      <p className="font-medium text-gray-800" key={leader}>
                        {leader}
                        {session.leaderNames && idx < session.leaderNames.length - 1 && ', '}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-800 font-medium mb-2">No leaders assigned</p>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                  Sign Up as leader
                </button>
              </div>
            )}
          </div>

          {session.notes && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Notes</h4>
              <p className="text-gray-700">{session.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sessions;
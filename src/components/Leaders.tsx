import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Plus, 
  Phone, 
  Mail,
  Calendar,
  Award,
  Users,
  Star
} from 'lucide-react';
import { Leader, Session } from '../types';
import { format } from 'date-fns';
import { getLeaders, populateInitialLeaders } from '../firebase/leaders';
import { getSessions } from '../firebase/sessions';

const Leaders: React.FC = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadersData, sessionsData] = await Promise.all([
          getLeaders(),
          getSessions()
        ]);
        setLeaders(leadersData);
        setSessions(sessionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePopulateLeaders = async () => {
    try {
      await populateInitialLeaders();
      // Refresh the leaders list
      const updatedLeaders = await getLeaders();
      setLeaders(updatedLeaders);
      alert('Leaders populated successfully!');
    } catch (error) {
      console.error('Error populating leaders:', error);
      alert('Error populating leaders. Check console for details.');
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Leaders</h1>
          <p className="text-gray-600">View all leaders and their upcoming sessions</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button 
            onClick={handlePopulateLeaders}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm font-medium"
          >
            <Users className="w-4 h-4" />
            <span>Populate Leaders</span>
          </button>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-lg font-medium">
            <Plus className="w-5 h-5" />
            <span>Add leader</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaders...</p>
        </div>
      ) : (
      {/* Leaders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {leaders.map(leader => (
          <LeaderCard key={leader.id} leader={leader} sessions={sessions} />
        ))}
      </div>
      )}

      {!loading && leaders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No leaders found</h3>
          <p className="text-gray-600 mb-4">Get started by populating the database with initial leaders.</p>
          <button 
            onClick={handlePopulateLeaders}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Users className="w-5 h-5" />
            <span>Populate Leaders</span>
          </button>
        </div>
      )}
    </div>
  );
};

interface LeaderCardProps {
  leader: Leader;
  sessions: Session[];
}

const LeaderCard: React.FC<LeaderCardProps> = ({ leader, sessions }) => {
  const leaderSessions = sessions.filter(session => 
    session.leaderNames?.includes(leader.name) && 
    new Date(session.date) >= new Date()
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${
            leader.youngLeader 
              ? 'bg-gradient-to-br from-purple-400 to-pink-500' 
              : 'bg-gradient-to-br from-green-400 to-blue-500'
          }`}>
            {leader.name.split(' ').map(n => n.charAt(0)).join('')}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-semibold text-gray-800">{leader.name}</h3>
              {leader.youngLeader && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Young Leader
                </span>
              )}
            </div>
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
      {(leader.email || leader.phone) && (
      <div className="space-y-3 mb-4">
        {leader.email && (
          <div className="flex items-center text-gray-600">
            <Mail className="w-5 h-5 mr-3" />
            <span>{leader.email}</span>
          </div>
        )}
        {leader.phone && (
          <div className="flex items-center text-gray-600">
            <Phone className="w-5 h-5 mr-3" />
            <span>{leader.phone}</span>
          </div>
        )}
      </div>
      )}

      {/* Qualifications */}
      <div className="space-y-4 mb-4">
        {/* Personal Qualifications */}
        <div>
          <h4 className="font-medium text-gray-800 mb-2 flex items-center text-sm">
            <Award className="w-4 h-4 mr-2" />
            Personal Qualifications
          </h4>
          {leader.personalQualifications.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {leader.personalQualifications.map((qual, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {qual}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">No qualifications listed</p>
          )}
        </div>

        {/* Scouting Qualifications */}
        <div>
          <h4 className="font-medium text-gray-800 mb-2 flex items-center text-sm">
            <UserCheck className="w-4 h-4 mr-2" />
            Scouting Qualifications
          </h4>
          {leader.scoutingQualifications.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {leader.scoutingQualifications.map((qual, index) => (
                <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  {qual}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">No qualifications listed</p>
          )}
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
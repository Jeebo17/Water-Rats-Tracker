import React from 'react';
import { Link } from 'react-router-dom';
import { format, addDays, startOfWeek } from 'date-fns';
import { 
  Calendar, 
  UserCheck, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  MapPin,
  User
} from 'lucide-react';
import { sessions, instructors, destinations } from '../data/mockData';

const Dashboard: React.FC = () => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const upcomingSessions = sessions
    .filter(session => new Date(session.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const thisWeekSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= weekStart && sessionDate < addDays(weekStart, 7);
  });

  const totalAttendees = thisWeekSessions.reduce((sum, session) => sum + session.expectedAttendees, 0);
  const sessionsNeedingInstructors = sessions.filter(session => 
    session.instructorIds.length === 0 && new Date(session.date) >= today
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Water Rats Dashboard</h1>
        <p className="text-blue-100">
          Welcome back! Here's what's happening this week.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="This Week's Sessions"
          value={thisWeekSessions.length}
          icon={<Calendar className="w-6 h-6" />}
          color="bg-blue-500"
          link="/sessions"
        />
        <StatCard
          title="Available Instructors"
          value={instructors.length}
          icon={<UserCheck className="w-6 h-6" />}
          color="bg-green-500"
          link="/instructors"
        />
        <StatCard
          title="Need Instructors"
          value={sessionsNeedingInstructors}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="bg-purple-500"
          link="/sessions"
        />
        <StatCard
          title="Expected Attendees"
          value={totalAttendees}
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-cyan-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* This Week's Schedule */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">This Week's Schedule</h2>
            <Link 
              to="/sessions" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          
          <div className="space-y-3">
            {weekDays.map(day => {
              const daySession = thisWeekSessions.find(session => 
                format(new Date(session.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
              );
              
              return (
                <div key={day.toISOString()} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-600">
                        {format(day, 'EEE')}
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        {format(day, 'd')}
                      </div>
                    </div>
                    {daySession ? (
                      <div>
                        <div className="font-medium text-gray-800">{daySession.activity}</div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {daySession.groupType}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {daySession.time}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {destinations.find(d => d.id === daySession.destinationId)?.name}
                          </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 italic">No session planned</div>
                    )}
                  </div>
                  {daySession && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800">
                        {daySession.expectedAttendees}/{daySession.maxParticipants}
                      </div>
                      <div className="text-xs text-gray-500">attendees</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Upcoming Sessions</h2>
            <Link 
              to="/sessions" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Manage →
            </Link>
          </div>
          
          <div className="space-y-4">
            {upcomingSessions.map(session => {
              const destination = destinations.find(d => d.id === session.destinationId);
              const sessionInstructors = session.instructorIds.map(id => 
                instructors.find(i => i.id === id)
              ).filter(Boolean);
              
              return (
                <div key={session.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-800">{session.activity}</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {session.groupType}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      session.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(session.date), 'EEEE, MMM d')} at {session.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {destination?.name}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {sessionInstructors.length > 0 
                        ? sessionInstructors.map(i => i!.name).join(', ')
                        : 'No instructors assigned'
                      }
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <UserCheck className="w-4 h-4 mr-2" />
                        {session.expectedAttendees}/{session.maxParticipants} expected
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Attention Required</h2>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-amber-600 mr-2" />
              <span className="text-amber-800 font-medium">Weather Alert</span>
            </div>
            <p className="text-amber-700 text-sm mt-1">
              Strong winds forecast for Sunday's sailing session. Consider rescheduling or moving to sheltered water.
            </p>
          </div>
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">Instructors Needed</span>
            </div>
            <p className="text-blue-700 text-sm mt-1">
              Water Safety Course session needs instructors. Check the sessions page to sign up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  link?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, link }) => {
  const content = (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return link ? <Link to={link}>{content}</Link> : content;
};

export default Dashboard;
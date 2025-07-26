import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, addDays, startOfWeek } from 'date-fns';
import { 
  Calendar, 
  UserCheck, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  MapPin,
  User,
  Activity,
  CheckCircle
} from 'lucide-react';
import { getSessionsForWeek, getUpcomingSessions } from '../firebase/sessions';
import { Session } from '../types';


const Dashboard: React.FC = () => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const [thisWeekSessions, setThisWeekSessions] = React.useState<Session[]>([]);
  const [upcomingSessions, setUpcomingSessions] = React.useState<Session[]>([]);

  const totalAttendees = thisWeekSessions.reduce((sum, session) => sum + (session.expectedAttendees ?? 0), 0);
  const sessionsNeedingLeaders = upcomingSessions.filter(session => 
    !session.leaderNames || session.leaderNames.length === 0
  ).length;
  const confirmedSessions = upcomingSessions.filter(session => session.status === 'Confirmed').length;
  const totalUpcomingSessions = upcomingSessions.length;

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const sessionsForWeek = await getSessionsForWeek(today);
        const sessionsUpcoming = await getUpcomingSessions();
        setThisWeekSessions(sessionsForWeek);
        setUpcomingSessions(sessionsUpcoming);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    fetchSessions();
  }, []);


  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-1">Water Rats Dashboard</h1>
        <p className="text-blue-100">
          Session overview and quick stats
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="This Week"
          value={thisWeekSessions.length}
          icon={<Calendar className="w-6 h-6" />}
          color="bg-blue-500"
          link="/sessions"
        />
        <StatCard
          title="Need Staff"
          value={sessionsNeedingLeaders}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="bg-orange-500"
          link="/sessions"
        />
        <StatCard
          title="Attendees"
          value={totalAttendees}
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-cyan-500"
        />
        <StatCard
          title="Confirmed"
          value={confirmedSessions}
          icon={<CheckCircle className="w-6 h-6" />}
          color="bg-green-500"
          link="/sessions"
        />
      </div>

      <div className="space-y-4">
        {/* This Week's Schedule */}
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">This Week</h2>
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
                <div key={day.toISOString()} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-600">
                        {format(day, 'EEE')}
                      </div>
                      <div className="text-sm font-bold text-gray-800">
                        {format(day, 'd')}
                      </div>
                    </div>
                    {daySession ? (
                      <div>
                        <div className="font-medium text-gray-800 text-sm">{daySession.activity}</div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex items-center">
                            <span className="px-1 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {daySession.groupType}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {daySession.time}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {daySession.location}
                          </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 italic text-sm">No session</div>
                    )}
                  </div>
                  {daySession && (
                    <div className="text-right">
                      <div className="text-xs font-medium text-gray-800">
                        {daySession.expectedAttendees}/{daySession.maxParticipants}
                      </div>
                      <div className="text-xs text-gray-500">people</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Sessions</h2>
            <Link 
              to="/sessions" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Manage →
            </Link>
          </div>
          
          <div className="space-y-4">
            {upcomingSessions.slice(0, 4).map(session => {
                const sessionInstructors = session.instructorNames || [];

              return (
                <div key={session.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">{session.activity}</h3>
                      <span className="px-1 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {session.groupType}
                      </span>
                    </div>
                    <span className={`px-1 py-0.5 rounded text-xs font-medium ${
                      session.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      session.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-2" />
                      {format(new Date(session.date), 'EEEE, MMM d')} at {session.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-2" />
                      {session?.location}
                    </div>
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-2" />
                        {session.leaderNames && session.leaderNames.length > 0 
                        ? session.leaderNames.join(', ')
                        : 'No staff assigned'
                        }
                    </div>
                    {session.expectedAttendees && (
                      <div className="flex items-center">
                        <UserCheck className="w-3 h-3 mr-2" />
                        {session.expectedAttendees}/{session.maxParticipants} expected
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {upcomingSessions.length > 4 && (
              <div className="text-center">
                <Link 
                  to="/sessions" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View {upcomingSessions.length - 4} more sessions →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts & Notifications */}
      {/* <div className="bg-white p-6 rounded-xl shadow-lg">
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
              <span className="text-blue-800 font-medium">Leaders Needed</span>
            </div>
            <p className="text-blue-700 text-sm mt-1">
              Water Safety Course session needs leaders. Check the sessions page to sign up.
            </p>
          </div>
        </div>
      </div> */}
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
    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-xs font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`${color} text-white p-2 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return link ? <Link to={link}>{content}</Link> : content;
};

export default Dashboard;
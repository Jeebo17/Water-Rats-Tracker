import React, { useState, useEffect } from 'react';
import { format, set } from 'date-fns';
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
  Eye,
  EyeOff,
  X,
  Save
} from 'lucide-react';
import { Session } from '../types';
import { getSessions, addSession, deleteSession, updateSession } from '../firebase/sessions';
import { Timestamp } from 'firebase/firestore';

const Sessions: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Planning' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');
  const [groupFilter, setGroupFilter] = useState<string>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showPreviousSessions, setShowPreviousSessions] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<Session | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState<Session | null>(null);
  const [showSignUpModal, setShowSignUpModal] = useState<Session | null>(null);

  const groupTypes = ['All', 'Squirrels', 'Beavers', 'Cubs', 'Scouts', 'Explorers', 'Network', 'External'];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingSessions = sessions.filter(session => new Date(session.date) >= today);
  const previousSessions = sessions.filter(session => new Date(session.date) < today);

  const sessionsToShow = showPreviousSessions ? sessions : upcomingSessions;

  const filteredSessions = sessionsToShow.filter(session => {
    const matchesStatus = filter === 'All' || session.status === filter;
    const matchesGroup = groupFilter === 'All' || session.groupType === groupFilter;
    return matchesStatus && matchesGroup;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  useEffect(() => {
    const fetchSessions = async () => {
      const sessions = await getSessions();
      setSessions(sessions);
    };

    fetchSessions();
  }, []);

  const handleDeleteSession = async (sessionId: string) => {
    await deleteSession(sessionId);
    const updatedSessions = await getSessions();
    setSessions(updatedSessions);
    setShowDeleteModal(null);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
          onClick={() => setShowAddModal(true)}
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

      {/* Show Previous Sessions Toggle */}
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{filteredSessions.length}</span> sessions
        </div>
        <button
          onClick={() => setShowPreviousSessions(!showPreviousSessions)}
          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {showPreviousSessions ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showPreviousSessions ? 'Hide Previous' : 'Show Previous'}</span>
        </button>
      </div>

      {/* Filters */}
      {showFilterDropdown && (
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
              <div className="flex flex-wrap gap-2">
                {(['All', 'Planning', 'Confirmed', 'Completed', 'Cancelled'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Group</h3>
              <div className="flex flex-wrap gap-2">
                {groupTypes.map(group => (
                  <button
                    key={group}
                    onClick={() => setGroupFilter(group)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      groupFilter === group
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map(session => (
          <SessionCard 
            key={session.id} 
            session={session} 
            setSessions={setSessions}
            onDelete={() => setShowDeleteModal(session.id)}
            onEdit={() => setShowEditModal(session)}
            onStatusUpdate={() => setShowUpdateStatusModal(session)}
            onSignUp={() => setShowSignUpModal(session)}
          />
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No sessions found</h3>
          <p className="text-gray-600">Try adjusting your filters or create a new session.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={() => handleDeleteSession(showDeleteModal)}
          onCancel={() => setShowDeleteModal(null)}
        />
      )}

      {/* Edit Session Modal */}
      {showEditModal && (
        <EditSessionModal
          session={showEditModal}
          onSave={async (updatedSession) => {
            await updateSession(updatedSession.id, updatedSession);
            const updatedSessions = await getSessions();
            setSessions(updatedSessions);
            setShowEditModal(null);
          }}
          onCancel={() => setShowEditModal(null)}
        />
      )}

      {/* Add Session Modal */}
      {showAddModal && (
        <AddSessionModal
          onSave={async (newSession) => {
            await addSession(newSession);
            const updatedSessions = await getSessions();
            setSessions(updatedSessions);
            setShowAddModal(false);
          }}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Update Status Modal */}
      {showUpdateStatusModal && (
        <UpdateStatusModal
          session={showUpdateStatusModal}
          onSave={async (updatedSession) => {
            await updateSession(updatedSession.id, updatedSession);
            const updatedSessions = await getSessions();
            setSessions(updatedSessions);
            setShowUpdateStatusModal(null);
          }}
          onCancel={() => setShowUpdateStatusModal(null)}
        />
      )}

      {/* Sign Up as Leader Modal */}
      {showSignUpModal && (
        <SignUpModal
          session={showSignUpModal}
          onSave={async (updatedSession) => {
            await updateSession(updatedSession.id, updatedSession);
            const updatedSessions = await getSessions();
            setSessions(updatedSessions);
            setShowSignUpModal(null);
          }}
          onCancel={() => setShowSignUpModal(null)}
        />
      )}

    </div>
  );
};

interface SessionCardProps {
  session: Session;
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  onDelete: () => void;
  onEdit: () => void;
  onStatusUpdate: () => void;
  onSignUp: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onDelete, onEdit, onStatusUpdate, onSignUp }) => {
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
    'Mixed': 'bg-gray-200 text-gray-800'
  };

  const StatusIcon = session.status ? statusConfig[session.status]?.icon : Clock;
  const needsLeaders = !session.leaderNames || session.leaderNames.length === 0;

  return (
    <div className={`bg-white p-4 rounded-xl shadow-lg ${
      needsLeaders ? 'border-l-4 border-orange-400' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{session.activity}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${groupTypeColors[session.groupType]}`}>
              {session.groupType}
            </span>
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusConfig[session.status]?.color}`}
              onClick={onStatusUpdate}
            >
              <StatusIcon className="w-3 h-3" />
              <span>{session.status}</span>
            </span>
          </div>
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Session Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-700">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-sm">{format(new Date(session.date), 'EEEE, MMM d, yyyy')}</span>
        </div>
        
        <div className="flex items-center text-gray-700">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-sm">{session.time}</span>
        </div>
        
        <div className="flex items-center text-gray-700">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-sm">{session.location}</span>
        </div>

        <div className="flex items-center text-gray-700">
          <Users className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-sm">
            {session.expectedAttendees}
            {session.maxParticipants ? `/${session.maxParticipants}` : ''}
            {' participants'}
          </span>
        </div>

      </div>

      {/* Leaders Section */}
      <div className="mb-3">
        <h4 className="font-medium text-gray-800 mb-2 flex items-center text-sm">
          <UserCheck className="w-4 h-4 mr-1" />
          Leaders
          {needsLeaders && (
            <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
              NEEDED
            </span>
          )}
          {session.leaderNames && session.leaderNames.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              {session.leaderNames.length} total {/* Leader{session.leaderNames.length > 1 ? 's' : ''} */}
            </span>
          )}
        </h4>

        {session.leaderNames && session.leaderNames.length > 0 ? (
          <div className="flex flex-wrap gap-1 mb-2">
            {session.leaderNames.map((leader) => (
              <span key={leader} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {leader}
              </span>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg mb-2">
            <p className="text-orange-800 font-medium text-sm mb-2">No leaders assigned</p>
          </div>
        )}

        <button 
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          onClick={onSignUp}
        >
          Sign Up as a Leader
        </button>
      </div>

      {session.notes && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-1 text-sm">Notes</h4>
          <p className="text-gray-700 text-sm">{session.notes}</p>
        </div>
      )}
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Session</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to delete this session? This action cannot be undone.</p>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Session Modal
const EditSessionModal: React.FC<{
  session: Session;
  onSave: (session: Session) => void;
  onCancel: () => void;
}> = ({ session, onSave, onCancel }) => {
  const [formData, setFormData] = useState(session);
  const [leaderInput, setLeaderInput] = useState(session.leaderNames?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const leaderNames = leaderInput
      .split(',')
      .map(name => name.trim())
      .filter(name => name);

    const time = formData.time?.trim() ? formData.time : "TBD";
    const location = formData.location?.trim() ? formData.location : "TBD";
    const expectedAttendees = formData.expectedAttendees !== undefined ? formData.expectedAttendees : 0;
    const dbDate = Timestamp.fromDate(new Date(formData.date));

    onSave({ ...formData, leaderNames, time, location, expectedAttendees, dbDate });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Edit Session</h3>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Activity<span className="text-red-500 ml-1">*</span></label>
            <input
              type="text"
              value={formData.activity}
              onChange={(e) => setFormData({...formData, activity: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date<span className="text-red-500 ml-1">*</span></label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="text"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 10:00-12:00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Type</label>
            <select
              value={formData.groupType}
              onChange={(e) => setFormData({...formData, groupType: e.target.value as any})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Squirrels">Squirrels</option>
              <option value="Beavers">Beavers</option>
              <option value="Cubs">Cubs</option>
              <option value="Scouts">Scouts</option>
              <option value="Explorers">Explorers</option>
              <option value="Network">Network</option>
              <option value="External">External</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Attendees</label>
            <input
              type="number"
              value={formData.expectedAttendees ?? ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  expectedAttendees: e.target.value === '' ? undefined : parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Number of participants"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as any})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Planning">Planning</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leaders</label>
            <textarea
              value={leaderInput}
              onChange={(e) => setLeaderInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter leader names separated by commas, e.g. John, Jane"
              rows={2}
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
            <input
              type="number"
              value={formData.maxParticipants || ''}
              onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value) || undefined})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Maximum number of participants"
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leader in Charge<span className="text-red-500 ml-1">*</span></label>
            <input
              type="text"
              value={formData.leaderInCharge || ''}
              onChange={(e) => setFormData({...formData, leaderInCharge: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Main leader responsible"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Session Modal
const AddSessionModal: React.FC<{
  onSave: (session: Session) => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    activity: '',
    date: '',
    time: '',
    groupType: 'Cubs' as Session['groupType'],
    location: '',
    expectedAttendees: undefined as number | undefined,
    status: 'Planning' as Session['status'],
    notes: '',
    leaderInCharge: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();


    const time = formData.time?.trim() ? formData.time : "TBD";
    const location = formData.location?.trim() ? formData.location : "TBD";
    const expectedAttendees = formData.expectedAttendees !== undefined ? formData.expectedAttendees : 0;

    const newSession: Session = {
      id: `${formData.date}-${formData.activity}-${formData.groupType}`,
      ...formData,
      leaderNames: [],
      dbDate: Timestamp.fromDate(new Date(formData.date)),
      time,
      location,
      expectedAttendees,
    };

    onSave(newSession);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Add New Session</h3>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Activity<span className="text-red-500 ml-1">*</span></label>
            <input
              type="text"
              value={formData.activity}
              onChange={(e) => setFormData({...formData, activity: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. SUP Session"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leader In Charge<span className="text-red-500 ml-1">*</span></label>
            <input
              type="text"
              value={formData.leaderInCharge}
              onChange={(e) => setFormData({...formData, leaderInCharge: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. John (First name only)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date<span className="text-red-500 ml-1">*</span></label>
            <input
              type="date"
              value={formData.date ?? "TBD"}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="text"
              value={formData.time ?? "TBD"}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. 10:00-12:00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Type</label>
            <select
              value={formData.groupType}
              onChange={(e) => setFormData({...formData, groupType: e.target.value as any})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Squirrels">Squirrels</option>
              <option value="Beavers">Beavers</option>
              <option value="Cubs">Cubs</option>
              <option value="Scouts">Scouts</option>
              <option value="Explorers">Explorers</option>
              <option value="Network">Network</option>
              <option value="External">External</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location ?? "TBD"}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. Lake, Harbour"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Attendees</label>
            <input
              type="number"
              value={formData.expectedAttendees ?? ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  expectedAttendees: e.target.value === '' ? undefined : parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Number of participants"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Any additional information..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sessions;

// Update status modal
const UpdateStatusModal: React.FC<{
  session: Session;
  onSave: (session: Session) => void;
  onCancel: () => void;
}> = ({ session, onSave, onCancel }) => {
  const [formData, setFormData] = useState(session);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Update Status</h3>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as any})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Planning">Planning</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// Sign up as leader Modal
const SignUpModal: React.FC<{
  session: Session;
  onSave: (session: Session) => void;
  onCancel: () => void;
}> = ({ session, onSave, onCancel }) => {
  const [formData, setFormData] = useState(session);
  const [leaderInput, setLeaderInput] = useState(session.leaderNames?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const leaderNames = leaderInput
      .split(',')
      .map(name => name.trim())
      .filter(name => name);

    onSave({ ...formData, leaderNames });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Edit Session</h3>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leaders</label>
            <textarea
              value={leaderInput}
              onChange={(e) => setLeaderInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter leader names separated by commas, e.g. John, Jane"
              rows={2}
            />
          </div>


          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
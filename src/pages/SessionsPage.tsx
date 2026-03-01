import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { 
  Plus, 
  Filter, 
  Calendar, 
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  List,
  FileSpreadsheet
} from 'lucide-react';
import { Session, groupTypes } from '../types';
import { getSessions, addSession, deleteSession, updateSession, duplicateSession } from '../util/sessions';
import { 
  SessionCalendar, 
  SessionCard, 
  ModalAddSession, 
  ModalDeleteSession, 
  ModalEditSession, 
  ModalUpdateSessionStatus,
  ModalLeaderSignup,
  SessionSpreadsheet
} from '../components/index';

const Sessions: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Planning' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');
  const [groupFilter, setGroupFilter] = useState<string>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showPreviousSessions, setShowPreviousSessions] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'spreadsheet'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<Session | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState<Session | null>(null);
  const [showSignUpModal, setShowSignUpModal] = useState<Session | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessions = await getSessions();
        setSessions(sessions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingSessions = sessions.filter(session => {
    if (!session.startTime) return false; // skip invalid

    const sessionDate = session.startTime.toDate();
    sessionDate.setHours(0, 0, 0, 0);

    return sessionDate.getTime() >= today.getTime();
  });

  const sessionsToShow = showPreviousSessions ? sessions : upcomingSessions;

  const filteredSessions = sessionsToShow
    .filter(session => {
        if (selectedSessionId) return session.id === selectedSessionId;
        const matchesStatus = filter === 'All' || session.status === filter;
        const matchesGroup = groupFilter === 'All' || session.groupType === groupFilter;
        return matchesStatus && matchesGroup;
    })
    .sort((a, b) => {
      const aDate = a.startTime ? a.startTime.toDate() : new Date(0);
      const bDate = b.startTime ? b.startTime.toDate() : new Date(0);
      
      aDate.setHours(0, 0, 0, 0);
      bDate.setHours(0, 0, 0, 0);

      return aDate.getTime() - bDate.getTime();
    });

  const handleDeleteSession = async (sessionId: string) => {
    await deleteSession(sessionId);
    const updatedSessions = await getSessions();
    setSessions(updatedSessions);
    setShowDeleteModal(null);
  };

  const onCopy = async (sessionId: string) => {
      try {
          await duplicateSession(sessionId);
          const updatedSessions = await getSessions();
          setSessions(updatedSessions);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      } catch (error) {
          console.error('Error duplicating session:', error);
          alert('Failed to duplicate session. Please try again.');
      }
  };

  return (
    <>
    <div className="pb-6 space-y-3">

      {/* Copied overlay */}
      {copied && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg transition-opacity duration-300">
          Copied!
        </div>
      )}

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
          onClick={() => {
            let nextView: 'list' | 'spreadsheet' | 'calendar';
            if (viewMode === 'list') nextView = 'spreadsheet';
            else if (viewMode === 'spreadsheet') nextView = 'calendar';
            else nextView = 'list';
            setViewMode(nextView);
            setShowPreviousSessions(nextView === 'list' || nextView === 'spreadsheet' ? false : true);
            setSelectedSessionId(null);
            setFilter('All');
            setGroupFilter('All');
          }}
        >
          {viewMode === 'list' ? (
            <Calendar className="w-5 h-5" />
          ) : viewMode === 'calendar' ? (
            <List className="w-5 h-5" />
          ) : (
            <FileSpreadsheet className="w-5 h-5" />
          )}
        </button>

        <button 
          className="w-12 h-12 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* View Controls */}
      {viewMode === 'list' || viewMode === 'spreadsheet' ? (
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{filteredSessions.length}</span> sessions
            </div>
            {(selectedSessionId || filter !== 'All' || groupFilter !== 'All') && (
              <button
                onClick={() => {
                  setSelectedSessionId(null);
                  setFilter('All');
                  setGroupFilter('All');
                  setShowPreviousSessions(false);
                }}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
              >
                {filter !== 'All' && groupFilter !== 'All' ? 'Clear Filters' : 'Clear Filter'}
              </button>
            )}
          </div>
          <button
            onClick={() => setShowPreviousSessions(!showPreviousSessions)}
            className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showPreviousSessions ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showPreviousSessions ? 'Hide Previous' : 'Show Previous'}</span>
          </button>
        </div>
      ) : viewMode === 'calendar' ? (
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      ) : null}

      {/* Filters */}
      {showFilterDropdown && (
        <div className="bg-white p-4 rounded-xl shadow-lg mb-4">
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

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sessions...</p>
        </div>
      ) : (
        // Content
        <>
          {viewMode === 'list' ? (
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
                  onCopy={() => onCopy(session.id)}
                />
              ))}
            </div>
          ) : viewMode === 'calendar' ? (
            <SessionCalendar 
              sessions={filteredSessions}
              currentMonth={currentMonth}
              onSessionClick={(session: Session) => {
                setViewMode('list');
                setSelectedSessionId(session.id);
              }}
            />
          ) : (
            <SessionSpreadsheet 
              sessions={filteredSessions}
              onSessionClick={(session: Session) => {
                setViewMode('list');
                setSelectedSessionId(session.id);
              }}
              onEdit={(session: Session) => setShowEditModal(session)}
              // onDelete={(sessionId) => setShowDeleteModal(sessionId)}
            />
          )}
        </>
      )}

      {filteredSessions.length === 0 && viewMode === 'list' && !loading && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No sessions found</h3>
          <p className="text-gray-600">Try adjusting your filters or create a new session.</p>
        </div>
      )}

    </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ModalDeleteSession
          onConfirm={() => handleDeleteSession(showDeleteModal)}
          onCancel={() => setShowDeleteModal(null)}
        />
      )}

      {/* Edit Session Modal */}
      {showEditModal && (
        <ModalEditSession
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
        <ModalAddSession
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
        <ModalUpdateSessionStatus
          session={showUpdateStatusModal}
          onSave={async (updatedSession: Session) => {
            await updateSession(updatedSession.id, updatedSession);
            setSessions(prev =>
                prev.map(s =>
                    s.id === updatedSession.id ? updatedSession : s
                )
            );
            setShowUpdateStatusModal(null);
          }}
          onCancel={() => setShowUpdateStatusModal(null)}
        />
      )}

      {/* Sign Up as Leader Modal */}
      {showSignUpModal && (
        <ModalLeaderSignup
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

    </>
  );
};

export default Sessions;
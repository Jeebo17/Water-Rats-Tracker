import React from 'react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Session, groupTypes } from '../types';
import { ModalUpdateSessionStatus, ModalLeaderSignup } from './index';
import { updateSession } from '../util/sessions';
import { ChevronDown, LucideArrowRightSquare, Plus, SquarePen } from 'lucide-react';

interface SessionSpreadsheetProps {
    sessions: Session[];
    onSessionClick: (session: Session) => void;
    onEdit: (session: Session) => void;
}

const statusColors: Record<Session['status'], string> = {
    Planning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Confirmed: 'bg-green-100 text-green-800 border-green-200',
    Completed: 'bg-blue-100 text-blue-800 border-blue-200',
    Cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const SessionSpreadsheet: React.FC<SessionSpreadsheetProps> = ({
    sessions,
    onSessionClick,
    onEdit,
}) => {
    const [sessionsState, setSessions] = useState<Session[]>(sessions);
    const [showUpdateStatusModal, setShowUpdateStatusModal] = useState<Session | null>(null);
    const [showLeaderSignupModal, setShowLeaderSignupModal] = useState<Session | null>(null);
    const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

    useEffect(() => {
        setSessions(sessions);
    }, [sessions]);

    const updateNote = async (session: Session) => {
        const updatedSession = { ...session, notes: session.notes };
        await updateSession(session.id, updatedSession);
        setExpandedSessionId(null);
    }

    const handleFieldUpdate = async (sessionId: string, field: keyof Session, value: any) => {
        const session = sessionsState.find(s => s.id === sessionId);
        if (!session) return;
        
        const updatedSession = { ...session, [field]: value };
        await updateSession(sessionId, updatedSession);
        setSessions(prev =>
            prev.map(s => s.id === sessionId ? updatedSession : s)
        );
    }

    const toggleExpanded = (sessionId: string) => {
        setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
    }

    const columnWidths = {
        'Date': 'w-48',
        'Time': 'w-24',
        'Activity': 'w-48',
        'Group': 'w-28',
        'Location': 'w-40',
        'Leaders': 'w-16',
        'Leader in Charge': 'w-32',
        'Expected': 'w-20',
        'Status': 'w-28',
        'Notes': 'w-12',
        'Actions': 'w-24',
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse table-fixed">
                {/* Header */}
                <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        {[
                            'Date',
                            'Time',
                            'Activity',
                            'Group',
                            'Location',
                            'Leaders',
                            'Leader in Charge',
                            'Expected',
                            'Status',
                            'Notes',
                            'Actions',
                        ].map(header => (
                            <th
                                key={header}
                                className={`px-3 py-2 text-left text-sm font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap ${columnWidths[header as keyof typeof columnWidths]}`}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Body */}
                <tbody>
                    {sessionsState.map(session => {
                        const minLeaders = session.minNumberOfLeaders ?? 0;
                        const needsLeaders = minLeaders > 0 && (!session.leaderNames || session.leaderNames.length < minLeaders);
                        const dateObj = session.startTime ? session.startTime.toDate() : null;
                        const timeString = session.timeTBD ? 'TBD' : (dateObj ? format(dateObj, 'h:mm a') : 'TBD');
                        const isExpanded = expandedSessionId === session.id;

                        return (
                            <React.Fragment key={session.id}>
                            <tr
                                key={session.id}
                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => toggleExpanded(session.id)}
                            >
                                <td className="px-3 py-2 text-sm border-b w-48">{dateObj ? format(dateObj, 'EEEE, MMM d, yyyy') : 'TBD'}</td>
                                <td className="px-3 py-2 text-sm border-b w-24">{timeString}</td>
                                <td className="px-3 py-2 text-sm font-medium border-b w-48" onClick={e => e.stopPropagation()}>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white px-1 rounded"
                                        value={session.activity}
                                        onChange={e => {
                                            const value = e.target.value;
                                            setSessions(prev =>
                                                prev.map(s => s.id === session.id ? { ...s, activity: value } : s)
                                            );
                                        }}
                                        onBlur={() => handleFieldUpdate(session.id, 'activity', session.activity)}
                                    />
                                </td>
                                <td className="px-3 py-2 text-sm border-b w-28" onClick={e => e.stopPropagation()}>
                                    <select
                                        className="w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white px-1 rounded"
                                        value={session.groupType}
                                        onChange={e => {
                                            const value = e.target.value as Session['groupType'];
                                            setSessions(prev =>
                                                prev.map(s => s.id === session.id ? { ...s, groupType: value } : s)
                                            );
                                            handleFieldUpdate(session.id, 'groupType', value);
                                        }}
                                    >
                                        {groupTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-3 py-2 text-sm border-b w-40" onClick={e => e.stopPropagation()}>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white px-1 rounded"
                                        value={session.location}
                                        onChange={e => {
                                            const value = e.target.value;
                                            setSessions(prev =>
                                                prev.map(s => s.id === session.id ? { ...s, location: value } : s)
                                            );
                                        }}
                                        onBlur={() => handleFieldUpdate(session.id, 'location', session.location)}
                                    />
                                </td>
                                <td className="px-3 py-2 text-sm border-b w-16">
                                    <button 
                                        className={`inline-block px-2 py-1 rounded border text-xs font-medium hover: ${needsLeaders ? 'ring-2 ring-orange-300 bg-orange-50' : 'ring-2 ring-green-400'} transition-colors hover:ring-blue-400 focus:outline-none hover:bg-blue-50`}
                                        onClick={e => {
                                            e.stopPropagation();
                                            setShowLeaderSignupModal(session);
                                        }}
                                        title={'Sign up as a leader'}
                                    >
                                        {session.leaderNames?.length ?? 0}
                                    </button>
                                </td>

                                <td className="px-3 py-2 text-sm border-b w-32" onClick={e => e.stopPropagation()}>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white px-1 rounded"
                                        value={session.leaderInCharge || ''}
                                        onChange={e => {
                                            const value = e.target.value;
                                            setSessions(prev =>
                                                prev.map(s => s.id === session.id ? { ...s, leaderInCharge: value } : s)
                                            );
                                        }}
                                        onBlur={() => handleFieldUpdate(session.id, 'leaderInCharge', session.leaderInCharge)}
                                    />
                                </td>
                                <td className="px-3 py-2 text-sm border-b text-center w-20" onClick={e => e.stopPropagation()}>
                                    <input
                                        type="number"
                                        className="w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white px-1 rounded text-center"
                                        value={session.expectedAttendees ?? ''}
                                        onChange={e => {
                                            const value = e.target.value ? parseInt(e.target.value) : undefined;
                                            setSessions(prev =>
                                                prev.map(s => s.id === session.id ? { ...s, expectedAttendees: value } : s)
                                            );
                                        }}
                                        onBlur={() => handleFieldUpdate(session.id, 'expectedAttendees', session.expectedAttendees)}
                                        placeholder="—"
                                    />
                                </td>

                                <td className="px-3 py-2 text-sm border-b w-28">
                                    <button
                                        type="button"
                                        className="focus:outline-none"
                                        onClick={async e => {
                                            e.stopPropagation();
                                            setShowUpdateStatusModal(session);
                                        }}
                                    >
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium border ${
                                                statusColors[session.status]
                                            }`}
                                        >
                                            {session.status}
                                        </span>
                                    </button>
                                </td>

                                <td className="px-3 py-2 text-sm border-b w-12">
                                    {session.notes ? (
                                            <div
                                                className="focus:outline-none p-1 rounded hover:bg-gray-200 transition-colors flex items-center w-fit"
                                                title="Show notes"
                                            >
                                                <ChevronDown className={`w-5 h-5 text-blue-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                            </div>
                                        ) : (
                                            <div
                                                className="focus:outline-none p-1 rounded hover:bg-gray-200 transition-colors flex items-center w-fit"
                                                title="Add note"
                                            >
                                                <Plus className="w-5 h-5 text-gray-500"/>
                                            </div>
                                        )}
                                </td>

                                <td className="px-1 py-2 text-sm border-b w-24 text-gray-600 !pr-0 ">
                                    <div className="flex items-center gap-3">
                                        <button
                                            className="focus:outline-none p-1 rounded hover:bg-gray-200 transition-colors flex items-center"
                                            onClick={e => {e.stopPropagation(); onEdit(session);}}
                                            title="Edit session"
                                        >
                                            <SquarePen className="w-5 h-5 text-blue-600" />
                                        </button>
                                        <button
                                            className="focus:outline-none p-1 rounded hover:bg-gray-200 transition-colors flex items-center"
                                            onClick={e => {e.stopPropagation(); onSessionClick(session);}}
                                            title="Go to session"
                                        >
                                            <LucideArrowRightSquare className="w-5 h-5 text-blue-600" />
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            {isExpanded && (
                                <tr className="bg-gray-50">
                                    <td colSpan={11} className="px-4 py-4 text-sm text-gray-700 border-b">
                                        <textarea
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            value={session.notes}
                                            onChange={e => {
                                                const updatedNotes = e.target.value;
                                                setSessions(prev =>
                                                    prev.map(s =>
                                                        s.id === session.id
                                                            ? { ...s, notes: updatedNotes }
                                                            : s
                                                    )
                                                );
                                            }}
                                            placeholder='Notes...'
                                            rows={3}
                                        />
                                        <button
                                            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:text-gray-500"
                                            onClick={updateNote.bind(null, session)}
                                            disabled={session.notes === (sessions.find(s => s.id === session.id)?.notes ?? '')}
                                        >
                                            Save
                                        </button>
                                        
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                        );
                    })}
                </tbody>
            </table>

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

            {showLeaderSignupModal && (
                <ModalLeaderSignup
                    session={showLeaderSignupModal}
                    onSave={async (updatedSession) => {
                        await updateSession(updatedSession.id, updatedSession);
                        setSessions(prev =>
                            prev.map(s =>
                                s.id === updatedSession.id ? updatedSession : s
                            )
                        );
                        setShowLeaderSignupModal(null);
                    }}
                    onCancel={() => setShowLeaderSignupModal(null)}
                />
            )}

        </div>
    );
};

export default SessionSpreadsheet;

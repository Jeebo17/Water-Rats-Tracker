import React from 'react';
import { Session } from '../types';
import { format } from 'date-fns';
import { 
    Calendar, 
    Clock,
    MapPin,
    Users,
    UserCheck,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    Copy
} from 'lucide-react';

interface SessionCardProps {
    session: Session;
    setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
    onDelete: () => void;
    onEdit: () => void;
    onStatusUpdate: () => void;
    onSignUp: () => void;
    onCopy: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onDelete, onEdit, onStatusUpdate, onSignUp, onCopy }) => {
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
    const minLeaders = session.minNumberOfLeaders ?? 0;
    const needsLeaders = minLeaders > 0 && (!session.leaderNames || session.leaderNames.length < minLeaders);

    const dateObj = session.startTime ? session.startTime.toDate() : null;
    const timeString = session.timeTBD ? 'TBD' : (dateObj ? format(dateObj, 'h:mm a') : 'TBD');

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
                onClick={onCopy}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
                <Copy className="w-4 h-4" />
            </button>
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
                <span className="text-sm">{dateObj ? format(dateObj, 'EEEE, MMM d, yyyy') : 'TBD'}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-sm">{timeString}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-sm">{session.location}</span>
            </div>

            <div className="flex items-center text-gray-700">
                <Users className="w-4 h-4 mr-2 text-gray-400" />
                {session.expectedAttendees === 0 || session.expectedAttendees === undefined ? (
                    <span className="text-gray-400 italic text-sm">
                        Number of attendees not set
                    </span>
                ) : (
                    <span className="text-sm">
                        {session.expectedAttendees}
                        {session.maxParticipants ? `/${session.maxParticipants}` : ''}
                        {' participants'}
                    </span>
                )}
            </div>

            <div className="flex items-center text-gray-700">
                <p className="mr-2 w-4 text-sm text-gray-400">LIC</p>
                <span className="text-sm">{session.leaderInCharge}</span>
            </div>

        </div>

        {/* Leaders Section */}
        <div className="mb-3">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center text-sm">
                <UserCheck className="w-4 h-4 mr-1" />
                Leaders
                {needsLeaders && (
                    <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                    NEEDED ({session.leaderNames?.length ?? 0}/{minLeaders})
                    </span>
                )}
                {session.leaderNames && session.leaderNames.length > 0 && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {session.leaderNames.length}{minLeaders ? `/${minLeaders}` : ''} total
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

export default SessionCard;
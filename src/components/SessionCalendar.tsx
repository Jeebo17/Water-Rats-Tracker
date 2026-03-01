import React from 'react';
import { Session } from '../types';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay
} from 'date-fns';


interface CalendarViewProps {
    sessions: Session[];
    currentMonth: Date;
    onSessionClick: (session: Session) => void;
}

const SessionCalendar: React.FC<CalendarViewProps> = ({ sessions, currentMonth, onSessionClick }) => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    // Calculate the number of empty cells needed at the start
    const startDayOfWeek = monthStart.getDay();
    const spacersNeeded = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    
    const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const getSessionsForDay = (day: Date) => {
        return sessions.filter(session => 
        isSameDay(new Date(session.startTime.toDate()), day)
        );
    };

    const statusColors = {
        Planning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        Confirmed: 'bg-green-100 text-green-800 border-green-200',
        Completed: 'bg-blue-100 text-blue-800 border-blue-200',
        Cancelled: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden overflow-x-auto">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 bg-gray-50 min-w-[500px]">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="p-1.5 sm:p-3 text-center text-xs sm:text-sm font-medium text-gray-600 border-b border-gray-200">
                    <span className="hidden sm:inline">{day}</span>
                    <span className="sm:hidden">{day.charAt(0)}</span>
                </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-t border-l min-w-[500px]">
                {/* Add spacer cells for days before the 1st of the month */}
                {Array.from({ length: spacersNeeded }, (_, index) => (
                <div key={`spacer-${index}`} className="min-h-[60px] sm:min-h-[100px] p-1 border-b border-r border-gray-200 bg-gray-50">
                </div>
                ))}
                
                {calendarDays.map(day => {
                const daySessions = getSessionsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isToday = isSameDay(day, new Date());

                return (
                    <div 
                    key={day.toISOString()} 
                    className={`min-h-[60px] sm:min-h-[100px] p-1 border-b border-r border-gray-200 ${
                        !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                    } ${isToday ? 'bg-blue-50' : ''}`}
                    >
                        <div className={`text-sm font-medium mb-2 ml-1 ${
                            !isCurrentMonth ? 'text-gray-400' : isToday ? 'text-blue-600' : 'text-gray-800'
                        }`}>
                            {format(day, 'd')}
                        </div>
                        
                        <div className="space-y-1">
                            {daySessions.map(session => {
                            const minLeaders = session.minNumberOfLeaders ?? 0;
                            const needsLeaders = minLeaders > 0 && (!session.leaderNames || session.leaderNames.length < minLeaders);
                            
                            return (
                                <div
                                    key={session.id}
                                    onClick={() => onSessionClick(session)}
                                    className={`p-1 rounded text-xs cursor-pointer border ${
                                        statusColors[session.status]
                                    } ${needsLeaders ? 'ring-2 ring-orange-300' : ''} hover:opacity-80 transition-opacity`}
                                >
                                <div className="font-medium truncate text-[10px] sm:text-xs">{session.activity}</div>
                                <div className="text-[10px] sm:text-xs opacity-75 hidden sm:block">{session.groupType}</div>
                                    {/* {needsLeaders && (
                                        <div className="text-xs text-orange-600 font-medium">Need Leaders</div>
                                    )} */}
                                </div>
                            );
                            })}
                        </div>
                    </div>
                );
                })}
            </div>
        </div>
    );
};

export default SessionCalendar;
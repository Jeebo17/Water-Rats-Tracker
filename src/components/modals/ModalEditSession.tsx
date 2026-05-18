import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Session } from '../../types';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import ModalConfirmDiscard from './ModalConfirmDiscard';

const normalizeName = (name: string) => name.trim();

const ModalEditSession: React.FC<{
    session: Session;
    onSave: (session: Session) => void;
    onCancel: () => void;
}> = ({ session, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
    ...session,
    date: session.startTime instanceof Timestamp ? format(session.startTime.toDate(), 'yyyy-MM-dd') : '',
    time: session.timeTBD ? '' : session.startTime instanceof Timestamp ? format(session.startTime.toDate(), 'HH:mm') : '',
    hasMinLeaders: (session.minNumberOfLeaders ?? 0) > 0,
    });

    const [attendingNames, setAttendingNames] = useState<string[]>(session.leaderNames ?? []);
    const [declinedNames, setDeclinedNames] = useState<string[]>(session.declinedLeaderNames ?? []);
    const [nameInput, setNameInput] = useState('');
    const [hasBeenEdited, setHasBeenEdited] = useState(false);
    const [showDiscardModal, setShowDiscardModal] = useState(false);

    const handleClose = () => {
        if (hasBeenEdited) {
            setShowDiscardModal(true);
        } else {
            onCancel();
        }
    };

    const [initialData] = useState({
        ...session,
        date: session.startTime instanceof Timestamp ? format(session.startTime.toDate(), 'yyyy-MM-dd') : '',
        time: session.timeTBD ? '' : session.startTime instanceof Timestamp ? format(session.startTime.toDate(), 'HH:mm') : '',
        hasMinLeaders: (session.minNumberOfLeaders ?? 0) > 0,
        attendingNames: session.leaderNames ?? [],
        declinedNames: session.declinedLeaderNames ?? [],
    });

    useEffect(() => {
        const isEdited =
            JSON.stringify({
            ...formData,
            attendingNames,
            declinedNames,
            }) !==
            JSON.stringify({
            ...initialData,
            attendingNames: initialData.attendingNames,
            declinedNames: initialData.declinedNames,
            });

        setHasBeenEdited(isEdited);
    }, [formData, attendingNames, declinedNames, initialData]);

    const addNameToAttending = (rawName: string) => {
        const name = normalizeName(rawName);
        if (!name) return;

        setAttendingNames(prev => (prev.includes(name) ? prev : [...prev, name]));
        setDeclinedNames(prev => prev.filter(existing => existing !== name));
        setNameInput('');
    };

    const addNameToDeclined = (rawName: string) => {
        const name = normalizeName(rawName);
        if (!name) return;

        setDeclinedNames(prev => (prev.includes(name) ? prev : [...prev, name]));
        setAttendingNames(prev => prev.filter(existing => existing !== name));
        setNameInput('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const timeTBD = !formData.time?.trim();

        let startTime: Timestamp | undefined;
        if (formData.date) {
            const date = new Date(formData.date);
            if (!timeTBD && formData.time) {
                const [hours, minutes] = formData.time.split(':').map(Number);
                date.setHours(hours, minutes, 0, 0);
            } else {
                date.setHours(0, 0, 0, 0); // midnight
            }
            startTime = Timestamp.fromDate(date);
        } else {
            startTime = session.startTime; // fallback
        }

        const updatedSession: Session = {
            id: session.id,
            activity: formData.activity,
            startTime,
            timeTBD,
            groupType: formData.groupType,
            location: formData.location?.trim() || 'TBD',
            notes: formData.notes,
            leaderInCharge: formData.leaderInCharge,
            leaderNames: attendingNames,
            declinedLeaderNames: declinedNames,
            expectedAttendees: formData.expectedAttendees ?? 0,
            status: formData.status,
            minNumberOfLeaders: formData.hasMinLeaders ? (formData.minNumberOfLeaders || 3) : 0,
        };

        onSave(updatedSession);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" 
            onClick={handleClose} 
        >
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Edit Session</h3>
                <button 
                    onClick={handleClose} 
                    className="p-1 hover:bg-gray-100 rounded"
                >
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
                    value={formData.date ?? 'TBD'}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <option value="Mixed">Mixed</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min. Leaders Required</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            min={1}
                            value={formData.hasMinLeaders ? (formData.minNumberOfLeaders || '') : ''}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    minNumberOfLeaders: e.target.value === '' ? 0 : parseInt(e.target.value),
                                    hasMinLeaders: e.target.value !== '' && parseInt(e.target.value) > 0,
                                })
                            }
                            className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!formData.hasMinLeaders ? 'bg-gray-100 text-gray-400' : 'border-gray-300'}`}
                            placeholder={formData.hasMinLeaders ? '3' : '0'}
                            onFocus={() => { if (!formData.hasMinLeaders) setFormData({ ...formData, hasMinLeaders: true, minNumberOfLeaders: 0 }); }}
                        />
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, minNumberOfLeaders: 0, hasMinLeaders: false })}
                            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                                !formData.hasMinLeaders
                                    ? 'bg-gray-200 text-gray-800 border-gray-300'
                                    : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            No minimum
                        </button>
                    </div>
                    {!formData.hasMinLeaders && (
                        <p className="text-xs text-gray-400 mt-1">No minimum set — leader count won't be enforced</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Attendees</label>
                    <input
                    type="number"
                    min={0}
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
                    <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Type a name"
                    />
                    <div className="flex gap-2 mt-2">
                        <button
                            type="button"
                            onClick={() => addNameToAttending(nameInput)}
                            className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add to Attending
                        </button>
                        <button
                            type="button"
                            onClick={() => addNameToDeclined(nameInput)}
                            className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Add to Declined
                        </button>
                    </div>

                    <div className="mt-3">
                        <p className="text-xs font-medium text-green-700 mb-1">Attending</p>
                        {attendingNames.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {attendingNames.map(name => (
                                    <button
                                        key={name}
                                        type="button"
                                        onClick={() => setAttendingNames(prev => prev.filter(existing => existing !== name))}
                                        className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200 flex items-center gap-1"
                                    >
                                        {name} <X className="w-4 h-4 inline-block" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-500 italic">No one attending yet</p>
                        )}
                    </div>

                    <div className="mt-2">
                        <p className="text-xs font-medium text-red-700 mb-1">Declined</p>
                        {declinedNames.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {declinedNames.map(name => (
                                    <button
                                        key={name}
                                        type="button"
                                        onClick={() => setDeclinedNames(prev => prev.filter(existing => existing !== name))}
                                        className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs hover:bg-red-200 flex items-center gap-1"
                                    >
                                        {name} <X className="w-4 h-4 inline-block" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-500 italic">No declines yet</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                    value={formData.notes ?? ''}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leader in Charge<span className="text-red-500 ml-1">*</span></label>
                    <input
                    type="text"
                    value={formData.leaderInCharge ?? ''}
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
                    className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                        hasBeenEdited
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!hasBeenEdited}
                    >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                    </button>
                </div>
            </form>
        </div>

        {showDiscardModal && (
            <ModalConfirmDiscard
                onDiscard={onCancel}
                onKeepEditing={() => setShowDiscardModal(false)}
            />
        )}
        </div>
    );
};

export default ModalEditSession;
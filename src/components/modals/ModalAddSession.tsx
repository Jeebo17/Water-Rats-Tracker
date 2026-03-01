import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Session } from '../../types';
import { Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import ModalConfirmDiscard from './ModalConfirmDiscard';

const ModalAddSession: React.FC<{
    onSave: (session: Session) => void;
    onCancel: () => void;
}> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        activity: '',
        date: '',
        time: '',
        groupType: 'Cubs' as Session['groupType'],
        location: 'WCWP',
        expectedAttendees: undefined as number | undefined,
        status: 'Planning' as Session['status'],
        notes: '',
        leaderInCharge: '',
        timeTBD: false,
        minNumberOfLeaders: 3 as number,
        hasMinLeaders: true,
    });
    const [showDiscardModal, setShowDiscardModal] = useState(false);

    const [initialFormData] = useState(formData);
    const isDirty = JSON.stringify(formData) !== JSON.stringify(initialFormData);

    const handleClose = () => {
        if (isDirty) {
            setShowDiscardModal(true);
        } else {
            onCancel();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const location = formData.location?.trim() ? formData.location : "TBD";
        const expectedAttendees = formData.expectedAttendees ?? 0;

        const activitySlug = formData.activity.trim().replace(/\s+/g, '-');
        const shortUuid = uuidv4().split('-')[0];

        const id = `${formData.date}-${activitySlug}-${formData.groupType}-${shortUuid}`;

        let startTime: Timestamp;
        let timeTBD = false;

        if (!formData.time?.trim()) {
            // Time not provided = set timeTBD true and default time to 00:00
            const dateOnly = new Date(formData.date);
            dateOnly.setHours(0, 0, 0, 0);
            startTime = Timestamp.fromDate(dateOnly);
            timeTBD = true;
        } else {
            // Time provided = combine date and time
            const dateTimeString = `${formData.date}T${formData.time}`;
            const jsDate = new Date(dateTimeString);
            startTime = Timestamp.fromDate(jsDate);
        }

        const newSession: Session = {
            id,
            activity: formData.activity,
            startTime,
            timeTBD,
            groupType: formData.groupType,
            location,
            expectedAttendees,
            status: formData.status,
            notes: formData.notes,
            leaderInCharge: formData.leaderInCharge,
            leaderNames: [],
            minNumberOfLeaders: formData.hasMinLeaders ? (formData.minNumberOfLeaders || 3) : 0,
        };

        onSave(newSession);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={handleClose}>
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add New Session</h3>
                <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded">
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
                        value={formData.date}
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
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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
                        value={formData.location ?? "TBD"}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. Lake, Harbour"
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
                        onClick={handleClose}
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

        {showDiscardModal && (
            <ModalConfirmDiscard
                onDiscard={onCancel}
                onKeepEditing={() => setShowDiscardModal(false)}
            />
        )}
        </div>
    );
};

export default ModalAddSession;
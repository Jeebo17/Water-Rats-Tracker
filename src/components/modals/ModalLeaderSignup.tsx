import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Session } from '../../types';
import { getStoredDisplayName } from '../../util/auth';

const normalizeName = (name: string) => name.trim();

const ModalLeaderSignup: React.FC<{
    session: Session;
    onSave: (session: Session) => void;
    onCancel: () => void;
}> = ({ session, onSave, onCancel }) => {
    const [attendingNames, setAttendingNames] = useState<string[]>(session.leaderNames ?? []);
    const [declinedNames, setDeclinedNames] = useState<string[]>(session.declinedLeaderNames ?? []);
    const [nameInput, setNameInput] = useState(getStoredDisplayName());
    const [hasBeenEdited, setHasBeenEdited] = useState(false);
    const storedDisplayName = getStoredDisplayName();

    const [initialData] = useState({
        attendingNames: session.leaderNames ?? [],
        declinedNames: session.declinedLeaderNames ?? [],
    });

    useEffect(() => {
        const isEdited =
        JSON.stringify({
            attendingNames,
            declinedNames,
        }) !==
        JSON.stringify({
            attendingNames: initialData.attendingNames,
            declinedNames: initialData.declinedNames,
        });

        setHasBeenEdited(isEdited);
    }, [attendingNames, declinedNames, initialData]);

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

    const removeAttendingName = (name: string) => {
        setAttendingNames(prev => prev.filter(existing => existing !== name));
    };

    const removeDeclinedName = (name: string) => {
        setDeclinedNames(prev => prev.filter(existing => existing !== name));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...session,
            leaderNames: attendingNames,
            declinedLeaderNames: declinedNames,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onCancel}>
        <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Sign Up as Leader</h3>
            <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
            </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <p className="text-sm text-gray-400 mb-2">
                Add names to either list. A person can only be in one list at a time.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
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
            </div>

            {storedDisplayName && (
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => addNameToAttending(storedDisplayName)}
                        className="flex-1 px-3 py-2 text-xs border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        Add me to Attending
                    </button>
                    <button
                        type="button"
                        onClick={() => addNameToDeclined(storedDisplayName)}
                        className="flex-1 px-3 py-2 text-xs border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        Add me to Declined
                    </button>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attending</label>
                {attendingNames.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {attendingNames.map(name => (
                            <button
                                key={name}
                                type="button"
                                onClick={() => removeAttendingName(name)}
                                className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200"
                                title="Remove from attending"
                            >
                                {name} x
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-gray-500 italic">No one attending yet</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Declined</label>
                {declinedNames.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {declinedNames.map(name => (
                            <button
                                key={name}
                                type="button"
                                onClick={() => removeDeclinedName(name)}
                                className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs hover:bg-red-200"
                                title="Remove from declined"
                            >
                                {name} x
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-gray-500 italic">No declines yet</p>
                )}
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
    </div>
    );
};

export default ModalLeaderSignup;
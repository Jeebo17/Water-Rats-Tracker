import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Session } from '../../types';
import { getStoredDisplayName } from '../../util/auth';

const getInitialLeaderInput = (session: Session) => {
    const existingLeaders = session.leaderNames ?? [];
    const storedDisplayName = getStoredDisplayName();

    if (storedDisplayName && !existingLeaders.includes(storedDisplayName)) {
        return [...existingLeaders, storedDisplayName].join(', ');
    }

    return existingLeaders.join(', ');
};

const ModalLeaderSignup: React.FC<{
    session: Session;
    onSave: (session: Session) => void;
    onCancel: () => void;
}> = ({ session, onSave, onCancel }) => {
    const [formData, setFormData] = useState(session);
    const [leaderInput, setLeaderInput] = useState(() => getInitialLeaderInput(session));
    const [hasBeenEdited, setHasBeenEdited] = useState(false);

    const [initialData] = useState({
        ...session,
        leaderInput: getInitialLeaderInput(session),
    });

    useEffect(() => {
        const isEdited =
        JSON.stringify({
            ...formData,
            leaderInput,
        }) !==
        JSON.stringify({
            ...initialData,
            leaderInput: initialData.leaderInput,
        });

        setHasBeenEdited(isEdited);
    }, [formData, leaderInput, initialData]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const leaderNames = leaderInput
        .split(',')
        .map(name => name.trim())
        .filter(name => name);

        onSave({ ...formData, leaderNames });
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
                {/* instructions */}
                <p className="text-sm text-gray-400 mb-2">
                Add your name below to sign up as a leader. Separate multiple names using commas.
                </p>
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
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Session } from '../../types';

const ModalUpdateSessionStatus: React.FC<{
    session: Session;
    onSave: (session: Session) => void;
    onCancel: () => void;
}> = ({ session, onSave, onCancel }) => {
    const [formData, setFormData] = useState(session);
    const [hasBeenEdited, setHasBeenEdited] = useState(false);

    const [initialData] = useState({
        ...session,
    });

    useEffect(() => {
    const isEdited =
        JSON.stringify({
        ...formData,
        }) !==
        JSON.stringify({
        ...initialData,
        });

    setHasBeenEdited(isEdited);
    }, [formData, initialData]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onCancel}>
        <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
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

export default ModalUpdateSessionStatus;
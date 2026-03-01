import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ModalConfirmDiscard: React.FC<{
    onDiscard: () => void;
    onKeepEditing: () => void;
}> = ({ onDiscard, onKeepEditing }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[60]" onClick={onKeepEditing}>
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Discard changes?</h3>
                </div>
                <p className="text-sm text-gray-600 mb-5">
                    You have unsaved changes. Are you sure you want to discard them?
                </p>
                <div className="flex space-x-3">
                    <button
                        type="button"
                        onClick={onKeepEditing}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                        Keep editing
                    </button>
                    <button
                        type="button"
                        onClick={onDiscard}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                    >
                        Discard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmDiscard;

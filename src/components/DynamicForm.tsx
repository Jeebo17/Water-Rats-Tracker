import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { submitForm } from '../util/forms';

interface Field {
    name: string;
    label: string;
    type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'info';
    placeholder?: string;
    options?: string[];
    required?: boolean;
    links?: { text: string; url: string }[];
}

interface Form {
    id: string;
    title: string;
    onSubmitMessage?: string;
    fields: Field[];
}

interface DynamicFormProps {
    form: Form;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ form }) => {
    const [formData, setFormData] = useState<Record<string, any>>(
        form.fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
    );
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (name: string, value: any) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await submitForm(form.id, formData);
            setFormData(form.fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
            setSubmitted(true);
        } catch (err) {
            alert('Failed to submit form. Try again.');
        }
    };

    const renderLabelWithLinks = (label: string, links: { text: string; url: string }[] = []) => {
        const parts = label.split(/(\{[^}]+\})/g);

        return parts.map((part, index) => {
            const match = part.match(/^\{(.+)\}$/);

            if (match) {
            const linkText = match[1];
            const link = links.find(l => l.text === linkText);

            if (link) {
                return (
                <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                >
                    {link.text}
                </a>
                );
            }
        }

            return <span key={index}>{part}</span>;
        });
    };


    if (submitted) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <svg
                        className="mx-auto mb-4 text-green-500"
                        width="48"
                        height="48"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle cx="12" cy="12" r="12" fill="#22c55e" opacity="0.15" />
                        <path
                            d="M7 13l3 3 7-7"
                            stroke="#22c55e"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <p className="text-xl font-semibold text-gray-800 mb-2">
                        {form.onSubmitMessage || 'Thank you! Your submission has been received.'}
                    </p>
                    <p className="text-gray-500">You may now close this window.</p>
                </div>
            </div>
        );
    }

    const allRequiredFilled = form.fields
        .filter(field => field.required)
        .every(field => {
            const value = formData[field.name];
            return field.type === 'checkbox' ? value === true : value !== '';
        });

    return (
        <div className="bg-white rounded-xl p-6 w-full max-w-3xl overflow-none mx-auto flex flex-col">
            <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">{form.title}</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
            {form.fields.map((field) => (
                <div key={field.name}>
                {field.type !== 'checkbox' && field.type !== 'info' && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {renderLabelWithLinks(field.label, field.links)}{field.required ? <span className="text-red-500 ml-1">*</span> : null}
                    </label>
                )}

                {field.type === 'textarea' ? (
                    <textarea
                    value={formData[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required={field.required}
                    />
                ) : field.type === 'select' ? (
                    <select
                    value={formData[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={field.required}
                    >
                    <option value="">Select...</option>
                        {field.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                ) : field.type === 'checkbox' ? (
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={formData[field.name]}
                            onChange={(e) => handleChange(field.name, e.target.checked)}
                            className="h-4 w-4 border-2 border-blue-500 bg-blue-100 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0 accent-blue-600"
                            required={field.required}
                        />
                        <label className="text-sm font-medium text-gray-700 flex items-center select-none cursor-pointer">
                            {renderLabelWithLinks(field.label, field.links)}
                            {field.required ? <span className="text-red-500 ml-1">*</span> : null}
                        </label>
                    </div>
                ) : field.type === 'info' ? (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
                        {renderLabelWithLinks(field.label, field.links)}
                    </div>
                ) : (
                    <input
                    type={field.type}
                    value={formData[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={field.required}
                    />
                )}
                </div>
            ))}

            <div className="flex space-x-3 pt-4">
                <button
                type="submit"
                className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                    allRequiredFilled
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!allRequiredFilled}
                >
                <Save className="w-4 h-4" />
                <span>Submit</span>
                </button>
            </div>
            </form>
        </div>
    );
};

export default DynamicForm;

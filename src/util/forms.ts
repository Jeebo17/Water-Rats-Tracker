import { 
    doc, 
    setDoc 
} from 'firebase/firestore';
import { db } from './config';
import { IS_DEV } from "./util";

function generateUid() {
    return crypto.randomUUID();
}

export async function submitForm(formId: string, data: Record<string, any>) {
    if (IS_DEV) { console.log('submitForm: ', data); }
    
    try {
        const sanitizedName = ((data.firstName || '') + (data.lastName || '')).replace(/\s+/g, '_') || 'anonymous';
        const uid = generateUid();
        const personId = `${sanitizedName}-${uid}`;

        const submissionRef = doc(db, 'forms', formId, 'submissions', personId);

        await setDoc(submissionRef, {
            ...data,
            submittedAt: new Date()
        });

        console.log(`Form submitted successfully as ${personId}!`);
    } catch (error) {
        console.error('Error submitting form:', error);
        throw error;
    }
}

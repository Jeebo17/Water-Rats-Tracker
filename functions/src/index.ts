import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const loginWithPassword = functions.https.onCall(
    async (request: functions.https.CallableRequest<any>) => {
        const password = request.data.password;
        const correctPassword = process.env.SHARED_PASSWORD;

        if (!correctPassword) {
        throw new functions.https.HttpsError(
            'internal',
            'Server password not configured'
        );
        }

        if (password !== correctPassword) {
        throw new functions.https.HttpsError(
            'permission-denied',
            'Incorrect password'
        );
        }

        const token = await admin.auth().createCustomToken('shared-user');

        return { token };
    }
);

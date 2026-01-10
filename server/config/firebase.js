import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let serviceAccount;

try {
    const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} catch (error) {
    console.warn('Firebase service account key not found. Firebase features will not work.');
}

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else if (process.env.FIREBASE_PROJECT_ID) {
    // Fallback to environment variables if possible
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID
    });
}

export const auth = serviceAccount || process.env.FIREBASE_PROJECT_ID ? admin.auth() : null;
export default admin;

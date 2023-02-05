import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app'
import { initializeFirestore } from 'firebase-admin/firestore'

const app = getApps().length ? getApp() : initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  }),
})

export const firestore = initializeFirestore(app, { preferRest: true })

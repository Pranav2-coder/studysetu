import { incrementAnalytics } from './db';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function trackEvent(instituteId, eventType) {
  const validTypes = ['profile_view', 'whatsapp_click', 'call_click', 'qr_scan'];
  if (!validTypes.includes(eventType)) {
    console.warn(`Invalid event type: ${eventType}`);
    return;
  }

  // 1. Increment the compiled counter in the database layer (handles localStorage & Firestore increments)
  try {
    await incrementAnalytics(instituteId, eventType);
  } catch (error) {
    console.error('Error incrementing analytics counter:', error);
  }

  // 2. Also save raw event stream in Firestore for historical detailed logging if Firestore is configured
  const projId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const isDemo = !projId || projId === 'demo-project' || projId.includes('YOUR_');
  if (db && !isDemo) {
    try {
      await addDoc(collection(db, 'analytics_events'), {
        instituteId,
        eventType,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn('Error saving raw event log to Firestore:', error);
    }
  } else {
    console.log(`Event tracked (local-only): ${eventType} for institute ${instituteId}`);
  }
}

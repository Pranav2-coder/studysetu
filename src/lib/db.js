import { db } from './firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  increment
} from 'firebase/firestore';
import { institutes as seedInstitutes } from './seedData';

// Helper to determine if we should attempt Firestore operations
const canUseFirestore = () => {
  // If db is not initialized, we cannot use firestore
  if (!db) return false;
  // If we are using the placeholder project ID, fallback to localStorage for instant local evaluation
  const projId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  if (!projId || projId === 'demo-project' || projId.includes('YOUR_')) {
    return false;
  }
  return true;
};

// LocalStorage Keys
const INST_KEY = 'edufinder_institutes';
const ANALYTICS_KEY = 'edufinder_analytics';

// Initialize LocalStorage with seed data if empty
const initLocalStorage = () => {
  if (!localStorage.getItem(INST_KEY)) {
    localStorage.setItem(INST_KEY, JSON.stringify(seedInstitutes));
  }
  if (!localStorage.getItem(ANALYTICS_KEY)) {
    const initialAnalytics = {};
    seedInstitutes.forEach(inst => {
      initialAnalytics[inst.id] = {
        id: inst.id,
        views: 0,
        whatsappClicks: 0,
        callClicks: 0,
        qrScans: 0
      };
    });
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(initialAnalytics));
  }
};

// Always make sure LocalStorage is initialized on load
initLocalStorage();

// Seed Firestore if it is empty
let firestoreSeeded = false;
async function checkAndSeedFirestore() {
  if (firestoreSeeded) return;
  try {
    const colRef = collection(db, 'institutes');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.log('Firestore institutes collection is empty. Seeding seedData...');
      // Seed institutes
      for (const inst of seedInstitutes) {
        // Set document with seed ID
        await setDoc(doc(db, 'institutes', inst.id), {
          ...inst,
          published: inst.published !== undefined ? inst.published : true,
          createdAt: new Date().toISOString()
        });

        // Seed empty analytics counter doc
        await setDoc(doc(db, 'instituteAnalytics', inst.id), {
          id: inst.id,
          views: 0,
          whatsappClicks: 0,
          callClicks: 0,
          qrScans: 0
        });
      }
      console.log('Firestore successfully seeded.');
    }
    firestoreSeeded = true;
  } catch (err) {
    console.warn('Failed to seed Firestore, will fallback:', err);
  }
}

// Map event type to analytics counter field
const getFieldFromEventType = (eventType) => {
  switch (eventType) {
    case 'profile_view': return 'views';
    case 'whatsapp_click': return 'whatsappClicks';
    case 'call_click': return 'callClicks';
    case 'qr_scan': return 'qrScans';
    default: return eventType;
  }
};

/* ==========================================================================
   PUBLIC API FOR INSTITUTES
   ========================================================================== */

export async function getInstitutes() {
  if (canUseFirestore()) {
    try {
      await checkAndSeedFirestore();
      const snapshot = await getDocs(collection(db, 'institutes'));
      const list = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return list;
    } catch (err) {
      console.warn('Firestore getInstitutes failed, falling back to localStorage:', err);
    }
  }

  // LocalStorage Fallback
  initLocalStorage();
  return JSON.parse(localStorage.getItem(INST_KEY));
}

export async function getInstitute(idOrSlug) {
  const list = await getInstitutes();
  return list.find(inst => inst.id === idOrSlug || inst.slug === idOrSlug) || null;
}

export async function saveInstitute(instituteData) {
  const isEdit = !!instituteData.id;
  const id = isEdit ? instituteData.id : `inst_${Date.now()}`;
  const data = {
    ...instituteData,
    id,
    feesValue: Number(instituteData.feesValue) || parseInt(instituteData.fees) || 0,
    published: instituteData.published ?? true,
    updatedAt: new Date().toISOString()
  };
  if (!isEdit) {
    data.createdAt = new Date().toISOString();
  }

  if (canUseFirestore()) {
    try {
      await setDoc(doc(db, 'institutes', id), data, { merge: true });
      
      // If it's a new institute, also create an analytics entry in Firestore
      if (!isEdit) {
        await setDoc(doc(db, 'instituteAnalytics', id), {
          id,
          views: 0,
          whatsappClicks: 0,
          callClicks: 0,
          qrScans: 0
        });
      }
      return data;
    } catch (err) {
      console.warn('Firestore saveInstitute failed, falling back to localStorage:', err);
    }
  }

  // LocalStorage Fallback
  initLocalStorage();
  const list = JSON.parse(localStorage.getItem(INST_KEY));
  const idx = list.findIndex(inst => inst.id === id);
  if (idx > -1) {
    list[idx] = { ...list[idx], ...data };
  } else {
    list.push(data);
  }
  localStorage.setItem(INST_KEY, JSON.stringify(list));

  // If new institute, initialize its analytics in LocalStorage
  if (!isEdit) {
    const analytics = JSON.parse(localStorage.getItem(ANALYTICS_KEY)) || {};
    analytics[id] = { id, views: 0, whatsappClicks: 0, callClicks: 0, qrScans: 0 };
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
  }

  return data;
}

export async function deleteInstitute(id) {
  if (canUseFirestore()) {
    try {
      await deleteDoc(doc(db, 'institutes', id));
      await deleteDoc(doc(db, 'instituteAnalytics', id));
      return true;
    } catch (err) {
      console.warn('Firestore deleteInstitute failed, falling back to localStorage:', err);
    }
  }

  // LocalStorage Fallback
  initLocalStorage();
  let list = JSON.parse(localStorage.getItem(INST_KEY));
  list = list.filter(inst => inst.id !== id);
  localStorage.setItem(INST_KEY, JSON.stringify(list));

  const analytics = JSON.parse(localStorage.getItem(ANALYTICS_KEY)) || {};
  delete analytics[id];
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));

  return true;
}

/* ==========================================================================
   PUBLIC API FOR ANALYTICS
   ========================================================================== */

export async function getAnalytics() {
  if (canUseFirestore()) {
    try {
      const snapshot = await getDocs(collection(db, 'instituteAnalytics'));
      const records = {};
      snapshot.forEach(doc => {
        records[doc.id] = { id: doc.id, ...doc.data() };
      });
      return records;
    } catch (err) {
      console.warn('Firestore getAnalytics failed, falling back to localStorage:', err);
    }
  }

  // LocalStorage Fallback
  initLocalStorage();
  return JSON.parse(localStorage.getItem(ANALYTICS_KEY));
}

export async function getInstituteAnalytics(id) {
  if (canUseFirestore()) {
    try {
      const docSnap = await getDoc(doc(db, 'instituteAnalytics', id));
      if (docSnap.exists()) {
        return { id, ...docSnap.data() };
      }
    } catch (err) {
      console.warn('Firestore getInstituteAnalytics failed, falling back to localStorage:', err);
    }
  }

  // LocalStorage Fallback
  initLocalStorage();
  const analytics = JSON.parse(localStorage.getItem(ANALYTICS_KEY)) || {};
  return analytics[id] || { id, views: 0, whatsappClicks: 0, callClicks: 0, qrScans: 0 };
}

export async function incrementAnalytics(id, eventType) {
  const field = getFieldFromEventType(eventType);

  if (canUseFirestore()) {
    try {
      const docRef = doc(db, 'instituteAnalytics', id);
      await setDoc(docRef, {
        id,
        [field]: increment(1)
      }, { merge: true });
      return true;
    } catch (err) {
      console.warn('Firestore incrementAnalytics failed, falling back to localStorage:', err);
    }
  }

  // LocalStorage Fallback
  initLocalStorage();
  const analytics = JSON.parse(localStorage.getItem(ANALYTICS_KEY)) || {};
  if (!analytics[id]) {
    analytics[id] = { id, views: 0, whatsappClicks: 0, callClicks: 0, qrScans: 0 };
  }
  analytics[id][field] = (analytics[id][field] || 0) + 1;
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
  return true;
}

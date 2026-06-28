import { supabase } from './supabase';
import { institutes as seedInstitutes } from './seedData';

// Helper to determine if we should use Supabase operations
const canUseSupabaseDb = () => {
  return !!supabase;
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

// Seed Supabase if it is empty
let supabaseSeeded = false;
async function checkAndSeedSupabase() {
  if (supabaseSeeded || !supabase) return;
  try {
    const { count, error } = await supabase
      .from('institutes')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    
    if (count === 0) {
      console.log('Supabase institutes table is empty. Seeding seedData...');
      
      // Map and insert institutes
      const dbInstitutes = seedInstitutes.map(inst => ({
        ...mapToSupabase(inst),
        created_at: new Date().toISOString()
      }));
      
      const { error: insertError } = await supabase
        .from('institutes')
        .insert(dbInstitutes);
        
      if (insertError) throw insertError;
      
      // Map and insert analytics
      const dbAnalytics = seedInstitutes.map(inst => ({
        institute_id: inst.id,
        views: 0,
        whatsapp_clicks: 0,
        call_clicks: 0,
        qr_scans: 0
      }));
      
      const { error: insertAnalyticsError } = await supabase
        .from('institute_analytics')
        .insert(dbAnalytics);
        
      if (insertAnalyticsError) throw insertAnalyticsError;
      
      console.log('Supabase successfully seeded.');
    }
    supabaseSeeded = true;
  } catch (err) {
    console.warn('Failed to seed Supabase, will fallback:', err);
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

const mapAnalyticsFieldToDb = (field) => {
  switch (field) {
    case 'views': return 'views';
    case 'whatsappClicks': return 'whatsapp_clicks';
    case 'callClicks': return 'call_clicks';
    case 'qrScans': return 'qr_scans';
    default: return field;
  }
};

// Data converters between JavaScript camelCase and Database snake_case
function mapFromSupabase(dbInst) {
  if (!dbInst) return null;
  return {
    id: dbInst.id,
    slug: dbInst.slug,
    name: dbInst.name,
    category: dbInst.category,
    description: dbInst.description,
    subjects: dbInst.subjects || [],
    classesCovered: dbInst.classes_covered || [],
    area: dbInst.area,
    address: dbInst.address,
    fees: dbInst.fees,
    feesValue: dbInst.fees_value,
    timings: dbInst.timings,
    experience: dbInst.experience,
    phone: dbInst.phone,
    whatsapp: dbInst.whatsapp,
    coverImage: dbInst.cover_image,
    images: dbInst.images || [],
    featured: dbInst.featured,
    published: dbInst.published,
    createdAt: dbInst.created_at,
    updatedAt: dbInst.updated_at,
  };
}

function mapToSupabase(inst) {
  if (!inst) return null;
  return {
    id: inst.id,
    slug: inst.slug,
    name: inst.name,
    category: inst.category,
    description: inst.description || null,
    subjects: inst.subjects || [],
    classes_covered: inst.classesCovered || [],
    area: inst.area,
    address: inst.address || null,
    fees: inst.fees || null,
    fees_value: inst.feesValue !== undefined ? inst.feesValue : (parseInt(inst.fees) || 0),
    timings: inst.timings || null,
    experience: inst.experience || null,
    phone: inst.phone,
    whatsapp: inst.whatsapp,
    cover_image: inst.coverImage || null,
    images: inst.images || [],
    featured: inst.featured || false,
    published: inst.published ?? true,
    updated_at: new Date().toISOString(),
  };
}

function mapAnalyticsFromSupabase(dbAnal) {
  if (!dbAnal) return null;
  return {
    id: dbAnal.institute_id,
    views: dbAnal.views || 0,
    whatsappClicks: dbAnal.whatsapp_clicks || 0,
    callClicks: dbAnal.call_clicks || 0,
    qrScans: dbAnal.qr_scans || 0,
  };
}

/* ==========================================================================
   PUBLIC API FOR INSTITUTES
   ========================================================================== */

export async function getInstitutes() {
  if (canUseSupabaseDb()) {
    try {
      await checkAndSeedSupabase();
      const { data, error } = await supabase
        .from('institutes')
        .select('*');
      
      if (error) throw error;
      return (data || []).map(mapFromSupabase);
    } catch (err) {
      console.warn('Supabase getInstitutes failed, falling back to localStorage:', err);
    }
  }

  // LocalStorage Fallback
  initLocalStorage();
  return JSON.parse(localStorage.getItem(INST_KEY));
}

export async function getInstitute(idOrSlug) {
  if (canUseSupabaseDb()) {
    try {
      await checkAndSeedSupabase();
      const isId = idOrSlug.match(/^inst_\d+$/) || idOrSlug.match(/^\d+$/);
      const queryField = isId ? 'id' : 'slug';
      
      const { data, error } = await supabase
        .from('institutes')
        .select('*')
        .eq(queryField, idOrSlug)
        .maybeSingle();

      if (error) throw error;
      if (data) return mapFromSupabase(data);
    } catch (err) {
      console.warn(`Supabase getInstitute for ${idOrSlug} failed, falling back to localStorage:`, err);
    }
  }

  // LocalStorage Fallback
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

  if (canUseSupabaseDb()) {
    try {
      const dbPayload = mapToSupabase(data);
      if (!isEdit) {
        dbPayload.created_at = data.createdAt;
      }
      
      const { error } = await supabase
        .from('institutes')
        .upsert(dbPayload);

      if (error) throw error;
      
      // If it's a new institute, also create an analytics entry in Supabase
      if (!isEdit) {
        await supabase
          .from('institute_analytics')
          .insert([
            {
              institute_id: id,
              views: 0,
              whatsapp_clicks: 0,
              call_clicks: 0,
              qr_scans: 0
            }
          ]);
      }
      return data;
    } catch (err) {
      console.warn('Supabase saveInstitute failed, falling back to localStorage:', err);
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
  if (canUseSupabaseDb()) {
    try {
      // Cascading deletes on institute_analytics and analytics_events are handled by Postgres if foreign key configured,
      // but let's delete explicitly for extra robustness.
      await supabase
        .from('institute_analytics')
        .delete()
        .eq('institute_id', id);
        
      await supabase
        .from('analytics_events')
        .delete()
        .eq('institute_id', id);

      const { error } = await supabase
        .from('institutes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase deleteInstitute failed, falling back to localStorage:', err);
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
  if (canUseSupabaseDb()) {
    try {
      const { data, error } = await supabase
        .from('institute_analytics')
        .select('*');

      if (error) throw error;
      
      const records = {};
      (data || []).forEach(row => {
        records[row.institute_id] = mapAnalyticsFromSupabase(row);
      });
      return records;
    } catch (err) {
      console.warn('Supabase getAnalytics failed, falling back to localStorage:', err);
    }
  }

  // LocalStorage Fallback
  initLocalStorage();
  return JSON.parse(localStorage.getItem(ANALYTICS_KEY));
}

export async function getInstituteAnalytics(id) {
  if (canUseSupabaseDb()) {
    try {
      const { data, error } = await supabase
        .from('institute_analytics')
        .select('*')
        .eq('institute_id', id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        return mapAnalyticsFromSupabase(data);
      }
    } catch (err) {
      console.warn('Supabase getInstituteAnalytics failed, falling back to localStorage:', err);
    }
  }

  // LocalStorage Fallback
  initLocalStorage();
  const analytics = JSON.parse(localStorage.getItem(ANALYTICS_KEY)) || {};
  return analytics[id] || { id, views: 0, whatsappClicks: 0, callClicks: 0, qrScans: 0 };
}

export async function incrementAnalytics(id, eventType) {
  const field = getFieldFromEventType(eventType);
  const dbField = mapAnalyticsFieldToDb(field);

  if (canUseSupabaseDb()) {
    try {
      // Select the current values to safely increment them client-side in the absence of an RPC function
      const { data, error } = await supabase
        .from('institute_analytics')
        .select('*')
        .eq('institute_id', id)
        .maybeSingle();

      if (error) throw error;

      const currentVal = data ? (data[dbField] || 0) : 0;
      
      const { error: upsertError } = await supabase
        .from('institute_analytics')
        .upsert({
          institute_id: id,
          [dbField]: currentVal + 1
        }, { onConflict: 'institute_id' });

      if (upsertError) throw upsertError;
      return true;
    } catch (err) {
      console.warn('Supabase incrementAnalytics failed, falling back to localStorage:', err);
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

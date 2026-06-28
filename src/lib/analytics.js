import { incrementAnalytics } from './db';
import { supabase } from './supabase';

export async function trackEvent(instituteId, eventType) {
  const validTypes = ['profile_view', 'whatsapp_click', 'call_click', 'qr_scan'];
  if (!validTypes.includes(eventType)) {
    console.warn(`Invalid event type: ${eventType}`);
    return;
  }

  // 1. Increment the compiled counter in the database layer (handles localStorage & Supabase increments)
  try {
    await incrementAnalytics(instituteId, eventType);
  } catch (error) {
    console.error('Error incrementing analytics counter:', error);
  }

  // 2. Also save raw event stream in Supabase for historical detailed logging if configured
  if (supabase) {
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert([
          {
            institute_id: instituteId,
            event_type: eventType,
          }
        ]);
      if (error) throw error;
    } catch (error) {
      console.warn('Error saving raw event log to Supabase:', error);
    }
  } else {
    console.log(`Event tracked (local-only): ${eventType} for institute ${instituteId}`);
  }
}

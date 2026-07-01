import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const canUseSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (supabaseUrl.includes('placeholder-project-id') || supabaseUrl.includes('your-project-id')) {
    return false;
  }
  return true;
};

export const supabase = canUseSupabase()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Submit an inquiry to the Supabase backend.
 * Falls back to offline simulation if Supabase is not configured.
 */
export async function submitInquiry(data) {
  if (!supabase) {
    console.log('Inquiry submitted (offline mode):', data);
    return { success: true, offline: true };
  }
  try {
    const { data: insertedData, error } = await supabase
      .from('inquiries')
      .insert([
        {
          name: data.name,
          phone: data.phone,
          class: data.class || null,
          subject: data.subject,
          area: data.area || null,
          budget: data.budget || null,
          institute_id: data.instituteId || null,
          institute_name: data.instituteName || null,
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, id: insertedData?.[0]?.id };
  } catch (error) {
    console.error('Error submitting inquiry to Supabase:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Submit a contact message to the Supabase backend.
 * Falls back to offline simulation if Supabase is not configured.
 */
export async function submitContact(data) {
  if (!supabase) {
    console.log('Contact submitted (offline mode):', data);
    return { success: true, offline: true };
  }
  try {
    const { data: insertedData, error } = await supabase
      .from('contacts')
      .insert([
        {
          name: data.name || null,
          email: data.email,
          message: data.message,
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, id: insertedData?.[0]?.id };
  } catch (error) {
    console.error('Error submitting contact to Supabase:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Upload an image to Supabase Storage.
 * @param {File} file - The file to upload.
 * @param {string} bucketName - The name of the storage bucket.
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function uploadImage(file, bucketName = 'tuition-images') {
  if (!supabase) {
    return { success: false, error: 'Supabase client is not initialized.' };
  }
  try {
    // Generate a unique file name to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get the public URL for the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (error) {
    console.error('Error uploading image to Supabase:', error);
    return { success: false, error: error.message };
  }
}

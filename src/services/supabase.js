import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const isSupabaseConfigured = Boolean(supabase);

export const saveFootprintEstimate = async ({ firebaseUser, answers, result, selectedActions }) => {
  if (!firebaseUser) {
    throw new Error('Sign in with Google before accessing saved footprints.');
  }

  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
  }

  // 1. Upsert Profile (to keep track of users)
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        display_name: firebaseUser.displayName,
        photo_url: firebaseUser.photoURL,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'firebase_uid' }
    );

  if (profileError) {
    console.error("Error saving profile:", profileError);
    throw new Error(`Supabase profile upsert failed: ${profileError.message}`);
  }

  // 2. Insert Footprint Estimate
  const { data: estimate, error: estimateError } = await supabase
    .from('footprint_estimates')
    .insert({
      firebase_uid: firebaseUser.uid,
      answers,
      result,
      selected_actions: selectedActions || [],
      total_kg_co2e_month: Number.parseFloat(result?.total || '0'),
    })
    .select()
    .single();

  if (estimateError) {
    console.error("Error saving estimate:", estimateError);
    throw new Error(`Supabase estimate insert failed: ${estimateError.message}`);
  }

  return estimate;
};

export const getFootprintHistory = async (firebaseUser) => {
  if (!firebaseUser || !isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('footprint_estimates')
    .select('id, answers, result, selected_actions, total_kg_co2e_month, created_at')
    .eq('firebase_uid', firebaseUser.uid)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching history:", error);
    return [];
  }

  return data || [];
};

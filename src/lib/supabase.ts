
import { createClient } from '@supabase/supabase-js';

// Supabase client setup with fallback values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we have the required configuration
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Create client only if properly configured
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    })
  : null;

// Helper function to check if Supabase is configured
export const isSupabaseAvailable = () => !!isSupabaseConfigured;

// Table existence check with fallback
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  if (!isSupabaseConfigured || !supabase) {
    console.log(`Supabase not configured, assuming ${tableName} table doesn't exist`);
    return false;
  }
  
  try {
    // More reliable way to check if table exists without causing errors
    const { data, error } = await supabase
      .from(tableName)
      .select('count')
      .limit(1)
      .throwOnError(false)
      .maybeSingle();
      
    if (error) {
      // If we get a specific error about the relation not existing, the table doesn't exist
      if (error.message.includes('does not exist') || error.code === '42P01') {
        console.log(`Table ${tableName} does not exist`);
        return false;
      }
      
      // For other errors, we log but assume the table might not exist to be safe
      console.warn(`Error checking ${tableName} table existence:`, error);
      return false;
    }
    
    console.log(`Table ${tableName} exists`);
    return true;
  } catch (err) {
    console.error(`Exception checking ${tableName} table:`, err);
    return false;
  }
};

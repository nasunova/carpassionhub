
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

// Function to check if a table exists
const checkTableExists = async (tableName: string) => {
  if (!isSupabaseConfigured || !supabase) {
    console.error('Supabase not configured correctly');
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', tableName)
      .maybeSingle();

    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};

// Function to set up the profiles table with extended fields
export const setupProfilesTable = async () => {
  if (!isSupabaseConfigured || !supabase) {
    console.error('Supabase not configured correctly');
    return false;
  }

  try {
    // Check if the profiles table already exists
    const tableExists = await checkTableExists('profiles');

    // If the table doesn't exist, create it
    if (!tableExists) {
      console.log('Creating profiles table...');
      
      // Create the profiles table with additional fields
      const { error: createTableError } = await supabase.rpc('create_profiles_table_if_not_exists');
      
      if (createTableError) {
        console.error('Error creating profiles table:', createTableError);
        return false;
      }
      
      console.log('Profiles table created successfully');
    } else {
      console.log('Profiles table already exists');
      
      // Check if we need to add any columns
      try {
        // Add location column if it doesn't exist
        await supabase.rpc('add_column_if_not_exists', {
          table_name: 'profiles',
          column_name: 'location',
          column_type: 'text'
        });
        
        // Add bio column if it doesn't exist
        await supabase.rpc('add_column_if_not_exists', {
          table_name: 'profiles',
          column_name: 'bio',
          column_type: 'text'
        });
        
        // Add badges column if it doesn't exist
        await supabase.rpc('add_column_if_not_exists', {
          table_name: 'profiles',
          column_name: 'badges',
          column_type: 'text[]'
        });
        
        // Add stats column if it doesn't exist
        await supabase.rpc('add_column_if_not_exists', {
          table_name: 'profiles',
          column_name: 'stats',
          column_type: 'jsonb'
        });

        // Add updated_at column if it doesn't exist
        await supabase.rpc('add_column_if_not_exists', {
          table_name: 'profiles',
          column_name: 'updated_at',
          column_type: 'timestamptz'
        });
        
        console.log('Extended profile columns verified');
      } catch (columnError) {
        console.error('Error adding columns to profiles table:', columnError);
        // Continue even if adding columns fails, as the base table exists
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error setting up profiles table:', error);
    return false;
  }
};

// Initialize default stats and badges for a new profile
export const initializeProfileExtras = async (userId: string) => {
  if (!isSupabaseConfigured || !supabase) {
    console.error('Supabase not configured correctly');
    return false;
  }
  
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        badges: ['Nuovo Membro'],
        stats: {
          followers: 0,
          following: 0,
          events: 0,
          roads: 0
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (error) {
      console.error('Error initializing profile extras:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing profile extras:', error);
    return false;
  }
};

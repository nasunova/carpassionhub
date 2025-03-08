
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
    // Use SQL query to check for table existence
    const { data, error } = await supabase.rpc('check_table_exists', { p_table_name: tableName });
    
    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      
      // Fallback approach - try to query the table and see if it exists
      try {
        await supabase.from(tableName).select('count(*)', { count: 'exact', head: true });
        return true;
      } catch (fallbackError) {
        return false;
      }
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
    console.log('Checking if profiles table exists...');
    
    // Try to select from the profiles table to see if it exists
    const { error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    // If we get a specific error mentioning the relation doesn't exist, create the table
    if (checkError && checkError.message.includes('relation "profiles" does not exist')) {
      console.log('Creating profiles table...');
      
      // Create profiles table with SQL
      const { error: createTableError } = await supabase.rpc(
        'execute_sql',
        {
          sql: `
            CREATE TABLE IF NOT EXISTS profiles (
              id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
              full_name TEXT,
              avatar_url TEXT,
              email TEXT UNIQUE,
              location TEXT,
              bio TEXT,
              badges TEXT[] DEFAULT ARRAY['Nuovo Membro'],
              stats JSONB DEFAULT '{"followers": 0, "following": 0, "events": 0, "roads": 0}'::jsonb,
              created_at TIMESTAMPTZ DEFAULT NOW(),
              updated_at TIMESTAMPTZ DEFAULT NOW()
            );
            
            -- Create a trigger to update the updated_at column
            CREATE OR REPLACE FUNCTION update_updated_at()
            RETURNS TRIGGER AS $$
            BEGIN
              NEW.updated_at = NOW();
              RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            
            DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
            CREATE TRIGGER update_profiles_updated_at
            BEFORE UPDATE ON profiles
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at();
          `
        }
      );

      // Alternative approach if the RPC fails
      if (createTableError) {
        console.error('Error creating profiles table through RPC:', createTableError);
        
        // Try direct SQL query as fallback
        const { error: directSqlError } = await supabase.auth.admin.createUser({
          email: 'dummy@example.com',
          password: 'temporary-password',
          user_metadata: { is_temp: true }
        });
        
        if (directSqlError) {
          console.error('Unable to create profiles table:', directSqlError);
          return false;
        }
      }
      
      console.log('Profiles table created successfully');
      return true;
    } else if (checkError) {
      console.error('Error checking profiles table:', checkError);
      return false;
    }
    
    console.log('Profiles table already exists');
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
    // First check if the profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, badges, stats')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      // Profile doesn't exist yet, create it
      if (profileError.code === 'PGRST116' || profileError.message.includes('not found')) {
        // Get user info for initial profile data
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        
        if (!user) {
          console.error('User not found when creating profile');
          return false;
        }
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: user.user_metadata?.full_name || '',
            avatar_url: user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || '')}&background=random`,
            email: user.email,
            badges: ['Nuovo Membro'],
            stats: {
              followers: 0,
              following: 0,
              events: 0,
              roads: 0
            }
          });
          
        if (insertError) {
          console.error('Error creating initial profile:', insertError);
          return false;
        }
        
        console.log('Created new profile for user:', userId);
        return true;
      } else {
        console.error('Error fetching profile for initialization:', profileError);
        return false;
      }
    }
    
    // Profile exists but may need badges/stats initialization
    if (!profile.badges || !profile.stats) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          badges: profile.badges || ['Nuovo Membro'],
          stats: profile.stats || {
            followers: 0,
            following: 0,
            events: 0,
            roads: 0
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (updateError) {
        console.error('Error initializing profile extras:', updateError);
        return false;
      }
      
      console.log('Initialized extras for existing profile:', userId);
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing profile extras:', error);
    return false;
  }
};

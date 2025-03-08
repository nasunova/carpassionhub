
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
        // Disabilita la verifica dell'email
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    })
  : null;

// Helper function to check if Supabase is configured
export const isSupabaseAvailable = () => !!isSupabaseConfigured;

// Funzione per configurare la tabella profiles
export const setupProfilesTable = async () => {
  if (!isSupabaseConfigured || !supabase) {
    console.error('Supabase non è configurato correttamente');
    return false;
  }

  try {
    // Verifica se la tabella profiles esiste già
    const { data: existingTables, error: queryError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'profiles');

    if (queryError) {
      console.error('Errore nella verifica della tabella profiles:', queryError);
      return false;
    }

    // Se la tabella non esiste, creala
    if (!existingTables || existingTables.length === 0) {
      console.log('Creazione tabella profiles...');
      
      // Prima crea la tabella profiles
      const { error: createTableError } = await supabase.rpc('create_profiles_table_if_not_exists');
      
      if (createTableError) {
        console.error('Errore nella creazione della tabella profiles:', createTableError);
        return false;
      }
      
      console.log('Tabella profiles creata con successo');
    } else {
      console.log('La tabella profiles esiste già');
    }
    
    return true;
  } catch (error) {
    console.error('Errore nella configurazione della tabella profiles:', error);
    return false;
  }
};

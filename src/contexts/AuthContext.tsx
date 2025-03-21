import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseAvailable, initializeProfileExtras } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
};

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>; // Changed from Promise<void> to Promise<boolean>
  updateAvatar: (url: string) => Promise<void>;
};

// Create context with default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    console.log("AuthProvider initialized");
    
    if (!isSupabaseAvailable()) {
      console.warn("Supabase is not available. Authentication will not work.");
      setLoading(false);
      return;
    }

    // Force a timeout to prevent indefinite loading state
    const loadingTimeout = setTimeout(() => {
      console.info("Authentication check timed out - forcing ready state");
      setLoading(false);
    }, 3000);

    // Check if the user is already authenticated
    const checkUser = async () => {
      console.info("Checking initial authentication state...");
      try {
        const { data, error } = await supabase!.auth.getUser();
        
        if (error) {
          console.error("Error getting user:", error.message);
          setLoading(false);
          clearTimeout(loadingTimeout);
          return;
        }
        
        if (data?.user) {
          console.info("User found:", data.user.id);
          
          // Get profile data
          const { data: profile, error: profileError } = await supabase!
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          
          if (profileError) {
            console.error("Error fetching profile:", profileError);
            
            // If profile doesn't exist, create it
            if (profileError.code === 'PGRST116') {
              console.log("Profile doesn't exist, creating it...");
              await createInitialProfile(data.user);
            }
          }
          
          // Set user with available data
          setUser({
            id: data.user.id,
            email: data.user.email!,
            full_name: profile?.full_name || data.user.user_metadata?.full_name,
            avatar_url: profile?.avatar_url || data.user.user_metadata?.avatar_url,
            created_at: data.user.created_at!,
          });
        } else {
          console.info("No user found in session");
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
        clearTimeout(loadingTimeout);
      }
    };

    // Set up the listener for authentication changes
    console.info("Setting up auth state change listener");
    const { data: { subscription } } = supabase!.auth.onAuthStateChange(
      async (event, session) => {
        console.info("Auth state changed:", event, session?.user?.id);
        
        clearTimeout(loadingTimeout);
        
        if (session && session.user) {
          try {
            // Get profile data
            const { data: profile, error: profileError } = await supabase!
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) {
              console.error("Error fetching profile:", profileError);
              
              // If profile doesn't exist, create it
              if (profileError.code === 'PGRST116') {
                console.log("Profile doesn't exist on auth state change, creating it...");
                await createInitialProfile(session.user);
              }
            }
            
            // Set user with available data
            setUser({
              id: session.user.id,
              email: session.user.email!,
              full_name: profile?.full_name || session.user.user_metadata?.full_name,
              avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url,
              created_at: session.user.created_at!,
            });
            
            // Automatically navigate to garage on successful authentication
            if (event === 'SIGNED_IN') {
              navigate('/garage');
            }
          } catch (error) {
            console.error("Error processing auth state change:", error);
          }
        } else {
          setUser(null);
          
          // Navigate to home on sign out
          if (event === 'SIGNED_OUT') {
            navigate('/');
          }
        }
        
        setLoading(false);
      }
    );

    // Helper function to create initial profile
    const createInitialProfile = async (user: any) => {
      try {
        const { error } = await supabase!.from('profiles').insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || '')}&background=random`,
          email: user.email,
          badges: ['Nuovo Membro'],
          stats: {
            followers: 0,
            following: 0,
            events: 0,
            roads: 0
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
        if (error) {
          console.error("Error creating initial profile:", error);
          return false;
        }
        
        console.log("Initial profile created successfully for user:", user.id);
        return true;
      } catch (error) {
        console.error("Error creating initial profile:", error);
        return false;
      }
    };

    // Perform initial check
    checkUser();

    return () => {
      subscription?.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, [navigate, toast]);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    if (!isSupabaseAvailable()) {
      toast({
        title: "Errore",
        description: "Supabase non è configurato correttamente.",
        variant: "destructive",
      });
      throw new Error("Supabase non è configurato correttamente.");
    }
    
    try {
      setLoading(true);
      const { error } = await supabase!.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Login effettuato",
        description: "Benvenuto su CarPassionHub!",
      });
      
      // Use a small timeout to ensure state is updated before navigation
      setTimeout(() => {
        navigate('/garage');
      }, 100);
    } catch (error: any) {
      let errorMessage = "Si è verificato un errore durante il login.";
      
      if (error.message === "Invalid login credentials") {
        errorMessage = "Credenziali non valide. Controlla email e password.";
      }
      
      toast({
        title: "Errore di login",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function 
  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseAvailable()) {
      toast({
        title: "Errore",
        description: "Supabase non è configurato correttamente.",
        variant: "destructive",
      });
      throw new Error("Supabase non è configurato correttamente.");
    }
    
    try {
      setLoading(true);
      
      // Controlla che la password sia valida
      if (password.length < 6) {
        throw new Error("La password deve contenere almeno 6 caratteri.");
      }
      
      // Controlla che l'email sia valida
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("L'indirizzo email non è valido.");
      }
      
      // Registra l'utente
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          // Rimuovo l'email verification disabilitandola
          emailRedirectTo: undefined,
        },
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Crea il profilo nella tabella profiles
        await supabase!.from('profiles').insert([
          {
            id: data.user.id,
            full_name: fullName,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
            email: email,
          },
        ]);
        
        // Effettua il login automaticamente dopo la registrazione
        await supabase!.auth.signInWithPassword({
          email,
          password
        });
        
        toast({
          title: "Registrazione completata",
          description: "Il tuo account è stato creato con successo.",
        });
        
        navigate('/garage');
      }
    } catch (error: any) {
      let errorMessage = "Si è verificato un errore durante la registrazione.";
      
      if (error.message.includes("weak_password")) {
        errorMessage = "La password è troppo debole. Deve contenere almeno 6 caratteri.";
      } else if (error.message.includes("email_address_invalid")) {
        errorMessage = "L'indirizzo email non è valido.";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "Questo indirizzo email è già registrato.";
      }
      
      toast({
        title: "Errore di registrazione",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    if (!isSupabaseAvailable()) return;
    
    try {
      setLoading(true);
      await supabase!.auth.signOut();
      toast({
        title: "Logout effettuato",
        description: "Hai effettuato il logout con successo.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante il logout.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!isSupabaseAvailable() || !user) return false; // Return false instead of undefined

    try {
      setLoading(true);
      
      // Aggiorna i metadati dell'utente
      if (data.full_name) {
        await supabase!.auth.updateUser({
          data: { full_name: data.full_name },
        });
      }
      
      // Aggiorna i dati nel profilo
      const { error } = await supabase!
        .from('profiles')
        .update({
          full_name: data.full_name || user.full_name,
          avatar_url: data.avatar_url || user.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Aggiorna lo stato locale
      setUser({ ...user, ...data });
      
      toast({
        title: "Profilo aggiornato",
        description: "Le modifiche al profilo sono state salvate.",
      });
      
      return true; // Add a return value to indicate success
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante l'aggiornamento del profilo.",
        variant: "destructive",
      });
      
      return false; // Add a return value to indicate failure
    } finally {
      setLoading(false); // Make sure loading state is reset
    }
  };

  // Update avatar function
  const updateAvatar = async (url: string) => {
    if (!isSupabaseAvailable() || !user) return;

    try {
      setLoading(true);
      
      // Aggiorna i dati nel profilo
      const { error } = await supabase!
        .from('profiles')
        .update({
          avatar_url: url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Aggiorna lo stato locale
      setUser({ ...user, avatar_url: url });
      
      toast({
        title: "Avatar aggiornato",
        description: "La tua foto profilo è stata aggiornata.",
      });
      
      return;
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante l'aggiornamento dell'avatar.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      updateProfile,
      updateAvatar 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

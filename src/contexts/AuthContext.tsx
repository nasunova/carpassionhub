
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseAvailable } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  created_at: string;
};

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check auth state on initial load
  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("Controllo stato autenticazione iniziale...");
        
        if (!isSupabaseAvailable()) {
          console.log("Supabase non disponibile, saltando controllo autenticazione");
          setLoading(false);
          return;
        }

        const { data: { user: authUser } } = await supabase!.auth.getUser();
        
        console.log("Risposta getUser:", authUser ? "Utente trovato" : "Nessun utente");
        
        if (authUser) {
          try {
            // Get user profile
            const { data: profile } = await supabase!
              .from('profiles')
              .select('*')
              .eq('id', authUser.id)
              .single();
            
            console.log("Profilo trovato:", profile ? "Sì" : "No");
            
            // Set user state
            setUser({
              id: authUser.id,
              email: authUser.email!,
              full_name: profile?.full_name || authUser.user_metadata?.full_name || '',
              avatar_url: profile?.avatar_url || authUser.user_metadata?.avatar_url || '',
              bio: profile?.bio || '',
              location: profile?.location || '',
              created_at: authUser.created_at!,
            });
          } catch (profileError) {
            console.error("Errore nel recupero del profilo:", profileError);
            // Still set basic user info even if profile fetch fails
            setUser({
              id: authUser.id,
              email: authUser.email!,
              full_name: authUser.user_metadata?.full_name || '',
              avatar_url: authUser.user_metadata?.avatar_url || '',
              bio: '',
              location: '',
              created_at: authUser.created_at!,
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Errore nel controllo dell'utente:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change listener
    const setupAuthListener = () => {
      if (!isSupabaseAvailable()) return { unsubscribe: () => {} };
      
      console.log("Configurazione listener cambiamenti autenticazione");
      
      const { data: { subscription } } = supabase!.auth.onAuthStateChange(
        async (event, session) => {
          console.log("Auth state changed:", event, session?.user?.id);
          
          if (session && session.user) {
            try {
              // Get profile on auth state change
              const { data: profile } = await supabase!
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              // Update user state
              setUser({
                id: session.user.id,
                email: session.user.email!,
                full_name: profile?.full_name || session.user.user_metadata?.full_name || '',
                avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url || '',
                bio: profile?.bio || '',
                location: profile?.location || '',
                created_at: session.user.created_at!,
              });
            } catch (profileError) {
              console.error("Errore nel recupero del profilo dopo cambio stato auth:", profileError);
              // Still set basic user info even if profile fetch fails
              setUser({
                id: session.user.id,
                email: session.user.email!,
                full_name: session.user.user_metadata?.full_name || '',
                avatar_url: session.user.user_metadata?.avatar_url || '',
                bio: '',
                location: '',
                created_at: session.user.created_at!,
              });
            }
          } else {
            setUser(null);
          }
        }
      );
      
      return subscription;
    };
    
    // Execute setup
    checkUser();
    const subscription = setupAuthListener();
    
    // Cleanup on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      console.log("Tentativo di login per:", email);
      
      // Sign in
      const { error, data } = await supabase!.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error("Errore autenticazione:", error);
        throw error;
      }
      
      if (!data?.user) {
        console.error("Nessun utente restituito dopo il login");
        throw new Error("Login fallito. Nessun utente restituito.");
      }
      
      console.log("Login completato con successo, ID:", data.user.id);
      
      // Get user profile
      try {
        const { data: profile } = await supabase!
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        console.log("Profilo utente trovato:", profile ? "Sì" : "No");
        
        // Update user state immediately
        setUser({
          id: data.user.id,
          email: data.user.email!,
          full_name: profile?.full_name || data.user.user_metadata?.full_name || '',
          avatar_url: profile?.avatar_url || data.user.user_metadata?.avatar_url || '',
          bio: profile?.bio || '',
          location: profile?.location || '',
          created_at: data.user.created_at!,
        });
      } catch (profileError) {
        console.error("Errore nel recupero del profilo dopo login:", profileError);
        // Set basic user info even if profile fetch fails
        setUser({
          id: data.user.id,
          email: data.user.email!,
          full_name: data.user.user_metadata?.full_name || '',
          avatar_url: data.user.user_metadata?.avatar_url || '',
          bio: '',
          location: '',
          created_at: data.user.created_at!,
        });
      }
      
      toast({
        title: "Login effettuato",
        description: "Benvenuto su CarPassionHub!",
      });
      
      // Navigate immediately after login
      navigate('/garage');
    } catch (error: any) {
      console.error("Errore di login:", error);
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
    }
  };

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
      console.log("Tentativo di registrazione per:", email);
      
      // Validate credentials
      if (password.length < 6) {
        throw new Error("La password deve contenere almeno 6 caratteri.");
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("L'indirizzo email non è valido.");
      }
      
      // Sign up
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: undefined,
        },
      });
      
      if (error) {
        console.error("Errore registrazione:", error);
        throw error;
      }
      
      if (data.user) {
        console.log("Registrazione completata, creazione profilo per ID:", data.user.id);
        
        // Create profile
        try {
          await supabase!.from('profiles').insert([
            {
              id: data.user.id,
              full_name: fullName,
              avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
              email: email,
            },
          ]);
          
          console.log("Profilo creato, effettuo login automatico");
        } catch (profileError) {
          console.error("Errore nella creazione del profilo:", profileError);
          // Continue with sign-in even if profile creation fails
        }
        
        // Sign in automatically after registration
        try {
          const { error: loginError, data: loginData } = await supabase!.auth.signInWithPassword({
            email,
            password
          });
          
          if (loginError) {
            console.error("Errore login post-registrazione:", loginError);
            throw loginError;
          }
          
          console.log("Login automatico completato");
          
          // Set user immediately
          setUser({
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
            bio: '',
            location: '',
            created_at: data.user.created_at!,
          });
          
          toast({
            title: "Registrazione completata",
            description: "Il tuo account è stato creato con successo.",
          });
          
          // Navigate to garage
          navigate('/garage');
        } catch (signInError) {
          console.error("Errore nel login automatico post-registrazione:", signInError);
          toast({
            title: "Account creato",
            description: "Il tuo account è stato creato. Effettua il login.",
          });
        }
      }
    } catch (error: any) {
      console.error("Errore di registrazione:", error);
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
    }
  };

  const signOut = async () => {
    if (!isSupabaseAvailable()) return;
    
    try {
      console.log("Tentativo di logout...");
      await supabase!.auth.signOut();
      setUser(null); // Ensure user state is cleared
      toast({
        title: "Logout effettuato",
        description: "Hai effettuato il logout con successo.",
      });
      navigate('/');
    } catch (error: any) {
      console.error("Errore durante il logout:", error);
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante il logout.",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!isSupabaseAvailable() || !user) {
      throw new Error("Supabase non è configurato correttamente o utente non autenticato");
    }

    try {
      console.log("Aggiornamento profilo per utente:", user.id);
      
      // Update user metadata if name changed
      if (data.full_name) {
        try {
          const { error: authError } = await supabase!.auth.updateUser({
            data: { full_name: data.full_name },
          });
          
          if (authError) {
            console.error("Errore nell'aggiornamento dei metadati:", authError);
          }
        } catch (authUpdateError) {
          console.error("Eccezione durante l'aggiornamento dei metadati:", authUpdateError);
        }
      }
      
      // Prepare profile update data
      const updateData: Partial<UserProfile> = {};
      
      if (data.full_name !== undefined) updateData.full_name = data.full_name;
      if (data.avatar_url !== undefined) updateData.avatar_url = data.avatar_url;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.location !== undefined) updateData.location = data.location;
      
      // Update profile
      try {
        const { error } = await supabase!
          .from('profiles')
          .update(updateData)
          .eq('id', user.id);
        
        if (error) {
          console.error("Errore nell'aggiornamento del profilo:", error);
          throw error;
        }
        
        console.log("Profilo aggiornato con successo");
      } catch (profileUpdateError) {
        console.error("Eccezione durante l'aggiornamento del profilo:", profileUpdateError);
        throw profileUpdateError;
      }
      
      // Update local user state
      setUser(prevUser => {
        if (!prevUser) return null;
        return { ...prevUser, ...updateData };
      });
      
      toast({
        title: "Profilo aggiornato",
        description: "Il tuo profilo è stato aggiornato con successo.",
      });
      
    } catch (error: any) {
      console.error("Errore nell'aggiornamento del profilo:", error);
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante l'aggiornamento del profilo.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const contextValue = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve essere usato all\'interno di un AuthProvider');
  }
  return context;
};


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

  useEffect(() => {
    if (!isSupabaseAvailable()) {
      setLoading(false);
      return;
    }

    // Controlla se l'utente è già autenticato
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase!.auth.getUser();
        
        if (user) {
          // Ottieni i dati del profilo
          const { data: profile } = await supabase!
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          setUser({
            id: user.id,
            email: user.email!,
            full_name: profile?.full_name || user.user_metadata?.full_name,
            avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
            created_at: user.created_at!,
          });
        }
      } catch (error) {
        console.error('Errore nel controllo dell\'utente:', error);
      } finally {
        setLoading(false);
      }
    };

    // Configura il listener per i cambiamenti di autenticazione
    const { data: { subscription } } = supabase!.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          // Ottieni i dati del profilo
          const { data: profile } = await supabase!
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          setUser({
            id: session.user.id,
            email: session.user.email!,
            full_name: profile?.full_name || session.user.user_metadata?.full_name,
            avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at!,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    checkUser();

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
      setLoading(true);
      const { error } = await supabase!.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Login effettuato",
        description: "Benvenuto su CarPassionHub!",
      });
      
      navigate('/garage');
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

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!isSupabaseAvailable() || !user) {
      throw new Error("Supabase non è configurato correttamente o utente non autenticato");
    }

    try {
      setLoading(true);
      
      // Aggiorna i metadati dell'utente se è stato modificato il nome
      if (data.full_name) {
        const { error: authError } = await supabase!.auth.updateUser({
          data: { full_name: data.full_name },
        });
        
        if (authError) throw authError;
      }
      
      // Prepara i dati da aggiornare nel profilo
      const updateData: Partial<UserProfile> = {};
      
      // Aggiungi solo i campi che sono stati forniti
      if (data.full_name !== undefined) updateData.full_name = data.full_name;
      if (data.avatar_url !== undefined) updateData.avatar_url = data.avatar_url;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.location !== undefined) updateData.location = data.location;
      
      // Aggiorna i dati nel profilo
      const { error } = await supabase!
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Aggiorna lo stato locale con i nuovi dati
      setUser(prevUser => {
        if (!prevUser) return null;
        return { ...prevUser, ...updateData };
      });
      
      console.log("Profilo aggiornato con successo:", updateData);
      
    } catch (error: any) {
      console.error("Errore nell'aggiornamento del profilo:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
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


import { useState, useEffect } from 'react';
import { useAuth, UserProfile } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase, isSupabaseAvailable } from '@/lib/supabase';

type EditProfileFormProps = {
  onCancel: () => void;
  initialData?: {
    full_name?: string;
    bio?: string;
    location?: string;
  };
};

const EditProfileForm = ({ onCancel, initialData }: EditProfileFormProps) => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profilesTableExists, setProfilesTableExists] = useState(true);
  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || user?.full_name || '',
    bio: initialData?.bio || '',
    location: initialData?.location || '',
    avatar_url: user?.avatar_url || '',
  });

  // Verifica se la tabella profiles esiste
  useEffect(() => {
    const checkProfilesTable = async () => {
      if (!isSupabaseAvailable() || !supabase) return;
      
      try {
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .eq('table_name', 'profiles');
        
        if (error) {
          console.error('Errore nella verifica della tabella profiles:', error);
          setProfilesTableExists(false);
          return;
        }
        
        setProfilesTableExists(data && data.length > 0);
      } catch (error) {
        console.error('Errore nella verifica della tabella profiles:', error);
        setProfilesTableExists(false);
      }
    };
    
    checkProfilesTable();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!profilesTableExists) {
        toast({
          title: "Avviso",
          description: "La tabella profiles non esiste. I dati verranno salvati solo nei metadati utente.",
        });
      }
      
      await updateProfile({
        ...formData as Partial<UserProfile>,
      });
      
      toast({
        title: "Profilo aggiornato",
        description: "Le modifiche al profilo sono state salvate con successo.",
      });
      
      onCancel(); // Chiude il form dopo il salvataggio
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante l'aggiornamento del profilo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAvatarUrl = () => {
    if (!formData.full_name) return;
    const newAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name)}&background=random`;
    setFormData(prev => ({ ...prev, avatar_url: newAvatarUrl }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!profilesTableExists && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-3 mb-4">
          <p className="text-sm">
            La tabella "profiles" non è stata rilevata nel tuo database Supabase. 
            Le modifiche al profilo potrebbero non essere salvate correttamente.
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="full_name">Nome completo</Label>
        <Input
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Il tuo nome completo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Località</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Es. Milano, Italia"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Raccontaci qualcosa di te e della tua passione per le auto..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar_url">URL Avatar</Label>
        <div className="flex space-x-2">
          <Input
            id="avatar_url"
            name="avatar_url"
            value={formData.avatar_url}
            onChange={handleChange}
            placeholder="URL dell'immagine del profilo"
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={generateAvatarUrl}
            disabled={!formData.full_name}
          >
            Genera
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Lascia vuoto per usare l'avatar predefinito o clicca "Genera" per crearne uno basato sul tuo nome
        </p>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Annulla
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvataggio..." : "Salva modifiche"}
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;

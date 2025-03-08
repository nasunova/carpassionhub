
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

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
  
  // Initialize with fallbacks to avoid null/undefined issues
  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || user?.full_name || '',
    bio: initialData?.bio || user?.bio || '',
    location: initialData?.location || user?.location || '',
    avatar_url: user?.avatar_url || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per modificare il profilo.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      await updateProfile({
        full_name: formData.full_name,
        bio: formData.bio,
        location: formData.location,
        avatar_url: formData.avatar_url,
      });
      
      toast({
        title: "Profilo aggiornato",
        description: "Le modifiche al profilo sono state salvate con successo.",
      });
      
      onCancel(); // Chiude il form dopo il salvataggio
    } catch (error: any) {
      console.error("Errore durante l'aggiornamento del profilo:", error);
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

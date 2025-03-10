
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Image, Video, MapPin, Car, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPost, NewPost } from "@/lib/post-service";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface CreatePostModalProps {
  onPostCreated?: () => void;
}

const CreatePostModal = ({ onPostCreated }: CreatePostModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Recupera i dati dell'utente corrente
  useEffect(() => {
    const getCurrentUser = async () => {
      if (!supabase) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        
        // Ottieni i dati del profilo
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();
          
        if (profileData) {
          setUserName(profileData.full_name || user.email?.split('@')[0] || 'Utente');
          setUserAvatar(profileData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`);
        }
      }
    };
    
    getCurrentUser();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if ((file.type.startsWith("image/") || file.type.startsWith("video/")) && file.size <= 50_000_000) {
        setMediaFile(file);
      } else {
        toast({
          title: "File non valido",
          description: "Seleziona un'immagine o un video (max 50MB)",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!mediaFile) {
      toast({
        title: "Media richiesto",
        description: "Seleziona un'immagine o un video per il post",
        variant: "destructive",
      });
      return;
    }

    if (!userId) {
      toast({
        title: "Accesso richiesto",
        description: "Devi effettuare l'accesso per creare un post",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsLoading(true);

    try {
      const newPost: NewPost = {
        description,
        location: location || undefined,
        carId: selectedCar || undefined,
        mediaFile
      };
      
      const result = await createPost(newPost, userId, userName, userAvatar);
      
      if (result) {
        toast({
          title: "Post creato",
          description: "Il tuo post è stato pubblicato con successo",
        });
        
        setIsOpen(false);
        if (onPostCreated) onPostCreated();
      } else {
        throw new Error("Errore durante la creazione del post");
      }
    } catch (error) {
      console.error("Errore creazione post:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione del post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setDescription("");
    setLocation("");
    setSelectedCar(null);
    setMediaFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 rounded-full">
          <Plus className="w-5 h-5" /> Crea Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crea nuovo post</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex justify-center">
            <AnimatePresence>
              {mediaFile ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative"
                >
                  {mediaFile.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(mediaFile)}
                      alt="Preview"
                      className="max-h-[200px] rounded-lg object-cover"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(mediaFile)}
                      className="max-h-[200px] rounded-lg"
                      controls
                    />
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => setMediaFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,video/*"
                    className="hidden"
                  />
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Image className="w-4 h-4" />
                      Immagine
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Video className="w-4 h-4" />
                      Video
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid gap-2">
            <Textarea
              placeholder="Descrivi il tuo post..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <Input
              placeholder="Aggiungi luogo"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
              icon={<MapPin className="w-4 h-4" />}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annulla
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !mediaFile}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Pubblicazione...
              </>
            ) : (
              "Pubblica"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;

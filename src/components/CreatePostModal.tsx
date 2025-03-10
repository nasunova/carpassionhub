
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Image, Video, MapPin, Car, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

    setIsLoading(true);

    try {
      // TODO: Implement post creation logic with Supabase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Placeholder
      
      toast({
        title: "Post creato",
        description: "Il tuo post è stato pubblicato con successo",
      });
      
      setIsOpen(false);
      onPostCreated?.();
    } catch (error) {
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
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => {/* TODO: Implement location picker */}}
            >
              <MapPin className="w-4 h-4" />
              {location || "Aggiungi luogo"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => {/* TODO: Implement car selector */}}
            >
              <Car className="w-4 h-4" />
              {selectedCar || "Collega auto"}
            </Button>
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

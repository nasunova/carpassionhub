
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Car } from "@/components/CarCard";
import { Loader2 } from "lucide-react";

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCarAdded: (car: Car) => void;
}

const AddCarModal = ({ isOpen, onClose, onCarAdded }: AddCarModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [carData, setCarData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    image: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCarData((prev) => ({
      ...prev,
      [name]: name === "year" ? parseInt(value) || new Date().getFullYear() : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!carData.make || !carData.model || !carData.image) {
      toast({
        title: "Campi mancanti",
        description: "Compila tutti i campi obbligatori.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get user info
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Errore",
          description: "Devi essere loggato per aggiungere un'auto.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Insert car into database
      const { data, error } = await supabase
        .from("cars")
        .insert([
          {
            make: carData.make,
            model: carData.model,
            year: carData.year,
            image: carData.image,
            description: carData.description,
            owner_id: user.id,
            owner_name: user.user_metadata.full_name || "Utente",
            owner_avatar: user.user_metadata.avatar_url || "https://randomuser.me/api/portraits/men/32.jpg",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Format car for UI
      const newCar: Car = {
        id: data.id,
        make: data.make,
        model: data.model,
        year: data.year,
        image: data.image,
        description: data.description,
        ownerName: data.owner_name,
        ownerAvatar: data.owner_avatar,
        likes: 0,
        comments: 0,
      };

      toast({
        title: "Auto aggiunta!",
        description: `${carData.make} ${carData.model} è stata aggiunta al tuo garage.`,
      });

      onCarAdded(newCar);
      onClose();
    } catch (error) {
      console.error("Error adding car:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiunta dell'auto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Aggiungi Auto al Garage</DialogTitle>
          <DialogDescription>
            Inserisci i dettagli della tua auto per aggiungerla al tuo garage virtuale.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="make" className="text-right">
                Marca*
              </Label>
              <Input
                id="make"
                name="make"
                value={carData.make}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Modello*
              </Label>
              <Input
                id="model"
                name="model"
                value={carData.model}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year" className="text-right">
                Anno
              </Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={carData.year}
                onChange={handleInputChange}
                className="col-span-3"
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                URL Immagine*
              </Label>
              <Input
                id="image"
                name="image"
                value={carData.image}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="https://esempio.com/immagine.jpg"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrizione
              </Label>
              <Textarea
                id="description"
                name="description"
                value={carData.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annulla
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                "Aggiungi Auto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCarModal;

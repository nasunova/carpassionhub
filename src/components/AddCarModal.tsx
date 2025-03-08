
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase, isSupabaseAvailable } from "@/lib/supabase";
import { Car } from "@/components/CarCard";
import { Loader2, AlertTriangle, X, Plus } from "lucide-react";

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCarAdded: (car: any) => void;
}

const AddCarModal = ({ isOpen, onClose, onCarAdded }: AddCarModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    images: [""],
    description: "",
    power: "",
    engine: "",
    transmission: "Manuale",
    drivetrain: "RWD"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? parseInt(value) || new Date().getFullYear() : value,
    }));
  };

  const handleImageChange = (value: string, index: number) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length <= 1) return;
    
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseAvailable()) {
      toast({
        title: "Configurazione mancante",
        description: "L'accesso a Supabase non è configurato correttamente.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.make || !formData.model || formData.images.some(img => !img.trim())) {
      toast({
        title: "Campi mancanti",
        description: "Compila tutti i campi obbligatori inclusi gli URL delle immagini.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get user info
      const { data: { user } } = await supabase!.auth.getUser();
      
      if (!user) {
        toast({
          title: "Errore",
          description: "Devi essere loggato per aggiungere un'auto.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Inserisci la prima immagine come immagine principale nell'auto
      const { data: newCarData, error: carError } = await supabase!
        .from("cars")
        .insert([
          {
            make: formData.make,
            model: formData.model,
            year: formData.year,
            description: formData.description,
            owner_id: user.id,
            owner_name: user.user_metadata.full_name || "Utente",
            owner_avatar: user.user_metadata.avatar_url || "https://randomuser.me/api/portraits/men/32.jpg",
            image: formData.images[0] // Usa la prima immagine come principale
          },
        ])
        .select()
        .single();

      if (carError) throw carError;

      // Se ci sono più immagini, aggiungiamole alla tabella car_images
      if (formData.images.length > 1) {
        const additionalImages = formData.images.slice(1).map(imgUrl => ({
          car_id: newCarData.id,
          image_url: imgUrl,
          created_at: new Date().toISOString()
        }));
        
        if (additionalImages.length > 0) {
          // Inserisci le immagini aggiuntive nella tabella car_images
          const { error: imagesError } = await supabase!
            .from("car_images")
            .insert(additionalImages);
          
          if (imagesError) console.error("Errore inserimento immagini aggiuntive:", imagesError);
        }
      }

      toast({
        title: "Auto aggiunta!",
        description: `${formData.make} ${formData.model} è stata aggiunta al tuo garage.`,
      });

      // Aggiungi le informazioni sulle specifiche all'auto restituita prima di passarla al componente padre
      const carWithSpecs = {
        ...newCarData,
        images: formData.images, // Passa tutte le immagini
        specs: {
          power: formData.power || 'N/A',
          engine: formData.engine || 'N/A',
          transmission: formData.transmission || 'Manuale',
          drivetrain: formData.drivetrain || 'RWD'
        }
      };

      onCarAdded(carWithSpecs);
      
      // Reset form
      setFormData({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        images: [""],
        description: "",
        power: "",
        engine: "",
        transmission: "Manuale",
        drivetrain: "RWD"
      });
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Aggiungi Auto al Garage</DialogTitle>
          <DialogDescription>
            Inserisci i dettagli della tua auto per aggiungerla al tuo garage virtuale.
          </DialogDescription>
        </DialogHeader>
        
        {!isSupabaseAvailable() ? (
          <div className="py-4 text-center">
            <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
            <h3 className="font-medium mb-2">Configurazione Supabase mancante</h3>
            <p className="text-sm text-muted-foreground">
              Le variabili d'ambiente per Supabase non sono configurate correttamente.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="make" className="text-right">
                  Marca*
                </Label>
                <Input
                  id="make"
                  name="make"
                  value={formData.make}
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
                  value={formData.model}
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
                  value={formData.year}
                  onChange={handleInputChange}
                  className="col-span-3"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>
              
              {/* Multiple Images Section */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">
                  URL Immagini*
                </Label>
                <div className="col-span-3 space-y-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={image}
                        onChange={(e) => handleImageChange(e.target.value, index)}
                        className="flex-1"
                        placeholder="https://esempio.com/immagine.jpg"
                        required
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        disabled={formData.images.length <= 1}
                        onClick={() => removeImageField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addImageField}
                    className="mt-1"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Aggiungi altra immagine
                  </Button>
                </div>
              </div>
              
              {/* Additional car details */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="engine" className="text-right">
                  Motore
                </Label>
                <Input
                  id="engine"
                  name="engine"
                  value={formData.engine}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="es. V8 4.0L"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="power" className="text-right">
                  Potenza
                </Label>
                <Input
                  id="power"
                  name="power"
                  value={formData.power}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="es. 450 CV"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transmission" className="text-right">
                  Trasmissione
                </Label>
                <select
                  id="transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="Manuale">Manuale</option>
                  <option value="Automatica">Automatica</option>
                  <option value="Sequenziale">Sequenziale</option>
                  <option value="CVT">CVT</option>
                  <option value="DCT">DCT (Doppia frizione)</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="drivetrain" className="text-right">
                  Trazione
                </Label>
                <select
                  id="drivetrain"
                  name="drivetrain"
                  value={formData.drivetrain}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="RWD">Posteriore (RWD)</option>
                  <option value="FWD">Anteriore (FWD)</option>
                  <option value="AWD">Integrale (AWD)</option>
                  <option value="4WD">4x4</option>
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descrizione
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddCarModal;

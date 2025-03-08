
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase, isSupabaseAvailable } from "@/lib/supabase";
import { Car } from "@/components/CarCard";
import { Loader2, AlertTriangle } from "lucide-react";

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCarAdded: (car: any) => void;
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
    power: "",
    engine: "",
    transmission: "Manuale",
    drivetrain: "RWD"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCarData((prev) => ({
      ...prev,
      [name]: name === "year" ? parseInt(value) || new Date().getFullYear() : value,
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

      // Insert car into database
      const { data: carData, error: carError } = await supabase!
        .from("cars")
        .insert([
          {
            make: carData.make,
            model: carData.model,
            year: carData.year,
            description: carData.description,
            power: carData.power,
            engine: carData.engine,
            transmission: carData.transmission,
            drivetrain: carData.drivetrain,
            owner_id: user.id,
            owner_name: user.user_metadata.full_name || "Utente",
            owner_avatar: user.user_metadata.avatar_url || "https://randomuser.me/api/portraits/men/32.jpg",
          },
        ])
        .select()
        .single();

      if (carError) throw carError;
      
      // Add the image to car_images
      const { error: imageError } = await supabase!
        .from("car_images")
        .insert([
          {
            car_id: carData.id,
            image_url: carData.image,
            is_primary: true
          },
        ]);
        
      if (imageError) {
        console.error('Error adding car image:', imageError);
        // We'll continue even if image insertion fails
      }

      toast({
        title: "Auto aggiunta!",
        description: `${carData.make} ${carData.model} è stata aggiunta al tuo garage.`,
      });

      onCarAdded({
        ...carData,
        image: carData.image
      });
      
      // Reset form
      setCarData({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        image: "",
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
              
              {/* Additional car details */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="engine" className="text-right">
                  Motore
                </Label>
                <Input
                  id="engine"
                  name="engine"
                  value={carData.engine}
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
                  value={carData.power}
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
                  value={carData.transmission}
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
                  value={carData.drivetrain}
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddCarModal;

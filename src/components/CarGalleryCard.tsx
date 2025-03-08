
import React, { useState, useEffect } from 'react';
import { BlurredCard } from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Plus, X, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export interface CarGallery {
  id: string | number;
  make: string;
  model: string;
  year: number;
  images: string[];
  specs: {
    power: string;
    engine: string;
    transmission: string;
    drivetrain: string;
  }
}

interface CarGalleryCardProps {
  car: CarGallery;
  onDelete?: (carId: string | number) => void;
  editable?: boolean;
}

const CarGalleryCard = ({ car, onDelete, editable = true }: CarGalleryCardProps) => {
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAddPhotoForm, setShowAddPhotoForm] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Assicuriamoci che car.images sia sempre un array
  useEffect(() => {
    if (!car.images) {
      car.images = [];
    } else if (!Array.isArray(car.images)) {
      // Se è una stringa singola, convertiamola in array
      car.images = [car.images as unknown as string];
    }
  }, [car]);

  const nextImage = () => {
    if (car.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    if (car.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPhotoUrl.trim()) {
      toast({
        title: "URL richiesto",
        description: "Inserisci un URL valido per l'immagine",
        variant: "destructive",
      });
      return;
    }

    try {
      // Per le auto memorizzate nel database, aggiorna in Supabase
      if (typeof car.id === 'string') {
        const { error } = await supabase!
          .from("car_images")
          .insert([{ 
            car_id: car.id, 
            image_url: newPhotoUrl,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
      }

      // Aggiorna l'oggetto auto locale
      car.images.push(newPhotoUrl);
      
      toast({
        title: "Immagine aggiunta",
        description: "La nuova immagine è stata aggiunta alla galleria",
      });
      
      setNewPhotoUrl('');
      setShowAddPhotoForm(false);
    } catch (error) {
      console.error("Error adding photo:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiungere l'immagine",
        variant: "destructive",
      });
    }
  };

  const handleDeletePhoto = async (index: number) => {
    // Non permettere di eliminare l'unica immagine
    if (car.images.length <= 1) {
      toast({
        title: "Operazione non permessa",
        description: "Devi mantenere almeno un'immagine per l'auto",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const imageUrl = car.images[index];
      
      // Se l'auto è memorizzata nel database, elimina l'immagine da Supabase
      if (typeof car.id === 'string' && index > 0) { // Le immagini dopo la prima sono in car_images
        const { error } = await supabase!
          .from("car_images")
          .delete()
          .eq("car_id", car.id)
          .eq("image_url", imageUrl);

        if (error) throw error;
      }
      
      // Aggiorna l'array locale di immagini
      car.images = car.images.filter((_, i) => i !== index);
      
      // Se eliminiamo l'immagine corrente, aggiorniamo l'indice
      if (index === currentImageIndex) {
        setCurrentImageIndex(0);
      } else if (index < currentImageIndex) {
        setCurrentImageIndex(prev => prev - 1);
      }
      
      toast({
        title: "Immagine eliminata",
        description: "L'immagine è stata rimossa dalla galleria",
      });
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare l'immagine",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCar = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      if (typeof car.id === 'string') {
        // Elimina prima tutte le immagini associate all'auto
        const { error: imagesError } = await supabase!
          .from("car_images")
          .delete()
          .eq("car_id", car.id);
          
        if (imagesError) {
          console.error("Error deleting car images:", imagesError);
        }
        
        // Poi elimina l'auto dal database
        const { error } = await supabase!
          .from("cars")
          .delete()
          .eq("id", car.id);

        if (error) throw error;
      }
      
      onDelete(car.id);
      
      toast({
        title: "Auto rimossa",
        description: `${car.make} ${car.model} è stata rimossa dal tuo garage`,
      });
    } catch (error) {
      console.error("Error deleting car:", error);
      toast({
        title: "Errore",
        description: "Impossibile rimuovere l'auto",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <BlurredCard className="overflow-hidden hover:shadow-lg transition-all">
      <div className="relative h-48 overflow-hidden">
        {car.images && car.images.length > 0 ? (
          <>
            <img 
              src={car.images[currentImageIndex]} 
              alt={`${car.make} ${car.model}`} 
              className="w-full h-full object-cover"
            />
            {editable && (
              <button
                onClick={() => handleDeletePhoto(currentImageIndex)}
                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                aria-label="Elimina foto"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <p className="text-muted-foreground">Nessuna immagine</p>
          </div>
        )}
        
        {car.images && car.images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
              aria-label="Foto precedente"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
              aria-label="Foto successiva"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
        
        {car.images && car.images.length > 0 && (
          <div className="absolute bottom-2 right-2 flex space-x-1">
            {car.images.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'} cursor-pointer`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold">{car.make} {car.model}</h3>
        <p className="text-muted-foreground">{car.year}</p>
        
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Motore</p>
            <p className="text-sm font-medium">{car.specs.engine}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Potenza</p>
            <p className="text-sm font-medium">{car.specs.power}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Trasmissione</p>
            <p className="text-sm font-medium">{car.specs.transmission}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Trazione</p>
            <p className="text-sm font-medium">{car.specs.drivetrain}</p>
          </div>
        </div>
        
        {editable && (
          <div className="mt-4 flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAddPhotoForm(!showAddPhotoForm)}
              className="flex items-center gap-1"
            >
              {showAddPhotoForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showAddPhotoForm ? 'Annulla' : 'Aggiungi Foto'}
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" /> Modifica
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteCar}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Rimuovi
              </Button>
            </div>
          </div>
        )}
        
        {showAddPhotoForm && (
          <form onSubmit={handleAddPhoto} className="mt-4 p-3 bg-muted/50 rounded-md">
            <Label htmlFor={`photo-url-${car.id}`} className="mb-2 block">URL Immagine</Label>
            <div className="flex gap-2">
              <Input
                id={`photo-url-${car.id}`}
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="https://esempio.com/mia-foto.jpg"
                required
                className="flex-1"
              />
              <Button type="submit" size="sm">Aggiungi</Button>
            </div>
          </form>
        )}
      </div>
    </BlurredCard>
  );
};

export default CarGalleryCard;

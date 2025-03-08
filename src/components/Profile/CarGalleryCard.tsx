
import React, { useState } from 'react';
import { BlurredCard } from '@/components/ui/BlurredCard';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  images: string[];
  specs: {
    power: string;
    engine: string;
    transmission: string;
    drivetrain: string;
  };
};

const CarGalleryCard = ({ car }: { car: Car }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAddPhotoForm, setShowAddPhotoForm] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call to update the car's images
    console.log("Adding photo URL:", newPhotoUrl);
    setNewPhotoUrl('');
    setShowAddPhotoForm(false);
  };

  return (
    <BlurredCard className="overflow-hidden hover:shadow-lg transition-all">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={car.images[currentImageIndex]} 
          alt={`${car.make} ${car.model}`} 
          className="w-full h-full object-cover"
        />
        
        {car.images.length > 1 && (
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
        
        <div className="absolute bottom-2 right-2 flex space-x-1">
          {car.images.map((_, index: number) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
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
          <Button variant="outline" size="sm">Dettagli</Button>
        </div>
        
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

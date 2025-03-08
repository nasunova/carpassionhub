
import CarGalleryCard from './CarGalleryCard';
import { Button } from '@/components/ui/button';

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

type GarageSectionProps = {
  cars: Car[];
};

const GarageSection = ({ cars }: GarageSectionProps) => {
  return (
    <div className="space-y-4">
      {cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cars.map(car => (
            <CarGalleryCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center p-8">
          <p className="text-muted-foreground">Il tuo garage è vuoto. Aggiungi la tua prima auto!</p>
          <Button className="mt-4">Aggiungi Auto</Button>
        </div>
      )}
      <div className="flex justify-center mt-6">
        <Button>Aggiungi Nuova Auto</Button>
      </div>
    </div>
  );
};

export default GarageSection;


import { BlurredCard } from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';

type Road = {
  id: number;
  name: string;
  location: string;
  rating: number;
  image: string;
  review: string;
};

const RoadCard = ({ road }: { road: Road }) => {
  return (
    <BlurredCard key={road.id} className="overflow-hidden hover:shadow-lg transition-all">
      <div className="h-40 overflow-hidden">
        <img 
          src={road.image} 
          alt={road.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{road.name}</h3>
            <p className="text-muted-foreground">{road.location}</p>
          </div>
          <div className="flex items-center">
            <span className="text-amber-500 mr-1">★</span>
            <span>{road.rating}/5</span>
          </div>
        </div>
        
        <p className="mt-2 text-sm italic">"{road.review}"</p>
        
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">Dettagli</Button>
        </div>
      </div>
    </BlurredCard>
  );
};

export default RoadCard;

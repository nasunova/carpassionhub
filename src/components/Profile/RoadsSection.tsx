
import RoadCard from './RoadCard';
import { Button } from '@/components/ui/button';

type Road = {
  id: number;
  name: string;
  location: string;
  rating: number;
  image: string;
  review: string;
};

type RoadsSectionProps = {
  roads: Road[];
};

const RoadsSection = ({ roads }: RoadsSectionProps) => {
  return (
    <div className="space-y-4">
      {roads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roads.map(road => (
            <RoadCard key={road.id} road={road} />
          ))}
        </div>
      ) : (
        <div className="text-center p-8">
          <p className="text-muted-foreground">Non hai ancora valutato nessuna strada.</p>
          <Button className="mt-4">Scopri Strade</Button>
        </div>
      )}
    </div>
  );
};

export default RoadsSection;

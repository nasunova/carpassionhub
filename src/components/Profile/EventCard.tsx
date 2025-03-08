
import { BlurredCard } from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  status: string;
};

const EventCard = ({ event }: { event: Event }) => {
  return (
    <BlurredCard key={event.id} className="overflow-hidden hover:shadow-lg transition-all">
      <div className="h-40 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{event.title}</h3>
            <p className="text-muted-foreground">{event.date}</p>
            <p className="text-sm mt-1">{event.location}</p>
          </div>
          <Badge variant={event.status === 'Organizzato' ? 'default' : 'outline'}>
            {event.status}
          </Badge>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">Dettagli</Button>
        </div>
      </div>
    </BlurredCard>
  );
};

export default EventCard;

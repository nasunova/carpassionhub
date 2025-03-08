
import EventCard from './EventCard';
import { Button } from '@/components/ui/button';

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  status: string;
};

type EventsSectionProps = {
  events: Event[];
};

const EventsSection = ({ events }: EventsSectionProps) => {
  return (
    <div className="space-y-4">
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center p-8">
          <p className="text-muted-foreground">Non ti sei ancora registrato a nessun evento.</p>
          <Button className="mt-4">Esplora Eventi</Button>
        </div>
      )}
    </div>
  );
};

export default EventsSection;

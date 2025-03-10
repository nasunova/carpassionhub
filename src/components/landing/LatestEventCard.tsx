
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BlurredCard } from "@/components/ui/BlurredCard";

export interface LatestEvent {
  id: string;
  title: string;
  date: string;
  image: string;
  organizer: string;
  addedAt: string;
}

interface LatestEventCardProps {
  event: LatestEvent;
  index: number;
}

const LatestEventCard = ({ event, index }: LatestEventCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <BlurredCard variant="interactive" className="h-full overflow-hidden">
        <div className="relative h-48">
          <img 
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <h4 className="text-white font-semibold">{event.title}</h4>
            <p className="text-white/80 text-sm">{event.date}</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              Organizzato da: <span className="font-medium">{event.organizer}</span>
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {event.addedAt}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/events`}>Dettagli</Link>
            </Button>
          </div>
        </div>
      </BlurredCard>
    </motion.div>
  );
};

export default LatestEventCard;

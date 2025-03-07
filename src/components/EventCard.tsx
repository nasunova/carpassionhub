
import { CalendarDays, MapPin, Users, ExternalLink } from "lucide-react";
import { BlurredCard } from "./ui/BlurredCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  participants: number;
  maxParticipants?: number;
  registrationUrl: string;
  tags: string[];
}

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const parsedDate = new Date(event.date);
  const formattedDate = parsedDate.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  
  const isAlmostFull = event.maxParticipants && event.participants >= event.maxParticipants * 0.8;

  return (
    <BlurredCard variant="default" className="h-full flex flex-col overflow-hidden">
      <div className="relative aspect-video overflow-hidden rounded-t-lg">
        <img
          src={event.image}
          alt={event.title}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-0 left-0 m-3">
          <Badge variant="default" className="bg-racing-red text-white font-semibold">
            {new Date(event.date).toLocaleDateString("it-IT", { month: "short", day: "numeric" })}
          </Badge>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col p-5">
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4 mr-2 text-racing-red" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2 text-racing-red" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-2 text-racing-red" />
            <span>
              {event.participants} partecipanti
              {event.maxParticipants && ` / ${event.maxParticipants} posti`}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {event.description}
        </p>
        
        <div className="flex flex-wrap gap-2 my-3">
          {event.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="mt-auto pt-4">
          <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                className="w-full rounded-full group overflow-hidden relative" 
                variant={isAlmostFull ? "destructive" : "default"}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isAlmostFull ? "Ultimi posti!" : "Prenota ora"} 
                  <ExternalLink className="w-4 h-4 ml-2" />
                </span>
                <span className="absolute inset-0 button-shine group-hover:animate-shine"></span>
              </Button>
            </motion.div>
          </a>
        </div>
      </div>
    </BlurredCard>
  );
};

export default EventCard;

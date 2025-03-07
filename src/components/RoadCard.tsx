
import { Star, MapPin, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { BlurredCard } from "./ui/BlurredCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export interface Road {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  length: string;
  difficulty: "Facile" | "Medio" | "Difficile";
  likes: number;
  dislikes: number;
  comments: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface RoadCardProps {
  road: Road;
  onClick?: () => void;
}

const RoadCard = ({ road, onClick }: RoadCardProps) => {
  const difficultyColor = {
    Facile: "text-green-500",
    Medio: "text-amber-500",
    Difficile: "text-racing-red",
  };

  return (
    <BlurredCard 
      variant="interactive" 
      className="h-full flex flex-col overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
        <img
          src={road.image}
          alt={road.name}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-0 right-0 m-3 flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(road.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col p-5">
        <h3 className="text-xl font-bold mb-1">{road.name}</h3>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 mr-2 text-racing-red" />
          <span>{road.location}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-muted rounded-md p-2 text-center">
            <div className="text-xs text-muted-foreground">Lunghezza</div>
            <div className="font-medium">{road.length}</div>
          </div>
          <div className="bg-muted rounded-md p-2 text-center">
            <div className="text-xs text-muted-foreground">Difficoltà</div>
            <div className={`font-medium ${difficultyColor[road.difficulty]}`}>
              {road.difficulty}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {road.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-muted">
          <div className="flex space-x-4">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              <span>{road.likes}</span>
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ThumbsDown className="w-4 h-4 mr-1" />
              <span>{road.dislikes}</span>
            </motion.button>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MessageSquare className="w-4 h-4 mr-1" />
            <span>{road.comments}</span>
          </div>
        </div>
      </div>
    </BlurredCard>
  );
};

export default RoadCard;


import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BlurredCard } from "@/components/ui/BlurredCard";

export interface LatestRoad {
  id: string;
  name: string;
  location: string;
  image: string;
  addedBy: string;
  rating: number;
  addedAt: string;
}

interface LatestRoadCardProps {
  road: LatestRoad;
  index: number;
}

const LatestRoadCard = ({ road, index }: LatestRoadCardProps) => {
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
            src={road.image}
            alt={road.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <h4 className="text-white font-semibold">{road.name}</h4>
            <p className="text-white/80 text-sm">{road.location}</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              Aggiunta da: <span className="font-medium">{road.addedBy}</span>
            </div>
            <div className="flex items-center">
              <div className="text-amber-500 mr-2">
                {'★'.repeat(Math.floor(road.rating))}
                {road.rating % 1 !== 0 ? '½' : ''}
              </div>
              <div className="text-muted-foreground text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {road.addedAt}
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/roads`}>Dettagli</Link>
            </Button>
          </div>
        </div>
      </BlurredCard>
    </motion.div>
  );
};

export default LatestRoadCard;

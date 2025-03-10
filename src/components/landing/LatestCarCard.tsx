
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BlurredCard } from "@/components/ui/BlurredCard";

export interface LatestCar {
  id: string;
  make: string;
  model: string;
  image: string;
  ownerName: string;
  ownerAvatar: string;
  addedAt: string;
}

interface LatestCarCardProps {
  car: LatestCar;
  index: number;
}

const LatestCarCard = ({ car, index }: LatestCarCardProps) => {
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
            src={car.image}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <h4 className="text-white font-semibold">{car.make} {car.model}</h4>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src={car.ownerAvatar} 
                alt={car.ownerName} 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm">{car.ownerName}</span>
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {car.addedAt}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/garage`}>Dettagli</Link>
            </Button>
          </div>
        </div>
      </BlurredCard>
    </motion.div>
  );
};

export default LatestCarCard;

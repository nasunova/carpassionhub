
import { useState, useEffect } from "react";
import { BlurredCard } from "./ui/BlurredCard";
import { Button } from "@/components/ui/button";
import { Heart, Share2, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  image: string;
  description: string;
  ownerName: string;
  ownerAvatar: string;
  likes: number;
  comments: number;
}

interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(car.likes);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Check if current user has liked this car
  useEffect(() => {
    const checkIfLiked = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setCurrentUserId(user.id);
        
        // Check if the user has already liked this car
        const { data } = await supabase
          .from("car_likes")
          .select("*")
          .eq("car_id", car.id)
          .eq("user_id", user.id)
          .single();
        
        if (data) {
          setLiked(true);
        }
      }
    };
    
    checkIfLiked();
  }, [car.id]);

  const handleLike = async () => {
    if (!currentUserId) {
      toast({
        title: "Accesso richiesto",
        description: "Devi fare login per aggiungere un like.",
      });
      return;
    }
    
    try {
      if (liked) {
        // Unlike
        await supabase
          .from("car_likes")
          .delete()
          .eq("car_id", car.id)
          .eq("user_id", currentUserId);
          
        setLikes(likes - 1);
      } else {
        // Like
        await supabase
          .from("car_likes")
          .insert([{ car_id: car.id, user_id: currentUserId }]);
          
        setLikes(likes + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error updating like:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento del like.",
        variant: "destructive",
      });
    }
  };

  return (
    <BlurredCard variant="interactive" className="h-full flex flex-col overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="flex-1 flex flex-col p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-semibold">
              {car.make} {car.model}
            </h3>
            <p className="text-muted-foreground">{car.year}</p>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className="focus:outline-none"
              aria-label="Like"
            >
              <Heart
                className={`w-5 h-5 ${
                  liked ? "fill-racing-red text-racing-red" : "text-muted-foreground"
                } transition-colors`}
              />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="focus:outline-none"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            </motion.button>
          </div>
        </div>
        
        <p className="line-clamp-3 text-sm text-muted-foreground mb-4">
          {car.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-muted">
          <div className="flex items-center">
            <img
              src={car.ownerAvatar}
              alt={car.ownerName}
              className="w-8 h-8 rounded-full mr-2 object-cover"
            />
            <span className="text-sm">{car.ownerName}</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {likes}
            </span>
            <span className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              {car.comments}
            </span>
          </div>
        </div>
      </div>
    </BlurredCard>
  );
};

export default CarCard;


import { useState, useEffect } from "react";
import { BlurredCard } from "./ui/BlurredCard";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, MapPin, Car } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { hasUserLikedPost, likePost, unlikePost, getPostLikesCount } from "@/lib/post-service";
import { useToast } from "@/hooks/use-toast";

interface PostProps {
  id: number;
  userId: string;
  description: string;
  mediaUrl: string;
  location?: string;
  carId?: string;
  createdAt: Date;
  userName: string;
  userAvatar: string;
  isVideo: boolean;
  carDetails?: {
    make: string;
    model: string;
  };
}

interface PostCardProps {
  post: PostProps;
}

const PostCard = ({ post }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const { toast } = useToast();
  const currentUserId = null; // We'll need to implement proper auth integration later

  // Check if user has already liked the post
  useEffect(() => {
    const checkLiked = async () => {
      if (currentUserId) {
        try {
          const isLiked = await hasUserLikedPost(post.id, currentUserId);
          setLiked(isLiked);
          
          const count = await getPostLikesCount(post.id);
          setLikesCount(count);
        } catch (error) {
          console.error("Error checking like status:", error);
        }
      }
    };
    
    checkLiked();
  }, [post.id, currentUserId]);

  const handleLike = async () => {
    if (!currentUserId) {
      toast({
        title: "Accesso richiesto",
        description: "Devi effettuare l'accesso per mettere mi piace",
      });
      return;
    }

    setIsLikeLoading(true);
    
    try {
      let success;
      if (liked) {
        success = await unlikePost(post.id, currentUserId);
      } else {
        success = await likePost(post.id, currentUserId);
      }
      
      if (success) {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikesCount(prevCount => newLiked ? prevCount + 1 : prevCount - 1);
      }
    } catch (error) {
      console.error("Errore gestione like:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il mi piace",
        variant: "destructive",
      });
    } finally {
      setIsLikeLoading(false);
    }
  };

  return (
    <BlurredCard variant="interactive" className="overflow-hidden">
      <div className="relative">
        {!post.isVideo ? (
          <img
            src={post.mediaUrl}
            alt={post.description}
            className="w-full aspect-[4/3] object-cover"
          />
        ) : (
          <video
            src={post.mediaUrl}
            controls
            className="w-full aspect-[4/3] object-cover"
          />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={post.userAvatar}
            alt={post.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{post.userName}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {post.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {post.location}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm mb-3">{post.description}</p>

        {post.carId && post.carDetails && (
          <Link 
            to={`/garage?car=${post.carId}`}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-3 hover:text-foreground transition-colors"
          >
            <Car className="w-4 h-4" />
            {post.carDetails.make} {post.carDetails.model}
          </Link>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              disabled={isLikeLoading}
              className="flex items-center gap-1 text-sm"
            >
              <Heart
                className={`w-5 h-5 ${
                  liked ? "fill-racing-red text-racing-red" : ""
                } ${isLikeLoading ? "opacity-50" : ""}`}
              />
              {likesCount}
            </motion.button>
            <button className="flex items-center gap-1 text-sm">
              <MessageSquare className="w-5 h-5" />
              {0} {/* Placeholder for comments count */}
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            {post.createdAt.toLocaleDateString()}
          </span>
        </div>
      </div>
    </BlurredCard>
  );
};

export default PostCard;

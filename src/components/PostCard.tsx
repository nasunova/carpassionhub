
import { useState } from "react";
import { BlurredCard } from "./ui/BlurredCard";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, MapPin, Car } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export interface Post {
  id: string;
  userId: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  description: string;
  location?: string;
  carId?: string;
  carDetails?: {
    make: string;
    model: string;
  };
  likes: number;
  comments: number;
  createdAt: string;
  user: {
    name: string;
    avatar: string;
  };
}

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <BlurredCard variant="interactive" className="overflow-hidden">
      <div className="relative">
        {post.mediaType === "image" ? (
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
            src={post.user.avatar}
            alt={post.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{post.user.name}</h3>
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
              className="flex items-center gap-1 text-sm"
            >
              <Heart
                className={`w-5 h-5 ${
                  liked ? "fill-racing-red text-racing-red" : ""
                }`}
              />
              {likesCount}
            </motion.button>
            <button className="flex items-center gap-1 text-sm">
              <MessageSquare className="w-5 h-5" />
              {post.comments}
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </BlurredCard>
  );
};

export default PostCard;

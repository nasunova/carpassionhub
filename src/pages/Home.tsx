
import { useState } from "react";
import { motion } from "framer-motion";
import PostCard, { Post } from "@/components/PostCard";
import CreatePostModal from "@/components/CreatePostModal";

// Dati di esempio per i post
const SAMPLE_POSTS: Post[] = [
  {
    id: "1",
    userId: "1",
    mediaUrl: "https://images.unsplash.com/photo-1583267746897-2cf4865e0992",
    mediaType: "image",
    description: "Una bellissima giornata in pista con la mia Giulia Quadrifoglio!",
    location: "Autodromo di Monza",
    carId: "car1",
    carDetails: {
      make: "Alfa Romeo",
      model: "Giulia Quadrifoglio"
    },
    likes: 42,
    comments: 5,
    createdAt: new Date().toISOString(),
    user: {
      name: "Marco Rossi",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco"
    }
  },
  {
    id: "2",
    userId: "2",
    mediaUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    mediaType: "image",
    description: "Tramonto perfetto con la mia nuova auto",
    location: "Strada della Forra",
    likes: 28,
    comments: 3,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    user: {
      name: "Laura Bianchi",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura"
    }
  }
];

const Home = () => {
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);

  const handlePostCreated = () => {
    // TODO: Fetch updated posts from Supabase
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Home</h1>
        <CreatePostModal onPostCreated={handlePostCreated} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <PostCard post={post} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;

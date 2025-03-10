
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PostCard, { Post } from "@/components/PostCard";
import CreatePostModal from "@/components/CreatePostModal";
import { fetchPosts } from "@/lib/post-service";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Home = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      if (!supabase) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    
    getCurrentUser();
  }, []);

  const { 
    data: posts, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 60000, // 1 minuto
  });

  const handlePostCreated = () => {
    // Ricarica i post dopo la creazione di un nuovo post
    refetch();
    toast({
      title: "Post pubblicato",
      description: "Il tuo post è visibile nella home",
    });
  };

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-racing-red">Errore di caricamento</h2>
          <p className="mt-2 text-muted-foreground">
            Si è verificato un errore durante il caricamento dei post.
          </p>
          <button 
            onClick={() => refetch()} 
            className="mt-4 px-4 py-2 bg-racing-red text-white rounded-md hover:bg-racing-red/90"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Home</h1>
        <CreatePostModal onPostCreated={handlePostCreated} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-racing-red" />
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <PostCard post={post} currentUserId={userId} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Nessun post trovato</h2>
          <p className="mt-2 text-muted-foreground">
            Inizia a pubblicare o segui altri utenti per vedere i loro post.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;

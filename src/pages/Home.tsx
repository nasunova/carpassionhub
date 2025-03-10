import { useState, useEffect } from "react";
import { getPosts } from "@/lib/post-service";
import { Container } from "@/components/ui/container";
import PostCard from "@/components/PostCard";
import CreatePostModal from "@/components/CreatePostModal";
import { Loader2 } from "lucide-react";

interface Post {
  id: number;
  user_id: string;
  description: string;
  media_url: string;
  location?: string;
  car_id?: string;
  created_at: string;
  user_name: string;
  user_avatar: string;
  is_video: boolean;
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsData = await getPosts();
      setPosts(postsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Non è stato possibile caricare i post. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Container>
      <div className="max-w-3xl mx-auto py-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Home</h1>
          <CreatePostModal onPostCreated={fetchPosts} />
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="py-10 text-center">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchPosts}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Riprova
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Nessun post disponibile. Crea il primo!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  id: post.id,
                  userId: post.user_id,
                  description: post.description,
                  mediaUrl: post.media_url,
                  location: post.location,
                  carId: post.car_id,
                  createdAt: new Date(post.created_at),
                  userName: post.user_name,
                  userAvatar: post.user_avatar,
                  isVideo: post.is_video
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default Home;

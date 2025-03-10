
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export interface NewPost {
  description: string;
  location?: string;
  carId?: string;
  mediaFile: File;
}

// Ensure posts bucket exists
export const ensurePostsBucket = async () => {
  try {
    // Check if bucket exists first to avoid errors
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'posts');
    
    if (!bucketExists) {
      console.log("Creating posts bucket...");
      const { error } = await supabase.storage.createBucket('posts', {
        public: true,
        allowedMimeTypes: ['image/*', 'video/*'],
        fileSizeLimit: 50000000 // 50MB
      });
      
      if (error) {
        console.error("Error creating posts bucket:", error);
        // Continue anyway, as the bucket might exist but we don't have permission to create it
      }
    }
  } catch (error) {
    console.error("Error checking posts bucket:", error);
    // Continue anyway, bucket might exist already
  }
};

// Upload media file and return the URL
export const uploadPostMedia = async (file: File) => {
  await ensurePostsBucket();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${fileName}`;
  
  try {
    // Upload the file to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from('posts')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error("Errore caricamento media:", uploadError);
      throw new Error("Impossibile caricare il file multimediale");
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('posts')
      .getPublicUrl(filePath);
    
    return { url: publicUrl, path: filePath };
  } catch (error) {
    console.error("Errore caricamento media:", error);
    throw new Error("Impossibile caricare il file multimediale");
  }
};

// Create a new post
export const createPost = async (
  newPost: NewPost, 
  userId: string, 
  userName: string, 
  userAvatar: string
) => {
  try {
    // Try to upload the media file
    let mediaUrl;
    let mediaPath;
    
    try {
      const mediaResult = await uploadPostMedia(newPost.mediaFile);
      mediaUrl = mediaResult.url;
      mediaPath = mediaResult.path;
    } catch (error) {
      console.error("Errore creazione post:", error);
      throw new Error("Impossibile caricare il file multimediale");
    }
    
    // Determine if it's an image or video
    const isVideo = newPost.mediaFile.type.startsWith('video/');
    
    // Create the post in the database
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          user_id: userId,
          description: newPost.description,
          location: newPost.location,
          car_id: newPost.carId,
          media_url: mediaUrl,
          media_path: mediaPath,
          is_video: isVideo,
          user_name: userName,
          user_avatar: userAvatar
        }
      ])
      .select('*')
      .single();
    
    if (error) {
      console.error("Errore inserimento post nel database:", error);
      throw new Error("Impossibile salvare il post nel database");
    }
    
    return data;
  } catch (error) {
    console.error("Errore creazione post:", error);
    return null;
  }
};

// Get all posts
export const getPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Errore recupero post:", error);
    return [];
  }
  
  return data;
};

// Like a post
export const likePost = async (postId: number, userId: string) => {
  const { data, error } = await supabase
    .from('post_likes')
    .insert([
      {
        post_id: postId,
        user_id: userId
      }
    ]);
  
  if (error) {
    console.error("Errore like post:", error);
    return false;
  }
  
  return true;
};

// Unlike a post
export const unlikePost = async (postId: number, userId: string) => {
  const { error } = await supabase
    .from('post_likes')
    .delete()
    .match({ post_id: postId, user_id: userId });
  
  if (error) {
    console.error("Errore unlike post:", error);
    return false;
  }
  
  return true;
};

// Check if user liked a post
export const hasUserLikedPost = async (postId: number, userId: string) => {
  const { data, error } = await supabase
    .from('post_likes')
    .select('*')
    .match({ post_id: postId, user_id: userId });
  
  if (error) {
    console.error("Errore verifica like:", error);
    return false;
  }
  
  return data.length > 0;
};

// Get post likes count
export const getPostLikesCount = async (postId: number) => {
  const { count, error } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact' })
    .eq('post_id', postId);
  
  if (error) {
    console.error("Errore conteggio like:", error);
    return 0;
  }
  
  return count || 0;
};

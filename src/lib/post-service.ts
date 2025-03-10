import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export interface Post {
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

export interface NewPost {
  description: string;
  mediaFile: File;
  location?: string;
  carId?: string;
}

async function ensurePostsBucket() {
  // The bucket should be created from Supabase dashboard instead
  console.info('Checking if posts bucket exists...');
  return true; // Skip bucket creation as it should be done manually
}

export async function uploadPostMedia(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const mediaPath = `${uuidv4()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('posts')
    .upload(mediaPath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Errore caricamento media:', error);
    throw new Error('Impossibile caricare il file multimediale');
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('posts')
    .getPublicUrl(mediaPath);

  return {
    url: publicUrl,
    path: mediaPath
  };
}

export async function createPost(post: NewPost, userId: string, userName: string, userAvatar: string): Promise<Post | null> {
  try {
    await ensurePostsBucket();
    
    const mediaInfo = await uploadPostMedia(post.mediaFile);
    
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          user_id: userId,
          description: post.description,
          media_url: mediaInfo.url,
          location: post.location,
          car_id: post.carId,
          user_name: userName,
          user_avatar: userAvatar,
          is_video: post.mediaFile.type.startsWith('video/'),
        },
      ])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating post:", error);
      throw new Error("Failed to create post");
    }
    
    return data;
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
}

export const getPosts = async (): Promise<Post[]> => {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      throw new Error("Failed to fetch posts");
    }

    return posts || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const hasUserLikedPost = async (postId: number, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) {
      console.error("Error checking if user liked post:", error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error("Error checking if user liked post:", error);
    return false;
  }
};

export const likePost = async (postId: number, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('post_likes')
      .insert([{ post_id: postId, user_id: userId }]);

    if (error) {
      console.error("Error liking post:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error liking post:", error);
    return false;
  }
};

export const unlikePost = async (postId: number, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) {
      console.error("Error unliking post:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error unliking post:", error);
    return false;
  }
};

export const getPostLikesCount = async (postId: number): Promise<number> => {
  try {
    const { data, error, count } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact' })
      .eq('post_id', postId);

    if (error) {
      console.error("Error getting post likes count:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error getting post likes count:", error);
    return 0;
  }
};

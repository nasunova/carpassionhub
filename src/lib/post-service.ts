
import { supabase, isSupabaseAvailable, createPublicBucket } from './supabase';
import { Post } from '@/components/PostCard';

export type NewPost = {
  description: string;
  location?: string;
  carId?: string;
  mediaFile: File;
};

// Nome del bucket Supabase per i file multimediali dei post
const POSTS_BUCKET = 'posts';

// Assicurati che il bucket esista
export const ensurePostsBucket = async () => {
  if (!isSupabaseAvailable() || !supabase) return false;
  return await createPublicBucket(POSTS_BUCKET);
};

// Carica file multimediale (immagine o video) su Supabase Storage
export const uploadPostMedia = async (file: File, userId: string): Promise<string | null> => {
  if (!isSupabaseAvailable() || !supabase) return null;
  
  try {
    await ensurePostsBucket();
    
    // Crea un nome file unico basato su timestamp e ID utente
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    // Carica il file nel bucket 'posts'
    const { data, error } = await supabase.storage
      .from(POSTS_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Errore caricamento media:', error);
      return null;
    }
    
    // Ottieni URL pubblico del file
    const { data: { publicUrl } } = supabase.storage
      .from(POSTS_BUCKET)
      .getPublicUrl(fileName);
    
    return publicUrl;
  } catch (error) {
    console.error('Errore caricamento media:', error);
    return null;
  }
};

// Crea un nuovo post nel database
export const createPost = async (
  post: NewPost, 
  userId: string, 
  username: string, 
  userAvatar: string
): Promise<Post | null> => {
  if (!isSupabaseAvailable() || !supabase) return null;
  
  try {
    // Carica prima il file multimediale
    const mediaUrl = await uploadPostMedia(post.mediaFile, userId);
    
    if (!mediaUrl) {
      throw new Error('Impossibile caricare il file multimediale');
    }
    
    // Determina il tipo di media
    const mediaType: 'image' | 'video' = post.mediaFile.type.startsWith('image/') 
      ? 'image' 
      : 'video';
    
    // Ottieni dettagli auto se carId è fornito
    let carDetails = undefined;
    if (post.carId) {
      const { data: carData } = await supabase
        .from('cars')
        .select('make, model')
        .eq('id', post.carId)
        .single();
        
      if (carData) {
        carDetails = {
          make: carData.make,
          model: carData.model
        };
      }
    }
    
    // Inserisci il post nel database
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        media_url: mediaUrl,
        media_type: mediaType,
        description: post.description,
        location: post.location || null,
        car_id: post.carId || null,
        likes_count: 0,
        comments_count: 0
      })
      .select()
      .single();
    
    if (error) {
      console.error('Errore creazione post:', error);
      return null;
    }
    
    // Formatta e restituisci il post creato
    return {
      id: data.id,
      userId: data.user_id,
      mediaUrl: data.media_url,
      mediaType: data.media_type,
      description: data.description,
      location: data.location || undefined,
      carId: data.car_id || undefined,
      carDetails,
      likes: data.likes_count,
      comments: data.comments_count,
      createdAt: data.created_at,
      user: {
        name: username,
        avatar: userAvatar
      }
    };
  } catch (error) {
    console.error('Errore creazione post:', error);
    return null;
  }
};

// Recupera tutti i post ordinati per data di creazione
export const fetchPosts = async (): Promise<Post[]> => {
  if (!isSupabaseAvailable() || !supabase) return [];
  
  try {
    // Recupera i post con join alla tabella profiles
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        ),
        cars:car_id (
          make,
          model
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Errore recupero post:', error);
      return [];
    }
    
    // Trasforma i dati nel formato richiesto
    return data.map(post => ({
      id: post.id,
      userId: post.user_id,
      mediaUrl: post.media_url,
      mediaType: post.media_type,
      description: post.description,
      location: post.location || undefined,
      carId: post.car_id || undefined,
      carDetails: post.cars ? {
        make: post.cars.make,
        model: post.cars.model
      } : undefined,
      likes: post.likes_count,
      comments: post.comments_count,
      createdAt: post.created_at,
      user: {
        name: post.profiles?.full_name || 'Utente sconosciuto',
        avatar: post.profiles?.avatar_url || `https://ui-avatars.com/api/?name=Unknown&background=random`
      }
    }));
  } catch (error) {
    console.error('Errore recupero post:', error);
    return [];
  }
};

// Mette mi piace o rimuove mi piace a un post
export const toggleLikePost = async (postId: string, userId: string): Promise<boolean> => {
  if (!isSupabaseAvailable() || !supabase) return false;
  
  try {
    // Controlla se l'utente ha già messo like al post
    const { data: likes, error: checkError } = await supabase
      .from('post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId);
    
    if (checkError) {
      console.error('Errore controllo like:', checkError);
      return false;
    }
    
    // Se il like esiste già, rimuovilo
    if (likes && likes.length > 0) {
      const { error: unlikeError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      
      if (unlikeError) {
        console.error('Errore rimozione like:', unlikeError);
        return false;
      }
      
      // Decrementa il contatore dei like
      await supabase
        .from('posts')
        .update({ likes_count: supabase.rpc('decrement', { x: 1 }) })
        .eq('id', postId);
      
      return true;
    } 
    
    // Altrimenti, aggiungi il like
    const { error: likeError } = await supabase
      .from('post_likes')
      .insert({ post_id: postId, user_id: userId });
    
    if (likeError) {
      console.error('Errore aggiunta like:', likeError);
      return false;
    }
    
    // Incrementa il contatore dei like
    await supabase
      .from('posts')
      .update({ likes_count: supabase.rpc('increment', { x: 1 }) })
      .eq('id', postId);
    
    return true;
  } catch (error) {
    console.error('Errore gestione like:', error);
    return false;
  }
};

// Controlla se l'utente corrente ha messo like a un post
export const checkUserLikedPost = async (postId: string, userId: string): Promise<boolean> => {
  if (!isSupabaseAvailable() || !supabase) return false;
  
  try {
    const { data, error } = await supabase
      .from('post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Errore controllo like utente:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Errore controllo like utente:', error);
    return false;
  }
};

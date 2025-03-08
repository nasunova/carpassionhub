
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/contexts/AuthContext';

interface AvatarUploadProps {
  user: UserProfile;
  onAvatarChange: (url: string) => Promise<void>;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const AvatarUpload = ({ 
  user, 
  onAvatarChange, 
  className = '', 
  size = 'md',
  disabled = false 
}: AvatarUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine avatar size based on prop
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const avatarSize = sizeClasses[size];

  // Ensure avatar storage bucket exists
  const ensureAvatarBucketExists = async () => {
    try {
      if (!supabase) return false;
      
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
      
      if (!avatarBucketExists) {
        // Create bucket if it doesn't exist
        const { error: createBucketError } = await supabase.storage.createBucket('avatars', {
          public: true, // Make bucket public so we can access images without auth
        });
        
        if (createBucketError) {
          console.error('Error creating avatars bucket:', createBucketError);
          return false;
        }
        
        // Set up RLS policy to allow authenticated users to upload their own files
        const { error: policyError } = await supabase.storage.from('avatars').createPolicy(
          'authenticated-can-upload',
          {
            name: 'authenticated-can-upload',
            definition: `
              storage.object_id IS NOT NULL 
              AND auth.role() = 'authenticated' 
              AND storage.name LIKE auth.uid() || '/%'
            `,
            allow: 'INSERT',
            for: 'objects',
          }
        );
        
        if (policyError) {
          console.error('Error creating bucket policy:', policyError);
          // Policy creation might fail in the current setup, but we'll try to upload anyway
        }
      }
      
      return true;
    } catch (err) {
      console.error('Error ensuring avatar bucket exists:', err);
      return false;
    }
  };

  // Handle file selection
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar-${Math.random().toString(36).slice(2)}.${fileExt}`;

      // Check if file is an image and not too large
      if (!file.type.match('image.*')) {
        toast({
          title: "Errore",
          description: "Il file deve essere un'immagine",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Errore",
          description: "L'immagine non può superare i 2MB",
          variant: "destructive",
        });
        return;
      }

      // Upload image to Supabase Storage
      if (!supabase) {
        toast({
          title: "Errore",
          description: "Supabase non è configurato correttamente",
          variant: "destructive",
        });
        return;
      }

      // Ensure bucket exists before upload
      await ensureAvatarBucketExists();
      
      // If user doesn't have a bucket folder yet, try an alternative approach
      // Use public path for avatar instead of user-specific folder
      const publicFilePath = `public/avatar-${user.id}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(publicFilePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        
        if (error.message.includes('security policy')) {
          setError('Errore di permessi. Contatta l\'amministratore.');
          toast({
            title: "Errore di permessi",
            description: "Non hai i permessi per caricare file. Utilizza un avatar predefinito.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Errore di caricamento",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(publicFilePath);

      // Update avatar URL in profile
      await onAvatarChange(publicUrl);
      
      toast({
        title: "Immagine caricata",
        description: "La tua foto profilo è stata aggiornata",
      });
      
      setShowOptions(false);
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante il caricamento dell'immagine",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAvatarClick = () => {
    if (disabled) return;
    setShowOptions(!showOptions);
  };

  const handleResetAvatar = async () => {
    try {
      setUploading(true);
      setError(null);
      
      const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.email)}&background=random`;
      
      await onAvatarChange(defaultAvatarUrl);
      
      toast({
        title: "Avatar resettato",
        description: "La tua foto profilo è stata resettata",
      });
      
      setShowOptions(false);
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante il reset dell'avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Avatar 
        className={`${avatarSize} ${!disabled && 'cursor-pointer hover:opacity-90'}`}
        onClick={handleAvatarClick}
      >
        <AvatarImage 
          src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.email)}&background=random`} 
          alt="Profile" 
        />
        <AvatarFallback className="text-2xl">
          {(user.full_name || user.email || '').substring(0, 2).toUpperCase()}
        </AvatarFallback>
        
        {!disabled && !showOptions && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 rounded-full transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        )}
      </Avatar>
      
      {showOptions && (
        <div className="absolute z-10 mt-2 p-2 bg-background rounded-lg border shadow-lg w-48">
          {error && (
            <div className="mb-2 p-2 bg-destructive/10 text-destructive text-xs rounded flex items-start">
              <AlertTriangle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <div>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={uploadAvatar}
                disabled={uploading}
                ref={fileInputRef}
                className="hidden"
              />
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Carica foto
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full justify-start text-destructive hover:text-destructive"
              disabled={uploading}
              onClick={handleResetAvatar}
            >
              <X className="h-4 w-4 mr-2" />
              Rimuovi foto
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;

import React, { useState, useEffect } from 'react';
import { BlurredCard } from '@/components/ui/BlurredCard';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, X, UserCircle, Edit, Mail, MapPin, Car } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import AvatarUpload from '@/components/AvatarUpload';
import CarGalleryCard, { CarGallery } from '@/components/CarGalleryCard';
import AddCarModal from '@/components/AddCarModal';

interface ProfileProps {
  // You can define props here if needed
}

const Profile: React.FC<ProfileProps> = () => {
  const { user, updateProfile, updateAvatar } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    location: '',
    bio: ''
  });

  // Fetch extended profile data from Supabase
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Add states for garage management
  const [myCars, setMyCars] = useState<CarGallery[]>([]);
  const [isLoadingCars, setIsLoadingCars] = useState(true);
  const [showAddCarModal, setShowAddCarModal] = useState(false);

  useEffect(() => {
    // Initialize form data when user data is available
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        location: '',
        bio: ''
      });

      // Fetch extended profile data
      const fetchProfileData = async () => {
        setIsLoadingProfile(true);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            
            // If profile not found (PGRST116 error), create it
            if (error.code === 'PGRST116') {
              console.log('Profile not found, creating new profile');
              await createNewProfile(user);
              return; // The AuthContext will handle initialization
            }
            
            toast({
              title: 'Errore',
              description: 'Impossibile caricare i dati del profilo',
              variant: 'destructive',
            });
          } else if (data) {
            console.log('Profile data:', data);
            setProfileData(data);
            
            // Update form with additional data
            setFormData(prev => ({
              ...prev,
              location: data.location || '',
              bio: data.bio || ''
            }));
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setIsLoadingProfile(false);
        }
      };

      fetchProfileData();
    }
  }, [user, toast]);

  // Modified useEffect to fetch user's cars based on actual database schema
  useEffect(() => {
    const fetchUserCars = async () => {
      if (!user) return;
      
      setIsLoadingCars(true);
      try {
        // Fetch cars from Supabase with only the fields that exist in your database
        const { data, error } = await supabase
          .from('cars')
          .select(`
            id, 
            make, 
            model, 
            year, 
            description,
            image,
            owner_id,
            owner_name,
            owner_avatar
          `)
          .eq('owner_id', user.id);
          
        if (error) throw error;

        // Transform the data to match the expected CarGallery format
        const formattedCars: CarGallery[] = data.map(car => ({
          id: car.id,
          make: car.make,
          model: car.model,
          year: car.year,
          // Use the image directly from the cars table
          images: car.image ? [car.image] : [],
          specs: {
            // Since these fields might not exist in your schema, use placeholder values
            power: 'N/A', 
            engine: 'N/A',
            transmission: 'N/A',
            drivetrain: 'N/A'
          }
        }));
        
        setMyCars(formattedCars);
      } catch (error) {
        console.error('Error fetching user cars:', error);
        toast({
          title: 'Errore',
          description: 'Impossibile caricare le auto dal tuo garage',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingCars(false);
      }
    };

    if (user) {
      fetchUserCars();
    }
  }, [user, toast]);

  // Function to create a new profile
  const createNewProfile = async (userData: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userData.id,
          full_name: userData.full_name || '',
          avatar_url: userData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.full_name || userData.email)}&background=random`,
          email: userData.email,
          badges: ['Nuovo Membro'],
          stats: {
            followers: 0,
            following: 0,
            events: 0,
            roads: 0
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating profile:', error);
        toast({
          title: 'Errore',
          description: 'Impossibile creare il profilo',
          variant: 'destructive',
        });
        return false;
      }

      toast({
        title: 'Profilo creato',
        description: 'Il tuo profilo è stato creato con successo',
      });

      // Refresh the page to load the new profile
      window.location.reload();
      return true;
    } catch (error) {
      console.error('Error creating profile:', error);
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // If profile doesn't exist, create it first
      if (!profileData) {
        const created = await createNewProfile(user);
        if (!created) {
          setLoading(false);
          return;
        }
      }

      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          location: formData.location,
          bio: formData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;

      // Also update in auth context
      await updateProfile({
        full_name: formData.full_name
      });

      toast({
        title: 'Profilo aggiornato',
        description: 'Le modifiche al profilo sono state salvate.',
      });
      
      // Update local state
      setProfileData(prev => ({
        ...prev,
        full_name: formData.full_name,
        location: formData.location,
        bio: formData.bio
      }));
      
      // Exit edit mode
      setEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Errore',
        description: error.message || 'Si è verificato un errore durante l\'aggiornamento del profilo.',
        variant: 'destructive',
      });
    } finally {
      // Make sure loading state is reset
      setLoading(false);
    }
  };

  // Add function to handle adding a car
  const handleAddCar = (newCar: any) => {
    // Transform car to CarGallery format
    const carToAdd: CarGallery = {
      id: newCar.id,
      make: newCar.make,
      model: newCar.model,
      year: newCar.year,
      images: [newCar.image],
      specs: {
        power: newCar.power || 'N/A',
        engine: newCar.engine || 'N/A',
        transmission: newCar.transmission || 'Manuale',
        drivetrain: newCar.drivetrain || 'RWD'
      }
    };
    
    setMyCars(prev => [carToAdd, ...prev]);
    setShowAddCarModal(false);
  };

  // Function to handle removing a car
  const handleRemoveCar = (carId: string | number) => {
    setMyCars(prev => prev.filter(car => car.id !== carId));
  };

  // Example data for cars, events, and roads
  const cars = [
    {
      id: 1,
      make: 'Alfa Romeo',
      model: 'Giulia Quadrifoglio',
      year: 2021,
      images: [
        'https://images.unsplash.com/photo-1583267746897-2cf4865e0992?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        'https://images.unsplash.com/photo-1617814078814-6ad58652e686?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      ],
      specs: {
        power: '510 CV',
        engine: 'V6 2.9L Biturbo',
        transmission: 'Automatico 8 marce',
        drivetrain: 'RWD'
      }
    },
    {
      id: 2,
      make: 'Porsche',
      model: '911 GT3',
      year: 2022,
      images: [
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f373e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        'https://images.unsplash.com/photo-1611821064430-0d40291922f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
      ],
      specs: {
        power: '510 CV',
        engine: '4.0L Flat-6',
        transmission: 'PDK 7 marce',
        drivetrain: 'RWD'
      }
    }
  ];

  // Dati di esempio per gli eventi
  const events = [
    {
      id: 1,
      title: 'Raduno Alfa Romeo',
      date: '15 Giugno 2023',
      location: 'Autodromo di Monza',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      status: 'Partecipato'
    },
    {
      id: 2,
      title: 'Cars & Coffee Milano',
      date: '2 Luglio 2023',
      location: 'Piazza Duomo, Milano',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      status: 'Organizzato'
    }
  ];

  // Dati di esempio per le strade
  const roads = [
    {
      id: 1,
      name: 'Passo dello Stelvio',
      location: 'Alpi, Lombardia',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1506097425191-7ad538b29cef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      review: 'Straordinaria, la migliore strada per una guida sportiva!'
    },
    {
      id: 2,
      name: 'Passo del Bernina',
      location: 'Alpi, Confine Svizzero',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1519583272095-6433daf26b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
      review: 'Panorami mozzafiato, asfalto in ottime condizioni.'
    }
  ];

  if (!user) {
    return (
      <AnimatedTransition>
        <div className="container mx-auto px-4 py-8">
          <BlurredCard className="max-w-4xl mx-auto p-6">
            <div className="text-center p-12">
              <UserCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Accesso richiesto</h2>
              <p className="text-muted-foreground mb-6">
                Devi effettuare l'accesso per visualizzare il tuo profilo.
              </p>
              <Button onClick={() => window.location.href = '/auth'}>
                Accedi
              </Button>
            </div>
          </BlurredCard>
        </div>
      </AnimatedTransition>
    );
  }

  return (
    <AnimatedTransition>
      <div className="container mx-auto px-4 py-8">
        <BlurredCard className="max-w-4xl mx-auto p-6">
          {isLoadingProfile ? (
            // Loading state
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <div className="h-24 w-full">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          ) : editing ? (
            // Edit mode
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
              <AvatarUpload 
                user={user!} 
                onAvatarChange={updateAvatar}
                size="md"
              />
              
              <div className="flex-1">
                <div className="space-y-4 w-full">
                  <div>
                    <Label htmlFor="full_name">Nome completo</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="mt-1 bg-muted"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Luogo</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="es. Milano, Italia"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Raccontaci qualcosa di te..."
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditing(false);
                        setLoading(false); // Also ensure loading is reset when cancelling
                      }}
                      disabled={loading}
                    >
                      Annulla
                    </Button>
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      {loading ? 'Salvataggio...' : 'Salva modifiche'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // View mode
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
              <AvatarUpload 
                user={user!} 
                onAvatarChange={updateAvatar}
                size="md"
                disabled={!editing}
              />
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-3xl font-bold">{user.full_name || 'Utente'}</h1>
                  {profileData?.badges && profileData.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center md:justify-start">
                      {profileData.badges.map((badge: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-primary/10 text-primary">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 justify-center md:justify-start text-muted-foreground mt-1">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                {formData.location && (
                  <div className="flex items-center gap-1 justify-center md:justify-start text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{formData.location}</span>
                  </div>
                )}
                <p className="text-muted-foreground">Membro da {new Date(user.created_at).toLocaleDateString('it-IT', { year: 'numeric', month: 'long' })}</p>
                
                {formData.bio && <p className="mt-3">{formData.bio}</p>}
                
                {profileData?.stats && (
                  <div className="mt-4 flex justify-center md:justify-start gap-6">
                    <div className="text-center">
                      <p className="font-bold">{profileData.stats.followers || 0}</p>
                      <p className="text-sm text-muted-foreground">Follower</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{profileData.stats.following || 0}</p>
                      <p className="text-sm text-muted-foreground">Seguiti</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{profileData.stats.events || 0}</p>
                      <p className="text-sm text-muted-foreground">Eventi</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{profileData.stats.roads || 0}</p>
                      <p className="text-sm text-muted-foreground">Strade</p>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Modifica Profilo
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <Tabs defaultValue="garage" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="garage">Il Mio Garage</TabsTrigger>
              <TabsTrigger value="events">Eventi</TabsTrigger>
              <TabsTrigger value="roads">Valutazioni Strade</TabsTrigger>
            </TabsList>
            
            <TabsContent value="garage" className="space-y-4">
              {isLoadingCars ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                      <div className="grid grid-cols-2 gap-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : myCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myCars.map(car => (
                    <CarGalleryCard 
                      key={car.id} 
                      car={car} 
                      onDelete={handleRemoveCar}
                      editable={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <Car className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Il tuo garage è vuoto. Aggiungi la tua prima auto!</p>
                  <Button onClick={() => setShowAddCarModal(true)}>Aggiungi Auto</Button>
                </div>
              )}
              
              <div className="flex justify-center mt-6">
                <Button onClick={() => setShowAddCarModal(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Aggiungi Nuova Auto
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="events" className="space-y-4">
              {events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map(event => (
                    <BlurredCard key={event.id} className="overflow-hidden hover:shadow-lg transition-all">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold">{event.title}</h3>
                            <p className="text-muted-foreground">{event.date}</p>
                            <p className="text-sm mt-1">{event.location}</p>
                          </div>
                          <Badge variant={event.status === 'Organizzato' ? 'default' : 'outline'}>
                            {event.status}
                          </Badge>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm">Dettagli</Button>
                        </div>
                      </div>
                    </BlurredCard>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">Non ti sei ancora registrato a nessun evento.</p>
                  <Button className="mt-4">Esplora Eventi</Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="roads" className="space-y-4">
              {roads.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roads.map(road => (
                    <BlurredCard key={road.id} className="overflow-hidden hover:shadow-lg transition-all">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={road.image} 
                          alt={road.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold">{road.name}</h3>
                            <p className="text-muted-foreground">{road.location}</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-amber-500 mr-1">★</span>
                            <span>{road.rating}/5</span>
                          </div>
                        </div>
                        
                        <p className="mt-2 text-sm italic">"{road.review}"</p>
                        
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm">Dettagli</Button>
                        </div>
                      </div>
                    </BlurredCard>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">Non hai ancora valutato nessuna strada.</p>
                  <Button className="mt-4">Scopri Strade</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </BlurredCard>
      </div>
      
      {/* Add Car Modal */}
      <AddCarModal 
        isOpen={showAddCarModal} 
        onClose={() => setShowAddCarModal(false)} 
        onCarAdded={handleAddCar}
      />
    </AnimatedTransition>
  );
};

export default Profile;

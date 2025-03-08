
import React, { useState } from 'react';
import { BlurredCard } from '@/components/ui/BlurredCard';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Profile = () => {
  // Dati di esempio per il profilo
  const profileData = {
    name: 'Marco Rossi',
    username: 'speedmaster',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    joinDate: 'Maggio 2023',
    bio: 'Appassionato di auto sportive e strade panoramiche. Amo guidare sulle strade di montagna nei weekend.',
    location: 'Milano, Italia',
    badges: ['Premium', 'Road Master', 'Event Organizer'],
    stats: {
      followers: 128,
      following: 87,
      events: 12,
      roads: 34
    }
  };

  // Dati di esempio per le auto nel garage con multiple immagini
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

  return (
    <AnimatedTransition>
      <div className="container mx-auto px-4 py-8">
        <BlurredCard className="max-w-4xl mx-auto p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profileData.avatar} alt="Profile" />
              <AvatarFallback className="text-2xl">MR</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="text-3xl font-bold">{profileData.name}</h1>
                <div className="flex flex-wrap gap-1 justify-center md:justify-start">
                  {profileData.badges.map((badge, index) => (
                    <Badge key={index} variant="outline" className="bg-primary/10 text-primary">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mt-1">@{profileData.username} · {profileData.location}</p>
              <p className="text-muted-foreground">Membro da {profileData.joinDate}</p>
              
              <p className="mt-3">{profileData.bio}</p>
              
              <div className="mt-4 flex justify-center md:justify-start gap-6">
                <div className="text-center">
                  <p className="font-bold">{profileData.stats.followers}</p>
                  <p className="text-sm text-muted-foreground">Follower</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{profileData.stats.following}</p>
                  <p className="text-sm text-muted-foreground">Seguiti</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{profileData.stats.events}</p>
                  <p className="text-sm text-muted-foreground">Eventi</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{profileData.stats.roads}</p>
                  <p className="text-sm text-muted-foreground">Strade</p>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <Button variant="outline" size="sm">Modifica Profilo</Button>
                <Button variant="outline" size="sm">Impostazioni</Button>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="garage" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="garage">Il Mio Garage</TabsTrigger>
              <TabsTrigger value="events">Eventi</TabsTrigger>
              <TabsTrigger value="roads">Valutazioni Strade</TabsTrigger>
            </TabsList>
            
            <TabsContent value="garage" className="space-y-4">
              {cars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cars.map(car => (
                    <CarGalleryCard key={car.id} car={car} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">Il tuo garage è vuoto. Aggiungi la tua prima auto!</p>
                  <Button className="mt-4">Aggiungi Auto</Button>
                </div>
              )}
              <div className="flex justify-center mt-6">
                <Button>Aggiungi Nuova Auto</Button>
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
    </AnimatedTransition>
  );
};

// Nuovo componente per la galleria foto dell'auto
const CarGalleryCard = ({ car }: { car: any }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAddPhotoForm, setShowAddPhotoForm] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call to update the car's images
    console.log("Adding photo URL:", newPhotoUrl);
    setNewPhotoUrl('');
    setShowAddPhotoForm(false);
  };

  return (
    <BlurredCard className="overflow-hidden hover:shadow-lg transition-all">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={car.images[currentImageIndex]} 
          alt={`${car.make} ${car.model}`} 
          className="w-full h-full object-cover"
        />
        
        {car.images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
              aria-label="Foto precedente"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
              aria-label="Foto successiva"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
        
        <div className="absolute bottom-2 right-2 flex space-x-1">
          {car.images.map((_, index: number) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold">{car.make} {car.model}</h3>
        <p className="text-muted-foreground">{car.year}</p>
        
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Motore</p>
            <p className="text-sm font-medium">{car.specs.engine}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Potenza</p>
            <p className="text-sm font-medium">{car.specs.power}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Trasmissione</p>
            <p className="text-sm font-medium">{car.specs.transmission}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Trazione</p>
            <p className="text-sm font-medium">{car.specs.drivetrain}</p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAddPhotoForm(!showAddPhotoForm)}
            className="flex items-center gap-1"
          >
            {showAddPhotoForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAddPhotoForm ? 'Annulla' : 'Aggiungi Foto'}
          </Button>
          <Button variant="outline" size="sm">Dettagli</Button>
        </div>
        
        {showAddPhotoForm && (
          <form onSubmit={handleAddPhoto} className="mt-4 p-3 bg-muted/50 rounded-md">
            <Label htmlFor={`photo-url-${car.id}`} className="mb-2 block">URL Immagine</Label>
            <div className="flex gap-2">
              <Input
                id={`photo-url-${car.id}`}
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="https://esempio.com/mia-foto.jpg"
                required
                className="flex-1"
              />
              <Button type="submit" size="sm">Aggiungi</Button>
            </div>
          </form>
        )}
      </div>
    </BlurredCard>
  );
};

export default Profile;

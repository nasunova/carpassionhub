
import React, { useState } from 'react';
import { BlurredCard } from '@/components/ui/BlurredCard';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import EditProfileForm from '@/components/EditProfileForm';

// Import refactored components
import UserStats from '@/components/Profile/UserStats';
import GarageSection from '@/components/Profile/GarageSection';
import EventsSection from '@/components/Profile/EventsSection';
import RoadsSection from '@/components/Profile/RoadsSection';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // In una vera app, queste informazioni verrebbero dal database
  const userProfile = {
    name: user?.full_name || user?.email?.split('@')[0] || 'Utente',
    username: user?.email?.split('@')[0] || 'user',
    avatar: user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || user?.email || 'User')}&background=random`,
    joinDate: new Date(user?.created_at || Date.now()).toLocaleDateString('it-IT', { 
      year: 'numeric', 
      month: 'long' 
    }),
    bio: user?.bio || 'Appassionato di auto sportive e strade panoramiche. Amo guidare sulle strade di montagna nei weekend.',
    location: user?.location || 'Milano, Italia',
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
          {isEditing ? (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Modifica Profilo</h2>
              <EditProfileForm 
                onCancel={() => setIsEditing(false)}
                initialData={{
                  full_name: user?.full_name || '',
                  bio: user?.bio || userProfile.bio,
                  location: user?.location || userProfile.location
                }}
              />
            </div>
          ) : (
            <UserStats userProfile={userProfile} onEditClick={() => setIsEditing(true)} />
          )}
          
          <Tabs defaultValue="garage" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="garage">Il Mio Garage</TabsTrigger>
              <TabsTrigger value="events">Eventi</TabsTrigger>
              <TabsTrigger value="roads">Valutazioni Strade</TabsTrigger>
            </TabsList>
            
            <TabsContent value="garage">
              <GarageSection cars={cars} />
            </TabsContent>
            
            <TabsContent value="events">
              <EventsSection events={events} />
            </TabsContent>
            
            <TabsContent value="roads">
              <RoadsSection roads={roads} />
            </TabsContent>
          </Tabs>
        </BlurredCard>
      </div>
    </AnimatedTransition>
  );
};

export default Profile;

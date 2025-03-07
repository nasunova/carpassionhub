
import React, { useState } from 'react';
import { BlurredCard } from '@/components/ui/BlurredCard';
import AnimatedTransition from '@/components/AnimatedTransition';
import MapView from '@/components/MapView';
import { Road } from '@/components/RoadCard';
import { useToast } from '@/components/ui/use-toast';

const Roads = () => {
  const { toast } = useToast();
  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);

  // Mock data for roads
  const mockRoads: Road[] = [
    {
      id: "1",
      name: "Passo dello Stelvio",
      location: "Alpi, Lombardia",
      description: "Una delle strade alpine più famose d'Italia, con 48 tornanti sul versante altoatesino.",
      image: "https://images.unsplash.com/photo-1506097425191-7ad538b29cef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      rating: 4.9,
      length: "20 km",
      difficulty: "Difficile",
      likes: 245,
      dislikes: 12,
      comments: 56,
      coordinates: {
        lat: 46.5276,
        lng: 10.4534
      }
    },
    {
      id: "2",
      name: "Passo San Marco",
      location: "Alpi Orobie, Lombardia",
      description: "Un passo meno conosciuto ma con panorami mozzafiato e curve tecniche.",
      image: "https://images.unsplash.com/photo-1519583272095-6433daf26b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
      rating: 4.7,
      length: "15 km",
      difficulty: "Medio",
      likes: 132,
      dislikes: 5,
      comments: 28,
      coordinates: {
        lat: 46.0584,
        lng: 9.6314
      }
    },
    {
      id: "3",
      name: "Passo del Foscagno",
      location: "Valtellina, Lombardia",
      description: "Un passo ad alta quota che collega Livigno con la Valtellina.",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1121&q=80",
      rating: 4.2,
      length: "12 km",
      difficulty: "Facile",
      likes: 87,
      dislikes: 3,
      comments: 15,
      coordinates: {
        lat: 46.5217,
        lng: 10.1955
      }
    }
  ];

  const handleMarkerClick = (roadId: string) => {
    setSelectedRoadId(roadId);
    const road = mockRoads.find(r => r.id === roadId);
    if (road) {
      toast({
        title: road.name,
        description: road.description,
        duration: 3000
      });
    }
  };

  return (
    <AnimatedTransition>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Scenic Driving Roads</h1>
        
        <div className="mb-8">
          <BlurredCard className="p-4 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Discover the Best Driving Roads</h2>
            <p className="text-muted-foreground mb-4">
              Explore our curated collection of the most thrilling and scenic driving roads, 
              rated and reviewed by fellow car enthusiasts. Find your next driving adventure!
            </p>
          </BlurredCard>
          
          <div className="h-[500px] w-full mb-8 rounded-xl overflow-hidden">
            <MapView roads={mockRoads} onMarkerClick={handleMarkerClick} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Road cards will be dynamically loaded here */}
          <p className="col-span-full text-center text-muted-foreground">
            Road recommendations coming soon. Be the first to add your favorite driving road!
          </p>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default Roads;

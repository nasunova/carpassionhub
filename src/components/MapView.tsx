
import { useState, useEffect, useRef } from "react";
import { Road } from "./RoadCard";
import { MapPin, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BlurredCard } from "./ui/BlurredCard";

interface MapViewProps {
  roads: Road[];
  onMarkerClick: (roadId: string) => void;
}

const MapView = ({ roads, onMarkerClick }: MapViewProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Simulating map view here - in a real app, we'd use a proper map library
  // like Google Maps, Mapbox, or Leaflet
  useEffect(() => {
    // Mock implementation - in reality, would initialize the map and set markers
    console.log("Map initialized with roads:", roads);
  }, [roads]);

  return (
    <div className="relative h-[80vh] md:h-[600px] rounded-xl overflow-hidden">
      <div 
        ref={mapRef} 
        className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center"
      >
        <div className="text-center p-4">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <MapPin size={40} className="text-racing-red" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Mappa interattiva</h3>
          <p className="text-muted-foreground max-w-md">
            Qui verrà visualizzata la mappa interattiva delle migliori strade di montagna.
            Nella versione completa, integreremo una mappa interattiva come Mapbox o Google Maps.
          </p>
        </div>
      </div>

      {/* Search and controls overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between">
        <div className={`transition-all duration-300 ${showSearch ? 'w-full' : 'w-auto'}`}>
          {showSearch ? (
            <div className="flex w-full">
              <Input
                type="text"
                placeholder="Cerca una strada..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 rounded-r-none bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
              />
              <Button 
                variant="ghost" 
                className="rounded-l-none bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
                onClick={() => {
                  setSearchTerm("");
                  setShowSearch(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
              onClick={() => setShowSearch(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              Cerca
            </Button>
          )}
        </div>
      </div>

      {/* Markers visualization - simplified for the mock */}
      <div className="absolute inset-0 pointer-events-none">
        {roads.map((road) => (
          <div
            key={road.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{
              // Simplified positioning for placeholder
              left: `${(road.coordinates.lng * 3) % 80 + 10}%`,
              top: `${(road.coordinates.lat * 2) % 80 + 10}%`,
            }}
            onClick={() => onMarkerClick(road.id)}
          >
            <div className="relative group cursor-pointer">
              <MapPin
                size={30}
                className="text-racing-red hover:scale-110 transition-transform duration-300"
                fill="#D2001A30"
              />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <BlurredCard size="sm" className="whitespace-nowrap text-sm font-medium">
                  {road.name}
                </BlurredCard>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapView;

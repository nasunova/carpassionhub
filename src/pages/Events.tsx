
import { useState } from "react";
import EventCard, { Event } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { BlurredCard } from "@/components/ui/BlurredCard";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, MapPin } from "lucide-react";
import AnimatedTransition from "@/components/AnimatedTransition";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Track Day - Monza",
    date: "2023-09-15T09:00:00.000Z",
    location: "Autodromo di Monza, Italia",
    description: "Una giornata in pista sul leggendario circuito di Monza. Porta la tua auto e mettiti alla prova su uno dei tracciati più veloci al mondo.",
    image: "https://images.unsplash.com/photo-1577982787983-e07c6730f2d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    participants: 42,
    maxParticipants: 50,
    registrationUrl: "https://example.com/register/monza-track-day",
    tags: ["Pista", "Monza", "Track Day", "Principianti Benvenuti"],
  },
  {
    id: "2",
    title: "Raduno Auto Sportive - Toscana",
    date: "2023-09-25T10:00:00.000Z",
    location: "Firenze, Italia",
    description: "Un tour panoramico attraverso le colline toscane, seguito da un pranzo in una fattoria storica. Evento dedicato a tutte le auto sportive.",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    participants: 28,
    maxParticipants: 35,
    registrationUrl: "https://example.com/register/toscana-tour",
    tags: ["Raduno", "Toscana", "Tour Panoramico", "Pranzo Incluso"],
  },
  {
    id: "3",
    title: "Track Day - Imola",
    date: "2023-10-05T08:30:00.000Z",
    location: "Autodromo di Imola, Italia",
    description: "Una giornata emozionante sull'iconico circuito di Imola. L'evento include sessioni di guida libera e sessioni con istruttori professionisti.",
    image: "https://images.unsplash.com/photo-1505570554449-69ce7d4e3891?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    participants: 35,
    maxParticipants: 40,
    registrationUrl: "https://example.com/register/imola-track-day",
    tags: ["Pista", "Imola", "Track Day", "Istruttori"],
  },
  {
    id: "4",
    title: "Raduno Alfa Romeo",
    date: "2023-10-15T10:00:00.000Z",
    location: "Milano, Italia",
    description: "Un evento dedicato agli appassionati di Alfa Romeo. Esposizione di modelli storici e moderni, con la possibilità di incontrare altri alfisti.",
    image: "https://images.unsplash.com/photo-1563462718-c4019c183ef7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    participants: 65,
    maxParticipants: 100,
    registrationUrl: "https://example.com/register/alfa-romeo-meeting",
    tags: ["Raduno", "Alfa Romeo", "Milano", "Esposizione"],
  },
  {
    id: "5",
    title: "Track Day - Mugello",
    date: "2023-11-10T09:00:00.000Z",
    location: "Circuito del Mugello, Italia",
    description: "Sperimenta l'adrenalina del circuito del Mugello, una delle piste più tecniche d'Italia. Sessioni di guida per diversi livelli di esperienza.",
    image: "https://images.unsplash.com/photo-1503945913230-4d3a6436559a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    participants: 25,
    maxParticipants: 30,
    registrationUrl: "https://example.com/register/mugello-track-day",
    tags: ["Pista", "Mugello", "Track Day", "Tutti i Livelli"],
  },
  {
    id: "6",
    title: "Raduno Supercar",
    date: "2023-11-20T11:00:00.000Z",
    location: "Roma, Italia",
    description: "Un evento esclusivo per possessori di supercar. Tour della città eterna seguito da una cena di gala in un palazzo storico.",
    image: "https://images.unsplash.com/photo-1621932952601-8e53e9e73214?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    participants: 15,
    maxParticipants: 20,
    registrationUrl: "https://example.com/register/roma-supercar",
    tags: ["Raduno", "Supercar", "Roma", "Evento Esclusivo", "Cena"],
  },
];

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const [currentTab, setCurrentTab] = useState("all");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterEvents(term, currentTab);
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    filterEvents(searchTerm, value);
  };

  const filterEvents = (term: string, tab: string) => {
    let filtered = mockEvents;
    
    // Filter by search term
    if (term) {
      filtered = filtered.filter(
        event => 
          event.title.toLowerCase().includes(term) || 
          event.location.toLowerCase().includes(term) ||
          event.description.toLowerCase().includes(term) ||
          event.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Filter by tab
    if (tab !== "all") {
      const now = new Date();
      if (tab === "upcoming") {
        filtered = filtered.filter(event => new Date(event.date) >= now);
      } else if (tab === "track-days") {
        filtered = filtered.filter(event => 
          event.tags.some(tag => tag.toLowerCase().includes("pista") || tag.toLowerCase().includes("track"))
        );
      } else if (tab === "meetings") {
        filtered = filtered.filter(event => 
          event.tags.some(tag => tag.toLowerCase().includes("raduno"))
        );
      }
    }
    
    setFilteredEvents(filtered);
  };

  return (
    <AnimatedTransition>
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Track Days & Eventi</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Scopri e partecipa ai prossimi eventi automobilistici: track days, raduni, tour panoramici e molto altro.
          </p>
        </div>

        <Tabs defaultValue="all" onValueChange={handleTabChange} className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <TabsList className="bg-muted rounded-full h-10">
              <TabsTrigger value="all" className="rounded-full h-8">Tutti</TabsTrigger>
              <TabsTrigger value="upcoming" className="rounded-full h-8">Prossimi</TabsTrigger>
              <TabsTrigger value="track-days" className="rounded-full h-8">Track Days</TabsTrigger>
              <TabsTrigger value="meetings" className="rounded-full h-8">Raduni</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-4 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cerca eventi..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 rounded-full"
                />
              </div>
              
              <Select defaultValue="date-asc">
                <SelectTrigger className="w-[180px] rounded-full">
                  <SelectValue placeholder="Ordina per" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-asc">Data (più recenti)</SelectItem>
                  <SelectItem value="date-desc">Data (più lontani)</SelectItem>
                  <SelectItem value="participants">Più partecipanti</SelectItem>
                  <SelectItem value="availability">Disponibilità</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            {filteredEvents.length === 0 ? (
              <BlurredCard className="text-center py-16">
                <h3 className="text-2xl font-semibold mb-2">Nessun evento trovato</h3>
                <p className="text-muted-foreground">
                  Prova a modificare i filtri o il termine di ricerca.
                </p>
              </BlurredCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-0">
            {filteredEvents.length === 0 ? (
              <BlurredCard className="text-center py-16">
                <h3 className="text-2xl font-semibold mb-2">Nessun evento trovato</h3>
                <p className="text-muted-foreground">
                  Prova a modificare i filtri o il termine di ricerca.
                </p>
              </BlurredCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="track-days" className="mt-0">
            {filteredEvents.length === 0 ? (
              <BlurredCard className="text-center py-16">
                <h3 className="text-2xl font-semibold mb-2">Nessun track day trovato</h3>
                <p className="text-muted-foreground">
                  Prova a modificare i filtri o il termine di ricerca.
                </p>
              </BlurredCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="meetings" className="mt-0">
            {filteredEvents.length === 0 ? (
              <BlurredCard className="text-center py-16">
                <h3 className="text-2xl font-semibold mb-2">Nessun raduno trovato</h3>
                <p className="text-muted-foreground">
                  Prova a modificare i filtri o il termine di ricerca.
                </p>
              </BlurredCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <BlurredCard className="mt-12 p-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="bg-muted p-4 rounded-full">
              <Calendar className="h-10 w-10 text-racing-red" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Organizzi un evento?</h3>
              <p className="text-muted-foreground">
                Sei un organizzatore di eventi automobilistici? Pubblica il tuo evento su CarPassionHub e raggiungi migliaia di appassionati.
              </p>
            </div>
            <Button className="bg-racing-red hover:bg-racing-red/90 rounded-full px-8">
              Pubblica Evento
            </Button>
          </div>
        </BlurredCard>
      </div>
    </AnimatedTransition>
  );
};

export default Events;

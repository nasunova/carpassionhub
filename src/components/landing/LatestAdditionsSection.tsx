
import { motion } from "framer-motion";
import { Car, Calendar, Map, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LatestCarCard, { LatestCar } from "./LatestCarCard";
import LatestEventCard, { LatestEvent } from "./LatestEventCard";
import LatestRoadCard, { LatestRoad } from "./LatestRoadCard";

// Sample data for latest cars
const latestCars: LatestCar[] = [
  {
    id: "car1",
    make: "Alfa Romeo",
    model: "Giulia Quadrifoglio",
    image: "https://images.unsplash.com/photo-1583267746897-2cf4865e0992?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ownerName: "Marco Rossi",
    ownerAvatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    addedAt: "2 ore fa"
  },
  {
    id: "car2",
    make: "Ferrari",
    model: "296 GTB",
    image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ownerName: "Luca Verdi",
    ownerAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
    addedAt: "5 ore fa"
  },
  {
    id: "car3",
    make: "McLaren",
    model: "720S",
    image: "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80",
    ownerName: "Giulia Bianchi",
    ownerAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    addedAt: "Ieri"
  }
];

// Sample data for track days
const latestEvents: LatestEvent[] = [
  {
    id: "event1",
    title: "Track Day Monza",
    date: "24 Luglio 2023",
    image: "https://images.unsplash.com/photo-1520587210458-bd206c5e8c54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    organizer: "Speedway Club",
    addedAt: "3 ore fa"
  },
  {
    id: "event2",
    title: "Cars & Coffee Milano",
    date: "30 Luglio 2023",
    image: "https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    organizer: "Coffee & Wheels",
    addedAt: "Ieri"
  }
];

// Sample data for roads
const latestRoads: LatestRoad[] = [
  {
    id: "road1",
    name: "Passo del Rombo",
    location: "Trentino Alto Adige",
    image: "https://images.unsplash.com/photo-1519583272095-6433daf26b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
    addedBy: "Marco Rossi",
    rating: 5,
    addedAt: "4 ore fa"
  },
  {
    id: "road2",
    name: "Strada della Forra",
    location: "Lombardia",
    image: "https://images.unsplash.com/photo-1506097425191-7ad538b29cef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    addedBy: "Luca Verdi",
    rating: 4.5,
    addedAt: "2 giorni fa"
  }
];

const LatestAdditionsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-t from-background to-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Ultime Novità dalla Community
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Resta aggiornato con le ultime auto, eventi e strade aggiunte dagli appassionati
          </motion.p>
        </div>

        {/* Latest Cars */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center">
              <Car className="mr-2 text-monaco-blue" /> Auto Recenti
            </h3>
            <Button variant="ghost" className="gap-2" asChild>
              <Link to="/garage">
                Vedi tutte <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestCars.map((car, i) => (
              <LatestCarCard key={car.id} car={car} index={i} />
            ))}
          </div>
        </div>

        {/* Latest Track Days */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center">
              <Calendar className="mr-2 text-racing-red" /> Track Days Recenti
            </h3>
            <Button variant="ghost" className="gap-2" asChild>
              <Link to="/events">
                Vedi tutti <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestEvents.map((event, i) => (
              <LatestEventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </div>

        {/* Latest Roads */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center">
              <Map className="mr-2 text-green-600" /> Strade Recenti
            </h3>
            <Button variant="ghost" className="gap-2" asChild>
              <Link to="/roads">
                Vedi tutte <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestRoads.map((road, i) => (
              <LatestRoadCard key={road.id} road={road} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestAdditionsSection;


import { useState } from "react";
import CarCard, { Car } from "@/components/CarCard";
import { BlurredCard } from "@/components/ui/BlurredCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus } from "lucide-react";
import AnimatedTransition from "@/components/AnimatedTransition";

// Mock data
const mockCars: Car[] = [
  {
    id: "1",
    make: "Porsche",
    model: "911 GT3",
    year: 2021,
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f371e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    description: "La nuova Porsche 911 GT3 è una sportiva ad alte prestazioni che porta la tecnologia delle corse su strada. Con il suo motore boxer aspirato da 510 CV, offre un'esperienza di guida pura e coinvolgente.",
    ownerName: "Mario Rossi",
    ownerAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    likes: 124,
    comments: 15,
  },
  {
    id: "2",
    make: "Ferrari",
    model: "F8 Tributo",
    year: 2020,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    description: "La Ferrari F8 Tributo è un omaggio all'eccellenza tecnica dell'azienda. Con il suo motore V8 biturbo da 720 CV, rappresenta un nuovo standard per le supercar con motore centrale.",
    ownerName: "Giulia Bianchi",
    ownerAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    likes: 156,
    comments: 23,
  },
  {
    id: "3",
    make: "Lamborghini",
    model: "Huracán EVO",
    year: 2021,
    image: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80",
    description: "La Lamborghini Huracán EVO rappresenta l'evoluzione della supersportiva V10 di Sant'Agata Bolognese. Con 640 CV e una dinamica di guida rivoluzionaria, offre prestazioni mozzafiato.",
    ownerName: "Luca Verdi",
    ownerAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
    likes: 98,
    comments: 12,
  },
  {
    id: "4",
    make: "Aston Martin",
    model: "Vantage",
    year: 2022,
    image: "https://images.unsplash.com/photo-1554744512-d6c603f27c54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    description: "L'Aston Martin Vantage combina eleganza britannica e prestazioni sportive. Il suo motore V8 biturbo da 4.0 litri fornisce 510 CV di potenza, garantendo un'esperienza di guida agile e reattiva.",
    ownerName: "Francesca Neri",
    ownerAvatar: "https://randomuser.me/api/portraits/women/22.jpg",
    likes: 87,
    comments: 9,
  },
  {
    id: "5",
    make: "BMW",
    model: "M4 Competition",
    year: 2021,
    image: "https://images.unsplash.com/photo-1607603750941-d57c9832f197?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    description: "La BMW M4 Competition rappresenta l'apice della sportività del marchio tedesco. Con 510 CV e un'estetica aggressiva, offre prestazioni da supercar abbinate al comfort di una coupé premium.",
    ownerName: "Marco Esposito",
    ownerAvatar: "https://randomuser.me/api/portraits/men/54.jpg",
    likes: 112,
    comments: 18,
  },
  {
    id: "6",
    make: "Alfa Romeo",
    model: "Giulia Quadrifoglio",
    year: 2022,
    image: "https://images.unsplash.com/photo-1560861845-2b8c09fa5518?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    description: "L'Alfa Romeo Giulia Quadrifoglio è una berlina sportiva che incarna la passione italiana per le auto. Il suo motore V6 biturbo da 2.9 litri eroga 510 CV, permettendole di competere con le migliori sportive tedesche.",
    ownerName: "Sofia Romano",
    ownerAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
    likes: 95,
    comments: 14,
  },
];

const Garage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCars, setFilteredCars] = useState<Car[]>(mockCars);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setFilteredCars(mockCars);
      return;
    }
    
    const filtered = mockCars.filter(
      car => 
        car.make.toLowerCase().includes(term) || 
        car.model.toLowerCase().includes(term) ||
        car.year.toString().includes(term) ||
        car.ownerName.toLowerCase().includes(term)
    );
    
    setFilteredCars(filtered);
  };

  return (
    <AnimatedTransition>
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Garage Virtuale</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Esplora le auto della nostra community. Scopri modelli unici, storie interessanti e connettiti con altri appassionati.
          </p>
        </div>
        
        <BlurredCard className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center p-6 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cerca marca, modello, anno..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-4 w-full md:w-auto">
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filtri
              </Button>
              <Button className="flex items-center bg-racing-red hover:bg-racing-red/90">
                <Plus className="mr-2 h-4 w-4" />
                Aggiungi Auto
              </Button>
            </div>
          </div>
        </BlurredCard>
        
        {filteredCars.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold mb-2">Nessun risultato trovato</h3>
            <p className="text-muted-foreground">
              Prova a cercare con altri termini o aggiungi la tua auto.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </AnimatedTransition>
  );
};

export default Garage;

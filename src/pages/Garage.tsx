import { useState, useEffect } from "react";
import CarCard, { Car } from "@/components/CarCard";
import { BlurredCard } from "@/components/ui/BlurredCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, AlertTriangle } from "lucide-react";
import AnimatedTransition from "@/components/AnimatedTransition";
import AddCarModal from "@/components/AddCarModal";
import { supabase, isSupabaseAvailable } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Garage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [supabaseError, setSupabaseError] = useState(!isSupabaseAvailable());

  // Fetch cars from Supabase
  useEffect(() => {
    const fetchCars = async () => {
      try {
        if (!isSupabaseAvailable()) {
          setSupabaseError(true);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase!
          .from("cars")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          // Transform database records to Car objects
          const formattedCars: Car[] = data.map((car) => ({
            id: car.id,
            make: car.make,
            model: car.model,
            year: car.year,
            image: car.image,
            description: car.description || "",
            ownerName: car.owner_name,
            ownerAvatar: car.owner_avatar,
            likes: car.likes_count || 0,
            comments: car.comments_count || 0,
          }));

          setCars(formattedCars);
          setFilteredCars(formattedCars);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante il caricamento delle auto.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [toast]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setFilteredCars(cars);
      return;
    }
    
    const filtered = cars.filter(
      car => 
        car.make.toLowerCase().includes(term) || 
        car.model.toLowerCase().includes(term) ||
        car.year.toString().includes(term) ||
        car.ownerName.toLowerCase().includes(term)
    );
    
    setFilteredCars(filtered);
  };

  const handleAddCar = (newCar: Car) => {
    setCars((prevCars) => [newCar, ...prevCars]);
    setFilteredCars((prevFiltered) => [newCar, ...prevFiltered]);
  };

  if (supabaseError) {
    return (
      <AnimatedTransition>
        <div className="container mx-auto px-6 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Garage Virtuale</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Esplora le auto della nostra community. Scopri modelli unici, storie interessanti e connettiti con altri appassionati.
            </p>
          </div>
          
          <BlurredCard className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Configurazione Supabase mancante</h2>
            <p className="text-muted-foreground mb-4">
              Le variabili d'ambiente per Supabase non sono configurate correttamente.
              Assicurati di aver impostato <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>.
            </p>
            <p className="text-sm text-muted-foreground">
              Per ulteriori informazioni, consulta la documentazione di Supabase sull'integrazione con le applicazioni React.
            </p>
          </BlurredCard>
        </div>
      </AnimatedTransition>
    );
  }

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
              <Button 
                className="flex items-center bg-racing-red hover:bg-racing-red/90"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Aggiungi Auto
              </Button>
            </div>
          </div>
        </BlurredCard>
        
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-muted-foreground">Caricamento auto...</p>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold mb-2">Nessun risultato trovato</h3>
            <p className="text-muted-foreground">
              {cars.length === 0 
                ? "Il garage è vuoto. Aggiungi la tua prima auto!"
                : "Prova a cercare con altri termini o aggiungi la tua auto."}
            </p>
            <Button 
              className="mt-6 bg-racing-red hover:bg-racing-red/90"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Aggiungi Auto
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>

      {/* Add Car Modal */}
      <AddCarModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onCarAdded={handleAddCar}
      />
    </AnimatedTransition>
  );
};

export default Garage;

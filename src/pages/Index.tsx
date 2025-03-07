
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BlurredCard } from "@/components/ui/BlurredCard";
import { Link } from "react-router-dom";
import { Car, Calendar, Map, ArrowRight, Clock } from "lucide-react";

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  // Dati di esempio per le ultime auto aggiunte
  const latestCars = [
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

  // Dati di esempio per i track day recenti
  const latestEvents = [
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

  // Dati di esempio per le strade aggiunte recentemente
  const latestRoads = [
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

  const features = [
    {
      icon: Car,
      title: "Garage Virtuale",
      description: "Crea il tuo profilo e condividi le tue auto con la community. Mostra la tua collezione e scopri quelle degli altri appassionati.",
      link: "/garage",
      color: "text-monaco-blue",
    },
    {
      icon: Calendar,
      title: "Track Days",
      description: "Scopri e prenota i prossimi eventi automobilistici, track days e raduni. Non perdere l'occasione di vivere la tua passione in pista.",
      link: "/events",
      color: "text-racing-red",
    },
    {
      icon: Map,
      title: "Strade Panoramiche",
      description: "Trova e condividi le migliori strade per guidare. Valuta i percorsi più emozionanti e scopri nuovi itinerari suggeriti dalla community.",
      link: "/roads",
      color: "text-green-600",
    },
  ];

  return (
    <div ref={containerRef} className="overflow-x-hidden">
      {/* Hero section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ opacity, scale, y }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
            alt="Supercar on mountain road"
            className="absolute inset-0 object-cover w-full h-full"
          />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl text-center mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              La Piattaforma Definitiva per Gli Appassionati di Auto
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md">
              Condividi la tua passione, scopri eventi e strade panoramiche, connettiti con altri appassionati.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="rounded-full px-8 py-6 bg-racing-red hover:bg-racing-red/90 text-white"
                asChild
              >
                <Link to="/auth">
                  Inizia Ora
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full px-8 py-6 border-white text-white hover:bg-white/20"
                asChild
              >
                <Link to="/garage">
                  Esplora
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest Additions section */}
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
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <BlurredCard variant="interactive" className="h-full overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={car.image}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <h4 className="text-white font-semibold">{car.make} {car.model}</h4>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img 
                            src={car.ownerAvatar} 
                            alt={car.ownerName} 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-sm">{car.ownerName}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          {car.addedAt}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/garage`}>Dettagli</Link>
                        </Button>
                      </div>
                    </div>
                  </BlurredCard>
                </motion.div>
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
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <BlurredCard variant="interactive" className="h-full overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <h4 className="text-white font-semibold">{event.title}</h4>
                        <p className="text-white/80 text-sm">{event.date}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          Organizzato da: <span className="font-medium">{event.organizer}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          {event.addedAt}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/events`}>Dettagli</Link>
                        </Button>
                      </div>
                    </div>
                  </BlurredCard>
                </motion.div>
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
                <motion.div
                  key={road.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <BlurredCard variant="interactive" className="h-full overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={road.image}
                        alt={road.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <h4 className="text-white font-semibold">{road.name}</h4>
                        <p className="text-white/80 text-sm">{road.location}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          Aggiunta da: <span className="font-medium">{road.addedBy}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="text-amber-500 mr-2">
                            {'★'.repeat(Math.floor(road.rating))}
                            {road.rating % 1 !== 0 ? '½' : ''}
                          </div>
                          <div className="text-muted-foreground text-sm flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {road.addedAt}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/roads`}>Dettagli</Link>
                        </Button>
                      </div>
                    </div>
                  </BlurredCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Cosa offre CarPassionHub
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Scopri tutte le funzionalità per vivere la tua passione per le auto
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <BlurredCard 
                  variant="interactive" 
                  className="h-full flex flex-col items-center text-center p-8"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${feature.color} bg-muted`}>
                    <feature.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6 flex-grow">
                    {feature.description}
                  </p>
                  <Button 
                    variant="outline" 
                    className="rounded-full group"
                    asChild
                  >
                    <Link to={feature.link}>
                      Scopri di più
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </BlurredCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Unisciti alla Community degli Appassionati
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Condividi la tua passione con migliaia di altri appassionati. Scambia opinioni, partecipa agli eventi e scopri nuove esperienze di guida insieme a chi condivide il tuo stesso amore per le auto.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Profili personalizzati per mostrare le tue auto",
                  "Commenti e valutazioni sulle strade e gli eventi",
                  "Sistema di votazione per le migliori strade",
                  "Interazione con altri membri della community"
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="flex items-center"
                  >
                    <span className="w-5 h-5 rounded-full bg-racing-red text-white flex items-center justify-center mr-3">✓</span>
                    {item}
                  </motion.li>
                ))}
              </ul>
              <Button 
                size="lg" 
                className="rounded-full px-8"
                asChild
              >
                <Link to="/auth">
                  Crea il tuo profilo
                </Link>
              </Button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-racing-red rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
                <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-monaco-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
                <BlurredCard className="overflow-hidden rounded-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1536364127590-1594e3161294?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                    alt="Car enthusiasts" 
                    className="w-full h-auto rounded-2xl"
                  />
                </BlurredCard>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto a condividere la tua passione?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Registrati ora gratuitamente e inizia a esplorare tutte le funzionalità di CarPassionHub.
            </p>
            <Button 
              size="lg" 
              className="rounded-full px-10 py-6 bg-racing-red hover:bg-racing-red/90 text-white"
              asChild
            >
              <Link to="/auth">
                Inizia Ora
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;

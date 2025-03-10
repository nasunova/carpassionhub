
import { Car, Calendar, Map } from "lucide-react";
import FeatureCard, { Feature } from "./FeatureCard";
import { motion } from "framer-motion";

const features: Feature[] = [
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

const FeaturesSection = () => {
  return (
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
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

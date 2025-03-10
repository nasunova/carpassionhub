
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  
  return (
    <section ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden">
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
  );
};

export default HeroSection;

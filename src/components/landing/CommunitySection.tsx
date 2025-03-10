
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BlurredCard } from "@/components/ui/BlurredCard";

const CommunitySection = () => {
  return (
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
  );
};

export default CommunitySection;

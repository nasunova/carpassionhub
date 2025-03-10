
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
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
  );
};

export default CTASection;

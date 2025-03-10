
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BlurredCard } from "@/components/ui/BlurredCard";
import { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  color: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
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
  );
};

export default FeatureCard;

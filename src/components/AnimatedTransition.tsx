
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedTransitionProps {
  children: ReactNode;
}

const AnimatedTransition = ({ children }: AnimatedTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedTransition;

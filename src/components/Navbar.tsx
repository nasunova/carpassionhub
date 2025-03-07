
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Car,
  Calendar,
  Map,
  User,
  Menu,
  X,
  LogIn,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Garage", path: "/garage", icon: Car },
    { name: "Eventi", path: "/events", icon: Calendar },
    { name: "Strade", path: "/roads", icon: Map },
    { name: "Profilo", path: "/profile", icon: User },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
          scrolled
            ? "bg-white/80 dark:bg-carbon/80 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2 font-bold text-2xl text-racing-red"
          >
            <span className="relative">
              CarPassionHub
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-racing-red rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={isActive(link.path) ? "default" : "ghost"}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300",
                    isActive(link.path)
                      ? "bg-racing-red text-white"
                      : "hover:bg-muted"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Button>
              </Link>
            ))}
            <Link to="/auth">
              <Button variant="outline" className="ml-2 rounded-full px-4 flex items-center space-x-2">
                <LogIn className="w-4 h-4" />
                <span>Accedi</span>
              </Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      {/* Mobile navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 pt-20 bg-white/95 dark:bg-carbon/95 backdrop-blur-md md:hidden"
          >
            <nav className="flex flex-col items-center space-y-6 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 w-full justify-center rounded-lg transition-all duration-300",
                    isActive(link.path)
                      ? "bg-racing-red text-white"
                      : "hover:bg-muted"
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="text-lg">{link.name}</span>
                </Link>
              ))}
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 w-full justify-center rounded-lg border border-racing-red text-racing-red hover:bg-racing-red/10 transition-all duration-300"
              >
                <LogIn className="w-5 h-5" />
                <span className="text-lg">Accedi</span>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Helper function imported from utils
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

export default Navbar;

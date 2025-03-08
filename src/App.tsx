
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense, lazy, useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { setupProfilesTable } from "@/lib/supabase";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Lazy-loaded pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Garage = lazy(() => import("./pages/Garage"));
const Events = lazy(() => import("./pages/Events"));
const Roads = lazy(() => import("./pages/Roads"));
const Profile = lazy(() => import("./pages/Profile"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading component
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-muted border-t-racing-red rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Ensure components are initialized properly before rendering
  useEffect(() => {
    // Initialize Supabase tables
    const initSupabase = async () => {
      await setupProfilesTable();
    };
    
    // Add a small delay to ensure DOM is fully loaded
    const timer = setTimeout(async () => {
      try {
        await initSupabase();
      } catch (error) {
        console.error("Error initializing Supabase:", error);
      } finally {
        setIsInitialized(true);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isInitialized) {
    return <PageLoading />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow pt-20">
                <AnimatePresence mode="wait">
                  <Suspense fallback={<PageLoading />}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/garage" element={<Garage />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/roads" element={<Roads />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </motion.div>
                  </Suspense>
                </AnimatePresence>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

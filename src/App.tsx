
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
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

// Layout component that includes Navbar and Footer
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow pt-20">{children}</main>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Layout>
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
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

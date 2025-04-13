
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { MusicPlayer } from "./components/audio/MusicPlayer";
import { useBeatsStore, useFetchBeats } from "./hooks/useBeatsStore";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const { currentBeat, setCurrentBeat } = useBeatsStore();
  
  // Initialize beats from Supabase
  useFetchBeats();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Fixed Music Player */}
          {currentBeat && (
            <div className="mb-16 md:mb-24">
              <MusicPlayer currentBeat={currentBeat} onClose={() => setCurrentBeat(null)} />
            </div>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

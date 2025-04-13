
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface Beat {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  duration: number; // in seconds
  coverArt: string;
  audioUrl: string;
  dateCreated: Date;
  isPublished: boolean;
}

interface BeatsStore {
  beats: Beat[];
  currentBeat: Beat | null;
  isPlayerOpen: boolean;
  isLoading: boolean;
  error: string | null;
  fetchBeats: () => Promise<void>;
  addBeat: (beat: Beat) => void;
  updateBeat: (id: string, updatedBeat: Partial<Beat>) => void;
  deleteBeat: (id: string) => void;
  setCurrentBeat: (beat: Beat | null) => void;
  togglePlayer: (open?: boolean) => void;
}

// Sample data for beats as fallback
const sampleBeats: Beat[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Beat Alchemy',
    genre: 'Hip Hop',
    bpm: 95,
    duration: 183,
    coverArt: '/images/beat-cover-1.jpg',
    audioUrl: '/audio/beat-1.mp3',
    dateCreated: new Date('2024-03-15'),
    isPublished: true
  },
  {
    id: '2',
    title: 'Urban Flow',
    artist: 'Beat Alchemy',
    genre: 'Trap',
    bpm: 140,
    duration: 215,
    coverArt: '/images/beat-cover-2.jpg',
    audioUrl: '/audio/beat-2.mp3',
    dateCreated: new Date('2024-02-22'),
    isPublished: true
  },
  {
    id: '3',
    title: 'Ethereal Vibes',
    artist: 'Beat Alchemy',
    genre: 'Ambient',
    bpm: 80,
    duration: 197,
    coverArt: '/images/beat-cover-3.jpg',
    audioUrl: '/audio/beat-3.mp3',
    dateCreated: new Date('2024-01-05'),
    isPublished: true
  },
  {
    id: '4',
    title: 'Street Anthem',
    artist: 'Beat Alchemy',
    genre: 'Hip Hop',
    bpm: 100,
    duration: 224,
    coverArt: '/images/beat-cover-4.jpg',
    audioUrl: '/audio/beat-4.mp3',
    dateCreated: new Date('2023-12-12'),
    isPublished: true
  },
  {
    id: '5',
    title: 'Future Bass',
    artist: 'Beat Alchemy',
    genre: 'Electronic',
    bpm: 150,
    duration: 208,
    coverArt: '/images/beat-cover-5.jpg',
    audioUrl: '/audio/beat-5.mp3',
    dateCreated: new Date('2023-11-30'),
    isPublished: true
  },
  {
    id: '6',
    title: 'Slow Burn',
    artist: 'Beat Alchemy',
    genre: 'R&B',
    bpm: 70,
    duration: 240,
    coverArt: '/images/beat-cover-6.jpg',
    audioUrl: '/audio/beat-6.mp3',
    dateCreated: new Date('2023-10-22'),
    isPublished: false
  }
];

export const useBeatsStore = create<BeatsStore>((set, get) => ({
  beats: sampleBeats,
  currentBeat: null,
  isPlayerOpen: false,
  isLoading: false,
  error: null,

  fetchBeats: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('beats')
        .select('*')
        .order('date_created', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        const formattedBeats: Beat[] = data.map(beat => ({
          id: beat.id,
          title: beat.title,
          artist: beat.artist,
          genre: beat.genre,
          bpm: beat.bpm,
          duration: Number(beat.duration),
          coverArt: beat.cover_art_url || '/images/beat-cover-1.jpg',
          audioUrl: beat.audio_url || '/audio/beat-1.mp3',
          dateCreated: new Date(beat.date_created),
          isPublished: beat.is_published
        }));

        set({ beats: formattedBeats });
      }
    } catch (error) {
      console.error('Error fetching beats:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to fetch beats' });
    } finally {
      set({ isLoading: false });
    }
  },

  addBeat: (beat) => set((state) => ({ 
    beats: [beat, ...state.beats] 
  })),

  updateBeat: (id, updatedBeat) => set((state) => ({ 
    beats: state.beats.map(beat => 
      beat.id === id ? { ...beat, ...updatedBeat } : beat
    ),
    // If we're updating the current beat, update it there too
    currentBeat: state.currentBeat?.id === id 
      ? { ...state.currentBeat, ...updatedBeat }
      : state.currentBeat
  })),

  deleteBeat: (id) => set((state) => ({ 
    beats: state.beats.filter(beat => beat.id !== id),
    // If we're deleting the current beat, clear it
    currentBeat: state.currentBeat?.id === id ? null : state.currentBeat,
    isPlayerOpen: state.currentBeat?.id === id ? false : state.isPlayerOpen
  })),

  setCurrentBeat: (beat) => set({ 
    currentBeat: beat,
    isPlayerOpen: beat !== null
  }),

  togglePlayer: (open) => set((state) => ({ 
    isPlayerOpen: open !== undefined ? open : !state.isPlayerOpen 
  })),
}));

// Custom hook to initialize beats from Supabase when the app loads
export const useFetchBeats = () => {
  const { fetchBeats } = useBeatsStore();
  
  useEffect(() => {
    fetchBeats();
  }, [fetchBeats]);
};

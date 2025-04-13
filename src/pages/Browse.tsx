
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Play, Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useBeatsStore, useFetchBeats } from '@/hooks/useBeatsStore';
import { formatTime } from '@/lib/utils';

const Browse = () => {
  const { beats, setCurrentBeat, isLoading, error } = useBeatsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('newest');
  
  // Initialize data from Supabase
  useFetchBeats();
  
  // Extract unique genres from beats
  const genres = ['all', ...Array.from(new Set(beats.map(beat => beat.genre.toLowerCase())))];
  
  // Filter and sort beats
  const filteredBeats = beats
    .filter(beat => beat.isPublished)
    .filter(beat => {
      const matchesSearch = beat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          beat.artist.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = genreFilter === 'all' || beat.genre.toLowerCase() === genreFilter;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
      } else if (sortOrder === 'bpm-asc') {
        return a.bpm - b.bpm;
      } else if (sortOrder === 'bpm-desc') {
        return b.bpm - a.bpm;
      }
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24">
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Browse Beats</h1>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder="Search beats by name or artist..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={genreFilter} onValueChange={setGenreFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre.charAt(0).toUpperCase() + genre.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="bpm-asc">BPM (Low to High)</SelectItem>
                    <SelectItem value="bpm-desc">BPM (High to Low)</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon">
                  <SlidersHorizontal size={18} />
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Loading beats...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-destructive">
                <p className="text-lg font-medium mb-2">Something went wrong</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : filteredBeats.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-medium mb-2">No beats found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="bg-secondary rounded-lg p-4 hidden md:grid grid-cols-12 gap-4 text-muted-foreground">
                  <div className="col-span-5">Title</div>
                  <div className="col-span-2">Genre</div>
                  <div className="col-span-1 text-center">BPM</div>
                  <div className="col-span-2 text-center">Length</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                
                {filteredBeats.map((beat) => (
                  <div 
                    key={beat.id}
                    className="bg-secondary hover:bg-secondary/80 rounded-lg p-4 transition-colors"
                  >
                    {/* Mobile View */}
                    <div className="md:hidden space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{beat.title}</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8" 
                          onClick={() => setCurrentBeat(beat)}
                        >
                          <Play size={16} />
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">{beat.artist}</div>
                      <div className="flex justify-between text-sm">
                        <span>{beat.genre}</span>
                        <span>{beat.bpm} BPM</span>
                        <span>{formatTime(beat.duration)}</span>
                      </div>
                    </div>
                    
                    {/* Desktop View */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5 flex items-center space-x-3">
                        <div className="h-10 w-10 bg-background rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={beat.coverArt} 
                            alt={beat.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{beat.title}</h3>
                          <p className="text-sm text-muted-foreground">{beat.artist}</p>
                        </div>
                      </div>
                      <div className="col-span-2 text-muted-foreground">{beat.genre}</div>
                      <div className="col-span-1 text-center text-muted-foreground">{beat.bpm}</div>
                      <div className="col-span-2 text-center text-muted-foreground">{formatTime(beat.duration)}</div>
                      <div className="col-span-2 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8"
                          onClick={() => setCurrentBeat(beat)}
                        >
                          <Play size={16} className="mr-1" /> Play
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Browse;

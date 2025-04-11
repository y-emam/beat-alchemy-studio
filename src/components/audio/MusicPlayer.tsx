
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack, Volume2, Volume1, VolumeX } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface MusicPlayerProps {
  currentBeat: Beat | null;
  onClose: () => void;
}

export const MusicPlayer = ({ currentBeat, onClose }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (currentBeat) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setCurrentTime(0);
      }
      
      const audio = new Audio(currentBeat.audioUrl);
      audioRef.current = audio;
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
      
      audio.volume = volume;
      
      return () => {
        audio.pause();
        audio.removeEventListener('loadedmetadata', () => {});
        audio.removeEventListener('timeupdate', () => {});
        audio.removeEventListener('ended', () => {});
      };
    }
  }, [currentBeat]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10);
    }
  };

  const handleSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  if (!currentBeat) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border p-4 z-40 animate-slide-up">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center space-x-4 min-w-[240px]">
          <div className="h-16 w-16 bg-secondary rounded-md overflow-hidden">
            <img 
              src={currentBeat.coverArt} 
              alt={currentBeat.title} 
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-medium text-foreground">{currentBeat.title}</h4>
            <p className="text-sm text-muted-foreground">{currentBeat.artist}</p>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex justify-center items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSkipBackward}
            >
              <SkipBack size={20} />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-10 w-10 rounded-full"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSkipForward}
            >
              <SkipForward size={20} />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground w-12 text-right">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleTimeChange}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-12">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 min-w-[140px]">
          <VolumeIcon />
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

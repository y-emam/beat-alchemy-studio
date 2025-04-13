import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Play,
  Heart,
  Award,
  Music,
  Headphones,
  Users,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useBeatsStore } from "@/hooks/useBeatsStore";

const Index = () => {
  const { beats, setCurrentBeat } = useBeatsStore();

  // Get featured beats (top 3 published beats)
  const featuredBeats = beats.filter((beat) => beat.isPublished).slice(0, 3);

  // Animated waveform bars for hero section
  const WaveformAnimation = () => (
    <div className="flex items-end h-12 mx-auto my-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className={`waveform-bar h-${Math.ceil(
            Math.random() * 12
          )} animate-waveform-${(i % 5) + 1}`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-background via-background to-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Crafting{" "}
                <span className="text-primary">Sonic Masterpieces</span> for
                Modern Artists
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Premium beats crafted with precision. Elevate your sound with
                Beat Alchemy's professionally engineered productions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to="/browse">
                    Browse Beats <ArrowRight className="ml-2" size={16} />
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary border border-primary/20 shadow-xl shadow-primary/10">
                  <img
                    src="/images/hero-img.jpg"
                    alt="Beat production"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-primary rounded-full p-6 shadow-lg">
                  <WaveformAnimation />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mb-4">
                <Music size={32} className="text-primary" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold">100+</h3>
              <p className="text-muted-foreground">Beats Produced</p>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mb-4">
                <Headphones size={32} className="text-primary" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold">1M+</h3>
              <p className="text-muted-foreground">Spotify Streams</p>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mb-4">
                <Users size={32} className="text-primary" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold">50+</h3>
              <p className="text-muted-foreground">Artist Collaborations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Beats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Featured Beats</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {featuredBeats.map((beat) => (
              <div key={beat.id} className="beat-card">
                <div className="beat-card-cover">
                  <img
                    src={beat.coverArt}
                    alt={beat.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Button
                      variant="default"
                      size="icon"
                      className="rounded-full"
                      onClick={() => setCurrentBeat(beat)}
                    >
                      <Play />
                    </Button>
                  </div>
                </div>

                <div className="beat-card-content">
                  <h3 className="beat-card-title">{beat.title}</h3>
                  <p className="beat-card-artist">{beat.artist}</p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-muted-foreground">
                      {beat.genre} • {beat.bpm} BPM
                    </span>
                    <Button variant="ghost" size="icon">
                      <Heart size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button size="lg" asChild>
              <Link to="/browse">
                View All Beats <ArrowRight className="ml-2" size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h2 className="section-title">Professional Experience</h2>
              <p className="text-lg text-muted-foreground">
                With over 10 years of production experience, Beat Alchemy has
                worked with major artists across the industry. Our beats have
                been featured in chart-topping albums, commercials, and video
                games.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Award size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Grammy-Nominated Productions
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Our beats have been featured in Grammy-nominated albums
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Music size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Industry Standard Quality</h4>
                    <p className="text-sm text-muted-foreground">
                      Professional mixing and mastering for every beat
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Headphones size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Streaming Success</h4>
                    <p className="text-sm text-muted-foreground">
                      Over 1 million streams across major platforms
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src="/images/studio-session.jpg"
                    alt="Studio session"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden mt-8">
                  <img
                    src="/images/production-equipment.jpg"
                    alt="Production equipment"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden -mt-8">
                  <img
                    src="/images/mixing-device.jpg"
                    alt="Mixing console"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src="/images/artist-collaboration.jpg"
                    alt="Artist collaboration"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Elevate Your Sound?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our premium beats collection and find the perfect sound for
            your next hit.
          </p>
          <Button size="lg" asChild>
            <Link to="/browse">Browse Beats</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

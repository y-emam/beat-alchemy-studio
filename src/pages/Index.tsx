import { useRef } from "react";
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

// Import animation library
import { motion, useScroll, useTransform } from "framer-motion";

const Index = () => {
  const { beats, setCurrentBeat } = useBeatsStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  // Create animation values based on scroll
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
    <div className="min-h-screen flex flex-col relative" ref={scrollRef}>
      <Header />

      {/* Hero Section with Parallax */}
      <motion.section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-background via-background to-secondary relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              className="md:w-1/2 space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
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
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="md:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              <div className="relative w-full max-w-md">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary border border-primary/20 shadow-xl shadow-primary/10">
                  <motion.img
                    style={{ y: backgroundY }}
                    src="/images/hero-img.jpg"
                    alt="Beat production"
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div
                  className="absolute -bottom-4 -right-4 bg-primary rounded-full p-6 shadow-lg"
                  animate={{
                    boxShadow: [
                      "0px 0px 8px rgba(124, 58, 237, 0.2)",
                      "0px 0px 16px rgba(124, 58, 237, 0.6)",
                      "0px 0px 8px rgba(124, 58, 237, 0.2)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <WaveformAnimation />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-16 bg-secondary relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              className="space-y-2"
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mb-4">
                <Music size={32} className="text-primary" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold">100+</h3>
              <p className="text-muted-foreground">Beats Produced</p>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mb-4">
                <Headphones size={32} className="text-primary" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold">1M+</h3>
              <p className="text-muted-foreground">Spotify Streams</p>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mb-4">
                <Users size={32} className="text-primary" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold">50+</h3>
              <p className="text-muted-foreground">Artist Collaborations</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Beats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            className="section-title"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Featured Beats
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {featuredBeats.map((beat, index) => (
              <motion.div
                key={beat.id}
                className="beat-card"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
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
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-10 text-center"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Button size="lg" asChild>
              <Link to="/browse">
                View All Beats <ArrowRight className="ml-2" size={16} />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <motion.section
        className="py-16 bg-secondary relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Background gradient motion */}
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent"
          style={{ scale: 1.5 }}
          animate={{
            rotate: [0, 360],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              className="md:w-1/2 space-y-6"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title">Professional Experience</h2>
              <p className="text-lg text-muted-foreground">
                With over 10 years of production experience, Beat Alchemy has
                worked with major artists across the industry. Our beats have
                been featured in chart-topping albums, commercials, and video
                games.
              </p>

              <div className="space-y-4">
                <motion.div
                  className="flex items-center space-x-4"
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
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
                </motion.div>

                <motion.div
                  className="flex items-center space-x-4"
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Music size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Industry Standard Quality</h4>
                    <p className="text-sm text-muted-foreground">
                      Professional mixing and mastering for every beat
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center space-x-4"
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Headphones size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Streaming Success</h4>
                    <p className="text-sm text-muted-foreground">
                      Over 1 million streams across major platforms
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="md:w-1/2"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="aspect-square rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src="/images/studio-session.jpg"
                    alt="Studio session"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div
                  className="aspect-square rounded-lg overflow-hidden mt-8"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src="/images/production-equipment.jpg"
                    alt="Production equipment"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div
                  className="aspect-square rounded-lg overflow-hidden -mt-8"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src="/images/mixing-device.jpg"
                    alt="Mixing console"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div
                  className="aspect-square rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src="/images/artist-collaboration.jpg"
                    alt="Artist collaboration"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-16 bg-primary/10 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.1) 0%, rgba(0, 0, 0, 0) 70%)",
              "radial-gradient(circle at 60% 30%, rgba(124, 58, 237, 0.1) 0%, rgba(0, 0, 0, 0) 70%)",
              "radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.1) 0%, rgba(0, 0, 0, 0) 70%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Elevate Your Sound?
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Explore our premium beats collection and find the perfect sound for
            your next hit.
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button size="lg" asChild>
              <Link to="/browse">Browse Beats</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Index;

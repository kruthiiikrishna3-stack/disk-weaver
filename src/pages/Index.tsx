import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { InfiniteGrid } from '@/components/ui/InfiniteGrid';
import { AlgorithmCard } from '@/components/ui/AlgorithmCard';
import { HeroDiskPreview } from '@/components/three/HeroDiskPreview';
import { ALGORITHMS } from '@/lib/algorithms/types';
import { Button } from '@/components/ui/button';
import { Play, BookOpen, BarChart3, Sparkles, Cpu, GraduationCap } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: '3D Visualization',
    description: 'Interactive Three.js disk animation with real-time head movement tracking',
  },
  {
    icon: GraduationCap,
    title: 'VTU-Style Theory',
    description: 'Comprehensive theory sections with examples, formulas, and previous year questions',
  },
  {
    icon: Cpu,
    title: 'Algorithm Comparison',
    description: 'Compare all 6 algorithms side-by-side with performance metrics',
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <InfiniteGrid />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm text-primary font-medium">Interactive Learning Tool</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-foreground">Disk Scheduling</span>
                <br />
                <span className="text-gradient-primary">Algorithm Visualizer</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Master Operating System concepts with interactive 3D simulations. 
                Explore FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK algorithms 
                through beautiful visualizations and VTU-style theory.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link to="/simulator">
                  <Button size="lg" className="gap-2 glow-blue">
                    <Play className="w-5 h-5" />
                    Launch Simulator
                  </Button>
                </Link>
                <Link to="/theory">
                  <Button size="lg" variant="outline" className="gap-2">
                    <BookOpen className="w-5 h-5" />
                    Read Theory
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            {/* Right - 3D Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative h-[350px] lg:h-[450px]"
            >
              <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
              <HeroDiskPreview />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to understand disk scheduling algorithms
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 rounded-xl hover-lift"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Algorithms Grid */}
      <section className="relative py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Explore Algorithms
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Click on any algorithm to learn the theory, see examples, and run simulations
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALGORITHMS.map((algorithm, index) => (
              <AlgorithmCard key={algorithm.id} algorithm={algorithm} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-8 md:p-12 rounded-2xl text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Compare?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Run all algorithms on the same request queue and see which performs best
              </p>
              <Link to="/compare">
                <Button size="lg" className="gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Compare Algorithms
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Built for Computer Science students • VTU Curriculum 2021 Scheme
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            Created by Kruthi Krishna & Bhavya Chawat
          </p>
        </div>
      </footer>
    </div>
  );
}

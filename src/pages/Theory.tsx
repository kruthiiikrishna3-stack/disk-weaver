import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { InfiniteGrid } from '@/components/ui/InfiniteGrid';
import { ALGORITHMS } from '@/lib/algorithms/types';
import { ArrowRight, Clock, Zap, TrendingUp, RotateCcw, ArrowUpRight } from 'lucide-react';

const iconMap = {
  fcfs: Clock,
  sstf: Zap,
  scan: ArrowRight,
  cscan: RotateCcw,
  look: TrendingUp,
  clook: ArrowUpRight,
};

export default function Theory() {
  return (
    <div className="min-h-screen bg-background relative">
      <InfiniteGrid />
      <Navbar />
      
      <main className="relative pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Algorithm Theory
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive VTU-style theory with definitions, examples, formulas, 
              and previous year questions for each disk scheduling algorithm
            </p>
          </motion.div>

          {/* Algorithm List */}
          <div className="space-y-4">
            {ALGORITHMS.map((algorithm, index) => {
              const Icon = iconMap[algorithm.id];
              
              return (
                <motion.div
                  key={algorithm.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/theory/${algorithm.id}`} className="block group">
                    <div className="glass p-6 rounded-xl glass-hover">
                      <div className="flex items-center gap-6">
                        {/* Icon */}
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-7 h-7 text-primary" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-bold text-foreground">
                              {algorithm.name}
                            </h2>
                            <span className="text-xs font-mono bg-secondary/50 px-2 py-0.5 rounded text-muted-foreground">
                              {algorithm.complexity}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {algorithm.fullName}
                          </p>
                          <p className="text-sm text-muted-foreground/80 line-clamp-1">
                            {algorithm.description}
                          </p>
                        </div>
                        
                        {/* Arrow */}
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Study Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 glass p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              📚 Study Tips
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Start with FCFS to understand basic concepts, then progress to more complex algorithms
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Practice numerical problems - they appear frequently in VTU exams
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Use the simulator to visualize each algorithm before attempting problems
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Focus on understanding the trade-offs between algorithms for comparison questions
              </li>
            </ul>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlgorithmInfo } from '@/lib/algorithms/types';
import { Clock, Zap, ArrowRight, TrendingUp, RotateCcw, ArrowUpRight } from 'lucide-react';

interface AlgorithmCardProps {
  algorithm: AlgorithmInfo;
  index: number;
}

const iconMap = {
  fcfs: Clock,
  sstf: Zap,
  scan: ArrowRight,
  cscan: RotateCcw,
  look: TrendingUp,
  clook: ArrowUpRight,
};

const colorClasses = {
  blue: {
    icon: 'text-primary',
    glow: 'group-hover:shadow-primary/30',
    border: 'group-hover:border-primary/50',
    bg: 'bg-primary/10',
  },
  cyan: {
    icon: 'text-accent',
    glow: 'group-hover:shadow-accent/30',
    border: 'group-hover:border-accent/50',
    bg: 'bg-accent/10',
  },
  orange: {
    icon: 'text-orange',
    glow: 'group-hover:shadow-orange/30',
    border: 'group-hover:border-orange/50',
    bg: 'bg-orange/10',
  },
  green: {
    icon: 'text-success',
    glow: 'group-hover:shadow-success/30',
    border: 'group-hover:border-success/50',
    bg: 'bg-success/10',
  },
};

export function AlgorithmCard({ algorithm, index }: AlgorithmCardProps) {
  const Icon = iconMap[algorithm.id];
  const colors = colorClasses[algorithm.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/theory/${algorithm.id}`} className="block group">
        <div className={`algo-card p-6 h-full ${colors.border} ${colors.glow} group-hover:shadow-2xl`}>
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-1">
            {algorithm.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {algorithm.fullName}
          </p>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground/80 mb-4 line-clamp-2">
            {algorithm.description}
          </p>
          
          {/* Complexity badge */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono bg-secondary/50 px-2 py-1 rounded text-muted-foreground">
              {algorithm.complexity}
            </span>
            <span className={`text-sm ${colors.icon} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
              Learn more <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

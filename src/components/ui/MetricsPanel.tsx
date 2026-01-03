import { motion } from 'framer-motion';
import { AlgorithmResult } from '@/lib/algorithms/types';
import { Activity, Clock, TrendingDown, Zap } from 'lucide-react';

interface MetricsPanelProps {
  result: AlgorithmResult | null;
  currentStep: number;
}

export function MetricsPanel({ result, currentStep }: MetricsPanelProps) {
  if (!result) return null;

  const metrics = [
    {
      label: 'Algorithm',
      value: result.name,
      icon: Activity,
      color: 'text-primary',
    },
    {
      label: 'Total Seek Time',
      value: `${result.totalSeekTime} tracks`,
      icon: Clock,
      color: 'text-accent',
    },
    {
      label: 'Average Seek',
      value: `${result.averageSeekTime.toFixed(1)} tracks`,
      icon: TrendingDown,
      color: 'text-success',
    },
    {
      label: 'Total Steps',
      value: result.steps.length,
      icon: Zap,
      color: 'text-orange',
    },
  ];

  return (
    <div className="metrics-panel">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col gap-1"
          >
            <div className="flex items-center gap-2">
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
              <span className="text-xs text-muted-foreground">{metric.label}</span>
            </div>
            <span className="text-lg font-bold text-foreground">
              {metric.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Current step info */}
      {currentStep >= 0 && currentStep < result.steps.length && (
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-4 pt-4 border-t border-border/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {result.steps.length}
            </span>
            <span className="text-sm font-mono">
              <span className="text-accent">{result.steps[currentStep].from}</span>
              <span className="text-muted-foreground mx-2">→</span>
              <span className="text-success">{result.steps[currentStep].to}</span>
              <span className="text-muted-foreground ml-2">
                ({result.steps[currentStep].distance} tracks)
              </span>
            </span>
          </div>
        </motion.div>
      )}

      {/* Seek sequence */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <span className="text-xs text-muted-foreground mb-2 block">Seek Sequence:</span>
        <div className="flex flex-wrap gap-1">
          {result.sequence.map((track, index) => (
            <span
              key={index}
              className={`text-xs font-mono px-2 py-0.5 rounded ${
                index === 0
                  ? 'bg-primary/20 text-primary'
                  : index <= currentStep + 1
                  ? 'bg-success/20 text-success'
                  : 'bg-secondary/50 text-muted-foreground'
              }`}
            >
              {track}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

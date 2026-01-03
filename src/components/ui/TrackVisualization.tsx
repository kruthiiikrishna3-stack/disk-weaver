import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlgorithmResult } from '@/lib/algorithms/types';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from './button';

interface TrackVisualizationProps {
  result: AlgorithmResult | null;
  totalTracks: number;
  currentStep: number;
  algorithmId: string;
}

// Color palette for arrows
const STEP_COLORS = [
  '#F97316', // orange
  '#EC4899', // pink
  '#8B5CF6', // purple
  '#10B981', // green
  '#06B6D4', // cyan
  '#3B82F6', // blue
  '#EAB308', // yellow
  '#EF4444', // red
  '#14B8A6', // teal
  '#A855F7', // violet
];

export function TrackVisualization({ result, totalTracks, currentStep, algorithmId }: TrackVisualizationProps) {
  const chartData = useMemo(() => {
    if (!result || result.steps.length === 0) return null;

    // Get all tracks in sequence for x-axis positioning
    const allTracks = [...new Set(result.sequence)].sort((a, b) => a - b);
    
    // Calculate step data
    const steps = result.steps.map((step, index) => ({
      ...step,
      stepNumber: index + 1,
      color: STEP_COLORS[index % STEP_COLORS.length],
    }));

    return { uniqueTracks: allTracks, steps };
  }, [result]);

  if (!chartData || !result) {
    return (
      <div className="glass p-6 rounded-xl">
        <p className="text-muted-foreground text-center">Run simulation to see track visualization</p>
      </div>
    );
  }

  const chartWidth = 1000;
  const chartHeight = Math.max(350, (result.steps.length + 2) * 40);
  const padding = { left: 50, right: 50, top: 50, bottom: 30 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // X position for a track number
  const getX = (track: number) => {
    return padding.left + (track / (totalTracks - 1)) * plotWidth;
  };

  // Y position for a step (0 = start at top)
  const getY = (stepIndex: number) => {
    const totalSteps = result.steps.length + 1;
    return padding.top + ((stepIndex + 1) / (totalSteps + 0.5)) * plotHeight;
  };

  // Show all steps, highlight current one
  const visibleSteps = chartData.steps;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Enhanced Track Visualization</h2>
        <Link to={`/theory/${algorithmId}`}>
          <Button variant="default" size="sm" className="gap-2">
            <BookOpen className="w-4 h-4" />
            View Theory
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto bg-card/50 rounded-lg p-4">
        <svg 
          width={chartWidth}
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="min-w-[800px]"
        >
          {/* Defs for glows and gradients */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            {visibleSteps.map((step, idx) => (
              <linearGradient key={`grad-${idx}`} id={`arrow-gradient-${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={step.color} stopOpacity="0.6" />
                <stop offset="50%" stopColor={step.color} stopOpacity="1" />
                <stop offset="100%" stopColor={step.color} stopOpacity="0.8" />
              </linearGradient>
            ))}
          </defs>

          {/* Track position vertical lines */}
          {chartData.uniqueTracks.map((track) => (
            <g key={`track-${track}`}>
              <line
                x1={getX(track)}
                y1={padding.top - 15}
                x2={getX(track)}
                y2={chartHeight - padding.bottom + 10}
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.4"
              />
              <text
                x={getX(track)}
                y={padding.top - 25}
                textAnchor="middle"
                fill="hsl(var(--foreground))"
                fontSize="13"
                fontWeight="600"
              >
                {track}
              </text>
            </g>
          ))}

          {/* Starting point */}
          <g filter="url(#glow)">
            <circle
              cx={getX(result.sequence[0])}
              cy={getY(-1)}
              r="20"
              fill="#F97316"
            />
            <circle
              cx={getX(result.sequence[0])}
              cy={getY(-1)}
              r="20"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={getX(result.sequence[0])}
              y={getY(-1) + 5}
              textAnchor="middle"
              fill="white"
              fontSize="14"
              fontWeight="bold"
            >
              0
            </text>
          </g>
          <text
            x={getX(result.sequence[0])}
            y={getY(-1) + 35}
            textAnchor="middle"
            fill="hsl(var(--accent))"
            fontSize="12"
            fontWeight="bold"
          >
            Start
          </text>

          {/* Arrows for each step */}
          {visibleSteps.map((step, index) => {
            const fromX = getX(step.from);
            const toX = getX(step.to);
            const y = getY(index);
            const isHighlighted = index === currentStep;
            const goingRight = step.to > step.from;

            // Calculate arrow path
            const arrowLen = Math.abs(toX - fromX);
            const arrowHeadSize = 10;
            const endX = goingRight ? toX - arrowHeadSize : toX + arrowHeadSize;

            return (
              <motion.g
                key={`step-${index}`}
                initial={{ opacity: 0, x: goingRight ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
              >
                {/* Arrow line with glow */}
                <line
                  x1={fromX}
                  y1={y}
                  x2={endX}
                  y2={y}
                  stroke={step.color}
                  strokeWidth={isHighlighted ? 4 : 3}
                  strokeLinecap="round"
                  filter={isHighlighted ? "url(#glow)" : undefined}
                  opacity={isHighlighted ? 1 : 0.85}
                />

                {/* Arrow head */}
                <polygon
                  points={
                    goingRight
                      ? `${toX},${y} ${toX - arrowHeadSize},${y - 6} ${toX - arrowHeadSize},${y + 6}`
                      : `${toX},${y} ${toX + arrowHeadSize},${y - 6} ${toX + arrowHeadSize},${y + 6}`
                  }
                  fill={step.color}
                  filter={isHighlighted ? "url(#glow)" : undefined}
                />

                {/* Distance label */}
                <g>
                  <rect
                    x={(fromX + toX) / 2 - 40}
                    y={y - 28}
                    width="80"
                    height="22"
                    rx="11"
                    fill="hsl(var(--card))"
                    stroke={step.color}
                    strokeWidth="1.5"
                  />
                  <text
                    x={(fromX + toX) / 2}
                    y={y - 13}
                    textAnchor="middle"
                    fill="hsl(var(--foreground))"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {step.distance} tracks
                  </text>
                </g>

                {/* End position circle */}
                <circle
                  cx={toX}
                  cy={y}
                  r={isHighlighted ? 18 : 16}
                  fill={step.color}
                  filter={isHighlighted ? "url(#glow)" : undefined}
                />
                <circle
                  cx={toX}
                  cy={y}
                  r={isHighlighted ? 18 : 16}
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={toX}
                  y={y + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {index + 1}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Footer stats */}
      <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-border/50 text-sm gap-2">
        <span className="text-muted-foreground">
          Track Range: <span className="text-foreground font-medium">0 - {totalTracks - 1} tracks</span>
        </span>
        <span className="text-muted-foreground">
          Total Distance: <span className="text-orange font-bold text-base">{result.totalSeekTime} tracks</span>
        </span>
        <span className="text-muted-foreground">
          Algorithm: <span className="text-accent font-medium">{result.name}</span>
        </span>
      </div>
    </motion.div>
  );
}

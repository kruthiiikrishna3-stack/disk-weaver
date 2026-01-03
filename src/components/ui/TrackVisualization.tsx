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

// Color palette for arrows (matching the reference image)
const STEP_COLORS = [
  '#F97316', // orange - step 1
  '#EC4899', // pink - step 2
  '#8B5CF6', // purple - step 3
  '#10B981', // green - step 4
  '#06B6D4', // cyan - step 5
  '#3B82F6', // blue - step 6
  '#EAB308', // yellow - step 7
  '#EF4444', // red - step 8
  '#14B8A6', // teal - step 9
  '#A855F7', // violet - step 10
];

export function TrackVisualization({ result, totalTracks, currentStep, algorithmId }: TrackVisualizationProps) {
  const { uniqueTracks, stepData, chartWidth, chartHeight } = useMemo(() => {
    if (!result) return { uniqueTracks: [], stepData: [], chartWidth: 0, chartHeight: 0 };

    // Get unique track positions for x-axis
    const allTracks = [...new Set(result.sequence)].sort((a, b) => a - b);
    
    // Calculate step data with positions
    const steps = result.steps.map((step, index) => ({
      ...step,
      stepNumber: index + 1,
      color: STEP_COLORS[index % STEP_COLORS.length],
    }));

    return {
      uniqueTracks: allTracks,
      stepData: steps,
      chartWidth: 1000,
      chartHeight: 400,
    };
  }, [result]);

  if (!result || stepData.length === 0) {
    return (
      <div className="glass p-6 rounded-xl">
        <p className="text-muted-foreground text-center">Run simulation to see track visualization</p>
      </div>
    );
  }

  const padding = { left: 40, right: 40, top: 60, bottom: 40 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Calculate x position for a track
  const getX = (track: number) => {
    return padding.left + (track / totalTracks) * plotWidth;
  };

  // Calculate y position for a step (inverted so step 0 is at bottom)
  const getY = (stepIndex: number) => {
    const totalSteps = stepData.length + 1;
    return padding.top + ((stepIndex + 1) / totalSteps) * plotHeight;
  };

  // Visible steps based on currentStep
  const visibleSteps = stepData.slice(0, currentStep + 1);

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

      <div className="overflow-x-auto">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full min-w-[800px]"
          style={{ minHeight: '350px' }}
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border/20" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Track position lines (vertical) */}
          {uniqueTracks.map((track) => (
            <g key={track}>
              <line
                x1={getX(track)}
                y1={padding.top - 20}
                x2={getX(track)}
                y2={chartHeight - padding.bottom}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="text-border/40"
              />
              <text
                x={getX(track)}
                y={padding.top - 30}
                textAnchor="middle"
                className="fill-foreground text-sm font-medium"
                fontSize="14"
              >
                {track}
              </text>
            </g>
          ))}

          {/* Starting position marker */}
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <circle
              cx={getX(result.sequence[0])}
              cy={getY(-1) + 20}
              r="18"
              fill="#F97316"
              stroke="#FFF"
              strokeWidth="2"
            />
            <text
              x={getX(result.sequence[0])}
              y={getY(-1) + 25}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
            >
              0
            </text>
            <text
              x={getX(result.sequence[0])}
              y={getY(-1) + 50}
              textAnchor="middle"
              className="fill-accent"
              fontSize="12"
              fontWeight="bold"
            >
              Start
            </text>
          </motion.g>

          {/* Seek arrows and step markers */}
          {visibleSteps.map((step, index) => {
            const startX = getX(step.from);
            const endX = getX(step.to);
            const y = getY(index);
            const color = step.color;
            const isGoingRight = step.to > step.from;
            const arrowOffset = isGoingRight ? -8 : 8;

            return (
              <motion.g
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                {/* Arrow line with gradient */}
                <defs>
                  <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={color} stopOpacity="1" />
                  </linearGradient>
                  <marker
                    id={`arrowhead-${index}`}
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill={color}
                    />
                  </marker>
                </defs>

                {/* Main arrow line */}
                <line
                  x1={startX}
                  y1={y}
                  x2={endX + arrowOffset}
                  y2={y}
                  stroke={`url(#gradient-${index})`}
                  strokeWidth="3"
                  markerEnd={`url(#arrowhead-${index})`}
                />

                {/* Distance label */}
                <rect
                  x={(startX + endX) / 2 - 35}
                  y={y - 25}
                  width="70"
                  height="20"
                  rx="10"
                  fill="hsl(var(--card))"
                  stroke={color}
                  strokeWidth="1"
                />
                <text
                  x={(startX + endX) / 2}
                  y={y - 12}
                  textAnchor="middle"
                  className="fill-foreground"
                  fontSize="11"
                  fontWeight="500"
                >
                  {step.distance} tracks
                </text>

                {/* End position circle */}
                <circle
                  cx={endX}
                  cy={y}
                  r="16"
                  fill={color}
                  stroke="#FFF"
                  strokeWidth="2"
                />
                <text
                  x={endX}
                  y={y + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="11"
                  fontWeight="bold"
                >
                  {index + 1}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Footer info */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50 text-sm">
        <span className="text-muted-foreground">
          Track Range: <span className="text-foreground font-medium">0 - {totalTracks - 1} tracks</span>
        </span>
        <span className="text-muted-foreground">
          Total Distance: <span className="text-orange font-bold">{result.totalSeekTime} tracks</span>
        </span>
        <span className="text-muted-foreground">
          Algorithm: <span className="text-accent font-medium">{result.name}</span>
        </span>
      </div>
    </motion.div>
  );
}

export interface DiskRequest {
  track: number;
  index: number;
}

export interface SeekStep {
  from: number;
  to: number;
  distance: number;
  stepIndex: number;
}

export interface AlgorithmResult {
  name: string;
  fullName: string;
  sequence: number[];
  steps: SeekStep[];
  totalSeekTime: number;
  averageSeekTime: number;
}

export type Direction = 'left' | 'right';

export interface SimulatorConfig {
  algorithm: AlgorithmType;
  initialHead: number;
  requests: number[];
  totalTracks: number;
  direction: Direction;
}

export type AlgorithmType = 'fcfs' | 'sstf' | 'scan' | 'cscan' | 'look' | 'clook';

export interface AlgorithmInfo {
  id: AlgorithmType;
  name: string;
  fullName: string;
  description: string;
  complexity: string;
  color: 'blue' | 'cyan' | 'orange' | 'green';
  pros: string[];
  cons: string[];
}

export const ALGORITHMS: AlgorithmInfo[] = [
  {
    id: 'fcfs',
    name: 'FCFS',
    fullName: 'First Come First Serve',
    description: 'Processes requests in the order they arrive in the queue',
    complexity: 'O(n)',
    color: 'blue',
    pros: ['Simple implementation', 'Fair - no starvation', 'Predictable behavior'],
    cons: ['High seek time', 'No optimization', 'Wild head movements'],
  },
  {
    id: 'sstf',
    name: 'SSTF',
    fullName: 'Shortest Seek Time First',
    description: 'Selects the request closest to current head position',
    complexity: 'O(n²)',
    color: 'cyan',
    pros: ['Low seek time', 'Better throughput', 'Efficient for clustered requests'],
    cons: ['Starvation possible', 'Not optimal', 'Higher overhead'],
  },
  {
    id: 'scan',
    name: 'SCAN',
    fullName: 'Elevator Algorithm',
    description: 'Moves in one direction until the end, then reverses',
    complexity: 'O(n log n)',
    color: 'orange',
    pros: ['No starvation', 'Better than FCFS', 'Uniform wait time'],
    cons: ['Goes to disk end', 'Long wait for edge requests', 'Medium seek time'],
  },
  {
    id: 'cscan',
    name: 'C-SCAN',
    fullName: 'Circular SCAN',
    description: 'Like SCAN but only services in one direction, then jumps back',
    complexity: 'O(n log n)',
    color: 'green',
    pros: ['More uniform wait', 'No starvation', 'Better for heavy loads'],
    cons: ['Extra head movement', 'Jump overhead', 'Complex implementation'],
  },
  {
    id: 'look',
    name: 'LOOK',
    fullName: 'LOOK Algorithm',
    description: 'Like SCAN but reverses at last request instead of disk end',
    complexity: 'O(n log n)',
    color: 'blue',
    pros: ['No wasted movement', 'Better than SCAN', 'No starvation'],
    cons: ['Edge case overhead', 'Variable wait time', 'Medium complexity'],
  },
  {
    id: 'clook',
    name: 'C-LOOK',
    fullName: 'Circular LOOK',
    description: 'Combines C-SCAN and LOOK optimizations',
    complexity: 'O(n log n)',
    color: 'cyan',
    pros: ['Most efficient', 'Uniform service', 'No wasted movement'],
    cons: ['Jump overhead', 'Complex logic', 'Not always optimal'],
  },
];

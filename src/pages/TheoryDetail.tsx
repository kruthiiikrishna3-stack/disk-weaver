import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { InfiniteGrid } from '@/components/ui/InfiniteGrid';
import { Button } from '@/components/ui/button';
import { ALGORITHMS, AlgorithmType } from '@/lib/algorithms/types';
import { Link } from 'react-router-dom';
import { Play, ArrowLeft, ArrowRight, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

// Theory content for each algorithm
const theoryContent: Record<AlgorithmType, {
  definition: string;
  workingPrinciple: string[];
  example: {
    given: string[];
    solution: { step: number; from: number; to: number; distance: number }[];
    total: number;
    average: number;
  };
  formula: string;
  advantages: string[];
  disadvantages: string[];
  complexity: { time: string; space: string; best: string; worst: string };
  vtuQuestions: string[];
}> = {
  fcfs: {
    definition: 'First Come First Serve (FCFS) is the simplest disk scheduling algorithm that processes I/O requests in the order they arrive in the disk queue, without any reordering or optimization. Also known as First In First Out (FIFO) scheduling.',
    workingPrinciple: [
      'Initialize the disk head at the starting position',
      'Receive request queue Q = [q₁, q₂, ..., qₙ]',
      'For each request qᵢ in Q: Move head from current position to qᵢ',
      'Calculate seek time: |qᵢ - current_position|',
      'Update current_position = qᵢ',
      'Calculate total seek time as sum of all movements'
    ],
    example: {
      given: [
        'Initial head position: 53',
        'Request queue: [98, 183, 37, 122, 14, 124, 65, 67]',
        'Total cylinders: 200 (0-199)'
      ],
      solution: [
        { step: 1, from: 53, to: 98, distance: 45 },
        { step: 2, from: 98, to: 183, distance: 85 },
        { step: 3, from: 183, to: 37, distance: 146 },
        { step: 4, from: 37, to: 122, distance: 85 },
        { step: 5, from: 122, to: 14, distance: 108 },
        { step: 6, from: 14, to: 124, distance: 110 },
        { step: 7, from: 124, to: 65, distance: 59 },
        { step: 8, from: 65, to: 67, distance: 2 },
      ],
      total: 640,
      average: 80,
    },
    formula: 'TST = Σ |qᵢ - qᵢ₋₁| for i = 1 to n',
    advantages: [
      'Simplest to implement and understand',
      'Fair - every request serviced in order (no starvation)',
      'Low computational overhead',
      'Predictable and deterministic behavior',
    ],
    disadvantages: [
      'Can result in very high seek times',
      'Does not optimize for disk geometry',
      'Head may traverse entire disk repeatedly ("wild swings")',
      'Poor throughput compared to other algorithms',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
      best: 'O(n)',
      worst: 'O(n)',
    },
    vtuQuestions: [
      'Explain FCFS disk scheduling with an example. Calculate total head movement for requests [95, 180, 34, 119, 11, 123, 62, 64] with initial head at 50. (10 marks, Dec 2022)',
      'Compare FCFS and SSTF disk scheduling algorithms with suitable examples. (8 marks, June 2023)',
      'Write an algorithm for FCFS disk scheduling. Discuss its advantages and disadvantages. (6 marks, Dec 2021)',
    ],
  },
  sstf: {
    definition: 'Shortest Seek Time First (SSTF) selects the pending request closest to the current head position. It minimizes seek time for each individual request but may cause starvation of distant requests.',
    workingPrinciple: [
      'Initialize the disk head at the starting position',
      'Create a list of pending requests',
      'While there are pending requests:',
      '  Find the request with minimum distance from current position',
      '  Move head to that request and service it',
      '  Remove the request from pending list',
      'Calculate total seek time'
    ],
    example: {
      given: [
        'Initial head position: 53',
        'Request queue: [98, 183, 37, 122, 14, 124, 65, 67]',
        'Total cylinders: 200 (0-199)'
      ],
      solution: [
        { step: 1, from: 53, to: 65, distance: 12 },
        { step: 2, from: 65, to: 67, distance: 2 },
        { step: 3, from: 67, to: 37, distance: 30 },
        { step: 4, from: 37, to: 14, distance: 23 },
        { step: 5, from: 14, to: 98, distance: 84 },
        { step: 6, from: 98, to: 122, distance: 24 },
        { step: 7, from: 122, to: 124, distance: 2 },
        { step: 8, from: 124, to: 183, distance: 59 },
      ],
      total: 236,
      average: 29.5,
    },
    formula: 'Select request r where |r - current| is minimum at each step',
    advantages: [
      'Lower average seek time than FCFS',
      'Better throughput',
      'Simple greedy approach',
      'Efficient for clustered requests',
    ],
    disadvantages: [
      'Can cause starvation of distant requests',
      'Not globally optimal',
      'Higher computational overhead O(n²)',
      'Favors middle tracks over edge tracks',
    ],
    complexity: {
      time: 'O(n²)',
      space: 'O(n)',
      best: 'O(n²)',
      worst: 'O(n²)',
    },
    vtuQuestions: [
      'Explain SSTF disk scheduling algorithm. What are its advantages over FCFS? (8 marks, June 2022)',
      'Can SSTF cause starvation? Explain with an example. (5 marks, Dec 2023)',
      'Compare SSTF with SCAN algorithm. Which is better and why? (6 marks, June 2021)',
    ],
  },
  scan: {
    definition: 'SCAN algorithm (also called Elevator Algorithm) moves the disk head in one direction, servicing all requests until it reaches the end of the disk, then reverses direction and services requests going the other way.',
    workingPrinciple: [
      'Start from current head position with given direction',
      'Move head in the current direction',
      'Service all requests in the path',
      'When reaching the end of disk, reverse direction',
      'Continue servicing requests in the reverse direction',
      'Stop when all requests are serviced'
    ],
    example: {
      given: [
        'Initial head position: 53',
        'Request queue: [98, 183, 37, 122, 14, 124, 65, 67]',
        'Direction: Right (increasing)',
        'Total cylinders: 200 (0-199)'
      ],
      solution: [
        { step: 1, from: 53, to: 65, distance: 12 },
        { step: 2, from: 65, to: 67, distance: 2 },
        { step: 3, from: 67, to: 98, distance: 31 },
        { step: 4, from: 98, to: 122, distance: 24 },
        { step: 5, from: 122, to: 124, distance: 2 },
        { step: 6, from: 124, to: 183, distance: 59 },
        { step: 7, from: 183, to: 199, distance: 16 },
        { step: 8, from: 199, to: 37, distance: 162 },
        { step: 9, from: 37, to: 14, distance: 23 },
      ],
      total: 331,
      average: 36.8,
    },
    formula: 'Move in direction d until end, reverse, continue until all serviced',
    advantages: [
      'No starvation - all requests eventually served',
      'Better than FCFS in most cases',
      'More uniform wait time',
      'Simple to implement',
    ],
    disadvantages: [
      'Always goes to disk end (wasteful if no requests there)',
      'Long wait for requests just visited',
      'Not optimal seek time',
      'Edge requests may wait longer',
    ],
    complexity: {
      time: 'O(n log n)',
      space: 'O(n)',
      best: 'O(n log n)',
      worst: 'O(n log n)',
    },
    vtuQuestions: [
      'Explain SCAN disk scheduling with elevator analogy. (6 marks, Dec 2022)',
      'Calculate seek time for SCAN with requests [82, 170, 43, 140, 24, 16, 190] starting at 50, direction right. (10 marks)',
      'Why is SCAN called elevator algorithm? What are its limitations? (5 marks, June 2023)',
    ],
  },
  cscan: {
    definition: 'Circular SCAN (C-SCAN) is a variant of SCAN that provides more uniform wait time. The head moves in one direction only, and when it reaches the end, it immediately returns to the beginning of the disk without servicing requests on the return trip.',
    workingPrinciple: [
      'Start from current head position',
      'Move head in one direction (typically right/increasing)',
      'Service all requests in the path',
      'When reaching the end, jump to the other end',
      'Continue in the same direction',
      'Repeat until all requests are serviced'
    ],
    example: {
      given: [
        'Initial head position: 53',
        'Request queue: [98, 183, 37, 122, 14, 124, 65, 67]',
        'Direction: Right',
        'Total cylinders: 200 (0-199)'
      ],
      solution: [
        { step: 1, from: 53, to: 65, distance: 12 },
        { step: 2, from: 65, to: 67, distance: 2 },
        { step: 3, from: 67, to: 98, distance: 31 },
        { step: 4, from: 98, to: 122, distance: 24 },
        { step: 5, from: 122, to: 124, distance: 2 },
        { step: 6, from: 124, to: 183, distance: 59 },
        { step: 7, from: 183, to: 199, distance: 16 },
        { step: 8, from: 199, to: 0, distance: 199 },
        { step: 9, from: 0, to: 14, distance: 14 },
        { step: 10, from: 14, to: 37, distance: 23 },
      ],
      total: 382,
      average: 38.2,
    },
    formula: 'Service in one direction only, jump back to start when reaching end',
    advantages: [
      'More uniform wait time than SCAN',
      'No starvation',
      'Better for heavy loads',
      'Treats disk as circular - fair to all requests',
    ],
    disadvantages: [
      'Extra head movement on return jump',
      'Higher total seek time than SCAN in some cases',
      'More complex to implement',
      'Return jump is wasted movement',
    ],
    complexity: {
      time: 'O(n log n)',
      space: 'O(n)',
      best: 'O(n log n)',
      worst: 'O(n log n)',
    },
    vtuQuestions: [
      'Compare SCAN and C-SCAN algorithms with diagrams. (10 marks, June 2022)',
      'Why does C-SCAN provide more uniform wait time than SCAN? (5 marks, Dec 2021)',
      'Explain the circular nature of C-SCAN with an example. (8 marks)',
    ],
  },
  look: {
    definition: 'LOOK is an optimization of SCAN. Instead of going all the way to the end of the disk, it only goes as far as the last request in each direction, then reverses. This eliminates unnecessary movement to disk boundaries.',
    workingPrinciple: [
      'Start from current head position with given direction',
      'Move head in the current direction',
      'Service all requests in the path',
      'When no more requests in current direction, reverse',
      'Continue until all requests are serviced',
      'Do NOT go to disk boundaries if no requests there'
    ],
    example: {
      given: [
        'Initial head position: 53',
        'Request queue: [98, 183, 37, 122, 14, 124, 65, 67]',
        'Direction: Right',
        'Total cylinders: 200 (0-199)'
      ],
      solution: [
        { step: 1, from: 53, to: 65, distance: 12 },
        { step: 2, from: 65, to: 67, distance: 2 },
        { step: 3, from: 67, to: 98, distance: 31 },
        { step: 4, from: 98, to: 122, distance: 24 },
        { step: 5, from: 122, to: 124, distance: 2 },
        { step: 6, from: 124, to: 183, distance: 59 },
        { step: 7, from: 183, to: 37, distance: 146 },
        { step: 8, from: 37, to: 14, distance: 23 },
      ],
      total: 299,
      average: 37.4,
    },
    formula: 'Like SCAN but reverse at last request, not disk boundary',
    advantages: [
      'No wasted movement to disk boundaries',
      'Better than SCAN in most cases',
      'No starvation',
      'Practical optimization',
    ],
    disadvantages: [
      'Slightly more complex than SCAN',
      'Still has direction reversal overhead',
      'May not be optimal for all request patterns',
      'Variable seek times',
    ],
    complexity: {
      time: 'O(n log n)',
      space: 'O(n)',
      best: 'O(n log n)',
      worst: 'O(n log n)',
    },
    vtuQuestions: [
      'How does LOOK differ from SCAN? Calculate savings with an example. (8 marks, Dec 2022)',
      'Explain LOOK algorithm and its advantages over SCAN. (6 marks, June 2023)',
      'Compare SCAN, LOOK, and C-LOOK with the same request set. (10 marks)',
    ],
  },
  clook: {
    definition: 'Circular LOOK (C-LOOK) combines the benefits of C-SCAN and LOOK. It moves in one direction, servicing requests, then jumps to the first request at the other end (not the disk boundary) and continues in the same direction.',
    workingPrinciple: [
      'Start from current head position',
      'Move head in one direction',
      'Service all requests in the path',
      'When reaching last request in direction, jump to first request at other end',
      'Continue in the same direction',
      'Repeat until all requests are serviced'
    ],
    example: {
      given: [
        'Initial head position: 53',
        'Request queue: [98, 183, 37, 122, 14, 124, 65, 67]',
        'Direction: Right',
        'Total cylinders: 200 (0-199)'
      ],
      solution: [
        { step: 1, from: 53, to: 65, distance: 12 },
        { step: 2, from: 65, to: 67, distance: 2 },
        { step: 3, from: 67, to: 98, distance: 31 },
        { step: 4, from: 98, to: 122, distance: 24 },
        { step: 5, from: 122, to: 124, distance: 2 },
        { step: 6, from: 124, to: 183, distance: 59 },
        { step: 7, from: 183, to: 14, distance: 169 },
        { step: 8, from: 14, to: 37, distance: 23 },
      ],
      total: 322,
      average: 40.25,
    },
    formula: 'Like C-SCAN but only go to first/last requests, not disk boundaries',
    advantages: [
      'Most efficient combination',
      'Uniform service time',
      'No wasted movement to boundaries',
      'No starvation',
    ],
    disadvantages: [
      'Jump overhead still exists',
      'More complex implementation',
      'Not always optimal',
      'Higher memory for tracking',
    ],
    complexity: {
      time: 'O(n log n)',
      space: 'O(n)',
      best: 'O(n log n)',
      worst: 'O(n log n)',
    },
    vtuQuestions: [
      'Compare C-SCAN and C-LOOK with numerical examples. (10 marks, Dec 2022)',
      'Why is C-LOOK considered more efficient than C-SCAN? (5 marks, June 2021)',
      'Explain all elevator-based algorithms: SCAN, C-SCAN, LOOK, C-LOOK. (15 marks)',
    ],
  },
};

export default function TheoryDetail() {
  const { algorithm } = useParams<{ algorithm: string }>();
  const [expandedSection, setExpandedSection] = useState<string | null>('all');
  
  // Validate algorithm
  if (!algorithm || !ALGORITHMS.find(a => a.id === algorithm)) {
    return <Navigate to="/theory" replace />;
  }

  const algoInfo = ALGORITHMS.find(a => a.id === algorithm)!;
  const content = theoryContent[algorithm as AlgorithmType];
  
  // Find prev/next algorithms
  const currentIndex = ALGORITHMS.findIndex(a => a.id === algorithm);
  const prevAlgo = currentIndex > 0 ? ALGORITHMS[currentIndex - 1] : null;
  const nextAlgo = currentIndex < ALGORITHMS.length - 1 ? ALGORITHMS[currentIndex + 1] : null;

  const sections = [
    { id: 'definition', title: '1. Definition' },
    { id: 'working', title: '2. Working Principle' },
    { id: 'example', title: '3. Example Problem (VTU Style)' },
    { id: 'formula', title: '4. Mathematical Formulation' },
    { id: 'advantages', title: '5. Advantages' },
    { id: 'disadvantages', title: '6. Disadvantages' },
    { id: 'complexity', title: '7. Complexity Analysis' },
    { id: 'questions', title: '8. VTU Previous Year Questions' },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <InfiniteGrid />
      <Navbar />
      
      <main className="relative pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link to="/theory" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Theory
            </Link>
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {algoInfo.name} - {algoInfo.fullName}
                </h1>
                <p className="text-muted-foreground">{algoInfo.description}</p>
              </div>
              <Link to={`/simulator?algo=${algorithm}`}>
                <Button className="gap-2">
                  <Play className="w-4 h-4" />
                  Try Simulator
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Table of Contents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-4 rounded-xl mb-8"
          >
            <h2 className="font-semibold text-foreground mb-3">Contents</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Definition */}
            <motion.section
              id="definition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="theory-block"
            >
              <h2>1. Definition</h2>
              <p>{content.definition}</p>
            </motion.section>

            {/* Working Principle */}
            <motion.section
              id="working"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="theory-block"
            >
              <h2>2. Working Principle</h2>
              <h3>Algorithm Steps:</h3>
              <ol className="list-decimal list-inside space-y-2">
                {content.workingPrinciple.map((step, i) => (
                  <li key={i} className="text-muted-foreground">{step}</li>
                ))}
              </ol>
            </motion.section>

            {/* Example */}
            <motion.section
              id="example"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="theory-block"
            >
              <h2>3. Example Problem (VTU Style)</h2>
              
              <h3>Given:</h3>
              <ul className="list-disc list-inside space-y-1">
                {content.example.given.map((item, i) => (
                  <li key={i} className="text-muted-foreground">{item}</li>
                ))}
              </ul>

              <h3>Solution:</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 px-3 text-left text-muted-foreground">Step</th>
                      <th className="py-2 px-3 text-left text-muted-foreground">From</th>
                      <th className="py-2 px-3 text-left text-muted-foreground">To</th>
                      <th className="py-2 px-3 text-left text-muted-foreground">Distance</th>
                      <th className="py-2 px-3 text-left text-muted-foreground">Calculation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.example.solution.map((row) => (
                      <tr key={row.step} className="border-b border-border/50">
                        <td className="py-2 px-3 font-mono text-accent">{row.step}</td>
                        <td className="py-2 px-3 font-mono">{row.from}</td>
                        <td className="py-2 px-3 font-mono text-success">{row.to}</td>
                        <td className="py-2 px-3 font-mono text-primary">{row.distance}</td>
                        <td className="py-2 px-3 font-mono text-muted-foreground">|{row.to}-{row.from}| = {row.distance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                <p className="font-semibold text-foreground">
                  Total Seek Time (TST) = <span className="text-primary">{content.example.total} cylinders</span>
                </p>
                <p className="font-semibold text-foreground">
                  Average Seek Time (AST) = <span className="text-accent">{content.example.average} cylinders</span>
                </p>
              </div>
            </motion.section>

            {/* Formula */}
            <motion.section
              id="formula"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="theory-block"
            >
              <h2>4. Mathematical Formulation</h2>
              <div className="p-4 bg-secondary/30 rounded-lg font-mono text-center text-lg">
                {content.formula}
              </div>
            </motion.section>

            {/* Advantages */}
            <motion.section
              id="advantages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="theory-block"
            >
              <h2>5. Advantages</h2>
              <ul className="space-y-2">
                {content.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    {adv}
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Disadvantages */}
            <motion.section
              id="disadvantages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="theory-block"
            >
              <h2>6. Disadvantages</h2>
              <ul className="space-y-2">
                {content.disadvantages.map((dis, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <XCircle className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
                    {dis}
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Complexity */}
            <motion.section
              id="complexity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="theory-block"
            >
              <h2>7. Complexity Analysis</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Time Complexity</span>
                  <p className="text-lg font-mono text-primary">{content.complexity.time}</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Space Complexity</span>
                  <p className="text-lg font-mono text-accent">{content.complexity.space}</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Best Case</span>
                  <p className="text-lg font-mono text-success">{content.complexity.best}</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Worst Case</span>
                  <p className="text-lg font-mono text-orange">{content.complexity.worst}</p>
                </div>
              </div>
            </motion.section>

            {/* VTU Questions */}
            <motion.section
              id="questions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="theory-block"
            >
              <h2>8. VTU Previous Year Questions</h2>
              <ul className="space-y-3">
                {content.vtuQuestions.map((q, i) => (
                  <li key={i} className="p-3 bg-secondary/30 rounded-lg text-muted-foreground">
                    <span className="text-primary font-semibold">Q{i + 1}.</span> {q}
                  </li>
                ))}
              </ul>
            </motion.section>
          </div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex justify-between items-center mt-12 pt-8 border-t border-border"
          >
            {prevAlgo ? (
              <Link to={`/theory/${prevAlgo.id}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>{prevAlgo.name}</span>
              </Link>
            ) : <div />}
            
            {nextAlgo && (
              <Link to={`/theory/${nextAlgo.id}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <span>{nextAlgo.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { InfiniteGrid } from '@/components/ui/InfiniteGrid';
import { DiskScene } from '@/components/three/DiskScene';
import { MetricsPanel } from '@/components/ui/MetricsPanel';
import { TrackVisualization } from '@/components/ui/TrackVisualization';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  runAlgorithm, 
  generateRandomRequests, 
  AlgorithmType, 
  AlgorithmResult, 
  Direction,
  ALGORITHMS 
} from '@/lib/algorithms';
import { Play, Pause, RotateCcw, Shuffle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Simulator() {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('fcfs');
  const [direction, setDirection] = useState<Direction>('right');
  const [totalTracks, setTotalTracks] = useState(200);
  const [initialHead, setInitialHead] = useState(53);
  const [requestsInput, setRequestsInput] = useState('98, 183, 37, 122, 14, 124, 65, 67');
  const [requests, setRequests] = useState<number[]>([98, 183, 37, 122, 14, 124, 65, 67]);
  
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Parse requests from input
  useEffect(() => {
    const parsed = requestsInput
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n >= 0 && n < totalTracks);
    setRequests(parsed);
  }, [requestsInput, totalTracks]);

  // Run algorithm when inputs change
  useEffect(() => {
    if (requests.length > 0) {
      const newResult = runAlgorithm(algorithm, initialHead, requests, totalTracks, direction);
      setResult(newResult);
      setCurrentStep(-1);
      setIsPlaying(false);
    }
  }, [algorithm, initialHead, requests, totalTracks, direction]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !result) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= result.steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, result, speed]);

  const handleRandomize = useCallback(() => {
    const newRequests = generateRandomRequests(8, totalTracks);
    setRequestsInput(newRequests.join(', '));
    setInitialHead(Math.floor(Math.random() * totalTracks));
  }, [totalTracks]);

  const handleReset = useCallback(() => {
    setCurrentStep(-1);
    setIsPlaying(false);
  }, []);

  const handleStepForward = useCallback(() => {
    if (result && currentStep < result.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [result, currentStep]);

  const handleStepBackward = useCallback(() => {
    if (currentStep > -1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-background relative">
      <InfiniteGrid />
      <Navbar />
      
      <main className="relative pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Disk Scheduling Simulator
            </h1>
            <p className="text-muted-foreground">
              Visualize how different algorithms handle disk I/O requests
            </p>
          </motion.div>

          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-xl mb-6"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Algorithm Select */}
              <div className="space-y-2">
                <Label>Algorithm</Label>
                <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as AlgorithmType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALGORITHMS.map(algo => (
                      <SelectItem key={algo.id} value={algo.id}>
                        {algo.name} - {algo.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Direction Select */}
              <div className="space-y-2">
                <Label>Initial Direction</Label>
                <Select value={direction} onValueChange={(v) => setDirection(v as Direction)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left (Decreasing)</SelectItem>
                    <SelectItem value="right">Right (Increasing)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Initial Head */}
              <div className="space-y-2">
                <Label>Initial Head Position</Label>
                <Input
                  type="number"
                  min={0}
                  max={totalTracks - 1}
                  value={initialHead}
                  onChange={(e) => setInitialHead(parseInt(e.target.value) || 0)}
                />
              </div>

              {/* Total Tracks */}
              <div className="space-y-2">
                <Label>Total Tracks</Label>
                <Input
                  type="number"
                  min={50}
                  max={500}
                  value={totalTracks}
                  onChange={(e) => setTotalTracks(parseInt(e.target.value) || 200)}
                />
              </div>
            </div>

            {/* Requests Input */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label>Request Queue (comma-separated)</Label>
                <Button variant="outline" size="sm" onClick={handleRandomize} className="gap-2">
                  <Shuffle className="w-4 h-4" />
                  Randomize
                </Button>
              </div>
              <Input
                value={requestsInput}
                onChange={(e) => setRequestsInput(e.target.value)}
                placeholder="Enter track numbers separated by commas"
              />
            </div>
          </motion.div>

          {/* Main Visualization Area */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* 3D Scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 glass rounded-xl overflow-hidden"
            >
              <div className="h-[400px] md:h-[500px]">
                <DiskScene
                  result={result}
                  currentStep={currentStep}
                  totalTracks={totalTracks}
                  isPlaying={isPlaying}
                />
              </div>

              {/* Playback Controls */}
              <div className="p-4 border-t border-border/50">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleStepBackward}
                    disabled={currentStep <= -1}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleStepForward}
                    disabled={!result || currentStep >= result.steps.length - 1}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                  
                  <Button variant="outline" size="icon" onClick={handleReset}>
                    <RotateCcw className="w-5 h-5" />
                  </Button>

                  <div className="flex items-center gap-2 ml-4">
                    <Label className="text-sm text-muted-foreground">Speed:</Label>
                    <Slider
                      value={[speed]}
                      onValueChange={([v]) => setSpeed(v)}
                      min={0.5}
                      max={3}
                      step={0.5}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground w-8">{speed}x</span>
                  </div>
                </div>

                {/* Timeline */}
                {result && (
                  <div className="mt-4">
                    <Slider
                      value={[currentStep + 1]}
                      onValueChange={([v]) => setCurrentStep(v - 1)}
                      min={0}
                      max={result.steps.length}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Start</span>
                      <span>Step {currentStep + 1} / {result.steps.length}</span>
                      <span>End</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Metrics Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <MetricsPanel result={result} currentStep={currentStep} />
              
              {/* Algorithm Info */}
              {result && (
                <div className="glass p-4 rounded-xl">
                  <h3 className="font-semibold text-foreground mb-2">About {result.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {ALGORITHMS.find(a => a.name === result.name)?.description}
                  </p>
                  
                  <div className="mt-4 space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Pros:</span>
                      <ul className="text-xs text-success mt-1 space-y-1">
                        {ALGORITHMS.find(a => a.name === result.name)?.pros.slice(0, 2).map((pro, i) => (
                          <li key={i}>✓ {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Cons:</span>
                      <ul className="text-xs text-orange mt-1 space-y-1">
                        {ALGORITHMS.find(a => a.name === result.name)?.cons.slice(0, 2).map((con, i) => (
                          <li key={i}>✗ {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* 2D Track Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <TrackVisualization
              result={result}
              totalTracks={totalTracks}
              currentStep={currentStep}
              algorithmId={algorithm}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

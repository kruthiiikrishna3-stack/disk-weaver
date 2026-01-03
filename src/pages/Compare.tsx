import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { InfiniteGrid } from '@/components/ui/InfiniteGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { runAlgorithm, generateRandomRequests, ALGORITHMS, AlgorithmResult, Direction } from '@/lib/algorithms';
import { Shuffle, Trophy, TrendingDown, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = {
  fcfs: '#2563EB',
  sstf: '#06B6D4',
  scan: '#F97316',
  cscan: '#10B981',
  look: '#3B82F6',
  clook: '#0891B2',
};

export default function Compare() {
  const [direction, setDirection] = useState<Direction>('right');
  const [totalTracks, setTotalTracks] = useState(200);
  const [initialHead, setInitialHead] = useState(53);
  const [requestsInput, setRequestsInput] = useState('98, 183, 37, 122, 14, 124, 65, 67');

  const requests = useMemo(() => {
    return requestsInput
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n >= 0 && n < totalTracks);
  }, [requestsInput, totalTracks]);

  const results = useMemo(() => {
    if (requests.length === 0) return [];
    
    return ALGORITHMS.map(algo => ({
      ...runAlgorithm(algo.id, initialHead, requests, totalTracks, direction),
      id: algo.id,
      color: COLORS[algo.id],
    }));
  }, [initialHead, requests, totalTracks, direction]);

  const chartData = useMemo(() => {
    return results.map(r => ({
      name: r.name,
      seekTime: r.totalSeekTime,
      color: r.color,
    }));
  }, [results]);

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => a.totalSeekTime - b.totalSeekTime);
  }, [results]);

  const handleRandomize = () => {
    const newRequests = generateRandomRequests(8, totalTracks);
    setRequestsInput(newRequests.join(', '));
    setInitialHead(Math.floor(Math.random() * totalTracks));
  };

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
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Algorithm Comparison
            </h1>
            <p className="text-muted-foreground">
              Compare all disk scheduling algorithms with the same input
            </p>
          </motion.div>

          {/* Input Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-xl mb-8"
          >
            <div className="grid md:grid-cols-3 gap-4 mb-4">
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
              <div className="space-y-2">
                <Label>Direction</Label>
                <Select value={direction} onValueChange={(v) => setDirection(v as Direction)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Request Queue</Label>
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

          {results.length > 0 && (
            <>
              {/* Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-6 rounded-xl mb-8"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">Total Seek Time Comparison</h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 60, right: 20 }}>
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: 'hsl(var(--foreground))' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Bar dataKey="seekTime" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Rankings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass p-6 rounded-xl mb-8"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Performance Ranking
                </h2>
                
                <div className="space-y-3">
                  {sortedResults.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        index === 0 ? 'bg-success/10 border border-success/30' : 'bg-secondary/30'
                      }`}
                    >
                      <span className={`text-2xl font-bold ${
                        index === 0 ? 'text-success' : 'text-muted-foreground'
                      }`}>
                        #{index + 1}
                      </span>
                      
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: result.color }}
                      />
                      
                      <div className="flex-1">
                        <span className="font-semibold text-foreground">{result.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">({result.fullName})</span>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono font-semibold" style={{ color: result.color }}>
                            {result.totalSeekTime}
                          </span>
                          <span className="text-sm text-muted-foreground">tracks</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <TrendingDown className="w-3 h-3" />
                          <span>Avg: {result.averageSeekTime.toFixed(1)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Detailed Comparison Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass p-6 rounded-xl overflow-x-auto"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">Detailed Metrics</h2>
                
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 text-left text-muted-foreground">Algorithm</th>
                      <th className="py-3 px-4 text-right text-muted-foreground">Total Seek</th>
                      <th className="py-3 px-4 text-right text-muted-foreground">Average Seek</th>
                      <th className="py-3 px-4 text-right text-muted-foreground">Steps</th>
                      <th className="py-3 px-4 text-right text-muted-foreground">vs Best</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedResults.map((result, index) => {
                      const bestSeek = sortedResults[0].totalSeekTime;
                      const diff = result.totalSeekTime - bestSeek;
                      const diffPercent = ((diff / bestSeek) * 100).toFixed(1);
                      
                      return (
                        <tr key={result.id} className="border-b border-border/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: result.color }}
                              />
                              <span className="font-semibold text-foreground">{result.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono" style={{ color: result.color }}>
                            {result.totalSeekTime}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                            {result.averageSeekTime.toFixed(1)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                            {result.steps.length}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {index === 0 ? (
                              <span className="text-success font-semibold">Best</span>
                            ) : (
                              <span className="text-orange font-mono">+{diffPercent}%</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

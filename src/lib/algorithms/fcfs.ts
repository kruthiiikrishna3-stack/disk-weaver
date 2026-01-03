import { AlgorithmResult, SeekStep } from './types';

export function fcfs(initialHead: number, requests: number[]): AlgorithmResult {
  const sequence: number[] = [initialHead];
  const steps: SeekStep[] = [];
  let currentPosition = initialHead;
  let totalSeekTime = 0;

  requests.forEach((request, index) => {
    const distance = Math.abs(request - currentPosition);
    steps.push({
      from: currentPosition,
      to: request,
      distance,
      stepIndex: index,
    });
    totalSeekTime += distance;
    currentPosition = request;
    sequence.push(request);
  });

  return {
    name: 'FCFS',
    fullName: 'First Come First Serve',
    sequence,
    steps,
    totalSeekTime,
    averageSeekTime: requests.length > 0 ? totalSeekTime / requests.length : 0,
  };
}

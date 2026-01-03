import { AlgorithmResult, SeekStep } from './types';

export function sstf(initialHead: number, requests: number[]): AlgorithmResult {
  const sequence: number[] = [initialHead];
  const steps: SeekStep[] = [];
  const pending = [...requests];
  let currentPosition = initialHead;
  let totalSeekTime = 0;
  let stepIndex = 0;

  while (pending.length > 0) {
    // Find the closest request
    let minDistance = Infinity;
    let closestIndex = 0;

    pending.forEach((request, index) => {
      const distance = Math.abs(request - currentPosition);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    const nextRequest = pending[closestIndex];
    steps.push({
      from: currentPosition,
      to: nextRequest,
      distance: minDistance,
      stepIndex,
    });

    totalSeekTime += minDistance;
    currentPosition = nextRequest;
    sequence.push(nextRequest);
    pending.splice(closestIndex, 1);
    stepIndex++;
  }

  return {
    name: 'SSTF',
    fullName: 'Shortest Seek Time First',
    sequence,
    steps,
    totalSeekTime,
    averageSeekTime: requests.length > 0 ? totalSeekTime / requests.length : 0,
  };
}

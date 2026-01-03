import { AlgorithmResult, SeekStep, Direction } from './types';

export function cscan(
  initialHead: number,
  requests: number[],
  totalTracks: number,
  direction: Direction
): AlgorithmResult {
  const sequence: number[] = [initialHead];
  const steps: SeekStep[] = [];
  let currentPosition = initialHead;
  let totalSeekTime = 0;
  let stepIndex = 0;

  const sortedRequests = [...requests].sort((a, b) => a - b);
  const leftRequests = sortedRequests.filter(r => r < initialHead);
  const rightRequests = sortedRequests.filter(r => r >= initialHead);

  const processRequest = (request: number) => {
    const distance = Math.abs(request - currentPosition);
    steps.push({
      from: currentPosition,
      to: request,
      distance,
      stepIndex: stepIndex++,
    });
    totalSeekTime += distance;
    currentPosition = request;
    sequence.push(request);
  };

  if (direction === 'right') {
    // Move right
    rightRequests.forEach(processRequest);
    
    // Go to end
    if (currentPosition < totalTracks - 1) {
      processRequest(totalTracks - 1);
    }
    
    // Jump to start (circular)
    if (leftRequests.length > 0) {
      processRequest(0);
      // Continue from start going right
      leftRequests.forEach(processRequest);
    }
  } else {
    // Move left
    [...leftRequests].reverse().forEach(processRequest);
    
    // Go to start
    if (currentPosition > 0) {
      processRequest(0);
    }
    
    // Jump to end (circular)
    if (rightRequests.length > 0) {
      processRequest(totalTracks - 1);
      // Continue from end going left
      [...rightRequests].reverse().forEach(processRequest);
    }
  }

  return {
    name: 'C-SCAN',
    fullName: 'Circular SCAN',
    sequence,
    steps,
    totalSeekTime,
    averageSeekTime: requests.length > 0 ? totalSeekTime / requests.length : 0,
  };
}

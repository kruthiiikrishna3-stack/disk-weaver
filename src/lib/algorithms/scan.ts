import { AlgorithmResult, SeekStep, Direction } from './types';

export function scan(
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

  // Sort requests
  const sortedRequests = [...requests].sort((a, b) => a - b);
  
  // Split into left and right of head
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
    // Move right first
    rightRequests.forEach(processRequest);
    
    // Go to end of disk
    if (currentPosition < totalTracks - 1) {
      processRequest(totalTracks - 1);
    }
    
    // Reverse and go left
    [...leftRequests].reverse().forEach(processRequest);
  } else {
    // Move left first
    [...leftRequests].reverse().forEach(processRequest);
    
    // Go to start of disk
    if (currentPosition > 0) {
      processRequest(0);
    }
    
    // Reverse and go right
    rightRequests.forEach(processRequest);
  }

  return {
    name: 'SCAN',
    fullName: 'Elevator Algorithm',
    sequence,
    steps,
    totalSeekTime,
    averageSeekTime: requests.length > 0 ? totalSeekTime / requests.length : 0,
  };
}

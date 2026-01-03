import { AlgorithmResult, SeekStep, Direction } from './types';

export function clook(
  initialHead: number,
  requests: number[],
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
    // Move right to last request
    rightRequests.forEach(processRequest);
    // Jump to first request on left (circular, but only to first request)
    leftRequests.forEach(processRequest);
  } else {
    // Move left to first request
    [...leftRequests].reverse().forEach(processRequest);
    // Jump to last request on right
    [...rightRequests].reverse().forEach(processRequest);
  }

  return {
    name: 'C-LOOK',
    fullName: 'Circular LOOK',
    sequence,
    steps,
    totalSeekTime,
    averageSeekTime: requests.length > 0 ? totalSeekTime / requests.length : 0,
  };
}

import { AlgorithmResult, AlgorithmType, Direction } from './types';
import { fcfs } from './fcfs';
import { sstf } from './sstf';
import { scan } from './scan';
import { cscan } from './cscan';
import { look } from './look';
import { clook } from './clook';

export * from './types';
export { fcfs, sstf, scan, cscan, look, clook };

export function runAlgorithm(
  algorithm: AlgorithmType,
  initialHead: number,
  requests: number[],
  totalTracks: number = 200,
  direction: Direction = 'right'
): AlgorithmResult {
  switch (algorithm) {
    case 'fcfs':
      return fcfs(initialHead, requests);
    case 'sstf':
      return sstf(initialHead, requests);
    case 'scan':
      return scan(initialHead, requests, totalTracks, direction);
    case 'cscan':
      return cscan(initialHead, requests, totalTracks, direction);
    case 'look':
      return look(initialHead, requests, direction);
    case 'clook':
      return clook(initialHead, requests, direction);
    default:
      return fcfs(initialHead, requests);
  }
}

export function generateRandomRequests(count: number, maxTrack: number): number[] {
  const requests: number[] = [];
  for (let i = 0; i < count; i++) {
    requests.push(Math.floor(Math.random() * maxTrack));
  }
  return requests;
}

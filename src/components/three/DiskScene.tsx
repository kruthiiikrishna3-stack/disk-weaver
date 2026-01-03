import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { AlgorithmResult } from '@/lib/algorithms/types';

interface DiskSceneProps {
  result: AlgorithmResult | null;
  currentStep: number;
  totalTracks: number;
  isPlaying: boolean;
}

function DiskPlatter({ totalTracks }: { totalTracks: number }) {
  const diskRef = useRef<THREE.Mesh>(null);

  // Create concentric rings for tracks
  const rings = useMemo(() => {
    const ringArray: JSX.Element[] = [];
    const trackInterval = Math.max(1, Math.floor(totalTracks / 20)); // Show ~20 rings
    
    for (let i = 0; i <= totalTracks; i += trackInterval) {
      const radius = 1 + (i / totalTracks) * 4; // Inner radius 1, outer radius 5
      const geometry = new THREE.RingGeometry(radius - 0.02, radius + 0.02, 64);
      ringArray.push(
        <mesh key={i} rotation-x={-Math.PI / 2} position-y={0.26}>
          <primitive object={geometry} />
          <meshBasicMaterial color="#3A5A84" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      );
    }
    return ringArray;
  }, [totalTracks]);

  return (
    <group>
      {/* Main disk platter */}
      <mesh ref={diskRef} rotation-x={-Math.PI / 2}>
        <cylinderGeometry args={[5.5, 5.5, 0.5, 64]} />
        <meshStandardMaterial
          color="#1A2F42"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Center spindle */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.3}>
        <cylinderGeometry args={[0.8, 0.8, 0.6, 32]} />
        <meshStandardMaterial color="#0A1929" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Track rings */}
      {rings}
    </group>
  );
}

function DiskHead({ 
  position, 
  totalTracks 
}: { 
  position: number; 
  totalTracks: number;
}) {
  const headRef = useRef<THREE.Group>(null);
  const targetRadius = 1 + (position / totalTracks) * 4;

  useFrame((state, delta) => {
    if (headRef.current) {
      // Smooth interpolation to target position
      const currentX = headRef.current.position.x;
      headRef.current.position.x = THREE.MathUtils.lerp(currentX, targetRadius, delta * 3);
    }
  });

  return (
    <group ref={headRef} position={[targetRadius, 0.5, 0]}>
      {/* Head arm */}
      <mesh rotation-z={Math.PI / 2}>
        <boxGeometry args={[0.15, 1.5, 0.1]} />
        <meshStandardMaterial color="#F97316" metalness={0.6} roughness={0.3} />
      </mesh>
      
      {/* Read/write head */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.2]} />
        <meshStandardMaterial color="#F97316" metalness={0.8} roughness={0.2} emissive="#F97316" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Head glow */}
      <pointLight color="#F97316" intensity={0.5} distance={2} />
    </group>
  );
}

function TrackMarkers({ 
  requests, 
  totalTracks,
  visitedTracks,
}: { 
  requests: number[]; 
  totalTracks: number;
  visitedTracks: Set<number>;
}) {
  return (
    <group>
      {requests.map((track, index) => {
        const radius = 1 + (track / totalTracks) * 4;
        const angle = (index / requests.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const isVisited = visitedTracks.has(track);
        
        return (
          <group key={index} position={[x, 0.4, z]}>
            {/* Marker sphere */}
            <mesh>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial
                color={isVisited ? "#10B981" : "#06B6D4"}
                emissive={isVisited ? "#10B981" : "#06B6D4"}
                emissiveIntensity={0.5}
              />
            </mesh>
            
            {/* Track number label */}
            <Text
              position={[0, 0.3, 0]}
              fontSize={0.15}
              color={isVisited ? "#10B981" : "#06B6D4"}
              anchorX="center"
              anchorY="middle"
            >
              {track}
            </Text>
            
            {/* Pulse ring effect */}
            {!isVisited && (
              <mesh rotation-x={-Math.PI / 2}>
                <ringGeometry args={[0.15, 0.2, 32]} />
                <meshBasicMaterial color="#06B6D4" transparent opacity={0.3} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

function SeekPath({ 
  sequence, 
  totalTracks,
  currentStep,
}: { 
  sequence: number[]; 
  totalTracks: number;
  currentStep: number;
}) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const visibleSequence = sequence.slice(0, currentStep + 2);
    
    visibleSequence.forEach((track, index) => {
      const radius = 1 + (track / totalTracks) * 4;
      const angle = (index / sequence.length) * Math.PI * 0.5 - Math.PI / 4;
      pts.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0.35,
        Math.sin(angle) * radius
      ));
    });
    
    return pts;
  }, [sequence, totalTracks, currentStep]);

  if (points.length < 2) return null;

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#06B6D4" linewidth={2} />
    </line>
  );
}

function Scene({ result, currentStep, totalTracks, isPlaying }: DiskSceneProps) {
  const headPosition = useMemo(() => {
    if (!result || currentStep < 0) return result?.sequence[0] ?? 50;
    if (currentStep >= result.steps.length) return result.sequence[result.sequence.length - 1];
    return result.steps[currentStep].to;
  }, [result, currentStep]);

  const visitedTracks = useMemo(() => {
    const visited = new Set<number>();
    if (result) {
      for (let i = 0; i <= currentStep && i < result.steps.length; i++) {
        visited.add(result.steps[i].to);
      }
    }
    return visited;
  }, [result, currentStep]);

  const requests = useMemo(() => {
    if (!result) return [];
    return result.sequence.slice(1);
  }, [result]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#2563EB" />
      
      {/* Disk components */}
      <DiskPlatter totalTracks={totalTracks} />
      <DiskHead position={headPosition} totalTracks={totalTracks} />
      <TrackMarkers 
        requests={requests} 
        totalTracks={totalTracks} 
        visitedTracks={visitedTracks}
      />
      {result && (
        <SeekPath 
          sequence={result.sequence} 
          totalTracks={totalTracks}
          currentStep={currentStep}
        />
      )}
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        autoRotate={isPlaying}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export function DiskScene(props: DiskSceneProps) {
  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden bg-gradient-to-b from-card to-background">
      <Canvas
        camera={{ position: [8, 6, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene {...props} />
      </Canvas>
    </div>
  );
}

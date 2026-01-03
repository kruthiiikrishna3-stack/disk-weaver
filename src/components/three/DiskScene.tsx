import { useRef, useMemo } from 'react';
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

// Particle system for head trail
function ParticleTrail({ position, totalTracks }: { position: number; totalTracks: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 30;
  const positions = useMemo(() => new Float32Array(particleCount * 3), []);
  
  const radius = 1 + (position / totalTracks) * 4;

  useFrame(() => {
    if (!particlesRef.current) return;
    
    // Shift particles and add new one
    for (let i = particleCount - 1; i > 0; i--) {
      positions[i * 3] = positions[(i - 1) * 3];
      positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
      positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];
    }
    
    // Add new particle at head position
    positions[0] = radius;
    positions[1] = 0.4 + Math.random() * 0.05;
    positions[2] = (Math.random() - 0.5) * 0.1;
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FF6B35"
        size={0.06}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CDPlatter({ totalTracks }: { totalTracks: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Create track rings for CD grooves effect
  const rings = useMemo(() => {
    const ringArray: JSX.Element[] = [];
    const trackInterval = Math.max(1, Math.floor(totalTracks / 30));
    
    for (let i = 0; i <= totalTracks; i += trackInterval) {
      const radius = 1 + (i / totalTracks) * 4;
      ringArray.push(
        <mesh key={i} rotation-x={-Math.PI / 2} position-y={0.052}>
          <ringGeometry args={[radius - 0.01, radius + 0.01, 128]} />
          <meshBasicMaterial 
            color="#A0D2DB" 
            transparent 
            opacity={0.15} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      );
    }
    return ringArray;
  }, [totalTracks]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main CD disk - shiny silver surface */}
      <mesh rotation-x={-Math.PI / 2}>
        <cylinderGeometry args={[5.5, 5.5, 0.08, 128]} />
        <meshStandardMaterial
          color="#C0C8D0"
          metalness={0.95}
          roughness={0.05}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Rainbow iridescent layer */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.045}>
        <ringGeometry args={[1.0, 5.4, 128]} />
        <meshStandardMaterial
          color="#E8F4F8"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* CD center label area (white/silver) */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.05}>
        <ringGeometry args={[0.6, 1.0, 64]} />
        <meshStandardMaterial 
          color="#F8FAFC" 
          metalness={0.3} 
          roughness={0.4}
        />
      </mesh>
      
      {/* Center hole */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.05}>
        <ringGeometry args={[0.25, 0.6, 64]} />
        <meshStandardMaterial 
          color="#334155" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>

      {/* Outer rim highlight */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.05}>
        <ringGeometry args={[5.35, 5.5, 128]} />
        <meshBasicMaterial 
          color="#06B6D4" 
          transparent 
          opacity={0.3}
        />
      </mesh>
      
      {/* Track groove rings */}
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
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    if (headRef.current) {
      const currentX = headRef.current.position.x;
      headRef.current.position.x = THREE.MathUtils.lerp(currentX, targetRadius, delta * 4);
    }
    if (glowRef.current) {
      glowRef.current.intensity = 0.6 + Math.sin(state.clock.elapsedTime * 5) * 0.2;
    }
  });

  return (
    <group ref={headRef} position={[targetRadius, 0.25, 0]}>
      {/* Head arm base */}
      <mesh rotation-z={Math.PI / 2} position-y={0.05}>
        <boxGeometry args={[0.08, 1.0, 0.05]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Read/write head */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.15, 0.05, 0.1]} />
        <meshStandardMaterial 
          color="#F97316" 
          metalness={0.6} 
          roughness={0.3} 
          emissive="#F97316" 
          emissiveIntensity={0.4} 
        />
      </mesh>
      
      {/* Laser point */}
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial color="#FF4500" />
      </mesh>
      
      {/* Head glow */}
      <pointLight 
        ref={glowRef}
        color="#F97316" 
        intensity={0.6} 
        distance={1.2} 
      />
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
          <group key={index} position={[x, 0.15, z]}>
            {/* Marker sphere */}
            <mesh>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial
                color={isVisited ? "#10B981" : "#06B6D4"}
                emissive={isVisited ? "#10B981" : "#06B6D4"}
                emissiveIntensity={0.5}
              />
            </mesh>
            
            {/* Track number label */}
            <Text
              position={[0, 0.2, 0]}
              fontSize={0.1}
              color={isVisited ? "#10B981" : "#06B6D4"}
              anchorX="center"
              anchorY="middle"
            >
              {track}
            </Text>
            
            {/* Pulse ring for unvisited */}
            {!isVisited && (
              <mesh rotation-x={-Math.PI / 2}>
                <ringGeometry args={[0.1, 0.13, 32]} />
                <meshBasicMaterial 
                  color="#06B6D4" 
                  transparent 
                  opacity={0.35}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

function GlowingSeekPath({ 
  sequence, 
  totalTracks,
  currentStep,
}: { 
  sequence: number[]; 
  totalTracks: number;
  currentStep: number;
}) {
  const lineObject = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const visibleSequence = sequence.slice(0, currentStep + 2);
    
    visibleSequence.forEach((track, index) => {
      const radius = 1 + (track / totalTracks) * 4;
      const angle = (index / sequence.length) * Math.PI * 0.5 - Math.PI / 4;
      pts.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0.12,
        Math.sin(angle) * radius
      ));
    });

    if (pts.length < 2) return null;

    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    
    // Gradient colors
    const colors: number[] = [];
    visibleSequence.forEach((_, index) => {
      const t = index / Math.max(1, visibleSequence.length - 1);
      const color = new THREE.Color().lerpColors(
        new THREE.Color('#06B6D4'),
        new THREE.Color('#10B981'),
        t
      );
      colors.push(color.r, color.g, color.b);
    });
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });

    return new THREE.Line(geometry, material);
  }, [sequence, totalTracks, currentStep]);

  if (!lineObject) return null;

  return <primitive object={lineObject} />;
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
      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.9} color="#FFFFFF" />
      <directionalLight position={[-5, 8, -5]} intensity={0.4} color="#E0E7FF" />
      <pointLight position={[0, 6, 0]} intensity={0.5} color="#F1F5F9" />
      
      {/* CD Disk */}
      <CDPlatter totalTracks={totalTracks} />
      
      {/* Disk Head */}
      <DiskHead position={headPosition} totalTracks={totalTracks} />
      
      {/* Particle Trail */}
      <ParticleTrail position={headPosition} totalTracks={totalTracks} />
      
      {/* Track Markers */}
      <TrackMarkers 
        requests={requests} 
        totalTracks={totalTracks} 
        visitedTracks={visitedTracks}
      />
      
      {/* Seek Path */}
      {result && (
        <GlowingSeekPath 
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
        autoRotateSpeed={0.4}
      />
    </>
  );
}

export function DiskScene(props: DiskSceneProps) {
  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Canvas
        camera={{ position: [7, 5, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene {...props} />
      </Canvas>
    </div>
  );
}

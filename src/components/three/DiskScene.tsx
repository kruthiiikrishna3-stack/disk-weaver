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

// Particle trail following head
function ParticleTrail({ position, totalTracks }: { position: number; totalTracks: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 40;
  const positions = useMemo(() => new Float32Array(particleCount * 3), []);
  const sizes = useMemo(() => new Float32Array(particleCount).fill(0.04), []);
  
  const radius = 0.3 + (position / totalTracks) * 2.2;

  useFrame(() => {
    if (!particlesRef.current) return;
    
    // Shift particles
    for (let i = particleCount - 1; i > 0; i--) {
      positions[i * 3] = positions[(i - 1) * 3];
      positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
      positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];
    }
    
    // New particle at head
    positions[0] = radius;
    positions[1] = 0.02;
    positions[2] = (Math.random() - 0.5) * 0.05;
    
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
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FF6B35"
        size={0.04}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Flat CD disk viewed from top
function CDPlatter({ totalTracks }: { totalTracks: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Track groove rings
  const rings = useMemo(() => {
    const ringArray: JSX.Element[] = [];
    const trackInterval = Math.max(1, Math.floor(totalTracks / 35));
    
    for (let i = 0; i <= totalTracks; i += trackInterval) {
      const radius = 0.3 + (i / totalTracks) * 2.2;
      ringArray.push(
        <mesh key={i} rotation-x={-Math.PI / 2} position-y={0.002}>
          <ringGeometry args={[radius - 0.005, radius + 0.005, 128]} />
          <meshBasicMaterial 
            color="#60A5FA" 
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
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main CD surface - flat disk */}
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[2.6, 128]} />
        <meshStandardMaterial
          color="#1E293B"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Iridescent data layer */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.001}>
        <ringGeometry args={[0.35, 2.5, 128]} />
        <meshStandardMaterial
          color="#3B82F6"
          metalness={0.95}
          roughness={0.1}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Center label area */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.003}>
        <ringGeometry args={[0.15, 0.35, 64]} />
        <meshStandardMaterial 
          color="#F1F5F9" 
          metalness={0.2} 
          roughness={0.5}
        />
      </mesh>
      
      {/* Center hole */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.003}>
        <circleGeometry args={[0.15, 64]} />
        <meshStandardMaterial 
          color="#0F172A" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>

      {/* Outer glow ring */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.001}>
        <ringGeometry args={[2.5, 2.6, 128]} />
        <meshBasicMaterial 
          color="#06B6D4" 
          transparent 
          opacity={0.4}
        />
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
  const targetRadius = 0.3 + (position / totalTracks) * 2.2;
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    if (headRef.current) {
      const currentX = headRef.current.position.x;
      headRef.current.position.x = THREE.MathUtils.lerp(currentX, targetRadius, delta * 5);
    }
    if (glowRef.current) {
      glowRef.current.intensity = 0.8 + Math.sin(state.clock.elapsedTime * 6) * 0.3;
    }
  });

  return (
    <group ref={headRef} position={[targetRadius, 0.03, 0]}>
      {/* Read/write head - small glowing dot */}
      <mesh>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial 
          color="#F97316" 
          emissive="#F97316" 
          emissiveIntensity={0.8} 
        />
      </mesh>
      
      {/* Head glow */}
      <pointLight 
        ref={glowRef}
        color="#F97316" 
        intensity={0.8} 
        distance={0.5} 
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
        const radius = 0.3 + (track / totalTracks) * 2.2;
        const angle = (index / requests.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const isVisited = visitedTracks.has(track);
        
        return (
          <group key={index} position={[x, 0.03, z]}>
            {/* Marker */}
            <mesh>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial
                color={isVisited ? "#10B981" : "#06B6D4"}
                emissive={isVisited ? "#10B981" : "#06B6D4"}
                emissiveIntensity={0.6}
              />
            </mesh>
            
            {/* Track label */}
            <Text
              position={[0, 0.1, 0]}
              fontSize={0.06}
              color={isVisited ? "#10B981" : "#06B6D4"}
              anchorX="center"
              anchorY="middle"
            >
              {track}
            </Text>
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
      const radius = 0.3 + (track / totalTracks) * 2.2;
      const angle = (index / sequence.length) * Math.PI * 0.6 - Math.PI / 3;
      pts.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0.02,
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
      opacity: 0.8,
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
      {/* Top-down lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 0]} intensity={1} color="#FFFFFF" />
      <pointLight position={[2, 3, 2]} intensity={0.4} color="#60A5FA" />
      <pointLight position={[-2, 3, -2]} intensity={0.3} color="#06B6D4" />
      
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
      
      {/* Top-down camera controls */}
      <OrbitControls
        enablePan={false}
        minDistance={2.5}
        maxDistance={6}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 4}
        autoRotate={isPlaying}
        autoRotateSpeed={0.5}
        target={[0, 0, 0]}
      />
    </>
  );
}

export function DiskScene(props: DiskSceneProps) {
  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Canvas
        camera={{ position: [0, 4, 0.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene {...props} />
      </Canvas>
    </div>
  );
}

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function MiniDisk() {
  const diskRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (diskRef.current) {
      diskRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    if (headRef.current) {
      // Oscillate head position
      const radius = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.8;
      headRef.current.position.x = radius;
    }
  });

  // Track rings
  const rings = useMemo(() => {
    const ringArray: JSX.Element[] = [];
    for (let i = 0; i < 8; i++) {
      const radius = 0.5 + i * 0.35;
      ringArray.push(
        <mesh key={i} rotation-x={-Math.PI / 2} position-y={0.11}>
          <ringGeometry args={[radius - 0.01, radius + 0.01, 32]} />
          <meshBasicMaterial color="#3A5A84" transparent opacity={0.4} />
        </mesh>
      );
    }
    return ringArray;
  }, []);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group>
        {/* Main disk */}
        <mesh ref={diskRef} rotation-x={-Math.PI / 2}>
          <cylinderGeometry args={[3, 3, 0.2, 64]} />
          <meshStandardMaterial
            color="#1A2F42"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        
        {/* Track rings */}
        {rings}
        
        {/* Center */}
        <mesh rotation-x={-Math.PI / 2} position-y={0.12}>
          <cylinderGeometry args={[0.4, 0.4, 0.25, 32]} />
          <meshStandardMaterial color="#0A1929" metalness={0.95} roughness={0.05} />
        </mesh>
        
        {/* Head arm */}
        <group ref={headRef} position={[1.5, 0.2, 0]}>
          <mesh rotation-z={Math.PI / 2}>
            <boxGeometry args={[0.08, 0.8, 0.05]} />
            <meshStandardMaterial color="#F97316" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.15, 0.05, 0.1]} />
            <meshStandardMaterial 
              color="#F97316" 
              emissive="#F97316" 
              emissiveIntensity={0.5}
            />
          </mesh>
          <pointLight color="#F97316" intensity={0.3} distance={1} />
        </group>
      </group>
    </Float>
  );
}

export function HeroDiskPreview() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas
        camera={{ position: [5, 4, 5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.7} />
        <pointLight position={[0, 3, 0]} intensity={0.4} color="#2563EB" />
        <MiniDisk />
      </Canvas>
    </div>
  );
}

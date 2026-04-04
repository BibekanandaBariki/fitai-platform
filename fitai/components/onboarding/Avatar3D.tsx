"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float, MeshTransmissionMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useOnboardingStore } from "@/store/onboardingStore";

// The abstract humanoid component
function HolographicHuman({ height, weight }: { height: number; weight: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Math to calculate scaling bases
  // Default base human: 175cm tall, 70kg weight
  const safeHeight = Math.max(100, Math.min(250, height || 175));
  const safeWeight = Math.max(30, Math.min(250, weight || 70));

  // Height stretch (Y-axis)
  const heightScale = safeHeight / 175;
  
  // Bulking/Thinning (X/Z axis). We use a square root curve so it doesn't get ridiculously wide.
  const weightRatio = safeWeight / 70;
  const bulkScale = Math.pow(weightRatio, 0.65);

  // Smooth interpolation using useFrame to make the morphing look buttery smooth
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Smoothly lerp towards target scales
    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, bulkScale, delta * 5);
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, heightScale, delta * 5);
    groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, bulkScale, delta * 5);
  });

  // Material settings for the high-tech holographic look
  const materialProps = {
    color: "#22c55e",       // FitAI Primary Green
    transmission: 0.9,      // Glassy
    opacity: 1,
    metalness: 0.2,
    roughness: 0.1,
    ior: 1.5,
    thickness: 0.5,
    specularIntensity: 1,
  };

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      {/* Head */}
      <mesh position={[0, 3.8, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.5, 16]} />
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 2.0, 0]}>
        {/* Top radius, bottom radius, height */}
        <cylinderGeometry args={[0.65, 0.5, 2.0, 32]} />
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>

      {/* Left Shoulder & Arm */}
      <group position={[-0.9, 2.7, 0]}>
        <mesh position={[0, -0.7, 0]} rotation={[0, 0, -0.15]}>
          <capsuleGeometry args={[0.2, 1.4, 16, 16]} />
          <MeshTransmissionMaterial {...materialProps} />
        </mesh>
      </group>

      {/* Right Shoulder & Arm */}
      <group position={[0.9, 2.7, 0]}>
        <mesh position={[0, -0.7, 0]} rotation={[0, 0, 0.15]}>
          <capsuleGeometry args={[0.2, 1.4, 16, 16]} />
          <MeshTransmissionMaterial {...materialProps} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group position={[-0.3, 1.0, 0]}>
        <mesh position={[0, -1.0, 0]}>
          <capsuleGeometry args={[0.25, 1.8, 16, 16]} />
          <MeshTransmissionMaterial {...materialProps} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.3, 1.0, 0]}>
        <mesh position={[0, -1.0, 0]}>
          <capsuleGeometry args={[0.25, 1.8, 16, 16]} />
          <MeshTransmissionMaterial {...materialProps} />
        </mesh>
      </group>
    </group>
  );
}


export function Avatar3D() {
  const { height, weight } = useOnboardingStore();

  return (
    <div className="w-full h-[50vh] md:h-[600px] w-full rounded-3xl overflow-hidden relative border border-white/10 bg-gradient-to-b from-transparent to-primary/5">
      
      {/* High-tech grid overlay background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px' 
        }} 
      />

      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        {/* Soft studio lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#22c55e" />
        
        {/* Environment map for realistic glass reflections */}
        <Environment preset="city" />

        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
          <HolographicHuman height={height || 175} weight={weight || 70} />
        </Float>

        {/* Soft shadow directly underneath the avatar */}
        <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#22c55e" />

        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          minPolarAngle={Math.PI / 2.5} 
          maxPolarAngle={Math.PI / 1.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

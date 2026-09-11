'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Html, ContactShadows, MeshWobbleMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Compass, Sparkles, Waves, Sun, Eye } from 'lucide-react';
import * as THREE from 'three';

function CanvasLoader() {
  return (
    <Html center>
      <div className="flex items-center gap-3 px-5 py-3 bg-slate-950/90 border border-teal-500/30 backdrop-blur-xl rounded-2xl text-white shadow-2xl">
        <Waves className="w-5 h-5 animate-pulse text-teal-400" />
        <span className="text-sm font-medium tracking-wide text-teal-100">Rendering 3D Ocean Resort...</span>
      </div>
    </Html>
  );
}

function FloatingResortIsland({ timeOfDay }: { timeOfDay: 'sunset' | 'day' | 'night' }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta: number) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.15;
    }
  });

  const waterColor = timeOfDay === 'sunset' ? '#f43f5e' : timeOfDay === 'night' ? '#1e1b4b' : '#0284c7';
  const crystalColor = timeOfDay === 'sunset' ? '#fbbf24' : timeOfDay === 'night' ? '#818cf8' : '#38bdf8';

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <group ref={groupRef}>
        {/* Ocean Water Sphere Base */}
        <mesh position={[0, -0.6, 0]} receiveShadow>
          <cylinderGeometry args={[2.4, 2.2, 0.4, 64]} />
          <MeshWobbleMaterial
            color={waterColor}
            factor={0.4}
            speed={1.5}
            roughness={0.1}
            metalness={0.8}
            envMapIntensity={2}
          />
        </mesh>

        {/* Resort Villa Pavilion Structure */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.8, 1.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Roof Structure */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <coneGeometry args={[1.2, 0.7, 4]} />
          <meshStandardMaterial color={crystalColor} roughness={0.15} metalness={0.8} />
        </mesh>

        {/* Orbiting Ocean Ring */}
        <mesh ref={ringRef} position={[0, -0.4, 0]} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[3.2, 0.04, 32, 128]} />
          <meshStandardMaterial color={crystalColor} roughness={0.1} metalness={0.9} emissive={crystalColor} emissiveIntensity={0.5} />
        </mesh>

        {/* Decorative Floating Crystal Spheres */}
        <mesh position={[1.8, 0.8, 1]} castShadow>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh position={[-1.6, 1.2, -0.8]} castShadow>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color="#f43f5e" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>
    </Float>
  );
}

export function SeasideHero3D() {
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('sunset');
  const [autoRotate, setAutoRotate] = useState(true);

  const envPreset = timeOfDay === 'sunset' ? 'sunset' : timeOfDay === 'night' ? 'night' : 'city';

  return (
    <div className="relative w-full h-[540px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80">
      {/* 3D Canvas with clamped DPR [1, 2] as required by creative-3d-web skill */}
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 2.5, 6], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={timeOfDay === 'night' ? 0.3 : 0.8} />
        <directionalLight
          position={[10, 15, 8]}
          intensity={timeOfDay === 'sunset' ? 2 : timeOfDay === 'night' ? 0.5 : 1.5}
          color={timeOfDay === 'sunset' ? '#fdba74' : '#ffffff'}
          castShadow
        />
        <pointLight position={[-8, -5, -5]} intensity={1} color="#38bdf8" />

        <Suspense fallback={<CanvasLoader />}>
          <FloatingResortIsland timeOfDay={timeOfDay} />
          <ContactShadows position={[0, -1.8, 0]} opacity={0.7} scale={12} blur={2.5} far={4} />
          <Environment preset={envPreset} />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          autoRotate={autoRotate}
          autoRotateSpeed={1.2}
          maxPolarAngle={Math.PI / 2 + 0.05}
          minDistance={3}
          maxDistance={10}
        />
      </Canvas>

      {/* Floating Header Info Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-5 left-5 pointer-events-auto"
      >
        <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-950/80 border border-teal-500/20 backdrop-blur-md rounded-2xl text-white shadow-xl">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-semibold tracking-wide">3D Seaside Resort Visualizer</span>
        </div>
      </motion.div>

      {/* Floating Controls Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950/85 border border-white/10 backdrop-blur-xl rounded-2xl text-white shadow-2xl pointer-events-auto"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimeOfDay('day')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              timeOfDay === 'day' ? 'bg-teal-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> Day
          </button>
          <button
            onClick={() => setTimeOfDay('sunset')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              timeOfDay === 'sunset' ? 'bg-rose-500 text-white shadow-md font-bold' : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Sunset
          </button>
          <button
            onClick={() => setTimeOfDay('night')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              timeOfDay === 'night' ? 'bg-indigo-600 text-white shadow-md font-bold' : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Waves className="w-3.5 h-3.5" /> Night
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300">
          <span className="hidden sm:inline text-slate-400">Drag to rotate • Scroll to zoom</span>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-teal-400" />
            {autoRotate ? 'Pause Orbit' : 'Rotate Orbit'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

---
name: creative-3d-web
description: Production standards and guidelines for interactive 3D visualizations using Three.js / React Three Fiber (@react-three/fiber, @react-three/drei) and smooth UI animations using Framer Motion (framer-motion) or Canvas effects.
---

# Creative 3D Web & Smooth Animations Skill

This skill enforces production standards, optimization guidelines, and component design patterns for building interactive 3D web visualizations and fluid UI animations in React web applications.

---

## 1. 3D Graphics Standards (Three.js & React Three Fiber)

### Core Technologies
- **`@react-three/fiber`**: Declarative React renderer for Three.js.
- **`@react-three/drei`**: High-level helpers, controls, shaders, loaders, and abstractions.
- **`three`**: Low-level 3D library (geometries, materials, vectors, lightings).

### Production Rules for R3F
1. **Declarative Component Hierarchy**: Keep 3D elements isolated inside dedicated canvas components.
2. **Use Drei Helpers**: Prefer `@react-three/drei` abstractions (`OrbitControls`, `Float`, `Environment`, `ContactShadows`, `Text`, `Html`, `useGLTF`) over manual Three.js object construction whenever possible.
3. **Lighting & Environment**: Use environment maps (`<Environment preset="..." />`) combined with directional/ambient light sources for realistic shading without expensive shadow maps.

---

## 2. UI Animations & Visual Polish

### Core Technologies
- **`framer-motion`**: Hardware-accelerated UI transitions, hover states, layout animations, and gesture interactions.
- **`lucide-react`**: Vector icons for UI elements and control overlays.
- **Canvas / Particle Effects**: Custom 2D or 3D background visualizers for immersive UI design.

### Production Rules for UI Motion
1. **GPU Acceleration**: Animate properties that trigger GPU composition (`transform`, `opacity`, `scale`, `rotate`). Avoid animating layout-triggering properties (`width`, `height`, `top`, `margin`).
2. **Spring Physics & Easing**: Use spring physics (`type: 'spring', stiffness: 300, damping: 20`) for natural, tactile feel, or standard cubic-bezier curves (`ease: [0.16, 1, 0.3, 1]`) for clean modern motion.
3. **Reduced Motion**: Respect user preferences by supporting `prefers-reduced-motion`.

---

## 3. Performance Rules & Resource Management

### Crucial Performance Guidelines

#### A. DPR Clamping (Device Pixel Ratio)
High-DPI retina displays (3x DPR) can severely drop frame rates. Always clamp `dpr` to `[1, 2]` on the `<Canvas>` component:
```tsx
<Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
  {/* Scene content */}
</Canvas>
```

#### B. Lazy Loading & Suspense Boundaries
3D models, textures, and heavy assets must be wrapped in React `<Suspense>` with non-blocking fallback loaders to keep the main thread responsive:
```tsx
<Suspense fallback={<CanvasLoader />}>
  <Model />
</Suspense>
```

#### C. Memory Management & Unmount Cleanup
- Dispose of custom geometries, materials, and textures when unmounting imperative Three.js components.
- R3F automatically disposes of standard JSX materials/geometries, but custom shaders, canvas textures, and event listeners must be explicit cleanups inside `useEffect`:
```tsx
useEffect(() => {
  return () => {
    geometry.dispose();
    material.dispose();
    texture.dispose();
  };
}, []);
```

#### D. Framerate & Loop Optimization
- Avoid creating objects (e.g. `new THREE.Vector3()`) inside `useFrame` callbacks. Allocate vectors outside or use `useRef` to eliminate garbage collection pauses during render loops.
- Use `frameloop="demand"` for static or semi-static 3D scenes to save GPU and battery power:
```tsx
<Canvas frameloop="demand" dpr={[1, 2]}>
```

---

## 4. Architectural Patterns & Example Usage

### R3F Canvas Setup Template
```tsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Html } from '@react-three/drei';
import { motion } from 'framer-motion';

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex items-center justify-center p-4 bg-black/80 backdrop-blur-md rounded-xl text-white">
        <span className="animate-spin mr-2">🌀</span> Loading 3D Scene...
      </div>
    </Html>
  );
}

export function Interactive3DScene() {
  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-slate-900 via-slate-800 to-black">
      {/* 3D Canvas */}
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
        
        <Suspense fallback={<LoadingFallback />}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            {/* Mesh Component */}
            <mesh position={[0, 0, 0]}>
              <torusKnotGeometry args={[1, 0.3, 128, 32]} />
              <meshStandardMaterial color="#6366f1" roughness={0.15} metalness={0.8} />
            </mesh>
          </Float>
          <Environment preset="city" />
        </Suspense>

        <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={1} maxPolarAngle={Math.PI / 2} />
      </Canvas>

      {/* Motion UI Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-6 left-6 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white"
      >
        <h3 className="font-bold text-lg">Interactive 3D View</h3>
        <p className="text-sm text-slate-300">Drag to rotate • Scroll to zoom</p>
      </motion.div>
    </div>
  );
}
```

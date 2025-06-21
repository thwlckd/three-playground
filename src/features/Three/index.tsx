'use client';

import LoopingCards from './LoopingCards';
import useScreenSize from '@/hooks/useScreenSize';
import { Canvas } from '@react-three/fiber';

const ThreeWorld = () => {
  const isNonDesktop = useScreenSize() !== 'desktop';

  return (
    <div className="relative h-screen w-screen">
      <Canvas
        camera={{ position: isNonDesktop ? [4, 4, 15] : [6, 4, 15], fov: 30, near: 0.01, far: 1000 }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
        dpr={1.3}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 10]} intensity={1} />

        <LoopingCards />
      </Canvas>

      <div className="pointer-events-none fixed inset-0 z-10 bg-radial from-transparent via-transparent/90 to-white/90" />
    </div>
  );
};

export default ThreeWorld;

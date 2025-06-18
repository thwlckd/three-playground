'use client';

import LoopingCards from './LoopingCards';
import useScreenSize from '@/hooks/useScreenSize';
import { Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Vignette } from '@react-three/postprocessing';

const ThreeWorld = () => {
  const isNonDesktop = useScreenSize() !== 'desktop';

  return (
    <Canvas
      camera={{ position: isNonDesktop ? [4, 4, 15] : [6, 4, 15], fov: 30, near: 0.01, far: 1000 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
      dpr={1.5}
    >
      <gridHelper />
      <axesHelper args={[10]} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 10]} intensity={1} />

      <Stats showPanel={0} />

      <EffectComposer>
        <Vignette offset={0.5} darkness={0.7} eskil={false} />
      </EffectComposer>

      <LoopingCards />
    </Canvas>
  );
};

export default ThreeWorld;

'use client';

import LoopingCards from './LoopingCards';
import { Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

const ThreeWorld = () => {
  return (
    <Canvas
      camera={{ position: [6, 4, 15], fov: 30, near: 0.01, far: 1000 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
    >
      <gridHelper />
      <axesHelper args={[10]} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 10]} intensity={1} />
      <Environment preset="city" background={false} />

      <LoopingCards />
    </Canvas>
  );
};

export default ThreeWorld;

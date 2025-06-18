import useGesture from './useGesture';
import useScreenSize from '@/hooks/useScreenSize';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RefObject, useRef } from 'react';
import { DoubleSide, Mesh } from 'three';

const NUM_CARDS = 20;

const LoopingCards = () => {
  const { offsetRef } = useGesture();

  return (
    <group position={[-1, -2, 10]}>
      {[...Array(NUM_CARDS)].map((_, index) => (
        <Card key={index} index={index} textureSrc={`${(index % 6) + 1}.jpeg`} offsetRef={offsetRef} />
      ))}
    </group>
  );
};

interface CardProps {
  index: number;
  offsetRef: RefObject<number>;
  textureSrc: string;
}

const Card = ({ index, offsetRef, textureSrc }: CardProps) => {
  const meshRef = useRef<Mesh>(null);
  const texture = useTexture(textureSrc);
  const isNonDesktop = useScreenSize() !== 'desktop';
  const width = isNonDesktop ? 1 : 2;
  const height = isNonDesktop ? 2 : 3;
  const gap = isNonDesktop ? 0.8 : 1.3;
  const totalLength = gap * NUM_CARDS;

  useFrame(() => {
    if (!meshRef.current) {
      return;
    }

    const offset = (index * gap + offsetRef.current) % totalLength;
    const positiveOffset = (offset + totalLength) % totalLength;
    const x = positiveOffset * (isNonDesktop ? 0.4 : 0.5);
    const y = positiveOffset * (isNonDesktop ? 0.6 : 0.5);
    const z = -positiveOffset;

    meshRef.current.position.set(x, y, z);
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[width, height, 0.05]} />
      <meshPhysicalMaterial
        map={texture}
        transparent
        opacity={0.92}
        roughness={0.05}
        metalness={0}
        transmission={1}
        thickness={0.1}
        ior={1.2}
        side={DoubleSide}
        envMapIntensity={0.6}
        depthWrite={false}
      />
    </mesh>
  );
};

export default LoopingCards;

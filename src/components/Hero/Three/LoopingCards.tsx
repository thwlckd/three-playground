import useGesture from './useGesture';
import { useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
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
  const isMobile = useThree().viewport.width < 5;
  const width = isMobile ? 1 : 2;
  const height = isMobile ? 2 : 3;
  const spacing = isMobile ? 1 : 1.5;
  const totalLength = spacing * NUM_CARDS;

  useFrame(() => {
    if (!meshRef.current) {
      return;
    }

    const offset = (index * spacing + offsetRef.current) % totalLength;
    const positiveOffset = (offset + totalLength) % totalLength;
    const x = positiveOffset * 0.5;
    const y = positiveOffset * 0.5;
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

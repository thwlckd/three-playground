import useGesture from './useGesture';
import useSmoothZoom from './useZoom';
import useScreenSize from '@/hooks/useScreenSize';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { delay } from 'es-toolkit';
import { useRouter } from 'next/navigation';
import { RefObject, useRef, useState } from 'react';
import { Mesh, Vector3 } from 'three';

const NUM_CARDS = 20;

const LoopingCards = () => {
  const { offsetRef } = useGesture();
  const hoveredCardRef = useRef<number>(null);

  return (
    <group position={[-1, -2, 10]}>
      {[...Array(NUM_CARDS)].map((_, index) => (
        <Card
          key={index}
          order={index}
          textureSrc={`${(index % 6) + 1}.jpeg`}
          offsetRef={offsetRef}
          hoveredCardRef={hoveredCardRef}
        />
      ))}
    </group>
  );
};

interface CardProps {
  order: number;
  textureSrc: string;
  offsetRef: RefObject<number>;
  hoveredCardRef: RefObject<number | null>;
}

const Card = ({ order, offsetRef, textureSrc, hoveredCardRef }: CardProps) => {
  const router = useRouter();
  const cardRef = useRef<Mesh>(null);
  const fakeRef = useRef<Mesh>(null);
  const clickDurationRef = useRef(0);
  const texture = useTexture(textureSrc);
  const [hovered, setHovered] = useState(false);
  const isNonDesktop = useScreenSize() !== 'desktop';
  const size = isNonDesktop ? { width: 1, height: 2 } : { width: 2, height: 4 };
  const gap = isNonDesktop ? 0.8 : 1.3;
  const listDepth = gap * NUM_CARDS;
  const vector = new Vector3();
  const { setZoom } = useSmoothZoom();

  useFrame(function moveCardPosition() {
    if (!cardRef.current || !fakeRef.current) return;

    const offset = (order * gap + offsetRef.current) % listDepth;
    const positiveOffset = (offset + listDepth) % listDepth;
    const pos = {
      x: positiveOffset * (isNonDesktop ? 0.4 : 0.5),
      y: positiveOffset * (isNonDesktop ? 0.6 : 0.5),
      z: -positiveOffset,
    };

    fakeRef.current.position.set(pos.x, pos.y, pos.z);

    if (hovered) {
      cardRef.current.position.lerp(vector.set(pos.x + size.width / 3, pos.y, pos.z), 0.3);
    } else {
      cardRef.current.position.set(pos.x, pos.y, pos.z);
    }

    setHovered(hoveredCardRef.current === order);
  });

  return (
    <group>
      <mesh
        ref={fakeRef}
        onPointerOver={(e) => {
          e.stopPropagation();

          hoveredCardRef.current = order;
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();

          hoveredCardRef.current = null;
          document.body.style.cursor = 'grab';
        }}
        onPointerDown={(e) => {
          e.stopPropagation();

          document.body.style.cursor = 'pointer';
          clickDurationRef.current = performance.now();
        }}
        onPointerUp={async () => {
          const clickDuration = performance.now() - clickDurationRef.current;

          if (clickDuration < 300) {
            setZoom(2);
            await delay(500);
            router.push('/project/1');
          }
        }}
      >
        <boxGeometry args={[(size.width * 5) / 3, size.height, 0.05]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
      <mesh ref={cardRef}>
        <boxGeometry args={[size.width, size.height, 0.05]} />
        <meshPhysicalMaterial
          map={texture}
          transparent
          opacity={1}
          roughness={0.5}
          metalness={0.2}
          transmission={1}
          thickness={0.2}
          ior={1.52}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default LoopingCards;

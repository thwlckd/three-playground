'use client';

import { OrbitControls, RoundedBox, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import * as THREE from 'three';

// Face 컴포넌트: 각 면에 Plane과 텍스처 및 이벤트 부착
function Face({
  texture,
  position,
  rotation,
  onClick,
  onPointerOver,
  onPointerOut,
}: {
  texture: THREE.Texture;
  position: [number, number, number];
  rotation: [number, number, number];
  onClick: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}) {
  return (
    <mesh
      scale={0.8}
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} transparent />
    </mesh>
  );
}

// 메인 구성
function InteractiveBox() {
  const [front, back, top, bottom, left, right] = useTexture([
    '/texture1.png',
    '/texture2.png',
    '/texture3.png',
    '/texture4.png',
    '/texture5.png',
    '/texture6.png',
  ]);

  const boxRef = useRef<THREE.Mesh>(null!);

  // 살짝 회전 애니메이션
  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={boxRef}>
      {/* ✅ 둥근 모서리 RoundedBox 본체 */}
      <RoundedBox args={[1, 1, 1]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color="white" />
      </RoundedBox>

      {/* ✅ 6면 Plane은 살짝 float (z-fighting 방지) */}
      <Face texture={front} position={[0, 0, 0.501]} rotation={[0, 0, 0]} onClick={() => console.log('Front')} />
      <Face texture={back} position={[0, 0, -0.501]} rotation={[0, Math.PI, 0]} onClick={() => console.log('Back')} />
      <Face texture={top} position={[0, 0.501, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={() => console.log('Top')} />
      <Face
        texture={bottom}
        position={[0, -0.501, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        onClick={() => console.log('Bottom')}
      />
      <Face
        texture={left}
        position={[-0.501, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={() => console.log('Left')}
      />
      <Face
        texture={right}
        position={[0.501, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={() => console.log('Right')}
      />
    </group>
  );
}

export default function Scene() {
  return (
    <div className="h-screen">
      <Canvas camera={{ position: [2, 2, 3], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls />
        <InteractiveBox />
      </Canvas>
    </div>
  );
}

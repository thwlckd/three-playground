'use client';

import useScreenSize from '@/hooks/useScreenSize';
import { OrbitControls, RoundedBox, Text3D } from '@react-three/drei';
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber';
import React, { useRef, useState } from 'react';
import * as THREE from 'three';

function Face3D({
  text,
  position,
  rotation,
  onClick,
}: {
  text: string;
  position: [number, number, number];
  rotation: [number, number, number];
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}) {
  const textRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const targetScale = hovered ? 1.2 : 1.0;
  const color = hovered ? '#e63946' : '#333';

  // 부드러운 인터렉션
  useFrame(() => {
    if (textRef.current) {
      const current = textRef.current.scale.x;
      const next = THREE.MathUtils.lerp(current, targetScale, 0.1);
      textRef.current.scale.set(next, next, next);

      const targetY = hovered ? 0.2 : 0;
      textRef.current.position.y = THREE.MathUtils.lerp(textRef.current.position.y, targetY, 0.1);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* ✅ 투명 클릭 레이어 */}
      <mesh
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <Text3D
        ref={(el) => {
          textRef.current = el;
          el?.geometry.center();
        }}
        font="/fonts/MoneygraphyTTF_Regular.json"
        size={0.25}
        height={0.05}
        curveSegments={8}
        bevelEnabled
        bevelThickness={0.01}
        bevelSize={0.01}
        bevelSegments={3}
        // position={position}
        // rotation={rotation}
        //   onClick={onClick}
        // onPointerOver={(e) => {
        //   e.stopPropagation();
        //   setHovered(true);
        // }}
        // onPointerOut={(e) => {
        //   e.stopPropagation();
        //   setHovered(false);
        // }}
      >
        {text}
        <meshStandardMaterial color={color} />
      </Text3D>
    </group>
  );
}

function InteractiveBox() {
  const boxRef = useRef<THREE.Mesh>(null!);
  const isMobile = useScreenSize() === 'mobile';

  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={boxRef} scale={isMobile ? 1 : 1.5}>
      {/* 둥근 박스 */}
      <RoundedBox args={[1, 1, 1]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color="#f0f0f0" />
      </RoundedBox>

      {/* 각 면에 텍스트 */}
      <Face3D
        text="Front"
        position={[0, 0, 0.5]}
        rotation={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          console.log('Front');
        }}
      />
      <Face3D
        text="Back"
        position={[0, 0, -0.5]}
        rotation={[0, Math.PI, 0]}
        onClick={(e) => {
          e.stopPropagation();
          console.log('Back');
        }}
      />
      <Face3D
        text="Top"
        position={[0, 0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          console.log('Top');
        }}
      />
      <Face3D
        text="Bottom"
        position={[0, -0.5, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          console.log('Bottom');
        }}
      />
      <Face3D
        text="Left"
        position={[-0.5, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          console.log('Left');
        }}
      />
      <Face3D
        text="Right"
        position={[0.5, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          console.log('Right');
        }}
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

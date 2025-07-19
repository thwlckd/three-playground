'use client';

import useScreenSize from '@/hooks/useScreenSize';
import { OrbitControls, RoundedBox, Text3D, useHelper } from '@react-three/drei';
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
  const textStyle = hovered ? { scale: 1.2, color: '#e63946', y: 0.2 } : { scale: 1, color: '#333', y: 0 };

  useFrame(() => {
    if (textRef.current) {
      const current = textRef.current.scale.x;
      const next = THREE.MathUtils.lerp(current, textStyle.scale, 0.1);

      textRef.current.scale.set(next, next, next);
      textRef.current.position.y = THREE.MathUtils.lerp(textRef.current.position.y, textStyle.y, 0.1);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
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
        size={0.2}
        height={0.05}
        curveSegments={8}
        bevelEnabled
        bevelThickness={0.01}
        bevelSize={0.01}
        bevelSegments={3}
      >
        {text}
        <meshStandardMaterial
          color={textStyle.color}
          side={THREE.FrontSide} // 이 부분 추가
          transparent
          opacity={0.8}
        />
      </Text3D>
    </group>
  );
}

function InteractiveBox() {
  const boxRef = useRef<THREE.Group>(null);
  const screen = useScreenSize();
  const startTime = useRef<number | null>(null);
  const scale = screen === 'mobile' ? 1 : screen === 'tablet' ? 1.5 : 2;

  useFrame((state) => {
    if (!boxRef.current) return;

    if (!startTime.current) startTime.current = state.clock.getElapsedTime();
    const elapsed = state.clock.getElapsedTime() - startTime.current;
    const duration = 3;

    if (elapsed < duration) {
      const t = elapsed / duration;
      const easeOut = 1 - Math.pow(1 - t, 3);

      boxRef.current.rotation.x = easeOut * Math.PI * 2;
      boxRef.current.rotation.y = easeOut * Math.PI * 2;
      boxRef.current.rotation.z = easeOut * Math.PI * 2;
    }
  });

  return (
    <group ref={boxRef} scale={scale}>
      <RoundedBox args={[1, 1, 1]} radius={0.1} smoothness={4} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#814f8f"
          transmission={0.9} // 투명도 + 굴절 효과 (WebGL 2 필요)
          roughness={0}
          thickness={1} // 유리 두께 느낌
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0}
          opacity={0.5}
          transparent
        />
      </RoundedBox>

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

function Config() {
  const lightRef = useRef<THREE.DirectionalLight>(null!);
  useHelper(lightRef, THREE.DirectionalLightHelper, 1, 'red');

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight ref={lightRef} position={[10, 10, 10]} intensity={10} />
      <directionalLight position={[-10, -10, -10]} intensity={10} />
      <OrbitControls enableZoom={false} autoRotate />
    </>
  );
}

export default function Scene() {
  return (
    <div className="h-screen">
      <Canvas camera={{ position: [2, 2, 3], fov: 50 }} shadows>
        <Config />
        <InteractiveBox />
      </Canvas>
    </div>
  );
}

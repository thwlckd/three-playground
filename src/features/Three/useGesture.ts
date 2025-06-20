import useMatchMedia from '@/hooks/useMatchMedia';
import { useThree } from '@react-three/fiber';
import { useMotionValue, useMotionValueEvent, useSpring } from 'motion/react';
import { useRef, useEffect } from 'react';
import { PerspectiveCamera } from 'three';

const GESTURE_SPEED = 0.01;
const FOV = { default: 30, big: 40 };

const useGesture = () => {
  const offsetRef = useRef(0);
  const motionOffset = useMotionValue(0);
  const smoothOffset = useSpring(motionOffset, { mass: 1, damping: 40, stiffness: 400 });
  const { camera } = useThree();
  const fovMotion = useMotionValue(FOV.default);
  const fovSpring = useSpring(fovMotion, { mass: 1, damping: 30, stiffness: 300 });
  const isTouchScreen = useMatchMedia('(pointer: coarse)');

  useMotionValueEvent(smoothOffset, 'change', (latestOffset) => {
    offsetRef.current = latestOffset;
  });

  useMotionValueEvent(fovSpring, 'change', (latestFov) => {
    if (camera instanceof PerspectiveCamera) {
      camera.fov = latestFov;
      camera.updateProjectionMatrix();
    }
  });

  useEffect(
    function commandGesture() {
      let isDragging = false;
      let lastOffset = 0;

      const handleWheel = (event: WheelEvent) => {
        motionOffset.set(motionOffset.get() + event.deltaY * GESTURE_SPEED);
      };

      const handlePointerDown = (event: PointerEvent) => {
        isDragging = true;
        lastOffset = event.clientY;
        document.body.style.cursor = 'grabbing';
        fovMotion.set(FOV.big);
      };

      const handlePointerMove = (event: PointerEvent) => {
        if (!isDragging) {
          return;
        }

        const currentY = event.clientY;
        const deltaY = lastOffset - currentY;

        lastOffset = currentY;
        motionOffset.set(motionOffset.get() + deltaY * GESTURE_SPEED);
      };

      const handlePointerUp = () => {
        isDragging = false;
        document.body.style.cursor = 'grab';
        fovMotion.set(FOV.default);
      };

      const handleTouchStart = (event: TouchEvent) => {
        isDragging = true;
        lastOffset = event.touches[0].clientY;
        fovMotion.set(FOV.big);
      };

      const handleTouchMove = (event: TouchEvent) => {
        if (!isDragging) {
          return;
        }

        const currentY = event.touches[0].clientY;
        const deltaY = lastOffset - currentY;

        lastOffset = currentY;
        motionOffset.set(motionOffset.get() + deltaY * GESTURE_SPEED);
      };

      const handleTouchEnd = () => {
        isDragging = false;
        fovMotion.set(FOV.default);
      };

      if (isTouchScreen) {
        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
      } else {
        window.addEventListener('wheel', handleWheel);
        window.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);

        document.body.style.cursor = 'grab';
      }

      return () => {
        if (isTouchScreen) {
          window.removeEventListener('touchstart', handleTouchStart);
          window.removeEventListener('touchmove', handleTouchMove);
          window.removeEventListener('touchend', handleTouchEnd);
        } else {
          window.removeEventListener('wheel', handleWheel);
          window.removeEventListener('pointerdown', handlePointerDown);
          window.removeEventListener('pointermove', handlePointerMove);
          window.removeEventListener('pointerup', handlePointerUp);
        }
      };
    },
    [fovMotion, isTouchScreen, motionOffset],
  );

  return { offsetRef };
};

export default useGesture;

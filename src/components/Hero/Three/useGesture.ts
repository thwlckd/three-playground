import { useMotionValue, useMotionValueEvent, useSpring } from 'motion/react';
import { useRef, useEffect } from 'react';

const GESTURE_SPEED = 0.01;

const useGesture = () => {
  const offsetRef = useRef(0);
  const motionOffset = useMotionValue(0);
  const smoothOffset = useSpring(motionOffset, { mass: 1, damping: 40, stiffness: 400 });

  useMotionValueEvent(smoothOffset, 'change', (latestOffset) => {
    offsetRef.current = latestOffset;
  });

  useEffect(() => {
    let isDragging = false;
    let lastOffset = 0;

    const handleWheel = (event: WheelEvent) => {
      motionOffset.set(motionOffset.get() + event.deltaY * GESTURE_SPEED);
    };

    const handlePointerDown = (event: PointerEvent) => {
      isDragging = true;
      lastOffset = event.clientY;
      document.body.style.cursor = 'grabbing';
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
    };

    const handleTouchStart = (event: TouchEvent) => {
      isDragging = true;
      lastOffset = event.touches[0].clientY;
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
    };

    document.body.style.cursor = 'grab';

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [motionOffset]);

  return { offsetRef };
};

export default useGesture;

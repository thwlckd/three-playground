import { useMotionValue, useMotionValueEvent, useSpring } from 'motion/react';
import { useRef } from 'react';
import { useEffect } from 'react';

const SCROLL_SPEED = 0.01;

const useSmoothScrollRef = () => {
  const scrollRef = useRef(0);
  const motionScroll = useMotionValue(0); // 원본 값
  const smoothScroll = useSpring(motionScroll, { mass: 1, damping: 40, stiffness: 400 });

  useMotionValueEvent(smoothScroll, 'change', (lastScroll) => {
    scrollRef.current = lastScroll;
  });

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      motionScroll.set(motionScroll.get() + e.deltaY * SCROLL_SPEED);
    };

    window.addEventListener('wheel', handleWheel);

    return () => window.removeEventListener('wheel', handleWheel);
  }, [motionScroll]);

  return scrollRef;
};

export default useSmoothScrollRef;

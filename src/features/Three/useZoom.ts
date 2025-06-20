import { useThree } from '@react-three/fiber';
import { useMotionValue, useSpring, useMotionValueEvent } from 'motion/react';
import { useEffect, useState } from 'react';

const DEFAULT_ZOOM = 1;

const useSmoothZoom = () => {
  const { camera } = useThree();
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const zoomMotion = useMotionValue(camera.zoom);
  const zoomSpring = useSpring(zoomMotion, {
    mass: 1,
    stiffness: 120,
    damping: 30,
  });

  useMotionValueEvent(zoomSpring, 'change', (latest) => {
    camera.zoom = latest;
    camera.updateProjectionMatrix();
  });

  useEffect(() => {
    zoomMotion.set(zoom);

    return () => {
      zoomMotion.set(DEFAULT_ZOOM);
    };
  }, [zoom, zoomMotion]);

  return { setZoom };
};

export default useSmoothZoom;

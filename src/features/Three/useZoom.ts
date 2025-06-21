import { useThree } from '@react-three/fiber';
import { useMotionValue, useSpring, useMotionValueEvent } from 'motion/react';
import { useEffect, useState } from 'react';

const DEFAULT_ZOOM = 1;

const useZoom = () => {
  const { camera } = useThree();
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const zoomMotion = useMotionValue(camera.zoom);
  const zoomSpring = useSpring(zoomMotion, {
    mass: 1,
    stiffness: 80,
    damping: 20,
    velocity: 0.5,
  });

  useMotionValueEvent(zoomSpring, 'change', (latest) => {
    camera.zoom = latest;
    camera.updateProjectionMatrix();
  });

  useEffect(() => {
    if (zoom === DEFAULT_ZOOM) {
      return;
    }

    zoomMotion.set(zoom);

    return () => {
      zoomMotion.set(DEFAULT_ZOOM);
    };
  }, [zoom, zoomMotion]);

  return { setZoom };
};

export default useZoom;

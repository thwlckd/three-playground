import { useWindowSize } from 'usehooks-ts';

const SCREEN_OFFSET = {
  md: 768,
  lg: 1024,
};

const useScreenSize = () => {
  const { width } = useWindowSize({ debounceDelay: 200 });

  return width < SCREEN_OFFSET.md ? 'mobile' : width < SCREEN_OFFSET.lg ? 'tablet' : 'desktop';
};

export default useScreenSize;

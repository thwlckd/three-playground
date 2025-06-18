import { useWindowSize } from 'usehooks-ts';

const SCREEN_OFFSET = {
  small: 640,
  large: 1024,
};

const useScreenSize = () => {
  const { width } = useWindowSize({ debounceDelay: 200 });

  return width < SCREEN_OFFSET.small ? 'mobile' : width < SCREEN_OFFSET.large ? 'tablet' : 'desktop';
};

export default useScreenSize;

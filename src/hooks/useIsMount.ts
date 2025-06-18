import { useEffect, useState } from 'react';

const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== undefined) {
      setIsMounted(true);
    }
  }, []);

  return isMounted;
};

export default useIsMounted;

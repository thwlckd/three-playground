'use client';

import useIsMounted from '@/hooks/useIsMount';
import { PropsWithChildren } from 'react';

const CSROnly = ({ children }: PropsWithChildren) => {
  const isMounted = useIsMounted();

  return isMounted ? <>{children}</> : null;
};

export default CSROnly;

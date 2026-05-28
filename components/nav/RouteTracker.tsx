'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useNavHistory } from '@/lib/useReturnPath';

/**
 * Invisible client component that tracks pathname changes and pushes them
 * to the nav history store. Rendered once in the root layout.
 */
export default function RouteTracker() {
  const pathname = usePathname();
  const push = useNavHistory((s) => s.push);

  useEffect(() => {
    push(pathname);
  }, [pathname, push]);

  return null;
}

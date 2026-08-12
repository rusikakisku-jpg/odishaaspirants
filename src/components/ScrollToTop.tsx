'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  useEffect(() => {
    const handleChunkError = (event: ErrorEvent | PromiseRejectionEvent) => {
      const msg = 'reason' in event ? (event.reason?.message || String(event.reason)) : event.message;
      if (
        msg &&
        (msg.includes('Loading chunk') ||
          msg.includes('ChunkLoadError') ||
          msg.includes('Failed to fetch dynamically imported module') ||
          msg.includes('couldn\'t load'))
      ) {
        window.location.reload();
      }
    };

    window.addEventListener('error', handleChunkError);
    window.addEventListener('unhandledrejection', handleChunkError);

    return () => {
      window.removeEventListener('error', handleChunkError);
      window.removeEventListener('unhandledrejection', handleChunkError);
    };
  }, []);

  return null;
}

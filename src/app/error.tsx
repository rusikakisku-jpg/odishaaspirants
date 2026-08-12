'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // If a chunk load error or network fetch error occurs, auto reload to immediately fetch fresh static asset bundles
    if (
      error.name === 'ChunkLoadError' ||
      error.message?.includes('Loading chunk') ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('couldn\'t load')
    ) {
      window.location.reload();
    }
  }, [error]);

  return (
    <div style={{ maxWidth: '600px', margin: '80px auto', padding: '40px 20px', textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}>
      <h2 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>
        Loading Page Content...
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px' }}>
        We are refreshing the latest content for you.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          background: '#0b4ca3',
          color: '#ffffff',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '0.9rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(11, 76, 163, 0.2)',
        }}
      >
        Reload Page
      </button>
    </div>
  );
}

'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
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
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Poppins, sans-serif', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ maxWidth: '500px', padding: '40px 20px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>
            Updating Portal Data...
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.6 }}>
            The application is refreshing to load the newest version.
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
            }}
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  );
}

'use client';

import React, { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Reset body padding-top and scroll position when in admin area
    const originalPaddingTop = document.body.style.paddingTop;
    document.body.style.paddingTop = '0px';
    window.scrollTo(0, 0);

    return () => {
      document.body.style.paddingTop = originalPaddingTop;
    };
  }, []);

  return (
    <div
      id="admin-root"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        background: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  Briefcase,
  IdCard,
  Key,
  GraduationCap,
  FileText,
  Book,
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/', key: 'home', icon: Home },
    { label: 'Latest Jobs', href: '/jobs', key: 'jobs', icon: Briefcase },
    { label: 'Admit Card', href: '/jobs?cat=admit', key: 'admit', icon: IdCard },
    { label: 'Answer Key', href: '/jobs?cat=key', key: 'key', icon: Key },
    { label: 'Result', href: '/jobs?cat=result', key: 'result', icon: GraduationCap },
    { label: 'Previous year Questions', href: '/pyq', key: 'pyq', icon: FileText },
    { label: 'Syllabus', href: '/syllabus', key: 'syllabus', icon: Book },
    { label: 'Notes', href: '/notes', key: 'notes', icon: FileText },
  ];

  const isNavActive = (itemHref: string) => {
    if (itemHref === '/') return pathname === '/';
    return pathname === itemHref || pathname.startsWith(itemHref + '/');
  };

  return (
    <>
      {/* Clean White Sticky Navbar (Matching original PHP includes/header.php) */}
      <nav className="navbar">
        <div className="nav-container">
          {/* Brand Logotype */}
          <Link href="/" className="nav-brand">
            <span className="nav-brand-title">Odisha Aspirants</span>
          </Link>

          {/* Desktop Navigation Menu */}
          <ul className="nav-menu">
            {navItems.map((item) => {
              const active = isNavActive(item.href);
              return (
                <li key={item.key}>
                  <Link href={item.href} className={`nav-link ${active ? 'active' : ''}`}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile Drawer Toggle Button */}
          <button className="nav-toggle-btn" onClick={() => setDrawerOpen(true)} aria-label="Open Navigation">
            <Menu style={{ width: '24px', height: '24px' }} />
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        <Link href="/" className={`bottom-nav-link ${pathname === '/' ? 'active' : ''}`}>
          <Home style={{ width: '20px', height: '20px' }} />
          <span>Home</span>
        </Link>
        <Link href="/jobs" className={`bottom-nav-link ${pathname === '/jobs' ? 'active' : ''}`}>
          <Briefcase style={{ width: '20px', height: '20px' }} />
          <span>Jobs</span>
        </Link>
        <Link href="/jobs?cat=admit" className="bottom-nav-link">
          <IdCard style={{ width: '20px', height: '20px' }} />
          <span>Admit</span>
        </Link>
        <Link href="/jobs?cat=key" className="bottom-nav-link">
          <Key style={{ width: '20px', height: '20px' }} />
          <span>Key</span>
        </Link>
        <Link href="/jobs?cat=result" className="bottom-nav-link">
          <GraduationCap style={{ width: '20px', height: '20px' }} />
          <span>Result</span>
        </Link>
      </div>

      {/* Mobile Off-Canvas Drawer */}
      <div className={`drawer-overlay ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)}>
        <aside className="drawer-aside" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: '#0b4ca3' }}>
                Odisha Aspirants
              </span>
            </div>
            <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
              &times;
            </button>
          </div>

          <ul className="drawer-menu">
            {navItems.map((item) => {
              const active = isNavActive(item.href);
              const IconComp = item.icon;
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={`drawer-link ${active ? 'active' : ''}`}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <IconComp style={{ width: '18px', height: '18px' }} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>

      <style jsx>{`
        .navbar {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 80px;
          z-index: 1000;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          box-sizing: border-box;
        }

        .nav-container {
          max-width: 1240px;
          width: 100%;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          height: 100%;
          box-sizing: border-box;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .nav-brand-title {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          font-size: 1.45rem;
          font-weight: 800;
          color: #0b4ca3;
          letter-spacing: -0.3px;
          white-space: nowrap;
        }

        .nav-menu {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 1.25rem;
          align-items: stretch;
          height: 100%;
        }

        .nav-menu li {
          height: 100%;
          display: flex;
          align-items: stretch;
        }

        .nav-link {
          text-decoration: none;
          color: #334155;
          font-weight: 600;
          font-size: 0.88rem;
          font-family: 'Poppins', sans-serif;
          padding: 0 0.2rem;
          transition: all 0.2s ease;
          border-bottom: 3px solid transparent;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          height: 100%;
        }

        .nav-link:hover {
          color: #0b4ca3;
        }

        .nav-link.active {
          color: #0b4ca3;
          border-bottom: 3px solid #ff7a00;
        }

        .nav-toggle-btn {
          display: none;
          background: none;
          border: none;
          font-size: 1.4rem;
          color: #0f172a;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .nav-toggle-btn:hover {
          background: #f1f5f9;
        }

        /* Mobile Bottom Nav */
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 64px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-top: 1px solid #e2e8f0;
          z-index: 9999;
          box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
          box-sizing: border-box;
          justify-content: space-around;
          align-items: center;
          padding: 0 0.5rem;
        }

        .bottom-nav-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          text-decoration: none;
          color: #64748b;
          font-size: 0.72rem;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          height: 100%;
          flex: 1;
        }

        .bottom-nav-link.active {
          color: #0b4ca3;
        }

        /* Mobile Off-Canvas Drawer */
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 10000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .drawer-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        .drawer-aside {
          position: fixed;
          top: 0;
          left: -320px;
          width: 300px;
          height: 100%;
          background: #ffffff;
          box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
          z-index: 10001;
          display: flex;
          flex-direction: column;
          transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .drawer-overlay.open .drawer-aside {
          left: 0;
        }

        .drawer-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .drawer-close {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          cursor: pointer;
          color: #0f172a;
        }

        .drawer-menu {
          list-style: none;
          padding: 1.5rem;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
          overflow-y: auto;
        }

        .drawer-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0.85rem 1.25rem;
          text-decoration: none;
          color: #334155;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.2s;
          font-size: 0.98rem;
        }

        .drawer-link:hover,
        .drawer-link.active {
          color: #0b4ca3;
          background: #eff6ff;
        }

        @media (max-width: 1200px) {
          .nav-menu {
            display: none;
          }
          .nav-toggle-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .navbar {
            height: 64px;
          }
          .mobile-bottom-nav {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye } from 'lucide-react';
import { fetchSyllabusApi, fetchJobsApi } from '@/lib/api';

interface SyllabusDisplayItem {
  id: string | number;
  title: string;
  board: string;
  year: string;
  link: string;
}

export default function SyllabusPage() {
  const [activeBoard, setActiveBoard] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [syllabusList, setSyllabusList] = useState<SyllabusDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [patterns, jobs] = await Promise.all([
        fetchSyllabusApi(),
        fetchJobsApi(),
      ]);

      const formatted: SyllabusDisplayItem[] = patterns.map((p: any) => ({
        id: p.id,
        title: p.title,
        board: p.board,
        year: p.update_year || '2026',
        link: `/jobs/${p.id}`,
      }));

      // If patterns array is smaller, combine with jobs syllabus entries
      jobs.forEach((j) => {
        if (!formatted.some((f) => String(f.id) === String(j.id))) {
          formatted.push({
            id: j.id,
            title: `${j.title} Syllabus`,
            board: j.board,
            year: '2026',
            link: `/jobs/${j.id}`,
          });
        }
      });

      setSyllabusList(formatted);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredItems = syllabusList.filter((item) => {
    const matchesBoard = activeBoard === 'All' || item.board.toUpperCase() === activeBoard.toUpperCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.board.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBoard && matchesSearch;
  });

  return (
    <>
      <div className="container">
        {/* Header Search Row matching odishaaspirants.com/syllabus */}
        <div className="header-search-row">
          <div className="page-header">
            <h1>Exam Syllabus &amp; Pattern</h1>
            <p>Official examination pattern, subject-wise marks distribution, and syllabus guides.</p>
          </div>

          <div className="search-wrapper">
            <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8', pointerEvents: 'none', zIndex: 10 }} />
            <input
              type="text"
              id="sylSearchInput"
              className="search-input"
              placeholder="Search syllabus by title or board..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search exam syllabus"
            />
          </div>
        </div>

        {/* Board Filter Tabs matching odishaaspirants.com/syllabus */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['All', 'OSSC', 'OPSC', 'OSSSC'].map((board) => (
            <button
              key={board}
              onClick={() => setActiveBoard(board)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                border: activeBoard === board ? '1px solid #0b4ca3' : '1px solid #cbd5e1',
                background: activeBoard === board ? '#0b4ca3' : '#ffffff',
                color: activeBoard === board ? '#ffffff' : '#475569',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              {board}
            </button>
          ))}
        </div>

        {/* Syllabus Items List matching odishaaspirants.com/syllabus */}
        <div className="table-card" style={{ padding: '1.25rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              Loading syllabus guides from Cloudflare D1...
            </div>
          ) : filteredItems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.1rem 1.4rem',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    gap: '15px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '260px' }}>
                    <span
                      style={{
                        background: '#eff6ff',
                        color: '#0b4ca3',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      {item.board}
                    </span>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                      {item.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Year {item.year}</span>
                    <Link
                      href={item.link}
                      className="btn-view"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#10b981',
                        color: '#ffffff',
                        padding: '0.5rem 1.1rem',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      <Eye style={{ width: '15px', height: '15px' }} /> View Syllabus
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-records">No exam syllabus matching your filter criteria.</div>
          )}
        </div>
      </div>
    </>
  );
}

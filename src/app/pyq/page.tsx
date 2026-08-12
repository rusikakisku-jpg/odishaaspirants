'use client';

import React, { useState, useEffect } from 'react';
import { fetchPyqsApi } from '@/lib/api';
import { FileCode, Download, Search, Clock, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PYQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('all');
  const [pyqs, setPyqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchPyqsApi();
      setPyqs(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredPYQ = pyqs.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBoard = selectedBoard === 'all' || item.board === selectedBoard;
    return matchesSearch && matchesBoard;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '30px auto', padding: '0 1.5rem' }}>
      {/* Hero Box */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '30px', marginBottom: '30px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0b4ca3', background: 'rgba(11, 76, 163, 0.08)', padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '12px' }}>
          <FileCode style={{ width: '16px', height: '16px' }} /> PYQ ARCHIVE 2022 - 2026
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0', fontFamily: 'Poppins' }}>
          Previous Year Question Papers (PYQ)
        </h1>
        <p style={{ color: '#64748b', margin: '0 0 20px 0', fontSize: '0.95rem' }}>
          Download original question papers with official answer keys for OSSSC RI, ARI, OPSC OCS, OSSC CGL, and RRB Group D exams.
        </p>

        {/* Search & Board filter */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by exam name or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <select
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              outline: 'none',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Boards</option>
            <option value="OSSSC">OSSSC</option>
            <option value="OPSC">OPSC</option>
            <option value="OSSC">OSSC</option>
            <option value="RRB">RRB</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading PYQ papers from Cloudflare D1...
          </div>
        ) : filteredPYQ.length > 0 ? (
          filteredPYQ.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ background: 'rgba(11, 76, 163, 0.1)', color: item.accent || '#0b4ca3', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                    {item.board}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Years: {item.years}</span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 10px 0', fontFamily: 'Poppins' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                  {item.description}
                </p>

                {item.downloads && item.downloads.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {item.downloads.slice(0, 3).map((d: any) => (
                      <a
                        key={d.id}
                        href={d.file_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          color: '#334155',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                        }}
                      >
                        <span>📄 {d.paper} ({d.year})</span>
                        <Download style={{ width: '14px', height: '14px', color: '#0b4ca3' }} />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="#"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: '#0b4ca3',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                }}
              >
                <Download style={{ width: '16px', height: '16px' }} /> Download All Papers
              </a>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#64748b' }}>
            No question papers matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

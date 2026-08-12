'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { JOBS_DATA } from '@/lib/data';
import { Search, GraduationCap, ChevronRight } from 'lucide-react';

export default function ResultPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = JOBS_DATA.filter((j) => {
    const isResult = j.category === 'result';
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || j.board.toLowerCase().includes(searchTerm.toLowerCase());
    return isResult && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '30px auto', padding: '0 1.5rem' }}>
      <div style={{ marginBottom: '30px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '30px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0', fontFamily: 'Poppins' }}>
          Exam Results & Merit Selection Lists 2026
        </h1>
        <p style={{ color: '#64748b', margin: '0 0 20px 0', fontSize: '0.95rem' }}>
          Check scorecard, cutoff marks, and final merit lists for Odisha government exams.
        </p>

        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search exam or result title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {filteredItems.map((item) => (
          <div key={item.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ background: '#0b4ca3', color: 'white', padding: '2px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                  {item.board}
                </span>
                <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {item.status}
                </span>
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', fontFamily: 'Poppins' }}>
                {item.title}
              </h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
                Declared Date: {item.publishDate}
              </p>
            </div>

            <Link
              href={`/jobs/${item.id}`}
              style={{
                background: '#0b4ca3',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                fontFamily: 'Poppins',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Check Result <ChevronRight style={{ width: '16px', height: '16px' }} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

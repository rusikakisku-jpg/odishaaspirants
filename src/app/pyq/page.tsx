'use client';

import React, { useState } from 'react';
import { PYQ_DATA } from '@/lib/data';
import { FileCode, Download, Search, Clock, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PYQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('all');

  const filteredPYQ = PYQ_DATA.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.subject.toLowerCase().includes(searchTerm.toLowerCase());
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
              style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>

          <select
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value)}
            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', color: '#0f172a' }}
          >
            <option value="all">All Boards</option>
            <option value="OSSSC">OSSSC</option>
            <option value="OPSC">OPSC</option>
            <option value="OSSC">OSSC</option>
            <option value="RRB">RRB</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredPYQ.map((pyq) => (
          <div
            key={pyq.id}
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ background: '#0b4ca3', color: 'white', padding: '3px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800 }}>
                  {pyq.board}
                </span>
                <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                  {pyq.year} Exam
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 10px 0', fontFamily: 'Poppins' }}>
                {pyq.title}
              </h3>

              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '15px' }}>
                <strong>Subject:</strong> {pyq.subject}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f8fafc', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', color: '#475569', marginBottom: '20px' }}>
                <div><HelpCircle style={{ width: '14px', height: '14px', inlineSize: '14px' }} /> {pyq.totalQuestions} Questions</div>
                <div><Clock style={{ width: '14px', height: '14px' }} /> {pyq.duration}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={pyq.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  background: '#0b4ca3',
                  color: 'white',
                  textDecoration: 'none',
                  textAlign: 'center',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Download style={{ width: '16px', height: '16px' }} /> Download PDF
              </a>

              <Link
                href="/test-player"
                style={{
                  background: '#ff7a00',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Practice as CBT Test"
              >
                Practice Test →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { JOBS_DATA } from '@/lib/data';
import { Search, Briefcase, ChevronRight, Filter } from 'lucide-react';

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredJobs = JOBS_DATA.filter((j) => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || j.board.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBoard = selectedBoard === 'all' || j.board === selectedBoard;
    const matchesCategory = selectedCategory === 'all' || j.category === selectedCategory;
    return matchesSearch && matchesBoard && matchesCategory;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '30px auto', padding: '0 1.5rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '30px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '30px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0', fontFamily: 'Poppins' }}>
          Government Job Vacancies in Odisha 2026
        </h1>
        <p style={{ color: '#64748b', margin: '0 0 20px 0', fontSize: '0.95rem' }}>
          Browse all active recruitment notifications, admit cards, answer keys, and exam results from OSSSC, OPSC, OSSC, and RRB.
        </p>

        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 200px', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search job title or board..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
              }}
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

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', color: '#0f172a' }}
          >
            <option value="all">All Categories</option>
            <option value="vacancy">New Vacancies</option>
            <option value="admit">Admit Cards</option>
            <option value="key">Answer Keys</option>
            <option value="result">Exam Results</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ background: '#0b4ca3', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800 }}>
                  {job.board}
                </span>
                <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                  {job.vacancies}
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', background: 'rgba(5, 150, 105, 0.1)', padding: '4px 12px', borderRadius: '99px' }}>
                {job.status}
              </span>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 10px 0', fontFamily: 'Poppins' }}>
              <Link href={`/jobs/${job.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {job.title}
              </Link>
            </h2>

            <p style={{ fontSize: '0.92rem', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.6 }}>
              {job.overview}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                <strong>Qualification:</strong> {job.qualification} • <strong>Last Date:</strong> {job.lastDate}
              </div>

              <Link
                href={`/jobs/${job.id}`}
                style={{
                  background: '#0b4ca3',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                View Full Notification <ChevronRight style={{ width: '16px', height: '16px' }} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

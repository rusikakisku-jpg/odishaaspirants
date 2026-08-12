'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { JOBS_DATA } from '@/lib/data';
import { Search, Briefcase, ChevronRight } from 'lucide-react';

export default function LatestJobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('all');

  const filteredJobs = JOBS_DATA.filter((j) => {
    const isJobCategory = j.category === 'vacancy';
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || j.board.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBoard = selectedBoard === 'all' || j.board === selectedBoard;
    return isJobCategory && matchesSearch && matchesBoard;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '30px auto', padding: '0 1.5rem' }}>
      <div style={{ marginBottom: '30px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '30px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0', fontFamily: 'Poppins' }}>
          Latest Government Job Vacancies in Odisha 2026
        </h1>
        <p style={{ color: '#64748b', margin: '0 0 20px 0', fontSize: '0.95rem' }}>
          Explore all active recruitment notifications, online application forms, and vacancy details from OSSSC, OPSC, OSSC, and Railway.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search job title or board..."
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
            <option value="Odisha Police">Odisha Police</option>
            <option value="Railway RRB">Railway RRB</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {filteredJobs.map((job) => (
          <div key={job.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ background: '#0b4ca3', color: 'white', padding: '2px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                  {job.board}
                </span>
                <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {job.vacancies}
                </span>
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', fontFamily: 'Poppins' }}>
                {job.title}
              </h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
                Qualification: {job.qualification} | Last Date: <strong style={{ color: '#ef4444' }}>{job.lastDate}</strong>
              </p>
            </div>

            <Link
              href={`/jobs/${job.id}`}
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
              View Details <ChevronRight style={{ width: '16px', height: '16px' }} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

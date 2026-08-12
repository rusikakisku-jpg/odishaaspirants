'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { JOBS_DATA } from '@/lib/data';
import { Search } from 'lucide-react';

export default function LatestJobsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = JOBS_DATA.filter((j) => {
    const isJobCategory = j.category === 'vacancy';
    const matchesSearch =
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.board.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.boardFull.toLowerCase().includes(searchTerm.toLowerCase());
    return isJobCategory && matchesSearch;
  });

  return (
    <div className="container" style={{ maxWidth: '1240px', margin: '3rem auto 5rem auto', padding: '0 1.5rem' }}>
      {/* Header & Search Row matching odishaaspirants.com/latest-jobs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0', fontFamily: 'Poppins, sans-serif' }}>
            Latest Jobs
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.98rem', margin: 0, lineHeight: 1.6 }}>
            Latest government job openings and recruitment notifications.
          </p>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
          <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search past papers, boards, or titles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem 0.85rem 3rem',
              border: '1px solid #cbd5e1',
              borderRadius: '9999px',
              fontSize: '0.95rem',
              outline: 'none',
              background: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Listing Table matching odishaaspirants.com */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
              <th style={{ width: '160px', padding: '1.2rem 1.5rem', textAlign: 'left', color: '#475569', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                Publish Date
              </th>
              <th style={{ width: '250px', padding: '1.2rem 1.5rem', textAlign: 'left', color: '#475569', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                Board
              </th>
              <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: '#475569', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                Post Name
              </th>
              <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: '#475569', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                Eligibility
              </th>
              <th style={{ width: '160px', padding: '1.2rem 1.5rem', textAlign: 'left', color: '#475569', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                Last Date
              </th>
              <th style={{ width: '140px', padding: '1.2rem 1.5rem', textAlign: 'center', color: '#475569', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                More
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1.3rem 1.5rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>
                  {job.publishDate}
                </td>
                <td style={{ padding: '1.3rem 1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <strong style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{job.board}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>{job.boardFull}</span>
                  </div>
                </td>
                <td style={{ padding: '1.3rem 1.5rem', fontWeight: 700, color: '#0f172a' }}>
                  {job.title}
                </td>
                <td style={{ padding: '1.3rem 1.5rem', color: '#475569', fontWeight: 500 }}>
                  {job.qualification}
                </td>
                <td style={{ padding: '1.3rem 1.5rem', color: '#475569', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {job.lastDate}
                </td>
                <td style={{ padding: '1.3rem 1.5rem', textAlign: 'center' }}>
                  <Link
                    href={`/jobs/${job.id}`}
                    style={{
                      background: '#10b981',
                      color: '#ffffff',
                      textDecoration: 'none',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      display: 'inline-block',
                      boxShadow: '0 2px 4px rgba(16, 185, 129, 0.15)',
                    }}
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { JOBS_DATA, JobItem } from '@/lib/data';
import {
  Briefcase,
  Calendar,
  GraduationCap,
  ExternalLink,
  Download,
  ArrowLeft,
} from 'lucide-react';

export default function JobDetailsClient({ id }: { id: string }) {
  const job: JobItem = JOBS_DATA.find((j) => String(j.id) === String(id)) || JOBS_DATA[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'dates' | 'fee' | 'syllabus' | 'apply'>('overview');

  return (
    <div style={{ maxWidth: '1240px', margin: '30px auto', padding: '0 1.5rem' }}>
      {/* Back button */}
      <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0b4ca3', fontWeight: 700, textDecoration: 'none', marginBottom: '20px', fontSize: '0.9rem' }}>
        <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to All Vacancies
      </Link>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px' }}>
        {/* Left Column: Job Content */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '30px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ background: '#0b4ca3', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800 }}>
              {job.board}
            </span>
            <span style={{ background: 'rgba(255, 122, 0, 0.1)', color: '#ff7a00', padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800 }}>
              {job.category.toUpperCase()}
            </span>
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 15px 0', fontFamily: 'Poppins', lineHeight: 1.3 }}>
            {job.title}
          </h1>

          {/* Quick Info Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '25px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Briefcase style={{ width: '20px', height: '20px', color: '#0b4ca3' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Total Posts</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{job.vacancies}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar style={{ width: '20px', height: '20px', color: '#ef4444' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Last Date to Apply</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{job.lastDate}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <GraduationCap style={{ width: '20px', height: '20px', color: '#059669' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Qualification</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{job.qualification}</div>
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #e2e8f0', marginBottom: '25px', overflowX: 'auto' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'eligibility', label: 'Eligibility' },
              { id: 'dates', label: 'Important Dates' },
              { id: 'fee', label: 'Application Fee' },
              { id: 'syllabus', label: 'Syllabus & Pattern' },
              { id: 'apply', label: 'How to Apply' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                style={{
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '3px solid #ff7a00' : '3px solid transparent',
                  color: activeTab === tab.id ? '#0b4ca3' : '#64748b',
                  fontWeight: activeTab === tab.id ? 700 : 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  marginBottom: '-2px',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px', fontFamily: 'Poppins' }}>Recruitment Summary</h2>
              <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '0.95rem' }}>{job.overview}</p>
              <div style={{ marginTop: '20px', background: '#eff6ff', padding: '16px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#1e40af', fontSize: '0.95rem' }}>📌 Key Highlights:</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#1e3a8a', fontSize: '0.9rem' }}>
                  <li>Official Notification PDF Available for Instant Download.</li>
                  <li>Online Application Link Active on Board Website.</li>
                  <li>Age Relaxation Applicable as per Odisha Govt Rules.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'eligibility' && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px', fontFamily: 'Poppins' }}>Eligibility Criteria</h2>
              <div dangerouslySetInnerHTML={{ __html: job.eligibilityHtml }} />
            </div>
          )}

          {activeTab === 'dates' && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px', fontFamily: 'Poppins' }}>Important Dates</h2>
              <div dangerouslySetInnerHTML={{ __html: job.datesHtml }} />
            </div>
          )}

          {activeTab === 'fee' && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px', fontFamily: 'Poppins' }}>Application Fee Details</h2>
              <div dangerouslySetInnerHTML={{ __html: job.feeHtml }} />
            </div>
          )}

          {activeTab === 'syllabus' && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px', fontFamily: 'Poppins' }}>Syllabus & Exam Pattern Overview</h2>
              <div dangerouslySetInnerHTML={{ __html: job.syllabusHtml }} />
              <div style={{ marginTop: '15px' }}>
                <Link href="/syllabus" style={{ color: '#0b4ca3', fontWeight: 700, textDecoration: 'none' }}>
                  Click here to view detailed subject-wise syllabus &rarr;
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'apply' && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px', fontFamily: 'Poppins' }}>Steps to Apply Online</h2>
              <div dangerouslySetInnerHTML={{ __html: job.applyHtml }} />
            </div>
          )}
        </div>

        {/* Right Sidebar: Important Action Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: 0, marginBottom: '16px', fontFamily: 'Poppins' }}>
              Important Links
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={job.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#0b4ca3',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '12px',
                }}
              >
                <ExternalLink style={{ width: '16px', height: '16px' }} /> {job.ctaText}
              </a>

              <a
                href={job.notificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#f8fafc',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '12px',
                }}
              >
                <Download style={{ width: '16px', height: '16px', color: '#059669' }} /> Download Official PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

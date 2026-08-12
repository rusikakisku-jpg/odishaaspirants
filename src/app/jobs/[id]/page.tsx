'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { JOBS_DATA } from '@/lib/data';
import {
  Briefcase,
  Calendar,
  DollarSign,
  GraduationCap,
  FileText,
  ExternalLink,
  Download,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';

export default function JobDetailsPage() {
  const params = useParams();
  const idStr = params.id as string;
  const job = JOBS_DATA.find((j) => String(j.id) === idStr) || JOBS_DATA[0];

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
            <span style={{ background: 'rgba(5, 150, 105, 0.1)', color: '#059669', padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700 }}>
              {job.status}
            </span>
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0', fontFamily: 'Poppins', lineHeight: 1.3 }}>
            {job.title}
          </h1>

          <div style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '25px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <span>🏢 <strong>Board:</strong> {job.boardFull}</span>
            <span>👥 <strong>Vacancies:</strong> {job.vacancies}</span>
            <span>📅 <strong>Published:</strong> {job.publishDate}</span>
          </div>

          {/* Details Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '25px', gap: '20px', overflowX: 'auto' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'eligibility', label: 'Eligibility' },
              { id: 'dates', label: 'Important Dates' },
              { id: 'fee', label: 'Application Fee' },
              { id: 'syllabus', label: 'Syllabus' },
              { id: 'apply', label: 'How to Apply' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                style={{
                  padding: '10px 4px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === t.id ? '3px solid #ff7a00' : '3px solid transparent',
                  color: activeTab === t.id ? '#0b4ca3' : '#64748b',
                  fontWeight: activeTab === t.id ? 700 : 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  marginBottom: '-2px',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.7 }}>
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700, marginTop: 0, fontFamily: 'Poppins' }}>Recruitment Overview</h3>
                <p>{job.overview}</p>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Key Highlights:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li><strong>Recruiting Agency:</strong> {job.boardFull}</li>
                    <li><strong>Total Posts:</strong> {job.vacancies}</li>
                    <li><strong>Job Location:</strong> Odisha State</li>
                    <li><strong>Mode of Application:</strong> Online</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'eligibility' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700, marginTop: 0, fontFamily: 'Poppins' }}>Eligibility Criteria</h3>
                <div dangerouslySetInnerHTML={{ __html: job.eligibilityHtml }}></div>
              </div>
            )}

            {activeTab === 'dates' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700, marginTop: 0, fontFamily: 'Poppins' }}>Important Schedule Dates</h3>
                <div dangerouslySetInnerHTML={{ __html: job.datesHtml }}></div>
              </div>
            )}

            {activeTab === 'fee' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700, marginTop: 0, fontFamily: 'Poppins' }}>Application Fee Structure</h3>
                <div dangerouslySetInnerHTML={{ __html: job.feeHtml }}></div>
              </div>
            )}

            {activeTab === 'syllabus' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700, marginTop: 0, fontFamily: 'Poppins' }}>Exam Pattern & Syllabus</h3>
                <div dangerouslySetInnerHTML={{ __html: job.syllabusHtml }}></div>
              </div>
            )}

            {activeTab === 'apply' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700, marginTop: 0, fontFamily: 'Poppins' }}>Step-by-Step Application Guide</h3>
                <div dangerouslySetInnerHTML={{ __html: job.applyHtml }}></div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: CTA Action Sidebar */}
        <div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, marginTop: 0, marginBottom: '20px', fontFamily: 'Poppins' }}>
              Action Links & Links
            </h3>

            <a
              href={job.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#ff7a00',
                color: 'white',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.98rem',
                marginBottom: '12px',
                boxShadow: '0 4px 15px rgba(255, 122, 0, 0.3)',
              }}
            >
              <ExternalLink style={{ width: '18px', height: '18px' }} /> {job.ctaText}
            </a>

            <a
              href={job.notificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#f8fafc',
                color: '#0b4ca3',
                border: '1px solid #0b4ca3',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              <Download style={{ width: '16px', height: '16px' }} /> Download Official PDF Notification
            </a>

            <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', fontSize: '0.82rem', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 700, marginBottom: '6px' }}>
                <CheckCircle style={{ width: '16px', height: '16px' }} /> Verified Official Link
              </div>
              Cross-checked with {job.board} Official Portal.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

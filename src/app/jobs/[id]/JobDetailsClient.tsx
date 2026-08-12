'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JobItem } from '@/lib/data';
import { fetchJobDetailsApi, fetchJobsApi } from '@/lib/api';

interface JobDetailsClientProps {
  id: string;
  initialJob: JobItem | null;
  initialAllJobs: JobItem[];
}

export default function JobDetailsClient({ id, initialJob, initialAllJobs }: JobDetailsClientProps) {
  const router = useRouter();
  const [job, setJob] = useState<JobItem | null>(initialJob);
  const [allJobs, setAllJobs] = useState<JobItem[]>(initialAllJobs || []);

  useEffect(() => {
    async function refreshData() {
      try {
        const [singleJob, list] = await Promise.all([
          fetchJobDetailsApi(id),
          fetchJobsApi(),
        ]);
        if (singleJob) {
          setJob(singleJob);
        }
        if (list.length > 0) {
          setAllJobs(list);
        }
      } catch (e) {}
    }
    refreshData();
  }, [id]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetId = e.target.value;
    if (targetId) {
      router.push(`/jobs/${targetId}`);
    }
  };

  if (!job) {
    return (
      <div style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center', color: '#ef4444' }}>
        Job entry not found.
      </div>
    );
  }

  return (
    <>
      {/* Main Content Grid */}
      <div className="job-detail-layout">
        {/* Main Column */}
        <main>
          {/* Details Card Container */}
          <div className="details-card-container">
            <div className="header-content-block">
              <span className="board-tag">{job.boardFull} Recruitment</span>
              <h1 className="job-title">{job.title}</h1>
              <div style={{ marginBottom: '1.25rem' }}>
                <span className="badge status-active">{job.status || 'Active Now'}</span>
              </div>
              <div className="meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Total Vacancies</span>
                  <span className="meta-val">{job.vacancies}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Apply Start Date</span>
                  <span className="meta-val">{job.publishDate}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Apply Last Date</span>
                  <span className="meta-val">{job.lastDate}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Publish Date</span>
                  <span className="meta-val">{job.publishDate}</span>
                </div>
              </div>
            </div>

            {/* 1. Overview */}
            <div className="details-section" id="sec-overview">
              <h3>Job Overview</h3>
              <p>
                Official recruitment notification published by <strong>{job.boardFull} ({job.board})</strong> for{' '}
                {job.title}. Candidates holding {job.qualification} qualification can apply before the last date.
              </p>
              <table className="specs-table">
                <tbody>
                  <tr>
                    <td>Organization Board</td>
                    <td>
                      <strong>{job.boardFull} ({job.board})</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Job Category</td>
                    <td>
                      <span className="badge status-active">{job.category.toUpperCase()}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Educational Standard</td>
                    <td>{job.qualification}</td>
                  </tr>
                  <tr>
                    <td>Age Limit</td>
                    <td>18 - 38 Years (Relaxation as per Govt rules)</td>
                  </tr>
                  <tr>
                    <td>Pay Scale</td>
                    <td>Level 8 to Level 12 Matrix</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2. Eligibility */}
            <div className="details-section" id="sec-eligibility">
              <h3>Eligibility Criteria</h3>
              <div dangerouslySetInnerHTML={{ __html: job.eligibilityHtml }} />
            </div>

            {/* 3. Dates */}
            <div className="details-section" id="sec-dates">
              <h3>Important Milestone Dates</h3>
              <div dangerouslySetInnerHTML={{ __html: job.datesHtml }} />
            </div>

            {/* 4. Fees */}
            <div className="details-section" id="sec-fees">
              <h3>Application Fee Details</h3>
              <div dangerouslySetInnerHTML={{ __html: job.feeHtml }} />
            </div>

            {/* 5. Syllabus */}
            <div className="details-section" id="sec-syllabus">
              <h3>Exam Syllabus &amp; Pattern</h3>
              <div dangerouslySetInnerHTML={{ __html: job.syllabusHtml }} />
            </div>

            {/* 6. How to Apply */}
            <div className="details-section" id="sec-apply">
              <h3>How to Apply Guide</h3>
              <div dangerouslySetInnerHTML={{ __html: job.applyHtml }} />
            </div>
          </div>
        </main>

        {/* Sidebar Column - Single Combined Container */}
        <aside className="sidebar">
          <div className="widget-card">
            <h4 className="widget-title">Quick Actions &amp; Board Info</h4>

            {/* CTA Buttons */}
            <a href={job.ctaUrl || '#'} className="quick-link-btn btn-apply" target="_blank" rel="noopener noreferrer">
              {job.ctaText || 'Apply Online'}
            </a>
            <a href={job.notificationUrl || '#'} className="quick-link-btn btn-notif" target="_blank" rel="noopener noreferrer" style={{ marginBottom: '1.25rem' }}>
              📄 View Official PDF Notification
            </a>

            {/* Board Info */}
            <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                About {job.board} ({job.boardFull})
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.85rem 0', lineHeight: 1.6 }}>
                The <strong>{job.boardFull}</strong> conducts recruitment examinations for state civil services and government departments in Odisha.
              </p>
              <Link href="/latest-jobs" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0b4ca3', textDecoration: 'none' }}>
                View all {job.board} jobs &rarr;
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="sticky-bar">
        <div className="sticky-container">
          <a href={job.ctaUrl || '#'} className="sticky-btn btn-apply" target="_blank" rel="noopener noreferrer">
            {job.ctaText || 'Apply Online'}
          </a>
          <a href={job.notificationUrl || '#'} className="sticky-btn btn-notif" target="_blank" rel="noopener noreferrer">
            PDF Notification
          </a>
        </div>
      </div>
    </>
  );
}

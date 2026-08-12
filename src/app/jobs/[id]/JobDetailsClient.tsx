'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JOBS_DATA, JobItem } from '@/lib/data';

export default function JobDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const job: JobItem = JOBS_DATA.find((j) => String(j.id) === String(id)) || JOBS_DATA[0];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetId = e.target.value;
    if (targetId) {
      router.push(`/jobs/${targetId}`);
    }
  };

  return (
    <>
      {/* Top Selector Bar matching odishaaspirants.com */}
      <div className="top-selector-bar">
        <div className="selector-container">
          <span className="selector-label">Currently Viewing Job Details:</span>
          <select
            className="job-select"
            value={job.id}
            onChange={handleSelectChange}
            aria-label="Select Job"
          >
            {JOBS_DATA.map((j) => (
              <option key={j.id} value={j.id}>
                {j.board} - {j.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container">
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
              <p>
                Candidates must possess a valid degree or qualification of <strong>{job.qualification}</strong> from a recognized institution.
                 Odia language proficiency is mandatory.
              </p>
            </div>

            {/* 3. Dates */}
            <div className="details-section" id="sec-dates">
              <h3>Important Milestone Dates</h3>
              <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                <li>Online Application Start Date: <strong>{job.publishDate}</strong></li>
                <li>Last Date for Online Submission: <strong>{job.lastDate}</strong></li>
                <li>Expected Examination Date: <strong>To be announced</strong></li>
              </ul>
            </div>

            {/* 4. Fees */}
            <div className="details-section" id="sec-fees">
              <h3>Application Fee Details</h3>
              <p>General / SEBC candidates: Exempted as per Odisha Govt rules.</p>
              <p>SC / ST / PwD candidates: Exempted (Nil).</p>
            </div>

            {/* 5. Syllabus */}
            <div className="details-section" id="sec-syllabus">
              <h3>Exam Syllabus &amp; Pattern</h3>
              <p>
                The written examination consists of Multiple Choice Questions (MCQs) covering General Awareness, Quantitative Aptitude, Reasoning, and Odia &amp; English Language skills.
              </p>
            </div>

            {/* 6. How to Apply */}
            <div className="details-section" id="sec-apply">
              <h3>How to Apply Guide</h3>
              <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
                <li>Visit the official portal of {job.board}.</li>
                <li>Click on the Online Recruitment Application portal.</li>
                <li>Complete your Registration &amp; fill out personal, educational details.</li>
                <li>Upload scanned photograph, signature &amp; certificates.</li>
                <li>Submit the form &amp; download a copy for reference.</li>
              </ol>
            </div>
          </div>
        </main>

        {/* Sidebar Column */}
        <aside className="sidebar">
          {/* Action card */}
          <div className="widget-card">
            <h4 className="widget-title">Quick Actions</h4>
            <a href="#" className="quick-link-btn btn-apply" target="_blank" rel="noopener noreferrer">
              Apply Online
            </a>
            <a href="#" className="quick-link-btn btn-notif" target="_blank" rel="noopener noreferrer">
              📄 View Official PDF
            </a>
          </div>

          {/* Recruitment Board Widget */}
          <div className="widget-card">
            <h4 className="widget-title">About the Board</h4>
            <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 1rem 0', lineHeight: 1.6 }}>
              The <strong>{job.boardFull}</strong> handles recruitment drives for executive, administrative, and technical departments across Odisha.
            </p>
            <Link href="/latest-jobs" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0b4ca3', textDecoration: 'none' }}>
              View all from {job.board} &rarr;
            </Link>
          </div>
        </aside>
      </div>

      {/* Sticky Bottom Bar for Mobile View */}
      <div className="sticky-bar">
        <div className="sticky-container">
          <a href="#" className="sticky-btn btn-notif" target="_blank" rel="noopener noreferrer">
            PDF
          </a>
          <a href="#" className="sticky-btn btn-apply" target="_blank" rel="noopener noreferrer">
            Apply Online
          </a>
        </div>
      </div>

      <style jsx>{`
        .top-selector-bar {
          background: #0f172a;
          color: #ffffff;
          padding: 0.75rem 1.5rem;
        }

        .selector-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .selector-label {
          font-size: 0.88rem;
          font-weight: 500;
          color: #94a3b8;
        }

        .job-select {
          background: #1e293b;
          color: #ffffff;
          border: 1px solid #334155;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          font-size: 0.88rem;
          outline: none;
          cursor: pointer;
          max-width: 320px;
          text-overflow: ellipsis;
          font-family: 'Outfit', sans-serif;
        }

        .container {
          max-width: 1200px;
          margin: 2.5rem auto;
          padding: 0 1.5rem;
          display: grid;
          grid-template-columns: 2.2fr 0.8fr;
          gap: 2rem;
          box-sizing: border-box;
        }

        .header-content-block {
          padding-bottom: 2rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #f1f5f9;
          box-sizing: border-box;
        }

        .board-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: #0b4ca3;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
          display: block;
        }

        .job-title {
          font-size: 1.85rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 1rem 0;
          font-family: 'Poppins', sans-serif;
          line-height: 1.3;
        }

        .meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .meta-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .meta-val {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
        }

        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .status-active {
          background: #dcfce7;
          color: #15803d;
        }

        .details-card-container {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 2rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .details-section {
          background: none;
          border: none;
          padding: 0 0 2rem 0;
          margin-bottom: 2rem;
          border-bottom: 1px solid #f1f5f9;
          box-sizing: border-box;
        }

        .details-section:last-child {
          padding-bottom: 0;
          margin-bottom: 0;
          border-bottom: none;
        }

        .details-section h3 {
          margin-top: 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1.25rem;
          font-family: 'Poppins', sans-serif;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }

        .details-section p {
          line-height: 1.6;
          color: #334155;
          margin-bottom: 1.25rem;
          font-size: 0.92rem;
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .widget-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .widget-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 1rem 0;
          font-family: 'Poppins', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 0.5rem;
        }

        .quick-link-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.88rem;
          margin-bottom: 0.75rem;
          transition: all 0.2s ease;
          text-align: center;
          font-family: 'Poppins', sans-serif;
          box-sizing: border-box;
        }

        .btn-apply {
          background: #0b4ca3;
          color: #ffffff;
        }

        .btn-apply:hover {
          background: #083b7f;
        }

        .btn-notif {
          background: #f1f5f9;
          color: #0f172a;
          border: 1px solid #cbd5e1;
        }

        .btn-notif:hover {
          background: #e2e8f0;
        }

        .specs-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }

        .specs-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.88rem;
          color: #334155;
        }

        .sticky-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          padding: 0.75rem 1rem;
          display: none;
          box-sizing: border-box;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
          z-index: 999;
        }

        .sticky-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 10px;
        }

        .sticky-btn {
          flex: 1;
          padding: 0.65rem 1rem;
          border-radius: 6px;
          text-align: center;
          font-weight: 700;
          font-size: 0.88rem;
          text-decoration: none;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        @media (max-width: 900px) {
          .container {
            grid-template-columns: 1fr;
          }
          .sidebar {
            margin-top: 1.5rem;
          }
          .meta-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .container {
            margin: 1.5rem auto 5rem auto;
          }
          .sticky-bar {
            display: block;
          }
        }
      `}</style>
    </>
  );
}

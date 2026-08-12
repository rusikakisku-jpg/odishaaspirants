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
    <>
      <div className="container">
        {/* Section Header & Search Row matching odishaaspirants.com/latest-jobs */}
        <div className="header-search-row">
          <div className="page-header">
            <h1>Latest Jobs</h1>
            <p>Latest government job openings and recruitment notifications.</p>
          </div>

          <div className="search-wrapper">
            <Search className="search-icon" style={{ width: '18px', height: '18px' }} />
            <input
              type="text"
              className="search-input"
              id="searchBar"
              placeholder="Search past papers, boards, or titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search entries"
            />
          </div>
        </div>

        {/* Listing Table matching odishaaspirants.com/latest-jobs */}
        <div className="table-card">
          <table className="jobs-table" id="jobsTable">
            <thead>
              <tr>
                <th style={{ width: '160px' }}>Publish Date</th>
                <th style={{ width: '250px' }}>Board</th>
                <th>Post Name</th>
                <th>Eligibility</th>
                <th style={{ width: '160px' }}>Last Date</th>
                <th className="action-col" style={{ width: '140px' }}>More</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job.id}>
                    {/* Publish Date cell */}
                    <td className="publish-date-col" data-label="Publish Date">
                      <span className="cell-value">{job.publishDate}</span>
                    </td>

                    {/* Board cell */}
                    <td data-label="Board">
                      <div className="board-col cell-value">
                        <strong>{job.board}</strong>
                        <span className="board-full-name">({job.boardFull})</span>
                      </div>
                    </td>

                    {/* Post Name cell */}
                    <td className="post-name-col" data-label="Post Name">
                      <span className="cell-value">{job.title}</span>
                    </td>

                    {/* Eligibility cell */}
                    <td className="eligibility-col" data-label="Eligibility">
                      <span className="cell-value">{job.qualification}</span>
                    </td>

                    {/* Last Date cell */}
                    <td className="last-date-col" data-label="Last Date">
                      <span className="cell-value">{job.lastDate}</span>
                    </td>

                    {/* Action button cell */}
                    <td className="action-col" data-label="More">
                      <Link href={`/jobs/${job.id}`} className="btn-view">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="no-records">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1240px;
          margin: 3rem auto 5rem auto;
          padding: 0 1.5rem;
        }

        .header-search-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .page-header {
          text-align: left;
          margin-bottom: 0;
          flex: 1;
          min-width: 300px;
        }

        .page-header h1 {
          font-size: 2.25rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
          font-family: 'Poppins', sans-serif;
        }

        .page-header p {
          color: #64748b;
          font-size: 0.98rem;
          margin: 0;
          line-height: 1.6;
        }

        .search-wrapper {
          position: relative;
          width: 100%;
          max-width: 380px;
          flex-shrink: 0;
        }

        .search-input {
          width: 100%;
          padding: 0.85rem 1.25rem 0.85rem 3rem;
          border: 1px solid #cbd5e1;
          border-radius: 9999px;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s;
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
          box-sizing: border-box;
        }

        .search-input:focus {
          border-color: #0b4ca3;
          box-shadow: 0 4px 12px rgba(11, 76, 163, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .table-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
          overflow: hidden;
        }

        .jobs-table {
          width: 100%;
          border-collapse: collapse;
        }

        .jobs-table th {
          background: #f8fafc;
          color: #475569;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          padding: 1.2rem 1.5rem;
          text-align: left;
          border-bottom: 1.5px solid #e2e8f0;
        }

        .jobs-table td {
          padding: 1.3rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          font-size: 0.92rem;
          color: #334155;
          vertical-align: middle;
          box-sizing: border-box;
        }

        .jobs-table tbody tr:hover td {
          background: #f8fafc;
        }

        .jobs-table tbody tr:last-child td {
          border-bottom: none;
        }

        .publish-date-col {
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
        }

        .board-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }

        .board-col strong {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
        }

        .board-full-name {
          font-size: 0.78rem;
          color: #64748b;
          font-weight: 500;
        }

        .post-name-col {
          font-weight: 700;
          color: #0f172a;
        }

        .eligibility-col {
          color: #475569;
          font-weight: 500;
        }

        .last-date-col {
          color: #475569;
          font-weight: 500;
          white-space: nowrap;
        }

        .action-col {
          text-align: center;
        }

        .btn-view {
          background: #10b981;
          color: #ffffff;
          text-decoration: none;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          display: inline-block;
          transition: background 0.2s;
          border: none;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.15);
        }

        .btn-view:hover {
          background: #059669;
        }

        .no-records {
          text-align: center;
          padding: 3rem;
          color: #64748b;
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .container {
            margin: 2rem auto 4rem auto;
            padding: 0 1rem;
          }
          .header-search-row {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
            gap: 1.5rem;
          }
          .page-header {
            text-align: center;
          }
          .page-header h1 {
            font-size: 1.75rem;
          }
          .page-header p {
            font-size: 0.9rem;
          }
          .search-wrapper {
            max-width: 100%;
          }
          .table-card {
            background: transparent;
            border: none;
            box-shadow: none;
            overflow: visible;
          }
          .jobs-table thead {
            display: none;
          }
          .jobs-table, .jobs-table tbody, .jobs-table tr {
            display: block;
            width: 100%;
          }
          .jobs-table tbody tr {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            margin-bottom: 1rem;
            padding: 1.25rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
            display: flex;
            flex-direction: column;
            gap: 10px;
            box-sizing: border-box;
          }
          .jobs-table td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px dashed #e2e8f0;
            text-align: right;
            width: 100% !important;
            gap: 12px;
          }
          .jobs-table td:last-child {
            border-bottom: none;
            padding-top: 10px;
          }
          .jobs-table td::before {
            content: attr(data-label);
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            font-size: 0.72rem;
            text-align: left;
            letter-spacing: 0.5px;
            flex-shrink: 0;
          }
          .cell-value {
            text-align: right;
            max-width: 65%;
            word-wrap: break-word;
            word-break: break-word;
            display: inline-block;
            color: #0f172a;
            font-size: 0.88rem;
          }
          .board-col.cell-value {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 2px;
          }
          .board-col strong {
            text-align: right;
            font-size: 0.9rem;
          }
          .board-full-name {
            text-align: right;
            font-size: 0.75rem;
          }
          .jobs-table td.action-col::before {
            display: none;
          }
          .jobs-table .action-col {
            justify-content: center;
            padding-top: 12px;
          }
          .jobs-table .btn-view {
            width: 100%;
            text-align: center;
            box-sizing: border-box;
            padding: 0.7rem 1.2rem;
            font-size: 0.88rem;
          }
        }
      `}</style>
    </>
  );
}

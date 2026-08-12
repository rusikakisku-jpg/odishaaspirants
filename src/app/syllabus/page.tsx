'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Eye } from 'lucide-react';

interface SyllabusItem {
  id: string;
  title: string;
  board: 'OSSC' | 'OPSC' | 'OSSSC';
  year: string;
  link: string;
}

const SYLLABUS_DATA: SyllabusItem[] = [
  {
    id: 'syl-1',
    title: 'OSSC Combined Graduate Level (CGL) Syllabus',
    board: 'OSSC',
    year: '2026',
    link: '/jobs/1',
  },
  {
    id: 'syl-2',
    title: 'Odisha Civil Services (OCS) Syllabus',
    board: 'OPSC',
    year: '2026',
    link: '/jobs/2',
  },
  {
    id: 'syl-3',
    title: 'OSSSC Combined Group-C Teachers Syllabus',
    board: 'OSSSC',
    year: '2026',
    link: '/jobs/3',
  },
  {
    id: 'syl-4',
    title: 'OSSC Junior Executive Assistant Syllabus',
    board: 'OSSC',
    year: '2026',
    link: '/jobs/4',
  },
];

export default function SyllabusPage() {
  const [activeBoard, setActiveBoard] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredItems = SYLLABUS_DATA.filter((item) => {
    const matchesBoard = activeBoard === 'All' || item.board === activeBoard;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.board.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBoard && matchesSearch;
  });

  const getBoardBadgeClass = (board: string) => {
    if (board === 'OPSC') return 'board-opsc';
    if (board === 'OSSC') return 'board-ossc';
    return 'board-osssc';
  };

  return (
    <>
      <div className="container">
        {/* Page Header & Search - Matched with odishaaspirants.com/syllabus */}
        <div className="header-search-row">
          <div className="page-header">
            <h1>Exam Syllabus &amp; Schemes</h1>
            <p>View official syllabus PDFs and check detailed question paper patterns and marks scheme.</p>
          </div>

          <div className="search-wrapper">
            <Search className="search-icon" style={{ width: '18px', height: '18px' }} />
            <input
              type="text"
              id="sylSearchInput"
              className="search-input"
              placeholder="Search syllabus by title or board..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search exam syllabus"
            />
          </div>
        </div>

        {/* Board Filter Tabs Row */}
        <div className="filter-row">
          <div className="filter-tabs">
            {['All', 'OSSC', 'OPSC', 'OSSSC'].map((board) => (
              <button
                key={board}
                className={`filter-btn ${activeBoard === board ? 'active' : ''}`}
                onClick={() => setActiveBoard(board)}
              >
                {board === 'All' ? 'All Boards' : board}
              </button>
            ))}
          </div>
        </div>

        {/* Syllabus List */}
        <div className="syllabus-list" id="syllabusList">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className="syllabus-item" data-board={item.board}>
                <div className="syl-item-header">
                  <div className="syl-item-title-area">
                    <span className={`board-badge ${getBoardBadgeClass(item.board)}`}>{item.board}</span>
                    <span className="syl-item-year">{item.year}</span>
                    <h3 className="syl-item-title">{item.title}</h3>
                  </div>
                  <Link href={item.link} className="btn-download">
                    <Eye style={{ width: '15px', height: '15px' }} /> View
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#64748b',
                fontWeight: 600,
              }}
            >
              <p style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', marginBottom: '8px' }}>No Syllabus Found</p>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 400 }}>
                No syllabus matches your search query "{searchTerm}". Try different keywords.
              </p>
            </div>
          )}
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

        .filter-row {
          margin-bottom: 2rem;
          display: flex;
          justify-content: flex-start;
        }

        .filter-tabs {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 0.55rem 1.4rem;
          border-radius: 9999px;
          font-size: 0.88rem;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Poppins', sans-serif;
        }

        .filter-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .filter-btn.active {
          background: #0b4ca3;
          color: #ffffff;
          border-color: #0b4ca3;
          box-shadow: 0 4px 10px rgba(11, 76, 163, 0.2);
        }

        .syllabus-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .syllabus-item {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.25rem 1.5rem;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.01);
          box-sizing: border-box;
        }

        .syllabus-item:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }

        .syl-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .syl-item-title-area {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .board-badge {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .board-opsc {
          background: #e0f2fe;
          color: #0369a1;
        }
        .board-ossc {
          background: #dcfce7;
          color: #15803d;
        }
        .board-osssc {
          background: #fef3c7;
          color: #b45309;
        }

        .syl-item-year {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.5px;
          background: #f1f5f9;
          color: #475569;
        }

        .syl-item-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          font-family: 'Poppins', sans-serif;
        }

        .btn-download {
          background: #10b981;
          color: #ffffff;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 0.2s;
          border: none;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.1);
        }

        .btn-download:hover {
          background: #059669;
        }

        @media (max-width: 768px) {
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
            font-size: 1.85rem;
          }
          .search-wrapper {
            max-width: 100%;
          }
          .filter-row {
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { JobItem } from '@/lib/data';
import { fetchJobsApi, fetchPyqsApi, fetchSyllabusApi } from '@/lib/api';
import {
  Briefcase,
  IdCard,
  Key,
  Star,
  Book,
  FileText,
} from 'lucide-react';

export default function HomePage() {
  const [vacancies, setVacancies] = useState<JobItem[]>([]);
  const [admitCards, setAdmitCards] = useState<JobItem[]>([]);
  const [answerKeys, setAnswerKeys] = useState<JobItem[]>([]);
  const [results, setResults] = useState<JobItem[]>([]);
  const [pyqs, setPyqs] = useState<any[]>([]);
  const [syllabusList, setSyllabusList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllHomeData() {
      const [allJobs, pyqData, sylData] = await Promise.all([
        fetchJobsApi(),
        fetchPyqsApi(),
        fetchSyllabusApi(),
      ]);

      setVacancies(allJobs.filter((j) => j.category === 'vacancy').slice(0, 10));
      setAdmitCards(allJobs.filter((j) => j.category === 'admit').slice(0, 10));
      setAnswerKeys(allJobs.filter((j) => j.category === 'key').slice(0, 10));
      setResults(allJobs.filter((j) => j.category === 'result').slice(0, 10));
      setPyqs(pyqData.slice(0, 10));
      setSyllabusList(sylData.slice(0, 10));

      setLoading(false);
    }
    loadAllHomeData();
  }, []);

  return (
    <>
      <style jsx>{`
        /* Hero Ticker Styles matching odishaaspirants.com */
        .alert-ticker-wrap {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0.6rem 0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .ticker-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .ticker-badge {
          background: #ff7a00;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
          font-family: 'Poppins', sans-serif;
        }

        .ticker-text {
          font-size: 0.88rem;
          color: #334155;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ticker-text strong {
          color: #0b4ca3;
        }

        /* 6-Card Grid Matrix */
        .cards-matrix-section {
          max-width: 1240px;
          margin: 2.5rem auto 4rem auto;
          padding: 0 1.5rem;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .category-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }

        .category-card:hover {
          box-shadow: 0 8px 24px rgba(11, 76, 163, 0.08);
          transform: translateY(-2px);
        }

        .card-header {
          padding: 1.1rem 1.25rem;
          background: #0b4ca3;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .card-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .card-header-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
          font-family: 'Poppins', sans-serif;
          letter-spacing: 0.2px;
        }

        .card-list {
          list-style: none;
          margin: 0;
          padding: 0;
          flex: 1;
        }

        .card-list li {
          border-bottom: 1px solid #f1f5f9;
        }

        .card-list li:last-child {
          border-bottom: none;
        }

        .card-list-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.85rem 1.25rem;
          text-decoration: none;
          color: #334155;
          font-size: 0.88rem;
          font-weight: 500;
          transition: all 0.2s;
          line-height: 1.4;
        }

        .card-list-item:hover {
          background: #f8fafc;
          color: #0b4ca3;
          padding-left: 1.5rem;
        }

        .item-bullet {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ff7a00;
          flex-shrink: 0;
        }

        .card-footer-btn {
          display: block;
          text-align: center;
          padding: 0.85rem;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          color: #0b4ca3;
          font-weight: 700;
          font-size: 0.85rem;
          text-decoration: none;
          transition: background 0.2s;
          font-family: 'Poppins', sans-serif;
        }

        .card-footer-btn:hover {
          background: #eff6ff;
        }

        @media (max-width: 1024px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Alert Notice Ticker matching odishaaspirants.com */}
      <div className="alert-ticker-wrap">
        <div className="ticker-container">
          <span className="ticker-badge">UPDATES</span>
          <div className="ticker-text">
            <strong>Notice:</strong> OPSC Civil Services Exam Date rescheduled to July 12, 2026. Keep practicing!
          </div>
        </div>
      </div>

      {/* 6-Card Grid Section matching odishaaspirants.com */}
      <section className="cards-matrix-section">
        <div className="cards-grid">
          {/* Card 1: Latest Jobs */}
          <div className="category-card">
            <div className="card-header" style={{ background: '#0b4ca3' }}>
              <div className="card-header-left">
                <Briefcase style={{ width: '20px', height: '20px' }} />
                <h2 className="card-header-title">Latest Jobs</h2>
              </div>
            </div>
            <ul className="card-list">
              {loading ? (
                <li style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading D1 database...</li>
              ) : vacancies.length > 0 ? (
                vacancies.map((item) => (
                  <li key={item.id}>
                    <Link href={`/jobs/${item.id}`} className="card-list-item">
                      <span className="item-bullet"></span>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No active vacancies found.</li>
              )}
            </ul>
            <Link href="/latest-jobs" className="card-footer-btn">
              View All Latest Jobs &rarr;
            </Link>
          </div>

          {/* Card 2: Admit Card */}
          <div className="category-card">
            <div className="card-header" style={{ background: '#0284c7' }}>
              <div className="card-header-left">
                <IdCard style={{ width: '20px', height: '20px' }} />
                <h2 className="card-header-title">Admit Card</h2>
              </div>
            </div>
            <ul className="card-list">
              {loading ? (
                <li style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading D1 database...</li>
              ) : admitCards.length > 0 ? (
                admitCards.map((item) => (
                  <li key={item.id}>
                    <Link href={`/jobs/${item.id}`} className="card-list-item">
                      <span className="item-bullet"></span>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No admit cards available.</li>
              )}
            </ul>
            <Link href="/admit-card" className="card-footer-btn">
              View All Admit Cards &rarr;
            </Link>
          </div>

          {/* Card 3: Answer Key */}
          <div className="category-card">
            <div className="card-header" style={{ background: '#059669' }}>
              <div className="card-header-left">
                <Key style={{ width: '20px', height: '20px' }} />
                <h2 className="card-header-title">Answer Key</h2>
              </div>
            </div>
            <ul className="card-list">
              {loading ? (
                <li style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading D1 database...</li>
              ) : answerKeys.length > 0 ? (
                answerKeys.map((item) => (
                  <li key={item.id}>
                    <Link href={`/jobs/${item.id}`} className="card-list-item">
                      <span className="item-bullet"></span>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No answer keys available.</li>
              )}
            </ul>
            <Link href="/answer-key" className="card-footer-btn">
              View All Answer Keys &rarr;
            </Link>
          </div>

          {/* Card 4: Result */}
          <div className="category-card">
            <div className="card-header" style={{ background: '#7c3aed' }}>
              <div className="card-header-left">
                <Star style={{ width: '20px', height: '20px' }} />
                <h2 className="card-header-title">Result</h2>
              </div>
            </div>
            <ul className="card-list">
              {loading ? (
                <li style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading D1 database...</li>
              ) : results.length > 0 ? (
                results.map((item) => (
                  <li key={item.id}>
                    <Link href={`/jobs/${item.id}`} className="card-list-item">
                      <span className="item-bullet"></span>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No exam results available.</li>
              )}
            </ul>
            <Link href="/result" className="card-footer-btn">
              View All Results &rarr;
            </Link>
          </div>

          {/* Card 5: PYQ Papers */}
          <div className="category-card">
            <div className="card-header" style={{ background: '#ea580c' }}>
              <div className="card-header-left">
                <Book style={{ width: '20px', height: '20px' }} />
                <h2 className="card-header-title">PYQ Papers</h2>
              </div>
            </div>
            <ul className="card-list">
              {loading ? (
                <li style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading D1 database...</li>
              ) : pyqs.length > 0 ? (
                pyqs.map((item) => (
                  <li key={item.id}>
                    <Link href="/pyq" className="card-list-item">
                      <span className="item-bullet"></span>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No question papers available.</li>
              )}
            </ul>
            <Link href="/pyq" className="card-footer-btn">
              View All PYQ Papers &rarr;
            </Link>
          </div>

          {/* Card 6: Exam Syllabus */}
          <div className="category-card">
            <div className="card-header" style={{ background: '#475569' }}>
              <div className="card-header-left">
                <FileText style={{ width: '20px', height: '20px' }} />
                <h2 className="card-header-title">Exam Syllabus</h2>
              </div>
            </div>
            <ul className="card-list">
              {loading ? (
                <li style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading D1 database...</li>
              ) : syllabusList.length > 0 ? (
                syllabusList.map((item) => (
                  <li key={item.id}>
                    <Link href={`/jobs/${item.id}`} className="card-list-item">
                      <span className="item-bullet"></span>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No syllabus guides available.</li>
              )}
            </ul>
            <Link href="/syllabus" className="card-footer-btn">
              View All Exam Syllabus &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

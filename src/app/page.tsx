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

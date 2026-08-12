'use client';

import React from 'react';
import { SYLLABUS_DATA } from '@/lib/data';
import { GraduationCap, CheckCircle } from 'lucide-react';

export default function SyllabusPage() {
  return (
    <div style={{ maxWidth: '1240px', margin: '30px auto', padding: '0 1.5rem' }}>
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '30px', marginBottom: '30px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7c3aed', background: 'rgba(124, 58, 237, 0.08)', padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '12px' }}>
          <GraduationCap style={{ width: '16px', height: '16px' }} /> OFFICIAL EXAM PATTERNS
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0', fontFamily: 'Poppins' }}>
          Government Exam Syllabus & Pattern 2026
        </h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
          Comprehensive section-wise syllabus and marks breakdown for OSSSC, OPSC, OSSC, and Railway recruitment examinations.
        </p>
      </div>

      {SYLLABUS_DATA.map((item) => (
        <div key={item.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '30px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ background: '#0b4ca3', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800 }}>
              {item.board}
            </span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', margin: 0, fontFamily: 'Poppins' }}>
              {item.title}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '25px', fontSize: '0.88rem' }}>
            <div><strong>Total Marks:</strong> {item.totalMarks} Marks</div>
            <div><strong>Exam Duration:</strong> {item.durationMinutes} Minutes</div>
            <div><strong>Negative Marking:</strong> {item.negativeMarking}</div>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '15px', fontFamily: 'Poppins' }}>
            1. Exam Pattern & Marks Distribution
          </h3>

          <div style={{ overflowX: 'auto', marginBottom: '30px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ background: '#0f172a', color: 'white' }}>
                  <th style={{ padding: '12px 16px', borderRadius: '8px 0 0 0' }}>Section Name</th>
                  <th style={{ padding: '12px 16px' }}>Number of Questions</th>
                  <th style={{ padding: '12px 16px', borderRadius: '0 8px 0 0' }}>Maximum Marks</th>
                </tr>
              </thead>
              <tbody>
                {item.examPattern.map((ep, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>{ep.section}</td>
                    <td style={{ padding: '12px 16px' }}>{ep.questions} Questions</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0b4ca3' }}>{ep.marks} Marks</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '15px', fontFamily: 'Poppins' }}>
            2. Detailed Subject-Wise Topics
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {item.topics.map((top, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                <h4 style={{ fontSize: '1rem', color: '#0b4ca3', fontWeight: 700, marginTop: 0, marginBottom: '12px' }}>
                  {top.category}
                </h4>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#334155' }}>
                  {top.details.map((d, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle style={{ width: '14px', height: '14px', color: '#059669', flexShrink: 0 }} />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

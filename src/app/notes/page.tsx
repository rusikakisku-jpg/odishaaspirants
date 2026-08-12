'use client';

import React, { useState } from 'react';
import { NOTES_DATA } from '@/lib/data';
import { BookOpen, Download, Search, FileText } from 'lucide-react';

export default function NotesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const filteredNotes = NOTES_DATA.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || n.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '30px auto', padding: '0 1.5rem' }}>
      {/* Hero Header */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '30px', marginBottom: '30px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#059669', background: 'rgba(5, 150, 105, 0.08)', padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '12px' }}>
          <BookOpen style={{ width: '16px', height: '16px' }} /> SPECIAL EXAM HANDBOOKS
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0', fontFamily: 'Poppins' }}>
          Subject Notes & Exam Capsules 2026
        </h1>
        <p style={{ color: '#64748b', margin: '0 0 20px 0', fontSize: '0.95rem' }}>
          Free PDF study notes for Odisha History, Odia Grammar (ଓଡ଼ିଆ ବ୍ୟାକରଣ), Arithmetic, Computer Knowledge, and Current Affairs.
        </p>

        {/* Search */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search topic or handbook title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', color: '#0f172a' }}
          >
            <option value="all">All Subjects</option>
            <option value="General Knowledge">General Knowledge</option>
            <option value="Odia Language">Odia Language</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Computer">Computer</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ background: 'rgba(11, 76, 163, 0.1)', color: '#0b4ca3', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800 }}>
                  {note.subject}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  📄 {note.pages} Pages • {note.fileSize}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 10px 0', fontFamily: 'Poppins', lineHeight: 1.4 }}>
                {note.title}
              </h3>

              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
                <strong>Topic Category:</strong> {note.category}
              </div>
            </div>

            <a
              href={note.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#0b4ca3',
                color: 'white',
                textDecoration: 'none',
                textAlign: 'center',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Download style={{ width: '16px', height: '16px' }} /> Download Free PDF Handbook
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

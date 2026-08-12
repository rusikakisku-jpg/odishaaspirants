'use client';

import React, { useState, useEffect } from 'react';
import { fetchNotesApi } from '@/lib/api';
import { BookOpen, Download, Search, FileText } from 'lucide-react';

export default function NotesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchNotesApi();
      setNotes(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.topics && n.topics.some((t: any) => t.title.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '30px auto', padding: '0 1.5rem' }}>
      {/* Hero Header */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '30px', marginBottom: '30px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#059669', background: 'rgba(5, 150, 105, 0.08)', padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '12px' }}>
          <BookOpen style={{ width: '16px', height: '16px' }} /> SPECIAL EXAM HANDBOOKS
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0', fontFamily: 'Poppins' }}>
          Subject Notes &amp; Exam Capsules 2026
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', background: 'white', fontSize: '0.9rem', cursor: 'pointer' }}
          >
            <option value="all">All Subject Categories</option>
            <option value="History & Culture">History &amp; Culture</option>
            <option value="Geography">Geography</option>
            <option value="Indian Polity">Indian Polity</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading study notes from Cloudflare D1...
          </div>
        ) : filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '1.4rem' }}>{note.icon}</span>
                  <span style={{ background: note.color ? `${note.color}15` : 'rgba(11,76,163,0.1)', color: note.color || '#0b4ca3', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                    {note.category}
                  </span>
                </div>

                {note.topics && note.topics.length > 0 ? (
                  note.topics.map((t: any) => (
                    <div key={t.id} style={{ marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0', fontFamily: 'Poppins' }}>
                        {t.title}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                        {t.description}
                      </p>

                      {t.chapters && t.chapters.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {t.chapters.map((ch: any) => (
                            <a
                              key={ch.id}
                              href="#"
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '6px', textDecoration: 'none', color: '#334155', fontSize: '0.82rem', fontWeight: 600 }}
                            >
                              <span>📖 {ch.chapter_title}</span>
                              <Download style={{ width: '14px', height: '14px', color: '#059669' }} />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 12px 0', fontFamily: 'Poppins' }}>
                    {note.category} Handbook
                  </h3>
                )}
              </div>

              <a
                href="#"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#059669', color: 'white', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', marginTop: '15px' }}
              >
                <Download style={{ width: '16px', height: '16px' }} /> Download Full Handbook PDF
              </a>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#64748b' }}>
            No study notes found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

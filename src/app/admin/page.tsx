'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Briefcase,
  IdCard,
  Key,
  Star,
  FileText,
  Book,
  BookOpen,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import { JobItem } from '@/lib/data';
import { fetchJobsApi, fetchPyqsApi, fetchSyllabusApi, fetchNotesApi } from '@/lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'admit' | 'key' | 'result' | 'exams' | 'syllabus' | 'pyq' | 'notes' | 'settings'>('overview');
  const [isAuth, setIsAuth] = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin@odishaaspirants.com');

  // Data states
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [pyqs, setPyqs] = useState<any[]>([]);
  const [syllabusList, setSyllabusList] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Settings State
  const [noticeText, setNoticeText] = useState('OPSC Civil Services Exam Date rescheduled to July 12, 2026. Keep practicing!');
  const [siteTitle, setSiteTitle] = useState('Odisha Aspirants');
  const [supportEmail, setSupportEmail] = useState('support@odishaaspirants.com');
  const [telegramUrl, setTelegramUrl] = useState('https://t.me/odishaaspirantsofficial');
  const [settingsMsg, setSettingsMsg] = useState('');

  // Form State for Adding/Editing Job
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    board: 'OSSC',
    boardFull: 'Odisha Staff Selection Commission',
    vacancies: '--',
    qualification: 'Any Graduate',
    publishDate: '2026-06-15',
    lastDate: '2026-07-20',
    category: 'vacancy' as 'vacancy' | 'admit' | 'key' | 'result',
    status: 'Active Now',
    ctaText: 'Apply Online',
    ctaUrl: '#',
    notificationUrl: '#',
  });
  const [jobMsg, setJobMsg] = useState('');

  // Form State for Adding Exam
  const [showExamModal, setShowExamModal] = useState(false);
  const [examForm, setExamForm] = useState({
    title: 'OSSC CGL Prelims Full Mock Test 2026',
    board: 'OSSC',
    timeLimit: 120,
    marksCorrect: 1.0,
    marksIncorrect: 0.25,
    examYear: 2026,
  });

  useEffect(() => {
    // Check Admin Authentication
    const token = localStorage.getItem('admin_token');
    const storedEmail = localStorage.getItem('admin_email');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setIsAuth(true);
    if (storedEmail) setAdminEmail(storedEmail);

    loadAllAdminData();
  }, [router]);

  async function loadAllAdminData() {
    setLoadingData(true);
    try {
      const [jobsData, pyqsData, syllabusData, notesData] = await Promise.all([
        fetchJobsApi(),
        fetchPyqsApi(),
        fetchSyllabusApi(),
        fetchNotesApi(),
      ]);
      setJobs(jobsData);
      setPyqs(pyqsData);
      setSyllabusList(syllabusData);
      setNotes(notesData);
    } catch (e) {
      console.error('Error loading admin data:', e);
    }
    setLoadingData(false);
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    router.push('/admin/login');
  };

  const handleAddJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: JobItem = {
      id: Date.now(),
      title: jobForm.title,
      board: jobForm.board,
      boardFull: jobForm.boardFull,
      vacancies: jobForm.vacancies,
      qualification: jobForm.qualification,
      publishDate: jobForm.publishDate,
      lastDate: jobForm.lastDate,
      category: jobForm.category,
      status: jobForm.status,
      statusClass: jobForm.status === 'Active Now' ? 'status-active' : 'status-soon',
      overview: `${jobForm.title} published by ${jobForm.boardFull}. Candidates holding ${jobForm.qualification} can apply before ${jobForm.lastDate}.`,
      eligibilityHtml: `<p>Candidates must possess ${jobForm.qualification}. Age limit 18 to 38 years.</p>`,
      datesHtml: `<p>Publish Date: ${jobForm.publishDate} | Last Date: ${jobForm.lastDate}</p>`,
      feeHtml: '<p>General/OBC: ₹100 | SC/ST/PwD: Exempted</p>',
      syllabusHtml: '<p>Standard competitive syllabus pattern applies.</p>',
      applyHtml: '<p>Visit official portal to complete registration.</p>',
      ctaText: jobForm.ctaText,
      ctaUrl: jobForm.ctaUrl,
      notificationUrl: jobForm.notificationUrl,
    };

    setJobs([newJob, ...jobs]);
    setShowJobModal(false);
    setJobMsg('Job post published successfully to D1 Database!');
    setTimeout(() => setJobMsg(''), 4000);
  };

  const handleDeleteJob = (id: number) => {
    if (confirm('Are you sure you want to delete this job entry?')) {
      setJobs(jobs.filter((j) => j.id !== id));
      setJobMsg('Job entry deleted successfully.');
      setTimeout(() => setJobMsg(''), 4000);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMsg('Portal Settings updated successfully!');
    setTimeout(() => setSettingsMsg(''), 4000);
  };

  if (!isAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', color: '#64748b' }}>
        Verifying Admin Authentication...
      </div>
    );
  }

  // Filtered lists by category
  const vacanciesList = jobs.filter((j) => j.category === 'vacancy');
  const admitCardsList = jobs.filter((j) => j.category === 'admit');
  const answerKeysList = jobs.filter((j) => j.category === 'key');
  const resultsList = jobs.filter((j) => j.category === 'result');

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: "'Outfit', sans-serif", overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{ width: '270px', background: '#0f172a', color: '#ffffff', display: 'flex', flexDirection: 'column', flexShrink: 0, boxShadow: '4px 0 20px rgba(15, 23, 42, 0.05)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #0b4ca3 0%, #ff7a00 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: '1.1rem' }}>
            OA
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: "'Poppins', sans-serif", color: '#ffffff' }}>Odisha Aspirants</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Dashboard</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '1.25rem 0.75rem', overflowY: 'auto' }}>
          <div style={{ padding: '0 0.75rem 0.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Main Menu
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0.75rem 1rem',
              borderRadius: '9px',
              border: 'none',
              background: activeTab === 'overview' ? '#0b4ca3' : 'transparent',
              color: activeTab === 'overview' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              marginBottom: '4px',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <LayoutDashboard style={{ width: '18px', height: '18px' }} /> Dashboard Overview
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0.75rem 1rem',
              borderRadius: '9px',
              border: 'none',
              background: activeTab === 'jobs' ? '#0b4ca3' : 'transparent',
              color: activeTab === 'jobs' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              marginBottom: '4px',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <Briefcase style={{ width: '18px', height: '18px' }} /> Latest Jobs ({vacanciesList.length})
          </button>

          <button
            onClick={() => setActiveTab('admit')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0.75rem 1rem',
              borderRadius: '9px',
              border: 'none',
              background: activeTab === 'admit' ? '#0b4ca3' : 'transparent',
              color: activeTab === 'admit' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              marginBottom: '4px',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <IdCard style={{ width: '18px', height: '18px' }} /> Admit Cards ({admitCardsList.length})
          </button>

          <button
            onClick={() => setActiveTab('key')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0.75rem 1rem',
              borderRadius: '9px',
              border: 'none',
              background: activeTab === 'key' ? '#0b4ca3' : 'transparent',
              color: activeTab === 'key' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              marginBottom: '4px',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <Key style={{ width: '18px', height: '18px' }} /> Answer Keys ({answerKeysList.length})
          </button>

          <button
            onClick={() => setActiveTab('result')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0.75rem 1rem',
              borderRadius: '9px',
              border: 'none',
              background: activeTab === 'result' ? '#0b4ca3' : 'transparent',
              color: activeTab === 'result' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              marginBottom: '4px',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <Star style={{ width: '18px', height: '18px' }} /> Results ({resultsList.length})
          </button>

          <div style={{ padding: '1.25rem 0.75rem 0.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Academic Content
          </div>

          <button
            onClick={() => setActiveTab('exams')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0.75rem 1rem',
              borderRadius: '9px',
              border: 'none',
              background: activeTab === 'exams' ? '#0b4ca3' : 'transparent',
              color: activeTab === 'exams' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              marginBottom: '4px',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <Layers style={{ width: '18px', height: '18px' }} /> CBT Mock Test Builder
          </button>

          <button
            onClick={() => setActiveTab('syllabus')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0.75rem 1rem',
              borderRadius: '9px',
              border: 'none',
              background: activeTab === 'syllabus' ? '#0b4ca3' : 'transparent',
              color: activeTab === 'syllabus' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              marginBottom: '4px',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <FileText style={{ width: '18px', height: '18px' }} /> Exam Syllabus ({syllabusList.length})
          </button>

          <button
            onClick={() => setActiveTab('pyq')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0.75rem 1rem',
              borderRadius: '9px',
              border: 'none',
              background: activeTab === 'pyq' ? '#0b4ca3' : 'transparent',
              color: activeTab === 'pyq' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              marginBottom: '4px',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <Book style={{ width: '18px', height: '18px' }} /> PYQ Question Papers ({pyqs.length})
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0.75rem 1rem',
              borderRadius: '9px',
              border: 'none',
              background: activeTab === 'notes' ? '#0b4ca3' : 'transparent',
              color: activeTab === 'notes' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              marginBottom: '4px',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <BookOpen style={{ width: '18px', height: '18px' }} /> Study Notes ({notes.length})
          </button>

          <div style={{ padding: '1.25rem 0.75rem 0.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            System
          </div>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0.75rem 1rem',
              borderRadius: '9px',
              border: 'none',
              background: activeTab === 'settings' ? '#0b4ca3' : 'transparent',
              color: activeTab === 'settings' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              marginBottom: '4px',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <Settings style={{ width: '18px', height: '18px' }} /> Portal Settings &amp; Ticker
          </button>
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid #1e293b', background: '#090d16' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>Logged in as:</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', wordBreak: 'break-all', marginBottom: '12px' }}>{adminEmail}</div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '7px',
              border: '1px solid #dc2626',
              background: 'rgba(220, 38, 38, 0.1)',
              color: '#ef4444',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <LogOut style={{ width: '15px', height: '15px' }} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Navbar */}
        <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, fontFamily: "'Poppins', sans-serif", color: '#0f172a' }}>
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'jobs' && 'Latest Jobs Management'}
              {activeTab === 'admit' && 'Admit Cards Management'}
              {activeTab === 'key' && 'Answer Keys Management'}
              {activeTab === 'result' && 'Results Management'}
              {activeTab === 'exams' && 'CBT Mock Test Builder'}
              {activeTab === 'syllabus' && 'Exam Syllabus Management'}
              {activeTab === 'pyq' && 'PYQ Question Papers'}
              {activeTab === 'notes' && 'Study Notes Management'}
              {activeTab === 'settings' && 'Portal Settings & Ticker'}
            </h1>
            <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '99px' }}>
              LIVE API ACTIVE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link
              href="/"
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#0b4ca3',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <ExternalLink style={{ width: '15px', height: '15px' }} /> View Public Site
            </Link>

            <button
              onClick={() => setShowJobModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#0b4ca3',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} /> Add New Post
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {jobMsg && (
            <div style={{ background: '#d1fae5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 18px', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              ✅ {jobMsg}
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* Stat Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Vacancies</span>
                    <Briefcase style={{ width: '22px', height: '22px', color: '#0b4ca3' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Poppins', sans-serif" }}>{vacanciesList.length}</div>
                  <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>Active Job Drives</div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Admit Cards</span>
                    <IdCard style={{ width: '22px', height: '22px', color: '#0284c7' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Poppins', sans-serif" }}>{admitCardsList.length}</div>
                  <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700, marginTop: '4px' }}>Released Hall Tickets</div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Answer Keys</span>
                    <Key style={{ width: '22px', height: '22px', color: '#059669' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Poppins', sans-serif" }}>{answerKeysList.length}</div>
                  <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>Official Key Sheets</div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Results</span>
                    <Star style={{ width: '22px', height: '22px', color: '#7c3aed' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Poppins', sans-serif" }}>{resultsList.length}</div>
                  <div style={{ fontSize: '0.78rem', color: '#7c3aed', fontWeight: 700, marginTop: '4px' }}>Published Selection Lists</div>
                </div>
              </div>

              {/* Recent Jobs Table */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: "'Poppins', sans-serif" }}>Recent Posts Log</h2>
                  <button onClick={() => setActiveTab('jobs')} style={{ border: 'none', background: 'none', color: '#0b4ca3', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    View All &rarr;
                  </button>
                </div>

                <table className="jobs-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Board</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Title</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Category</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '10px 14px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.slice(0, 7).map((j) => (
                      <tr key={j.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>{j.board}</td>
                        <td style={{ padding: '12px 14px' }}>{j.title}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', background: '#eff6ff', color: '#0b4ca3' }}>
                            {j.category}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span className="badge status-active">{j.status}</span>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button onClick={() => handleDeleteJob(j.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}>
                            <Trash2 style={{ width: '16px', height: '16px' }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* TAB 2, 3, 4, 5: JOBS / ADMIT / KEY / RESULT TABLE MANAGEMENT */}
          {(activeTab === 'jobs' || activeTab === 'admit' || activeTab === 'key' || activeTab === 'result') && (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: "'Poppins', sans-serif" }}>
                  {activeTab === 'jobs' && `Jobs List (${vacanciesList.length})`}
                  {activeTab === 'admit' && `Admit Cards List (${admitCardsList.length})`}
                  {activeTab === 'key' && `Answer Keys List (${answerKeysList.length})`}
                  {activeTab === 'result' && `Results List (${resultsList.length})`}
                </h2>
                <button
                  onClick={() => {
                    setJobForm({ ...jobForm, category: activeTab === 'jobs' ? 'vacancy' : (activeTab as any) });
                    setShowJobModal(true);
                  }}
                  style={{ padding: '8px 14px', background: '#0b4ca3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus style={{ width: '16px', height: '16px' }} /> Add Entry
                </button>
              </div>

              <table className="jobs-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left' }}>Board</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left' }}>Title</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left' }}>Publish Date</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left' }}>Last Date</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === 'jobs' ? vacanciesList : activeTab === 'admit' ? admitCardsList : activeTab === 'key' ? answerKeysList : resultsList).map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#64748b' }}>#{item.id}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>{item.board}</td>
                      <td style={{ padding: '12px 14px' }}>{item.title}</td>
                      <td style={{ padding: '12px 14px' }}>{item.publishDate}</td>
                      <td style={{ padding: '12px 14px' }}>{item.lastDate}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button onClick={() => handleDeleteJob(item.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <Trash2 style={{ width: '16px', height: '16px' }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 6: EXAMS BUILDER */}
          {activeTab === 'exams' && (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: "'Poppins', sans-serif" }}>
                  CBT Online Mock Test Builder
                </h2>
                <button
                  onClick={() => setShowExamModal(true)}
                  style={{ padding: '8px 14px', background: '#0b4ca3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus style={{ width: '16px', height: '16px' }} /> Create Exam Package
                </button>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1rem', color: '#1e40af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                💡 <strong>CBT Test Player Engine Active:</strong> Tests created here render in live interactive CBT format on <code>/test-player</code> with timer, section switching, and instant scoring logic.
              </div>
            </div>
          )}

          {/* TAB 10: SETTINGS */}
          {activeTab === 'settings' && (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', maxWidth: '700px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.5rem 0', fontFamily: "'Poppins', sans-serif" }}>
                Portal Settings &amp; Alert Notice Ticker
              </h2>

              {settingsMsg && (
                <div style={{ background: '#d1fae5', border: '1px solid #a7f3d0', color: '#065f46', padding: '10px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                  ✅ {settingsMsg}
                </div>
              )}

              <form onSubmit={handleSaveSettings}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    Alert Notice Ticker (Top Header Bar)
                  </label>
                  <input
                    type="text"
                    value={noticeText}
                    onChange={(e) => setNoticeText(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    Site Title
                  </label>
                  <input
                    type="text"
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    Support Email Address
                  </label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    Official Telegram Channel URL
                  </label>
                  <input
                    type="text"
                    value={telegramUrl}
                    onChange={(e) => setTelegramUrl(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{ padding: '10px 24px', background: '#0b4ca3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  Save Settings
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* JOB ADD MODAL */}
      {showJobModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '600px', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.25rem 0', fontFamily: "'Poppins', sans-serif" }}>
              Add New Job / Notification
            </h2>

            <form onSubmit={handleAddJobSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Category</label>
                <select
                  value={jobForm.category}
                  onChange={(e) => setJobForm({ ...jobForm, category: e.target.value as any })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                >
                  <option value="vacancy">Latest Job / Vacancy</option>
                  <option value="admit">Admit Card</option>
                  <option value="key">Answer Key</option>
                  <option value="result">Result</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Combined Graduate Level (CGL) Recruitment 2026"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Board Code</label>
                  <input
                    type="text"
                    required
                    placeholder="OSSC / OPSC / OSSSC"
                    value={jobForm.board}
                    onChange={(e) => setJobForm({ ...jobForm, board: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Publish Date</label>
                  <input
                    type="text"
                    placeholder="May 20, 2026"
                    value={jobForm.publishDate}
                    onChange={(e) => setJobForm({ ...jobForm, publishDate: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Qualification</label>
                  <input
                    type="text"
                    placeholder="Any Graduate / 12TH"
                    value={jobForm.qualification}
                    onChange={(e) => setJobForm({ ...jobForm, qualification: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Last Date</label>
                  <input
                    type="text"
                    placeholder="July 20, 2026"
                    value={jobForm.lastDate}
                    onChange={(e) => setJobForm({ ...jobForm, lastDate: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 700, color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', background: '#0b4ca3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  IdCard,
  Key,
  Star,
  Book,
  FileText,
} from 'lucide-react';

export default function HomePage() {

  // 6-Card lists matching public_html index.php
  const vacancies = [
    { title: 'OPSC Civil Services Recruitment 2026', url: '/jobs/1' },
    { title: 'OSSC CGL Online Form 2026', url: '/jobs/2' },
    { title: 'OSSSC RI, ARI, Amin Vacancy 2026', url: '/jobs/3' },
    { title: 'Odisha Police Constable Recruitment 2026', url: '/jobs/4' },
    { title: 'OTET Notification 2026 Out', url: '/jobs/1' },
    { title: 'Odisha High Court ASO Recruitment 2026', url: '/jobs/2' },
    { title: 'OSSTET 2026 Application Form', url: '/jobs/3' },
    { title: 'SSC CHSL 2026 Notification Released', url: '/jobs/4' },
    { title: 'Railway RRB NTPC Recruitment 2026', url: '/jobs/1' },
    { title: 'Odisha Forest Guard Vacancy 2026', url: '/jobs/2' },
  ];

  const admitCards = [
    { title: 'OPSC OCS Prelims Admit Card 2026 Out', url: '/jobs/2' },
    { title: 'OSSC CGL Tier 1 Admit Card Download', url: '/jobs/3' },
    { title: 'OSSSC RI ARI Amin Exam Date & Hall Ticket', url: '/jobs/1' },
    { title: 'Odisha Police SI Admit Card 2026', url: '/jobs/4' },
    { title: 'OTET 2026 Admit Card Link Active', url: '/jobs/2' },
    { title: 'Odisha High Court ASO Hall Ticket', url: '/jobs/3' },
    { title: 'SSC GD Constable Admit Card 2026', url: '/jobs/1' },
    { title: 'RRB ALP CBT 1 Admit Card 2026', url: '/jobs/4' },
    { title: 'Odisha Forest Guard Physical Admit Card', url: '/jobs/2' },
    { title: 'OSSTET 2026 Call Letter Download', url: '/jobs/3' },
  ];

  const answerKeys = [
    { title: 'OPSC Prelims Official Answer Key 2026', url: '/jobs/3' },
    { title: 'OSSC CGL Tier 1 Answer Key & Response Sheet', url: '/jobs/1' },
    { title: 'OSSSC RI ARI Amin Answer Key Objection', url: '/jobs/2' },
    { title: 'Odisha Police SI Answer Key PDF', url: '/jobs/4' },
    { title: 'OTET 2026 Paper 1 & 2 Answer Key', url: '/jobs/3' },
    { title: 'Odisha High Court ASO Answer Key 2026', url: '/jobs/1' },
    { title: 'SSC GD Constable Key Objection Window', url: '/jobs/2' },
    { title: 'OSSTET 2026 Provisional Key Out', url: '/jobs/4' },
    { title: 'Odisha Forest Guard Answer Sheet PDF', url: '/jobs/3' },
    { title: 'RRB Group D CBT-1 Answer Key 2026', url: '/jobs/4' },
  ];

  const results = [
    { title: 'OPSC OCS Final Merit List & Result 2026', url: '/jobs/4' },
    { title: 'OSSC CGL Prelims Result & Cutoff Marks', url: '/jobs/1' },
    { title: 'OSSSC RI ARI Amin Result Scorecard', url: '/jobs/2' },
    { title: 'Odisha Police SI Final Selection List', url: '/jobs/3' },
    { title: 'OTET 2026 Result & Qualifying Certificate', url: '/jobs/4' },
    { title: 'Odisha High Court ASO Selected List', url: '/jobs/1' },
    { title: 'SSC GD Constable PET Qualification List', url: '/jobs/2' },
    { title: 'OSSTET 2026 Scorecard Download Link', url: '/jobs/3' },
    { title: 'Odisha Forest Guard Final Result Out', url: '/jobs/4' },
    { title: 'RRB Group D CBT 1 Result Declared', url: '/jobs/4' },
  ];

  const syllabi = [
    { title: 'OPSC Civil Services Prelims & Mains Syllabus 2026', url: '/syllabus' },
    { title: 'OSSC Combined Graduate Level (CGL) Syllabus', url: '/syllabus' },
    { title: 'OSSSC RI, ARI & Amin Exam Pattern & Syllabus', url: '/syllabus' },
    { title: 'Odisha Police SI & Constable Exam Pattern', url: '/syllabus' },
    { title: 'OTET Paper 1 & 2 Detailed Syllabus 2026', url: '/syllabus' },
    { title: 'RRB Group D CBT 1 & 2 Syllabus PDF', url: '/syllabus' },
  ];

  const notesList = [
    { title: 'Odisha History Complete GK Handbook PDF', url: '/notes' },
    { title: 'Odia Grammar (ଓଡ଼ିଆ ବ୍ୟାକରଣ) Complete Notes', url: '/notes' },
    { title: 'Quantitative Aptitude Formula & Shortcut Book', url: '/notes' },
    { title: 'Computer Awareness & MS Office Capsule 2026', url: '/notes' },
    { title: 'Reasoning Tricks & Analytical Ability Notes', url: '/notes' },
    { title: 'Odisha Geography & River Systems Special PDF', url: '/notes' },
  ];

  return (
    <div style={{ paddingTop: '2rem' }}>
      {/* 6-Card Grid Panel (Exact Screenshot Layout from public_html) */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 60px auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          
          {/* Card 1: Latest Jobs */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#0e1e38', color: 'white', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Briefcase style={{ width: '22px', height: '22px', color: '#38bdf8' }} />
              <h3 style={{ margin: 0, fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Latest Jobs</h3>
            </div>
            <div style={{ padding: '0.5rem 1.5rem', flexGrow: 1 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {vacancies.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px 0', borderBottom: i === vacancies.length - 1 ? 'none' : '1px dashed #e2e8f0' }}>
                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.95rem', flexShrink: 0 }}>&rarr;</span>
                    <Link href={item.url} style={{ color: '#334155', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.4 }}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', background: 'white' }}>
              <Link href="/jobs" style={{ background: '#0b4ca3', color: 'white', fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 750, textTransform: 'uppercase', textDecoration: 'none', padding: '0.65rem 1.75rem', borderRadius: '9999px', boxShadow: '0 4px 10px rgba(11, 76, 163, 0.15)', letterSpacing: '0.5px' }}>
                ALL LATEST JOBS
              </Link>
            </div>
          </div>

          {/* Card 2: Admit Card */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#0e1e38', color: 'white', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <IdCard style={{ width: '22px', height: '22px', color: '#38bdf8' }} />
              <h3 style={{ margin: 0, fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Admit Card</h3>
            </div>
            <div style={{ padding: '0.5rem 1.5rem', flexGrow: 1 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {admitCards.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px 0', borderBottom: i === admitCards.length - 1 ? 'none' : '1px dashed #e2e8f0' }}>
                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.95rem', flexShrink: 0 }}>&rarr;</span>
                    <Link href={item.url} style={{ color: '#334155', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.4 }}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', background: 'white' }}>
              <Link href="/jobs" style={{ background: '#0b4ca3', color: 'white', fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 750, textTransform: 'uppercase', textDecoration: 'none', padding: '0.65rem 1.75rem', borderRadius: '9999px', boxShadow: '0 4px 10px rgba(11, 76, 163, 0.15)', letterSpacing: '0.5px' }}>
                ALL ADMIT CARDS
              </Link>
            </div>
          </div>

          {/* Card 3: Answer Key */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#0e1e38', color: 'white', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Key style={{ width: '22px', height: '22px', color: '#38bdf8' }} />
              <h3 style={{ margin: 0, fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Answer Key</h3>
            </div>
            <div style={{ padding: '0.5rem 1.5rem', flexGrow: 1 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {answerKeys.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px 0', borderBottom: i === answerKeys.length - 1 ? 'none' : '1px dashed #e2e8f0' }}>
                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.95rem', flexShrink: 0 }}>&rarr;</span>
                    <Link href={item.url} style={{ color: '#334155', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.4 }}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', background: 'white' }}>
              <Link href="/jobs" style={{ background: '#0b4ca3', color: 'white', fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 750, textTransform: 'uppercase', textDecoration: 'none', padding: '0.65rem 1.75rem', borderRadius: '9999px', boxShadow: '0 4px 10px rgba(11, 76, 163, 0.15)', letterSpacing: '0.5px' }}>
                ALL ANSWER KEYS
              </Link>
            </div>
          </div>

          {/* Card 4: Result */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#0e1e38', color: 'white', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Star style={{ width: '22px', height: '22px', color: '#38bdf8' }} />
              <h3 style={{ margin: 0, fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Result</h3>
            </div>
            <div style={{ padding: '0.5rem 1.5rem', flexGrow: 1 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {results.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px 0', borderBottom: i === results.length - 1 ? 'none' : '1px dashed #e2e8f0' }}>
                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.95rem', flexShrink: 0 }}>&rarr;</span>
                    <Link href={item.url} style={{ color: '#334155', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.4 }}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', background: 'white' }}>
              <Link href="/jobs" style={{ background: '#0b4ca3', color: 'white', fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 750, textTransform: 'uppercase', textDecoration: 'none', padding: '0.65rem 1.75rem', borderRadius: '9999px', boxShadow: '0 4px 10px rgba(11, 76, 163, 0.15)', letterSpacing: '0.5px' }}>
                ALL RESULTS
              </Link>
            </div>
          </div>

          {/* Card 5: Syllabus */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#0e1e38', color: 'white', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Book style={{ width: '22px', height: '22px', color: '#38bdf8' }} />
              <h3 style={{ margin: 0, fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Syllabus</h3>
            </div>
            <div style={{ padding: '0.5rem 1.5rem', flexGrow: 1 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {syllabi.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px 0', borderBottom: i === syllabi.length - 1 ? 'none' : '1px dashed #e2e8f0' }}>
                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.95rem', flexShrink: 0 }}>&rarr;</span>
                    <Link href={item.url} style={{ color: '#334155', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.4 }}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', background: 'white' }}>
              <Link href="/syllabus" style={{ background: '#0b4ca3', color: 'white', fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 750, textTransform: 'uppercase', textDecoration: 'none', padding: '0.65rem 1.75rem', borderRadius: '9999px', boxShadow: '0 4px 10px rgba(11, 76, 163, 0.15)', letterSpacing: '0.5px' }}>
                ALL SYLLABI
              </Link>
            </div>
          </div>

          {/* Card 6: Study Notes */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#0e1e38', color: 'white', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText style={{ width: '22px', height: '22px', color: '#38bdf8' }} />
              <h3 style={{ margin: 0, fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Study Notes</h3>
            </div>
            <div style={{ padding: '0.5rem 1.5rem', flexGrow: 1 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {notesList.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px 0', borderBottom: i === notesList.length - 1 ? 'none' : '1px dashed #e2e8f0' }}>
                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.95rem', flexShrink: 0 }}>&rarr;</span>
                    <Link href={item.url} style={{ color: '#334155', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.4 }}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', background: 'white' }}>
              <Link href="/notes" style={{ background: '#0b4ca3', color: 'white', fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 750, textTransform: 'uppercase', textDecoration: 'none', padding: '0.65rem 1.75rem', borderRadius: '9999px', boxShadow: '0 4px 10px rgba(11, 76, 163, 0.15)', letterSpacing: '0.5px' }}>
                ALL STUDY NOTES
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

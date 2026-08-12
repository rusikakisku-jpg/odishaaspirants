export interface JobItem {
  id: number;
  title: string;
  board: string;
  boardFull: string;
  vacancies: string;
  qualification: string;
  lastDate: string;
  publishDate: string;
  status: string; // 'Active Now' | 'Release Soon' | 'Closed' | 'Declared'
  statusClass: 'status-active' | 'status-soon' | 'status-announced' | 'status-closed';
  category: 'vacancy' | 'admit' | 'key' | 'result';
  overview: string;
  eligibilityHtml: string;
  datesHtml: string;
  feeHtml: string;
  syllabusHtml: string;
  applyHtml: string;
  ctaText: string;
  ctaUrl: string;
  notificationUrl: string;
}

export interface PYQItem {
  id: number;
  title: string;
  board: string;
  year: number;
  totalQuestions: number;
  duration: string;
  pdfUrl: string;
  subject: string;
}

export interface NoteItem {
  id: number;
  title: string;
  subject: string;
  category: string;
  pages: number;
  fileSize: string;
  pdfUrl: string;
}

export interface SyllabusItem {
  id: number;
  title: string;
  board: string;
  examPattern: { section: string; questions: number; marks: number }[];
  totalMarks: number;
  durationMinutes: number;
  negativeMarking: string;
  topics: { category: string; details: string[] }[];
}

export interface Question {
  id: number;
  section: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
}

export interface Exam {
  id: number;
  title: string;
  board: string;
  timeLimitMinutes: number;
  marksCorrect: number;
  marksIncorrect: number;
  examYear: number;
  sections: string[];
  questions: Question[];
}

// Initial Mock Data
export const JOBS_DATA: JobItem[] = [
  {
    id: 1,
    title: 'OSSSC Combined Recruitment Examination 2026 (CRE IV)',
    board: 'OSSSC',
    boardFull: 'Odisha Sub-Ordinate Staff Selection Commission',
    vacancies: '2,895 Posts',
    qualification: '10th / 12th Pass',
    lastDate: '30-Aug-2026',
    publishDate: '01-Aug-2026',
    status: 'Active Now',
    statusClass: 'status-active',
    category: 'vacancy',
    overview: 'Odisha Sub-Ordinate Staff Selection Commission (OSSSC) has released notification for Combined Recruitment Exam IV for RI, ARI, Amin, and Forest Guard posts.',
    eligibilityHtml: '<ul><li><strong>Age Limit:</strong> 21 to 38 years (Age relaxation applicable as per Odisha Govt rules)</li><li><strong>Educational Qualification:</strong> Passed Higher Secondary (10+2) Examination from CHSE Odisha or equivalent.</li><li><strong>Odia Language:</strong> Must be able to read, write and speak Odia language.</li></ul>',
    datesHtml: '<ul><li><strong>Notification Date:</strong> 01 August 2026</li><li><strong>Online Application Starts:</strong> 05 August 2026</li><li><strong>Last Date to Apply:</strong> 30 August 2026</li><li><strong>Tentative Exam Date:</strong> October 2026</li></ul>',
    feeHtml: '<ul><li><strong>All Candidates:</strong> ₹0/- (No Fee as per Govt of Odisha rules)</li></ul>',
    syllabusHtml: '<ul><li>Arithmetic & Mathematics: 40 Marks</li><li>General Knowledge & Odisha GK: 40 Marks</li><li>English & Odia Language: 40 Marks</li><li>Logical Reasoning: 40 Marks</li><li>Computer Awareness: 20 Marks</li></ul>',
    applyHtml: '<p>Candidates can apply online through the official website www.osssc.gov.in by registering under New User / Registered User portal.</p>',
    ctaText: 'Apply Online',
    ctaUrl: 'https://www.osssc.gov.in',
    notificationUrl: 'https://www.osssc.gov.in/docs/cre4_advt.pdf',
  },
  {
    id: 2,
    title: 'OPSC Odisha Civil Services Preliminary Admit Card 2026 Released',
    board: 'OPSC',
    boardFull: 'Odisha Public Service Commission',
    vacancies: '399 Posts',
    qualification: 'Graduate Degree',
    lastDate: 'Exam: 25-Aug-2026',
    publishDate: '10-Aug-2026',
    status: 'Admit Card Out',
    statusClass: 'status-announced',
    category: 'admit',
    overview: 'Odisha Public Service Commission has uploaded the admit card for OCS Preliminary Examination 2026.',
    eligibilityHtml: '<p>Candidate must possess a Bachelor Degree from any recognized university in India.</p>',
    datesHtml: '<ul><li>Admit Card Released: 10 August 2026</li><li>Prelims Exam Date: 25 August 2026</li></ul>',
    feeHtml: '<p>Exempted for SC/ST/PwD candidates.</p>',
    syllabusHtml: '<p>Paper 1: General Studies (200 Marks) | Paper 2: CSAT (200 Marks)</p>',
    applyHtml: '<p>Download Admit Card by entering Roll Number and Date of Birth on OPSC Portal.</p>',
    ctaText: 'Download Admit Card',
    ctaUrl: 'https://www.opsc.gov.in',
    notificationUrl: 'https://www.opsc.gov.in/docs/ocs_admit.pdf',
  },
  {
    id: 3,
    title: 'OSSC CGL Group B & C 2026 Final Answer Key Released',
    board: 'OSSC',
    boardFull: 'Odisha Staff Selection Commission',
    vacancies: '595 Posts',
    qualification: 'Graduate',
    lastDate: 'Objection: 15-Aug-2026',
    publishDate: '11-Aug-2026',
    status: 'Answer Key Out',
    statusClass: 'status-announced',
    category: 'key',
    overview: 'OSSC has published the provisional response sheet & answer key for CGL Preliminary Examination.',
    eligibilityHtml: '<p>Graduation in any discipline with computer proficiency.</p>',
    datesHtml: '<ul><li>Answer Key Released: 11 August 2026</li><li>Objection Window Open: 11 - 15 August 2026</li></ul>',
    feeHtml: '<p>No Fee required for filing objection online.</p>',
    syllabusHtml: '<p>Mathematics, Reasoning, Odia & English Language, Current Affairs.</p>',
    applyHtml: '<p>Log in with Applicant Credentials to check candidate response sheet and correct options.</p>',
    ctaText: 'Check Answer Key',
    ctaUrl: 'https://www.ossc.gov.in',
    notificationUrl: 'https://www.ossc.gov.in/docs/cgl_key.pdf',
  },
  {
    id: 4,
    title: 'RRB Group D Recruitment 2026 Stage 1 Exam Result Declared',
    board: 'RRB',
    boardFull: 'Railway Recruitment Board',
    vacancies: '1,03,769 Posts',
    qualification: '10th / ITI',
    lastDate: 'Declared: Today',
    publishDate: '11-Aug-2026',
    status: 'Result Declared',
    statusClass: 'status-announced',
    category: 'result',
    overview: 'Railway Recruitment Board has officially declared the CBT 1 qualified list of candidates for PET round.',
    eligibilityHtml: '<p>Passed 10th Standard or ITI from NCVT / SCVT.</p>',
    datesHtml: '<ul><li>Result Declaration: 11 August 2026</li><li>PET Physical Test: September 2026</li></ul>',
    feeHtml: '<p>N/A</p>',
    syllabusHtml: '<p>CBT Exam: Science, Math, Reasoning, General Awareness.</p>',
    applyHtml: '<p>Check candidate PDF scorecard and cutoff marks region-wise.</p>',
    ctaText: 'View Result PDF',
    ctaUrl: 'https://rrbgroupdanswerkey.pages.dev',
    notificationUrl: 'https://rrbgroupdanswerkey.pages.dev',
  },
];

export const PYQ_DATA: PYQItem[] = [
  {
    id: 1,
    title: 'OSSSC RI & ARI Previous Question Paper 2023',
    board: 'OSSSC',
    year: 2023,
    totalQuestions: 100,
    duration: '2 Hours',
    pdfUrl: '#',
    subject: 'Combined Mathematics, Odia, GK & Reasoning',
  },
  {
    id: 2,
    title: 'OPSC OCS Preliminary GS Paper 1 Solution 2024',
    board: 'OPSC',
    year: 2024,
    totalQuestions: 100,
    duration: '2 Hours',
    pdfUrl: '#',
    subject: 'General Studies & Odisha History/Geography',
  },
  {
    id: 3,
    title: 'OSSC CGL Mains English & Odia Language Paper 2023',
    board: 'OSSC',
    year: 2023,
    totalQuestions: 100,
    duration: '1.5 Hours',
    pdfUrl: '#',
    subject: 'Language Comprehension & Grammar',
  },
  {
    id: 4,
    title: 'RRB Group D Science & Mathematics PYQ 2022',
    board: 'RRB',
    year: 2022,
    totalQuestions: 100,
    duration: '90 Mins',
    pdfUrl: '#',
    subject: 'Physics, Chemistry, Life Science & Math',
  },
];

export const NOTES_DATA: NoteItem[] = [
  {
    id: 1,
    title: 'Complete Odisha History & Geography Special Notes 2026',
    subject: 'General Knowledge',
    category: 'Odisha GK',
    pages: 142,
    fileSize: '4.2 MB',
    pdfUrl: '#',
  },
  {
    id: 2,
    title: 'Odia Grammar (ଓଡ଼ିଆ ବ୍ୟାକରଣ) Complete Handbook for OSSSC / OSSC',
    subject: 'Odia Language',
    category: 'Grammar',
    pages: 98,
    fileSize: '3.1 MB',
    pdfUrl: '#',
  },
  {
    id: 3,
    title: 'Quantitative Aptitude Formulae & Short Tricks Handbook',
    subject: 'Mathematics',
    category: 'Aptitude',
    pages: 85,
    fileSize: '2.8 MB',
    pdfUrl: '#',
  },
  {
    id: 4,
    title: 'Computer Awareness & Cyber Security Capsule for OSSSC CRE',
    subject: 'Computer',
    category: 'IT & Basics',
    pages: 64,
    fileSize: '1.9 MB',
    pdfUrl: '#',
  },
];

export const SYLLABUS_DATA: SyllabusItem[] = [
  {
    id: 1,
    title: 'OSSSC CRE IV (RI, ARI, Amin, Forest Guard) Exam Pattern & Syllabus',
    board: 'OSSSC',
    totalMarks: 180,
    durationMinutes: 180,
    negativeMarking: '0.33 Marks per wrong answer',
    examPattern: [
      { section: 'Arithmetic & Quantitative Aptitude', questions: 40, marks: 40 },
      { section: 'General Knowledge & Odisha Special', questions: 40, marks: 40 },
      { section: 'English & Odia Language', questions: 40, marks: 40 },
      { section: 'Logical Reasoning & Analytical Ability', questions: 40, marks: 40 },
      { section: 'Computer Knowledge', questions: 20, marks: 20 },
    ],
    topics: [
      {
        category: 'Arithmetic',
        details: ['Number System', 'HCF & LCM', 'Percentage', 'Profit & Loss', 'Simple & Compound Interest', 'Ratio & Proportion', 'Time & Work', 'Speed, Distance & Time'],
      },
      {
        category: 'General Knowledge',
        details: ['Odisha History & Freedom Movement', 'Odisha Geography & Rivers', 'Indian Constitution', 'Current Affairs 2026', 'Important Schemes of Odisha Govt'],
      },
      {
        category: 'Odia Language',
        details: ['Samasa', 'Sandhi', 'Krukranta & Tadhita', 'Ruthi & Lokobani', 'Paragraph Comprehension', 'Correction of Common Errors'],
      },
      {
        category: 'Computer Awareness',
        details: ['MS Windows & MS Office (Word, Excel, PowerPoint)', 'Hardware & Software Basics', 'Networking & Internet Terms', 'Shortcuts & Function Keys'],
      },
    ],
  },
];

export const MOCK_TEST_EXAM: Exam = {
  id: 101,
  title: 'OSSSC CRE IV Full Mock Test 01 (CBT Interface)',
  board: 'OSSSC',
  timeLimitMinutes: 120,
  marksCorrect: 1.0,
  marksIncorrect: 0.33,
  examYear: 2026,
  sections: ['General Awareness & Odisha GK', 'Mathematics & Reasoning', 'English & Odia Grammar', 'Computer Awareness'],
  questions: [
    {
      id: 1,
      section: 'General Awareness & Odisha GK',
      questionText: 'Who was the leader of the famous Paika Rebellion (1817) against British rule in Odisha?',
      optionA: 'Baxi Jagabandhu',
      optionB: 'Veer Surendra Sai',
      optionC: 'Dharani Dhar Naik',
      optionD: 'Chakhi Khuntia',
      correctOption: 'A',
    },
    {
      id: 2,
      section: 'General Awareness & Odisha GK',
      questionText: 'Which river in Odisha is known as the "Sorrow of Odisha" historically?',
      optionA: 'Brahmani River',
      optionB: 'Mahanadi River',
      optionC: 'Baitarani River',
      optionD: 'Subarnarekha River',
      correctOption: 'B',
    },
    {
      id: 3,
      section: 'General Awareness & Odisha GK',
      questionText: 'In which year was Odisha established as a separate province on linguistic basis?',
      optionA: '15 August 1947',
      optionB: '01 April 1936',
      optionC: '26 January 1950',
      optionD: '01 November 1956',
      correctOption: 'B',
    },
    {
      id: 4,
      section: 'General Awareness & Odisha GK',
      questionText: 'The Hirakud Dam, one of the longest earth dams in the world, is built across which river?',
      optionA: 'Mahanadi',
      optionB: 'Rushikulya',
      optionC: 'Nagavali',
      optionD: 'Indravati',
      correctOption: 'A',
    },
    {
      id: 5,
      section: 'Mathematics & Reasoning',
      questionText: 'If 15 men can complete a piece of work in 20 days, how many days will 25 men take to complete the same work?',
      optionA: '10 Days',
      optionB: '12 Days',
      optionC: '14 Days',
      optionD: '15 Days',
      correctOption: 'B',
    },
    {
      id: 6,
      section: 'Mathematics & Reasoning',
      questionText: 'Find the simple interest on ₹8,000 at 5% per annum for 3 years.',
      optionA: '₹1,200',
      optionB: '₹1,000',
      optionC: '₹1,500',
      optionD: '₹900',
      correctOption: 'A',
    },
    {
      id: 7,
      section: 'Mathematics & Reasoning',
      questionText: 'Complete the series: 4, 9, 16, 25, 36, ?',
      optionA: '42',
      optionB: '49',
      optionC: '54',
      optionD: '64',
      correctOption: 'B',
    },
    {
      id: 8,
      section: 'English & Odia Grammar',
      questionText: 'Choose the correctly spelled Odia word for "Satyabadi":',
      optionA: 'ସତ୍ୟବାଦୀ',
      optionB: 'ସତ୍ୟବାଦି',
      optionC: 'ସତ୍ଯବାଦି',
      optionD: 'ସତ୍ୟାବାଦି',
      correctOption: 'A',
    },
    {
      id: 9,
      section: 'English & Odia Grammar',
      questionText: 'Select the synonym for the English word "ABUNDANT":',
      optionA: 'Scarce',
      optionB: 'Plentiful',
      optionC: 'Meager',
      optionD: 'Rare',
      correctOption: 'B',
    },
    {
      id: 10,
      section: 'Computer Awareness',
      questionText: 'Which keyboard shortcut key is used to save a document in Microsoft Word?',
      optionA: 'Ctrl + S',
      optionB: 'Ctrl + P',
      optionC: 'Ctrl + Shift + S',
      optionD: 'Alt + F4',
      correctOption: 'A',
    },
  ],
};

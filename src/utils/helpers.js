function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

function formatDate(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatPrettyDate(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

function safeJsonParse(str, fallback = []) {
  if (!str) return fallback;
  if (typeof str === 'object') return str;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

const CATEGORIES = {
  'latest-jobs': {
    name: 'Latest Jobs',
    slug: 'latest-jobs',
    color: '#ab183d',
    introEn: 'Welcome to Govt Exam Zone — your dedicated source for verified government job notifications across India. Stay informed about the latest Central and State Government vacancies, online application procedures, eligibility criteria, and last dates to apply. Whether you are preparing for UPSC, SSC, Railway (RRB), Banking, Defence, Teaching, or State Police recruitment, our editorial desk cross-checks all circulars directly with official government gazettes to deliver authentic, timely alerts.'
  },
  'admit-card': {
    name: 'Admit Card',
    slug: 'admit-card',
    color: '#ab183d',
    introEn: 'Welcome to Govt Exam Zone — your instant access point for government exam admit cards and hall tickets nationwide. Stay updated on upcoming preliminary, mains, skill tests, and physical examination schedules conducted by major recruitment commissions. Find direct server download links, exam city intimation slips, and step-by-step instructions to print your official hall ticket without server delays.'
  },
  'result': {
    name: 'Results',
    slug: 'result',
    color: '#ab183d',
    introEn: 'Welcome to Govt Exam Zone — track your competitive examination results with total speed and authenticity. We bring you prompt announcements for tier-wise written examinations, cutoff marks, selection lists, and final merit rankings across Central and State government boards. Check your scorecards and download official result PDF documents directly through fast, reliable mirror links.'
  },
  'syllabus': {
    name: 'Syllabus',
    slug: 'syllabus',
    color: '#ab183d',
    introEn: 'Welcome to Govt Exam Zone — download official, comprehensive examination syllabi and test patterns for competitive examinations throughout India. A winning preparation strategy starts with complete clarity on subject-wise weightage, marking schemes, and time duration. Download detailed, verified PDF syllabi for SSC, UPSC, Railway (RRB NTPC, ALP, Group D), Police, and State Commission exams.'
  },
  'answer-key': {
    name: 'Answer Key',
    slug: 'answer-key',
    color: '#ab183d',
    introEn: 'Welcome to Govt Exam Zone — verify your answers with official provisional and final answer keys released by government recruiting authorities. Calculate your estimated scores, download candidate response sheets, and access official objection windows before deadlines. We provide direct links to commission dispute portals for SSC, RRB, Police, NTA, and State Board exams.'
  },
  'admission': {
    name: 'Admission',
    slug: 'admission',
    color: '#ab183d',
    introEn: 'Welcome to Govt Exam Zone — your guide for premier entrance examinations, admission registration forms, counselling schedules, and university allotments across India. Discover verified circulars for NTA NEET, JEE Main, CUET, Polytechnic, ITI, B.Ed, and Central University programmes with complete eligibility and direct apply access.'
  },
  'certificate-verification': {
    name: 'Certificate Verification',
    slug: 'certificate-verification',
    color: '#ab183d',
    introEn: 'Welcome to Govt Exam Zone — authentic information and direct links for document verification, e-certificates, and public digital identity services. Access authorized portals for Aadhaar updates, PAN Card applications, Caste/Income certificate verification, and DigiLocker credentials essential for government job verification rounds.'
  },
  'important': {
    name: 'Important',
    slug: 'important',
    color: '#ab183d',
    introEn: 'Welcome to Govt Exam Zone — track critical candidate advisories, One-Time Registration (OTR) procedures, government scholarship programs, and student welfare initiatives. Stay ahead with timely updates on SSC OTR, State Commission OTRs, National Scholarship Portals, and major administrative recruitment notifications.'
  }
};

module.exports = {
  slugify,
  formatDate,
  formatPrettyDate,
  safeJsonParse,
  CATEGORIES
};

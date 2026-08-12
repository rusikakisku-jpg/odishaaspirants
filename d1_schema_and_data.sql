-- Cloudflare D1 (SQLite) Compatible Database Dump for odisha_aspirants

-- Table structure for attempts
DROP TABLE IF EXISTS attempts;
CREATE TABLE attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  exam_id INTEGER NOT NULL,
  score REAL NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  incorrect_answers INTEGER NOT NULL,
  answers_json TEXT NOT NULL,
  time_taken INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for exams
DROP TABLE IF EXISTS exams;
CREATE TABLE exams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  board TEXT NOT NULL,
  time_limit INTEGER NOT NULL DEFAULT 120,
  marks_correct REAL NOT NULL DEFAULT 1.00,
  marks_incorrect REAL NOT NULL DEFAULT -0.25,
  exam_year INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for jobs
DROP TABLE IF EXISTS jobs;
CREATE TABLE jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT DEFAULT NULL,
  title_home TEXT DEFAULT NULL,
  title_list TEXT DEFAULT NULL,
  board TEXT NOT NULL,
  board_full TEXT NOT NULL,
  vacancies TEXT DEFAULT '--',
  qualification TEXT DEFAULT '--',
  last_date TEXT DEFAULT '--',
  publish_date TEXT DEFAULT '--',
  start_date TEXT DEFAULT '--',
  status TEXT NOT NULL,
  status_class TEXT NOT NULL,
  overview TEXT,
  eligibility_html TEXT,
  dates_html TEXT,
  fee_html TEXT,
  syllabus_html TEXT,
  apply_html TEXT,
  cta_text TEXT,
  cta_url TEXT,
  notification_url TEXT DEFAULT '#',
  category TEXT NOT NULL,
  thumbnail_url TEXT DEFAULT NULL,
  is_published INTEGER DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for options
DROP TABLE IF EXISTS options;
CREATE TABLE options (
  option_name TEXT PRIMARY KEY,
  option_value TEXT
);

-- Table structure for password_resets
DROP TABLE IF EXISTS password_resets;
CREATE TABLE password_resets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for pyqs
DROP TABLE IF EXISTS pyqs;
CREATE TABLE pyqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board TEXT NOT NULL,
  years TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  accent TEXT DEFAULT '#0b4ca3',
  is_published INTEGER DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for pyq_downloads
DROP TABLE IF EXISTS pyq_downloads;
CREATE TABLE pyq_downloads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pyq_id INTEGER NOT NULL,
  year INTEGER NOT NULL,
  paper TEXT NOT NULL,
  file_url TEXT DEFAULT '#'
);

-- Table structure for questions
DROP TABLE IF EXISTS questions;
CREATE TABLE questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_id INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for sections
DROP TABLE IF EXISTS sections;
CREATE TABLE sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exam_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for study_chapters
DROP TABLE IF EXISTS study_chapters;
CREATE TABLE study_chapters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  chapter_title TEXT NOT NULL,
  file_name TEXT DEFAULT '#'
);

-- Table structure for study_notes
DROP TABLE IF EXISTS study_notes;
CREATE TABLE study_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for study_topics
DROP TABLE IF EXISTS study_topics;
CREATE TABLE study_topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  note_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT DEFAULT '',
  is_published INTEGER DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for syllabus_patterns
DROP TABLE IF EXISTS syllabus_patterns;
CREATE TABLE syllabus_patterns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board TEXT NOT NULL,
  title TEXT NOT NULL,
  update_year TEXT NOT NULL,
  pattern TEXT NOT NULL,
  description TEXT,
  pdf_name TEXT DEFAULT '#',
  is_published INTEGER DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for syllabus_subjects
DROP TABLE IF EXISTS syllabus_subjects;
CREATE TABLE syllabus_subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  syllabus_id INTEGER NOT NULL,
  subject_name TEXT NOT NULL,
  marks TEXT NOT NULL,
  duration TEXT NOT NULL
);

-- Table structure for users
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  email TEXT DEFAULT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'candidate',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

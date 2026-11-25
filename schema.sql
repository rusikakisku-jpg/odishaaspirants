-- Cloudflare D1 Database Schema for Govt Exam Zone Portal

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL, -- result, admit-card, latest-jobs, answer-key, syllabus, admission, certificate-verification, important
    department TEXT,
    post_date TEXT,
    last_date TEXT,
    short_desc TEXT,
    total_vacancy TEXT,
    important_dates TEXT,    -- JSON formatted string
    application_fee TEXT,    -- JSON formatted string
    age_limit TEXT,          -- JSON formatted string
    vacancy_details TEXT,    -- JSON formatted string
    category_details TEXT,   -- JSON formatted string
    how_to_apply TEXT,
    article_content TEXT,
    thumbnail TEXT,
    links TEXT,              -- JSON formatted string
    notification_pdf TEXT,   -- Cloudflare R2 or local storage URL
    admit_card_url TEXT,
    result_url TEXT,
    apply_online_url TEXT,
    official_website_url TEXT,
    views INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    author_id INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);

CREATE TABLE IF NOT EXISTS authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'Senior Recruitment Analyst & Fact-Checker',
    email TEXT,
    password_hash TEXT,
    bio TEXT,
    avatar_url TEXT DEFAULT '/images/default-avatar.svg',
    qualification TEXT,
    experience TEXT,
    twitter_url TEXT,
    linkedin_url TEXT,
    telegram_url TEXT,
    last_login DATETIME,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_authors_slug ON authors(slug);

CREATE TABLE IF NOT EXISTS marquees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    url TEXT NOT NULL,
    bg_color TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_name TEXT NOT NULL,
    file_key TEXT NOT NULL,
    file_url TEXT NOT NULL,
    storage_type TEXT NOT NULL, -- 'r2' or 'local'
    mime_type TEXT,
    file_size INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
);

CREATE TABLE IF NOT EXISTS post_daily_views (
    post_id INTEGER NOT NULL,
    view_date TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    PRIMARY KEY (post_id, view_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_views_date ON post_daily_views(view_date);

CREATE TABLE IF NOT EXISTS post_categories (
    post_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    display_title TEXT,
    bumped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, category)
);

CREATE INDEX IF NOT EXISTS idx_post_categories_cat_bump ON post_categories(category, bumped_at DESC);

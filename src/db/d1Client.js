const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
const config = require('../config/env');

const DB_FILE_PATH = path.resolve('data/sarkariresult.db');
const SCHEMA_FILE_PATH = path.resolve('schema.sql');

const CORE_TABLES = [
  `CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    department TEXT,
    post_date TEXT,
    last_date TEXT,
    short_desc TEXT,
    total_vacancy TEXT,
    important_dates TEXT,
    application_fee TEXT,
    age_limit TEXT,
    vacancy_details TEXT,
    category_details TEXT,
    how_to_apply TEXT,
    article_content TEXT,
    thumbnail TEXT,
    links TEXT,
    notification_pdf TEXT,
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
  )`,
  `CREATE TABLE IF NOT EXISTS authors (
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
  )`,
  `CREATE TABLE IF NOT EXISTS marquees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    url TEXT NOT NULL,
    bg_color TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1
  )`,
  `CREATE TABLE IF NOT EXISTS uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_name TEXT NOT NULL,
    file_key TEXT NOT NULL,
    file_url TEXT NOT NULL,
    storage_type TEXT NOT NULL,
    mime_type TEXT,
    file_size INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS post_daily_views (
    post_id INTEGER NOT NULL,
    view_date TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    PRIMARY KEY (post_id, view_date)
  )`,
  `CREATE TABLE IF NOT EXISTS post_categories (
    post_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    display_title TEXT,
    bumped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, category)
  )`
];

const CORE_INDEXES = [
  `CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category)`,
  `CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)`,
  `CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status)`,
  `CREATE INDEX IF NOT EXISTS idx_posts_status_id ON posts(status, id DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_posts_cat_status_id ON posts(category, status, id DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id)`,
  `CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_authors_slug ON authors(slug)`,
  `CREATE INDEX IF NOT EXISTS idx_daily_views_date ON post_daily_views(view_date)`,
  `CREATE INDEX IF NOT EXISTS idx_post_categories_cat_bump ON post_categories(category, bumped_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_badges_active_order ON badges(is_active, display_order, id)`,
  `CREATE INDEX IF NOT EXISTS idx_marquees_active_order ON marquees(is_active, display_order, id)`
];

const EMBEDDED_SCHEMA_SQL = CORE_TABLES.concat(CORE_INDEXES).join(';\n\n') + ';';

function getSchemaSql() {
  try {
    if (typeof fs.readFileSync === 'function' && typeof fs.existsSync === 'function' && fs.existsSync(SCHEMA_FILE_PATH)) {
      const content = fs.readFileSync(SCHEMA_FILE_PATH, 'utf-8');
      if (content && content.trim()) return content;
    }
  } catch (err) {}
  return EMBEDDED_SCHEMA_SQL;
}

class D1Client {
  constructor() {
    this.isCloudflareD1 = config.cloudflare.d1.isConfigured;
    this.localDb = null;
    this.SQL = null;
    this.initialized = false;
  }

  getNativeD1() {
    if (this.nativeD1) return this.nativeD1;
    const db = globalThis.DB || (globalThis.__CF_ENV__ && globalThis.__CF_ENV__.DB);
    if (db && typeof db.prepare === 'function') {
      this.nativeD1 = db;
      this.isNativeD1 = true;
      return db;
    }
    return null;
  }

  async init() {
    // Prevent re-entrant deadlock when seedDatabase() calls d1.init() during runNativeSchema()
    if (this._inNativeSchema) return;

    // 1. Native Cloudflare D1 Binding check (when running on Cloudflare Workers)
    const nativeD1 = this.getNativeD1();
    if (nativeD1) {
      if (this.nativeSchemaRun) return;
      if (!this._nativeInitPromise) {
        console.log('⚡ Connected to Native Cloudflare D1 Database Binding');
        this._nativeInitPromise = this.runNativeSchema()
          .then(() => {
            this.nativeSchemaRun = true;
            this.initialized = true;
          })
          .catch((err) => {
            this._nativeInitPromise = null;
            throw err;
          });
      }
      await this._nativeInitPromise;
      return;
    }

    if (this.initialized) return;

    if (this.isCloudflareD1) {
      console.log('⚡ Connected to remote Cloudflare D1 Database:', config.cloudflare.d1.databaseId);
      // Run schema on Cloudflare D1
      await this.runRemoteSchema();
      this.initialized = true;
      return;
    }

    console.log('📂 Initializing Local SQLite Engine (Cloudflare D1 compatible emulation)...');
    this.SQL = await initSqlJs();

    try {
      const dbDir = path.dirname(DB_FILE_PATH);
      if (typeof fs.existsSync === 'function' && !fs.existsSync(dbDir)) {
        if (typeof fs.mkdirSync === 'function') {
          fs.mkdirSync(dbDir, { recursive: true });
        }
      }
    } catch (e) {}

    let loadedFromFile = false;
    try {
      if (typeof fs.existsSync === 'function' && fs.existsSync(DB_FILE_PATH)) {
        const fileBuffer = fs.readFileSync(DB_FILE_PATH);
        this.localDb = new this.SQL.Database(fileBuffer);
        loadedFromFile = true;
        console.log('✅ Loaded existing SQLite database from:', DB_FILE_PATH);
      }
    } catch (e) {}

    if (!loadedFromFile) {
      this.localDb = new this.SQL.Database();
      console.log('🆕 Created new SQLite database in memory, initializing schema...');
    }

    // Auto-migrate missing columns on existing tables
    try {
      const resPosts = this.localDb.exec('PRAGMA table_info(posts)');
      if (resPosts && resPosts[0] && resPosts[0].values) {
        const colNames = resPosts[0].values.map(v => v[1]);
        if (!colNames.includes('author_id')) {
          this.localDb.run('ALTER TABLE posts ADD COLUMN author_id INTEGER DEFAULT 1');
          console.log('✅ Migrated: added author_id column to posts table.');
        }
        if (!colNames.includes('article_content')) {
          this.localDb.run('ALTER TABLE posts ADD COLUMN article_content TEXT');
          console.log('✅ Migrated: added article_content column to posts table.');
        }
        if (!colNames.includes('thumbnail')) {
          this.localDb.run('ALTER TABLE posts ADD COLUMN thumbnail TEXT');
          console.log('✅ Migrated: added thumbnail column to posts table.');
        }
      }

      const resAuthors = this.localDb.exec('PRAGMA table_info(authors)');
      if (resAuthors && resAuthors[0] && resAuthors[0].values) {
        const authorCols = resAuthors[0].values.map(v => v[1]);
        if (!authorCols.includes('password_hash')) {
          this.localDb.run('ALTER TABLE authors ADD COLUMN password_hash TEXT');
          console.log('✅ Migrated: added password_hash column to authors table.');
        }
        if (!authorCols.includes('last_login')) {
          this.localDb.run('ALTER TABLE authors ADD COLUMN last_login DATETIME');
          console.log('✅ Migrated: added last_login column to authors table.');
        }
      }
    } catch (migErr) {
      console.warn('Migration note:', migErr.message);
    }

    // Apply schema
    const schemaSql = getSchemaSql();
    this.localDb.run(schemaSql);
    try {
      this.localDb.run(`
        INSERT OR IGNORE INTO post_categories (post_id, category, display_title, bumped_at)
        SELECT id, category, title, COALESCE(created_at, CURRENT_TIMESTAMP)
        FROM posts WHERE category IS NOT NULL AND category != ''
      `);
    } catch (pcErr) {}
    this.saveLocal();
    this.initialized = true;
    console.log('✅ Database schema verified and active.');
  }

  saveLocal() {
    if (this.isNativeD1 || this.isCloudflareD1) return;
    try {
      if (this.localDb && typeof fs.writeFileSync === 'function') {
        const data = this.localDb.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_FILE_PATH, buffer);
      }
    } catch (err) {}
  }

  // Cloudflare D1 REST API query
  async queryRemote(sql, params = []) {
    const { accountId, databaseId, apiToken } = config.cloudflare.d1;
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql, params })
    });

    const json = await response.json();
    if (!json.success) {
      const err = json.errors?.[0]?.message || 'Cloudflare D1 Query Failed';
      throw new Error(`D1 API Error: ${err}`);
    }

    return json.result?.[0]?.results || [];
  }

  async runRemoteSchema() {
    try {
      const schemaSql = getSchemaSql();
      const statements = schemaSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const statement of statements) {
        await this.queryRemote(statement);
      }
      // Safe column migration for existing remote D1 tables
      try {
        await this.queryRemote('ALTER TABLE posts ADD COLUMN article_content TEXT');
      } catch (migErr) {}
      try {
        await this.queryRemote('ALTER TABLE posts ADD COLUMN thumbnail TEXT');
      } catch (migErr) {}
      try {
        await this.queryRemote(`
          INSERT OR IGNORE INTO post_categories (post_id, category, display_title, bumped_at)
          SELECT id, category, title, COALESCE(created_at, CURRENT_TIMESTAMP)
          FROM posts WHERE category IS NOT NULL AND category != ''
        `);
      } catch (pcErr) {}
      console.log('✅ Cloudflare D1 remote schema verified.');
    } catch (err) {
      console.warn('⚠️ Warning during remote D1 schema initialization:', err.message);
    }
  }

  async runNativeSchema() {
    if (this._inNativeSchema) return;
    this._inNativeSchema = true;
    try {
      const nativeD1 = this.getNativeD1();
      if (!nativeD1) return;

      // 1. Verify if all 8 core tables already exist; skip redundant DDL statements when already created
      let allCoreTablesExist = false;
      try {
        const tblCountRow = await nativeD1.prepare(
          "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name IN ('posts','authors','marquees','badges','uploads','settings','post_daily_views','post_categories')"
        ).first();
        allCoreTablesExist = Boolean(tblCountRow && tblCountRow.count >= 8);
      } catch (chkErr) {}

      if (!allCoreTablesExist) {
        for (const tableSql of CORE_TABLES) {
          try {
            if (typeof nativeD1.prepare === 'function') {
              await nativeD1.prepare(tableSql).run();
            } else if (typeof nativeD1.exec === 'function') {
              await nativeD1.exec(tableSql);
            }
          } catch (tableErr) {
            console.warn('D1 create table notice:', tableErr.message);
          }
        }
      }

      // 2. Verify and create indexes independently when any core/composite index is missing
      let allExpectedIndexesExist = false;
      try {
        const idxCountRow = await nativeD1.prepare(
          "SELECT COUNT(*) as count FROM sqlite_master WHERE type='index' AND name IN ('idx_posts_status_id','idx_posts_cat_status_id','idx_badges_active_order','idx_marquees_active_order')"
        ).first();
        allExpectedIndexesExist = Boolean(idxCountRow && idxCountRow.count >= 4);
      } catch (idxChkErr) {}

      if (!allCoreTablesExist || !allExpectedIndexesExist) {
        for (const indexSql of CORE_INDEXES) {
          try {
            if (typeof nativeD1.prepare === 'function') {
              await nativeD1.prepare(indexSql).run();
            } else if (typeof nativeD1.exec === 'function') {
              await nativeD1.exec(indexSql);
            }
          } catch (idxErr) {}
        }
      }

      console.log('✅ Native Cloudflare D1 tables and indexes verified.');

      // 2b. Safe column migration for existing Native D1 tables
      if (!allCoreTablesExist) {
        try {
          await nativeD1.prepare('ALTER TABLE posts ADD COLUMN article_content TEXT').run();
        } catch (colErr) {}
        try {
          await nativeD1.prepare('ALTER TABLE posts ADD COLUMN thumbnail TEXT').run();
        } catch (colErr) {}
      }
      try {
        await nativeD1.prepare(`
          INSERT OR IGNORE INTO post_categories (post_id, category, display_title, bumped_at)
          SELECT id, category, title, COALESCE(created_at, CURRENT_TIMESTAMP)
          FROM posts WHERE category IS NOT NULL AND category != ''
        `).run();
      } catch (pcErr) {}

      // 3. Check if marquees table has data; if empty, auto-seed initial Odisha Aspirants records (unless skip_auto_seed is enabled)
      try {
        const skipSeedRow = await nativeD1.prepare("SELECT value FROM settings WHERE key = 'skip_auto_seed'").first().catch(() => null);
        if (!skipSeedRow || skipSeedRow.value !== '1') {
          const countRow = await nativeD1.prepare('SELECT COUNT(*) as count FROM marquees').first();
          if (!countRow || countRow.count === 0) {
            console.log('🌱 Seeding initial Cloudflare D1 database records...');
            const seedDatabase = require('./seed');
            await seedDatabase();
            console.log('🎉 Cloudflare D1 initial seeding complete!');
          }
        }
      } catch (seedCheckErr) {
        console.warn('D1 auto-seed notice:', seedCheckErr.message);
      }

      // 4. Sync post_categories after any initial seed so homepage categories render immediately
      try {
        await nativeD1.prepare(`
          INSERT OR IGNORE INTO post_categories (post_id, category, display_title, bumped_at)
          SELECT id, category, title, COALESCE(created_at, CURRENT_TIMESTAMP)
          FROM posts WHERE category IS NOT NULL AND category != ''
        `).run();
      } catch (pcSyncErr) {}
    } catch (err) {
      console.warn('⚠️ Warning during native D1 schema check:', err.message);
    } finally {
      this._inNativeSchema = false;
    }
  }

  prepare(sql) {
    const self = this;
    self.getNativeD1();
    return {
      bind(...params) {
        const rawParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
        const boundParams = rawParams.map(p => (p === undefined ? null : p));

        return {
          async all() {
            if (self.isNativeD1) {
              const res = await self.nativeD1.prepare(sql).bind(...boundParams).all();
              return (res && res.results) ? res.results : [];
            }

            if (self.isCloudflareD1) {
              return await self.queryRemote(sql, boundParams);
            }

            // Local SQL.js implementation
            try {
              const stmt = self.localDb.prepare(sql);
              stmt.bind(boundParams);
              const rows = [];
              while (stmt.step()) {
                rows.push(stmt.getAsObject());
              }
              stmt.free();
              return rows;
            } catch (err) {
              console.error('Error executing query:', sql, err);
              throw err;
            }
          },

          async first() {
            if (self.isNativeD1) {
              return await self.nativeD1.prepare(sql).bind(...boundParams).first();
            }
            const rows = await this.all();
            return rows.length > 0 ? rows[0] : null;
          },

          async run() {
            if (self.isNativeD1) {
              const res = await self.nativeD1.prepare(sql).bind(...boundParams).run();
              return { success: true, changes: res?.meta?.changes || 0, lastInsertRowid: res?.meta?.last_row_id || null };
            }

            if (self.isCloudflareD1) {
              const res = await self.queryRemote(sql, boundParams);
              return { success: true, result: res };
            }

            try {
              self.localDb.run(sql, boundParams);
              self.saveLocal();

              // Get last insert rowid and changes
              const lastIdRow = self.localDb.exec("SELECT last_insert_rowid() AS id;");
              const lastInsertRowid = lastIdRow[0]?.values[0]?.[0] || null;
              const changesRow = self.localDb.exec("SELECT changes() AS ch;");
              const changes = changesRow[0]?.values[0]?.[0] || 0;

              return { success: true, changes, lastInsertRowid };
            } catch (err) {
              console.error('Error in run():', sql, err);
              throw err;
            }
          }
        };
      },

      async all() {
        return this.bind().all();
      },

      async first() {
        return this.bind().first();
      },

      async run() {
        return this.bind().run();
      }
    };
  }

  async exec(sql) {
    if (this.getNativeD1()) {
      return await this.nativeD1.exec(sql);
    }
    if (this.isCloudflareD1) {
      return await this.queryRemote(sql);
    }
    const res = this.localDb.exec(sql);
    this.saveLocal();
    return res;
  }
}

const d1 = new D1Client();
d1.CORE_TABLES = CORE_TABLES;
d1.CORE_INDEXES = CORE_INDEXES;
module.exports = d1;

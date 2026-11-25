const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('./src/config/env');
const d1 = require('./src/db/d1Client');
const seedDatabase = require('./src/db/seed');

const webRoutes = require('./src/routes/webRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const authorRoutes = require('./src/routes/authorRoutes');
const apiRoutes = require('./src/routes/apiRoutes');
const { templateEngine } = require('./src/views/templateEngine');
const { isAdminSubdomainRequest, getAdminBase, getPublicBase } = require('./src/utils/adminHost');

const app = express();

// Trust proxy (required for Pinggy tunnels, Cloudflare, Nginx and secure cookies)
app.set('trust proxy', 1);

// View Engine Setup
app.engine('ejs', templateEngine);
app.set('view engine', 'ejs');
app.set('views', path.resolve('views'));

// Edge-compatible View lookup: bypass filesystem stat checks for precompiled in-memory templates
const View = app.get('view');
if (View && View.prototype) {
  View.prototype.lookup = function(name) {
    return name.endsWith('.ejs') ? name : name + '.ejs';
  };
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Files: Only mount physical filesystem middleware in local Node.js environment
// On Cloudflare Pages/Workers, static assets are served natively via Cloudflare CDN / env.ASSETS
if (typeof WebSocketPair === 'undefined' && !globalThis.__CF_ENV__ && !globalThis.__CF_PAGES__) {
  app.use(express.static(path.resolve('public')));
  app.use('/uploads', express.static(path.resolve('uploads')));
}

// Favicon handler
app.get('/favicon.ico', (req, res) => {
  const icoPath = path.resolve('public/favicon.ico');
  const svgPath = path.resolve('public/images/gez-logo.svg');
  const fs = require('fs');
  if (fs.existsSync(icoPath)) return res.sendFile(icoPath);
  if (fs.existsSync(svgPath)) return res.sendFile(svgPath);
  res.status(204).end();
});

// Routes
app.get('/api/seed-db', async (req, res) => {
  const tableResults = [];
  try {
    const nativeD1 = d1.getNativeD1();
    if (d1.CORE_TABLES && Array.isArray(d1.CORE_TABLES)) {
      for (const sql of d1.CORE_TABLES) {
        try {
          if (nativeD1) {
            let res;
            if (typeof nativeD1.prepare === 'function') {
              res = await nativeD1.prepare(sql).run();
            } else if (typeof nativeD1.exec === 'function') {
              res = await nativeD1.exec(sql);
            }
            tableResults.push({ ok: true, name: sql.split('(')[0].replace(/[\n\r\t]+/g, ' ').trim(), res });
          } else {
            tableResults.push({ ok: false, error: 'No nativeD1 found' });
          }
        } catch (tableErr) {
          tableResults.push({ ok: false, error: tableErr.message, name: sql.split('(')[0].replace(/[\n\r\t]+/g, ' ').trim() });
        }
      }
    }
    await d1.init();
    await seedDatabase();
    res.json({ success: true, tableResults, message: 'Database initialized and seeded successfully!' });
  } catch (err) {
    console.error('Seed DB Error:', err);
    res.status(500).json({ success: false, error: err.message, tableResults, stack: err.stack });
  }
});
// Hostname-based routing for dedicated admin subdomain (setup.govtexamzone.com)
app.use((req, res, next) => {
  const isSubdomain = isAdminSubdomainRequest(req);
  res.locals.isAdminSubdomain = isSubdomain;
  res.locals.adminBase = getAdminBase(req);
  res.locals.publicBase = getPublicBase(req);

  if (!isSubdomain) {
    return next();
  }

  // Prevent search engines from indexing the admin subdomain
  res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');

  if (req.path === '/robots.txt') {
    res.type('text/plain');
    res.set('Cache-Control', 'no-store');
    return res.send('User-agent: *\nDisallow: /\n');
  }

  if (req.path === '/sitemap.xml' || req.path === '/feed') {
    return res.status(404).type('text/plain').send('Not Found');
  }

  // Normalize accidental /admin/* GET visits on the subdomain to root-relative clean URLs
  if (req.path === '/admin' || req.path.startsWith('/admin/')) {
    if (req.method === 'GET' || req.method === 'HEAD') {
      const strippedPath = req.path.replace(/^\/admin/, '') || '/';
      const qsIndex = req.url.indexOf('?');
      const qs = qsIndex !== -1 ? req.url.slice(qsIndex) : '';
      return res.redirect(302, strippedPath + qs);
    }
    return next();
  }

  // Keep API, R2 uploads, favicon, and portals accessible without double-prefixing
  if (
    req.path.startsWith('/author-portal') ||
    req.path.startsWith('/editor-portal') ||
    req.path.startsWith('/api') ||
    req.path.startsWith('/uploads') ||
    req.path === '/favicon.ico' ||
    req.path === '/favicon.svg' ||
    req.path === '/editor' ||
    req.path === '/author'
  ) {
    return next();
  }

  // Route all other requests on setup.govtexamzone.com directly into adminRoutes
  req.url = '/admin' + (req.url === '/' ? '' : req.url);
  return next();
});

app.use('/admin', adminRoutes);
app.use('/author-portal', authorRoutes);
app.use('/editor-portal', authorRoutes);
app.get('/editor', (req, res) => res.redirect('/author-portal/login'));
app.get('/author', (req, res) => res.redirect('/author-portal/login'));
app.use('/api', apiRoutes);
app.use((req, res, next) => {
  if (res.locals.isAdminSubdomain) {
    return res.status(404).type('text/html').send(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>404 - Admin Page Not Found</title></head><body style="font-family:sans-serif;text-align:center;padding:60px;"><h1>404 - Page Not Found</h1><p>Only the Admin Panel is served on this subdomain.</p><p><a href="/">Go to Admin Console</a></p></body></html>'
    );
  }
  next();
});
app.use('/', webRoutes);

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404);
  res.render('pages/error', {
    title: '404 - Page Not Found | Govt Exam Zone',
    message: 'The page you are looking for does not exist on Govt Exam Zone.'
  }, (renderErr, html) => {
    if (renderErr) {
      return res.type('text/html').send('<h1>404 - Page Not Found</h1>');
    }
    res.type('text/html').send(html);
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500);
  res.render('pages/error', {
    title: '500 - Server Error | Govt Exam Zone',
    message: err.message || 'An internal error occurred. Please try again later.'
  }, (renderErr, html) => {
    if (renderErr) {
      return res.type('text/html').send(`<!DOCTYPE html><html><body><h1>Server Error</h1><p>${err.message || 'Internal Server Error'}</p></body></html>`);
    }
    res.type('text/html').send(html);
  });
});

// Synchronous Server Listen: Only run when running directly under Node.js (e.g. npm start / pm2)
const PORT = config.server.port || 3000;
if (typeof WebSocketPair === 'undefined' && !globalThis.__CF_ENV__ && !globalThis.__CF_PAGES__) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`✅ Govt Exam Zone Server running on http://localhost:${PORT}`);
    console.log(`🔒 Admin Panel available at http://localhost:${PORT}/admin`);
    console.log(`   Default credentials: user=${config.admin.username}, pass=${config.admin.password}`);
    console.log(`💾 Cloudflare D1 Database: ${d1.isCloudflareD1 ? 'Connected (Remote)' : 'Active (Local SQLite emulation)'}`);
    console.log(`☁️ Cloudflare R2 Storage: ${config.cloudflare.r2.isConfigured ? 'Active (Remote Bucket)' : 'Fallback (Local /uploads)'}`);
    console.log(`=======================================================`);
  });
}

// Run async database initialization in Node.js only (Cloudflare Workers disallow D1 I/O in global module scope)
if (typeof WebSocketPair === 'undefined' && !globalThis.__CF_ENV__ && !globalThis.__CF_PAGES__) {
  (async function initDatabase() {
    try {
      console.log('🚀 Initializing Govt Exam Zone Portal DB...');
      await d1.init();
      console.log('✅ Database schema verified and active.');
      if (!d1.isNativeD1) {
        const skipSeedRow = await d1.prepare("SELECT value FROM settings WHERE key = 'skip_auto_seed'").first().catch(() => null);
        if (!skipSeedRow || skipSeedRow.value !== '1') {
          await seedDatabase();
        }
      }
    } catch (err) {
      console.warn('⚠️ Database init notice:', err.message);
    }
  })();
}

module.exports = app;

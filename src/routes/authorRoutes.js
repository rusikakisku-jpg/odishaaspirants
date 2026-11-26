const express = require('express');
const router = express.Router();
const multer = require('multer');
const d1 = require('../db/d1Client');
const r2 = require('../storage/r2Client');
const {
  hashPassword,
  verifyPassword,
  requireAuthorAuth,
  setAuthorAuthCookie,
  clearAuthorAuthCookie,
  getAuthorFromToken
} = require('../middleware/authorAuth');
const { slugify, CATEGORIES, safeJsonParse, formatDate } = require('../utils/helpers');
const { saveUploadedAsset } = require('../utils/uploadHelper');
const { getPostCategoryMap, syncPostCategoriesOnSave } = require('../utils/postCategoryManager');

// Multer memory storage for direct R2 streaming
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

// Middleware to inject site settings & active path into author portal views
router.use(async (req, res, next) => {
  try {
    await d1.init();
  } catch (initErr) {}
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  res.locals.currentPath = (req.originalUrl || '/author-portal').split('?')[0].replace(/\/$/, '') || '/author-portal';
  try {
    const sRows = await d1.prepare('SELECT * FROM settings').all();
    const siteSettings = {
      telegram_url: 'https://t.me/odishaaspirantsofficial',
      whatsapp_url: 'https://whatsapp.com/channel/0029VbBps5S7dmeYQLDLyB10',
      contact_email: 'contact@odishaaspirants.com',
      site_title: 'Odisha Aspirants',
      site_logo: '/images/oa-logo.svg',
      site_favicon: '/images/oa-logo.svg'
    };
    if (sRows && Array.isArray(sRows)) {
      sRows.forEach(r => { siteSettings[r.key] = r.value; });
    }
    res.locals.settings = siteSettings;
  } catch (e) {
    res.locals.settings = {
      telegram_url: 'https://t.me/odishaaspirantsofficial',
      whatsapp_url: 'https://whatsapp.com/channel/0029VbBps5S7dmeYQLDLyB10',
      contact_email: 'contact@odishaaspirants.com',
      site_title: 'Odisha Aspirants',
      site_logo: '/images/oa-logo.svg',
      site_favicon: '/images/oa-logo.svg'
    };
  }
  next();
});

// ==========================================
// PUBLIC AUTHOR AUTH ROUTES
// ==========================================

// Author Login Page
router.get('/login', async (req, res) => {
  // If already logged in, redirect directly to dashboard
  const token = req.cookies?.oa_author_token;
  if (token) {
    const author = await getAuthorFromToken(token);
    if (author) {
      return res.redirect('/author-portal');
    }
  }

  // Get active authors list for demo/quick login assistance if desired
  let sampleAuthors = [];
  try {
    sampleAuthors = await d1.prepare('SELECT name, slug, email, role FROM authors WHERE is_active = 1 LIMIT 4').all();
  } catch(e) {}

  res.render('author/login', {
    title: 'Author Login - Editorial & Contributor Desk | Odisha Aspirants',
    error: null,
    returnUrl: req.query.returnUrl || '/author-portal',
    sampleAuthors: sampleAuthors || []
  });
});

// Author Login Submission
router.post('/login', async (req, res, next) => {
  try {
    const inputIdentifier = (req.body?.identifier || '').trim().toLowerCase();
    const inputPassword = (req.body?.password || '').trim();
    const returnUrl = req.body?.returnUrl || '/author-portal';

    if (!inputIdentifier || !inputPassword) {
      return res.render('author/login', {
        title: 'Author Login - Odisha Aspirants',
        error: 'Please provide both Author Email/Username and Password.',
        returnUrl,
        sampleAuthors: []
      });
    }

    // Query active author by email or slug
    const author = await d1.prepare(`
      SELECT * FROM authors 
      WHERE (LOWER(email) = ? OR LOWER(slug) = ?) AND is_active = 1
    `).bind(inputIdentifier, inputIdentifier).first();

    if (!author) {
      return res.render('author/login', {
        title: 'Author Login - Odisha Aspirants',
        error: `No verified author found with username or email: "${inputIdentifier}".`,
        returnUrl,
        sampleAuthors: []
      });
    }

    const isValid = verifyPassword(inputPassword, author.password_hash);
    if (!isValid) {
      return res.render('author/login', {
        title: 'Author Login - Odisha Aspirants',
        error: 'Incorrect author password. Please verify and try again.',
        returnUrl,
        sampleAuthors: []
      });
    }

    // Update last_login
    try {
      await d1.prepare('UPDATE authors SET last_login = CURRENT_TIMESTAMP WHERE id = ?').bind(author.id).run();
    } catch(e) {}

    // Set secure author cookie
    setAuthorAuthCookie(res, author);
    console.log(`[AUTHOR AUTH] Author logged in: ${author.name} (id=${author.id})`);

    // Safely redirect
    const safeRedirect = returnUrl.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/author-portal';
    return res.redirect(safeRedirect);
  } catch (err) {
    next(err);
  }
});

// Author Logout
router.get('/logout', (req, res) => {
  clearAuthorAuthCookie(res);
  res.redirect('/author-portal/login');
});

// ==========================================
// PROTECTED AUTHOR PORTAL ROUTES
// ==========================================
router.use(requireAuthorAuth);

// Author & Editor Dashboard
router.get(['/', '/dashboard'], async (req, res, next) => {
  try {
    const author = req.author;
    const isEditor = req.isEditor;

    let totalPostsRow, activePostsRow, draftPostsRow, viewsRow, recentPosts;

    if (isEditor) {
      // Editor sees platform-wide content metrics and can review recent posts from all contributors
      totalPostsRow = await d1.prepare('SELECT COUNT(*) as count FROM posts').first();
      activePostsRow = await d1.prepare("SELECT COUNT(*) as count FROM posts WHERE status = 'active'").first();
      draftPostsRow = await d1.prepare("SELECT COUNT(*) as count FROM posts WHERE status = 'draft'").first();
      viewsRow = await d1.prepare('SELECT SUM(views) as total_views FROM posts').first();

      recentPosts = await d1.prepare(`
        SELECT p.id, p.title, p.slug, p.category, p.post_date, p.views, p.status, p.created_at, p.author_id,
               COALESCE(a.name, 'Editorial Desk') as author_name
        FROM posts p 
        LEFT JOIN authors a ON p.author_id = a.id
        ORDER BY p.id DESC LIMIT 10
      `).all();
    } else {
      // Author strictly sees their own post counts and articles
      totalPostsRow = await d1.prepare('SELECT COUNT(*) as count FROM posts WHERE author_id = ?').bind(author.id).first();
      activePostsRow = await d1.prepare("SELECT COUNT(*) as count FROM posts WHERE author_id = ? AND status = 'active'").bind(author.id).first();
      draftPostsRow = await d1.prepare("SELECT COUNT(*) as count FROM posts WHERE author_id = ? AND status = 'draft'").bind(author.id).first();
      viewsRow = await d1.prepare('SELECT SUM(views) as total_views FROM posts WHERE author_id = ?').bind(author.id).first();

      recentPosts = await d1.prepare(`
        SELECT id, title, slug, category, post_date, views, status, created_at, author_id
        FROM posts 
        WHERE author_id = ?
        ORDER BY id DESC LIMIT 10
      `).bind(author.id).all();
    }

    res.render('author/dashboard', {
      title: `${author.name} - ${isEditor ? 'Editor' : 'Author'} Workspace | Odisha Aspirants`,
      author,
      isEditor,
      stats: {
        totalPosts: totalPostsRow?.count || 0,
        activePosts: activePostsRow?.count || 0,
        draftPosts: draftPostsRow?.count || 0,
        totalViews: viewsRow?.total_views || 0
      },
      recentPosts: recentPosts || [],
      categories: CATEGORIES,
      formatDate
    });
  } catch (err) {
    next(err);
  }
});

// Author & Editor Posts List
router.get('/posts', async (req, res, next) => {
  try {
    const author = req.author;
    const isEditor = req.isEditor;
    const category = req.query.category || '';
    const status = req.query.status || '';
    const search = req.query.search || '';
    const authorFilter = req.query.author_id || '';

    let query = '';
    const params = [];

    if (isEditor) {
      // Editor can view all posts or filter by specific author
      query = 'SELECT p.*, COALESCE(a.name, "Editorial Desk") as author_name FROM posts p LEFT JOIN authors a ON p.author_id = a.id WHERE 1=1';
      if (authorFilter) {
        query += ' AND p.author_id = ?';
        params.push(parseInt(authorFilter, 10));
      }
    } else {
      // Author strictly sees only their own posts
      query = 'SELECT * FROM posts WHERE author_id = ?';
      params.push(author.id);
    }

    if (category) {
      query += isEditor ? ' AND p.category = ?' : ' AND category = ?';
      params.push(category);
    }
    if (status) {
      query += isEditor ? ' AND p.status = ?' : ' AND status = ?';
      params.push(status);
    }
    if (search) {
      query += isEditor ? ' AND (p.title LIKE ? OR p.department LIKE ?)' : ' AND (title LIKE ? OR department LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY ' + (isEditor ? 'p.id' : 'id') + ' DESC LIMIT 100';

    const posts = await d1.prepare(query).bind(...params).all();
    const allAuthors = isEditor ? await d1.prepare('SELECT id, name FROM authors ORDER BY name ASC').all() : [];

    res.render('author/posts-list', {
      title: isEditor ? 'All Articles & Submissions - Editorial Desk' : 'My Published & Draft Articles - Author Workspace',
      author,
      isEditor,
      allAuthors,
      selectedAuthor: authorFilter,
      posts: posts || [],
      categories: CATEGORIES,
      selectedCategory: category,
      selectedStatus: status,
      search,
      formatDate,
      success: req.query.success || ''
    });
  } catch (err) {
    next(err);
  }
});

// Author New Post Form
router.get('/posts/new', (req, res) => {
  res.render('author/post-form', {
    title: 'Write New Notification / Article - Author Workspace',
    author: req.author,
    post: null,
    categoryHistoryMap: {},
    categories: CATEGORIES,
    action: '/author-portal/posts/new'
  });
});

// Author New Post Submission
router.post('/posts/new', upload.fields([
  { name: 'thumbnail_file', maxCount: 1 },
  { name: 'notification_file', maxCount: 1 },
  { name: 'admit_card_file', maxCount: 1 },
  { name: 'result_file', maxCount: 1 }
]), async (req, res, next) => {
  try {
    const author = req.author;
    const {
      title, category, department, post_date, last_date,
      short_desc, total_vacancy, how_to_apply, article_content,
      apply_online_url, official_website_url, status
    } = req.body;

    const baseSlug = req.body.slug ? slugify(req.body.slug) : slugify(title);
    let finalSlug = baseSlug;

    // Check slug collision
    const existing = await d1.prepare('SELECT id FROM posts WHERE slug = ?').bind(finalSlug).first();
    if (existing) {
      finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Process file uploads to R2 or Local Storage
    let thumbnail = (req.body.thumbnail_url || '').trim();
    let notificationPdf = req.body.notification_pdf_url || '';
    let admitCardUrl = req.body.admit_card_url || '';
    let resultUrl = req.body.result_url || '';

    if (req.files?.thumbnail_file?.[0]) {
      const uploadRes = await saveUploadedAsset(req.files.thumbnail_file[0]);
      thumbnail = uploadRes.fileUrl;
    }

    if (req.files?.notification_file?.[0]) {
      const uploadRes = await saveUploadedAsset(req.files.notification_file[0]);
      notificationPdf = uploadRes.fileUrl;
    }

    if (req.files?.admit_card_file?.[0]) {
      const uploadRes = await saveUploadedAsset(req.files.admit_card_file[0]);
      admitCardUrl = uploadRes.fileUrl;
    }

    if (req.files?.result_file?.[0]) {
      const uploadRes = await saveUploadedAsset(req.files.result_file[0]);
      resultUrl = uploadRes.fileUrl;
    }

    // Format JSON fields
    const importantDates = req.body.important_dates ? req.body.important_dates : '[]';
    const applicationFee = req.body.application_fee ? req.body.application_fee : '[]';
    const ageLimit = req.body.age_limit ? req.body.age_limit : '{}';
    const vacancyDetails = req.body.vacancy_details ? req.body.vacancy_details : '[]';
    const categoryDetails = req.body.category_details ? req.body.category_details : '[]';
    const links = req.body.links ? req.body.links : '[]';

    // Authors can choose status 'draft' or 'active'
    const postStatus = (status === 'draft') ? 'draft' : 'active';

    const insertRes = await d1.prepare(`
      INSERT INTO posts (
        title, slug, category, department, post_date, last_date,
        short_desc, total_vacancy, important_dates, application_fee,
        age_limit, vacancy_details, category_details, how_to_apply, article_content, thumbnail,
        links, notification_pdf, admit_card_url, result_url,
        apply_online_url, official_website_url, is_featured, status,
        author_id
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?
      )
    `).bind(
      title, finalSlug, category, department || null, post_date || null, last_date || null,
      short_desc || null, total_vacancy || null, importantDates, applicationFee,
      ageLimit, vacancyDetails, categoryDetails, how_to_apply || null, article_content || null, thumbnail || null,
      links, notificationPdf || null, admitCardUrl || null, resultUrl || null,
      apply_online_url || null, official_website_url || null, 0, postStatus,
      author.id // Strictly assigned to the logged-in author
    ).run();

    const newPostId = insertRes?.lastInsertRowid || (await d1.prepare('SELECT id FROM posts WHERE slug = ?').bind(finalSlug).first())?.id;
    await syncPostCategoriesOnSave({
      postId: newPostId,
      primaryCategory: category,
      newTitle: title,
      previousPost: null,
      body: req.body
    });
    globalThis.__invalidateCategoryCache?.();

    res.redirect('/author-portal/posts?success=created');
  } catch (err) {
    next(err);
  }
});

// Author Edit Post Form
router.get('/posts/edit/:id', async (req, res, next) => {
  try {
    const author = req.author;
    const post = await d1.prepare('SELECT * FROM posts WHERE id = ?').bind(req.params.id).first();

    if (!post) {
      return res.status(404).send('Article not found.');
    }

    // Security check: Author can ONLY edit their own articles. Editor can edit any article.
    if (!req.isEditor && post.author_id !== author.id) {
      return res.status(403).send('Access Denied: You are not authorized to edit articles written by another author.');
    }

    const categoryHistoryMap = await getPostCategoryMap(post.id);

    res.render('author/post-form', {
      title: `Edit Article: ${post.title} - Author Workspace`,
      author,
      post,
      categoryHistoryMap: categoryHistoryMap || {},
      categories: CATEGORIES,
      action: `/author-portal/posts/edit/${post.id}`
    });
  } catch (err) {
    next(err);
  }
});

// Author Edit Post Submission
router.post('/posts/edit/:id', upload.fields([
  { name: 'thumbnail_file', maxCount: 1 },
  { name: 'notification_file', maxCount: 1 },
  { name: 'admit_card_file', maxCount: 1 },
  { name: 'result_file', maxCount: 1 }
]), async (req, res, next) => {
  try {
    const author = req.author;
    const postId = req.params.id;
    const currentPost = await d1.prepare('SELECT * FROM posts WHERE id = ?').bind(postId).first();

    if (!currentPost) return res.status(404).send('Article not found.');

    // Security check: Author can ONLY modify their own articles. Editor can modify any article.
    if (!req.isEditor && currentPost.author_id !== author.id) {
      return res.status(403).send('Access Denied: You cannot modify articles belonging to another author.');
    }

    const {
      slug, thumbnail_url, notification_pdf_url, admit_card_url, result_url, status
    } = req.body;

    const title = req.body.title || currentPost.title;
    const category = req.body.category || currentPost.category;
    const department = req.body.department !== undefined ? req.body.department : (currentPost.department || null);
    const post_date = req.body.post_date !== undefined ? req.body.post_date : (currentPost.post_date || null);
    const last_date = req.body.last_date !== undefined ? req.body.last_date : (currentPost.last_date || null);
    const short_desc = req.body.short_desc !== undefined ? req.body.short_desc : (currentPost.short_desc || null);
    const total_vacancy = req.body.total_vacancy !== undefined ? req.body.total_vacancy : (currentPost.total_vacancy || null);
    const how_to_apply = req.body.how_to_apply !== undefined ? req.body.how_to_apply : (currentPost.how_to_apply || null);
    const article_content = req.body.article_content !== undefined ? req.body.article_content : (currentPost.article_content || null);
    const apply_online_url = req.body.apply_online_url !== undefined ? req.body.apply_online_url : (currentPost.apply_online_url || null);
    const official_website_url = req.body.official_website_url !== undefined ? req.body.official_website_url : (currentPost.official_website_url || null);
    const postStatus = status || currentPost.status || 'active';

    let finalSlug = slug ? slugify(slug) : (currentPost.slug || slugify(title));

    let thumbnail = thumbnail_url !== undefined ? (thumbnail_url.trim() || null) : (currentPost.thumbnail || null);
    let notificationPdf = notification_pdf_url !== undefined ? (notification_pdf_url.trim() || null) : (currentPost.notification_pdf || null);
    let admitCardUrl = admit_card_url !== undefined ? (admit_card_url.trim() || null) : (currentPost.admit_card_url || null);
    let resultUrl = result_url !== undefined ? (result_url.trim() || null) : (currentPost.result_url || null);

    if (req.files?.thumbnail_file?.[0]) {
      const uploadRes = await saveUploadedAsset(req.files.thumbnail_file[0]);
      thumbnail = uploadRes.fileUrl;
    }

    if (req.files?.notification_file?.[0]) {
      const uploadRes = await saveUploadedAsset(req.files.notification_file[0]);
      notificationPdf = uploadRes.fileUrl;
    }

    if (req.files?.admit_card_file?.[0]) {
      const uploadRes = await saveUploadedAsset(req.files.admit_card_file[0]);
      admitCardUrl = uploadRes.fileUrl;
    }

    if (req.files?.result_file?.[0]) {
      const uploadRes = await saveUploadedAsset(req.files.result_file[0]);
      resultUrl = uploadRes.fileUrl;
    }

    const importantDates = req.body.important_dates || currentPost.important_dates || '[]';
    const applicationFee = req.body.application_fee || currentPost.application_fee || '[]';
    const ageLimit = req.body.age_limit || currentPost.age_limit || '{}';
    const vacancyDetails = req.body.vacancy_details || currentPost.vacancy_details || '[]';
    const categoryDetails = req.body.category_details || currentPost.category_details || '[]';
    const links = req.body.links || currentPost.links || '[]';

    if (req.isEditor) {
      await d1.prepare(`
        UPDATE posts SET
          title = ?, slug = ?, category = ?, department = ?, post_date = ?, last_date = ?,
          short_desc = ?, total_vacancy = ?, important_dates = ?, application_fee = ?,
          age_limit = ?, vacancy_details = ?, category_details = ?, how_to_apply = ?, article_content = ?, thumbnail = ?,
          links = ?, notification_pdf = ?, admit_card_url = ?, result_url = ?,
          apply_online_url = ?, official_website_url = ?, status = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        title, finalSlug, category, department, post_date, last_date,
        short_desc, total_vacancy, importantDates, applicationFee,
        ageLimit, vacancyDetails, categoryDetails, how_to_apply, article_content, thumbnail,
        links, notificationPdf, admitCardUrl, resultUrl,
        apply_online_url, official_website_url, postStatus,
        postId
      ).run();
    } else {
      await d1.prepare(`
        UPDATE posts SET
          title = ?, slug = ?, category = ?, department = ?, post_date = ?, last_date = ?,
          short_desc = ?, total_vacancy = ?, important_dates = ?, application_fee = ?,
          age_limit = ?, vacancy_details = ?, category_details = ?, how_to_apply = ?, article_content = ?, thumbnail = ?,
          links = ?, notification_pdf = ?, admit_card_url = ?, result_url = ?,
          apply_online_url = ?, official_website_url = ?, status = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND author_id = ?
      `).bind(
        title, finalSlug, category, department, post_date, last_date,
        short_desc, total_vacancy, importantDates, applicationFee,
        ageLimit, vacancyDetails, categoryDetails, how_to_apply, article_content, thumbnail,
        links, notificationPdf, admitCardUrl, resultUrl,
        apply_online_url, official_website_url, postStatus,
        postId, author.id
      ).run();
    }

    await syncPostCategoriesOnSave({
      postId,
      primaryCategory: category,
      newTitle: title,
      previousPost: currentPost,
      body: req.body
    });
    globalThis.__invalidateCategoryCache?.();

    res.redirect('/author-portal/posts?success=updated');
  } catch (err) {
    next(err);
  }
});

// Author Profile & Settings
router.get('/profile', async (req, res, next) => {
  try {
    const author = await d1.prepare('SELECT * FROM authors WHERE id = ?').bind(req.author.id).first();
    res.render('author/profile', {
      title: 'Author Profile & Account Settings - Odisha Aspirants',
      author: author || req.author,
      success: req.query.success || '',
      error: req.query.error || ''
    });
  } catch (err) {
    next(err);
  }
});

// Author Profile Update Submission
router.post('/profile', async (req, res, next) => {
  try {
    const authorId = req.author.id;
    const current = await d1.prepare('SELECT * FROM authors WHERE id = ?').bind(authorId).first();
    if (!current) return res.status(404).send('Author record not found');

    const {
      name, role, email, qualification, experience,
      avatar_url, bio, twitter_url, linkedin_url, telegram_url,
      current_password, new_password, confirm_password
    } = req.body;

    const finalName = (name && name.trim()) ? name.trim() : current.name;
    const finalRole = (role && role.trim()) ? role.trim() : current.role;
    const finalEmail = (email && email.trim()) ? email.trim() : current.email;
    const finalQual = (qualification && qualification.trim()) ? qualification.trim() : current.qualification;
    const finalExp = (experience && experience.trim()) ? experience.trim() : current.experience;
    const finalAvatar = (avatar_url && avatar_url.trim()) ? avatar_url.trim() : current.avatar_url;
    const finalBio = (bio !== undefined && bio.trim()) ? bio.trim() : current.bio;
    const finalTwitter = (twitter_url && twitter_url.trim()) ? twitter_url.trim() : current.twitter_url;
    const finalLinkedin = (linkedin_url && linkedin_url.trim()) ? linkedin_url.trim() : current.linkedin_url;
    const finalTelegram = (telegram_url && telegram_url.trim()) ? telegram_url.trim() : current.telegram_url;

    // Handle password change if requested
    let passwordUpdated = false;
    let newPasswordHash = current.password_hash;

    if (new_password && new_password.trim()) {
      if (new_password.trim() !== (confirm_password || '').trim()) {
        return res.redirect('/author-portal/profile?error=passwords_mismatch');
      }

      // Check current password if already had one
      if (current.password_hash) {
        if (!current_password || !verifyPassword(current_password.trim(), current.password_hash)) {
          return res.redirect('/author-portal/profile?error=invalid_current_password');
        }
      }

      newPasswordHash = hashPassword(new_password.trim());
      passwordUpdated = true;
    }

    await d1.prepare(`
      UPDATE authors SET
        name = ?, role = ?, email = ?, qualification = ?, experience = ?,
        avatar_url = ?, bio = ?, twitter_url = ?, linkedin_url = ?, telegram_url = ?,
        password_hash = ?
      WHERE id = ?
    `).bind(
      finalName, finalRole, finalEmail, finalQual, finalExp,
      finalAvatar, finalBio, finalTwitter, finalLinkedin, finalTelegram,
      newPasswordHash,
      authorId
    ).run();

    res.redirect(`/author-portal/profile?success=${passwordUpdated ? 'password_and_profile_saved' : 'saved'}`);
  } catch (err) {
    next(err);
  }
});

// JSON Image Upload Endpoint for TinyMCE Editor
router.post('/r2/upload-json', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    const uploadRes = await saveUploadedAsset(req.file, req, res.locals.settings);

    res.json({ success: true, location: uploadRes.fileUrl, url: uploadRes.fileUrl });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Image upload failed' });
  }
});

module.exports = router;

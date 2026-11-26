const crypto = require('crypto');
const d1 = require('../db/d1Client');
const config = require('../config/env');
const { getAllValidTokens } = require('../middleware/auth');
const { getAuthorFromToken } = require('../middleware/authorAuth');
const {
  CATEGORIES,
  safeJsonParse,
  formatDate,
  formatPrettyDate,
  slugify
} = require('./helpers');
const {
  fetchRelatedCategoryPosts,
  fetchAllCategoryCounts,
  getVisibleCategoriesMap
} = require('./postCategoryManager');

/**
 * Compute HMAC preview token for a saved post so draft previews work
 * securely across both main site domain and setup.* admin subdomain.
 */
function signPreviewToken(post) {
  if (!post || !post.id || !post.slug) return '';
  const secret = config.server.sessionSecret || 'odishaaspirants_secret_key_cloudflare_d1_r2';
  return crypto
    .createHmac('sha256', secret)
    .update(`draft-preview:${post.id}:${post.slug}`)
    .digest('hex')
    .slice(0, 24);
}

/**
 * Constant-time check for a supplied draft preview token.
 */
function verifyPreviewToken(post, token) {
  if (!post || !token || typeof token !== 'string') return false;
  const expected = signPreviewToken(post);
  if (!expected || expected.length !== token.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch (e) {
    return false;
  }
}

/**
 * Build public preview URL for any non-active post.
 */
function buildDraftPreviewUrl(post, publicBase = '') {
  if (!post || !post.slug) return '';
  if (post.status === 'active') {
    return `${publicBase}/post/${post.slug}`;
  }
  const token = signPreviewToken(post);
  return `${publicBase}/post/${post.slug}?preview=${encodeURIComponent(token)}`;
}

/**
 * Determine whether the current request is authorized to preview a non-active post
 * (via valid signed ?preview= token, admin cookie, or owning author/editor cookie).
 */
async function canPreviewPost(req, post) {
  if (!post) return false;
  if (post.status === 'active') return true;

  const queryToken = req.query && req.query.preview ? String(req.query.preview).trim() : '';
  if (queryToken && verifyPreviewToken(post, queryToken)) {
    return true;
  }

  const adminToken = req.cookies?.sr_admin_token;
  if (adminToken && getAllValidTokens().includes(adminToken)) {
    return true;
  }

  const authorToken = req.cookies?.gez_author_token;
  if (authorToken) {
    const author = await getAuthorFromToken(authorToken);
    if (author) {
      const isEditor = Boolean(
        author.id === 1 ||
        (author.role && (author.role.toLowerCase().includes('editor') || author.role.toLowerCase().includes('lead'))) ||
        author.slug === 'editorial-team'
      );
      if (isEditor || Number(post.author_id) === Number(author.id)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Normalize raw form body into a post-like object for unsaved live Draft Preview.
 */
function buildPreviewPostFromBody(body = {}, fallbackAuthorId = 1) {
  const title = (body.title || '').trim() || 'Untitled Draft Preview';
  const category = (body.category && CATEGORIES[body.category]) ? body.category : 'latest-jobs';
  return {
    id: body.post_id ? parseInt(body.post_id, 10) || 0 : 0,
    title,
    slug: body.slug ? slugify(body.slug) : slugify(title),
    category,
    department: (body.department || '').trim() || null,
    post_date: (body.post_date || '').trim() || formatDate(new Date()),
    last_date: (body.last_date || '').trim() || null,
    short_desc: (body.short_desc || '').trim() || null,
    total_vacancy: (body.total_vacancy || '').trim() || null,
    important_dates: body.important_dates || '[]',
    application_fee: body.application_fee || '[]',
    age_limit: body.age_limit || '{}',
    vacancy_details: body.vacancy_details || '[]',
    category_details: body.category_details || '[]',
    how_to_apply: body.how_to_apply || null,
    article_content: body.article_content || null,
    thumbnail: (body.thumbnail_url || '').trim() || null,
    links: body.links || '[]',
    notification_pdf: (body.notification_pdf_url || '').trim() || null,
    admit_card_url: (body.admit_card_url || '').trim() || null,
    result_url: (body.result_url || '').trim() || null,
    apply_online_url: (body.apply_online_url || '').trim() || null,
    official_website_url: (body.official_website_url || '').trim() || null,
    views: 0,
    is_featured: body.is_featured ? 1 : 0,
    status: body.status || 'draft',
    author_id: body.author_id ? (parseInt(body.author_id, 10) || fallbackAuthorId) : fallbackAuthorId,
    created_at: new Date().toISOString()
  };
}

/**
 * Render pages/detail safely in Draft Preview Mode from either a saved post
 * or unsaved form input inside Admin / Author workspaces.
 */
async function renderPostPreview(req, res, { post, editUrl = '', backUrl = '', publishUrl = '' }) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');

  res.locals.categories = CATEGORIES;
  res.locals.formatDate = formatDate;
  res.locals.formatPrettyDate = formatPrettyDate;
  res.locals.safeJsonParse = safeJsonParse;
  res.locals.currentPath = `/post/${post.slug || 'preview'}`;

  const excludeId = post.id || 0;
  const [relatedPosts, authorRow, recentPosts, popularPosts, categoryCounts] = await Promise.all([
    fetchRelatedCategoryPosts(post.category, excludeId, 8),
    d1.prepare('SELECT * FROM authors WHERE id = ?').bind(post.author_id || 1).first(),
    d1.prepare("SELECT id, title, slug, category, post_date, created_at FROM posts WHERE status = 'active' AND id != ? ORDER BY id DESC LIMIT 5").bind(excludeId).all(),
    d1.prepare("SELECT id, title, slug, category, post_date, views, created_at FROM posts WHERE status = 'active' ORDER BY views DESC, id DESC LIMIT 5").all(),
    fetchAllCategoryCounts()
  ]);

  res.locals.visibleCategories = getVisibleCategoriesMap(res.locals.settings || {}, categoryCounts || []);

  const siteTitle = (res.locals.settings && res.locals.settings.site_title) ? res.locals.settings.site_title : 'Odisha Aspirants';
  const author = authorRow || {
    name: 'Mangal',
    slug: 'mangal',
    role: 'Senior Recruitment Analyst & Fact-Checker Lead',
    avatar_url: '/images/default-avatar.svg',
    bio: `Verified recruitment researcher and content editor at ${siteTitle}.`
  };

  return res.render('pages/detail', {
    title: `[PREVIEW] ${post.title} - ${siteTitle}`,
    metaDescription: post.short_desc ? post.short_desc.replace(/\s+/g, ' ').trim() : post.title,
    metaRobots: 'noindex, nofollow',
    isDraftPreview: true,
    previewStatus: post.status || 'draft',
    previewEditUrl: editUrl,
    previewBackUrl: backUrl,
    previewPublishUrl: publishUrl,
    post,
    author,
    catInfo: CATEGORIES[post.category] || { name: 'Notification', slug: post.category },
    importantDates: safeJsonParse(post.important_dates, []),
    applicationFee: safeJsonParse(post.application_fee, []),
    ageLimit: safeJsonParse(post.age_limit, {}),
    vacancyDetails: safeJsonParse(post.vacancy_details, []),
    categoryDetails: safeJsonParse(post.category_details, []),
    links: safeJsonParse(post.links, []),
    relatedPosts: relatedPosts || [],
    recentPosts: recentPosts || [],
    popularPosts: popularPosts || [],
    categoryCounts: categoryCounts || [],
    fullUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`
  });
}

module.exports = {
  signPreviewToken,
  verifyPreviewToken,
  buildDraftPreviewUrl,
  canPreviewPost,
  buildPreviewPostFromBody,
  renderPostPreview
};

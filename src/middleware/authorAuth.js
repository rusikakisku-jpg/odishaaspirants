const crypto = require('crypto');
const config = require('../config/env');
const d1 = require('../db/d1Client');

const PASSWORD_SALT = 'oa_author_salt_2026';

function hashPassword(password) {
  if (!password) return '';
  return crypto.pbkdf2Sync(password, PASSWORD_SALT, 1000, 32, 'sha256').toString('hex');
}

function verifyPassword(inputPassword, storedHash) {
  if (!storedHash || !inputPassword) return false;
  // Also check plaintext match for initial setup convenience
  if (inputPassword === storedHash) return true;
  return hashPassword(inputPassword) === storedHash;
}

function generateAuthorToken(author) {
  const secret = config.server.sessionSecret || 'odishaaspirants_secret_key_cloudflare_d1_r2';
  const data = `${author.id}:${author.slug}`;
  const sig = crypto.createHmac('sha256', secret).update(data).digest('hex');
  return `${author.id}.${sig}`;
}

async function getAuthorFromToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;

  const [idStr, sig] = token.split('.');
  const authorId = parseInt(idStr, 10);
  if (isNaN(authorId)) return null;

  try {
    const author = await d1.prepare('SELECT * FROM authors WHERE id = ? AND is_active = 1').bind(authorId).first();
    if (!author) return null;

    const secret = config.server.sessionSecret || 'odishaaspirants_secret_key_cloudflare_d1_r2';
    const expectedSig = crypto.createHmac('sha256', secret).update(`${author.id}:${author.slug}`).digest('hex');

    if (sig === expectedSig) {
      return author;
    }
  } catch (err) {
    console.error('[AUTH ERROR] Author token verification failed:', err);
  }
  return null;
}

async function requireAuthorAuth(req, res, next) {
  const token = req.cookies?.oa_author_token;
  const author = await getAuthorFromToken(token);

  if (author) {
    const isEditor = Boolean(
      author.id === 1 ||
      (author.role && (author.role.toLowerCase().includes('editor') || author.role.toLowerCase().includes('lead'))) ||
      author.email === 'editor@odishaaspirants.com' ||
      author.slug === 'editorial-team'
    );
    req.author = author;
    req.isEditor = isEditor;
    res.locals.author = author;
    res.locals.isAuthor = true;
    res.locals.isEditor = isEditor;
    return next();
  }

  // If API or AJAX request
  if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
    return res.status(401).json({ error: 'Unauthorized: Author login required' });
  }

  const returnUrl = encodeURIComponent(req.originalUrl || '/author-portal');
  return res.redirect(`/author-portal/login?returnUrl=${returnUrl}`);
}

function setAuthorAuthCookie(res, author) {
  const token = generateAuthorToken(author);
  res.cookie('oa_author_token', token, {
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days session
    sameSite: 'lax',
    path: '/'
  });
}

function clearAuthorAuthCookie(res) {
  res.clearCookie('oa_author_token', { path: '/' });
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateAuthorToken,
  getAuthorFromToken,
  requireAuthorAuth,
  setAuthorAuthCookie,
  clearAuthorAuthCookie
};

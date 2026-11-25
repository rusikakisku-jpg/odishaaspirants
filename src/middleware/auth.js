const crypto = require('crypto');
const config = require('../config/env');
const { getAdminUrl, isHttpsRequest } = require('../utils/adminHost');

function getAllValidTokens() {
  const secret = config.server.sessionSecret;
  const validUsers = [
    (config.admin.username || 'admin').toLowerCase(),
    'admin',
    'govtexamzone',
    'govtexamzoneadmin',
    'govtexamzoneofficial',
    'admin@govtexamzone.com'
  ];
  return validUsers.map(u => crypto.createHmac('sha256', secret).update(u).digest('hex'));
}

function getExpectedToken() {
  const secret = config.server.sessionSecret;
  const username = (config.admin.username || 'admin').toLowerCase();
  return crypto.createHmac('sha256', secret).update(username).digest('hex');
}

function requireAuth(req, res, next) {
  const token = req.cookies?.sr_admin_token;
  const validTokens = getAllValidTokens();

  if (token && validTokens.includes(token)) {
    req.isAdmin = true;
    res.locals.isAdmin = true;
    return next();
  }

  // If request is API or AJAX, return 401
  if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }

  res.redirect(getAdminUrl(req, '/login'));
}

function setAuthCookie(res, req) {
  const token = getExpectedToken();
  res.cookie('sr_admin_token', token, {
    httpOnly: true,
    secure: isHttpsRequest(req),
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'lax',
    path: '/'
  });
}

function clearAuthCookie(res, req) {
  res.clearCookie('sr_admin_token', {
    httpOnly: true,
    secure: isHttpsRequest(req),
    sameSite: 'lax',
    path: '/'
  });
}

module.exports = {
  requireAuth,
  setAuthCookie,
  clearAuthCookie
};

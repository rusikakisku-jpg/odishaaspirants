const config = require('../config/env');

/**
 * Extract the normalized lowercase hostname (without port) from a request.
 */
function getRequestHost(req) {
  if (!req) return '';
  const raw =
    (req.headers && (req.headers['x-forwarded-host'] || req.headers.host)) ||
    req.hostname ||
    '';
  return String(raw).split(',')[0].split(':')[0].trim().toLowerCase();
}

/**
 * Determine if the incoming request targets the dedicated admin subdomain
 * (setup.govtexamzone.com).
 */
function isAdminSubdomainRequest(req) {
  const host = getRequestHost(req);
  const configured = (config.admin && config.admin.subdomain) || 'setup.govtexamzone.com';
  return Boolean(host && host === configured.toLowerCase());
}

/**
 * Check whether the current request arrived over HTTPS.
 */
function isHttpsRequest(req) {
  if (!req) return false;
  const proto = String((req.headers && req.headers['x-forwarded-proto']) || req.protocol || '').toLowerCase();
  return Boolean(req.secure || proto === 'https');
}

/**
 * Return the base path prefix for admin links/actions:
 * "" on setup.govtexamzone.com, "/admin" everywhere else.
 */
function getAdminBase(req) {
  return isAdminSubdomainRequest(req) ? '' : '/admin';
}

/**
 * Return the base origin for public site links when inside admin subdomain.
 */
function getPublicBase(req) {
  return isAdminSubdomainRequest(req)
    ? ((config.admin && config.admin.publicSiteUrl) || 'https://govtexamzone.com')
    : '';
}

/**
 * Build a safe admin URL respecting subdomain vs /admin path mounting.
 */
function getAdminUrl(req, subPath = '') {
  const base = getAdminBase(req);
  if (!subPath || subPath === '/') {
    return base || '/';
  }
  const normalized = subPath.startsWith('/') ? subPath : `/${subPath}`;
  return `${base}${normalized}`;
}

module.exports = {
  getRequestHost,
  isAdminSubdomainRequest,
  isHttpsRequest,
  getAdminBase,
  getPublicBase,
  getAdminUrl
};

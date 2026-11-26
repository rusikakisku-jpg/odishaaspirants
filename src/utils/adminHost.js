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
 * (setup.odishaaspirants.com).
 */
function isAdminSubdomainRequest(req) {
  const host = getRequestHost(req);
  const configured = (config.admin && config.admin.subdomain) || 'setup.odishaaspirants.com';
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
 * "" on setup.odishaaspirants.com, "/admin" everywhere else.
 */
function getAdminBase(req) {
  return isAdminSubdomainRequest(req) ? '' : '/admin';
}

/**
 * Return the base origin for public site links when inside admin subdomain.
 */
function getPublicBase(req) {
  return isAdminSubdomainRequest(req)
    ? ((config.admin && config.admin.publicSiteUrl) || 'https://odishaaspirants.com')
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

/**
 * Resolve the public origin (never the admin setup.* subdomain) for asset URLs.
 */
function getPublicOrigin(req, siteSettings) {
  const host = getRequestHost(req);
  if (host && (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local'))) {
    const rawHost = (req.headers && (req.headers['x-forwarded-host'] || req.headers.host)) || host;
    const proto = isHttpsRequest(req) ? 'https' : 'http';
    return `${proto}://${String(rawHost).split(',')[0].trim()}`;
  }
  const settingDomain = (siteSettings && siteSettings.site_domain ? String(siteSettings.site_domain).trim() : '');
  if (settingDomain) {
    return (settingDomain.startsWith('http') ? settingDomain : `https://${settingDomain}`).replace(/\/+$/, '');
  }
  if (config.admin && config.admin.publicSiteUrl) {
    return config.admin.publicSiteUrl.replace(/\/+$/, '');
  }
  if (host) {
    return `${isHttpsRequest(req) ? 'https' : 'http'}://${host}`;
  }
  return '';
}

/**
 * Convert a relative upload path (e.g. /uploads/file.pdf) into a full public URL.
 */
function toAbsoluteAssetUrl(fileUrl, req, siteSettings) {
  if (!fileUrl) return '';
  const trimmed = String(fileUrl).trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const origin = getPublicOrigin(req, siteSettings);
  if (!origin) return trimmed;
  const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${origin}${normalizedPath}`;
}

module.exports = {
  getRequestHost,
  isAdminSubdomainRequest,
  isHttpsRequest,
  getAdminBase,
  getPublicBase,
  getAdminUrl,
  getPublicOrigin,
  toAbsoluteAssetUrl
};

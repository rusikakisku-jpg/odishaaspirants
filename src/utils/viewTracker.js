const d1 = require('../db/d1Client');

/**
 * Return YYYY-MM-DD in IST (Asia/Kolkata, UTC+5:30) for accurate India portal daily stats.
 */
function getIstDateString(offsetDays = 0) {
  const istOffsetMs = 330 * 60 * 1000;
  const targetMs = Date.now() + istOffsetMs + offsetDays * 86400 * 1000;
  return new Date(targetMs).toISOString().slice(0, 10);
}

/**
 * Check if an incoming request looks like a browser prefetch or health check rather than a real read.
 */
function isPrefetchRequest(req) {
  if (!req || !req.headers) return false;
  const purpose = String(req.headers['sec-purpose'] || req.headers.purpose || req.headers['x-purpose'] || '').toLowerCase();
  return purpose.includes('prefetch') || purpose.includes('preview');
}

/**
 * Increment both lifetime post views and today's per-post view bucket safely.
 */
async function recordPostView(postId, req) {
  if (!postId || isPrefetchRequest(req)) return;
  const todayIst = getIstDateString(0);

  try {
    await d1.prepare('UPDATE posts SET views = COALESCE(views, 0) + 1 WHERE id = ?')
      .bind(postId)
      .run();
  } catch (err) {
    console.error('Post lifetime view update error:', err.message);
  }

  try {
    await d1.prepare(`
      INSERT INTO post_daily_views (post_id, view_date, views)
      VALUES (?, ?, 1)
      ON CONFLICT(post_id, view_date) DO UPDATE SET views = views + 1
    `).bind(postId, todayIst).run();
  } catch (err) {
    console.error('Post daily view update error:', err.message);
  }
}

module.exports = {
  getIstDateString,
  recordPostView
};

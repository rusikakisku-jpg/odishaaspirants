const d1 = require('../db/d1Client');
const { CATEGORIES, safeJsonParse } = require('./helpers');

function getUtcTimestamp() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

/**
 * Fetch all preserved category rows for a given post keyed by category slug.
 */
async function getPostCategoryMap(postId) {
  const map = {};
  if (!postId) return map;
  try {
    const rows = await d1.prepare(
      'SELECT category, display_title, bumped_at FROM post_categories WHERE post_id = ? ORDER BY bumped_at DESC'
    ).bind(postId).all();
    if (Array.isArray(rows)) {
      rows.forEach(r => {
        if (r && r.category) {
          map[r.category] = {
            category: r.category,
            display_title: r.display_title || '',
            bumped_at: r.bumped_at || ''
          };
        }
      });
    }
  } catch (err) {
    console.warn('getPostCategoryMap notice:', err.message);
  }
  return map;
}

/**
 * Parse submitted multi-category inputs cleanly from admin/author form body.
 */
function parseSubmittedCategories(body, primaryCategory) {
  const rawExtras = body?.extra_categories;
  const set = new Set();
  if (Array.isArray(rawExtras)) {
    rawExtras.forEach(c => {
      if (c && CATEGORIES[c]) set.add(String(c));
    });
  } else if (typeof rawExtras === 'string' && rawExtras.trim() && CATEGORIES[rawExtras.trim()]) {
    set.add(rawExtras.trim());
  }
  if (primaryCategory && CATEGORIES[primaryCategory]) {
    set.add(primaryCategory);
  }
  return set;
}

/**
 * Synchronize post_categories rows on post create/edit while strictly preserving
 * previous categories, their old titles, and their historical bumped_at order.
 */
async function syncPostCategoriesOnSave({
  postId,
  primaryCategory,
  newTitle,
  previousPost = null,
  body = {}
}) {
  if (!postId || !primaryCategory) return;

  const nowTs = getUtcTimestamp();
  const hasHistoryUi = body?.has_category_history_ui === '1';
  const bumpPrimary = body?.bump_primary === '1';
  const existingMap = previousPost ? await getPostCategoryMap(postId) : {};

  // Ensure legacy posts that pre-date post_categories keep their prior stage snapshot
  if (previousPost && previousPost.category && !existingMap[previousPost.category]) {
    const prevBumped = previousPost.created_at || previousPost.updated_at || nowTs;
    await d1.prepare(`
      INSERT OR IGNORE INTO post_categories (post_id, category, display_title, bumped_at)
      VALUES (?, ?, ?, ?)
    `).bind(postId, previousPost.category, previousPost.title || newTitle, prevBumped).run();
    existingMap[previousPost.category] = {
      category: previousPost.category,
      display_title: previousPost.title || newTitle,
      bumped_at: prevBumped
    };
  }

  const categoryChanged = Boolean(previousPost && previousPost.category && previousPost.category !== primaryCategory);

  // Determine target category set
  let targetCategories;
  if (hasHistoryUi) {
    targetCategories = parseSubmittedCategories(body, primaryCategory);
    // If switching primary category and form did not explicitly drop previous category, auto-retain it
    if (categoryChanged && previousPost.category && body?.[`cat_remove_${previousPost.category}`] !== '1') {
      targetCategories.add(previousPost.category);
    }
  } else {
    targetCategories = new Set(Object.keys(existingMap));
    targetCategories.add(primaryCategory);
  }

  // Delete categories explicitly unchecked in the UI (never delete primaryCategory)
  for (const oldCat of Object.keys(existingMap)) {
    if (!targetCategories.has(oldCat) && oldCat !== primaryCategory) {
      await d1.prepare('DELETE FROM post_categories WHERE post_id = ? AND category = ?')
        .bind(postId, oldCat)
        .run();
    }
  }

  // Upsert every active category row with appropriate display_title and bumped_at
  for (const cat of targetCategories) {
    const existingRow = existingMap[cat];
    const submittedTitleRaw = body?.[`cat_title_${cat}`];
    const submittedTitle = typeof submittedTitleRaw === 'string' ? submittedTitleRaw.trim() : '';

    if (cat === primaryCategory) {
      let resolvedTitle = newTitle;
      if (submittedTitle) {
        // When fixing a typo on the same primary category without editing section box separately,
        // prefer the updated main Post Title; otherwise honor explicit custom override.
        if (!categoryChanged && previousPost && submittedTitle === previousPost.title && newTitle !== previousPost.title) {
          resolvedTitle = newTitle;
        } else {
          resolvedTitle = submittedTitle;
        }
      }

      const shouldBump = !existingRow || categoryChanged || bumpPrimary;
      const resolvedBump = shouldBump ? nowTs : (existingRow.bumped_at || nowTs);

      await d1.prepare(`
        INSERT INTO post_categories (post_id, category, display_title, bumped_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(post_id, category) DO UPDATE SET
          display_title = excluded.display_title,
          bumped_at = excluded.bumped_at
      `).bind(postId, cat, resolvedTitle, resolvedBump).run();
    } else if (existingRow) {
      // Preserve historical category: NEVER overwrite old title with new main blog title!
      const preservedTitle = submittedTitle || existingRow.display_title || (previousPost ? previousPost.title : newTitle);
      if (preservedTitle !== existingRow.display_title) {
        await d1.prepare(`
          UPDATE post_categories SET display_title = ? WHERE post_id = ? AND category = ?
        `).bind(preservedTitle, postId, cat).run();
      }
    } else {
      // Newly added secondary category (e.g. user ticked an extra category manually)
      const extraTitle = submittedTitle || newTitle;
      await d1.prepare(`
        INSERT INTO post_categories (post_id, category, display_title, bumped_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(post_id, category) DO UPDATE SET
          display_title = excluded.display_title
      `).bind(postId, cat, extraTitle, nowTs).run();
    }
  }
}

/**
 * Remove post category history & daily view rows when a post is deleted.
 */
async function cleanupPostRelations(postId) {
  if (!postId) return;
  try {
    await d1.prepare('DELETE FROM post_categories WHERE post_id = ?').bind(postId).run();
  } catch (e) {}
  try {
    await d1.prepare('DELETE FROM post_daily_views WHERE post_id = ?').bind(postId).run();
  } catch (e) {}
}

/**
 * Fetch active posts belonging to a category, returning per-category display_title
 * as `title` ordered by latest category bump timestamp.
 */
async function fetchCategoryPosts(categorySlug, limit = 15, offset = 0) {
  return await d1.prepare(`
    SELECT p.*, COALESCE(NULLIF(pc.display_title, ''), p.title) AS title, pc.bumped_at
    FROM post_categories pc
    INNER JOIN posts p ON p.id = pc.post_id
    WHERE pc.category = ? AND p.status = 'active'
    ORDER BY pc.bumped_at DESC, p.id DESC
    LIMIT ? OFFSET ?
  `).bind(categorySlug, limit, offset).all();
}

/**
 * Count active posts in a category across both primary and preserved multi-categories.
 */
async function countCategoryPosts(categorySlug) {
  const row = await d1.prepare(`
    SELECT COUNT(*) AS total
    FROM post_categories pc
    INNER JOIN posts p ON p.id = pc.post_id
    WHERE pc.category = ? AND p.status = 'active'
  `).bind(categorySlug).first();
  return row?.total || 0;
}

/**
 * Fetch related posts inside the same category (using section display_title).
 */
async function fetchRelatedCategoryPosts(categorySlug, excludePostId, limit = 8) {
  return await d1.prepare(`
    SELECT p.id, COALESCE(NULLIF(pc.display_title, ''), p.title) AS title, p.slug, p.post_date
    FROM post_categories pc
    INNER JOIN posts p ON p.id = pc.post_id
    WHERE pc.category = ? AND p.id != ? AND p.status = 'active'
    ORDER BY pc.bumped_at DESC, p.id DESC
    LIMIT ?
  `).bind(categorySlug, excludePostId, limit).all();
}

/**
 * Fetch active post counts per category for sidebars.
 */
async function fetchAllCategoryCounts() {
  return await d1.prepare(`
    SELECT pc.category, COUNT(DISTINCT pc.post_id) AS count
    FROM post_categories pc
    INNER JOIN posts p ON p.id = pc.post_id
    WHERE p.status = 'active'
    GROUP BY pc.category
  `).all();
}

/**
 * Compute visible categories map based on admin hidden_categories and optional auto-hide empty setting.
 */
function getVisibleCategoriesMap(settings = {}, categoryCounts = []) {
  const hiddenList = safeJsonParse(settings?.hidden_categories, []);
  const hiddenSet = new Set(Array.isArray(hiddenList) ? hiddenList.map(String) : []);
  const autoHideEmpty = settings?.auto_hide_empty_categories === '1';

  const countMap = {};
  if (Array.isArray(categoryCounts)) {
    categoryCounts.forEach(c => {
      if (c && c.category) countMap[c.category] = Number(c.count || 0);
    });
  }

  const visibleMap = {};
  Object.keys(CATEGORIES).forEach(catKey => {
    const manuallyHidden = hiddenSet.has(catKey);
    const emptyHidden = autoHideEmpty && (countMap[catKey] || 0) === 0;
    visibleMap[catKey] = !(manuallyHidden || emptyHidden);
  });
  return visibleMap;
}

module.exports = {
  getPostCategoryMap,
  syncPostCategoriesOnSave,
  cleanupPostRelations,
  fetchCategoryPosts,
  countCategoryPosts,
  fetchRelatedCategoryPosts,
  fetchAllCategoryCounts,
  getVisibleCategoriesMap
};

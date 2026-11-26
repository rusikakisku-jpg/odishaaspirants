const express = require('express');
const router = express.Router();
const d1 = require('../db/d1Client');
const r2 = require('../storage/r2Client');
const config = require('../config/env');

// Live Search API
router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res.json({ success: true, count: 0, results: [] });
    }

    const term = `%${q}%`;
    const posts = await d1.prepare(`
      SELECT id, title, slug, category, department, post_date, last_date
      FROM posts 
      WHERE (title LIKE ? OR department LIKE ?) AND status = 'active'
      ORDER BY id DESC LIMIT 10
    `).bind(term, term).all();

    res.json({
      success: true,
      count: posts.length,
      results: posts
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// All Posts API (with category & pagination filters)
router.get('/posts', async (req, res) => {
  try {
    const category = req.query.category || '';
    const page = parseInt(req.query.page || '1', 10);
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
    const offset = (page - 1) * limit;

    let query = 'SELECT id, title, slug, category, department, post_date, last_date, total_vacancy, is_featured, views FROM posts WHERE status = "active"';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const posts = await d1.prepare(query).bind(...params).all();

    res.json({
      success: true,
      page,
      limit,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Single Post Detail API by Slug
router.get('/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await d1.prepare("SELECT * FROM posts WHERE slug = ? AND status = 'active'").bind(slug).first();

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const { safeJsonParse } = require('../utils/helpers');

    res.json({
      success: true,
      data: {
        ...post,
        important_dates: safeJsonParse(post.important_dates, []),
        application_fee: safeJsonParse(post.application_fee, []),
        age_limit: safeJsonParse(post.age_limit, {}),
        vacancy_details: safeJsonParse(post.vacancy_details, []),
        category_details: safeJsonParse(post.category_details, []),
        links: safeJsonParse(post.links, [])
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8 Highlight Badges API
router.get('/badges', async (req, res) => {
  try {
    const badges = await d1.prepare('SELECT * FROM badges WHERE is_active = 1 ORDER BY display_order ASC, id ASC').all();
    res.json({ success: true, count: badges.length, data: badges });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Marquees Tickers API
router.get('/marquees', async (req, res) => {
  try {
    const marquees = await d1.prepare('SELECT * FROM marquees WHERE is_active = 1 ORDER BY display_order ASC, id ASC').all();
    res.json({ success: true, count: marquees.length, data: marquees });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cloudflare D1 & R2 Status API
router.get('/status', async (req, res) => {
  try {
    const postCount = await d1.prepare('SELECT COUNT(*) as count FROM posts').first();
    const uploads = await r2.listFiles();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      cloudflareD1: {
        mode: d1.isCloudflareD1 ? 'remote-d1' : 'local-d1-emulated',
        databaseId: config.cloudflare.d1.databaseId || 'local-sqlite-db',
        isConfigured: config.cloudflare.d1.isConfigured,
        totalPosts: postCount?.count || 0
      },
      cloudflareR2: {
        mode: r2.isR2Configured ? 'remote-r2' : 'local-storage-fallback',
        bucketName: config.cloudflare.r2.bucketName,
        isConfigured: config.cloudflare.r2.isConfigured,
        filesCount: uploads.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Authors List API
router.get('/authors', async (req, res) => {
  try {
    const authors = await d1.prepare(`
      SELECT a.*, COUNT(p.id) as post_count 
      FROM authors a
      LEFT JOIN posts p ON p.author_id = a.id AND p.status = 'active'
      WHERE a.is_active = 1
      GROUP BY a.id
      ORDER BY a.id ASC
    `).all();
    res.json({ success: true, count: authors.length, data: authors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Single Author Profile API
router.get('/authors/:slug', async (req, res) => {
  try {
    const slug = (req.params.slug || '').trim().toLowerCase();
    const author = await d1.prepare('SELECT * FROM authors WHERE slug = ? AND is_active = 1').bind(slug).first();
    if (!author) {
      return res.status(404).json({ success: false, error: 'Author not found' });
    }
    const posts = await d1.prepare('SELECT id, title, slug, category, department, post_date FROM posts WHERE author_id = ? AND status = "active" ORDER BY id DESC LIMIT 50').bind(author.id).all();
    res.json({ success: true, data: { ...author, posts } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;


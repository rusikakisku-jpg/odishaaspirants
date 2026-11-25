import { env } from "cloudflare:workers";
import { EventEmitter } from "node:events";
import { Readable } from "node:stream";

// Expose Cloudflare environment bindings to global scope for D1 and R2
globalThis.__CF_ENV__ = env;
globalThis.__CF_PAGES__ = true;
if (env) {
  if (env.DB) globalThis.DB = env.DB;
  if (env.STORAGE_BUCKET) globalThis.STORAGE_BUCKET = env.STORAGE_BUCKET;
}

// Dynamically import Express app
const serverModule = await import("./server.js");
const app = serverModule.default || serverModule;

async function handleExpressRequest(app, request) {
  const url = new URL(request.url);
  const req = new Readable({ read() {} });
  req.url = url.pathname + url.search;
  req.method = request.method;
  req.headers = Object.fromEntries(request.headers.entries());
  if (!req.headers.host && url.host) {
    req.headers.host = url.host;
  }
  if (!req.headers["x-forwarded-proto"] && url.protocol) {
    req.headers["x-forwarded-proto"] = url.protocol.replace(":", "");
  }
  req.connection = { remoteAddress: request.headers.get("cf-connecting-ip") || "127.0.0.1" };
  req.socket = req.connection;
  req.ip = req.connection.remoteAddress;

  if (request.body && request.method !== "GET" && request.method !== "HEAD") {
    const arrayBuffer = await request.arrayBuffer();
    if (arrayBuffer.byteLength > 0) {
      req.push(Buffer.from(arrayBuffer));
    }
  }
  req.push(null);

  return new Promise((resolve) => {
    const resHeaders = new Headers();
    const chunks = [];

    const res = new EventEmitter();
    res.statusCode = 200;
    res.statusMessage = "OK";
    res.headersSent = false;
    res.finished = false;

    res.setHeader = (name, value) => {
      const lower = name.toLowerCase();
      if (lower === "set-cookie") {
        if (Array.isArray(value)) {
          for (const v of value) resHeaders.append("set-cookie", v);
        } else {
          resHeaders.append("set-cookie", value);
        }
      } else if (Array.isArray(value)) {
        resHeaders.delete(name);
        for (const v of value) resHeaders.append(name, v);
      } else {
        resHeaders.set(name, value);
      }
    };
    res.getHeader = (name) => resHeaders.get(name);
    res.getHeaders = () => Object.fromEntries(resHeaders.entries());
    res.hasHeader = (name) => resHeaders.has(name);
    res.removeHeader = (name) => resHeaders.delete(name);

    res.writeHead = (status, reason, headers) => {
      res.statusCode = status;
      res.headersSent = true;
      if (typeof reason === "string") res.statusMessage = reason;
      const h = typeof reason === "object" ? reason : headers;
      if (h) {
        for (const [k, v] of Object.entries(h)) {
          res.setHeader(k, v);
        }
      }
      return res;
    };

    res.write = (chunk, encoding, cb) => {
      res.headersSent = true;
      if (chunk) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk, encoding) : chunk);
      }
      if (typeof cb === "function") cb();
      return true;
    };

    res.end = (chunk, encoding, cb) => {
      res.headersSent = true;
      res.finished = true;
      if (chunk) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk, encoding) : chunk);
      }
      if (typeof cb === "function") cb();
      const body = chunks.length > 0 ? Buffer.concat(chunks) : null;
      resolve(new Response(body, {
        status: res.statusCode || 200,
        statusText: res.statusMessage || "OK",
        headers: resHeaders
      }));
    };

    app(req, res);
  });
}

export default {
  async fetch(request, env, ctx) {
    try {
      globalThis.__CF_ENV__ = env;
      globalThis.__CF_PAGES__ = true;
      if (env) {
        if (env.DB) globalThis.DB = env.DB;
        if (env.STORAGE_BUCKET) globalThis.STORAGE_BUCKET = env.STORAGE_BUCKET;
      }

      const url = new URL(request.url);
      const reqHost = (request.headers.get("x-forwarded-host") || request.headers.get("host") || url.hostname || "")
        .split(",")[0].split(":")[0].trim().toLowerCase();
      const adminSubdomain = (env?.ADMIN_SUBDOMAIN || "setup.odishaaspirants.com").trim().toLowerCase();
      const isSetupSubdomain = Boolean(reqHost && reqHost === adminSubdomain);

      // 1. Serve uploaded media / documents directly from Cloudflare R2 bucket if requested
      if (url.pathname.startsWith('/uploads/')) {
        const fileKey = decodeURIComponent(url.pathname.replace(/^\/uploads\//, ''));
        const bucket = env?.STORAGE_BUCKET || globalThis.STORAGE_BUCKET;
        if (bucket && typeof bucket.get === 'function') {
          try {
            const object = await bucket.get(fileKey);
            if (object) {
              const headers = new Headers();
              object.writeHttpMetadata(headers);
              headers.set('etag', object.httpEtag);
              headers.set('cache-control', 'public, max-age=31536000, immutable');
              return new Response(object.body, { headers });
            }
          } catch (r2Err) {
            console.error("R2 fetch error:", r2Err);
          }
        }
      }

      // 2. Check if this request can be served as a static asset via env.ASSETS (Pages / Workers Assets)
      // On setup.odishaaspirants.com, never serve public static robots.txt or sitemap.xml from ASSETS
      const isSeoPublicFile = url.pathname === '/robots.txt' || url.pathname === '/sitemap.xml';
      const isAsset = (!isSetupSubdomain || !isSeoPublicFile) && (
                      /\.[a-zA-Z0-9]+$/.test(url.pathname) ||
                      url.pathname.startsWith('/css/') ||
                      url.pathname.startsWith('/js/') ||
                      url.pathname.startsWith('/images/') ||
                      isSeoPublicFile ||
                      url.pathname === '/manifest.json' ||
                      url.pathname === '/favicon.ico' ||
                      url.pathname === '/favicon.svg');

      if (isAsset && env && env.ASSETS) {
        try {
          const assetRes = await env.ASSETS.fetch(request);
          if (assetRes && assetRes.status !== 404) {
            const h = new Headers(assetRes.headers);
            // Cache static assets (CSS, JS, images, fonts) so page transitions are instantaneous
            if (!h.has('cache-control') || h.get('cache-control').includes('max-age=0')) {
              h.set('cache-control', 'public, max-age=86400, stale-while-revalidate=604800');
            }
            return new Response(assetRes.body, {
              status: assetRes.status,
              statusText: assetRes.statusText,
              headers: h
            });
          }
        } catch (assetErr) {}
      }

      // Favicon fallback to logo if favicon.ico is requested
      if (url.pathname === '/favicon.ico' && env && env.ASSETS) {
        try {
          const fallbackRes = await env.ASSETS.fetch(new Request(new URL('/images/oa-logo.svg', request.url), request));
          if (fallbackRes && fallbackRes.status !== 404) {
            return fallbackRes;
          }
        } catch (e) {}
      }

      return await handleExpressRequest(app, request);
    } catch (err) {
      console.error("Worker fetch exception:", err);
      return new Response(
        "Odisha Aspirants - Worker Exception:\n" + (err.stack || err.message || String(err)),
        {
          status: 500,
          headers: { "content-type": "text/plain; charset=utf-8" }
        }
      );
    }
  }
};

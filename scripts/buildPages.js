const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

// 1. Build in-memory EJS templates first
console.log('⚡ Step 1: Pre-compiling EJS templates...');
require('./buildTemplates');

// 2. Prepare dist directory
console.log('📁 Step 2: Preparing dist directory for Cloudflare Pages...');
const distDir = path.resolve('dist');
const publicDir = path.resolve('public');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Helper to copy directory recursively
function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy public assets to dist
copyDirSync(publicDir, distDir);
console.log('✅ Static assets copied from public/ to dist/');

// 3. Create _routes.json for Cloudflare Pages optimization
const routesConfig = {
  version: 1,
  include: ["/*"],
  exclude: [
    "/css/*",
    "/js/*",
    "/images/*",
    "/manifest.json"
  ]
};

fs.writeFileSync(
  path.join(distDir, '_routes.json'),
  JSON.stringify(routesConfig, null, 2),
  'utf8'
);
fs.writeFileSync(
  path.join(publicDir, '_routes.json'),
  JSON.stringify(routesConfig, null, 2),
  'utf8'
);
console.log('✅ Created _routes.json in dist/ and public/');

// 4. Bundle worker.mjs into dist/_worker.js using esbuild
console.log('📦 Step 3: Bundling worker for Cloudflare Pages Advanced Mode (_worker.js)...');
(async function bundleWorker() {
  try {
    const outPath = path.join(distDir, '_worker.js');
    await esbuild.build({
      entryPoints: [path.resolve('worker.mjs')],
      bundle: true,
      platform: 'node',
      target: 'es2022',
      format: 'esm',
      outfile: outPath,
      external: [
        'cloudflare:workers'
      ],
      banner: {
        js: `
import * as nodeAssert from 'node:assert';
import * as nodeAsyncHooks from 'node:async_hooks';
import * as nodeBuffer from 'node:buffer';
import * as nodeChildProcess from 'node:child_process';
import * as nodeCrypto from 'node:crypto';
import * as nodeDns from 'node:dns';
import * as nodeEvents from 'node:events';
import * as nodeFs from 'node:fs';
import * as nodeFsPromises from 'node:fs/promises';
import * as nodeHttp from 'node:http';
import * as nodeHttp2 from 'node:http2';
import * as nodeHttps from 'node:https';
import * as nodeNet from 'node:net';
import * as nodeOs from 'node:os';
import * as nodePath from 'node:path';
import * as nodeProcess from 'node:process';
import * as nodeQuerystring from 'node:querystring';
import * as nodeStream from 'node:stream';
import * as nodeStringDecoder from 'node:string_decoder';
import * as nodeTls from 'node:tls';
import * as nodeUrl from 'node:url';
import * as nodeUtil from 'node:util';
import * as nodeZlib from 'node:zlib';

const copyProps = (target, src) => {
  if (!src) return;
  for (const key of Object.getOwnPropertyNames(src)) {
    if (key === 'name' || key === 'length' || key === 'prototype' || key === 'caller' || key === 'arguments') continue;
    try {
      target[key] = src[key];
    } catch (e) {}
  }
};

const toCJS = (mod, preferredDefault) => {
  if (!mod) return preferredDefault || {};
  let target = preferredDefault;
  if (!target) {
    if (typeof mod === 'function') {
      target = mod;
    } else if (typeof mod.default === 'function') {
      target = mod.default;
    } else {
      target = {};
    }
  }
  copyProps(target, mod);
  if (mod.default && typeof mod.default === 'object') {
    copyProps(target, mod.default);
  }
  return target;
};

const cjsAssert = toCJS(nodeAssert, nodeAssert.default);
const cjsAsyncHooks = toCJS(nodeAsyncHooks);
const cjsBuffer = toCJS(nodeBuffer);
const cjsChildProcess = toCJS(nodeChildProcess);
const cjsCrypto = toCJS(nodeCrypto);
const cjsDns = toCJS(nodeDns);
const cjsEvents = toCJS(nodeEvents, nodeEvents.EventEmitter || nodeEvents.default);
const cjsFs = toCJS(nodeFs);
const cjsFsPromises = toCJS(nodeFsPromises);

// Safe filesystem shims for Serverless Edge environment:
// When any module checks for file existence or stats, gracefully return ENOENT instead of throwing unenv not implemented errors
cjsFs.stat = (p, opts, cb) => {
  const callback = typeof opts === 'function' ? opts : cb;
  const err = new Error("ENOENT: no such file or directory, stat '" + p + "'");
  err.code = 'ENOENT';
  if (typeof callback === 'function') setTimeout(() => callback(err), 0);
};
cjsFs.statSync = (p) => {
  const err = new Error("ENOENT: no such file or directory, stat '" + p + "'");
  err.code = 'ENOENT';
  throw err;
};
cjsFs.lstat = cjsFs.stat;
cjsFs.lstatSync = cjsFs.statSync;
cjsFs.fstat = cjsFs.stat;
cjsFs.fstatSync = cjsFs.statSync;
cjsFs.access = (p, mode, cb) => {
  const callback = typeof mode === 'function' ? mode : cb;
  const err = new Error("ENOENT: no such file or directory, access '" + p + "'");
  err.code = 'ENOENT';
  if (typeof callback === 'function') setTimeout(() => callback(err), 0);
};
cjsFs.accessSync = cjsFs.statSync;
cjsFs.existsSync = () => false;
const cjsHttp = toCJS(nodeHttp);
const cjsHttp2 = toCJS(nodeHttp2);
const cjsHttps = toCJS(nodeHttps);

const origCreateHttpServer = cjsHttp.createServer;
cjsHttp.createServer = function(...args) {
  try {
    if (typeof origCreateHttpServer === 'function') {
      const res = origCreateHttpServer.apply(this, args);
      if (res && typeof res.listen === 'function') return res;
    }
  } catch (e) {}
  const s = new cjsEvents();
  s.listen = function(port, cb) { if (typeof cb === 'function') setTimeout(cb, 0); return s; };
  s.close = function(cb) { if (typeof cb === 'function') setTimeout(cb, 0); return s; };
  s.address = function() { return { port: 3000, family: 'IPv4', address: '127.0.0.1' }; };
  return s;
};

const origCreateHttpsServer = cjsHttps.createServer;
cjsHttps.createServer = function(...args) {
  try {
    if (typeof origCreateHttpsServer === 'function') {
      const res = origCreateHttpsServer.apply(this, args);
      if (res && typeof res.listen === 'function') return res;
    }
  } catch (e) {}
  const s = new cjsEvents();
  s.listen = function(port, cb) { if (typeof cb === 'function') setTimeout(cb, 0); return s; };
  s.close = function(cb) { if (typeof cb === 'function') setTimeout(cb, 0); return s; };
  s.address = function() { return { port: 3000, family: 'IPv4', address: '127.0.0.1' }; };
  return s;
};
const cjsNet = toCJS(nodeNet);
const cjsOs = toCJS(nodeOs);
const cjsPath = toCJS(nodePath);
const cjsProcess = toCJS(nodeProcess);
const cjsQuerystring = toCJS(nodeQuerystring);
const cjsStream = toCJS(nodeStream, nodeStream.Stream || nodeStream.default);
const cjsStringDecoder = toCJS(nodeStringDecoder);
const cjsTls = toCJS(nodeTls);
const cjsUrl = toCJS(nodeUrl);
const cjsUtil = toCJS(nodeUtil);
const cjsZlib = toCJS(nodeZlib);

const nodeModules = {
  'assert': cjsAssert, 'node:assert': cjsAssert,
  'async_hooks': cjsAsyncHooks, 'node:async_hooks': cjsAsyncHooks,
  'buffer': cjsBuffer, 'node:buffer': cjsBuffer,
  'child_process': cjsChildProcess, 'node:child_process': cjsChildProcess,
  'crypto': cjsCrypto, 'node:crypto': cjsCrypto,
  'dns': cjsDns, 'node:dns': cjsDns,
  'events': cjsEvents, 'node:events': cjsEvents,
  'fs': cjsFs, 'node:fs': cjsFs,
  'fs/promises': cjsFsPromises, 'node:fs/promises': cjsFsPromises,
  'http': cjsHttp, 'node:http': cjsHttp,
  'http2': cjsHttp2, 'node:http2': cjsHttp2,
  'https': cjsHttps, 'node:https': cjsHttps,
  'net': cjsNet, 'node:net': cjsNet,
  'os': cjsOs, 'node:os': cjsOs,
  'path': cjsPath, 'node:path': cjsPath,
  'process': cjsProcess, 'node:process': cjsProcess,
  'querystring': cjsQuerystring, 'node:querystring': cjsQuerystring,
  'stream': cjsStream, 'node:stream': cjsStream,
  'string_decoder': cjsStringDecoder, 'node:string_decoder': cjsStringDecoder,
  'tls': cjsTls, 'node:tls': cjsTls,
  'url': cjsUrl, 'node:url': cjsUrl,
  'util': cjsUtil, 'node:util': cjsUtil,
  'zlib': cjsZlib, 'node:zlib': cjsZlib,
  'tty': { isatty: () => false, ReadStream: class ReadStream {}, WriteStream: class WriteStream {} },
  'node:tty': { isatty: () => false, ReadStream: class ReadStream {}, WriteStream: class WriteStream {} },
  'supports-color': { stdout: false, stderr: false },
  '@aws-sdk/signature-v4-crt': {}
};

const require = (mod) => nodeModules[mod] || {};
`
      },
      alias: {
        'tty': path.resolve('src/shims/tty.js'),
        'node:tty': path.resolve('src/shims/tty.js'),
        'supports-color': path.resolve('src/shims/supports-color.js'),
        'assert': 'node:assert',
        'async_hooks': 'node:async_hooks',
        'buffer': 'node:buffer',
        'child_process': 'node:child_process',
        'crypto': 'node:crypto',
        'dns': 'node:dns',
        'events': 'node:events',
        'fs': 'node:fs',
        'fs/promises': 'node:fs/promises',
        'http': 'node:http',
        'http2': 'node:http2',
        'https': 'node:https',
        'net': 'node:net',
        'os': 'node:os',
        'path': 'node:path',
        'process': 'node:process',
        'querystring': 'node:querystring',
        'stream': 'node:stream',
        'string_decoder': 'node:string_decoder',
        'tls': 'node:tls',
        'url': 'node:url',
        'util': 'node:util',
        'zlib': 'node:zlib'
      },
      legalComments: 'none'
    });

    const stat = fs.statSync(outPath);
    console.log(`✅ Successfully bundled ${outPath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);

    // Also mirror _worker.js to public/ and root for maximum Pages preset compatibility
    fs.copyFileSync(outPath, path.join(publicDir, '_worker.js'));
    fs.copyFileSync(outPath, path.resolve('_worker.js'));
    console.log('✅ Mirrored _worker.js to public/ and root ./');
    console.log('🎉 Cloudflare Pages build completed successfully!');
  } catch (err) {
    console.error('❌ Cloudflare Pages worker bundling failed:', err);
    process.exit(1);
  }
})();

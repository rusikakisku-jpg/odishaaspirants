const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else if (file.endsWith('.ejs')) {
      results.push(fullPath);
    }
  });
  return results;
}

const viewsDir = path.resolve('views');
const allEjs = getFiles(viewsDir);

const templateSources = {};

allEjs.forEach(absPath => {
  const relPath = path.relative(viewsDir, absPath).replace(/\\/g, '/');
  const content = fs.readFileSync(absPath, 'utf-8');
  const t = new ejs.Template(content, { compileDebug: false, client: true });
  t.compile();

  templateSources[relPath] = t.source;
  templateSources['views/' + relPath] = t.source;
});

const outPath = path.resolve('src/views/templateEngine.js');

const fileContent = `// Pre-compiled template sources for Cloudflare Workers & Node.js
// All functions compiled ONCE during startup via allow_eval_during_startup
// ZERO eval() or new Function() during request handling!
const path = require('path');

function escapeFn(s) {
  if (s === undefined || s === null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const internalBypass = new Set([
  '__append', '__output', '__line', '__lines', '__filename', 'escapeFn', 'include', 'rethrow'
]);

function createSafeLocals(data) {
  if (!data || typeof data !== 'object') data = {};
  return new Proxy(data, {
    has(target, prop) {
      if (internalBypass.has(prop) || (typeof prop === 'string' && prop in globalThis)) {
        return prop in target;
      }
      return true;
    },
    get(target, prop) {
      if (prop === Symbol.unscopables) return undefined;
      return target[prop];
    }
  });
}

const templateSources = ${JSON.stringify(templateSources, null, 2)};
const compiledTemplates = {};

// Compile all templates once during startup
for (const key in templateSources) {
  try {
    compiledTemplates[key] = new Function('locals', 'escapeFn', 'include', templateSources[key]);
  } catch (err) {
    console.warn('Startup compile warning for ' + key + ':', err.message);
  }
}

function resolveTemplateKey(includePath, fromKey) {
  let rel = includePath;
  if (!rel.endsWith('.ejs')) rel += '.ejs';
  const baseDir = fromKey ? path.dirname(fromKey) : '';
  const target = path.normalize(path.join(baseDir, rel)).replace(/\\\\/g, '/');
  for (const k in compiledTemplates) {
    if (k === target || k.endsWith(target) || target.endsWith(k)) {
      return k;
    }
  }
  return null;
}

function templateEngine(filePath, options, callback) {
  try {
    const norm = filePath.replace(/\\\\/g, '/');
    let matchedKey = resolveTemplateKey(norm, '');
    if (!matchedKey || !compiledTemplates[matchedKey]) {
      const tryRel = Object.keys(compiledTemplates).find(k => norm.endsWith(k));
      if (tryRel) matchedKey = tryRel;
    }

    if (!matchedKey || !compiledTemplates[matchedKey]) {
      return callback(new Error('Template not found: ' + filePath));
    }

    function makeInclude(currentKey, parentData) {
      return function(incPath, incData) {
        const targetKey = resolveTemplateKey(incPath, currentKey);
        if (!targetKey || !compiledTemplates[targetKey]) {
          throw new Error('Include not found: ' + incPath + ' from ' + currentKey);
        }
        const merged = Object.assign({}, parentData, incData);
        return compiledTemplates[targetKey](createSafeLocals(merged), escapeFn, makeInclude(targetKey, merged));
      };
    }

    const safeOptions = createSafeLocals(options);
    const html = compiledTemplates[matchedKey](safeOptions, escapeFn, makeInclude(matchedKey, options));
    callback(null, html);
  } catch (err) {
    callback(err);
  }
}

module.exports = {
  templateEngine,
  compiledTemplates,
  resolveTemplateKey
};
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, fileContent, 'utf-8');
console.log('Successfully generated template sources for', Object.keys(templateSources).length / 2, 'templates into', outPath);

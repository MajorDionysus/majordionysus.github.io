import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const projectRoot = path.resolve(import.meta.dirname, '..');
const outputRoot = path.join(projectRoot, 'assets', 'images', 'optimized');
const manifestPath = path.join(outputRoot, 'manifest.json');
const sourcePrefix = 'https://mrj2026.today/images/';
const imagePattern = /https:\/\/mrj2026\.today\/images\/[^"'<>]+?\.(?:png|jpe?g|webp)/gi;
let previousImages = new Map();

function loadSharp() {
  try {
    return createRequire(import.meta.url)('sharp');
  } catch (localError) {
    const modulesPath = process.env.IMAGE_OPTIMIZER_MODULES;
    if (!modulesPath) {
      throw new Error('Install sharp or set IMAGE_OPTIMIZER_MODULES to a node_modules directory containing sharp.');
    }
    return createRequire(path.join(modulesPath, 'image-optimizer.cjs'))('sharp');
  }
}

const sharp = loadSharp();

async function collectTextFiles(target) {
  const stat = await fs.stat(target);
  if (stat.isFile()) return [target];

  const entries = await fs.readdir(target, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const fullPath = path.join(target, entry.name);
    if (entry.isDirectory()) return collectTextFiles(fullPath);
    return /\.(?:html|json)$/i.test(entry.name) ? [fullPath] : [];
  }));
  return nested.flat();
}

function outputPathFor(url) {
  const relativeUrl = decodeURIComponent(new URL(url).pathname.split('/images/')[1]);
  return path.join(outputRoot, relativeUrl.replace(/\.(?:png|jpe?g|webp)$/i, '.webp'));
}

function settingsFor(url) {
  if (/\/mei\.jpg$/i.test(url)) return { maxEdge: 720, quality: 82 };
  if (/\/cover\//i.test(url)) return { maxEdge: 1400, quality: 82 };
  if (/\/school\//i.test(url)) return { maxEdge: 640, quality: 82 };
  if (/\/News\//i.test(url)) return { maxEdge: 1600, quality: 79 };
  return { maxEdge: 1600, quality: 76 };
}

async function download(url) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function optimize(url) {
  const destination = outputPathFor(url);
  const previous = previousImages.get(url);
  if (previous) {
    try {
      await fs.access(destination);
      return { ...previous, reused: true };
    } catch (error) {
      // Regenerate missing output files.
    }
  }
  const { maxEdge, quality } = settingsFor(url);
  const input = await download(url);

  await fs.mkdir(path.dirname(destination), { recursive: true });
  const info = await sharp(input, { failOn: 'none', limitInputPixels: false })
    .rotate()
    .resize({ width: maxEdge, height: maxEdge, fit: 'inside', withoutEnlargement: true })
    .webp({ quality, effort: 5, smartSubsample: true })
    .toFile(destination);

  return {
    source: url,
    output: path.relative(projectRoot, destination).split(path.sep).join('/'),
    sourceBytes: input.length,
    outputBytes: info.size,
    width: info.width,
    height: info.height,
    quality
  };
}

const scanTargets = [
  path.join(projectRoot, 'index.html'),
  path.join(projectRoot, 'content'),
  path.join(projectRoot, 'data')
];
const files = (await Promise.all(scanTargets.map(collectTextFiles))).flat();
const urls = new Set();

for (const file of files) {
  const text = await fs.readFile(file, 'utf8');
  for (const match of text.matchAll(imagePattern)) urls.add(match[0]);
}

const queue = [...urls].sort();
const results = [];
const failures = [];

try {
  const previousManifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  previousImages = new Map((previousManifest.images || []).map((item) => [item.source, item]));
} catch (error) {
  previousImages = new Map();
}

async function worker() {
  while (queue.length) {
    const url = queue.shift();
    try {
      const result = await optimize(url);
      results.push(result);
      process.stdout.write(`optimized ${result.output}\n`);
    } catch (error) {
      failures.push({ source: url, error: error.message });
      process.stderr.write(`failed ${url}: ${error.message}\n`);
    }
  }
}

await fs.mkdir(outputRoot, { recursive: true });
await Promise.all(Array.from({ length: 4 }, worker));

results.sort((a, b) => a.source.localeCompare(b.source));
const sourceBytes = results.reduce((sum, item) => sum + item.sourceBytes, 0);
const outputBytes = results.reduce((sum, item) => sum + item.outputBytes, 0);
const manifest = {
  generatedAt: new Date().toISOString(),
  algorithm: 'sharp: auto-rotate → fit-inside resize → WebP quality 76–82 / effort 5 / metadata stripped',
  sourcePrefix,
  sourceBytes,
  outputBytes,
  savedPercent: sourceBytes ? Number(((1 - outputBytes / sourceBytes) * 100).toFixed(1)) : 0,
  images: results,
  failures
};

await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
process.stdout.write(`\n${results.length} images: ${sourceBytes} → ${outputBytes} bytes (${manifest.savedPercent}% saved)\n`);

if (failures.length) process.exitCode = 1;

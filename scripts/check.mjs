import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'package.json', 'AGENTS.md', 'CODEX.md',
  'apps/forge/server.mjs', 'apps/forge/public/index.html', 'apps/forge/public/app.js',
  'apps/forge/public/brand.css', 'apps/forge/public/icons/icon.svg',
  'apps/forge/public/icons/tong-buku-mark.svg', 'apps/forge/public/icons/tong-buku-lockup.svg',
  'apps/forge/lib/queue.mjs', 'apps/forge/lib/reconciler.mjs', 'apps/forge/lib/artifacts.mjs',
  'apps/forge/mcp-stdio.mjs', 'apps/pocket-android/app/src/main/AndroidManifest.xml',
  'apps/pocket-android/app/src/main/res/drawable/tong_buku_icon.xml',
  'docs/PRODUCT-SPEC.md', 'docs/IMPLEMENTATION-STATUS.md', 'docs/BRAND-TONG-BUKU.md',
];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing required file: ${file}`);
}

const index = fs.readFileSync(path.join(root, 'apps/forge/public/index.html'), 'utf8');
for (const marker of ['Tong Buku', 'Tong Buku Pocket', 'Tong Buku Forge', 'Tong Buku Make', 'Tong Buku Bridge']) {
  if (!index.includes(marker)) throw new Error(`Missing public brand marker: ${marker}`);
}
if (!index.includes('/brand.css') || !index.includes('/icons/tong-buku-lockup.svg')) {
  throw new Error('Tong Buku visual system is not wired into the live product.');
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'apps/forge/public/manifest.webmanifest'), 'utf8'));
if (manifest.name !== 'Tong Buku' || manifest.short_name !== 'Tong Buku') throw new Error('PWA manifest is not branded as Tong Buku.');

const codeFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['data', '.git', '.local', 'node_modules'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (['.mjs', '.js'].includes(path.extname(entry.name))) codeFiles.push(full);
  }
}
walk(root);
for (const file of codeFiles) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Syntax check failed for ${path.relative(root, file)}\n${result.stderr || result.stdout}`);
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.dependencies || packageJson.devDependencies) throw new Error('The reference build must remain zero-dependency unless the architecture is intentionally revised.');

console.log(`Check passed: ${required.length} required files, Tong Buku branding, and ${codeFiles.length} JavaScript modules.`);

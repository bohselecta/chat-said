import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'package.json', 'AGENTS.md', 'CODEX.md',
  'apps/forge/server.mjs', 'apps/forge/public/index.html', 'apps/forge/public/app.js',
  'apps/forge/lib/queue.mjs', 'apps/forge/lib/reconciler.mjs', 'apps/forge/lib/artifacts.mjs',
  'apps/forge/mcp-stdio.mjs', 'apps/pocket-android/app/src/main/AndroidManifest.xml',
  'docs/PRODUCT-SPEC.md', 'docs/IMPLEMENTATION-STATUS.md',
];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing required file: ${file}`);
}

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

console.log(`Check passed: ${required.length} required files and ${codeFiles.length} JavaScript modules.`);

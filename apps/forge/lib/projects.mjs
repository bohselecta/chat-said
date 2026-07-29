import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { id, slugify, nowIso, ensureDir, writeJsonAtomic, writeTextAtomic, uniqueStrings } from './utils.mjs';
import { audit } from './db.mjs';

export const SPEC_SECTIONS = [
  ['vision', 'Vision'],
  ['users', 'Users'],
  ['principles', 'Principles'],
  ['capabilities', 'Capabilities'],
  ['workflows', 'Workflows'],
  ['interfaces', 'Interfaces'],
  ['data', 'Data & Memory'],
  ['integrations', 'Integrations'],
  ['privacy', 'Privacy & Trust'],
  ['constraints', 'Constraints'],
  ['openQuestions', 'Open Questions'],
];

export function blankSpec(project) {
  return {
    schemaVersion: 1,
    projectId: project.id,
    projectName: project.name,
    description: project.description || '',
    vision: project.description ? [project.description] : [],
    users: [],
    principles: [
      'Preserve the user’s original meaning and source notes.',
      'Process queued ideas one at a time and create a revision after every applied note.',
      'Build only from the latest canonical specification.',
    ],
    capabilities: [],
    workflows: [],
    interfaces: [],
    data: [],
    integrations: [],
    privacy: ['Local-first by default; external model access must be explicitly configured.'],
    constraints: [],
    openQuestions: [],
    sourceNotes: [],
    updatedAt: nowIso(),
  };
}

export function normalizeSpec(spec, project) {
  const base = blankSpec(project);
  const normalized = { ...base, ...(spec || {}) };
  for (const [key] of SPEC_SECTIONS) normalized[key] = uniqueStrings(normalized[key] || []);
  normalized.sourceNotes = Array.isArray(normalized.sourceNotes)
    ? normalized.sourceNotes.slice(-500).map((note) => ({
        noteId: String(note.noteId || ''),
        sequence: Number(note.sequence || 0),
        text: String(note.text || ''),
        createdAt: String(note.createdAt || nowIso()),
      }))
    : [];
  normalized.projectId = project.id;
  normalized.projectName = project.name;
  normalized.description = project.description || normalized.description || '';
  normalized.updatedAt = nowIso();
  return normalized;
}

export function specToMarkdown(spec) {
  const lines = [
    `# ${spec.projectName}`,
    '',
    '> Canonical project specification maintained by ChatSaid / Taurus Forge.',
    '> Each queued note is reconciled independently and recorded as a revision.',
    '',
  ];
  if (spec.description) lines.push(spec.description, '');
  for (const [key, title] of SPEC_SECTIONS) {
    lines.push(`## ${title}`, '');
    const values = spec[key] || [];
    if (!values.length) lines.push('_Not specified yet._');
    else for (const value of values) lines.push(`- ${value}`);
    lines.push('');
  }
  lines.push('## Source Note Ledger', '');
  if (!spec.sourceNotes?.length) lines.push('_No notes have been applied yet._');
  else {
    for (const note of spec.sourceNotes.slice(-100)) {
      lines.push(`### Note ${note.sequence || '?'} — ${note.createdAt}`, '', note.text, '');
    }
  }
  return `${lines.join('\n').trim()}\n`;
}

export function projectRoot(dataDir, project) {
  return path.join(dataDir, 'projects', project.slug);
}

export function createProjectFiles(dataDir, project, spec = blankSpec(project)) {
  const root = projectRoot(dataDir, project);
  const dirs = [
    'recordings', 'transcripts', 'clips', 'notes', 'artifacts', 'revisions', 'agent-output',
  ];
  ensureDir(root);
  for (const dir of dirs) ensureDir(path.join(root, dir));
  writeJsonAtomic(path.join(root, 'project.json'), {
    id: project.id,
    slug: project.slug,
    name: project.name,
    description: project.description,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    canonicalSpec: 'TAURUS.md',
    machineSpec: 'spec.json',
    folders: {
      recordings: 'recordings/', transcripts: 'transcripts/', clips: 'clips/', notes: 'notes/',
      artifacts: 'artifacts/', revisions: 'revisions/', agentOutput: 'agent-output/',
    },
  });
  writeJsonAtomic(path.join(root, 'spec.json'), spec);
  writeTextAtomic(path.join(root, 'TAURUS.md'), specToMarkdown(spec));
  writeTextAtomic(path.join(root, 'AGENTS.md'), `# Agent Instructions — ${project.name}\n\n1. Read \`TAURUS.md\` before acting.\n2. Treat \`spec.json\` as machine-readable canonical state.\n3. Preserve original recordings, transcripts, notes, and revisions.\n4. Write generated work to \`agent-output/\` unless the user explicitly requests another destination.\n5. Do not modify the canonical spec directly while Taurus Forge is running; submit a project note through the local API instead.\n`);
  return root;
}

export function createProject({ db, dataDir }, { name, description = '', quiescenceMinutes = 15 }) {
  const now = nowIso();
  const project = {
    id: id('prj'),
    slug: slugify(name),
    name: String(name || '').trim(),
    description: String(description || '').trim(),
    artifact_mode: 'auto',
    auto_build: 1,
    quiescence_minutes: Math.max(1, Math.min(1440, Number(quiescenceMinutes) || 15)),
    created_at: now,
    updated_at: now,
    last_activity_at: now,
  };
  if (!project.name) throw new Error('Project name is required');
  let slug = project.slug;
  let suffix = 2;
  while (db.prepare('SELECT 1 FROM projects WHERE slug = ?').get(slug)) slug = `${project.slug}-${suffix++}`;
  project.slug = slug;
  db.prepare(`INSERT INTO projects(id, slug, name, description, artifact_mode, auto_build, quiescence_minutes, created_at, updated_at, last_activity_at)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(project.id, project.slug, project.name, project.description, project.artifact_mode, project.auto_build,
      project.quiescence_minutes, project.created_at, project.updated_at, project.last_activity_at);
  const spec = blankSpec(project);
  createProjectFiles(dataDir, project, spec);
  saveRevision({ db, dataDir }, project, spec, {
    noteId: null,
    changeSummary: 'Project created.',
    version: 0,
  });
  audit(db, 'project.created', { name: project.name, slug: project.slug }, project.id);
  return getProject({ db, dataDir }, project.id);
}

export function listProjects({ db }) {
  return db.prepare(`
    SELECT p.*,
      (SELECT COUNT(*) FROM notes n WHERE n.project_id = p.id AND n.status IN ('queued','processing','awaiting_transcript')) AS queue_count,
      (SELECT MAX(version) FROM revisions r WHERE r.project_id = p.id) AS revision_version,
      (SELECT MAX(version) FROM artifacts a WHERE a.project_id = p.id) AS artifact_version
    FROM projects p ORDER BY p.updated_at DESC
  `).all();
}

export function findProject({ db }, identifier) {
  return db.prepare('SELECT * FROM projects WHERE id = ? OR slug = ?').get(identifier, identifier) || null;
}

export function getProject(ctx, identifier) {
  const project = findProject(ctx, identifier);
  if (!project) return null;
  const latestRevision = ctx.db.prepare('SELECT * FROM revisions WHERE project_id = ? ORDER BY version DESC LIMIT 1').get(project.id);
  const latestArtifact = ctx.db.prepare('SELECT * FROM artifacts WHERE project_id = ? ORDER BY version DESC LIMIT 1').get(project.id);
  return {
    ...project,
    rootPath: projectRoot(ctx.dataDir, project),
    spec: latestRevision ? JSON.parse(latestRevision.spec_json) : blankSpec(project),
    specMarkdown: latestRevision?.spec_md || '',
    revisionVersion: latestRevision?.version ?? 0,
    latestArtifact: latestArtifact ? { ...latestArtifact, manifest: JSON.parse(latestArtifact.manifest_json) } : null,
  };
}

export function saveRevision(ctx, project, specInput, { noteId = null, changeSummary = '', version = null } = {}) {
  const spec = normalizeSpec(specInput, project);
  const current = ctx.db.prepare('SELECT COALESCE(MAX(version), -1) AS version FROM revisions WHERE project_id = ?').get(project.id);
  const nextVersion = version ?? Number(current.version) + 1;
  const markdown = specToMarkdown(spec);
  const revisionId = id('rev');
  const createdAt = nowIso();
  ctx.db.prepare(`INSERT INTO revisions(id, project_id, version, note_id, spec_json, spec_md, change_summary, created_at)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(revisionId, project.id, nextVersion, noteId, JSON.stringify(spec), markdown, changeSummary, createdAt);
  const root = projectRoot(ctx.dataDir, project);
  writeJsonAtomic(path.join(root, 'spec.json'), spec);
  writeTextAtomic(path.join(root, 'TAURUS.md'), markdown);
  const stamp = String(nextVersion).padStart(4, '0');
  writeJsonAtomic(path.join(root, 'revisions', `${stamp}-spec.json`), spec);
  writeTextAtomic(path.join(root, 'revisions', `${stamp}-TAURUS.md`), markdown);
  writeJsonAtomic(path.join(root, 'revisions', `${stamp}-change.json`), {
    revisionId, version: nextVersion, noteId, changeSummary, createdAt,
  });
  ctx.db.prepare('UPDATE projects SET updated_at = ?, last_activity_at = ? WHERE id = ?').run(createdAt, createdAt, project.id);
  audit(ctx.db, 'spec.revised', { version: nextVersion, noteId, changeSummary }, project.id);
  return { id: revisionId, version: nextVersion, spec, markdown, changeSummary, createdAt };
}

export function saveManualSpec(ctx, project, markdown) {
  const current = getProject(ctx, project.id);
  const spec = current.spec;
  spec.openQuestions = uniqueStrings([...(spec.openQuestions || []), 'The canonical Markdown was manually edited; structured fields may require reconciliation.']);
  spec.manualMarkdown = String(markdown);
  const revision = saveRevision(ctx, project, spec, { changeSummary: 'Canonical specification manually edited.' });
  const root = projectRoot(ctx.dataDir, project);
  writeTextAtomic(path.join(root, 'TAURUS.md'), String(markdown).trimEnd() + '\n');
  ctx.db.prepare('UPDATE revisions SET spec_md = ? WHERE id = ?').run(String(markdown).trimEnd() + '\n', revision.id);
  return { ...revision, markdown: String(markdown).trimEnd() + '\n' };
}

export function listRevisions({ db }, projectId, limit = 50) {
  return db.prepare(`SELECT id, project_id, version, note_id, change_summary, created_at
    FROM revisions WHERE project_id = ? ORDER BY version DESC LIMIT ?`).all(projectId, Number(limit));
}

export function exportProjectZip(ctx, project) {
  const root = projectRoot(ctx.dataDir, project);
  const exportDir = ensureDir(path.join(ctx.dataDir, 'exports'));
  const output = path.join(exportDir, `${project.slug}-${Date.now()}.zip`);
  const result = spawnSync('zip', ['-qr', output, path.basename(root)], {
    cwd: path.dirname(root), encoding: 'utf8', timeout: 120000,
  });
  if (result.status !== 0) throw new Error(`Project export failed: ${result.stderr || result.stdout}`);
  audit(ctx.db, 'project.exported', { output }, project.id);
  return output;
}

export function updateProjectSettings(ctx, project, changes = {}) {
  const allowed = {
    name: changes.name != null ? String(changes.name).trim() : project.name,
    description: changes.description != null ? String(changes.description).trim() : project.description,
    auto_build: changes.autoBuild == null ? project.auto_build : (changes.autoBuild ? 1 : 0),
    quiescence_minutes: changes.quiescenceMinutes == null
      ? project.quiescence_minutes
      : Math.max(1, Math.min(1440, Number(changes.quiescenceMinutes) || 15)),
  };
  if (!allowed.name) throw new Error('Project name is required');
  ctx.db.prepare('UPDATE projects SET name = ?, description = ?, auto_build = ?, quiescence_minutes = ?, updated_at = ? WHERE id = ?')
    .run(allowed.name, allowed.description, allowed.auto_build, allowed.quiescence_minutes, nowIso(), project.id);
  const updated = findProject(ctx, project.id);
  const current = getProject(ctx, project.id);
  current.spec.projectName = updated.name;
  current.spec.description = updated.description;
  createProjectFiles(ctx.dataDir, updated, current.spec);
  audit(ctx.db, 'project.settings.updated', allowed, project.id);
  return getProject(ctx, project.id);
}

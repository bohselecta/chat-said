import fs from 'node:fs';
import path from 'node:path';
import { listProjects, getProject, findProject, projectRoot } from './projects.mjs';
import { listNotes } from './queue.mjs';
import { id, nowIso, ensureDir, writeTextAtomic } from './utils.mjs';
import { audit } from './db.mjs';

const TOOLS = [
  {
    name: 'list_projects',
    description: 'List ChatSaid/Taurus projects available on this local node.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_project',
    description: 'Read a project manifest, current canonical specification, paths, and artifact state.',
    inputSchema: {
      type: 'object', required: ['project'], additionalProperties: false,
      properties: { project: { type: 'string', description: 'Project id or slug.' } },
    },
  },
  {
    name: 'get_spec',
    description: 'Read the canonical TAURUS.md specification for one project.',
    inputSchema: {
      type: 'object', required: ['project'], additionalProperties: false,
      properties: { project: { type: 'string' } },
    },
  },
  {
    name: 'list_recent_notes',
    description: 'List recent sequential voice/text notes and processing status for a project.',
    inputSchema: {
      type: 'object', required: ['project'], additionalProperties: false,
      properties: { project: { type: 'string' }, limit: { type: 'integer', minimum: 1, maximum: 200 } },
    },
  },
  {
    name: 'search_project',
    description: 'Search readable project files for a phrase. Original audio is never returned.',
    inputSchema: {
      type: 'object', required: ['project', 'query'], additionalProperties: false,
      properties: { project: { type: 'string' }, query: { type: 'string' }, limit: { type: 'integer', minimum: 1, maximum: 50 } },
    },
  },
  {
    name: 'save_agent_output',
    description: 'Save an agent-authored Markdown file under agent-output/. Disabled unless TAURUS_AGENT_WRITE=1.',
    inputSchema: {
      type: 'object', required: ['project', 'filename', 'content'], additionalProperties: false,
      properties: { project: { type: 'string' }, filename: { type: 'string' }, content: { type: 'string' } },
    },
  },
];

function content(value) {
  const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  return { content: [{ type: 'text', text }] };
}

function safeFilename(name) {
  const cleaned = String(name || 'agent-output.md').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^[-.]+/, '').slice(0, 120);
  return cleaned.endsWith('.md') ? cleaned : `${cleaned}.md`;
}

function searchableFiles(root) {
  const allowed = new Set(['.md', '.txt', '.json', '.html', '.css', '.js', '.mjs', '.ts', '.tsx']);
  const excluded = new Set(['recordings', '.git', 'node_modules']);
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (excluded.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (allowed.has(path.extname(entry.name).toLowerCase()) && fs.statSync(full).size < 2_000_000) files.push(full);
      if (files.length > 1000) return;
    }
  };
  walk(root);
  return files;
}

export async function callTool(ctx, name, args = {}) {
  if (name === 'list_projects') {
    return content(listProjects(ctx).map((p) => ({ id: p.id, slug: p.slug, name: p.name, updatedAt: p.updated_at, revisionVersion: p.revision_version, artifactVersion: p.artifact_version })));
  }
  const project = findProject(ctx, args.project);
  if (!project) throw new Error('Project not found');

  if (name === 'get_project') {
    const full = getProject(ctx, project.id);
    return content({
      id: full.id, slug: full.slug, name: full.name, description: full.description,
      rootPath: full.rootPath, revisionVersion: full.revisionVersion,
      artifact: full.latestArtifact ? { version: full.latestArtifact.version, manifest: full.latestArtifact.manifest } : null,
      spec: full.spec,
    });
  }
  if (name === 'get_spec') return content(getProject(ctx, project.id).specMarkdown);
  if (name === 'list_recent_notes') {
    return content(listNotes(ctx, project.id, Math.min(200, Number(args.limit) || 30)).map((n) => ({ sequence: n.sequence, status: n.status, transcript: n.transcript, createdAt: n.created_at, appliedAt: n.applied_at, error: n.error })));
  }
  if (name === 'search_project') {
    const query = String(args.query || '').trim().toLowerCase();
    if (!query) throw new Error('Search query is required');
    const limit = Math.min(50, Number(args.limit) || 20);
    const root = projectRoot(ctx.dataDir, project);
    const matches = [];
    for (const file of searchableFiles(root)) {
      const raw = fs.readFileSync(file, 'utf8');
      const lower = raw.toLowerCase();
      let index = lower.indexOf(query);
      if (index === -1) continue;
      while (index !== -1 && matches.length < limit) {
        matches.push({
          file: path.relative(root, file),
          excerpt: raw.slice(Math.max(0, index - 160), Math.min(raw.length, index + query.length + 220)).replace(/\s+/g, ' '),
        });
        index = lower.indexOf(query, index + query.length);
      }
      if (matches.length >= limit) break;
    }
    return content(matches);
  }
  if (name === 'save_agent_output') {
    if (!ctx.config.agentWrite) throw new Error('Agent writes are disabled. Set TAURUS_AGENT_WRITE=1 to enable them.');
    const filename = safeFilename(args.filename);
    const root = projectRoot(ctx.dataDir, project);
    const target = path.join(root, 'agent-output', filename);
    ensureDir(path.dirname(target));
    writeTextAtomic(target, String(args.content || '').trimEnd() + '\n');
    const outputId = id('agent');
    ctx.db.prepare('INSERT INTO agent_outputs(id, project_id, filename, content, created_at) VALUES(?, ?, ?, ?, ?)')
      .run(outputId, project.id, filename, String(args.content || ''), nowIso());
    audit(ctx.db, 'agent.output.saved', { outputId, filename }, project.id);
    return content({ saved: true, path: target, id: outputId });
  }
  throw new Error(`Unknown tool: ${name}`);
}

export async function handleMcpRequest(ctx, request) {
  const idValue = request?.id ?? null;
  try {
    if (request?.method === 'initialize') {
      return {
        jsonrpc: '2.0', id: idValue,
        result: {
          protocolVersion: request?.params?.protocolVersion || '2025-03-26',
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: 'chatsaid-taurus', version: '0.1.0' },
        },
      };
    }
    if (request?.method === 'notifications/initialized') return null;
    if (request?.method === 'tools/list') return { jsonrpc: '2.0', id: idValue, result: { tools: TOOLS } };
    if (request?.method === 'tools/call') {
      const result = await callTool(ctx, request.params?.name, request.params?.arguments || {});
      return { jsonrpc: '2.0', id: idValue, result };
    }
    if (request?.method === 'ping') return { jsonrpc: '2.0', id: idValue, result: {} };
    return { jsonrpc: '2.0', id: idValue, error: { code: -32601, message: `Method not found: ${request?.method}` } };
  } catch (error) {
    return { jsonrpc: '2.0', id: idValue, error: { code: -32000, message: error.message } };
  }
}

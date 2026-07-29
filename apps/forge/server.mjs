import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { openDatabase, issueToken, validateToken, audit } from './lib/db.mjs';
import {
  json, text, readJsonBody, getCookie, bearerToken, mimeFromPath, parseRoute,
  nowIso, ensureDir,
} from './lib/utils.mjs';
import {
  createProject, listProjects, getProject, findProject, listRevisions, saveManualSpec,
  exportProjectZip, updateProjectSettings, projectRoot,
} from './lib/projects.mjs';
import { enqueueNote, listNotes, listQueue, createQueueWorker } from './lib/queue.mjs';
import { buildArtifact, listArtifacts } from './lib/artifacts.mjs';
import { handleMcpRequest } from './lib/mcp.mjs';
import { sendWakeOnLan } from './lib/wol.mjs';
import { startDiscovery } from './lib/discovery.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'public');

export function configFromEnv(overrides = {}) {
  const repositoryRoot = path.resolve(__dirname, '../..');
  return {
    port: Number(process.env.PORT || process.env.TAURUS_PORT || 7847),
    host: process.env.TAURUS_HOST || '0.0.0.0',
    dataDir: path.resolve(process.env.TAURUS_DATA_DIR || path.join(repositoryRoot, 'data')),
    workerIntervalMs: Number(process.env.TAURUS_WORKER_INTERVAL_MS || 500),
    autoBuildIntervalMs: Number(process.env.TAURUS_AUTOBUILD_INTERVAL_MS || 5000),
    quiescenceOverrideMs: process.env.TAURUS_QUIESCENCE_MS ? Number(process.env.TAURUS_QUIESCENCE_MS) : null,
    llmUrl: process.env.TAURUS_LLM_URL || '',
    llmModel: process.env.TAURUS_LLM_MODEL || '',
    llmApiKey: process.env.TAURUS_LLM_API_KEY || '',
    llmTimeoutMs: Number(process.env.TAURUS_LLM_TIMEOUT_MS || 120000),
    useLlmArtifacts: process.env.TAURUS_USE_LLM_ARTIFACTS === '1',
    whisperCommand: process.env.TAURUS_WHISPER_COMMAND || '',
    agentWrite: process.env.TAURUS_AGENT_WRITE === '1',
    quiet: false,
    ...overrides,
  };
}

function networkUrls(port) {
  const urls = [`http://localhost:${port}`];
  const interfaces = os.networkInterfaces();
  for (const entries of Object.values(interfaces)) {
    for (const entry of entries || []) {
      if (entry.family === 'IPv4' && !entry.internal) urls.push(`http://${entry.address}:${port}`);
    }
  }
  return [...new Set(urls)];
}

function tokenFromRequest(req) {
  return bearerToken(req) || getCookie(req, 'taurus_token');
}

function setTokenCookie(token) {
  return `taurus_token=${encodeURIComponent(token)}; Path=/; SameSite=Strict; Max-Age=31536000`;
}

function requireAuth(ctx, req, res) {
  if (validateToken(ctx.db, tokenFromRequest(req))) return true;
  json(res, 401, { error: 'Pair this device with Taurus Forge first.' });
  return false;
}

function serveFile(res, file, headers = {}) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return false;
  const stat = fs.statSync(file);
  res.writeHead(200, {
    'content-type': mimeFromPath(file),
    'content-length': stat.size,
    'cache-control': file.endsWith('index.html') ? 'no-store' : 'public, max-age=3600',
    ...headers,
  });
  fs.createReadStream(file).pipe(res);
  return true;
}

function publicProject(project) {
  if (!project) return null;
  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    description: project.description,
    artifactMode: project.artifact_mode,
    autoBuild: Boolean(project.auto_build),
    buildRequested: Boolean(project.build_requested),
    quiescenceMinutes: project.quiescence_minutes,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    lastActivityAt: project.last_activity_at,
    rootPath: project.rootPath,
    spec: project.spec,
    specMarkdown: project.specMarkdown,
    revisionVersion: project.revisionVersion,
    latestArtifact: project.latestArtifact,
  };
}

function saveClip(ctx, project, payload) {
  const clipId = `clip_${crypto.randomUUID()}`;
  const createdAt = nowIso();
  const clip = {
    id: clipId,
    project_id: project.id,
    title: String(payload.title || 'Saved clip').trim().slice(0, 200) || 'Saved clip',
    text: String(payload.text || '').trim(),
    source_note_id: payload.sourceNoteId || null,
    created_at: createdAt,
    updated_at: createdAt,
  };
  if (!clip.text) throw new Error('Clip text is required');
  ctx.db.prepare('INSERT INTO clips(id, project_id, title, text, source_note_id, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?)')
    .run(clip.id, clip.project_id, clip.title, clip.text, clip.source_note_id, clip.created_at, clip.updated_at);
  const root = projectRoot(ctx.dataDir, project);
  const filename = `${createdAt.replace(/[:.]/g, '-')}-${clip.id}.md`;
  fs.writeFileSync(path.join(root, 'clips', filename), `# ${clip.title}\n\n${clip.text}\n`, 'utf8');
  audit(ctx.db, 'clip.saved', { clipId: clip.id, title: clip.title }, project.id);
  return clip;
}

async function handleApi(ctx, req, res, url) {
  const { pathname } = url;
  if (pathname === '/api/status' && req.method === 'GET') {
    const authorized = validateToken(ctx.db, tokenFromRequest(req));
    return json(res, 200, {
      name: 'ChatSaid / Taurus Forge',
      version: '0.1.0',
      authorized,
      requiresPairing: !authorized,
      urls: ctx.urls,
      localHostname: os.hostname(),
      llmConfigured: Boolean(ctx.config.llmUrl && ctx.config.llmModel),
      localTranscriptionConfigured: Boolean(ctx.config.whisperCommand),
      time: nowIso(),
    });
  }

  if (pathname === '/api/pair' && req.method === 'POST') {
    const payload = await readJsonBody(req);
    if (String(payload.code || '') !== String(ctx.database.getSetting('pairing_code'))) {
      audit(ctx.db, 'pairing.failed', { label: payload.label || 'unknown' });
      return json(res, 403, { error: 'Pairing code is incorrect.' });
    }
    const token = issueToken(ctx.db, payload.label || req.socket.remoteAddress || 'paired device');
    audit(ctx.db, 'pairing.succeeded', { label: payload.label || 'paired device' });
    return json(res, 200, { token }, { 'set-cookie': setTokenCookie(token) });
  }

  if (!requireAuth(ctx, req, res)) return;

  if (pathname === '/api/settings/runtime' && req.method === 'GET') {
    return json(res, 200, {
      llmUrl: ctx.config.llmUrl,
      llmModel: ctx.config.llmModel,
      llmApiKeyConfigured: Boolean(ctx.config.llmApiKey),
      useLlmArtifacts: Boolean(ctx.config.useLlmArtifacts),
      whisperCommand: ctx.config.whisperCommand,
      agentWrite: Boolean(ctx.config.agentWrite),
    });
  }
  if (pathname === '/api/settings/runtime' && req.method === 'PUT') {
    const payload = await readJsonBody(req);
    if (payload.llmUrl !== undefined) { ctx.config.llmUrl = String(payload.llmUrl).trim(); ctx.database.setSetting('llm_url', ctx.config.llmUrl); }
    if (payload.llmModel !== undefined) { ctx.config.llmModel = String(payload.llmModel).trim(); ctx.database.setSetting('llm_model', ctx.config.llmModel); }
    if (payload.llmApiKey !== undefined && String(payload.llmApiKey) !== '••••••••') { ctx.config.llmApiKey = String(payload.llmApiKey); ctx.database.setSetting('llm_api_key', ctx.config.llmApiKey); }
    if (payload.useLlmArtifacts !== undefined) { ctx.config.useLlmArtifacts = Boolean(payload.useLlmArtifacts); ctx.database.setSetting('use_llm_artifacts', ctx.config.useLlmArtifacts ? '1' : '0'); }
    if (payload.whisperCommand !== undefined) { ctx.config.whisperCommand = String(payload.whisperCommand).trim(); ctx.database.setSetting('whisper_command', ctx.config.whisperCommand); }
    audit(ctx.db, 'runtime.settings.updated', { llmConfigured: Boolean(ctx.config.llmUrl && ctx.config.llmModel), whisperConfigured: Boolean(ctx.config.whisperCommand), useLlmArtifacts: ctx.config.useLlmArtifacts });
    return json(res, 200, { saved: true, llmConfigured: Boolean(ctx.config.llmUrl && ctx.config.llmModel), localTranscriptionConfigured: Boolean(ctx.config.whisperCommand) });
  }

  if (pathname === '/api/bootstrap' && req.method === 'GET') {
    return json(res, 200, {
      server: {
        name: 'ChatSaid / Taurus Forge', version: '0.1.0', urls: ctx.urls,
        dataDir: ctx.dataDir, hostname: os.hostname(),
        llmConfigured: Boolean(ctx.config.llmUrl && ctx.config.llmModel),
        localTranscriptionConfigured: Boolean(ctx.config.whisperCommand),
        agentWrite: ctx.config.agentWrite,
      },
      projects: listProjects(ctx),
    });
  }

  if (pathname === '/api/projects' && req.method === 'GET') return json(res, 200, listProjects(ctx));
  if (pathname === '/api/projects' && req.method === 'POST') {
    const payload = await readJsonBody(req);
    const project = createProject(ctx, payload);
    return json(res, 201, publicProject(project));
  }

  let params = parseRoute('/api/projects/:id', pathname);
  if (params && req.method === 'GET') {
    const project = getProject(ctx, params.id);
    return project ? json(res, 200, publicProject(project)) : json(res, 404, { error: 'Project not found' });
  }
  if (params && req.method === 'PATCH') {
    const project = findProject(ctx, params.id);
    if (!project) return json(res, 404, { error: 'Project not found' });
    const updated = updateProjectSettings(ctx, project, await readJsonBody(req));
    return json(res, 200, publicProject(updated));
  }

  params = parseRoute('/api/projects/:id/notes', pathname);
  if (params && req.method === 'GET') {
    const project = findProject(ctx, params.id);
    return project ? json(res, 200, listNotes(ctx, project.id)) : json(res, 404, { error: 'Project not found' });
  }
  if (params && req.method === 'POST') {
    const payload = await readJsonBody(req, 80 * 1024 * 1024);
    return json(res, 202, enqueueNote(ctx, params.id, payload));
  }

  params = parseRoute('/api/projects/:id/queue', pathname);
  if (params && req.method === 'GET') {
    const project = findProject(ctx, params.id);
    return project ? json(res, 200, listQueue(ctx, project.id)) : json(res, 404, { error: 'Project not found' });
  }

  params = parseRoute('/api/projects/:id/spec', pathname);
  if (params && req.method === 'GET') {
    const project = getProject(ctx, params.id);
    return project ? json(res, 200, { version: project.revisionVersion, spec: project.spec, markdown: project.specMarkdown }) : json(res, 404, { error: 'Project not found' });
  }
  if (params && req.method === 'PUT') {
    const project = findProject(ctx, params.id);
    if (!project) return json(res, 404, { error: 'Project not found' });
    const payload = await readJsonBody(req);
    const revision = saveManualSpec(ctx, project, payload.markdown || '');
    return json(res, 200, revision);
  }

  params = parseRoute('/api/projects/:id/revisions', pathname);
  if (params && req.method === 'GET') {
    const project = findProject(ctx, params.id);
    return project ? json(res, 200, listRevisions(ctx, project.id)) : json(res, 404, { error: 'Project not found' });
  }

  params = parseRoute('/api/projects/:id/build', pathname);
  if (params && req.method === 'POST') {
    const project = findProject(ctx, params.id);
    if (!project) return json(res, 404, { error: 'Project not found' });
    const pending = ctx.db.prepare("SELECT COUNT(*) AS count FROM notes WHERE project_id = ? AND status IN ('awaiting_transcript','queued','processing')").get(project.id);
    if (Number(pending.count) > 0) {
      ctx.db.prepare('UPDATE projects SET build_requested = 1 WHERE id = ?').run(project.id);
      audit(ctx.db, 'artifact.build.requested', { pending: Number(pending.count) }, project.id);
      return json(res, 202, { scheduled: true, pending: Number(pending.count), message: 'Make is scheduled and will run after the queue is clear.' });
    }
    const artifact = await buildArtifact(ctx, params.id, 'manual');
    return json(res, 201, artifact);
  }

  params = parseRoute('/api/projects/:id/artifacts', pathname);
  if (params && req.method === 'GET') {
    const project = findProject(ctx, params.id);
    return project ? json(res, 200, listArtifacts(ctx, project.id)) : json(res, 404, { error: 'Project not found' });
  }

  params = parseRoute('/api/projects/:id/artifact-state', pathname);
  if (params && req.method === 'GET') {
    const project = findProject(ctx, params.id);
    if (!project) return json(res, 404, { error: 'Project not found' });
    const row = ctx.db.prepare('SELECT state_json FROM artifact_state WHERE project_id = ?').get(project.id);
    return json(res, 200, row ? JSON.parse(row.state_json) : {});
  }
  if (params && req.method === 'PUT') {
    const project = findProject(ctx, params.id);
    if (!project) return json(res, 404, { error: 'Project not found' });
    const state = await readJsonBody(req);
    ctx.db.prepare(`INSERT INTO artifact_state(project_id, state_json, updated_at) VALUES(?, ?, ?)
      ON CONFLICT(project_id) DO UPDATE SET state_json = excluded.state_json, updated_at = excluded.updated_at`)
      .run(project.id, JSON.stringify(state), nowIso());
    return json(res, 200, { saved: true });
  }

  params = parseRoute('/api/projects/:id/clips', pathname);
  if (params && req.method === 'GET') {
    const project = findProject(ctx, params.id);
    return project ? json(res, 200, ctx.db.prepare('SELECT * FROM clips WHERE project_id = ? ORDER BY created_at DESC').all(project.id)) : json(res, 404, { error: 'Project not found' });
  }
  if (params && req.method === 'POST') {
    const project = findProject(ctx, params.id);
    if (!project) return json(res, 404, { error: 'Project not found' });
    return json(res, 201, saveClip(ctx, project, await readJsonBody(req)));
  }

  params = parseRoute('/api/projects/:id/export', pathname);
  if (params && req.method === 'GET') {
    const project = findProject(ctx, params.id);
    if (!project) return json(res, 404, { error: 'Project not found' });
    const file = exportProjectZip(ctx, project);
    return serveFile(res, file, { 'content-disposition': `attachment; filename="${path.basename(file)}"` });
  }

  params = parseRoute('/api/projects/:id/agent-handoff', pathname);
  if (params && req.method === 'GET') {
    const project = getProject(ctx, params.id);
    if (!project) return json(res, 404, { error: 'Project not found' });
    const base = ctx.urls[0];
    return json(res, 200, {
      project: project.name,
      slug: project.slug,
      localPath: project.rootPath,
      specPath: path.join(project.rootPath, 'TAURUS.md'),
      projectUrl: `${base}/?project=${encodeURIComponent(project.id)}`,
      artifactUrl: `${base}/artifact/${encodeURIComponent(project.id)}/current`,
      apiUrl: `${base}/api/projects/${encodeURIComponent(project.id)}`,
      mcpUrl: `${base}/mcp`,
      cursorConfig: {
        mcpServers: {
          'chatsaid-taurus': {
            command: 'node',
            args: [path.join(__dirname, 'mcp-stdio.mjs')],
            env: { TAURUS_DATA_DIR: ctx.dataDir },
          },
        },
      },
      instruction: `Read ${path.join(project.rootPath, 'TAURUS.md')} first. Treat it as canonical. Preserve source files and write generated work to ${path.join(project.rootPath, 'agent-output')}.`,
    });
  }

  if (pathname === '/api/wake' && req.method === 'POST') {
    const payload = await readJsonBody(req);
    const result = await sendWakeOnLan(payload.mac, { address: payload.address, port: payload.port });
    audit(ctx.db, 'network.wake.sent', result);
    return json(res, 200, result);
  }

  if (pathname === '/mcp' && req.method === 'POST') {
    const request = await readJsonBody(req);
    const response = await handleMcpRequest(ctx, request);
    if (response == null) return json(res, 202, {});
    return json(res, 200, response, { 'mcp-protocol-version': request?.params?.protocolVersion || '2025-03-26' });
  }

  return json(res, 404, { error: 'API route not found' });
}

export async function createServerApp(overrides = {}) {
  const config = configFromEnv(overrides);
  ensureDir(config.dataDir);
  const database = openDatabase(config.dataDir);
  config.llmUrl = config.llmUrl || database.getSetting('llm_url', '');
  config.llmModel = config.llmModel || database.getSetting('llm_model', '');
  config.llmApiKey = config.llmApiKey || database.getSetting('llm_api_key', '');
  config.useLlmArtifacts = config.useLlmArtifacts || database.getSetting('use_llm_artifacts', '0') === '1';
  config.whisperCommand = config.whisperCommand || database.getSetting('whisper_command', '');
  const ctx = {
    config,
    database,
    db: database.db,
    dataDir: config.dataDir,
    urls: [],
  };
  const worker = createQueueWorker(ctx);
  let discovery = null;

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    try {
      if (url.pathname.startsWith('/api/') || url.pathname === '/mcp') return await handleApi(ctx, req, res, url);

      let params = parseRoute('/artifact/:id/current', url.pathname);
      if (params) {
        if (!requireAuth(ctx, req, res)) return;
        const project = findProject(ctx, params.id);
        if (!project) return text(res, 404, 'Project not found');
        const file = path.join(projectRoot(ctx.dataDir, project), 'artifacts', 'current', 'index.html');
        return serveFile(res, file) || text(res, 404, 'No artifact has been built yet.');
      }

      const safePath = path.normalize(url.pathname).replace(/^([.][.][/\\])+/, '').replace(/^[/\\]+/, '');
      const candidate = path.join(publicDir, safePath || 'index.html');
      if (candidate.startsWith(publicDir) && serveFile(res, candidate)) return;
      return serveFile(res, path.join(publicDir, 'index.html')) || text(res, 404, 'ChatSaid UI not found');
    } catch (error) {
      if (!config.quiet) console.error(error);
      if (!res.headersSent) json(res, error.statusCode || 500, { error: error.message });
      else res.end();
    }
  });

  async function start() {
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(config.port, config.host, resolve);
    });
    const address = server.address();
    const actualPort = typeof address === 'object' && address ? address.port : config.port;
    ctx.urls = networkUrls(actualPort);
    discovery = startDiscovery(actualPort, { quiet: config.quiet });
    ctx.discovery = discovery;
    ctx.urls.push(`http://${discovery.hostname}:${actualPort}`);
    ctx.urls = [...new Set(ctx.urls)];
    worker.start();
    if (!config.quiet) {
      console.log('\nChatSaid / Taurus Forge is running.');
      console.log(`Pairing code: ${database.getSetting('pairing_code')}`);
      for (const url of ctx.urls) console.log(`  ${url}`);
      console.log(`Data: ${config.dataDir}\n`);
    }
    return { port: actualPort, urls: ctx.urls, pairingCode: database.getSetting('pairing_code') };
  }

  async function stop() {
    await worker.stop();
    discovery?.stop();
    await new Promise((resolve) => server.close(resolve));
    database.close();
  }

  return { ctx, config, server, worker, start, stop, pairingCode: database.getSetting('pairing_code') };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const app = await createServerApp();
  await app.start();
  const shutdown = async () => {
    await app.stop();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

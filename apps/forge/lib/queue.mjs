import fs from 'node:fs';
import path from 'node:path';
import { id, nowIso, ensureDir, writeTextAtomic } from './utils.mjs';
import { findProject, getProject, saveRevision, projectRoot } from './projects.mjs';
import { reconcileNote } from './reconciler.mjs';
import { buildArtifact } from './artifacts.mjs';
import { audit } from './db.mjs';

function extensionFromMime(mime = '') {
  if (mime.includes('webm')) return '.webm';
  if (mime.includes('ogg')) return '.ogg';
  if (mime.includes('wav')) return '.wav';
  if (mime.includes('mpeg') || mime.includes('mp3')) return '.mp3';
  if (mime.includes('mp4') || mime.includes('m4a')) return '.m4a';
  return '.audio';
}

export function enqueueNote(ctx, projectIdentifier, input = {}) {
  const project = findProject(ctx, projectIdentifier);
  if (!project) throw new Error('Project not found');
  const transcript = String(input.transcript || '').trim();
  let audioPath = null;
  const audioMime = String(input.audioMime || '');
  const noteId = id('note');
  const sequenceRow = ctx.db.prepare('SELECT COALESCE(MAX(sequence), 0) AS sequence FROM notes WHERE project_id = ?').get(project.id);
  const sequence = Number(sequenceRow.sequence) + 1;
  const createdAt = nowIso();

  if (input.audioBase64) {
    const ext = extensionFromMime(audioMime);
    const root = projectRoot(ctx.dataDir, project);
    const relative = path.join('recordings', `${String(sequence).padStart(4, '0')}-${noteId}${ext}`);
    audioPath = relative;
    ensureDir(path.dirname(path.join(root, relative)));
    fs.writeFileSync(path.join(root, relative), Buffer.from(String(input.audioBase64), 'base64'));
  }

  const status = transcript ? 'queued' : (audioPath ? 'awaiting_transcript' : 'failed');
  const error = status === 'failed' ? 'A transcript or audio recording is required.' : null;
  ctx.db.prepare(`INSERT INTO notes(id, project_id, sequence, transcript, source, status, audio_path, audio_mime, created_at, error)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(noteId, project.id, sequence, transcript, String(input.source || 'web'), status, audioPath, audioMime, createdAt, error);
  ctx.db.prepare('UPDATE projects SET updated_at = ?, last_activity_at = ? WHERE id = ?').run(createdAt, createdAt, project.id);
  audit(ctx.db, 'note.enqueued', { noteId, sequence, source: input.source || 'web', hasAudio: Boolean(audioPath), status }, project.id);
  return getNote(ctx, noteId);
}

export function getNote(ctx, noteId) {
  return ctx.db.prepare('SELECT * FROM notes WHERE id = ?').get(noteId) || null;
}

export function listNotes(ctx, projectId, limit = 200) {
  return ctx.db.prepare('SELECT * FROM notes WHERE project_id = ? ORDER BY sequence DESC LIMIT ?').all(projectId, Number(limit));
}

export function listQueue(ctx, projectId = null) {
  if (projectId) {
    return ctx.db.prepare(`SELECT * FROM notes WHERE project_id = ? AND status IN ('awaiting_transcript','queued','processing','failed') ORDER BY sequence`).all(projectId);
  }
  return ctx.db.prepare(`SELECT * FROM notes WHERE status IN ('awaiting_transcript','queued','processing','failed') ORDER BY created_at, sequence`).all();
}

async function runWhisperCommand(ctx, project, note) {
  const template = ctx.config.whisperCommand;
  if (!template || !note.audio_path) return null;
  const { spawn } = await import('node:child_process');
  const root = projectRoot(ctx.dataDir, project);
  const input = path.join(root, note.audio_path);
  const outputBase = path.join(root, 'transcripts', `${String(note.sequence).padStart(4, '0')}-${note.id}`);
  const command = template.replaceAll('{input}', JSON.stringify(input)).replaceAll('{output}', JSON.stringify(outputBase));
  return await new Promise((resolve, reject) => {
    const child = spawn(command, { shell: true, cwd: root, env: process.env });
    let stdout = '', stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) return reject(new Error(`Whisper command failed (${code}): ${stderr || stdout}`));
      const candidates = [`${outputBase}.txt`, outputBase, `${input}.txt`];
      for (const file of candidates) {
        if (fs.existsSync(file)) return resolve(fs.readFileSync(file, 'utf8').trim());
      }
      resolve(stdout.trim());
    });
  });
}

export function createQueueWorker(ctx) {
  let processing = false;
  let stopped = false;
  let interval = null;
  let buildInterval = null;

  async function transcribeOne() {
    const note = ctx.db.prepare(`SELECT * FROM notes WHERE status = 'awaiting_transcript' ORDER BY created_at, sequence LIMIT 1`).get();
    if (!note || !ctx.config.whisperCommand) return false;
    const project = findProject(ctx, note.project_id);
    try {
      ctx.db.prepare("UPDATE notes SET status = 'processing', started_at = ?, error = NULL WHERE id = ?").run(nowIso(), note.id);
      const transcript = await runWhisperCommand(ctx, project, note);
      if (!transcript) throw new Error('Local transcription produced no text');
      ctx.db.prepare("UPDATE notes SET transcript = ?, status = 'queued', started_at = NULL WHERE id = ?").run(transcript, note.id);
      audit(ctx.db, 'note.transcribed', { noteId: note.id, sequence: note.sequence }, project.id);
    } catch (error) {
      ctx.db.prepare("UPDATE notes SET status = 'awaiting_transcript', started_at = NULL, error = ? WHERE id = ?").run(error.message, note.id);
      audit(ctx.db, 'note.transcription.failed', { noteId: note.id, error: error.message }, project.id);
    }
    return true;
  }

  async function processOne() {
    if (processing || stopped) return false;
    processing = true;
    try {
      if (await transcribeOne()) return true;
      const note = ctx.db.prepare(`SELECT * FROM notes WHERE status = 'queued' ORDER BY created_at, sequence LIMIT 1`).get();
      if (!note) return false;
      const project = findProject(ctx, note.project_id);
      if (!project) {
        ctx.db.prepare("UPDATE notes SET status = 'failed', error = ? WHERE id = ?").run('Project not found', note.id);
        return true;
      }
      const current = getProject(ctx, project.id);
      ctx.db.prepare("UPDATE notes SET status = 'processing', started_at = ?, error = NULL WHERE id = ?").run(nowIso(), note.id);
      try {
        const result = await reconcileNote(ctx.config, project, current.spec, note);
        const revision = saveRevision(ctx, project, result.spec, { noteId: note.id, changeSummary: result.changeSummary });
        const root = projectRoot(ctx.dataDir, project);
        const transcriptFile = path.join(root, 'transcripts', `${String(note.sequence).padStart(4, '0')}-${note.id}.md`);
        writeTextAtomic(transcriptFile, `# Note ${note.sequence}\n\n- Source: ${note.source}\n- Created: ${note.created_at}\n- Applied revision: ${revision.version}\n- Engine: ${result.engine}\n\n${note.transcript}\n`);
        ctx.db.prepare("UPDATE notes SET status = 'applied', applied_at = ?, error = NULL WHERE id = ?").run(nowIso(), note.id);
        audit(ctx.db, 'note.applied', { noteId: note.id, sequence: note.sequence, revision: revision.version, engine: result.engine }, project.id);
      } catch (error) {
        ctx.db.prepare("UPDATE notes SET status = 'failed', error = ? WHERE id = ?").run(error.stack || error.message, note.id);
        audit(ctx.db, 'note.failed', { noteId: note.id, sequence: note.sequence, error: error.message }, project.id);
      }
      return true;
    } finally {
      processing = false;
    }
  }

  async function maybeAutoBuild() {
    if (processing || stopped) return;
    const projects = ctx.db.prepare('SELECT * FROM projects WHERE auto_build = 1 OR build_requested = 1').all();
    for (const project of projects) {
      const pending = ctx.db.prepare("SELECT COUNT(*) AS count FROM notes WHERE project_id = ? AND status IN ('awaiting_transcript','queued','processing')").get(project.id);
      if (Number(pending.count) > 0) continue;
      const latestRevision = ctx.db.prepare('SELECT COALESCE(MAX(version), 0) AS version FROM revisions WHERE project_id = ?').get(project.id);
      const latestArtifact = ctx.db.prepare('SELECT COALESCE(MAX(revision_version), -1) AS revision_version FROM artifacts WHERE project_id = ?').get(project.id);
      if (Number(latestArtifact.revision_version) >= Number(latestRevision.version)) continue;
      const quietMs = Date.now() - new Date(project.last_activity_at).getTime();
      const requiredMs = ctx.config.quiescenceOverrideMs ?? Number(project.quiescence_minutes) * 60_000;
      if (!project.build_requested && quietMs < requiredMs) continue;
      await buildArtifact(ctx, project.id, project.build_requested ? 'requested-after-queue' : 'quiescence');
      if (project.build_requested) ctx.db.prepare('UPDATE projects SET build_requested = 0 WHERE id = ?').run(project.id);
    }
  }

  function start() {
    interval = setInterval(() => processOne().catch((e) => console.error('[queue]', e)), ctx.config.workerIntervalMs);
    buildInterval = setInterval(() => maybeAutoBuild().catch((e) => console.error('[autobuild]', e)), ctx.config.autoBuildIntervalMs);
    return { processOne, maybeAutoBuild };
  }

  async function stop() {
    stopped = true;
    if (interval) clearInterval(interval);
    if (buildInterval) clearInterval(buildInterval);
    while (processing) await new Promise((resolve) => setTimeout(resolve, 10));
  }

  return { start, stop, processOne, maybeAutoBuild, get processing() { return processing; } };
}

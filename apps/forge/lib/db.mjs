import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import path from 'node:path';
import { ensureDir, nowIso } from './utils.mjs';

export function openDatabase(dataDir) {
  ensureDir(dataDir);
  const file = path.join(dataDir, 'taurus.sqlite');
  const db = new DatabaseSync(file);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA busy_timeout = 5000;');
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS client_tokens (
      token TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      created_at TEXT NOT NULL,
      last_used_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      artifact_mode TEXT NOT NULL DEFAULT 'auto',
      auto_build INTEGER NOT NULL DEFAULT 1,
      build_requested INTEGER NOT NULL DEFAULT 0,
      quiescence_minutes INTEGER NOT NULL DEFAULT 15,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      last_activity_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      sequence INTEGER NOT NULL,
      transcript TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT 'web',
      status TEXT NOT NULL,
      audio_path TEXT,
      audio_mime TEXT,
      created_at TEXT NOT NULL,
      started_at TEXT,
      applied_at TEXT,
      error TEXT,
      UNIQUE(project_id, sequence)
    );

    CREATE INDEX IF NOT EXISTS notes_status_sequence_idx
      ON notes(status, created_at, sequence);

    CREATE TABLE IF NOT EXISTS revisions (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      version INTEGER NOT NULL,
      note_id TEXT REFERENCES notes(id) ON DELETE SET NULL,
      spec_json TEXT NOT NULL,
      spec_md TEXT NOT NULL,
      change_summary TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(project_id, version)
    );

    CREATE TABLE IF NOT EXISTS artifacts (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      version INTEGER NOT NULL,
      revision_version INTEGER NOT NULL,
      trigger TEXT NOT NULL,
      manifest_json TEXT NOT NULL,
      relative_path TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(project_id, version)
    );

    CREATE TABLE IF NOT EXISTS artifact_state (
      project_id TEXT PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
      state_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clips (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      text TEXT NOT NULL,
      source_note_id TEXT REFERENCES notes(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS agent_outputs (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      filename TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
      event_type TEXT NOT NULL,
      detail_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  try { db.exec('ALTER TABLE projects ADD COLUMN build_requested INTEGER NOT NULL DEFAULT 0;'); } catch {}

  const settingGet = db.prepare('SELECT value FROM settings WHERE key = ?');
  const settingSet = db.prepare(`
    INSERT INTO settings(key, value, updated_at) VALUES(?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `);

  const getSetting = (key, fallback = null) => {
    const row = settingGet.get(key);
    return row ? row.value : fallback;
  };

  const setSetting = (key, value) => settingSet.run(key, String(value), nowIso());

  if (!getSetting('pairing_code')) {
    setSetting('pairing_code', String(crypto.randomInt(100000, 999999)));
  }
  if (!getSetting('server_id')) {
    setSetting('server_id', crypto.randomUUID());
  }
  if (!getSetting('created_at')) {
    setSetting('created_at', nowIso());
  }

  return {
    db,
    file,
    getSetting,
    setSetting,
    close: () => db.close(),
  };
}

export function issueToken(db, label = 'paired device') {
  const token = crypto.randomBytes(32).toString('base64url');
  const now = nowIso();
  db.prepare('INSERT INTO client_tokens(token, label, created_at, last_used_at) VALUES(?, ?, ?, ?)')
    .run(token, String(label).slice(0, 120), now, now);
  return token;
}

export function validateToken(db, token) {
  if (!token) return false;
  const row = db.prepare('SELECT token FROM client_tokens WHERE token = ?').get(token);
  if (!row) return false;
  db.prepare('UPDATE client_tokens SET last_used_at = ? WHERE token = ?').run(nowIso(), token);
  return true;
}

export function audit(db, eventType, detail = {}, projectId = null) {
  db.prepare('INSERT INTO audit_events(project_id, event_type, detail_json, created_at) VALUES(?, ?, ?, ?)')
    .run(projectId, eventType, JSON.stringify(detail), nowIso());
}

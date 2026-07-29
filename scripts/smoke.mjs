import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createServerApp } from '../apps/forge/server.mjs';

const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'taurus-smoke-'));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let app;
try {
  app = await createServerApp({ port: 0, host: '127.0.0.1', dataDir, quiet: true, workerIntervalMs: 500, autoBuildIntervalMs: 20 });
  const started = await app.start();
  const base = started.urls[0];
  const call = async (route, { token, method = 'GET', body } = {}) => {
    const response = await fetch(`${base}${route}`, {
      method,
      headers: { ...(token ? { authorization: `Bearer ${token}` } : {}), ...(body ? { 'content-type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
    return payload;
  };
  const { token } = await call('/api/pair', { method: 'POST', body: { code: started.pairingCode, label: 'smoke' } });
  const project = await call('/api/projects', { token, method: 'POST', body: { name: 'Smoke Project', description: 'A complete spoken-project loop.' } });
  await call(`/api/projects/${project.id}/notes`, { token, method: 'POST', body: { transcript: 'The tool should accept private notes into a named project.', source: 'smoke' } });
  await call(`/api/projects/${project.id}/notes`, { token, method: 'POST', body: { transcript: 'It must process each note one at a time and build an interactive artifact.', source: 'smoke' } });
  const scheduled = await call(`/api/projects/${project.id}/build`, { token, method: 'POST', body: {} });
  if (!scheduled.scheduled) throw new Error('Make did not schedule behind the active queue');
  let current;
  for (let i = 0; i < 150; i++) {
    current = await call(`/api/projects/${project.id}`, { token });
    if (current.revisionVersion === 2) break;
    await sleep(20);
  }
  if (current.revisionVersion !== 2) throw new Error('Queue did not reach revision 2');
  let artifact;
  for (let i = 0; i < 150; i++) {
    const artifacts = await call(`/api/projects/${project.id}/artifacts`, { token });
    artifact = artifacts[0];
    if (artifact) break;
    await sleep(20);
  }
  if (!artifact) throw new Error('Scheduled Make did not produce an artifact');
  console.log(JSON.stringify({
    ok: true,
    project: current.name,
    revision: current.revisionVersion,
    sourceNotes: current.spec.sourceNotes.map((n) => n.sequence),
    artifactVersion: artifact.version,
    artifactFamilies: artifact.manifest.families,
    projectFolder: current.rootPath,
  }, null, 2));
} finally {
  if (app) await app.stop();
  fs.rmSync(dataDir, { recursive: true, force: true });
}

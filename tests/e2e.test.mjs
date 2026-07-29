import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import dgram from 'node:dgram';
import { createServerApp } from '../apps/forge/server.mjs';
import { sendWakeOnLan } from '../apps/forge/lib/wol.mjs';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(fn, { timeout = 5000, interval = 30 } = {}) {
  const started = Date.now();
  let last;
  while (Date.now() - started < timeout) {
    last = await fn();
    if (last) return last;
    await wait(interval);
  }
  throw new Error(`Timed out waiting for condition; last value: ${JSON.stringify(last)}`);
}

async function request(base, pathname, { token, method = 'GET', body } = {}) {
  const headers = {};
  if (token) headers.authorization = `Bearer ${token}`;
  if (body !== undefined) headers['content-type'] = 'application/json';
  const response = await fetch(`${base}${pathname}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const type = response.headers.get('content-type') || '';
  const payload = type.includes('json') ? await response.json() : await response.text();
  if (!response.ok) throw new Error(`${response.status}: ${payload?.error || payload}`);
  return payload;
}

test('complete Talk → Plan → Make loop survives restart', async (t) => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'taurus-e2e-'));
  let app = await createServerApp({
    port: 0, host: '127.0.0.1', dataDir, quiet: true,
    workerIntervalMs: 500, autoBuildIntervalMs: 20, quiescenceOverrideMs: 80,
  });
  const started = await app.start();
  let base = started.urls[0];

  const pair = await request(base, '/api/pair', { method: 'POST', body: { code: started.pairingCode, label: 'test browser' } });
  const token = pair.token;
  assert.ok(token.length > 20);

  const project = await request(base, '/api/projects', {
    token, method: 'POST',
    body: { name: 'Neighborhood Table', description: 'A private neighborhood meal planning tool.', quiescenceMinutes: 15 },
  });
  assert.equal(project.name, 'Neighborhood Table');
  assert.ok(fs.existsSync(path.join(project.rootPath, 'TAURUS.md')));

  const note1 = await request(base, `/api/projects/${project.id}/notes`, {
    token, method: 'POST',
    body: { transcript: 'The project must be invite-only and should never have a public feed.', source: 'taurus-pocket' },
  });
  const note2 = await request(base, `/api/projects/${project.id}/notes`, {
    token, method: 'POST',
    body: { transcript: 'After a host creates a meal, neighbors can RSVP and the address is revealed progressively.', source: 'taurus-pocket' },
  });
  assert.equal(note1.sequence, 1);
  assert.equal(note2.sequence, 2);

  const scheduledBuild = await request(base, `/api/projects/${project.id}/build`, { token, method: 'POST', body: {} });
  assert.equal(scheduledBuild.scheduled, true);
  assert.ok(scheduledBuild.pending >= 1);

  await waitFor(async () => {
    const notes = await request(base, `/api/projects/${project.id}/notes`, { token });
    return notes.length === 2 && notes.every((n) => n.status === 'applied') ? notes : null;
  });

  const planned = await request(base, `/api/projects/${project.id}`, { token });
  assert.equal(planned.revisionVersion, 2);
  assert.match(planned.specMarkdown, /invite-only/i);
  assert.match(planned.specMarkdown, /progressively/i);
  const sourceOrder = planned.spec.sourceNotes.map((n) => n.sequence);
  assert.deepEqual(sourceOrder, [1, 2]);

  const artifact = await waitFor(async () => {
    const artifacts = await request(base, `/api/projects/${project.id}/artifacts`, { token });
    return artifacts[0] || null;
  });
  assert.equal(artifact.version, 1);
  assert.ok(artifact.manifest.families.includes('workspace'));
  assert.ok(artifact.manifest.screens.length >= 5);

  const artifactResponse = await fetch(`${base}/artifact/${project.id}/current`, { headers: { authorization: `Bearer ${token}` } });
  assert.equal(artifactResponse.status, 200);
  const artifactHtml = await artifactResponse.text();
  assert.match(artifactHtml, /Neighborhood Table/);
  assert.match(artifactHtml, /Working plan/);

  const clip = await request(base, `/api/projects/${project.id}/clips`, {
    token, method: 'POST', body: { title: 'Core rule', text: 'Invite-only. No public feed.' },
  });
  assert.equal(clip.title, 'Core rule');

  const mcp = await request(base, '/mcp', {
    token, method: 'POST', body: { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'get_spec', arguments: { project: project.slug } } },
  });
  assert.equal(mcp.id, 1);
  assert.match(mcp.result.content[0].text, /invite-only/i);

  const exported = await fetch(`${base}/api/projects/${project.id}/export`, { headers: { authorization: `Bearer ${token}` } });
  assert.equal(exported.status, 200);
  assert.equal(exported.headers.get('content-type'), 'application/zip');
  assert.ok((await exported.arrayBuffer()).byteLength > 500);

  await app.stop();

  app = await createServerApp({ port: 0, host: '127.0.0.1', dataDir, quiet: true, workerIntervalMs: 500, autoBuildIntervalMs: 20 });
  const restarted = await app.start();
  base = restarted.urls[0];
  const recovered = await request(base, `/api/projects/${project.id}`, { token });
  assert.equal(recovered.revisionVersion, 2);
  assert.equal(recovered.latestArtifact.version, 1);
  assert.match(recovered.specMarkdown, /Neighborhood Table/);

  await app.stop();
  fs.rmSync(dataDir, { recursive: true, force: true });
});

test('Wake-on-LAN emits a valid magic packet', async () => {
  const socket = dgram.createSocket('udp4');
  await new Promise((resolve) => socket.bind(0, '127.0.0.1', resolve));
  const port = socket.address().port;
  const packetPromise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('No packet received')), 1500);
    socket.once('message', (packet) => { clearTimeout(timer); resolve(packet); });
  });
  await sendWakeOnLan('AA:BB:CC:DD:EE:FF', { address: '127.0.0.1', port });
  const packet = await packetPromise;
  socket.close();
  assert.equal(packet.length, 102);
  assert.deepEqual([...packet.subarray(0, 6)], [255, 255, 255, 255, 255, 255]);
  assert.equal(packet.subarray(6, 12).toString('hex'), 'aabbccddeeff');
});

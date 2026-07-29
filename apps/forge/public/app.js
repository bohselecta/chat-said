const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const state = {
  token: localStorage.getItem('taurus_token') || '',
  server: null,
  projects: [],
  project: null,
  notes: [],
  queue: [],
  revisions: [],
  clips: [],
  artifacts: [],
  handoff: null,
  runtimeSettings: null,
  tab: 'talk',
  mediaRecorder: null,
  mediaStream: null,
  audioChunks: [],
  audioBlob: null,
  audioContext: null,
  analyser: null,
  waveformTimer: null,
  recordingStartedAt: 0,
  recordingTimer: null,
  recognition: null,
  recognitionActive: false,
  deferredInstall: null,
  pollTimer: null,
};

function toast(message, type = '') {
  const el = $('#toast');
  el.textContent = message;
  el.className = `toast show ${type}`;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.className = 'toast'; }, 3200);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

function wordCount(value) {
  const text = String(value || '').trim();
  return text ? text.split(/\s+/).length : 0;
}

async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (state.token) headers.set('authorization', `Bearer ${state.token}`);
  if (options.body && typeof options.body !== 'string') {
    headers.set('content-type', 'application/json');
    options.body = JSON.stringify(options.body);
  }
  const response = await fetch(path, { ...options, headers });
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('json') ? await response.json() : await response.text();
  if (!response.ok) {
    const error = new Error(payload?.error || payload || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(String(text || ''));
    toast('Copied to clipboard');
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = String(text || '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    toast('Copied to clipboard');
  }
}

function showPair() {
  const dialog = $('#pair-dialog');
  if (!dialog.open) dialog.showModal();
  setTimeout(() => $('#pair-code').focus(), 50);
}

async function boot() {
  buildWaveform();
  bindEvents();
  registerPwa();
  try {
    const status = await api('/api/status');
    state.server = status;
    $('#server-dot').classList.add('online');
    $('#server-dot span:last-child').textContent = status.localHostname || 'Taurus online';
    if (!status.authorized) return showPair();
    await loadBootstrap();
  } catch (error) {
    $('#server-dot span:last-child').textContent = 'Forge unavailable';
    toast(error.message, 'error');
  }
}

async function loadBootstrap() {
  try {
    const data = await api('/api/bootstrap');
    state.server = data.server;
    state.projects = data.projects || [];
    renderProjects();
    const queryProject = new URLSearchParams(location.search).get('project');
    const last = localStorage.getItem('taurus_last_project');
    const candidate = queryProject || last || state.projects[0]?.id;
    if (candidate) await selectProject(candidate);
    else renderNoProject();
  } catch (error) {
    if (error.status === 401) return showPair();
    throw error;
  }
}

function renderProjects() {
  const list = $('#project-list');
  list.innerHTML = state.projects.map((p) => `
    <button class="project-item ${state.project?.id === p.id ? 'active' : ''}" data-project="${escapeHtml(p.id)}">
      <span class="project-dot"></span>
      <span><strong>${escapeHtml(p.name)}</strong><small>r${p.revision_version ?? 0} · ${p.artifact_version ? `artifact ${p.artifact_version}` : 'forming'}</small></span>
      ${Number(p.queue_count) ? `<span class="badge">${p.queue_count}</span>` : ''}
    </button>`).join('');
  $$('[data-project]').forEach((button) => button.onclick = () => selectProject(button.dataset.project));
}

function renderNoProject() {
  state.project = null;
  $('#empty-state').hidden = false;
  $$('.panel').forEach((p) => p.hidden = true);
  $('#project-title').textContent = 'Choose or create a project';
  $('#project-kicker').textContent = 'Private project canvas';
  ['#copy-agent', '#export-project', '#make-now'].forEach((s) => $(s).disabled = true);
}

async function selectProject(id) {
  const project = await api(`/api/projects/${encodeURIComponent(id)}`);
  state.project = project;
  localStorage.setItem('taurus_last_project', project.id);
  history.replaceState({}, '', `/?project=${encodeURIComponent(project.id)}`);
  $('#project-title').textContent = project.name;
  $('#project-kicker').textContent = project.description || 'Living project';
  ['#copy-agent', '#export-project', '#make-now'].forEach((s) => $(s).disabled = false);
  $('#empty-state').hidden = true;
  renderProjects();
  await Promise.all([refreshProjectData(), loadRuntimeSettings()]);
  setTab(state.tab);
  clearInterval(state.pollTimer);
  state.pollTimer = setInterval(() => refreshProjectData({ quiet: true }).catch(() => {}), 1800);
}

async function refreshProjectData({ quiet = false } = {}) {
  if (!state.project) return;
  const id = encodeURIComponent(state.project.id);
  try {
    const [project, notes, queue, revisions, clips, artifacts, handoff] = await Promise.all([
      api(`/api/projects/${id}`),
      api(`/api/projects/${id}/notes`),
      api(`/api/projects/${id}/queue`),
      api(`/api/projects/${id}/revisions`),
      api(`/api/projects/${id}/clips`),
      api(`/api/projects/${id}/artifacts`),
      api(`/api/projects/${id}/agent-handoff`),
    ]);
    const previousRevision = state.project?.revisionVersion;
    state.project = project;
    state.notes = notes;
    state.queue = queue;
    state.revisions = revisions;
    state.clips = clips;
    state.artifacts = artifacts;
    state.handoff = handoff;
    renderProjectData();
    if (!quiet && previousRevision !== project.revisionVersion) toast(`Project is now revision ${project.revisionVersion}`);
  } catch (error) {
    if (!quiet) toast(error.message, 'error');
  }
}

function renderProjectData() {
  renderQueue();
  renderPlan();
  renderArtifact();
  renderLibrary();
  renderConnections();
  const row = state.projects.find((p) => p.id === state.project.id);
  if (row) {
    row.revision_version = state.project.revisionVersion;
    row.artifact_version = state.project.latestArtifact?.version || null;
    row.queue_count = state.queue.filter((n) => ['queued', 'processing', 'awaiting_transcript'].includes(n.status)).length;
  }
  renderProjects();
}


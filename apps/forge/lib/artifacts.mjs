import fs from 'node:fs';
import path from 'node:path';
import { id, nowIso, ensureDir, writeJsonAtomic, writeTextAtomic, escapeHtml, safeJsonForHtml, uniqueStrings } from './utils.mjs';
import { projectRoot, getProject } from './projects.mjs';
import { generateArtifactManifestWithLlm } from './reconciler.mjs';
import { audit } from './db.mjs';

function inferFamilies(spec) {
  const corpus = [
    ...(spec.vision || []), ...(spec.capabilities || []), ...(spec.workflows || []),
    ...(spec.interfaces || []), ...(spec.sourceNotes || []).map((n) => n.text),
  ].join(' ').toLowerCase();
  const families = ['workspace'];
  const rules = [
    ['document', /\b(write|document|report|proposal|article|script|spec|manual|letter)\b/],
    ['plan', /\b(plan|schedule|roadmap|checklist|runbook|timeline|steps)\b/],
    ['tracker', /\b(track|dashboard|inventory|budget|status|pipeline|progress|calendar)\b/],
    ['decision-tool', /\b(compare|choose|calculate|score|decision|option|estimate|configur)\b/],
    ['creator', /\b(create|design|editor|builder|canvas|composer|arrange)\b/],
    ['simulation', /\b(simulate|prototype|demo|wireframe|interactive|scenario)\b/],
    ['publication', /\b(website|landing|publish|presentation|deck|portfolio|show people|share)\b/],
    ['learning', /\b(teach|lesson|quiz|practice|learn|training|study)\b/],
    ['automation', /\b(automate|whenever|trigger|workflow|recurring|pipeline)\b/],
  ];
  for (const [family, re] of rules) if (re.test(corpus)) families.push(family);
  if (!families.includes('plan')) families.push('plan');
  if (!families.includes('simulation')) families.push('simulation');
  return uniqueStrings(families);
}

function asTasks(spec) {
  const source = [...(spec.capabilities || []), ...(spec.workflows || []), ...(spec.constraints || [])];
  return uniqueStrings(source).slice(0, 30).map((text, index) => ({
    id: `task-${index + 1}`,
    title: text,
    status: index < 2 ? 'active' : 'planned',
  }));
}

export function deterministicArtifactManifest(project, spec) {
  const families = inferFamilies(spec);
  const tasks = asTasks(spec);
  const interfaceItems = uniqueStrings(spec.interfaces || []).slice(0, 12);
  const coreItems = uniqueStrings([...(spec.vision || []), ...(spec.capabilities || [])]).slice(0, 10);
  const decisions = uniqueStrings([...(spec.constraints || []), ...(spec.openQuestions || [])]).slice(0, 12)
    .map((text, index) => ({ id: `decision-${index + 1}`, question: text, status: 'open' }));
  const screens = [
    {
      id: 'overview', title: 'Overview', purpose: 'Use the project immediately and understand its current shape.',
      blocks: [
        { type: 'hero', title: project.name, body: spec.description || spec.vision?.[0] || 'A living project built from spoken notes.', items: coreItems },
        { type: 'cards', title: 'Core capabilities', body: '', items: uniqueStrings(spec.capabilities || []).slice(0, 8) },
      ],
    },
    {
      id: 'plan', title: 'Plan', purpose: 'Turn the canonical specification into visible, editable work.',
      blocks: [
        { type: 'checklist', title: 'Working plan', body: 'Check off, reorder, and revise the work that emerged from the project.', items: tasks.map((t) => t.title) },
        { type: 'timeline', title: 'Workflow', body: '', items: uniqueStrings(spec.workflows || []).slice(0, 12) },
      ],
    },
    {
      id: 'tracker', title: 'Tracker', purpose: 'Keep the project moving without losing the source decisions.',
      blocks: [{ type: 'table', title: 'Project tracker', body: '', items: tasks.map((t) => `${t.status}: ${t.title}`) }],
    },
    {
      id: 'prototype', title: 'Prototype', purpose: 'A navigable wireframe assembled from the project interface requirements.',
      blocks: [{ type: 'wireframe', title: 'Interface map', body: '', items: interfaceItems.length ? interfaceItems : ['Home', 'Project workspace', 'Primary action', 'History', 'Settings'] }],
    },
    {
      id: 'decisions', title: 'Decisions', purpose: 'Resolve conflicts and choices without silently changing the project.',
      blocks: [{ type: 'decision', title: 'Decision register', body: '', items: decisions.map((d) => d.question) }],
    },
    {
      id: 'share', title: 'Share', purpose: 'Present the current project without exposing private source material.',
      blocks: [{ type: 'text', title: 'Public summary', body: spec.vision?.join('\n') || spec.description || project.name, items: [] }],
    },
  ];
  return {
    schemaVersion: 1,
    title: project.name,
    summary: spec.description || spec.vision?.[0] || 'A living project assembled from sequentially reconciled voice notes.',
    primaryAction: tasks[0]?.title || 'Continue shaping the project',
    families,
    plan: tasks,
    tracker: tasks,
    decisions,
    screens,
    publication: {
      title: project.name,
      description: spec.description || spec.vision?.[0] || '',
      highlights: coreItems,
    },
    generatedBy: 'deterministic',
    generatedAt: nowIso(),
  };
}

function artifactHtml(project, manifest) {
  const data = safeJsonForHtml({ project: { id: project.id, slug: project.slug, name: project.name }, manifest });
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(project.name)} — ChatSaid Artifact</title>
<style>
:root{color-scheme:dark;--bg:#090b10;--panel:#11151d;--panel2:#171c26;--line:#2b3342;--text:#f3f6fb;--muted:#9ca8b8;--cyan:#4ee1d2;--violet:#9f7aea;--danger:#ff6b79}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 20% 0,#16212d 0,transparent 38%),var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.shell{display:grid;grid-template-columns:240px minmax(0,1fr);min-height:100vh}.side{border-right:1px solid var(--line);padding:24px 16px;position:sticky;top:0;height:100vh;background:#0b0e14dd;backdrop-filter:blur(14px)}.brand{font-weight:800;letter-spacing:.08em;text-transform:uppercase;font-size:12px;color:var(--cyan)}.project{font-size:22px;font-weight:750;margin:8px 0 22px}.nav button{width:100%;text-align:left;padding:11px 12px;margin:3px 0;border:1px solid transparent;border-radius:10px;background:transparent;color:var(--muted);cursor:pointer}.nav button.active,.nav button:hover{background:var(--panel2);border-color:var(--line);color:var(--text)}main{padding:36px;max-width:1180px;width:100%;margin:0 auto}.eyebrow{color:var(--cyan);font-size:12px;letter-spacing:.12em;text-transform:uppercase}.hero{font-size:clamp(34px,6vw,72px);line-height:.98;letter-spacing:-.04em;margin:10px 0 16px}.summary{font-size:18px;color:var(--muted);max-width:760px;line-height:1.55}.primary{margin:24px 0 34px;padding:16px 18px;border:1px solid #395b62;border-radius:14px;background:#102326;color:#c9fff9}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px}.card{border:1px solid var(--line);background:linear-gradient(180deg,#151a24,#10141c);border-radius:16px;padding:18px}.card h3{margin:0 0 10px}.muted{color:var(--muted)}ul{padding-left:20px}.check{display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid #242b38}.check input{margin-top:4px}.wire{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.screen{min-height:135px;border:1px solid var(--line);border-radius:14px;padding:14px;background:#0b1017;cursor:pointer}.screen:hover{border-color:var(--cyan)}textarea,input,select{width:100%;background:#0b0e14;border:1px solid var(--line);color:var(--text);border-radius:10px;padding:10px}.toolbar{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}.toolbar button,.save{border:1px solid var(--line);background:var(--panel2);color:var(--text);padding:10px 14px;border-radius:10px;cursor:pointer}.save{background:var(--cyan);color:#04110f;border-color:transparent;font-weight:700}.status{font-size:13px;color:var(--muted)}section[hidden]{display:none}@media(max-width:760px){.shell{display:block}.side{position:relative;height:auto;border-right:0;border-bottom:1px solid var(--line)}.nav{display:flex;overflow:auto}.nav button{white-space:nowrap;width:auto}main{padding:24px 16px}}
</style></head>
<body><div class="shell"><aside class="side"><div class="brand">ChatSaid · Taurus Make</div><div class="project">${escapeHtml(project.name)}</div><div class="nav" id="nav"></div><div class="status" id="status">Local project artifact</div></aside><main id="main"></main></div>
<script>const DATA=${data};const M=DATA.manifest;const stateKey='taurus-artifact-'+DATA.project.id;let local=JSON.parse(localStorage.getItem(stateKey)||'{}');
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function items(block){const arr=block.items||[];if(block.type==='checklist')return arr.map((x,i)=>'<label class="check"><input type="checkbox" data-task="'+i+'" '+(local.tasks?.[i]?'checked':'')+'><span>'+esc(x)+'</span></label>').join('');if(block.type==='wireframe')return '<div class="wire">'+arr.map((x,i)=>'<div class="screen" data-screen="'+i+'"><strong>'+esc(x)+'</strong><p class="muted">Open and shape this screen.</p></div>').join('')+'</div>';if(block.type==='decision')return arr.map((x,i)=>'<div class="card"><strong>'+esc(x)+'</strong><select data-decision="'+i+'"><option>Open</option><option>Accepted</option><option>Rejected</option><option>Needs evidence</option></select></div>').join('');return arr.length?'<ul>'+arr.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':''}
function renderScreen(screen){document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.id===screen.id));document.getElementById('main').innerHTML='<div class="eyebrow">'+esc(screen.purpose)+'</div><h1 class="hero">'+esc(screen.title)+'</h1><p class="summary">'+esc(M.summary)+'</p><div class="primary"><strong>Primary action</strong><br>'+esc(M.primaryAction)+'</div><div class="grid">'+screen.blocks.map(b=>'<article class="card"><h3>'+esc(b.title)+'</h3><p class="muted">'+esc(b.body||'')+'</p>'+items(b)+'</article>').join('')+'</div><div class="toolbar"><button class="save" id="save">Save state</button><button id="copy">Copy project summary</button></div>';bind()}
function bind(){document.querySelectorAll('[data-task]').forEach(el=>el.onchange=()=>{local.tasks=local.tasks||{};local.tasks[el.dataset.task]=el.checked});document.querySelectorAll('[data-decision]').forEach(el=>{el.value=local.decisions?.[el.dataset.decision]||'Open';el.onchange=()=>{local.decisions=local.decisions||{};local.decisions[el.dataset.decision]=el.value}});document.getElementById('save').onclick=save;document.getElementById('copy').onclick=async()=>{await navigator.clipboard.writeText(M.title+'\n\n'+M.summary+'\n\n'+M.primaryAction);status('Copied')};document.querySelectorAll('[data-screen]').forEach(el=>el.onclick=()=>status('Wireframe screen selected: '+el.querySelector('strong').textContent))}
async function save(){localStorage.setItem(stateKey,JSON.stringify(local));try{await fetch('/api/projects/'+DATA.project.id+'/artifact-state',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(local)});status('Saved locally and to Taurus')}catch{status('Saved on this device')}}
function status(s){document.getElementById('status').textContent=s}
const nav=document.getElementById('nav');M.screens.forEach((s,i)=>{const b=document.createElement('button');b.textContent=s.title;b.dataset.id=s.id;b.onclick=()=>{location.hash=s.id;renderScreen(s)};nav.appendChild(b)});const initial=M.screens.find(s=>s.id===location.hash.slice(1))||M.screens[0];renderScreen(initial);
fetch('/api/projects/'+DATA.project.id+'/artifact-state').then(r=>r.ok?r.json():{}).then(s=>{local={...local,...s};renderScreen(initial)}).catch(()=>{});
</script></body></html>`;
}

export async function buildArtifact(ctx, projectIdentifier, trigger = 'manual') {
  const project = getProject(ctx, projectIdentifier);
  if (!project) throw new Error('Project not found');
  const fallback = deterministicArtifactManifest(project, project.spec);
  const manifest = await generateArtifactManifestWithLlm(ctx.config, project, project.spec, fallback);
  const current = ctx.db.prepare('SELECT COALESCE(MAX(version), 0) AS version FROM artifacts WHERE project_id = ?').get(project.id);
  const version = Number(current.version) + 1;
  manifest.generatedAt = nowIso();
  manifest.artifactVersion = version;
  manifest.revisionVersion = project.revisionVersion;
  const root = projectRoot(ctx.dataDir, project);
  const relative = path.join('artifacts', `v${String(version).padStart(4, '0')}`);
  const dir = ensureDir(path.join(root, relative));
  writeJsonAtomic(path.join(dir, 'manifest.json'), manifest);
  writeTextAtomic(path.join(dir, 'index.html'), artifactHtml(project, manifest));
  const currentDir = path.join(root, 'artifacts', 'current');
  fs.rmSync(currentDir, { recursive: true, force: true });
  ensureDir(currentDir);
  fs.copyFileSync(path.join(dir, 'manifest.json'), path.join(currentDir, 'manifest.json'));
  fs.copyFileSync(path.join(dir, 'index.html'), path.join(currentDir, 'index.html'));
  const artifactId = id('art');
  const createdAt = nowIso();
  ctx.db.prepare(`INSERT INTO artifacts(id, project_id, version, revision_version, trigger, manifest_json, relative_path, created_at)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(artifactId, project.id, version, project.revisionVersion, trigger, JSON.stringify(manifest), relative, createdAt);
  audit(ctx.db, 'artifact.built', { version, revisionVersion: project.revisionVersion, trigger, families: manifest.families }, project.id);
  return { id: artifactId, projectId: project.id, version, revisionVersion: project.revisionVersion, trigger, manifest, relativePath: relative, createdAt };
}

export function listArtifacts(ctx, projectId) {
  return ctx.db.prepare('SELECT * FROM artifacts WHERE project_id = ? ORDER BY version DESC').all(projectId)
    .map((row) => ({ ...row, manifest: JSON.parse(row.manifest_json) }));
}

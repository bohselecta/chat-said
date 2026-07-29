import { uniqueStrings, nowIso } from './utils.mjs';
import { normalizeSpec, SPEC_SECTIONS } from './projects.mjs';

const SECTION_RULES = [
  ['privacy', /\b(private|privacy|local[- ]first|offline|encrypt|permission|consent|secure|security|hipaa|confidential)\b/i],
  ['users', /\b(user|customer|client|patient|doctor|teacher|student|friend|family|team|people|audience)\b/i],
  ['interfaces', /\b(screen|page|view|button|dashboard|mobile|phone|tablet|desktop|website|webpage|ui|interface|wireframe|form|panel)\b/i],
  ['integrations', /\b(api|mcp|codex|cursor|github|docker|llama|whisper|network|lan|sync|integration|webhook|export|import)\b/i],
  ['data', /\b(file|folder|database|sqlite|recording|transcript|revision|history|memory|save|storage|project)\b/i],
  ['workflows', /\b(when|then|after|before|step|queue|process|trigger|flow|workflow|sequence|first|next|eventually)\b/i],
  ['constraints', /\b(must|never|only|cannot|can't|do not|don't|required|constraint|limit|without)\b/i],
  ['capabilities', /\b(can|should|need|allow|support|create|build|make|record|transcribe|copy|edit|track|compare|calculate|generate)\b/i],
  ['principles', /\b(principle|important|core|doctrine|promise|trust|simple|elegant|deterministic|one at a time)\b/i],
  ['vision', /\b(idea|vision|future|purpose|product|system|app|tool|experience|promise)\b/i],
];

function sentenceFragments(text) {
  return String(text || '')
    .replace(/\r/g, '')
    .split(/\n+|(?<=[.!?])\s+/)
    .map((s) => s.trim().replace(/^[-*•]\s*/, ''))
    .filter((s) => s.length > 2)
    .slice(0, 80);
}

function classify(fragment) {
  const matches = SECTION_RULES.filter(([, re]) => re.test(fragment)).map(([name]) => name);
  if (!matches.length) return ['capabilities'];
  return matches.slice(0, 3);
}

export function deterministicReconcile(project, currentSpec, note) {
  const spec = normalizeSpec(structuredClone(currentSpec), project);
  const fragments = sentenceFragments(note.transcript);
  const touched = new Set();
  for (const fragment of fragments) {
    for (const section of classify(fragment)) {
      spec[section] = uniqueStrings([...(spec[section] || []), fragment]);
      touched.add(section);
    }
  }
  spec.sourceNotes = [
    ...(spec.sourceNotes || []),
    { noteId: note.id, sequence: note.sequence, text: note.transcript, createdAt: note.created_at },
  ].slice(-500);
  spec.updatedAt = nowIso();
  const sectionNames = [...touched].map((key) => SPEC_SECTIONS.find(([k]) => k === key)?.[1] || key);
  return {
    spec,
    changeSummary: `Applied note ${note.sequence}; updated ${sectionNames.join(', ') || 'Capabilities'}.`,
    engine: 'deterministic',
  };
}

function stripJsonFence(value) {
  const text = String(value || '').trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced ? fenced[1].trim() : text;
}

async function callOpenAICompatible(config, messages, temperature = 0.1) {
  if (!config.llmUrl || !config.llmModel) throw new Error('LLM endpoint is not configured');
  const headers = { 'content-type': 'application/json' };
  if (config.llmApiKey) headers.authorization = `Bearer ${config.llmApiKey}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.llmTimeoutMs || 120000);
  try {
    const response = await fetch(config.llmUrl, {
      method: 'POST', headers, signal: controller.signal,
      body: JSON.stringify({
        model: config.llmModel,
        temperature,
        messages,
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error?.message || `LLM request failed (${response.status})`);
    const content = payload?.choices?.[0]?.message?.content ?? payload?.output_text;
    if (!content) throw new Error('LLM response did not include content');
    return JSON.parse(stripJsonFence(content));
  } finally {
    clearTimeout(timer);
  }
}

export async function reconcileNote(config, project, currentSpec, note) {
  if (!config.llmUrl || !config.llmModel) return deterministicReconcile(project, currentSpec, note);
  const system = `You are Taurus Forge, a sequential specification reconciler.\n\nYou receive exactly ONE new user note and the complete current canonical project spec. Return JSON only with this shape:\n{\n  "spec": { complete updated spec },\n  "changeSummary": "one concise sentence",\n  "ambiguities": ["only unresolved conflicts that truly require the user"]\n}\n\nRules:\n- Incorporate only this note. Never batch or invent other notes.\n- Preserve all compatible existing decisions.\n- Align the entire spec after the update so it remains coherent.\n- Do not silently discard contradictions; retain both in openQuestions or constraints and name the conflict.\n- Preserve the sourceNotes ledger and append the supplied note exactly once.\n- Use the same schema and array-valued sections already present.\n- Never return Markdown fences.`;
  const user = JSON.stringify({ currentSpec, incomingNote: note }, null, 2);
  try {
    const result = await callOpenAICompatible(config, [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ]);
    const spec = normalizeSpec(result.spec, project);
    const already = spec.sourceNotes.some((entry) => entry.noteId === note.id);
    if (!already) spec.sourceNotes.push({ noteId: note.id, sequence: note.sequence, text: note.transcript, createdAt: note.created_at });
    if (Array.isArray(result.ambiguities)) {
      spec.openQuestions = uniqueStrings([...(spec.openQuestions || []), ...result.ambiguities]);
    }
    return {
      spec,
      changeSummary: String(result.changeSummary || `Applied note ${note.sequence}.`).slice(0, 500),
      engine: 'llm',
    };
  } catch (error) {
    const fallback = deterministicReconcile(project, currentSpec, note);
    fallback.changeSummary += ` LLM unavailable; deterministic reconciliation used (${error.message}).`;
    fallback.engine = 'deterministic-fallback';
    return fallback;
  }
}

export async function generateArtifactManifestWithLlm(config, project, spec, fallbackManifest) {
  if (!config.llmUrl || !config.llmModel || !config.useLlmArtifacts) return fallbackManifest;
  const system = `You are Taurus Make. Convert a canonical project specification into a safe artifact manifest, not executable code. Return JSON only. Preserve this exact top-level shape: title, summary, primaryAction, families, plan, tracker, decisions, screens, publication. Keep each array concise. Screens contain id, title, purpose, and blocks. Blocks contain type, title, body, items. Allowed block types: hero, text, checklist, cards, table, form, timeline, decision, wireframe, gallery. The result must be immediately usable and populated with real project content.`;
  try {
    const result = await callOpenAICompatible(config, [
      { role: 'system', content: system },
      { role: 'user', content: JSON.stringify({ project, spec, fallbackManifest }, null, 2) },
    ], 0.2);
    return { ...fallbackManifest, ...result, generatedBy: 'llm' };
  } catch (error) {
    return { ...fallbackManifest, generatedBy: 'deterministic-fallback', generationWarning: error.message };
  }
}

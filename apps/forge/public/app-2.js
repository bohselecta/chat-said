function setTab(tab) {
  state.tab = tab;
  $$('.mode-tab').forEach((button) => button.classList.toggle('active', button.dataset.tab === tab));
  $('#empty-state').hidden = Boolean(state.project);
  $$('.panel').forEach((panel) => panel.hidden = true);
  if (state.project) $(`#${tab}-panel`).hidden = false;
}

function renderQueue() {
  const active = state.notes.filter((n) => ['queued', 'processing', 'awaiting_transcript', 'failed'].includes(n.status));
  $('#queue-count').textContent = `${active.filter((n) => n.status !== 'failed').length} waiting`;
  $('#queue-list').innerHTML = active.length ? active.slice().reverse().map((n) => `
    <article class="queue-item">
      <div class="queue-sequence">${String(n.sequence).padStart(2, '0')}</div>
      <div><strong>${n.status === 'awaiting_transcript' ? 'Audio awaiting local transcription' : `Project note ${n.sequence}`}</strong><p>${escapeHtml(n.transcript || n.error || 'Recording saved locally.')}</p></div>
      <span class="status-pill ${escapeHtml(n.status)}">${escapeHtml(n.status.replace('_', ' '))}</span>
    </article>`).join('') : '<div class="empty-list">The queue is clear. New notes will be reconciled one at a time.</div>';
}

function renderPlan() {
  $('#revision-number').textContent = state.project.revisionVersion ?? 0;
  if (document.activeElement !== $('#spec-editor')) $('#spec-editor').value = state.project.specMarkdown || '';
  $('#revision-list').innerHTML = state.revisions.length ? state.revisions.map((r) => `
    <div class="revision-item"><strong>Revision ${r.version}</strong><p>${escapeHtml(r.change_summary)}</p><time>${formatDate(r.created_at)}</time></div>`).join('') : '<div class="empty-list">No revisions yet.</div>';
}

function renderArtifact() {
  const artifact = state.artifacts[0] || state.project.latestArtifact;
  const hasArtifact = Boolean(artifact);
  $('#artifact-empty').hidden = hasArtifact;
  $('#artifact-shell').hidden = !hasArtifact;
  if (!hasArtifact) {
    $('#build-state').textContent = state.queue.length ? 'Waiting for queue' : 'Ready to make';
    $('#build-detail').textContent = state.queue.length ? 'Every note will be applied before Make starts.' : `Automatic Make begins after ${state.project.quiescenceMinutes} quiet minutes.`;
    return;
  }
  const manifest = artifact.manifest || artifact.latestArtifact?.manifest || {};
  $('#build-state').textContent = `Artifact v${artifact.version}`;
  $('#build-detail').textContent = `Built from spec revision ${artifact.revision_version ?? artifact.revisionVersion ?? '—'}`;
  $('#artifact-title').textContent = manifest.title || state.project.name;
  $('#artifact-meta').textContent = `${(manifest.families || []).join(' · ')} · ${formatDate(artifact.created_at || artifact.createdAt)}`;
  const frameUrl = `/artifact/${encodeURIComponent(state.project.id)}/current?rev=${state.project.revisionVersion}`;
  if ($('#artifact-frame').src !== new URL(frameUrl, location.href).href) $('#artifact-frame').src = frameUrl;
}

function renderLibrary() {
  $('#clip-list').innerHTML = state.clips.length ? state.clips.map((clip) => `
    <article class="library-item"><div class="library-item-head"><strong>${escapeHtml(clip.title)}</strong><time>${formatDate(clip.created_at)}</time></div><p>${escapeHtml(clip.text)}</p><div class="item-actions"><button class="secondary-button" data-copy-clip="${clip.id}">Copy</button><button class="text-button" data-load-clip="${clip.id}">Load into Talk</button></div></article>`).join('') : '<div class="empty-list">Copy & Save creates durable clips here.</div>';
  $('#note-history').innerHTML = state.notes.filter((n) => n.status === 'applied').length ? state.notes.filter((n) => n.status === 'applied').map((n) => `
    <article class="library-item"><div class="library-item-head"><strong>Note ${n.sequence}</strong><time>${formatDate(n.created_at)}</time></div><p>${escapeHtml(n.transcript)}</p><div class="item-actions"><button class="secondary-button" data-copy-note="${n.id}">Copy</button><button class="text-button" data-load-note="${n.id}">Load into Talk</button></div></article>`).join('') : '<div class="empty-list">Applied project notes appear here.</div>';
  $$('[data-copy-clip]').forEach((b) => b.onclick = () => copyText(state.clips.find((c) => c.id === b.dataset.copyClip)?.text || ''));
  $$('[data-load-clip]').forEach((b) => b.onclick = () => loadIntoTalk(state.clips.find((c) => c.id === b.dataset.loadClip)?.text || ''));
  $$('[data-copy-note]').forEach((b) => b.onclick = () => copyText(state.notes.find((n) => n.id === b.dataset.copyNote)?.transcript || ''));
  $$('[data-load-note]').forEach((b) => b.onclick = () => loadIntoTalk(state.notes.find((n) => n.id === b.dataset.loadNote)?.transcript || ''));
}

function renderConnections() {
  if (!state.handoff) return;
  $('#project-path').textContent = state.handoff.localPath;
  $('#spec-path').textContent = state.handoff.specPath;
  $('#api-path').textContent = state.handoff.apiUrl;
  $('#mcp-path').textContent = state.handoff.mcpUrl;
  $('#agent-instruction').textContent = state.handoff.instruction;
}

async function loadRuntimeSettings() {
  try {
    state.runtimeSettings = await api('/api/settings/runtime');
    $('#llm-url').value = state.runtimeSettings.llmUrl || '';
    $('#llm-model').value = state.runtimeSettings.llmModel || '';
    $('#llm-key').value = state.runtimeSettings.llmApiKeyConfigured ? '••••••••' : '';
    $('#llm-artifacts').checked = Boolean(state.runtimeSettings.useLlmArtifacts);
    $('#whisper-command').value = state.runtimeSettings.whisperCommand || '';
  } catch (error) {
    toast(error.message, 'error');
  }
}

async function saveRuntimeSettings() {
  try {
    await api('/api/settings/runtime', {
      method: 'PUT',
      body: {
        llmUrl: $('#llm-url').value.trim(),
        llmModel: $('#llm-model').value.trim(),
        llmApiKey: $('#llm-key').value,
        useLlmArtifacts: $('#llm-artifacts').checked,
        whisperCommand: $('#whisper-command').value.trim(),
      },
    });
    toast('Local intelligence settings saved');
    await loadRuntimeSettings();
  } catch (error) { toast(error.message, 'error'); }
}

function loadIntoTalk(text) {
  $('#note-text').value = text;
  updateWordCount();
  setTab('talk');
  $('#note-text').focus();
}

function buildWaveform() {
  const el = $('#waveform');
  el.innerHTML = Array.from({ length: 72 }, (_, i) => `<span style="height:${10 + ((i * 17) % 28)}%"></span>`).join('');
}

function updateWaveform() {
  if (!state.analyser) return;
  const data = new Uint8Array(state.analyser.frequencyBinCount);
  state.analyser.getByteFrequencyData(data);
  const bars = $$('#waveform span');
  bars.forEach((bar, index) => {
    const source = data[Math.floor(index / bars.length * data.length)] || 0;
    bar.style.height = `${Math.max(5, Math.min(100, source / 255 * 100))}%`;
  });
  state.waveformTimer = requestAnimationFrame(updateWaveform);
}

function resetWaveform() {
  cancelAnimationFrame(state.waveformTimer);
  $$('#waveform span').forEach((bar, i) => { bar.style.height = `${10 + ((i * 17) % 28)}%`; });
  $('#waveform').classList.remove('active');
}


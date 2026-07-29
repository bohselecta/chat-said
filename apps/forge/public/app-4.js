function openClipDialog(text = '') {
  $('#clip-text').value = text;
  $('#clip-title').value = state.project ? `${state.project.name} clip` : 'Working clip';
  $('#clip-dialog').showModal();
}

async function saveClip() {
  const text = $('#clip-text').value.trim();
  if (!text) return;
  const clip = await api(`/api/projects/${encodeURIComponent(state.project.id)}/clips`, {
    method: 'POST', body: { title: $('#clip-title').value, text },
  });
  await copyText(clip.text);
  $('#clip-dialog').close();
  await refreshProjectData({ quiet: true });
}

async function createNewProject() {
  const name = $('#new-project-name').value.trim();
  if (!name) return;
  try {
    const project = await api('/api/projects', {
      method: 'POST',
      body: { name, description: $('#new-project-description').value.trim(), quiescenceMinutes: Number($('#new-project-quiet').value) || 15 },
    });
    $('#project-dialog').close();
    $('#project-form').reset();
    $('#new-project-quiet').value = 15;
    state.projects.unshift(project);
    await selectProject(project.id);
    toast('Project created. Start talking.');
  } catch (error) {
    toast(error.message, 'error');
  }
}

async function pair(event) {
  event.preventDefault();
  $('#pair-error').textContent = '';
  try {
    const result = await api('/api/pair', { method: 'POST', body: { code: $('#pair-code').value, label: $('#pair-label').value } });
    state.token = result.token;
    localStorage.setItem('taurus_token', result.token);
    $('#pair-dialog').close();
    await loadBootstrap();
    toast('This device is paired with Taurus Forge');
  } catch (error) {
    $('#pair-error').textContent = error.message;
  }
}

function bindEvents() {
  $$('.mode-tab').forEach((button) => button.onclick = () => setTab(button.dataset.tab));
  ['#new-project', '#empty-new-project'].forEach((s) => $(s).onclick = () => $('#project-dialog').showModal());
  $('#project-form').addEventListener('submit', (event) => { event.preventDefault(); createNewProject(); });
  $('#pair-form').addEventListener('submit', pair);
  $('#record-button').onclick = () => state.mediaRecorder?.state === 'recording' ? stopRecording() : startRecording();
  $('#note-text').addEventListener('input', updateWordCount);
  $('#clear-note').onclick = () => { $('#note-text').value = ''; state.audioBlob = null; $('#audio-attached').textContent = 'No audio attached'; updateWordCount(); };
  $('#send-note').onclick = submitNote;
  $('#save-clip-from-note').onclick = () => openClipDialog($('#note-text').value);
  $('#new-library-clip').onclick = () => openClipDialog('');
  $('#clip-form').addEventListener('submit', (event) => { event.preventDefault(); saveClip().catch((e) => toast(e.message, 'error')); });
  $('#copy-spec').onclick = () => copyText($('#spec-editor').value);
  $('#save-spec').onclick = async () => {
    try {
      await api(`/api/projects/${encodeURIComponent(state.project.id)}/spec`, { method: 'PUT', body: { markdown: $('#spec-editor').value } });
      toast('Canonical specification saved as a new revision');
      await refreshProjectData({ quiet: true });
    } catch (error) { toast(error.message, 'error'); }
  };
  ['#make-now', '#make-empty-button', '#rebuild-artifact'].forEach((s) => $(s).onclick = buildNow);
  $('#open-artifact').onclick = () => window.open(`/artifact/${encodeURIComponent(state.project.id)}/current`, '_blank', 'noopener');
  $('#export-project').onclick = () => window.open(`/api/projects/${encodeURIComponent(state.project.id)}/export`, '_blank', 'noopener');
  $('#copy-agent').onclick = () => copyText(state.handoff?.instruction || '');
  $('#copy-agent-instruction').onclick = () => copyText(state.handoff?.instruction || '');
  $$('[data-copy-target]').forEach((button) => button.onclick = () => copyText($(`#${button.dataset.copyTarget}`).textContent));
  $('#save-runtime-settings').onclick = saveRuntimeSettings;
  $('#wake-button').onclick = async () => {
    try {
      const mac = $('#wake-mac').value;
      const address = $('#wake-address').value;
      if (window.TaurusNative?.wake) {
        const result = window.TaurusNative.wake(mac, address, 9);
        if (result === 'invalid-mac') throw new Error('Enter a valid MAC address');
        toast('Wake-on-LAN packet sent from Taurus Pocket');
      } else {
        await api('/api/wake', { method: 'POST', body: { mac, address } });
        toast('Wake-on-LAN packet sent from this Taurus node');
      }
    } catch (error) { toast(error.message, 'error'); }
  };
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    state.deferredInstall = event;
    $('#install-app').hidden = false;
  });
  $('#install-app').onclick = async () => {
    if (!state.deferredInstall) return;
    state.deferredInstall.prompt();
    await state.deferredInstall.userChoice;
    state.deferredInstall = null;
    $('#install-app').hidden = true;
  };
}

function registerPwa() {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
}

boot();

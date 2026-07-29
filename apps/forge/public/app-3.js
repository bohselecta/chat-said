async function startRecording() {
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    return toast('This browser cannot record audio. You can still type or paste a note.', 'error');
  }
  try {
    state.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    state.audioChunks = [];
    state.audioBlob = null;
    const preferred = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find((type) => MediaRecorder.isTypeSupported(type));
    state.mediaRecorder = new MediaRecorder(state.mediaStream, preferred ? { mimeType: preferred } : undefined);
    state.mediaRecorder.ondataavailable = (event) => { if (event.data.size) state.audioChunks.push(event.data); };
    state.mediaRecorder.onstop = () => {
      state.audioBlob = new Blob(state.audioChunks, { type: state.mediaRecorder.mimeType || 'audio/webm' });
      $('#audio-attached').textContent = `${Math.max(1, Math.round(state.audioBlob.size / 1024))} KB audio attached`;
      $('#audio-status').textContent = 'Audio safely held for this note';
      stopMediaTracks();
    };
    state.mediaRecorder.start(500);
    state.recordingStartedAt = Date.now();
    state.recordingTimer = setInterval(updateTimer, 250);
    $('#record-button').classList.add('recording');
    $('#record-label').textContent = 'Stop recording';
    $('#audio-status').textContent = 'Recording locally';
    $('#waveform').classList.add('active');
    state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = state.audioContext.createMediaStreamSource(state.mediaStream);
    state.analyser = state.audioContext.createAnalyser();
    state.analyser.fftSize = 256;
    source.connect(state.analyser);
    updateWaveform();
    if ($('#browser-recognition').checked) startRecognition();
  } catch (error) {
    toast(`Microphone unavailable: ${error.message}`, 'error');
  }
}

function stopRecording() {
  if (state.mediaRecorder?.state === 'recording') state.mediaRecorder.stop();
  stopRecognition();
  clearInterval(state.recordingTimer);
  $('#record-button').classList.remove('recording');
  $('#record-label').textContent = 'Start speaking';
  $('#recording-timer').textContent = '00:00';
  resetWaveform();
  if (state.audioContext) state.audioContext.close().catch(() => {});
  state.audioContext = null;
  state.analyser = null;
}

function stopMediaTracks() {
  state.mediaStream?.getTracks().forEach((track) => track.stop());
  state.mediaStream = null;
}

function updateTimer() {
  const seconds = Math.floor((Date.now() - state.recordingStartedAt) / 1000);
  $('#recording-timer').textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function startRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    $('#browser-recognition').checked = false;
    return toast('Browser live transcription is not supported here. Audio will still be saved.', 'error');
  }
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = navigator.language || 'en-US';
  let committed = $('#note-text').value.trim();
  recognition.onresult = (event) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const chunk = event.results[i][0].transcript;
      if (event.results[i].isFinal) committed = `${committed} ${chunk}`.trim();
      else interim += chunk;
    }
    $('#note-text').value = `${committed}${interim ? ` ${interim}` : ''}`.trim();
    $('#transcript-status').textContent = interim ? 'Listening and drafting…' : 'Live transcript current';
    updateWordCount();
  };
  recognition.onerror = (event) => { $('#transcript-status').textContent = `Browser transcription: ${event.error}`; };
  recognition.onend = () => { if (state.recognitionActive && state.mediaRecorder?.state === 'recording') recognition.start(); };
  recognition.start();
  state.recognition = recognition;
  state.recognitionActive = true;
}

function stopRecognition() {
  state.recognitionActive = false;
  try { state.recognition?.stop(); } catch {}
  state.recognition = null;
  $('#transcript-status').textContent = 'Edit the text before sending';
}

async function blobToBase64(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(binary);
}

function updateWordCount() {
  $('#word-count').textContent = `${wordCount($('#note-text').value)} words`;
}

async function submitNote() {
  if (!state.project) return;
  if (state.mediaRecorder?.state === 'recording') stopRecording();
  const transcript = $('#note-text').value.trim();
  if (!transcript && !state.audioBlob) return toast('Record audio or enter text before sending.', 'error');
  const button = $('#send-note');
  button.disabled = true;
  button.textContent = 'Sending…';
  try {
    const payload = { transcript, source: window.matchMedia('(max-width: 760px)').matches ? 'taurus-pocket' : 'taurus-desk' };
    if (state.audioBlob) {
      payload.audioBase64 = await blobToBase64(state.audioBlob);
      payload.audioMime = state.audioBlob.type;
    }
    const note = await api(`/api/projects/${encodeURIComponent(state.project.id)}/notes`, { method: 'POST', body: payload });
    $('#note-text').value = '';
    state.audioBlob = null;
    $('#audio-attached').textContent = 'No audio attached';
    $('#audio-status').textContent = 'Microphone idle';
    updateWordCount();
    toast(`Note ${note.sequence} entered the project queue`);
    await refreshProjectData({ quiet: true });
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    button.disabled = false;
    button.textContent = 'Send to project queue';
  }
}

async function buildNow() {
  if (!state.project) return;
  const buttons = ['#make-now', '#make-empty-button', '#rebuild-artifact'].map((s) => $(s)).filter(Boolean);
  buttons.forEach((b) => { b.disabled = true; });
  $('#build-state').textContent = 'Building…';
  $('#build-detail').textContent = 'Assembling the latest canonical specification.';
  try {
    const artifact = await api(`/api/projects/${encodeURIComponent(state.project.id)}/build`, { method: 'POST', body: {} });
    if (artifact.scheduled) {
      toast(`Make scheduled after ${artifact.pending} queued item${artifact.pending === 1 ? '' : 's'}`);
      $('#build-state').textContent = 'Make scheduled';
      $('#build-detail').textContent = 'Forge will build immediately after the queue is clear.';
    } else {
      toast(`Artifact v${artifact.version} built`);
    }
    await refreshProjectData({ quiet: true });
    setTab('make');
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    buttons.forEach((b) => { b.disabled = false; });
  }
}


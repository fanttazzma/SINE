let audioCtx = null;
let muted = localStorage.getItem('raiz.muted') === '1';

function ensureCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  return audioCtx;
}

function tone(freq, duration = 0.12, type = 'sine', gain = 0.035, delay = 0) {
  if (muted) return;
  const ctx = ensureCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  const t0 = ctx.currentTime + delay;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export function playClick() {
  tone(520, 0.06, 'sine', 0.02);
}

export function playCorrect() {
  tone(660, 0.12, 'sine', 0.04, 0);
  tone(880, 0.18, 'sine', 0.035, 0.09);
}

export function playWrong() {
  tone(220, 0.16, 'triangle', 0.03, 0);
  tone(180, 0.2, 'triangle', 0.025, 0.11);
}

export function playComplete() {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.3, 'sine', 0.035, i * 0.11));
}

export function playUnlock() {
  tone(784, 0.12, 'sine', 0.03, 0);
  tone(1046, 0.22, 'sine', 0.03, 0.1);
}

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  localStorage.setItem('raiz.muted', muted ? '1' : '0');
  if (!muted) playClick();
  return muted;
}

let voices = [];
let preferredVoice = null;
const VOICE_KEY = 'raiz.voiceURI';

const FEMALE_NAMES =
  /(sabina|helena|laura|paulina|monica|mónica|dalia|elvira|marisol|sofia|sofía|carmen|lucia|lucía|isabel|valentina|renata|camila|gabriela|female|mujer|google español)/i;
const MALE_NAMES = /(pablo|raul|raúl|jorge|diego|enrique|carlos|miguel|pedro|juan|male|hombre)/i;

function voiceURI(v) {
  return v?.voiceURI || v?.name || '';
}

function spanishVoice(v) {
  return /^es([-_]|$)/i.test(v?.lang || '');
}

function voiceScore(v) {
  const name = v?.name || '';
  const lang = v?.lang || '';
  let score = 0;
  if (/^es/i.test(lang)) score += 100;
  if (/es-MX/i.test(lang)) score += 50;
  if (/es-US/i.test(lang)) score += 20;
  if (FEMALE_NAMES.test(name)) score += 70;
  if (/google español/i.test(name)) score += 20;
  if (MALE_NAMES.test(name)) score -= 90;
  if (/natural|neural/i.test(name)) score += 15;
  if (v?.localService) score += 30;
  if (v?.default) score += 5;
  return score;
}

function sortVoices(list) {
  return [...list].sort((a, b) => voiceScore(b) - voiceScore(a));
}

function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  const all = window.speechSynthesis.getVoices() || [];
  voices = sortVoices(all.filter(spanishVoice));
  let saved = '';
  try {
    saved = localStorage.getItem(VOICE_KEY) || '';
  } catch {
    // Sin almacenamiento: se elige la mejor voz disponible.
  }
  const savedVoice = voices.find((v) => voiceURI(v) === saved);
  const naturalFemale = voices.find(
    (v) => /natural|neural/i.test(v.name) && FEMALE_NAMES.test(v.name)
  );
  preferredVoice =
    savedVoice ||
    (navigator.onLine && naturalFemale ? naturalFemale : null) ||
    voices[0] ||
    null;
}

if ('speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
}

export function speechSupported() {
  return 'speechSynthesis' in window;
}

export function getVoiceOptions() {
  return voices.map((v) => ({
    uri: voiceURI(v),
    name: v.name,
    lang: v.lang,
    local: Boolean(v.localService),
  }));
}

export function getSelectedVoiceURI() {
  return voiceURI(preferredVoice);
}

export function setPreferredVoice(uri) {
  const found = voices.find((v) => voiceURI(v) === uri);
  if (!found) return;
  preferredVoice = found;
  try {
    localStorage.setItem(VOICE_KEY, uri);
  } catch {
    // Sin almacenamiento: se mantiene en memoria.
  }
}

export function speak(text, onState) {
  if (!speechSupported() || !text) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const voice = preferredVoice || sortVoices((window.speechSynthesis.getVoices() || []).filter(spanishVoice))[0] || null;
  utter.lang = voice?.lang || 'es-MX';
  if (voice) utter.voice = voice;
  utter.rate = 0.92;
  utter.pitch = 1.06;
  utter.volume = 1;
  utter.onstart = () => onState?.(true);
  utter.onend = () => onState?.(false);
  utter.onerror = () => onState?.(false);
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if (speechSupported()) window.speechSynthesis.cancel();
}

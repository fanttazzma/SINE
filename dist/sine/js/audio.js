let audioCtx = null;
let muted = (localStorage.getItem('sine.muted') ?? localStorage.getItem('raiz.muted')) === '1';

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
  localStorage.setItem('sine.muted', muted ? '1' : '0');
  if (!muted) playClick();
  return muted;
}

let voices = [];
let preferredVoice = null;

function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  voices = window.speechSynthesis.getVoices();
  preferredVoice =
    voices.find((v) => /es-MX/i.test(v.lang)) ||
    voices.find((v) => /es-US/i.test(v.lang)) ||
    voices.find((v) => /^es/i.test(v.lang)) ||
    null;
}

if ('speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
}

export function speechSupported() {
  return 'speechSynthesis' in window;
}

export function speak(text, onState) {
  if (!speechSupported() || !text) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = preferredVoice?.lang || 'es-MX';
  if (preferredVoice) utter.voice = preferredVoice;
  utter.rate = 0.95;
  utter.pitch = 1.02;
  utter.volume = 1;
  utter.onstart = () => onState?.(true);
  utter.onend = () => onState?.(false);
  utter.onerror = () => onState?.(false);
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if (speechSupported()) window.speechSynthesis.cancel();
}

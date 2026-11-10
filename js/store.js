import { LESSONS, GRADES, SUBJECTS } from '../data/curriculum.js';

const KEY = 'raiz.progress.v1';
const DAY = 24 * 60 * 60 * 1000;

const defaultState = () => ({
  name: 'Explorador',
  xp: 0,
  completed: {},
  scores: {},
  badges: [],
  lastDay: null,
  streak: 0,
  visits: 0,
  lastLesson: null,
  challengeBest: 0,
  challengeScore: 0,
  challengePlays: 0,
  voiceAuto: false,
  createdAt: new Date().toISOString(),
});

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed, completed: parsed.completed || {}, scores: parsed.scores || {}, badges: parsed.badges || [] };
  } catch {
    return defaultState();
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Si el navegador bloquea localStorage, la app sigue funcionando en memoria.
  }
}

function dayKey(date = new Date()) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function diffDays(a, b) {
  const da = new Date(a + 'T12:00:00');
  const db = new Date(b + 'T12:00:00');
  return Math.round((db - da) / DAY);
}

export const BADGES = [
  {
    id: 'primer-paso',
    name: 'Primer paso',
    desc: 'Completa tu primera misión.',
    icon: 'spark',
    check: (s) => Object.keys(s.completed).length >= 1,
  },
  {
    id: 'racha-3',
    name: 'Racha de 3',
    desc: 'Entra tres días seguidos.',
    icon: 'flame',
    check: (s) => s.streak >= 3,
  },
  {
    id: 'mate',
    name: 'Mente matemática',
    desc: 'Completa una misión de Matemáticas.',
    icon: 'sigma',
    check: (s) => hasSubject(s, 'matematicas'),
  },
  {
    id: 'ciencia',
    name: 'Ojo de científico',
    desc: 'Completa una misión de Ciencias.',
    icon: 'flask',
    check: (s) => hasSubject(s, 'ciencias'),
  },
  {
    id: 'historia',
    name: 'Viajero del tiempo',
    desc: 'Completa una misión de Historia.',
    icon: 'column',
    check: (s) => hasSubject(s, 'historia'),
  },
  {
    id: 'geo',
    name: 'Lector de mapas',
    desc: 'Completa una misión de Geografía.',
    icon: 'globe',
    check: (s) => hasSubject(s, 'geografia'),
  },
  {
    id: 'lengua',
    name: 'Voz propia',
    desc: 'Completa una misión de Lengua.',
    icon: 'book',
    check: (s) => hasSubject(s, 'lengua'),
  },
  {
    id: 'programacion',
    name: 'Pensamiento computacional',
    desc: 'Completa una misión de Programación.',
    icon: 'code',
    check: (s) => hasSubject(s, 'programacion'),
  },
  {
    id: 'perfecto',
    name: 'Sin errores',
    desc: 'Responde todo bien en una misión.',
    icon: 'target',
    check: (s) => Object.values(s.scores).some((n) => n >= 100),
  },
  {
    id: 'coleccionista',
    name: 'Coleccionista',
    desc: 'Completa cinco misiones.',
    icon: 'layers',
    check: (s) => Object.keys(s.completed).length >= 5,
  },
  {
    id: 'reto',
    name: 'Relámpago',
    desc: 'Acierta 8 o más en el reto rápido.',
    icon: 'bolt',
    check: (s) => s.challengeBest >= 8,
  },
  {
    id: 'grado-1',
    name: 'Explorador de 1º de secundaria',
    desc: 'Completa las cuatro misiones de 1º de secundaria.',
    icon: 'medal',
    check: (s) => gradeDone(s, 's1') === 4,
  },
  {
    id: 'primaria',
    name: 'Explorador de primaria',
    desc: 'Completa una misión de cada grado de primaria.',
    icon: 'layers',
    check: (s) =>
      GRADES.filter((g) => g.level === 'primaria').every((g) =>
        LESSONS.some((l) => l.gradeId === g.id && s.completed[l.id])
      ),
  },
  {
    id: 'raiz-completa',
    name: 'Raíz completa',
    desc: 'Completa las cuarenta y dos misiones.',
    icon: 'crown',
    check: (s) => Object.keys(s.completed).length >= LESSONS.length,
  },
];

function hasSubject(s, subject) {
  return LESSONS.some((l) => l.subject === subject && s.completed[l.id]);
}

function gradeDone(s, gradeId) {
  return LESSONS.filter((l) => l.gradeId === gradeId && s.completed[l.id]).length;
}

function unlockedBadges(s) {
  return BADGES.filter((b) => {
    try {
      return b.check(s);
    } catch {
      return false;
    }
  }).map((b) => b.id);
}

function syncBadges() {
  const unlocked = unlockedBadges(state);
  const nuevos = unlocked.filter((id) => !state.badges.includes(id));
  state.badges = unlocked;
  return nuevos;
}

export function touchVisit() {
  const today = dayKey();
  if (!state.lastDay) {
    state.streak = 1;
    state.lastDay = today;
    state.visits += 1;
    save();
    return;
  }
  if (state.lastDay === today) return;
  const delta = diffDays(state.lastDay, today);
  state.streak = delta === 1 ? Math.max(1, state.streak + 1) : 1;
  state.lastDay = today;
  state.visits += 1;
  syncBadges();
  save();
}

export function completeLesson(lesson, score = 100) {
  const isNew = !state.completed[lesson.id];
  const best = Math.max(state.scores[lesson.id] || 0, score);
  state.scores[lesson.id] = best;
  state.completed[lesson.id] = {
    at: new Date().toISOString(),
    score: best,
  };
  state.lastLesson = lesson.id;
  if (isNew) state.xp += lesson.xp;
  const newBadges = syncBadges();
  save();
  return {
    isNew,
    xp: isNew ? lesson.xp : 0,
    best,
    newBadges: newBadges.map((id) => BADGES.find((b) => b.id === id)).filter(Boolean),
  };
}

export function completeChallenge(correct, score) {
  const isRecord = correct > state.challengeBest || score > state.challengeScore;
  state.challengeBest = Math.max(state.challengeBest, correct);
  state.challengeScore = Math.max(state.challengeScore, score);
  state.challengePlays += 1;
  state.xp += correct * 2;
  const newBadges = syncBadges();
  save();
  return {
    isRecord,
    best: state.challengeBest,
    bestScore: state.challengeScore,
    xp: correct * 2,
    newBadges: newBadges.map((id) => BADGES.find((b) => b.id === id)).filter(Boolean),
  };
}

export function getChallengeBest() {
  return { correct: state.challengeBest, score: state.challengeScore, plays: state.challengePlays };
}

export function isVoiceAuto() {
  return Boolean(state.voiceAuto);
}

export function setVoiceAuto(value) {
  state.voiceAuto = Boolean(value);
  save();
}

export function getState() {
  return state;
}

export function getCompletedCount() {
  return Object.keys(state.completed).length;
}

export function isLessonDone(id) {
  return Boolean(state.completed[id]);
}

export function getScore(id) {
  return state.scores[id] || 0;
}

export function getSubjectProgress(gradeId, subject) {
  const lessons = LESSONS.filter((l) => l.gradeId === gradeId && l.subject === subject);
  const done = lessons.filter((l) => state.completed[l.id]).length;
  return { done, total: lessons.length, pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0 };
}

export function getSubjectProgressGlobal(subject) {
  const lessons = LESSONS.filter((l) => l.subject === subject);
  const done = lessons.filter((l) => state.completed[l.id]).length;
  return { done, total: lessons.length, pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0 };
}

export function getGradeProgress(gradeId) {
  const lessons = LESSONS.filter((l) => l.gradeId === gradeId);
  const done = lessons.filter((l) => state.completed[l.id]).length;
  return { done, total: lessons.length, pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0 };
}

export function getLevelProgressByGrade(gradeId) {
  return getGradeProgress(gradeId);
}

export function getTotalProgress() {
  const done = getCompletedCount();
  return { done, total: LESSONS.length, pct: Math.round((done / LESSONS.length) * 100) };
}

export function getLevel() {
  const level = Math.floor(state.xp / 400) + 1;
  const current = state.xp % 400;
  return { level, current, next: 400, pct: Math.round((current / 400) * 100) };
}

export function getStreak() {
  return state.streak || 0;
}

export function setName(name) {
  const limpio = String(name || '').trim().slice(0, 24);
  if (!limpio) return;
  state.name = limpio;
  save();
}

export function resetProgress() {
  const name = state.name;
  state = { ...defaultState(), name };
  save();
}

export function getSubjectMeta(subject) {
  return SUBJECTS[subject];
}

export function getGradeMeta(gradeId) {
  return GRADES.find((g) => g.id === gradeId);
}

export function getLastLesson() {
  return state.lastLesson ? LESSONS.find((l) => l.id === state.lastLesson) : null;
}

export { KEY };

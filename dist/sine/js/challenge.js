import { LESSONS, SUBJECTS, GRADES } from '../data/curriculum.js';
import { getChallengeBest, completeChallenge } from './store.js';
import { icon, subjectIcon, escapeHTML, badgeIcon, confetti } from './ui.js';
import { playClick, playCorrect, playWrong } from './audio.js';

const TOTAL = 10;
const DURATION = 60;

let timer = null;
let nextTimer = null;
let challenge = null;
let root = null;
let keyHandler = null;

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildPool() {
  const pool = [];
  for (const lesson of LESSONS) {
    for (const step of lesson.steps) {
      if (step.type !== 'quiz') continue;
      for (const q of step.questions) {
        pool.push({
          ...q,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          subject: lesson.subject,
          gradeId: lesson.gradeId,
        });
      }
    }
  }
  return pool;
}

export function renderChallengePage() {
  return `<div class="crumbs"><a href="#/">Inicio</a>${icon('chevronRight')}<span>Reto rápido</span></div>
    <div id="challenge-root"></div>`;
}

export function mountChallenge() {
  root = document.getElementById('challenge-root');
  if (!root) return null;

  challenge = null;
  startScreen();

  const onClick = (event) => {
    const el = event.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;
    if (act === 'challenge-start') {
      playClick();
      begin();
    } else if (act === 'challenge-answer') {
      answer(Number(el.dataset.index));
    } else if (act === 'challenge-again') {
      playClick();
      startScreen();
    }
  };

  keyHandler = (event) => {
    if (!challenge || challenge.finished || challenge.answered) return;
    const n = Number(event.key);
    if (n >= 1 && n <= 4) answer(n - 1);
  };

  root.addEventListener('click', onClick);
  document.addEventListener('keydown', keyHandler);

  return () => {
    clearInterval(timer);
    clearTimeout(nextTimer);
    timer = null;
    nextTimer = null;
    challenge = null;
    root?.removeEventListener('click', onClick);
    document.removeEventListener('keydown', keyHandler);
  };
}

function startScreen() {
  const best = getChallengeBest();
  challenge = null;
  root.innerHTML = `<section class="challenge-start">
    <div class="challenge-start__visual">${icon('bolt', 54)}</div>
    <span class="section__eyebrow">Reto rápido · sin conexión</span>
    <h1 class="challenge-start__title">10 preguntas.<br /><span class="grad-text">60 segundos.</span></h1>
    <p class="challenge-start__lead">Un reto relámpago con preguntas de todas las materias. Cada acierto suma puntos y acerca a Luci a la meta.</p>
    <div class="challenge-start__rules">
      <span>${icon('target', 15)} 10 preguntas</span>
      <span>${icon('clock', 15)} 60 segundos</span>
      <span>${icon('bolt', 15)} +10 por acierto</span>
    </div>
    <button class="btn btn--primary btn--large" data-act="challenge-start">${icon('play', 18)} Empezar reto</button>
    <p class="challenge-start__best">Mejor marca: <strong>${best.correct}/10</strong> · ${best.score} puntos${best.plays ? ` · ${best.plays} intentos` : ''}</p>
    <p class="challenge-start__note">Las preguntas salen de las 33 misiones. Puedes jugar con teclado: teclas 1 a 4.</p>
  </section>`;
}

function begin() {
  const questions = shuffle(buildPool()).slice(0, TOTAL);
  challenge = {
    questions,
    index: 0,
    correct: 0,
    score: 0,
    streak: 0,
    answered: false,
    finished: false,
    timeLeft: DURATION,
  };
  clearInterval(timer);
  clearTimeout(nextTimer);
  timer = setInterval(tick, 1000);
  renderQuestion();
}

function tick() {
  if (!challenge || challenge.finished) return;
  challenge.timeLeft -= 1;
  const el = document.getElementById('challenge-time');
  if (el) el.textContent = `${challenge.timeLeft}s`;
  if (challenge.timeLeft <= 0) finish('time');
}

function renderQuestion() {
  const c = challenge;
  const q = c.questions[c.index];
  const s = SUBJECTS[q.subject];
  const g = GRADES.find((x) => x.id === q.gradeId);
  c.answered = false;
  root.innerHTML = `<section class="challenge-game">
    <div class="challenge-bar">
      <span class="challenge-bar__count">Pregunta <b>${c.index + 1}</b>/${TOTAL}</span>
      <span class="challenge-bar__timer" id="challenge-time">${c.timeLeft}s</span>
      <span class="challenge-bar__score">${icon('bolt', 13)} <b id="challenge-score">${c.score}</b> pts</span>
    </div>
    <div class="challenge-progress"><span style="width:${((c.index + 1) / TOTAL) * 100}%"></span></div>
    <div class="challenge-question" style="--c1:${s.color};--c2:${s.color2}">
      <div class="challenge-question__meta">
        <span class="challenge-question__icon">${subjectIcon(q.subject)}</span>
        <span>${escapeHTML(s.name)} · ${escapeHTML(g?.label || '')} ${g?.level === 'primaria' ? 'primaria' : 'secundaria'}</span>
      </div>
      <h2 class="challenge-question__text">${escapeHTML(q.q)}</h2>
      <div class="challenge-options">
        ${q.options
          .map(
            (opt, i) => `<button class="challenge-option" type="button" data-act="challenge-answer" data-index="${i}">
              <span class="challenge-option__key">${i + 1}</span>
              <span>${escapeHTML(opt)}</span>
            </button>`
          )
          .join('')}
      </div>
      <div class="challenge-feedback" id="challenge-feedback" role="status" aria-live="polite"></div>
    </div>
    <p class="challenge-hint">${c.streak >= 2 ? `${icon('flame', 13)} Racha de ${c.streak} aciertos` : 'Toca una respuesta o usa las teclas 1 a 4.'}</p>
  </section>`;
}

function answer(index) {
  if (!challenge || challenge.finished || challenge.answered) return;
  challenge.answered = true;
  const q = challenge.questions[challenge.index];
  const correct = index === q.correct;
  const feedback = document.getElementById('challenge-feedback');
  const buttons = root.querySelectorAll('.challenge-option');
  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === q.correct) button.classList.add('is-correct');
    if (i === index && !correct) button.classList.add('is-wrong');
    if (i === index) button.classList.add('is-picked');
  });

  if (correct) {
    challenge.correct += 1;
    challenge.streak += 1;
    challenge.score += 10 + (challenge.streak >= 3 ? 2 : 0);
    playCorrect();
    if (feedback) {
      feedback.className = 'challenge-feedback is-correct';
      feedback.innerHTML = `<strong>¡Correcto!</strong> ${escapeHTML(q.explain)}`;
    }
  } else {
    challenge.streak = 0;
    playWrong();
    if (feedback) {
      feedback.className = 'challenge-feedback is-wrong';
      feedback.innerHTML = `<strong>No era esa.</strong> ${escapeHTML(q.explain)}`;
    }
  }
  const scoreEl = document.getElementById('challenge-score');
  if (scoreEl) scoreEl.textContent = challenge.score;

  clearTimeout(nextTimer);
  nextTimer = setTimeout(() => {
    if (!challenge || challenge.finished) return;
    challenge.index += 1;
    if (challenge.index >= TOTAL) finish('complete');
    else renderQuestion();
  }, 900);
}

function finish(reason) {
  if (!challenge || challenge.finished) return;
  challenge.finished = true;
  clearInterval(timer);
  clearTimeout(nextTimer);
  const result = completeChallenge(challenge.correct, challenge.score);
  if (challenge.correct >= 8) confetti();
  const best = getChallengeBest();
  root.innerHTML = `<section class="challenge-result">
    <div class="challenge-result__badge">${icon(reason === 'time' ? 'clock' : 'bolt', 36)}</div>
    <span class="section__eyebrow">${reason === 'time' ? 'Se acabó el tiempo' : 'Reto completado'}</span>
    <h1 class="challenge-result__title">${challenge.correct >= 8 ? '¡Nivel relámpago!' : challenge.correct >= 5 ? '¡Buen ritmo!' : 'Sigue practicando'}</h1>
    <div class="challenge-result__score"><b>${challenge.score}</b><span>puntos</span></div>
    <div class="challenge-result__stats">
      <div><b>${challenge.correct}/${TOTAL}</b><span>Aciertos</span></div>
      <div><b>${best.correct}/${TOTAL}</b><span>Tu mejor marca</span></div>
      <div><b>+${result.xp}</b><span>XP</span></div>
    </div>
    ${result.isRecord ? `<p class="challenge-result__record">${icon('sparkles', 15)} ¡Nuevo récord personal!</p>` : ''}
    ${result.newBadges.length ? `<div class="challenge-result__badges">${result.newBadges.map((b) => `<span class="challenge-result__badge-pill">${badgeIcon(b.icon)} ${b.name}</span>`).join('')}</div>` : ''}
    <div class="challenge-result__actions">
      <button class="btn btn--primary" type="button" data-act="challenge-again">${icon('refresh', 16)} Otro reto</button>
      <a class="btn btn--ghost" href="#/cuaderno">${icon('notebook', 16)} Ver mi cuaderno</a>
    </div>
    <p class="challenge-result__note">Mejor puntaje: ${best.score} pts · ${best.plays} intentos · Todo se guardó en este dispositivo.</p>
  </section>`;
}

import { GRADES, SUBJECTS, LESSONS, getLesson } from '../data/curriculum.js';
import {
  getScore,
  completeLesson,
  isLessonDone,
  isVoiceAuto,
  setVoiceAuto,
} from './store.js';
import {
  icon,
  sceneSVG,
  escapeHTML,
  toast,
  confetti,
} from './ui.js';
import {
  speak,
  stopSpeaking,
  speechSupported,
  playClick,
  playCorrect,
  playWrong,
  playComplete,
  playUnlock,
} from './audio.js';

let session = null;

function subjectMeta(lesson) {
  return SUBJECTS[lesson.subject];
}
function gradeMeta(lesson) {
  return GRADES.find((g) => g.id === lesson.gradeId);
}

export function renderLessonPage(id) {
  const lesson = getLesson(id);
  if (!lesson) {
    return `<div class="lesson-shell"><div class="card" style="padding:50px;text-align:center">
      <h1 style="font-family:var(--font-display);font-size:2rem">Misión no encontrada</h1>
      <p style="color:var(--muted);margin-top:10px">Esa misión no existe o cambió de lugar.</p>
      <a class="btn btn--primary" href="#/grado/p1" style="margin-top:20px">${icon('home', 16)} Volver</a>
    </div></div>`;
  }
  const s = subjectMeta(lesson);
  const g = gradeMeta(lesson);
  const done = isLessonDone(lesson.id);
  return `<div class="lesson-shell" style="--c1:${s.color};--c2:${s.color2}">
    <div class="lesson-top">
      <div class="lesson-top__left">
        <a class="lesson-back" href="#/grado/${g.id}/${lesson.subject}" aria-label="Volver a ${escapeHTML(s.name)}">${icon('arrowLeft', 18)}</a>
        <div class="lesson-title">
          <div class="lesson-title__eyebrow">${escapeHTML(s.name)} · ${g.label} ${g.level === 'primaria' ? 'primaria' : 'secundaria'}</div>
          <div class="lesson-title__name">${escapeHTML(lesson.title)}</div>
        </div>
      </div>
      <div class="lesson-top__right">
        ${done ? `<span class="pill" style="color:var(--lime)">${icon('check', 12)} Completada</span>` : ''}
        <button class="voice-toggle ${isVoiceAuto() ? 'is-on' : ''}" type="button" data-act="voice-auto" aria-pressed="${isVoiceAuto()}" aria-label="Activar o desactivar Modo cuento" title="Leer cada paso en voz alta">
          ${icon('book', 15)}<span>Modo cuento</span>
        </button>
        <button class="icon-btn" id="lesson-speak" data-act="speak" aria-label="Escuchar esta misión">${icon('volume', 18)}</button>
        <span class="xp-pill">${icon('bolt', 14)} ${lesson.xp} XP</span>
      </div>
    </div>
    <div class="lesson-progress">
      <div class="lesson-progress__bar"><span id="lesson-bar"></span></div>
      <span class="lesson-progress__label" id="lesson-step-label">Paso 1 de ${lesson.steps.length}</span>
    </div>
    <div id="lesson-root" data-lesson="${lesson.id}"></div>
  </div>`;
}

export function mountLesson(id) {
  const lesson = getLesson(id);
  const root = document.getElementById('lesson-root');
  if (!lesson || !root) return null;

  stopSpeaking();
  session = {
    lesson,
    stepIndex: 0,
    initialized: {},
    feedback: null,
    solved: false,
    found: new Set(),
    lastSpot: null,
    visited: new Set(),
    timelineDetail: null,
    sortSelected: null,
    sortPlaced: {},
    sortAttempts: 0,
    decisionChoice: null,
    nlValue: 0,
    balanceX: 0,
    graphM: 0,
    graphB: 0,
    forceMass: 5,
    forceForce: 0,
    fractionNum: 1,
    fractionDen: 2,
    codeProgram: [],
    codePos: null,
    codeTrail: [],
    codeRunning: false,
    codeError: null,
    codeRunToken: 0,
    storyChoice: null,
    autoSpokenStep: -1,
    quizIndex: 0,
    quizAnswered: false,
    quizSelected: null,
    quizCorrect: 0,
    quizTotal: 0,
    quizDone: false,
    finished: false,
    result: null,
    cleanup: null,
  };

  const step0 = lesson.steps[0];
  session.nlValue = step0.type === 'numberline' ? step0.start : 0;
  if (step0.type === 'balance') session.balanceX = 0;
  if (step0.type === 'graph') {
    session.graphM = 0;
    session.graphB = 0;
  }
  if (step0.type === 'force') {
    session.forceMass = step0.targetMass;
    session.forceForce = 0;
  }
  const quizStep = lesson.steps.find((s) => s.type === 'quiz');
  session.quizTotal = quizStep?.questions?.length || 0;

  const shellEl = root.closest('.lesson-shell');
  const onClick = (e) => handleClick(e);
  const onInput = (e) => handleInput(e);
  const eventHost = shellEl || root;
  eventHost.addEventListener('click', onClick);
  eventHost.addEventListener('input', onInput);

  session.cleanup = () => {
    eventHost.removeEventListener('click', onClick);
    eventHost.removeEventListener('input', onInput);
    stopSpeaking();
  };

  renderCurrent();
  return session.cleanup;
}

function currentStep() {
  return session.lesson.steps[session.stepIndex];
}

function updateProgress() {
  const total = session.lesson.steps.length;
  const pct = Math.round(((session.stepIndex + 1) / total) * 100);
  const bar = document.getElementById('lesson-bar');
  const label = document.getElementById('lesson-step-label');
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = `Paso ${session.stepIndex + 1} de ${total}`;
}

function initStep(step) {
  if (session.initialized[session.stepIndex]) return;
  session.initialized[session.stepIndex] = true;
  if (step.type === 'numberline') session.nlValue = step.start;
  if (step.type === 'balance') session.balanceX = 0;
  if (step.type === 'graph') {
    session.graphM = 0;
    session.graphB = 0;
  }
  if (step.type === 'force') {
    session.forceMass = step.targetMass;
    session.forceForce = 0;
  }
  if (step.type === 'fraction') {
    session.fractionNum = 1;
    session.fractionDen = 2;
  }
  if (step.type === 'code') {
    session.codeProgram = [...(step.preset || [])];
    session.codePos = { ...step.start };
    session.codeTrail = [[step.start.x, step.start.y]];
    session.codeRunning = false;
    session.codeError = null;
  }
  if (step.type === 'story') {
    session.storyChoice = null;
    session.solved = false;
    session.feedback = null;
  }
}

function renderCurrent() {
  const root = document.getElementById('lesson-root');
  if (!root) return;
  updateProgress();
  const step = currentStep();
  initStep(step);

  if (step.type === 'summary') {
    renderSummary(root);
    return;
  }

  const stage = stageFor(step);
  const panel = panelFor(step);
  root.innerHTML = `<div class="lesson-grid">
    <div class="stage" id="stage">${stage}</div>
    <div class="panel" id="panel">${panel}</div>
  </div>`;
  const speakBtn = document.getElementById('lesson-speak');
  if (speakBtn) {
    speakBtn.dataset.speak = narrationForStep(step) || step.narration || step.text || step.instruction || step.title || '';
    speakBtn.classList.remove('is-speaking');
    speakBtn.innerHTML = icon('volume', 18);
  }
  bindControls();
  if (isVoiceAuto() && speechSupported() && session.autoSpokenStep !== session.stepIndex) {
    session.autoSpokenStep = session.stepIndex;
    const text = narrationForStep(step);
    const index = session.stepIndex;
    if (text) {
      setTimeout(() => {
        if (session && session.stepIndex === index && isVoiceAuto()) speak(text);
      }, 450);
    }
  }
}

function feedbackHTML() {
  if (!session.feedback) return '';
  const type = session.feedback.type === 'correct' ? 'is-correct' : 'is-wrong';
  return `<div class="quiz-feedback ${type}" role="status">${session.feedback.text}</div>`;
}

function speakButton(text, label = 'Escuchar') {
  if (!speechSupported()) return '';
  return `<button class="speech-btn" type="button" data-act="speak" data-label="${escapeHTML(label)}" data-speak="${escapeHTML(text || '')}">${icon('volume', 14)} ${label}</button>`;
}

function storyNarration(step) {
  return `${(step.paragraphs || []).join(' ')} ${step.question || ''}`.trim();
}

function narrationForStep(step) {
  if (!step) return '';
  if (step.type === 'story') return storyNarration(step);
  if (step.type === 'quiz') {
    const q = step.questions[session.quizIndex];
    if (!q) return 'Reto completado.';
    return `${q.q} Opciones: ${q.options.join(', ')}.`;
  }
  if (step.type === 'intro') return step.narration || step.text || '';
  if (step.type === 'summary') return step.text || '';
  return step.instruction || step.text || step.title || '';
}

function panelFooter({ enabled = true, label = 'Continuar', hint = '', checkAct = null, checkLabel = 'Comprobar' }) {
  if (!enabled && !checkAct) {
    return `<div class="panel__footer"><span class="panel__hint">${hint}</span><button class="btn btn--primary" disabled>${label} ${icon('arrowRight', 15)}</button></div>`;
  }
  if (checkAct && !session.solved) {
    return `<div class="panel__footer"><span class="panel__hint">${hint}</span><button class="btn btn--primary" data-act="${checkAct}">${icon('check', 15)} ${checkLabel}</button></div>`;
  }
  return `<div class="panel__footer"><span class="panel__hint">${hint}</span><button class="btn btn--primary" data-act="next">${label} ${icon('arrowRight', 15)}</button></div>`;
}

/* ---------- Stage builders ---------- */

function stageFor(step) {
  const lesson = session.lesson;
  const s = subjectMeta(lesson);
  if (step.type === 'intro') {
    return `<div class="stage__glow"></div>
      <div class="stage__scene">${sceneSVG(lesson.scene, s.color, s.color2)}</div>
      <div class="stage__badge">${icon('compass', 12)} Misión ${String(session.stepIndex + 1).padStart(2, '0')}</div>
      <div class="stage__hint">Una experiencia interactiva de ${escapeHTML(s.name)}</div>`;
  }
  if (step.type === 'numberline') return numberlineStage(step);
  if (step.type === 'fraction') return fractionStage(step);
  if (step.type === 'code') return codeStage(step);
  if (step.type === 'story') return storyStage(step);
  if (step.type === 'balance') return balanceStage(step);
  if (step.type === 'graph') return graphStage(step);
  if (step.type === 'force') return forceStage(step);
  if (step.type === 'hotspots') return hotspotsStage(step);
  if (step.type === 'timeline') return timelineStage(step);
  if (step.type === 'sort') return sortStage(step);
  if (step.type === 'decision') {
    return `<div class="stage__glow"></div>
      <div class="stage__scene">${sceneSVG(lesson.scene, s.color, s.color2)}</div>
      <div class="stage__badge">${icon('compass', 12)} Decisión</div>
      <div class="stage__hint">Piensa en las consecuencias de cada opción.</div>`;
  }
  if (step.type === 'quiz') {
    const q = step.questions[session.quizIndex];
    return `<div class="stage__glow"></div>
      <div class="stage__scene">${sceneSVG(lesson.scene, s.color, s.color2)}</div>
      <div class="stage__badge">${icon('target', 12)} ${q ? `Reto ${session.quizIndex + 1}/${step.questions.length}` : 'Reto completado'}</div>
      <div class="stage__hint">${q ? 'Elige una respuesta y descubre por qué.' : 'Ya respondiste todas las preguntas.'}</div>`;
  }
  return `<div class="stage__glow"></div><div class="stage__scene">${sceneSVG(lesson.scene, s.color, s.color2)}</div>`;
}

function numberlineStage(step) {
  const { min, max } = step;
  const stepSize = Number(step.step) || 1;
  const xFor = (v) => 50 + ((v - min) / (max - min)) * 500;
  let ticks = '';
  for (let v = min; v <= max; v += stepSize) {
    const x = xFor(v);
    const tall = Math.round((v - min) / stepSize) % 2 === 0;
    ticks += `<path d="M${x} 100V${tall ? 112 : 106}" stroke="rgba(255,255,255,${tall ? 0.35 : 0.16})" stroke-width="1.5"/>`;
    if (tall) {
      ticks += `<text x="${x}" y="140" fill="${v === 0 ? '#5eead4' : 'rgba(255,255,255,.5)'}" font-size="15" text-anchor="middle" font-family="Inter, sans-serif">${v}</text>`;
    }
  }
  const x = xFor(session.nlValue);
  return `<div class="stage__badge">${icon('route', 12)} Recta numérica</div>
    <div class="sim-stage">
    <div class="numberline" style="padding:0 18px">
      <svg viewBox="0 0 600 190" aria-label="Recta numérica de ${min} a ${max}">
        <path d="M40 100h520" stroke="rgba(255,255,255,.25)" stroke-width="2"/>
        <path d="M560 100l-10-5v10l10-5Z" fill="rgba(255,255,255,.35)"/>
        <path d="M40 100l10-5v10l-10-5Z" fill="rgba(255,255,255,.35)"/>
        ${ticks}
        <g id="nl-marker" transform="translate(${x},100)">
          <circle r="18" fill="rgba(94,234,212,.1)"/>
          <circle r="7" fill="#5eead4"/>
          <path d="M0 12v22" stroke="#5eead4" stroke-width="2" stroke-dasharray="3 4"/>
          <text y="52" fill="#5eead4" font-size="16" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-weight="700">${session.nlValue}</text>
        </g>
      </svg>
      <div class="numberline__readout" id="nl-readout">${session.nlValue}<small>${escapeHTML(step.unit || '')}</small></div>
      <div class="numberline__controls">
        <button class="num-btn" type="button" data-act="nl" data-dir="-1" aria-label="Restar 1">−</button>
        <button class="num-btn" type="button" data-act="nl" data-dir="1" aria-label="Sumar 1">+</button>
      </div>
    </div>
    </div>`;
}

function fractionStage(step) {
  const num = session.fractionNum;
  const den = session.fractionDen;
  const cx = 300;
  const cy = 240;
  const r = 150;
  let slices = '';
  for (let i = 0; i < den; i++) {
    const a0 = -Math.PI / 2 + (i * 2 * Math.PI) / den;
    const a1 = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / den;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const d = `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
    slices += `<path class="fraction-slice" data-slice="${i}" d="${d}" fill="${i < num ? 'rgba(94,234,212,.78)' : 'rgba(255,255,255,.055)'}" stroke="rgba(7,10,24,.9)" stroke-width="3"/>`;
  }
  const pct = Math.round((num / den) * 100);
  return `<div class="stage__badge">${icon('sigma', 12)} Fracciones</div>
    <div class="sim-stage">
      <div class="fraction" style="padding:0 20px">
        <svg viewBox="0 0 600 480" aria-label="Círculo dividido en ${den} partes con ${num} sombreadas">
          <circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="8"/>
          ${slices}
          <circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="1"/>
        </svg>
        <div class="fraction__readout" id="fraction-readout"><span>${num}</span><i>/</i><span>${den}</span><small>${pct}%</small></div>
      </div>
    </div>`;
}

function storyStage(step) {
  const s = SUBJECTS[session.lesson.subject];
  const scene = step.scene || session.lesson.scene;
  return `<div class="stage__glow"></div>
    <div class="stage__scene">${sceneSVG(scene, s.color, s.color2)}</div>
    <div class="stage__badge">${icon('book', 12)} Cuento interactivo</div>
    <div class="story-waves" style="--c1:${s.color}" aria-hidden="true">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
    <div class="stage__hint">Escucha la historia y elige con atención.</div>`;
}

function codeStage(step) {
  const cols = step.cols;
  const rows = step.rows;
  const pos = session.codePos || step.start;
  const walls = new Set((step.walls || []).map(([x, y]) => `${x},${y}`));
  const trail = new Set((session.codeTrail || []).map(([x, y]) => `${x},${y}`));
  const goal = `${step.goal.x},${step.goal.y}`;
  let cells = '';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const key = `${x},${y}`;
      const cls = [
        'code-cell',
        walls.has(key) ? 'is-wall' : '',
        key === goal ? 'is-goal' : '',
        trail.has(key) ? 'is-trail' : '',
      ]
        .filter(Boolean)
        .join(' ');
      cells += `<div class="${cls}">${key === goal ? icon('flag', 18) : ''}</div>`;
    }
  }
  const dir = pos.dir * 90;
  return `<div class="stage__badge">${icon('code', 12)} Laboratorio de código</div>
    <div class="code-layout">
      <div class="code-board" style="--cols:${cols};--rows:${rows};aspect-ratio:${cols}/${rows}">
        <div class="code-grid">${cells}</div>
        <div class="code-bot" style="left:${(pos.x / cols) * 100}%;top:${(pos.y / rows) * 100}%;width:${100 / cols}%;height:${100 / rows}%">
          <div class="code-bot__body"><span></span><span></span></div>
          <div class="code-bot__dir" style="transform:rotate(${dir}deg)">${icon('arrowRight', 11)}</div>
        </div>
      </div>
      <div class="code-legend">
        <span class="code-legend__item"><i class="is-bot"></i> Luci</span>
        <span class="code-legend__item"><i class="is-flag"></i> Meta</span>
        <span class="code-legend__item"><i class="is-wall"></i> Pared</span>
      </div>
    </div>`;
}

function balanceStage(step) {
  const x = session.balanceX;
  const left = step.a * x + step.b;
  const right = step.c;
  const diff = left - right;
  const angle = Math.max(-11, Math.min(11, diff * 1.5));
  return `<div class="stage__badge">${icon('sigma', 12)} Balanza algebraica</div>
    <div class="sim-stage">
    <div class="balance" style="padding:0 20px">
      <svg viewBox="0 0 600 380" aria-label="Balanza que representa ${step.a}x + ${step.b} = ${step.c}">
        <path d="M300 150v160M220 320h160" stroke="rgba(255,255,255,.25)" stroke-width="8" stroke-linecap="round"/>
        <circle cx="300" cy="150" r="10" fill="#5eead4"/>
        <g id="balance-beam" transform="rotate(${angle} 300 150)">
          <path d="M150 150h300" stroke="url(#b-beam)" stroke-width="5" stroke-linecap="round"/>
          <path d="M150 150v36M450 150v36" stroke="rgba(255,255,255,.3)" stroke-width="2"/>
          <path d="M100 186h100l-15 26h-70Z" fill="#0d1730" stroke="rgba(255,255,255,.18)"/>
          <path d="M400 186h100l-15 26h-70Z" fill="#0d1730" stroke="rgba(255,255,255,.18)"/>
          <text x="150" y="205" fill="#9aa5c9" font-size="12" text-anchor="middle" font-family="Inter, sans-serif">${step.a}x + ${step.b}</text>
          <text x="450" y="205" fill="#9aa5c9" font-size="12" text-anchor="middle" font-family="Inter, sans-serif">${step.c}</text>
        </g>
        <defs>
          <linearGradient id="b-beam" x1="150" y1="150" x2="450" y2="150" gradientUnits="userSpaceOnUse">
            <stop stop-color="#5eead4"/><stop offset="1" stop-color="#8b5cf6"/>
          </linearGradient>
        </defs>
      </svg>
      <div class="balance__eq" id="balance-eq">${step.a}(${x}) + ${step.b} = <b>${left}</b> &nbsp;|&nbsp; ${step.c}</div>
      <div style="text-align:center;color:var(--dim);font-size:.68rem;margin-top:4px">${diff === 0 ? 'En equilibrio' : 'Desbalanceada'}</div>
    </div>
    </div>`;
}

function graphStage(step) {
  const { mMin, mMax, bMin, bMax, xMax, yMax } = step;
  const m = session.graphM;
  const b = session.graphB;
  const px = (x) => 70 + (x / xMax) * 460;
  const py = (y) => 340 - (y / yMax) * 285;
  const x1 = 0;
  const y1 = b;
  const x2 = xMax;
  const y2 = m * xMax + b;
  let grid = '';
  for (let i = 0; i <= 5; i++) {
    const x = 70 + (i / 5) * 460;
    const y = 55 + (i / 5) * 285;
    grid += `<path d="M${x} 55v285" stroke="rgba(148,163,184,.16)"/><path d="M70 ${y}h460" stroke="rgba(148,163,184,.16)"/>`;
  }
  let labels = '';
  for (let i = 0; i <= 4; i++) {
    const yVal = (yMax / 4) * i;
    labels += `<text x="62" y="${py(yVal) + 3}" fill="rgba(255,255,255,.38)" font-size="9" text-anchor="end" font-family="Inter, sans-serif">${Math.round(yVal)}</text>`;
  }
  for (let xVal = 0; xVal <= xMax; xVal += 2) {
    labels += `<text x="${px(xVal)}" y="356" fill="rgba(255,255,255,.38)" font-size="9" text-anchor="middle" font-family="Inter, sans-serif">${xVal}</text>`;
  }
  return `<div class="stage__badge">${icon('sigma', 12)} Plano cartesiano</div>
    <div class="sim-stage">
    <div class="graph" style="padding:0 16px">
      <svg viewBox="0 0 600 390" aria-label="Gráfica de una función lineal">
        ${grid}
        ${labels}
        <path d="M70 340V55M70 340h460" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
        <path id="graph-line" d="M${px(x1)} ${py(y1)} L${px(x2)} ${py(y2)}" stroke="#5eead4" stroke-width="4" stroke-linecap="round"/>
        <circle cx="${px(x1)}" cy="${py(y1)}" r="5" fill="#bef264"/>
        <text x="540" y="360" fill="rgba(255,255,255,.4)" font-size="11" text-anchor="end">x</text>
        <text x="58" y="62" fill="rgba(255,255,255,.4)" font-size="11" text-anchor="end">y</text>
      </svg>
      <div class="graph__eq" id="graph-eq">y = ${m}x + ${b}</div>
    </div>
    </div>`;
}

function forceStage(step) {
  const mass = session.forceMass;
  const force = session.forceForce;
  const accel = mass > 0 ? force / mass : 0;
  const arrow = Math.max(6, Math.min(150, force * 3));
  return `<div class="stage__badge">${icon('bolt', 12)} Laboratorio de fuerzas</div>
    <div class="sim-stage">
    <div class="force" style="padding:0 20px">
      <svg viewBox="0 0 600 390" aria-label="Carreta en una rampa con fuerza aplicada">
        <path d="M70 330 470 210l60 22-400 120Z" fill="#0c1428" stroke="rgba(255,255,255,.12)"/>
        <path d="M70 330 470 210" stroke="rgba(94,234,212,.65)" stroke-width="3"/>
        <g id="force-cart" transform="translate(300 198) rotate(-17.5)">
          <rect x="0" y="0" width="94" height="56" rx="10" fill="#13233f" stroke="rgba(94,234,212,.4)"/>
          <circle cx="20" cy="64" r="12" fill="#0a1024" stroke="#5eead4" stroke-width="3"/>
          <circle cx="74" cy="64" r="12" fill="#0a1024" stroke="#5eead4" stroke-width="3"/>
          <path d="M20 28h54M32 16v24" stroke="rgba(94,234,212,.4)" stroke-width="2"/>
        </g>
        <g id="force-arrow" stroke="#bef264" stroke-width="4" stroke-linecap="round">
          <path d="M120 250h${arrow}"/>
          <path d="M${120 + arrow - 12} 242l12 8-12 8"/>
        </g>
        <text x="120" y="230" fill="#bef264" font-size="12" font-family="Inter, sans-serif">F = ${force} N</text>
      </svg>
      <div class="force__readout">
        <div class="force__stat"><b id="force-a">${accel.toFixed(1)}</b><span>m/s²</span></div>
        <div class="force__stat"><b id="force-m">${mass}</b><span>kg</span></div>
        <div class="force__stat"><b id="force-f">${force}</b><span>N</span></div>
      </div>
    </div>
    </div>`;
}

function hotspotsStage(step) {
  const lesson = session.lesson;
  const s = subjectMeta(lesson);
  const spots = step.spots
    .map((spot) => {
      const found = session.found.has(spot.id);
      return `<button class="hotspot ${found ? 'is-found' : ''}" type="button" data-act="spot" data-id="${spot.id}" style="left:${spot.x}%;top:${spot.y}%" aria-label="${escapeHTML(spot.title)}">${found ? '✓' : '+'}</button>`;
    })
    .join('');
  return `<div class="stage__glow"></div>
    <div class="stage__scene">${sceneSVG(step.scene || lesson.scene, s.color, s.color2)}</div>
    ${spots}
    <div class="stage__badge">${icon('compass', 12)} Explora</div>
    <div class="stage__hint">Toca los puntos brillantes</div>`;
}

function timelineStage(step) {
  return `<div class="stage__badge">${icon('clock', 12)} Línea del tiempo</div>
    <div class="timeline-wrap" style="padding:70px 12px 16px">
      <div class="timeline">
        ${step.events
          .map(
            (ev, i) => `<button class="timeline__event ${session.visited.has(String(i)) ? 'is-visited' : ''}" type="button" data-act="timeline" data-id="${i}">
              <span class="timeline__year">${escapeHTML(ev.year)}</span>
              <span class="timeline__dot"></span>
              <span class="timeline__title">${escapeHTML(ev.title)}</span>
            </button>`
          )
          .join('')}
      </div>
    </div>
    <div class="stage__hint">Desliza horizontalmente para ver todos los momentos.</div>`;
}

function sortStage(step) {
  const placed = session.sortPlaced;
  const remaining = step.items.filter((item) => !placed[item.id]);
  return `<div class="stage__badge">${icon('layers', 12)} Clasifica</div>
    <div style="width:100%;padding:64px 18px 10px">
      <div class="sort-board">
        ${step.categories
          .map(
            (cat) => `<button type="button" class="sort-cat" data-act="sort-cat" data-id="${cat.id}">
              <div class="sort-cat__title">${escapeHTML(cat.label)}</div>
              <div class="sort-cat__hint">${escapeHTML(cat.hint)}</div>
              <div class="sort-cat__items">
                ${step.items
                  .filter((item) => placed[item.id] === cat.id)
                  .map((item) => `<span class="sort-item is-placed ${placed[item.id] ? 'is-correct' : ''}">${escapeHTML(item.label)}</span>`)
                  .join('')}
              </div>
            </button>`
          )
          .join('')}
      </div>
      <div class="sort-items" id="sort-items">
        ${remaining
          .map(
            (item) => `<button class="sort-item ${session.sortSelected === item.id ? 'is-selected' : ''}" type="button" data-act="sort-item" data-id="${item.id}">${escapeHTML(item.label)}</button>`
          )
          .join('')}
      </div>
    </div>`;
}

/* ---------- Panel builders ---------- */

function panelFor(step) {
  const lesson = session.lesson;
  const s = subjectMeta(lesson);

  if (step.type === 'intro') {
    return `<div class="panel__kicker">${icon('sparkles', 13)} Misión ${String(session.stepIndex + 1).padStart(2, '0')}</div>
      <h2 class="panel__title">${escapeHTML(step.title)}</h2>
      <p class="panel__text">${step.text}</p>
      <div class="panel__note"><strong>Objetivo:</strong> ${escapeHTML(lesson.objective)}</div>
      ${speakButton(step.narration || step.text)}
      <div class="intro-list">
        ${lesson.keyIdeas.map((idea, i) => `<li><span class="intro-list__num">${i + 1}</span><span>${escapeHTML(idea)}</span></li>`).join('')}
      </div>
      ${panelFooter({ label: 'Comenzar', hint: 'Explora sin miedo: puedes repetir.' })}`;
  }

  if (step.type === 'numberline') {
    return `<div class="panel__kicker">${icon('route', 13)} Recta numérica</div>
      <h2 class="panel__title">${escapeHTML(step.title)}</h2>
      <p class="panel__text">${escapeHTML(step.instruction)}</p>
      <div class="panel__note"><strong>Idea clave:</strong> cada paso a la derecha suma 1; a la izquierda, resta 1.</div>
      ${feedbackHTML()}
      ${session.solved ? panelFooter({ hint: '¡Bien! El resultado es correcto.' }) : panelFooter({ checkAct: 'check-nl', hint: `Pista: ${step.hint}` })}`;
  }

  if (step.type === 'story') {
    const narration = storyNarration(step);
    const options = step.options
      .map((opt, i) => {
        const selected = session.storyChoice === i;
        const showCorrect = session.solved && opt.correct;
        const showWrong = selected && !opt.correct;
        return `<button class="story-option ${showCorrect ? 'is-correct' : ''} ${showWrong ? 'is-wrong' : ''}" type="button" data-act="story-choice" data-index="${i}" ${session.solved ? 'disabled' : ''}>
          <span class="story-option__num">${i + 1}</span>
          <span>${escapeHTML(opt.text)}</span>
        </button>`;
      })
      .join('');
    return `<div class="panel__kicker">${icon('book', 13)} Cuento</div>
      <h2 class="panel__title">${escapeHTML(step.title)}</h2>
      <div class="story-text">
        ${step.paragraphs.map((p) => `<p>${escapeHTML(p)}</p>`).join('')}
      </div>
      ${speakButton(narration, 'Escuchar el cuento')}
      <p class="story-question">${escapeHTML(step.question)}</p>
      <div class="story-options">${options}</div>
      ${feedbackHTML()}
      ${session.solved ? panelFooter({ hint: '¡Buena elección! La historia continúa.' }) : `<div class="panel__footer"><span class="panel__hint">Pista: ${escapeHTML(step.hint)}</span><span class="pill">Elige una opción</span></div>`}`;
  }

  if (step.type === 'code') {
    const meta = {
      forward: ['Avanzar', 'arrowUp'],
      left: ['Girar izquierda', 'rotateLeft'],
      right: ['Girar derecha', 'rotateRight'],
    };
    const program = session.codeProgram || [];
    const full = program.length >= step.maxBlocks;
    return `<div class="panel__kicker">${icon('code', 13)} Programación</div>
      <h2 class="panel__title">${escapeHTML(step.title)}</h2>
      <p class="panel__text">${escapeHTML(step.instruction)}</p>
      <div class="code-palette">
        <button class="code-cmd" type="button" data-act="code-add" data-cmd="forward" ${full || session.codeRunning ? 'disabled' : ''}>${icon('arrowUp', 16)} Avanzar</button>
        <button class="code-cmd" type="button" data-act="code-add" data-cmd="left" ${full || session.codeRunning ? 'disabled' : ''}>${icon('rotateLeft', 16)} Izquierda</button>
        <button class="code-cmd" type="button" data-act="code-add" data-cmd="right" ${full || session.codeRunning ? 'disabled' : ''}>${icon('rotateRight', 16)} Derecha</button>
      </div>
      <div class="code-program">
        <div class="code-program__head"><span>Tu programa</span><b>${program.length}/${step.maxBlocks}</b></div>
        ${program.length
          ? `<div class="code-program__list">${program
              .map(
                (cmd, i) => `<button type="button" class="code-block" data-act="code-remove" data-index="${i}" title="Quitar ${meta[cmd][0]}" ${session.codeRunning ? 'disabled' : ''}><span>${i + 1}</span>${icon(meta[cmd][1], 13)} ${meta[cmd][0]}</button>`
              )
              .join('')}</div>`
          : `<p class="code-program__empty">Agrega bloques para construir tu programa. Toca un bloque para quitarlo.</p>`}
      </div>
      <div class="code-status ${session.codeError ? 'is-error' : ''}" id="code-status">${session.codeError ? escapeHTML(session.codeError) : session.solved ? '¡Meta alcanzada!' : session.codeRunning ? 'Ejecutando programa…' : 'Listo para ejecutar.'}</div>
      ${feedbackHTML()}
      <div class="panel__footer">
        <p class="panel__hint">${session.solved ? '¡Luci llegó a la meta!' : `Pista: ${escapeHTML(step.hint)}`}</p>
        <div class="code-actions">
          ${
            session.solved
              ? `<button class="btn btn--primary" type="button" data-act="next">Continuar ${icon('arrowRight', 15)}</button>`
              : `<button class="btn btn--primary" type="button" data-act="code-run" ${session.codeRunning || !program.length ? 'disabled' : ''}>${session.codeRunning ? 'Ejecutando…' : 'Ejecutar programa'} ${icon('play', 14)}</button>
                 <button class="btn btn--ghost" type="button" data-act="code-clear">Limpiar</button>`
          }
        </div>
      </div>`;
  }

  if (step.type === 'fraction') {
    return `<div class="panel__kicker">${icon('sigma', 13)} Fracciones</div>
      <h2 class="panel__title">${escapeHTML(step.title)}</h2>
      <p class="panel__text">${escapeHTML(step.instruction)}</p>
      <div class="sim-slider">
        <div class="sim-slider__head"><span>Partes que tomas (numerador)</span><b id="frac-num-label">${session.fractionNum}</b></div>
        <input id="frac-num" type="range" min="0" max="${session.fractionDen}" step="1" value="${session.fractionNum}" aria-label="Numerador" />
      </div>
      <div class="sim-slider">
        <div class="sim-slider__head"><span>Partes en que divides (denominador)</span><b id="frac-den-label">${session.fractionDen}</b></div>
        <input id="frac-den" type="range" min="2" max="${step.maxDen}" step="1" value="${session.fractionDen}" aria-label="Denominador" />
      </div>
      <div class="panel__note"><strong>Idea clave:</strong> el numerador cuenta las partes que tomas; el denominador, en cuántas se divide el todo.</div>
      ${feedbackHTML()}
      ${session.solved ? panelFooter({ hint: '¡Fracción correcta!' }) : panelFooter({ checkAct: 'check-fraction', hint: `Pista: ${step.hint}` })}`;
  }

  if (step.type === 'balance') {
    return `<div class="panel__kicker">${icon('sigma', 13)} Álgebra</div>
      <h2 class="panel__title">${escapeHTML(step.title)}</h2>
      <p class="panel__text">${escapeHTML(step.instruction)}</p>
      <div class="sim-slider">
        <div class="sim-slider__head"><span>Valor de x</span><b id="balance-x-label">${session.balanceX}</b></div>
        <input id="balance-x" type="range" min="0" max="${step.max}" step="1" value="${session.balanceX}" aria-label="Valor de x" />
      </div>
      <div class="panel__note"><strong>Regla de oro:</strong> lo que haces de un lado de la ecuación, lo haces del otro.</div>
      ${feedbackHTML()}
      ${session.solved ? panelFooter({ hint: 'La balanza está en equilibrio.' }) : panelFooter({ checkAct: 'check-balance', hint: `Pista: ${step.hint}` })}`;
  }

  if (step.type === 'graph') {
    return `<div class="panel__kicker">${icon('sigma', 13)} Función lineal</div>
      <h2 class="panel__title">${escapeHTML(step.title)}</h2>
      <p class="panel__text">${escapeHTML(step.instruction)}</p>
      <div class="sim-slider">
        <div class="sim-slider__head"><span>Pendiente (m)</span><b id="graph-m-label">${session.graphM}</b></div>
        <input id="graph-m" type="range" min="${step.mMin}" max="${step.mMax}" step="1" value="${session.graphM}" aria-label="Pendiente" />
      </div>
      <div class="sim-slider">
        <div class="sim-slider__head"><span>Ordenada al origen (b)</span><b id="graph-b-label">${session.graphB}</b></div>
        <input id="graph-b" type="range" min="${step.bMin}" max="${step.bMax}" step="1" value="${session.graphB}" aria-label="Ordenada al origen" />
      </div>
      <div class="panel__note"><strong>Idea clave:</strong> la pendiente m indica cuánto cambia y por cada unidad de x; b es el punto donde cruza el eje y.</div>
      ${feedbackHTML()}
      ${session.solved ? panelFooter({ hint: 'La recta coincide con la función.' }) : panelFooter({ checkAct: 'check-graph', hint: `Pista: ${step.hint}` })}`;
  }

  if (step.type === 'force') {
    return `<div class="panel__kicker">${icon('bolt', 13)} Fuerza y movimiento</div>
      <h2 class="panel__title">${escapeHTML(step.title)}</h2>
      <p class="panel__text">${escapeHTML(step.instruction)}</p>
      <div class="sim-slider">
        <div class="sim-slider__head"><span>Masa</span><b id="force-m-label">${session.forceMass} kg</b></div>
        <input id="force-m" type="range" min="${step.minMass}" max="${step.maxMass}" step="1" value="${session.forceMass}" aria-label="Masa" />
      </div>
      <div class="sim-slider">
        <div class="sim-slider__head"><span>Fuerza</span><b id="force-f-label">${session.forceForce} N</b></div>
        <input id="force-f" type="range" min="${step.minForce}" max="${step.maxForce}" step="1" value="${session.forceForce}" aria-label="Fuerza" />
      </div>
      <div class="panel__note"><strong>Idea clave:</strong> F = m·a. Con la misma fuerza, a mayor masa menor aceleración.</div>
      ${feedbackHTML()}
      ${session.solved ? panelFooter({ hint: '¡Laboratorio dominado!' }) : panelFooter({ checkAct: 'check-force', hint: `Pista: ${step.hint}` })}`;
  }

  if (step.type === 'hotspots') {
    const found = session.found.size;
    const all = step.spots.length;
    const detail = session.lastSpot
      ? `<div class="spot-card"><div class="spot-card__title">${icon('leaf', 16)} ${escapeHTML(session.lastSpot.title)}</div><div class="spot-card__text">${escapeHTML(session.lastSpot.text)}</div></div>`
      : '';
    return `<div class="panel__kicker">${icon('compass', 13)} Exploración</div>
      <h2 class="panel__title">${escapeHTML(step.title)}</h2>
      <p class="panel__text">${escapeHTML(step.instruction)}</p>
      ${detail}
      <div class="spot-count">${icon('check', 13)} <b>${found}</b> de ${all} descubiertos</div>
      ${panelFooter({ enabled: found >= all, hint: found >= all ? '¡Exploración completa!' : 'Toca todos los puntos del escenario.' })}`;
  }

  if (step.type === 'timeline') {
    const visited = session.visited.size;
    const all = step.events.length;
    const detail = session.timelineDetail
      ? `<div class="timeline-detail"><div class="timeline-detail__year">${escapeHTML(session.timelineDetail.year)}</div><div class="timeline-detail__title">${escapeHTML(session.timelineDetail.title)}</div><div class="timeline-detail__text">${escapeHTML(session.timelineDetail.text)}</div></div>`
      : '';
    return `<div class="panel__kicker">${icon('clock', 13)} Línea del tiempo</div>
      <h2 class="panel__title">${escapeHTML(step.title)}</h2>
      <p class="panel__text">${escapeHTML(step.instruction)}</p>
      ${detail}
      <div class="spot-count">${icon('check', 13)} <b>${visited}</b> de ${all} momentos visitados</div>
      ${panelFooter({ enabled: visited >= all, hint: visited >= all ? '¡Recorrido completo!' : 'Toca cada momento de la línea.' })}`;
  }

  if (step.type === 'sort') {
    const placed = Object.keys(session.sortPlaced).length;
    const all = step.items.length;
    return `<div class="panel__kicker">${icon('layers', 13)} Clasificación</div>
      <h2 class="panel__title">${escapeHTML(step.title)}</h2>
      <p class="panel__text">${escapeHTML(step.instruction)}</p>
      ${feedbackHTML()}
      <div class="spot-count">${icon('check', 13)} <b>${placed}</b> de ${all} clasificados</div>
      ${panelFooter({ enabled: placed >= all, hint: placed >= all ? '¡Clasificación completa!' : 'Toca un elemento y luego su categoría.' })}`;
  }

  if (step.type === 'decision') {
    const choice = session.decisionChoice;
    return `<div class="panel__kicker">${icon('compass', 13)} Decisión</div>
      <h2 class="panel__title">${escapeHTML(step.title)}</h2>
      <p class="panel__text">${escapeHTML(step.scenario)}</p>
      <div class="decision-options">
        ${step.options
          .map(
            (opt, i) => `<button class="decision-option ${choice === i ? (opt.correct ? 'is-correct' : 'is-wrong') : ''}" type="button" data-act="decision" data-index="${i}" ${session.solved ? 'disabled' : ''}>
              <div class="decision-option__title">${escapeHTML(opt.label)}</div>
              <div class="decision-option__detail">${escapeHTML(opt.detail)}</div>
            </button>`
          )
          .join('')}
      </div>
      ${feedbackHTML()}
      ${session.solved ? panelFooter({ hint: 'Buena decisión: piensa en el largo plazo.' }) : `<div class="panel__footer"><span class="panel__hint">Elige la opción con mejores consecuencias.</span><button class="btn btn--primary" disabled>Continuar ${icon('arrowRight', 15)}</button></div>`}`;
  }

  if (step.type === 'quiz') {
    const q = step.questions[session.quizIndex];
    if (!q || session.quizDone) {
      return `<div class="panel__kicker">${icon('target', 13)} Reto completado</div>
        <h2 class="panel__title">¡Buen trabajo!</h2>
        <p class="panel__text">Respondiste ${session.quizCorrect} de ${step.questions.length} preguntas correctamente.</p>
        <div class="quiz">${step.questions.map((_, i) => `<div class="quiz__dot ${session.quizCorrect > i ? 'is-correct' : ''}"></div>`).join('')}</div>
        ${panelFooter({ label: 'Continuar', hint: 'Sigue a la conclusión de la misión.' })}`;
    }
    return `<div class="panel__kicker">${icon('target', 13)} Reto · ${session.quizIndex + 1}/${step.questions.length}</div>
      <h2 class="panel__title">${escapeHTML(step.title)}</h2>
      <div class="quiz">
        <div class="quiz__progress">${step.questions.map((_, i) => `<div class="quiz__dot ${i < session.quizIndex ? 'is-correct' : i === session.quizIndex ? 'is-active' : ''}"></div>`).join('')}</div>
        <div class="quiz__q">${escapeHTML(q.q)}</div>
        <div class="quiz__options">
          ${q.options
            .map((opt, i) => {
              let cls = '';
              if (session.quizAnswered) {
                if (i === q.correct) cls = 'is-correct';
                else if (i === session.quizSelected) cls = 'is-wrong';
              }
              return `<button class="quiz-option ${cls}" type="button" data-act="quiz-option" data-index="${i}" ${session.quizAnswered ? 'disabled' : ''}>
                <span class="quiz-option__letter">${String.fromCharCode(65 + i)}</span>
                <span>${escapeHTML(opt)}</span>
              </button>`;
            })
            .join('')}
        </div>
        ${session.quizAnswered ? `<div class="quiz-feedback ${session.quizSelected === q.correct ? 'is-correct' : 'is-wrong'}" role="status" aria-live="polite">${escapeHTML(q.explain)}</div>` : ''}
      </div>
      ${session.quizAnswered ? `<div class="panel__footer"><span class="panel__hint">${session.quizSelected === q.correct ? '¡Correcto!' : 'Revisa la explicación.'}</span><button class="btn btn--primary" data-act="quiz-next">Siguiente ${icon('arrowRight', 15)}</button></div>` : `<div class="panel__footer"><span class="panel__hint">Elige una respuesta.</span></div>`}`;
  }

  return `<p class="panel__text">...</p>`;
}

/* ---------- Summary ---------- */

function renderSummary(root) {
  const lesson = session.lesson;
  const s = subjectMeta(lesson);
  const score = session.quizTotal ? Math.round((session.quizCorrect / session.quizTotal) * 100) : 100;

  if (!session.finished) {
    session.finished = true;
    const result = completeLesson(lesson, score);
    session.result = result;
    playComplete();
    confetti();
    if (result.newBadges.length) setTimeout(() => playUnlock(), 600);
  }

  const result = session.result;
  const next = nextLesson(lesson);
  root.innerHTML = `<div class="summary">
    <div class="summary__trophy">${icon('trophy', 44)}</div>
    <div class="panel__kicker" style="justify-content:center">Misión completada</div>
    <h2 class="summary__title">${escapeHTML(lesson.title)}</h2>
    <p class="summary__text">${escapeHTML(lesson.steps[lesson.steps.length - 1].text || '')}</p>
    <div class="summary__xp">${icon('bolt', 15)} +${result.isNew ? lesson.xp : 0} XP · ${score}% de aciertos</div>
    <div class="summary__ideas">
      ${lesson.keyIdeas.map((idea) => `<div class="summary__idea">${icon('check', 15)}<span>${escapeHTML(idea)}</span></div>`).join('')}
    </div>
    ${
      result.newBadges.length
        ? `<div class="summary__ideas" style="margin-top:14px">${result.newBadges
            .map((b) => `<div class="summary__idea">${icon('medal', 15)}<span><strong>${escapeHTML(b.name)}</strong> · ${escapeHTML(b.desc)}</span></div>`)
            .join('')}</div>`
        : ''
    }
    <div class="summary__actions">
      <a class="btn btn--ghost" href="#/grado/${lesson.gradeId}/${lesson.subject}">${icon('arrowLeft', 15)} Volver a ${escapeHTML(s.name)}</a>
      ${
        next
          ? `<a class="btn btn--primary" href="#/leccion/${next.id}">Siguiente misión ${icon('arrowRight', 15)}</a>`
          : `<a class="btn btn--primary" href="#/grado/${lesson.gradeId}">Ver mi grado ${icon('arrowRight', 15)}</a>`
      }
    </div>
    <p style="color:var(--dim);font-size:.68rem;margin-top:18px">Progreso guardado en este dispositivo. Puedes repasar esta misión cuando quieras.</p>
  </div>`;
}

function nextLesson(lesson) {
  const same = LESSONS.filter((l) => l.gradeId === lesson.gradeId && l.subject === lesson.subject);
  const idx = same.findIndex((l) => l.id === lesson.id);
  if (idx >= 0 && idx < same.length - 1) return same[idx + 1];
  const gradeLessons = LESSONS.filter((l) => l.gradeId === lesson.gradeId);
  const gidx = gradeLessons.findIndex((l) => l.id === lesson.id);
  if (gidx >= 0 && gidx < gradeLessons.length - 1) return gradeLessons[gidx + 1];
  return null;
}

/* ---------- Events ---------- */

function handleClick(e) {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;

  if (act === 'next') {
    stopSpeaking();
    playClick();
    session.stepIndex += 1;
    session.feedback = null;
    session.solved = false;
    renderCurrent();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (act === 'voice-auto') {
    if (!speechSupported()) {
      toast('Este dispositivo no tiene voz disponible.');
      return;
    }
    const next = !isVoiceAuto();
    setVoiceAuto(next);
    const btn = document.querySelector('[data-act="voice-auto"]');
    if (btn) {
      btn.classList.toggle('is-on', next);
      btn.setAttribute('aria-pressed', String(next));
    }
    if (next) {
      session.autoSpokenStep = -1;
      const text = narrationForStep(currentStep());
      if (text) speak(text);
      toast('Modo cuento activado');
    } else {
      stopSpeaking();
      toast('Modo cuento desactivado');
    }
    return;
  }

  if (act === 'speak') {
    if (el.classList.contains('is-speaking')) {
      stopSpeaking();
      el.classList.remove('is-speaking');
      el.innerHTML = `${icon('volume', 14)} ${el.dataset.label || 'Escuchar'}`;
    } else {
      const text = el.dataset.speak || currentStep()?.narration || currentStep()?.text || '';
      el.classList.add('is-speaking');
      el.innerHTML = `${icon('pause', 14)} Detener`;
      speak(text, (on) => {
        if (!on) {
          el.classList.remove('is-speaking');
          el.innerHTML = `${icon('volume', 14)} ${el.dataset.label || 'Escuchar'}`;
        }
      });
    }
    return;
  }

  if (act === 'story-choice') {
    const step = currentStep();
    if (!step || step.type !== 'story' || session.solved) return;
    const index = Number(el.dataset.index);
    const opt = step.options[index];
    if (!opt) return;
    session.storyChoice = index;
    if (opt.correct) {
      session.solved = true;
      session.feedback = { type: 'correct', text: opt.feedback };
      playCorrect();
    } else {
      session.feedback = { type: 'wrong', text: opt.feedback };
      playWrong();
    }
    renderCurrent();
    return;
  }

  if (act === 'code-add') {
    const step = currentStep();
    if (!step || session.codeRunning || session.codeProgram.length >= step.maxBlocks) return;
    session.codeProgram.push(el.dataset.cmd);
    session.codePos = { ...step.start };
    session.codeTrail = [[step.start.x, step.start.y]];
    session.codeError = null;
    session.feedback = null;
    session.solved = false;
    playClick();
    renderCurrent();
    return;
  }

  if (act === 'code-remove') {
    if (session.codeRunning) return;
    const step = currentStep();
    session.codeProgram.splice(Number(el.dataset.index), 1);
    session.codePos = { ...step.start };
    session.codeTrail = [[step.start.x, step.start.y]];
    session.codeError = null;
    session.feedback = null;
    session.solved = false;
    playClick();
    renderCurrent();
    return;
  }

  if (act === 'code-clear') {
    if (session.codeRunning) return;
    const step = currentStep();
    session.codeProgram = [];
    session.codePos = { ...step.start };
    session.codeTrail = [[step.start.x, step.start.y]];
    session.codeError = null;
    session.feedback = null;
    session.solved = false;
    playClick();
    renderCurrent();
    return;
  }

  if (act === 'code-run') {
    runCode();
    return;
  }

  if (act === 'nl') {
    const step = currentStep();
    const dir = Number(el.dataset.dir);
    const stepSize = Number(step.step) || 1;
    session.nlValue = Math.max(step.min, Math.min(step.max, session.nlValue + dir * stepSize));
    session.feedback = null;
    session.solved = false;
    renderCurrent();
    return;
  }

  if (act === 'check-nl') {
    const step = currentStep();
    if (session.nlValue === step.answer) {
      session.solved = true;
      session.feedback = { type: 'correct', text: `¡Correcto! ${step.start} ${step.delta >= 0 ? '+' : '−'} ${Math.abs(step.delta)} = ${step.answer}.` };
      playCorrect();
    } else {
      session.feedback = { type: 'wrong', text: 'Todavía no. Revisa la pista y mueve el marcador otra vez.' };
      playWrong();
    }
    renderCurrent();
    return;
  }

  if (act === 'check-fraction') {
    const step = currentStep();
    const num = session.fractionNum;
    const den = session.fractionDen;
    if (num * step.targetDen === step.targetNum * den) {
      session.solved = true;
      session.feedback = { type: 'correct', text: `¡Correcto! ${num}/${den} es equivalente a ${step.targetNum}/${step.targetDen}.` };
      playCorrect();
    } else {
      session.feedback = { type: 'wrong', text: 'Todavía no. Ajusta las partes que tomas y en cuántas divides el todo.' };
      playWrong();
    }
    renderCurrent();
    return;
  }

  if (act === 'check-balance') {
    const step = currentStep();
    if (step.a * session.balanceX + step.b === step.c) {
      session.solved = true;
      session.feedback = { type: 'correct', text: `¡Equilibrio! x = ${session.balanceX}. Comprueba: ${step.a}(${session.balanceX}) + ${step.b} = ${step.c}.` };
      playCorrect();
    } else {
      session.feedback = { type: 'wrong', text: 'La balanza sigue inclinada. Prueba otro valor de x.' };
      playWrong();
    }
    renderCurrent();
    return;
  }

  if (act === 'check-graph') {
    const step = currentStep();
    if (session.graphM === step.targetM && session.graphB === step.targetB) {
      session.solved = true;
      session.feedback = { type: 'correct', text: `¡Exacto! La función es y = ${step.targetM}x + ${step.targetB}.` };
      playCorrect();
    } else {
      session.feedback = { type: 'wrong', text: 'Ajusta la pendiente y la ordenada hasta que la recta coincida.' };
      playWrong();
    }
    renderCurrent();
    return;
  }

  if (act === 'check-force') {
    const step = currentStep();
    if (session.forceMass === step.targetMass && session.forceForce === step.targetForce) {
      session.solved = true;
      session.feedback = { type: 'correct', text: `¡Bien! a = F/m = ${step.targetForce}/${step.targetMass} = ${(step.targetForce / step.targetMass).toFixed(1)} m/s².` };
      playCorrect();
    } else {
      session.feedback = { type: 'wrong', text: 'Ajusta masa y fuerza: necesitas 5 kg y 20 N.' };
      playWrong();
    }
    renderCurrent();
    return;
  }

  if (act === 'spot') {
    const step = currentStep();
    const spot = step.spots.find((s) => s.id === el.dataset.id);
    if (!spot) return;
    session.found.add(spot.id);
    session.lastSpot = spot;
    playClick();
    renderCurrent();
    return;
  }

  if (act === 'timeline') {
    const step = currentStep();
    const ev = step.events[Number(el.dataset.id)];
    if (!ev) return;
    session.visited.add(el.dataset.id);
    session.timelineDetail = ev;
    playClick();
    renderCurrent();
    return;
  }

  if (act === 'sort-item') {
    session.sortSelected = el.dataset.id;
    session.feedback = null;
    playClick();
    renderCurrent();
    return;
  }

  if (act === 'sort-cat') {
    const step = currentStep();
    if (!session.sortSelected) {
      session.feedback = { type: 'wrong', text: 'Primero toca un elemento de abajo y luego su categoría.' };
      renderCurrent();
      return;
    }
    const item = step.items.find((i) => i.id === session.sortSelected);
    if (!item) return;
    if (item.category === el.dataset.id) {
      session.sortPlaced[item.id] = el.dataset.id;
      session.sortSelected = null;
      session.feedback = { type: 'correct', text: `Correcto: ${item.label}. ${item.explain}` };
      playCorrect();
    } else {
      session.sortAttempts += 1;
      session.feedback = { type: 'wrong', text: 'Esa no es la categoría. Intenta de nuevo.' };
      playWrong();
    }
    renderCurrent();
    return;
  }

  if (act === 'decision') {
    const step = currentStep();
    const index = Number(el.dataset.index);
    const opt = step.options[index];
    if (!opt) return;
    session.decisionChoice = index;
    if (opt.correct) {
      session.solved = true;
      session.feedback = { type: 'correct', text: opt.feedback };
      playCorrect();
    } else {
      session.feedback = { type: 'wrong', text: opt.feedback };
      playWrong();
    }
    renderCurrent();
    return;
  }

  if (act === 'quiz-option') {
    if (session.quizAnswered) return;
    const step = currentStep();
    const q = step.questions[session.quizIndex];
    const index = Number(el.dataset.index);
    session.quizAnswered = true;
    session.quizSelected = index;
    if (index === q.correct) {
      session.quizCorrect += 1;
      playCorrect();
    } else {
      playWrong();
    }
    renderCurrent();
    return;
  }

  if (act === 'quiz-next') {
    const step = currentStep();
    session.quizIndex += 1;
    session.quizAnswered = false;
    session.quizSelected = null;
    if (session.quizIndex >= step.questions.length) {
      session.quizDone = true;
    }
    playClick();
    renderCurrent();
    return;
  }
}

function runCode() {
  const step = currentStep();
  if (!step || step.type !== 'code' || session.codeRunning || !session.codeProgram.length) return;
  const token = ++session.codeRunToken;
  session.codeRunning = true;
  session.codeError = null;
  session.feedback = null;
  session.solved = false;
  session.codePos = { ...step.start };
  session.codeTrail = [[step.start.x, step.start.y]];
  renderCurrent();

  const program = [...session.codeProgram];
  const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  let i = 0;

  const tick = () => {
    if (token !== session.codeRunToken || session.stepIndex !== currentStepIndex()) return;
    if (i >= program.length) {
      finishCode(step, token);
      return;
    }
    const cmd = program[i++];
    const pos = session.codePos;
    if (cmd === 'left') pos.dir = (pos.dir + 3) % 4;
    else if (cmd === 'right') pos.dir = (pos.dir + 1) % 4;
    else {
      const [dx, dy] = dirs[pos.dir];
      const nx = pos.x + dx;
      const ny = pos.y + dy;
      const wall = (step.walls || []).some(([x, y]) => x === nx && y === ny);
      if (nx < 0 || nx >= step.cols || ny < 0 || ny >= step.rows || wall) {
        session.codeRunning = false;
        session.codeError = '¡Choque! Luci no puede pasar por una pared o salir del tablero. Corrige el programa.';
        session.feedback = { type: 'wrong', text: session.codeError };
        playWrong();
        renderCurrent();
        return;
      }
      pos.x = nx;
      pos.y = ny;
      session.codeTrail.push([nx, ny]);
    }
    updateCodeStage(step);
    setTimeout(tick, 420);
  };

  setTimeout(tick, 300);
}

function currentStepIndex() {
  return session?.stepIndex;
}

function updateCodeStage(step) {
  const stage = document.getElementById('stage');
  if (stage) stage.innerHTML = codeStage(step);
}

function finishCode(step, token) {
  if (token !== session.codeRunToken) return;
  const pos = session.codePos;
  const ok = pos.x === step.goal.x && pos.y === step.goal.y;
  session.codeRunning = false;
  updateCodeStage(step);
  if (ok) {
    session.solved = true;
    session.codeError = null;
    session.feedback = { type: 'correct', text: '¡Luci llegó a la meta! El programa cumple el objetivo.' };
    playCorrect();
  } else {
    session.codeError = 'Luci no llegó a la bandera. Revisa el orden y la cantidad de pasos.';
    session.feedback = { type: 'wrong', text: session.codeError };
    playWrong();
  }
  renderCurrent();
}

function handleInput(e) {
  const id = e.target.id;
  if (id === 'frac-num' || id === 'frac-den') {
    if (id === 'frac-num') {
      session.fractionNum = Number(e.target.value);
    } else {
      session.fractionDen = Number(e.target.value);
      if (session.fractionNum > session.fractionDen) session.fractionNum = session.fractionDen;
    }
    updateFraction();
    session.feedback = null;
    session.solved = false;
    return;
  }

  if (id === 'balance-x') {
    session.balanceX = Number(e.target.value);
    const step = currentStep();
    const left = step.a * session.balanceX + step.b;
    const diff = left - step.c;
    const angle = Math.max(-11, Math.min(11, diff * 1.5));
    const beam = document.getElementById('balance-beam');
    if (beam) beam.setAttribute('transform', `rotate(${angle} 300 150)`);
    const eq = document.getElementById('balance-eq');
    if (eq) eq.innerHTML = `${step.a}(${session.balanceX}) + ${step.b} = <b>${left}</b> &nbsp;|&nbsp; ${step.c}`;
    const label = document.getElementById('balance-x-label');
    if (label) label.textContent = session.balanceX;
    session.feedback = null;
    session.solved = false;
    return;
  }

  if (id === 'graph-m' || id === 'graph-b') {
    if (id === 'graph-m') session.graphM = Number(e.target.value);
    if (id === 'graph-b') session.graphB = Number(e.target.value);
    updateGraph();
    session.feedback = null;
    session.solved = false;
    return;
  }

  if (id === 'force-m' || id === 'force-f') {
    if (id === 'force-m') session.forceMass = Number(e.target.value);
    if (id === 'force-f') session.forceForce = Number(e.target.value);
    updateForce();
    session.feedback = null;
    session.solved = false;
  }
}

function updateFraction() {
  const step = currentStep();
  const stage = document.getElementById('stage');
  if (stage) stage.innerHTML = fractionStage(step);
  const numInput = document.getElementById('frac-num');
  if (numInput) {
    numInput.max = String(session.fractionDen);
    numInput.value = String(session.fractionNum);
  }
  const numLabel = document.getElementById('frac-num-label');
  const denLabel = document.getElementById('frac-den-label');
  if (numLabel) numLabel.textContent = session.fractionNum;
  if (denLabel) denLabel.textContent = session.fractionDen;
}

function updateGraph() {
  const step = currentStep();
  const { xMax } = step;
  const m = session.graphM;
  const b = session.graphB;
  const px = (x) => 70 + (x / xMax) * 460;
  const py = (y) => 340 - (y / step.yMax) * 285;
  const line = document.getElementById('graph-line');
  if (line) line.setAttribute('d', `M${px(0)} ${py(b)} L${px(xMax)} ${py(m * xMax + b)}`);
  const eq = document.getElementById('graph-eq');
  if (eq) eq.textContent = `y = ${m}x + ${b}`;
  const ml = document.getElementById('graph-m-label');
  const bl = document.getElementById('graph-b-label');
  if (ml) ml.textContent = m;
  if (bl) bl.textContent = b;
}

function updateForce() {
  const mass = session.forceMass;
  const force = session.forceForce;
  const accel = mass > 0 ? force / mass : 0;
  const arrow = Math.max(6, Math.min(150, force * 3));
  const g = document.getElementById('force-arrow');
  if (g) {
    g.innerHTML = `<path d="M120 250h${arrow}"/><path d="M${120 + arrow - 12} 242l12 8-12 8"/>`;
  }
  const a = document.getElementById('force-a');
  const m = document.getElementById('force-m');
  const f = document.getElementById('force-f');
  const ml = document.getElementById('force-m-label');
  const fl = document.getElementById('force-f-label');
  if (a) a.textContent = accel.toFixed(1);
  if (m) m.textContent = mass;
  if (f) f.textContent = force;
  if (ml) ml.textContent = `${mass} kg`;
  if (fl) fl.textContent = `${force} N`;
}

function bindControls() {
  // Las entradas se manejan por delegación; no hace falta bind individual.
}


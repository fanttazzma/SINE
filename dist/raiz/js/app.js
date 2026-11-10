import { GRADES, SUBJECTS, LESSONS, getLesson } from '../data/curriculum.js';
import {
  getState,
  touchVisit,
  getCompletedCount,
  getSubjectProgress,
  getSubjectProgressGlobal,
  getGradeProgress,
  getTotalProgress,
  getLevel,
  getStreak,
  getLastLesson,
  getChallengeBest,
  setName,
  resetProgress,
  isLessonDone,
  BADGES,
} from './store.js';
import {
  icon,
  logoMark,
  mascotSVG,
  subjectIcon,
  sceneSVG,
  escapeHTML,
  toast,
  openModal,
  confetti,
  badgeIcon,
  stopConfetti,
} from './ui.js';
import { initStars } from './particles.js';
import { isMuted, toggleMute, playClick, stopSpeaking, speechSupported, speak } from './audio.js';
import { renderLessonPage, mountLesson } from './lesson.js';
import { renderChallengePage, mountChallenge } from './challenge.js';

const app = document.getElementById('app');
let currentCleanup = null;
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  toast('Raíz quedó instalada en este dispositivo');
});

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, '');
  const parts = raw.split('/').filter(Boolean);
  if (!parts.length) return { name: 'home' };
  if (parts[0] === 'grado' && parts[1]) {
    return { name: parts[2] ? 'subject' : 'grade', gradeId: parts[1], subject: parts[2] || null };
  }
  if (parts[0] === 'leccion' && parts[1]) return { name: 'lesson', id: parts[1] };
  if (parts[0] === 'cuaderno') return { name: 'notebook' };
  if (parts[0] === 'logros') return { name: 'achievements' };
  if (parts[0] === 'reto') return { name: 'challenge' };
  return { name: 'home' };
}

function navLink(hash, label, active) {
  return `<a class="nav__link ${active ? 'is-active' : ''}" href="${hash}">${label}</a>`;
}

function renderNav(route) {
  const user = getState();
  const initial = (user.name || 'E').trim().charAt(0).toUpperCase();
  const activeHome = route.name === 'home';
  const activeNotebook = route.name === 'notebook';
  const activeAchievements = route.name === 'achievements';
  return `<nav class="nav" aria-label="Navegación principal">
    <a class="brand" href="#/" aria-label="Raíz, inicio">
      ${logoMark(38)}
      <span>
        <span class="brand__name">Raíz</span>
        <span class="brand__tag">Aprende sin señal</span>
      </span>
    </a>
    <div class="nav__links">
      ${navLink('#/', 'Inicio', activeHome)}
      ${navLink('#/reto', 'Reto rápido', route.name === 'challenge')}
      ${navLink('#/cuaderno', 'Mi cuaderno', activeNotebook)}
      ${navLink('#/logros', 'Logros', activeAchievements)}
    </div>
    <div class="nav__spacer"></div>
    <div class="nav__right">
      <span class="chip chip--grade"><span class="chip__dot"></span> 9 grados</span>
      <button class="icon-btn" data-action="install" aria-label="Instalar o descargar Raíz" title="Instalar app">
        ${icon('download')}
      </button>
      <button class="icon-btn" data-action="sound" aria-label="${isMuted() ? 'Activar sonido' : 'Silenciar'}" title="${isMuted() ? 'Activar sonido' : 'Silenciar'}">
        ${icon(isMuted() ? 'mute' : 'volume')}
      </button>
      <a class="avatar" href="#/cuaderno" aria-label="Abrir mi cuaderno">${escapeHTML(initial)}</a>
    </div>
  </nav>`;
}

function renderFooter() {
  return `<footer class="footer">
    <div class="wrap footer__inner">
      <div class="footer__brand">
        ${logoMark(30)}
        <span><strong style="color:var(--text)">Raíz</strong> · Enciclopedia viva de Chiapas</span>
      </div>
      <p class="footer__note">
        Prototipo educativo offline para primaria y secundaria. Contenido alineado al Plan de Estudios 2022 de la SEP.
        No sustituye a los libros de texto ni la guía docente. Hecho con orgullo en Chiapas.
        <button class="link-arrow" data-action="about" style="border:0;background:none;padding:0;margin-top:8px;cursor:pointer">Acerca de Raíz ${icon('arrowRight', 14)}</button>
      </p>
    </div>
  </footer>`;
}

function renderMobileNav(route) {
  const items = [
    { hash: '#/', label: 'Inicio', icon: 'home', active: route.name === 'home' },
    { hash: '#/reto', label: 'Reto', icon: 'bolt', active: route.name === 'challenge' },
    { hash: '#/cuaderno', label: 'Cuaderno', icon: 'notebook', active: route.name === 'notebook' },
    { hash: '#/logros', label: 'Logros', icon: 'trophy', active: route.name === 'achievements' },
  ];
  return `<nav class="mobile-nav" aria-label="Navegación móvil">
    ${items
      .map(
        (i) => `<a href="${i.hash}" class="${i.active ? 'is-active' : ''}">
          ${icon(i.icon, 19)}<span>${i.label}</span>
        </a>`
      )
      .join('')}
  </nav>`;
}

function shell(content, route, { full = false } = {}) {
  return `${renderNav(route)}
    <main id="contenido" class="main ${full ? 'main--lesson' : ''}">
      ${full ? content : `<div class="wrap view-enter">${content}</div>`}
    </main>
    ${renderFooter()}
    ${renderMobileNav(route)}`;
}

/* ---------- Home ---------- */

function homeView() {
  const total = getTotalProgress();
  const challengeBest = getChallengeBest();
  const featuredIds = ['p1-mate-sumas', 'p4-ciencias-ecosistemas', 'prog-1-secuencia'];
  const featured = featuredIds.map(getLesson).filter(Boolean);
  const primaryGrades = GRADES.filter((g) => g.level === 'primaria');
  const secondaryGrades = GRADES.filter((g) => g.level === 'secundaria');

  const gradeCard = (g) => {
    const p = getGradeProgress(g.id);
    return `<a class="grade-card" href="#/grado/${g.id}" style="--c1:${g.color};--c2:${g.color2}" data-tilt>
      <div class="grade-card__top">
        <div class="grade-card__num">${g.label}</div>
        <span class="grade-card__tag">${escapeHTML(g.tagline)}</span>
      </div>
      <div class="grade-card__body">
        <h3 class="grade-card__name">${escapeHTML(g.name)}</h3>
        <p class="grade-card__desc">${escapeHTML(g.description)}</p>
        <div class="grade-card__bottom">
          <span class="grade-card__meta">${p.done}/${p.total} misiones · ${p.pct}%</span>
          <span class="grade-card__go">${icon('arrowRight', 16)}</span>
        </div>
      </div>
    </a>`;
  };

  return `<section class="hero">
      <div class="hero__copy">
        <div class="hero__kicker">
          <b>${icon('spark', 12)} Nuevo</b>
          Enciclopedia interactiva de primaria y secundaria
        </div>
        <h1 class="hero__title">Aprende <span class="grad-text">sin señal.</span><br />Entiende de verdad.</h1>
        <p class="hero__lead">
          Seis grados de primaria, tres de secundaria y misiones que se juegan, se tocan y se piensan.
          Todo funciona sin internet, en tu teléfono, laptop o tablet.
        </p>
        <div class="hero__actions">
          <a class="btn btn--primary" href="#/grado/p1">${icon('play', 17)} Empezar ahora</a>
          <button class="btn btn--ghost" data-action="scroll-grades">${icon('compass', 17)} Elegir mi grado</button>
        </div>
        <div class="hero__stats">
          <div class="stat"><div class="stat__num">9</div><div class="stat__label">Grados</div></div>
          <div class="stat"><div class="stat__num">${Object.keys(SUBJECTS).length}</div><div class="stat__label">Materias</div></div>
          <div class="stat"><div class="stat__num">${LESSONS.length}</div><div class="stat__label">Misiones</div></div>
          <div class="stat"><div class="stat__num">100%</div><div class="stat__label">Offline</div></div>
        </div>
      </div>
      <div class="hero__visual" aria-hidden="true">
        <div class="orb">
          <div class="orb__ring"></div>
          <div class="orb__ring"></div>
          <div class="orb__glow"></div>
          <div class="orb__mascot">${mascotSVG()}</div>
          <div class="orbit-chip orbit-chip--1" style="color:#67e8f9">${icon('sigma', 16)} Matemáticas</div>
          <div class="orbit-chip orbit-chip--2" style="color:#bef264">${icon('flask', 16)} Ciencias</div>
          <div class="orbit-chip orbit-chip--3" style="color:#fbbf24">${icon('column', 16)} Historia</div>
          <div class="orbit-chip orbit-chip--4" style="color:#fb7185">${icon('book', 16)} Lengua</div>
        </div>
      </div>
    </section>

    <section class="section" id="grados">
      <div class="section__head">
        <div>
          <span class="section__eyebrow">Tu ruta</span>
          <h2 class="section__title">Elige tu grado</h2>
          <p class="section__sub">Primaria tiene tres materias base; secundaria suma Historia y Geografía. Puedes empezar por donde quieras.</p>
        </div>
        <span class="pill"><span class="chip__dot"></span> ${total.done}/${total.total} misiones completadas</span>
      </div>

      <div class="level-head">
        <div><span class="level-head__tag">Primaria</span><span class="level-head__meta">1º a 6º · Matemáticas, Lengua y Ciencias</span></div>
        <span class="level-head__count">${primaryGrades.length} grados</span>
      </div>
      <div class="grades">
        ${primaryGrades.map(gradeCard).join('')}
      </div>

      <div class="level-head" style="margin-top:34px">
        <div><span class="level-head__tag">Secundaria</span><span class="level-head__meta">1º a 3º · Matemáticas, Ciencias, Historia, Geografía y Programación</span></div>
        <span class="level-head__count">${secondaryGrades.length} grados</span>
      </div>
      <div class="grades">
        ${secondaryGrades.map(gradeCard).join('')}
      </div>
    </section>

    <section class="section">
      <div class="section__head">
        <div>
          <span class="section__eyebrow">Para empezar</span>
          <h2 class="section__title">Misiones destacadas</h2>
          <p class="section__sub">Una suma en el mercado, un ecosistema de Chiapas y una misión de secundaria.</p>
        </div>
        <a class="link-arrow" href="#/grado/p1">Ver primaria ${icon('arrowRight', 15)}</a>
      </div>
      <div class="featured">
        ${featured
          .map((l) => {
            const s = SUBJECTS[l.subject];
            const g = GRADES.find((x) => x.id === l.gradeId);
            return `<a class="mini-lesson" href="#/leccion/${l.id}" style="--c1:${s.color};--c2:${s.color2}">
              <div class="mini-lesson__top">
                <span class="mini-lesson__icon">${subjectIcon(l.subject)}</span>
                <span class="mini-lesson__subject">${escapeHTML(s.name)} · ${g?.label || ''} ${g?.level === 'primaria' ? 'primaria' : 'secundaria'}</span>
              </div>
              <h3 class="mini-lesson__title">${escapeHTML(l.title)}</h3>
              <div class="mini-lesson__meta">
                <span>${icon('clock', 13)} ${l.duration} min</span>
                <span>${icon('bolt', 13)} ${l.xp} XP</span>
                <span>${icon('layers', 13)} ${l.steps.length} pasos</span>
              </div>
            </a>`;
          })
          .join('')}
      </div>
    </section>

    <section class="section">
      <div class="story-banner">
        <div class="story-banner__icon">${icon('book', 28)}</div>
        <div class="story-banner__copy">
          <span class="section__eyebrow">Modo cuento · una historia por grado</span>
          <h2 class="section__title">Cuentos que se escuchan</h2>
          <p class="section__sub">Luci narra, tú eliges. Nueve historias interactivas para aprender Lengua, Ciencias, Historia y Geografía con la voz del dispositivo.</p>
        </div>
        <div class="story-banner__actions">
          <a class="btn btn--primary" href="#/leccion/story-p1-palabra">${icon('play', 15)} 1º primaria</a>
          <a class="btn btn--ghost" href="#/leccion/story-s1-escriba">1º secundaria</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="challenge-banner">
        <div class="challenge-banner__copy">
          <span class="section__eyebrow">Inspirado en Quiz Battle · ahora offline</span>
          <h2 class="section__title">Reto rápido: 10 preguntas, 60 segundos</h2>
          <p class="section__sub">Un relámpago de preguntas de todas las materias. Acierta, suma puntos y compite contra tu mejor marca.</p>
        </div>
        <div class="challenge-banner__actions">
          <div class="challenge-banner__best">Mejor marca <b>${challengeBest.correct}/10</b></div>
          <a class="btn btn--primary" href="#/reto">${icon('bolt', 17)} Jugar reto</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="install-banner">
        <div>
          <span class="section__eyebrow">Llévala contigo</span>
          <h2 class="section__title">Una app, tres formas de distribuirla</h2>
          <p class="section__sub">PWA instalable, carpeta portable o un solo archivo HTML. Sin tienda de apps, sin backend y sin conexión.</p>
        </div>
        <div class="install-banner__actions">
          <button class="btn btn--primary" data-action="install">${icon('download', 17)} Instalar app</button>
          <span class="install-banner__note">Android · iPhone · Windows · Mac · Linux</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section__head">
        <div>
          <span class="section__eyebrow">Diseñado para Chiapas</span>
          <h2 class="section__title">Aprender donde no hay señal</h2>
          <p class="section__sub">Sin nube, sin registro, sin depender de la conexión. La luz de Luci basta.</p>
        </div>
      </div>
      <div class="features">
        <div class="feature">
          <div class="feature__icon">${icon('offline', 18)}</div>
          <h3 class="feature__title">100% offline</h3>
          <p class="feature__text">Todo el contenido y las interacciones viven en tu dispositivo.</p>
        </div>
        <div class="feature">
          <div class="feature__icon">${icon('volume', 18)}</div>
          <h3 class="feature__title">Voz y lectura</h3>
          <p class="feature__text">Cada misión se puede escuchar con la voz del dispositivo.</p>
        </div>
        <div class="feature">
          <div class="feature__icon">${icon('target', 18)}</div>
          <h3 class="feature__title">Aprender haciendo</h3>
          <p class="feature__text">Balanza, mapas, líneas del tiempo y retos con retroalimentación.</p>
        </div>
        <div class="feature">
          <div class="feature__icon">${icon('medal', 18)}</div>
          <h3 class="feature__title">Progreso con sentido</h3>
          <p class="feature__text">XP, rachas y logros que se guardan en tu cuaderno local.</p>
        </div>
      </div>
    </section>`;
}

/* ---------- Grade ---------- */

function gradeView(gradeId) {
  const grade = GRADES.find((g) => g.id === gradeId);
  if (!grade) return notFoundView('Ese grado no existe.');
  const progress = getGradeProgress(grade.id);
  const lessons = LESSONS.filter((l) => l.gradeId === grade.id);
  const availableSubjects = Object.entries(SUBJECTS).filter(([key]) =>
    lessons.some((l) => l.subject === key)
  );

  return `<div class="crumbs"><a href="#/">Inicio</a>${icon('chevronRight')}<span>${escapeHTML(grade.name)}</span></div>
    <section class="grade-hero" data-big="${grade.grade}" style="--c1:${grade.color};--c2:${grade.color2}">
      <div>
        <div class="grade-hero__label">${escapeHTML(grade.tagline)} · ${grade.level === 'primaria' ? 'Primaria' : 'Secundaria'}</div>
        <h1 class="grade-hero__title">${escapeHTML(grade.name)}</h1>
        <p class="grade-hero__desc">${escapeHTML(grade.description)}</p>
      </div>
      <div class="progress-ring" style="--value:${progress.pct};--c1:${grade.color}">
        <div class="progress-ring__text">
          <div class="progress-ring__num">${progress.pct}%</div>
          <div class="progress-ring__label">completado</div>
        </div>
      </div>
    </section>

    <section class="section" style="margin-top:32px">
      <div class="section__head">
        <div>
          <span class="section__eyebrow">Materias</span>
          <h2 class="section__title">¿Qué quieres explorar hoy?</h2>
        </div>
        <span class="pill">${progress.done}/${progress.total} misiones</span>
      </div>
      <div class="subjects ${availableSubjects.length === 3 ? 'subjects--three' : availableSubjects.length >= 5 ? 'subjects--five' : ''}">
        ${availableSubjects
          .map(([key, s]) => {
            const p = getSubjectProgress(grade.id, key);
            const count = lessons.filter((l) => l.subject === key).length;
            return `<a class="subject-card" href="#/grado/${grade.id}/${key}" style="--c1:${s.color};--c2:${s.color2}">
              <div class="subject-card__head">
                <span class="subject-card__icon">${subjectIcon(key)}</span>
                <span class="subject-card__count">${count} misiones</span>
              </div>
              <h3 class="subject-card__title">${escapeHTML(s.name)}</h3>
              <p class="subject-card__desc">${escapeHTML(s.blurb)}</p>
              <div class="subject-card__bottom">
                <div class="bar"><span style="width:${p.pct}%"></span></div>
                <span class="subject-card__pct">${p.pct}%</span>
              </div>
            </a>`;
          })
          .join('')}
      </div>
    </section>

    <section class="section" style="margin-top:46px">
      <div class="section__head">
        <div>
          <span class="section__eyebrow">Todas las misiones</span>
          <h2 class="section__title">Tu ruta de ${grade.label}</h2>
        </div>
      </div>
      <div class="lesson-list">
        ${lessons
          .map((l, idx) => lessonRow(l, idx + 1))
          .join('')}
      </div>
    </section>`;
}

function lessonRow(l, num) {
  const s = SUBJECTS[l.subject];
  const done = isLessonDone(l.id);
  return `<a class="lesson-row" href="#/leccion/${l.id}" style="--c1:${s.color};--c2:${s.color2}">
    <span class="lesson-row__num">${String(num).padStart(2, '0')}</span>
    <span class="lesson-row__main">
      <span class="lesson-row__title">${escapeHTML(l.title)}</span>
      <span class="lesson-row__sub">${escapeHTML(l.subtitle)}</span>
    </span>
    <span class="lesson-row__meta">
      <span>${icon('clock', 13)} ${l.duration} min</span>
      <span>${icon('bolt', 13)} ${l.xp} XP</span>
    </span>
    <span class="lesson-row__status ${done ? 'is-done' : ''}">${icon(done ? 'check' : 'play', 14)}</span>
  </a>`;
}

/* ---------- Subject ---------- */

function subjectView(gradeId, subjectKey) {
  const grade = GRADES.find((g) => g.id === gradeId);
  const s = SUBJECTS[subjectKey];
  if (!grade || !s) return notFoundView('Esa materia no existe.');
  const lessons = LESSONS.filter((l) => l.gradeId === grade.id && l.subject === subjectKey);
  const p = getSubjectProgress(grade.id, subjectKey);

  return `<div class="crumbs"><a href="#/">Inicio</a>${icon('chevronRight')}<a href="#/grado/${grade.id}">${escapeHTML(grade.name)}</a>${icon('chevronRight')}<span>${escapeHTML(s.name)}</span></div>
    <section class="subject-hero" style="--c1:${s.color};--c2:${s.color2}">
      <div class="subject-hero__icon">${subjectIcon(subjectKey)}</div>
      <div class="grade-hero__label">${escapeHTML(grade.name)} · ${lessons.length} misiones</div>
      <h1 class="subject-hero__title">${escapeHTML(s.name)}</h1>
      <p class="subject-hero__desc">${escapeHTML(s.blurb)}</p>
      <div class="subject-card__bottom" style="max-width:420px">
        <div class="bar"><span style="width:${p.pct}%"></span></div>
        <span class="subject-card__pct">${p.done}/${p.total} · ${p.pct}%</span>
      </div>
    </section>

    <section class="section" style="margin-top:32px">
      <div class="section__head">
        <div>
          <span class="section__eyebrow">Misiones</span>
          <h2 class="section__title">Elige una misión</h2>
          <p class="section__sub">Cada una dura entre 8 y 15 minutos y se guarda en tu cuaderno.</p>
        </div>
        <span class="pill">${p.done}/${p.total} completadas</span>
      </div>
      <div class="lesson-list">
        ${lessons.map((l, idx) => lessonRow(l, idx + 1)).join('')}
      </div>
    </section>`;
}

/* ---------- Notebook ---------- */

function notebookView() {
  const user = getState();
  const total = getTotalProgress();
  const level = getLevel();
  const last = getLastLesson();
  const badges = getBadgeCards(user);

  return `<div class="crumbs"><a href="#/">Inicio</a>${icon('chevronRight')}<span>Mi cuaderno</span></div>
    <section class="profile-card">
      <div class="profile-card__avatar">${escapeHTML((user.name || 'E').charAt(0).toUpperCase())}</div>
      <div>
        <div class="grade-hero__label">Tu cuaderno de descubrimientos</div>
        <h1 class="profile-card__name">${escapeHTML(user.name)}</h1>
        <p class="profile-card__sub">Nivel ${level.level} · ${user.xp} XP · ${total.done} de ${total.total} misiones completadas</p>
        <button class="btn btn--ghost btn--small" data-action="edit-name" style="margin-top:12px">${icon('pencil', 14)} Cambiar nombre</button>
      </div>
      <div class="profile-stats">
        <div class="profile-stat"><b>${user.xp}</b><span>XP</span></div>
        <div class="profile-stat"><b>${getStreak()}</b><span>Racha</span></div>
        <div class="profile-stat"><b>${total.done}</b><span>Misiones</span></div>
      </div>
    </section>

    <div class="notebook-grid">
      <div class="panel">
        <div class="panel__head">
          <h2 class="panel__title">Progreso por materia</h2>
          <span class="pill">${total.pct}% total</span>
        </div>
        <div class="progress-list">
          ${Object.entries(SUBJECTS)
            .map(([key, s]) => {
              const p = getSubjectProgressGlobal(key);
              return `<div class="progress-item" style="--c1:${s.color};--c2:${s.color2}">
                <span class="progress-item__icon">${subjectIcon(key)}</span>
                <div>
                  <div class="progress-item__name">${escapeHTML(s.name)}</div>
                  <div class="progress-item__bar"><span style="width:${p.pct}%"></span></div>
                </div>
                <span class="progress-item__pct">${p.done}/${p.total}</span>
              </div>`;
            })
            .join('')}
        </div>
        <div class="notebook-actions">
          ${
            last
              ? `<a class="btn btn--primary btn--small" href="#/leccion/${last.id}">${icon('play', 14)} Continuar: ${escapeHTML(last.title)}</a>`
              : `<a class="btn btn--primary btn--small" href="#/grado/p1">${icon('play', 14)} Empezar mi primera misión</a>`
          }
          <button class="btn btn--ghost btn--small" data-action="reset">${icon('refresh', 14)} Reiniciar progreso</button>
        </div>
      </div>

      <div class="panel">
        <div class="panel__head">
          <h2 class="panel__title">Logros</h2>
          <a class="link-arrow" href="#/logros">Ver todos ${icon('arrowRight', 14)}</a>
        </div>
        <div class="badges">
          ${badges.slice(0, 6).join('')}
        </div>
        <div style="margin-top:16px;padding:14px;border:1px solid rgba(94,234,212,.16);border-radius:14px;background:rgba(94,234,212,.045)">
          <div style="font-size:.72rem;font-weight:700;color:var(--cyan);display:flex;gap:7px;align-items:center">${icon('sparkles', 14)} Luci dice</div>
          <p style="margin-top:5px;color:var(--muted);font-size:.74rem;line-height:1.55">Completa una misión de cada materia y la constancia de explorador será tuya. No hay prisa: aprender es un camino, no una carrera.</p>
        </div>
      </div>
    </div>

    <section class="section" style="margin-top:26px">
      <div class="section__head">
        <div>
          <span class="section__eyebrow">Siguiente paso</span>
          <h2 class="section__title">Misiones que te faltan</h2>
        </div>
      </div>
      <div class="lesson-list">
        ${LESSONS.filter((l) => !isLessonDone(l.id)).slice(0, 4).map((l, idx) => lessonRow(l, idx + 1)).join('') ||
          `<div class="empty">¡Completaste todas las misiones! Eres oficialmente un explorador de Raíz.</div>`}
      </div>
    </section>`;
}

function getBadgeCards(user) {
  return BADGES.map((b) => {
    const on = user.badges?.includes(b.id);
    return `<div class="badge-card ${on ? 'is-unlocked' : ''}">
      <div class="badge-card__icon">${badgeIcon(b.icon)}</div>
      <div><div class="badge-card__name">${b.name}</div><div class="badge-card__desc">${on ? b.desc : 'Bloqueado'}</div></div>
    </div>`;
  });
}

function achievementsView() {
  const user = getState();
  const total = getTotalProgress();
  return `<div class="crumbs"><a href="#/">Inicio</a>${icon('chevronRight')}<span>Logros</span></div>
    <section class="grade-hero" data-big="" style="--c1:#fbbf24;--c2:#fb7185">
      <div>
        <div class="grade-hero__label">Colección de logros</div>
        <h1 class="grade-hero__title">Cada misión deja huella</h1>
        <p class="grade-hero__desc">Has completado ${total.done} de ${total.total} misiones. Los logros se desbloquean solos y viven en tu cuaderno local.</p>
      </div>
      <div class="progress-ring" style="--value:${total.pct};--c1:#fbbf24">
        <div class="progress-ring__text"><div class="progress-ring__num">${total.pct}%</div><div class="progress-ring__label">avance</div></div>
      </div>
    </section>
    <section class="section" style="margin-top:32px">
      <div class="section__head">
        <div><span class="section__eyebrow">Tu colección</span><h2 class="section__title">${user.badges?.length || 0} de ${BADGES.length} logros</h2></div>
      </div>
      <div class="badges" style="grid-template-columns:repeat(2,minmax(0,1fr))">
        ${getBadgeCards(user).join('')}
      </div>
    </section>`;
}

function notFoundView(message = 'No encontramos esa página.') {
  return `<section class="card" style="padding:60px 30px;text-align:center">
    <div style="font-size:3rem;margin-bottom:10px">🌱</div>
    <h1 style="font-family:var(--font-display);font-size:2rem;letter-spacing:-.04em">Te perdiste en la selva</h1>
    <p style="color:var(--muted);margin-top:10px">${escapeHTML(message)}</p>
    <a class="btn btn--primary" href="#/" style="margin-top:22px">${icon('home', 16)} Volver al inicio</a>
  </section>`;
}

/* ---------- Modal actions ---------- */

function editNameModal() {
  const user = getState();
  openModal({
    title: '¿Cómo te llamas?',
    body: `<p class="modal__text">Tu nombre se queda en este dispositivo. No se envía a ningún servidor.</p>
      <div class="field"><label for="name-input">Nombre o apodo</label><input id="name-input" maxlength="24" value="${escapeHTML(user.name)}" autocomplete="off" /></div>`,
    actions: [
      { label: 'Cancelar', className: 'btn--ghost' },
      {
        label: 'Guardar',
        className: 'btn--primary',
        onClick: () => {
          const value = document.getElementById('name-input')?.value;
          setName(value);
          toast('Nombre actualizado');
          render();
        },
      },
    ],
  });
  setTimeout(() => document.getElementById('name-input')?.focus(), 80);
}

function resetModal() {
  openModal({
    title: 'Reiniciar progreso',
    body: `<p class="modal__text">Se borrarán las misiones completadas, el XP, la racha y los logros de este dispositivo. Esta acción no se puede deshacer.</p>`,
    actions: [
      { label: 'Cancelar', className: 'btn--ghost' },
      {
        label: 'Sí, reiniciar',
        className: 'btn--danger',
        onClick: () => {
          resetProgress();
          toast('Progreso reiniciado');
          render();
        },
      },
    ],
  });
}

function installModal() {
  if (window.matchMedia?.('(display-mode: standalone)').matches) {
    openModal({
      title: 'Raíz ya está instalada',
      body: `<p class="modal__text">Estás usando la versión instalada. Puedes abrirla desde tu pantalla de inicio o menú de aplicaciones, incluso sin internet.</p>`,
      actions: [{ label: 'Genial', className: 'btn--primary' }],
    });
    return;
  }

  if (deferredInstallPrompt) {
    openModal({
      title: 'Instalar Raíz',
      body: `<p class="modal__text">Raíz se instalará como una app en este dispositivo. Después podrás abrirla sin conexión, como cualquier otra aplicación.</p>
        <div class="panel__note" style="margin-top:14px"><strong>Ocupa muy poco:</strong> contenido, voz y progreso viven en tu dispositivo.</div>`,
      actions: [
        { label: 'Ahora no', className: 'btn--ghost' },
        {
          label: 'Instalar ahora',
          className: 'btn--primary',
          onClick: async () => {
            const prompt = deferredInstallPrompt;
            deferredInstallPrompt = null;
            try {
              await prompt.prompt();
              await prompt.userChoice;
            } catch {
              /* El navegador puede cancelar el prompt. */
            }
          },
        },
      ],
    });
    return;
  }

  openModal({
    title: 'Lleva Raíz contigo',
    body: `<p class="modal__text">Puedes instalarla como app o copiar la carpeta para usarla sin internet.</p>
      <div class="install-steps">
        <div><b>Android / Chrome</b><span>Menú ⋮ → “Instalar aplicación” o “Agregar a pantalla principal”.</span></div>
        <div><b>iPhone / iPad</b><span>Compartir → “Agregar a inicio”.</span></div>
        <div><b>Windows / Mac</b><span>Icono de instalar en la barra de direcciones, o abre <code>start.bat</code> / <code>start.sh</code>.</span></div>
        <div><b>Sin instalación</b><span>Descomprime <code>Raiz-offline.zip</code> y abre <code>index.html</code> o el servidor local.</span></div>
      </div>
      <p class="modal__text" style="margin-top:14px"><strong>Para distribuir:</strong> comparte la carpeta <code>dist/</code>, el ZIP portable o publica la carpeta en GitHub Pages/Netlify. Todo funciona sin backend.</p>`,
    actions: [{ label: 'Entendido', className: 'btn--primary' }],
  });
}

function aboutModal() {
  openModal({
    title: 'Acerca de Raíz',
    body: `<p class="modal__text"><strong>Raíz</strong> es un prototipo de enciclopedia interactiva offline para secundaria. Cada misión combina una explicación breve, una interacción y un reto con retroalimentación.</p>
      <p class="modal__text" style="margin-top:12px">Está inspirado en las enciclopedias interactivas de los 90, pero diseñado para tres realidades de Chiapas: conectividad intermitente, escuelas multigrado y diversidad cultural.</p>
      <div class="panel__note" style="margin-top:16px"><strong>Contenido:</strong> alineación conceptual al Plan de Estudios 2022 de la SEP, con ejemplos de Chiapas. Es un demo: antes de usarlo en aula debe revisarse con docentes y contrastarse con los libros de texto oficiales.</div>
      <p class="modal__text" style="margin-top:12px"><strong>Fuentes recomendadas para la siguiente iteración:</strong> SEP (planes y programas), INEGI (censo y territorio), CONEVAL (pobreza), INPI (pueblos indígenas) y Secretaría de Salud de Chiapas.</p>
      <p class="modal__text" style="margin-top:12px"><strong>Privacidad:</strong> no hay cuentas, servidores ni analytics. El progreso se guarda solo en este dispositivo con <code>localStorage</code>.</p>`,
    actions: [{ label: 'Entendido', className: 'btn--primary' }],
  });
}

/* ---------- Interactions ---------- */

function bindTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

function handleAction(action) {
  if (action === 'sound') {
    const nowMuted = toggleMute();
    const btn = document.querySelector('[data-action="sound"]');
    if (btn) {
      btn.innerHTML = icon(nowMuted ? 'mute' : 'volume');
      btn.setAttribute('aria-label', nowMuted ? 'Activar sonido' : 'Silenciar');
    }
    toast(nowMuted ? 'Sonido silenciado' : 'Sonido activado');
    return;
  }
  if (action === 'scroll-grades') {
    document.getElementById('grados')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (action === 'edit-name') {
    editNameModal();
    return;
  }
  if (action === 'reset') {
    resetModal();
    return;
  }
  if (action === 'about') {
    aboutModal();
    return;
  }
  if (action === 'install') {
    installModal();
    return;
  }
}

/* ---------- Render ---------- */

function render() {
  stopConfetti();
  currentCleanup?.();
  currentCleanup = null;
  stopSpeaking();
  const route = parseRoute();
  let content = '';
  let full = false;

  if (route.name === 'home') content = homeView();
  else if (route.name === 'grade') content = gradeView(route.gradeId);
  else if (route.name === 'subject') content = subjectView(route.gradeId, route.subject);
  else if (route.name === 'notebook') content = notebookView();
  else if (route.name === 'achievements') content = achievementsView();
  else if (route.name === 'challenge') content = renderChallengePage();
  else if (route.name === 'lesson') {
    content = renderLessonPage(route.id);
    full = true;
  } else content = notFoundView();

  app.innerHTML = shell(content, route, { full });

  if (route.name === 'lesson' && content) {
    currentCleanup = mountLesson(route.id) || null;
  }
  if (route.name === 'challenge' && content) {
    currentCleanup = mountChallenge() || null;
  }

  bindTilt();
  if (route.name !== 'lesson') window.scrollTo(0, 0);
  document.title =
    route.name === 'home'
      ? 'Raíz · Aprende sin señal'
      : route.name === 'lesson'
        ? `${getLesson(route.id)?.title || 'Misión'} · Raíz`
        : route.name === 'grade'
          ? `${GRADES.find((g) => g.id === route.gradeId)?.name || 'Grado'} · Raíz`
          : route.name === 'subject'
            ? `${SUBJECTS[route.subject]?.name || 'Materia'} · Raíz`
            : route.name === 'challenge'
              ? 'Reto rápido · Raíz'
              : route.name === 'notebook'
                ? 'Mi cuaderno · Raíz'
                : 'Logros · Raíz';
}

/* ---------- Boot ---------- */

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (btn) {
    e.preventDefault();
    handleAction(btn.dataset.action);
  }
});

window.addEventListener('hashchange', render);

touchVisit();
initStars();
render();

// Service worker for offline mode
if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !window.Capacitor) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// Keyboard shortcuts: Escape closes modal, "s" sound
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelector('.modal.is-open [data-close]')?.click();
  }
  if (e.key.toLowerCase() === 's' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
    handleAction('sound');
  }
});

// Llamado desde la lección al completar para refrescar el shell sin perder la vista
export function refreshShell() {
  // no-op: el progreso se lee al volver; mantenemos simple
}

export { render, toast, openModal, confetti, speak, speechSupported };
export function getRoute() {
  return parseRoute();
}

const ICONS = {
  sprout: '<path d="M12 21v-7"/><path d="M12 14c0-3.6 2.6-6.2 6.2-6.2 0 3.6-2.6 6.2-6.2 6.2Z"/><path d="M12 16.2c0-2.8-2.1-5-5-5 0 2.8 2.1 5 5 5Z"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  arrowUp: '<path d="M12 19V5"/><path d="m6 11 6-6 6 6"/>',
  arrowDown: '<path d="M12 5v14"/><path d="m6 13 6 6 6-6"/>',
  rotateLeft: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10a5 5 0 0 1 0 10h-3"/>',
  rotateRight: '<path d="m15 14 5-5-5-5"/><path d="M20 9H10a5 5 0 0 0 0 10h3"/>',
  arrowLeft: '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
  bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>',
  check: '<path d="m5 13 4 4L19 7"/>',
  play: '<path d="M8 5.5v13l10-6.5-10-6.5Z"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/>',
  notebook: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M9 7h6M9 11h6M9 15h4"/>',
  trophy: '<path d="M8 4h8v4a4 4 0 0 1-8 0V4Z"/><path d="M8 5H4v2a4 4 0 0 0 4 4M16 5h4v2a4 4 0 0 1-4 4"/><path d="M12 12v4M9 20h6M10 16h4l1 4H9l1-4Z"/>',
  volume: '<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
  mute: '<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="m16 9 5 5M21 9l-5 5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.4l6.1-.9L12 3Z"/>',
  sigma: '<path d="M7 4h10L12 12l5 8H7"/>',
  flask: '<path d="M9 3h6"/><path d="M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/>',
  column: '<path d="M4 21h16M6 21V9M10 21V9M14 21V9M18 21V9M3 9h18L12 3 3 9Z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>',
  flame: '<path d="M12 3c1 3.5 5 5.2 5 9a5 5 0 0 1-10 0c0-2.5 1.4-4 2.6-5.3.6 1.5 1.4 2.3 2.4 2.6C12 7.5 12 5.2 12 3Z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
  medal: '<circle cx="12" cy="14" r="5"/><path d="m8 4 2 5M16 4l-2 5M12 12v4M10.5 14h3"/>',
  crown: '<path d="m3 8 4 3 5-6 5 6 4-3-2 10H5L3 8Z"/>',
  map: '<path d="m9 4 6 2 6-2v14l-6 2-6-2-6 2V6l6-2Z"/><path d="M9 4v14M15 6v14"/>',
  route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h4a4 4 0 0 0 4-4V8"/>',
  pyramid: '<path d="m12 3 9 18H3L12 3Z"/><path d="M7 21h10M9.5 15h5M8 18h8"/>',
  head: '<path d="M8 21v-4a6 6 0 1 1 8 0v4"/><path d="M9 10h.01M15 10h.01M10 14c1.2 1 2.8 1 4 0"/>',
  cross: '<path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3Z"/>',
  scroll: '<path d="M5 4h12a2 2 0 0 1 2 2v12a2 2 0 0 0 2 2H7a2 2 0 0 1-2-2V4Z"/><path d="M5 4a2 2 0 0 0-2 2v2h4M8 9h8M8 13h8M8 17h5"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 20h4"/>',
  flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
  sword: '<path d="m14 4 6-1-1 6-9 9-4 1 1-4 7-11Z"/><path d="m5 19 3-3"/>',
  tractor: '<circle cx="7" cy="17" r="3"/><circle cx="18" cy="18" r="2.5"/><path d="M10 17h5M4 17V9h6l2 4h5v5M10 9V6h4"/>',
  megaphone: '<path d="M3 11v3l14 5V6L3 11Z"/><path d="M17 9a3 3 0 0 1 0 6M6 15v4"/>',
  download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  code: '<path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/><path d="m14 4-4 16"/>',
  vote: '<path d="M4 10h16v10H4V10Z"/><path d="m8 10 3-5 3 5M9 15l2 2 4-4"/>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  offline: '<path d="M4 15a4 4 0 0 1 1-7.9A5.5 5.5 0 0 1 16 6a4.5 4.5 0 0 1 4 4.5"/><path d="m3 3 18 18M8 19h8"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  refresh: '<path d="M4 12a8 8 0 0 1 13.5-5.5L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-13.5 5.5L4 15"/><path d="M4 20v-5h5"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  leaf: '<path d="M20 4C10 4 4 9 4 16c0 2 1 4 1 4s2-9 15-16Z"/><path d="M5 20c2-5 6-8 11-10"/>',
  home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>',
  grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
  sparkles: '<path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/>',
  infinity: '<path d="M8 12c-2 0-4-1.8-4-4s2-4 4-4c3.5 0 4.5 8 8 8 2 0 4-1.8 4-4s-2-4-4-4c-3.5 0-4.5 8-8 8Z"/>',
  pause: '<path d="M9 5v14M15 5v14"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  pencil: '<path d="m4 20 4-1 11-11-3-3L5 16l-1 4Z"/><path d="m14 6 3 3"/>',
};

export function icon(name, size = 18, extra = '') {
  const path = ICONS[name] || ICONS.spark;
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${path}</svg>`;
}

export function subjectIcon(subject) {
  const map = { matematicas: 'sigma', ciencias: 'flask', historia: 'column', geografia: 'globe', lengua: 'book', programacion: 'code' };
  return icon(map[subject] || 'book', 24);
}

export function badgeIcon(name) {
  const map = {
    spark: '✨',
    flame: '🔥',
    sigma: '🧮',
    flask: '🧪',
    column: '🏛️',
    globe: '🗺️',
    target: '🎯',
    layers: '🧩',
    medal: '🏅',
    crown: '👑',
    book: '📖',
    code: '💻',
    bolt: '⚡',
  };
  return `<span aria-hidden="true">${map[name] || '✨'}</span>`;
}

export function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function logoMark(size = 38) {
  return `<span class="brand__mark" style="width:${size}px;height:${size}px">
    <svg viewBox="0 0 48 48" width="${size * 0.58}" height="${size * 0.58}" fill="none" stroke="#5eead4" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M24 42V24"/>
      <path d="M24 29c0-8 6-13 14-13 0 8-6 13-14 13Z" fill="rgba(94,234,212,.12)"/>
      <path d="M24 34c0-6-4.5-10-10.5-10 0 6 4.5 10 10.5 10Z" fill="rgba(139,92,246,.16)"/>
      <path d="M24 42c-4 0-7-2.8-7-6.2 4 0 7 2.8 7 6.2Z" fill="rgba(190,242,100,.16)"/>
    </svg>
  </span>`;
}

export function mascotSVG() {
  return `<svg class="mascot" viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Luci, una luciérnaga que guía el aprendizaje">
    <defs>
      <radialGradient id="m-glow" cx="50%" cy="60%" r="50%">
        <stop offset="0%" stop-color="#bef264" stop-opacity=".55"/>
        <stop offset="55%" stop-color="#5eead4" stop-opacity=".14"/>
        <stop offset="100%" stop-color="#5eead4" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="m-body" x1="140" y1="120" x2="230" y2="280" gradientUnits="userSpaceOnUse">
        <stop stop-color="#1b2b52"/>
        <stop offset="1" stop-color="#0a1228"/>
      </linearGradient>
      <linearGradient id="m-wing" x1="100" y1="120" x2="190" y2="200" gradientUnits="userSpaceOnUse">
        <stop stop-color="#a7f3d0" stop-opacity=".55"/>
        <stop offset="1" stop-color="#67e8f9" stop-opacity=".08"/>
      </linearGradient>
      <linearGradient id="m-belly" x1="160" y1="210" x2="210" y2="300" gradientUnits="userSpaceOnUse">
        <stop stop-color="#fef08a"/>
        <stop offset=".55" stop-color="#bef264"/>
        <stop offset="1" stop-color="#5eead4"/>
      </linearGradient>
      <filter id="m-blur" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="10"/>
      </filter>
    </defs>
    <circle cx="180" cy="220" r="118" fill="url(#m-glow)" filter="url(#m-blur)"/>
    <g opacity=".7">
      <circle cx="78" cy="118" r="3" fill="#5eead4"/>
      <circle cx="286" cy="88" r="2" fill="#bef264"/>
      <circle cx="300" cy="242" r="2.5" fill="#a78bfa"/>
      <circle cx="62" cy="250" r="2" fill="#67e8f9"/>
      <path d="M90 78l3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8Z" fill="#bef264" opacity=".8"/>
    </g>
    <ellipse cx="180" cy="300" rx="58" ry="10" fill="#000" opacity=".28"/>
    <g transform="rotate(-8 180 210)">
      <path d="M126 170c-38-34-48-82-18-92 24-8 48 22 62 54" fill="url(#m-wing)" stroke="rgba(190,255,245,.45)" stroke-width="2"/>
      <path d="M226 170c38-34 48-82 18-92-24-8-48 22-62 54" fill="url(#m-wing)" stroke="rgba(190,255,245,.45)" stroke-width="2"/>
      <path d="M132 196c-20-8-26-28-14-38 10-8 26-2 40 14" fill="url(#m-wing)" opacity=".7"/>
      <path d="M220 196c20-8 26-28 14-38-10-8-26-2-40 14" fill="url(#m-wing)" opacity=".7"/>
    </g>
    <ellipse cx="180" cy="216" rx="45" ry="60" fill="url(#m-body)" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>
    <ellipse cx="180" cy="250" rx="30" ry="32" fill="url(#m-belly)" opacity=".95"/>
    <ellipse cx="180" cy="246" rx="20" ry="24" fill="#fefce8" opacity=".55" filter="url(#m-blur)"/>
    <path d="M152 168c6-18 20-28 28-28s22 10 28 28" stroke="rgba(255,255,255,.16)" stroke-width="1.4"/>
    <g fill="#eafffa">
      <circle cx="164" cy="202" r="7"/>
      <circle cx="196" cy="202" r="7"/>
    </g>
    <g fill="#0a1228">
      <circle cx="166" cy="202" r="3.2"/>
      <circle cx="194" cy="202" r="3.2"/>
    </g>
    <path d="M170 220c4 6 16 6 20 0" stroke="#0a1228" stroke-width="2.6" stroke-linecap="round"/>
    <g stroke="#5eead4" stroke-width="2.2" stroke-linecap="round">
      <path d="M166 158c-6-16-18-24-30-24"/>
      <path d="M194 158c6-16 18-24 30-24"/>
    </g>
    <g fill="#bef264">
      <circle cx="134" cy="132" r="4"/>
      <circle cx="226" cy="132" r="4"/>
    </g>
    <g stroke="rgba(255,255,255,.25)" stroke-width="1.4">
      <path d="M154 182c-6 2-10 6-12 12M206 182c6 2 10 6 12 12"/>
    </g>
  </svg>`;
}

function defs(uid, c1, c2) {
  return `<defs>
    <linearGradient id="sky-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#0a1024"/><stop offset="1" stop-color="#050712"/>
    </linearGradient>
    <linearGradient id="acc-${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="halo-${uid}" cx="50%" cy="50%" r="50%">
      <stop stop-color="${c1}" stop-opacity=".35"/><stop offset="1" stop-color="${c1}" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft-${uid}" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="12"/>
    </filter>
  </defs>`;
}

function stars(seed = 1) {
  let out = '';
  for (let i = 0; i < 26; i++) {
    const x = ((i * 97 + seed * 37) % 590) + 5;
    const y = ((i * 53 + seed * 71) % 380) + 10;
    const r = i % 5 === 0 ? 1.6 : 0.9;
    out += `<circle cx="${x}" cy="${y}" r="${r}" fill="#dfe9ff" opacity="${0.18 + (i % 4) * 0.08}"/>`;
  }
  return out;
}

function mountains(uid, c1) {
  return `<path d="M0 390 110 300l70 52 96-112 108 120 76-66 140 106v60H0Z" fill="#070c1b"/>
  <path d="M0 410 120 330l64 46 90-92 118 118 70-50 138 84v44H0Z" fill="url(#sky-${uid})" opacity=".9"/>
  <path d="M0 430h600v70H0Z" fill="#05070f"/>`;
}

export function sceneSVG(name, c1 = '#5eead4', c2 = '#8b5cf6') {
  const uid = `s${Math.random().toString(36).slice(2, 8)}`;
  const d = defs(uid, c1, c2);
  const common = `<rect width="600" height="500" fill="url(#sky-${uid})"/>${stars(3)}`;
  let body = '';

  if (name === 'market') {
    body = `${common}
      <circle cx="470" cy="120" r="86" fill="url(#halo-${uid})" filter="url(#soft-${uid})"/>
      <circle cx="470" cy="120" r="40" fill="#fbbf24" opacity=".8"/>
      ${mountains(uid, c1)}
      <path d="M90 300h420l30 100H60Z" fill="#0b1226" stroke="rgba(255,255,255,.08)"/>
      <path d="M120 300v-70h300v70" fill="#101a34" stroke="rgba(255,255,255,.1)"/>
      <path d="M110 230h320l-30-34H140Z" fill="url(#acc-${uid})" opacity=".85"/>
      <g fill="#05070f" opacity=".55">
        <path d="M140 230h34v70h-34zM214 230h34v70h-34zM288 230h34v70h-34zM362 230h34v70h-34z"/>
      </g>
      <g>
        <rect x="150" y="330" width="110" height="44" rx="8" fill="#0f1930" stroke="rgba(255,255,255,.08)"/>
        <circle cx="178" cy="326" r="12" fill="#fbbf24" opacity=".9"/>
        <circle cx="206" cy="326" r="12" fill="#fb7185" opacity=".85"/>
        <circle cx="234" cy="326" r="12" fill="#bef264" opacity=".8"/>
        <rect x="320" y="330" width="120" height="44" rx="8" fill="#0f1930" stroke="rgba(255,255,255,.08)"/>
        <path d="M340 326h80" stroke="#5eead4" stroke-width="4" stroke-linecap="round"/>
        <path d="M350 350h60" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" opacity=".7"/>
      </g>
      <g stroke="rgba(251,191,36,.5)" stroke-width="1.2" opacity=".9">
        <path d="M110 210c40 18 80 18 120 0s80-18 120 0 60 18 80 0"/>
      </g>
      <g fill="#fef3c7">
        <circle cx="130" cy="206" r="3"/><circle cx="190" cy="214" r="3"/><circle cx="250" cy="206" r="3"/><circle cx="310" cy="214" r="3"/><circle cx="370" cy="206" r="3"/>
      </g>`;
  } else if (name === 'balance') {
    body = `${common}
      <circle cx="300" cy="180" r="130" fill="url(#halo-${uid})" filter="url(#soft-${uid})"/>
      <path d="M300 100v230M180 150h240" stroke="url(#acc-${uid})" stroke-width="5" stroke-linecap="round"/>
      <path d="M300 330h-60M300 330h60" stroke="rgba(255,255,255,.25)" stroke-width="8" stroke-linecap="round"/>
      <circle cx="300" cy="100" r="13" fill="url(#acc-${uid})"/>
      <g stroke="rgba(255,255,255,.35)" stroke-width="2">
        <path d="M180 150v40M420 150v40"/>
      </g>
      <path d="M120 190h120l-18 26H138Z" fill="#0f1930" stroke="rgba(255,255,255,.16)"/>
      <path d="M360 190h120l-18 26H378Z" fill="#0f1930" stroke="rgba(255,255,255,.16)"/>
      <g fill="url(#acc-${uid})" opacity=".8">
        <rect x="155" y="160" width="26" height="26" rx="5"/>
        <rect x="188" y="166" width="22" height="20" rx="4"/>
        <rect x="385" y="160" width="30" height="26" rx="5"/>
      </g>
      <g fill="#fef3c7">
        <circle cx="240" cy="220" r="4"/><circle cx="360" cy="220" r="4"/>
      </g>`;
  } else if (name === 'graph') {
    body = `${common}
      <g opacity=".55" stroke="rgba(148,163,184,.35)" stroke-width="1">
        ${Array.from({ length: 9 }, (_, i) => `<path d="M100 ${80 + i * 40}h400"/>`).join('')}
        ${Array.from({ length: 10 }, (_, i) => `<path d="M100 ${80 + i * 40}V400"/>`).join('')}
      </g>
      <path d="M100 400V80M100 400h400" stroke="rgba(255,255,255,.35)" stroke-width="2"/>
      <path d="M100 330 500 150" stroke="url(#acc-${uid})" stroke-width="5" stroke-linecap="round"/>
      <path d="M100 330 500 150" stroke="${c1}" stroke-width="14" opacity=".1" filter="url(#soft-${uid})"/>
      <g fill="${c1}">
        <circle cx="100" cy="330" r="6"/><circle cx="200" cy="285" r="6"/><circle cx="300" cy="240" r="6"/><circle cx="400" cy="195" r="6"/>
      </g>
      <g fill="#fef3c7" opacity=".9">
        <circle cx="140" cy="312" r="3"/><circle cx="340" cy="218" r="3"/>
      </g>`;
  } else if (name === 'cell') {
    body = `${common}
      <circle cx="300" cy="250" r="180" fill="url(#halo-${uid})" filter="url(#soft-${uid})"/>
      <ellipse cx="300" cy="250" rx="220" ry="170" fill="#0d2130" stroke="rgba(94,234,212,.25)" stroke-width="2"/>
      <ellipse cx="300" cy="250" rx="198" ry="148" fill="#0b1a28" stroke="rgba(190,242,100,.28)" stroke-width="1.5" stroke-dasharray="5 8"/>
      <circle cx="290" cy="220" r="62" fill="#132c44" stroke="rgba(94,234,212,.5)" stroke-width="2"/>
      <circle cx="290" cy="220" r="26" fill="url(#acc-${uid})" opacity=".8"/>
      <ellipse cx="380" cy="300" rx="42" ry="20" fill="#123b3a" stroke="rgba(190,242,100,.5)" transform="rotate(-25 380 300)"/>
      <ellipse cx="360" cy="165" rx="30" ry="16" fill="#1a4a33" stroke="rgba(190,242,100,.55)" transform="rotate(30 360 165)"/>
      <ellipse cx="280" cy="330" rx="52" ry="30" fill="#102f4a" stroke="rgba(94,234,212,.35)"/>
      <path d="M130 250c0-90 75-150 170-150s170 60 170 150" stroke="rgba(94,234,212,.3)" stroke-width="8" fill="none"/>
      <g fill="rgba(255,255,255,.35)">
        <circle cx="210" cy="190" r="4"/><circle cx="390" cy="220" r="4"/><circle cx="340" cy="350" r="4"/><circle cx="230" cy="330" r="3"/>
      </g>`;
  } else if (name === 'force') {
    body = `${common}
      <path d="M80 380 420 220l60 30-340 160Z" fill="#0c1428" stroke="rgba(255,255,255,.1)"/>
      <path d="M80 380 420 220" stroke="url(#acc-${uid})" stroke-width="4"/>
      <g transform="translate(330 230) rotate(-22)">
        <rect x="0" y="0" width="92" height="56" rx="10" fill="url(#acc-${uid})" opacity=".9"/>
        <circle cx="18" cy="64" r="12" fill="#0a1024" stroke="#5eead4" stroke-width="3"/>
        <circle cx="74" cy="64" r="12" fill="#0a1024" stroke="#5eead4" stroke-width="3"/>
        <path d="M18 30h56M30 18v24" stroke="rgba(5,7,15,.5)" stroke-width="3"/>
      </g>
      <g stroke="${c1}" stroke-width="4" stroke-linecap="round" opacity=".85">
        <path d="M130 250h70"/><path d="m190 240 14 10-14 10"/>
      </g>
      <g fill="#fef3c7" opacity=".7">
        <circle cx="470" cy="120" r="4"/><circle cx="500" cy="150" r="2.5"/>
      </g>
      <path d="M80 400h440" stroke="rgba(255,255,255,.1)" stroke-width="2"/>`;
  } else if (name === 'lab') {
    body = `${common}
      <circle cx="300" cy="240" r="170" fill="url(#halo-${uid})" filter="url(#soft-${uid})"/>
      <g stroke="rgba(255,255,255,.16)" stroke-width="2">
        <path d="M210 120h60v70l50 100a24 24 0 0 1-22 34H182a24 24 0 0 1-22-34l50-100v-70Z" fill="#0b1628"/>
        <path d="M180 270h120" stroke="${c1}" stroke-width="4"/>
      </g>
      <g>
        <rect x="350" y="180" width="110" height="150" rx="14" fill="#0b1628" stroke="rgba(255,255,255,.16)"/>
        <rect x="350" y="238" width="110" height="92" rx="14" fill="url(#acc-${uid})" opacity=".5"/>
        <circle cx="390" cy="260" r="5" fill="#bef264"/><circle cx="420" cy="285" r="4" fill="#bef264"/><circle cx="435" cy="250" r="3" fill="#bef264"/>
      </g>
      <g fill="rgba(255,255,255,.4)">
        <circle cx="250" cy="180" r="4"/><circle cx="270" cy="150" r="6"/><circle cx="230" cy="140" r="3"/>
      </g>
      <g opacity=".55" fill="${c1}">
        <rect x="120" y="360" width="20" height="20" rx="4"/><rect x="150" y="360" width="20" height="20" rx="4"/><rect x="180" y="360" width="20" height="20" rx="4"/>
      </g>`;
  } else if (name === 'pyramid') {
    body = `${common}
      <circle cx="430" cy="110" r="70" fill="#fbbf24" opacity=".16" filter="url(#soft-${uid})"/>
      <circle cx="430" cy="110" r="34" fill="#fbbf24" opacity=".8"/>
      ${mountains(uid, c1)}
      <path d="M180 400h240l-40-170H220Z" fill="#12203a" stroke="rgba(251,191,36,.25)"/>
      <path d="M220 230h160M210 280h180M200 330h200M190 380h220" stroke="rgba(251,191,36,.3)" stroke-width="6"/>
      <path d="M300 230v170M260 230v170M340 230v170" stroke="rgba(0,0,0,.25)" stroke-width="4"/>
      <path d="M300 160l-14 70h28Z" fill="#fbbf24" opacity=".7"/>
      <g stroke="rgba(94,234,212,.35)" stroke-width="2">
        <path d="M90 400c20-60 50-70 80-70M510 400c-20-60-50-70-80-70"/>
      </g>`;
  } else if (name === 'scroll') {
    body = `${common}
      <circle cx="300" cy="250" r="170" fill="url(#halo-${uid})" filter="url(#soft-${uid})"/>
      <g transform="rotate(-6 300 250)">
        <rect x="150" y="120" width="300" height="280" rx="10" fill="#1a1b2a" stroke="rgba(251,191,36,.3)"/>
        <rect x="160" y="130" width="280" height="260" rx="6" fill="#242236" stroke="rgba(251,191,36,.2)"/>
        <g stroke="rgba(251,191,36,.35)" stroke-width="2">
          <path d="M195 175h210M195 205h210M195 235h170M195 265h210M195 295h150"/>
        </g>
        <circle cx="390" cy="330" r="22" fill="#fbbf24" opacity=".5"/>
      </g>
      <g stroke="${c1}" stroke-width="3" opacity=".7">
        <path d="M110 190h60M110 210h40M480 300h50"/>
      </g>`;
  } else if (name === 'city') {
    body = `${common}
      <circle cx="460" cy="100" r="60" fill="#a78bfa" opacity=".2" filter="url(#soft-${uid})"/>
      <circle cx="460" cy="100" r="26" fill="#e9d5ff" opacity=".8"/>
      ${mountains(uid, c1)}
      <g fill="#0a1122" stroke="rgba(139,92,246,.22)">
        <rect x="90" y="300" width="70" height="130"/><rect x="170" y="250" width="85" height="180"/><rect x="265" y="280" width="70" height="150"/><rect x="345" y="220" width="90" height="210"/><rect x="445" y="310" width="70" height="120"/>
      </g>
      <g fill="#fbbf24" opacity=".55">
        <rect x="105" y="320" width="8" height="8"/><rect x="125" y="340" width="8" height="8"/><rect x="185" y="270" width="8" height="8"/><rect x="205" y="290" width="8" height="8"/><rect x="360" y="240" width="8" height="8"/><rect x="385" y="270" width="8" height="8"/><rect x="460" y="330" width="8" height="8"/>
      </g>
      <path d="M0 440h600v60H0Z" fill="#05070f"/>`;
  } else if (name === 'map') {
    body = `${common}
      <circle cx="300" cy="250" r="180" fill="url(#halo-${uid})" filter="url(#soft-${uid})"/>
      <path d="M150 110 270 90l70 40 90-10 40 60-20 70 40 60-30 80-80 50-70-20-60 30-80-40-40-70 30-60-20-60Z" fill="#0d2136" stroke="rgba(94,234,212,.4)" stroke-width="2"/>
      <g stroke="rgba(94,234,212,.18)" stroke-width="1.5">
        <path d="M150 250h330M300 120v300M210 160l80 180M390 160l-80 180"/>
      </g>
      <g fill="${c1}" opacity=".35">
        <circle cx="270" cy="215" r="40"/><circle cx="430" cy="180" r="34"/><circle cx="228" cy="410" r="28"/>
      </g>
      <g stroke="rgba(255,255,255,.15)" stroke-width="2" fill="none">
        <path d="M120 380c80-20 120-60 160-10s90 40 160-20"/>
      </g>`;
  } else if (name === 'storm') {
    body = `${common}
      <g fill="#1a2440" opacity=".9">
        <ellipse cx="220" cy="140" rx="110" ry="50"/><ellipse cx="330" cy="120" rx="90" ry="42"/><ellipse cx="420" cy="160" rx="80" ry="38"/>
      </g>
      <path d="M350 150 300 260h40l-30 90 90-120h-45l30-80Z" fill="#fbbf24" opacity=".9"/>
      <g stroke="#67e8f9" stroke-width="2" opacity=".45">
        <path d="M120 230l-20 60M180 250l-14 50M240 230l-20 60M300 260l-14 50M400 250l-18 60M470 230l-14 50"/>
      </g>
      ${mountains(uid, c1)}
      <path d="M100 400h120v-60h100v60h180" stroke="rgba(255,255,255,.15)" stroke-width="2" fill="#0a1122"/>
      <path d="M0 440h600v60H0Z" fill="#05070f"/>`;
  } else if (name === 'trade') {
    body = `${common}
      <circle cx="280" cy="240" r="150" fill="url(#halo-${uid})" filter="url(#soft-${uid})"/>
      <circle cx="280" cy="240" r="110" fill="#0b1a30" stroke="rgba(94,234,212,.4)" stroke-width="2"/>
      <ellipse cx="280" cy="240" rx="110" ry="42" fill="none" stroke="rgba(94,234,212,.25)"/>
      <ellipse cx="280" cy="240" rx="42" ry="110" fill="none" stroke="rgba(94,234,212,.25)"/>
      <path d="M170 240h220M190 190h180M190 290h180" stroke="rgba(94,234,212,.2)"/>
      <g fill="none" stroke="url(#acc-${uid})" stroke-width="3">
        <path d="M160 180c80-60 200-40 260 30"/>
        <path d="M180 320c90 40 190 10 240-50"/>
      </g>
      <g fill="#fbbf24">
        <circle cx="200" cy="180" r="5"/><circle cx="420" cy="210" r="5"/><circle cx="210" cy="320" r="5"/><circle cx="420" cy="270" r="5"/>
      </g>
      <g fill="#0a1122" stroke="rgba(251,191,36,.35)">
        <rect x="80" y="330" width="60" height="40" rx="6"/><rect x="460" y="330" width="60" height="40" rx="6"/>
      </g>`;
  } else if (name === 'plant') {
    body = `${common}
      <circle cx="470" cy="100" r="64" fill="#fbbf24" opacity=".18" filter="url(#soft-${uid})"/>
      <circle cx="470" cy="100" r="30" fill="#fbbf24" opacity=".85"/>
      <path d="M0 410h600v90H0Z" fill="#1a120d"/>
      <path d="M0 410c80-12 160 8 240 0s180-14 260 0 100 4 100 4v86H0Z" fill="#241811"/>
      <path d="M300 420V150" stroke="#86efac" stroke-width="12" stroke-linecap="round"/>
      <path d="M300 300c0-58 46-98 108-98 0 58-46 98-108 98Z" fill="url(#acc-${uid})" opacity=".9"/>
      <path d="M300 340c0-44-34-74-78-74 0 44 34 74 78 74Z" fill="url(#acc-${uid})" opacity=".7"/>
      <g transform="translate(300 120)">
        <circle r="20" fill="#fbbf24"/>
        <g fill="#fb7185">
          <ellipse cx="0" cy="-32" rx="16" ry="24"/><ellipse cx="0" cy="32" rx="16" ry="24"/>
          <ellipse cx="-32" cy="0" rx="24" ry="16"/><ellipse cx="32" cy="0" rx="24" ry="16"/>
        </g>
        <circle r="10" fill="#fef3c7"/>
      </g>
      <circle cx="405" cy="140" r="24" fill="#f472b6" opacity=".8"/>
      <g stroke="#86efac" stroke-width="5" stroke-linecap="round" opacity=".8">
        <path d="M300 420c-30 12-48 26-60 48M300 420c30 12 48 26 60 48M300 420v54"/>
      </g>
      <g fill="#86efac" opacity=".5">
        <path d="M120 410l10-28 10 28Z"/><path d="M160 410l8-22 8 22Z"/><path d="M440 410l9-26 9 26Z"/>
      </g>`;
  } else if (name === 'body') {
    body = `${common}
      <circle cx="300" cy="240" r="180" fill="url(#halo-${uid})" filter="url(#soft-${uid})"/>
      <path d="M300 80a70 70 0 0 1 70 70v60l-18 120-34 100h-36l-34-100-18-120v-60a70 70 0 0 1 70-70Z" fill="#101b34" stroke="rgba(94,234,212,.2)" stroke-width="2"/>
      <circle cx="300" cy="130" r="52" fill="#162544" stroke="rgba(94,234,212,.35)" stroke-width="2"/>
      <path d="M276 116c8-14 40-14 48 0M300 130v22" stroke="#5eead4" stroke-width="4" stroke-linecap="round" opacity=".55"/>
      <path d="M240 210c-18 30-18 70 0 96 18 26 42 30 54 12v-92c-12-18-36-34-54-16Z" fill="#1e4a4a" stroke="rgba(94,234,212,.45)" stroke-width="2"/>
      <path d="M360 210c18 30 18 70 0 96-18 26-42 30-54 12v-92c12-18 36-34 54-16Z" fill="#1e4a4a" stroke="rgba(94,234,212,.45)" stroke-width="2"/>
      <path d="M300 230c-18-22-48-8-48 22 0 26 34 44 48 56 14-12 48-30 48-56 0-30-30-44-48-22Z" fill="#fb7185" opacity=".8"/>
      <ellipse cx="300" cy="330" rx="34" ry="26" fill="#a78bfa" opacity=".45" stroke="rgba(167,139,250,.5)"/>
      <g stroke="rgba(255,255,255,.35)" stroke-width="5" stroke-linecap="round">
        <path d="M270 380v60M330 380v60M300 330v110"/>
      </g>
      <g fill="#fef3c7" opacity=".8">
        <circle cx="210" cy="150" r="3"/><circle cx="390" cy="150" r="3"/><circle cx="210" cy="300" r="2.5"/>
      </g>`;
  } else if (name === 'forest') {
    body = `${common}
      <circle cx="470" cy="90" r="58" fill="#fbbf24" opacity=".18" filter="url(#soft-${uid})"/>
      <circle cx="470" cy="90" r="26" fill="#fbbf24" opacity=".8"/>
      ${mountains(uid, c1)}
      <path d="M0 350c80-40 150-50 230-20s150 30 220-10 110-20 150 0v180H0Z" fill="#0c241c"/>
      <g fill="#14532d" opacity=".85">
        <path d="M80 350l50-110 50 110Z"/><path d="M120 350l40-90 40 90Z"/>
        <path d="M360 340l44-96 44 96Z"/><path d="M395 340l34-76 34 76Z"/>
      </g>
      <g stroke="#86efac" stroke-width="4" stroke-linecap="round" opacity=".45">
        <path d="M130 350v50M404 340v60"/>
      </g>
      <path d="M220 500c40-50 90-70 150-60s100 50 120 60" fill="none" stroke="#38bdf8" stroke-width="22" opacity=".5"/>
      <path d="M220 500c40-50 90-70 150-60s100 50 120 60" fill="none" stroke="#7dd3fc" stroke-width="6" opacity=".7"/>
      <g fill="#0f766e" opacity=".8">
        <path d="M500 400l18-40 18 40Z"/><path d="M530 400l14-30 14 30Z"/>
      </g>
      <path d="M0 440h600v60H0Z" fill="#07120f"/>`;
  } else if (name === 'water') {
    body = `${common}
      <circle cx="460" cy="100" r="62" fill="#fbbf24" opacity=".25" filter="url(#soft-${uid})"/>
      <circle cx="460" cy="100" r="28" fill="#fbbf24" opacity=".9"/>
      <g fill="#dbeafe" opacity=".22">
        <ellipse cx="220" cy="120" rx="80" ry="34"/><ellipse cx="310" cy="105" rx="70" ry="28"/><ellipse cx="390" cy="130" rx="60" ry="26"/>
      </g>
      <g stroke="#7dd3fc" stroke-width="3" opacity=".7">
        <path d="M180 150l-12 34M230 160l-10 30M280 150l-12 34M340 160l-10 30M400 150l-12 34"/>
      </g>
      <path d="M0 340c80-40 160-40 240 0s160 40 240 0 120-30 120-30v190H0Z" fill="#0b2a4a"/>
      <path d="M0 360c80-20 160-20 240 0s160 20 240 0 120-16 120-16" fill="none" stroke="#38bdf8" stroke-width="4" opacity=".6"/>
      <path d="M80 340l60-90 60 90Z" fill="#123a2a" opacity=".8"/>
      <g stroke="#bef264" stroke-width="4" stroke-linecap="round" opacity=".75">
        <path d="M120 330c20-40 40-60 60-80"/><path d="M120 330c30-20 60-30 90-30"/>
      </g>
      <path d="M0 440h600v60H0Z" fill="#061225"/>`;
  } else {
    body = `${common}${mountains(uid, c1)}
      <circle cx="300" cy="220" r="120" fill="url(#halo-${uid})" filter="url(#soft-${uid})"/>
      <circle cx="300" cy="220" r="52" fill="url(#acc-${uid})" opacity=".8"/>`;
  }

  return `<svg viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice">${d}${body}</svg>`;
}

export function toast(message, type = 'info') {
  const root = document.getElementById('toast-root');
  if (!root) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `${icon(type === 'error' ? 'info' : 'check')}<span>${escapeHTML(message)}</span>`;
  root.appendChild(el);
  requestAnimationFrame(() => el.classList.add('is-visible'));
  setTimeout(() => {
    el.classList.remove('is-visible');
    setTimeout(() => el.remove(), 350);
  }, 3600);
}

export function openModal({ title, body, actions = [] }) {
  const root = document.getElementById('modal-root');
  const wrap = document.createElement('div');
  wrap.className = 'modal';
  wrap.innerHTML = `<div class="modal__card" role="dialog" aria-modal="true" aria-label="${escapeHTML(title)}">
    <div class="modal__head">
      <h3 class="modal__title">${escapeHTML(title)}</h3>
      <button class="icon-btn" data-close aria-label="Cerrar">${icon('x')}</button>
    </div>
    <div class="modal__body">${body}</div>
    <div class="modal__actions"></div>
  </div>`;
  root.appendChild(wrap);
  const close = () => {
    wrap.classList.remove('is-open');
    setTimeout(() => wrap.remove(), 260);
  };
  wrap.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
  wrap.addEventListener('click', (e) => {
    if (e.target === wrap) close();
  });
  const actionsRoot = wrap.querySelector('.modal__actions');
  actions.forEach((action) => {
    const btn = document.createElement('button');
    btn.className = `btn ${action.className || 'btn--ghost'} btn--small`;
    btn.textContent = action.label;
    btn.addEventListener('click', () => {
      const result = action.onClick?.();
      if (result !== false) close();
    });
    actionsRoot.appendChild(btn);
  });
  requestAnimationFrame(() => wrap.classList.add('is-open'));
  return { close, element: wrap };
}

let confettiRaf = 0;

export function stopConfetti() {
  if (confettiRaf) cancelAnimationFrame(confettiRaf);
  confettiRaf = 0;
  const canvas = document.getElementById('confetti');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

export function confetti() {
  const canvas = document.getElementById('confetti');
  if (!canvas) return;
  stopConfetti();
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const colors = ['#5eead4', '#bef264', '#fbbf24', '#fb7185', '#8b5cf6', '#60a5fa'];
  const pieces = Array.from({ length: 140 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 160,
    y: innerHeight * 0.42 + Math.random() * 30,
    vx: (Math.random() - 0.5) * 12,
    vy: -Math.random() * 13 - 4,
    size: 5 + Math.random() * 7,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    life: 1,
  }));
  let frame = 0;
  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    let alive = false;
    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.32;
      p.vx *= 0.992;
      p.rot += p.vr;
      p.life -= 0.008;
      if (p.life > 0 && p.y < innerHeight + 40) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.55);
        ctx.restore();
      }
    }
    frame += 1;
    if (alive && frame < 220) confettiRaf = requestAnimationFrame(tick);
    else {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      confettiRaf = 0;
    }
  }
  tick();
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function formatMinutes(min) {
  return `${min} min`;
}

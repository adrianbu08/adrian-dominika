/* ================================================
   RAZEM — SCRIPT.JS
   Licznik miłości od 22 sierpnia 2025
   ================================================ */

const ANNIVERSARY = new Date('2025-08-22T00:00:00');

// ---- Helpers ----
function pad(n) { return String(n).padStart(2, '0'); }
function fmt(n) { return n.toLocaleString('pl-PL'); }

// Compute years/months/days since a date (calendar-accurate)
function elapsed(from, to) {
  let years  = to.getFullYear() - from.getFullYear();
  let months = to.getMonth()    - from.getMonth();
  let days   = to.getDate()     - from.getDate();

  if (days < 0) {
    months--;
    const prev = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prev.getDate();
  }
  if (months < 0) { years--; months += 12; }

  return { years, months, days };
}

// ---- Main update ----
function tick() {
  const now  = new Date();
  const diff = now - ANNIVERSARY;   // ms

  if (diff < 0) {
    // Countdown to future start
    const abs  = Math.abs(diff);
    const d    = Math.floor(abs / 864e5);
    const h    = Math.floor((abs % 864e5) / 36e5);
    const m    = Math.floor((abs % 36e5)  / 6e4);
    const s    = Math.floor((abs % 6e4)   / 1e3);
    document.getElementById('years').textContent   = '0';
    document.getElementById('months').textContent  = '0';
    document.getElementById('days').textContent    = d;
    document.getElementById('hours').textContent   = pad(h);
    document.getElementById('minutes').textContent = pad(m);
    document.getElementById('seconds').textContent = pad(s);
    // totals all zero
    ['total-days','total-hours','total-minutes','total-seconds'].forEach(id => {
      document.getElementById(id).textContent = '0';
    });
    return;
  }

  // Calendar breakdown
  const { years, months, days } = elapsed(ANNIVERSARY, now);
  document.getElementById('years').textContent   = years;
  document.getElementById('months').textContent  = months;
  document.getElementById('days').textContent    = days;

  // Clock portion
  const totalSec = Math.floor(diff / 1000);
  document.getElementById('hours').textContent   = pad(Math.floor((totalSec % 86400) / 3600));
  document.getElementById('minutes').textContent = pad(Math.floor((totalSec % 3600)  / 60));
  document.getElementById('seconds').textContent = pad(totalSec % 60);

  // Totals
  const totalDays    = Math.floor(diff / 864e5);
  const totalHours   = Math.floor(diff / 36e5);
  const totalMinutes = Math.floor(diff / 6e4);
  const totalSeconds = Math.floor(diff / 1e3);

  document.getElementById('total-days').textContent    = fmt(totalDays);
  document.getElementById('total-hours').textContent   = fmt(totalHours);
  document.getElementById('total-minutes').textContent = fmt(totalMinutes);
  document.getElementById('total-seconds').textContent = fmt(totalSeconds);
}

// ---- Next anniversary ----
function nextAnniversary() {
  const now  = new Date();
  const yr   = now.getFullYear();
  let next   = new Date(`${yr}-08-22T00:00:00`);
  if (now >= next) next = new Date(`${yr + 1}-08-22T00:00:00`);

  const diff = next - now;
  const d    = Math.floor(diff / 864e5);
  const h    = Math.floor((diff % 864e5) / 36e5);
  const m    = Math.floor((diff % 36e5)  / 6e4);

  document.getElementById('a-days').textContent = d;
  document.getElementById('a-hours').textContent = pad(h);
  document.getElementById('a-min').textContent   = pad(m);

  const nextYr = next.getFullYear();
  const n      = nextYr - ANNIVERSARY.getFullYear();
  document.getElementById('anni-when').textContent =
    `22 sierpnia ${nextYr} — nasza ${n}. rocznica 💕`;
}

// ---- Canvas: floating particles ----
const canvas = document.getElementById('bg');
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Particle types: tiny hearts + soft sparkles
const PARTICLES = [];
const COUNT = 55;

function heartPath(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s / 30, s / 30);
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.bezierCurveTo(0, -14, -18, -14, -18, 2);
  ctx.bezierCurveTo(-18, 14, 0, 24, 0, 30);
  ctx.bezierCurveTo(0, 24, 18, 14, 18, 2);
  ctx.bezierCurveTo(18, -14, 0, -14, 0, -4);
  ctx.closePath();
  ctx.restore();
}

const ROSE_SHADES = [
  [232, 114, 138],
  [240, 160, 180],
  [255, 214, 228],
  [201, 160, 106],
  [245, 236, 228],
];

for (let i = 0; i < COUNT; i++) {
  const [r,g,b] = ROSE_SHADES[i % ROSE_SHADES.length];
  PARTICLES.push({
    x:       Math.random() * window.innerWidth,
    y:       Math.random() * window.innerHeight * 2,
    size:    3 + Math.random() * 10,
    vy:      0.18 + Math.random() * 0.52,
    vx:      (Math.random() - 0.5) * 0.3,
    wobble:  Math.random() * Math.PI * 2,
    ws:      0.008 + Math.random() * 0.015,
    alpha:   0.06 + Math.random() * 0.22,
    rot:     Math.random() * Math.PI * 2,
    rSpeed:  (Math.random() - 0.5) * 0.008,
    r, g, b,
    isHeart: Math.random() > 0.35,
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  PARTICLES.forEach(p => {
    p.y      -= p.vy;
    p.x      += Math.sin(p.wobble) * 0.45 + p.vx;
    p.wobble += p.ws;
    p.rot    += p.rSpeed;

    if (p.y < -40) {
      p.y = canvas.height + 40;
      p.x = Math.random() * canvas.width;
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.alpha;

    if (p.isHeart) {
      heartPath(ctx, 0, 0, p.size);
      ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
      ctx.shadowBlur  = 14;
      ctx.shadowColor = `rgba(${p.r},${p.g},${p.b},0.4)`;
      ctx.fill();
    } else {
      // sparkle: four-pointed star
      const s = p.size * 0.5;
      ctx.beginPath();
      for (let k = 0; k < 8; k++) {
        const angle = (k * Math.PI) / 4;
        const r2    = k % 2 === 0 ? s : s * 0.35;
        k === 0
          ? ctx.moveTo(Math.cos(angle) * r2, Math.sin(angle) * r2)
          : ctx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
      }
      ctx.closePath();
      ctx.fillStyle   = `rgb(${p.r},${p.g},${p.b})`;
      ctx.shadowBlur  = 10;
      ctx.shadowColor = `rgba(${p.r},${p.g},${p.b},0.5)`;
      ctx.fill();
    }

    ctx.restore();
  });

  requestAnimationFrame(drawParticles);
}

// ---- Start ----
tick();
nextAnniversary();
setInterval(tick, 1000);
setInterval(nextAnniversary, 30000);
drawParticles();

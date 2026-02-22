/* =============================================
   ROMANTIC ANNIVERSARY SITE — SCRIPT.JS
   - Live countdown since anniversary date
   - Next anniversary countdown
   - Floating hearts canvas animation
   - Photo upload into heart shapes
   ============================================= */

// ---- Anniversary Date ----
const ANNIVERSARY = new Date('2025-08-22T00:00:00');

// ---- Live Counter ----
function updateCounter() {
  const now = new Date();
  const diff = now - ANNIVERSARY;

  if (diff < 0) {
    // Future: count down to the date instead
    const absDiff = Math.abs(diff);
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    document.querySelector('.counter-subtitle').textContent = 'until our love begins ✨';
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  document.getElementById('days').textContent = days.toLocaleString();
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// ---- Next Anniversary Countdown ----
function updateNextAnniversary() {
  const now = new Date();
  const thisYear = now.getFullYear();
  let nextAnni = new Date(`${thisYear}-08-22T00:00:00`);
  if (now >= nextAnni) {
    nextAnni = new Date(`${thisYear + 1}-08-22T00:00:00`);
  }

  const diff = nextAnni - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  document.getElementById('next-days').textContent = days;
  document.getElementById('next-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('next-minutes').textContent = String(minutes).padStart(2, '0');

  const yr = nextAnni.getFullYear();
  document.getElementById('next-anni-date').textContent =
    `August 22, ${yr} — Year ${yr - ANNIVERSARY.getFullYear()} Together 💕`;
}

setInterval(updateCounter, 1000);
setInterval(updateNextAnniversary, 60000);
updateCounter();
updateNextAnniversary();

// ---- Photo Upload Helpers ----
function triggerUpload(inputId) {
  document.getElementById(inputId).click();
}

function loadPhoto(input, imgId, placeholderId) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = document.getElementById(imgId);
    const placeholder = document.getElementById(placeholderId);
    img.src = e.target.result;
    img.classList.remove('hidden');
    placeholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

// ---- Floating Hearts Canvas ----
const canvas = document.getElementById('heartsCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Heart shape drawing helper
function drawHeart(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 30, size / 30);
  ctx.beginPath();
  ctx.moveTo(0, -5);
  ctx.bezierCurveTo(0, -15, -20, -15, -20, 0);
  ctx.bezierCurveTo(-20, 12, 0, 22, 0, 30);
  ctx.bezierCurveTo(0, 22, 20, 12, 20, 0);
  ctx.bezierCurveTo(20, -15, 0, -15, 0, -5);
  ctx.closePath();
  ctx.restore();
}

// Heart particles
const HEART_COUNT = 28;
const hearts = [];

const COLORS = [
  'rgba(255, 179, 206, ',
  'rgba(232, 98, 138, ',
  'rgba(212, 68, 122, ',
  'rgba(255, 150, 190, ',
  'rgba(255, 224, 236, ',
];

for (let i = 0; i < HEART_COUNT; i++) {
  hearts.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight + window.innerHeight,
    size: 8 + Math.random() * 24,
    speedY: 0.4 + Math.random() * 0.9,
    speedX: (Math.random() - 0.5) * 0.5,
    opacity: 0.15 + Math.random() * 0.5,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.01 + Math.random() * 0.02,
    colorBase: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: (Math.random() - 0.5) * 0.4,
  });
}

function animateHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  hearts.forEach(h => {
    h.y -= h.speedY;
    h.x += Math.sin(h.wobble) * 0.6 + h.speedX;
    h.wobble += h.wobbleSpeed;
    h.rotation += 0.003;

    // Reset when off-screen top
    if (h.y < -60) {
      h.y = canvas.height + 60;
      h.x = Math.random() * canvas.width;
    }

    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.rotate(h.rotation);

    drawHeart(ctx, 0, 0, h.size);
    ctx.fillStyle = h.colorBase + h.opacity + ')';
    ctx.fill();

    // Subtle glow
    ctx.shadowBlur = 12;
    ctx.shadowColor = h.colorBase + '0.3)';
    ctx.fillStyle = h.colorBase + (h.opacity * 0.4) + ')';
    ctx.fill();

    ctx.restore();
  });

  requestAnimationFrame(animateHearts);
}

animateHearts();

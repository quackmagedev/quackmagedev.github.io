// Pixel star field + shooting stars + click sparks
(function () {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  const PALETTE = ['#ffffff','#ffffff','#eae6f0','#fc9c24','#9b5de5','#fcfc0c'];
  let stars = [], W = 0, H = 0, t = 0;
  let shootingStars = [], nextShoot = 300;
  const sparks = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = Array.from({ length: 200 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      sz: i < 10 ? 4 : i < 45 ? 2 : 1,
      col: PALETTE[Math.random() * PALETTE.length | 0],
      phase: Math.random() * Math.PI * 2,
      spd: 0.004 + Math.random() * 0.01,
      minA: i < 10 ? 0.5 : i < 45 ? 0.2 : 0.06,
      maxA: i < 10 ? 1.0 : i < 45 ? 0.85 : 0.55,
    }));
  }

  function spawnShootingStar() {
    const ang = (20 + Math.random() * 25) * Math.PI / 180;
    const speed = 10 + Math.random() * 8;
    shootingStars.push({
      x: Math.random() * W * 1.2 - W * 0.1,
      y: -10,
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed,
      len: 80 + Math.random() * 70,
      life: 1,
      decay: 0.008 + Math.random() * 0.012,
    });
  }

  function burst(cx, cy, n, sz) {
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      sparks.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 0.8 + Math.random() * 0.4,
        col: PALETTE[Math.random() * PALETTE.length | 0],
        sz: sz || 2,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t++;

    for (const s of stars) {
      const a = s.minA + (s.maxA - s.minA) * (0.5 + 0.5 * Math.sin(s.phase + t * s.spd));
      ctx.globalAlpha = a;
      ctx.fillStyle = s.col;
      ctx.fillRect(s.x | 0, s.y | 0, s.sz, s.sz);
    }

    if (--nextShoot <= 0) {
      spawnShootingStar();
      nextShoot = 250 + Math.random() * 350;
    }
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      const mag = Math.hypot(s.vx, s.vy);
      const nx = s.vx / mag, ny = s.vy / mag;
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - nx * s.len, s.y - ny * s.len);
      grad.addColorStop(0, `rgba(255,255,255,${s.life})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalAlpha = 1;
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - nx * s.len, s.y - ny * s.len);
      ctx.stroke();
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;
      if (s.life <= 0 || s.x > W + 200 || s.y > H + 200) shootingStars.splice(i, 1);
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const p = sparks[i];
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.col;
      ctx.fillRect(p.x | 0, p.y | 0, p.sz, p.sz);
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life -= 0.04;
      if (p.life <= 0) sparks.splice(i, 1);
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  document.addEventListener('click', (e) => burst(e.clientX, e.clientY, 10, 2));

  window.addEventListener('resize', resize);
  resize();
  draw();

  // Duck easter egg
  const duck = document.querySelector('.hero__img');
  if (duck) {
    duck.style.cursor = 'pointer';
    const quackSfx = new Audio('/assets/audio/quack.mp3');
    duck.addEventListener('click', (e) => {
      e.stopPropagation();
      const r = duck.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      burst(cx, cy, 40, 3);
      quackSfx.currentTime = 0;
      quackSfx.play().catch(() => {});
      const tag = document.createElement('div');
      tag.textContent = 'QUACK!';
      tag.style.cssText = `position:fixed;left:${cx}px;top:${cy - 10}px;transform:translateX(-50%);font-family:'Press Start 2P',monospace;font-size:.65rem;color:#fc9c24;pointer-events:none;z-index:100;animation:quack-float .9s ease-out forwards;`;
      document.body.appendChild(tag);
      setTimeout(() => tag.remove(), 900);
    });
  }
})();

// Typing animation (hero page only) — loops
(function () {
  const el = document.querySelector('.hero__body');
  if (!el) return;
  const full = el.textContent.trim();

  const textSpan = document.createElement('span');
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  el.textContent = '';
  el.appendChild(textSpan);
  el.appendChild(cursor);

  function typeOut(cb) {
    let i = 0;
    (function tick() {
      textSpan.textContent = full.slice(0, ++i);
      if (i < full.length) setTimeout(tick, 35 + Math.random() * 25);
      else cb();
    })();
  }

  function eraseOut(cb) {
    let i = full.length;
    (function tick() {
      textSpan.textContent = full.slice(0, --i);
      if (i > 0) setTimeout(tick, 18);
      else cb();
    })();
  }

  function loop() {
    setTimeout(() => typeOut(() =>
      setTimeout(() => eraseOut(() =>
        setTimeout(loop, 400)
      ), 2800)
    ), 400);
  }

  setTimeout(loop, 700);
})();

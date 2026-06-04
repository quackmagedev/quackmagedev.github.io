// Pixel star field
(function () {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  const PALETTE = ['#ffffff','#ffffff','#eae6f0','#fc9c24','#9b5de5','#fcfc0c'];
  let stars = [], W = 0, H = 0, t = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = Array.from({ length: 90 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      sz: i < 6 ? 3 : i < 24 ? 2 : 1,           // a few large, some medium, mostly small
      col: PALETTE[Math.random() * PALETTE.length | 0],
      phase: Math.random() * Math.PI * 2,
      spd: 0.005 + Math.random() * 0.012,
      minA: i < 6 ? 0.4 : 0.08,                  // bright stars stay brighter
      maxA: i < 6 ? 1.0 : 0.65,
    }));
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
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
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

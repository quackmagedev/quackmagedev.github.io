// Pixel star field
(function () {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  const PALETTE = ['#ffffff','#ffffff','#ffffff','#eae6f0','#eae6f0','#fc9c24','#9b5de5','#fcfc0c'];
  const COUNT = 160;
  let stars = [], W = 0, H = 0, t = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      sz: Math.random() < 0.25 ? 2 : 1,
      col: PALETTE[Math.random() * PALETTE.length | 0],
      phase: Math.random() * Math.PI * 2,
      spd: 0.004 + Math.random() * 0.008,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t++;
    for (const s of stars) {
      ctx.globalAlpha = 0.1 + 0.75 * (0.5 + 0.5 * Math.sin(s.phase + t * s.spd));
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

// Typing animation (hero page only)
(function () {
  const el = document.querySelector('.hero__body');
  if (!el) return;
  const text = el.textContent.trim();
  el.innerHTML = '<span class="typing-cursor"></span>';
  const cursor = el.querySelector('.typing-cursor');
  let i = 0;

  function type() {
    if (i < text.length) {
      cursor.insertAdjacentText('beforebegin', text[i++]);
      setTimeout(type, 35 + Math.random() * 25);
    } else {
      setTimeout(() => { cursor.style.animation = 'none'; cursor.style.opacity = '0'; }, 1800);
    }
  }

  setTimeout(type, 700);
})();

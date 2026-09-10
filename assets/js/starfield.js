/* Canvas 星空：视差 + 闪烁 + 流星 */
(function () {
  var canvas = document.getElementById("starfield");
  if (!canvas) { return; }
  var ctx = canvas.getContext("2d");
  if (!ctx) { return; }
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w = 0, h = 0, stars = [], comets = [];

  function makeStars() {
    stars = [];
    var count = Math.floor((window.innerWidth * window.innerHeight) / 3800);
    for (var i = 0; i < count; i++) {
      var depth = Math.random();
      var palette = Math.random();
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (0.5 + Math.random() * 1.5) * (0.55 + depth) * dpr,
        base: 0.3 + Math.random() * 0.5,
        amp: 0.2 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.3,
        color: palette < 0.1 ? "255,216,138" : (palette < 0.22 ? "168,198,255" : "255,255,255"),
        drift: depth * 0.05 * dpr
      });
    }
  }

  function resize() {
    w = canvas.width = Math.floor(window.innerWidth * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    makeStars();
    if (reduce) { draw(0); }
  }

  function spawnComet() {
    if (comets.length < 2 && Math.random() < 0.01) {
      comets.push({
        x: Math.random() * w * 0.6,
        y: Math.random() * h * 0.35,
        vx: (5 + Math.random() * 3) * dpr,
        vy: (1.8 + Math.random() * 1.2) * dpr,
        life: 1
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    var s = t / 1000;
    var i, st, a;
    for (i = 0; i < stars.length; i++) {
      st = stars[i];
      a = Math.max(0.06, st.base + Math.sin(s * st.speed + st.phase) * st.amp);
      ctx.beginPath();
      ctx.fillStyle = "rgba(" + st.color + "," + a.toFixed(3) + ")";
      ctx.arc(st.x, st.y, st.r, 0, 6.2832);
      ctx.fill();
      st.y += st.drift;
      if (st.y > h + 2) { st.y = -2; }
    }
    if (!reduce) {
      spawnComet();
      for (var j = comets.length - 1; j >= 0; j--) {
        var c = comets[j];
        var tailX = c.x - c.vx * 9;
        var tailY = c.y - c.vy * 9;
        var grad = ctx.createLinearGradient(tailX, tailY, c.x, c.y);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, "rgba(255,240,210," + (0.85 * c.life).toFixed(3) + ")");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.7 * dpr;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(c.x, c.y);
        ctx.stroke();
        c.x += c.vx;
        c.y += c.vy;
        c.life -= 0.014;
        if (c.life <= 0 || c.x > w + 60 || c.y > h + 60) { comets.splice(j, 1); }
      }
      requestAnimationFrame(draw);
    }
  }

  window.addEventListener("resize", resize);
  resize();
  if (!reduce) { requestAnimationFrame(draw); }
})();

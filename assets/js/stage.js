/* 首页舞台：滚轮沿小路缩放画作，深入后浮现文章 */
(function () {
  var stage = document.getElementById('stage');
  if (!stage) { return; }
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) { document.documentElement.classList.add('stage-on'); }

  var art = document.querySelector('.stage-art');
  var veil = document.querySelector('.stage-veil');
  var vignette = document.querySelector('.stage-vignette');
  var hint = document.querySelector('.stage-hint');
  var arrived = document.querySelector('.arrived');
  var inner = arrived ? arrived.querySelector('.arrived-inner') : null;
  var p = 0;
  var arrivedOn = false;
  var animating = false;
  var ARRIVE = 0.55;

  function clamp(v) { return Math.min(1, Math.max(0, v)); }

  function apply() {
    if (art) { art.style.transform = 'scale(' + (1 + p * 2.4).toFixed(4) + ')'; }
    if (art) { art.style.setProperty('--blur-o', p.toFixed(3)); }
    if (vignette) { vignette.style.opacity = (p * 0.9).toFixed(3); }
    if (hint) { hint.style.opacity = Math.max(0, 1 - p * 8).toFixed(3); }
    if (arrived) {
      arrived.style.opacity = arrivedOn ? '1' : clamp((p - 0.25) / 0.30).toFixed(3);
      arrived.style.pointerEvents = arrivedOn ? 'auto' : 'none';
    }
    document.body.classList.toggle('stage-locked', !arrivedOn);
    document.documentElement.classList.toggle('arrived-on', arrivedOn);
  }

  function arrive() {
    arrivedOn = true;
    if (inner) { inner.scrollTop = 0; }
    p = 1;
    apply();
  }

  function leave() {
    arrivedOn = false;
    if (art) { art.style.filter = ''; }
    animateTo(0, 450);
  }

  function animateTo(target, dur) {
    if (animating) { return; }
    animating = true;
    var start = p;
    var t0 = performance.now();
    function step(t) {
      var k = Math.min(1, (t - t0) / dur);
      p = start + (target - start) * k;
      apply();
      if (k < 1) {
        requestAnimationFrame(step);
      } else {
        animating = false;
        p = target;
        apply();
      }
    }
    requestAnimationFrame(step);
  }

  window.addEventListener('wheel', function (e) {
    if (animating) { e.preventDefault(); return; }
    if (arrivedOn) {
      var top = inner ? inner.scrollTop <= 0 : true;
      if (e.deltaY < 0 && top) { e.preventDefault(); leave(); }
      return;
    }
    e.preventDefault();
    p = clamp(p + e.deltaY / 1200);
    apply();
    if (p >= ARRIVE) { arrive(); }
  }, { passive: false });

  var lastY = null;
  window.addEventListener('touchstart', function (e) {
    lastY = arrivedOn ? null : e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    if (arrivedOn || animating || lastY === null) { return; }
    var y = e.touches[0].clientY;
    var dy = lastY - y;
    lastY = y;
    e.preventDefault();
    p = clamp(p + dy / 900);
    apply();
    if (p >= ARRIVE) { arrive(); }
  }, { passive: false });

  var back = document.getElementById('back-cover');
  if (back) {
    back.addEventListener('click', function (e) { e.preventDefault(); leave(); });
  }

  apply();
})();

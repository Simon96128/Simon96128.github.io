/* 站内无刷新导航（SPA）+ 首页滚动叙事
   - 点击站内链接：fetch 目标页 → 只替换 main#content → history.pushState
   - 画作、导航栏、字体等从不重新加载，因此没有任何刷新闪烁
   - 首页：滚动驱动画作缩放/柔焦，文章与联系区块渐隐渐显 */
(function () {
  var content = document.getElementById('content');
  if (!content) { return; }
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) { content.style.transition = 'opacity 0.3s ease'; }

  // 每次页面切换后刷新的元素引用
  var art, shade, cue, posts, contact, list, navLinks, lastActive = -1, hovering = false;

  // 缓存测量结果：render() 每帧都要用，不能每帧读 scrollHeight（强制同步布局）
  var maxScroll = 1;
  var isNarrow = false;   // 窄屏降低画作缩放幅度，省填充率
  var cueTimer = null;

  function clamp(v) { return Math.min(1, Math.max(0, v)); }
  function ease(t) { return t * t * (3 - 2 * t); }

  /* 区块浮现：淡入 + 上浮。
     完全显示后把 transform 清空 —— 只要元素上挂着 transform，
     文字就可能被单独光栅化进图层、丢掉亚像素抗锯齿而发虚。
     只在值真正变化时才写样式，避免每帧无谓的样式失效。 */
  function rise(el, op, dist) {
    if (!el) { return; }
    el.style.opacity = op.toFixed(3);
    var v = op > 0.995 ? '' : 'translateY(' + ((1 - op) * dist).toFixed(2) + 'px)';
    if (el.riseV !== v) { el.riseV = v; el.style.transform = v; }
    el.style.pointerEvents = op > 0.5 ? 'auto' : 'none';
  }

  function measure() {
    isNarrow = window.innerWidth <= 640;
    maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    if (list) { list.classList.toggle('can-scroll', list.scrollHeight > list.clientHeight + 4); }
  }

  function render() {
    var isPost = document.body.classList.contains('post-page');
    var y = window.scrollY || window.pageYOffset || 0;
    // 文章页固定用列表所在的进度（0.30），保证画作缩放/柔焦/暗化与列表完全一致
    var t = isPost ? 0.30 : clamp(y / maxScroll);

    // 画作：随滚动持续缩放 + 四周柔焦
    if (art) {
      var amp = isNarrow ? 0.55 : 1.05;
      art.style.transform = 'translateX(var(--px, 0%)) scale(' + (1 + ease(t) * amp).toFixed(4) + ')';
      art.style.setProperty('--blur-o', ease(clamp(t / 0.75)).toFixed(3));
    }
    if (shade) { shade.style.opacity = (ease(clamp(t / 0.55)) * 0.62).toFixed(3); }

    // 文章 / 联系：原地渐隐渐显 + 轻微上浮
    // 两个区块在画面上不重叠（左上 / 右下），所以淡出与淡入可以并行交叉，
    // 不再出现「文章走完了联系才进场」的空档
    var postsOp = Math.min(clamp((t - 0.14) / 0.10), clamp((0.62 - t) / 0.12));
    var contactOp = clamp((t - 0.50) / 0.16);
    rise(posts, postsOp, 16);
    rise(contact, contactOp, 20);

    // 导航高亮：在两段交叉的中点切换
    var activeIdx = t >= 0.56 ? 2 : (t >= 0.14 ? 1 : 0);
    if (activeIdx !== lastActive && navLinks && navLinks.length) {
      lastActive = activeIdx;
      navLinks.forEach(function (a, i) { a.classList.toggle('active', i === activeIdx); });
    }

    // 底部提示：换文案时先淡出再淡入，避免硬切
    if (cue) {
      if (isPost) {
        cue.classList.remove('show');
      } else {
        var text = t < 0.14 ? '滚动 · 沿小路深入'
          : (t < 0.56 ? '继续下滑 · 进入联系' : '上滑 · 返回文章');
        if (cue.textContent !== text) {
          if (cue.classList.contains('show')) {
            cue.classList.remove('show');
            clearTimeout(cueTimer);
            cueTimer = setTimeout(function () {
              if (cue) { cue.textContent = text; cue.classList.add('show'); }
            }, 190);
          } else {
            // 首次出现：直接显示，不做淡出
            cue.textContent = text;
            cue.classList.add('show');
          }
        } else if (!cue.classList.contains('show')) {
          cue.classList.add('show');
        }
      }
    }
  }

  /* 重新收集当前页面的元素（每次 SPA 切换后调用） */
  function refresh() {
    clearTimeout(cueTimer);
    art = document.querySelector('.painting-img');
    shade = document.querySelector('.stage-shade');
    cue = document.getElementById('cue');
    posts = document.getElementById('posts');
    contact = document.getElementById('contact');
    list = document.getElementById('postList');
    navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
    lastActive = -1;

    // 首页的画作缩放由本文件逐帧写入，必须关掉 CSS 的 transform 过渡，
    // 否则缩放会滞后于滚动（见 style.css 里 .stage-on 的说明）
    document.documentElement.classList.toggle('stage-on', !!posts);

    // 列表内部滚动优先：用 mouseenter/mouseleave（不冒泡），
    // 避免在列表项之间移动时 hovering 被误置为 false
    if (list) {
      list.addEventListener('mouseenter', function () { hovering = true; });
      list.addEventListener('mouseleave', function () { hovering = false; });
    }

    if (!shade) {
      shade = document.createElement('div');
      shade.className = 'stage-shade';
      document.body.appendChild(shade);
    }
    measure();
  }

  /* ---------- 全局事件（只绑一次） ---------- */
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) { return; }
    ticking = true;
    requestAnimationFrame(function () { render(); ticking = false; });
  }, { passive: true });

  window.addEventListener('resize', measure);
  // 字体加载完成后文档高度会变，重新量一次
  window.addEventListener('load', measure);

  // 文章列表内部滚动优先：列表内且未到边界时滚列表，到边界后带动页面
  window.addEventListener('wheel', function (e) {
    if (!hovering || !list) { return; }
    var canUp = list.scrollTop > 0;
    var canDown = list.scrollTop + list.clientHeight < list.scrollHeight - 1;
    if ((e.deltaY > 0 && canDown) || (e.deltaY < 0 && canUp)) {
      e.preventDefault();
      list.scrollTop += e.deltaY;
    }
  }, { passive: false });

  /* ---------- 无刷新导航 ---------- */
  var navigating = false;

  function navigate(url, opts) {
    opts = opts || {};
    if (navigating) { return; }
    navigating = true;
    var target = url.split('#')[0];

    function swap() {
      fetch(target, { credentials: 'same-origin' })
        .then(function (r) { if (!r.ok) { throw new Error('http'); } return r.text(); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var newMain = doc.getElementById('content');
          if (!newMain) { throw new Error('no content'); }

          content.innerHTML = newMain.innerHTML;
          document.body.className = doc.body.className;
          if (doc.title) { document.title = doc.title; }
          if (!opts.replace) {
            try { history.pushState({ url: target }, '', target); } catch (e) {}
          }

          refresh();
          if (opts.scrollTo === 'posts') {
            window.scrollTo(0, Math.round(maxScroll * 0.3));
          } else {
            window.scrollTo(0, 0);
          }
          render();

          if (!reduced) {
            requestAnimationFrame(function () { content.style.opacity = '1'; });
          } else {
            content.style.opacity = '1';
          }
          setTimeout(function () { navigating = false; }, 60);
        })
        .catch(function () { location.href = url; });
    }

    if (reduced) {
      content.style.opacity = '0';
      swap();
    } else {
      content.style.opacity = '0';
      setTimeout(swap, 270);   // 等内容淡出后再换内容
    }
  }

  window.addEventListener('popstate', function () {
    navigate(location.pathname + location.hash, { replace: true });
  });

  /* 站内链接统一拦截 */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) { return; }
    if (a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#') { return; }
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin) { return; }
    if (url.href === location.href) { e.preventDefault(); return; }

    // 首页内：博客 / 联系 → 滚到对应进度（区块是固定定位，用进度定位）
    if (posts && (url.pathname === '/blog/' || url.pathname === '/contact/')) {
      e.preventDefault();
      var to = url.pathname === '/blog/' ? 0.30 : 0.80;
      window.scrollTo({ top: Math.round(maxScroll * to), behavior: reduced ? 'auto' : 'smooth' });
      return;
    }

    var isBack = a.id === 'backToList';
    e.preventDefault();
    navigate(isBack ? '/' : url.pathname, isBack ? { scrollTo: 'posts' } : {});

    // 首页内的链接若指回首页本身，滚到顶部
    if (!isBack && url.pathname === '/' && posts) {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    }
  });

  /* ---------- 初始化 ---------- */
  function boot() {
    refresh();
    render();
    // 直接访问文章页：内容淡入
    if (!reduced && document.body.classList.contains('post-page')) {
      content.style.opacity = '0';
      requestAnimationFrame(function () { content.style.opacity = '1'; });
    }
    // 带 #posts 进入：定位到文章区
    if (location.hash === '#posts') {
      try { history.scrollRestoration = 'manual'; } catch (e) {}
      var jump = function () {
        window.scrollTo(0, Math.round(maxScroll * 0.3));
        render();
      };
      jump();
      requestAnimationFrame(jump);
      setTimeout(jump, 120);
      try { history.replaceState(null, '', location.pathname); } catch (e) {}
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

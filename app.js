(function () {
  'use strict';
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var enter = document.getElementById('enter'), arch = document.getElementById('arch');
  function smooth(a, b, v) { var t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); }

  /* вход через арку: прокрутка раздвигает проём до краёв экрана */
  var ticking = false;
  function frame() {
    ticking = false;
    var r = enter.getBoundingClientRect(), span = enter.offsetHeight - window.innerHeight;
    var p = span > 0 ? Math.max(0, Math.min(1, -r.top / span)) : 0;
    arch.style.setProperty('--p', smooth(.05, .9, p).toFixed(3));
    enter.style.setProperty('--o', (1 - smooth(.05, .35, p)).toFixed(3));
  }
  function req() { if (!ticking) { ticking = true; (window.requestAnimationFrame || setTimeout)(frame, 16); } }
  if (enter && arch && !calm) { window.addEventListener('scroll', req, { passive: true }); window.addEventListener('resize', req); frame(); }

  /* «мебель, краска, плитка» зачёркиваются, когда блок появляется */
  var lis = Array.prototype.slice.call(document.querySelectorAll('.strike s'));
  if (!calm && 'IntersectionObserver' in window && lis.length) {
    lis.forEach(function (s) { s.style.setProperty('--k', 0); });
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { lis.forEach(function (s) { s.style.setProperty('--k', 1); }); io.disconnect(); }
    }, { threshold: .5 });
    io.observe(document.querySelector('.strike'));
  }
})();

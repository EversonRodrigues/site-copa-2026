/* ===================================================
   COPA 2026 — Animações JS
   - Scroll reveal com IntersectionObserver
   - Contador animado para estatísticas
   - Ripple nos botões
   =================================================== */

(function () {
  'use strict';

  /* ---- Scroll Reveal ---- */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => {
    observer.observe(el);
  });

  /* ---- Adicionar classe reveal nos cards automaticamente ---- */
  const selCard = [
    '.card-jogo',
    '.card-noticia',
    '.card-selecao-rico',
    '.card-palpite',
    '.card-grupo',
    '.ranking-row',
  ].join(', ');

  document.querySelectorAll(selCard).forEach((el, i) => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      el.style.transitionDelay = `${Math.min(i * 0.06, 0.4)}s`;
      observer.observe(el);
    }
  });

  /* ---- Contador animado para .hero-stat-valor ---- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1200;
        const start = performance.now();
        counterObs.unobserve(el);

        function step(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach(el => counterObs.observe(el));

  /* ---- Ripple nos botões ---- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 550);
    });
  });

  /* ---- Flip animation no countdown ---- */
  let prevValues = {};
  function watchCountdown() {
    ['cd-dias', 'cd-horas', 'cd-min', 'cd-seg'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const val = el.textContent;
      if (prevValues[id] !== val) {
        prevValues[id] = val;
        el.classList.remove('flip');
        void el.offsetWidth; // reflow
        el.classList.add('flip');
      }
    });
  }
  setInterval(watchCountdown, 1000);

})();

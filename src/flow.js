/*!
 * FlowCSS JS Runtime v1.0.0
 * Powers: scroll reveal, stagger, parallax, magnetic, tilt, cursor trail
 * https://flowcss.dev
 */
(function () {
  'use strict';

  /* ── Scroll Reveal (Intersection Observer) ── */
  function initReveal() {
    const revealSelectors = '.f-reveal, .f-reveal-left, .f-reveal-right, .f-reveal-zoom, .f-reveal-flip, .f-stagger';
    const els = document.querySelectorAll(revealSelectors);
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.flowDelay ? parseInt(el.dataset.flowDelay) : 0;
          setTimeout(() => el.classList.add('f-visible'), delay);
          if (!el.classList.contains('f-repeat')) observer.unobserve(el);
        } else {
          if (entry.target.classList.contains('f-repeat')) {
            entry.target.classList.remove('f-visible');
          }
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    els.forEach((el) => observer.observe(el));
  }

  /* ── Parallax ── */
  function initParallax() {
    const smEls = document.querySelectorAll('.f-parallax-sm');
    const mdEls = document.querySelectorAll('.f-parallax');
    const lgEls = document.querySelectorAll('.f-parallax-lg');

    if (!smEls.length && !mdEls.length && !lgEls.length) return;

    function onScroll() {
      const sy = window.scrollY;
      smEls.forEach((el) => { el.style.transform = `translateY(${sy * 0.15}px)`; });
      mdEls.forEach((el) => { el.style.transform = `translateY(${sy * 0.3}px)`; });
      lgEls.forEach((el) => { el.style.transform = `translateY(${sy * 0.5}px)`; });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Magnetic Buttons ── */
  function initMagnetic() {
    const els = document.querySelectorAll('.f-magnetic');
    if (!els.length) return;

    els.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.35;
        const dy = (e.clientY - cy) * 0.35;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ── 3D Card Tilt ── */
  function initTilt() {
    const els = document.querySelectorAll('.f-tilt');
    if (!els.length) return;

    els.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotY =  ((x - cx) / cx) * 12;
        const rotX = -((y - cy) / cy) * 12;
        el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }

  /* ── Cursor Trail ── */
  function initCursorTrail() {
    if (!document.body.classList.contains('f-cursor-trail')) return;

    const DOT_COUNT = 8;
    const dots = [];

    for (let i = 0; i < DOT_COUNT; i++) {
      const dot = document.createElement('div');
      dot.className = 'f-cursor-blob';
      const scale = 1 - i * 0.1;
      const opacity = 1 - i * 0.1;
      dot.style.cssText = `transform:scale(${scale});opacity:${opacity};transition-duration:${80 + i * 30}ms;`;
      document.body.appendChild(dot);
      dots.push({ el: dot, x: 0, y: 0 });
    }

    let mx = 0, my = 0;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

    function loop() {
      let px = mx, py = my;
      dots.forEach((d) => {
        d.x += (px - d.x) * 0.3;
        d.y += (py - d.y) * 0.3;
        d.el.style.left = (d.x - 10) + 'px';
        d.el.style.top  = (d.y - 10) + 'px';
        px = d.x; py = d.y;
      });
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ── Count-Up Numbers ── */
  function initCountUp() {
    const els = document.querySelectorAll('[data-flow-count]');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.flowCount);
        const suffix = el.dataset.flowSuffix || '';
        const prefix = el.dataset.flowPrefix || '';
        const decimals = el.dataset.flowDecimals ? parseInt(el.dataset.flowDecimals) : 0;
        const dur = el.dataset.flowDuration ? parseInt(el.dataset.flowDuration) : 1800;
        const start = performance.now();

        function update(now) {
          const progress = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const value = (target * ease).toFixed(decimals);
          el.textContent = prefix + value + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    els.forEach((el) => observer.observe(el));
  }

  /* ── Smooth Scroll for anchor links ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ── Dark Mode Toggle ── */
  window.flowToggleDark = function (el) {
    document.documentElement.classList.toggle('f-dark-mode');
    if (el) el.classList.toggle('active');
    const isDark = document.documentElement.classList.contains('f-dark-mode');
    localStorage.setItem('flow-dark', isDark ? '1' : '0');
  };

  function initDarkMode() {
    if (localStorage.getItem('flow-dark') === '1') {
      document.documentElement.classList.add('f-dark-mode');
    }
  }

  /* ── Ripple Effect ── */
  function initRipple() {
    document.querySelectorAll('.f-ripple').forEach((el) => {
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      el.addEventListener('click', (e) => {
        const rect = el.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
          position:absolute;
          width:${size}px; height:${size}px;
          border-radius:50%;
          background:rgba(255,255,255,0.3);
          transform:translate(-50%,-50%) scale(0);
          animation:f-ripple-grow 0.5s ease-out forwards;
          left:${e.clientX - rect.left}px;
          top:${e.clientY - rect.top}px;
          pointer-events:none;
        `;
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Inject ripple keyframe
    if (!document.getElementById('flow-ripple-style')) {
      const s = document.createElement('style');
      s.id = 'flow-ripple-style';
      s.textContent = '@keyframes f-ripple-grow { to { transform: translate(-50%,-50%) scale(2.5); opacity:0; } }';
      document.head.appendChild(s);
    }
  }

  /* ── Typewriter (data-flow-type) ── */
  function initTypewriter() {
    document.querySelectorAll('[data-flow-type]').forEach((el) => {
      const words = el.dataset.flowType.split('|');
      let wi = 0, ci = 0, deleting = false;
      const speed = parseInt(el.dataset.flowTypeSpeed || 80);
      const pause  = parseInt(el.dataset.flowTypePause || 1500);

      function tick() {
        const word = words[wi];
        el.textContent = word.substring(0, ci);
        if (!deleting) {
          if (ci < word.length) { ci++; setTimeout(tick, speed); }
          else { deleting = true; setTimeout(tick, pause); }
        } else {
          if (ci > 0) { ci--; setTimeout(tick, speed / 2); }
          else { deleting = false; wi = (wi + 1) % words.length; setTimeout(tick, speed); }
        }
      }
      tick();
    });
  }

  /* ── Init all ── */
  function init() {
    initReveal();
    initParallax();
    initMagnetic();
    initTilt();
    initCursorTrail();
    initCountUp();
    initSmoothScroll();
    initDarkMode();
    initRipple();
    initTypewriter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-run reveal on dynamic content
  window.flowRefresh = function () {
    initReveal();
    initMagnetic();
    initTilt();
    initRipple();
  };

  window.FlowCSS = { refresh: window.flowRefresh, toggleDark: window.flowToggleDark };
})();

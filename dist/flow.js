/*!
 * FlowCSS v1.0.0 — JavaScript companion
 * Handles: scroll reveals, accordion, tabs, ripple, typewriter, toast, theme
 */
(function (global) {
  'use strict';

  const Flow = {};

  /* ─── Scroll Reveal ──────────────────────────────────────── */
  Flow.initReveal = function (options = {}) {
    const threshold = options.threshold ?? 0.15;
    const rootMargin = options.rootMargin ?? '0px 0px -60px 0px';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (!options.repeat) observer.unobserve(entry.target);
        } else if (options.repeat) {
          entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold, rootMargin });

    document.querySelectorAll('.flow-reveal').forEach(el => observer.observe(el));
    return observer;
  };

  /* ─── Stagger animation trigger ─────────────────────────── */
  Flow.initStagger = function () {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(':scope > *').forEach((child, i) => {
            child.style.animationDelay = `${i * 80}ms`;
            child.style.opacity = '';
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.flow-stagger').forEach(el => observer.observe(el));
  };

  /* ─── Accordion ──────────────────────────────────────────── */
  Flow.initAccordion = function (selector = '.flow-accordion') {
    document.querySelectorAll(selector).forEach(accordion => {
      accordion.querySelectorAll('.flow-accordion__trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
          const item = trigger.closest('.flow-accordion__item');
          const isOpen = item.classList.contains('is-open');
          // Close siblings if data-single
          if (accordion.dataset.single !== undefined) {
            accordion.querySelectorAll('.flow-accordion__item.is-open').forEach(el => el.classList.remove('is-open'));
          }
          item.classList.toggle('is-open', !isOpen);
        });
      });
    });
  };

  /* ─── Tabs ───────────────────────────────────────────────── */
  Flow.initTabs = function () {
    document.querySelectorAll('.flow-tabs').forEach(tabBar => {
      const panelsId = tabBar.dataset.panels;
      const panels = panelsId ? document.getElementById(panelsId) : null;
      tabBar.querySelectorAll('.flow-tab').forEach((tab, i) => {
        tab.addEventListener('click', () => {
          tabBar.querySelectorAll('.flow-tab').forEach(t => t.classList.remove('is-active'));
          tab.classList.add('is-active');
          if (panels) {
            panels.querySelectorAll('[data-panel]').forEach((p, j) => {
              p.style.display = j === i ? '' : 'none';
            });
          }
          tabBar.dispatchEvent(new CustomEvent('flow:tab-change', { detail: { index: i, tab } }));
        });
      });
    });
  };

  /* ─── Ripple Effect ──────────────────────────────────────── */
  Flow.initRipple = function (selector = '.flow-btn--ripple') {
    document.querySelectorAll(selector).forEach(btn => {
      btn.addEventListener('click', function (e) {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        const ripple = document.createElement('span');
        ripple.className = 'flow-ripple-wave';
        ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
  };

  /* ─── Typewriter ─────────────────────────────────────────── */
  Flow.typewriter = function (el, options = {}) {
    const text = options.text || el.textContent;
    const speed = options.speed || 50;
    const loop = options.loop || false;
    el.textContent = '';
    el.classList.remove('flow-typewriter'); // remove CSS fallback
    el.style.borderRight = '2px solid currentColor';
    el.style.whiteSpace = 'nowrap';
    el.style.overflow = 'hidden';

    let i = 0;
    function type() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(type, speed);
      } else if (loop) {
        setTimeout(() => {
          i = 0;
          type();
        }, 2000);
      }
    }
    type();
  };

  /* ─── Toast Notifications ────────────────────────────────── */
  Flow.toast = function (message, options = {}) {
    let container = document.querySelector('.flow-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'flow-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const type = options.type || '';
    toast.className = `flow-toast${type ? ` flow-toast--${type}` : ''}`;
    toast.innerHTML = `
      ${options.icon ? `<span>${options.icon}</span>` : ''}
      <span style="flex:1">${message}</span>
      <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;opacity:0.6;font-size:1rem">✕</button>
    `;
    container.appendChild(toast);

    const duration = options.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(110%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
    return toast;
  };

  /* ─── Theme Toggle ───────────────────────────────────────── */
  Flow.initTheme = function () {
    const saved = localStorage.getItem('flow-theme') || 'light';
    document.documentElement.dataset.theme = saved;

    document.querySelectorAll('[data-flow-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.dataset.theme;
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        localStorage.setItem('flow-theme', next);
        btn.dispatchEvent(new CustomEvent('flow:theme-change', { detail: { theme: next }, bubbles: true }));
      });
    });
  };

  /* ─── Counter Animation ──────────────────────────────────── */
  Flow.animateCounter = function (el, options = {}) {
    const target = parseFloat(options.target ?? el.dataset.count ?? 100);
    const duration = options.duration ?? 1500;
    const prefix = options.prefix ?? el.dataset.prefix ?? '';
    const suffix = options.suffix ?? el.dataset.suffix ?? '';
    const decimals = options.decimals ?? 0;
    const start = performance.now();
    const from = options.from ?? 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = from + (target - from) * ease;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  };

  Flow.initCounters = function () {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Flow.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-flow-counter]').forEach(el => observer.observe(el));
  };

  /* ─── Smooth scroll for anchors ──────────────────────────── */
  Flow.initSmoothScroll = function () {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  };

  /* ─── Parallax ───────────────────────────────────────────── */
  Flow.initParallax = function (selector = '[data-parallax]') {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      els.forEach(el => {
        const speed = parseFloat(el.dataset.parallax ?? 0.3);
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  };

  /* ─── Magnetic button ────────────────────────────────────── */
  Flow.initMagnetic = function (selector = '.flow-magnetic') {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });
    });
  };

  /* ─── Auto-init on DOMContentLoaded ─────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    Flow.initReveal();
    Flow.initStagger();
    Flow.initAccordion();
    Flow.initTabs();
    Flow.initRipple();
    Flow.initTheme();
    Flow.initCounters();
    Flow.initSmoothScroll();
    Flow.initParallax();
    Flow.initMagnetic();
  });

  global.Flow = Flow;
})(window);

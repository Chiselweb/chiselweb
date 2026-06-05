/* ─── Nav: scroll frosted glass ────────────────────────────────── */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ─── Nav: hamburger menu ──────────────────────────────────────── */
(function () {
  const btn = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobileMenu');
  if (!btn || !mobileMenu) return;

  function openMenu() {
    nav.classList.add('nav-open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close menu');
    mobileMenu.setAttribute('aria-hidden', 'false');
  }
  function closeMenu() {
    nav.classList.remove('nav-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  btn.addEventListener('click', () => {
    nav.classList.contains('nav-open') ? closeMenu() : openMenu();
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ─── Fade-up on scroll ────────────────────────────────────────── */
const fadeEls = document.querySelectorAll('.fade-up');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
fadeEls.forEach(el => fadeObserver.observe(el));

/* ─── Demo scroll animation ────────────────────────────────────── */
(function () {
  const outer  = document.getElementById('demoStickyOuter');
  const driver = document.getElementById('demoScrollDriver');
  const scene  = document.getElementById('demostickyscene');
  const progressBar = document.getElementById('demoProgress');
  if (!outer || !driver || !scene) return;

  /* ── Step definitions ── */
  const SCENARIO_1_NODES = 9;
  const SCENARIO_2_NODES = 6;
  const STEPS_S1   = SCENARIO_1_NODES;   // 0-8
  const STEPS_S2   = SCENARIO_2_NODES;   // 0-5
  const PAUSE_STEPS = 2;                 // brief hold between scenarios
  const TOTAL_STEPS = STEPS_S1 + PAUSE_STEPS + STEPS_S2; // 17

  // px of scroll travel per step — reduce on mobile for a snappier experience
  const isMobile = () => window.innerWidth < 768;
  const VH_PER_STEP = () => isMobile() ? 70 : 100;

  function getTotalScrollH() {
    return TOTAL_STEPS * VH_PER_STEP();
  }

  function setDriverHeight() {
    driver.style.height = (getTotalScrollH() + window.innerHeight) + 'px';
  }

  setDriverHeight();
  window.addEventListener('resize', setDriverHeight, { passive: true });

  /* ── Phone notification maps ── */
  const S1_NOTIFS = { 0: 's1n0', 2: 's1n2', 3: 's1n3', 6: 's1n6' };
  const S2_NOTIFS = { 0: 's2n0', 5: 's2email' };

  function setPhoneNotif(id, visible) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('visible', visible);
  }

  let lastStep = -1;

  function applyStep(step) {
    if (step === lastStep) return;
    lastStep = step;

    const inS1 = step < STEPS_S1;
    const inS2 = step >= STEPS_S1 + PAUSE_STEPS;

    /* Scenario visibility */
    const s1El = document.getElementById('scenario1');
    const s2El = document.getElementById('scenario2');
    if (s1El) s1El.classList.toggle('active', !inS2);
    if (s2El) s2El.classList.toggle('active', inS2);

    if (inS1) {
      /* Light up S1 nodes 0…step */
      document.querySelectorAll('#s1nodes .workflow-node').forEach((n, i) => {
        n.classList.toggle('lit', i <= step);
      });
      Object.entries(S1_NOTIFS).forEach(([idx, id]) => {
        setPhoneNotif(id, step >= parseInt(idx));
      });
    } else if (inS2) {
      /* Light up all S1 nodes (they stay visually complete) */
      document.querySelectorAll('#s1nodes .workflow-node').forEach(n => n.classList.add('lit'));

      const s2step = step - (STEPS_S1 + PAUSE_STEPS);
      document.querySelectorAll('#s2nodes .workflow-node').forEach((n, i) => {
        n.classList.toggle('lit', i <= s2step);
      });
      Object.entries(S2_NOTIFS).forEach(([idx, id]) => {
        setPhoneNotif(id, s2step >= parseInt(idx));
      });
    }
  }

  function getScrollProgress() {
    /* outer == demoStickyOuter which wraps driver.
       When outer's top hits the viewport top and the driver scrolls,
       -rect.top gives how many px we've scrolled into the driver. */
    const rect = outer.getBoundingClientRect();
    const scrolled = -rect.top;
    const totalH = getTotalScrollH();
    return Math.max(0, Math.min(1, scrolled / totalH));
  }

  function onScroll() {
    const rect = outer.getBoundingClientRect();
    /* Skip if outer is entirely above or below the viewport */
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const p = getScrollProgress();
    const rawStep = Math.floor(p * TOTAL_STEPS);
    const step = Math.max(0, Math.min(TOTAL_STEPS - 1, rawStep));
    applyStep(step);

    if (progressBar) progressBar.style.width = (p * 100) + '%';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initialise on load
})();

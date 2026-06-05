/* ─── Nav scroll effect ───────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ─── Fade-up observer ────────────────────────────────────────── */
const fadeEls = document.querySelectorAll('.fade-up');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
fadeEls.forEach(el => fadeObserver.observe(el));

/* ─── Demo scroll animation ───────────────────────────────────── */
(function () {
  const outer = document.getElementById('demoStickyOuter');
  const driver = document.getElementById('demoScrollDriver');
  const scene = document.getElementById('demostickyscene');
  const progress = document.getElementById('demoProgress');
  if (!outer || !driver || !scene) return;

  /* ── Step definitions ─── */
  const SCENARIO_1_NODES = 9;
  const SCENARIO_2_NODES = 6;
  // Each step = one node lighting up. Extra steps for scenario transition + phone reveals.
  const STEPS_S1 = SCENARIO_1_NODES; // steps 0-8
  const STEPS_S2 = SCENARIO_2_NODES; // steps 0-5
  const PAUSE_STEPS = 2; // buffer between scenarios
  const TOTAL_STEPS = STEPS_S1 + PAUSE_STEPS + STEPS_S2;
  const VH_PER_STEP = 100; // px of scroll travel per step
  const TOTAL_SCROLL_H = TOTAL_STEPS * VH_PER_STEP;

  // Set the driver height to provide the scroll travel
  driver.style.height = (TOTAL_SCROLL_H + window.innerHeight) + 'px';

  /* Phone notification map: nodeIndex → notif element id (or null) */
  const S1_NOTIFS = {
    0: 's1n0',
    2: 's1n2',
    3: 's1n3',
    6: 's1n6',
  };
  const S2_NOTIFS = {
    0: 's2n0',
    5: 's2email', // email preview appears on final node
  };

  let lastStep = -1;

  function getScrollProgress() {
    const rect = outer.getBoundingClientRect();
    const scrolled = -rect.top;
    return Math.max(0, Math.min(1, scrolled / TOTAL_SCROLL_H));
  }

  function setPhoneNotif(id, visible) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('visible', visible);
  }

  function applyStep(step) {
    if (step === lastStep) return;
    lastStep = step;

    const inS1 = step < STEPS_S1;
    const inS2 = step >= STEPS_S1 + PAUSE_STEPS;

    // Scenario visibility
    const s1 = document.getElementById('scenario1');
    const s2 = document.getElementById('scenario2');
    if (s1 && s2) {
      s1.classList.toggle('active', inS1 || (!inS1 && !inS2));
      s2.classList.toggle('active', inS2);
    }

    if (inS1) {
      // Light up S1 nodes 0..step
      const nodes = document.querySelectorAll('#s1nodes .workflow-node');
      nodes.forEach((n, i) => {
        const lit = i <= step;
        n.classList.toggle('lit', lit);
      });
      // Phone notifs
      Object.entries(S1_NOTIFS).forEach(([nodeIdx, notifId]) => {
        setPhoneNotif(notifId, step >= parseInt(nodeIdx));
      });
    } else if (inS2) {
      // All S1 nodes stay lit during S2 (they're hidden anyway)
      const s2step = step - (STEPS_S1 + PAUSE_STEPS);
      const nodes = document.querySelectorAll('#s2nodes .workflow-node');
      nodes.forEach((n, i) => {
        n.classList.toggle('lit', i <= s2step);
      });
      Object.entries(S2_NOTIFS).forEach(([nodeIdx, notifId]) => {
        setPhoneNotif(notifId, s2step >= parseInt(nodeIdx));
      });
    }
  }

  function onScroll() {
    const p = getScrollProgress();
    // Only animate when outer is in viewport
    const rect = outer.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const rawStep = Math.floor(p * TOTAL_STEPS);
    const step = Math.max(0, Math.min(TOTAL_STEPS - 1, rawStep));
    applyStep(step);

    // Progress bar
    if (progress) progress.style.width = (p * 100) + '%';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // init
})();

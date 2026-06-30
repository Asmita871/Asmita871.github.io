// Mobile sidebar toggle
const navToggle = document.getElementById('navToggle');
const sidebar = document.getElementById('sidebar');
navToggle?.addEventListener('click', () => sidebar.classList.toggle('open'));

document.querySelectorAll('.sidenav a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.sidenav a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    sidebar.classList.remove('open');
  });
});

// Active link on scroll
const sections = document.querySelectorAll('main > section[id]');
const navLinks = document.querySelectorAll('.sidenav a');
window.addEventListener('scroll', () => {
  let current = sections[0]?.id;
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// Carousel
const track = document.getElementById('carTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsWrap = document.getElementById('dots');
const cards = track ? Array.from(track.children) : [];

if (track && cards.length) {
  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => { scrollToCard(i); resetAutoplay(); });
    dotsWrap.appendChild(dot);
  });

  function cardWidth() {
    return cards[0].getBoundingClientRect().width + 24;
  }

  function scrollToCard(i) {
    track.scrollTo({ left: i * cardWidth(), behavior: 'smooth' });
  }

  function currentIndex() {
    return Math.round(track.scrollLeft / cardWidth());
  }

  function goNext() {
    const next = (currentIndex() + 1) % cards.length;
    scrollToCard(next);
  }

  prevBtn?.addEventListener('click', () => {
    const prev = (currentIndex() - 1 + cards.length) % cards.length;
    scrollToCard(prev);
    resetAutoplay();
  });
  nextBtn?.addEventListener('click', () => { goNext(); resetAutoplay(); });

  track.addEventListener('scroll', () => {
    const idx = currentIndex();
    dotsWrap.querySelectorAll('span').forEach((d, i) => d.classList.toggle('active', i === idx));
  });

  // Continuous auto-rotate, pausing on hover/touch/focus
  const AUTOPLAY_MS = 3500;
  let autoplayTimer = null;

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(goNext, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }
  function resetAutoplay() {
    startAutoplay();
  }

  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);
  track.addEventListener('touchstart', stopAutoplay, { passive: true });
  track.addEventListener('touchend', startAutoplay, { passive: true });
  track.addEventListener('focusin', stopAutoplay);
  track.addEventListener('focusout', startAutoplay);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) startAutoplay();
}

// Auto-computed hero stats — update automatically as projects/skills change
(function () {
  const projectCount = document.querySelectorAll('#carTrack .project-card').length;
  const toolCount = document.querySelectorAll('.skills-grid .skill[data-type="tool"]').length;

  const statProjects = document.getElementById('statProjects');
  const statTools = document.getElementById('statTools');
  const statYears = document.getElementById('statYears');
  const startEl = document.getElementById('learningStart');

  if (statProjects) statProjects.textContent = projectCount + '+';
  if (statTools) statTools.textContent = toolCount + '+';

  if (statYears && startEl) {
    const startDate = new Date(startEl.dataset.start);
    const now = new Date();
    let years = now.getFullYear() - startDate.getFullYear();
    const beforeAnniversary =
      now.getMonth() < startDate.getMonth() ||
      (now.getMonth() === startDate.getMonth() && now.getDate() < startDate.getDate());
    if (beforeAnniversary) years -= 1;
    years = Math.max(years, 1);
    statYears.textContent = years + '+';
  }
})();

// Contact section now uses direct mailto links (no form needed on static hosting)

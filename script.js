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
    dot.addEventListener('click', () => scrollToCard(i));
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

  prevBtn?.addEventListener('click', () => scrollToCard(Math.max(0, currentIndex() - 1)));
  nextBtn?.addEventListener('click', () => scrollToCard(Math.min(cards.length - 1, currentIndex() + 1)));

  track.addEventListener('scroll', () => {
    const idx = currentIndex();
    dotsWrap.querySelectorAll('span').forEach((d, i) => d.classList.toggle('active', i === idx));
  });
}

// Contact section now uses direct mailto links (no form needed on static hosting)

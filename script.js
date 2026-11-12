/* Ronin: page behaviour. Plain JavaScript, with Lenis for smooth scrolling. */
(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const root = document.documentElement, small = () => innerWidth <= 820;

  /* ---------- entrance: red bars clear, the name rises ---------- */
  requestAnimationFrame(() => setTimeout(() => root.classList.add('ready'), 120));

  /* ---------- smooth scrolling and anchors ---------- */
  let lenis = null;
  if (window.Lenis && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
  }
  const burger = $('.burger');
  const closeMenu = () => { root.classList.remove('menu'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', root.classList.toggle('menu')));
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); e.preventDefault(); closeMenu(); if (id.length < 2) return;
    const t = $(id); if (!t) return;
    const y = id === '#top' ? 0 : t.getBoundingClientRect().top + scrollY - 40;
    lenis ? lenis.scrollTo(y, { duration: 1.4 }) : scrollTo({ top: y, behavior: 'smooth' });
  }));

  /* ---------- local time in the hero ---------- */
  const clock = $('#clock');
  const tick = () => { clock.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos' }).format(new Date()); };
  tick(); setInterval(tick, 20000);
  const hdots = $$('.hero .dots i'); let hd = 0; setInterval(() => { hd = (hd + 1) % hdots.length; hdots.forEach((d, i) => d.classList.toggle('on', i === hd)); }, 1800);

  /* ---------- reveal on view, lazy video ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  $$('.rv,.rvi').forEach(el => io.observe(el));
  const vio = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { if (!v.src && v.dataset.src) v.src = v.dataset.src; v.play().catch(() => {}); } else if (!v.paused) v.pause();
  }), { rootMargin: '20% 0px' });
  $$('.ph video,.featured video').forEach(v => vio.observe(v));

  /* ---------- counting numbers ---------- */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
    const step = t => { const p = clamp((t - t0) / 1500); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .5 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* ---------- services: tap to hold a row open on touch screens ---------- */
  const rows = $$('.row');
  rows.forEach(r => $('button', r).addEventListener('click', () => { const o = r.classList.contains('open'); rows.forEach(x => x.classList.remove('open')); if (!o) r.classList.add('open'); }));

  /* ---------- testimonials ---------- */
  const quotes = $$('blockquote'), faces = $$('.faces img'); let qi = 0;
  const quote = i => { qi = (i + quotes.length) % quotes.length; quotes.forEach((q, k) => q.classList.toggle('on', k === qi)); faces.forEach((f, k) => f.classList.toggle('on', k === qi)); };
  const [prev, next] = $$('.arrows button'); prev.addEventListener('click', () => quote(qi - 1)); next.addEventListener('click', () => quote(qi + 1));

  /* ---------- scroll: header, featured parallax, spinning mark, showreel ---------- */
  const nav = $('.nav'), featured = $('.featured'), reel = $('.reel'), rv = $('.screen video'), runtime = $('#runtime'), tc = $('#tc'), sound = $('#sound');
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const two = n => String(Math.floor(n)).padStart(2, '0');
  let last = 0, ticking = false, playing = false;
  function frame() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    nav.classList.toggle('small', y > 40);
    const r = reel.getBoundingClientRect(), inReel = r.top < 10 && r.bottom > vh - 10;
    nav.classList.toggle('hide', (y > last && y > 300 && !root.classList.contains('menu')) || inReel); last = y;
    root.style.setProperty('--sy', y.toFixed(0));
    const f = featured.getBoundingClientRect(); featured.style.setProperty('--fp', clamp((vh - f.top) / (vh + f.height)).toFixed(3));
    // showreel: a small card grows to fill the frame, then plays
    const p = clamp(-r.top / (r.height - vh)), s = ease(clamp(p / .55));
    reel.style.setProperty('--rp', p.toFixed(4)); reel.style.setProperty('--rs', s.toFixed(4)); reel.style.setProperty('--rh', clamp((p - .4) / .15).toFixed(3));
    const want = r.top < vh * .6 && r.bottom > vh * .4 && p > .3;
    if (r.top < vh * 1.5 && !rv.src) rv.src = rv.dataset.src;
    if (want && !playing) { playing = true; rv.play().catch(() => {}); } else if (!want && playing) { playing = false; rv.pause(); }
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); frame();
  rv.addEventListener('timeupdate', () => {
    const t = rv.currentTime; runtime.textContent = two(t / 60) + ':' + two(t % 60);
    tc.textContent = '00:' + two(t / 60) + ':' + two(t % 60) + ':' + two((t % 1) * 30);
  });
  sound.addEventListener('click', () => { rv.muted = !rv.muted; sound.textContent = rv.muted ? 'AUDIO: OFF' : 'AUDIO: ON'; });
})();

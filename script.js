/* Veya Studio: page behaviour. No build step, no dependencies beyond Lenis for smooth scrolling. */
(() => {
  const FORM_ENDPOINT = '';            // paste a form or n8n webhook URL here to receive enquiries
  const REEL_VIDEO = 'assets/reel.mp4'; // the file the play button loads

  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const root = document.documentElement, small = () => innerWidth <= 900;

  /* ---------- smooth scrolling ---------- */
  let lenis = null;
  if (window.Lenis && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) { e.preventDefault(); return; }
    const t = $(id); if (!t) return; e.preventDefault(); closeMenu();
    const y = id === '#top' ? 0 : t.getBoundingClientRect().top + scrollY - (small() ? 52 : 0);
    lenis ? lenis.scrollTo(y, { duration: 1.4 }) : scrollTo({ top: y, behavior: 'smooth' });
  }));

  /* ---------- menu ---------- */
  const menuBtn = $('.menu-btn');
  function closeMenu() { root.classList.remove('menu-open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  menuBtn.addEventListener('click', () => { const o = root.classList.toggle('menu-open'); menuBtn.setAttribute('aria-expanded', o); });
  $('.scrim').addEventListener('click', closeMenu);
  addEventListener('keydown', e => e.key === 'Escape' && closeMenu());

  /* ---------- hero slideshow ---------- */
  const slides = $$('.slides img'), thumbs = $$('.thumbs button'); let cur = 0, timer;
  const show = i => { cur = (i + slides.length) % slides.length; slides.forEach((s, k) => s.classList.toggle('on', k === cur)); thumbs.forEach((t, k) => t.classList.toggle('on', k === cur)); };
  const auto = () => { clearInterval(timer); timer = setInterval(() => show(cur + 1), 4200); };
  thumbs.forEach((t, i) => t.addEventListener('click', () => { show(i); auto(); })); auto();

  /* ---------- reveal on view ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  $$('.rv,.chart').forEach(el => io.observe(el));
  // images unroll from the top; a fully clipped element never reports as visible, so these are checked by position
  let pending = $$('.rvi');
  const unroll = () => { if (!pending.length) return; pending = pending.filter(el => { if (el.getBoundingClientRect().top < innerHeight * .88) { el.classList.add('in'); return false; } return true; }); };

  /* ---------- counting numbers ---------- */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
    const tick = t => { const p = clamp((t - t0) / 1400), v = Math.round(end * (1 - Math.pow(1 - p, 3))); el.textContent = v + suf; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* ---------- scroll scenes ---------- */
  const hero = $('.hero'), reveal = $('.reveal'), steps = $('.steps'), stepEls = $$('.step'), reel = $('.reel'), screen = $('.screen');
  const prog = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / (r.height - innerHeight)); };
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  let ticking = false;
  function frame() {
    ticking = false; unroll();
    const vh = innerHeight;
    hero.style.setProperty('--hp', clamp(scrollY / vh).toFixed(3));
    // work: one image opens out into a wall of work
    const p = prog(reveal), z = ease(clamp(p / .62));
    const s0 = small() ? 1.75 : 2.32;
    reveal.style.setProperty('--ms', (s0 + (1 - s0) * z).toFixed(4));
    reveal.style.setProperty('--mo', (1 - z).toFixed(3));
    reveal.style.setProperty('--mv', clamp((p - .1) / .5).toFixed(3));
    [.16, .32, .48, .7].forEach((t, i) => reveal.style.setProperty('--m' + (i + 1), p > t ? 1 : 0));
    // process: the open panel follows the scroll
    if (!small()) { const sp = prog(steps), k = Math.min(stepEls.length - 1, Math.floor(sp * stepEls.length * .999)); stepEls.forEach((el, i) => el.classList.toggle('on', i === k)); }
    // reel: a tilted card settles into a full screen
    const rp = prog(reel);
    reel.style.setProperty('--rp', ease(clamp(rp / .6)).toFixed(4));
    reel.style.setProperty('--rt', ease(clamp((rp - .5) / .35)).toFixed(3));
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); frame();
  if (small()) stepEls.forEach(el => el.classList.add('on'));

  /* ---------- reel playback ---------- */
  // the clip loops silently behind the title once the section is near; the button turns the sound on and clears the title
  const video = $('.screen video');
  new IntersectionObserver((es, o) => es.forEach(e => {
    if (!e.isIntersecting) return; o.disconnect();
    video.src = REEL_VIDEO; video.muted = true;
    video.play().then(() => screen.classList.add('live')).catch(() => {});
  }), { rootMargin: '60% 0px' }).observe(reel);
  $('.play button').addEventListener('click', () => {
    const on = screen.classList.toggle('playing');
    video.muted = !on;
    if (on) { video.currentTime = 0; video.play().catch(() => {}); }
  });

  /* ---------- services accordion ---------- */
  const svcs = $$('.svc');
  svcs.forEach(s => $('.svc-h', s).addEventListener('click', () => { const open = s.classList.contains('open'); svcs.forEach(o => o.classList.remove('open')); if (!open) s.classList.add('open'); }));

  /* ---------- client stories ---------- */
  const stories = $$('.story'), cnt = $('.cnt b'); let si = 0;
  const story = i => { si = (i + stories.length) % stories.length; stories.forEach((s, k) => s.classList.toggle('on', k === si)); cnt.textContent = String(si + 1).padStart(2, '0'); };
  const [prev, next] = $$('.arrows button'); prev.addEventListener('click', () => story(si - 1)); next.addEventListener('click', () => story(si + 1));

  /* ---------- pricing calculator ---------- */
  const plans = {
    m: { base: 2400, per: '/month', inc: ['One active request at a time', 'Unlimited revisions', 'Priority turnaround', 'Pause or cancel anytime'] },
    p: { base: 3500, per: '/project', inc: ['One film, fixed scope', 'Script and storyboard', 'Two revision rounds', 'All formats and source files'] }
  };
  let plan = 'm', shown = plans.m.base;
  const money = n => '$' + Math.round(n).toLocaleString('en-US');
  const totalEl = $('#total'), baseEl = $('#base'), addsEl = $('#adds'), perEl = $('#per'), incEl = $('#inc');
  function price() {
    const P = plans[plan], adds = $$('.ad input:checked').reduce((a, i) => a + +i.value, 0), target = P.base + adds, from = shown, t0 = performance.now();
    baseEl.textContent = money(P.base); addsEl.textContent = '+' + money(adds); perEl.textContent = P.per;
    incEl.innerHTML = P.inc.map(t => `<li><svg><use href="#tick"/></svg>${t}</li>`).join('');
    const tick = t => { const p = clamp((t - t0) / 450); shown = from + (target - from) * (1 - Math.pow(1 - p, 3)); totalEl.textContent = money(shown); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }
  $$('.tog button').forEach(b => b.addEventListener('click', () => { plan = b.dataset.plan; $$('.tog button').forEach(o => o.classList.toggle('on', o === b)); price(); }));
  $$('.ad input').forEach(i => i.addEventListener('change', price)); price();

  /* ---------- questions: one open at a time ---------- */
  const qs = $$('.qs details');
  qs.forEach(d => d.addEventListener('toggle', () => { if (d.open) qs.forEach(o => o !== d && (o.open = false)); }));

  /* ---------- enquiry form ---------- */
  const form = $('.form'), status = $('.status');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const req = $$('[required]', form); let ok = true;
    req.forEach(f => { const bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)); f.classList.toggle('bad', bad); if (bad) ok = false; });
    status.className = 'sm status' + (ok ? '' : ' err');
    if (!ok) { status.textContent = 'Please fill in your name, the idea and a valid email.'; return; }
    if (!FORM_ENDPOINT) { status.textContent = 'The form is not connected yet. Email hello@veya.studio and we will reply within a day.'; return; }
    status.textContent = 'Sending...';
    try {
      const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      if (!r.ok) throw new Error(r.status);
      form.reset(); status.textContent = 'Thank you. You will hear back within a day.';
    } catch (err) { status.className = 'sm status err'; status.textContent = 'That did not send. Please email hello@veya.studio instead.'; }
  });
  $('.news').addEventListener('submit', e => { e.preventDefault(); const i = $('.news input'); const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value); $('.news button').textContent = ok ? 'THANK YOU' : 'CHECK EMAIL'; if (ok) i.value = ''; });
})();

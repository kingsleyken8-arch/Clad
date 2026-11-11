(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- build repeated bits ---------- */
  const sideItems = [
    ['i-home', 'Home'], ['i-users', 'Customers'], ['i-cal', 'Conversations'], ['grp', 'AI team'],
    ['i-pen', 'Notetaker'], ['i-head', 'Receptionist'], ['i-search', 'Researcher', 'Beta'],
    ['i-chat', 'Analyst', 'Beta'], ['i-ledger', 'Bookkeeper']
  ];
  $$('[data-side]').forEach(el => {
    const on = el.dataset.side;
    el.innerHTML =
      `<div class="brand">Huile <svg class="i"><use href="#i-search"/></svg></div>
       <div class="me"><img src="assets/avatar.jpg" alt=""><span>Alex Morgan<small>Operations</small></span></div>` +
      sideItems.map(([ic, name, tag]) => ic === 'grp' ? `<div class="grp">${name}</div>` :
        `<a class="${name === on ? 'on' : ''}"><svg class="i"><use href="#${ic}"/></svg>${name}${tag ? `<em>${tag}</em>` : ''}</a>`).join('') +
      `<div class="sp"></div><a><svg class="i"><use href="#i-plug"/></svg>Integrations</a><a><svg class="i"><use href="#i-help"/></svg>Help &amp; support</a>`;
  });

  const heat = $('[data-heat]');
  if (heat) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], hrs = ['8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', '7'];
    const curve = [.35, .8, 1, .9, .6, .5, .75, .85, .7, .5, .3, .15], dayW = [1, .85, .8, .9, .7];
    let h = '';
    days.forEach((d, di) => { h += `<span>${d}</span>` + curve.map((c, i) => `<i style="--o:${(.08 + c * dayW[di] * .9 * (0.8 + ((di * 7 + i * 3) % 5) / 20)).toFixed(2)}"></i>`).join(''); });
    h += '<span></span>' + hrs.map(x => `<span class="hx">${x}</span>`).join('');
    heat.innerHTML = h;
  }

  $$('[data-chars]').forEach(el => {
    el.innerHTML = [...el.textContent].map((c, i) => `<span style="--i:${i}">${c}</span>`).join('');
  });
  $$('[data-dup]').forEach(el => { el.innerHTML += el.innerHTML; });
  $$('[data-dots]').forEach(el => {
    let h = '';
    for (let r = 0; r < 5; r++) for (let c = 0; c < 30; c++) h += `<i style="--c:${c};--o:${(.28 + .72 * c / 29).toFixed(2)}"${r === 4 && c === 29 ? ' class="last"' : ''}></i>`;
    el.innerHTML = h;
  });

  /* ---------- agent feature cards ---------- */
  const rows = $('[data-rows]');
  if (rows) {
    const st = { Done: '#3c8a5e', Running: '#f25c1f', Waiting: '#c98a1b', Approved: '#3c8a5e', Escalated: '#c0504d' };
    const data = [['#4471', 'Maya Chen', 'Move delivery', 'Just now', 'Running'], ['#4470', 'Orrin Freight', 'Invoice coding', '1 minute ago', 'Done'], ['#4469', 'Calder & Rowe', 'Meeting recap', '1 hour ago', 'Waiting'], ['#4468', 'Tallis', 'Refund request', 'Yesterday', 'Approved'], ['#4467', 'Maplestone', 'New account intake', 'Oct 6', 'Escalated'], ['#4466', 'Brightwell', 'Booking reminder', 'Oct 6', 'Done'], ['#4465', 'Fennick Supply', 'Renewal plan', 'Oct 5', 'Done'], ['#4464', 'Northgate', 'Collections follow-up', 'Oct 5', 'Waiting'], ['#4463', 'Kestrel', 'Weekly report', 'Oct 4', 'Approved'], ['#4462', 'Halden Co.', 'Quote request', 'Oct 4', 'Done']];
    rows.innerHTML = data.map(r => `<div class="tr">${r.slice(0, 4).map(c => `<span>${c}</span>`).join('')}<i style="--c:${st[r[4]]};color:${st[r[4]]}">${r[4]}</i></div>`).join('');
  }
  const tiles = $('[data-tiles]');
  if (tiles) {
    tiles.innerHTML = '<i></i>'.repeat(12);
    const ts = $$('i', tiles); let k = 0;
    const paint = () => {
      const n = [1, 2, 3, 2, 1, 0][k++ % 6];
      ts.forEach((t, i) => { t.className = i === 4 ? 'idle' : (i > 4 && i <= 4 + n) ? 'live' : ''; });
    };
    paint(); if (!reduce) setInterval(paint, 1800);
  }
  const typed = $('[data-type]');
  if (typed && !reduce) {
    const lines = ['Call back everyone who rang after six yesterday', 'Reconcile the October statement for Fennick Supply', 'Send the recap from this morning and book the follow-up', 'Draft the weekly operations report for Monday'];
    let li = 0, ci = 0, dir = 1, hold = 30;
    setInterval(() => {
      if (hold > 0) { hold--; return; }
      const line = lines[li]; ci += dir;
      if (ci <= 0) { typed.textContent = 'Message Huile'; typed.parentNode.classList.remove('typing'); dir = 1; li = (li + 1) % lines.length; hold = 20; ci = 0; return; }
      typed.parentNode.classList.add('typing'); typed.textContent = line.slice(0, ci);
      if (ci >= line.length) { dir = -3; hold = 45; }
    }, 45);
  }

  /* ---------- reveal on view ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    $$('[data-count]', e.target).concat(e.target.matches('[data-count]') ? [e.target] : []).forEach(countUp);
  }), { threshold: .18, rootMargin: '0px 0px -6% 0px' });
  $$('.rv').forEach(el => io.observe(el));

  function countUp(el) {
    const to = +el.dataset.count, dec = +(el.dataset.dec || 0), pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    const t0 = performance.now(), dur = 1500;
    (function tick(t) {
      const p = clamp((t - t0) / dur), v = to * (1 - Math.pow(1 - p, 4));
      el.textContent = pre + v.toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ---------- scroll driven scenes ---------- */
  const hero = $('.hero'), proof = $('.proof'), story = $('.story'), storyPin = $('.story-pin'), storyVid = $('.story-media video');
  const plat = $('.platform'), platLeft = $('.plat-left'), mock = $('.mock'), screens = $$('.screen'), tabs = $$('.tab'), msgs = $$('.msg');
  const railsEl = $('.rails'), railEl = $('.rails i'), footerEl = $('footer'), teamFig = $('.team figure'), big = $('footer .big'), heroVid = $('.hero video');
  const themed = $$('[data-theme]');
  const INTRO = .1, STEPS = 5, STEP = (1 - INTRO) / STEPS, MW = 1110;
  let step = -1;

  function frame() {
    const vh = innerHeight, vw = document.documentElement.clientWidth, compact = vw < 900;

    // hero dims as the proof card slides over it
    const pr = proof.getBoundingClientRect();
    const cover = clamp(1 - pr.top / vh);
    hero.style.setProperty('--dim', (cover * .75).toFixed(3));
    document.body.toggleAttribute('data-top', cover < .9);
    if (heroVid) { if (cover >= 1 && !heroVid.paused) heroVid.pause(); else if (cover < 1 && heroVid.paused) heroVid.play().catch(() => {}); }

    // story: image grows to fill the frame and crossfades into the film
    const sr = story.getBoundingClientRect();
    const sp = clamp(-sr.top / (story.offsetHeight - vh));
    const q = ease(clamp(sp / .62));
    storyPin.style.setProperty('--p', clamp(sp / .62).toFixed(4));
    storyPin.style.setProperty('--q', q.toFixed(4));
    const x = clamp((sp - .12) / .26);
    storyPin.style.setProperty('--x', x.toFixed(3));
    if (storyVid) { if (x > .2 && sr.bottom > 0 && sr.top < vh) { storyVid.paused && storyVid.play().catch(() => {}); } else if (!storyVid.paused) storyVid.pause(); }

    // platform: white to dark, mock docks right, tabs advance with scroll
    const r = plat.getBoundingClientRect();
    const p = clamp(-r.top / (plat.offsetHeight - vh));
    const e = ease(clamp(p / INTRO));
    plat.style.setProperty('--e', e.toFixed(4));
    plat.dataset.theme = e > .5 ? 'dark' : 'light';
    const top = compact ? 262 : 128;
    const railI = railEl ? railEl.getBoundingClientRect().right : 0;
    const s0 = (vw - 2 * railI) / MW;
    const s = compact ? s0 : lerp(s0, Math.min(1, s0), e);
    const pad = parseFloat(getComputedStyle(platLeft).left) || 56;
    const dockX = compact ? railI : Math.max(vw * .44, pad + platLeft.offsetWidth + 40);
    const x0 = railI;
    mock.style.height = ((vh - top) / s) + 'px';
    mock.style.transform = `translate(${lerp(x0, dockX, e).toFixed(1)}px,${top}px) scale(${s.toFixed(4)})`;
    const sp2 = clamp((p - INTRO) / STEP, 0, STEPS - .001), ns = Math.floor(sp2), sub = sp2 - ns;
    if (ns !== step) {
      step = ns;
      screens.forEach((el, i) => el.classList.toggle('on', i === step));
      const tabIdx = step <= 1 ? 0 : step - 1;
      tabs.forEach((t, i) => t.classList.toggle('on', i === tabIdx));
    }
    if (step === 1) msgs.forEach((m, i) => m.classList.toggle('on', sub > .08 + i * .15));
    else if (step < 1) msgs.forEach(m => m.classList.remove('on'));


    // parallax
    if (teamFig) { const t = teamFig.getBoundingClientRect(); teamFig.style.setProperty('--y', clamp((vh - t.top) / (vh + t.height)).toFixed(3)); }
    const br = big.getBoundingClientRect();
    big.style.setProperty('--f', clamp((vh - br.top) / (br.height * 1.1)).toFixed(3));

    // nav theme follows whatever section sits under it
    let theme = 'light';
    for (const el of themed) { const b = el.getBoundingClientRect(); if (b.top <= 60 && b.bottom > 60) theme = el.dataset.theme; }
    if (document.body.dataset.nav !== theme) document.body.dataset.nav = theme;
  }

  /* ---------- smooth scrolling ---------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: .09, wheelMultiplier: 1, smoothWheel: true, anchors: false });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const go = top => lenis ? lenis.scrollTo(top, { duration: 1.4 }) : scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });

  const fitRails = () => { railsEl.style.top = hero.offsetHeight + 'px'; railsEl.style.bottom = footerEl.offsetHeight + 'px'; };
  fitRails(); addEventListener('resize', fitRails); addEventListener('load', fitRails);

  let queued = false;
  const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; frame(); }); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  frame();

  tabs.forEach(t => t.addEventListener('click', () => {
    const total = plat.offsetHeight - innerHeight;
    go(plat.offsetTop + total * (INTRO + STEP * (+t.dataset.step + .35)));
  }));

  /* ---------- film modal ---------- */
  const modal = $('.modal'), mv = $('video', modal);
  $$('[data-film]').forEach(b => b.addEventListener('click', () => {
    mv.src = b.dataset.film || 'assets/hero.mp4'; modal.classList.add('on'); mv.play().catch(() => {}); lenis && lenis.stop();
  }));
  const close = () => { modal.classList.remove('on'); mv.pause(); lenis && lenis.start(); };
  $('button', modal).addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  /* ---------- in-page anchors ---------- */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = document.getElementById(a.getAttribute('href').slice(1));
    if (!t) return; e.preventDefault();
    go(t.getBoundingClientRect().top + scrollY - (t.id === 'top' ? 0 : 20));
  }));
})();

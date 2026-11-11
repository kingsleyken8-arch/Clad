(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

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
  const plat = $('.platform'), mock = $('.mock'), screens = $$('.screen'), tabs = $$('.tab'), msgs = $$('.msg');
  const research = $('.research'), teamFig = $('.team figure'), big = $('footer .big'), heroVid = $('.hero video');
  const themed = $$('[data-theme]');
  const INTRO = .1, STEPS = 5, STEP = (1 - INTRO) / STEPS, MW = 1110;
  let step = -1;

  function frame() {
    const vh = innerHeight, vw = document.documentElement.clientWidth, compact = vw < 900;

    // hero dims as the proof card slides over it
    const pr = proof.getBoundingClientRect();
    const cover = clamp(1 - pr.top / vh);
    hero.style.setProperty('--dim', (cover * .75).toFixed(3));
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
    const s = compact ? (vw - 32) / MW : Math.min(1, (vw * .78) / MW);
    const dockX = compact ? 16 : Math.max(vw * .44, 56 + Math.min(430, vw * .32) + 60);
    const x0 = (vw - MW * s) / 2;
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

    // research panel widens as it comes through
    const rr = research.getBoundingClientRect();
    research.style.setProperty('--g', clamp((vh - rr.top) / (vh * 1.1)).toFixed(3));

    // parallax
    if (teamFig) { const t = teamFig.getBoundingClientRect(); teamFig.style.setProperty('--y', clamp((vh - t.top) / (vh + t.height)).toFixed(3)); }
    const br = big.getBoundingClientRect();
    big.style.setProperty('--f', clamp((vh - br.top) / (br.height * 1.1)).toFixed(3));

    // nav theme follows whatever section sits under it
    let theme = 'light';
    for (const el of themed) { const b = el.getBoundingClientRect(); if (b.top <= 60 && b.bottom > 60) theme = el.dataset.theme; }
    if (document.body.dataset.nav !== theme) document.body.dataset.nav = theme;
  }

  let queued = false;
  const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; frame(); }); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  frame();

  tabs.forEach(t => t.addEventListener('click', () => {
    const total = plat.offsetHeight - innerHeight;
    scrollTo({ top: plat.offsetTop + total * (INTRO + STEP * (+t.dataset.step + .35)), behavior: 'smooth' });
  }));

  /* ---------- film modal ---------- */
  const modal = $('.modal'), mv = $('video', modal);
  $$('[data-film]').forEach(b => b.addEventListener('click', () => {
    mv.src = b.dataset.film || 'assets/hero.mp4'; modal.classList.add('on'); mv.play().catch(() => {});
  }));
  const close = () => { modal.classList.remove('on'); mv.pause(); };
  $('button', modal).addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  /* ---------- in-page anchors ---------- */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = document.getElementById(a.getAttribute('href').slice(1));
    if (!t) return; e.preventDefault();
    scrollTo({ top: t.getBoundingClientRect().top + scrollY - (t.id === 'top' ? 0 : 20), behavior: 'smooth' });
  }));
})();

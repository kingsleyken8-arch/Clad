(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmall = () => innerWidth <= 760;

  /* ---------- smooth scrolling ---------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: .09, smoothWheel: true, anchors: false });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const go = top => lenis ? lenis.scrollTo(top, { duration: 1.3, force: true }) : scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });

  /* ---------- line icons, drawn in code ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  const add = (svg, tag, attrs, i) => { const el = document.createElementNS(NS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); el.setAttribute('pathLength', 1); el.style.setProperty('--i', i); svg.appendChild(el); };
  const hexPts = r => Array.from({ length: 6 }, (_, k) => { const a = Math.PI / 3 * k - Math.PI / 2; return (50 + Math.cos(a) * r).toFixed(2) + ',' + (50 + Math.sin(a) * r).toFixed(2); }).join(' ');
  const ICONS = {
    // rays leaving a centre: money going out in every direction
    burst(svg) { for (let k = 0; k < 40; k++) { const a = k / 40 * Math.PI * 2, r1 = 9, r2 = k % 2 ? 46 : 38; add(svg, 'line', { x1: 50 + Math.cos(a) * r1, y1: 50 + Math.sin(a) * r1, x2: 50 + Math.cos(a) * r2, y2: 50 + Math.sin(a) * r2 }, k); } },
    // nested hexagons: each handover wrapped inside the last
    hex(svg) { [46, 39, 32, 25, 18].forEach((r, k) => add(svg, 'polygon', { points: hexPts(r) }, k * 6)); },
    // a woven lattice: local accounts linked across corridors
    lattice(svg) {
      const rows = [22, 41, 60, 79], w = 44;
      rows.forEach((y, k) => add(svg, 'polygon', { points: `50,${y - 18} ${50 + w},${y} 50,${y + 18} ${50 - w},${y}` }, k * 5));
      [[6, 22, 94, 79], [94, 22, 6, 79], [6, 41, 94, 60], [94, 41, 6, 60]].forEach((l, k) => add(svg, 'line', { x1: l[0], y1: l[1], x2: l[2], y2: l[3] }, 20 + k * 4));
    }
  };
  $$('[data-ico]').forEach(svg => ICONS[svg.dataset.ico](svg));

  /* ---------- reveal and count on view ---------- */
  const countUp = el => {
    const to = +el.dataset.count, dec = +(el.dataset.dec || 0), suf = el.dataset.suf || '';
    if (reduce) return; const t0 = performance.now();
    (function tick(t) { const p = clamp((t - t0) / 1400); el.textContent = (to * (1 - Math.pow(1 - p, 4))).toFixed(dec) + suf; if (p < 1) requestAnimationFrame(tick); })(t0);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; e.target.classList.add('in'); io.unobserve(e.target);
    $$('[data-count]', e.target).forEach(countUp);
  }), { threshold: .18, rootMargin: '0px 0px -6% 0px' });
  $$('.rv, .ico.big').forEach(el => io.observe(el));

  /* ---------- the globe: meridians and parallels drawn in dots ---------- */
  const CITIES = { abuja: [9.06, 7.49, 'Abuja'], newyork: [40.71, -74.01, 'New York'], rome: [41.9, 12.5, 'Rome'], athens: [37.98, 23.73, 'Athens'], sydney: [-33.87, 151.21, 'Sydney'], beijing: [39.9, 116.4, 'Beijing'] };
  const rad = d => d * Math.PI / 180;
  const vec = (lat, lon) => { const a = rad(lat), b = rad(lon); return [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)]; };
  const globe = $('#globe'), gx = globe.getContext('2d');
  const dots = [];
  for (let lon = -180; lon < 180; lon += 10) for (let lat = -84; lat <= 84; lat += 1.5) dots.push(vec(lat, lon));
  for (let lat = -80; lat <= 80; lat += 10) for (let lon = -180; lon < 180; lon += 1.5 / Math.max(.3, Math.cos(rad(lat)))) dots.push(vec(lat, lon));
  const routes = $$('.routes li');
  routes.forEach(li => { const s = $('span', li); s.innerHTML = `<em>${s.textContent}</em>`; });
  const arcOf = (a, b) => { const A = vec(a[0], a[1]), B = vec(b[0], b[1]), w = Math.acos(clamp(A[0] * B[0] + A[1] * B[1] + A[2] * B[2], -1, 1)), n = Math.max(40, Math.round(w * 90)), out = [];
    for (let i = 0; i <= n; i++) { const t = i / n, s1 = Math.sin((1 - t) * w) / Math.sin(w), s2 = Math.sin(t * w) / Math.sin(w), lift = 1 + Math.sin(Math.PI * t) * .14 * Math.min(1, w); out.push([(A[0] * s1 + B[0] * s2) * lift, (A[1] * s1 + B[1] * s2) * lift, (A[2] * s1 + B[2] * s2) * lift]); } return out; };
  const ARCS = routes.map(li => arcOf(CITIES[li.dataset.a], CITIES[li.dataset.b]));
  // the view turns so the middle of the active route faces the reader
  const FACE = routes.map(li => { const a = CITIES[li.dataset.a], b = CITIES[li.dataset.b], A = vec(a[0], a[1]), B = vec(b[0], b[1]), m = [A[0] + B[0], A[1] + B[1], A[2] + B[2]], l = Math.hypot(...m); return { lon: Math.atan2(m[0] / l, m[2] / l), lat: Math.asin(m[1] / l) * .7 }; });
  let gw = 0, gh = 0, gd = 1, rotY = FACE[0].lon, rotX = FACE[0].lat, active = 0, drawT = 1, arcStart = performance.now(), lastActive = -1;
  const sizeGlobe = () => { const r = globe.getBoundingClientRect(); gd = Math.min(devicePixelRatio || 1, 2); gw = r.width; gh = r.height; globe.width = Math.round(gw * gd); globe.height = Math.round(gh * gd); };
  const proj = (p, cy, sy, cx, sx, R) => { const x = p[0] * cy - p[2] * sy, z0 = p[0] * sy + p[2] * cy, y = p[1] * cx - z0 * sx, z = p[1] * sx + z0 * cx; return [gw / 2 + x * R, gh / 2 - y * R, z]; };
  function drawGlobe(now) {
    const dark = getComputedStyle(corr).getPropertyValue('--e') > .5 || isSmall();
    const R = Math.min(gw, gh) * .46;
    // ease the rotation toward the active route, taking the short way round
    let dl = FACE[active].lon - rotY; dl = Math.atan2(Math.sin(dl), Math.cos(dl));
    rotY += dl * .06; rotX += (FACE[active].lat - rotX) * .06;
    const cy = Math.cos(-rotY), sy = Math.sin(-rotY), cx = Math.cos(rotX), sx = Math.sin(rotX);
    gx.setTransform(gd, 0, 0, gd, 0, 0); gx.clearRect(0, 0, gw, gh);
    const base = dark ? '255,255,255' : '40,40,46';
    for (let i = 0; i < dots.length; i++) {
      const p = proj(dots[i], cy, sy, cx, sx, R);
      gx.fillStyle = `rgba(${base},${p[2] > 0 ? .3 + p[2] * .6 : .1})`;
      gx.fillRect(p[0], p[1], p[2] > 0 ? 1.6 : 1, p[2] > 0 ? 1.6 : 1);
    }
    // the active route draws itself from sender to receiver, then holds
    if (active !== lastActive) { lastActive = active; arcStart = now; }
    drawT = clamp((now - arcStart) / 1400);
    const arc = ARCS[active], upto = Math.round(ease(drawT) * (arc.length - 1));
    for (let i = 0; i <= upto; i++) { const p = proj(arc[i], cy, sy, cx, sx, R); if (p[2] < -.15) continue; gx.fillStyle = `rgba(127,139,255,${.45 + .55 * i / arc.length})`; gx.beginPath(); gx.arc(p[0], p[1], 2.1, 0, 6.3); gx.fill(); }
    const head = proj(arc[upto], cy, sy, cx, sx, R); gx.fillStyle = '#fff'; gx.beginPath(); gx.arc(head[0], head[1], 3.2, 0, 6.3); gx.fill();
    gx.strokeStyle = 'rgba(127,139,255,.5)'; gx.lineWidth = 1; gx.beginPath(); gx.arc(head[0], head[1], 7 + Math.sin(now / 260) * 2, 0, 6.3); gx.stroke();
    // city markers and names
    const li = routes[active], ends = [li.dataset.a, li.dataset.b];
    gx.font = `500 ${Math.max(11, R * .045)}px Urbanist, sans-serif`; gx.textBaseline = 'middle';
    for (const k in CITIES) {
      const c = CITIES[k], p = proj(vec(c[0], c[1]), cy, sy, cx, sx, R); if (p[2] < .05) continue;
      const on = ends.includes(k);
      gx.fillStyle = on ? '#7f8bff' : `rgba(${base},.55)`; gx.beginPath(); gx.arc(p[0], p[1], on ? 4 : 2.4, 0, 6.3); gx.fill();
      if (on) { gx.fillStyle = dark ? '#fff' : '#151515'; gx.fillText(c[2], p[0] + 10, p[1] - 10); }
    }
    if (!reduce) requestAnimationFrame(drawGlobe);
  }
  const setRoute = i => { if (i === active) return; active = i; routes.forEach((li, k) => li.classList.toggle('on', k === i)); };

  /* ---------- scroll driven scenes ---------- */
  const corr = $('.corr'), top = $('.top'), stepsEl = $('.steps'), stepItems = $$('.steps li'), icos = $$('.cards .ico');
  function frame() {
    const vh = innerHeight, y = scrollY;
    document.body.toggleAttribute('data-scrolled', y > 24);
    // corridors: the page darkens as the section arrives and lightens as it leaves
    const r = corr.getBoundingClientRect();
    if (!isSmall()) {
      const e = Math.min(ease(clamp((vh * .6 - r.top) / (vh * .6))), ease(clamp((r.bottom - vh * .4) / (vh * .6))));
      corr.style.setProperty('--e', e.toFixed(4));
      const p = clamp(-r.top / (corr.offsetHeight - vh));
      setRoute(Math.min(routes.length - 1, Math.floor(p * routes.length)));
    }
    document.body.dataset.tone = (r.top <= 40 && r.bottom > 40 && (isSmall() || +corr.style.getPropertyValue('--e') > .5)) ? 'dark' : 'light';
    // the icons turn slowly as the page moves
    icos.forEach((el, i) => el.style.setProperty('--rot', ((y * (i % 2 ? -1 : 1)) * .03).toFixed(2)));
    // tracking: the line fills and each step lights as you read down the ticket
    const s = stepsEl.getBoundingClientRect(), tp = clamp((vh * .78 - s.top) / (s.height + vh * .12));
    stepsEl.style.setProperty('--p', tp.toFixed(3));
    stepItems.forEach((li, i) => li.classList.toggle('on', tp > i / stepItems.length - .02));
  }
  let queued = false;
  const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; frame(); }); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { sizeGlobe(); onScroll(); });
  sizeGlobe(); frame(); requestAnimationFrame(drawGlobe);
  if (reduce) drawGlobe(performance.now());

  // on a phone the section is not pinned, so the routes take turns on their own
  setInterval(() => { if (isSmall() && !document.hidden) setRoute((active + 1) % routes.length); }, 3600);
  routes.forEach((li, i) => li.addEventListener('click', () => {
    if (isSmall()) return setRoute(i);
    go(corr.offsetTop + (corr.offsetHeight - innerHeight) * ((i + .5) / routes.length));
  }));

  /* ---------- menu and in-page links ---------- */
  const burger = $('.burger');
  const setMenu = on => { document.body.classList.toggle('menu', on); burger.setAttribute('aria-expanded', on); };
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu')));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return;
    e.preventDefault(); setMenu(false);
    go(t.id === 'home' ? 0 : t.getBoundingClientRect().top + scrollY - (t.id === 'corridors' ? 0 : 60));
  }));
})();

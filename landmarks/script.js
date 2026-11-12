(() => {
  /* Five landmarks, each drawn from the same set of particles.
     A drawing holds for HOLD ms, then the particles burst apart and
     re-form as the next drawing in MORPH ms. */
  const SHAPES = [
    { src: 'assets/shapes/colosseum.jpg', name: 'Rome' },
    { src: 'assets/shapes/eiffel.jpg', name: 'Paris' },
    { src: 'assets/shapes/abuja.jpg', name: 'Abuja', dx: -.13 },
    { src: 'assets/shapes/liberty.jpg', name: 'New York' },
    { src: 'assets/shapes/clocktower.jpg', name: 'Manhattan' }
  ];
  const HOLD = 4000, MORPH = 950;
  const BLUE = [79, 92, 255], GREY = [70, 70, 74];
  // the highlighted regions of the frame, as fractions of its width and height
  const inBlue = (x, y) => (x < .229 && y > .365 && y < .655) || (x > .968 && y > .86);

  const canvas = document.getElementById('particles'), ctx = canvas.getContext('2d');
  const place = document.querySelector('.place'), placeName = document.getElementById('place');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = matchMedia('(max-width: 760px)').matches;
  const N = small ? 34000 : 120000;

  let W = 0, H = 0, dpr = 1;
  const shapes = [];                       // per shape: Float32Array [x, y, alpha] * N, in frame fractions
  const sx = new Float32Array(N), sy = new Float32Array(N);       // scatter direction per particle
  const ph = new Float32Array(N), sz = new Float32Array(N);       // shimmer phase, dot size
  for (let i = 0; i < N; i++) {
    const a = Math.random() * 6.2832, r = .03 + Math.pow(Math.random(), 1.8) * .26;
    sx[i] = Math.cos(a) * r; sy[i] = Math.sin(a) * r * .8;
    ph[i] = Math.random() * 6.2832; sz[i] = .75 + Math.random() * .75;
  }

  const load = src => new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = src; });

  // turn a drawing into N points: the darker the ink, the more likely a dot lands there
  function sample(img, dx = 0) {
    const w = 900, h = Math.round(w * img.height / img.width);
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d', { willReadFrequently: true });
    // on a phone the frame is tall, so keep the left part of the drawing, where the landmark stands
    if (small) { const cropW = img.height / 1.5; x.drawImage(img, 0, 0, cropW, img.height, 0, 0, w, h); }
    else x.drawImage(img, 0, 0, w, h);
    const d = x.getImageData(0, 0, w, h).data, ink = new Float32Array(w * h);
    let max = 0;
    for (let i = 0; i < w * h; i++) {
      let v = 1 - (d[i * 4] * .3 + d[i * 4 + 1] * .59 + d[i * 4 + 2] * .11) / 255;
      const y = (i / w | 0) / h; if (y > .8) v *= Math.max(.12, (1 - y) / .2);      // the drawing thins out toward the bottom
      ink[i] = v < .16 ? 0 : v; if (v > max) max = v;
    }
    const out = new Float32Array(N * 3);
    let n = 0, guard = 0;
    while (n < N && guard++ < N * 400) {
      const px = Math.random() * w, py = Math.random() * h, v = ink[(py | 0) * w + (px | 0)] / (max || 1);
      if (Math.random() < v * v * v) {
        // lift the low skyline on the right so it clears the white sheet below the hero
        const fx = px / w, k = small ? 0 : Math.min(1, Math.max(0, (fx - .3) / .16)), lift = .25 * k * k * (3 - 2 * k);
        out[n * 3] = fx + (small ? 0 : dx); out[n * 3 + 1] = py / h - lift; out[n * 3 + 2] = v; n++;
      }
    }
    // sort by position so neighbouring particles travel together a little: a cleaner regroup
    const idx = Array.from({ length: n }, (_, i) => i).sort((a, b) => (out[a * 3] + out[a * 3 + 1] * .6) - (out[b * 3] + out[b * 3 + 1] * .6));
    const sorted = new Float32Array(N * 3);
    idx.forEach((s, i) => { sorted[i * 3] = out[s * 3]; sorted[i * 3 + 1] = out[s * 3 + 1]; sorted[i * 3 + 2] = out[s * 3 + 2]; });
    return sorted;
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    img = ctx.createImageData(canvas.width, canvas.height); buf = new Uint32Array(img.data.buffer);
  }

  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  let cur = 0, next = 0, t0 = 0, morphing = false, img = null, buf = null;

  // pack a colour for direct pixel writes (little endian: ABGR)
  const pack = (c, a) => ((a * 255) << 24 | c[2] << 16 | c[1] << 8 | c[0]) >>> 0;
  const INK = [[.34, .58, .9].map(a => pack(GREY, a)), [.55, .8, 1].map(a => pack(BLUE, a))];

  function draw(now) {
    let t = 0;
    if (morphing) { t = Math.min(1, (now - t0) / MORPH); if (t >= 1) { cur = next; morphing = false; t = 0; } }
    const from = shapes[cur], to = morphing ? shapes[next] : from;
    const e = ease(t), burst = Math.sin(Math.PI * t), twist = burst * 5;
    const look = t < .5 ? from : to;       // which drawing decides a dot's colour and strength
    const cw = canvas.width, ch = canvas.height, big = dpr > 1.4;
    buf.fill(0);
    const time = now * .0012, wob = .45 * dpr;
    for (let i = 0; i < N; i++) {
      const k = i * 3, lx = look[k], ly = look[k + 1], al = look[k + 2];
      let x = from[k] + (to[k] - from[k]) * e, y = from[k + 1] + (to[k + 1] - from[k + 1]) * e;
      if (burst > 0) {
        const a = twist * sx[i], c = Math.cos(a), s = Math.sin(a);
        x += (sx[i] * c - sy[i] * s) * burst; y += (sx[i] * s + sy[i] * c) * burst * (W / H);
      }
      const px = (x * cw + Math.sin(time + ph[i]) * wob) | 0, py = (y * ch + Math.cos(time * .9 + ph[i]) * wob) | 0;
      if (px < 0 || py < 0 || px >= cw - 1 || py >= ch - 1) continue;
      const v = INK[inBlue(lx, ly) ? 1 : 0][al < .5 ? 0 : al < .75 ? 1 : 2], o = py * cw + px;
      buf[o] = v;
      if (big && sz[i] > 1.1) { buf[o + 1] = v; if (sz[i] > 1.35) buf[o + cw] = v; }
    }
    ctx.putImageData(img, 0, 0);
    if (!reduce) requestAnimationFrame(draw);
  }

  function advance() {
    next = (cur + 1) % shapes.length; t0 = performance.now(); morphing = true;
    place.classList.add('swap');
    setTimeout(() => { placeName.textContent = SHAPES[next].name; place.classList.remove('swap'); }, MORPH * .5);
  }

  Promise.all(SHAPES.map(s => load(s.src))).then(imgs => {
    imgs.forEach((im, i) => shapes.push(sample(im, SHAPES[i].dx)));
    resize(); addEventListener('resize', () => { resize(); if (reduce) draw(performance.now()); });
    if (reduce) { draw(performance.now()); return; }     // one still drawing, no motion
    // open by gathering the first landmark out of scattered dust
    const dust = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { dust[i * 3] = Math.random(); dust[i * 3 + 1] = Math.random(); dust[i * 3 + 2] = .4; }
    shapes.push(dust); cur = shapes.length - 1; next = 0; t0 = performance.now(); morphing = true;
    requestAnimationFrame(draw);
    setTimeout(() => { shapes.pop(); setInterval(advance, HOLD + MORPH); }, MORPH + 50);
  }).catch(() => { /* drawings failed to load: the page still reads without them */ });
})();

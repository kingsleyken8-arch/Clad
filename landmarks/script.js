(() => {
  /* The illustration is drawn from particles. Each landmark holds for HOLD ms,
     then the particles burst apart and re-form as the next one in MORPH ms.
     Every drawing shares one composition: a tall element down the left edge and
     the rest of the structure sweeping right across the middle of the frame. */
  const SHAPES = [
    { src: 'assets/shapes/colosseum.jpg', name: 'Rome' },
    { src: 'assets/shapes/abuja.jpg', name: 'Abuja' },
    { src: 'assets/shapes/brooklyn.jpg', name: 'New York' },
    { src: 'assets/shapes/parthenon.jpg', name: 'Athens' },
    { src: 'assets/shapes/sydney.jpg', name: 'Sydney' },
    { src: 'assets/shapes/greatwall.jpg', name: 'Beijing' }
  ];
  const HOLD = 4000, MORPH = 950;
  const FRAME_W = 1200, FRAME_H = 960;                      // the reference frame the layout was measured from
  const INK = [76, 76, 82], BLUE = [72, 86, 255];
  // highlighted regions, as fractions of the frame (measured from the reference: x 0-274, y 331-595)
  const inBlue = (x, y) => (x < .2285 && y > .3448 && y < .6198) || (x > .972 && y > .815);

  const canvas = document.getElementById('particles'), ctx = canvas.getContext('2d');
  const place = document.querySelector('.place'), placeName = document.getElementById('place');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = matchMedia('(max-width: 760px)').matches;
  const N = small ? 90000 : 420000;

  let W = 0, H = 0, dpr = 1, img = null, buf = null;
  const shapes = [];                                       // per shape: X[], Y[], V[] (ink strength), B[] (blue or not)
  const sx = new Float32Array(N), sy = new Float32Array(N), lag = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const a = Math.random() * 6.2832, r = .02 + Math.pow(Math.random(), 2) * .3;
    sx[i] = Math.cos(a) * r; sy[i] = Math.sin(a) * r * (FRAME_W / FRAME_H); lag[i] = Math.random();
  }

  const load = src => new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = src; });

  /* Turn a drawing into exactly N points. Points are spread in proportion to the ink,
     walking the picture row by row, so fine lines stay fine and nothing is left to chance. */
  function sample(image) {
    const w = small ? 760 : 1500, h = Math.round(w * (small ? 1.5 : FRAME_H / FRAME_W));
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
    if (small) g.drawImage(image, 0, 0, image.width * .5, image.height * .9, 0, 0, w, h);   // phones keep the left half
    else g.drawImage(image, 0, 0, w, h);
    const d = g.getImageData(0, 0, w, h).data, wt = new Float32Array(w * h);
    let total = 0;
    for (let i = 0; i < w * h; i++) {
      let v = 1 - (d[i * 4] * .3 + d[i * 4 + 1] * .59 + d[i * 4 + 2] * .11) / 255;
      if (v < .2) { wt[i] = 0; continue; }
      const y = (i / w | 0) / h;
      if (y > .87) v *= Math.max(0, (1 - y) / .13);         // the drawing dissolves toward the bottom of the frame
      wt[i] = v * Math.sqrt(v); total += wt[i];
    }
    const X = new Float32Array(N), Y = new Float32Array(N), V = new Float32Array(N), B = new Uint8Array(N);
    const stepSize = total / N; let acc = 0, target = Math.random() * stepSize, n = 0;
    for (let i = 0; i < w * h && n < N; i++) {
      acc += wt[i];
      while (acc > target && n < N) {
        const px = (i % w + Math.random()) / w, py = ((i / w | 0) + Math.random()) / h;
        X[n] = px; Y[n] = py; V[n] = Math.min(1, wt[i] * 1.1); B[n] = inBlue(px, py) ? 1 : 0; n++; target += stepSize;
      }
    }
    for (; n > 0 && n < N; n++) { X[n] = X[n - 1]; Y[n] = Y[n - 1]; V[n] = V[n - 1]; B[n] = B[n - 1]; }
    return { X, Y, V, B };
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    img = ctx.createImageData(canvas.width, canvas.height); buf = new Uint32Array(img.data.buffer);
  }

  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const pack = (c, a) => ((a * 255) << 24 | c[2] << 16 | c[1] << 8 | c[0]) >>> 0;   // little endian ABGR
  const LEVELS = 6;
  const TONE = [INK, BLUE].map((c, b) => Array.from({ length: LEVELS }, (_, i) => pack(c, (b ? .5 : .34) + (b ? .5 : .62) * i / (LEVELS - 1))));

  let cur = 0, next = 0, t0 = 0, morphing = false;

  function paint(now) {
    let t = 0;
    if (morphing) { t = Math.min(1, (now - t0) / MORPH); if (t >= 1) { cur = next; morphing = false; t = 0; } }
    const A = shapes[cur], Bn = morphing ? shapes[next] : A, look = t < .5 ? A : Bn;
    const cw = canvas.width, ch = canvas.height, thick = dpr > 1.4;
    buf.fill(0);
    for (let i = 0; i < N; i++) {
      let x, y;
      if (morphing) {
        // each particle leaves and arrives on its own beat, inside the same overall window
        const ti = Math.min(1, Math.max(0, t * 1.3 - lag[i] * .3)), e = ease(ti), burst = Math.sin(Math.PI * ti);
        x = A.X[i] + (Bn.X[i] - A.X[i]) * e + sx[i] * burst;
        y = A.Y[i] + (Bn.Y[i] - A.Y[i]) * e + sy[i] * burst;
      } else { x = A.X[i]; y = A.Y[i]; }
      const px = (x * cw) | 0, py = (y * ch) | 0;
      if (px < 0 || py < 0 || px >= cw - 1 || py >= ch - 1) continue;
      const v = TONE[look.B[i]][(look.V[i] * (LEVELS - 1) + .5) | 0], o = py * cw + px;
      buf[o] = v;
      if (thick) { buf[o + 1] = v; if (look.V[i] > .45) { buf[o + cw] = v; buf[o + cw + 1] = v; } }
    }
    ctx.putImageData(img, 0, 0);
    if (morphing) requestAnimationFrame(paint);              // while holding, the picture is still and nothing redraws
  }

  function advance() {
    if (shapes.length < 2 || document.hidden || morphing) return;
    next = (cur + 1) % shapes.length; t0 = performance.now(); morphing = true;
    if (place) { place.classList.add('swap'); setTimeout(() => { placeName.textContent = shapes[next].name; place.classList.remove('swap'); }, MORPH * .5); }
    requestAnimationFrame(paint);
  }

  load(SHAPES[0].src).then(first => {
    const s0 = sample(first); s0.name = SHAPES[0].name;
    resize();
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); if (!morphing) paint(performance.now()); }, 120); });
    if (reduce) { shapes.push(s0); paint(performance.now()); return; }
    // open by gathering the first landmark out of scattered dust
    const dust = { X: new Float32Array(N), Y: new Float32Array(N), V: new Float32Array(N).fill(.3), B: new Uint8Array(N) };
    for (let i = 0; i < N; i++) { dust.X[i] = Math.random(); dust.Y[i] = Math.random(); }
    shapes.push(dust, s0); cur = 0; next = 1; t0 = performance.now(); morphing = true;
    requestAnimationFrame(paint);
    // once gathered, drop the dust so the cycle only ever visits landmarks
    setTimeout(() => { shapes.shift(); cur = 0; next = 0; }, MORPH + 80);
    // the other drawings load in the background and join the cycle as they arrive
    Promise.all(SHAPES.slice(1).map(s => load(s.src).then(im => { const r = sample(im); r.name = s.name; return r; }).catch(() => null))).then(rest => {
      setTimeout(() => { rest.forEach(s => s && shapes.push(s)); setInterval(advance, HOLD + MORPH); }, MORPH + 120);
    });
  }).catch(() => { /* drawing failed to load: the page still reads without it */ });
})();

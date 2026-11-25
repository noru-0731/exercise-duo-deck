/* 장별 움직임. 점 하나가 노인 한 명(14장은 동 하나)이다 */
(function () {
  const S = DECK.scenes;
  const C = DECK.C;
  const $ = (id) => document.getElementById(id);

  /* 시연 영상 경로: 이 한 줄만 바꾸면 15장에 영상이 들어간다 */
  const DEMO_VIDEO = 'media/demo.mp4';

  /* ── 2장: 1장 막대가 부서져 점 500개가 된다 ── */
  const S2 = { n: 500, cols: 50, rows: 10, acc: 113 };
  S2.xy = (i) => {
    const c = Math.floor(i / S2.rows), r = i % S2.rows;
    return [92 + c * 35.5, 300 + r * 33];
  };
  S2.isA = (i) => i >= S2.n - S2.acc;
  S.s2 = {
    build() {
      const sec = $('s2');
      this.svg = DECK.svg(sec);
      this.d = DECK.dots(this.svg, S2.n, 11);
    },
    reset() {
      const rnd = DECK.rng(7);
      this.d.forEach((c) => {
        DECK.pos(c, 272 + rnd() * 1443, 360 + rnd() * 150);
        DECK.fill(c, C.g2, 1);
      });
    },
    start() {
      const rnd = DECK.rng(11);
      this.d.forEach((c, i) => {
        const [x, y] = S2.xy(i);
        DECK.pos(c, x, y, Math.floor(rnd() * 700));
        DECK.fill(c, C.g1);
      });
    },
    step(sec, k) {
      if (k === 2) this.d.forEach((c, i) => { c.style.transitionDelay = '0ms'; DECK.fill(c, S2.isA(i) ? C.a : C.g2); });
      if (k === 3) this.d.forEach((c, i) => { if (!S2.isA(i)) c.style.opacity = 0.3; });
    },
    finish() {
      this.d.forEach((c, i) => { const [x, y] = S2.xy(i); DECK.pos(c, x, y); });
    },
  };

  /* ── 3장: 2장의 선홍 점이 관계 줄로 모인다 ── */
  S.s3 = {
    build() {
      this.svg = DECK.svg($('s3'));
      this.d = DECK.dots(this.svg, S2.acc, 11);
    },
    reset() {
      this.d.forEach((c, j) => {
        const [x, y] = S2.xy(S2.n - S2.acc + j);
        DECK.pos(c, x, y); DECK.fill(c, C.a, 1);
      });
    },
    start() {
      const rnd = DECK.rng(3);
      this.d.forEach((c, j) => {
        DECK.pos(c, 340 + (j / (S2.acc - 1)) * 940, 316 + rnd() * 28, Math.floor(rnd() * 500));
      });
    },
    step(sec, k) { if (k === 2) this.d.forEach((c) => { c.style.transitionDelay = '0ms'; c.style.opacity = 0; }); },
    finish() { this.d.forEach((c) => { c.style.opacity = 0; }); },
  };

  /* ── 6장: 계기 26건 점, 혼자 있는 점에 다른 점이 다가와 이어진다 ── */
  S.s6 = {
    build() {
      this.svg = DECK.svg($('s6'));
      this.d = DECK.dots(this.svg, 26, 24);
      this.line = DECK.el(this.svg, 'line', { x1: 520, y1: 861, x2: 1180, y2: 861, stroke: C.a, 'stroke-width': 6, 'stroke-linecap': 'round' });
      this.lone = DECK.el(this.svg, 'circle', { cx: 0, cy: 0, r: 20 });
      this.come = DECK.el(this.svg, 'circle', { cx: 0, cy: 0, r: 20 });
    },
    reset() {
      this.d.forEach((c, i) => {
        DECK.pos(c, 130 + (i % 13) * 74, 560 + Math.floor(i / 13) * 62);
        DECK.fill(c, i < 11 ? C.a : i < 16 ? C.a2 : C.g2, 0);
      });
      DECK.pos(this.lone, 520, 861); DECK.fill(this.lone, C.g1, 0);
      DECK.pos(this.come, 1860, 861); DECK.fill(this.come, C.a, 0);
      this.line.style.opacity = 0;
    },
    step(sec, k, instant) {
      if (k === 1) { this.lone.style.opacity = 0; }
      if (k === 2) this.d.forEach((c, i) => { c.style.transitionDelay = (instant ? 0 : i * 45) + 'ms'; c.style.opacity = 1; });
      if (k === 3) {
        this.lone.style.transitionDelay = '0ms'; this.lone.style.opacity = 1;
        this.come.style.opacity = 1;
        DECK.pos(this.come, 1180, 861, instant ? 0 : 500);
        this.line.style.transitionDelay = instant ? '0ms' : '1700ms';
        this.line.style.opacity = 1;
      }
    },
  };

  /* ── 7장: 영국 50명 가운데 43명 ── */
  S.s7 = {
    build() {
      this.svg = DECK.svg($('s7'));
      this.d = DECK.dots(this.svg, 50, 13);
    },
    reset() {
      this.d.forEach((c, i) => {
        const r = Math.floor(i / 25), col = i % 25;
        DECK.pos(c, 612 + col * 36, 766 + r * 40);
        DECK.fill(c, i < 43 ? C.a : C.g2, 0);
      });
    },
    step(sec, k, instant) {
      if (k === 2) this.d.forEach((c, i) => { c.style.transitionDelay = (instant ? 0 : 600 + i * 30) + 'ms'; c.style.opacity = 1; });
    },
  };

  /* ── 9장: 12주 띠와 세 시기 ── */
  S.s9 = {
    build() {
      const sec = $('s9');
      const box = $('s9-weeks');
      const x0 = 260, w = 122, gap = 10.6;
      let html = '';
      for (let i = 0; i < 12; i++) {
        const x = x0 + i * (w + gap);
        const s = i < 4 ? 1 : 2;
        const d = i < 4 ? i * 120 : (i - 4) * 160;
        const lead = i < 4 ? 'background:var(--g2)' : i < 8 ? 'background:repeating-linear-gradient(135deg,var(--g3) 0 10px,#fff 10px 20px);border:2px solid var(--g2)' : 'border:2px dashed var(--g3)';
        const pair = i < 4 ? 'var(--a2)' : i < 8 ? 'var(--a1)' : 'var(--a)';
        html += `<div class="ab mut" data-s="${s}" style="left:${x}px;top:296px;width:${w}px;text-align:center;font-size:20px;transition-delay:${d}ms">${i + 1}주</div>`;
        html += `<div class="ab" data-s="${s}" style="left:${x}px;top:336px;width:${w}px;height:90px;border-radius:10px;${lead};transition-delay:${d}ms"></div>`;
        html += `<div class="ab" data-s="${s}" style="left:${x}px;top:446px;width:${w}px;height:90px;border-radius:10px;background:${pair};transition-delay:${d + 80}ms"></div>`;
      }
      box.innerHTML = html;
      const ph = $('s9-phase');
      ph.style.left = x0 + 'px'; ph.style.top = '556px'; ph.style.width = (1848 - x0) + 'px';
      const pw = 4 * (w + gap);
      ph.innerHTML =
        `<div data-s="1" style="width:${pw}px">1~4주 지도자가 집으로 찾아가 매번 같이</div>` +
        `<div data-s="2" style="width:${pw}px;transition-delay:200ms">5~8주 지도자는 한 번씩 빠진다</div>` +
        `<div data-s="2" style="width:${pw}px;transition-delay:800ms;color:var(--at);font-weight:600">9~12주 짝끼리</div>`;

      this.svg = DECK.svg(sec);
      this.parts = [];
      const leadR = [44, 28, 0], lw = [3, 8, 16];
      for (let p = 0; p < 3; p++) {
        const bx = 110 + p * 433;
        const g = DECK.el(this.svg, 'g', {});
        DECK.el(g, 'line', { x1: bx + 190, y1: 830, x2: bx + 340, y2: 830, stroke: C.a, 'stroke-width': lw[p], 'stroke-linecap': 'round' });
        if (leadR[p]) DECK.el(g, 'circle', { cx: bx + 70, cy: 830, r: leadR[p], fill: C.g2 });
        else DECK.el(g, 'circle', { cx: bx + 70, cy: 830, r: 26, fill: 'none', stroke: C.g3, 'stroke-width': 3, 'stroke-dasharray': '6 6' });
        DECK.el(g, 'circle', { cx: bx + 190, cy: 830, r: 20, fill: C.a });
        DECK.el(g, 'circle', { cx: bx + 340, cy: 830, r: 20, fill: C.a });
        const t = DECK.el(g, 'text', { x: bx + 70, y: 902, 'text-anchor': 'middle', 'font-size': 19, fill: '#6B7280' });
        t.textContent = '지도자';
        const t2 = DECK.el(g, 'text', { x: bx + 265, y: 902, 'text-anchor': 'middle', 'font-size': 19, fill: '#C8414F' });
        t2.textContent = '짝';
        g.style.transition = 'opacity .8s';
        this.parts.push(g);
      }
    },
    reset() { this.parts.forEach((g) => { g.style.opacity = 0; }); },
    step(sec, k, instant) {
      if (k === 3) this.parts.forEach((g, p) => { g.style.transitionDelay = (instant ? 0 : 300 + p * 900) + 'ms'; g.style.opacity = 1; });
    },
  };

  /* ── 10장: 점 20개를 아무렇게나, 그다음 비슷한 사람끼리 잇는다 ── */
  const S10 = { n: 20, y: 500 };
  (function () {
    const rnd = DECK.rng(42);
    const v = [];
    for (let i = 0; i < S10.n; i++) {
      v.push(170 + ((i + 0.15 + rnd() * 0.7) / S10.n) * 1600); // 고르게 퍼진 자리
    }
    v.sort((a, b) => a - b);
    S10.x = v;
    const idx = [...Array(S10.n).keys()];
    const r2 = DECK.rng(5);
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r2() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    S10.rand = []; S10.near = [];
    for (let i = 0; i < S10.n; i += 2) { S10.rand.push([idx[i], idx[i + 1]]); S10.near.push([i, i + 1]); }
  })();
  function arc(svg, x1, x2, y, col, w) {
    const dx = Math.abs(x2 - x1);
    const h = Math.min(185, 24 + dx * 0.32);
    const p = DECK.el(svg, 'path', { d: `M${x1} ${y} Q${(x1 + x2) / 2} ${y - h * 2} ${x2} ${y}`, fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round' });
    return p;
  }
  S.s10 = {
    build() {
      const svg = (this.svg = DECK.svg($('s10')));
      DECK.el(svg, 'line', { x1: 120, y1: S10.y + 2, x2: 1800, y2: S10.y + 2, stroke: C.g3, 'stroke-width': 3 });
      this.ra = S10.rand.map(([a, b]) => arc(svg, S10.x[a], S10.x[b], S10.y - 14, C.g2, 4));
      this.na = S10.near.map(([a, b]) => arc(svg, S10.x[a], S10.x[b], S10.y - 14, C.a, 6));
      this.d = DECK.dots(svg, S10.n, 13);
    },
    reset() {
      this.d.forEach((c) => { DECK.pos(c, 960, S10.y); DECK.fill(c, C.a, 1); });
      this.ra.forEach((p) => { p.style.opacity = 0; });
      this.na.forEach((p) => { p.style.opacity = 0; });
    },
    start() {
      this.d.forEach((c, i) => { DECK.pos(c, S10.x[i], S10.y, i * 20); DECK.fill(c, C.ink); });
    },
    step(sec, k, instant) {
      if (k === 1) this.ra.forEach((p, i) => { p.style.transitionDelay = (instant ? 0 : 1300 + i * 120) + 'ms'; p.style.opacity = 1; });
      if (k === 3) {
        this.ra.forEach((p) => { p.style.transitionDelay = '0ms'; p.style.opacity = 0.35; });
        this.na.forEach((p, i) => { p.style.transitionDelay = (instant ? 0 : 400 + i * 90) + 'ms'; p.style.opacity = 1; });
      }
    },
    finish() { this.d.forEach((c, i) => { DECK.pos(c, S10.x[i], S10.y); DECK.fill(c, C.ink); }); },
  };

  /* ── 11장: 점이 열, 스물, 마흔의 세 무리가 된다 ── */
  const S11 = { groups: [] };
  (function () {
    const spec = [
      { n: 10, x: 72, top: 650, rows: 1, col: C.g1 },
      { n: 20, x: 522, top: 524, rows: 2, col: C.a1 },
      { n: 40, x: 972, top: 330, rows: 4, col: C.a },
    ];
    spec.forEach((g) => {
      const pts = [];
      for (let i = 0; i < g.n; i++) {
        const r = Math.floor(i / 10), c = i % 10;
        pts.push([g.x + 30 + c * 40, g.top + r * 40]);
      }
      S11.groups.push({ ...g, pts });
    });
  })();
  S.s11 = {
    build() {
      this.svg = DECK.svg($('s11'));
      this.g = S11.groups.map((g) => DECK.dots(this.svg, g.n, 13));
    },
    reset() {
      S11.groups.forEach((g, gi) => this.g[gi].forEach((c, i) => {
        if (gi === 1) { DECK.pos(c, S10.x[i], S10.y); DECK.fill(c, C.ink, 1); }
        else { DECK.pos(c, g.pts[i][0], g.pts[i][1]); DECK.fill(c, g.col, 0); }
      }));
    },
    start() {
      S11.groups.forEach((g, gi) => this.g[gi].forEach((c, i) => {
        DECK.pos(c, g.pts[i][0], g.pts[i][1], i * 25 + gi * 150);
        DECK.fill(c, g.col, 1);
      }));
    },
    finish() {
      S11.groups.forEach((g, gi) => this.g[gi].forEach((c, i) => { DECK.pos(c, g.pts[i][0], g.pts[i][1]); DECK.fill(c, g.col, 1); }));
    },
  };

  /* ── 12장: 마흔 점이 가운데 칸으로 들어간다 ── */
  S.s12 = {
    build() {
      this.svg = DECK.svg($('s12'));
      this.d = DECK.dots(this.svg, 40, 13);
    },
    reset() {
      const g = S11.groups[2];
      this.d.forEach((c, i) => { DECK.pos(c, g.pts[i][0], g.pts[i][1]); DECK.fill(c, C.a, 1); });
    },
    start() {
      const rnd = DECK.rng(9);
      this.d.forEach((c, i) => {
        DECK.pos(c, 900 + rnd() * 120, 500 + rnd() * 120, i * 15);
        c.style.opacity = 0;
        c.style.transitionDelay = (i * 15) + 'ms, ' + (i * 15) + 'ms, ' + (900 + i * 15) + 'ms';
      });
    },
    finish() { this.d.forEach((c) => { c.style.opacity = 0; }); },
  };

  /* ── 13장: 흐린 점이 칸마다 진해진다 ── */
  S.s13 = {
    build() {
      this.svg = DECK.svg($('s13'));
      const tops = [440, 384, 372, 330], lefts = [72, 524, 976, 1428];
      this.rows = tops.map((t, b) => {
        const arr = DECK.dots(this.svg, 10, 11);
        arr.forEach((c, i) => DECK.pos(c, lefts[b] + 40 + i * 38, t - 26));
        return arr;
      });
      this.op = [0.3, 0.55, 0.8, 1];
    },
    reset() { this.rows.forEach((arr) => arr.forEach((c) => DECK.fill(c, C.a, 0))); },
    step(sec, k, instant) {
      const show = (b, base) => this.rows[b].forEach((c, i) => { c.style.transitionDelay = (instant ? 0 : base + i * 50) + 'ms'; c.style.opacity = this.op[b]; });
      if (k === 1) show(0, 600);
      if (k === 2) show(1, 600);
      if (k === 3) { show(2, 600); show(3, 1100); }
    },
  };

  /* ── 14장: 동 427개를 세 기준으로 거른다 ── */
  const S14 = { n: 427, cols: 29 };
  (function () {
    const rnd = DECK.rng(2026);
    const idx = [...Array(S14.n).keys()];
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    // 등촌제3동 점은 맨 윗줄에 두어 이름표가 다른 점을 가리지 않게 한다
    const k = idx.indexOf(16); [idx[0], idx[k]] = [idx[k], idx[0]];
    S14.s43 = new Set(idx.slice(0, 43));
    S14.s22 = new Set(idx.slice(0, 22));
    S14.s12 = new Set(idx.slice(0, 12));
    S14.top = idx[0];
    S14.xy = (i) => [96 + (i % S14.cols) * 38, 304 + Math.floor(i / S14.cols) * 37];
  })();
  S.s14 = {
    build() {
      this.svg = DECK.svg($('s14'));
      this.d = DECK.dots(this.svg, S14.n, 12);
      this.d.forEach((c, i) => { const [x, y] = S14.xy(i); DECK.pos(c, x, y); });
      const [tx, ty] = S14.xy(S14.top);
      this.lbl = DECK.el(this.svg, 'g', {});
      DECK.el(this.lbl, 'rect', { x: tx - 75, y: ty - 70, width: 150, height: 42, rx: 10, fill: '#fff', stroke: C.a, 'stroke-width': 2 });
      const t = DECK.el(this.lbl, 'text', { x: tx, y: ty - 41, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 600, fill: '#C8414F' });
      t.textContent = '등촌제3동';
      this.lbl.style.transition = 'opacity .8s';
    },
    reset() {
      this.d.forEach((c) => { DECK.fill(c, C.g2, 0); c.setAttribute('r', 12); });
      this.lbl.style.opacity = 0;
    },
    step(sec, k, instant) {
      const D = (ms) => (instant ? 0 : ms) + 'ms';
      if (k === 1) this.d.forEach((c, i) => { c.style.transitionDelay = D((i % S14.cols) * 40); c.style.opacity = 1; });
      if (k === 2) this.d.forEach((c, i) => {
        c.style.transitionDelay = D(0);
        if (S14.s43.has(i)) DECK.fill(c, C.a2); else DECK.fill(c, C.g3, 0.55);
      });
      if (k === 3) this.d.forEach((c, i) => {
        if (!S14.s43.has(i)) return;
        if (!S14.s22.has(i)) { c.style.transitionDelay = D(0); DECK.fill(c, C.g2, 0.7); }
        else if (!S14.s12.has(i)) { c.style.transitionDelay = D(900); DECK.fill(c, C.g2, 0.9); }
        else { c.style.transitionDelay = D(900); DECK.fill(c, C.a1); }
      });
      if (k === 4) {
        const c = this.d[S14.top];
        c.style.transitionDelay = D(0); DECK.fill(c, C.a); c.setAttribute('r', 17);
        this.lbl.style.transitionDelay = D(500); this.lbl.style.opacity = 1;
      }
    },
  };

  /* ── 15장: 시연 영상 틀 ── */
  S.s15 = {
    build() {
      const v = (this.v = $('demo'));
      this.ok = false;
      v.addEventListener('loadeddata', () => { this.ok = true; $('s15-frame').querySelector('.ph').style.display = 'none'; });
      v.addEventListener('error', () => { this.ok = false; v.style.display = 'none'; });
      if (DEMO_VIDEO) { v.src = DEMO_VIDEO; } else { v.style.display = 'none'; }
      this.cards = [...document.querySelectorAll('#s15-steps .s15-c')];
    },
    reset() { this.cards.forEach((c) => c.classList.remove('cur', 'done')); },
    step(sec, k) {
      this.cards.forEach((c) => {
        const n = +c.dataset.k;
        c.classList.toggle('cur', n === k);
        c.classList.toggle('done', n < k);
      });
    },
    finish() { this.cards.forEach((c) => { c.classList.remove('cur', 'done'); }); },
    enter(sec, playing) {
      if (!this.ok) return;
      try { this.v.currentTime = 0; if (playing) this.v.play(); } catch (e) { /* 영상 없음 */ }
    },
    leave() { try { this.v.pause(); } catch (e) { /* 영상 없음 */ } },
  };
})();

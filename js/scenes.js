/* 장별 움직임. 점 하나가 노인 한 명(14장은 동 하나)이다 */
(function () {
  const S = DECK.scenes;
  const C = DECK.C;
  const $ = (id) => document.getElementById(id);

  /* 시연 영상 경로: 이 한 줄만 바꾸면 16장(id s15)에 영상이 들어간다 */
  const DEMO_VIDEO = 'media/demo.mp4';


  /* ── 표지와 Q&A: 지도자 태블릿(13장 영상 1주 화면)이 아래에서 솟고, 알림 카드가 내려온다 ── */
  function coverArt(id) {
    return {
      build() {
        const sec = $(id);
        const band = sec.querySelector('.band');
        const box = document.createElement('div'); box.className = 'cv-box';
        box.innerHTML = '<img class="cv-tab" src="media/cover_tab.png" alt="">'
          + '<div class="cv-note"><div class="h"><i></i>도구가 먼저 알림</div><div class="m">황진호 님이 3주째 나오지 않음</div><div class="s">새 짝 후보: 황정수 님 · 걸어서 9분</div></div>';
        if (band) sec.insertBefore(box, band); else sec.appendChild(box);
        this.tab = box.querySelector('.cv-tab'); this.note = box.querySelector('.cv-note');
        this.t = [];
      },
      reset() {
        this.t.forEach(clearTimeout); this.t = [];
        [this.tab, this.note].forEach((e) => { e.style.transition = 'none'; e.classList.remove('on'); void e.offsetWidth; e.style.transition = ''; });
      },
      step(sec, k, instant) {
        if (k !== 1) return;
        if (instant) { [this.tab, this.note].forEach((e) => { e.style.transition = 'none'; e.classList.add('on'); }); return; }
        this.t.push(setTimeout(() => this.tab.classList.add('on'), 150));
        this.t.push(setTimeout(() => this.note.classList.add('on'), 1100));
      },
    };
  }
  S.s0 = coverArt('s0');
  S.sqa = coverArt('sqa');

  /* ── 2장: 1장 막대가 부서져 점 500개가 된다 ── */
  const S2 = { n: 100, cols: 10, rows: 10, acc: 23 };   // 선홍 23개는 22.6%를 반올림한 것
  S2.xy = (i) => {
    const c = i % S2.cols, r = Math.floor(i / S2.cols);
    return [112 + c * 62, 318 + r * 62];
  };
  S2.isA = (i) => i >= S2.n - S2.acc;

  /* ── 3장: 2장의 선홍 점이 부탁할 사람이 없는 쪽 막대로 쌓인다 ── */

  /* ── 7장: 영국 50명 가운데 43명 ── */

  /* ── 9장: 12주 띠와 세 시기 ── */

  /* ── 8장: 다시 측정한 사람 100명 가운데 2분 걷기가 늘어난 63% ── */

  /* ── 10장: 점 20개를 아무렇게나, 그다음 비슷한 사람끼리 잇는다 ── */
  const S10 = { n: 20, y: 500, yA: 500, yB: 690 };
  (function () {
    const rnd = DECK.rng(42);
    const v = [];
    for (let i = 0; i < S10.n; i++) v.push(380 + ((i + 0.15 + rnd() * 0.7) / S10.n) * 1160);
    v.sort((a, b) => a - b);
    S10.x = v;
    const idx = [...Array(S10.n).keys()];
    const r2 = DECK.rng(5);
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r2() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    S10.rand = []; S10.near = [];
    for (let i = 0; i < S10.n; i += 2) S10.rand.push([idx[i], idx[i + 1]]);
    // 아래 줄: 2분 걷기를 뺀 네 항목으로 맞춘 짝. 네 항목은 2분 걷기와 완전히 같지 않으므로
    // 2분 걷기 순서에 흔들림을 섞어 둘씩 맺고, 짝 간격 평균이 아무렇게나의 약 0.76배(15.5/20.5)가 되는 흔들림을 고른다
    const gap = (pp) => pp.reduce((t, [a, b]) => t + Math.abs(v[a] - v[b]), 0) / pp.length;
    const target = gap(S10.rand) * (15.5 / 20.5);
    let best = null;
    for (let seed = 1; seed < 400; seed++) {
      const r3 = DECK.rng(seed);
      const ord = [...Array(S10.n).keys()].map((i) => [i, v[i] + (r3() + r3() + r3() - 1.5) * 260]).sort((p, q) => p[1] - q[1]).map((p) => p[0]);
      const pp = []; for (let i = 0; i < S10.n; i += 2) pp.push([ord[i], ord[i + 1]]);
      const e = Math.abs(gap(pp) - target);
      if (!best || e < best.e) best = { e, pp };
    }
    S10.near = best.pp;
  })();
  function arc(svg, x1, x2, y, col, w) {
    const dx = Math.abs(x2 - x1);
    const h = Math.min(92, 14 + dx * 0.16);
    const p = DECK.el(svg, 'path', { d: `M${x1} ${y} Q${(x1 + x2) / 2} ${y - h * 2} ${x2} ${y}`, fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round' });
    return p;
  }
  S.s10 = {
    build() {
      const svg = (this.svg = DECK.svg($('s10')));
      DECK.el(svg, 'line', { x1: 360, y1: S10.yA + 2, x2: 1560, y2: S10.yA + 2, stroke: C.g3, 'stroke-width': 3 });
      this.lineB = DECK.el(svg, 'line', { x1: 360, y1: S10.yB + 2, x2: 1560, y2: S10.yB + 2, stroke: C.a3, 'stroke-width': 3 });
      this.ra = S10.rand.map(([a, b]) => arc(svg, S10.x[a], S10.x[b], S10.yA - 14, C.g2, 4));
      this.na = S10.near.map(([a, b]) => arc(svg, S10.x[a], S10.x[b], S10.yB - 14, C.a, 6));
      this.d = DECK.dots(svg, S10.n, 13);
      this.e = DECK.dots(svg, S10.n, 13);
    },
    reset() {
      this.d.forEach((c) => { DECK.pos(c, 960, S10.yA); DECK.fill(c, C.g1, 1); });
      this.e.forEach((c, i) => { DECK.pos(c, S10.x[i], S10.yA); DECK.fill(c, C.a, 0); });
      this.ra.forEach((p) => { p.style.opacity = 0; });
      this.na.forEach((p) => { p.style.opacity = 0; });
      this.lineB.style.opacity = 0;
    },
    start() { this.d.forEach((c, i) => DECK.pos(c, S10.x[i], S10.yA, i * 20)); },
    step(sec, k, instant) {
      const D = (ms) => (instant ? 0 : ms) + 'ms';
      if (k === 1) this.ra.forEach((p, i) => { p.style.transitionDelay = D(200 + i * 50); p.style.opacity = 1; });
      if (k === 3) {
        this.lineB.style.transitionDelay = D(0); this.lineB.style.opacity = 1;
        this.e.forEach((c, i) => { c.style.transitionDelay = D(i * 20); c.style.opacity = 1; DECK.pos(c, S10.x[i], S10.yB, instant ? 0 : i * 20); });
        this.na.forEach((p, i) => { p.style.transitionDelay = D(300 + i * 50); p.style.opacity = 1; });
      }
    },
    finish() { this.d.forEach((c, i) => DECK.pos(c, S10.x[i], S10.yA)); },
  };

  /* ── 13장: 흐린 점이 칸마다 진해진다 ── */
  S.s13 = {};

  /* ── 14장: 동 427개를 세 기준으로 거른다 ── */
  /* 14장: 서울 427개 동을 입체 기둥으로. 높이는 혼자 사는 수급 노인 수. 시점이 천천히 돈다 */
  S.ap8 = {
    build() {
      const D = window.S14DATA;
      this.cv = $('s14-cv'); this.g = this.cv.getContext('2d');
      this.W = 760; this.H = 590; this.g.setTransform(2, 0, 0, 2, 0, 0);
      const mx = D.d.reduce((a, r) => a + r[0], 0) / D.d.length, mz = D.d.reduce((a, r) => a + r[1], 0) / D.d.length;
      this.mx = mx; this.mz = mz;
      const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
      this.col = { base: hex('#C9CED5'), ghost: hex('#E3E6EA'), pass: hex('#AEB5BF'), g: hex('#AEB5BF'), a1: hex('#6B7280'), a: hex('#EE6B78') };
      this.p = D.d.map((r) => ({ x: r[0] - mx, z: r[1] - mz, h: Math.max(1.5, r[2] / 2452 * 120), st: r[3], top: r[4],
        gr: this.tw(0), c: this.tw(this.col.base), al: this.tw(1) }));
      this.cen = D.c.map((r) => ({ x: r[0] - mx, z: r[1] - mz }));
      this.cenA = this.tw(0); this.topA = this.tw(0); this.gridA = this.tw(0);
      // 바닥 껍질
      const pts = this.p.map((q) => [q.x, q.z]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
      const lo = [], up = [];
      pts.forEach((q) => { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); });
      pts.slice().reverse().forEach((q) => { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); });
      this.hull = lo.slice(0, -1).concat(up.slice(0, -1)).map(([x, z]) => [x * 1.07, z * 1.1]);
      this.t0 = performance.now();
    },
    // 값 하나를 시간에 맞춰 옮기는 도우미
    tw(v) { return { from: v, to: v, s: 0, d: 1 }; },
    set(t, v, delay, dur, instant) {
      const now = performance.now();
      t.from = instant ? v : this.val(t, now); t.to = v; t.s = now + (instant ? -1e6 : delay || 0); t.d = dur || 900;
    },
    val(t, now) {
      const k = Math.min(1, Math.max(0, (now - t.s) / t.d)), e = 1 - Math.pow(1 - k, 3);
      if (Array.isArray(t.to)) return t.to.map((v, i) => t.from[i] + (v - t.from[i]) * e);
      return t.from + (t.to - t.from) * e;
    },
    reset() {
      clearTimeout(this.tm1); clearTimeout(this.tm2); clearTimeout(this.tm3);
      this.p.forEach((q) => { this.set(q.gr, 0, 0, 1, true); this.set(q.c, this.col.base, 0, 1, true); this.set(q.al, 1, 0, 1, true); });
      [this.cenA, this.topA, this.gridA].forEach((t) => this.set(t, 0, 0, 1, true));
      this.draw(performance.now());
    },
    // 부록 장은 차례가 하나라서, 그 한 차례에 거르는 네 단계를 차례로 돌린다
    step(sec, k, instant) {
      if (k !== 1) return;
      clearTimeout(this.tm1); clearTimeout(this.tm2); clearTimeout(this.tm3);
      this.stage(1, instant);
      if (instant) { this.stage(2, true); this.stage(3, true); this.stage(4, true); return; }
      this.tm1 = setTimeout(() => this.stage(2, false), 500);
      this.tm2 = setTimeout(() => this.stage(3, false), 1000);
      this.tm3 = setTimeout(() => this.stage(4, false), 1500);
    },
    stage(k, instant) {
      const I = instant;
      if (k === 1) {
        this.set(this.gridA, 1, 0, 700, I);
        this.p.forEach((q) => this.set(q.gr, 1, 50 + (q.x + 160) * 2 + Math.random() * 80, 900, I));
      }
      if (k === 2) this.p.forEach((q) => {
        if (q.st >= 1) this.set(q.c, this.col.pass, 0, 700, I);
        else { this.set(q.c, this.col.ghost, 0, 700, I); this.set(q.al, 0.35, 0, 700, I); }
      });
      if (k === 3) {
        this.p.forEach((q) => {
          if (q.st === 1) { this.set(q.c, this.col.g, 0, 700, I); this.set(q.al, 0.6, 0, 700, I); }
          if (q.st === 2) { this.set(q.c, this.col.g, 500, 700, I); this.set(q.al, 0.8, 500, 700, I); }
          if (q.st === 3) this.set(q.c, this.col.a1, 500, 700, I);
        });
        this.set(this.cenA, 1, 200, 900, I);
      }
      if (k === 4) {
        this.p.forEach((q) => { if (q.top) this.set(q.c, this.col.a, 0, 600, I); });
        this.set(this.topA, 1, 300, 900, I);
      }
    },
    finish() { this.draw(performance.now()); },
    enter() { this.run = true; const f = (now) => { if (!this.run) return; this.draw(now); requestAnimationFrame(f); }; requestAnimationFrame(f); },
    leave() { this.run = false; },
    proj(x, y, z, now) {
      const yaw = -0.32 + Math.sin((now - this.t0) / 9000) * 0.16, pit = 0.62, S = 1.7;
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const X = x * cy - z * sy, Z = x * sy + z * cy;
      const depth = Z * Math.cos(pit) + y * Math.sin(pit);
      const f = 1100 / (1100 - depth * 1.2);
      return [this.W / 2 + 26 + X * S * f, 356 + (Z * Math.sin(pit) - y * Math.cos(pit)) * S * f, depth, Z];
    },
    draw(now) {
      const g = this.g, W = this.W, H = this.H;
      g.clearRect(0, 0, W, H);
      const ga = this.val(this.gridA, now);
      // 바닥과 격자
      if (ga > 0) {
        g.save(); g.globalAlpha = ga;
        g.beginPath(); this.hull.forEach(([x, z], i) => { const [sx, sy] = this.proj(x, 0, z, now); i ? g.lineTo(sx, sy) : g.moveTo(sx, sy); }); g.closePath();
        const grd = g.createLinearGradient(0, 150, 0, 560); grd.addColorStop(0, '#ECEEF2'); grd.addColorStop(1, '#E2E5EA');
        g.fillStyle = grd; g.fill(); g.strokeStyle = '#C9CED5'; g.lineWidth = 1.5; g.stroke();
        g.clip();
        g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 1;
        for (let v = -200; v <= 200; v += 20) {
          g.beginPath(); let [a, b] = this.proj(v, 0, -160, now); g.moveTo(a, b); [a, b] = this.proj(v, 0, 160, now); g.lineTo(a, b); g.stroke();
          g.beginPath(); [a, b] = this.proj(-200, 0, v, now); g.moveTo(a, b); [a, b] = this.proj(200, 0, v, now); g.lineTo(a, b); g.stroke();
        }
        g.restore();
      }
      // 체력인증센터와 2km 원 (2km는 18칸)
      const ca = this.val(this.cenA, now);
      if (ca > 0) {
        g.save();
        this.cen.forEach((c) => {
          g.beginPath();
          for (let i = 0; i <= 48; i++) { const t = i / 48 * Math.PI * 2; const [sx, sy] = this.proj(c.x + Math.cos(t) * 18 * ca, 0, c.z + Math.sin(t) * 18 * ca, now); i ? g.lineTo(sx, sy) : g.moveTo(sx, sy); }
          g.fillStyle = `rgba(74,80,90,${0.06 * ca})`; g.fill();
          g.strokeStyle = `rgba(74,80,90,${0.35 * ca})`; g.lineWidth = 1.2; g.setLineDash([4, 4]); g.stroke(); g.setLineDash([]);
        });
        g.restore();
      }
      // 센터 표시
      if (ca > 0) this.cen.forEach((c) => {
        const [sx, sy] = this.proj(c.x, 0, c.z, now);
        g.beginPath(); g.ellipse(sx, sy, 6, 3.6, 0, 0, Math.PI * 2); g.fillStyle = `rgba(255,255,255,${ca})`; g.fill();
        g.lineWidth = 2.5; g.strokeStyle = `rgba(74,80,90,${ca})`; g.stroke();
      });
      // 기둥: 먼 것부터
      const w = 2.6;
      const list = this.p.map((q) => ({ q, d: this.proj(q.x, 0, q.z, now)[2] })).sort((a, b) => a.d - b.d);
      const yaw = -0.32 + Math.sin((now - this.t0) / 9000) * 0.16, cyw = Math.cos(yaw), syw = Math.sin(yaw);
      const faces = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([nx, nz]) => nx * syw + nz * cyw > 0);
      list.forEach(({ q }) => {
        const gr = this.val(q.gr, now); if (gr <= 0.002) return;
        const h = q.h * gr, c = this.val(q.c, now), al = this.val(q.al, now), ww = q.top ? w * 1.7 : w;
        const P = (dx, y, dz) => this.proj(q.x + dx * ww, y, q.z + dz * ww, now);
        const sh = (m) => `rgba(${Math.round(c[0] * m)},${Math.round(c[1] * m)},${Math.round(c[2] * m)},${al})`;
        faces.forEach(([nx, nz]) => {
          const cs = nx ? [[nx, -1], [nx, 1]] : [[-1, nz], [1, nz]];
          const a = P(cs[0][0], 0, cs[0][1]), b = P(cs[1][0], 0, cs[1][1]), bt = P(cs[1][0], h, cs[1][1]), at = P(cs[0][0], h, cs[0][1]);
          g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(bt[0], bt[1]); g.lineTo(at[0], at[1]); g.closePath();
          g.fillStyle = sh(nx ? 0.78 : 0.9); g.fill();
        });
        const t = [P(-1, h, -1), P(1, h, -1), P(1, h, 1), P(-1, h, 1)];
        g.beginPath(); t.forEach((v, i) => (i ? g.lineTo(v[0], v[1]) : g.moveTo(v[0], v[1]))); g.closePath();
        g.fillStyle = sh(1.06); g.fill();
      });
      // 등촌제3동: 바닥 물결과 이름표
      const ta = this.val(this.topA, now);
      if (ta > 0) {
        const q = this.p.find((v) => v.top);
        const [bx, by] = this.proj(q.x, 0, q.z, now), [tx, ty] = this.proj(q.x, q.h, q.z, now);
        for (let i = 0; i < 3; i++) {
          const ph = ((now / 1800) + i / 3) % 1;
          g.beginPath(); g.ellipse(bx, by, 10 + ph * 46, (10 + ph * 46) * 0.55, 0, 0, Math.PI * 2);
          g.strokeStyle = `rgba(238,107,120,${(1 - ph) * 0.6 * ta})`; g.lineWidth = 2; g.stroke();
        }
        g.save(); g.globalAlpha = ta;
        const lx = tx, ly = ty - 26;
        g.strokeStyle = '#EE6B78'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(tx, ty - 4); g.lineTo(lx, ly); g.stroke();
        g.font = '650 22px "Pretendard Variable", sans-serif'; const tw = g.measureText('등촌제3동').width + 32;
        g.fillStyle = '#fff'; g.strokeStyle = '#EE6B78'; g.lineWidth = 2;
        g.beginPath(); g.roundRect(lx - tw / 2, ly - 44, tw, 42, 10); g.fill(); g.stroke();
        g.fillStyle = '#C8414F'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('등촌제3동', lx, ly - 23);
        g.restore();
      }
    },
  };


  /* ── 16장: 짝 한 쌍이 1주에서 12주까지 줄을 따라 간다 ── */
  S.s16 = {
    build() {
      this.svg = DECK.svg($('s16'));
      const defs = DECK.el(this.svg, 'defs', {});
      const f = DECK.el(defs, 'filter', { id: 'goo-s16', x: 0, y: 0, width: 1920, height: 1080, filterUnits: 'userSpaceOnUse' });
      DECK.el(f, 'feGaussianBlur', { in: 'SourceGraphic', stdDeviation: 7, result: 'b' });
      DECK.el(f, 'feColorMatrix', { in: 'b', mode: 'matrix', values: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9' });
      this.track = DECK.el(this.svg, 'line', { x1: 332, y1: 376, x2: 1588, y2: 376, stroke: C.g3, 'stroke-width': 4, 'stroke-linecap': 'round' });
      this.prog = DECK.el(this.svg, 'line', { x1: 332, y1: 376, x2: 332, y2: 376, stroke: C.g1, 'stroke-width': 4, 'stroke-linecap': 'round' });
      this.marks = [332, 846, 1588].map((x) => DECK.el(this.svg, 'circle', { cx: x, cy: 376, r: 9, fill: '#fff', stroke: C.g1, 'stroke-width': 3 }));
      const g = DECK.el(this.svg, 'g', { filter: 'url(#goo-s16)' });
      this.p = [DECK.el(g, 'circle', { cx: 0, cy: 0, r: 15 }), DECK.el(g, 'circle', { cx: 0, cy: 0, r: 15 })];
      this.t = [];
    },
    at(x, instant, ms) { DECK.pos(this.p[0], x - 13, 376, 0); DECK.pos(this.p[1], x + 13, 376, 0); if (instant) { this.p.forEach((c) => (c.style.transition = 'none')); } },
    reset() {
      this.t.forEach(clearTimeout); this.t = [];
      [this.track, this.prog, ...this.marks].forEach((e) => { e.style.opacity = 0; });
      this.prog.setAttribute('x2', 332);
      this.p.forEach((c) => { c.style.transition = ''; DECK.fill(c, C.ink2, 0); });
      this.at(332);
    },
    step(sec, k, instant) {
      if (k !== 1) return;
      [this.track, ...this.marks].forEach((e) => { e.style.transitionDelay = '0ms'; e.style.opacity = 1; });
      this.prog.style.opacity = 1;
      this.p.forEach((c) => { c.style.transitionDelay = '0ms'; c.style.opacity = 1; });
      if (instant) { this.prog.setAttribute('x2', 1588); this.p.forEach((c) => (c.style.transition = '')); this.at(1588); return; }
      // 줄을 따라 천천히 12주 끝까지
      this.p.forEach((c) => { c.style.transition = 'transform 1.6s cubic-bezier(.45,0,.25,1), opacity .6s'; });
      const t0 = performance.now(), dur = 1600;
      const tick = (now) => { const q = Math.min(1, (now - t0 - 200) / dur); if (q > 0) this.prog.setAttribute('x2', 332 + (1588 - 332) * (q < 0.5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2)); if (q < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
      this.t.push(setTimeout(() => this.at(1588), 200));
      this.t.push(setTimeout(() => { this.prog.setAttribute('x2', 1588); }, 2000));
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
      /* 영상 시간에 맞춰 오른쪽 네 단계를 켠다: 1주 4초, 5주 14초, 9주 30초, 12주 44초 */
      v.addEventListener('timeupdate', () => {
        const c = v.currentTime; const k = c < 14 ? 1 : c < 30 ? 2 : c < 44 ? 3 : 4;
        if (c > 0.1) this.step(0, k);
      });
    },
    reset() { this.cards.forEach((c) => c.classList.remove('cur', 'done')); },
    step(sec, k) {
      this.cards.forEach((c) => {
        const n = +c.dataset.k;
        c.classList.toggle('cur', n === k);
        c.classList.toggle('done', n < k);
      });
    },
    finish() { this.cards.forEach((c) => { c.classList.remove('cur', 'done'); }); if (this.ok) { try { this.v.currentTime = 48; } catch (e) { /* 영상 없음 */ } } },
    enter(sec, playing) {
      if (!this.ok) return;
      try {
        this.v.currentTime = 0;
        if (playing) {
          /* 배경음악을 켠 채 재생하고, 브라우저가 막으면 소리 없이 재생 */
          this.v.muted = false;
          const pr = this.v.play();
          if (pr && pr.catch) pr.catch(() => { this.v.muted = true; this.v.play(); });
        }
      } catch (e) { /* 영상 없음 */ }
    },
    leave() { try { this.v.pause(); } catch (e) { /* 영상 없음 */ } },
  };
})();

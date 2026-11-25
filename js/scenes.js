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
        DECK.pos(c, 72 + rnd() * 1776, 410 + rnd() * 320);
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

  /* ── 3장: 2장의 선홍 점이 부탁할 사람이 없는 쪽 막대로 쌓인다 ── */
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
        DECK.pos(c, 176 + (j % 9) * 33, 842 - Math.floor(j / 9) * 33, Math.floor(rnd() * 500));
      });
    },
    step(sec, k) { if (k === 2) this.d.forEach((c) => { c.style.transitionDelay = '0ms'; c.style.opacity = 0; }); },
    finish() { this.d.forEach((c) => { c.style.opacity = 0; }); },
  };

  /* ── 6장: 계기 26건 점, 혼자 있는 점에 다른 점이 다가와 이어진다 ── */
  S.s6 = {
    build() {
      this.svg = DECK.svg($('s6'));
      this.d = DECK.dots(this.svg, 26, 28);
    },
    reset() {
      this.d.forEach((c, i) => {
        DECK.pos(c, 140 + (i % 13) * 76, 540 + Math.floor(i / 13) * 80);
        DECK.fill(c, i < 11 ? C.a : i < 16 ? C.a2 : C.g2, 0);
      });
    },
    step(sec, k, instant) {
      if (k === 2) this.d.forEach((c, i) => { c.style.transitionDelay = (instant ? 0 : i * 45) + 'ms'; c.style.opacity = 1; });
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
      const box = $('s9-weeks');
      const x0 = 260, w = 122, gap = 10.6;
      let html = '';
      for (let i = 0; i < 12; i++) {
        const x = x0 + i * (w + gap);
        const s = i < 4 ? 1 : 2;
        const d = i < 4 ? i * 120 : (i - 4) * 160;
        const lead = i < 4 ? 'background:var(--g2)' : i < 8 ? 'background:repeating-linear-gradient(135deg,var(--g3) 0 10px,#fff 10px 20px);border:2px solid var(--g2)' : 'border:2px dashed var(--g1)';
        const pair = i < 4 ? 'var(--a2)' : i < 8 ? 'var(--a1)' : 'var(--a)';
        html += `<div class="ab mut" data-s="${s}" style="left:${x}px;top:290px;width:${w}px;text-align:center;font-size:19px;transition-delay:${d}ms">${i + 1}주</div>`;
        html += `<div class="ab" data-s="${s}" style="left:${x}px;top:326px;width:${w}px;height:160px;border-radius:12px;${lead};transition-delay:${d}ms"></div>`;
        html += `<div class="ab" data-s="${s}" style="left:${x}px;top:504px;width:${w}px;height:160px;border-radius:12px;background:${pair};transition-delay:${d + 80}ms"></div>`;
      }
      box.innerHTML = html;
      const ph = $('s9-phase');
      ph.style.left = x0 + 'px'; ph.style.width = (1848 - x0) + 'px';
      const card = (s, d, t, b, a) => `<div class="card${a ? ' tint' : ''}" data-s="${s}" style="position:relative;flex:1;height:166px;transition-delay:${d}ms;${a ? 'border-color:var(--a2)' : ''}"><div style="font-size:22px;font-weight:600;color:${a ? 'var(--at)' : 'var(--mut)'}">${t}</div><div style="font-size:28px;font-weight:600;color:${a ? 'var(--at)' : 'var(--ink)'};margin-top:10px;line-height:1.4">${b}</div></div>`;
      ph.innerHTML =
        card(1, 0, '1~4주', '지도자가 집으로 찾아가 데리고 나온다. 매번 같이 한다', false) +
        card(2, 200, '5~8주', '지도자는 한 번씩 빠진다', false) +
        card(2, 800, '9~12주', '짝끼리 한다', true);
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
  S.s13 = {};

  /* ── 14장: 동 427개를 세 기준으로 거른다 ── */
  /* 14장: 서울 427개 동을 입체 기둥으로. 높이는 혼자 사는 수급 노인 수. 시점이 천천히 돈다 */
  S.s14 = {
    build() {
      const D = window.S14DATA;
      this.cv = $('s14-cv'); this.g = this.cv.getContext('2d');
      this.W = 1128; this.H = 590; this.g.setTransform(2, 0, 0, 2, 0, 0);
      const mx = D.d.reduce((a, r) => a + r[0], 0) / D.d.length, mz = D.d.reduce((a, r) => a + r[1], 0) / D.d.length;
      this.mx = mx; this.mz = mz;
      const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
      this.col = { base: hex('#C9CED5'), ghost: hex('#E3E6EA'), pass: hex('#F8C4C9'), g: hex('#AEB5BF'), a1: hex('#F39AA3'), a: hex('#EE6B78') };
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
      this.p.forEach((q) => { this.set(q.gr, 0, 0, 1, true); this.set(q.c, this.col.base, 0, 1, true); this.set(q.al, 1, 0, 1, true); });
      [this.cenA, this.topA, this.gridA].forEach((t) => this.set(t, 0, 0, 1, true));
      this.draw(performance.now());
    },
    step(sec, k, instant) {
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
      const yaw = -0.32 + Math.sin((now - this.t0) / 9000) * 0.16, pit = 0.62, S = 2.35;
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const X = x * cy - z * sy, Z = x * sy + z * cy;
      const depth = Z * Math.cos(pit) + y * Math.sin(pit);
      const f = 1100 / (1100 - depth * 1.2);
      return [this.W / 2 + 10 + X * S * f, 360 + (Z * Math.sin(pit) - y * Math.cos(pit)) * S * f, depth, Z];
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

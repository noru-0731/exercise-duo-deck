/* 장면 엔진: 장을 넘기면 그 장의 차례가 나레이션 길이에 맞춰 저절로 나온다 */
(function () {
  const RATE = 5;          // 1초에 읽는 글자 수 (1분에 300자)
  const LEAD_IN = 200;     // 장을 넘기고 첫 차례까지
  const params = new URLSearchParams(location.search);
  const FINAL = params.has('final');
  const NARR = params.has('narr');   // 기본은 장을 넘기면 움직임이 짧은 간격으로 주르륵. ?narr 는 나레이션 속도
  const GAP = 300;                   // 기본 방식에서 차례 사이 간격(ms). 모든 장이 같은 간격
  const SPEED = parseFloat(params.get('speed') || '1');

  window.DECK = { scenes: {}, FINAL };
  let timers = [];
  let prevIndex = -1;

  function stepTimes(sec) {
    const ps = [...sec.querySelectorAll('aside.notes p')];
    const out = [];
    let acc = 0;
    ps.forEach((p) => {
      out.push(acc);
      acc += p.textContent.replace(/\s/g, '').replace(/^\d+\./, '').length / RATE * 1000;
    });
    return { times: out, total: acc };
  }

  function fmt(v, dec) {
    return v.toLocaleString('ko-KR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }
  function countUp(el, instant) {
    const to = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.dec || '0', 10);
    const suf = el.dataset.suf || '';
    if (instant) { el.textContent = fmt(to, dec) + suf; return; }
    const t0 = performance.now();
    const dur = 1200;
    (function tick(now) {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e, dec) + suf;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  function activate(sec, k, instant) {
    sec.querySelectorAll(`[data-s="${k}"]`).forEach((e) => {
      e.classList.add('on');
      const cs = e.matches('.cnt') ? [e] : [...e.querySelectorAll('.cnt')];
      cs.forEach((c) => countUp(c, instant));
    });
    sec.querySelectorAll(`[data-out="${k}"]`).forEach((e) => e.classList.add('off'));
    sec.querySelectorAll(`[data-dim="${k}"]`).forEach((e) => e.classList.add('dim'));
    const sc = DECK.scenes[sec.id];
    if (sc && sc.step) sc.step(sec, k, instant);
  }

  function resetSec(sec) {
    sec.querySelectorAll('[data-s]').forEach((e) => e.classList.remove('on'));
    sec.querySelectorAll('[data-out]').forEach((e) => e.classList.remove('off'));
    sec.querySelectorAll('[data-dim]').forEach((e) => e.classList.remove('dim'));
    const sc = DECK.scenes[sec.id];
    if (sc && sc.reset) sc.reset(sec);
  }

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  // 화면이 가려져 그리기 신호(requestAnimationFrame)가 오지 않아도 멈추지 않게 시간으로도 넘긴다
  function afterPaint(fn) {
    let done = false;
    const run = () => { if (done) return; done = true; fn(); };
    requestAnimationFrame(() => requestAnimationFrame(run));
    setTimeout(run, 80);
  }

  function showFinal(sec) {
    sec.classList.add('final');
    resetSec(sec);
    const n = sec.querySelectorAll('aside.notes p').length;
    for (let k = 1; k <= n; k++) activate(sec, k, true);
    const sc = DECK.scenes[sec.id];
    if (sc && sc.finish) sc.finish(sec);
    void sec.offsetWidth;
    afterPaint(() => sec.classList.remove('final'));
  }

  function play(sec) {
    sec.classList.add('final');
    resetSec(sec);
    void sec.offsetWidth;
    let { times } = stepTimes(sec);
    if (!NARR) { times = times.map((_, i) => i * GAP); }
    afterPaint(() => {
      sec.classList.remove('final');
      const sc = DECK.scenes[sec.id];
      if (sc && sc.start) sc.start(sec);
      times.forEach((t, i) => {
        timers.push(setTimeout(() => activate(sec, i + 1, false), (t + LEAD_IN) / SPEED));
      });
    });
  }

  function leave(sec) {
    if (!sec) return;
    const sc = DECK.scenes[sec.id];
    if (sc && sc.leave) sc.leave(sec);
  }

  function onSlide(ev) {
    clearTimers();
    leave(ev.previousSlide);
    const sec = ev.currentSlide;
    const idx = ev.indexh;
    const forward = idx > prevIndex;
    prevIndex = idx;
    if (FINAL || !forward) showFinal(sec); else play(sec);
    const sc = DECK.scenes[sec.id];
    if (sc && sc.enter) sc.enter(sec, forward && !FINAL);
  }

  // 장 번호 채우기
  function numberSlides() {
    const main = [...document.querySelectorAll('.reveal .slides > section')];
    let n = 0;
    const total = main.filter((s) => !s.classList.contains('apx')).length;
    main.forEach((s) => {
      if (s.classList.contains('apx')) return;
      n += 1;
      const no = s.querySelector('.hd .no');
      if (!no) return;
      no.innerHTML = `<span style="color:var(--ink);font-weight:600">${String(n).padStart(2, "0")}</span> / ${total}`;
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    numberSlides();
    Object.values(DECK.scenes).forEach((sc) => sc.build && sc.build());
    Reveal.initialize({
      width: 1920, height: 1080, margin: 0, minScale: 0.1, maxScale: 3,
      center: false, hash: true, controls: false, progress: false,
      transition: 'fade', transitionSpeed: 'fast', backgroundTransition: 'none',
      fragments: false, slideNumber: false, pdfMaxPagesPerSlide: 1,
      plugins: window.RevealNotes ? [RevealNotes] : [],
    });
    let started = false;
    const first = () => {
      if (started) return; started = true;
      const sec = Reveal.getCurrentSlide();
      if (sec) onSlide({ currentSlide: sec, indexh: Reveal.getIndices().h, previousSlide: null });
    };
    Reveal.on('ready', first);
    if (Reveal.isReady && Reveal.isReady()) first();
    setTimeout(() => { if (!started && Reveal.isReady && Reveal.isReady()) first(); }, 1500);
    // 가려진 채 열렸다가 보이게 되면, 지금 장을 처음부터 다시 돌린다
    let shownOnce = document.visibilityState === 'visible';
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible' || shownOnce) return;
      shownOnce = true;
      const sec = Reveal.getCurrentSlide();
      if (!sec) return;
      clearTimers(); if (FINAL) showFinal(sec); else play(sec);
      const sc = DECK.scenes[sec.id]; if (sc && sc.enter) sc.enter(sec, !FINAL);
    });
    Reveal.on('slidechanged', onSlide);
    // 발표 중 지금 장을 끝 모습으로: E 키
    Reveal.addKeyBinding({ keyCode: 69, key: 'E', description: '지금 장을 끝 모습으로' }, () => {
      clearTimers(); showFinal(Reveal.getCurrentSlide());
    });
    // 지금 장을 처음부터 다시: R 키
    Reveal.addKeyBinding({ keyCode: 82, key: 'R', description: '지금 장을 처음부터 다시' }, () => {
      clearTimers(); const s = Reveal.getCurrentSlide(); play(s);
      const sc = DECK.scenes[s.id]; if (sc && sc.enter) sc.enter(s, true);
    });
  });

  /* 점 도우미 */
  const NS = 'http://www.w3.org/2000/svg';
  DECK.rng = function (seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  DECK.svg = function (sec, cls) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('class', 'dots ' + (cls || ''));
    s.setAttribute('viewBox', '0 0 1920 1080');
    s.setAttribute('width', '1920'); s.setAttribute('height', '1080');
    s.style.left = '0'; s.style.top = '0'; s.style.pointerEvents = 'none';
    const band = sec.querySelector('.band');
    if (band) sec.insertBefore(s, band); else sec.appendChild(s);
    return s;
  };
  DECK.el = function (parent, tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    parent.appendChild(e);
    return e;
  };
  DECK.dots = function (svg, n, r) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      const c = DECK.el(svg, 'circle', { cx: 0, cy: 0, r: r });
      arr.push(c);
    }
    return arr;
  };
  DECK.pos = function (c, x, y, delay) {
    c.style.transitionDelay = delay ? delay + 'ms' : '0ms';
    c.style.transform = `translate(${x}px, ${y}px)`;
    c._x = x; c._y = y;
  };
  DECK.fill = function (c, col, op) {
    c.style.fill = col;
    if (op !== undefined) c.style.opacity = op;
  };
  DECK.C = {
    a: '#EE6B78', a1: '#F39AA3', a2: '#F8C4C9', a3: '#FCE3E5',
    ink: '#2B2F36', ink2: '#4A505A', g1: '#9AA1AB', g2: '#C9CED5', g3: '#E3E6EA',
  };
})();

/* =====================================================================================
   RENDERER — 2D SVG fallback (same data, same playback)
   ===================================================================================== */
function createSVG() {
  const svg = $('#svg2d'), NS = 'http://www.w3.org/2000/svg'; svg.removeAttribute('hidden'); $('#gl').hidden = true; $('#nogl').hidden = false; $('#labels').hidden = true;
  const HOME = { x: -47, y: -73, w: 78, h: 114 }; let vb = { ...HOME }, lens = 'data', rv = [];
  const setVB = () => svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`); setVB();
  const M = p => [p[0], p[1] > 18 ? p[2] * .9 - 62 : p[1] > 5 ? p[2] * .9 - 44 : p[2]];   /* ops plane is drawn as a band above the ground map */
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); (parent || svg).appendChild(e); return e; };
  const gZ = mk('g'), gL = mk('g'), gLL = mk('g'), gFoc = mk('g'), gS = mk('g'), gT = mk('g'), gR = mk('g'), gN = mk('g'), gF = mk('g'); let fxs = [], follow = false, diagram = false, focusSet = null, selected = null;
  for (const z of DATA.zones) { const a = M([z.x[0], z.y, z.z[0]]), b = M([z.x[1], z.y, z.z[1]]); const k = z.id === 'splunk' ? ' spk' : ''; mk('rect', { class: 'zone' + k, x: a[0], y: a[1], width: b[0] - a[0], height: b[1] - a[1], rx: .8 }, gZ); mk('text', { class: 'zn' + k, x: a[0] + .5, y: a[1] - .5 }, gZ).textContent = z.label; }
  for (const l of DATA.links) { if (l[4] === 'suite' || isIngest(l)) continue; const a = M(POS(l[0])), b = M(POS(l[1])); mk('line', { class: 'lk' + (isSp(l[0]) || isSp(l[1]) ? ' spk' : ''), 'data-a': l[0], 'data-b': l[1], x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, gL); }
  /* the same stub as the 3D view: the operations band up to the Splunk band, not a line out of one product */
  { const A = M([PR.splunk.p[0], 14.4, PR.splunk.p[2]]), B = M([PR.splunk.p[0], 21.4, PR.splunk.p[2]]); mk('line', { class: 'lk rise spk', x1: A[0], y1: A[1], x2: B[0], y2: B[1] }, gL); }
  const SH = { net: '0,-1 .87,-.5 .87,.5 0,1 -.87,.5 -.87,-.5', id: '0,-1.1 1.1,0 0,1.1 -1.1,0', netsec: '-.9,-.9 .9,-.9 .9,.9 -.9,.9', cloud: '0,-1.1 1.05,-.35 .65,.9 -.65,.9 -1.05,-.35',
    endpoint: '-.6,-1 .6,-1 .9,0 .6,1 -.6,1 -.9,0', detect: '0,-1.1 .78,-.78 1.1,0 .78,.78 0,1.1 -.78,.78 -1.1,0 -.78,-.78', ot: '-.5,-1 .5,-1 1,1 -1,1', suite: '-1.1,-.6 1.1,-.6 1.1,.6 -1.1,.6', splunk: '0,-1.15 1.1,.85 -1.1,.85' };
  const nodes = {};
  for (const id of NODE_IDS) {
    const p = PR[id] || PL[id], isP = !!PR[id], [x, y] = M(p.p);
    const g = mk('g', { class: 'n' + (isP ? '' : ' place') + (isSp(id) ? ' spk' : ''), transform: `translate(${x} ${y})`, tabindex: 0, role: 'button', 'aria-label': p.name + '. ' + p.fn, 'data-id': id }, gN);
    mk('circle', { r: 1.8, fill: 'transparent' }, g);   /* generous hit area */
    if (isP) mk('polygon', { class: 'sh', points: SH[p.cat] }, g); else mk(p.kind === 'loc' ? 'rect' : 'circle', p.kind === 'loc' ? { class: 'sh', x: -.9, y: -.7, width: 1.8, height: 1.4, rx: .3 } : { class: 'sh', r: .8 }, g);
    const ring = isP ? mk('circle', { class: 'mk', r: 1.6, visibility: 'hidden' }, g) : null, dia = isP ? mk('polygon', { class: 'mk', points: '0,-2.6 .6,-2 0,-1.4 -.6,-2', visibility: 'hidden' }, g) : null;
    mk('text', { class: isP ? '' : 'pl', y: 2.3 }, g).textContent = isP ? p.s : p.name;
    nodes[id] = { g, ring, dia, p, isP };
  }
  function drawExact(pairs, parent) { pairs.forEach(l => { const A = M(POS(l[0])), B = M(POS(l[1])); mk('line', { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: '#fff', 'stroke-width': .12, 'stroke-opacity': .9 }, parent); }); }
  function syncGroups() { const hide = diagram || !!focusSet; gL.style.display = gLL.style.display = hide ? 'none' : ''; }
  function paintSelect() {
    gS.innerHTML = ''; const overview = !diagram && !focusSet;
    const product = !!(selected && PR[selected]);
    gL.classList.toggle('dim', overview && product); gLL.classList.toggle('dim', overview && product);
    if (!(overview && selected && PR[selected])) return;
    const layerOn = !svg.classList.contains('nosp');
    drawExact(DATA.links.filter(l => (l[0] === selected || l[1] === selected) && (layerOn || (!isSp(l[0]) && !isSp(l[1])))), gS);
  }
  function setLens(l) {
    lens = l; gLL.innerHTML = '';
    for (const id in nodes) { const n = nodes[id]; if (!n.isP) continue; n.g.classList.toggle('on', !!n.p.roles[l]);
      n.ring.setAttribute('visibility', ringOn(n.p, l) ? 'visible' : 'hidden'); n.ring.style.stroke = LENS[l].color; n.dia.setAttribute('visibility', l === 'policy' && (n.p.pol || []).includes('author') ? 'visible' : 'hidden'); }
    const bright = new Set(brightLinks(l).map(p => pairKey(p[0], p[1])));
    gL.querySelectorAll('line[data-a]').forEach(el => el.classList.toggle('hid', bright.has(pairKey(el.dataset.a, el.dataset.b))));
    for (const [a, b] of brightLinks(l)) { const A = M(POS(a)), B = M(POS(b)); mk('line', { class: 'lk on', x1: A[0], y1: A[1], x2: B[0], y2: B[1], 'stroke-dasharray': l === 'policy' || l === 'threat' ? '.5 .4' : '' }, gLL); }
    paintSelect();
  }
  function setRuns(runs) {
    gR.innerHTML = ''; rv = [];
    for (const r of runs) {
      const off = r.slot * .5, pts = [M(actorPos(r, r.slot)), ...r.path.map(n => M(POS(n)))].map(p => [p[0] + off, p[1] + off]);
      mk('polyline', { points: pts.map(p => p.join(',')).join(' '), fill: 'none', stroke: r.hostile ? '#ff7a6b' : '#8fa3c8', 'stroke-opacity': .4, 'stroke-width': .12, 'stroke-dasharray': r.hostile ? '.6 .5' : '' }, gR);
      const line = mk('polyline', { fill: 'none', 'stroke-width': .32, 'stroke-linejoin': 'round', 'stroke-dasharray': r.hostile ? '.9 .6' : '' }, gR);
      const beams = r.tl.map(e => { const srcs = e.beams ? e.beams : e.from && PR[e.from] ? [e.from] : e.hop && e.hop !== e.at ? [e.hop] : []; const t = M(POS(e.at));
        return srcs.map(sId => { const a = M(POS(sId)); return mk('line', { x1: a[0], y1: a[1], x2: t[0], y2: t[1], stroke: LENS[e.lens].color, 'stroke-width': .1, opacity: 0 }, gR); }); });
      mk('circle', { cx: pts[0][0], cy: pts[0][1], r: .9, fill: r.hostile ? '#ff6a5c' : r.slot ? '#ffd9a8' : '#e6ecfa' }, gR);
      const head = r.hostile ? mk('polygon', { points: '0,-.9 .8,.6 -.8,.6' }, gR) : mk('circle', { r: .6 }, gR);
      const chip = mk('text', { 'font-size': 1.1 }, gR), role = roleOf(r.s, S.preset, r.slot), at = r.stopAt >= 0 ? pts[r.stopAt + 1] : r.verdict === 'CONTAIN' ? pts[1] : pts[pts.length - 1];
      const vcol = { ALLOW: '#5be3a4', LIMIT: '#8ed0ff', STEPUP: '#f4c95d', BLOCK: '#ff7a6b', CONTAIN: '#ff5fa2' }[r.verdict];
      const mkr = mk('g', { transform: `translate(${at[0]} ${at[1]})`, visibility: 'hidden', stroke: vcol, 'stroke-width': .3, fill: 'none' }, gR);
      if (r.verdict === 'BLOCK') mk('path', { d: 'M-1.2-1.2 1.2 1.2M1.2-1.2-1.2 1.2' }, mkr); else if (r.verdict === 'CONTAIN') mk('rect', { x: -1.7, y: -1.7, width: 3.4, height: 3.4, 'stroke-dasharray': '.5 .3' }, mkr);
      else if (r.verdict === 'STEPUP') mk('path', { d: 'M0-1.6 1.5 1.1H-1.5z' }, mkr); else if (r.verdict === 'LIMIT') mk('path', { d: 'M-1.5 0A1.5 1.5 0 1 1 0 1.5' }, mkr);
      rv.push({ r, pts, line, beams, head, chip, mkr, name: role.label });
    }
  }
  function frame() {
    for (const v of rv) {
      const P = prog(v.r), full = Math.floor(P.moves), fr = P.moves - full, pts = v.pts.slice(0, full + 1);
      if (fr > 0 && v.pts[full + 1]) { const a = v.pts[full], b = v.pts[full + 1]; pts.push([a[0] + (b[0] - a[0]) * fr, a[1] + (b[1] - a[1]) * fr]); }
      const hd = pts[pts.length - 1], t = P.k >= 0 ? v.r.tl[P.k].trust : v.r.series[0].v;
      const col = lens === 'trust' ? trustColor(t) : v.r.hostile ? '#ff7a6b' : v.r.slot ? '#ffd9a8' : LENS[lens].color;
      v.line.setAttribute('points', pts.map(p => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' ')); v.line.setAttribute('stroke', col);
      v.head.setAttribute('transform', `translate(${hd[0].toFixed(2)} ${hd[1].toFixed(2)})`); v.head.setAttribute('fill', '#fff');
      v.chip.setAttribute('x', hd[0]); v.chip.setAttribute('y', hd[1] - 1.3); v.chip.textContent = v.name + ' · trust ' + t; v.chip.style.fill = trustColor(t);
      v.beams.forEach((bs, k) => bs.forEach(b => b.setAttribute('opacity', k === P.cur ? 1 : k <= P.k ? .3 : 0)));
      v.mkr.setAttribute('visibility', P.done ? 'visible' : 'hidden'); v.hd = hd;
    }
    /* follow view in 2D: keep the actor centred and zoomed in */
    if (follow && rv[0] && rv[0].hd) { const w = 36, hh = w * HOME.h / HOME.w; vb = { x: rv[0].hd[0] - w / 2, y: rv[0].hd[1] - hh / 2, w, h: hh }; setVB(); }
    /* simple effects: expanding rings and rising text */
    const now = performance.now();
    fxs = fxs.filter(e => { const k = (now - e.t0) / e.d; if (k < 0) return true; if (k >= 1) { e.el.remove(); return false; }
      if (e.txt) { e.el.setAttribute('y', e.y - k * 3.5); e.el.setAttribute('opacity', 1 - k * k); } else { e.el.setAttribute('r', .5 + (e.r1 - .5) * (1 - Math.pow(1 - k, 3))); e.el.setAttribute('opacity', 1 - k); } return true; });
  }
  function fx(type, o) {
    const now = performance.now(), ring = (p, col, r1, d, delay = 0) => fxs.push({ el: mk('circle', { cx: p[0], cy: p[1], r: .5, fill: 'none', stroke: col, 'stroke-width': .2, opacity: 0 }, gF), t0: now + delay, d, r1 });
    const text = (p, s, col) => { const el = mk('text', { x: p[0], y: p[1], 'font-size': 1.4, 'font-weight': 800 }, gF); el.textContent = s; el.style.fill = col; fxs.push({ el, txt: true, t0: now, d: 1400, y: p[1] - 1.5 }); };
    if (type === 'trust') { const v = rv.find(x => x.r.slot === o.slot); if (v && v.hd) text([v.hd[0], v.hd[1] - 1.5], o.text, o.color); return; }
    const p = M(POS(o.id)), col = o.color || '#fff';
    if (type === 'hop') ring(p, col, 2, 450); else if (type === 'check') ring(p, col, 3, 650); else if (type === 'select') ring(p, '#fff', 2.6, 500);
    else if (type === 'detect') [0, 150, 300].forEach(d => ring(p, col, 4.6, 800, d)); else if (type === 'pop') text(p, o.text, col);
    else if (type === 'verdict') [0, 180, 360].forEach(d => ring(p, VCOL[o.v], o.v === 'ALLOW' ? 8 : 6, 1000, d));
  }
  function nudge(kind, a, b) {   /* keyboard pan and zoom; a flat map has no rotation */
    if (kind === 'rot') return false; follow = false;
    if (kind === 'zoom') { const w = clamp(vb.w / a, 14, 160), hh = w * vb.h / vb.w; vb.x += (vb.w - w) / 2; vb.y += (vb.h - hh) / 2; vb.w = w; vb.h = hh; } else { const k = vb.w * .06; vb.x += a * k; vb.y -= b * k; }
    setVB(); return true;
  }
  /* pan / zoom / pinch on the viewBox */
  const ptrs = new Map(); let pd = 0, moved = 0;
  const scale = () => vb.w / svg.clientWidth;
  svg.addEventListener('wheel', e => { e.preventDefault(); const k = e.deltaY > 0 ? 1.12 : .89, b = svg.getBoundingClientRect(), fx = (e.clientX - b.left) / b.width, fy = (e.clientY - b.top) / b.height;
    const w = clamp(vb.w * k, 14, 160), hh = w * vb.h / vb.w; vb.x += (vb.w - w) * fx; vb.y += (vb.h - hh) * fy; vb.w = w; vb.h = hh; setVB(); }, { passive: false });
  svg.addEventListener('pointerdown', e => { ptrs.set(e.pointerId, [e.clientX, e.clientY]); moved = 0; if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pd = Math.hypot(a[0] - b[0], a[1] - b[1]); } });
  svg.addEventListener('pointermove', e => {
    const n = e.target.closest?.('.n'); if (!ptrs.size) { const b = $('#stage').getBoundingClientRect(); return tip(n ? n.dataset.id : null, e.clientX - b.left, e.clientY - b.top); }
    const prev = ptrs.get(e.pointerId); if (!prev) return; ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptrs.size === 1) { const s = scale(); vb.x -= (e.clientX - prev[0]) * s; vb.y -= (e.clientY - prev[1]) * s; moved += Math.abs(e.clientX - prev[0]) + Math.abs(e.clientY - prev[1]); setVB(); }
    else if (ptrs.size === 2) { const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]), k = clamp(pd / d, .8, 1.25), w = clamp(vb.w * k, 14, 160), hh = w * vb.h / vb.w; vb.x += (vb.w - w) / 2; vb.y += (vb.h - hh) / 2; vb.w = w; vb.h = hh; pd = d; moved = 99; setVB(); }
  });
  const up = e => { ptrs.delete(e.pointerId); }; svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up); svg.addEventListener('pointerleave', e => { up(e); tip(null); });
  svg.addEventListener('click', e => { if (moved > 6) return; const n = e.target.closest('.n'); window.__select(n ? n.dataset.id : null, false); });
  svg.addEventListener('keydown', e => { const n = e.target.closest('.n'); if (n && e.key === 'Enter') window.__select(n.dataset.id, false); });
  svg.addEventListener('focusin', e => { const n = e.target.closest('.n'); if (n) { const b = n.getBoundingClientRect(), s = $('#stage').getBoundingClientRect(); tip(n.dataset.id, b.left - s.left, b.bottom - s.top); } });
  svg.addEventListener('focusout', () => tip(null));
  function setTopo(t) {
    const was = diagram; diagram = topoLayout(t);   /* an architecture is redrawn as a diagram, like the 3D view */
    gF.innerHTML = ''; fxs = [];
    for (const id in nodes) { const p = M(POS(id)); nodes[id].g.setAttribute('transform', `translate(${p[0]} ${p[1]})`); nodes[id].g.style.display = diagram && !t.nodes.has(id) ? 'none' : ''; }
    gZ.style.display = diagram ? 'none' : '';
    if (diagram) { const w = 50, hh = w * HOME.h / HOME.w; vb = { x: -w / 2, y: -hh / 2, w, h: hh }; setVB(); } else if (was) { vb = { ...HOME }; setVB(); }
    gT.innerHTML = ''; syncGroups(); paintSelect(); if (!t) return;
    t.links.forEach((l, i) => { const a = M(POS(l[0])), b = M(POS(l[1])); mk('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#fff', 'stroke-width': .1, 'stroke-opacity': .85 }, gT);
      if (t.links.length <= 30) { const x = (a[0] + b[0]) / 2, y = (a[1] + b[1]) / 2; mk('circle', { cx: x, cy: y, r: .75, fill: '#0a1020', stroke: '#fff', 'stroke-width': .08 }, gT); mk('text', { x, y: y + .35, 'font-size': .9 }, gT).textContent = i + 1; } });
  }
  function setFocus(f) {
    focusSet = diagram ? null : f; gFoc.innerHTML = ''; syncGroups();
    if (focusSet) drawExact(focusSet.links, gFoc);
    paintSelect();
  }
  return { kind: 'svg', fx, nudge, setLens, setRuns, setTopo, setFocus, frame, setView(m) { follow = m !== 'orbit'; if (!follow) { vb = { ...HOME }; setVB(); } }, setLayer(on) { svg.classList.toggle('nosp', !on); paintSelect(); },
    focus(id) { const [x, y] = M(POS(id)); vb = { x: x - 18, y: y - 18 * HOME.h / HOME.w, w: 36, h: 36 * HOME.h / HOME.w }; setVB(); },
    setFilter(f) { for (const k in nodes) nodes[k].g.classList.toggle('filtered', !!f && !f.has(k)); },
    select(id) { selected = id; for (const k in nodes) nodes[k].g.classList.toggle('sel', k === id); paintSelect(); },
    resetView() { vb = { ...HOME }; setVB(); } };
}

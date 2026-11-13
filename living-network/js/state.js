/* =====================================================================================
   STATE
   ===================================================================================== */
const RM = matchMedia('(prefers-reduced-motion: reduce)');
/* industry use cases (js/portfolio.js): by code, and industry names by id */
const UC = Object.fromEntries(PORTFOLIO.uc.map(u => [u.code, u])), INDN = Object.fromEntries(PORTFOLIO.industries.map(i => [i.id, i.name]));
const fromPreset = a => normalize({ who: a[0], device: a[1], loc: a[2], dest: a[3], beh: a[4] }).s;
const S = {
  mode: 'presets', lens: 'data', split: true, splunk: true,
  view: (() => { try { const v = localStorage.getItem('ln-view'); return v === 'orbit' || v === 'third' ? v : 'third'; } catch (e) { return 'third'; } })(),   /* 3rd person by default; a remembered 1st person opens as 3rd */ arch: 'sase', preset: 1, compare: false, active: 0, off: [], speed: .5, playing: false,
  autoplay: (() => { try { return localStorage.getItem('ln-autoplay') === '1'; } catch (e) { return false; } })(),
  slots: [fromPreset(DATA.presets[0].s), fromPreset(DATA.presets[5].s)],
  runs: [], selected: null, notes: [], filter: null,
  /* Industries mode: ind = industry, uc = open use case, ucProd = list only use cases naming this product,
     ctx = use case a scenario or topology was opened from, pind = industry filter on the preset library */
  ind: PORTFOLIO.industries[0].id, uc: null, ucProd: null, ctx: null, pind: null
};
/* the open use case as the renderers need it: its scene products and the stated relationships among them */
function ucFocus() {
  const u = S.mode === 'ind' && UC[S.uc]; if (!u) return null;
  const nodes = new Set(u.prods.filter(k => S.splunk || PR[k].cat !== 'splunk'));
  return { u, nodes, links: DATA.links.filter(l => l[4] !== 'suite' && nodes.has(l[0]) && nodes.has(l[1])) };
}
let R = null;   /* renderer */

function rerun() {
  S.notes = [];
  if (S.mode === 'explore' || S.mode === 'topo' || S.mode === 'ind') S.runs = [];
  else S.runs = (S.compare ? [0, 1] : [S.active]).map(i => {
    const r = evaluate(S.slots[i], S.off); r.slot = i; r.base = S.off.length ? evaluate(S.slots[i], null) : null;
    r.steps = buildSteps(r); r.pb = { i: 0, p: 0, done: false }; r.sug = suggestions(r.s, r); return r;
  });
  if (S.off.length && !S.runs.length) S.off = [];
  document.body.dataset.cmp = S.runs.length > 1 ? '1' : '0';
  S.topo = S.mode === 'topo' ? topoOf(S.arch) : null; S.focus = ucFocus(); R.setLayer(S.splunk); R.setSplit && R.setSplit(S.split); R.setTopo(S.topo); R.setFocus && R.setFocus(S.focus); if (S.runs.length) SND.play("start"); R.setRuns(S.runs); R.setFilter(S.topo ? S.topo.nodes : S.filter || (S.focus && S.focus.nodes)); renderResults(); S.playing = S.autoplay && S.runs.length > 0; lastSig = ''; writeHash();
}
/* playback */
const DUR = { move: 620, check: 1250, end: 1 };
function advance(dt) {
  let all = true;
  for (const r of S.runs) {
    const pb = r.pb; let budget = dt * S.speed;
    while (!pb.done && budget > 0) {
      const st = r.steps[pb.i]; let dur = DUR[st.t]; if (RM.matches && st.t === 'move') dur = 1;
      const need = (1 - pb.p) * dur;
      if (budget >= need) { budget -= need; pb.p = 0; if (st.t === 'end') pb.done = true; else pb.i++; }
      else { pb.p += budget / dur; budget = 0; }
    }
    if (!pb.done) all = false;
  }
  if (all) S.playing = false;
}
function stepOnce() {
  S.playing = false;
  for (const r of S.runs) { const pb = r.pb; if (pb.done) continue; let i = pb.i + 1; while (r.steps[i].t === 'move') i++; pb.i = i; pb.p = 0; if (r.steps[i].t === 'end') pb.done = true; }
}
function restart() { S.runs.forEach(r => r.pb = { i: 0, p: 0, done: false }); S.playing = S.runs.length > 0; }
function finish() { S.runs.forEach(r => r.pb = { i: r.steps.length - 1, p: 0, done: true }); S.playing = false; }
/* how far a run has progressed: moves = path edges travelled (fractional), k = last checkpoint reached, cur = checkpoint being shown */
function prog(r) {
  const pb = r.pb, key = pb.i * 4 + pb.p + (pb.done ? 2 : 0); if (r._pk === key && r._ps === r.steps) return r._pv;
  let moves = 0, k = -1, cur = -1;
  for (let i = 0; i <= pb.i && i < r.steps.length; i++) {
    const st = r.steps[i], full = i < pb.i || pb.done;
    if (st.t === 'move') moves += full ? 1 : pb.p;
    if (st.t === 'check') { k = st.k; if (!full) cur = st.k; }
  }
  r._pk = key; r._ps = r.steps; return r._pv = { moves, k, cur, done: pb.done };
}

/* =====================================================================================
   URL HASH
   ===================================================================================== */
function writeHash() {
  const q = new URLSearchParams({ mode: S.mode, lens: S.lens, a: skey(S.slots[0]) });
  if (S.compare) { q.set('b', skey(S.slots[1])); q.set('cmp', '1'); }
  if (S.off.length) q.set('off', S.off.join(','));
  if (S.mode === 'presets' && S.preset) q.set('p', S.preset);
  if (S.mode === 'topo') q.set('arch', S.arch);
  if (S.mode === 'ind') { q.set('ind', S.ind); if (S.uc) q.set('uc', S.uc); if (S.ucProd) q.set('ucp', S.ucProd); }
  else if (S.ctx) q.set('ctx', S.ctx);
  if (S.selected) q.set('sel', S.selected);
  if (S.view !== 'third') q.set('view', S.view);
  if (!S.splunk) q.set('sp', '0');
  if (S.compare && !S.split) q.set('split', '0');
  S.hash = '#' + q.toString();
  /* sandboxed previews (srcdoc iframes) forbid touching history; the scenario still runs and can be shared */
  try { history.replaceState(null, '', S.hash); } catch (e) { }
}
function readHash() {
  const q = new URLSearchParams(location.hash.slice(1)); if (!q.has('a')) return false;
  if (['presets', 'build', 'explore', 'topo', 'ind'].includes(q.get('mode'))) S.mode = q.get('mode');
  if (INDN[q.get('ind')]) S.ind = q.get('ind');
  S.uc = UC[q.get('uc')] ? q.get('uc') : null; if (S.uc) S.ind = UC[S.uc].ind;
  S.ucProd = PR[q.get('ucp')] ? q.get('ucp') : null; S.ctx = S.mode !== 'ind' && UC[q.get('ctx')] && UC[q.get('ctx')].presets ? q.get('ctx') : null;
  if (DATA.architectures.some(a => a.id === q.get('arch'))) S.arch = q.get('arch');
  if (LENS[q.get('lens')]) S.lens = q.get('lens');
  S.slots[0] = unkey(q.get('a')); if (q.get('b')) S.slots[1] = unkey(q.get('b'));
  S.compare = q.get('cmp') === '1'; S.active = 0;
  S.off = (q.get('off') || '').split(',').filter(k => PR[k]); S.preset = +q.get('p') || 0;
  S.splunk = q.get('sp') !== '0'; S.split = q.get('split') !== '0';
  if (q.get('view') === 'orbit') S.view = 'orbit'; else if (q.get('view') === 'third' || q.get('view') === 'first') S.view = 'third';
  S.selected = (PR[q.get('sel')] || PL[q.get('sel')]) ? q.get('sel') : null;
  return true;
}

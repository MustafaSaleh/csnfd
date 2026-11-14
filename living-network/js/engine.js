/* =====================================================================================
   ENGINE — pure functions over DATA (no DOM)
   ===================================================================================== */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const h = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const G = DATA.groups, PK = DATA.pickers, PR = DATA.products, PL = DATA.places;
const KEYS = ['who', 'device', 'loc', 'dest'];
const PLABEL = { who: 'Who', device: 'Device', loc: 'Location', dest: 'Destination', beh: 'Behaviour / condition' };
const SEV = Object.fromEntries(Object.entries(DATA.verdicts).filter(([, v]) => v.label).map(([k, v]) => [k, v.sev]));
const LENS = Object.fromEntries(DATA.lenses.map(l => [l.id, l]));
const opt = (k, id) => PK[k].find(o => o.id === id);
const ex = a => a.flatMap(x => (typeof x === 'string' && x[0] === '$') ? G[x.slice(1)] : [x]);
const exWhen = w => { if (!w) return; for (const k of [...KEYS, 'via', 'nvia']) if (w[k]) w[k] = ex(w[k]); if (w.not) for (const k in w.not) w.not[k] = ex(w.not[k]); };
/* expand $GROUP references and `fan` rules once */
DATA.checks = DATA.checks.flatMap(c => c.fan ? c.fan.map(f => ({ ...c, id: c.id + '-' + f, at: f, fan: undefined })) : [c]);
DATA.checks.forEach(c => { exWhen(c.when); if (c.hop) c.hop = ex(c.hop); });
[...DATA.paths.access, ...DATA.paths.route, ...DATA.constraints].forEach(r => exWhen(r.when));

function match(w, s, path) {
  if (!w) return true;
  for (const k of KEYS) if (w[k] && !w[k].includes(s[k])) return false;
  if (w.beh && !w.beh.some(b => s.beh.includes(b))) return false;
  if (w.ball && !w.ball.every(b => s.beh.includes(b))) return false;
  if (w.nbeh && w.nbeh.some(b => s.beh.includes(b))) return false;
  if (w.not) for (const k in w.not) if (w.not[k].includes(s[k])) return false;
  if (path) { if (w.via && !w.via.some(n => path.includes(n))) return false; if (w.nvia && w.nvia.some(n => path.includes(n))) return false; }
  return true;
}
/* reason an option is unavailable given earlier pickers, or null */
function blocked(pick, id, s) {
  for (const c of DATA.constraints) {
    if (c.pick !== pick || !match(c.when, s, null)) continue;
    if (c.only && !c.only.includes(id)) return c.why;
    if (c.deny && c.deny.includes(id)) return c.why;
  }
  return null;
}
function toggleBeh(beh, b) {
  const o = opt('beh', b); let out = beh.filter(x => x !== b);
  if (beh.includes(b)) return out;
  if (o.mfa) out = out.filter(x => !opt('beh', x).mfa);
  if (b === 'norm') out = out.filter(x => !opt('beh', x).x);
  if (o.x) out = out.filter(x => x !== 'norm');
  return [...out, b];
}
/* force a scenario into a valid state; earlier pickers win */
function normalize(s0) {
  const s = { ...s0, beh: [...(s0.beh || [])] }, notes = [];
  for (const k of KEYS) {
    if (!opt(k, s[k])) s[k] = PK[k][0].id;
    const why = blocked(k, s[k], s);
    if (why) { const f = PK[k].find(o => !blocked(k, o.id, s)); notes.push(`${PLABEL[k]} set to “${f.short}”. ${why}`); s[k] = f.id; }
  }
  s.beh = [...new Set(s.beh)].filter(b => opt('beh', b) && !blocked('beh', b, s));
  const mfa = s.beh.filter(b => opt('beh', b).mfa); if (mfa.length > 1) s.beh = s.beh.filter(b => !opt('beh', b).mfa || b === mfa[mfa.length - 1]);
  if (s.beh.some(b => opt('beh', b).x)) s.beh = s.beh.filter(b => b !== 'norm');
  if (!s.beh.length && !blocked('beh', 'norm', s)) s.beh = ['norm'];
  s.beh.sort((a, b) => PK.beh.findIndex(o => o.id === a) - PK.beh.findIndex(o => o.id === b));
  return { s, notes };
}
const skey = s => [s.who, s.device, s.loc, s.dest, s.beh.join('+')].join('.');
function unkey(str) { const [who, device, loc, dest, beh = ''] = String(str).split('.'); return normalize({ who, device, loc, dest, beh: beh ? beh.split('+') : [] }).s; }
function pickRule(list, s) { let best = null, bs = -1; for (const r of list) { if (!match(r.when, s, null)) continue; const sc = r.when ? Object.keys(r.when).length : 0; if (sc >= bs) { best = r; bs = sc; } } return best; }
function segType(a, b) { for (const [f, t, ty, label] of DATA.segments) if ((f === '*' || f === a) && (t === '*' || t === b)) return { ty, label }; return { ty: 'clear', label: 'Transit' }; }
/* CONTROL LOST and ALLOW WITH LIMITS share severity 1. CONTROL LOST wins that tie in either order.
   BLOCK and UNAVAILABLE share severity 3 and keep the earlier checkpoint. */
function verdictBeats(next, prev) {
  if (SEV[next] > SEV[prev]) return true;
  return SEV[next] === SEV[prev] && next === 'EXPOSED' && prev === 'LIMIT';
}

/* scenario → path, checkpoints, trust series, verdict. `off` = product id disabled ("without this control"). */
function evaluate(s, off) {
  const offS = new Set(off || []);   /* products removed for the "without these controls" replay */
  const W = opt('who', s.who), D = opt('device', s.device), L = opt('loc', s.loc), T = opt('dest', s.dest);
  const ac = pickRule(DATA.paths.access, s), rt = pickRule(DATA.paths.route, s);
  let path = [...ac.nodes, ...rt.nodes].map(n => n === '@loc' ? L.place : n === '@dest' ? T.node : n);
  path = path.filter((n, i, a) => a.indexOf(n) === i);
  let trust = clamp(50 + W.t + D.t + L.t);
  const series = [{ v: trust, d: 0, sig: `Starting context: ${W.short}, ${D.short}, ${L.short}`, k: -1 }];
  const cand = [];
  DATA.checks.forEach((c, order) => {
    if (!match(c.when, s, path)) return;
    let hi = 1e6;
    if (!c.post) {
      hi = -1;
      for (const hp of c.hop) { const n = hp === '@src' ? path[0] : hp === '@dst' ? path[path.length - 1] : hp; const ix = path.indexOf(n); if (ix >= 0) { hi = ix; break; } }
      if (hi < 0) return;
    }
    cand.push({ c, order, hi });
  });
  cand.sort((a, b) => a.hi - b.hi || a.order - b.order);
  const tl = [], gaps = [], tele = [], sfeed = [], sthreat = [], sdetect = []; let stopAt = -1, top = null;
  for (const { c, hi } of cand) {
    if (stopAt >= 0 && hi > stopAt && hi < 1e6) continue;           /* traffic never got this far */
    if (c.base && stopAt === hi) continue;
    if (c.needsTele && !tele.length) continue;
    if (PR[c.at].cat === 'splunk' && !S.splunk) continue;                 /* Splunk layer switched off */
    if (c.needsS && !({ threat: sthreat, detect: sdetect }[c.needsS] || sfeed).length) continue;
    if (offS.has(c.at) || (c.needs && c.needs.some(x => offS.has(x)))) { gaps.push(c); continue; }   /* needs: products the action is carried out through */
    trust = clamp(trust + (c.d || 0));
    const e = { id: c.id, at: c.at, hi, hop: hi < 1e6 ? path[hi] : null, lens: c.lens, c: c.c, r: c.r, d: c.d || 0, sig: c.sig, v: c.v || null, tele: !!c.tele, trust, from: c.from, also: c.also || [], cvd: c.cvd || [] };
    if (c.from === '@tele') e.beams = [...new Set(tele)];
    if (c.from === '@sfeed') e.beams = [...new Set(sfeed)];
    if (DATA.splunkFeeds.includes(c.at)) { sfeed.push(c.at); if (c.tele || c.v) sthreat.push(c.at); if (c.tele) sdetect.push(c.at); }
    tl.push(e);
    if (c.d) series.push({ v: trust, d: c.d, sig: c.sig || c.c, k: tl.length - 1, at: c.at });
    if (c.tele) tele.push(c.at);
        /* Strictly greater severity replaces the winner. The one exception: CONTROL LOST wins a tie with ALLOW WITH LIMITS.
       Every other tie keeps the earlier checkpoint (path order, then rule order). */
    if (c.v) { if (!top || verdictBeats(c.v, top.v)) top = c; if (!c.post && SEV[c.v] >= SEV.STEPUP && stopAt < 0) stopAt = hi; }
  }
  if (series.length === 1) series.push({ v: trust, d: 0, sig: 'No signal changed the score', k: tl.length - 1 });
  const verdict = top ? top.v : 'ALLOW';
  let why = top ? top.why : DATA.verdicts.ALLOW.why;
  if (!top && (s.who === 'attacker' || gaps.some(g => g.v))) why = DATA.verdicts.noControl;
  const products = [...new Set([...path.filter(n => PR[n]), ...tl.flatMap(e => [e.at, ...e.also, ...(e.beams || [])])])].filter(p => !offS.has(p));
  const vpath = ['@actor', ...path];
  const segs = vpath.slice(0, -1).map((a, i) => i === 0 ? { ty: 'clear', label: 'Local network' } : segType(a, vpath[i + 1]));
  const atClient = vpath.indexOf('client');
  if (atClient > 0 && atClient < segs.length) {
    if (s.beh.includes('leak')) { segs[atClient].ty = 'leak'; segs[atClient].label = 'Tunnel up; a more-specific local route sends some traffic in the clear.'; }
    else if (s.beh.includes('tlsleak')) { segs[atClient].ty = 'disclosed'; segs[atClient].label = 'Tunnel endpoint disclosed process memory.'; }
  }
  if (s.beh.includes('ssid') || s.beh.includes('edgeweb')) {
    const label = s.beh.includes('edgeweb') ? 'IOS XE web UI' : 'Unintended wireless network';
    for (let i = 1; i < segs.length; i++) if (vpath[i + 1] === 'wireless') { segs[i].ty = 'clear'; segs[i].label = label; }
  }
  return { s, off: [...offS], path, vpath, segs, tl, gaps, series, verdict, why, stopAt, trust, products, hostile: s.who === 'attacker',
    rules: [ac.id, rt.id], fallback: !ac.when || !rt.when };
}
function topoOf(id) {
  const a = DATA.architectures.find(x => x.id === id) || DATA.architectures[0];
  const nodes = new Set(a.all ? Object.keys(PR).filter(k => PR[k].cat !== 'suite' && (S.splunk || PR[k].cat !== 'splunk')) : a.nodes);
  const links = DATA.links.filter(l => a.hub ? (l[0] === a.hub && nodes.has(l[1])) : (l[4] !== 'suite' && nodes.has(l[0]) && nodes.has(l[1])));
  return { a, nodes, links };
}
/* topology diagram layout, shared by the 3D and 2D renderers: most-connected block in the middle, the rest on a ring */
function topoLayout(t) {
  for (const k in TOPO_POS) delete TOPO_POS[k]; if (!t || t.a.all) return false;
  const ids = [...t.nodes], deg = id => t.links.filter(l => l[0] === id || l[1] === id).length;
  const hub = t.a.hub || t.a.center || ids.slice().sort((a, b) => deg(b) - deg(a))[0], ring = ids.filter(id => id !== hub), R0 = ring.length > 8 ? 15 : 12.5;
  TOPO_POS[hub] = [0, 0, 0]; ring.forEach((id, i) => { const an = i / ring.length * Math.PI * 2 - Math.PI * .75; TOPO_POS[id] = [Math.cos(an) * R0, 0, Math.sin(an) * R0]; });
  return true;
}
function buildSteps(r) {
  const st = [];
  for (let i = 0; i < r.path.length; i++) {
    st.push({ t: 'move', e: i });
    r.tl.forEach((e, k) => { if (e.hi === i) st.push({ t: 'check', k }); });
    if (i === r.stopAt) break;
  }
  r.tl.forEach((e, k) => { if (e.hi === 1e6) st.push({ t: 'check', k }); });
  st.push({ t: 'end' });
  return st;
}
/* costume for the walking figure. Industry comes from the use case the scenario was opened from,
   otherwise from a preset that belongs to exactly one use case. The Who value, and the verdict, are unchanged. */
const ROLE_GENDERED = new Set(['employee', 'doctor', 'teacher', 'student', 'worker', 'associate', 'servant', 'advisor']);
function roleWoman(preset, slot) {
  let x = (((preset | 0) * 31 + (slot | 0) * 17 + 1) >>> 0);
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d);
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b);
  return ((x ^ (x >>> 16)) >>> 0) % 2 === 1;
}
function roleIndustry(preset) {
  const ctx = typeof S !== 'undefined' && S.ctx && PORTFOLIO.uc.find(u => u.code === S.ctx);
  if (ctx) return ctx;
  if (!preset) return null;
  const hits = PORTFOLIO.uc.filter(u => u.presets && u.presets.includes(preset));
  return hits.length === 1 ? hits[0] : null;
}
function roleOf(s, preset, slot) {
  const who = s.who, own = { id: who, label: opt('who', who).short, woman: false, halo: false };
  if (who === 'attacker' || who === 'insider' || who === 'contractor') return own;
  const staff = who === 'emp' || who === 'admin' || who === 'exec', u = roleIndustry(preset | 0), ind = u && u.ind;
  const studentNamed = ind === 'education' && /student|residential|esports/i.test(u.name || '');
  const costume = (id, label) => ({ id, label, woman: ROLE_GENDERED.has(id) && roleWoman(preset, slot), halo: who === 'admin' });
  if (ind === 'healthcare' && staff) return costume('doctor', 'Doctor');
  if (ind === 'healthcare' && who === 'guest') return costume('patient', 'Patient');
  if (ind === 'education' && (who === 'guest' || (staff && studentNamed))) return costume('student', 'Student');
  if (ind === 'education' && staff) return costume('teacher', 'Teacher');
  if ((s.loc === 'factory' || ind === 'manufacturing') && staff) return costume('worker', 'Plant worker');
  if (ind === 'retail' && staff) return costume('associate', 'Store associate');
  if (ind === 'government' && staff) return costume('servant', 'Public servant');
  if (ind === 'financial-services' && staff) return costume('advisor', 'Advisor');
  if (staff) return costume('employee', 'Employee');
  return own;
}
function suggestions(s, run) {
  const out = [];
  for (const g of DATA.suggest) {
    const t = { ...s, beh: [...s.beh] };
    if (g.set) Object.assign(t, g.set);
    if (g.beh) { if (t.beh.includes(g.beh)) continue; t.beh = toggleBeh(t.beh, g.beh); }
    if (g.clear) t.beh = ['norm'];
    const n = normalize(t).s;
    if (g.set && Object.keys(g.set).some(k => n[k] !== g.set[k])) continue;
    if (g.beh && !n.beh.includes(g.beh)) continue;
    if (skey(n) === skey(s)) continue;
    const v = evaluate(n, null).verdict;
    out.push({ l: g.l, s: n, v, diff: v !== run.verdict ? 1 : 0 });
  }
  return out.sort((a, b) => b.diff - a.diff).slice(0, 4);
}

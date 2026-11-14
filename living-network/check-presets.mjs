/* Snapshot and diff presets 1–99, and assert the CVE presets this branch owns.
   node check-presets.mjs --write   writes preset-snapshot-1-99.json from the current DATA
   node check-presets.mjs           diffs that file and checks the new verdicts

   Severity tie-break: a later checkpoint replaces the winner only when its severity is
   strictly greater, except that CONTROL LOST wins a tie with ALLOW WITH LIMITS.
   Every other tie keeps the earlier checkpoint (path order, then rule order).
   CONTROL LOST (EXPOSED, 1) ranks below STEP-UP (2). UNAVAILABLE (DOWN, 3) ties with BLOCK. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));
const snapPath = path.join(root, 'preset-snapshot-1-99.json');
const game = new Function('S', ['data.js', 'engine.js'].map(f => fs.readFileSync(path.join(root, 'js', f), 'utf8')).join('\n;\n') +
  '\n;return { DATA, normalize, evaluate, verdictBeats };')({ splunk: true });
const { DATA, normalize, evaluate, verdictBeats } = game;
const SEV = Object.fromEntries(Object.entries(DATA.verdicts).filter(([, v]) => v.sev != null).map(([k, v]) => [k, v.sev]));

function scenario(tuple) {
  const [who, device, loc, dest, beh] = tuple;
  return normalize({ who, device, loc, dest, beh }).s;
}
function segmentOf(r) {
  let win = null;
  for (const e of r.tl) {
    if (!e.v) continue;
    if (!win || verdictBeats(e.v, win.v)) win = e;
  }
  if (!win) return null;
  const post = win.hi >= 1e6;
  const i = post ? r.segs.length - 1 : win.hi;
  return {
    post, checkpoint: win.id, verdict: win.v,
    from: r.vpath[post ? r.vpath.length - 2 : i],
    to: r.vpath[post ? r.vpath.length - 1 : i + 1],
    ty: r.segs[i].ty, label: r.segs[i].label
  };
}
function record(n, s, off) {
  const r = evaluate(s, off || null);
  return {
    n, verdict: r.verdict, why: r.why,
    checkpoints: r.tl.map(e => ({ id: e.id, v: e.v || null, hop: e.hop, at: e.at })),
    verdictSegment: segmentOf(r)
  };
}
function records() {
  const out = [];
  for (const p of DATA.presets) {
    if (p.n > 99) continue;
    out.push(record(p.n, scenario(p.s), p.off));
    if (p.b) out.push(record(p.n + 'b', scenario(p.b), null));
  }
  return out;
}

if (process.argv.includes('--write')) {
  const rows = records();
  fs.writeFileSync(snapPath, JSON.stringify(rows, null, 2) + '\n');
  console.log('wrote', snapPath, rows.length, 'rows');
  process.exit(0);
}

const fail = [];
const expectSev = { ALLOW: 0, LIMIT: 1, EXPOSED: 1, STEPUP: 2, BLOCK: 3, DOWN: 3, CONTAIN: 4 };
for (const [k, n] of Object.entries(expectSev)) {
  if (SEV[k] !== n) fail.push(`severity ${k} is ${SEV[k]}, expected ${n}`);
}
if (!(SEV.EXPOSED < SEV.STEPUP && SEV.EXPOSED === SEV.LIMIT && SEV.DOWN === SEV.BLOCK)) {
  fail.push('CONTROL LOST must share severity 1 with ALLOW WITH LIMITS and rank below STEP-UP; UNAVAILABLE must tie with BLOCK');
}
const ties = [
  ['EXPOSED', 'LIMIT', true], ['LIMIT', 'EXPOSED', false],
  ['EXPOSED', 'EXPOSED', false], ['LIMIT', 'LIMIT', false],
  ['BLOCK', 'DOWN', false], ['DOWN', 'BLOCK', false],
  ['STEPUP', 'EXPOSED', true], ['EXPOSED', 'STEPUP', false],
  ['CONTAIN', 'DOWN', true]
];
for (const [next, prev, win] of ties) {
  if (verdictBeats(next, prev) !== win) fail.push(`verdictBeats(${next}, ${prev}) should be ${win}`);
}

const got = records();
const want = JSON.parse(fs.readFileSync(snapPath, 'utf8'));
if (JSON.stringify(got) !== JSON.stringify(want)) {
  const by = new Map(want.map(r => [String(r.n), r]));
  for (const r of got) {
    const w = by.get(String(r.n));
    if (!w) { fail.push(`preset ${r.n} is new in the 1–99 snapshot`); continue; }
    if (JSON.stringify(r) !== JSON.stringify(w)) fail.push(`preset ${r.n} changed:\n  was ${JSON.stringify(w)}\n  now ${JSON.stringify(r)}`);
  }
  for (const w of want) if (!got.some(r => String(r.n) === String(w.n))) fail.push(`preset ${w.n} missing from the snapshot`);
} else console.log('snapshot diff empty:', got.length, 'rows');

/* 104, 105 and 110: CONTROL LOST must win, and no STEP-UP or ALLOW WITH LIMITS checkpoint may outrank or tie it. */
const expect = { 100: 'DOWN', 104: 'EXPOSED', 105: 'EXPOSED', 107: 'CONTAIN', 110: 'EXPOSED', 111: 'DOWN' };
for (const [n, v] of Object.entries(expect)) {
  const p = DATA.presets.find(x => x.n === Number(n));
  if (!p) { fail.push(`preset ${n} is missing`); continue; }
  const wantS = { who: p.s[0], device: p.s[1], loc: p.s[2], dest: p.s[3], beh: p.s[4] };
  const norm = scenario(p.s);
  if (JSON.stringify(norm) !== JSON.stringify(wantS)) fail.push(`preset ${n} is changed by normalize(): ${JSON.stringify(norm)}`);
  const r = evaluate(norm, p.off || null);
  if (r.verdict !== v) fail.push(`preset ${n} verdict ${r.verdict}, expected ${v}`);
  if (n === '104' || n === '105' || n === '110') {
    const rivals = r.tl.filter(e => e.v === 'STEPUP' || e.v === 'LIMIT');
    if (rivals.length) fail.push(`preset ${n} has a STEP-UP or ALLOW WITH LIMITS checkpoint: ${rivals.map(e => e.id + '=' + e.v).join(', ')}`);
    if (r.verdict !== 'EXPOSED') fail.push(`preset ${n} CONTROL LOST did not win`);
  }
  if (n === '104' && !r.segs.some(s => s.ty === 'leak')) fail.push('preset 104 tunnel segment is not leak');
}
const named = {
  105: { keep: ['CVE-2008-1447'], drop: ['CVE-2020-1350', 'CVE-2015-7547'] },
  110: { keep: ['CVE-2023-52424'], drop: ['CVE-2017-13077'] }
};
for (const [n, spec] of Object.entries(named)) {
  const p = DATA.presets.find(x => x.n === Number(n));
  const r = evaluate(scenario(p.s), null);
  const text = [r.why, ...r.tl.flatMap(e => [e.c, e.r])].join('\n');
  for (const id of spec.keep) if (!text.includes(id)) fail.push(`preset ${n} text does not name ${id}`);
  for (const id of spec.drop) if (text.includes(id)) fail.push(`preset ${n} text still names ${id}, which is a different mechanism`);
}
const cmp = { 100: 'BLOCK', 107: 'BLOCK', 111: 'DOWN' };
for (const [n, v] of Object.entries(cmp)) {
  const p = DATA.presets.find(x => x.n === Number(n));
  if (!p || !p.b) { fail.push(`preset ${n} has no compare side`); continue; }
  const r = evaluate(scenario(p.b), null);
  if (r.verdict !== v) fail.push(`preset ${n} compare verdict ${r.verdict}, expected ${v}`);
}

if (fail.length) {
  console.error(fail.join('\n'));
  process.exit(1);
}
console.log('tie-break: later checkpoint wins only when SEV is strictly greater, except CONTROL LOST wins a tie with ALLOW WITH LIMITS');
console.log('verdicts', Object.entries(expect).map(([n, v]) => `${n}=${DATA.verdicts[v].label}`).join(', '));

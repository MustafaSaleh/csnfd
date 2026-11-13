/* Generates js/portfolio.js from ../data/cisco-industries-portfolio.json and portfolio-map.mjs.
   The page has no fetch() and the share build inlines only js/*.js, so the portfolio ships as a script.
   js/portfolio.js is committed: the page still opens from disk with no build step.
   Run: npm run portfolio            (add -- --report for the unmapped names and the link overlap table) */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { aliases, umbrella, families, canonical, links } from './portfolio-map.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const src = JSON.parse(fs.readFileSync(path.join(root, '..', 'data', 'cisco-industries-portfolio.json'), 'utf8'));
const report = process.argv.includes('--report');

/* The game's own data and engine, to check ids, presets and builder tuples against. */
const game = new Function('S', ['data.js', 'engine.js'].map(f => fs.readFileSync(path.join(root, 'js', f), 'utf8')).join('\n;\n') +
  '\n;return { DATA, normalize, evaluate, fromPreset: a => normalize({ who: a[0], device: a[1], loc: a[2], dest: a[3], beh: a[4] }).s };')({ splunk: true });
const { DATA } = game;

const fail = [];
const clean = s => String(s ?? '')
  .replace(/<br\s*\/?>\s*<a\b[^>]*>.*?<\/a>/gi, '')          /* "Special offers available" links inside labels */
  .replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
  .replace(/[\u200b\u200c\u200d\ufeff]/g, '').replace(/\u00a0/g, ' ')
  .replace(/PRODUCTS TABLE #\d+/g, '')
  .replace(/\s+/g, ' ').trim();
const canon = n => { for (const [re, name] of canonical) if (re.test(n)) return name; return n; };
const nameKey = n => n.toLowerCase().replace(/^cisco /, '').replace(/[^a-z0-9]+/g, ' ').trim().replace(/s$/, '');
const familySet = new Set(families.map(f => f.toLowerCase()));

for (const [, id] of aliases) if (!DATA.products[id]) fail.push(`alias points at unknown product id "${id}"`);

/* product names of one use case: a vertical tab fuses two names in one source string */
const rawProducts = u => ((u.ciscoProducts || {}).content || []).flatMap(b => b.column2 || []).flatMap(n => String(n).split('\u000b')).map(clean).filter(Boolean);
const mapName = n => familySet.has(n.toLowerCase()) ? [] : [...new Set(aliases.filter(([re]) => re.test(n)).map(([, id]) => id))];

/* One display spelling per product not in the scene: the most frequent form across all use cases. */
const seen = new Map();
for (const ind of src.industries) for (const u of ind.useCases) for (const n of new Set(rawProducts(u))) {
  if (mapName(n).length) continue;
  const c = canon(n), k = nameKey(c), e = seen.get(k) || seen.set(k, new Map()).get(k);
  e.set(c, (e.get(c) || 0) + 1);
}
const display = new Map([...seen].map(([k, forms]) => [k, [...forms].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0]]));

const names = [], nameIx = new Map(), services = [], svcIx = new Map();
const intern = (list, ix, n) => { if (!ix.has(n)) { ix.set(n, list.length); list.push(n); } return ix.get(n); };

const block = (u, title) => {
  for (const part of [u.overview, u.businessOverview]) for (const c of (part && part.content) || []) if (c.title === title) return (c.list || []).map(clean).filter(Boolean);
  return [];
};
const serviceNames = u => {
  const out = [];
  for (const b of ((u.ciscoServices || {}).content || [])) for (const raw of b.column2 || []) {
    const n = clean(raw);
    if (/^Cisco Support\b/.test(n)) { for (const tier of ['Basic', 'Standard', 'Signature']) if (n.includes(tier)) out.push('Cisco Support - ' + tier); }
    else if (n) out.push(n);
  }
  return [...new Set(out)];
};

const order = Object.keys(DATA.products);
const uc = [], codes = new Set(), unmapped = new Map();
for (const ind of src.industries) for (const u of ind.useCases) {
  const code = u.overview.alphanumericCode;
  if (codes.has(code)) fail.push(`duplicate use case code ${code}`); codes.add(code);
  const raw = [...new Set(rawProducts(u))], prods = new Set(), other = new Set();
  let viaUmbrella = false, direct = false;
  for (const n of raw) {
    const ids = mapName(n);
    if (umbrella.test(n)) viaUmbrella = true; else if (ids.includes('sa')) direct = true;
    if (ids.length) ids.forEach(i => prods.add(i));
    else { const d = display.get(nameKey(canon(n))); other.add(d); unmapped.set(d, (unmapped.get(d) || 0) + 1); }
  }
  const o = {
    code, ind: ind.id, name: clean(u.overview.name), desc: clean(u.overview.description),
    drivers: block(u, 'Industry drivers'), needs: block(u, 'Business needs'), caps: block(u, 'Capabilities'),
    benefits: block(u, 'Benefits'), why: block(u, 'Differentiators'), outcomes: block(u, 'Business outcomes'),
    prods: order.filter(k => prods.has(k)),
    other: [...other].sort((a, b) => a.localeCompare(b)).map(n => intern(names, nameIx, n)),
    svc: serviceNames(u).map(n => intern(services, svcIx, n))
  };
  for (const k of ['drivers', 'needs', 'caps', 'benefits', 'why', 'outcomes']) if (!o[k].length) delete o[k];
  if (viaUmbrella) o.umb = direct ? 1 : 2;          /* 1: Cisco lists Umbrella and Secure Access; 2: Umbrella only */
  if (!o.prods.length) fail.push(`${code} ${o.name}: no product maps to the scene`);
  if (!o.desc) fail.push(`${code}: no description`);
  const l = links[code];
  if (l) {
    for (const n of l.presets) if (!DATA.presets.some(p => p.n === n)) fail.push(`${code}: preset ${n} does not exist`);
    if (!DATA.architectures.some(a => a.id === l.arch && !a.all)) fail.push(`${code}: architecture "${l.arch}" does not exist`);
    const [who, device, loc, dest, beh] = l.build, want = { who, device, loc, dest, beh }, got = game.normalize(want).s;
    if (JSON.stringify(got) !== JSON.stringify(want)) fail.push(`${code}: builder scenario is not valid as written. normalize() gives ${JSON.stringify(Object.values(got))}`);
    Object.assign(o, { presets: l.presets, build: l.build, arch: l.arch });
    /* Presets 38–99 each belong to one use case, and the builder opens that same scenario. */
    if (l.presets.length === 1 && l.presets[0] >= 38) {
      const p = DATA.presets.find(x => x.n === l.presets[0]);
      if (p && JSON.stringify(p.s) !== JSON.stringify(l.build)) fail.push(`${code}: preset ${p.n} plays ${JSON.stringify(p.s)}, but the builder scenario is ${JSON.stringify(l.build)}`);
      if (p && p.b) {
        const [who, device, loc, dest, beh] = p.b, got = game.normalize({ who, device, loc, dest, beh }).s;
        if (JSON.stringify(got) !== JSON.stringify({ who, device, loc, dest, beh })) fail.push(`${code}: preset ${p.n} compare scenario is not valid`);
      }
    }
  }
  uc.push(o);
}
for (const code of Object.keys(links)) if (!codes.has(code)) fail.push(`link for unknown use case code ${code}`);
const unlinked = uc.filter(u => !u.presets);
if (unlinked.length) fail.push(`${unlinked.length} use cases have no preset: ${unlinked.map(u => u.code).join(', ')}`);
{
  const nums = DATA.presets.map(p => p.n), dup = nums.filter((n, i) => nums.indexOf(n) !== i);
  if (dup.length) fail.push(`duplicate preset numbers: ${[...new Set(dup)].join(', ')}`);
  for (const p of DATA.presets) {
    const [who, device, loc, dest, beh] = p.s, got = game.normalize({ who, device, loc, dest, beh }).s;
    if (p.n >= 38 && JSON.stringify(got) !== JSON.stringify({ who, device, loc, dest, beh })) fail.push(`preset ${p.n} is changed by normalize()`);
    if (!game.evaluate(got, null).verdict) fail.push(`preset ${p.n} produces no verdict`);
  }
}

if (fail.length) { console.error('portfolio build failed:\n  ' + fail.join('\n  ')); process.exit(1); }

const head = {
  source: src.sourcePage, collected: src.collectedAt.slice(0, 10),
  industries: src.industries.map(i => ({ id: i.id, name: i.name })),
  names, services
};
const out = `/* GENERATED by build-portfolio.mjs from ../data/cisco-industries-portfolio.json and portfolio-map.mjs. Do not edit: run \`npm run portfolio\`.
   Cisco industry use cases (${uc.length}) mapped onto the products in DATA.products. \`prods\` are scene product ids, \`other\` and \`svc\` index
   \`names\` and \`services\`, \`umb\` marks a use case where Cisco's page lists Umbrella (counted as Secure Access), and
   \`presets\`, \`build\` and \`arch\` are the hand-curated links to scenarios. */
const PORTFOLIO = ${JSON.stringify(head).slice(0, -1)},"uc":[
${uc.map(u => JSON.stringify(u)).join(',\n')}
]};
`;
fs.writeFileSync(path.join(root, 'js', 'portfolio.js'), out);

const linked = uc.filter(u => u.presets).length, umb = uc.filter(u => u.umb);
console.log(`js/portfolio.js: ${uc.length} use cases, ${linked} linked to scenarios, ${names.length} names not in the scene, ${services.length} services, ${(Buffer.byteLength(out) / 1024).toFixed(0)} KB`);
console.log(`Umbrella counted as Secure Access in ${umb.length} use cases (${umb.filter(u => u.umb === 2).length} list Umbrella without Secure Access)`);
if (report) {
  console.log('\nNot in the scene, by number of use cases:');
  for (const [n, c] of [...unmapped].sort((a, b) => b[1] - a[1])) console.log(String(c).padStart(4), n);
  console.log('\nLinked use cases: products of each linked preset that the use case also lists');
  for (const u of uc.filter(x => x.presets)) {
    const cell = n => { const r = game.evaluate(game.fromPreset(DATA.presets.find(p => p.n === n).s), null); return `${n}:${r.products.filter(p => u.prods.includes(p)).length}/${r.products.length}`; };
    const b = game.evaluate(game.normalize({ who: u.build[0], device: u.build[1], loc: u.build[2], dest: u.build[3], beh: u.build[4] }).s, null);
    console.log(`${u.code} ${u.name} [${u.prods.length} in scene] presets ${u.presets.map(cell).join(' ')} build ${b.products.filter(p => u.prods.includes(p)).length}/${b.products.length} ${b.verdict}`);
  }
}

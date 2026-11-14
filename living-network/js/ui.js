/* =====================================================================================
   UI
   ===================================================================================== */
const ICON = { restart: 'M5 4v12M17 4 8 10l9 6z', play: 'M6 4l11 6-11 6z', pause: 'M6 4h3v12H6zM11 4h3v12h-3z', step: 'M4 4l8 6-8 6zM14 4h3v12h-3z', end: 'M3 4l6 6-6 6zM10 4l6 6-6 6z', view: 'M10 2v4M10 14v4M2 10h4M14 10h4M10 7.6a2.4 2.4 0 1 0 0 4.8a2.4 2.4 0 0 0 0-4.8', full: 'M3 8V3h5M12 3h5v5M17 12v5h-5M8 17H3v-5', unfull: 'M8 3v5H3M12 3v5h5M17 12h-5v5M3 12h5v5' };
const LINE_ICON = { view: 1, full: 1, unfull: 1 };   /* drawn as outlines rather than filled shapes */
const ico = n => `<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="${ICON[n]}"  fill="${LINE_ICON[n] ? 'none' : 'currentColor'}" stroke="currentColor" stroke-width="${LINE_ICON[n] ? 1.8 : 0}" stroke-linejoin="round"/></svg>`;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 3200); }
const vchip = v => `<span class="vc v-${v}">${DATA.verdicts[v].label}</span>`;

function setLens(id) {
  if (S.lens !== id) SND.play('lens', DATA.lenses.findIndex(l => l.id === id));
  S.lens = id; document.body.dataset.lens = id;
  $$('#lenses button').forEach(b => b.setAttribute('aria-checked', b.dataset.lens === id));
  const L = LENS[id], sw = { line: '<path d="M1 6h16" stroke="var(--lens)" stroke-width="3"/>', dim: '<path d="M1 6h16" stroke="#8fa3c8" stroke-width="2"/>',
    ring: '<circle cx="9" cy="6" r="4.5" fill="none" stroke="var(--lens)" stroke-width="2"/>', node: '<path d="M9 1l5 5-5 5-5-5z" fill="var(--lens)"/>',
    beam: '<path d="M1 10 17 2" stroke="var(--lens)" stroke-width="1.5"/>', diamond: '<path d="M9 0l4 6-4 6-4-6z" fill="none" stroke="var(--lens)" stroke-width="1.6"/>',
    dash: '<path d="M1 6h16" stroke="var(--lens)" stroke-width="2" stroke-dasharray="3 2.5"/>', x: '<path d="M4 1l10 10M14 1 4 11" stroke="var(--lens)" stroke-width="2.2"/>',
    grad: '<defs><linearGradient id="lg"><stop stop-color="#ff5d5d"/><stop offset=".5" stop-color="#f4c95d"/><stop offset="1" stop-color="#5be3a4"/></linearGradient></defs><path d="M1 6h16" stroke="url(#lg)" stroke-width="3"/>' };
  $('#legend').innerHTML = `<b>${L.label}</b> · ${h(L.blurb)}<ul>${L.legend.map(([k, t]) => `<li><svg width="18" height="12" viewBox="0 0 18 12">${sw[k]}</svg>${h(t)}</li>`).join('')}</ul>`;
  R && R.setLens(id); markTimeline(); lastSig = '';
}
/* camera view: overview (orbit) or 3rd person (behind the actor, and beside the product at a checkpoint) */
function setView(v, quiet) {
  if (!R.setView) v = 'orbit';
  if (v === 'first') v = 'third';
  S.view = v; $('#viewSel').value = v; R.setView && R.setView(v);
  if (!quiet) SND.play('view');
  if (v !== 'orbit' && !S.runs.length && !quiet) toast('3rd person needs a running scenario: pick a preset or build one.');
  if (!quiet) { try { localStorage.setItem('ln-view', v); } catch (e) { } writeHash(); }
}
/* Splunk layer on/off: nodes, relationships and Splunk checkpoints appear or disappear together */
function setSplunk(on) {
  S.splunk = on; const b = $('#spT'); b.setAttribute('aria-pressed', on); b.textContent = on ? 'Splunk layer: on' : 'Splunk layer: off';
  SND.play(on ? 'splunk' : 'toggle', false);
  if (R) { R.setLayer(on); setLens(S.lens); renderLeft(); rerun(); }
}
const markTabs = () => $$('.modes button').forEach(b => b.setAttribute('aria-selected', b.dataset.mode === S.mode));
function setMode(m) {
  S.mode = m; markTabs();
  if (m === 'presets' && !S.preset) S.preset = 0;
  renderLeft(); rerun();
}
const splunkOn = () => { if (S.splunk) return; S.splunk = true; $('#spT').setAttribute('aria-pressed', true); $('#spT').textContent = 'Splunk layer: on'; R.setLayer(true); setLens(S.lens); };

/* ---- industry use cases (PORTFOLIO): the Industries mode and its links to presets, the builder and Topology ---- */
const ucLabel = u => INDN[u.ind] + ' · ' + u.name;
const presetOf = n => DATA.presets.find(p => p.n === n);
const archOf = id => DATA.architectures.find(a => a.id === id);
const buildLine = a => { const s = fromPreset(a); return [opt('who', s.who).short, opt('device', s.device).short, opt('loc', s.loc).short, '→ ' + opt('dest', s.dest).short, ...s.beh.map(b => opt('beh', b).label)].join(' · '); };
const UMB_NOTE = 'Cisco’s page lists Umbrella, which is retiring and is not in this scene. It is shown here as Secure Access, which incorporates Umbrella’s DNS-layer security and secure web gateway.';
/* blocks of a use case in reading order; the source has two shapes and each use case carries the blocks it has */
const UC_BLOCKS = [['drivers', 'Industry drivers'], ['needs', 'Business needs'], ['caps', 'Capabilities'], ['benefits', 'Benefits'], ['why', 'Why Cisco'], ['outcomes', 'Business outcomes']];
function openUC(code, quiet) {
  const u = UC[code]; if (!u) return;
  S.mode = 'ind'; S.ind = u.ind; S.uc = code; S.ctx = null; if (S.ucProd && !u.prods.includes(S.ucProd)) S.ucProd = null;
  S.selected = null; R.select(null); $('#detail').hidden = true;
  markTabs(); renderLeft(); rerun(); $('#right').scrollTop = 0;
  const cur = $('#left .preset[aria-current=true]'); if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'nearest' });
  if (!quiet && matchMedia('(max-width:900px)').matches) sheet('right');
}
/* leave a use case for one of its scenarios; the use case stays as context until another scenario is picked */
function ucTry(kind, n) {
  const u = UC[S.uc]; if (!u || !u.presets) return;
  S.ctx = u.code;
  if (kind === 'preset') { S.mode = 'presets'; S.pind = null; markTabs(); loadPreset(n); }
  else if (kind === 'build') { S.mode = 'build'; S.compare = false; S.active = 0; S.preset = 0; S.off = []; S.slots[0] = fromPreset(u.build); markTabs(); renderLeft(); rerun(); }
  else { S.arch = u.arch; if (archOf(u.arch).layer === 'splunk') splunkOn(); setMode('topo'); }
  $('#right').scrollTop = 0;
}
const ctxHTML = () => { const u = S.mode !== 'ind' && UC[S.ctx]; return u ? `<div class="ctx"><span>Industry context: <b>${h(ucLabel(u))}</b></span><button class="btn" data-uc="${u.code}">Back to use case</button><button class="btn" data-ctxclear aria-label="Dismiss industry context">×</button></div>` : ''; };
/* use cases that relate to a run: those curated to the loaded preset, then those whose listed products cover most of the run */
function ucForRun(r) {
  const cur = S.mode === 'presets' && S.preset ? PORTFOLIO.uc.filter(u => u.presets && u.presets.includes(S.preset)) : [];
  const near = PORTFOLIO.uc.filter(u => !cur.includes(u)).map(u => ({ u, c: r.products.filter(p => u.prods.includes(p)).length }))
    .filter(x => x.c >= 2).sort((a, b) => b.c - a.c || a.u.prods.length - b.u.prods.length).slice(0, 3);
  if (!cur.length && !near.length) return '';
  return `<h4>Industry use cases</h4><div class="sug ucs">${cur.map(u => `<button data-uc="${u.code}"><span>${h(ucLabel(u))}</span><small>linked to this preset</small></button>`).join('')}${near.map(x => `<button data-uc="${x.u.code}"><span>${h(ucLabel(x.u))}</span><small>names ${x.c} of the ${r.products.length} products in this run</small></button>`).join('')}</div>
    <p class="small" style="margin-top:5px">From Cisco’s industry portfolio. A count compares product lists only; it says nothing about this verdict.</p>`;
}
function ucCard(u) {
  const f = S.focus, hidden = u.prods.filter(k => !f.nodes.has(k)), sec = (t, items) => `<details class="ucb"><summary>${h(t)} <small>${items.length}</small></summary><ul>${items.map(x => `<li>${h(x)}</li>`).join('')}</ul></details>`;
  const tryit = u.presets ? `<h4>Try it</h4><div class="sug ucs">
      ${u.presets.map(n => `<button data-ucpreset="${n}"><span>Preset ${n}: ${h(presetOf(n).t)}</span><small>Presets</small></button>`).join('')}
      <button data-ucbuild><span>${h(buildLine(u.build))}</span><small>Build your own</small></button>
      <button data-uctopo><span>${h(archOf(u.arch).name)}</span><small>Topology</small></button></div>
      <p class="small" style="margin-top:5px">These scenario links are chosen by this tool, not by Cisco. Verdicts are illustrative.</p>`
    : `<p class="small" style="margin-top:10px">No scenario in this tool is linked to this use case. The scene shows the products Cisco lists for it.</p>`;
  return `<div class="rhead"><h2>Use case</h2><button class="btn" id="shareR">Copy link</button>${expMenu()}</div><div class="run ucard">
    <div class="cat">${h(INDN[u.ind])} · ${u.code}</div><h3 style="font-size:15px">${h(u.name)}</h3><p style="margin:6px 0">${h(u.desc)}</p>
    ${tryit}
    <h4>Products Cisco lists for this use case</h4>
    <p class="small">In this scene (${f.nodes.size})</p><div class="prods">${[...f.nodes].map(id => `<button class="pb" data-id="${id}">${h(PR[id].s)}</button>`).join('')}</div>
    ${hidden.length ? `<p class="small" style="margin-top:5px">Hidden with the Splunk layer off: ${h(hidden.map(k => PR[k].s).join(', '))}.</p>` : ''}
    ${u.umb ? `<p class="umb">${h(UMB_NOTE)}</p>` : ''}
    ${u.other.length ? `<p class="small" style="margin-top:10px">Also listed by Cisco, not in this scene (${u.other.length})</p><p class="others">${u.other.map(i => h(PORTFOLIO.names[i])).join(' · ')}</p>` : ''}
    <h4>Stated relationships among these products (${f.links.length})</h4>
    ${f.links.length ? `<details class="ucb"${f.links.length <= 8 ? ' open' : ''}><summary>Drawn in white in the scene <small>${f.links.length}</small></summary><ol class="tl">${f.links.map((l, i) => `<li style="--c:#fff"><span class="n">${i + 1}</span><div><button class="p" data-id="${l[0]}">${h(PR[l[0]].s)}</button> ↔ <button class="p" data-id="${l[1]}">${h(PR[l[1]].s)}</button>
      <div>${h(l[2])}</div><div class="meta"><a href="${srcOf(l[3])}" target="_blank" rel="noopener noreferrer">source</a></div></div></li>`).join('')}</ol></details>` : '<p class="small">None stated on the pages reviewed.</p>'}
    <p class="small" style="margin-top:6px">Relationships come from cisco.com and splunk.com product pages, as in Topology. Cisco’s use case page lists the products; it does not state these links.</p>
    <h4>What Cisco says</h4>
    ${UC_BLOCKS.filter(([k]) => u[k]).map(([k, t]) => sec(t, u[k])).join('')}
    ${u.svc.length ? sec('Cisco services', u.svc.map(i => PORTFOLIO.services[i])) : ''}
    <a class="src" href="${PORTFOLIO.source}" target="_blank" rel="noopener noreferrer">Source: Cisco Industries Portfolio Explorer ↗</a>
    <p class="small">Use case text and product lists are Cisco’s, collected ${PORTFOLIO.collected}. Products Cisco lists for this use case, placed where this scene already has them — not an architecture or a validated design.</p></div>`;
}
function loadPreset(n) {
  const p = DATA.presets.find(x => x.n === n); if (!p) return;
  S.preset = n; S.off = (p.off || []).filter(k => PR[k]); S.active = 0; S.slots[0] = fromPreset(p.s); S.compare = !!p.b; if (p.b) S.slots[1] = fromPreset(p.b);
  if (p.lens) setLens(p.lens); renderLeft(); rerun();
}
function setScenario(slot, s, notes) { S.slots[slot] = s; S.preset = 0; renderLeft(); rerun(); S.notes = notes || []; if (S.notes.length) { toast(S.notes[0]); const n = $('#bnotes'); if (n) n.textContent = S.notes.join(' '); } }

function renderLeft() {
  const el = $('#leftBody');
  if (S.mode === 'presets') {
    el.innerHTML = `<h2>Preset library</h2><p class="small" style="margin:4px 0 2px">One click fills the five pickers and runs the scenario. Ninety-nine presets, from everyday access through the industry use cases.</p>` +
      `<div class="chips indbar" role="radiogroup" aria-label="Show presets linked to an industry"><button class="chip" role="radio" data-pind="" aria-checked="${!S.pind}">All</button>${PORTFOLIO.industries.map(i => `<button class="chip" role="radio" data-pind="${i.id}" aria-checked="${S.pind === i.id}">${h(i.name)}</button>`).join('')}</div>` +
      (() => {
        const keep = S.pind && new Set(PORTFOLIO.uc.filter(u => u.ind === S.pind && u.presets).flatMap(u => u.presets));
        let g = '', shown = '';
        return (keep ? `<p class="small" style="margin:6px 0 0">${keep.size} presets are linked from ${h(INDN[S.pind])} use cases.</p>` : '') + DATA.presets.map(p => {
          if (p.g) g = p.g; if (keep && !keep.has(p.n)) return '';
          const head = g !== shown ? `<div class="pg">${h(shown = g)}</div>` : '';
          return `${head}<button class="preset" data-n="${p.n}" aria-current="${S.preset === p.n}"><b>${p.n}</b><span>${h(p.t)}</span></button>`;
        }).join('');
      })();
  } else if (S.mode === 'ind') {
    const list = PORTFOLIO.uc.filter(u => u.ind === S.ind && (!S.ucProd || u.prods.includes(S.ucProd)));
    el.innerHTML = `<h2>Industries</h2><p class="small" style="margin:4px 0 8px">Cisco’s industry use cases over this scene. Pick one to see the products Cisco lists for it and the scenarios that illustrate it.</p>
      <div class="chips indbar" role="radiogroup" aria-label="Industry">${PORTFOLIO.industries.map(i => `<button class="chip" role="radio" data-ind="${i.id}" aria-checked="${S.ind === i.id}">${h(i.name)}</button>`).join('')}</div>
      ${S.ucProd ? `<p class="ucf">Use cases that name <b>${h(PR[S.ucProd].s)}</b> <button class="chip" data-ucpclear>Show all</button></p>` : ''}
      <div class="pg">${h(INDN[S.ind])} · ${list.length} use case${list.length === 1 ? '' : 's'}</div>` +
      (list.map(u => `<button class="preset uc" data-uc="${u.code}" aria-current="${S.uc === u.code}"><span>${h(u.name)}</span>${u.presets ? `<small title="Linked to ${u.presets.length} preset${u.presets.length === 1 ? '' : 's'}, a builder scenario and a topology">scenarios</small>` : ''}</button>`).join('') || '<p class="small">No use case in this industry names it.</p>');
  } else if (S.mode === 'build') {
    const s = S.slots[S.active];
    const group = k => {
      let last = '';
      const chips = PK[k].map(o => {
        const why = blocked(k, o.id, s), on = k === 'beh' ? s.beh.includes(o.id) : s[k] === o.id;
        const head = (k === 'beh' && o.g !== last) ? `<span class="bg">${h(last = o.g)}</span>` : '';
        return `${head}<button class="chip" role="${k === 'beh' ? 'checkbox' : 'radio'}" data-k="${k}" data-id="${o.id}" aria-checked="${on}" ${why ? `aria-disabled="true" data-why="${h(why)}" title="Unavailable: ${h(why)}"` : ''}>${h(o.label)}</button>`;
      }).join('');
      const reasons = [...new Set(PK[k].map(o => blocked(k, o.id, s)).filter(Boolean))];
      return `<div class="pk"><h3><b>${'ABCDE'['who device loc dest beh'.split(' ').indexOf(k)]}</b>${PLABEL[k]}${k === 'beh' ? '<small>multi-select</small>' : ''}</h3>
        <div class="chips" role="${k === 'beh' ? 'group' : 'radiogroup'}" aria-label="${PLABEL[k]}">${chips}</div>
        <p class="why" data-why-for="${k}">${reasons.length ? 'Struck-through options are unavailable: ' + h(reasons.join(' ')) : ''}</p></div>`;
    };
    el.innerHTML = `<h2>Scenario builder</h2>
      <div class="slotbar" style="margin-top:8px">
        <button id="cmpT" aria-pressed="${S.compare}">Compare two scenarios</button>
        ${S.compare ? `<button data-slot="0" aria-pressed="${S.active === 0}">Edit A</button><button data-slot="1" aria-pressed="${S.active === 1}">Edit B</button>` : ''}
      </div>
      <p class="notes" id="bnotes" aria-live="polite">${h(S.notes.join(' '))}</p>
      ${['who', 'device', 'loc', 'dest', 'beh'].map(group).join('')}
      <div class="slotbar"><button class="btn primary" id="runB">Run</button><button class="btn" id="shareB">Copy link</button></div>
      <p class="small">Changing any picker while a scenario runs re-evaluates it immediately.</p>`;
  } else if (S.mode === 'topo') {
    el.innerHTML = `<h2>Topology</h2><p class="small" style="margin:4px 0 8px">Pick an architecture to isolate its building blocks and see how they connect. Only relationships stated on cisco.com or splunk.com are drawn.</p>` +
      DATA.architectures.map((a, i) => `${i === 0 ? '<div class="pg">Architectures</div>' : a.id === 'ups' ? '<div class="pg">Suites</div>' : a.id === 'splsec' ? '<div class="pg">Splunk layer</div>' : a.all ? '<div class="pg">Whole scene</div>' : ''}<button class="preset" data-arch="${a.id}" aria-current="${S.arch === a.id}"><b>${i + 1}</b><span>${h(a.name)}</span></button>`).join('');
  } else {
    el.innerHTML = `<h2>Free explore</h2><p class="small" style="margin:4px 0 10px">Orbit, zoom and pan the scene. Select any product for its function, lenses, stated relationships and cisco.com source. Lines are relationships stated on cisco.com or splunk.com. The orange stub under Splunk Platform combines every feed that sends data there, and selecting a product draws that product's own lines.</p>` +
      Object.entries(DATA.categories).map(([c, name]) => `<div class="pg">${h(name)}</div><div class="exlist">` +
        Object.entries(PR).filter(([, p]) => p.cat === c).map(([id, p]) => `<button data-id="${id}"><span>${h(p.name)}</span><small>${h(DATA.zones.find(z => z.id === p.zone).label.slice(4))}</small></button>`).join('') + '</div>').join('');
  }
}
$('#left').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.mode) return setMode(b.dataset.mode);
  if (b.dataset.ind) { if (S.ind !== b.dataset.ind) { S.ind = b.dataset.ind; S.uc = null; } renderLeft(); return rerun(); }
  if (b.dataset.pind !== undefined) { S.pind = b.dataset.pind || null; return renderLeft(); }
  if (b.hasAttribute('data-ucpclear')) { S.ucProd = null; renderLeft(); return writeHash(); }
  if (b.dataset.uc) return openUC(b.dataset.uc);
  if (b.dataset.arch) { SND.play('topo'); S.arch = b.dataset.arch; if (UC[S.ctx] && UC[S.ctx].arch !== S.arch) S.ctx = null; if (archOf(S.arch).layer === 'splunk') splunkOn(); renderLeft(); rerun(); if (matchMedia('(max-width:900px)').matches) sheet('right'); return; }
  if (b.dataset.n) { if (UC[S.ctx] && !UC[S.ctx].presets.includes(+b.dataset.n)) S.ctx = null; loadPreset(+b.dataset.n); if (matchMedia('(max-width:900px)').matches) sheet('none'); return; }
  if (b.id === 'cmpT') { S.compare = !S.compare; S.active = 0; S.preset = 0; renderLeft(); return rerun(); }
  if (b.dataset.slot) { S.active = +b.dataset.slot; return renderLeft(); }
  if (b.id === 'runB') { rerun(); if (matchMedia('(max-width:900px)').matches) sheet('none'); return; }
  if (b.id === 'shareB') return share();
  if (b.dataset.k) {
    if (b.getAttribute('aria-disabled') === 'true') { const w = $(`[data-why-for="${b.dataset.k}"]`); w.textContent = 'Unavailable: ' + b.dataset.why; return toast('Unavailable: ' + b.dataset.why); }
    const s = { ...S.slots[S.active] }, k = b.dataset.k;
    if (k === 'beh') s.beh = toggleBeh(s.beh, b.dataset.id); else s[k] = b.dataset.id;
    const n = normalize(s); return setScenario(S.active, n.s, n.notes);
  }
  if (b.dataset.id) select(b.dataset.id, true);
});
function share() {
  writeHash(); const real = /^(https?|file):/.test(location.href), url = (real ? location.href.split('#')[0] : 'index.html') + S.hash;
  if (!real) return toast('Scenario link: ' + url);   /* embedded preview: clipboard and dialogs are blocked */
  let p; try { p = navigator.clipboard.writeText(url); } catch (e) { p = Promise.reject(e); }
  p.then(() => toast('Link copied — it reproduces this scenario.'), () => { try { if (prompt('Copy this link:', url) === null) throw 0; } catch (e) { toast('Scenario link: ' + url); } });
}

/* ---- results ---- */
function graph(r) {
  const W = 320, H = 96, n = r.series.length, x = i => 16 + i * (W - 32) / Math.max(1, n - 1), y = v => 10 + (100 - v) * (H - 24) / 100;
  const pts = r.series.map((p, i) => `${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
  return `<svg class="graph" viewBox="0 0 ${W} ${H}" role="img" aria-label="Illustrative trust level over the session, from ${r.series[0].v} to ${r.trust}">
    ${[0, 50, 100].map(v => `<line x1="12" x2="${W - 8}" y1="${y(v)}" y2="${y(v)}" stroke="#22304f" stroke-width="1"/><text x="2" y="${y(v) + 3}" font-size="8" fill="#7385aa">${v}</text>`).join('')}
    <polyline points="${pts}" fill="none" stroke="var(--trust)" stroke-width="2" stroke-linejoin="round"/>
    ${r.series.map((p, i) => `<circle data-k="${p.k}" cx="${x(i)}" cy="${y(p.v)}" r="3.5" fill="${p.d < 0 ? 'var(--block)' : p.d > 0 ? 'var(--ok)' : '#a9b6d3'}"><title>${h(p.sig)}: ${p.v}</title></circle>`).join('')}
    <text x="${W - 8}" y="${Math.max(9, y(r.trust) - 6)}" font-size="10" font-weight="700" text-anchor="end" fill="var(--trust)">${r.trust}</text></svg>
    <ul class="sig">${r.series.map(p => `<li data-k="${p.k}"><b class="${p.d < 0 ? 'dn' : p.d > 0 ? 'up' : ''}">${p.d > 0 ? '+' + p.d : p.d < 0 ? p.d : '·'}</b><span>${h(p.sig)}${p.at ? ` <span class="small">(${h(PR[p.at].s)})</span>` : ''} → <b style="min-width:0">${p.v}</b></span></li>`).join('')}</ul>`;
}
const CVDL = k => { const d = DATA.cvd[k]; return d ? `<a href="${d[1]}" target="_blank" rel="noopener noreferrer" title="${h(d[0])}${d[2] ? ` (${d[3] === 'threat' ? 'published' : 'updated'} ${d[2]})` : ''}">${{ cvd: 'CVD', threat: 'Threat report' }[d[3]] || 'Ref'}: ${h(d[0])}</a>` : ''; };
function runHTML(r) {
  const s = r.s, V = DATA.verdicts[r.verdict], multi = S.runs.length > 1;
  const sum = [opt('who', s.who).short, opt('device', s.device).short, opt('loc', s.loc).short, '→ ' + opt('dest', s.dest).short, ...s.beh.map(b => opt('beh', b).label)];
  const gap = r.off.length ? `<div class="gap"><b>Without ${h(r.off.map(k => PR[k].s).join(', '))} (illustrative)</b><p>With all controls: ${vchip(r.base.verdict)} → without it: ${vchip(r.verdict)}${r.base.verdict === r.verdict ? '. No change in outcome: ' + (r.gaps.length ? 'another control still covers this scenario.' : 'the removed products do not act in this scenario.') : ''}</p>
    ${r.gaps.length ? `<ul>${r.gaps.map(g => `<li>Skipped: ${h(g.c)} — ${h(g.r)}</li>`).join('')}</ul>` : ''}</div>` : '';
  const sug = r.sug;
  return `<section class="run pending" data-slot="${r.slot}" aria-label="Scenario ${'AB'[r.slot]} result">
    <h3>${multi ? 'Scenario ' + 'AB'[r.slot] : 'Scenario'}</h3>
    <div class="sum">${sum.map(x => `<span>${h(x)}</span>`).join('')}</div>
    <div class="wait">Evaluating… <span class="prog"></span></div>
    <div class="verdict v-${r.verdict}" role="status"><div class="vt">${V.label}</div><p>${h(r.why)}</p><p class="note">${h(DATA.meta.verdictNote)}</p></div>
    ${gap}
    <h4>Trust level (illustrative)</h4>${graph(r)}
    <h4>Decision timeline</h4>
    <ol class="tl">${r.tl.map((e, k) => `<li data-k="${k}" data-lens="${e.lens}" style="--c:${LENS[e.lens].color}"><span class="n">${k + 1}</span><div>
      <button class="p" data-id="${e.at}">${h(PR[e.at].s)}</button> <span class="c">· ${h(e.c)}${e.hop && e.hop !== e.at ? ' @ ' + h(nodeName(e.hop)) : ''}</span>
      <div>${h(e.r)}</div><div class="meta"><span>${LENS[e.lens].label}</span>${e.d ? `<span>trust ${e.d > 0 ? '+' : ''}${e.d} → ${e.trust}</span>` : ''}${e.v ? vchip(e.v) : ''}</div>${e.cvd.length ? `<div class="meta cvdl">${e.cvd.map(CVDL).join('')}</div>` : ''}</div></li>`).join('')}</ol>
    <p class="small" style="margin-top:6px">Path: ${r.path.map(n => h(nodeName(n))).join(' → ')}${r.stopAt >= 0 ? ' (stopped at ' + h(nodeName(r.path[r.stopAt])) + ')' : ''}. Rules ${r.rules.join(', ')}${r.fallback ? ' — nearest matching rule used' : ''}.</p>
    <h4>Products involved</h4>
    <div class="prods">${r.products.map(p => `<a href="${PR[p].url}" target="_blank" rel="noopener noreferrer" title="Source: ${new URL(PR[p].url).host.replace('www.', '')}">${h(PR[p].s)}</a>`).join('')}</div>
    ${ucForRun(r)}
    ${sug.length ? `<h4>Change one thing</h4><div class="sug">${sug.map((g, i) => `<button data-sug="${i}"><span>${h(g.l)}</span>${vchip(g.v)}</button>`).join('')}</div>` : ''}
    <h4>Without these controls</h4>
    <div class="ctl"><div class="chips" role="group" aria-label="Disable products and replay">${(r.base || r).products.filter(p => PR[p].cat !== 'net' || PR[p].inspect).map(p => `<button class="chip off" role="checkbox" data-off="${p}" aria-checked="${S.off.includes(p)}">${h(PR[p].s)}</button>`).join('')}</div>
    <div class="chips" style="margin-top:5px">${Object.keys(PR).filter(k => PR[k].cat === 'suite').map(k => `<button class="chip off" data-offsuite="${k}" title="Remove every product this suite packages">Whole ${h(PR[k].s)} suite</button>`).join('')}${S.off.length ? '<button class="chip" data-offclear>Restore all</button>' : ''}</div>
    <small>Illustrative: tap products (or a whole suite) to remove them and replay, to show the gap.</small></div>
  </section>`;
}
function renderResults() {
  const el = $('#result');
  if (S.topo) {
    const { a, nodes, links } = S.topo, src = a.src ? srcOf(a.src) : null, su = srcOf;
    el.innerHTML = `<div class="rhead"><h2>Topology</h2><button class="btn" id="shareR">Copy link</button>${expMenu()}</div>${ctxHTML()}<div class="run">
      <h3 style="font-size:15px">${h(a.name)}</h3><p style="margin:6px 0">${h(a.blurb)}</p>
      ${src ? `<a class="src" style="margin-top:0" href="${src}" target="_blank" rel="noopener noreferrer">Source: ${new URL(src).host.replace('www.', '')} ↗</a>` : ''}
      ${a.cvd ? `<h4>Cisco Validated and design references</h4><div class="cvdl">${a.cvd.map(CVDL).join('')}</div>` : ''}
      <p class="small" style="margin-top:6px">Conceptual architecture — not a validated design. Positions are illustrative.</p>
      <h4>Building blocks (${nodes.size})</h4><div class="prods">${[...nodes].map(id => `<button class="pb" data-id="${id}">${h(PR[id].s)}</button>`).join('')}</div>
      <h4>How they connect (${links.length})</h4>
      <ol class="tl topo">${links.map((l, i) => `<li data-i="${i}" style="--c:#fff"><span class="n">${i + 1}</span><div><button class="p" data-id="${l[0]}">${h(PR[l[0]].s)}</button> ↔ <button class="p" data-id="${l[1]}">${h(PR[l[1]].s)}</button>
        <div>${h(l[2])}</div><div class="meta"><a href="${su(l[3])}" target="_blank" rel="noopener noreferrer">source</a></div></div></li>`).join('') || '<li>No relationship stated.</li>'}</ol></div>`;
    return;
  }
  if (S.mode === 'ind') {
    if (S.focus) { el.innerHTML = ucCard(S.focus.u); return; }
    const linked = PORTFOLIO.uc.filter(u => u.presets).length;
    el.innerHTML = `<div class="rhead"><h2>Industries</h2></div><div class="pad"><p>Pick a use case on the left. The scene keeps the products Cisco lists for it and fades the rest.</p>
      <p class="small" style="margin-top:8px">${PORTFOLIO.uc.length} use cases across ${PORTFOLIO.industries.length} industries, from Cisco’s Industries Portfolio Explorer, collected ${PORTFOLIO.collected}. ${linked} are linked to presets, a builder scenario and a topology; those links are chosen by this tool.</p>
      <div class="exlist" style="margin-top:10px">${PORTFOLIO.industries.map(i => `<button data-indgo="${i.id}"><span>${h(i.name)}</span><small>${PORTFOLIO.uc.filter(u => u.ind === i.id).length} use cases</small></button>`).join('')}</div></div>`;
    return;
  }
  if (!S.runs.length) { el.innerHTML = `<div class="rhead"><h2>Free explore</h2></div><div class="pad"><p>Select a product in the scene or the list to see what it does and which other products cisco.com says it works with.</p><p class="small" style="margin-top:8px">${Object.keys(PR).length} products · ${DATA.links.length} stated relationships · verified ${DATA.meta.verified}.</p></div>`; return; }
  el.innerHTML = `<div class="rhead"><h2>Result</h2>${S.compare && R.setSplit ? `<button class="btn" id="splitB" aria-pressed="${S.split}" title="Show the two scenarios side by side, each in its own view">Split view</button>` : ''}<button class="btn" id="cmpR" aria-pressed="${S.compare}">${S.compare ? 'Exit compare' : 'Compare'}</button><button class="btn" id="shareR">Copy link</button>${expMenu()}</div>${ctxHTML()}
    <div class="runs ${S.runs.length > 1 ? 'cmp' : ''}">${S.runs.map(runHTML).join('')}</div>`;
  markTimeline();
}
function markTimeline() { $$('.tl li').forEach(li => li.classList.toggle('unl', li.dataset.lens !== S.lens)); }
$('#right').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.id === 'shareR') return share();
  if (b.dataset.uc) return openUC(b.dataset.uc);
  if (b.dataset.ucpreset) return ucTry('preset', +b.dataset.ucpreset);
  if (b.hasAttribute('data-ucbuild')) return ucTry('build');
  if (b.hasAttribute('data-uctopo')) return ucTry('topo');
  if (b.hasAttribute('data-ctxclear')) { S.ctx = null; renderResults(); lastSig = ''; return writeHash(); }
  if (b.dataset.indgo) { S.ind = b.dataset.indgo; S.uc = null; renderLeft(); rerun(); if (matchMedia('(max-width:900px)').matches) sheet('left'); return; }
  if (b.dataset.ucind) { S.mode = 'ind'; S.ind = b.dataset.ucind; S.ucProd = b.dataset.ucprod; S.uc = null; S.ctx = null; S.selected = null; R.select(null); $('#detail').hidden = true; markTabs(); renderLeft(); rerun(); if (matchMedia('(max-width:900px)').matches) sheet('left'); return; }
  if (b.dataset.exp) { b.closest('details').open = false; return doExport(b.dataset.exp); }
  if (b.id === 'splitB') { S.split = !S.split; R.setSplit(S.split); b.setAttribute('aria-pressed', S.split); return writeHash(); }
  if (b.id === 'cmpR') { S.compare = !S.compare; S.active = 0; S.preset = 0; if (S.mode === 'presets') { S.mode = 'build'; $$('.modes button').forEach(x => x.setAttribute('aria-selected', x.dataset.mode === 'build')); } renderLeft(); return rerun(); }
  if (b.dataset.off) { S.off = S.off.includes(b.dataset.off) ? S.off.filter(k => k !== b.dataset.off) : [...S.off, b.dataset.off]; return rerun(); }
  if (b.dataset.offsuite) { const m = DATA.links.filter(l => l[4] === 'suite' && l[0] === b.dataset.offsuite).map(l => l[1]); S.off = [...new Set([...S.off, ...m])]; return rerun(); }
  if (b.hasAttribute('data-offclear')) { S.off = []; return rerun(); }
  if (b.classList.contains('x')) return select(null);
  if (b.dataset.sug) { const slot = +b.closest('.run').dataset.slot, r = S.runs.find(x => x.slot === slot); if (S.mode === 'presets') { S.mode = 'build'; $$('.modes button').forEach(x => x.setAttribute('aria-selected', x.dataset.mode === 'build')); } S.active = slot; return setScenario(slot, r.sug[+b.dataset.sug].s); }
  if (b.dataset.id) select(b.dataset.id, true);
});
$('#right').addEventListener('pointerover', e => { const li = e.target.closest('.topo li'); $$('.nchip.sel').forEach(x => x.classList.remove('sel')); if (li) { const c = $(`.nchip[data-i="${li.dataset.i}"]`); c && c.classList.add('sel'); } });


/* per-frame sync of DOM to playback progress (only when something changed) */
let lastSig = '';
function syncUI() {
  const sig = S.runs.map(r => r.pb.i + ':' + r.pb.done).join('|') + S.playing + S.lens;
  if (sig === lastSig) return; lastSig = sig;
  $('#bPlay').innerHTML = ico(S.playing ? 'pause' : 'play'); $('#bPlay').setAttribute('aria-label', S.playing ? 'Pause' : 'Play');
  $('#bPlay').classList.toggle('cue', !S.playing && S.runs.length > 0 && S.runs.every(r => r.pb.i === 0 && !r.pb.done));
  const co = [];
  for (const r of S.runs) {
    const P = prog(r), sec = $(`.run[data-slot="${r.slot}"]`);
    /* sound follows the playback: a blip per hop, a tone per checkpoint (pitched by lens), trust up or down, then the verdict */
    const sd = r.snd || (r.snd = { i: -1, k: -1, done: false }), stp = r.steps[r.pb.i];
    if (sd.i !== r.pb.i) { const prev = r.steps[sd.i]; if (prev && prev.t === 'move') VFX.fire('hop', { id: r.path[prev.e], color: LENS[S.lens].color, slot: r.slot });   /* arrival ring */
      sd.i = r.pb.i; if (stp && stp.t === 'move' && !P.done) SND.play('hop', stp.e); }
    if (P.cur >= 0 && P.cur !== sd.k) { sd.k = P.cur; const e = r.tl[P.cur];
      SND.play(PR[e.at].cat === 'splunk' ? 'splunk' : e.at === 'xdr' ? 'tele' : 'check', DATA.lenses.findIndex(l => l.id === e.lens));
      if (e.d > 0) SND.play('up'); else if (e.d < 0) SND.play('down'); SND.mood(e.trust);
      const hot = e.tele || e.at === 'xdr' || (e.v && SEV[e.v] >= SEV.STEPUP), sp = PR[e.at].cat === 'splunk';
      VFX.fire(hot ? 'detect' : 'check', { slot: r.slot, id: e.at, color: sp ? '#ff8a3d' : hot ? (e.v ? VCOL[e.v] : '#ff7a6b') : LENS[e.lens].color });
      if (e.d) VFX.fire('trust', { slot: r.slot, text: (e.d > 0 ? '+' : '') + e.d + ' trust', color: e.d > 0 ? '#5be3a4' : '#ff7a6b' });
      if (e.v && SEV[e.v] >= SEV.STEPUP) VFX.fire('pop', { slot: r.slot, id: e.at, text: DATA.verdicts[e.v].label, color: VCOL[e.v] }); }
    if (P.done && !sd.done) { sd.done = true; SND.mood(r.trust); const first = r.slot === S.runs[0].slot, sp2 = R.isSplit && R.isSplit();
      if (first) { SND.play(r.verdict); VFX.stamp(r.verdict); } else if (sp2) { setTimeout(() => SND.play(r.verdict), 520); VFX.stamp(r.verdict, true); }   /* split view: the right-hand scenario gets its own stamp and sound */
      VFX.fire('verdict', { slot: r.slot, v: r.verdict, id: r.stopAt >= 0 ? r.path[r.stopAt] : r.verdict === 'CONTAIN' ? r.path[0] : r.path[r.path.length - 1] }); }
    if (!sec) continue;
    sec.classList.toggle('pending', !P.done);
    $('.prog', sec).textContent = `checkpoint ${Math.max(0, P.k + 1)} of ${r.tl.length}`;
    $$('.tl li', sec).forEach(li => { const k = +li.dataset.k; li.classList.toggle('dim', k > P.k); li.classList.toggle('cur', k === P.cur); });
    $$('.sig li, .graph circle', sec).forEach(li => li.classList.toggle('dim', +li.dataset.k > P.k));
    const e = r.tl[P.cur >= 0 ? P.cur : -1];
    if (e) co.push(`<div class="co" style="--c:${LENS[e.lens].color}">${S.runs.length > 1 ? `<em>${'AB'[r.slot]}</em>` : ''}<b>${h(PR[e.at].s)}</b> · ${h(e.c)}<br>${h(e.r)}${e.v ? ' ' + vchip(e.v) : ''}</div>`);
    else if (P.done) co.push(`<div class="co v-${r.verdict}" style="--c:var(--vc)">${S.runs.length > 1 ? `<em>${'AB'[r.slot]}</em>` : ''}<b>${DATA.verdicts[r.verdict].label}</b> · ${h(r.why)}</div>`);
  }
  $('#callout').innerHTML = co.join('');
}

/* ---- product / place detail ---- */
function select(id, focusCam) {
  S.selected = id; const el = $('#detail');
  R && R.select(id);
  if (!id) { el.hidden = true; writeHash(); return; }
  SND.play('select'); VFX.fire('select', { id });
  if (PR[id]) {
    const p = PR[id];
    const conn = DATA.links.filter(l => l[0] === id || l[1] === id).map(l => ({ o: l[0] === id ? l[1] : l[0], rel: l[2], src: l[3] }));
    const srcUrl = srcOf;
    el.innerHTML = `<button class="x" aria-label="Close detail">×</button><div class="cat">${h(DATA.categories[p.cat])}</div><h3>${h(p.name)}</h3><p>${h(p.fn)}</p>
      ${p.note ? `<p class="small">${h(p.note)}</p>` : ''}
      <dl><dt>Zone</dt><dd>${h(DATA.zones.find(z => z.id === p.zone).label)}</dd>
      <dt>Lenses</dt><dd><div class="lchips">${Object.entries(p.roles).map(([l, t]) => `<span style="--c:${LENS[l].color}" title="${h(t)}">${LENS[l].label}: ${h(t)}</span>`).join('') || '<span style="--c:#7385aa">Licensing suite — no runtime role</span>'}</div></dd>
      ${p.cvd ? `<dt>Cisco Validated and design references</dt><dd class="cvdl">${p.cvd.map(CVDL).join('')}</dd>` : ''}
      <dt>Industry use cases</dt><dd>${(() => { const named = PORTFOLIO.uc.filter(u => u.prods.includes(id)), umb = id === 'sa' ? named.filter(u => u.umb).length : 0;
        return named.length ? `Named in ${named.length} of ${PORTFOLIO.uc.length} Cisco industry use cases.${umb ? ` ${umb} of them list Umbrella, counted here as Secure Access.` : ''}<div class="prods" style="margin-top:4px">${PORTFOLIO.industries.map(i => [i, named.filter(u => u.ind === i.id).length]).filter(x => x[1]).map(([i, c]) => `<button class="pb" data-ucind="${i.id}" data-ucprod="${id}" title="Show the ${h(i.name)} use cases that name ${h(p.s)}">${h(i.name)} ${c}</button>`).join('')}</div>` : '<span class="small">Not named in Cisco’s industry portfolio.</span>'; })()}</dd>
      <dt>Works with</dt><dd class="conn">${conn.map(c => `<div class="row"><button data-id="${c.o}">${h(PR[c.o].s)}</button> <small>— ${h(c.rel)} (<a href="${srcUrl(c.src)}" target="_blank" rel="noopener noreferrer">source</a>)</small></div>`).join('') || '<span class="small">No relationship stated on the pages reviewed.</span>'}</dd></dl>
      <a class="src" href="${p.url}" target="_blank" rel="noopener noreferrer">Source: ${new URL(p.url).host.replace('www.', '')} ↗</a><p class="small">Verified ${DATA.meta.verified}.</p>`;
  } else {
    const p = PL[id];
    el.innerHTML = `<button class="x" aria-label="Close detail">×</button><div class="cat">${{ loc: 'Location', infra: 'Network infrastructure' }[p.kind] || 'Destination'}</div><h3>${h(p.name)}</h3><p>${h(p.fn)}</p><p class="small">Scene element, not a product.</p>`;
  }
  el.hidden = false; $('#right').scrollTop = 0;
  if (document.body.classList.contains('full')) setFullPanel('right', true);   /* a selected product needs its panel */
  else if (matchMedia('(max-width:900px)').matches) sheet('right');
  if (focusCam && R) R.focus(id);
  writeHash();
}
function tip(id, x, y) {
  const t = $('#tip'); if (!id) { t.hidden = true; return; }
  const p = PR[id] || PL[id];
  t.innerHTML = `<b>${h(p.name)}</b><span>${h(p.fn)}</span>${PR[id] && p.roles[S.lens] ? `<br><span style="color:var(--lens)">${LENS[S.lens].label}: ${h(p.roles[S.lens])}</span>` : ''}`;
  t.hidden = false; const st = $('#stage').getBoundingClientRect();
  t.style.left = clamp(x + 14, 4, st.width - t.offsetWidth - 4) + 'px'; t.style.top = clamp(y + 14, 4, st.height - t.offsetHeight - 4) + 'px';
}
function sheet(n) { document.body.dataset.sheet = n; $$('#mobnav button').forEach(b => b.setAttribute('aria-pressed', b.dataset.sheet === n));
  if (document.body.classList.contains('full') && matchMedia('(max-width:900px)').matches) {   /* keep the full-screen tabs in step with the open sheet */
    document.body.classList.toggle('fl', n === 'left'); document.body.classList.toggle('fr', n === 'right');
    $('#fullL').setAttribute('aria-pressed', n === 'left'); $('#fullR').setAttribute('aria-pressed', n === 'right'); } }

/* ---- full screen: the scene fills the window (side panels and footer hidden) and the browser goes full screen where it is allowed.
   In viewers that block the Fullscreen API the layout still expands to the whole window. ---- */
/* side panels inside full screen: docked beside the scene on desktop, bottom sheets on phones */
function setFullPanel(side, on) {
  const cls = side === 'left' ? 'fl' : 'fr', phone = matchMedia('(max-width:900px)').matches;
  if (phone) return sheet(on ? side : 'none');
  document.body.classList.toggle(cls, on);
  $('#fullL').setAttribute('aria-pressed', document.body.classList.contains('fl')); $('#fullR').setAttribute('aria-pressed', document.body.classList.contains('fr'));
}
const fullPanel = side => document.body.classList.contains(side === 'left' ? 'fl' : 'fr');
function setFull(on) {
  if (!on) { document.body.classList.remove('fl', 'fr'); $('#fullL').setAttribute('aria-pressed', false); $('#fullR').setAttribute('aria-pressed', false); }
  document.body.classList.toggle('full', on); const b = $('#bFull'); b.setAttribute('aria-pressed', on); b.setAttribute('aria-label', on ? 'Exit full screen' : 'Full screen'); b.innerHTML = ico(on ? 'unfull' : 'full');
  if (on) { sheet('none'); try { const el = document.documentElement, p = (el.requestFullscreen || el.webkitRequestFullscreen || (() => { })).call(el); if (p && p.catch) p.catch(() => { }); } catch (e) { } }
  else if (document.fullscreenElement || document.webkitFullscreenElement) { try { const p = (document.exitFullscreen || document.webkitExitFullscreen).call(document); if (p && p.catch) p.catch(() => { }); } catch (e) { } }
  if (S.view === 'orbit' && !S.topo) setTimeout(() => R.resetView(), 180);   /* re-fit the scene to the new stage size */
}
/* ---- guided tour ---- */
const TOUR_ACT = {
  start() { setView('orbit', true); if (S.mode !== 'presets') setMode('presets'); loadPreset(1); },
  presets() { if (S.mode !== 'presets') setMode('presets'); if (!S.runs.length) loadPreset(1); },
  restart() { TOUR_ACT.presets(); restart(); lastSig = ''; },
  lens() { TOUR_ACT.presets(); setLens('trust'); },
  finish() { TOUR_ACT.presets(); finish(); lastSig = ''; syncUI(); },
  build() { setMode('build'); },
  topo() { setMode('topo'); },
  ind() { openUC('MAN1E', true); }
};
const TOUR = { i: -1 };
function tourPlace() {
  if (TOUR.i < 0) return; const st = DATA.tour[TOUR.i], el = $(st.sel), spot = $('#tourSpot'), card = $('#tourCard'), vw = innerWidth, vh = innerHeight;
  const r = el ? el.getBoundingClientRect() : { left: vw / 2 - 1, top: vh / 2 - 1, width: 2, height: 2, right: vw / 2 + 1, bottom: vh / 2 + 1 };
  const x0 = Math.max(4, r.left - 5), y0 = Math.max(4, r.top - 5), x1 = Math.min(vw - 4, r.right + 5), y1 = Math.min(vh - 4, r.bottom + 5);
  Object.assign(spot.style, { left: x0 + 'px', top: y0 + 'px', width: x1 - x0 + 'px', height: y1 - y0 + 'px' });
  const cw = card.offsetWidth, ch = card.offsetHeight, g = 12; let x, y;   /* put the card beside the spotlight where there is room, otherwise over its lower part */
  if (vw - x1 >= cw + g) { x = x1 + g; y = y0; } else if (x0 >= cw + g) { x = x0 - cw - g; y = y0; } else if (vh - y1 >= ch + g) { x = x0; y = y1 + g; } else if (y0 >= ch + g) { x = x0; y = y0 - ch - g; } else { x = (x0 + x1 - cw) / 2; y = y1 - ch - g; }
  card.style.left = clamp(x, 8, vw - cw - 8) + 'px'; card.style.top = clamp(y, 8, vh - ch - 8) + 'px';
}
function tourGo(i) {
  if (document.body.classList.contains('full')) setFull(false);   /* the tour points at the side panels */
  const n = DATA.tour.length; if (i < 0) i = 0; if (i >= n) return tourEnd();
  TOUR.i = i; const st = DATA.tour[i]; $('#tourHint').hidden = true; if (st.act) TOUR_ACT[st.act]();
  if (matchMedia('(max-width:900px)').matches) sheet(st.sheet || 'none');
  const el = $(st.sel); if (el && el.closest('.panel') && el.scrollIntoView && !el.classList.contains('panel')) el.scrollIntoView({ block: 'center' });
  $('#tourN').textContent = `Tour · ${i + 1} of ${n}`; $('#tourH').textContent = st.t; $('#tourX').textContent = st.x;
  $('#tourBack').disabled = i === 0; $('#tourNext').textContent = i === n - 1 ? 'Finish' : 'Next';
  $('#tourSpot').hidden = false; $('#tourCard').hidden = false; tourPlace(); setTimeout(tourPlace, 320); $('#tourNext').focus(); SND.play('select');
}
function tourEnd() { TOUR.i = -1; $('#tourSpot').hidden = true; $('#tourCard').hidden = true; try { localStorage.setItem('ln-tour', '1'); } catch (e) { } if (matchMedia('(max-width:900px)').matches) sheet('none'); }

/* ---- export: printable report, scene image, Markdown, JSON ---- */
const stamp = () => new Date().toISOString().slice(0, 10);
function download(name, mime, data) {
  try { const url = typeof data === 'string' && data.startsWith('data:') ? data : URL.createObjectURL(new Blob([data], { type: mime })); const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    if (!url.startsWith('data:')) setTimeout(() => URL.revokeObjectURL(url), 4000); toast('Saved ' + name); return true; } catch (e) { toast('This viewer blocks downloads. Open the page directly to export.'); return false; }
}
const scenLine = r => [opt('who', r.s.who).short, opt('device', r.s.device).short, opt('loc', r.s.loc).short, '→ ' + opt('dest', r.s.dest).short, ...r.s.beh.map(b => opt('beh', b).label)].join(' · ');
function srcOf(k) { return PR[k] ? PR[k].url : DATA.sources[k] || (DATA.cvd[k] && DATA.cvd[k][1]); }
function exportData() {
  if (S.focus) { const { u, nodes, links } = S.focus; return { kind: 'usecase', generated: stamp(), link: S.hash, industry: INDN[u.ind], code: u.code, useCase: u.name, summary: u.desc, source: PORTFOLIO.source, collected: PORTFOLIO.collected,
    products: [...nodes].map(k => ({ name: PR[k].name, source: PR[k].url })), alsoListed: u.other.map(i => PORTFOLIO.names[i]), umbrellaNote: u.umb ? UMB_NOTE : null,
    relationships: links.map(l => ({ a: PR[l[0]].name, b: PR[l[1]].name, relationship: l[2], source: srcOf(l[3]) })),
    sections: UC_BLOCKS.filter(([k]) => u[k]).map(([k, t]) => ({ title: t, items: u[k] })), services: u.svc.map(i => PORTFOLIO.services[i]),
    scenarios: u.presets ? { presets: u.presets.map(n => ({ number: n, title: presetOf(n).t })), builder: buildLine(u.build), topology: archOf(u.arch).name } : null,
    note: 'Use case text and product lists are Cisco’s. Scenario links are chosen by this tool. ' + DATA.meta.sceneLabel }; }
  if (S.topo) { const { a, nodes, links } = S.topo; return { kind: 'topology', generated: stamp(), architecture: a.name, summary: a.blurb, source: a.src ? srcOf(a.src) : null,
    products: [...nodes].map(k => ({ name: PR[k].name, source: PR[k].url })), relationships: links.map(l => ({ a: PR[l[0]].name, b: PR[l[1]].name, relationship: l[2], source: srcOf(l[3]) })), note: DATA.meta.sceneLabel }; }
  return { kind: 'scenario', generated: stamp(), link: S.hash, note: DATA.meta.verdictNote, runs: S.runs.map(r => ({ label: S.runs.length > 1 ? 'AB'[r.slot] : '', scenario: scenLine(r), pickers: r.s, verdict: DATA.verdicts[r.verdict].label, reason: r.why,
    removedControls: r.off.map(k => PR[k].name), verdictWithAllControls: r.base ? DATA.verdicts[r.base.verdict].label : null, path: r.path.map(nodeName), stoppedAt: r.stopAt >= 0 ? nodeName(r.path[r.stopAt]) : null,
    trust: r.series.map(p => ({ signal: p.sig, change: p.d, score: p.v })), timeline: r.tl.map((e, k) => ({ step: k + 1, product: PR[e.at].name, at: e.hop ? nodeName(e.hop) : 'after the path', check: e.c, result: e.r, lens: LENS[e.lens].label, trustChange: e.d, trust: e.trust, verdict: e.v ? DATA.verdicts[e.v].label : null })),
    products: r.products.map(k => ({ name: PR[k].name, source: PR[k].url })) })) };
}
function exportMarkdown() {
  const d = exportData(), o = [`# Living Network — ${d.kind === 'topology' ? d.architecture : d.kind === 'usecase' ? d.industry + ': ' + d.useCase : 'scenario report'}`, '', `Generated ${d.generated}. ${DATA.meta.footer.replace('{date}', DATA.meta.verified)}`, ''];
  if (d.kind === 'usecase') {
    o.push(d.summary, '', `Source: ${d.source} (collected ${d.collected})`, '', '## Products Cisco lists for this use case', '', '### In this scene', '', ...d.products.map(p => `- ${p.name} — ${p.source}`), '');
    if (d.umbrellaNote) o.push(d.umbrellaNote, '');
    if (d.alsoListed.length) o.push('### Also listed by Cisco, not in this scene', '', ...d.alsoListed.map(n => `- ${n}`), '');
    o.push('## Stated relationships among these products', '', '| # | A | B | Stated relationship | Source |', '|---|---|---|---|---|', ...d.relationships.map((r, i) => `| ${i + 1} | ${r.a} | ${r.b} | ${r.relationship} | ${r.source} |`), '');
    for (const s of d.sections) o.push(`## ${s.title}`, '', ...s.items.map(x => `- ${x}`), '');
    if (d.services.length) o.push('## Cisco services', '', ...d.services.map(x => `- ${x}`), '');
    if (d.scenarios) o.push('## Scenarios in this tool', '', ...d.scenarios.presets.map(p => `- Preset ${p.number}: ${p.title}`), `- Builder: ${d.scenarios.builder}`, `- Topology: ${d.scenarios.topology}`, '');
    o.push(`_${d.note}_`); return o.join('\n');
  }
  if (d.kind === 'topology') { o.push(d.summary, '', d.source ? `Source: ${d.source}` : '', '', '## Building blocks', '', ...d.products.map(p => `- ${p.name} — ${p.source}`), '', '## How they connect', '', '| # | A | B | Stated relationship | Source |', '|---|---|---|---|---|', ...d.relationships.map((r, i) => `| ${i + 1} | ${r.a} | ${r.b} | ${r.relationship} | ${r.source} |`), '', `_${d.note}_`); }
  else for (const r of d.runs) { o.push(`## Scenario ${r.label}`.trim(), '', r.scenario, '', `**Verdict: ${r.verdict}** — ${r.reason}`, '', `_${d.note}_`, '');
    if (r.removedControls.length) o.push(`Removed controls (illustrative): ${r.removedControls.join(', ')}. With all controls: ${r.verdictWithAllControls}.`, '');
    o.push(`Path: ${r.path.join(' → ')}${r.stoppedAt ? ` (stopped at ${r.stoppedAt})` : ''}`, '', '### Trust level (illustrative)', '', '| Signal | Change | Level |', '|---|---|---|', ...r.trust.map(t => `| ${t.signal} | ${t.change > 0 ? '+' : ''}${t.change || '·'} | ${t.score} |`), '',
      '### Decision timeline', '', '| # | Product | Where | Check | Result | Lens | Trust | Verdict |', '|---|---|---|---|---|---|---|---|', ...r.timeline.map(e => `| ${e.step} | ${e.product} | ${e.at} | ${e.check} | ${e.result} | ${e.lens} | ${e.trustChange ? (e.trustChange > 0 ? '+' : '') + e.trustChange + ' → ' + e.trust : ''} | ${e.verdict || ''} |`), '',
      '### Products involved', '', ...r.products.map(p => `- ${p.name} — ${p.source}`), ''); }
  return o.join('\n');
}
function reportHTML(img) {
  const d = exportData(), tb = (head, rows) => `<table><tr>${head.map(x => `<th>${h(x)}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(x => `<td>${h(x)}</td>`).join('')}</tr>`).join('')}</table>`;
  let s = `<h1>Living Network — ${d.kind === 'topology' ? h(d.architecture) : d.kind === 'usecase' ? h(d.industry + ': ' + d.useCase) : 'scenario report'}</h1><p>Generated ${d.generated} · ${h(DATA.meta.sceneLabel)}</p>${img ? `<img src="${img}" alt="Scene">` : ''}`;
  if (d.kind === 'topology') s += `<p>${h(d.summary)}</p>${d.source ? `<p>Source: <a href="${d.source}">${h(d.source)}</a></p>` : ''}<h2>Building blocks</h2>${tb(['Product', 'Source'], d.products.map(p => [p.name, p.source]))}<h2>How they connect</h2>${tb(['#', 'A', 'B', 'Stated relationship', 'Source'], d.relationships.map((r, i) => [i + 1, r.a, r.b, r.relationship, r.source]))}`;
  else if (d.kind === 'usecase') s += `<p>${h(d.summary)}</p><p>Source: <a href="${d.source}">${h(d.source)}</a> (collected ${d.collected})</p><h2>Products Cisco lists for this use case</h2>${tb(['In this scene', 'Source'], d.products.map(p => [p.name, p.source]))}
    ${d.umbrellaNote ? `<p>${h(d.umbrellaNote)}</p>` : ''}${d.alsoListed.length ? `<p><b>Also listed by Cisco, not in this scene:</b> ${h(d.alsoListed.join(' · '))}</p>` : ''}
    <h2>Stated relationships among these products</h2>${tb(['#', 'A', 'B', 'Stated relationship', 'Source'], d.relationships.map((r, i) => [i + 1, r.a, r.b, r.relationship, r.source]))}
    ${d.sections.map(x => `<h2>${h(x.title)}</h2><ul>${x.items.map(i => `<li>${h(i)}</li>`).join('')}</ul>`).join('')}${d.services.length ? `<h2>Cisco services</h2><p>${h(d.services.join(' · '))}</p>` : ''}
    ${d.scenarios ? `<h2>Scenarios in this tool</h2><ul>${d.scenarios.presets.map(p => `<li>Preset ${p.number}: ${h(p.title)}</li>`).join('')}<li>Builder: ${h(d.scenarios.builder)}</li><li>Topology: ${h(d.scenarios.topology)}</li></ul>` : ''}<p><i>${h(d.note)}</i></p>`;
  else for (const r of d.runs) s += `<h2>Scenario ${r.label}</h2><p>${h(r.scenario)}</p><div class="vd"><b>${h(r.verdict)}</b><p>${h(r.reason)}</p><p><i>${h(d.note)}</i></p></div>
    ${r.removedControls.length ? `<p>Removed controls (illustrative): ${h(r.removedControls.join(', '))}. With all controls: ${h(r.verdictWithAllControls)}.</p>` : ''}
    <p>Path: ${h(r.path.join(' → '))}${r.stoppedAt ? ` (stopped at ${h(r.stoppedAt)})` : ''}</p>
    <h3>Trust level (illustrative)</h3>${tb(['Signal', 'Change', 'Level'], r.trust.map(t => [t.signal, t.change ? (t.change > 0 ? '+' : '') + t.change : '·', t.score]))}
    <h3>Decision timeline</h3>${tb(['#', 'Product', 'Where', 'Check', 'Result', 'Lens', 'Trust', 'Verdict'], r.timeline.map(e => [e.step, e.product, e.at, e.check, e.result, e.lens, e.trustChange ? (e.trustChange > 0 ? '+' : '') + e.trustChange + ' → ' + e.trust : '', e.verdict || '']))}
    <h3>Products involved</h3>${tb(['Product', 'Source'], r.products.map(p => [p.name, p.source]))}`;
  return s + `<p class="fine">${h(DATA.meta.footer.replace('{date}', DATA.meta.verified))}${d.link ? ' Scenario link: index.html' + h(d.link) : ''}</p>`;
}
function doExport(kind) {
  const base = 'living-network-' + (S.topo ? S.topo.a.id : S.focus ? 'usecase-' + S.focus.u.code : 'scenario') + '-' + stamp(), snap = R.snapshot ? R.snapshot() : null;
  if (kind === 'json') return download(base + '.json', 'application/json', JSON.stringify(exportData(), null, 2));
  if (kind === 'md') return download(base + '.md', 'text/markdown', exportMarkdown());
  if (kind === 'png') return snap ? download(base + '.png', 'image/png', snap.toDataURL('image/png')) : toast('The scene image needs the 3D view.');
  $('#report').innerHTML = reportHTML(snap ? snap.toDataURL('image/jpeg', .9) : null);
  const im = $('#report img'), go = () => { try { window.print(); } catch (e) { toast('This viewer blocks printing. Open the page directly to export a PDF.'); } };
  if (im && !im.complete) im.onload = go; else setTimeout(go, 60);
}
const expMenu = () => `<details class="exp"><summary class="btn" id="exportB">Export</summary><div class="menu">
  <button data-exp="pdf">Print / save as PDF<small>Full report with the scene image</small></button><button data-exp="png">Scene image (PNG)<small>The current view with its labels</small></button>
  <button data-exp="md">Report (Markdown)<small>Tables you can paste into a document</small></button><button data-exp="json">Data (JSON)<small>Path, timeline and trust series</small></button></div></details>`;

/* ---- search ---- */
function doSearch() {
  const q = $('#q').value.trim().toLowerCase(), cat = $('#qcat').value, box = $('#qres');
  const hits = Object.entries(PR).filter(([, p]) => (!cat || p.cat === cat) && (!q || (p.name + ' ' + p.s + ' ' + p.fn + ' ' + DATA.categories[p.cat]).toLowerCase().includes(q)));
  S.filter = (q || cat) ? new Set(hits.map(([id]) => id)) : null; R && R.setFilter(S.filter || (S.topo ? S.topo.nodes : S.focus && S.focus.nodes));
  if (!q && !cat) { box.hidden = true; return; }
  box.innerHTML = hits.length ? hits.slice(0, 12).map(([id, p]) => `<button data-id="${id}">${h(p.name)}<small>${h(DATA.categories[p.cat])}</small></button>`).join('') : '<button disabled>No product matches</button>';
  box.hidden = false;
}


/* =====================================================================================
   BOOT
   ===================================================================================== */
window.__select = (id, cam) => select(id, cam);
async function boot() {
  $('#foot').textContent = DATA.meta.footer.replace('{date}', DATA.meta.verified);
  $('#lenses').innerHTML = DATA.lenses.map((l, i) => `<button role="radio" data-lens="${l.id}" style="--c:${l.color}" aria-checked="false" title="${h(l.blurb)}"><i></i>${l.label}<kbd>${i + 1}</kbd></button>`).join('');
  $('#qcat').innerHTML = '<option value="">All categories</option>' + Object.entries(DATA.categories).map(([k, v]) => `<option value="${k}">${h(v)}</option>`).join('');
  for (const [id, n] of [['bRestart', 'restart'], ['bPlay', 'play'], ['bStep', 'step'], ['bEnd', 'end'], ['bView', 'view'], ['bFull', 'full']]) $('#' + id).innerHTML = ico(n);

  const forceSvg = /render=svg/.test(location.search + location.hash);
  if (!forceSvg) {
    try {
      const THREE = await import('three'); const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
      let PP = null;   /* optional: bloom. The scene works without these modules. */
      try { const b = 'three/addons/postprocessing/', [a1, a2, a3, a4] = await Promise.all([import(b + 'EffectComposer.js'), import(b + 'RenderPass.js'), import(b + 'UnrealBloomPass.js'), import(b + 'OutputPass.js')]);
        PP = { EffectComposer: a1.EffectComposer, RenderPass: a2.RenderPass, UnrealBloomPass: a3.UnrealBloomPass, OutputPass: a4.OutputPass }; } catch (e) { }
      R = createGL(THREE, OrbitControls, PP);
    } catch (err) { console.warn('3D view unavailable, using 2D fallback:', err && err.message); R = null; }
  }
  if (!R) R = createSVG();

  const hadHash = readHash();
  $$('.modes button').forEach(b => b.setAttribute('aria-selected', b.dataset.mode === S.mode));
  setLens(S.lens);
  if (!hadHash) loadPreset(1); else { renderLeft(); rerun(); if (S.selected) select(S.selected, false); }

  /* events */
  $('#lenses').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { setLens(b.dataset.lens); writeHash(); } });
  $('#labels').addEventListener('click', e => { const b = e.target.closest('.lbl[data-id]'); if (b) select(b.dataset.id, false); });
  $('#labels').addEventListener('pointerover', e => { const b = e.target.closest('.lbl[data-id]'); if (b) { const r = b.getBoundingClientRect(), s = $('#stage').getBoundingClientRect(); tip(b.dataset.id, r.left - s.left, r.bottom - s.top - 8); } });
  $('#labels').addEventListener('pointerout', () => tip(null));
  $('#labels').addEventListener('focusin', e => { const b = e.target.closest('.lbl[data-id]'); if (b) { const r = b.getBoundingClientRect(), s = $('#stage').getBoundingClientRect(); tip(b.dataset.id, r.left - s.left, r.bottom - s.top - 8); } });
  $('#labels').addEventListener('focusout', () => tip(null));
  $('#bPlay').onclick = () => { if (S.runs.every(r => r.pb.done)) restart(); else S.playing = !S.playing; lastSig = ''; };
  $('#bRestart').onclick = () => { restart(); lastSig = ''; };
  $('#bStep').onclick = () => { stepOnce(); lastSig = ''; };
  $('#bEnd').onclick = () => { finish(); lastSig = ''; };
  const autoUI = () => $('#bAuto').setAttribute('aria-pressed', S.autoplay);
  $('#bAuto').onclick = () => { S.autoplay = !S.autoplay; try { localStorage.setItem('ln-autoplay', S.autoplay ? '1' : '0'); } catch (e) { } autoUI(); toast(S.autoplay ? 'Auto-play on: a chosen scenario starts at once' : 'Auto-play off: press Play to start a scenario'); };
  autoUI();
  $('#bView').onclick = () => { setView('orbit'); R.resetView(); };
  $('#viewSel').onchange = e => setView(e.target.value);
  $('#gl').addEventListener('ln-handover', () => setView('orbit'));
  let warOn = true; try { warOn = localStorage.getItem('ln-fog') !== '0'; } catch (e) { }
  const warUI = () => { $('#warT').setAttribute('aria-pressed', warOn); R.setFogWar && R.setFogWar(warOn); };
  $('#warT').onclick = () => { warOn = !warOn; try { localStorage.setItem('ln-fog', warOn ? '1' : '0'); } catch (e) { } warUI(); toast('Fog of war ' + (warOn ? 'on: in the follow views only what the actor has reached is visible' : 'off')); };
  warUI();
  if (R.kind === 'svg') $('#viewSel').title = 'In the 2D view, 3rd and 1st person both follow the actor';
  setView(S.view, true);
  /* sound switches; the audio context can only start from a user gesture */
  const sndUI = () => { $('#sndT').setAttribute('aria-pressed', SND.st.sfx); $('#musT').setAttribute('aria-pressed', SND.st.music); };
  $('#sndT').onclick = () => { SND.setSfx(!SND.st.sfx); sndUI(); toast('Sound effects ' + (SND.st.sfx ? 'on' : 'off')); };
  $('#musT').onclick = () => { SND.setMusic(!SND.st.music); sndUI(); toast('Ambient music ' + (SND.st.music ? 'on: it follows the session trust level' : 'off')); };
  sndUI();
  const wake = () => { if (SND.st.sfx || SND.st.music) SND.init(); };
  document.addEventListener('pointerdown', wake, { capture: true }); document.addEventListener('keydown', wake, { capture: true });
  document.addEventListener('click', e => { if (e.target.closest('button, .chip, select') && !e.target.closest('#sndT, #musT')) SND.play('ui'); }, { capture: true });
  $('#bFull').onclick = () => setFull(!document.body.classList.contains('full'));
  $('#fullL').onclick = () => setFullPanel('left', !fullPanel('left')); $('#fullR').onclick = () => setFullPanel('right', !fullPanel('right'));
  for (const ev of ['fullscreenchange', 'webkitfullscreenchange']) document.addEventListener(ev, () => { if (!(document.fullscreenElement || document.webkitFullscreenElement) && document.body.classList.contains('full')) setFull(false); });   /* Esc in the browser's own full screen */
  $('#tourT').onclick = () => tourGo(0); $('#tourStart').onclick = () => tourGo(0);
  $('#tourNo').onclick = () => { $('#tourHint').hidden = true; try { localStorage.setItem('ln-tour', '1'); } catch (e) { } };
  $('#tourNext').onclick = () => tourGo(TOUR.i + 1); $('#tourBack').onclick = () => tourGo(TOUR.i - 1); $('#tourSkip').onclick = tourEnd;
  window.addEventListener('resize', tourPlace);
  { let seen = false; try { seen = !!localStorage.getItem('ln-tour'); } catch (e) { } if (!seen && !hadHash) $('#tourHint').hidden = false; }
  $('#fxT').onclick = () => { VFX.set(!VFX.st.on); R.setGfx && R.setGfx(VFX.st.on); $('#fxT').setAttribute('aria-pressed', VFX.st.on); toast('Visual effects ' + (VFX.st.on ? 'on' : 'off')); }; $('#fxT').setAttribute('aria-pressed', VFX.st.on); R.setGfx && R.setGfx(VFX.st.on);
  $('#spT').onclick = () => setSplunk(!S.splunk); $('#spT').setAttribute('aria-pressed', S.splunk); $('#spT').textContent = S.splunk ? 'Splunk layer: on' : 'Splunk layer: off';
  $('#speed').onchange = e => S.speed = +e.target.value;
  $('#q').addEventListener('input', doSearch); $('#qcat').addEventListener('change', doSearch);
  $('#q').addEventListener('keydown', e => { if (e.key === 'Enter') { const f = $('#qres button[data-id]'); if (f) f.click(); } if (e.key === 'Escape') { $('#q').value = ''; doSearch(); } });
  $('#qres').addEventListener('click', e => { const b = e.target.closest('button[data-id]'); if (b) { select(b.dataset.id, true); $('#qres').hidden = true; } });
  document.addEventListener('click', e => { if (!e.target.closest('.search')) $('#qres').hidden = true; });
  $('#mobnav').addEventListener('click', e => { const b = e.target.closest('button'); if (b) sheet(document.body.dataset.sheet === b.dataset.sheet ? 'none' : b.dataset.sheet); });
  document.addEventListener('keydown', e => {
    const t = e.target, typing = t.matches('input,select,textarea');
    if (TOUR.i >= 0) {   /* the tour owns the keyboard while it is open */
      if (e.key === 'Escape') return tourEnd(); if (e.key === 'ArrowRight') { e.preventDefault(); return tourGo(TOUR.i + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); return tourGo(TOUR.i - 1); }
      if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Tab') return;
      return; }
    if (e.key === 'Escape') { if (document.body.classList.contains('full')) setFull(false); else if (S.selected) select(null); else sheet('none'); return; }
    if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
    if (!t.closest('.panel') && !t.closest('#top')) {   /* camera from the keyboard: arrows rotate, Shift+arrows pan, + and - zoom, 0 resets */
      const ar = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
      if (ar && R.nudge) { if (e.shiftKey ? R.nudge('pan', -ar[0], ar[1]) : R.nudge('rot', -ar[0] * .12, ar[1] * .08)) e.preventDefault(); return; }
      if ((e.key === '+' || e.key === '=') && R.nudge) { R.nudge('zoom', 1.18); return; }
      if ((e.key === '-' || e.key === '_') && R.nudge) { R.nudge('zoom', 1 / 1.18); return; }
      if (e.key === '0') { $('#bView').click(); return; }
    }
    if (e.key === 'f' || e.key === 'F') { setFull(!document.body.classList.contains('full')); return; }
    if ((e.key === '[' || e.key === ']') && document.body.classList.contains('full')) { const sd = e.key === '[' ? 'left' : 'right'; setFullPanel(sd, !fullPanel(sd)); return; }
    if (e.key === 't' || e.key === 'T') { tourGo(0); return; }
    if (e.key === 'x' || e.key === 'X') { $('#fxT').click(); return; }
    if (e.key === 'm' || e.key === 'M') { $('#sndT').click(); return; }
    if (e.key === 'n' || e.key === 'N') { $('#musT').click(); return; }
    if (e.key === 'l' || e.key === 'L') { setSplunk(!S.splunk); return; }
    if (e.key === 'g' || e.key === 'G') { $('#warT').click(); return; }
    if (e.key === 'v' || e.key === 'V') { setView({ orbit: 'third', third: 'first', first: 'orbit' }[S.view]); return; }
    if (e.key >= '1' && e.key <= '5') { setLens(DATA.lenses[+e.key - 1].id); writeHash(); return; }
    if (e.key === ' ' && (!t.matches('button,a,[role=button]') || t.matches('.lbl,.n'))) { e.preventDefault(); $('#bPlay').click(); }
  });
  window.addEventListener('hashchange', () => { if (readHash()) { setView(S.view, true); $('#spT').setAttribute('aria-pressed', S.splunk); $('#spT').textContent = S.splunk ? 'Splunk layer: on' : 'Splunk layer: off'; $$('.modes button').forEach(b => b.setAttribute('aria-selected', b.dataset.mode === S.mode)); setLens(S.lens); renderLeft(); rerun(); } });

  /* render loop: paused while the tab is hidden */
  let last = performance.now(), raf = 0;
  const loop = now => { raf = requestAnimationFrame(loop); const dt = Math.min(120, now - last); last = now; if (S.playing) advance(dt); R.frame(now); syncUI(); };
  document.addEventListener('visibilitychange', () => { SND.hidden(document.hidden); cancelAnimationFrame(raf); if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } });
  raf = requestAnimationFrame(loop);
  /* test / automation hook: engine only, no network */
  window.__LN = { DATA, PORTFOLIO, UC, openUC, ucTry, S, SND, VFX, setFull, TOUR, tourGo, tourEnd, exportData, exportMarkdown, reportHTML, doExport, setSplunk, setView, topoOf, evaluate, normalize, blocked, suggestions, loadPreset, setLens, setMode, finish, restart, prog, renderer: () => R.kind, R };
}
boot();

/* =====================================================================================
   VISUAL EFFECTS — game-style feedback for hops, checks, detections, trust changes and verdicts.
   World effects (rings, sparks, shields, pop-ups, camera shake) are drawn by the 3D renderer; the stamp and
   screen flash are plain DOM so they also work in the 2D fallback. One switch; off by default under reduced motion.
   ===================================================================================== */
const VCOL = { ALLOW: '#5be3a4', LIMIT: '#8ed0ff', EXPOSED: '#e8a54b', STEPUP: '#f4c95d', BLOCK: '#ff7a6b', DOWN: '#d98a7a', CONTAIN: '#ff5fa2' };
const VFX = (() => {
  const st = { on: !RM.matches, fired: 0 };
  try { const v = localStorage.getItem('ln-fx'); if (v === '0' || v === '1') st.on = v === '1'; } catch (e) { }
  const again = (el, col) => { el.style.setProperty('--fc', col); el.classList.remove('go'); void el.offsetWidth; el.classList.add('go'); };
  return {
    st,
    set(on) { st.on = on; try { localStorage.setItem('ln-fx', on ? '1' : '0'); } catch (e) { } },
    fire(type, o) { if (!st.on) return; st.fired++; if (R && R.fx) R.fx(type, o); },
    stamp(v, right) { if (!st.on) return; const el = $(right ? '#fxstamp2' : '#fxstamp'); el.textContent = DATA.verdicts[v].stamp; again(el, VCOL[v]); if (!right) again($('#fxflash'), VCOL[v]); }
  };
})();

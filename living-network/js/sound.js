/* =====================================================================================
   SOUND — everything is synthesised with the Web Audio API: no audio files, no downloads.
   Effects and music are separate switches. The audio context starts on the first click or key press
   (browsers do not allow sound before that) and is suspended while the tab is hidden.
   ===================================================================================== */
const SND = (() => {
  let ctx = null, master, sfxBus, musBus, delay, mood = 70, musTimer = 0, musStep = 0; const last = {}, st = { sfx: true, music: true, played: 0 };
  try { const s = JSON.parse(localStorage.getItem('ln-sound') || '{}'); if (typeof s.sfx === 'boolean') st.sfx = s.sfx; if (typeof s.music === 'boolean') st.music = s.music; } catch (e) { }
  const save = () => { try { localStorage.setItem('ln-sound', JSON.stringify({ sfx: st.sfx, music: st.music })); } catch (e) { } };
  const N = semi => 220 * Math.pow(2, semi / 12);           /* semitones above A3 */
  function init() {
    if (ctx) return true; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
    try { ctx = new AC(); } catch (e) { return false; }
    master = ctx.createGain(); master.gain.value = .55; const comp = ctx.createDynamicsCompressor(); master.connect(comp); comp.connect(ctx.destination);
    /* a short feedback echo gives every sound the same airy, spacious tail */
    delay = ctx.createDelay(1); delay.delayTime.value = .23; const fb = ctx.createGain(); fb.gain.value = .3; const wet = ctx.createGain(); wet.gain.value = .25;
    delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 1; sfxBus.connect(master); sfxBus.connect(delay);
    musBus = ctx.createGain(); musBus.gain.value = 0; musBus.connect(master); musBus.connect(delay);
    if (st.music) startMusic();
    return true;
  }
  function tone(f, o = {}) {
    const { t = 0, d = .2, type = 'sine', g = .14, to = 0, a = .008, bus = sfxBus } = o, t0 = ctx.currentTime + t;
    const os = ctx.createOscillator(), gn = ctx.createGain(); os.type = type; os.frequency.setValueAtTime(f, t0); if (to) os.frequency.exponentialRampToValueAtTime(to, t0 + d);
    gn.gain.setValueAtTime(.0001, t0); gn.gain.exponentialRampToValueAtTime(g, t0 + a); gn.gain.exponentialRampToValueAtTime(.0001, t0 + d);
    os.connect(gn); gn.connect(bus); os.start(t0); os.stop(t0 + d + .05);
  }
  function noise(o = {}) {   /* filtered noise: sweeps, thumps and air */
    const { t = 0, d = .3, g = .1, f0 = 400, f1 = 2400, q = 1.2 } = o, t0 = ctx.currentTime + t, len = Math.ceil(ctx.sampleRate * d);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate), ch = buf.getChannelData(0); for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf; const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q; bp.frequency.setValueAtTime(f0, t0); bp.frequency.exponentialRampToValueAtTime(f1, t0 + d);
    const gn = ctx.createGain(); gn.gain.setValueAtTime(.0001, t0); gn.gain.exponentialRampToValueAtTime(g, t0 + d * .25); gn.gain.exponentialRampToValueAtTime(.0001, t0 + d);
    src.connect(bp); bp.connect(gn); gn.connect(sfxBus); src.start(t0);
  }
  const seq = (notes, o = {}) => notes.forEach((n, i) => tone(N(n), { ...o, t: (o.t || 0) + i * (o.gap || .09) }));
  /* the palette: soft glass tones on a pentatonic scale; negative outcomes go lower, slower and slightly rougher */
  const FX = {
    ui: () => tone(N(27), { d: .05, g: .05, type: 'triangle' }),
    select: () => { tone(N(19), { d: .16, g: .07 }); tone(N(26), { d: .22, g: .04, t: .04 }); },
    start: () => { noise({ d: .35, g: .035, f0: 500, f1: 3200 }); seq([7, 12, 19], { d: .16, g: .06, gap: .06, type: 'triangle' }); },
    hop: i => tone(N([12, 14, 17, 19, 21, 24][i % 6]), { d: .1, g: .045, type: 'sine' }),
    check: i => { const n = [12, 15, 17, 19, 22][i % 5]; tone(N(n), { d: .28, g: .1 }); tone(N(n + 12), { d: .2, g: .035, type: 'triangle', t: .015 }); },
    up: () => seq([19, 24], { d: .18, g: .07, gap: .07 }),
    down: () => seq([15, 10], { d: .24, g: .08, gap: .09, type: 'triangle' }),
    tele: () => seq([31, 34, 36, 39], { d: .08, g: .035, gap: .045, type: 'triangle' }),
    splunk: () => { tone(N(24), { d: .5, g: .05 }); tone(N(24.12), { d: .5, g: .05, type: 'triangle' }); seq([31, 36], { d: .2, g: .035, gap: .1, t: .08 }); },
    lens: i => seq([[12, 19], [14, 21], [15, 22], [10, 17], [12, 24]][i % 5], { d: .2, g: .07, gap: .06, type: 'triangle' }),
    view: () => noise({ d: .45, g: .05, f0: 300, f1: 2600, q: .8 }),
    topo: () => seq([12, 19, 24, 28], { d: .5, g: .05, gap: .04 }),
    toggle: on => seq(on ? [12, 19] : [19, 12], { d: .12, g: .06, gap: .06 }),
    ALLOW: () => seq([12, 16, 19, 24], { d: .55, g: .1, gap: .085 }),
    LIMIT: () => { seq([12, 16, 19], { d: .4, g: .09, gap: .085 }); tone(N(17), { d: .6, g: .07, t: .3, type: 'triangle' }); },
    EXPOSED: () => { seq([10, 14, 17], { d: .4, g: .09, gap: .085 }); tone(N(12), { d: .6, g: .07, t: .3, type: 'triangle' }); },
    STEPUP: () => { seq([14, 19], { d: .22, g: .09, gap: .11 }); seq([14, 21], { d: .3, g: .09, gap: .11, t: .34 }); },
    BLOCK: () => { noise({ d: .22, g: .09, f0: 900, f1: 160, q: .7 }); tone(N(3), { d: .4, g: .13, type: 'triangle', to: N(-4) }); tone(N(-9), { d: .55, g: .12, t: .12 }); },
    DOWN: () => { noise({ d: .28, g: .08, f0: 700, f1: 90, q: .6 }); tone(N(1), { d: .5, g: .12, type: 'triangle', to: N(-6) }); tone(N(-11), { d: .6, g: .1, t: .14 }); },
    CONTAIN: () => { [0, .16, .32].forEach(t => { tone(N(10), { d: .12, g: .09, type: 'triangle', t }); tone(N(11), { d: .12, g: .06, type: 'triangle', t }); });
      noise({ d: .5, g: .07, f0: 2400, f1: 260, t: .46 }); tone(N(-9), { d: .8, g: .13, t: .5 }); tone(N(-2), { d: .8, g: .06, t: .5 }); }
  };
  function play(name, arg) {
    if (!st.sfx || !ctx || !FX[name]) return; const now = performance.now(); if (now - (last[name] || 0) < 45) return; last[name] = now;
    if (ctx.state === 'suspended') ctx.resume(); try { FX[name](arg); st.played++; } catch (e) { }
  }
  /* generative ambient bed: slow pad chords plus sparse plucks. It follows the session: bright while trust is healthy, darker when it drops. */
  const BRIGHT = [[3, [0, 7, 11, 14, 16]], [8, [0, 7, 11, 14]], [0, [0, 7, 10, 14, 15]], [10, [0, 7, 9, 14]]], DARK = [[0, [0, 7, 10, 14]], [5, [0, 7, 10, 15]], [3, [0, 7, 11, 14]], [-2, [0, 7, 10, 14]]];
  function musicBar() {
    if (!st.music || !ctx) return; const [root, iv] = (mood < 45 ? DARK : BRIGHT)[musStep++ % 4], base = root - 12;
    iv.forEach((n, i) => { const f = N(base + n), o = { d: 6.4, a: 2.2, g: i ? .022 : .034, bus: musBus }; tone(f, o); tone(f * 1.003, { ...o, type: 'triangle', g: o.g * .5 }); });
    for (let k = 0; k < 3; k++) tone(N(base + 24 + iv[(Math.random() * iv.length) | 0]), { t: .6 + Math.random() * 4.6, d: 1.1, g: .022, type: 'triangle', bus: musBus });
    musTimer = setTimeout(musicBar, 5600);
  }
  function startMusic() { clearTimeout(musTimer); musBus.gain.cancelScheduledValues(ctx.currentTime); musBus.gain.setTargetAtTime(1, ctx.currentTime, .8); musicBar(); }
  function stopMusic() { clearTimeout(musTimer); if (ctx) musBus.gain.setTargetAtTime(0, ctx.currentTime, .4); }
  return {
    st, play, init,
    mood(v) { mood = v; },
    setSfx(on) { st.sfx = on; save(); if (on) { init(); play('toggle', true); } },
    setMusic(on) { st.music = on; save(); if (on) { if (init()) startMusic(); } else stopMusic(); },
    hidden(h) { if (!ctx) return; if (h) ctx.suspend(); else if (st.sfx || st.music) ctx.resume(); }
  };
})();

function createGL(THREE, OrbitControls, PP) {
  const stage = $('#stage'), canvas = $('#gl'), labels = $('#labels');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x070b16);
  const fog = new THREE.FogExp2(0x070b16, .0021);   /* depth haze; switched off with bloom if the frame rate does not hold */
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 600);   /* positive near plane: ray picking starts at the camera */
  /* follow cameras: a perspective camera rides behind the actor (3rd person) or at its eyes (1st person) */
  const pcam = new THREE.PerspectiveCamera(58, 1, .3, 900), camP = new THREE.Vector3(), camL = new THREE.Vector3(), tP = new THREE.Vector3(), tL = new THREE.Vector3(), tA = new THREE.Vector3();
  let view = cam, viewMode = 'orbit', lastNow = 0;
  const HOME_T = new THREE.Vector3(-7, 3, 1), HOME_O = new THREE.Vector3(68, 116, 100), VS = 36;
  const controls = new OrbitControls(cam, canvas);
  controls.enableDamping = true; controls.dampingFactor = .09; controls.minZoom = .2; controls.maxZoom = 6; controls.maxPolarAngle = 1.45; controls.screenSpacePanning = true;
  let W = 1, H = 1, dirty = true, tick = 0, labelDirty = true; const labelSig = [], labelCull = [];
  /* split view (compare): each half is its own viewport, camera and label layer. Wv = width of one view, vx = its left edge. */
  let split = false, splitWant = true, Wv = 1, vx = 0;
  const labels2 = document.createElement('div'); labels2.id = 'labels2'; labels2.style.display = 'none'; labels.appendChild(labels2);
  const sx = () => (tv3.x * .5 + .5) * Wv + vx, sy = () => (-tv3.y * .5 + .5) * H;
  /* bloom (optional post-processing) and fog are kept only while the frame rate holds */
  let composer = null, rpass = null, gfxWant = true, gfxOK = true, gfxN = 0, gfxSum = 0, gfxPrev = 0, gfxBad = 0, gfxSkip = 0;
  try { if (sessionStorage.getItem('ln-gfx') === '0') gfxOK = false; } catch (e) { }   /* already found too slow in this session */ const gfxForce = /gfx=force/.test(location.search + location.hash);
  if (PP) { try { composer = new PP.EffectComposer(renderer, new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 })); rpass = new PP.RenderPass(scene, cam); composer.addPass(rpass);
    composer.addPass(new PP.UnrealBloomPass(new THREE.Vector2(256, 256), .5, .45, .62)); composer.addPass(new PP.OutputPass()); } catch (e) { composer = null; } }
  const gfxApply = () => { scene.fog = gfxWant && gfxOK ? fog : null; };
  function setGfx(on) { if (on && !gfxWant) { gfxOK = true; gfxN = gfxSum = gfxBad = gfxSkip = 0; try { sessionStorage.removeItem('ln-gfx'); } catch (e) { } }   /* switching effects back on tries again */
    gfxWant = on; gfxApply(); }
  /* zoom that fits the whole scene: project the scene's bounding box with the home orientation */
  function fitZoom() {
    const c = new THREE.OrthographicCamera(cam.left, cam.right, cam.top, cam.bottom, -300, 600); c.position.copy(HOME_T).add(HOME_O); c.lookAt(HOME_T); c.updateMatrixWorld(); c.updateProjectionMatrix();
    let mx = 0, my = 0; const v = new THREE.Vector3();
    for (const x of [-45, 28]) for (const y of [0, 24]) for (const z of [-28, 29]) { v.set(x, y, z).project(c); mx = Math.max(mx, Math.abs(v.x)); my = Math.max(my, Math.abs(v.y)); }
    return clamp(.94 / Math.max(mx, my * 1.12), .2, 2);
  }
  function home(instant) { tween(HOME_T, HOME_T.clone().add(HOME_O), fitZoom(), instant); }
  function resize() {
    W = stage.clientWidth || 1; H = stage.clientHeight || 1; renderer.setSize(W, H, false); if (composer) composer.setSize(W, H);
    Wv = split ? W / 2 : W; const a = Wv / H; cam.left = -VS * a; cam.right = VS * a; cam.top = VS; cam.bottom = -VS; cam.updateProjectionMatrix(); pcam.aspect = a; pcam.updateProjectionMatrix();
    dirty = true; labels.classList.toggle('narrow', Wv < 560);
  }
  /* eased camera transition, 750 ms */
  let tw = null;
  function tween(t, p, z, instant) {
    if (instant || RM.matches) { controls.target.copy(t); cam.position.copy(p); cam.zoom = z; cam.updateProjectionMatrix(); tw = null; return; }
    tw = { t0: performance.now(), d: 750, ft: controls.target.clone(), fp: cam.position.clone(), fz: cam.zoom, tt: t.clone(), tp: p.clone(), tz: z };
  }
  scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x0a1020, 1.15));
  const sun = new THREE.DirectionalLight(0xffffff, 1.3); sun.position.set(30, 60, 20); scene.add(sun);

  /* zones */
  const zoneLbl = [], spZone = [], zoneG = new THREE.Group(); scene.add(zoneG);
  for (const z of DATA.zones) {
    const w = z.x[1] - z.x[0], d = z.z[1] - z.z[0], ops = z.y > 5, sp = z.id === 'splunk';
    const g = new THREE.BoxGeometry(w, .3, d);
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: sp ? 0x3a2414 : ops ? 0x16264a : 0x101a33, transparent: true, opacity: ops ? .42 : .92, roughness: .95, depthWrite: !ops }));
    m.position.set((z.x[0] + z.x[1]) / 2, z.y - .35, (z.z[0] + z.z[1]) / 2); zoneG.add(m);
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(g), new THREE.LineBasicMaterial({ color: sp ? 0xb5672f : ops ? 0x4a639c : 0x2a3a60 })); e.position.copy(m.position); zoneG.add(e);
    if (sp) spZone.push(m, e);
    const el = document.createElement('div'); el.className = 'lbl zone'; el.textContent = z.label; labels.appendChild(el);
    zoneLbl.push({ el, sp, v: new THREE.Vector3(z.x[0] + .5, z.y, z.z[1] + 1.2) });
  }
  /* ops-plane tethers */
  { const pts = []; for (const [x, z] of [[-18, -8], [23, -8], [-18, 8], [23, 8]]) pts.push(x, 12.6, z, x, 0, z);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    zoneG.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0x22304f, transparent: true, opacity: .7 }))); }

  /* node geometry: one original abstract shape per category */
  const GEO = {
    net: new THREE.CylinderGeometry(.95, .95, .9, 6), id: new THREE.OctahedronGeometry(.95), netsec: new THREE.BoxGeometry(1.45, 1.05, 1.45),
    cloud: new THREE.IcosahedronGeometry(.95, 0), endpoint: new THREE.CapsuleGeometry(.5, .6, 2, 8), detect: new THREE.DodecahedronGeometry(.9),
    ot: new THREE.CylinderGeometry(.55, .98, 1.1, 8), suite: new THREE.TorusGeometry(.72, .27, 8, 20), splunk: new THREE.CylinderGeometry(1.05, 1.05, 1, 3)
  };
  const P = { b: () => new THREE.BoxGeometry(1, 1, 1), c: () => new THREE.CylinderGeometry(.5, .5, 1, 10), k: () => new THREE.ConeGeometry(.5, 1, 4), s: () => new THREE.SphereGeometry(.5, 12, 8),
    o: () => new THREE.OctahedronGeometry(.5), t: () => new THREE.TetrahedronGeometry(.6), r: () => new THREE.TorusGeometry(.5, .08, 6, 18), i: () => new THREE.IcosahedronGeometry(.5, 0), p: () => new THREE.CapsuleGeometry(.5, 1, 2, 8) };
  const PG = {}; const prim = k => PG[k] || (PG[k] = P[k]());
  /* spec rows: [primitive, sx, sy, sz, x, y, z, rotX?, rotZ?, detail?]; detail rows use the second material */
function buildParts(spec, mat, dmat) { const g = new THREE.Group(); for (const [k, sx, sy, sz, x, y, z, rx, rz, d] of spec) { const m = new THREE.Mesh(prim(k), d && dmat ? dmat : mat); m.scale.set(sx, sy, sz); m.position.set(x, y, z); if (rx) m.rotation.x = rx; if (rz) m.rotation.z = rz; g.add(m); } return g; }
  /* build(): the same model merged into one geometry per material, so a model costs one or two draw calls instead of one per primitive.
     Merged geometry is cached per spec, so re-running a scenario allocates nothing new. Flat shading derives normals in the shader. */
  const MERGED = new Map(), flat = k => PG['~' + k] || (PG['~' + k] = prim(k).index ? prim(k).toNonIndexed() : prim(k));
  function mergedGeo(spec, detail) {
    const key = detail ? 'd' : 'm'; let e = MERGED.get(spec); if (!e) MERGED.set(spec, e = {}); if (key in e) return e[key];
    const out = [], m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), eu = new THREE.Euler(), v = new THREE.Vector3(), s = new THREE.Vector3(), t = new THREE.Vector3();
    for (const [k, sx, sy, sz, x, y, z, rx, rz, d] of spec) {
      if (!!d !== detail) continue; const src = flat(k).attributes.position; m4.compose(t.set(x, y, z), q.setFromEuler(eu.set(rx || 0, 0, rz || 0)), s.set(sx, sy, sz));
      for (let i = 0; i < src.count; i++) { v.fromBufferAttribute(src, i).applyMatrix4(m4); out.push(v.x, v.y, v.z); }
    }
    if (!out.length) return e[key] = null;
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(out, 3)); g.computeVertexNormals(); g.computeBoundingSphere(); return e[key] = g;
  }
  function build(spec, mat, dmat) {
    const g = new THREE.Group(), all = !dmat;
    if (all) { let e = MERGED.get(spec); if (!e || !('a' in e)) { const sp2 = spec.map(r => r.slice(0, 9)); MERGED.set(sp2, {}); const geo = mergedGeo(sp2, false); if (!e) MERGED.set(spec, e = {}); e.a = geo; } g.add(new THREE.Mesh(e.a, mat)); return g; }
    const gm = mergedGeo(spec, false), gd = mergedGeo(spec, true); if (gm) g.add(new THREE.Mesh(gm, mat)); if (gd) g.add(new THREE.Mesh(gd, dmat)); return g;
  }
  /* product models: generic, recognisable device silhouettes built from primitives (no vendor artwork) */
  const QT = Math.PI / 2, DK = 1;
  const LAPTOP = [['b', 1.7, .1, 1.1, 0, .3, .1], ['b', 1.7, 1.05, .08, 0, .85, -.45, -.15], ['b', 1.5, .85, .03, 0, .86, -.4, -.15, 0, DK]];
  const MONITOR = [['b', .9, .08, .55, 0, .04, 0], ['c', .16, .7, .16, 0, .4, 0], ['b', 1.9, 1.15, .12, 0, 1.25, 0], ['b', 1.7, .95, .04, 0, 1.25, .07, 0, 0, DK]];
  const CLOUD = [['s', 1.3, .95, 1.1, -.45, .85, 0], ['s', 1.1, .85, 1, .5, .8, 0], ['s', 1.1, 1, 1, 0, 1.2, 0]];
  const ports = (w, y, z, n = 1) => Array.from({ length: n }, (_, i) => ['b', w, .1, .04, 0, y + i * .16, z, 0, 0, DK]);
  const MODEL = {
    wireless: [['c', .14, 1, .14, 0, .5, 0], ['c', 1.7, .24, 1.7, 0, 1.12, 0], ['c', 1.2, .05, 1.2, 0, 1.26, 0, 0, 0, DK], ['s', .22, .12, .22, 0, 1.3, 0]],
    switches: [['b', 2.1, .45, 1.3, 0, .3, 0], ['b', 2.1, .45, 1.3, 0, .8, 0], ...ports(1.7, .26, .66), ...ports(1.7, .76, .66)],
    industrial: [['b', .25, 1.6, 1.9, -.2, .8, 0], ['b', 1.1, 1.4, 1, .25, .7, 0], ['b', .06, 1.2, 1.1, .45, .7, 0, 0, 0, DK], ['b', .06, 1.2, 1.1, .65, .7, 0, 0, 0, DK], ['b', .1, .3, 1.02, .25, 1.15, 0, 0, 0, DK]],
    sdwan: [['b', 1.9, .55, 1.25, 0, .3, 0], ...ports(1.5, .3, .64), ['c', .09, 1.1, .09, -.7, 1.1, -.45], ['c', .09, 1.1, .09, .7, 1.1, -.45], ['c', .09, .9, .09, 0, 1, -.45]],
    nexus: [['b', 1.35, 1.95, 1.25, 0, .98, 0], ...ports(1.1, .35, .64, 3), ...ports(1.1, 1.15, .64, 3)],
    silicon: [['b', 1.7, .14, 1.7, 0, .1, 0, 0, 0, DK], ['b', 1.45, .25, 1.45, 0, .3, 0], ['b', .85, .14, .85, 0, .5, 0], ['b', .5, .06, .5, 0, .6, 0, 0, 0, DK]],
    te: [['c', .12, .9, .12, 0, .45, 0], ['s', 1.25, 1.25, 1.25, 0, 1.35, 0], ['r', 1.9, 1.9, 1.9, 0, 1.35, 0, 1.2], ['r', 1.9, 1.9, 1.9, 0, 1.35, 0, 1.2, QT], ['s', .3, .3, .3, 0, 1.35, .6, 0, 0, DK]],
    meraki: [...MONITOR, ['b', .9, .1, .04, -.3, 1.4, .1], ['b', .5, .1, .04, -.5, 1.2, .1], ['b', 1.1, .1, .04, 0, 1, .1]],
    agentic: [['i', 1.1, 1.1, 1.1, 0, 1.05, 0], ['s', .45, .45, .45, -.95, .5, .3], ['s', .45, .45, .45, .95, .5, .3], ['s', .45, .45, .45, 0, 2, -.2], ['r', 2.1, 2.1, 2.1, 0, 1.05, 0, QT]],
    duo: [['b', .85, 1.6, .16, 0, .95, 0, -.1], ['b', .7, 1.2, .04, 0, .98, .08, -.1, 0, DK], ['b', .35, .1, .05, -.06, .95, .12, -.1, .78], ['b', .6, .1, .05, .14, 1.05, .12, -.1, -.8]],
    ise: [['b', 1.15, 1.7, 1.2, 0, .85, 0], ...ports(.9, .4, .62, 4), ['o', .7, .9, .7, 0, 2.2, 0]],
    cii: [['r', 2, 2, 2, -.15, 1.25, 0], ['c', .5, .02, .5, -.15, 1.25, 0, QT, 0, DK], ['b', .2, .9, .2, .48, .45, 0, 0, .65], ['s', .45, .45, .45, -.15, 1.25, 0]],
    client: [...LAPTOP, ['o', .55, .75, .25, .65, 1.65, -.45]],
    sa: [...CLOUD, ['b', .16, 1, .16, -.45, .5, .65], ['b', .16, 1, .16, .45, .5, .65], ['b', 1.1, .14, .18, 0, 1, .65], ['b', .74, .7, .05, 0, .5, .65, 0, 0, DK]],
    fw: [['b', 2.1, .6, 1.35, 0, .32, 0], ['b', 2.1, .6, 1.35, 0, .95, 0], ...ports(1.7, .22, .69, 2), ...ports(1.7, .85, .69, 2), ['k', .55, .7, .55, 0, 1.6, 0]],
    hmf: [['b', .8, .45, .6, -.75, .25, -.35], ['b', .8, .45, .6, .75, .25, -.35], ['b', .8, .45, .6, 0, .25, .65], ['r', 2.4, 2.4, 2.4, 0, .3, .05, QT, 0, DK], ['s', .45, .45, .45, 0, 1.2, 0],
      ['b', .06, 1, .06, -.38, .75, -.18, 0, .7], ['b', .06, 1, .06, .38, .75, -.18, 0, -.7], ['b', .06, .9, .06, 0, .75, .33, -.7]],
    mcd: [...CLOUD.map(r => [r[0], r[1], r[2], r[3], r[4], r[5] + .35, r[6] - .25]), ['b', 2, .75, .22, 0, .38, .55], ['b', 1.9, .05, .24, 0, .38, .56, 0, 0, DK], ['b', .05, .7, .24, -.4, .38, .56, 0, 0, DK], ['b', .05, .7, .24, .4, .38, .56, 0, 0, DK]],
    scc: [['b', 1, .08, .55, 0, .04, 0], ['c', .16, .6, .16, 0, .35, 0], ['b', 1.15, .85, .1, -.62, 1.05, .05, 0, .12], ['b', 1.15, .85, .1, .62, 1.05, .05, 0, -.12],
      ['b', 1, .7, .04, -.62, 1.05, .11, 0, .12, DK], ['b', 1, .7, .04, .62, 1.05, .11, 0, -.12, DK]],
    hs: [['o', 1.5, 1.9, .45, 0, 1.05, 0], ['o', 1, 1.3, .1, 0, 1.05, .2, 0, 0, DK], ['r', 2.3, 2.3, 2.3, 0, .2, 0, QT]],
    wl: [['b', .75, .75, .75, -.42, .4, -.42], ['b', .75, .75, .75, .42, .4, -.42], ['b', .75, .75, .75, -.42, .4, .42], ['b', .75, .75, .75, .42, .4, .42],
      ['b', .75, .75, .75, 0, 1.2, 0], ['b', 2, .05, .05, 0, .4, 0, 0, 0, DK], ['b', .05, .05, 2, 0, .4, 0, 0, 0, DK]],
    aid: [['b', 1.5, .22, 1.5, 0, .15, 0], ['b', 1.7, .07, .25, 0, .1, 0, 0, 0, DK], ['b', .25, .07, 1.7, 0, .1, 0, 0, 0, DK], ['o', .95, 1.2, .3, 0, 1, 0], ['s', .35, .35, .35, 0, 1.05, .15, 0, 0, DK]],
    waap: [['b', 1.9, 1.3, .12, 0, .95, 0], ['b', 1.9, .2, .14, 0, 1.5, .01, 0, 0, DK], ['b', 1.6, .85, .03, 0, .85, .07, 0, 0, DK], ['o', .55, .7, .2, .6, .85, .2], ['b', 1.2, .1, .6, 0, .05, 0]],
    ep: [...LAPTOP, ['o', .65, .9, .25, .65, 1.7, -.45], ['o', .4, .55, .05, .65, 1.7, -.32, 0, 0, DK]],
    email: [['b', 1.9, 1.2, .22, 0, .85, 0], ['b', 1.15, .08, .05, -.45, 1, .12, 0, -.55, DK], ['b', 1.15, .08, .05, .45, 1, .12, 0, .55, DK], ['o', .5, .65, .2, .75, 1.55, .15]],
    xdr: [['c', .7, .35, .7, 0, .18, 0], ['c', .16, .6, .16, 0, .6, 0], ['k', 1.8, .7, 1.8, 0, 1.25, 0, Math.PI - .45], ['c', .06, .7, .06, 0, 1.45, .2, -.45], ['s', .2, .2, .2, 0, 1.75, .35, 0, 0, DK]],
    sna: [['b', 2, .12, 1.1, 0, .06, 0, 0, 0, DK], ['b', .38, .6, .38, -.65, .4, 0], ['b', .38, 1.1, .38, 0, .65, 0], ['b', .38, 1.7, .38, .65, .95, 0], ['b', 1.8, .06, .06, 0, 1.3, .3, 0, -.45]],
    talos: [['s', 1.6, .9, .9, 0, 1.05, 0], ['s', .55, .55, .3, 0, 1.05, .36, 0, 0, DK], ['s', .2, .2, .1, 0, 1.05, .5], ['c', .25, .55, .25, 0, .3, 0]],
    cv: [['c', 1.5, .3, 1.5, 0, .2, 0], ['c', 1.3, .05, 1.3, 0, .37, 0, 0, 0, DK], ['s', .9, .6, .9, 0, .5, 0], ['s', .3, .3, .3, 0, .75, .25, 0, 0, DK]],
    itd: [['o', 1.3, 1.6, .4, 0, 1.05, 0], ['r', 1.25, 1.25, 1.25, 0, 1.05, .2, 0, 0, DK], ['b', 1.9, .35, 1, 0, .18, 0], ['c', .3, .7, .3, .6, .7, -.25]],
    sea: [['b', 1.25, 1.8, .2, 0, .9, 0], ['b', .85, 1.5, .23, 0, .8, 0, 0, 0, DK], ['s', .14, .14, .14, .25, .8, .14], ['k', .4, .5, .4, -.95, .5, .3, 0, -QT]]
  };
  const PLACE = {
    hq: [['b', 2.2, 1.4, 1.6, 0, .7, 0], ['b', 1, 2.6, 1, -.3, 1.3, .1]], branch: [['b', 1.8, 1.1, 1.4, 0, .55, 0], ['b', .6, .5, .6, .4, 1.35, 0]],
    home: [['b', 1.4, 1, 1.4, 0, .5, 0], ['k', 2.2, .9, 2.2, 0, 1.45, 0]], public: [['c', 1.6, .25, 1.6, 0, .13, 0], ['c', .7, 1, .7, 0, .75, 0], ['c', 1.9, .12, 1.9, 0, 1.3, 0]],
    factory: [['b', 2.4, 1, 1.5, 0, .5, 0], ['c', .45, 1.8, .45, -.7, 1.4, 0], ['c', .45, 1.3, .45, .1, 1.2, 0]],
    internet: [['i', 1.9, 1.9, 1.9, 0, 1.1, 0], ['t', 1, 1, 1, 1, 1.9, 0], ['t', .8, .8, .8, -.9, .7, .6]],
    dcapp: [['b', 1.6, .4, 1.3, 0, .2, 0], ['b', 1.6, .4, 1.3, 0, .7, 0], ['b', 1.6, .4, 1.3, 0, 1.2, 0]], workload: [['b', 1.2, .4, 1.2, 0, .2, 0], ['b', 1.2, .4, 1.2, 0, .7, 0]],
    server: [['b', 1.1, 1.5, 1.1, 0, .75, 0], ['b', 1.3, .15, 1.3, 0, 1.6, 0]], intai: [['o', 1.8, 1.8, 1.8, 0, 1, 0], ['r', 2.4, 2.4, 2.4, 0, 1, 0, Math.PI / 2]],
    cloudapp: [['s', 1.5, 1.1, 1.5, -.3, .7, 0], ['s', 1.2, .9, 1.2, .55, .6, 0], ['b', 1, .5, 1, 0, 1.5, 0]], saas: [['s', 1.6, 1.1, 1.6, 0, .7, 0], ['s', 1.1, .8, 1.1, .7, .55, .2]],
    shadow: [['s', 1.6, 1.1, 1.6, 0, .7, 0], ['k', 1, .8, 1, 0, 1.6, 0]], ai: [['o', 1.7, 1.7, 1.7, 0, 1, 0]], pubai: [['o', 1.7, 1.7, 1.7, 0, 1, 0], ['k', .9, .7, .9, 0, 2.1, 0]],
    web: [['s', 1.8, 1.8, 1.8, 0, 1, 0], ['r', 2.3, 2.3, 2.3, 0, 1, 0, Math.PI / 2]], mail: [['b', 1.9, .25, 1.3, 0, .5, 0], ['k', 1.5, .5, 1, 0, .85, 0]],
    otctl: [['b', 1.4, .8, 1.4, 0, .4, 0], ['c', .4, 1.4, .4, 0, 1.5, 0], ['b', 1.3, .3, .3, .5, 2.1, 0]],
    core: [['b', 2.3, .5, 1.3, 0, .3, 0], ['b', 2.3, .5, 1.3, 0, .9, 0], ['b', 2.3, .5, 1.3, 0, 1.5, 0]]
  };
  const ACTOR = {
    emp: [['p', .8, .7, .8, 0, .85, 0], ['s', .8, .8, .8, 0, 2.1, 0]], admin: [['p', .8, .7, .8, 0, .85, 0], ['s', .8, .8, .8, 0, 2.1, 0], ['r', 1.5, 1.5, 1.5, 0, 2.75, 0, Math.PI / 2]],
    exec: [['p', .85, .95, .85, 0, 1.1, 0], ['s', .8, .8, .8, 0, 2.6, 0], ['b', 1.5, .2, .6, 0, 1.75, 0]], contractor: [['p', .8, .7, .8, 0, .85, 0], ['s', .8, .8, .8, 0, 2.1, 0], ['b', .7, .55, .5, .9, .35, 0]],
    guest: [['p', .65, .55, .65, 0, .7, 0], ['s', .65, .65, .65, 0, 1.75, 0], ['r', 2, 2, 2, 0, .08, 0, Math.PI / 2]], insider: [['p', .8, .7, .8, 0, .85, 0], ['s', .8, .8, .8, 0, 2.1, 0], ['k', 1.3, .9, 1.3, 0, 2.7, 0]],
    iot: [['b', 1.1, .8, .8, 0, .9, 0], ['c', .5, .5, .5, 0, .9, .55, Math.PI / 2], ['c', .2, .9, .2, 0, .2, 0]], ot: [['c', 1.2, .5, 1.2, 0, .25, 0], ['b', .35, 1.5, .35, 0, 1.2, 0], ['b', 1.3, .3, .3, .5, 1.95, 0]],
    aiagent: [['o', 1.6, 1.6, 1.6, 0, 1.2, 0], ['r', 2.3, 2.3, 2.3, 0, 1.2, 0, Math.PI / 2]], attacker: [['t', 1.6, 1.6, 1.6, 0, 1.1, 0], ['t', 1.3, -1.3, 1.3, 0, 1.3, 0], ['k', .5, 1, .5, 0, 2.5, 0]]
  };
  /* walking 3D figures for human actors: original low-poly geometry, one distinct silhouette per role */
  const HUMAN = {
    emp: { body: 0x5b8def }, admin: { body: 0x8f6cf0 }, exec: { body: 0x23345e, tall: 1.12 }, contractor: { body: 0xf08a24 },
    guest: { body: 0xb9c4d8, tall: .9 }, insider: { body: 0x5b8def }, attacker: { body: 0x9c2231, legs: 0x4a1220, skin: 0x2a0d14, ring: 0xff3b30 }
  };
  /* costume colours. Body stays the Who colour unless the scenario picks a role. */
  const COSTUME = {
    doctor: { body: 0xf7f8fa }, patient: { body: 0xd5e6f5 }, teacher: { body: 0x2f4d6e }, student: { body: 0x6d5bd0, tall: .92 },
    worker: { body: 0x3a4a63 }, associate: { body: 0x1f6f64 }, servant: { body: 0x1c2744 }, advisor: { body: 0x23345e }, employee: { body: 0x5b8def }
  };
  function human(who, slot, role) {
    const look = role && role.id || who, C = COSTUME[look] || {}, o = HUMAN[who];
    const g = new THREE.Group(), M = (col, basic) => basic ? new THREE.MeshBasicMaterial({ color: col }) : new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: .35, roughness: .6, flatShading: true });
    const body = M(C.body != null ? C.body : o.body), skin = M(o.skin || 0xf1c9a5), legs = M(o.legs || 0x2b3550);
    const add = (k, m, sx, sy, sz, x, y, z, parent = g, rx = 0) => { const me = new THREE.Mesh(prim(k), m); me.scale.set(sx, sy, sz); me.position.set(x, y, z); me.rotation.x = rx; parent.add(me); return me; };
    const limb = (x, y, len, m, w) => { const pv = new THREE.Group(); pv.position.set(x, y, 0); add('b', m, w, len, w, 0, -len / 2, 0, pv); g.add(pv); return pv; };
    const legL = limb(-.22, 1.1, 1.1, legs, .3), legR = limb(.22, 1.1, 1.1, legs, .3);
    add('b', body, .9, 1.1, .5, 0, 1.65, 0);
    const armL = limb(-.6, 2.15, .95, body, .24), armR = limb(.6, 2.15, .95, body, .24);
    add('s', skin, .62, .62, .62, 0, 2.6, 0);
    if (role && ROLE_GENDERED.has(look)) {                                                                                   /* man: short cap. woman: hair down the back. a hard hat takes the place of the cap */
      const hair = M(0x2a211c), hat = look === 'worker';
      if (role.woman) { if (!hat) add('b', hair, .7, .28, .7, 0, 2.84, -.04); add('b', hair, .42, hat ? .5 : .85, .36, 0, hat ? 2.2 : 2.35, -.3); }
      else if (!hat) add('b', hair, .66, .18, .66, 0, 2.88, 0);
    }
    if (look === 'employee' || look === 'servant' || look === 'insider') add('b', M(0xffffff), .2, .26, .05, .24, 1.85, .27); /* staff badge */
    if (role && role.halo) add('r', M(0xf4c95d), 1.1, 1.1, 1.1, 0, 3.15, 0, g, Math.PI / 2);                                 /* halo = privilege, on any costume */
    if (look === 'advisor') { add('b', M(0xf4c95d), .14, .62, .05, 0, 1.8, .27); add('b', M(0xffffff), .5, .3, .05, 0, 2.05, .26); add('c', M(0xffffff), .46, .14, .46, 0, 2.18, 0); }  /* shirt, tie and a collar that shows from behind */
    if (look === 'contractor') { add('c', M(0xffd23f), .78, .3, .78, 0, 2.95, 0); add('c', M(0xffd23f), .95, .06, .95, 0, 2.82, .1); add('b', M(0x7a4d22), .55, .38, .28, 0, -1.1, 0, armR); add('b', M(0xfff3a0), .92, .14, .52, 0, 1.6, 0); }   /* hard hat, hi-vis band, toolbox */
    if (look === 'worker') { add('c', M(0xffd23f), .78, .3, .78, 0, 2.95, 0); add('c', M(0xffd23f), .95, .06, .95, 0, 2.82, .1); add('b', M(0xfff3a0), .98, .36, .62, 0, 1.7, 0); }  /* hard hat and a hi-vis vest that reads from behind, no toolbox */
    if (look === 'guest') add('r', M(0xffffff), .7, .7, .7, 0, 2.05, .2, g, 1.1);                                              /* visitor lanyard */
    if (look === 'doctor') add('b', M(0x3d8eb5), .16, .72, .06, 0, 1.62, .27);                                                 /* coat opening over scrubs */
    if (look === 'teacher') add('b', M(0xc4a574), .5, .62, .18, -.2, -.72, 0, armL);                                            /* folder under one arm */
    if (look === 'student') add('b', M(0x241c38), 1.02, .58, .4, 0, 1.5, -.4);                                                  /* backpack, wider than the torso so it shows from behind */
    if (look === 'associate') { add('b', M(0xf2efe6), .72, .7, .08, 0, 1.45, .28); add('b', M(0xf2efe6), .14, .7, .14, -.28, 1.85, 0); add('b', M(0xf2efe6), .14, .7, .14, .28, 1.85, 0); }  /* apron and shoulder straps */
    if (look === 'insider') add('k', M(0x39405a), 1.05, .75, 1.05, 0, 3.02, 0);                                                /* hood */
    if (look === 'attacker') {                                                                                                  /* hooded figure, visor, spiked shoulders */
      add('k', legs, 1.3, 1.25, 1.3, 0, 2.98, 0); add('b', M(0xff3b30, true), .52, .13, .1, 0, 2.62, .3);
      add('t', M(0xff3b30), .5, .5, .5, -.62, 2.35, 0); add('t', M(0xff3b30), .5, .5, .5, .62, 2.35, 0); add('k', legs, 1.5, 1.5, .5, 0, 1.3, -.3, g, Math.PI);
    }
    add('r', M(slot ? 0xffd9a8 : (o.ring || 0xffffff), true), 1.9, 1.9, 1.9, 0, .04, 0, g, Math.PI / 2);                       /* ground ring so the figure is easy to find; B is tinted */
    g.scale.set(2.8, 2.8 * (C.tall || (look === who ? o.tall : 0) || 1), 2.8); g.userData = { legL, legR, armL, armR };
    return g;
  }
  const DEVICE = {
    mgd: [['b', .9, .08, .6, 0, .04, 0], ['b', .9, .6, .06, 0, .35, -.3]], stale: [['b', .9, .08, .6, 0, .04, 0], ['b', .9, .6, .06, 0, .35, -.3], ['k', .35, .35, .35, .3, .85, -.3]],
    mobile: [['b', .4, .75, .07, 0, .4, 0]], byod: [['b', .4, .75, .07, -.3, .4, 0], ['b', .7, .07, .5, .4, .04, 0]], claptop: [['b', .9, .08, .6, 0, .04, 0], ['b', .9, .6, .06, 0, .35, -.3], ['b', .3, .3, .3, .5, .16, .2]],
    headless: [['b', .6, .6, .6, 0, .3, 0]], server: [['b', .8, .25, .8, 0, .13, 0], ['b', .8, .25, .8, 0, .45, 0], ['b', .8, .25, .8, 0, .77, 0]],
    compromised: [['b', .9, .08, .6, 0, .04, 0], ['b', .9, .6, .06, 0, .35, -.3], ['t', .6, .6, .6, 0, 1.05, -.3]]
  };

  const nodes = {}, pickables = [], lensCol = new THREE.Color(), OFF = new THREE.Color(0x39486b), PLC = new THREE.Color(0x6b7da6);
  const ringG = new THREE.TorusGeometry(1.45, .07, 6, 40), diaG = new THREE.OctahedronGeometry(.42), padG = new THREE.CylinderGeometry(1.25, 1.25, .12, 24);
  for (const id of NODE_IDS) {
    const p = PR[id] || PL[id], isP = !!PR[id], g = new THREE.Group(); g.position.set(...p.p);
    const mat = new THREE.MeshStandardMaterial({ color: isP ? OFF : (p.hostile ? 0x8a4a55 : PLC), roughness: .55, metalness: .1, flatShading: true });
    let top = 2.2;
    if (isP) {
      const pad = new THREE.Mesh(padG, new THREE.MeshStandardMaterial({ color: 0x1b2747, roughness: .9 })); pad.position.y = -.12; g.add(pad);
      let m, dmat;
      if (MODEL[id]) {
        dmat = new THREE.MeshStandardMaterial({ color: 0x0b1222, emissive: 0x16223d, roughness: .5, metalness: .3, flatShading: true });
        m = build(MODEL[id], mat, dmat); m.children.forEach(c => { c.userData.id = id; pickables.push(c); });
      } else { m = new THREE.Mesh(GEO[p.cat], mat); m.position.y = .85; if (p.cat === 'suite') m.rotation.x = Math.PI / 2; m.userData.id = id; pickables.push(m); }
      g.add(m);
      const ring = new THREE.Mesh(ringG, new THREE.MeshBasicMaterial({ color: 0xffffff })); ring.rotation.x = Math.PI / 2; ring.position.y = .02; ring.visible = false; g.add(ring);
      const dia = new THREE.Mesh(diaG, new THREE.MeshBasicMaterial({ color: 0xf4c95d, wireframe: true })); dia.position.y = MODEL[id] ? 2.8 : 2.35; dia.visible = false; g.add(dia);
      nodes[id] = { g, mat, dmat, mesh: m, ring, dia, isP, p }; top = MODEL[id] ? 2.4 : 2.1;
    } else {
      const b = (id === 'internet' || id === 'web' ? buildParts : build)(PLACE[id], mat); b.children.forEach(m => { m.userData.id = id; pickables.push(m); }); g.add(b);
      if (id === 'internet' || id === 'web') b.children[0].material = new THREE.MeshStandardMaterial({ color: p.hostile ? 0x8a4a55 : PLC, wireframe: true });
      nodes[id] = { g, mat, isP, p }; top = 3;
    }
    scene.add(g);
    const el = document.createElement('button'); el.className = 'lbl' + (isP ? '' : ' place'); el.dataset.id = id; el.setAttribute('aria-label', (isP ? p.name + '. ' : p.name + ', scene element. ') + p.fn);
    labels.appendChild(el); nodes[id].el = el; nodes[id].L = [{ el }, null]; nodes[id].top = top; nodes[id].anchor = new THREE.Vector3(p.p[0], p.p[1] + top, p.p[2]);
  }
  /* relationship links: faint base set + brighter lens set */
  const lineSet = (pairs, mat) => { const pts = []; for (const [a, b] of pairs) { const A = POS(a), B = POS(b); pts.push(A[0], A[1] + .5, A[2], B[0], B[1] + .5, B[2]); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); const l = new THREE.LineSegments(g, mat); if (mat.isLineDashedMaterial) l.computeLineDistances(); return l; };
  const baseLinks = lineSet(DATA.links.filter(l => l[4] !== 'suite' && !isSp(l[0]) && !isSp(l[1])), new THREE.LineBasicMaterial({ color: 0x3a4d7a, transparent: true, opacity: .28 })); scene.add(baseLinks);
  const spLinks = lineSet(DATA.links.filter(l => isSp(l[0]) || isSp(l[1])), new THREE.LineBasicMaterial({ color: 0xb5672f, transparent: true, opacity: .4 })); scene.add(spLinks);
  let layer = true, diagram = false;
  /* a node is shown unless a topology diagram excludes it or it belongs to the hidden Splunk layer */
  const shown = id => (!diagram || topo.nodes.has(id)) && (layer || !isSp(id) || (!!topo && topo.nodes.has(id)));
  function refreshVis() { for (const id in nodes) { const on = shown(id); nodes[id].g.visible = on; nodes[id].el.classList.toggle('gone', !on); }
    spZone.forEach(o => o.visible = layer); zoneLbl.forEach(z => z.el.style.display = diagram || (z.sp && !layer) ? 'none' : ''); spLinks.visible = layer && !topo && !focusSet; dirty = true; }
  function setLayer(on) { layer = on; refreshVis(); }
  let lensLine = null, selLine = null, flow = [], topo = null, topoLine = null, topoChips = [], focusSet = null, focusLine = null;
  /* ambient traffic: one instanced mesh */
  const NP = 150, amb = new THREE.InstancedMesh(new THREE.SphereGeometry(.13, 6, 5), new THREE.MeshBasicMaterial({ color: 0xffffff }), NP); amb.frustumCulled = false; scene.add(amb);
  const dummy = new THREE.Object3D(), va = new THREE.Vector3(), vb = new THREE.Vector3(), tv3 = new THREE.Vector3(), tc = new THREE.Color();
  let lens = 'data', filter = null, selected = null;

  function setLens(l) {
    lens = l; lensCol.set(LENS[l].color);
    for (const id in nodes) { const n = nodes[id]; if (!n.isP) { n.el.innerHTML = h(n.p.name); continue; }
      const on = !!n.p.roles[l]; n.mat.color.copy(on ? lensCol : OFF); n.mat.emissive.copy(on ? lensCol : OFF).multiplyScalar(on ? .22 : 0);
      n.ring.visible = ringOn(n.p, l); n.ring.material.color.copy(lensCol); n.dia.visible = l === 'policy' && (n.p.pol || []).includes('author');
      n.el.classList.toggle('off', !on); n.el.innerHTML = h(n.p.s) + (on ? `<small>${h(n.p.roles[l])}</small>` : ''); }
    if (lensLine) { scene.remove(lensLine); lensLine.geometry.dispose(); }
    flow = lensLinks(l); const dashed = l === 'policy' || l === 'threat';
    lensLine = lineSet(flow, dashed ? new THREE.LineDashedMaterial({ color: lensCol, transparent: true, opacity: .75, dashSize: .7, gapSize: .5 }) : new THREE.LineBasicMaterial({ color: lensCol, transparent: true, opacity: .5 }));
    scene.add(lensLine); amb.material.color.copy(lensCol); colorRuns(); dirty = true;
    if (topo) applyTopo(); else if (focusSet) setFocus(focusSet);
  }
  function select(id) {
    selected = id; dirty = true; for (const k in nodes) nodes[k].el.classList.toggle('sel', k === id);
    if (selLine) { scene.remove(selLine); selLine.geometry.dispose(); selLine = null; }
    if (id && PR[id]) { selLine = lineSet(DATA.links.filter(l => l[0] === id || l[1] === id), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .85 })); scene.add(selLine); }
  }
  /* topology mode: isolate an architecture, draw its stated relationships and number them */
  function applyTopo() {
    const only = topo || focusSet;   /* an architecture or an industry use case: everything outside it is ghosted */
    baseLinks.visible = !only; spLinks.visible = layer && !only; if (lensLine) lensLine.visible = !only;
    for (const id in nodes) { const n = nodes[id], on = !only || only.nodes.has(id); for (const mt of n.dmat ? [n.mat, n.dmat] : [n.mat]) { mt.transparent = !on; mt.opacity = on ? 1 : .1; mt.depthWrite = on; mt.needsUpdate = true; } if (n.isP) n.ring.visible = on && ringOn(n.p, lens); }
    flow = topo ? topo.links : lensLinks(lens);
  }
  function setTopo(t) {
    const was = topo; topo = t; if (topoLine) { scene.remove(topoLine); topoLine.geometry.dispose(); topoLine = null; } topoChips.forEach(c => c.el.remove()); topoChips = [];
    /* an architecture is re-laid-out as a diagram: most-connected block in the middle, the rest on a ring; everything else is hidden */
    diagram = topoLayout(t);
    zoneG.visible = !diagram;
    for (const id in nodes) { const n = nodes[id], p = POS(id); n.g.position.set(p[0], p[1], p[2]); n.anchor.set(p[0], p[1] + n.top, p[2]); }
    refreshVis();
    applyTopo(); dirty = true; if (selected) select(selected);
    if (!t) { if (was) home(false); return; }
    topoLine = lineSet(t.links, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .9 })); scene.add(topoLine);
    if (t.links.length <= 30) t.links.forEach((l, i) => { const el = document.createElement('div'); el.className = 'nchip'; el.dataset.i = i; el.textContent = i + 1; el.title = `${PR[l[0]].s} ↔ ${PR[l[1]].s}: ${l[2]}`; labels.appendChild(el);
      const A = POS(l[0]), B = POS(l[1]), k = .5 + ((i % 3) - 1) * .12; topoChips.push({ el, v: new THREE.Vector3(A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k + .5, A[2] + (B[2] - A[2]) * k) }); });
    const c = new THREE.Vector3(); let r = 0; t.nodes.forEach(id => { const p = POS(id); c.add(tv3.set(p[0], p[1], p[2])); }); c.multiplyScalar(1 / t.nodes.size);
    t.nodes.forEach(id => { const p = POS(id); r = Math.max(r, tv3.set(p[0], p[1], p[2]).distanceTo(c)); });
    const fz = fitZoom(); tween(c, c.clone().add(HOME_O), t.a.all ? fz : clamp(fz * 40 / (r + 6), fz, 2.6));
  }
  /* industry use case: the scene keeps its layout, the products Cisco lists stay solid and the stated relationships among them are drawn */
  function setFocus(f) {
    focusSet = topo ? null : f; if (focusLine) { scene.remove(focusLine); focusLine.geometry.dispose(); focusLine = null; }
    if (topo) return;
    applyTopo(); if (focusSet) { flow = focusSet.links; focusLine = lineSet(focusSet.links, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .9 })); scene.add(focusLine); }
    dirty = true;
  }
  function setFilter(f) { filter = f; dirty = true; for (const k in nodes) nodes[k].el.classList.toggle('filtered', !!f && !f.has(k)); }
  function focus(id) { const p = POS(id), t = new THREE.Vector3(p[0], p[1], p[2]); tween(t, t.clone().add(cam.position.clone().sub(controls.target)), Math.max(cam.zoom, 1.7)); }

  /* ---- run visuals ---- */
  const CYL = new THREE.CylinderGeometry(1, 1, 1, 8), UPV = new THREE.Vector3(0, 1, 0);
  const headG = new THREE.SphereGeometry(.42, 14, 10), headA = new THREE.TetrahedronGeometry(.62), trailG = new THREE.SphereGeometry(.15, 6, 5), trailA = new THREE.TetrahedronGeometry(.24);
  let rv = [];
  function seg(a, b, dashed) {
    const g = new THREE.Group(), dir = b.clone().sub(a), len = dir.length(); g.position.copy(a); g.quaternion.setFromUnitVectors(UPV, dir.clone().normalize());
    const fm = new THREE.MeshBasicMaterial({ color: 0x8fa3c8, transparent: true, opacity: .35 }), mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const faint = new THREE.Mesh(CYL, fm); faint.scale.set(.045, len, .045); faint.position.y = len / 2; g.add(faint);
    const parts = [], n = dashed ? Math.max(2, Math.round(len / 1.1)) : 1;
    for (let i = 0; i < n; i++) { const m = new THREE.Mesh(CYL, mat); m.scale.set(.14, dashed ? len / n * .55 : 1, .14); m.position.y = (i + .5) * len / n; m.visible = false; g.add(m); parts.push(m); }
    return { g, len, a, b, mat, fm, set(p) { if (dashed) parts.forEach((m, i) => m.visible = p > 0 && (i + .5) / n <= p + 1e-6); else { const m = parts[0]; m.visible = p > .001; m.scale.y = Math.max(.001, p * len); m.position.y = p * len / 2; } } };
  }
  function setView(m) { viewMode = m; rv.forEach(v => v.camInit = false); dirty = true; }
  /* fog of war (follow views): only what the actor has reached, what is close to it and the products that have already acted are visible */
  const warFog = new THREE.FogExp2(0x070b16, .018), WAR_R = 7.5;
  let warWant = true, warOn = false;
  function setFogWar(on) { warWant = on; dirty = true; }
  function applyWar(fol) {
    const lead = rv[0], on = warWant && fol && !split && !topo && !!lead;
    if (!on) {
      if (warOn) { warOn = false; refreshVis(); for (const id in nodes) nodes[id].fog = false, nodes[id].el.classList.remove('fog'); baseLinks.visible = !topo && !focusSet; if (lensLine) lensLine.visible = !topo && !focusSet; if (selLine) selLine.visible = true;
        rv.forEach(v => v.segs.forEach(s => s.fm.visible = true)); gfxApply(); dirty = true; }
      return;
    }
    warOn = true; scene.fog = warFog; baseLinks.visible = false; spLinks.visible = false; if (lensLine) lensLine.visible = false; if (selLine) selLine.visible = false;
    const P = prog(lead.r), seen = new Set(), hp = lead.head.position;
    lead.r.path.forEach((n, i) => { if (i < P.moves - .4) seen.add(n); });
    lead.r.tl.forEach((e, k) => { if (k <= P.cur || k <= P.k) { seen.add(e.at); (e.also || []).forEach(a => seen.add(a)); } });
    lead.segs.forEach(s => s.fm.visible = false);
    for (const id in nodes) {
      const n = nodes[id], p = n.g.position, near = Math.hypot(p.x - hp.x, p.z - hp.z) < WAR_R && Math.abs(p.y - (hp.y - lead.lift)) < 6;
      const vis = shown(id) && (seen.has(id) || near);
      n.g.visible = vis; if (!!n.fog === vis) { n.fog = !vis; n.el.classList.toggle('fog', !vis); dirty = true; }
    }
  }
  /* every run keeps its own follow-camera pose, so in split view each half follows its own actor */
  function updateFollow(now) {
    const dt = Math.min(100, now - lastNow); lastNow = now; const fol = viewMode !== 'orbit' && rv.length > 0, fp = viewMode === 'first';
    controls.enabled = !fol;
    for (const v of rv) {
      if (!fol || (!split && v !== rv[0])) { v.camInit = false; continue; }
      const sg = v.segs[v.si || 0], hs = v.isHuman ? 1 : .45, P = v.head.position;
      tA.copy(sg.b).sub(sg.a).setY(0); if (tA.lengthSq() < 1e-6) tA.set(1, 0, 0); tA.normalize();
      if (!v.dirS) { v.dirS = tA.clone(); v.camP = new THREE.Vector3(); v.camL = new THREE.Vector3(); }
      v.dirS.lerp(tA, RM.matches ? 1 : 1 - Math.exp(-dt * .004)).normalize();   /* turn corners smoothly */
      const d = v.dirS;
      if (fp) { tP.copy(P).addScaledVector(d, .9 * hs); tP.y = P.y + 6.6 * hs + (v.isHuman ? 0 : .8); tL.copy(tP).addScaledVector(d, 12); tL.y = tP.y - 2.8 * hs; }
      else { tP.copy(P).addScaledVector(d, -30 * hs); tP.y = P.y + 21 * hs; tL.copy(P).addScaledVector(d, 12 * hs); tL.y = P.y + 3 * hs; }
      if (!v.camInit || RM.matches) { v.camP.copy(tP); v.camL.copy(tL); v.camInit = true; } else { const k = 1 - Math.exp(-dt * .006); v.camP.lerp(tP, k); v.camL.lerp(tL, k); }
    }
    return fol;
  }
  function ensureLayer2() {   /* second label layer for the right-hand view: clones, kept out of the tab order */
    for (const id in nodes) { const n = nodes[id]; if (n.L[1]) continue; const el = n.el.cloneNode(true); el.tabIndex = -1; el.setAttribute('aria-hidden', 'true'); labels2.appendChild(el); n.L[1] = { el }; }
  }
  function applySplit() {
    const ns = splitWant && rv.length === 2; if (ns === split) return; split = ns; stage.classList.toggle('split', split);
    if (split) ensureLayer2(); labels2.style.display = split ? '' : 'none'; resize(); home(true);
  }
  function setSplit(on) { splitWant = on; applySplit(); }
  function setRuns(runs) {
    rv.forEach(v => { scene.remove(v.g); v.g.traverse(o => { if (o.material) o.material.dispose?.(); }); v.chip.remove(); }); rv = [];
    for (const r of runs) {
      const g = new THREE.Group(), lift = r.slot * .55 + .9, hostile = r.hostile;
      const ap = actorPos(r, r.slot), pts = [new THREE.Vector3(ap[0], lift, ap[2]), ...r.path.map(n => { const p = POS(n); return new THREE.Vector3(p[0], p[1] + lift, p[2]); })];
      const am = new THREE.MeshStandardMaterial({ color: hostile ? 0xff6a5c : (r.slot ? 0xffd9a8 : 0xe6ecfa), roughness: .5, flatShading: true });
      const isHuman = !!HUMAN[r.s.who], role = roleOf(r.s, S.preset, r.slot);
      const actor = isHuman ? human(r.s.who, r.slot, role) : build(ACTOR[r.s.who], am); actor.position.set(ap[0], 0, ap[2]); g.add(actor);
      const dev = build(DEVICE[r.s.device], new THREE.MeshStandardMaterial({ color: r.s.device === 'compromised' ? 0xff6a5c : 0x9fb3dd, roughness: .5, flatShading: true }));
      if (isHuman) { dev.scale.setScalar(.6); dev.position.set(1.0, 1.2, .35); actor.add(dev); }      /* humans carry their device as they walk */
      else { dev.position.set(ap[0] + 1.5, 0, ap[2] + .9); g.add(dev); }
      const segs = pts.slice(0, -1).map((a, i) => { const s = seg(a, pts[i + 1], hostile); g.add(s.g); return s; });
      const head = new THREE.Mesh(hostile ? headA : headG, new THREE.MeshBasicMaterial({ color: 0xffffff })); head.visible = !isHuman; g.add(head);
      const trail = new THREE.InstancedMesh(hostile ? trailA : trailG, new THREE.MeshBasicMaterial({ color: 0xffffff }), 14); trail.frustumCulled = false; g.add(trail);
      /* consult beams: path hop (or telemetry sources) → product doing the check */
      const beams = r.tl.map(e => {
        const to = POS(e.at), tv = new THREE.Vector3(to[0], to[1] + 1, to[2]);
        const srcs = e.beams ? e.beams : e.from && PR[e.from] ? [e.from] : e.hop && e.hop !== e.at ? [e.hop] : [];
        const ptsB = []; for (const sId of srcs) { const sp = POS(sId); ptsB.push(sp[0], sp[1] + 1, sp[2], tv.x, tv.y, tv.z); }
        if (!ptsB.length) return null;
        const bg = new THREE.BufferGeometry(); bg.setAttribute('position', new THREE.Float32BufferAttribute(ptsB, 3));
        const l = new THREE.LineSegments(bg, new THREE.LineBasicMaterial({ color: LENS[e.lens].color, transparent: true, opacity: 0 })); g.add(l); return l;
      });
      /* verdict marker: distinct shape per verdict, not only colour */
      const mk = new THREE.Group(), mm = new THREE.MeshBasicMaterial({ color: VCOL[r.verdict] });
      const bar = (rz) => { const m = new THREE.Mesh(prim('b'), mm); m.scale.set(2.6, .28, .28); m.rotation.z = rz; mk.add(m); };
      if (r.verdict === 'BLOCK') { bar(Math.PI / 4); bar(-Math.PI / 4); }
      else if (r.verdict === 'CONTAIN') { const c = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3, 3.4, 3)), new THREE.LineBasicMaterial({ color: mm.color })); c.position.y = .6; mk.add(c); }
      else if (r.verdict === 'STEPUP') { const t = new THREE.Mesh(new THREE.TorusGeometry(1.2, .13, 8, 28), mm); mk.add(t); const k = new THREE.Mesh(prim('k'), mm); k.scale.set(.8, .9, .8); k.position.y = .1; mk.add(k); }
      else if (r.verdict === 'LIMIT') { const t = new THREE.Mesh(new THREE.TorusGeometry(1.2, .13, 8, 28, Math.PI * 1.25), mm); mk.add(t); }
      const at = r.stopAt >= 0 ? pts[r.stopAt + 1] : (r.verdict === 'CONTAIN' ? pts[1] : pts[pts.length - 1]);
      mk.position.copy(at).add(new THREE.Vector3(0, r.verdict === 'CONTAIN' ? 0 : 2.6, 0)); mk.visible = false; g.add(mk);
      const chip = document.createElement('div'); chip.className = 'tchip'; labels.appendChild(chip);
      scene.add(g); rv.push({ r, g, pts, segs, head, trail, beams, mk, chip, hostile, actor, isHuman, lift, name: role.label });
    }
    colorRuns(); applySplit(); dirty = true;
  }
  function colorRuns() {
    for (const v of rv) v.segs.forEach((s, i) => {
      const enc = v.r.segs[i].ty === 'enc';
      if (lens === 'data') s.mat.color.set(enc ? LENS.data.color : '#9db0d6'); else if (lens !== 'trust') s.mat.color.set(v.r.slot ? '#ffd9a8' : LENS[lens].color);
      s.fm.color.set(v.hostile ? '#ff7a6b' : '#8fa3c8');
    });
  }
    function frameRuns(now) {
    for (const v of rv) {
      const P = prog(v.r), n = v.segs.length; let L = 0;
      const curTrust = P.k >= 0 ? v.r.tl[P.k].trust : v.r.series[0].v;
      v.segs.forEach((s, i) => { const p = clamp(P.moves - i, 0, 1); s.set(p); L += p * s.len;
        if (lens === 'trust') { let t = v.r.series[0].v; for (const e of v.r.tl) if (e.hi < i) t = e.trust; s.mat.color.set(trustColor(t)); } });
      let si = 0;
      const along = d => { let i = 0; while (i < n - 1 && d > v.segs[i].len) d -= v.segs[i++].len; si = i; return tv3.copy(v.segs[i].a).lerp(v.segs[i].b, clamp(d / v.segs[i].len, 0, 1)); };
      v.head.position.copy(along(L)); v.head.rotation.y = now * .002; v.si = si;
      if (v.isHuman) {   /* the figure walks the path: faces its direction of travel, limbs swing while moving */
        const sg = v.segs[si], st = v.r.steps[v.r.pb.i], moving = S.playing && st && st.t === 'move' && !RM.matches, ph = now * .012, sw = moving ? Math.sin(ph) * .75 : 0, u = v.actor.userData;
        v.actor.position.set(v.head.position.x, v.head.position.y - v.lift + (moving ? Math.abs(Math.sin(ph)) * .14 : 0), v.head.position.z);
        v.actor.rotation.y = Math.atan2(sg.b.x - sg.a.x, sg.b.z - sg.a.z);
        u.legL.rotation.x = sw; u.legR.rotation.x = -sw; u.armL.rotation.x = -sw * .8; u.armR.rotation.x = sw * .8;
      }
      tc.set(lens === 'trust' ? trustColor(curTrust) : v.hostile ? '#ff7a6b' : v.r.slot ? '#ffd9a8' : '#ffffff'); v.head.material.color.copy(tc); v.trail.material.color.copy(tc);
      for (let j = 0; j < 14; j++) { const f = RM.matches ? j / 14 : ((now * .00022 + j / 14) % 1); dummy.position.copy(along(f * L)); dummy.scale.setScalar(L > .5 ? 1 : 0); dummy.rotation.set(0, now * .003, 0); dummy.updateMatrix(); v.trail.setMatrixAt(j, dummy.matrix); }
      v.trail.instanceMatrix.needsUpdate = true;
      v.beams.forEach((b, k) => { if (b) b.material.opacity = k === P.cur ? .95 : k <= P.k ? (lens === v.r.tl[k].lens ? .45 : .14) : 0; });
      v.mk.visible = P.done || (v.r.stopAt >= 0 && P.moves >= v.r.stopAt + 1); v.curTrust = curTrust;
    }
  }
  /* name-and-trust chip above the actor, for the view being drawn */
  function chipRun(v, own) {
    tv3.copy(v.head.position); if (v.isHuman) tv3.y += 9.6; tv3.project(view); const cx = sx(), top = sy(), bh = tv3.z > 1;
    if (v.isHuman) { tv3.copy(v.head.position).project(view); const bot = sy(), hw = Math.max(8, (bot - top) * .22); v.box = bh || tv3.z > 1 ? null : [cx - hw, top, cx + hw, bot]; }
    v.chip.style.display = own ? 'none' : ''; v.chip.style.visibility = bh ? 'hidden' : '';
    v.chip.style.transform = `translate(${cx.toFixed(1)}px,${top.toFixed(1)}px) translate(-50%,${v.isHuman ? -105 : -190}%)`;
    v.chip.style.setProperty('--c', trustColor(v.curTrust)); v.chip.style.opacity = lens === 'trust' ? 1 : .8;
    const txt = `<b>${S.runs.length > 1 ? 'AB'[v.r.slot] + ' · ' : ''}${h(v.name)}</b> · trust ${v.curTrust}`; if (v.txt !== txt) v.chip.innerHTML = v.txt = txt;
  }
  /* project one label layer; when cullNow, hide lower-priority labels that would overlap (they stay focusable) */
  function layoutLabels(li, runs, cullNow) {
    const onPath = new Set(), hit = new Set();
    for (const v of runs) { const P = prog(v.r); v.r.path.forEach((n, i) => { onPath.add(n); if (i < P.moves) hit.add(n); }); v.r.tl.forEach((e, k) => { onPath.add(e.at); if (k <= P.k) hit.add(e.at); }); }
    const items = [];
    for (const id in nodes) {
      const n = nodes[id], L = n.L[li]; tv3.copy(n.anchor).project(view); L.x = sx(); L.y = sy(); L.bh = tv3.z > 1;   /* behind the camera */
      L.el.style.transform = `translate(${L.x.toFixed(1)}px,${L.y.toFixed(1)}px) translate(-50%,-100%)`;
      L.el.classList.toggle('hit', hit.has(id));
      if (n.fog) continue;
      L.pr = id === selected ? 100 : hit.has(id) ? 80 : onPath.has(id) ? 70 : (filter && filter.has(id)) ? (topo ? 100 : 60) : n.isP ? (n.p.roles[lens] ? 50 : 30) : 20;
      items.push(L);
    }
    if (!cullNow) return;
    items.sort((a, b) => b.pr - a.pr); const placed = runs.filter(v => v.isHuman && v.box).map(v => v.box);   /* labels step aside for the walking figure */
    for (const L of items) {
      const x0 = L.x - L.w / 2 - 2, x1 = L.x + L.w / 2 + 2, y0 = L.y - L.h - 1, y1 = L.y + 1;
      const out = L.bh || x1 < vx || x0 > vx + Wv || y1 < 0 || y0 > H;
      const clash = !out && (L.pr < 100 || topo === null && rv.length) && L.pr <= 100 && placed.some(b => x0 < b[2] && x1 > b[0] && y0 < b[3] && y1 > b[1]);
      L.el.classList.toggle('cull', out || clash); if (!out && !clash) placed.push([x0, y0, x1, y1]);
    }
  }
  function frame(now) {
    if (tw) { const k = clamp((now - tw.t0) / tw.d, 0, 1), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      controls.target.lerpVectors(tw.ft, tw.tt, e); cam.position.lerpVectors(tw.fp, tw.tp, e); cam.zoom = tw.fz + (tw.tz - tw.fz) * e; cam.updateProjectionMatrix(); if (k >= 1) tw = null; }
    controls.update(); const fol = updateFollow(now), fp = fol && viewMode === 'first'; applyWar(fol); updateFx(now); const sh = shakeVec(now);
    /* frame-rate guard: bloom and fog stay only if roughly 50 fps or better holds over two seconds */
    if (gfxWant && gfxOK && !gfxForce) {   /* watch the frame time in short windows (20 frames or 0.7 s, whichever comes first); two slow windows in a row, under about 45 fps, switch bloom and fog off */
      const d = now - gfxPrev; if (d < 1000 && ++gfxSkip > 3) { gfxSum += d; gfxN++; if (gfxN >= 20 || gfxSum >= 700) { gfxBad = gfxSum / gfxN > 22 ? gfxBad + 1 : 0; gfxSum = gfxN = 0;
        if (gfxBad >= 2) { gfxOK = false; gfxApply(); try { sessionStorage.setItem('ln-gfx', '0'); } catch (e) { } } } } }
    gfxPrev = now; renderer.info.reset(); hoverNow();
    /* ambient particles along the links the lens cares about */
    const show = flow.length && !RM.matches && !fol;   /* ambient traffic is an overview effect; it is distracting up close */
    for (let i = 0; i < NP; i++) {
      if (!show) { dummy.scale.setScalar(0); } else {
        const l = flow[i % flow.length], A = POS(l[0]), B = POS(l[1]), f = ((now * .00018 + i * .137) % 1);
        va.set(A[0], A[1] + .5, A[2]); vb.set(B[0], B[1] + .5, B[2]); dummy.position.lerpVectors(va, vb, f); dummy.scale.setScalar(S.runs.length && lens !== 'policy' && lens !== 'threat' ? .55 : 1);
      }
      dummy.rotation.set(0, 0, 0); dummy.updateMatrix(); amb.setMatrixAt(i, dummy.matrix);
    }
    amb.instanceMatrix.needsUpdate = true;
    for (const id in nodes) { const n = nodes[id]; if (n.dia && n.dia.visible) n.dia.rotation.y = now * .0015; }
    frameRuns(now);
    const compact = fol || H / (2 * VS) * cam.zoom < 12.5;
    if (labels.classList.contains('compact') !== compact) { labels.classList.toggle('compact', compact); dirty = true; }
    if (dirty) {   /* re-measure labels; the right-hand layer mirrors the left one's text and state */
      for (const id in nodes) { const n = nodes[id], a = n.L[0], b = n.L[1]; a.w = n.el.offsetWidth; a.h = n.el.offsetHeight;
        if (b && split) { b.el.innerHTML = n.el.innerHTML; b.el.className = n.el.className.replace(/\b(hit|cull)\b/g, ''); b.w = b.el.offsetWidth; b.h = b.el.offsetHeight; } }
      dirty = false; tick = 0; labelDirty = true;
    }
    const cullTick = fol || tick++ % 5 === 0, passes = split ? [[rv[0]], [rv[1]]] : [rv], relaid = labelDirty; labelDirty = false;
    renderer.setScissorTest(split);
    passes.forEach((runs, pi) => {
      const lead = runs[0]; vx = split ? pi * Wv : 0;
      if (fol && lead && lead.camInit) { pcam.position.copy(lead.camP); pcam.lookAt(lead.camL); view = pcam; } else view = cam;
      view.position.add(sh); view.updateMatrixWorld();
      if (split) { rv.forEach(x => x.g.visible = x === lead); renderer.setViewport(vx, 0, Wv, H); renderer.setScissor(vx, 0, Wv, H); }
      for (const x of rv) if (x.isHuman) x.actor.visible = !(fp && x === lead);   /* in 1st person you do not see yourself */
      for (const x of runs) x.mk.quaternion.copy(view.quaternion);
      fxVisible(split && lead ? lead.r.slot : null);
      if (composer && gfxWant && gfxOK && !split) { rpass.camera = view; composer.render(); } else renderer.render(scene, view);
      for (const x of runs) chipRun(x, fp && x === lead);
      /* signature of everything label positions depend on: camera pose and zoom, viewport, playhead */
      let sig = W + '|' + H + '|' + vx + '|' + (view.zoom || 0); const me = view.matrixWorld.elements; for (let i = 0; i < 16; i++) sig += '|' + me[i].toFixed(3); for (const x of rv) sig += '|' + x.r.pb.i + (x.r.pb.done ? 'd' : '') + x.head.position.x.toFixed(2) + x.head.position.z.toFixed(2);
      const moved = relaid || sig !== labelSig[pi]; labelSig[pi] = sig; if (moved) labelCull[pi] = true;
      const cullNow = moved ? cullTick : labelCull[pi];   /* after the last change, cull once more and then rest */
      if (moved || cullNow) { layoutLabels(pi, runs, cullNow); if (cullNow) labelCull[pi] = false; }
      popsPass(pi);
      if (pi === 0 && moved) {
        for (const z of topoChips) { tv3.copy(z.v).project(view); z.el.style.visibility = tv3.z > 1 ? 'hidden' : ''; z.el.style.transform = `translate(${sx().toFixed(1)}px,${sy().toFixed(1)}px) translate(-50%,-50%)`; }
        for (const z of zoneLbl) { tv3.copy(z.v).project(view); z.el.style.visibility = tv3.z > 1 ? 'hidden' : ''; z.el.style.transform = `translate(${sx().toFixed(1)}px,${sy().toFixed(1)}px) translate(0,-50%)`; }
      }
      if (view === cam) cam.position.sub(sh);   /* the follow camera is re-posed every frame */
    });
    if (split) { rv.forEach(x => x.g.visible = true); renderer.setViewport(0, 0, W, H); renderer.setScissor(0, 0, W, H); }
  }
  /* ---- game-style effects: pooled so nothing is allocated while playing ---- */
  const ADD = { transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide };
  const pool = (n, geo, init) => Array.from({ length: n }, () => { const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial(ADD)); m.visible = false; m.frustumCulled = false; init && init(m); scene.add(m); return { m, on: false }; });
  const fxRings = pool(34, new THREE.RingGeometry(.87, 1, 56), m => m.rotation.x = -Math.PI / 2);
  const fxDomes = pool(4, new THREE.SphereGeometry(1, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2));
  const fxPillars = pool(3, new THREE.CylinderGeometry(1, 1, 1, 24, 1, true));
  let fri = 0, fdi = 0, fpi = 0, fsi = 0, fxLast = 0, sparksAlive = 0; const pulses = {}, pops = [], shake = { t0: 0, d: 0, amp: 0 }, shakeOff = new THREE.Vector3();
  let fxSlot = null;   /* which scenario an effect belongs to, so split view shows it only on that side */
  const emit = (arr, i, p, col, o) => { const e = arr[i % arr.length]; Object.assign(e, { on: true, vis: false, slot: fxSlot, t0: performance.now() + (o.delay || 0), d: o.d || 700, r0: o.r0 ?? .6, r1: o.r1 ?? 6, a: o.a ?? .9, h: o.h || 1 }); e.m.position.set(p[0], p[1] + (o.y ?? .3), p[2]); e.m.material.color.set(col); };
  const ring = (p, col, o = {}) => emit(fxRings, fri++, p, col, o), dome = (p, col, o = {}) => emit(fxDomes, fdi++, p, col, o), pillar = (p, col, o = {}) => emit(fxPillars, fpi++, p, col, o);
  const NS = 420, sparks = new THREE.InstancedMesh(new THREE.TetrahedronGeometry(.17), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), NS); sparks.frustumCulled = false; scene.add(sparks);
  const sp = new Float32Array(NS * 8), white = new THREE.Color(0xffffff);   /* x y z vx vy vz life max */
  for (let i = 0; i < NS; i++) { dummy.scale.setScalar(0); dummy.updateMatrix(); sparks.setMatrixAt(i, dummy.matrix); sparks.setColorAt(i, white); }
  function burst(p, col, n, o = {}) {
    for (let k = 0; k < n; k++) { const i = fsi++ % NS, j = i * 8, an = Math.random() * Math.PI * 2, s = (o.speed ?? 6) * (.35 + Math.random() * .65), life = (o.life ?? 900) * (.6 + Math.random() * .4);
      sp[j] = p[0]; sp[j + 1] = p[1] + (o.y ?? 1); sp[j + 2] = p[2]; sp[j + 3] = Math.cos(an) * s; sp[j + 4] = (o.up ?? 5) * (.4 + Math.random()); sp[j + 5] = Math.sin(an) * s; sp[j + 6] = sp[j + 7] = life;
      sparks.setColorAt(i, tc.set(col).lerp(white, Math.random() * .45)); }
    sparks.instanceColor.needsUpdate = true; sparksAlive = NS;
  }
  const pulse = id => { if (nodes[id]) pulses[id] = performance.now(); };
  function pop(p, text, col, dy) { const el = document.createElement('div'); el.className = 'pop'; el.textContent = text; el.style.setProperty('--c', col); labels.appendChild(el); pops.push({ el, pi: split ? Math.max(0, rv.findIndex(x => x.r.slot === fxSlot)) : 0, v: new THREE.Vector3(p[0], p[1] + (dy ?? 4), p[2]), t0: performance.now() }); }
  function fx(type, o) {
    fxSlot = o.slot ?? null; const p = o.id ? POS(o.id) : o.p, col = o.color || '#ffffff';
    if (type === 'hop') ring(p, col, { r1: 3, d: 450, a: .55 });
    else if (type === 'check') { ring(p, col, { r1: 4.4, d: 650 }); ring(p, col, { r1: 2.6, d: 520, delay: 120, a: .6 }); pulse(o.id); burst(p, col, 10, { speed: 3, up: 4, life: 600 }); }
    else if (type === 'detect') { [0, 150, 300].forEach(delay => ring(p, col, { r1: 7.5, d: 820, delay })); pulse(o.id); burst(p, col, 24, { speed: 6, up: 5, life: 850 }); }
    else if (type === 'select') { ring(p, '#ffffff', { r1: 3.6, d: 520, a: .7 }); pulse(o.id); }
    else if (type === 'pop') pop(p, o.text, col, 4.5);
    else if (type === 'trust') { const v = rv.find(x => x.r.slot === o.slot); if (v) pop([v.head.position.x, v.head.position.y, v.head.position.z], o.text, col, v.isHuman ? 12 : 3); }
    else if (type === 'verdict') {
      const c2 = VCOL[o.v];
      if (o.v === 'ALLOW') { pillar(p, c2, { r0: 1.6, r1: 2.6, h: 26, d: 1500, a: .5 }); [0, 180, 360].forEach(delay => ring(p, c2, { r1: 10, d: 1100, delay })); burst(p, c2, 80, { speed: 7, up: 13, life: 1500 }); }
      else if (o.v === 'LIMIT') { pillar(p, c2, { r0: 1.4, r1: 2, h: 12, d: 1100, a: .4 }); [0, 220].forEach(delay => ring(p, c2, { r1: 7, d: 950, delay })); burst(p, c2, 34, { speed: 5, up: 8, life: 1100 }); }
      else if (o.v === 'STEPUP') { [0, 170, 340, 510].forEach(delay => ring(p, c2, { r1: 4.2, d: 620, delay })); burst(p, c2, 18, { speed: 3, up: 7, life: 900 }); pop(p, '?', c2, 6); }
      else if (o.v === 'BLOCK') { dome(p, c2, { r0: 1.5, r1: 5.2, d: 800, a: .75 }); ring(p, c2, { r1: 13, d: 600 }); ring(p, c2, { r1: 8, d: 800, delay: 120 }); burst(p, c2, 95, { speed: 12, up: 4, life: 1000 }); shake.t0 = performance.now(); shake.d = 420; shake.amp = .55; }
      else if (o.v === 'CONTAIN') { [0, 160, 320].forEach(delay => ring(p, c2, { r0: 10, r1: 1.8, d: 700, delay })); dome(p, c2, { r0: 6, r1: 3.2, d: 1300, a: .7 }); burst(p, c2, 60, { speed: 5, up: 9, life: 1200 }); shake.t0 = performance.now(); shake.d = 320; shake.amp = .35; }
    }
  }
  function updateFx(now) {
    const dt = Math.min(.1, (now - fxLast) / 1000); fxLast = now;
    const run = (arr, f) => { for (const e of arr) { if (!e.on) continue; const k = (now - e.t0) / e.d; if (k < 0) { e.vis = false; continue; } if (k >= 1) { e.on = e.vis = false; e.m.visible = false; continue; } e.vis = true; f(e, k, 1 - Math.pow(1 - k, 3)); } };
    run(fxRings, (e, k, ez) => { e.m.scale.setScalar(e.r0 + (e.r1 - e.r0) * ez); e.m.material.opacity = e.a * (1 - k); });
    run(fxDomes, (e, k, ez) => { e.m.scale.setScalar(e.r0 + (e.r1 - e.r0) * ez); e.m.material.opacity = e.a * (1 - k) * .6; });
    run(fxPillars, (e, k, ez) => { const r = e.r0 + (e.r1 - e.r0) * ez, hh = e.h * Math.min(1, k * 4); e.m.scale.set(r, hh, r); e.m.position.y = hh / 2; e.m.material.opacity = e.a * (1 - k); });
    if (sparksAlive) { let alive = 0;
      for (let i = 0; i < NS; i++) { const j = i * 8; if (sp[j + 6] <= 0) continue; sp[j + 6] -= dt * 1000; sp[j + 4] -= 14 * dt; sp[j] += sp[j + 3] * dt; sp[j + 1] += sp[j + 4] * dt; sp[j + 2] += sp[j + 5] * dt;
        const s = Math.max(0, sp[j + 6] / sp[j + 7]); if (s > 0) alive++; dummy.position.set(sp[j], Math.max(.1, sp[j + 1]), sp[j + 2]); dummy.scale.setScalar(s * 1.6); dummy.rotation.set(now * .004 + i, now * .003, 0); dummy.updateMatrix(); sparks.setMatrixAt(i, dummy.matrix); }
      sparks.instanceMatrix.needsUpdate = true; sparksAlive = alive; }
    for (const id in pulses) { const k = (now - pulses[id]) / 380; nodes[id].g.scale.setScalar(k >= 1 ? 1 : 1 + .5 * (1 - k) * (1 - k)); if (k >= 1) delete pulses[id]; }
    for (let i = pops.length - 1; i >= 0; i--) { const q = pops[i]; if (now - q.t0 > 1400) { q.el.remove(); pops.splice(i, 1); } }
  }
  const fxVisible = slot => { for (const arr of [fxRings, fxDomes, fxPillars]) for (const e of arr) e.m.visible = e.on && e.vis && (slot == null || e.slot == null || e.slot === slot); };
  function popsPass(pi) { for (const q of pops) { if (q.pi !== pi) continue; tv3.copy(q.v).project(view); q.el.style.visibility = tv3.z > 1 ? 'hidden' : ''; q.el.style.transform = `translate(${sx().toFixed(1)}px,${sy().toFixed(1)}px) translate(-50%,-50%)`; } }
  /* camera shake for hard stops: a decaying random offset applied only while a view is drawn */
  function shakeVec(now) {
    shakeOff.set(0, 0, 0); const k = (now - shake.t0) / shake.d; if (k < 0 || k >= 1 || RM.matches) return shakeOff;
    const a = shake.amp * (1 - k); return shakeOff.set((Math.random() - .5) * a * 2, (Math.random() - .5) * a * 2, (Math.random() - .5) * a * 2);
  }
  /* keyboard camera: rotate, pan and zoom the overview without a pointer */
  function nudge(kind, a, b) {
    if (viewMode !== 'orbit' && rv.length) return false; tw = null;
    if (kind === 'rot') { const off = cam.position.clone().sub(controls.target), s = new THREE.Spherical().setFromVector3(off); s.theta += a; s.phi = clamp(s.phi + b, .12, controls.maxPolarAngle); off.setFromSpherical(s); cam.position.copy(controls.target).add(off); cam.lookAt(controls.target); }
    else if (kind === 'zoom') { cam.zoom = clamp(cam.zoom * a, controls.minZoom, controls.maxZoom); cam.updateProjectionMatrix(); }
    else { const k = 3 / cam.zoom, d = new THREE.Vector3().setFromMatrixColumn(cam.matrix, 0).multiplyScalar(a * k).add(new THREE.Vector3().setFromMatrixColumn(cam.matrix, 1).multiplyScalar(b * k)); cam.position.add(d); controls.target.add(d); }
    return true;
  }
  /* picking */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let down = null;
  const pick = e => { const b = canvas.getBoundingClientRect(), w = split ? b.width / 2 : b.width; let x = e.clientX - b.left, pi = 0; if (split && x >= w) { pi = 1; x -= w; }
    let pc = cam; const lead = rv[split ? pi : 0]; if (viewMode !== 'orbit' && lead && lead.camInit) { pcam.position.copy(lead.camP); pcam.lookAt(lead.camL); pc = pcam; } pc.updateMatrixWorld();
    ndc.set(x / w * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1); ray.setFromCamera(ndc, pc);
    const seen = o => { for (; o; o = o.parent) if (!o.visible) return false; return true; }, hit = ray.intersectObjects(pickables, false).find(x => seen(x.object)); return hit ? hit.object.userData.id : null; };
  /* dragging in 3rd person leaves the follow view: the overview camera takes over from the current follow pose */
  function handover() {
    const lead = rv[0]; if (!lead || !lead.camInit) return false;
    const dir = lead.camP.clone().sub(lead.camL), d = Math.max(1, dir.length());
    controls.target.copy(lead.camL); cam.position.copy(lead.camL).addScaledVector(dir.normalize(), HOME_O.length());
    cam.zoom = clamp(VS / (d * Math.tan(THREE.MathUtils.degToRad(pcam.fov / 2))), controls.minZoom, controls.maxZoom);
    cam.lookAt(controls.target); cam.updateProjectionMatrix(); tw = null; return true;
  }
  let handing = null, hoverAt = null;
  canvas.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; tw = null; });
  canvas.addEventListener('pointerup', e => { if (!handing && down && Math.hypot(e.clientX - down[0], e.clientY - down[1]) < 6) { const id = pick(e); window.__select(id, false); } down = null; handing = null; });
  canvas.addEventListener('pointermove', e => {
    if (down && e.buttons && !handing && viewMode === 'third' && !split && Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 4 && handover()) {
      handing = [e.clientX, e.clientY]; canvas.dispatchEvent(new CustomEvent('ln-handover')); return;
    }
    if (handing && e.buttons) { nudge('rot', -(e.clientX - handing[0]) * .006, -(e.clientY - handing[1]) * .004); handing = [e.clientX, e.clientY]; return; }
    if (e.pointerType === 'touch' || e.buttons) { hoverAt = null; return tip(null); } hoverAt = { clientX: e.clientX, clientY: e.clientY }; });   /* the ray is cast once per frame, in frame() */
  function hoverNow() { if (!hoverAt) return; const e = hoverAt; hoverAt = null; const id = pick(e), b = stage.getBoundingClientRect(); canvas.style.cursor = id ? 'pointer' : 'grab'; tip(id, e.clientX - b.left, e.clientY - b.top); }
  canvas.addEventListener('pointerleave', () => { hoverAt = null; tip(null); });
  new ResizeObserver(resize).observe(stage); resize(); home(true); gfxApply(); renderer.info.autoReset = false;
  const screenOf = id => { const b = canvas.getBoundingClientRect(), p = POS(id); cam.updateMatrixWorld(); tv3.set(p[0], p[1] + .85, p[2]).project(cam); return [b.left + (tv3.x * .5 + .5) * (split ? b.width / 2 : b.width), b.top + (-tv3.y * .5 + .5) * b.height]; };
  /* scene image for export: redraw, then copy the canvas and paint the visible labels on top in the same task */
  function snapshot() {
    frame(performance.now()); const dpr = renderer.getPixelRatio(), cv = document.createElement('canvas'); cv.width = canvas.width; cv.height = canvas.height;
    const g = cv.getContext('2d'); g.drawImage(canvas, 0, 0); g.scale(dpr, dpr); g.textAlign = 'center'; g.textBaseline = 'middle'; const sb = stage.getBoundingClientRect();
    for (const el of labels.querySelectorAll('.lbl:not(.cull):not(.gone):not(.zone), .tchip, .nchip')) {
      const cs = getComputedStyle(el), r = el.getBoundingClientRect(); if (cs.display === 'none' || cs.visibility === 'hidden' || r.width < 2 || el.parentElement.style.display === 'none') continue;
      const x = r.left - sb.left, y = r.top - sb.top, sm = el.querySelector('small'), name = sm ? el.childNodes[0].textContent : el.textContent, vis = sm && getComputedStyle(sm).display !== 'none';
      g.globalAlpha = Math.max(.35, +cs.opacity || 1); g.fillStyle = 'rgba(10,16,32,.86)'; g.strokeStyle = cs.borderColor; g.lineWidth = 1; g.beginPath(); g.roundRect(x, y, r.width, r.height, 6); g.fill(); g.stroke();
      g.fillStyle = cs.color; g.font = `600 ${cs.fontSize} system-ui, sans-serif`; g.fillText(name, x + r.width / 2, y + (vis ? r.height * .32 : r.height / 2));
      if (vis) { g.fillStyle = LENS[lens].color; g.font = '400 9.5px system-ui, sans-serif'; g.fillText(sm.textContent, x + r.width / 2, y + r.height * .72); }
    }
    g.globalAlpha = 1; g.textAlign = 'left'; g.fillStyle = '#a9b6d3'; g.font = '500 11px system-ui, sans-serif'; g.fillText('Living Network · ' + DATA.meta.sceneLabel + ' · independent educational visualization', 12, H - 12);
    return cv;
  }
  return { kind: 'webgl', stats: () => ({ calls: renderer.info.render.calls, tris: renderer.info.render.triangles, geos: renderer.info.memory.geometries }), fx, nudge, snapshot, setSplit, setGfx, setFogWar, isSplit: () => split, gfx: () => ({ bloom: !!composer && gfxWant && gfxOK, fog: !!scene.fog, ok: gfxOK }), setLens, setRuns, setTopo, setFocus, setLayer, setView, frame, focus, setFilter, select, resetView: () => home(false), screenOf, pickAt: (x, y) => pick({ clientX: x, clientY: y }) };
}


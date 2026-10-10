/* Secure Networking Academy: vanilla JS, no build step. Progress is stored in localStorage. */
(function () {
  "use strict";

  /* ───────── state ───────── */
  const KEY = "sna.v1";
  const blank = () => ({ xp: 0, done: {}, seen: {}, badges: [], days: [], best: 0, bossStars: 0, name: "" });
  let S = blank();
  try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { /* storage may be blocked */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };

  const LEVELS = [[0, "Newcomer"], [100, "Explorer"], [300, "Storyteller"], [600, "Architect"], [1000, "Trusted Advisor"]];
  const level = (xp = S.xp) => { let i = 0; LEVELS.forEach((l, k) => { if (xp >= l[0]) i = k; }); return i; };

  const BADGES = {
    first: ["🚀", "First Steps", "Pass your first module"],
    perfect: ["💯", "Flawless", "Score 100% on a module quiz"],
    combo5: ["🔥", "On Fire", "Get 5 correct answers in a row"],
    explorer: ["🧭", "Explorer", "Open every item in an interactive diagram"],
    half: ["⛰️", "Halfway There", "Pass 5 modules"],
    all: ["🏆", "Full Path", "Pass every module"],
    boss: ["👑", "Pitch Master", "Beat the final challenge"],
    streak3: ["📅", "Habit Builder", "Learn on 3 different days"],
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ───────── rewards ───────── */
  function toast(msg) {
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
    $("#toasts").appendChild(t); setTimeout(() => t.remove(), 3500);
  }
  function addXP(n, key) {
    if (key) { if (S.seen[key]) return 0; S.seen[key] = 1; }
    const before = level(); S.xp += n; save(); stats();
    if (level() > before) { toast("⬆️ Level up! You are now " + LEVELS[level()][1]); confetti(); }
    return n;
  }
  function award(id) {
    if (S.badges.includes(id)) return;
    S.badges.push(id); save(); toast(BADGES[id][0] + " Badge unlocked: " + BADGES[id][1]); confetti();
  }
  function touchDay() {
    const d = new Date().toISOString().slice(0, 10);
    if (!S.days.includes(d)) { S.days.push(d); save(); }
    if (S.days.length >= 3) award("streak3");
  }
  function streak() {
    const set = new Set(S.days); let n = 0; const d = new Date();
    if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
    while (set.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function stats() {
    const L = level(), next = LEVELS[L + 1], base = LEVELS[L][0];
    const pct = next ? Math.round(((S.xp - base) / (next[0] - base)) * 100) : 100;
    $("#stats").innerHTML =
      `<span class="chip" title="Experience points">⭐ ${S.xp} XP</span>` +
      `<span class="chip" title="Next: ${next ? next[1] : "max level"}">${LEVELS[L][1]} <span class="lvlbar"><i style="width:${pct}%"></i></span></span>` +
      `<span class="chip" title="Days in a row">🔥 ${streak()}</span>`;
  }

  /* ───────── confetti ───────── */
  function confetti() {
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const c = $("#confetti"), x = c.getContext("2d"); c.width = innerWidth; c.height = innerHeight;
    const cols = ["#0b72e8", "#00b4c8", "#f5a800", "#12a150", "#d93a3a"];
    const ps = Array.from({ length: 120 }, () => ({ x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - .5) * 14, vy: Math.random() * -12 - 2, s: 4 + Math.random() * 6, c: cols[Math.floor(Math.random() * 5)], r: Math.random() * 6 }));
    let f = 0;
    (function tick() {
      x.clearRect(0, 0, c.width, c.height);
      ps.forEach((p) => { p.x += p.vx; p.y += p.vy; p.vy += .4; p.r += .2; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); x.restore(); });
      if (++f < 110) requestAnimationFrame(tick); else x.clearRect(0, 0, c.width, c.height);
    })();
  }

  /* ───────── helpers ───────── */
  const passed = (id) => !!S.done[id];
  const unlocked = (i) => i === 0 || passed(MODULES[i - 1].id);
  const stars = (n) => `<span class="stars" aria-label="${n} of 3 stars">${[1, 2, 3].map((k) => (k <= n ? "★" : '<span class="off">★</span>')).join("")}</span>`;
  const allDone = () => MODULES.every((m) => passed(m.id));
  function sources(m) {
    return `<div class="src"><b>Sources</b><ul>${m.sources.map((s) => `<li><a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.t)}</a></li>`).join("")}</ul></div>` +
      (m.verify ? `<div class="verify">⚠️ <b>Verify before quoting:</b> ${esc(m.verify)}</div>` : "");
  }

  /* ───────── views ───────── */
  const main = $("#main");
  function setView(html) { main.innerHTML = html; main.focus({ preventScroll: true }); scrollTo(0, 0); }

  function viewHome() {
    const doneN = MODULES.filter((m) => passed(m.id)).length;
    const nextIdx = MODULES.findIndex((m) => !passed(m.id));
    const cta = nextIdx === -1 ? ["#/boss", "Take the final challenge"] : [`#/m/${MODULES[nextIdx].id}`, doneN ? "Continue learning" : "Start the journey"];
    const nodes = MODULES.map((m, i) => {
      const lock = !unlocked(i), d = S.done[m.id];
      return `<a class="node ${lock ? "locked" : ""} ${d ? "done" : ""} ${i === nextIdx ? "current" : ""}" ${lock ? 'aria-disabled="true" tabindex="-1"' : `href="#/m/${m.id}"`}>
        <div class="ico">${lock ? "🔒" : d ? "✅" : m.emoji}</div>
        <div><h3>${i + 1}. ${esc(m.title)}</h3><p>${esc(m.tagline)}</p></div>
        ${d ? stars(d.stars) : ""}</a>`;
    }).join("");
    const bossLock = !allDone();
    const badges = Object.entries(BADGES).map(([id, b]) => `<div class="badge ${S.badges.includes(id) ? "" : "off"}"><div class="i">${b[0]}</div><b>${b[1]}</b><small>${b[2]}</small></div>`).join("");
    setView(`
      <section class="hero">
        <h1>Learn to pitch Cisco Secure Networking, step by step</h1>
        <p>Follow the same story customers hear: why it matters, the reference design, identity, campus and branch, the user, assurance, data center and cloud, and AI. Each step ends with a quiz that earns XP and badges.</p>
        <a class="btn" href="${cta[0]}">${cta[1]} →</a>
        <p style="margin:.8em 0 0;font-size:14px">${doneN} of ${MODULES.length} modules passed</p>
      </section>
      <h2>Your learning path</h2>
      <div class="path">${nodes}
        <a class="node ${bossLock ? "locked" : ""} ${S.bossStars ? "done" : ""}" ${bossLock ? 'aria-disabled="true" tabindex="-1"' : 'href="#/boss"'}>
          <div class="ico">${bossLock ? "🔒" : "👑"}</div>
          <div><h3>Final challenge: the customer meeting</h3><p>10 mixed scenario questions drawn from every module.</p></div>${S.bossStars ? stars(S.bossStars) : ""}</a>
        <a class="node ${S.bossStars ? "" : "locked"}" ${S.bossStars ? 'href="#/cert"' : 'aria-disabled="true" tabindex="-1"'}>
          <div class="ico">${S.bossStars ? "🎓" : "🔒"}</div><div><h3>Pitch-ready certificate</h3><p>Printable proof of completion for your profile.</p></div></a>
      </div>
      <h2 style="margin-top:28px">Badges</h2><div class="badges">${badges}</div>`);
  }

  /* Module runner */
  let run = null;
  function steps(m) {
    return [{ k: "story" }, ...m.cards.map((c, i) => ({ k: "card", i })), { k: "explore" }, { k: "pitch" }, { k: "quiz" }];
  }
  function viewModule(id) {
    const mi = MODULES.findIndex((m) => m.id === id);
    if (mi < 0 || !unlocked(mi)) return (location.hash = "#/");
    MODULES[mi].quiz.forEach((q) => { delete q._o; delete q._ord; });
    run = { mi, step: 0, sel: null, opened: new Set(), qs: null, qi: 0, ok: 0, combo: 0, answered: false };
    touchDay(); renderStep();
  }
  function renderStep() {
    const m = MODULES[run.mi], st = steps(m), cur = st[run.step], total = st.length;
    const pct = Math.round((run.step / total) * 100);
    let body = "";
    if (cur.k === "story") {
      body = `<div class="kicker">The story so far</div><h2>${m.emoji} ${esc(m.title)}</h2><p class="simple">${esc(m.story)}</p>`;
    } else if (cur.k === "card") {
      const c = m.cards[cur.i];
      addXP(5, `card:${m.id}:${cur.i}`);
      body = `<div class="kicker">Learn · ${cur.i + 1} of ${m.cards.length}</div><h2>${esc(c.title)}</h2><p class="simple">${esc(c.simple)}</p>
        <details class="deep"><summary>Go deeper (for technical buyers)</summary><p>${esc(c.deep)}</p></details>`;
    } else if (cur.k === "explore") {
      const all = m.explore.layers.flatMap((l) => l.nodes);
      body = `<div class="kicker">Interactive</div><h2>${esc(m.explore.title)}</h2>` +
        m.explore.layers.map((l) => `<div class="layer"><h4>${esc(l.name)}</h4><div class="grid">${l.nodes.map((n) => `<button class="hot ${run.opened.has(n.id) ? "seen" : ""}" data-n="${n.id}"><b>${esc(n.label)}</b><span>${esc(n.short)}</span></button>`).join("")}</div></div>`).join("") +
        `<div class="detail" id="detail" aria-live="polite">👆 Tap an item to see what it is and how to say it. Opened <b id="oc">${run.opened.size}</b> of ${all.length}.</div>`;
    } else if (cur.k === "pitch") {
      body = `<div class="kicker">Say it like this</div><h2>Your pitch for: ${esc(m.pitch.audience)}</h2>
        <div class="say"><small>Script</small>${esc(m.pitch.line)}</div>
        <p class="src">Tip: say it out loud once, in your own words. Then take the quiz.</p>${sources(m)}`;
    } else if (cur.k === "quiz") {
      return renderQuiz();
    }
    const last = run.step === total - 1;
    setView(`<div class="crumbs"><a href="#/">← Path</a> · Module ${run.mi + 1} of ${MODULES.length}</div><div class="prog"><i style="width:${pct}%"></i></div>
      <div class="card">${body}<div class="row noprint"><button class="btn alt" id="back" ${run.step === 0 ? "disabled" : ""}>Back</button>
      <button class="btn" id="next">${last ? "Start quiz" : "Continue"}</button></div></div>`);
    $("#back").onclick = () => { run.step--; renderStep(); };
    $("#next").onclick = () => { run.step++; renderStep(); };
    if (cur.k === "explore") {
      const all = m.explore.layers.flatMap((l) => l.nodes);
      $$(".hot").forEach((b) => b.onclick = () => {
        const n = all.find((x) => x.id === b.dataset.n);
        run.opened.add(n.id); b.classList.add("seen"); $$(".hot").forEach((x) => x.classList.remove("sel")); b.classList.add("sel");
        addXP(5, `node:${m.id}:${n.id}`);
        $("#detail").innerHTML = `<h3>${esc(n.label)}</h3><p>${esc(n.detail)}</p><div class="say"><small>How to say it</small>${esc(n.say)}</div><p class="src">Opened <b>${run.opened.size}</b> of ${all.length}</p>`;
        if (run.opened.size === all.length && all.length > 1) { award("explorer"); }
      });
    }
  }

  /* Quiz (shared by modules and final challenge) */
  function renderQuiz() {
    const boss = run.boss, m = boss ? null : MODULES[run.mi];
    if (!run.qs) run.qs = boss ? run.bossQs : m.quiz;
    const q = run.qs[run.qi], n = run.qs.length;
    run.answered = false;
    let inner = `<div class="kicker">${boss ? "Final challenge" : "Quiz"} · Question ${run.qi + 1} of ${n} ${run.combo >= 2 ? `<span class="combo">🔥 combo ×${run.combo}</span>` : ""}</div><h2>${esc(q.q)}</h2>`;
    if (q.t === "mc") {
      q._o = q._o || shuffle(q.options.map((t, i) => ({ t, i })));
      inner += `<div class="opts">${q._o.map((o) => `<button class="opt" data-i="${o.i}">${esc(o.t)}</button>`).join("")}</div>`;
    } else if (q.t === "tf") {
      inner += `<div class="opts"><button class="opt" data-i="true">True</button><button class="opt" data-i="false">False</button></div>`;
    } else {
      q._ord = q._ord || (() => { let a; do { a = shuffle(q.items); } while (a.join() === q.items.join()); return a; })();
      inner += `<p class="src">Use the arrows to put these in order, then check.</p><ol class="ord" id="ord"></ol><div class="row"><span></span><button class="btn" id="chk">Check order</button></div>`;
    }
    setView(`<div class="crumbs"><a href="#/">← Path</a> · ${boss ? "Final challenge" : esc(m.title)}</div><div class="prog"><i style="width:${Math.round((run.qi / n) * 100)}%"></i></div>
      <div class="card">${inner}<div id="fb"></div></div>`);
    if (q.t === "order") {
      const draw = () => { $("#ord").innerHTML = q._ord.map((t, i) => `<li><span>${esc(t)}</span><button data-u="${i}" aria-label="Move up">▲</button><button data-d="${i}" aria-label="Move down">▼</button></li>`).join(""); };
      draw();
      $("#ord").onclick = (e) => {
        const b = e.target.closest("button"); if (!b || run.answered) return;
        const i = +(b.dataset.u ?? b.dataset.d), j = b.dataset.u !== undefined ? i - 1 : i + 1;
        if (j < 0 || j >= q._ord.length) return;
        [q._ord[i], q._ord[j]] = [q._ord[j], q._ord[i]]; draw();
      };
      $("#chk").onclick = () => { if (run.answered) return; answer(q, q._ord.join("") === q.items.join("")); $("#chk").disabled = true; };
    } else {
      $$(".opt").forEach((b) => b.onclick = () => {
        if (run.answered) return;
        const v = q.t === "tf" ? (b.dataset.i === "true") === q.answer : +b.dataset.i === q.answer;
        $$(".opt").forEach((x) => { x.disabled = true; const xi = q.t === "tf" ? (x.dataset.i === "true") === q.answer : +x.dataset.i === q.answer; if (xi) x.classList.add("right"); });
        if (!v) b.classList.add("wrong");
        answer(q, v);
      });
    }
  }
  function answer(q, ok) {
    run.answered = true;
    const key = run.boss ? `boss:${run.qi}:${q.q}` : `q:${MODULES[run.mi].id}:${run.qi}`;
    let gain = 0;
    if (ok) {
      run.ok++; run.combo++;
      gain = 20 + (run.combo >= 5 ? 10 : run.combo >= 3 ? 5 : 0);
      addXP(gain, key);
      if (run.combo >= 5) award("combo5");
      if (run.combo === 3) toast("🔥 3 in a row! Bonus XP");
    } else run.combo = 0;
    const last = run.qi === run.qs.length - 1;
    $("#fb").innerHTML = `<div class="fb ${ok ? "ok" : "no"}">${ok ? "✅ Correct! " : "❌ Not quite. "}${esc(q.why)}</div>
      <div class="row"><span></span><button class="btn" id="go">${last ? "See results" : "Next question"}</button></div>`;
    $("#go").onclick = () => { if (last) return finish(); run.qi++; renderQuiz(); };
    $("#go").focus();
  }
  function finish() {
    const n = run.qs.length, pct = run.ok / n, st = pct >= 1 ? 3 : pct >= .85 ? 2 : pct >= .7 ? 1 : 0;
    const boss = run.boss, m = boss ? null : MODULES[run.mi], ok = st > 0;
    if (ok) {
      if (boss) { S.bossStars = Math.max(S.bossStars, st); addXP(100, "bossdone"); award("boss"); }
      else {
        const prev = S.done[m.id]; S.done[m.id] = { stars: Math.max(st, prev ? prev.stars : 0) };
        addXP(50, `mod:${m.id}`); if (st === 3) addXP(25, `perfect:${m.id}`);
        award("first"); if (st === 3) award("perfect");
        if (Object.keys(S.done).length >= 5) award("half"); if (allDone()) award("all");
      }
      save(); stats(); confetti();
    }
    const nextHref = boss ? "#/cert" : run.mi + 1 < MODULES.length ? `#/m/${MODULES[run.mi + 1].id}` : "#/boss";
    setView(`<div class="card center"><div class="big">${ok ? "🎉" : "💪"}</div><h2>${ok ? "Level cleared!" : "Almost there"}</h2>
      <p class="simple">You got <b>${run.ok} of ${n}</b> right. ${ok ? "" : "You need 70% to pass. Review the cards and try again."}</p>
      <p>${stars(st)}</p>${ok ? `<p>+50 XP for finishing${st === 3 ? " and +25 for a perfect score" : ""}. Total: <b>${S.xp} XP</b>.</p>` : ""}
      <div class="row" style="justify-content:center"><a class="btn alt" href="${boss ? "#/boss" : `#/m/${m.id}`}" id="retry">${ok ? "Replay" : "Try again"}</a>
      ${ok ? `<a class="btn" href="${nextHref}">${boss ? "Get my certificate" : run.mi + 1 < MODULES.length ? "Next module →" : "Final challenge →"}</a>` : ""}</div></div>`);
    $("#retry").onclick = (e) => { e.preventDefault(); if (boss) viewBoss(); else viewModule(m.id); };
  }

  function viewBoss() {
    if (!allDone()) return (location.hash = "#/");
    const pool = shuffle(MODULES.flatMap((m) => m.quiz.filter((q) => q.t !== "order").map((q) => Object.assign({}, q, { _o: null, _m: m.id }))));
    // one per module first, then fill to 10
    const pick = []; const used = new Set();
    MODULES.forEach((m) => { const q = pool.find((x) => x._m === m.id); if (q) { pick.push(q); used.add(q); } });
    pool.filter((q) => !used.has(q)).slice(0, 10 - pick.length).forEach((q) => pick.push(q));
    run = { boss: true, bossQs: shuffle(pick).slice(0, 10), qs: null, qi: 0, ok: 0, combo: 0, mi: MODULES.length - 1 };
    touchDay(); renderQuiz();
  }

  function viewPlaybook() {
    const cats = ["All", "Cloud Control", "Campus & Branch", "Data Center", "Observability"];
    const types = ["All", "Guided", "Instant", "Solution"];
    let c = "All", t = "All";
    const draw = () => {
      const rows = DEMOS.filter((d) => (c === "All" || d.cat.includes(c)) && (t === "All" || d.type === t));
      $("#pb").innerHTML = rows.map((d) => `<tr><td><a href="${esc(d.url)}" target="_blank" rel="noopener"><b>${esc(d.name)}</b></a><br><span class="tag">${esc(d.cat)}</span></td><td>${esc(d.stage)}<br><span class="tag">${esc(d.type)}</span></td><td>${esc(d.when)}</td></tr>`).join("") || `<tr><td colspan="3">No demos match.</td></tr>`;
    };
    setView(`<h1>Demo Playbook</h1><p>Which demo for which conversation. Guided = pre-recorded click-through. Instant = live, always-on, read-only. Scheduled/Solution = dedicated environment for hands-on.</p>
      <div class="filters" id="fc">${cats.map((x) => `<button data-c="${x}" class="${x === c ? "on" : ""}">${x}</button>`).join("")}</div>
      <div class="filters" id="ft">${types.map((x) => `<button data-t="${x}" class="${x === t ? "on" : ""}">${x}</button>`).join("")}</div>
      <div class="card" style="overflow-x:auto"><table><thead><tr><th>Demo</th><th>Stage / type</th><th>Use it when</th></tr></thead><tbody id="pb"></tbody></table></div>
      <p class="src">Cloud Control demos are not Security Cloud Control. The data center scenarios use Security Cloud Control.</p>`);
    draw();
    $("#fc").onclick = (e) => { const b = e.target.closest("button"); if (!b) return; c = b.dataset.c; $$("#fc button").forEach((x) => x.classList.toggle("on", x === b)); draw(); };
    $("#ft").onclick = (e) => { const b = e.target.closest("button"); if (!b) return; t = b.dataset.t; $$("#ft button").forEach((x) => x.classList.toggle("on", x === b)); draw(); };
  }

  function viewGlossary() {
    const draw = (q = "") => {
      $("#gl").innerHTML = GLOSSARY.filter(([a, b]) => (a + b).toLowerCase().includes(q.toLowerCase()))
        .map(([a, b]) => `<button class="fc" data-flip><b>${esc(a)}</b><div class="src" hidden>${esc(b)}</div><div class="src">Tap to reveal</div></button>`).join("");
    };
    setView(`<h1>Glossary flashcards</h1><div class="filters"><input id="gq" type="search" placeholder="Search terms" aria-label="Search terms"></div><div class="grid" id="gl"></div>`);
    draw();
    $("#gq").oninput = (e) => draw(e.target.value);
    $("#gl").onclick = (e) => {
      const b = e.target.closest("[data-flip]"); if (!b) return;
      const [def, hint] = $$(".src", b); def.hidden = !def.hidden; hint.hidden = !def.hidden; addXP(2, "gl:" + $("b", b).textContent);
    };
  }

  /* Pitch Lab */
  const AUD = {
    "CEO / business owner": ["growth, resilience and risk to the business", "In one line:"],
    "CFO": ["cost, risk and compliance exposure", "The financial case:"],
    "CIO / IT director": ["simplicity, speed and fewer tools to run", "For your team:"],
    "CISO / security lead": ["reducing attack surface and proving control", "On the security side:"],
    "Network lead": ["a network that's easier to run, automate and troubleshoot", "Day to day:"],
  };
  const OUT = {
    "Simplify operations": "one cloud-managed experience, shared inventory and AI-assisted workflows mean fewer consoles and less manual work",
    "Business continuity": "security is built into the network and backed by assurance, so protection doesn't come at the cost of uptime",
    "Consistent, secure access everywhere": "one identity-based policy follows every user and device across campus, branch and remote",
    "Reduce risk, stay compliant": "identity-based segmentation limits how far a compromise can move and makes 'who can reach what' provable",
    "Adopt and secure agentic AI": "AI assets are discovered, models validated and protected at runtime, and the infrastructure underneath is segmented",
  };
  const DOM = {
    "Campus & branch": ["Cisco ISE gives every device and user an identity, and Meraki or Catalyst enforces it at the first hop. A new site or device type goes live fast.", "Show: Secure Networking Instant Demo, or the healthcare IoT guided demo."],
    "Remote users": ["Secure Access gives remote users Zero Trust access and the same protection as the office, driven by the same identity.", "Show: the 'Securing the User' scenario of the Instant Demo."],
    "Data center & cloud": ["The same tags drive firewall policy, workload segmentation and cloud enforcement, independent of cloud provider, managed through Security Cloud Control.", "Show: the Data Center guided demos (three scenarios)."],
    "AI infrastructure": ["AI Defense protects models and agents, while segmentation and vulnerability shielding protect the infrastructure that runs them.", "Show: the healthcare data center guided demo with AI Defense."],
    "Operations & visibility": ["Cisco Cloud Control brings inventory, topology and AI Assistant together, with AI Canvas for investigations that need a human to approve the plan.", "Show: Cloud Control Interactive Demos or the Network Platform and Assurance Launchpad."],
  };
  function viewPitchLab() {
    const sel = (id, o, lab) => `<div class="field"><label for="${id}">${lab}</label><select id="${id}">${Object.keys(o).map((k) => `<option>${esc(k)}</option>`).join("")}</select></div>`;
    setView(`<h1>Pitch Lab</h1><p>Pick who you're talking to and what matters. Get a ready-to-use opener, then make it yours.</p>
      <div class="card">${sel("pa", AUD, "Audience")}${sel("po", OUT, "Customer outcome")}${sel("pd", DOM, "Where they feel the pain")}
      <button class="btn" id="gen">Generate my pitch</button></div><div id="pout"></div>`);
    $("#gen").onclick = () => {
      const a = $("#pa").value, o = $("#po").value, d = $("#pd").value;
      const txt = `${AUD[a][1]} Cisco Secure Networking builds security into the network itself, so you get ${AUD[a][0]}.\n\nWhat that means for "${o.toLowerCase()}": ${OUT[o]}.\n\nIn ${d.toLowerCase()}: ${DOM[d][0]}\n\nClose: "Which of these matters most to you today? I'll show you how it works in practice."\n\n(${DOM[d][1]})`;
      $("#pout").innerHTML = `<div class="out" id="ptxt"></div><div class="row"><span></span><button class="btn alt" id="cp">Copy</button></div>`;
      $("#ptxt").textContent = txt; addXP(10, `lab:${a}:${o}:${d}`);
      $("#cp").onclick = () => { const sel = getSelection(), r = document.createRange(); r.selectNodeContents($("#ptxt")); sel.removeAllRanges(); sel.addRange(r);
        (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast("Copied"), () => toast("Text selected: press Ctrl/Cmd+C")); };
    };
  }

  function viewCert() {
    if (!S.bossStars) return (location.hash = "#/");
    setView(`<div class="field noprint"><label for="nm">Your name</label><input id="nm" value="${esc(S.name)}" placeholder="Type your name" maxlength="60"></div>
      <div class="cert"><div class="big">🛡️</div><h1>Certificate of completion</h1><p>This certifies that</p><div class="nm" id="cn"></div>
      <p>completed the <b>Secure Networking Academy</b> path and the final customer-meeting challenge<br>with ${stars(S.bossStars)} and ${S.xp} XP, reaching the level of <b>${LEVELS[level()][1]}</b>.</p>
      <p class="src">${new Date().toLocaleDateString()} · Independent learning aid, not an official Cisco certification.</p></div>
      <div class="row noprint"><span></span><button class="btn" onclick="print()">Print / save as PDF</button></div>`);
    const upd = () => { $("#cn").textContent = $("#nm").value || "Your Name"; S.name = $("#nm").value; save(); };
    $("#nm").oninput = upd; upd(); confetti();
  }

  /* ───────── router ───────── */
  function route() {
    const h = location.hash.replace(/^#\/?/, ""), [a, b] = h.split("/");
    $$(".nav a").forEach((x) => x.classList.toggle("on", (x.dataset.nav === "home" && !a) || x.dataset.nav === a));
    if (a === "m") viewModule(b);
    else if (a === "boss") viewBoss();
    else if (a === "playbook") viewPlaybook();
    else if (a === "glossary") viewGlossary();
    else if (a === "pitchlab") viewPitchLab();
    else if (a === "cert") viewCert();
    else viewHome();
  }
  addEventListener("hashchange", route);
  let armed = 0;
  $("#reset").onclick = (e) => {
    if (!armed) { armed = setTimeout(() => { armed = 0; e.target.textContent = "Reset my progress"; }, 4000); e.target.textContent = "Click again to erase all progress"; return; }
    clearTimeout(armed); armed = 0; e.target.textContent = "Reset my progress";
    S = blank(); save(); stats(); location.hash = "#/"; route(); toast("Progress erased");
  };
  stats(); route();
})();

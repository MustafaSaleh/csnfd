/* position of any scene node; ops-plane products float above */
const TOPO_POS = {};   /* topology mode lays an architecture out as a diagram; these override scene positions */
const POS = id => TOPO_POS[id] || (PR[id] || PL[id]).p;
const actorPos = (r, slot) => { const p = POS(r.path[0]); return [-39 + slot * 2.6, 0, p[2]]; };
const nodeName = id => PR[id] ? PR[id].s : PL[id] ? PL[id].name : id;

/* =====================================================================================
   RENDERER — WebGL (three.js)
   ===================================================================================== */
function trustColor(v) { return `hsl(${Math.round(v * 1.35)},72%,58%)`; }
const isSp = id => PR[id] && PR[id].cat === 'splunk';
const pairKey = (a, b) => a < b ? a + '|' + b : b + '|' + a;
const INGEST = new Set(DATA.splunkIngest.map(id => pairKey(id, 'splunk')));
const isIngest = l => INGEST.has(pairKey(l[0], l[1]));
const lensLinks = lens => (lens === 'policy' ? DATA.policyFlow : lens === 'threat' ? DATA.teleFlow
  : DATA.links.filter(l => l[4] !== 'suite' && PR[l[0]].roles[lens] && PR[l[1]].roles[lens]).map(l => [l[0], l[1]])).filter(l => S.splunk || !(isSp(l[0]) || isSp(l[1])));
/* the lens lines the overview actually draws: a bundled feed is the riser, not another bright line */
const brightLinks = lens => lensLinks(lens).filter(l => !isIngest(l));
const ringOn = (p, lens) => lens === 'policy' ? (p.pol || []).includes('enforce') : lens === 'data' ? !!p.inspect : false;
const NODE_IDS = [...Object.keys(PR), ...Object.keys(PL)];

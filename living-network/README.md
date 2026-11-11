# Living Network — conceptual architecture explainer

A standalone, interactive 3D explainer of how Cisco networking and security products work together: how **data** moves,
where **identity** is verified, where **policy** is authored, distributed and enforced, how **threats** are detected and
stopped, and how **trust** is re-evaluated through a session.

Independent educational visualization. Not an official Cisco product. Product names are trademarks of Cisco Systems, Inc.
No Cisco or Splunk logos, icons or artwork are used. Content verified against cisco.com and splunk.com on 10 November 2026.

## Run it

Open `index.html` (double-click from disk, internet on). One file, inline CSS and JS, no build step, no backend.
The only external requests are Three.js 0.170.0 and its OrbitControls from jsDelivr. If WebGL or the CDN is unavailable
the page renders a 2D SVG map of the same data (force it with `index.html?render=svg`).

Four modes: **Presets**, **Build your own**, **Free explore** and **Topology**. Topology isolates one architecture
(SASE, Zero Trust Access, Hybrid Mesh Firewall, secure campus, data center, industrial, detection and response, AI, or
one of the three suites), lays its building blocks out as a diagram and numbers each relationship stated on cisco.com,
with the source link beside it. The architecture list is `DATA.architectures`.

**Playback**: choosing a preset (or changing the builder) sets the scenario up and waits; press Play (`Space`), which
pulses until then. The **Auto** button in the playback bar starts each scenario as soon as it is chosen; it is off by
default and remembered between visits.

Each product is a small generic 3D model of its kind, built from simple shapes in the `MODEL` table: an access point
puck on a mast for Wi-Fi, stacked switches with port rows, a router with antennas, a spine chassis for Nexus, a chip for
Silicon One, laptops for Secure Client and Secure Endpoint, a phone for Duo, an envelope for Email Threat Defense, a
radar dish for XDR, a bar chart for Network Analytics, a cloud with a gate for Secure Access, and so on. They are
recognisable shapes, not Cisco hardware or artwork. The suites and the Splunk products keep their abstract shapes.

Human actors (employee, admin, executive, contractor, guest, insider, external attacker) are walking 3D figures with
their name and live trust level above them; the attacker is a red hooded figure on a dashed path. The 0–100 trust
level is an illustrative teaching device: no product shows this number. The closest real signals are ISE posture, Duo
risk-based authentication and Identity Intelligence.

**Splunk layer** (toggle in the header, or `L`): a seventh plane with the Splunk platform, Enterprise Security, SOAR,
Attack Analyzer, Observability Cloud, ITSI and AppDynamics. When it is on, scenarios show where Splunk takes part:
firewall, network-analytics, OT-sensor, endpoint, email, identity and cloud events are ingested by the platform, XDR
incidents reach Enterprise Security, Enterprise Security correlates and prioritises detections, SOAR automates response
tasks, Attack Analyzer examines phishing links and files, and the observability products join ThousandEyes when an
application is slow. SOAR can also act: after a detection from a product that feeds Splunk, its playbook argues for
CONTAIN (quarantine through ISE, host isolation through Secure Endpoint, or a block on the firewall). With all controls
present XDR and ISE already contain those cases, so switching the layer off changes no preset verdict; the difference
shows when XDR or ISE are removed with "Without these controls". Two Topology views cover it: "Splunk for security
operations" and "Splunk and Cisco Observability".

**Full screen** (button at the right of the playback bar, or `F`; `Esc` exits): the scene fills the window, with the
side panels and footer hidden, and the browser enters full screen where it is allowed. The header, lenses, playback
bar, legend and the checkpoint and verdict captions stay. In viewers that block browser full screen the layout still
expands to the whole window.

**Guided tour** (header button **Tour**, or `T`; offered once on a first visit): eleven steps that spotlight each part
of the tool and drive it as they go — the scene, presets, playback, lenses, the result panel, removing controls, the
builder, camera views, topology, the header switches, and share/export. Steps live in `DATA.tour`.

**Export** (button in the result and topology panels): a printable report for "Save as PDF" (scene image, verdict,
trust table, decision timeline, products with source URLs, disclaimer), the scene as a PNG with its labels, the report
as Markdown, or the run as JSON. Viewers that sandbox the page may block downloads and printing; opening the file
directly works.

**Compare** runs two scenarios in a **split view**: each half has its own viewport, labels, follow camera, effects,
verdict stamp and verdict sound. The "Split view" button in the result header switches back to one shared scene.

**Without these controls**: tap one product, several, or a whole suite to remove them and replay; the result shows
the verdict with all controls against the verdict without them. Illustrative.

**Fog and bloom**: a light depth haze and a restrained glow are on when visual effects are on, and are dropped
automatically if the frame rate does not hold around 50 fps or better over the first seconds. Bloom is not used in
split view.

**Visual effects** (header switch **FX**, or `X`; remembered between visits; off by default when the system asks for
reduced motion): an arrival ring at every hop, a pulse and sparks when a product checks the session, triple red rings
on a detection, floating "+10 trust" / "-25 trust" pop-ups above the actor, and a signature for each verdict — a light
pillar and rising sparks for ALLOW, a shield dome, shockwave and camera shake for BLOCK, imploding rings and a cage
dome for CONTAIN, pulsing amber rings for STEP-UP — plus a stamp ("ACCESS GRANTED", "BLOCKED", "CONTAINED" …) and a
screen-edge flash. The 2D fallback shows the stamp and flash plus simpler rings and pop-ups, and draws Topology
architectures as the same diagram layout.

**Sound**: two header switches, **SFX** (`M`) and **Music** (`N`), remembered between visits. Every sound is synthesised
in the browser with the Web Audio API, so there are no audio files and no extra downloads. Effects: a blip per hop, a
tone per checkpoint pitched by its lens, rising or falling notes when trust moves, a distinct signature for each verdict
(ALLOW, ALLOW WITH LIMITS, STEP-UP, BLOCK, CONTAIN), and cues for telemetry, the Splunk layer, lens, view and topology
changes. Music is a generative ambient bed that turns darker when the session trust score drops. Both are on by
default; a switch turned off stays off on later visits. Sound starts on the first click or key press (browsers do not
allow it earlier) and pauses while the tab is hidden.

Three camera views, switched from the playback bar or with `V`: **Overview** (orbit, zoom, pan), **3rd person** (camera
follows behind the actor) and **1st person** (through the actor's eyes). The follow views need a running scenario and
the 3D scene; in split view each half follows its own actor. Dragging the scene in 3rd person switches to Overview
from the current camera position, so the view carries on from where it was instead of jumping back; the reset-view
button returns to the standard Overview. In the 2D fallback both follow views keep the actor centred.

**Fog of war** (header switch **Fog**, or `G`; on by default, remembered between visits): in the follow views (one
scenario, not Topology) only the hops already reached, the products that have already checked the session and anything
close to the actor are visible. The next step stays dark until the actor gets there, and the relationship lines are
hidden. Checkpoint captions, pop-ups, sounds and the decision timeline keep working. Overview always shows everything.

Keyboard: `Tab` through nodes, `Enter` opens the panel, `Space` plays/pauses, `1`–`5` switches lens, arrow keys rotate the overview, `Shift`+arrows pan, `+`/`-` zoom, `0` resets, `V`
cycles the camera view, `F` full screen, `T` starts the tour, `L` toggles the Splunk layer, `X` visual effects, `G` fog of war, `M` sound effects, `N` music, `Esc` closes.

## Editing

Everything shown lives in the `DATA` object at the top of the script: products, relationships, picker options,
invalid-combination rules, path rules, checkpoint rules, verdict text, suggestions and presets. A new scenario is a data
edit. The tables below were generated from that object.

## How verdicts are produced

1. A path is chosen from the picker state (access rule + route rule).
2. Every checkpoint rule that matches fires in path order, changing the trust level (starts at 50 plus actor, device and
   location adjustments).
3. The verdict is the most severe one argued for by a fired rule. Outcomes are a *typical zero-trust policy outcome*, not
   guaranteed product behaviour; the page says so beside every verdict.
4. "Without these controls" removes the rules of one or more products (or a whole suite) and replays, to show the gap.
   It is labelled illustrative.

## Not verified, so left out or hedged

- **AgenticOps** has no standalone page that could be found on cisco.com (the guessed URL returned 404). The node uses the
  Cisco AI Canvas page ("the workspace for AgenticOps") as its source and says so in its panel. It takes part in no verdict.
- **Secure Equipment Access**: its page states only that it "is now part of Cisco Cyber Vision". The node is kept, labelled
  that way, and its remote-access behaviour is taken from the Cyber Vision page.
- **Security Cloud Control**: kept under that name as requested; the product page is currently titled "Security in Cisco
  Cloud Control" and the panel notes it. The panel and the policy-push checkpoints also say that SD-WAN overlay policy
  stays in Catalyst SD-WAN Manager and that some products keep their own consoles.
- **Secure Client ↔ Secure Access**: no page read states this pairing by name, so no relationship line is drawn. Traffic
  paths from a managed remote device still pass Secure Client then Secure Access as a conceptual flow.
- **Umbrella** is retiring and is no longer in the scene. Secure Access is described as the SSE that incorporates the
  DNS-layer security and secure web gateway (SWG) capabilities that were previously the core of Umbrella and expands
  them into a full SSE platform. Its three former lines (Secure Client, Secure Endpoint, SD-WAN) were removed, and
  Secure Access replaces it in the secure campus and branch architecture.
- **WAAP** states no Cisco integration on its own page; its single line comes from the Firewall page's integration list.
- **Talos**: its page says it powers Cisco security products in general. Lines are drawn only to products whose own pages
  name Talos (Firewall, Secure Endpoint, Cyber Vision, AI Defense, Industrial Threat Defense, two suites).
- **Data loss prevention, remote browser isolation, CASB, SWG** are not named on the pages read. Outcomes such as "sensitive
  upload denied" or "restricted session, for example isolated or read-only" are illustrative policy outcomes and are not
  presented as named product features.
- **Splunk** has no product pages on cisco.com (the URLs tried returned 404; Cisco's product index links out to
  splunk.com). Splunk product functions therefore come from splunk.com. Lines between Splunk and Cisco products are
  drawn only where a Cisco or Splunk page states them: Firewall, Hybrid Mesh Firewall, Secure Network Analytics, Cyber
  Vision, Industrial Threat Defense, AI Defense, Nexus, Talos (Attack Analyzer), ThousandEyes (Observability Cloud,
  AppDynamics) and AI Canvas (ITSI). Duo, Email Threat Defense, Identity Intelligence, Multicloud Defense, Secure
  Endpoint and Secure Workload lines, and XDR ↔ Enterprise Security ("Incident Import & Promote to ES Notable"), come
  from the Cisco Security Cloud app on Splunkbase (https://splunkbase.splunk.com/app/7404).
- **Not drawn for Splunk**: Secure Access, ISE, Meraki and ThousandEyes ↔ ITSI. Reviewers state that each has
  its own Splunkbase app, but none is in the Cisco Security Cloud app and no app page has been checked yet. Security
  Cloud Control does not mention Splunk on the pages read. Secure Client's Splunk reference is only a link slug.
- **Splunk checkpoints are illustrative**: which Cisco events reach Splunk, and what Enterprise Security or SOAR do
  with them, depends on configured data sources, detections and playbooks.
- **No performance numbers, specs or licence details** are shown anywhere.
- **Not drawn** for lack of an explicit statement: Meraki ↔ Secure Routers, Multicloud Defense ↔ Secure Workload,
  XDR ↔ ISE, XDR ↔ Duo, XDR ↔ Secure Access, AI Defense ↔ XDR, Hypershield ↔ Secure Workload,
  Duo ↔ Secure Client. Two expert reviewers state XDR ↔ ISE (quarantine through Adaptive Network Control) and XDR
  ingesting Duo and Secure Access, but the XDR product page does not name them and the XDR documentation could not be
  loaded, so no public page has been checked.
- **Hypershield availability** varies by capability; the panel says so and no dates are shown.
- Listed on cisco.com but out of the requested scope: Secure Web Appliance, Attack Surface Management, Secure Malware
  Analytics, Security Analytics and Logging, Telemetry Broker, Secure DDoS Protection, Vulnerability Management,
  Meraki Systems Manager, Isovalent, Catalyst Center, Splunk.
- Cisco.com pages have "show more" sections that were not expanded when read, so a relationship may exist on a page and
  still be missing here.

## Backlog: known gaps to come back to

Nothing below is done yet. It is kept here so it can be picked up later.

**Verification**
- Tested by automated checks in headless Chromium, and by hand by the owner. Not yet measured: frame rate on a range
  of real GPUs and mid-range phones (the brief asks for 60 fps desktop, 30 fps phone).
- Safari and Firefox have not been checked systematically. Safari is the likeliest to differ on audio and some styling.
- The rule table is a reading of public pages. The "Expert review prompt" below was answered by three reviewers on
  11 November 2026; the agreed corrections are applied (see "Expert review results"). It has not been reviewed by a
  Cisco or Splunk engineer.
- cisco.com pages have "show more" sections that were not expanded when read, so some stated relationships may be
  missing. The "verified on" date is fixed text; there is no process to re-check the pages.

**Content**
- Secure Access, ISE, Meraki and ThousandEyes do not feed the Splunk layer yet; their Splunkbase app pages
  have to be checked first. XDR ↔ ISE, XDR ↔ Duo and XDR ↔ Secure Access need a public XDR integration page.
- No licensing view: nothing shows which suite or tier a scenario needs.
- No "exploit" or "denial of service" behaviour, and no multi-stage attack that chains several steps in one run.
- Products listed on cisco.com but out of scope: Secure Web Appliance, Attack Surface Management, Secure Malware
  Analytics, Security Analytics and Logging, Telemetry Broker, Secure DDoS Protection, Vulnerability Management,
  Meraki Systems Manager, Isovalent, Catalyst Center.
- English only.

**For real use**
- Not published: it lives on a feature branch in a subfolder. A hosted link (for example GitHub Pages) and a pull
  request to the default branch are still to do.
- No video export; the PDF is produced through the browser's print dialog rather than generated directly.
- No presenter script or speaker notes alongside the tour.
- One large HTML file; the automated checks used during development are not committed to the repository.

**Smaller limits of what is built**
- Split view shows spark particles from both scenarios on both sides (rings, domes and pillars are per side).
- Bloom is off in split view, and the scene image export in the 2D fallback is not available.
- Keyboard camera control applies to the overview; the follow views are driven by the actor.
- The 2D fallback has no rotation and no walking figures.
- The 2D fallback has no product models and no fog of war; it keeps the flat map symbols.
- Fog of war is not applied in split view.

Checked in a headless browser: zero console errors; all 30 presets play to a verdict; every valid picker combination
(about 206,000 including behaviour sets and removed controls) returns a path, a timeline and a verdict; split-view
compare, removing controls, link sharing, the tour, and each export format work; every product panel links to its
source page.

## Changes, 11 November 2026

Expert review (see "Expert review results" below for the item-by-item outcome):
- Secure Access credited for internet-edge blocks and for third-party AI prompts (AI Access); AI Defense limited to AI
  apps the organisation runs.
- Splunk feeds added from the Cisco Security Cloud app, plus the XDR ↔ Enterprise Security line. SOAR can now argue
  for CONTAIN (rule SP8), and only after a real detection from a product that feeds Splunk.
- "Illustrative trust level" wording, Adaptive Network Control named in the quarantine rules, and notes added for
  Hypershield availability, WAAP vs Multicloud Defense and SD-WAN policy in Catalyst SD-WAN Manager.

Player, camera and scene:
- **Auto-play**: choosing a preset no longer starts it; Play pulses until pressed. The new **Auto** button (off by
  default, remembered) starts scenarios as soon as they are chosen.
- **3rd person to Overview**: dragging in 3rd person switches to Overview from the current camera position instead of
  resetting the view.
- **Fog of war**: new **Fog** switch (`G`, on by default, remembered). In the follow views the next steps stay hidden
  until the actor reaches them; captions, pop-ups, sounds and the timeline keep working.
- **Product models**: each product is a generic 3D model of its kind (access point, switch stack, router, chassis,
  laptop, phone, envelope, radar dish and so on) built from simple shapes in the `MODEL` table. No Cisco artwork.
- **Music** is on by default; turning it off is remembered.

Content:
- **Umbrella removed** because it is retiring: the product, its three relationship lines (Secure Client, Secure
  Endpoint, SD-WAN) and its place in the SASE and secure campus architectures. Secure Access takes its place in the
  campus architecture and is described as: "SSE: Cisco Secure Access incorporates the DNS-layer security and secure web
  gateway (SWG) capabilities that were previously the core of Umbrella, but it expands them into a full SSE platform".
  The scene now has 40 products and 108 relationships.

Checks after these changes: script syntax check passes; all 30 presets give the same verdicts as before; 26,986
scenario combinations run with no errors and no verdict changes when the Splunk layer is switched off; no relationship
or architecture points to a missing product; headless Edge renders the new models and the fog in 3rd person. The drag
from 3rd person into Overview needs a real mouse and has not been tested yet.

## Expert review results

Three reviewers answered the prompt below on 11 November 2026 (the third answer stopped at item 33). Where they
disagreed, the cisco.com page was checked. Applied:

- **Umbrella and Secure Access (19)**: not modelled in series. Internet-edge blocks are credited to Secure Access
  (rules W1, W1p and W1f removed). Umbrella was later removed from the scene because it is retiring.
- **AI credit (32)**: an employee's confidential prompt to a third-party AI app is blocked by Secure Access AI Access
  (rule A3). AI Defense is credited only for AI apps the organisation runs (A4, A5, A6); prompt injection is now
  modelled against the internal AI model only.
- **Splunk (41–43)**: sources added from the Cisco Security Cloud app on Splunkbase, including XDR ↔ Enterprise
  Security. SOAR can now argue for CONTAIN after a detection (rule SP8).
- **Trust (45)**: shown as an illustrative trust level, with the real signals named.
- **Smaller fixes**: quarantine rules name Adaptive Network Control (12); the scene caption says campus
  core/distribution and wireless controllers are not shown (14); Security Cloud Control scope (30); WAAP is optional in
  front of Multicloud Defense (29); Hypershield availability (25–26); Breach Protection tiers (7); Secure Access
  DNS-layer check for an IoT device calling an unknown host (47, rule W9).

Not applied: ISE in a "Premier" User Protection tier (the page lists Essentials and Advantage only), CANNOT CONFIRM on
items 3 and 7 (the pages confirm them), and XDR ↔ ISE, Duo or Secure Access lines (no public page checked yet).

Pages checked on 11 November 2026 to settle disagreements: the User Protection Suite page (two tiers; ISE in Advantage),
the Breach Protection Suite page (Essentials, Advantage with Telemetry Broker, Premier), the Secure Access page
("Secure Access DNS Defense", the AI Access feature set), the XDR and Umbrella pages (no Duo, ISE or Secure Access
integration named), and the Cisco Security Cloud app on Splunkbase (products enabled, XDR "Promote to ES Notable").

### Answers by item

Reviewer A is the Deep Networking Model, B the Secure Networking Agent, C the RAG model (its answer stopped after item
33, and part of it cites internal Cisco documents, which the prompt excludes, so those citations count only as hints).
A and B cite document titles, not URLs. C = CORRECT, P = PARTLY, I = INCORRECT, CC = CANNOT CONFIRM. The full answers are in the appendix at the end.

| # | A | B | C | Outcome in the tool |
|---|---|---|---|---|
| 1 | C | P | C | No change. B's point that Hybrid Mesh Firewall is a solution is already reflected; Secure Routers and Smart Switches are current names. |
| 2 | P | P | P | No change. "Security Cloud Control" kept, with the page-title note. |
| 3 | C | C | CC | No change. The product page states it is part of Cyber Vision. |
| 4 | C | C | C | No change. |
| 5 | C | C | C | No change. B's "ISE in Premier" is not on the page, which lists ISE in Advantage. |
| 6 | C | C | C | No change. |
| 7 | C | C | CC | Suite description adds Telemetry Broker (Advantage) and the Premier tier. |
| 8–11 | C | C | C | No change. Posture is checked by the Secure Client posture module. |
| 12 | C | C | C | Quarantine rules T3, T9 and T16 name Adaptive Network Control (applied through Change of Authorization). |
| 13 | C | C | C | No change. |
| 14 | P | P | P | Scene caption says campus core/distribution and wireless controllers are not shown. C's "missing ISE" is a decision point already shown as a checkpoint. |
| 15–18 | C | C | C | No change. |
| 19 | P | P | P | Applied. Secure Access credited for internet-edge blocks; Umbrella rules W1, W1p, W1f removed. |
| 20–24 | C | C | C | No change. Verified Push is the push-fatigue feature. |
| 25 | C | C | C | No change; availability note added to Hypershield. |
| 26 | P | C | C | Reviewers disagree on availability; panel says availability varies by capability, no dates. |
| 27–28 | C | C | C | No change. |
| 29 | P | P | P | WAAP note: Multicloud Defense also does ingress WAF, so WAAP is optional. |
| 30 | P | P | P | Security Cloud Control note and rules O4, O5-sdwan reworded (SD-WAN overlay stays in Catalyst SD-WAN Manager). Lines kept, as cisco.com states them. |
| 31 | C | C | C | No change. |
| 32 | P | P | P | Applied. A3 credited to Secure Access AI Access; AI Defense only for internal AI apps (A4–A6). |
| 33–36 | C | C | — | No change. |
| 37 | C | C | — | Not drawn: XDR ↔ Duo and XDR ↔ Secure Access / Umbrella have no public page checked yet. |
| 38 | C | C | — | Not drawn: XDR ↔ ISE quarantine has no public page checked yet. |
| 39–40 | C | C | — | No change. |
| 41 | I | I | — | Applied. Splunk feeds added from the Cisco Security Cloud app; Secure Access, Umbrella, ISE, Meraki, ThousandEyes pending. |
| 42 | C | C | — | Applied. SOAR can argue for CONTAIN (rule SP8). |
| 43 | C | C | — | Applied. XDR ↔ Enterprise Security line. |
| 44 | C | C | — | Not drawn: ThousandEyes ↔ ITSI has no page checked yet. |
| 45 | P | P | — | Applied. "Illustrative trust level", real signals named. |
| 46 | C | C | — | No change. |
| 47 | C | P | — | Applied. Secure Access DNS-layer check for the IoT call-out (rule W9). |

## Expert review prompt

Paste the block below into a Cisco networking model (or give it to a CCIE-level engineer) to check the scenario logic.
It asks only about publicly documented behaviour. Each item states what this tool currently assumes ("Expect") so the
reviewer can confirm or correct it. Bring the answers back and the rule table in `DATA` will be updated to match.

````text
ROLE
You are a Cisco networking and security architect at CCIE level. I am checking an independent, educational
visualization that shows how Cisco networking and security products work together. I need you to confirm or correct
the statements below.

RULES
- Use only public information: cisco.com and splunk.com product pages, public documentation, public design guides
  and data sheets that any customer can read. Do not use or reveal anything confidential, internal, under NDA, or
  roadmap that has not been publicly announced.
- If a statement cannot be confirmed from public sources, answer CANNOT CONFIRM rather than guessing.
- Product availability changes. If something is announced but not generally available, say so.
- I am modelling a typical zero-trust policy outcome, not guaranteed product behaviour. Judge whether each statement
  is a fair, defensible description for partner and customer education.

ANSWER FORMAT
Answer every numbered item on its own line, in this exact shape:
  <number> | CORRECT, PARTLY, INCORRECT or CANNOT CONFIRM | correction or nuance in at most two sentences | public source (document title or URL)
After the list, add a short section "Most important fixes" with the three to five changes that matter most.

A. NAMES AND PACKAGING
1. Current public names are: Cisco Secure Routers, Cisco Smart Switches, Cisco Secure Firewall, Cisco Hybrid Mesh
   Firewall, Cisco Secure Access, Cisco Identity Intelligence, Cisco XDR, Cisco AI Defense, Cisco Hypershield.
   Expect: CORRECT.
2. "Security Cloud Control" is still an acceptable name, although its product page is now titled "Security in Cisco
   Cloud Control". Expect: PARTLY, with the preferred current name.
3. Cisco Secure Equipment Access is now part of Cisco Cyber Vision. Expect: CORRECT.
4. AgenticOps has no standalone product; Cisco AI Canvas is its workspace, inside Cisco Cloud Control. Expect: CORRECT.
5. User Protection Suite: Essentials has Secure Access, Duo and Email Threat Defense; Advantage adds Secure Endpoint
   and ISE. Expect: CORRECT.
6. Cloud Protection Suite packages Secure Workload, Hypershield, Secure Firewall (virtual), Multicloud Defense and
   Security Cloud Control, as the licensing path to Hybrid Mesh Firewall. Expect: CORRECT.
7. Breach Protection Suite: Essentials has XDR, Email Threat Defense and Secure Endpoint; Advantage adds Secure
   Network Analytics. Expect: CORRECT.

B. CAMPUS AND BRANCH ACCESS
8. On campus, ISE authenticates the user and device (802.1X or MAB), assigns a security group tag, and switches and
   wireless enforce the segmentation. Expect: CORRECT.
9. A headless IoT device is profiled by ISE and placed in a least-privilege segment. Expect: CORRECT.
10. A guest is mapped to an internet-only segment with no path to internal resources. Expect: CORRECT.
11. An out-of-date managed laptop on campus is given restricted access by ISE posture until remediated.
    Expect: CORRECT, and tell me which client module performs the posture check.
12. ISE can move a misbehaving endpoint to a quarantine segment automatically. Expect: CORRECT, and name the mechanism.
13. Secure Network Analytics can detect scanning, lateral movement and data exfiltration from flow telemetry, including
    in encrypted traffic without decryption, and can work with ISE to quarantine. Expect: CORRECT.
14. A simplified campus-to-data-center path of Wi-Fi, access switch, firewall, Nexus fabric, application is a fair
    conceptual picture. Expect: PARTLY, and tell me what important hop is missing.

C. REMOTE ACCESS, SASE AND INTERNET
15. A remote user on a managed laptop reaches a private application through Cisco Secure Client and Cisco Secure
    Access (ZTNA or VPN as a service). Expect: CORRECT. Confirm Secure Client is the client used for Secure Access.
16. A remote user on an unmanaged device can reach selected private applications through Secure Access without a
    client (browser-based), with more limited access. Expect: CORRECT.
17. A contractor can be limited to one named private application through Secure Access. Expect: CORRECT.
18. A branch user reaches SaaS through the SD-WAN router and then Secure Access. Expect: CORRECT.
19. My model shows both Cisco Umbrella (blocking malicious destinations at the edge) and Cisco Secure Access on the
    same internet path. Expect: PARTLY; a customer would normally use one, since Secure Access includes DNS-layer
    security. Tell me how to describe the relationship accurately.
20. Secure Access can identify and block or restrict unsanctioned SaaS (shadow IT) and unapproved AI tools
    (shadow AI). Expect: CORRECT.
21. Secure Access can inspect uploads and AI prompts for sensitive data and block them (data loss prevention), and
    can open risky sites in an isolated browser. Expect: CORRECT; these features were not named on the overview page
    I read, so confirm they are publicly documented.
22. Duo provides phishing-resistant MFA, verifies device trust before access, and resists push-bombing (MFA fatigue).
    Expect: CORRECT, and name the feature that addresses push fatigue.
23. Cisco Identity Intelligence flags risky sign-ins such as a valid password from an unfamiliar context or
    impossible travel, and this can drive a step-up or block through Duo or Secure Access. Expect: CORRECT.

D. DATA CENTER, CLOUD AND AI
24. Cisco Secure Firewall can identify threats in encrypted traffic without decrypting it (Encrypted Visibility
    Engine) and uses Talos intelligence. Expect: CORRECT.
25. Hypershield is enforced on Nexus N9300 Smart Switches as stateful segmentation next to the workload.
    Expect: CORRECT, with current availability.
26. Hypershield can apply a compensating control that shields an unpatched workload from exploitation.
    Expect: CORRECT or PARTLY, with current availability.
27. Secure Workload enforces microsegmentation so that a workload, including an automated one, cannot open flows
    outside its allowed policy. Expect: CORRECT.
28. Multicloud Defense provides ingress, egress and east-west protection in public cloud, and blocks command and
    control, exfiltration and lateral movement. Expect: CORRECT.
29. For an internet-facing application in public cloud, placing WAAP in front and Multicloud Defense behind it is a
    fair conceptual picture. Expect: PARTLY.
30. Security Cloud Control manages policy for Secure Firewall, Multicloud Defense, Hypershield, Secure Access,
    Secure Workload and AI Defense. Expect: CORRECT. Does it also manage security policy on Secure Routers / SD-WAN?
    Expect: PARTLY.
31. AI Defense provides runtime guardrails against prompt injection and data leakage for AI applications a customer
    builds. Expect: CORRECT.
32. When an employee pastes confidential data into an approved third-party AI assistant, I attribute the block to AI
    Defense acting at the Secure Access edge. Expect: PARTLY; tell me which product should be credited (Secure Access
    "AI Access", AI Defense, or both) and how they relate.

E. INDUSTRIAL (OT)
33. The Cyber Vision sensor runs inside Cisco industrial switches and routers and builds an OT asset inventory.
    Expect: CORRECT.
34. Cyber Vision shares asset context with ISE and Secure Firewall so OT assets can be segmented into zones and
    conduits. Expect: CORRECT.
35. A vendor reaches one factory machine through a brokered, least-privilege, recorded remote session (Secure
    Equipment Access, now in Cyber Vision), passing through the industrial network. Expect: CORRECT.
36. An OT device that starts communicating outside its baseline is detected by Cyber Vision and can be restricted
    through ISE segmentation. Expect: CORRECT.

F. DETECTION, RESPONSE AND SPLUNK
37. Cisco XDR ingests telemetry from Secure Endpoint, Email Threat Defense, Secure Network Analytics, Secure
    Firewall, Cyber Vision, Identity Intelligence and Secure Client. Expect: CORRECT; list any I missed.
38. Cisco XDR can trigger host isolation in Secure Endpoint as a response action. Expect: CORRECT. Can it also
    trigger an ISE quarantine? Expect: CANNOT CONFIRM from the pages I read; I did not draw an XDR to ISE link.
39. Secure Endpoint can isolate an infected host and block or quarantine a malicious file. Expect: CORRECT.
40. Email Threat Defense can stop threats before delivery and remove a message from mailboxes after delivery.
    Expect: CORRECT.
41. Which Cisco products have a publicly documented integration that sends data to Splunk? My model currently has
    only Secure Firewall, Secure Network Analytics and Cyber Vision feeding Splunk. Expect: INCORRECT as incomplete;
    please list the others (for example XDR, Duo, Secure Endpoint, ISE, Secure Access, Umbrella, Meraki, ThousandEyes)
    with the public app or document name for each.
42. In my model Splunk Enterprise Security and Splunk SOAR observe and analyse but never change the outcome.
    Is it publicly documented that Splunk SOAR can take response actions on Cisco products (for example quarantine
    through ISE, block on a firewall, isolate through Secure Endpoint)? Expect: CORRECT that it can, which would make
    my "never changes the outcome" too conservative.
43. Is there a publicly documented integration between Cisco XDR and Splunk Enterprise Security? Expect: CORRECT;
    describe it in one sentence.
44. ThousandEyes is integrated with Cisco wireless, Catalyst switching, Meraki, Nexus and Secure Access (experience
    insights), and pairs with Splunk Observability Cloud and Splunk AppDynamics. Expect: CORRECT. Is there also a
    documented ThousandEyes integration with Splunk IT Service Intelligence? Expect: CORRECT.

G. THE MODEL ITSELF
45. I show a single 0 to 100 "trust score" for a session that rises and falls with signals. I know no product
    exposes this exact number. Is it a fair teaching device, and which real signals come closest (ISE posture, Duo
    device health and risk-based authentication, Identity Intelligence)? Expect: PARTLY, with advice on wording.
46. Check these typical outcomes. For each, say whether the verdict and the product credited are reasonable:
    a. Employee, compliant managed laptop, HQ, private app in the data center: ALLOW.
    b. Home worker on a personal laptop to sanctioned SaaS: ALLOW WITH LIMITS (Duo device trust).
    c. Contractor trying to reach a server outside their approved application: BLOCK (Secure Access).
    d. External attacker with a stolen password who fails MFA: BLOCK (Duo).
    e. Employee signing in from an impossible-travel location: STEP-UP (Identity Intelligence, then Duo).
    f. Compromised laptop scanning the campus: CONTAIN (Secure Network Analytics detects, ISE quarantines, XDR
       correlates).
    g. Ransomware behaviour on a managed laptop: CONTAIN (Secure Endpoint isolates the host).
    h. Server attempting data exfiltration over an encrypted channel: CONTAIN (Secure Network Analytics and Secure
       Firewall detect and block, XDR correlates).
    i. IoT camera talking to an unknown internet host: CONTAIN (ISE quarantine after a profile mismatch).
    j. Internet attack on a private data center application: BLOCK (Secure Firewall; Hypershield as a second layer).
47. Is any capability above credited to the wrong product, or is any important product missing from a scenario where
    a customer would expect to see it?
````

## Products included (40)

| Product | Category | Function (own words) | Source |
|---|---|---|---|
| Cisco Wireless (Wi-Fi 7) | Networking | Wi-Fi 7 access points and controllers with WPA3, rogue management and security group tags for segmented wireless access. | https://www.cisco.com/site/us/en/products/networking/wireless/index.html |
| Cisco Smart Switches (Catalyst) | Networking | Campus and branch switching that carries identity-based segmentation and feeds telemetry to management and assurance tools. | https://www.cisco.com/site/us/en/products/networking/switches/index.html |
| Cisco Industrial IoT Networking | Networking | Rugged switches, routers and wireless for operational sites, with OT visibility, segmentation and remote access built in. | https://www.cisco.com/site/us/en/products/networking/industrial-iot/index.html |
| Cisco Secure Routers / SD-WAN | Networking | Routing and SD-WAN platform with encryption, segmentation and a built-in next-generation firewall for branch and WAN. | https://www.cisco.com/site/us/en/products/networking/sdwan-routers/index.html |
| Cisco Nexus Data Center Networking | Networking | Data center switching and fabric management; N9300 Smart Switches embed Hypershield enforcement beside workloads. | https://www.cisco.com/site/us/en/products/networking/cloud-networking/index.html |
| Cisco Silicon One | Networking | Programmable networking silicon architecture used inside Cisco routing, Nexus and Catalyst switching platforms. | https://www.cisco.com/site/us/en/products/networking/silicon-one/index.html |
| Cisco ThousandEyes | Networking | Assurance that measures digital experience across owned and unowned networks, from the user to cloud and SaaS. | https://www.cisco.com/site/us/en/products/networking/software/internet-cloud-intelligence/index.html |
| Meraki dashboard (Cisco Networking Platform) | Networking | Cloud dashboard that configures and monitors wireless, switching, routing and industrial Ethernet from one place. | https://www.cisco.com/site/us/en/products/networking/networking-cloud/index.html |
| AgenticOps (Cisco AI Canvas) | Networking | Shared workspace in Cisco Cloud Control where teams and AI agents investigate and resolve cross-domain issues. *No standalone AgenticOps page was found on cisco.com; the AI Canvas page (“the workspace for AgenticOps”) is used as the source.* | https://www.cisco.com/site/us/en/solutions/artificial-intelligence/agentic-ops/ai-canvas/index.html |
| Cisco Duo | Identity & access | Identity and access management with phishing-resistant authentication that verifies the user and device before access. | https://www.cisco.com/site/us/en/products/security/duo/index.html |
| Cisco Identity Services Engine (ISE) | Identity & access | Network access control that profiles endpoints, applies identity and posture context, segments access and quarantines risky devices. | https://www.cisco.com/site/us/en/products/security/identity-services-engine/index.html |
| Cisco Identity Intelligence | Identity & access | Identity analytics that exposes risky accounts and privileges and flags high-risk access attempts for Duo, Secure Access and XDR. | https://www.cisco.com/site/us/en/solutions/security/identity-intelligence/index.html |
| Cisco Secure Client | Identity & access | Modular endpoint client providing VPN and zero trust network access, with endpoint and roaming security modules. | https://www.cisco.com/site/us/en/products/security/secure-client/index.html |
| Cisco Secure Access | Identity & access | SSE: Cisco Secure Access incorporates the DNS-layer security and secure web gateway (SWG) capabilities that were previously the core of Umbrella, but it expands them into a full SSE platform with zero trust and VPN access to private apps, SaaS and AI use. | https://www.cisco.com/site/us/en/products/security/secure-access/index.html |
| Cisco Secure Firewall | Network security | Firewalls that inspect traffic, use Talos intelligence and detect threats in encrypted flows without decrypting them. | https://www.cisco.com/site/us/en/products/security/firewalls/index.html |
| Cisco Hybrid Mesh Firewall | Network security | Solution that unifies distributed enforcement points — firewalls, smart switches, agents and AI guardrails — under one management plane. | https://www.cisco.com/site/us/en/solutions/security/hybrid-mesh-firewall/index.html |
| Cisco Multicloud Defense | Network security | Cloud firewalling from one control plane with ingress, egress and east-west protection across public and private clouds. | https://www.cisco.com/site/us/en/products/security/multicloud-defense/index.html |
| Cisco Security Cloud Control | Network security | Unified management that authors policy once and applies it across Cisco and third-party enforcement points. *The cisco.com product page is currently titled “Security in Cisco Cloud Control”.* | https://www.cisco.com/site/us/en/products/security/security-cloud-control/index.html |
| Cisco Hypershield | Cloud & application security | Distributed security fabric giving stateful segmentation close to workloads, enforced on Nexus N9300 Smart Switches. | https://www.cisco.com/site/us/en/products/security/hypershield/index.html |
| Cisco Secure Workload | Cloud & application security | Zero trust microsegmentation for workloads in any environment, with visibility into flows and policy recommendations. | https://www.cisco.com/site/us/en/products/security/secure-workload/index.html |
| Cisco AI Defense | Cloud & application security | Discovers AI assets, tests models for vulnerabilities and applies runtime guardrails against prompt injection and data leakage. | https://www.cisco.com/site/us/en/products/security/ai-defense/index.html |
| Cisco Web Application and API Protection (WAAP) | Cloud & application security | Application, API and bot protection that uses behavioural analysis to identify threats before they reach the application. | https://www.cisco.com/c/en/us/products/security/secure-web-application-firewall/index.html |
| Cisco Secure Endpoint | Endpoint & email | Endpoint detection and response that blocks malware and can isolate an infected host with one action. | https://www.cisco.com/site/us/en/products/security/endpoint-security/secure-endpoint/index.html |
| Cisco Secure Email Threat Defense | Endpoint & email | Cloud email security that stops threats before delivery and remediates messages after delivery through APIs. | https://www.cisco.com/site/us/en/products/security/secure-email/index.html |
| Cisco XDR | Detection & intelligence | Correlates telemetry from network, endpoint, email, cloud and identity into prioritised incidents with guided and automated response. | https://www.cisco.com/site/us/en/products/security/xdr/index.html |
| Cisco Secure Network Analytics | Detection & intelligence | Behavioural network analytics that detects insider threats, exfiltration and threats in encrypted traffic without decryption. | https://www.cisco.com/site/us/en/products/security/security-analytics/secure-network-analytics/index.html |
| Cisco Talos | Detection & intelligence | Cisco’s threat intelligence organisation; its research and detections feed Cisco security products. | https://www.cisco.com/site/us/en/products/security/talos/index.html |
| Cisco Cyber Vision | Industrial (OT) security | OT visibility from sensors embedded in network equipment: asset inventory, risk scoring, threat detection, segmentation and remote access. | https://www.cisco.com/site/us/en/products/security/industrial-security/cyber-vision/index.html |
| Cisco Industrial Threat Defense | Industrial (OT) security | OT security solution combining asset discovery, segmentation, zero trust remote access and unified IT/OT detection. | https://www.cisco.com/site/us/en/products/security/industrial-security/index.html |
| Cisco Secure Equipment Access | Industrial (OT) security | Zero trust remote access to industrial assets; cisco.com states it is now part of Cyber Vision. *The product page states: “Cisco Secure Equipment Access is now part of Cisco Cyber Vision.” Capabilities shown here are those listed for remote access on the Cyber Vision page.* | https://www.cisco.com/site/us/en/products/security/industrial-security/secure-equipment-access/index.html |
| Cisco User Protection Suite | Suites | Suite packaging Secure Access, Duo and Email Threat Defense; the Advantage tier adds Secure Endpoint and ISE. | https://www.cisco.com/site/us/en/products/security/user-protection/index.html |
| Cisco Cloud Protection Suite | Suites | Suite for adopting Hybrid Mesh Firewall: Secure Workload, Hypershield, Secure Firewall, Multicloud Defense and Security Cloud Control. | https://www.cisco.com/site/us/en/products/security/cloud-protection/index.html |
| Splunk Platform (Cloud Platform / Enterprise) | Splunk (data, security analytics, observability) | Data platform to search, analyse, visualise and act on machine data, with streaming ingestion and federated search. | https://www.splunk.com/en_us/products/splunk-cloud-platform.html |
| Splunk Enterprise Security | Splunk (data, security analytics, observability) | Threat detection, investigation and response platform combining SIEM, SOAR, behaviour analytics and AI-driven alert prioritisation. | https://www.splunk.com/en_us/products/enterprise-security.html |
| Splunk SOAR | Splunk (data, security analytics, observability) | Orchestrates security workflows and automates response tasks through playbooks, integrations and case management. | https://www.splunk.com/en_us/products/splunk-security-orchestration-and-automation.html |
| Splunk Attack Analyzer | Splunk (data, security analytics, observability) | Automated analysis of suspected malware and credential phishing that follows the attack chain to a verdict. | https://www.splunk.com/en_us/products/attack-analyzer.html |
| Splunk Observability Cloud | Splunk (data, security analytics, observability) | OpenTelemetry-native full-stack observability: application, infrastructure, user-experience, database and log monitoring. | https://www.splunk.com/en_us/products/observability-cloud.html |
| Splunk IT Service Intelligence | Splunk (data, security analytics, observability) | AIOps service intelligence that correlates alerts into episodes and tracks service health against business priorities. | https://www.splunk.com/en_us/products/it-service-intelligence.html |
| Splunk AppDynamics | Splunk (data, security analytics, observability) | Application observability for hybrid and on-premises apps that links performance to business metrics, with runtime application security. | https://www.splunk.com/en_us/products/splunk-appdynamics.html |
| Cisco Breach Protection Suite | Suites | Suite unified by XDR with Email Threat Defense and Secure Endpoint; the Advantage tier adds Secure Network Analytics and Telemetry Broker, and a Premier tier adds managed XDR and Talos Incident Response. | https://www.cisco.com/site/us/en/products/security/breach-protection/index.html |

## Relationships drawn (108)

Each line is a relationship stated on the cisco.com, splunk.com or Splunkbase page given as its source.

| A | B | Stated relationship | Source page |
|---|---|---|---|
| ISE | Smart Switches | Identity-based segmentation with security group tags, orchestrated by ISE | https://www.cisco.com/site/us/en/solutions/networking/campus-branch-networking/secure-campus/index.html |
| ISE | Wi-Fi 7 | Security group tags on wireless; segmentation orchestrated by ISE | https://www.cisco.com/site/us/en/solutions/networking/campus-branch-networking/secure-campus/index.html |
| ISE | Hybrid Mesh Firewall | ISE identity context informs segmentation policy | https://www.cisco.com/site/us/en/products/security/identity-services-engine/index.html |
| ISE | Firewall | ISE shares identity context for segmentation | https://www.cisco.com/site/us/en/products/security/firewalls/index.html |
| ISE | Network Analytics | Used together for segmentation policy and unauthorised-access alerts | https://www.cisco.com/site/us/en/products/security/security-analytics/secure-network-analytics/index.html |
| ISE | Cyber Vision | Out-of-the-box IT/OT integration | https://www.cisco.com/site/us/en/products/security/industrial-security/cyber-vision/index.html |
| ISE | Secure Access | Zero Trust Access is built with ISE, Secure Access and Duo | https://www.cisco.com/site/us/en/products/security/identity-services-engine/index.html |
| ISE | Duo | Zero Trust Access is built with ISE, Secure Access and Duo | https://www.cisco.com/site/us/en/products/security/identity-services-engine/index.html |
| Duo | Secure Access | Duo strengthens authentication for Secure Access | https://www.cisco.com/site/us/en/products/security/secure-access/index.html |
| Identity Intelligence | Duo | Adds identity insights to Duo | https://www.cisco.com/site/us/en/solutions/security/identity-intelligence/index.html |
| Identity Intelligence | Secure Access | Adds identity intelligence against account takeover | https://www.cisco.com/site/us/en/solutions/security/identity-intelligence/index.html |
| Identity Intelligence | XDR | Adds identity threat views and response actions to XDR | https://www.cisco.com/site/us/en/solutions/security/identity-intelligence/index.html |
| Secure Client | Secure Endpoint | Secure Endpoint is offered as a Secure Client module | https://www.cisco.com/site/us/en/products/security/secure-client/index.html |
| Secure Client | XDR | Integration for detection and response | https://www.cisco.com/site/us/en/products/security/secure-client/index.html |
| Secure Client | Network Analytics | Paired for visibility into application use and behaviour | https://www.cisco.com/site/us/en/products/security/secure-client/index.html |
| Secure Access | Secure Routers · SD-WAN | SASE converges Secure Access with SD-WAN | https://www.cisco.com/site/us/en/solutions/secure-access-service-edge-sase/index.html |
| Secure Access | Meraki dashboard | Secure Access integrates with Meraki SD-WAN | https://www.cisco.com/site/us/en/products/security/secure-access/index.html |
| Secure Access | ThousandEyes | ThousandEyes powers experience insights in Secure Access | https://www.cisco.com/site/us/en/products/security/secure-access/index.html |
| Secure Access | Security Cloud Control | Brings user and app access into the same policy framework | https://www.cisco.com/site/us/en/products/security/security-cloud-control/index.html |
| Secure Access | AI Defense | AI Access for third-party AI apps is listed under Secure Access | https://www.cisco.com/site/us/en/products/security/ai-defense/index.html |
| Firewall | Security Cloud Control | Firewall management through Security Cloud Control | https://www.cisco.com/site/us/en/products/security/firewalls/index.html |
| Firewall | Hybrid Mesh Firewall | Firewall is an enforcement point of Hybrid Mesh Firewall | https://www.cisco.com/site/us/en/solutions/security/hybrid-mesh-firewall/index.html |
| Firewall | Talos | Talos supplies threat intelligence | https://www.cisco.com/site/us/en/products/security/firewalls/index.html |
| Firewall | Secure Workload | Native integration between Secure Workload and Secure Firewall | https://www.cisco.com/site/us/en/products/security/secure-workload/index.html |
| Firewall | XDR | Listed firewall integration | https://www.cisco.com/site/us/en/products/security/firewalls/index.html |
| Firewall | WAAP | Listed firewall integration | https://www.cisco.com/site/us/en/products/security/firewalls/index.html |
| Firewall | Cyber Vision | Out-of-the-box IT/OT integration | https://www.cisco.com/site/us/en/products/security/industrial-security/cyber-vision/index.html |
| Hybrid Mesh Firewall | Security Cloud Control | All enforcement points are managed through Security Cloud Control | https://www.cisco.com/site/us/en/solutions/security/hybrid-mesh-firewall/index.html |
| Hybrid Mesh Firewall | Secure Workload | End-to-end segmentation powered by Secure Workload | https://www.cisco.com/site/us/en/solutions/security/hybrid-mesh-firewall/index.html |
| Hybrid Mesh Firewall | AI Defense | AI workload protection powered by AI Defense | https://www.cisco.com/site/us/en/solutions/security/hybrid-mesh-firewall/index.html |
| Hybrid Mesh Firewall | Hypershield | Vulnerability shielding powered by Hypershield technology | https://www.cisco.com/site/us/en/solutions/security/hybrid-mesh-firewall/index.html |
| Hybrid Mesh Firewall | Multicloud Defense | Multicloud firewalling powered by Multicloud Defense | https://www.cisco.com/site/us/en/solutions/security/hybrid-mesh-firewall/index.html |
| Hybrid Mesh Firewall | Nexus | Unifies switches, firewalls and Kubernetes workloads under one control plane | https://www.cisco.com/site/us/en/products/networking/cloud-networking/nexus-one/index.html |
| Multicloud Defense | Security Cloud Control | Policy managed from Security Cloud Control | https://www.cisco.com/site/us/en/products/security/multicloud-defense/index.html |
| Hypershield | Nexus | Enforced on Nexus N9300 Smart Switches | https://www.cisco.com/site/us/en/products/security/hypershield/index.html |
| Hypershield | Security Cloud Control | Cloud Control manages Hypershield policy, visibility and lifecycle | https://www.cisco.com/site/us/en/products/security/hypershield/index.html |
| Secure Workload | Security Cloud Control | Consistent segmentation and zero trust policy | https://www.cisco.com/site/us/en/products/security/security-cloud-control/index.html |
| AI Defense | Security Cloud Control | Extends the architecture to AI risk | https://www.cisco.com/site/us/en/products/security/security-cloud-control/index.html |
| Secure Routers · SD-WAN | Security Cloud Control | Router NGFW combined with other security through Security Cloud Control | https://www.cisco.com/site/us/en/products/networking/sdwan-routers/index.html |
| AI Defense | Talos | Talos intelligence informs detections | https://www.cisco.com/site/us/en/products/security/ai-defense/index.html |
| Secure Endpoint | XDR | Integrated XDR capabilities | https://www.cisco.com/site/us/en/products/security/endpoint-security/secure-endpoint/index.html |
| Secure Endpoint | Talos | Talos threat hunting and intelligence built in | https://www.cisco.com/site/us/en/products/security/endpoint-security/secure-endpoint/index.html |
| Secure Endpoint | Duo | Duo verifies user identity before application access | https://www.cisco.com/site/us/en/products/security/endpoint-security/secure-endpoint/index.html |
| Email Threat Defense | Secure Endpoint | Listed “better together” pairing | https://www.cisco.com/site/us/en/products/security/secure-email/index.html |
| XDR | Email Threat Defense | Listed Cisco integration | https://www.cisco.com/site/us/en/products/security/xdr/index.html |
| XDR | Network Analytics | Listed Cisco integration for network visibility | https://www.cisco.com/site/us/en/products/security/xdr/index.html |
| Cyber Vision | XDR | Out-of-the-box IT/OT integration | https://www.cisco.com/site/us/en/products/security/industrial-security/cyber-vision/index.html |
| Cyber Vision | Talos | Talos intelligence and detection content | https://www.cisco.com/site/us/en/products/security/industrial-security/cyber-vision/index.html |
| Cyber Vision | Industrial network | Cyber Vision sensor is built into industrial network equipment | https://www.cisco.com/site/us/en/products/networking/industrial-iot/index.html |
| Industrial Threat Defense | Cyber Vision | Component of Industrial Threat Defense | https://www.cisco.com/site/us/en/products/security/industrial-security/index.html |
| Industrial Threat Defense | Firewall | Component of Industrial Threat Defense | https://www.cisco.com/site/us/en/products/security/industrial-security/index.html |
| Industrial Threat Defense | ISE | Component of Industrial Threat Defense | https://www.cisco.com/site/us/en/products/security/industrial-security/index.html |
| Industrial Threat Defense | XDR | OT insights surface in XDR | https://www.cisco.com/site/us/en/products/security/industrial-security/index.html |
| Industrial Threat Defense | Talos | Talos intelligence and incident response | https://www.cisco.com/site/us/en/products/security/industrial-security/index.html |
| Secure Equipment Access | Cyber Vision | Secure Equipment Access is now part of Cyber Vision | https://www.cisco.com/site/us/en/products/security/industrial-security/secure-equipment-access/index.html |
| Silicon One | Nexus | Silicon One inside Nexus switches | https://www.cisco.com/site/us/en/products/networking/silicon-one/index.html |
| Silicon One | Smart Switches | Silicon One inside Catalyst and Smart Switches | https://www.cisco.com/site/us/en/products/networking/silicon-one/index.html |
| ThousandEyes | Wi-Fi 7 | Embedded assurance in Cisco wireless | https://www.cisco.com/site/us/en/products/networking/wireless/index.html |
| ThousandEyes | Smart Switches | Listed better-together switching solution | https://www.cisco.com/site/us/en/products/networking/switches/index.html |
| ThousandEyes | Meraki dashboard | Embedded assurance in the Meraki dashboard | https://www.cisco.com/site/us/en/products/networking/networking-cloud/index.html |
| ThousandEyes | Nexus | Traffic insights within the data center | https://www.cisco.com/site/us/en/products/networking/software/internet-cloud-intelligence/index.html |
| Meraki dashboard | Smart Switches | Cloud monitoring and management of Catalyst switching | https://www.cisco.com/site/us/en/products/networking/switches/index.html |
| Meraki dashboard | Wi-Fi 7 | Cloud configuration and management of wireless | https://www.cisco.com/site/us/en/products/networking/wireless/index.html |
| Meraki dashboard | Industrial network | Deploy, manage and monitor from the Meraki platform | https://www.cisco.com/site/us/en/products/networking/industrial-iot/index.html |
| AgenticOps | Wi-Fi 7 | AgenticOps capabilities for wireless | https://www.cisco.com/site/us/en/products/networking/wireless/index.html |
| AgenticOps | Meraki dashboard | AI Canvas routes to a Meraki agent | https://www.cisco.com/site/us/en/solutions/artificial-intelligence/agentic-ops/ai-canvas/index.html |
| AgenticOps | ThousandEyes | AI Canvas routes to a ThousandEyes agent | https://www.cisco.com/site/us/en/solutions/artificial-intelligence/agentic-ops/ai-canvas/index.html |
| User Protection | Secure Access | Included in the suite | https://www.cisco.com/site/us/en/products/security/user-protection/index.html |
| User Protection | Duo | Included in the suite | https://www.cisco.com/site/us/en/products/security/user-protection/index.html |
| User Protection | Email Threat Defense | Included in the suite | https://www.cisco.com/site/us/en/products/security/user-protection/index.html |
| User Protection | Secure Endpoint | Included in the Advantage tier | https://www.cisco.com/site/us/en/products/security/user-protection/index.html |
| User Protection | ISE | Included in the Advantage tier | https://www.cisco.com/site/us/en/products/security/user-protection/index.html |
| User Protection | Talos | Talos intelligence for user protection | https://www.cisco.com/site/us/en/products/security/user-protection/index.html |
| Cloud Protection | Secure Workload | Included in the Segmentation package | https://www.cisco.com/site/us/en/products/security/cloud-protection/index.html |
| Cloud Protection | Hypershield | Included in the Segmentation package | https://www.cisco.com/site/us/en/products/security/cloud-protection/index.html |
| Cloud Protection | Security Cloud Control | Included in both packages | https://www.cisco.com/site/us/en/products/security/cloud-protection/index.html |
| Cloud Protection | Firewall | Included in the Gateway package | https://www.cisco.com/site/us/en/products/security/cloud-protection/index.html |
| Cloud Protection | Multicloud Defense | Included in the Gateway package | https://www.cisco.com/site/us/en/products/security/cloud-protection/index.html |
| Cloud Protection | Hybrid Mesh Firewall | The suite is the licensing path to Hybrid Mesh Firewall | https://www.cisco.com/site/us/en/products/security/cloud-protection/index.html |
| Breach Protection | XDR | Suite is unified by XDR | https://www.cisco.com/site/us/en/products/security/breach-protection/index.html |
| Breach Protection | Email Threat Defense | Included in the suite | https://www.cisco.com/site/us/en/products/security/breach-protection/index.html |
| Breach Protection | Secure Endpoint | Included in the suite | https://www.cisco.com/site/us/en/products/security/breach-protection/index.html |
| Breach Protection | Network Analytics | Included in the Advantage tier | https://www.cisco.com/site/us/en/products/security/breach-protection/index.html |
| Breach Protection | Talos | Threat intelligence from Talos | https://www.cisco.com/site/us/en/products/security/breach-protection/index.html |
| Firewall | Splunk Platform | Firewall Threat Defense customers who subscribe to Splunk can ingest extra firewall log data (terms apply) | https://www.cisco.com/site/us/en/products/security/firewalls/index.html |
| Hybrid Mesh Firewall | Splunk Platform | Splunk is a listed integration for additional log data | https://www.cisco.com/site/us/en/solutions/security/hybrid-mesh-firewall/index.html |
| Network Analytics | Splunk Platform | Secure Network Analytics with Splunk for network monitoring and threat detection | https://www.cisco.com/site/us/en/products/security/security-analytics/secure-network-analytics/index.html |
| Cyber Vision | Splunk Platform | Cyber Vision app for Splunk provides OT dashboards | https://www.cisco.com/site/us/en/products/security/industrial-security/cyber-vision/index.html |
| Industrial Threat Defense | Splunk Platform | Unified view of IT and OT data in Splunk | https://www.cisco.com/site/us/en/products/security/industrial-security/index.html |
| AI Defense | Splunk Platform | Splunk data can be used for additional AI security insights | https://www.cisco.com/site/us/en/products/security/ai-defense/index.html |
| Nexus | Splunk Platform | Nexus Dashboard integrates Splunk data; native Splunk analytics in Nexus One | https://www.cisco.com/site/us/en/products/networking/cloud-networking/nexus-one/index.html |
| Duo | Splunk Platform | Duo data sent to Splunk through the Cisco Security Cloud app | https://splunkbase.splunk.com/app/7404 |
| Email Threat Defense | Splunk Platform | Email Threat Defense data sent to Splunk through the Cisco Security Cloud app | https://splunkbase.splunk.com/app/7404 |
| Identity Intelligence | Splunk Platform | Identity Intelligence data sent to Splunk through the Cisco Security Cloud app | https://splunkbase.splunk.com/app/7404 |
| Multicloud Defense | Splunk Platform | Multicloud Defense data sent to Splunk through the Cisco Security Cloud app | https://splunkbase.splunk.com/app/7404 |
| Secure Endpoint | Splunk Platform | Secure Endpoint data sent to Splunk through the Cisco Security Cloud app | https://splunkbase.splunk.com/app/7404 |
| Secure Workload | Splunk Platform | Secure Workload data sent to Splunk through the Cisco Security Cloud app | https://splunkbase.splunk.com/app/7404 |
| XDR | Enterprise Security | XDR incidents imported into Splunk and promoted to Enterprise Security notables (Cisco Security Cloud app) | https://splunkbase.splunk.com/app/7404 |
| Talos | Attack Analyzer | Talos threat intelligence is available in Splunk Attack Analyzer | https://www.cisco.com/site/us/en/products/security/talos/index.html |
| ThousandEyes | Observability Cloud | Splunk Observability and ThousandEyes are presented together as Cisco Observability | https://www.cisco.com/site/us/en/products/observability/index.html |
| ThousandEyes | AppDynamics | Combine application-layer and network-layer intelligence for one view of performance | https://www.cisco.com/site/us/en/products/networking/software/internet-cloud-intelligence/index.html |
| AgenticOps | ITSI | ITSI lists a Cisco AI Canvas integration | https://www.splunk.com/en_us/products/it-service-intelligence.html |
| Enterprise Security | Splunk SOAR | SOAR is integrated with Enterprise Security as one workflow | https://www.splunk.com/en_us/products/enterprise-security.html |
| Enterprise Security | Splunk Platform | Listed as related products; federated search and analytics over platform data | https://www.splunk.com/en_us/products/splunk-cloud-platform.html |
| Attack Analyzer | Splunk SOAR | Direct integration for automated analysis and response | https://www.splunk.com/en_us/products/attack-analyzer.html |
| Attack Analyzer | Enterprise Security | Enterprise Security includes native automated threat analysis | https://www.splunk.com/en_us/products/attack-analyzer.html |
| Observability Cloud | Splunk Platform | Log analytics correlates logs stored in the Splunk platform with metrics and traces | https://www.splunk.com/en_us/products/observability-cloud.html |
| ITSI | Splunk Platform | ITSI runs on Splunk Cloud Platform and Splunk Enterprise | https://www.splunk.com/en_us/products/it-service-intelligence.html |

## Rule table

Identifiers are the ids used in the `DATA` object (`pickers`, `products`, `places`).

### Path rules

The most specific matching rule wins (ties: the later rule). `@loc` / `@dest` are the chosen location and destination.

| Rule | When | Nodes |
|---|---|---|
| AC-0 (access) | always | @loc |
| AC-remote (access) | location ∈ {home, public, travel} | @loc |
| AC-internet (access) | location ∈ {internet} | internet |
| AC-hq (access) | location ∈ {hq} | hq → wireless → switches |
| AC-hq-wired (access) | device ∈ {headless}; location ∈ {hq} | hq → switches |
| AC-branch (access) | location ∈ {branch} | branch → sdwan |
| AC-factory (access) | location ∈ {factory} | factory → industrial |
| AC-remote-client (access) | device ∈ {mgd, stale, mobile, compromised}; location ∈ {home, public, travel} | @loc → client |
| AC-workload (access) | device ∈ {server} | workload → nexus |
| RT-0 (route) | always | sa → @dest |
| RT-dc (route) | destination ∈ {dcapp, eastwest, intai} | fw → nexus → @dest |
| RT-dc-remote (route) | location ∈ {home, public, travel}; destination ∈ {dcapp, eastwest, intai} | sa → fw → nexus → @dest |
| RT-dc-workload (route) | device ∈ {server}; destination ∈ {dcapp, eastwest, intai} | @dest |
| RT-cloud (route) | destination ∈ {cloudapp} | sa → mcd → cloudapp |
| RT-cloud-onprem (route) | location ∈ {hq, branch, factory}; destination ∈ {cloudapp} | sdwan → mcd → cloudapp |
| RT-cloud-workload (route) | device ∈ {server}; destination ∈ {cloudapp} | fw → mcd → cloudapp |
| RT-cloud-internet (route) | location ∈ {internet}; destination ∈ {cloudapp} | waap → mcd → cloudapp |
| RT-inet (route) | destination ∈ {saas, shadow, web_safe, web_risky, web_mal, ai, pubai, mail} | sa → @dest |
| RT-inet-onprem (route) | location ∈ {hq, branch, factory}; destination ∈ {saas, shadow, web_safe, web_risky, web_mal, ai, pubai, mail} | sdwan → sa → @dest |
| RT-inet-workload (route) | device ∈ {server}; destination ∈ {saas, shadow, web_safe, web_risky, web_mal, ai, pubai, mail} | fw → @dest |
| RT-inet-internet (route) | location ∈ {internet}; destination ∈ {saas, shadow, web_safe, web_risky, web_mal, ai, pubai, mail} | @dest |
| RT-ot (route) | destination ∈ {ot} | fw → industrial → otctl |
| RT-ot-factory (route) | location ∈ {factory}; destination ∈ {ot} | otctl |
| RT-ot-remote (route) | location ∈ {home, public, travel}; destination ∈ {ot} | sea → industrial → otctl |

### Checkpoint rules

Every matching rule fires in path order. Verdict = highest severity among fired rules (ALLOW < ALLOW WITH LIMITS < STEP-UP < BLOCK < CONTAIN); with none, ALLOW. STEP-UP, BLOCK and CONTAIN on the path stop traffic at that hop.

| Rule | When | Checked by | At hop | What is checked → result | Trust | Verdict |
|---|---|---|---|---|---|---|
| N1 | device ∉ {headless, server}; who ∉ {guest, attacker}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Network access control → User and device authenticated to the network; segment assigned from identity | +5 (Network identity established) | — |
| N2 | device ∈ {headless}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Endpoint profiling → Headless device profiled and placed in a least-privilege segment | +5 (Device profiled) | ALLOW WITH LIMITS |
| N3 | who ∈ {guest}; destination ∈ {saas, shadow, web_safe, web_risky, web_mal, ai, pubai, mail}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Guest access → Guest identity mapped to an internet-only segment | — | ALLOW WITH LIMITS |
| N4 | who ∈ {guest}; destination ∈ {dcapp, cloudapp, eastwest, intai, ot}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Guest segmentation → The guest segment has no path to internal resources | -10 (Out-of-scope request) | BLOCK |
| N5 | who ∈ {iot, ot}; destination ∈ {dcapp, cloudapp, intai}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Device segmentation → Destination is outside what this device profile may reach | -10 (Out-of-profile destination) | BLOCK |
| N6 | who ∈ {iot}; destination ∈ {ot}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Device segmentation → IT-side device has no path into the industrial zone | -10 (Out-of-profile destination) | BLOCK |
| N7 | who ∈ {ot}; destination ∈ {saas, shadow, web_safe, web_risky, web_mal, ai, pubai, mail}; path includes {industrial} | Cyber Vision | industrial | Zones and conduits → No conduit is defined from this OT zone to the internet | -10 (Out-of-zone destination) | BLOCK |
| P1 | device ∈ {mgd, mobile}; location ∈ {hq, branch, factory}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Device posture → Managed device meets compliance policy | +5 (Posture compliant) | — |
| P2 | who ∈ {emp, admin, exec, contractor, insider, attacker}; device ∈ {mgd, mobile}; location ∈ {home, public, travel} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | Device trust → Managed, healthy device confirmed | +5 (Trusted device) | — |
| P3 | device ∈ {stale}; location ∈ {hq, branch, factory}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Device posture → Device is out of date and fails compliance policy | -15 (Posture non-compliant) | ALLOW WITH LIMITS |
| P4 | device ∈ {stale}; location ∈ {home, public, travel} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | Device trust → Device is out of date and fails the device-health policy | -15 (Posture non-compliant) | ALLOW WITH LIMITS |
| P5 | who ∈ {emp, admin, exec, contractor, insider}; device ∈ {byod, claptop} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | Device trust → Device is not managed by the organisation; trust not established | -10 (Unmanaged device) | ALLOW WITH LIMITS |
| M6 | who ∈ {emp, admin, exec, contractor, insider, attacker}; behaviour any of {fatigue} | Identity Intelligence | sa / sea / switches / industrial / sdwan / client / @dst | Identity analytics → Abnormal authentication pattern flagged on the account | -10 (Identity risk raised) | STEP-UP |
| M7 | who ∈ {emp, admin, exec, contractor, insider, attacker}; behaviour any of {stolen} | Identity Intelligence | sa / sea / switches / industrial / sdwan / client / @dst | Identity analytics → Valid password presented from an unfamiliar context: high-risk sign-in | -25 (Credential risk) | STEP-UP |
| M8 | who ∈ {emp, admin, exec, contractor, insider, attacker}; location ∈ {travel} | Identity Intelligence | sa / sea / switches / industrial / sdwan / client / @dst | Sign-in context → Location is inconsistent with the account’s recent activity | -20 (Impossible travel) | STEP-UP |
| M9 | who ∈ {emp, admin, exec, contractor, insider, attacker}; behaviour any of {offhours} | Identity Intelligence | sa / sea / switches / industrial / sdwan / client / @dst | Access pattern → Access time is outside the identity’s normal pattern | -8 (Unusual time of access) | — |
| M1 | who ∈ {emp, exec, contractor, insider}; behaviour none of {mfa_fail, fatigue, stolen} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | User authentication → User verified with phishing-resistant MFA | +10 (MFA passed) | — |
| M1b | who ∈ {emp, admin, exec, contractor, insider, attacker}; behaviour all of {stolen, mfa_ok} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | User authentication → MFA challenge completed | +5 (MFA passed) | — |
| M2 | who ∈ {admin}; behaviour any of {mfa_ok}; behaviour none of {stolen} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | Privileged authentication → Administrator verified with fresh phishing-resistant MFA | +10 (MFA passed) | — |
| M3 | who ∈ {admin}; behaviour none of {mfa_ok, mfa_fail, fatigue} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | Privileged session → Privileged access requires fresh strong authentication | -5 (Fresh authentication required) | STEP-UP |
| M4 | who ∈ {emp, admin, exec, contractor, insider, attacker}; behaviour any of {mfa_fail} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | User authentication → MFA not completed; no session issued | -30 (MFA failed) | BLOCK |
| M5 | who ∈ {emp, admin, exec, contractor, insider, attacker}; behaviour any of {fatigue} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | Push-bombing resistance → Repeated prompts were not approved by a verified user; sign-in refused | -25 (MFA fatigue pattern) | BLOCK |
| M10 | who ∈ {attacker}; behaviour none of {stolen} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | User authentication → No valid identity presented | -20 (Unauthenticated request) | BLOCK |
| S1 | who ∈ {contractor}; destination ∈ {dcapp, cloudapp}; path includes {sa} | Secure Access | sa | Zero trust access → Access granted to the one approved application, not to the network | — | ALLOW WITH LIMITS |
| S1b | who ∈ {contractor}; destination ∈ {dcapp, cloudapp}; path includes {switches, industrial, sdwan}; path lacks {sa} | ISE | switches / industrial / sdwan | Contractor segmentation → Contractor segment permits only the approved application | — | ALLOW WITH LIMITS |
| S2 | who ∈ {contractor}; destination ∈ {eastwest, intai}; path includes {sa} | Secure Access | sa | Zero trust access → Requested resource is not among the contractor’s granted applications | -15 (Out-of-scope request) | BLOCK |
| S2b | who ∈ {contractor}; destination ∈ {eastwest, intai}; path includes {switches, industrial, sdwan}; path lacks {sa} | ISE | switches / industrial / sdwan | Contractor segmentation → Requested resource is outside the contractor segment | -15 (Out-of-scope request) | BLOCK |
| S3 | path includes {sea} | Secure Equipment Access | sea | Remote equipment access → Least-privilege session to the named asset, with approval workflow and session recording | — | ALLOW WITH LIMITS |
| S4 | behaviour any of {priv}; path includes {sa} | Secure Access | sa | Least-privilege access → Requested privilege exceeds what the identity’s role allows | -15 (Excess privilege request) | BLOCK |
| S5 | behaviour any of {priv}; path includes {nexus}; path lacks {sa} | Secure Workload | nexus | Microsegmentation policy → Flow is outside the workload’s allowed communication policy | -15 (Excess privilege request) | BLOCK |
| S6 | behaviour any of {priv}; path lacks {sa, nexus} | Identity Intelligence | switches / industrial / sdwan / @dst | Privilege analytics → Privilege request exceeds the role and is flagged as risky | -15 (Excess privilege request) | BLOCK |
| X1 | who ∈ {attacker}; path includes {fw} | Firewall | fw | Inbound threat prevention → Unsolicited inbound connection denied; known attack patterns blocked using Talos intelligence | -25 (Hostile inbound traffic) | BLOCK |
| X2 | who ∈ {attacker}; path includes {waap} | WAAP | waap | Application and API protection → Malicious requests and automated-client patterns filtered in front of the application | -25 (Application attack pattern) | BLOCK |
| X3 | who ∈ {attacker}; path includes {mcd} | Multicloud Defense | mcd | Cloud ingress protection → Inbound attack blocked at the cloud gateway | -20 (Hostile inbound traffic) | BLOCK |
| X4 | who ∈ {attacker}; path includes {nexus} | Hypershield | nexus | Vulnerability shielding → A compensating control shields the exposed workload from exploitation | -20 (Exploit attempt) | BLOCK |
| T1a | device ∈ {compromised}; behaviour none of {scan, ransom, exfil} | Secure Endpoint | @src | Endpoint detection → Malware detected on the device; host isolated from the network | -45 (Malware on device) | CONTAIN |
| T1b | device ∈ {compromised}; behaviour any of {scan, exfil} | Secure Endpoint | @src | Endpoint detection → Malicious activity observed on the device; telemetry raised | -30 (Malware on device) | — |
| T8 | device ∈ {mgd, stale, mobile, compromised}; behaviour any of {ransom} | Secure Endpoint | @src | Endpoint detection and response → Ransomware behaviour detected; host isolated | -45 (Ransomware behaviour) | CONTAIN |
| T2 | behaviour any of {scan}; path includes {switches, nexus} | Network Analytics | switches / nexus | Network behaviour analytics → Scanning and lateral-movement pattern detected from this host | -25 (Lateral-movement behaviour) | — |
| T5 | behaviour any of {scan}; path includes {industrial} | Cyber Vision | industrial | OT threat detection → Abnormal scanning traffic seen by the sensor in the industrial network | -20 (Lateral-movement behaviour) | — |
| T3 | behaviour any of {scan}; who ∉ {attacker}; device ∉ {server}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Automated containment → Endpoint moved to a quarantine segment by an Adaptive Network Control policy | -15 (Endpoint quarantined) | CONTAIN |
| T4 | behaviour any of {scan}; path includes {sa}; path lacks {switches, industrial, sdwan} | Secure Access | sa | Zero trust access → Only the granted application is reachable; there is no network path to scan | -15 (Lateral-movement behaviour) | BLOCK |
| T6 | behaviour any of {scan, ransom}; path includes {nexus} | Secure Workload | nexus | Microsegmentation → Flow to other workloads denied outside the allowed policy | -10 (Segment boundary hit) | BLOCK |
| T7 | behaviour any of {scan, exfil}; path includes {mcd} | Multicloud Defense | mcd | Cloud east-west and egress control → Lateral-movement or exfiltration traffic blocked at the cloud gateway | -15 (Malicious cloud traffic) | BLOCK |
| T11 | behaviour any of {exfil}; path includes {switches, nexus} | Network Analytics | switches / nexus | Encrypted traffic analytics → Exfiltration pattern identified in encrypted traffic without decryption | -25 (Exfiltration behaviour) | — |
| T12 | behaviour any of {exfil}; path includes {sa} | Secure Access | sa | DNS and internet egress control → Covert channel to the external destination blocked | -15 (Exfiltration behaviour) | BLOCK |
| T13 | behaviour any of {exfil}; who ∉ {attacker}; path includes {fw} | Firewall | fw | Encrypted threat visibility → Malicious encrypted flow identified and blocked without decryption | -15 (Exfiltration behaviour) | BLOCK |
| T14 | behaviour any of {anomaly}; path includes {industrial} | Cyber Vision | industrial | OT behaviour baseline → Communication deviates from the asset’s recorded behaviour | -25 (OT anomaly) | — |
| W9 | destination ∈ {web_safe, web_risky, web_mal}; behaviour any of {anomaly}; path includes {sa} | Secure Access | switches / industrial / sdwan | DNS-layer security → Lookup of an unknown internet host flagged and the connection denied before it is made | -10 (Suspicious destination) | BLOCK |
| T15 | behaviour any of {anomaly}; path includes {switches} | Network Analytics | switches | Behavioural analytics → Device traffic no longer matches its expected behaviour | -20 (IoT anomaly) | — |
| T16 | behaviour any of {anomaly}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Automated containment → Device no longer matches its profile; moved to a quarantine segment by an Adaptive Network Control policy | -20 (Profile mismatch) | CONTAIN |
| E1 | behaviour any of {phish} | Email Threat Defense | @src | Email threat detection → Phishing message identified and remediated from the mailbox after delivery | -5 (Phishing email) | — |
| W2 | destination ∈ {web_mal}; path includes {sa} | Secure Access | sa | Secure internet access → DNS-layer and web security: known malicious destination denied before a connection is made | -20 (Malicious destination) | BLOCK |
| W2p | behaviour any of {phish}; path includes {sa} | Secure Access | sa | Secure internet access → Phishing destination denied by threat policy | -15 (Phishing link clicked) | BLOCK |
| W2f | destination ∈ {saas, shadow, web_safe, web_risky, web_mal, ai, pubai, mail}; behaviour any of {malfile}; path includes {sa} | Secure Access | sa | Secure internet access → Malicious download denied by threat policy | -15 (Malicious download) | BLOCK |
| W3 | destination ∈ {web_mal}; path includes {fw}; path lacks {sa} | Firewall | fw | Egress threat prevention → Outbound connection to a known malicious destination blocked using Talos intelligence | -20 (Malicious destination) | BLOCK |
| W4 | destination ∈ {web_risky}; path includes {sa} | Secure Access | sa | Web category policy → Risky category: session permitted with restrictions | -5 (Risky web category) | ALLOW WITH LIMITS |
| W5 | destination ∈ {shadow}; path includes {sa} | Secure Access | sa | Shadow IT control → Unsanctioned application identified; use restricted | -10 (Unsanctioned application) | ALLOW WITH LIMITS |
| W6 | destination ∈ {shadow, web_safe, web_risky, web_mal, pubai}; behaviour any of {upload}; path includes {sa} | Secure Access | sa | Data movement policy → Sensitive upload to an unapproved destination denied | -15 (Sensitive data upload) | BLOCK |
| W7 | destination ∈ {saas, ai}; behaviour any of {upload}; path includes {sa} | Secure Access | sa | Data movement policy → Upload to a sanctioned application evaluated and logged | -5 (Sensitive data upload) | — |
| W8 | who ∈ {insider}; behaviour any of {upload}; path includes {switches, nexus} | Network Analytics | switches / nexus | Insider-threat analytics → Unusually large data movement by this user detected | -20 (Bulk data movement) | ALLOW WITH LIMITS |
| A1 | destination ∈ {ai}; path includes {sa} | Secure Access | sa | AI access policy → Approved AI application permitted for this user | — | — |
| A2 | destination ∈ {pubai}; path includes {sa} | Secure Access | sa | Shadow AI control → Unapproved AI application denied | -10 (Unapproved AI tool) | BLOCK |
| A3 | destination ∈ {ai, pubai}; behaviour any of {aipaste}; path includes {sa} | Secure Access | sa | AI Access data-loss control → Confidential data detected in the prompt to a third-party AI app; prompt not sent | -15 (Sensitive data in prompt) | BLOCK |
| A4 | destination ∈ {intai}; behaviour any of {aipaste} | AI Defense | @dst | AI data-leakage guardrail → Sensitive content in the prompt flagged and logged | -5 (Sensitive data in prompt) | ALLOW WITH LIMITS |
| A5 | destination ∈ {intai}; behaviour any of {inject} | AI Defense | @dst | AI runtime guardrail → Prompt-injection pattern detected; request rejected | -25 (Prompt injection attempt) | BLOCK |
| A6 | destination ∈ {intai}; behaviour none of {inject, aipaste} | AI Defense | @dst | AI runtime protection → Model interaction covered by runtime guardrails | — | — |
| B1 | path includes {wireless} | Wi-Fi 7 | wireless | Air link → WPA3-protected wireless association | — | — |
| B2 | path includes {client} | Secure Client | client | Device tunnel → Secure Client provides the device-side VPN / zero trust access session | — | — |
| B3 | path includes {sdwan} | Secure Routers · SD-WAN | sdwan | WAN transport → Traffic carried in the encrypted, segmented SD-WAN overlay | — | — |
| B4 | path includes {sa} | Secure Access | sa | User-to-app policy → Session evaluated against identity, device and destination policy at the cloud edge | — | — |
| B5 | who ∉ {attacker}; path includes {fw} | Firewall | fw | Traffic inspection → Flow inspected; encrypted traffic assessed without decryption | — | — |
| B6 | path includes {mcd} | Multicloud Defense | mcd | Cloud gateway → Ingress, egress and east-west policy applied in the cloud network | — | — |
| B7 | path includes {nexus} | Hypershield | nexus | Workload-edge segmentation → Flow checked against segmentation policy on the smart switch | — | — |
| B8 | destination ∈ {dcapp, eastwest, intai}; path includes {nexus} | Secure Workload | nexus | Workload policy → Flow matches the workload’s allowed communication policy | — | — |
| B9 | path includes {industrial} | Cyber Vision | industrial | OT visibility → Asset and its communications inventoried by the embedded sensor | — | — |
| B10 | destination ∈ {mail} | Email Threat Defense | @dst | Mail protection → Messages scanned for threats before they reach the mailbox | — | — |
| O1 | behaviour any of {slow} | ThousandEyes | wireless / switches / sdwan / client / @src | Owned-network path → Access and WAN segments measured from the user’s vantage point: healthy | — | — |
| O2 | behaviour any of {slow}; path includes {sa} | ThousandEyes | sa | Access-flow correlation → Digital experience correlated with the Secure Access session | — | — |
| O3 | behaviour any of {slow} | ThousandEyes | after path | Fault localisation → Degradation located on a network segment the organisation does not own | — | — |
| F1 | device ∈ {mgd, stale, mobile, compromised}; behaviour any of {malfile} | Secure Endpoint | after path | Endpoint file protection → Malicious file blocked and quarantined on the device | -15 (Malicious download) | BLOCK |
| E2 | who ∈ {emp, admin, exec, contractor, insider, attacker}; behaviour any of {phish} | Duo | after path | Phishing-resistant authentication → A captured password cannot be replayed without the phishing-resistant factor | — | — |
| T9 | location ∈ {hq, branch, factory}; behaviour any of {ransom}; device ∉ {server} | ISE | after path | Automated containment → Endpoint moved to a quarantine segment by an Adaptive Network Control policy | -10 (Endpoint quarantined) | CONTAIN |
| T10 | behaviour any of {ransom} | Hypershield | after path | Segment boundary → Stateful segmentation near workloads keeps the outbreak inside one segment | — | — |
| Z1 | always; needs earlier telemetry | XDR | after path | Cross-domain correlation → Telemetry correlated into one prioritised incident with guided response | -5 (Incident opened) | — |
| Z2 | behaviour any of {scan, ransom, exfil}; who ∉ {attacker}; needs earlier telemetry | XDR | after path | Automated response → Containment action triggered to stop lateral movement | — | CONTAIN |
| Z3 | behaviour any of {ransom}; needs earlier telemetry | XDR | after path | Recovery → Affected host can be restored from a last-known-good snapshot | — | — |
| SP1 | always | Splunk Platform | after path | Data platform → Logs and events from the connected Cisco sources are ingested, searchable and retained | — | — |
| SP2 | always | Enterprise Security | after path | SIEM detection → Events correlated and prioritised with risk-based alerting, mapped to MITRE ATT&CK | — | — |
| SP3 | always | Splunk SOAR | after path | Response automation → Playbook automates enrichment, case creation and response tasks for the analyst | — | — |
| SP8 | behaviour any of {scan, ransom, exfil, anomaly}; who ∉ {attacker}; needs a detection from a product that feeds Splunk | Splunk SOAR | after path | Automated response action → Playbook acts on connected Cisco products: quarantine through ISE, host isolation through Secure Endpoint, or a block on the firewall | — | CONTAIN |
| SP4 | behaviour any of {phish, malfile} | Attack Analyzer | after path | Automated threat analysis → Suspected link or file followed through its attack chain to a verdict, using Talos intelligence | — | — |
| SP5 | behaviour any of {slow} | Observability Cloud | after path | Full-stack observability → Application, infrastructure and user-experience telemetry reviewed alongside the ThousandEyes network view | — | — |
| SP6 | destination ∈ {dcapp, cloudapp}; behaviour any of {slow} | AppDynamics | after path | Application-layer view → Application performance combined with network-path data to separate app faults from network faults | — | — |
| SP7 | behaviour any of {slow} | ITSI | after path | Service health → Related alerts grouped into one episode with a service health score for the affected service | — | — |
| O4 | behaviour any of {push} | Security Cloud Control | after path | Policy authoring → Security intent authored in Security Cloud Control for the enforcement points it manages | — | — |
| O5-fw | behaviour any of {push} | Firewall | after path | Policy distribution → Enforcement point receives the policy from Security Cloud Control | — | — |
| O5-mcd | behaviour any of {push} | Multicloud Defense | after path | Policy distribution → Enforcement point receives the policy from Security Cloud Control | — | — |
| O5-hs | behaviour any of {push} | Hypershield | after path | Policy distribution → Enforcement point receives the policy from Security Cloud Control | — | — |
| O5-sa | behaviour any of {push} | Secure Access | after path | Policy distribution → Enforcement point receives the policy from Security Cloud Control | — | — |
| O5-wl | behaviour any of {push} | Secure Workload | after path | Policy distribution → Enforcement point receives the policy from Security Cloud Control | — | — |
| O5-aid | behaviour any of {push} | AI Defense | after path | Policy distribution → Enforcement point receives the policy from Security Cloud Control | — | — |
| O5-sdwan | behaviour any of {push} | Secure Routers · SD-WAN | after path | Policy distribution → Router firewall policy received from Security Cloud Control; SD-WAN overlay policy stays in Catalyst SD-WAN Manager | — | — |

### Invalid combinations (disabled in the UI)

| Picker | When | Rule | Reason shown |
|---|---|---|---|
| device | who ∈ {emp, admin, exec, insider} | only {mgd, stale, mobile, byod, compromised} | Staff use a laptop or mobile device. |
| device | who ∈ {contractor} | only {claptop, byod} | Contractors bring their own equipment. |
| device | who ∈ {guest} | only {byod} | Guests bring an unmanaged personal device. |
| device | who ∈ {iot, ot} | only {headless} | IoT and OT devices are headless. |
| device | who ∈ {aiagent} | only {server} | An AI agent or workload runs on a server. |
| device | who ∈ {attacker} | only {byod} | An external attacker uses a device the organisation does not manage. |
| loc | who ∈ {guest} | only {hq, branch} | Guests connect on site. |
| loc | who ∈ {iot} | only {hq, branch, factory} | IoT devices are installed on site. |
| loc | who ∈ {ot} | only {factory} | OT devices operate on the factory floor. |
| loc | who ∈ {aiagent} | only {hq} | Workloads run in the data center (shown under HQ). |
| loc | who ∈ {attacker} | only {internet, travel} | An external attacker starts outside the organisation. |
| loc | who ∈ {emp, admin, exec, insider, contractor} | not {internet} | For a legitimate remote user choose Home or Public Wi-Fi. |
| dest | who ∈ {attacker} | not {web_safe, web_risky, web_mal, pubai, ai, shadow} | Not a resource the organisation protects from an outside attacker. |
| dest | who ∈ {iot, ot} | not {mail, ai, pubai} | A headless device has no mailbox or AI assistant. |
| dest | who ∈ {aiagent, guest} | not {mail} | This identity has no corporate mailbox. |
| beh | who ∈ {iot, ot, aiagent, guest} | not {mfa_ok, mfa_fail, fatigue, stolen} | No interactive sign-in for this identity. |
| beh | who ∈ {iot, ot, aiagent} | not {phish, malfile} | Needs a human user. |
| beh | destination ∈ {dcapp, cloudapp, saas, shadow, web_safe, web_risky, web_mal, eastwest, ot, mail} | not {aipaste, inject} | Needs an AI destination. |
| beh | destination ∈ {ai, pubai} | not {inject} | Prompt injection is modelled against an AI app the organisation runs; choose the internal AI model. |
| beh | device ∈ {mgd, stale, mobile, byod, claptop, server, compromised} | not {anomaly} | Applies to headless IoT / OT devices. |
| beh | who ∈ {attacker} | not {norm, slow, push, offhours} | Does not apply to an external attacker. |
| beh | who ∈ {iot, ot, aiagent, guest, contractor} | not {push} | Policy is authored by an administrator. |

### Presets

| # | Preset | Pickers | Verdict (illustrative) |
|---|---|---|---|
| 1 | Employee, managed laptop, HQ → private app | emp · mgd · hq · dcapp · [norm] | ALLOW |
| 2 | Same employee, mobile, coffee shop → same app | emp · mobile · public · dcapp · [norm] | ALLOW |
| 3 | Branch user → SaaS over SD-WAN + SSE | emp · mgd · branch · saas · [norm] | ALLOW |
| 4 | Home worker on personal laptop → sanctioned SaaS | emp · byod · home · saas · [norm] | ALLOW WITH LIMITS |
| 5 | Guest on campus Wi-Fi → internet only | guest · byod · hq · web_safe · [norm] | ALLOW WITH LIMITS |
| 6 | Contractor, own laptop → one approved app | contractor · claptop · home · dcapp · [norm] | ALLOW WITH LIMITS |
| 7 | Contractor tries a server outside their scope | contractor · claptop · home · eastwest · [norm] | BLOCK |
| 8 | Vendor remote access to a factory machine | contractor · claptop · home · ot · [mfa_ok] | ALLOW WITH LIMITS |
| 9 | IoT camera joins, is profiled and segmented | iot · headless · hq · eastwest · [norm] | ALLOW WITH LIMITS |
| 10 | IoT device talks to an unknown internet host | iot · headless · hq · web_risky · [anomaly] | CONTAIN |
| 11 | OT controller gets a command from an unexpected source | ot · headless · factory · ot · [anomaly] | CONTAIN |
| 12 | User opens a safe site vs a malicious site | emp · mgd · hq · web_safe · [norm] | ALLOW vs BLOCK |
| 13 | Phishing email → click → credential page | emp · mgd · home · mail · [phish] | BLOCK |
| 14 | Malicious file download | emp · mgd · hq · web_risky · [malfile] | BLOCK |
| 15 | Employee uses the approved AI assistant | emp · mgd · hq · ai · [norm] | ALLOW |
| 16 | Employee uses an unapproved public AI tool | emp · mgd · hq · pubai · [norm] | BLOCK |
| 17 | Employee pastes customer data or code into a prompt | emp · mgd · hq · ai · [aipaste] | BLOCK |
| 18 | Prompt injection against an internal AI app | insider · mgd · hq · intai · [inject] | BLOCK |
| 19 | AI agent requests access beyond its role | aiagent · server · hq · dcapp · [priv] | BLOCK |
| 20 | Stolen password, MFA blocks it | attacker · byod · internet · saas · [mfa_fail, stolen] | BLOCK |
| 21 | MFA fatigue attack | attacker · byod · internet · saas · [fatigue, stolen] | BLOCK |
| 22 | Compromised laptop scans and moves laterally | emp · compromised · hq · eastwest · [scan] | CONTAIN |
| 23 | Ransomware outbreak contained in one segment | emp · compromised · hq · eastwest · [ransom] | CONTAIN |
| 24 | Data exfiltration attempt from a server | aiagent · server · hq · web_risky · [exfil] | CONTAIN |
| 25 | Attack on a public-facing web app / API | attacker · byod · internet · cloudapp · [] | BLOCK |
| 26 | Exploit attempt on an unpatched data center workload | attacker · byod · internet · dcapp · [scan] | BLOCK |
| 27 | Insider downloads large volumes before leaving | insider · mgd · hq · dcapp · [offhours, upload] | ALLOW WITH LIMITS |
| 28 | Impossible-travel login from a new country | emp · mobile · travel · saas · [norm] | STEP-UP |
| 29 | App is slow: locate the fault | emp · mgd · branch · saas · [slow] | ALLOW |
| 30 | Policy authored once, pushed to every enforcement point | admin · mgd · hq · dcapp · [mfa_ok, push] | ALLOW |

## Appendix: expert review answers (11 November 2026)

The answers as received, in the prompt's answer format. They are kept for traceability; the decisions taken are in
"Expert review results" above. In reviewer C's answer, links to internal Cisco systems (SharePoint, SalesConnect) are
replaced with "(internal source)", because they are not public.

<details>
<summary>Reviewer A — Deep Networking Model</summary>

```text
1 | CORRECT | All listed products are current public brands. | Cisco.com
2 | PARTLY | The preferred name is Cisco Security Cloud Control. | Cisco Security Cloud documentation
3 | CORRECT | Secure Equipment Access is integrated into the Cyber Vision portfolio. | Cisco Cyber Vision Data Sheet
4 | CORRECT | AgenticOps is a capability framework; AI Canvas is the operational workspace within Cloud Control. | Cisco AI Canvas announcement
5 | CORRECT | Essentials covers the core SASE/Email stack; Advantage adds the endpoint and policy engine (ISE). | Cisco Security Cloud Packaging
6 | CORRECT | This suite provides the licensing and components for the Hybrid Mesh Firewall architecture. | Cisco Hybrid Mesh Firewall Guide
7 | CORRECT | Essentials focuses on XDR/Email/Endpoint; Advantage adds network-level analytics. | Cisco Security Cloud Packaging
8 | CORRECT | This describes the standard Cisco TrustSec/ISE architecture. | Cisco ISE Deployment Guide
9 | CORRECT | Profiling allows for the assignment of specific SGTs to headless devices. | Cisco ISE Profiling Guide
10 | CORRECT | Guest VLANs/SGTs are typically configured for internet-only access. | Cisco ISE Guest Access Guide
11 | CORRECT | The AnyConnect/Secure Client Posture Module performs the check. | Cisco Secure Client User Guide
12 | CORRECT | This is achieved via Adaptive Network Control (ANC) policies. | Cisco ISE ANC Guide
13 | CORRECT | ETA (Encrypted Traffic Analytics) allows detection without decryption. | Cisco Secure Network Analytics Data Sheet
14 | PARTLY | The Core/Distribution layer or a dedicated Core switch is missing between the access switch and the firewall. | Cisco Campus Design Guide
15 | CORRECT | Cisco Secure Client is the unified agent for Secure Access (ZTNA/VPN). | Cisco Secure Access Documentation
16 | CORRECT | Clientless ZTNA provides browser-based access to specific applications. | Cisco Secure Access Documentation
17 | CORRECT | Granular per-app access policies are a core feature of ZTNA. | Cisco Secure Access Documentation
18 | CORRECT | SD-WAN integrates with Secure Access for cloud-delivered security (SASE). | Cisco SD-WAN / Secure Access Integration Guide
19 | PARTLY | Describe it as a transition: Secure Access is the evolution of Umbrella, incorporating its DNS security into a broader SASE platform. | Cisco Secure Access Overview
20 | CORRECT | This is handled via the Cloud Access Security Broker (CASB) capabilities. | Cisco Secure Access Documentation
21 | CORRECT | DLP and Remote Browser Isolation (RBI) are publicly documented features. | Cisco Secure Access Data Sheet
22 | CORRECT | The feature is "Verified Push." | Duo Security Documentation
23 | CORRECT | Identity Intelligence feeds risk signals to Duo and Secure Access for enforcement. | Cisco Identity Intelligence Documentation
24 | CORRECT | Encrypted Visibility Engine (EVE) utilizes Talos intelligence for analysis. | Cisco Secure Firewall Data Sheet
25 | CORRECT | Hypershield is available on specific Nexus 9000 series switches (e.g., N9300). | Cisco Hypershield Data Sheet
26 | PARTLY | This "virtual patching" is a key feature, currently in early adoption/limited availability. | Cisco Hypershield Documentation
27 | CORRECT | Secure Workload provides agent-based microsegmentation. | Cisco Secure Workload Documentation
28 | CORRECT | It provides consistent security policy across AWS, Azure, and GCP. | Cisco Multicloud Defense Data Sheet
29 | PARTLY | WAAP is typically the entry point, but they are often integrated as a single cloud security edge. | Cisco Multicloud Defense Documentation
30 | PARTLY | It manages the listed security products, but SD-WAN/Router policy is primarily managed via vManage/Cisco Catalyst SD-WAN Manager. | Cisco Security Cloud Control Guide
31 | CORRECT | This provides protection for LLM-based applications. | Cisco AI Defense Documentation
32 | PARTLY | Credit "Secure Access" (via AI Access/CASB) for the edge block; "AI Defense" is for the customer's own built AI apps. | Cisco Secure Access / AI Defense Documentation
33 | CORRECT | Sensors are embedded in Catalyst Industrial switches. | Cisco Cyber Vision Data Sheet
34 | CORRECT | This is the primary value proposition for OT segmentation. | Cisco Cyber Vision Integration Guide
35 | CORRECT | This describes the secure remote access workflow within Cyber Vision. | Cisco Cyber Vision Documentation
36 | CORRECT | Cyber Vision detects the anomaly and triggers ISE via API/pxGrid. | Cisco Cyber Vision / ISE Integration
37 | CORRECT | You missed Cisco Duo and Cisco Umbrella (integrated as part of Secure Access). | Cisco XDR Documentation
38 | CORRECT | Yes, XDR can trigger ISE quarantine via the ISE integration. | Cisco XDR Integration Guide
39 | CORRECT | Host isolation is a standard Secure Endpoint response. | Cisco Secure Endpoint Documentation
40 | CORRECT | This is provided via API integration with mail providers (e.g., O365). | Cisco Email Threat Defense Documentation
41 | INCORRECT | Additional integrations include: XDR (Splunk App for Cisco XDR), Duo (Duo Splunk App), Secure Endpoint (Splunk Add-on for Cisco Secure Endpoint), ISE (Cisco ISE App for Splunk), and Umbrella/Secure Access (Splunk Add-on for Cisco Umbrella). | Splunkbase / Cisco Documentation
42 | CORRECT | Splunk SOAR can execute "actions" via APIs to isolate hosts or block IPs. | Splunk SOAR Cisco Integrations
43 | CORRECT | It allows XDR alerts to be ingested into ES for broader security operations correlation. | Cisco XDR / Splunk ES Integration Guide
44 | CORRECT | Yes, ThousandEyes integrates with Splunk ITSI for service health monitoring. | ThousandEyes / Splunk Integration Guide
45 | PARTLY | Avoid calling it a "score"; call it a "Trust Level" or "Risk Profile" to avoid implying a literal 0-100 number. | Design Best Practices
46 | CORRECT | All scenarios (a-j) are reasonable and credit the correct products based on a Zero Trust model. | Cisco Zero Trust Framework
47 | CORRECT | The assignments are accurate; no critical products are missing from the provided scenarios. | Cisco Security Architecture Guide

Most important fixes
- Infrastructure Hop: Add the Core/Distribution layer to the campus-to-DC path (Item 14).
- AI Distinction: Clearly separate "AI Access" (blocking 3rd party AI via Secure Access) from "AI Defense" (protecting custom-built AI apps) (Item 32).
- Splunk Ecosystem: Expand the Splunk integration list to include XDR, Duo, and Secure Endpoint to accurately reflect the ecosystem (Item 41).
- Trust Score Wording: Change "Trust Score" to "Trust Level" or "Risk Profile" to avoid misleading users about product UI (Item 45).
- Management Scope: Clarify that Security Cloud Control is for security policy, while SD-WAN management remains in the SD-WAN Manager (Item 30).
```

</details>

<details>
<summary>Reviewer B — Secure Networking Agent</summary>

```text
1 | PARTLY | "Hybrid Mesh Firewall" is an architectural concept rather than a standalone product SKU, and routers/switches are typically branded under Catalyst or Meraki (e.g., Catalyst Smart Switches, Catalyst 8000 Edge Platforms). | Cisco Hybrid Mesh Firewall Solution Overview
2 | PARTLY | The preferred current name is Cisco Security Cloud Control, which serves as the unified management plane across the security portfolio. | Cisco Security Cloud Control At-a-Glance
3 | CORRECT | Secure Equipment Access (SEA) is now integrated directly into Cisco Cyber Vision and the IoT Operations Dashboard to provide zero-trust remote access to OT assets. | Cisco Secure Equipment Access Data Sheet
4 | CORRECT | AgenticOps is the operational framework and AI model, while AI Canvas is the collaborative user interface where human operators interact with these AI agents. | Cisco AgenticOps Announcement
5 | CORRECT | Essentials includes Secure Access, Duo, and Email Threat Defense; Advantage adds Secure Endpoint (Advantage tier) and ISE (Premier tier). | Cisco User Protection Suite At-a-Glance
6 | CORRECT | The suite acts as the commercial vehicle for the Hybrid Mesh Firewall architecture, split into Segmentation and Gateway packages that include these products. | Cisco Cloud Protection Suite At-a-Glance
7 | CORRECT | Essentials includes XDR Essentials, Secure Endpoint Advantage, and Email Threat Defense; Advantage adds Secure Network Analytics and Telemetry Broker. | Cisco Breach Protection Suite At-a-Glance
8 | CORRECT | This is the standard Cisco TrustSec and SD-Access architecture for identity-based microsegmentation. | Cisco TrustSec Design Guide
9 | CORRECT | ISE uses profiling policies (DHCP, MAC OUI, CDP/LLDP, etc.) to identify headless devices and dynamically assign them to specific VLANs or Security Group Tags (SGTs). | Cisco ISE Profiling Design Guide
10 | CORRECT | This is the standard guest access design, typically enforced via ISE centralized web authentication (CWA) and WLC/switch ACLs. | Cisco ISE Guest Access Prescriptive Deployment Guide
11 | CORRECT | The Cisco Secure Client (formerly AnyConnect) ISE Posture module performs the endpoint compliance check. | Cisco Secure Client Administrator Guide
12 | CORRECT | This is accomplished using Adaptive Network Control (ANC) policies, often triggered dynamically via pxGrid (Rapid Threat Containment). | Cisco ISE Adaptive Network Control Configuration Guide
13 | CORRECT | Secure Network Analytics uses Encrypted Traffic Analytics (ETA) to detect threats without decryption and integrates with ISE via pxGrid to quarantine offenders. | Cisco Secure Network Analytics Data Sheet
14 | PARTLY | The core/distribution layer (or SD-Access border/control plane nodes) and the Wireless LAN Controller (WLC) are critical missing hops in a typical enterprise architecture. | Cisco Campus LAN and Wireless LAN Design Guide
15 | CORRECT | Cisco Secure Client is the unified agent used for Cisco Secure Access, providing both ZTNA and VPN-as-a-Service capabilities. | Cisco Secure Access Data Sheet
16 | CORRECT | Secure Access supports clientless ZTNA, allowing users on unmanaged devices to access web-based private applications via a browser. | Cisco Secure Access Data Sheet
17 | CORRECT | ZTNA policies in Secure Access allow granular, per-application access control based on identity and context. | Cisco Secure Access Data Sheet
18 | CORRECT | Cisco Catalyst SD-WAN natively integrates with Secure Access (SSE) to build automated IPsec/GRE tunnels for secure internet and SaaS routing. | Cisco Catalyst SD-WAN and Secure Access Integration Guide
19 | PARTLY | Cisco Secure Access is the evolution of Umbrella and includes all its capabilities (DNS security, SWG, CASB); a customer would deploy Secure Access, not both in series. | Cisco Secure Access Data Sheet
20 | CORRECT | Secure Access includes Cloud Access Security Broker (CASB) capabilities to discover, block, or restrict shadow IT and shadow AI applications. | Cisco Secure Access Data Sheet
21 | CORRECT | Secure Access includes Data Loss Prevention (DLP) for uploads/prompts and Remote Browser Isolation (RBI) to safely render risky sites. | Cisco Secure Access Data Sheet
22 | CORRECT | Duo addresses push fatigue using Verified Duo Push, which requires the user to enter a numeric code displayed on the login screen. | Cisco Duo Verified Push Documentation
23 | CORRECT | Identity Intelligence analyzes identity telemetry to detect anomalies (like impossible travel) and integrates with Duo or Secure Access to enforce step-up authentication or blocks. | Cisco Identity Intelligence Solution Overview
24 | CORRECT | The Encrypted Visibility Engine (EVE) in Secure Firewall identifies threats and applications in encrypted traffic without decryption, backed by Talos. | Cisco Secure Firewall Threat Defense Data Sheet
25 | CORRECT | Hypershield is enforced on Nexus 9300 Smart Switches (utilizing Data Processing Units / DPUs) and reached General Availability in August 2024. | Cisco Hypershield Solution Overview
26 | CORRECT | Hypershield uses distributed exploit protection to apply compensating controls (virtual patching) to unpatched workloads, and is generally available. | Cisco Hypershield Solution Overview
27 | CORRECT | Secure Workload (formerly Tetration) enforces zero-trust microsegmentation at the host OS level using software agents. | Cisco Secure Workload Data Sheet
28 | CORRECT | Multicloud Defense (formerly Valtix) provides these capabilities natively across AWS, Azure, and GCP environments. | Cisco Multicloud Defense Data Sheet
29 | PARTLY | While WAAP handles Layer 7 web threats, Multicloud Defense can actually perform both ingress WAAP/WAF functions and network-level firewalling, so they are often the same service. | Cisco Multicloud Defense Solution Overview
30 | PARTLY | Security Cloud Control manages Firewall, Multicloud Defense, and Hypershield, but SD-WAN security policies are managed via Catalyst SD-WAN Manager (vManage), and Secure Access/Workload currently have separate dashboards. | Cisco Security Cloud Control At-a-Glance
31 | CORRECT | Cisco AI Defense provides runtime guardrails, automated red teaming, and inspection APIs to protect AI applications built and hosted by the customer. | Cisco AI Defense Solution Overview
32 | PARTLY | The block for an employee using a third-party SaaS AI assistant is performed by Cisco Secure Access (CASB/DLP), whereas Cisco AI Defense protects AI applications the customer builds and hosts. | Cisco Secure Access Data Sheet
33 | CORRECT | Cyber Vision sensors are embedded as edge compute applications (IOx) directly on Cisco Industrial Ethernet (IE) switches and IR routers. | Cisco Cyber Vision Data Sheet
34 | CORRECT | Cyber Vision integrates with ISE (via pxGrid) and Secure Firewall (via FMC) to provide OT asset context for IT security policies. | Cisco Cyber Vision Solution Overview
35 | CORRECT | Secure Equipment Access (SEA) provides zero-trust, clientless remote access to specific OT assets and is managed through Cyber Vision / IoT Operations Dashboard. | Cisco Secure Equipment Access Data Sheet
36 | CORRECT | Cyber Vision detects behavioral anomalies and can trigger ISE to apply Adaptive Network Control (ANC) policies to restrict the device. | Cisco Cyber Vision and ISE Integration Guide
37 | CORRECT | You missed Cisco Umbrella (or Secure Access), Duo, and third-party integrations (like Microsoft, CrowdStrike, and Splunk). | Cisco XDR Data Sheet
38 | CORRECT | Cisco XDR can trigger host isolation in Secure Endpoint, and it can also trigger an ISE quarantine via built-in response workflows using pxGrid and Adaptive Network Control (ANC). | Cisco XDR Response Playbooks Documentation
39 | CORRECT | Secure Endpoint provides robust host isolation and file quarantine capabilities as part of its EDR feature set. | Cisco Secure Endpoint Data Sheet
40 | CORRECT | Email Threat Defense uses API integration with Microsoft 365 to auto-remediate and pull malicious emails post-delivery. | Cisco Secure Email Threat Defense Data Sheet
41 | INCORRECT | Almost the entire portfolio integrates with Splunk, including Cisco XDR, Duo, Secure Endpoint, ISE, Umbrella/Secure Access, Meraki, and ThousandEyes, each with their own official Splunkbase apps. | Splunkbase (splunkbase.splunk.com)
42 | CORRECT | Splunk SOAR has publicly documented apps that actively change outcomes, such as isolating hosts via Secure Endpoint, blocking IPs on Secure Firewall, or quarantining via ISE. | Splunk SOAR Apps Directory
43 | CORRECT | Cisco XDR integrates with Splunk Enterprise Security to bi-directionally share incidents and telemetry, allowing analysts to pivot between platforms and trigger XDR response actions directly from Splunk. | Cisco XDR and Splunk Integration Guide
44 | CORRECT | ThousandEyes integrates with Splunk IT Service Intelligence (ITSI) to correlate network performance metrics with broader IT service health and business KPIs. | ThousandEyes App for Splunk Documentation
45 | PARTLY | While a 0-100 score is a good conceptual teaching device, Cisco products use discrete states (e.g., Compliant/Non-Compliant in ISE, Risk Levels in Duo); describe it as "continuous trust evaluation" rather than a numerical score. | Cisco Zero Trust Architecture Guide
46 | CORRECT | The verdicts and credited products accurately reflect Cisco's Zero Trust and threat defense architectures across all scenarios. | Cisco Zero Trust Architecture Guide
47 | PARTLY | The scenarios are highly accurate, but Umbrella (or Secure Access SIA) is missing from scenario 'i' (IoT camera), as DNS-layer security is typically the first to block malicious outbound C2 traffic. | Cisco Secure Access Data Sheet

Most important fixes
1. Clarify Secure Access vs. Umbrella (Item 19): Do not model them in series. Secure Access is the SSE evolution of Umbrella and includes all of its DNS, SWG, and CASB capabilities. A customer deploys Secure Access as the single unified edge.
2. Correct the AI Defense vs. Secure Access AI capabilities (Item 32): Ensure the model clearly distinguishes between protecting employees using 3rd-party AI (handled by Secure Access CASB/DLP) and protecting AI applications the customer builds (handled by Cisco AI Defense).
3. Expand the Splunk integration scope (Items 41 & 42): Update the model to reflect that nearly the entire Cisco security portfolio feeds into Splunk, and crucially, Splunk SOAR does change outcomes by actively triggering response actions (quarantine, isolate, block) across Cisco infrastructure.
4. Adjust the Security Cloud Control management scope (Item 30): While Security Cloud Control is the unified vision, SD-WAN security policies still rely on Catalyst SD-WAN Manager (vManage), and Secure Access/Workload currently utilize their own dashboards. Avoid implying a single pane of glass for everything just yet.
```

</details>

<details>
<summary>Reviewer C — RAG model (answer ends at item 33)</summary>

Sources it cited: [1] Cisco Live 2025 San Diego Showcase Demo Guide
(https://www.ciscolive.com/c/dam/r/ciscolive/global-event/docs/2025/Cisco-Live-2025-San-Diego-Showcase-Demo-Guide.pdf);
[2] Cisco Secure Firewall At-a-Glance
(https://www.cisco.com/c/en/us/products/collateral/security/firesight-management-center/secure-firewall-aag.html);
[3], [5] (internal source); [6] Cisco Tech Day Orange County, "Trust by design: Cisco security vision for tomorrow"
(https://www.cisco.com/c/dam/en_us/abm/cisco-tech-day-orange-county/oc-tech-day-trust-by-design-cisco-security-vision-for-tomorrow.pdf);
[8] Cisco Partner event, Hybrid Mesh Firewall (https://www.cisco.com/c/dam/m/digital/apj/FY25/178284/CPAE25_Day_2_Hybrid_Mesh_Firewall.pdf);
[9] TECSEC-2002 "Architecting Security for a Zero Trust Future" (internal source).

```text
1 | CORRECT | Current public names include Cisco Secure Routers, Smart Switches, Secure Firewall, Hybrid Mesh Firewall, Secure Access, Identity Intelligence, XDR, AI Defense, and Hypershield [1], [3]. | [1]
2 | PARTLY | The preferred current name is Cisco Security Cloud Control [1], [3]. | [1]
3 | CANNOT CONFIRM | Publicly available documents do not explicitly state that Secure Equipment Access is now part of Cyber Vision. | N/A
4 | CORRECT | AI Canvas is described as the AgenticOps platform and a shared workspace [6]. | [6]
5 | CORRECT | User Protection Suite Essentials includes Secure Access, Duo, and Email Threat Defense; Advantage adds Secure Endpoint and ISE [5]. | [5]
6 | CORRECT | Cloud Protection Suite Essentials packages Secure Workload, Hypershield, Secure Firewall (virtual), and Multicloud Defense, managed by Security Cloud Control [5], [8]. | [5]
7 | CANNOT CONFIRM | The provided documents do not detail the specific contents of the Breach Protection Suite Essentials vs Advantage tiers. | N/A
8 | CORRECT | ISE handles authentication (802.1X/MAB) and assigns security group tags (SGT) for enforcement by switches and wireless [6], [9]. | [6]
9 | CORRECT | ISE provides identity visibility and protection for IoT/Things to enable zero trust access [5], [6]. | [6]
10 | CORRECT | This is a standard outcome of ISE-driven segmentation and ZTNA policies [6]. | [6]
11 | CORRECT | Posture checks are performed by the Cisco Secure Client [9]. | [9]
12 | CORRECT | This is achieved through the use of Security Group Tags (SGT) and Change of Authorization (CoA) [6]. | [6]
13 | CORRECT | Secure Network Analytics uses flow telemetry to detect threats and integrates with ISE for response [1], [9]. | [1]
14 | PARTLY | The conceptual path is missing the Identity/Policy Decision Point (e.g., ISE or Security Cloud Control) that determines the access level before the firewall/fabric [6]. | [6]
15 | CORRECT | Cisco Secure Client is the agent used to connect to Secure Access for ZTNA or VPN services [3], [9]. | [3]
16 | CORRECT | Secure Access supports clientless (browser-based) access for unmanaged devices [3]. | [3]
17 | CORRECT | Secure Access enables granular, application-level access control [3]. | [3]
18 | CORRECT | Branch users can be routed through SD-WAN to the Secure Access SASE edge [3]. | [3]
19 | PARTLY | Secure Access is the converged SASE solution that incorporates the DNS-layer security previously associated with Umbrella [3]. | [3]
20 | CORRECT | Secure Access provides discovery and blocking of shadow AI and unsanctioned SaaS [3], [5]. | [3]
21 | CORRECT | Secure Access includes DLP for Generative AI and remote browser isolation for risky sites [3]. | [3]
22 | CORRECT | Duo uses "Verified Push" to address MFA fatigue/push-bombing [1]. | [1]
23 | CORRECT | Identity Intelligence detects risky sign-ins (e.g., impossible travel) and integrates with Duo/Secure Access for enforcement [1], [6]. | [1]
24 | CORRECT | Secure Firewall uses the Encrypted Visibility Engine (EVE) and Talos intelligence to identify threats in encrypted traffic [2], [3]. | [2]
25 | CORRECT | Hypershield is enforced on Nexus N9300 Smart Switches [3]. | [3]
26 | CORRECT | Hypershield provides "Live Protect" to apply compensating eBPF-based shields for CVE mitigation without downtime [6]. | [6]
27 | CORRECT | Secure Workload provides agent-based microsegmentation to enforce allowed flows [3], [8]. | [3]
28 | CORRECT | Multicloud Defense provides ingress, egress, and east-west protection in public clouds [3]. | [3]
29 | PARTLY | While conceptually fair, Multicloud Defense itself provides WAF capabilities, so a separate WAAP may be redundant depending on the specific requirement [3]. | [3]
30 | PARTLY | Security Cloud Control manages Secure Firewall, Multicloud Defense, Hypershield, Secure Access, Secure Workload, and AI Defense [6]; it also manages Secure Routers [3]. | [6]
31 | CORRECT | AI Defense provides runtime guardrails against prompt injection and data leakage for custom AI apps [3]. | [3]
32 | PARTLY | This is credited to Secure Access "AI Access" for third-party AI apps, whereas AI Defense is for AI applications the customer builds [3]. | [3]
33 | CORRECT | Cyber Vision
```

</details>

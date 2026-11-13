# Living Network — conceptual architecture explainer

A standalone, interactive 3D explainer of how Cisco networking and security products work together: how **data** moves,
where **identity** is verified, where **policy** is authored, distributed and enforced, how **threats** are detected and
stopped, and how **trust** is re-evaluated through a session.

Independent educational visualization. Not an official Cisco product. Product names are trademarks of Cisco Systems, Inc.
No Cisco or Splunk logos, icons or artwork are used. Content verified against cisco.com and splunk.com on 10 November 2026,
and checked against the Cisco Validated Designs on 12 November 2026 (see "Cisco Validated Design check" below and
[`CVD-REVIEW.md`](CVD-REVIEW.md)). Presets 31 to 37 follow Cisco Talos reports read on the same day (see "Attacker
presets from 2026 threat reporting").

## Run it

Open `index.html` (double-click from disk, internet on). No build step and no backend. Styles are in `styles.css`. Scripts are plain files in `js/`, loaded in order from `index.html`, so the page still opens from disk. `js/data.js` holds everything the page shows, except the industry use cases, which are in the generated `js/portfolio.js`.
The only external requests are Three.js 0.170.0 and its OrbitControls from jsDelivr. If WebGL or the CDN is unavailable
the page renders a 2D SVG map of the same data (force it with `index.html?render=svg`).

**File to host elsewhere:** `dist/index.html` is the same page as one file, with the stylesheet and the scripts inside it.
The script is obfuscated, so a view-source of the hosted file is not the readable source. That is not secrecy: the browser
has to run it, and a determined reader can still recover the text from the running page. Three.js still comes from
jsDelivr; without that network the file shows the 2D map. Regenerate it from this folder with `npm install` and
`npm run build` after changing `index.html`, `styles.css` or `js/`. The source files stay the ones to edit.

Five modes: **Presets**, **Build your own**, **Free explore**, **Topology** and **Industries**. Topology isolates one architecture
(SASE, Zero Trust Access, Hybrid Mesh Firewall, secure campus, data center, industrial, detection and response, AI, or
one of the three suites), lays its building blocks out as a diagram and numbers each relationship stated on cisco.com,
with the source link beside it, and lists the Cisco Validated Designs and design references that cover it. The architecture
list is `DATA.architectures`. Product panels and decision-timeline steps also link the Cisco Validated Design ("CVD") or
reference ("Ref") that backs them.

**Industries** lists the 105 use cases of Cisco's Industries Portfolio Explorer under six industries (Government,
Healthcare, Manufacturing, Retail, Financial services, Education). Opening a use case keeps the products Cisco lists for
it solid, fades the rest of the scene and draws in white the relationships already stated between those products. The
panel shows Cisco's description, drivers, capabilities, benefits and "Why Cisco" text, the listed products that are in
the scene, the listed products that are not, and the Cisco services. Every use case carries a **Try it** block: related
presets, a prefilled builder scenario and the closest architecture in Topology. The use case then stays above the result
as "Industry context" until another preset or architecture is picked. The links run the other way too: a run lists the
use cases linked to its preset and the three whose product lists cover most of the run, the preset library can be
narrowed to one industry, and each product panel says how many use cases name the product. See "Industry use cases" below.

**Playback**: choosing a preset (or changing the builder) sets the scenario up and waits; press Play (`Space`), which
pulses until then. The **Auto** button in the playback bar starts each scenario as soon as it is chosen; it is off by
default and remembered between visits.

Each product is a small generic 3D model of its kind, built from simple shapes in the `MODEL` table: an access point
puck on a mast for Wi-Fi, stacked switches with port rows, a router with antennas, a spine chassis for Nexus, a chip for
Silicon One, laptops for Secure Client and Secure Endpoint, a phone for Duo, an envelope for Email Threat Defense, a
radar dish for XDR, a bar chart for Network Analytics, a cloud with a gate for Secure Access, and so on. They are
recognisable shapes, not Cisco hardware or artwork. The suites and the Splunk products keep their abstract shapes.
Past the slabs, a faint grid marks the edge of the diagram, and a short red tint sits under Open internet.

Human actors (employee, admin, executive, contractor, guest, insider, external attacker) are walking 3D figures with
their name and live trust level above them; the attacker is a red hooded figure on a dashed path. The figure's clothes
follow the scenario (a doctor, teacher, student, plant worker, or an employee drawn as a man or a woman); the identity
used for the verdict does not. The 0–100 trust
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
bar, legend and the checkpoint and verdict captions stay. Two tabs on the scene's edges, **Scenario** (left, `[`) and
**Result** (right, `]`), bring each side panel back or hide it again, independently; selecting a product opens the
result panel. On phones the tabs open the panels as bottom sheets. In viewers that block browser full screen the layout still
expands to the whole window.

**Guided tour** (header button **Tour**, or `T`; offered once on a first visit): twelve steps that spotlight each part
of the tool and drive it as they go — the scene, presets, playback, lenses, the result panel, removing controls, the
builder, camera views, topology, industries, the header switches, and share/export. Steps live in `DATA.tour`.

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

**3rd person is the default view.** The view you pick is remembered between visits, and a shared link opens in the
view it was copied in. Three camera views, switched from the playback bar or with `V`: **Overview** (orbit, zoom, pan), **3rd person** (camera
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

Everything shown lives in the `DATA` object in `js/data.js`: products, relationships, picker options,
invalid-combination rules, path rules, checkpoint rules, verdict text, suggestions and presets. A new scenario is a data
edit. The tables below were generated from that object.

The industry use cases are the exception. `js/portfolio.js` is generated: edit `portfolio-map.mjs` (name aliases and the
links from use cases to scenarios) or replace `../data/cisco-industries-portfolio.json`, then run `npm run portfolio`.
The generator stops if an alias names a product id that is not in `DATA.products`, a linked preset or architecture does
not exist, a builder scenario is not valid as written, a use case has no preset, or one of presets 38 to 99 does not match
the builder scenario linked to it. `npm run portfolio -- --report` also prints the listed names
that are not in the scene and, for each link, how many of the scenario's products the use case lists.

`DATA.cvd` lists the Cisco Validated Designs and design references (title, URL, the "Updated" date printed on the page,
and whether it is Cisco Validated or a reference). Products, architectures and checkpoint rules name them in a `cvd` field,
and a relationship can use a `cvd` key as its source. In a checkpoint rule, `also` credits a second product and `needs`
lists the products the action is carried out through, so removing one of them with "Without these controls" skips the rule.
A third kind, `threat`, marks a Cisco Talos report; its date is the publication date and the link is labelled "Threat report".

A checkpoint rule names a product action only where a Cisco, Duo or Talos page states it. A rule without such a page
carries "(illustrative)" at the end of its checkpoint name, which is what the timeline shows, and is listed under
"Not verified" below.

A preset may carry `off`, a list of product ids removed when it loads, as if they had been tapped under "Without these
controls". Preset 33 uses it to replay a ransomware case with Secure Endpoint disabled.

## How verdicts are produced

1. A path is chosen from the picker state (access rule + route rule).
2. Every checkpoint rule that matches fires in path order, changing the trust level (starts at 50 plus actor, device and
   location adjustments).
3. The verdict is the most severe one argued for by a fired rule. Outcomes are a *typical zero-trust policy outcome*, not
   guaranteed product behaviour; the page says so beside every verdict.
4. "Without these controls" removes the rules of one or more products (or a whole suite) and replays, to show the gap.
   It is labelled illustrative.

## Industry use cases

Source: Cisco's Industries Portfolio Explorer (https://www.cisco.com/c/m/en_us/solutions/industries/portfolio-explorer.html),
the six data files behind it, collected 13 November 2026 and kept in `../data/cisco-industries-portfolio.json`. The use
case text and the product and service lists are Cisco's. Everything that ties a use case to this scene is this tool's
own work and is labelled that way on the page.

- **What the portfolio is.** 105 use cases: Government 18, Healthcare 16, Manufacturing 17, Retail 18, Financial
  services 17, Education 19. Each has a description, text blocks, a list of product names and a list of services. It has
  no actors, behaviours or outcomes, so it cannot drive a verdict and no rule was changed for it.
- **Two shapes.** 90 use cases have Industry drivers, Capabilities, Benefits and Differentiators ("Why Cisco"); 15 have
  Industry drivers, Business needs, Capabilities and Business outcomes. The generator reads blocks by title, so each
  use case shows the blocks it has.
- **Product names.** `portfolio-map.mjs` maps Cisco's names onto the 40 products in the scene by pattern. 34 of the 40
  are named by at least one use case; Silicon One, WAAP, Attack Analyzer and the three suites are named by none. Every
  use case maps to at least one scene product. Names with no counterpart are listed as "Also listed by Cisco, not in
  this scene" (143 distinct names, led by Catalyst Center in 54 use cases, Intersight in 36 and the Webex suite in 35).
  Old names with a successor in the scene count as the successor: Umbrella as Secure Access, Defense Orchestrator as
  Security Cloud Control, AnyConnect as Secure Client. Five government use cases list product families ("Branch
  routers", "Cloud edge") instead of products; those rows are never mapped.
- **Cleaning.** HTML tags, zero-width and vertical-tab characters and a "PRODUCTS TABLE #2" scrape artefact are
  removed, and spelling variants of one name are merged. The image fields, success stories, partnerships, promotions
  and design-guide links in the source are not used: the images are file-name suffixes with no address, and the other
  sections are empty or one generic sentence.
- **Relationships.** The white lines and the numbered list in a use case are the relationships already in
  `DATA.links`, from cisco.com and splunk.com product pages. Cisco's use case page lists products; it does not state
  those links.
- **Not an architecture.** A use case view is "products Cisco lists for this use case", placed where the scene already
  has them. It is not a Cisco reference design.
- **Size.** `js/portfolio.js` is 298 KB. The share build is 1,042 KB.

### Links from use cases to scenarios

Chosen by hand in `portfolio-map.mjs`, not taken from Cisco. A link means "this scenario illustrates something the
use case is about"; it does not mean the verdict is what Cisco promises for the use case. All 105 use cases are linked:
Government 18, Healthcare 16, Manufacturing 17, Retail 18, Financial services 17, Education 19. Presets 1 to 37 were already
in the library. Presets 38 to 99 were added for the use cases those did not illustrate. Each is the closest scenario the
existing pickers can play (a camera, a hologram or a contact centre is shown as a sensor, an AI assistant or a remote
worker), and no new verdict rule was added for them.

| Code | Industry | Use case | Presets | Builder scenario | Topology |
|---|---|---|---|---|---|
| CIT6C | Government | AI-powered resident services | 15, 18 | insider · mgd · hq · intai · [inject] | Securing AI use |
| CIT4H | Government | Application modernization | 26, 29 | emp · mgd · branch · saas · [slow] | Splunk and Cisco Observability |
| CIT4I | Government | Secure networking for government | 1, 5, 9 | emp · mgd · hq · dcapp · [norm] | Secure campus and branch |
| CIT4J | Government | Network modernization | 3, 29, 30 | emp · mgd · branch · saas · [slow] | Secure campus and branch |
| CIT4K | Government | Secure government hybrid clouds | 3, 26 | emp · mgd · branch · cloudapp · [norm] | SASE: network and security edge |
| CIT2I | Government | Mobile operations | 2, 28 | emp · mobile · public · dcapp · [norm] | Zero Trust Access |
| CIT7A | Government | Secure industrial control systems | 11, 35, 8 | ot · headless · factory · ot · [anomaly] | Industrial (OT) security |
| CIT7D | Government | Security for government zero trust | 1, 2, 4, 20, 28 | emp · byod · home · saas · [norm] | Zero Trust Access |
| CIT7E | Government | Threat detection and incident response | 22, 23, 33 | emp · compromised · hq · eastwest · [scan] | Detection and response |
| HEA1E | Healthcare | Telehealth and virtual care | 4, 29 | emp · mgd · home · saas · [slow] | SASE: network and security edge |
| HEA4C | Healthcare | Hybrid cloud and AI infrastructure | 19, 26, 36 | aiagent · server · hq · intai · [agentic] | Data center and cloud |
| HEA2D | Healthcare | Medical device integration | 9, 10 | iot · headless · hq · eastwest · [norm] | Secure campus and branch |
| HEA3B | Healthcare | Healthcare threat defense and response | 13, 22, 23, 33 | emp · compromised · hq · eastwest · [ransom] | Detection and response |
| HEA3D | Healthcare | Patient privacy and compliance | 7, 17, 27 | insider · mgd · hq · dcapp · [offhours, upload] | Zero Trust Access |
| HEA4F | Healthcare | Secure networking for healthcare | 1, 5, 9 | iot · headless · hq · eastwest · [norm] | Secure campus and branch |
| HEA4B | Healthcare | Hybrid workforce | 2, 4, 28 | emp · byod · home · saas · [norm] | Zero Trust Access |
| HEA4E | Healthcare | Unified branch for healthcare | 3, 29 | emp · mgd · branch · saas · [norm] | SASE: network and security edge |
| MAN6A | Manufacturing | Agentic operations | 19, 29, 36 | aiagent · server · hq · dcapp · [priv] | Securing AI use |
| MAN1A | Manufacturing | Industrial automation and process optimization | 11 | ot · headless · factory · ot · [norm] | Industrial (OT) security |
| MAN1D | Manufacturing | Asset visibility and control | 9, 11 | ot · headless · factory · ot · [norm] | Industrial (OT) security |
| MAN3D | Manufacturing | Operational technology security operations | 11, 35 | ot · headless · factory · ot · [anomaly] | Industrial (OT) security |
| MAN1E | Manufacturing | Secure remote access | 8, 37 | contractor · claptop · home · ot · [mfa_ok] | Industrial (OT) security |
| RET1G | Retail | Safety and surveillance | 9, 10 | iot · headless · hq · web_risky · [anomaly] | Secure campus and branch |
| RET3C | Retail | AI-infrastructure and hybrid cloud | 19, 26, 36 | aiagent · server · hq · intai · [agentic] | Data center and cloud |
| RET1A | Retail | Secure connectivity and optimization | 2, 3, 29 | emp · mgd · branch · saas · [slow] | SASE: network and security edge |
| RET4A | Retail | Secure networking for retail | 3, 5, 9 | guest · byod · hq · web_safe · [norm] | Secure campus and branch |
| RET4D | Retail | Unified branch for retail | 3, 29 | emp · mgd · branch · saas · [norm] | SASE: network and security edge |
| FIN1F | Financial services | Unified branch for financial services | 3, 29 | emp · mgd · branch · saas · [norm] | SASE: network and security edge |
| FIN1G | Financial services | Digital worker connectivity | 2, 4, 28 | emp · byod · home · saas · [norm] | Zero Trust Access |
| FIN2F | Financial services | Secure networking for financial services | 1, 22, 23 | emp · compromised · hq · eastwest · [scan] | Secure campus and branch |
| FIN3B | Financial services | AI governance and risk management | 15, 16, 17, 18, 36 | emp · mgd · hq · ai · [aipaste] | Securing AI use |
| FIN3E | Financial services | Fraud and financial crime | 20, 21, 31 | attacker · byod · internet · saas · [stolen, aitm] | Zero Trust Access |
| FIN4G | Financial services | Sovereign, hybrid, and multicloud strategy | 25, 26, 34 | attacker · byod · internet · dcapp · [exploit] | Data center and cloud |
| FIN4J | Financial services | Open banking and payments | 25, 34 | attacker · byod · internet · cloudapp · [] | Data center and cloud |
| FIN4F | Financial services | Financial experiences and assurance | 29 | emp · mgd · branch · saas · [slow] | Splunk and Cisco Observability |
| FIN4N | Financial services | Deepfake detection and anchor of trust | 21, 31, 32 | attacker · byod · internet · saas · [fatigue, stolen] | Zero Trust Access |
| EDU3D | Education | AI-driven student experiences | 15, 16 | emp · mgd · hq · pubai · [norm] | Securing AI use |
| EDU1A | Education | Campus network and wireless | 1, 5, 9 | guest · byod · hq · web_safe · [norm] | Secure campus and branch |
| EDU4A | Education | Network, endpoint, and web security | 12, 13, 14 | emp · mgd · hq · web_risky · [malfile] | SASE: network and security edge |
| EDU4B | Education | Identity and access control | 1, 4, 5, 20, 28 | emp · byod · home · saas · [norm] | Zero Trust Access |
| EDU5C | Education | Application security | 12, 14, 22 | emp · mgd · hq · web_risky · [malfile] | Hybrid Mesh Firewall |
| EDU5D | Education | Infrastructure automation and assurance | 29, 30 | admin · mgd · hq · dcapp · [mfa_ok, push] | Secure campus and branch |
| EDU5F | Education | Secure data and intellectual property | 17, 24, 27 | insider · mgd · hq · dcapp · [offhours, upload] | Zero Trust Access |
| CIT1D | Government | Agency collaboration | 38 | emp · mgd · home · saas · [mfa_ok] | Zero Trust Access |
| CIT6B | Government | Community broadband | 39 | iot · headless · branch · eastwest · [anomaly] | Secure campus and branch |
| CIT4G | Government | Transportation infrastructure | 40 | emp · mobile · public · dcapp · [mfa_ok] | Zero Trust Access |
| CIT1E | Government | Enterprise solution delivery | 41 | emp · mgd · branch · cloudapp · [slow] | Splunk and Cisco Observability |
| CIT4F | Government | Critical infrastructure planning and resiliency | 42 | emp · mgd · hq · eastwest · [norm] | Secure campus and branch |
| CIT2G | Government | Connected justice | 43 | exec · mgd · home · saas · [mfa_ok] | Zero Trust Access |
| CIT2H | Government | Public safety and emergency response | 44 | emp · mobile · public · saas · [mfa_ok] | Zero Trust Access |
| CIT2F | Government | Operations centers | 45 | admin · mgd · hq · eastwest · [norm] | Secure campus and branch |
| CIT7B | Government | Trusted Internet connections | 46 | emp · mgd · branch · web_safe · [norm] | SASE: network and security edge |
| HEA1C | Healthcare | Patient engagement and digital front door | 47 | emp · mgd · hq · saas · [slow] | Splunk and Cisco Observability |
| HEA1F | Healthcare | Remote patient room monitoring | 48 | iot · headless · hq · eastwest · [anomaly] | Secure campus and branch |
| HEA1B | Healthcare | Mobile digital experiences and wayfinding | 49 | emp · mobile · branch · dcapp · [mfa_ok] | Zero Trust Access |
| HEA2C | Healthcare | Clinical communications and collaboration | 50 | emp · mobile · home · saas · [mfa_ok] | Zero Trust Access |
| HEA2B | Healthcare | Digital experiences and wayfinding | 51 | iot · headless · hq · cloudapp · [norm] | Secure campus and branch |
| HEA3A | Healthcare | Claims automation and anomaly detection | 52 | emp · mgd · hq · intai · [aipaste] | Securing AI use |
| HEA3C | Healthcare | Care environment safety and security | 53 | iot · headless · branch · web_risky · [anomaly] | Secure campus and branch |
| HEA4A | Healthcare | Smart and sustainable hospitals | 54 | iot · headless · branch · eastwest · [norm] | Secure campus and branch |
| MAN1G | Manufacturing | AI-assisted design and digital twin | 55 | aiagent · server · hq · cloudapp · [norm] | Data center and cloud |
| MAN3E | Manufacturing | Machine vision | 56 | iot · headless · factory · eastwest · [anomaly] | Industrial (OT) security |
| MAN1H | Manufacturing | Predictive maintenance | 57 | emp · mgd · factory · eastwest · [slow] | Industrial (OT) security |
| MAN3F | Manufacturing | Quality inspection and anomaly detection | 58 | iot · headless · factory · ot · [anomaly] | Industrial (OT) security |
| MAN5A | Manufacturing | Advanced warehouse operations | 59 | ot · headless · factory · eastwest · [anomaly] | Industrial (OT) security |
| MAN5C | Manufacturing | Industrial mobility | 60 | iot · headless · factory · eastwest · [norm] | Industrial (OT) security |
| MAN2A | Manufacturing | Software-defined automation | 61 | ot · headless · factory · eastwest · [norm] | Industrial (OT) security |
| MAN1F | Manufacturing | Energy control and fault-managed power | 62 | iot · headless · factory · dcapp · [anomaly] | Industrial (OT) security |
| MAN5B | Manufacturing | Inventory management | 63 | iot · headless · factory · cloudapp · [norm] | Industrial (OT) security |
| MAN1C | Manufacturing | Data collection and management | 64 | iot · headless · factory · web_risky · [anomaly] | Industrial (OT) security |
| MAN2F | Manufacturing | Worker upskilling | 65 | emp · mgd · home · dcapp · [mfa_ok] | Zero Trust Access |
| MAN2D | Manufacturing | Workforce augmentation | 66 | iot · headless · factory · saas · [anomaly] | Industrial (OT) security |
| RET1B | Retail | Loss prevention and fraud detection | 67 | insider · mgd · branch · dcapp · [offhours, upload] | Zero Trust Access |
| RET1E | Retail | Omnichannel operational visibility | 68 | emp · mgd · home · cloudapp · [slow] | Splunk and Cisco Observability |
| RET1I | Retail | Supply chain visibility | 69 | emp · mgd · branch · eastwest · [slow] | SASE: network and security edge |
| RET2C | Retail | Associate engagement and productivity | 70 | exec · mobile · public · dcapp · [mfa_ok] | Zero Trust Access |
| RET2G | Retail | Digital merchandising | 71 | insider · mgd · hq · intai · [aipaste] | Securing AI use |
| RET2F | Retail | Hologram store associate | 72 | emp · mgd · home · ai · [norm] | Securing AI use |
| RET3D | Retail | Intelligent contact center and chatbots | 73 | emp · mgd · branch · ai · [norm] | Securing AI use |
| RET3A | Retail | Mobile engagement | 74 | emp · mobile · home · dcapp · [mfa_ok] | Zero Trust Access |
| RET4C | Retail | Demand forecasting | 75 | emp · mobile · branch · cloudapp · [slow] | Splunk and Cisco Observability |
| RET4E | Retail | Drive-thru optimization | 76 | emp · mgd · public · saas · [slow] | Splunk and Cisco Observability |
| RET5A | Retail | Intelligent fulfillment | 77 | admin · mgd · branch · cloudapp · [slow] | Splunk and Cisco Observability |
| RET5B | Retail | Inventory management | 78 | emp · mgd · branch · dcapp · [slow] | SASE: network and security edge |
| RET5C | Retail | Wireless and video analytics | 79 | iot · headless · branch · dcapp · [anomaly] | Secure campus and branch |
| FIN1E | Financial services | Digital engagement and contact center | 80 | emp · mobile · home · ai · [norm] | Securing AI use |
| FIN2E | Financial services | Virtual and collaboration workflows | 81 | emp · mgd · public · saas · [mfa_ok] | Zero Trust Access |
| FIN2G | Financial services | Branch analytics | 82 | emp · mgd · home · saas · [slow] | Splunk and Cisco Observability |
| FIN3D | Financial services | Unified financial operations | 83 | admin · mgd · hq · cloudapp · [mfa_ok, push] | Data center and cloud |
| FIN3C | Financial services | Secure communications compliance | 84 | emp · byod · home · dcapp · [mfa_ok] | Zero Trust Access |
| FIN4K | Financial services | Algorithmic trading automation | 85 | emp · mgd · hq · cloudapp · [slow] | Splunk and Cisco Observability |
| FIN4L | Financial services | Legacy infrastructure and application modernization | 86 | emp · stale · hq · cloudapp · [norm] | Data center and cloud |
| FIN4M | Financial services | Claims, underwriting, and document processing | 87 | emp · mgd · branch · intai · [aipaste] | Securing AI use |
| EDU3A | Education | Teaching, learning, and faculty collaboration | 88 | emp · mgd · home · cloudapp · [mfa_ok] | Zero Trust Access |
| EDU3F | Education | Esports and entertainment | 89 | emp · mobile · hq · cloudapp · [norm] | Data center and cloud |
| EDU1D | Education | Personalized residential experiences | 90 | iot · headless · hq · saas · [norm] | Secure campus and branch |
| EDU3C | Education | Hybrid teaching and professional development | 91 | emp · stale · home · saas · [mfa_ok] | Zero Trust Access |
| EDU2B | Education | Communications | 92 | admin · mgd · home · saas · [mfa_ok] | Zero Trust Access |
| EDU2E | Education | Administrative efficiency | 93 | emp · mgd · public · dcapp · [mfa_ok] | Zero Trust Access |
| EDU1E | Education | Community broadband and equitable access | 94 | iot · headless · branch · web_safe · [norm] | Secure campus and branch |
| EDU1C | Education | Smart and sustainable buildings | 95 | iot · headless · hq · dcapp · [norm] | Secure campus and branch |
| EDU2A | Education | Hybrid cloud management | 96 | emp · mgd · public · cloudapp · [slow] | Splunk and Cisco Observability |
| EDU4C | Education | Physical safety | 97 | iot · headless · hq · web_safe · [anomaly] | Secure campus and branch |
| EDU5A | Education | Remote research and collaboration | 98 | emp · mobile · home · cloudapp · [mfa_ok] | Zero Trust Access |
| EDU5B | Education | Research and academic computing | 99 | aiagent · server · hq · intai · [norm] | Data center and cloud |

## Not verified, so left out or hedged

- **AgenticOps** has no standalone page that could be found on cisco.com (the guessed URL returned 404). The node uses the
  Cisco AI Canvas page ("the workspace for AgenticOps") as its source and says so in its panel. It takes part in no verdict.
  The Cisco Secure Networking Architecture CVD names the layer "Unified Management and Agentic Operations" (Cisco Cloud
  Control, AI Canvas, AI Assistant, Deep Network Model); the panel now cites it.
- **Secure Equipment Access**: its page states only that it "is now part of Cisco Cyber Vision". The node is kept, labelled
  that way, and its remote-access behaviour is taken from the Cyber Vision data sheet: least privilege with MFA or SSO,
  time schedules, permitted protocols and a posture check. Approval workflows and session recording are not stated on
  either page. The Industrial Security 3.1 Design Guide, read on 12 November 2026, documents the approval step ("Request
  Access" groups approved by an access manager), so rule S3 names it. Session recording appears there only as a generic
  remote-access requirement, so S3 still does not claim it.
- **Security Cloud Control**: kept under that name as requested; the product page is currently titled "Security in Cisco
  Cloud Control" and the panel notes it. The panel and the policy-push checkpoints also say that SD-WAN overlay policy
  stays in Catalyst SD-WAN Manager and that some products keep their own consoles.
- **Secure Client ↔ Secure Access** is now drawn: the Secure Access data sheet calls Secure Client "the single, unified
  client for Secure Access".
- **Umbrella** is retiring and is no longer in the scene. Secure Access is described as the SSE that incorporates the
  DNS-layer security and secure web gateway (SWG) capabilities that were previously the core of Umbrella and expands
  them into a full SSE platform. Its three former lines (Secure Client, Secure Endpoint, SD-WAN) were removed, and
  Secure Access replaces it in the secure campus and branch architecture. Cisco's industry portfolio still lists
  Umbrella in 59 of its 105 use cases (33 of them without Secure Access). In the Industries mode those mentions count
  as Secure Access, the use case panel says so, and Umbrella is not added as a product.
- **WAAP** states no Cisco integration on its own page; its single line comes from the Firewall page's integration list.
- **Talos**: its page says it powers Cisco security products in general. Lines are drawn only to products whose own pages
  name Talos (Firewall, Secure Endpoint, Cyber Vision, AI Defense, Industrial Threat Defense, two suites).
- **Data Loss Prevention, Remote Browser Isolation, CASB and clientless access** are named on the public Secure Access
  data sheet, so the rules now name them (W4, W5, W6, A2). The data sheet's AI Access text speaks of controlling source
  code sent to generative AI; it does not use the word "prompt", so rule A3 stays an illustrative outcome.
- **Verified Duo Push** is named in rule M5 on the strength of three reviewers agreeing; the Duo policy page was read
  only in part, so the exact wording there is not confirmed.
- **Splunk** has no product pages on cisco.com (the URLs tried returned 404; Cisco's product index links out to
  splunk.com). Splunk product functions therefore come from splunk.com. Lines between Splunk and Cisco products are
  drawn only where a Cisco or Splunk page states them: Firewall, Hybrid Mesh Firewall, Secure Network Analytics, Cyber
  Vision, Industrial Threat Defense, AI Defense, Nexus, Talos (Attack Analyzer), ThousandEyes (Observability Cloud,
  AppDynamics) and AI Canvas (ITSI). Duo, Email Threat Defense, Identity Intelligence, Multicloud Defense, Secure
  Endpoint and Secure Workload lines, and XDR ↔ Enterprise Security ("Incident Import & Promote to ES Notable"), come
  from the Cisco Security Cloud app on Splunkbase (https://splunkbase.splunk.com/app/7404).
- **Drawn for Splunk after checking Splunkbase**: ISE (Splunk Add-on for Cisco Identity Services), Meraki (Cisco Meraki
  Add-on for Splunk) and ThousandEyes (Cisco ThousandEyes App for Splunk), each with its app page as the source. ISE
  and ThousandEyes now feed the Splunk layer in scenarios.
- **Secure Access → Splunk** is now drawn: the Secure Access help page "Push Security Events" sends security events to
  Splunk. Secure Access feeds the Splunk layer.
- **Not drawn for Splunk**: ThousandEyes ↔ ITSI (the
  ThousandEyes Splunk app documentation does not mention ITSI, and the ThousandEyes integrations page refused the
  request). Security Cloud Control does not mention Splunk on the pages read. Secure Client's Splunk reference is only
  a link slug.
- **Splunk checkpoints are illustrative**: which Cisco events reach Splunk, and what Enterprise Security or SOAR do
  with them, depends on configured data sources, detections and playbooks.
- **No performance numbers, specs or licence details** are shown anywhere.
- **Not drawn** for lack of an explicit statement: Meraki ↔ Secure Routers, Multicloud Defense ↔ Secure Workload,
  XDR ↔ Secure Access, AI Defense ↔ XDR, Hypershield ↔ Secure Workload, Duo ↔ Secure Client.
- **XDR ↔ ISE, XDR ↔ Duo and XDR ↔ Splunk** are now drawn: the public Cisco XDR data sheet lists ISE, Duo, Splunk Cloud
  and Splunk Enterprise as integrations. The data sheet does not describe a response action through ISE, so the tool
  still does not claim that XDR quarantines through ISE, although two reviewers state it. Secure Access is not in the
  data sheet's list, so that line is not drawn. The Breach Protection Suite Design Guide documents host isolation in
  Secure Endpoint and email quarantine in Email Threat Defense as XDR actions (rule Z2). An ISE action is documented only
  for OT assets, in the XDR and Cyber Vision brief, so only rule Z2-ot uses it.
- **Hypershield availability** varies by capability; the panel says so and no dates are shown.
- **Hypershield exploit shielding (X4, XP4)**: the Hypershield product page, read on 12 November 2026, states stateful
  Layer 3 and Layer 4 segmentation on the N9300 Smart Switches and nothing about stopping an exploit there. The Hybrid
  Mesh Firewall page, the source of the line drawn between the two products (read 10 November 2026, not re-read), says
  "Vulnerability shielding powered by Hypershield technology" without saying where it is enforced. The rules place it
  at the smart switch in front of the workload, which no page read states, so both are labelled "(illustrative)" and
  cite no document. The Hypershield scene label in the THREAT lens, "Shields vulnerabilities", is unchanged.
- **Secure Endpoint and a fake help-desk remote session (R1)**: the Secure Endpoint data sheet (`epds`) states
  behavioural protection against "the malicious use of living-off-the-land tools and ransomware by terminating the
  processes of the offending behavior". It does not name remote-management tools or help-desk impersonation, which is
  the technique the Talos Q3 2026 report (`talosq3`) describes. R1 is labelled "(illustrative)". For that behaviour on
  its own the CONTAIN comes from Z2, host isolation through Secure Endpoint, which the Breach Protection Suite guide
  documents as an XDR action.
- **Replayed session (M11, M12)**: both are stated, with limits. Duo's phishing-prevention page (`duoph`) says Duo
  Passport with Session Theft Protection "removes cookies from the authentication flow"; an application that issues its
  own session cookie is outside that, and the M12 verdict text says so. The Identity Intelligence "Compromised Session"
  check (`ciics`) detects one session used from two address and browser pairs, lists Okta, Duo and Microsoft Entra ID as
  the supported sources, and recommends revoking the session; it detects, it does not block, so M11 argues for STEP-UP
  and the BLOCK is Duo's. Neither page prints a date.
- **Exploit of an OT controller over Secure Equipment Access**: no page read states that Secure Equipment Access or the
  industrial switch drops an exploit inside an approved remote session. On that path the tool shows the Cyber Vision
  detection (XP5) and an XDR incident, and the verdict stays ALLOW WITH LIMITS.
- **Agent tool calls (A7)**: the AI Defense data sheet (`aidds`) states inspection of MCP traffic and tool allowlists
  and blocklists. The tool does not model how the poisoned tool reached the agent.
- **Example CVEs**: rule and preset text says "a known vulnerability" and names no CVE. The examples in "Attacker
  presets from 2026 threat reporting" are from the Talos posts and are not shown in the tool.
- Listed on cisco.com but out of the requested scope: Secure Web Appliance, Attack Surface Management, Secure Malware
  Analytics, Security Analytics and Logging, Telemetry Broker, Secure DDoS Protection, Vulnerability Management,
  Meraki Systems Manager, Isovalent, Catalyst Center, Splunk.
- Cisco.com pages have "show more" sections that were not expanded when read, so a relationship may exist on a page and
  still be missing here.

## Backlog: known gaps to come back to

Nothing below is done yet. It is kept here so it can be picked up later.

**From the Cisco Validated Design check (12 November 2026): suggestions to check later**

Each item names the document to check. Keys refer to the "Design reference keys" table under "Rule table".

- **Hypershield vulnerability shielding (X4, XP4)** has no CVD. The Secure Networking Architecture CVD (`snra`) lists
  "Cisco Live Protect" under Secure Infrastructure but does not tie it to Hypershield or the N9300. The Hypershield
  product page, read on 12 November 2026, states only Layer 3 and Layer 4 segmentation, and the Hybrid Mesh Firewall
  page names the capability without a place of enforcement, so both rules are now labelled "(illustrative)". Still to
  check: the Hypershield and N9300 data sheets, then either cite one and remove the label, or drop the "compensating
  control" wording.
- **Verified Duo Push (M5) and Duo risk-based authentication** are in no CVD; the Zero Trust User and Device guide (`ztud`,
  2023) uses plain Duo Push. Check the current Duo documentation or a newer Duo design guide.
- **Trust lens wording**: the Secure Access help page for Identity Intelligence (`sacii`) says user trust levels become
  visible in Secure Access (read from a summary). Once the wording is confirmed, name the Identity Intelligence trust
  level as the closest real signal in the TRUST lens legend.
- **Out-of-date device (P4)**: `ztud` warns first and blocks once the browser is a month or more out of date. Consider a
  second, stricter outcome for a badly out-of-date device.
- **Catalyst Center** is the policy administration point in the SD-Access CVD (`sda`) and in the Common Policy guide
  (`cpol`), and **Telemetry Broker** sits between switches, firewalls and Secure Network Analytics in `ztnc` and `sda`.
  Both are out of scope today; consider adding them as products.
- **Cisco Cloud Control** is the operating layer above Meraki, Intersight, Security Cloud Control, ThousandEyes and
  Splunk in the Cloud Control whitepaper (`ccw`). Consider a Cloud Control node or renaming the operations plane. The
  Hybrid Mesh Firewall at-a-glance (`hmfaag`) says "Cisco Cloud Control" where the N9300 at-a-glance (`n9300`) says
  "Security Cloud Control"; settle the naming once Cisco does.
- **Branch path**: the Unified Branch guides (`ub`, `ubl`) put an access switch and access points in front of the secure
  router, with ISE 3.4 as RADIUS and Meraki Adaptive Policy tags. The branch path is still `branch → sdwan`; consider
  adding the switch and Wi-Fi hops so N1 acts at the switch.
- **Guest at HQ**: the local internet breakout for guests comes from the branch design. The SD-Access CVD hands the guest
  virtual network off at the fabric border; check the SAFE Secure Campus and Secure Internet architecture guides for
  where an HQ guest leaves.
- **Containment trigger (T3, T9, T16)**: in `ztnc` and `sda` a SOC analyst starts the quarantine from Secure Network
  Analytics. The rules now say "Containment" instead of "Automated containment"; consider tying automation to XDR or
  SOAR in the verdict text.
- **OT zone enforcement (N7)**: credit moved to ISE with Cyber Vision. The Industrial Security overview (`indso`) also
  places Secure Firewall at Level 3; when the OT path includes the firewall, the firewall could be credited instead.
- **Secure Network Analytics to XDR**: the cloud-managed CVD (`cmc`) sends only three alarm types to XDR. Consider saying
  so in Z1 for Secure Network Analytics scenarios.
- **ThousandEyes agents (O1)**: the CVDs place agents on the branch secure router (`ub`) and on Catalyst 9000 switches
  (`cmc`). O1 could name the agent location.
- **ISE ↔ Secure Access source**: switch from the ISE page to the Secure Access help page "Integrate ISE" (`saise`:
  ISE security group tags as Secure Access policy sources over pxGrid Cloud) once its wording is confirmed.
- **Multicloud Defense WAF**: the architecture guide (`mcdag`, 2024) does not mention a WAF. The WAAP note relies on the
  product page; recheck it.
- **Self-hosted ZTNA caveat**: the SASE and SSE Architecture Guide (`sseag`, January 2025) is reported to say ZTNA and
  remote-access VPN "must be self-hosted". The September 2025 SASE Design Guide (`sasedg`) documents both in Secure
  Access, so the caveat looks superseded; confirm from the PDF.
- **Out of scope, named in CVDs**: Secure Malware Analytics (`bpsdg`), Isovalent and Cisco Live Protect (`snra`),
  Access Manager (`snra`, `cmc`).

**From the Industrial Security 3.1 Design Guide (`isdg`, read 12 November 2026): suggestions to check later**

- **OT internet traffic should leave through the IT/OT boundary firewall.** The guide: "Internet policies should have
  been covered by the IT/OT boundary firewall", and for field sites "the demarcation point between field assets and the
  internet should not be the industrial router". The tool routes factory internet traffic industrial → SD-WAN → Secure
  Access. Consider routing it through the firewall (as the IDMZ) and crediting the N7 block to Secure Firewall there.
- **IDMZ as a scene element**: the guide's first control point is an industrial DMZ with firewalls between enterprise
  and OT. It is not drawn; consider a generic "Industrial DMZ" hop like the campus distribution/core hop.
- **Automatic removal of a device that no longer fits its profile**: "If a device property results in an endpoint
  profile that does not belong to the edge network, ISE can automatically remove it from the network", with Cyber
  Vision feeding device properties. This supports T16 for OT; consider a Cyber Vision → ISE beam in the OT anomaly
  preset.
- **Virtual patching** of OT assets is now rule XP2, at the IT/OT boundary firewall. Still open: inside the plant
  (factory floor to controller, and the Secure Equipment Access path) no firewall is on the modelled path, so an
  exploit there is detected by Cyber Vision but not dropped. The guide's firewall at the cell/area boundary would
  close that; see the IDMZ and cell/area firewall items in this list.
- **Secure Firewall routing between OT VLANs, or transparent at the cell/area boundary**, and **SGT enforcement at the
  distribution switch** (cell/area zones classified by subnet). The industrial network node could say so.
- **Splunk**: the guide validates Splunk ingestion from Cyber Vision (add-on and app), IOS-XE, ISE, Firewall Management
  Center and Duo, and lists the Cisco Security Cloud app products: Duo, Secure Malware Analytics, Firewall Management
  Center, Multicloud Defense, XDR, Email Threat Defense, Secure Network Analytics, Secure Endpoint, Vulnerability
  Intelligence. Several Splunk lines could cite `isdg` instead of Splunkbase.
- **Secure Network Analytics vs Cyber Vision**: Secure Network Analytics "is recommended for network devices in Levels
  3 to 5" and Cyber Vision "for Levels 0 to 3". The tool already uses Cyber Vision on the industrial path and Secure
  Network Analytics on the campus; worth a sentence in both panels.
- **SecureX appendix**: SecureX is end of life and replaced by XDR, but its "Quarantine Device using SGT" workflow
  backs rule Z2-ot. Check the current XDR workflow name.
- **Secure Equipment Access agent platforms** (IR1101, IR1800, IR8340, IE9300, IE3400, IE3300, IE3100, Catalyst 9300)
  differ slightly from the Cyber Vision sensor list on the data sheet; keep both lists separate.

> [!IMPORTANT]
> **Long guides and PDFs to read in full later.** The web reader used for the CVD check stops at 10 MB and reads long
> pages in windows of about 40,000 characters, summarising the rest. The parts it only summarised may hold relationships
> or caveats the tool still lacks. The most reliable way found: download the PDF version linked at the top of each guide
> and extract the text locally. That is how the N9300 at-a-glance PDF was read in full.
>
> ```bash
> curl -sSLo guide.pdf "<PDF URL>" && pdftotext -layout guide.pdf guide.txt
> ```

| Priority | Document | Format | Read so far | What it may settle |
|---|---|---|---|---|
| ✅ | [Industrial Security 3.1 Design Guide](https://www.cisco.com/c/dam/en/us/td/docs/Technology/Industrial-Security-3-1-DG.pdf) (`isdg`) | PDF, 18 MB, 254 pages, June 2025 | **Read on 12 November 2026** by downloading it and extracting the text: chapters 1 to 4 in full, and the integration lists of chapter 5 and the appendices. Not yet read: the Splunk configuration detail in chapter 5 and the configuration appendices A to C, F and G | Findings in `CVD-REVIEW.md` section 8 and in the backlog items marked `isdg` |
| 2 | [SASE and SSE Architecture Guide](https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/sase-sse-ag.pdf) (`sseag`) | PDF, 54 pages | About 40% verbatim | Appendix A capability map (CASB, DLP, RBI), the self-hosted ZTNA caveat |
| 3 | [Cisco Unified Branch Design Guide](https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/cisco_unified_branch_design_guide.html) (`ub`) | HTML; PDF 1.9 MB linked on the page | About 30% verbatim | Secure Access, ISE, ThousandEyes, Splunk and XDR sections |
| 4 | [Unified Branch Large Branch Deployment Guide](https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/cisco-unified-branch-large-branch-deployment-guide.html) (`ubl`) | HTML; PDF 8 MB linked on the page | About 55% verbatim | Secure Access tunnel settings, ISE settings (Appendix C) |
| 5 | [Zero Trust: Network and Cloud Security Design Guide](https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/zt-network-cloud-dg.html) (`ztnc`) | HTML; PDF 30 MB linked on the page | About 75% verbatim | Quarantine validation test, Secure Malware Analytics appendix |
| 6 | [Zero Trust: User and Device Security Design Guide](https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/zt-user-device-dg.html) (`ztud`) | HTML; PDF 5.5 MB linked on the page | About 60% verbatim | Duo policy steps, Secure Client posture provisioning |
| 7 | [Cisco SASE Design Guide](https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/sase-design-guide.html) (`sasedg`) | HTML | About 65% verbatim | Experience Insights, traffic-flow examples, CASB and RBI wording |
| 8 | [Secure Firewall Threat Defense SD-WAN Design and Deployment Guide](https://www.cisco.com/c/en/us/td/docs/security/secure-firewall/cvd/secure-firewall-sdwan-deployment-guide.html) (`fwsdwan`) | HTML | About 75% verbatim | The branch Secure Access section (what is inspected where) |
| 9 | [Cisco Catalyst SD-WAN Design Guide](https://www.cisco.com/c/en/us/td/docs/solutions/CVD/SDWAN/cisco-sdwan-design-guide.html) (`sdwandg`) | HTML; PDF 102 pages | About 60% verbatim | Appendix A list of SD-WAN security guides |
| 10 | [Campus LAN and Wireless LAN Design Guide](https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/cisco-campus-lan-wlan-design-guide.html) (`lan`) | HTML | About 50% verbatim | WPA3, guest wireless, quarantine WLAN |
| 11 | [Cisco Breach Protection Suite Design Guide](https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/breach-protection-suite-dg.html) (`bpsdg`) | HTML | About 80% verbatim | Secure Endpoint and Email Threat Defense test cases |
| 12 | [Cisco Common Policy Integration Guide](https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/catalyst-center/cisco-validated-solution-profiles/common-policy-integration-guide.html) (`cpol`) | HTML | About 70% verbatim | Security group tag enforcement on the SD-WAN edge and the firewall |
| 13 | [Cisco Secure Network SD-Access Deployment Guide](https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/Cisco-Secure-Networking-SD-Access-Deployment-Guide.html) (`sda`) | HTML | About 90% verbatim | ISE integration steps, Encrypted Traffic Analytics |
| 14 | Secure Access help pages (`saise`, `sacii`, `saspl`) | HTML | About 33% verbatim each | Exact wording for ISE, Identity Intelligence and Splunk integrations |

Not opened yet, likely useful:
- [Security Visibility for a CPwE Architecture (PDF)](https://www.cisco.com/c/dam/en/us/td/docs/solutions/Verticals/CPwE/Security-Visibility/CPwE_Security_Visibility_final10-30-23.pdf) — Cyber Vision in the plant.
- [Securely Traversing IACS Data across the IDMZ](https://www.cisco.com/c/en/us/td/docs/solutions/Verticals/CPwE/3-5-1/IDMZ/DIG/CPwE_IDMZ_2_CVD.html) — firewall in the industrial DMZ.
- [Cisco Cyber Vision Architecture Guide (PDF)](https://www.cisco.com/c/dam/en/us/td/docs/security/cyber_vision/Cisco_Cyber_Vision_Architecture_Guide-V1-00.pdf).
- [Security Policy Design Guide for Cisco IOS-XE SD-WAN Devices](https://www.cisco.com/c/en/us/td/docs/solutions/CVD/SDWAN/cisco-sdwan-security-policy-design-guide.html) — router firewall, IPS and URL filtering.
- [Cisco Zero Trust Architecture Guide](https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/zt-arch-guide.html) and the SAFE Secure Campus, Branch and Internet architecture guides listed on the [Campus and branch design zone](https://www.cisco.com/c/en/us/solutions/design-zone/campus-branch.html).
- [Secure Substation Design Guide](https://www.cisco.com/c/en/us/solutions/design-zone/industrial-iot-cisco-validated/utilities-and-renewables/secure-substation-design-guide.html) — zones and conduits for utilities.

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
- A compromised device exfiltrating to an OT controller from the factory floor ends in ALLOW when the Splunk layer is
  off: on that path only the endpoint reports it, and no rule acts on exfiltration there. Found while checking the
  2026 attacker presets; it predates them.
- Secure Access has no XDR line: no public page naming it was found. ThousandEyes ↔ ITSI and an XDR response action
  through ISE for an IT endpoint also still need a public page.
- No licensing view: nothing shows which suite or tier a scenario needs.
- No "denial of service" behaviour, and no multi-stage attack that chains several steps in one run: presets 32 and 33
  combine two behaviours, which the engine evaluates together, not one after the other.
- The "exploit" behaviour is limited to systems the organisation runs (private app, cloud app, internal server,
  internal AI model, OT controller), and the remote-session behaviour to managed devices, so a contractor cannot be
  the victim of the fake help-desk call.
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

Checked in a headless browser on 12 November 2026: zero console errors; all 37 presets play to a verdict; every valid
picker combination (about 244,000 with behaviour sets of up to two, each with the Splunk layer on and off) returns a
path, a timeline and a verdict; the compare preset runs both scenarios in split view; removing controls and link
sharing work; all eleven tour steps open; the Markdown, JSON and report exports are produced for the new presets;
every product has a source link. The PNG export and the print dialog were last checked before the 2026 attacker
presets were added.

## Attacker presets from 2026 threat reporting, 12 November 2026

Seven presets, 31 to 37, under the heading "Attacker: 2026 techniques". Presets 1 to 30 keep their numbers, inputs and
verdicts. Each new preset follows a technique that Cisco Talos or a Cisco data sheet describes; the rule that decides
the verdict cites the page.

| # | Technique | Reported in | What decides the verdict |
|---|---|---|---|
| 31 | A phishing proxy sits between the user and the sign-in page, captures the session and the attacker replays it | `talosq2`: MFA bypassed "using adversary-in-the-middle (AitM) proxies, session-token theft, MFA fatigue attacks, and self-enrolled devices" | M11 (Identity Intelligence flags the session), M12 (Duo refuses the replay): BLOCK |
| 32 | A caller posing as the IT help desk gets the user to start a remote-control session, then explores the network | `talosq3`: "voice phishing (vishing) in tandem with IT desk impersonation to socially engineer the victim into allowing remote access via a legitimate remote monitoring and management (RMM) tool" | R1 (illustrative) reports it; T3 quarantines the scanning host: CONTAIN |
| 33 | A ransomware crew removes the endpoint agent, copies data out, then encrypts | `talosq3`: Interlock actors "trying to uninstall Cisco Secure Endpoint (CSE) on compromised systems"; in the VYPR case, "exfiltration over multiple days" and vulnerable drivers used to disable endpoint protection | Loads with Secure Endpoint removed. Secure Access blocks the exfiltration channel and the ISE quarantine still contains: CONTAIN, with T1b, T8 and Z2 shown as gaps |
| 34 | Exploit of a known vulnerability in an internet-facing system | `talosq3`: "Exploitation of public-facing applications was the second most common initial access vector, accounting for 33 percent of engagements"; `talosfmc` for a case with published Snort rules | XP1 (Secure Firewall intrusion prevention): BLOCK |
| 35 | A vendor laptop on site launches a known exploit at a controller | `isdg` pp. 61 to 62, virtual patching | XP2 (firewall at the IT/OT boundary, policy chosen from the vulnerabilities Cyber Vision found): BLOCK |
| 36 | A poisoned tool or hidden instruction steers an internal AI agent into a tool call it should not make | `aidds`: runtime protection "extends to MCP traffic, inspecting agent actions and tool calls in real time" | A7 (AI Defense): BLOCK |
| 37 | A stolen vendor login is tried against remote access to a factory machine | `talosq3`: attackers "routinely gain initial access by leveraging valid credentials"; single-factor authentication "allowed unauthorized access in several incidents". The report does not describe a vendor or factory case; the preset applies the technique to the OT remote-access path | Existing rules only: M4, MFA not completed at Secure Equipment Access: BLOCK |

**Behaviours added** (builder, "Build your own"): "Exploits a known vulnerability (CVE)" and "Starts a remote-control
session for a fake help-desk caller" under Threat, "Session stolen through a phishing proxy and replayed" under
Authentication, "AI agent steered by a poisoned tool or hidden instruction" under Data. Their limits are in "Invalid
combinations".

**Rules added**: M11, M12, XP1 to XP5, A7, R1, Z2-rmm, Z2-otx and Z2-otxc. The exploit behaviour has one rule at each
place that can act on it: Secure Firewall (XP1, and XP2 for an OT destination), Multicloud Defense (XP3), the smart
switch in front of a workload (XP4, illustrative) and the Cyber Vision sensor (XP5, which detects and does not block).
A detection by the sensor on the factory floor leads to the XDR workflow that tags the source in ISE (Z2-otx, Z2-otxc).

**Rules changed**:
- M1, M3 and M10 do not fire for a replayed session, so the timeline does not say "MFA passed" for it.
- X1 does not fire for the exploit behaviour; XP1 replaces it there with the intrusion-prevention wording and sources.
- X4 is relabelled "Vulnerability shielding (illustrative)"; see "Not verified".
- A6 does not fire when A7 does.
- Z2 also answers the remote-session behaviour (host isolation through Secure Endpoint).
- S3 is skipped when the session is stopped at Secure Equipment Access, so a blocked or stepped-up sign-in is no
  longer followed by a "least-privilege session" line. No verdict changes; 30,722 of the 1,596,228 evaluations
  compared (798,114 combinations, each with the Splunk layer on and off) lose that one line.

**A block on an exploit is interim.** XP1, XP2 and XP3 say the system still needs its patch.

**Example CVEs.** The tool names none. The Talos posts do, and they show what "a known vulnerability with a published
rule" means in practice:
- `talosfmc`: CVE-2026-20079 (CVSS 10.0; Snort rules 66075 to 66080) and CVE-2026-20316 (CVSS 5.3; Snort rule 66883).
  Both are in Cisco's own Secure Firewall Management Center. XP1 is about a firewall in front of a vulnerable system;
  it does not claim that the firewall protects its own manager.
- `talosq3`: CVE-2023-20198, "a known vulnerability … in publicly accessible web-based management interfaces".

**Sources read on 12 November 2026**: the three Talos posts, the AI Defense data sheet, the Secure Endpoint data
sheet, the Multicloud Defense user guide (Network Intrusion profile), Duo's phishing-prevention page, the Identity
Intelligence "Compromised Session" page, the Cyber Vision data sheet (Snort engine with Talos rules), the Hypershield
product page, and pages 61 to 62 of the Industrial Security 3.1 Design Guide: "Virtual patching is typically done by
leveraging the Intrusion Prevention System of Cisco Secure Firewall. A key capability is the Cyber Vision ability to
discover CVE information in the operational environment so the relevant IPS policies can be enabled in the Cisco
Secure Firewall." Keys and dates are in "Design reference keys"; what could not be confirmed is in "Not verified".
`DATA.cvd` now holds 37 documents: 17 Cisco Validated, 17 references and 3 threat reports.

Checks after these changes, in headless Chrome and in Node against the previous version of the rules:
- Presets 1 to 30 give the same verdicts as before, with the Splunk layer on and off, in the 3D view and in
  `?render=svg`. Presets 31 to 37 give the verdicts in the table.
- Zero console errors in either view, including while presets 31, 35 and 36 play.
- A link copied from preset 33 reopens on preset 33 with Secure Endpoint removed and the same verdict.
- Earlier behaviours: 798,114 picker combinations (up to three behaviours each), each with the Splunk layer on and
  off, give the same verdict as before. The only timeline difference is the S3 line described above.
- New behaviours: 383,692 combinations that include one of the four (up to three behaviours each), each with the
  Splunk layer on and off, return a path, a timeline and a verdict, and none ends in plain ALLOW. For the exploit
  behaviour over Secure Equipment Access the verdict is ALLOW WITH LIMITS; see "Not verified".
- Every timeline that shows the OT exploit workflow (Z2-otx, Z2-otxc) also shows the Cyber Vision detection (XP5).
- Removing one product at a time from the single-behaviour cases (35,299 replays) still returns a path, a timeline
  and a verdict.

## Cisco Validated Design check, 12 November 2026

The tool was compared with the [Cisco Validated index](https://www.cisco.com/site/us/en/solutions/cisco-validated/index.html)
and the design, deployment and architecture guides it leads to. The full comparison, with a quote and date for every
finding, is in [`CVD-REVIEW.md`](CVD-REVIEW.md). The index has no Security category and no Hybrid Mesh Firewall,
Hypershield, Secure Workload, Multicloud Defense or AI Defense design guide, so those parts still rest on product pages
and at-a-glance documents.

Applied:
- **Design references in the tool**: `DATA.cvd` holds 29 documents (17 Cisco Validated, 12 references). Product panels,
  topology views and timeline steps link them.
- **Eight relationships added** (115 → 123): ISE ↔ Meraki dashboard (`cmc`), ISE ↔ Secure Routers / SD-WAN (`cpol`),
  ISE ↔ Nexus through ACI (`cpol`), Firewall ↔ Secure Access (`fwsdwan`), Firewall ↔ Network Analytics (`ztnc`),
  ThousandEyes ↔ XDR (`cmc`), Meraki dashboard ↔ XDR (`ubl`), Secure Access → Splunk Platform (`saspl`).
- **Stronger sources for six relationships**: ISE ↔ Firewall and ISE ↔ Network Analytics (`ztnc`), Cyber Vision ↔ ISE
  (`cvise`), Cyber Vision ↔ Firewall (`cvfw`), Cyber Vision ↔ XDR (`cvxdr`), XDR ↔ Email Threat Defense (`bpsdg`).
- **Secure Access feeds the Splunk layer**, so its blocks now reach Enterprise Security and SOAR when the layer is on.
- **Rules**:
  - N7: OT zone enforcement credited to ISE with Cyber Vision, not Cyber Vision alone (`cvise`, `indso`).
  - S3: Secure Equipment Access is approved by an access manager and limited to a scheduled time window (`isdg`); it
    no longer claims session recording, which the guides list only as a requirement (`isdg`, `cvds`).
  - Z2: XDR's response is host isolation through Secure Endpoint, and it is skipped when Secure Endpoint is removed
    (`bpsdg`). New Z2-ot: for OT, a Cyber Vision report to XDR runs a workflow that tags the asset in ISE (`cvxdr`).
  - T3, T9, T16: "Containment" through an Adaptive Network Control quarantine over pxGrid and a Change of Authorization
    into a quarantine security group (`ztnc`, `sda`).
  - P3 names the ISE posture module in Secure Client; P4 says the user is warned, then blocked (`ztud`).
  - Guests on site break out locally at the router, outside the Secure Access tunnels (new path rule RT-inet-guest and
    rule B3g, `ub`, `ubl`). New rules W3r and W3f keep a malicious site, download or phishing link blocked there by the
    router's threat protection.
- **Topology**: ThousandEyes added to Zero Trust Access (Cisco defines it as Secure Access, Duo, ISE and ThousandEyes,
  `ztaaag`); Secure Firewall and ISE added to SASE; Meraki dashboard and ThousandEyes to Detection and response; Secure
  Access and Meraki to Splunk for security operations. The Hybrid Mesh Firewall and Data center views say no CVD covers
  them yet.
- **Panels**: notes for Security Cloud Control, Secure Access, Secure Equipment Access, Hypershield, AgenticOps, Hybrid
  Mesh Firewall, ISE, XDR, ThousandEyes and Industrial network, each with its source. The campus hop is renamed "Campus
  distribution / core" and describes the SD-Access intermediate, border and fusion nodes.

Checks after these changes: zero console errors in the 3D and 2D views; all 30 presets give the same verdicts as before,
with and without the Splunk layer; 131,040 picker combinations each return a path, a timeline and a verdict. The only
changes in the presets are the intended ones: the guest preset now breaks out locally, the OT anomaly preset adds the
XDR-to-ISE workflow, and Secure Access blocks reach Enterprise Security when the Splunk layer is on.

Still open: see "From the Cisco Validated Design check" and "Long guides and PDFs to read in full later" in the backlog.

## Combined version, 11 November 2026

This version merges the two lines of work (the build with tour, export, split view and full screen, and the build that
applied the expert review) and then adds the following.

Still missing after the review, now applied:
- **Campus core / distribution hop** (review item 14, the first "most important fix" of reviewer A): a generic
  infrastructure node between the access switch and the firewall or WAN on every HQ path. It is a scene element, not a
  product.
- **Second round of public page checks** for the items the review left pending:
  - Cisco XDR data sheet: ISE, Duo, Splunk Cloud and Splunk Enterprise are listed integrations, so XDR ↔ ISE, XDR ↔ Duo
    and XDR ↔ Splunk Platform are drawn.
  - Splunkbase: apps exist for ISE, Meraki and ThousandEyes, so those three lines are drawn; ISE and ThousandEyes feed
    the Splunk layer.
  - Secure Access data sheet: Secure Client is its client (line drawn), and Data Loss Prevention, Remote Browser
    Isolation, CASB and clientless access are named, so rules W4, W5, W6, A2 and B2 use those names.
  - Not confirmed, so not applied: XDR ↔ Secure Access, an XDR quarantine action through ISE, ThousandEyes ↔ ITSI, a
    Splunk app for Secure Access.
- Rules also name the Secure Client posture check (P3), Verified Duo Push (M5) and the Encrypted Visibility Engine
  (T13), as the reviewers agreed.
- Topology: ISE and Duo added to "Detection and response", Secure Client to "Zero Trust Access", ISE to "Splunk for
  security operations". The scene now has 40 products and 115 relationships.

Performance:
- **Bloom and fog guard reacts in about two seconds** instead of counting 160 frames. On a slow device the old guard
  took roughly half a minute at a few frames per second before it switched bloom off. The result is remembered for the
  browser session; turning visual effects off and on tries again.
- **Models are merged**: each product model, place and device is one mesh per material instead of one mesh per
  primitive. Draw calls in the overview fall from about 310 to about 190, with the same triangle count. Merged
  geometry is cached, so re-running a scenario allocates nothing new.
- **Hover picking runs once per frame** instead of on every pointer event.
- **Labels are re-projected only when something changed** (camera, playhead, lens, selection, filter or fog), and
  playback progress is computed once per frame instead of several times.
- Measured in a software renderer, where the frame rate is limited by pixel fill and did not change; the gain to expect
  is on real GPUs and phones, which were not measured.

Other:
- The first-visit tour prompt moved to the bottom of the scene so it no longer covers the legend.

Checks after these changes: zero console errors; all 30 presets give the same verdicts as the reviewed version;
204,720 scenario combinations (including removed controls) each return a path, a timeline and a verdict; no
relationship, architecture, flow or Splunk feed points to a missing product or lacks a source; switching the Splunk
layer off changes no preset verdict; tour, export, split view, full screen, fog of war and the 3rd-person drag
handover work in headless Chromium.

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

The Cisco Validated Design check on 12 November 2026 added stronger sources for items 3, 4, 11, 12, 14, 19, 30, 37,
38 and 41; see "Cisco Validated Design check".

Not applied: ISE in a "Premier" User Protection tier (the page lists Essentials and Advantage only), CANNOT CONFIRM on
items 3 and 7 (the pages confirm them), an XDR ↔ Secure Access line, an XDR quarantine action through ISE, and
ThousandEyes ↔ ITSI (no public page states them; see "Combined version" above for what a second round of page checks
did confirm).

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
| 14 | P | P | P | Applied in the combined version: a generic "Campus core / distribution" hop sits between the access switch and the firewall or WAN on every HQ path. The caption says wireless controllers and SD-Access fabric nodes are not shown. C's "missing ISE" is a decision point already shown as a checkpoint. |
| 15–18 | C | C | C | No change. |
| 19 | P | P | P | Applied. Secure Access credited for internet-edge blocks; Umbrella rules W1, W1p, W1f removed. |
| 20–24 | C | C | C | Applied in the combined version: rules name CASB (W5, A2), Data Loss Prevention (W6), Remote Browser Isolation (W4), Verified Duo Push (M5) and the Encrypted Visibility Engine (T13). The first three were confirmed on the Secure Access data sheet. |
| 25 | C | C | C | No change; availability note added to Hypershield. |
| 26 | P | C | C | Reviewers disagree on availability; panel says availability varies by capability, no dates. |
| 27–28 | C | C | C | No change. |
| 29 | P | P | P | WAAP note: Multicloud Defense also does ingress WAF, so WAAP is optional. |
| 30 | P | P | P | Security Cloud Control note and rules O4, O5-sdwan reworded (SD-WAN overlay stays in Catalyst SD-WAN Manager). Lines kept, as cisco.com states them. |
| 31 | C | C | C | No change. |
| 32 | P | P | P | Applied. A3 credited to Secure Access AI Access; AI Defense only for internal AI apps (A4–A6). |
| 33–36 | C | C | — | No change. |
| 37 | C | C | — | Applied in the combined version for ISE and Duo (named in the public XDR data sheet). XDR ↔ Secure Access not drawn: not in that list. |
| 38 | C | C | — | Partly applied: the XDR ↔ ISE line is drawn from the XDR data sheet. A quarantine action through ISE is not claimed, because the data sheet does not describe it. |
| 39–40 | C | C | — | No change. |
| 41 | I | I | — | Applied. Splunk feeds from the Cisco Security Cloud app, plus ISE, Meraki and ThousandEyes from their own Splunkbase apps. Secure Access still pending. |
| 42 | C | C | — | Applied. SOAR can argue for CONTAIN (rule SP8). |
| 43 | C | C | — | Applied. XDR ↔ Enterprise Security line. |
| 44 | C | C | — | Partly applied: ThousandEyes ↔ Splunk Platform is drawn from the ThousandEyes app on Splunkbase. ThousandEyes ↔ ITSI not drawn: the page read does not mention ITSI. |
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
| Cisco Industrial IoT Networking | Networking | Rugged switches, routers and wireless for operational sites, with OT visibility, segmentation and remote access built in. *Cyber Vision sensor platforms on the data sheet include IE3400, IE3500 and IE9300 switches, IR1100, IR1800 and IR8300 routers, and the Catalyst 9300. The Industrial Security overview places Secure Firewall at Level 3 to enforce zones and conduits. The Industrial Security 3.1 Design Guide runs the Secure Equipment Access agent on IR1101, IR1800 and IR8340 routers, IE9300, IE3400, IE3300 and IE3100 switches and the Catalyst 9300.* | https://www.cisco.com/site/us/en/products/networking/industrial-iot/index.html |
| Cisco Secure Routers / SD-WAN | Networking | Routing and SD-WAN platform with encryption, segmentation and a built-in next-generation firewall for branch and WAN. | https://www.cisco.com/site/us/en/products/networking/sdwan-routers/index.html |
| Cisco Nexus Data Center Networking | Networking | Data center switching and fabric management; N9300 Smart Switches embed Hypershield enforcement beside workloads. | https://www.cisco.com/site/us/en/products/networking/cloud-networking/index.html |
| Cisco Silicon One | Networking | Programmable networking silicon architecture used inside Cisco routing, Nexus and Catalyst switching platforms. | https://www.cisco.com/site/us/en/products/networking/silicon-one/index.html |
| Cisco ThousandEyes | Networking | Assurance that measures digital experience across owned and unowned networks, from the user to cloud and SaaS. *Zero Trust Access from Cisco is defined as capabilities from Secure Access, Duo, ISE and ThousandEyes. In the Cisco Validated Designs ThousandEyes agents run on the branch secure router, on Catalyst 9000 switches and as a Secure Client module feeding Secure Access Experience Insights.* | https://www.cisco.com/site/us/en/products/networking/software/internet-cloud-intelligence/index.html |
| Meraki dashboard (Cisco Networking Platform) | Networking | Cloud dashboard that configures and monitors wireless, switching, routing and industrial Ethernet from one place. | https://www.cisco.com/site/us/en/products/networking/networking-cloud/index.html |
| AgenticOps (Cisco AI Canvas) | Networking | Shared workspace in Cisco Cloud Control where teams and AI agents investigate and resolve cross-domain issues. *No standalone AgenticOps page was found on cisco.com; the AI Canvas page (“the workspace for AgenticOps”) is used as the source. The Cisco Secure Networking Architecture CVD names this layer “Unified Management and Agentic Operations” and lists Cisco Cloud Control, AI Canvas, Cisco AI Assistant and the Deep Network Model in it.* | https://www.cisco.com/site/us/en/solutions/artificial-intelligence/agentic-ops/ai-canvas/index.html |
| Cisco Duo | Identity & access | Identity and access management with phishing-resistant authentication that verifies the user and device before access. | https://www.cisco.com/site/us/en/products/security/duo/index.html |
| Cisco Identity Services Engine (ISE) | Identity & access | Network access control that profiles endpoints, applies identity and posture context, segments access and quarantines risky devices. *In the Cisco Validated Designs ISE is the context hub: it shares security group tags with Catalyst Center, SD-WAN Manager, Firewall Management Center, ACI, Meraki and Secure Access. Quarantine: Secure Network Analytics sends an Adaptive Network Control action to ISE over pxGrid, ISE sends a Change of Authorization, and the endpoint re-authenticates into a quarantine rule or quarantine security group.* | https://www.cisco.com/site/us/en/products/security/identity-services-engine/index.html |
| Cisco Identity Intelligence | Identity & access | Identity analytics that exposes risky accounts and privileges and flags high-risk access attempts for Duo, Secure Access and XDR. | https://www.cisco.com/site/us/en/solutions/security/identity-intelligence/index.html |
| Cisco Secure Client | Identity & access | Modular endpoint client providing VPN and zero trust network access, with endpoint and roaming security modules. | https://www.cisco.com/site/us/en/products/security/secure-client/index.html |
| Cisco Secure Access | Identity & access | SSE: Cisco Secure Access incorporates the DNS-layer security and secure web gateway (SWG) capabilities that were previously the core of Umbrella, but it expands them into a full SSE platform with zero trust and VPN access to private apps, SaaS and AI use. *DNS-layer security is also offered on its own as “Secure Access DNS Defense”, and the AI Access feature set covers third-party AI apps. Umbrella is retiring, so it is not shown as a separate product; Secure Access is credited for every internet-edge block. The Cisco SASE Design Guide notes that the Secure Client roaming module is shared with Umbrella, so “migration from Umbrella to Secure Access can be simplified”. In the Unified Branch CVD most branch internet traffic goes through Secure Access tunnels, while guest traffic breaks out locally.* | https://www.cisco.com/site/us/en/products/security/secure-access/index.html |
| Cisco Secure Firewall | Network security | Firewalls that inspect traffic, use Talos intelligence and detect threats in encrypted flows without decrypting them. | https://www.cisco.com/site/us/en/products/security/firewalls/index.html |
| Cisco Hybrid Mesh Firewall | Network security | Solution that unifies distributed enforcement points — firewalls, smart switches, agents and AI guardrails — under one management plane. *No Cisco Validated Design covers Hybrid Mesh Firewall yet. Its at-a-glance names enforcement-point types (firewalls, smart switches, workload and container agents, third-party and cloud-native firewalls) and says “Policy is orchestrated by Cisco Cloud Control”.* | https://www.cisco.com/site/us/en/solutions/security/hybrid-mesh-firewall/index.html |
| Cisco Multicloud Defense | Network security | Cloud firewalling from one control plane with ingress, egress and east-west protection across public and private clouds. | https://www.cisco.com/site/us/en/products/security/multicloud-defense/index.html |
| Cisco Security Cloud Control | Network security | Unified management that authors policy once and applies it across Cisco and third-party enforcement points. *The cisco.com product page is currently titled “Security in Cisco Cloud Control”. The Cisco Cloud Control whitepaper (Cisco Validated) calls it “the security management tenant” inside Cisco Cloud Control. It manages security policy; SD-WAN overlay policy stays in Catalyst SD-WAN Manager (Catalyst SD-WAN Design Guide), a Meraki MX secure router is configured in the Meraki dashboard (Unified Branch Design Guide), and some products, such as Secure Access and Secure Workload, keep their own consoles alongside it.* | https://www.cisco.com/site/us/en/products/security/security-cloud-control/index.html |
| Cisco Hypershield | Cloud & application security | Distributed security fabric giving stateful segmentation close to workloads, enforced on Nexus N9300 Smart Switches. *Availability varies by capability and enforcement point; check the product page before presenting a capability as generally available. The N9300 Smart Switch at-a-glance: “Cisco Hypershield defines the policy. Cisco 9300 Series Smart Switches enforce it.” Security policy is managed from the Hypershield on-premises controller or Security Cloud Control; switch operations stay in NX-OS and Nexus Dashboard.* | https://www.cisco.com/site/us/en/products/security/hypershield/index.html |
| Cisco Secure Workload | Cloud & application security | Zero trust microsegmentation for workloads in any environment, with visibility into flows and policy recommendations. | https://www.cisco.com/site/us/en/products/security/secure-workload/index.html |
| Cisco AI Defense | Cloud & application security | Discovers AI assets, tests models for vulnerabilities and applies runtime guardrails against prompt injection and data leakage. | https://www.cisco.com/site/us/en/products/security/ai-defense/index.html |
| Cisco Web Application and API Protection (WAAP) | Cloud & application security | Application, API and bot protection that uses behavioural analysis to identify threats before they reach the application. *Multicloud Defense also provides ingress web application firewalling, so a separate WAAP in front of it is optional and depends on the requirement.* | https://www.cisco.com/c/en/us/products/security/secure-web-application-firewall/index.html |
| Cisco Secure Endpoint | Endpoint & email | Endpoint detection and response that blocks malware and can isolate an infected host with one action. | https://www.cisco.com/site/us/en/products/security/endpoint-security/secure-endpoint/index.html |
| Cisco Secure Email Threat Defense | Endpoint & email | Cloud email security that stops threats before delivery and remediates messages after delivery through APIs. | https://www.cisco.com/site/us/en/products/security/secure-email/index.html |
| Cisco XDR | Detection & intelligence | Correlates telemetry from network, endpoint, email, cloud and identity into prioritised incidents with guided and automated response. *Response actions in the Breach Protection Suite Design Guide: host isolation in Secure Endpoint and email quarantine in Email Threat Defense. An ISE action (assigning a security group tag) is documented for OT assets through a Cyber Vision workflow; an XDR quarantine of an IT endpoint through ISE is not described in the pages read.* | https://www.cisco.com/site/us/en/products/security/xdr/index.html |
| Cisco Secure Network Analytics | Detection & intelligence | Behavioural network analytics that detects insider threats, exfiltration and threats in encrypted traffic without decryption. | https://www.cisco.com/site/us/en/products/security/security-analytics/secure-network-analytics/index.html |
| Cisco Talos | Detection & intelligence | Cisco’s threat intelligence organisation; its research and detections feed Cisco security products. | https://www.cisco.com/site/us/en/products/security/talos/index.html |
| Cisco Cyber Vision | Industrial (OT) security | OT visibility from sensors embedded in network equipment: asset inventory, risk scoring, threat detection, segmentation and remote access. | https://www.cisco.com/site/us/en/products/security/industrial-security/cyber-vision/index.html |
| Cisco Industrial Threat Defense | Industrial (OT) security | OT security solution combining asset discovery, segmentation, zero trust remote access and unified IT/OT detection. | https://www.cisco.com/site/us/en/products/security/industrial-security/index.html |
| Cisco Secure Equipment Access | Industrial (OT) security | Zero trust remote access to industrial assets; cisco.com states it is now part of Cyber Vision. *The product page states: “Cisco Secure Equipment Access is now part of Cisco Cyber Vision.” The Cyber Vision data sheet describes least-privilege remote access with MFA or SSO, time schedules, permitted protocols and a remote-user posture check, through a ZTNA gateway agent on the sensor platforms. The Industrial Security 3.1 Design Guide adds browser access over HTTP(S), SSH, RDP, VNC and Telnet, a client option (SEA Plus) checked by Duo and Secure Endpoint, and “Request Access” groups where a session is granted only after an access manager approves it. Session recording is listed there as a remote-access requirement, not as a stated SEA feature.* | https://www.cisco.com/site/us/en/products/security/industrial-security/secure-equipment-access/index.html |
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

## Relationships drawn (123)

Each line is a relationship stated on the cisco.com page, design guide or Splunkbase page given as its source.

| A | B | Stated relationship | Source page |
|---|---|---|---|
| ISE | Smart Switches | Identity-based segmentation with security group tags, orchestrated by ISE | https://www.cisco.com/site/us/en/solutions/networking/campus-branch-networking/secure-campus/index.html |
| ISE | Wi-Fi 7 | Security group tags on wireless; segmentation orchestrated by ISE | https://www.cisco.com/site/us/en/solutions/networking/campus-branch-networking/secure-campus/index.html |
| ISE | Hybrid Mesh Firewall | ISE identity context informs segmentation policy | https://www.cisco.com/site/us/en/products/security/identity-services-engine/index.html |
| ISE | Firewall | ISE shares security group tags and user-to-IP mappings with the firewall (pxGrid and SXP) for SGT-based access control | https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/zt-network-cloud-dg.html |
| ISE | Network Analytics | Secure Network Analytics sends Adaptive Network Control quarantine actions to ISE over pxGrid | https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/zt-network-cloud-dg.html |
| ISE | Cyber Vision | Cyber Vision shares OT asset profiles and zones with ISE over pxGrid; ISE assigns each asset a security group tag | https://www.cisco.com/c/en/us/products/collateral/security/cyber-vision/ise-cyber-vision-working-together-so.html |
| ISE | Meraki dashboard | Security group tags created in ISE synchronise into Meraki Adaptive Policy through pxGrid | https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/Cisco-Secure-Networking-Cloud-Managed-Deployment-Guide.html |
| ISE | Secure Routers · SD-WAN | ISE sends security group tags to SD-WAN Manager and IP-to-SGT mappings to the SD-WAN Controller | https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/catalyst-center/cisco-validated-solution-profiles/common-policy-integration-guide.html |
| ISE | Nexus | ISE and ACI (APIC) exchange context: endpoint and security groups are mapped to security group tags | https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/catalyst-center/cisco-validated-solution-profiles/common-policy-integration-guide.html |
| ISE | Secure Access | Zero Trust Access is built with ISE, Secure Access and Duo | https://www.cisco.com/site/us/en/products/security/identity-services-engine/index.html |
| ISE | Duo | Zero Trust Access is built with ISE, Secure Access and Duo | https://www.cisco.com/site/us/en/products/security/identity-services-engine/index.html |
| Duo | Secure Access | Duo strengthens authentication for Secure Access | https://www.cisco.com/site/us/en/products/security/secure-access/index.html |
| Identity Intelligence | Duo | Adds identity insights to Duo | https://www.cisco.com/site/us/en/solutions/security/identity-intelligence/index.html |
| Identity Intelligence | Secure Access | Adds identity intelligence against account takeover | https://www.cisco.com/site/us/en/solutions/security/identity-intelligence/index.html |
| Identity Intelligence | XDR | Adds identity threat views and response actions to XDR | https://www.cisco.com/site/us/en/solutions/security/identity-intelligence/index.html |
| Secure Client | Secure Endpoint | Secure Endpoint is offered as a Secure Client module | https://www.cisco.com/site/us/en/products/security/secure-client/index.html |
| Secure Client | XDR | Integration for detection and response | https://www.cisco.com/site/us/en/products/security/secure-client/index.html |
| Secure Client | Secure Access | Secure Client is the single, unified client for Secure Access | https://www.cisco.com/c/en/us/products/collateral/security/secure-access/secure-access-ds.html |
| XDR | ISE | ISE is a listed Cisco-managed integration of XDR | https://www.cisco.com/c/en/us/products/collateral/security/xdr/xdr-ds.html |
| XDR | Duo | Duo is a listed Cisco-managed integration of XDR | https://www.cisco.com/c/en/us/products/collateral/security/xdr/xdr-ds.html |
| XDR | Splunk Platform | Splunk Cloud and Splunk Enterprise are listed XDR integrations, as a source of observations | https://www.cisco.com/c/en/us/products/collateral/security/xdr/xdr-ds.html |
| ISE | Splunk Platform | ISE syslog data collected by the Splunk Add-on for Cisco Identity Services | https://splunkbase.splunk.com/app/1915 |
| Meraki dashboard | Splunk Platform | Meraki data collected by the Cisco Meraki Add-on for Splunk | https://splunkbase.splunk.com/app/5580 |
| ThousandEyes | Splunk Platform | ThousandEyes test results and logs sent by the Cisco ThousandEyes App for Splunk | https://splunkbase.splunk.com/app/7719 |
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
| Firewall | Cyber Vision | Firewall Management Center turns Cyber Vision groups into dynamic objects used in firewall rules | https://www.cisco.com/c/en/us/products/collateral/security/industrial-security/cyber-vision/secure-firewall-cyber-vision-work-together-so.html |
| Firewall | Secure Access | Threat Defense builds the branch IPsec tunnel to Secure Access for secure internet access | https://www.cisco.com/c/en/us/td/docs/security/secure-firewall/cvd/secure-firewall-sdwan-deployment-guide.html |
| Firewall | Network Analytics | Firewall NetFlow and intrusion and malware events feed Secure Network Analytics | https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/zt-network-cloud-dg.html |
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
| XDR | Email Threat Defense | XDR quarantines emails through its Email Threat Defense integration | https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/breach-protection-suite-dg.html |
| XDR | Network Analytics | Listed Cisco integration for network visibility | https://www.cisco.com/site/us/en/products/security/xdr/index.html |
| Cyber Vision | XDR | Report to XDR from Cyber Vision; XDR workflows can assign a security group tag to the asset in ISE | https://www.cisco.com/c/en/us/products/collateral/security/xdr/xdr-cyber-vision-working-together-so.html |
| ThousandEyes | XDR | ThousandEyes returns data to Cisco XDR | https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/Cisco-Secure-Networking-Cloud-Managed-Deployment-Guide.html |
| Meraki dashboard | XDR | XDR integration enabled from the Meraki dashboard, network by network; data flows to XDR | https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/cisco-unified-branch-large-branch-deployment-guide.html |
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
| Secure Access | Splunk Platform | Secure Access pushes security events to Splunk (DNS, web, firewall, IPS, DLP, ZTNA and VPN events) | https://www.cisco.com/c/en/us/td/docs/security/secure-access/secure-access-help/CiscoSecureAccessHelp/secure-access-integrations-intro/push-security-events-integration.html |
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

### Design reference keys

The "Design refs" column below and the backlog use these keys from `DATA.cvd`. For a threat report the date is its
publication date.

| Key | Document | Updated | Kind |
|---|---|---|---|
| snra | [Introduction to the Cisco Secure Networking Architecture](https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/Intro-Cisco-Secure-Network-Architecture.html) | 22 Oct 2026 | Cisco Validated |
| sda | [Cisco Secure Network SD-Access Deployment Guide](https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/Cisco-Secure-Networking-SD-Access-Deployment-Guide.html) | 21 Oct 2026 | Cisco Validated |
| cmc | [Cisco Secure Networking Cloud-Managed Campus Deployment Guide](https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/Cisco-Secure-Networking-Cloud-Managed-Deployment-Guide.html) | 19 Oct 2026 | Cisco Validated |
| ccw | [Cisco Cloud Control Architecture and Operations Technical Whitepaper](https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/Cisco-Cloud-Control-Technical-Whitepaper.html) | 10 Nov 2026 | Cisco Validated |
| ub | [Cisco Unified Branch Design Guide](https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/cisco_unified_branch_design_guide.html) | 3 Nov 2026 | Cisco Validated |
| ubl | [Cisco Unified Branch Large Branch Deployment Guide](https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/cisco-unified-branch-large-branch-deployment-guide.html) | 9 Nov 2026 | Cisco Validated |
| cpol | [Cisco Common Policy Integration Guide](https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/catalyst-center/cisco-validated-solution-profiles/common-policy-integration-guide.html) | 15 Jan 2026 | Cisco Validated |
| ztnc | [Zero Trust: Network and Cloud Security Design Guide](https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/zt-network-cloud-dg.html) | 9 Mar 2023 | Cisco Validated |
| ztud | [Zero Trust: User and Device Security Design Guide](https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/zt-user-device-dg.html) | 11 Apr 2023 | Cisco Validated |
| bpsdg | [Cisco Breach Protection Suite Design Guide](https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/breach-protection-suite-dg.html) | 22 Nov 2023 | Cisco Validated |
| sasedg | [Cisco SASE Design Guide (SSE with Secure Access)](https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/sase-design-guide.html) | 15 Sep 2025 | Cisco Validated |
| sseag | [Cisco SASE and SSE Architecture Guide](https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/sase-sse-ag.html) | 23 Jan 2025 | Cisco Validated |
| fwsdwan | [Cisco Secure Firewall Threat Defense SD-WAN Design and Deployment Guide](https://www.cisco.com/c/en/us/td/docs/security/secure-firewall/cvd/secure-firewall-sdwan-deployment-guide.html) | 30 Sep 2025 | Cisco Validated |
| sdwandg | [Cisco Catalyst SD-WAN Design Guide](https://www.cisco.com/c/en/us/td/docs/solutions/CVD/SDWAN/cisco-sdwan-design-guide.html) | 21 Aug 2024 | Cisco Validated |
| lan | [Campus LAN and Wireless LAN Design Guide](https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/cisco-campus-lan-wlan-design-guide.html) | 4 May 2020 | Cisco Validated |
| isdg | [Industrial Security 3.1 Design Guide (PDF, 254 pages)](https://www.cisco.com/c/dam/en/us/td/docs/Technology/Industrial-Security-3-1-DG.pdf) | Jun 2025 | Cisco Validated |
| indso | [Industrial Security Solution Overview (Cisco Validated)](https://www.cisco.com/c/en/us/products/collateral/security/industrial-security-cvd-so.html) | 12 Feb 2026 | Cisco Validated |
| ztaaag | [Zero Trust Access from Cisco: At a Glance](https://www.cisco.com/c/en/us/products/collateral/security/secure-access/zero-trust-access-aag.html) | 9 Dec 2025 | Reference |
| cvds | [Cisco Cyber Vision Data Sheet](https://www.cisco.com/c/en/us/products/collateral/security/cyber-vision/cyber-vision-ds.html) | 14 Apr 2026 | Reference |
| cvise | [Cisco ISE and Cisco Cyber Vision working together](https://www.cisco.com/c/en/us/products/collateral/security/cyber-vision/ise-cyber-vision-working-together-so.html) | 16 Aug 2024 | Reference |
| cvfw | [Cisco Secure Firewall and Cisco Cyber Vision working together](https://www.cisco.com/c/en/us/products/collateral/security/industrial-security/cyber-vision/secure-firewall-cyber-vision-work-together-so.html) | 14 Nov 2024 | Reference |
| cvxdr | [Cisco XDR and Cisco Cyber Vision working together](https://www.cisco.com/c/en/us/products/collateral/security/xdr/xdr-cyber-vision-working-together-so.html) | 24 Jun 2024 | Reference |
| hmfaag | [Cisco Hybrid Mesh Firewall: At a Glance](https://www.cisco.com/c/en/us/solutions/collateral/security/hybrid-mesh-firewall/hybrid-mesh-firewall-aag.html) | 12 Jun 2026 | Reference |
| n9300 | [Cisco N9300 Series Smart Switches with Cisco Hypershield: At a Glance (PDF)](https://www.cisco.com/c/en/us/products/collateral/switches/9300-series-smart-switches/n9300-series-smart-switch-aag.pdf) | Aug 2026 | Reference |
| mcdag | [Cisco Multicloud Defense Architecture Guide](https://www.cisco.com/c/en/us/products/collateral/security/multicloud-defense/multicloud-defense-ag.html) | 15 Mar 2024 | Reference |
| saise | [Secure Access help: Integrate ISE with Secure Access](https://www.cisco.com/c/en/us/td/docs/security/secure-access/secure-access-help/CiscoSecureAccessHelp/secure-access-integrations-intro/integrate-ise.html) | 8 Nov 2026 | Reference |
| sasdwan | [Secure Access help: Integrate Catalyst SD-WAN with Secure Access](https://www.cisco.com/c/en/us/td/docs/security/secure-access/secure-access-help/CiscoSecureAccessHelp/secure-access-integrations-intro/integrate-catalyst-sd-wan.html) | 8 Nov 2026 | Reference |
| sacii | [Secure Access help: Integrate Cisco Identity Intelligence](https://www.cisco.com/c/en/us/td/docs/security/secure-access/secure-access-help/CiscoSecureAccessHelp/secure-access-integrations-intro/integrate-cisco-identity-intelligence.html) | 8 Nov 2026 | Reference |
| saspl | [Secure Access help: Push Security Events](https://www.cisco.com/c/en/us/td/docs/security/secure-access/secure-access-help/CiscoSecureAccessHelp/secure-access-integrations-intro/push-security-events-integration.html) | 8 Nov 2026 | Reference |
| talosq3 | [Talos: Incident response trends, Q3 2026](https://blog.talosintelligence.com/ir-trends-q3-2026/) | 29 Oct 2026 | Threat report |
| talosq2 | [Talos: Incident response trends, Q2 2026](https://blog.talosintelligence.com/ir-trends-q2-2026/) | 28 Jul 2026 | Threat report |
| talosfmc | [Talos: Active exploitation of Cisco Secure Firewall Management Center vulnerabilities](https://blog.talosintelligence.com/fmc-ongoing-exploitation/) | 9 Sep 2026 | Threat report |
| aidds | [Cisco AI Defense Data Sheet](https://www.cisco.com/c/en/us/products/collateral/security/ai-defense/ai-defense-ds.html) | 26 Oct 2026 | Reference |
| epds | [Cisco Secure Endpoint Data Sheet](https://www.cisco.com/c/en/us/products/collateral/security/fireamp-endpoints/datasheet-c78-733181.html) | 11 Dec 2024 | Reference |
| mcdug | [Cisco Multicloud Defense User Guide: Network Intrusion (IDS/IPS) Profile](https://www.cisco.com/c/en/us/td/docs/security/cdo/multicloud-defense/user-guide/cisco-multicloud-defense-userguide/g-security-profiles/c-network-intrusion-ids-ips.html) | 8 Jul 2026 | Reference |
| duoph | [Duo: End-to-end phishing resistance](https://duo.com/solutions/phishing-prevention) | no date on the page | Reference |
| ciics | [Cisco Identity Intelligence Knowledge Base: Compromised Session check](https://docs.oort.io/understanding-check-failures/oort-insights/identity-threat-detection-insights/compromised-session) | no date on the page | Reference |

### Path rules

The most specific matching rule wins (ties: the later rule). `@loc` / `@dest` are the chosen location and destination.

| Rule | When | Nodes |
|---|---|---|
| AC-0 (access) | always | @loc |
| AC-remote (access) | location ∈ {home, public, travel} | @loc |
| AC-internet (access) | location ∈ {internet} | internet |
| AC-hq (access) | location ∈ {hq} | hq → wireless → switches → core |
| AC-hq-wired (access) | device ∈ {headless}; location ∈ {hq} | hq → switches → core |
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
| RT-inet-guest (route) | who ∈ {guest}; location ∈ {hq, branch, factory}; destination ∈ {saas, shadow, web_safe, web_risky, web_mal, ai, pubai, mail} | sdwan → @dest |
| RT-inet-workload (route) | device ∈ {server}; destination ∈ {saas, shadow, web_safe, web_risky, web_mal, ai, pubai, mail} | fw → @dest |
| RT-inet-internet (route) | location ∈ {internet}; destination ∈ {saas, shadow, web_safe, web_risky, web_mal, ai, pubai, mail} | @dest |
| RT-ot (route) | destination ∈ {ot} | fw → industrial → otctl |
| RT-ot-factory (route) | location ∈ {factory}; destination ∈ {ot} | otctl |
| RT-ot-remote (route) | location ∈ {home, public, travel}; destination ∈ {ot} | sea → industrial → otctl |

### Checkpoint rules

Every matching rule fires in path order. Verdict = highest severity among fired rules (ALLOW < ALLOW WITH LIMITS < STEP-UP < BLOCK < CONTAIN); with none, ALLOW. STEP-UP, BLOCK and CONTAIN on the path stop traffic at that hop.

| Rule | When | Checked by | At hop | What is checked → result | Trust | Verdict | Design refs |
|---|---|---|---|---|---|---|---|
| N1 | device ∉ {headless, server}; who ∉ {guest, attacker}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Network access control → User and device authenticated to the network; segment assigned from identity | +5 (Network identity established) | — | sda, ztnc |
| N2 | device ∈ {headless}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Endpoint profiling → Headless device profiled and placed in a least-privilege segment | +5 (Device profiled) | ALLOW WITH LIMITS | sda |
| N3 | who ∈ {guest}; destination ∈ {saas, shadow, web_safe, web_risky, web_mal, ai, pubai, mail}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Guest access → Guest identity mapped to an internet-only segment that breaks out locally, outside the Secure Access tunnels | — | ALLOW WITH LIMITS | ubl |
| N4 | who ∈ {guest}; destination ∈ {dcapp, cloudapp, eastwest, intai, ot}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Guest segmentation → The guest segment has no path to internal resources | -10 (Out-of-scope request) | BLOCK | sda |
| N5 | who ∈ {iot, ot}; destination ∈ {dcapp, cloudapp, intai}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Device segmentation → Destination is outside what this device profile may reach | -10 (Out-of-profile destination) | BLOCK | — |
| N6 | who ∈ {iot}; destination ∈ {ot}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Device segmentation → IT-side device has no path into the industrial zone | -10 (Out-of-profile destination) | BLOCK | — |
| N7 | who ∈ {ot}; destination ∈ {saas, shadow, web_safe, web_risky, web_mal, ai, pubai, mail}; path includes {industrial} | ISE (with Cyber Vision) | industrial | Zones and conduits → The Cyber Vision zone has no conduit to the internet; ISE enforces it through the asset’s security group tag | -10 (Out-of-zone destination) | BLOCK | isdg, cvise, indso |
| P1 | device ∈ {mgd, mobile}; location ∈ {hq, branch, factory}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Device posture → Managed device meets compliance policy | +5 (Posture compliant) | — | — |
| P2 | who ∈ {emp, admin, exec, contractor, insider, attacker}; device ∈ {mgd, mobile}; location ∈ {home, public, travel} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | Device trust → Managed, healthy device confirmed | +5 (Trusted device) | — | — |
| P3 | device ∈ {stale}; location ∈ {hq, branch, factory}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Device posture → ISE posture module in Secure Client reports the device out of date; it fails compliance policy | -15 (Posture non-compliant) | ALLOW WITH LIMITS | ztud, sasedg |
| P4 | device ∈ {stale}; location ∈ {home, public, travel} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | Device trust → Device is out of date: the user is warned, and blocked once it falls too far behind the device-health policy | -15 (Posture non-compliant) | ALLOW WITH LIMITS | ztud |
| P5 | who ∈ {emp, admin, exec, contractor, insider}; device ∈ {byod, claptop} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | Device trust → Device is not managed by the organisation; trust not established | -10 (Unmanaged device) | ALLOW WITH LIMITS | ztud |
| M6 | who ∈ {emp, admin, exec, contractor, insider, attacker}; behaviour any of {fatigue} | Identity Intelligence | sa / sea / switches / industrial / sdwan / client / @dst | Identity analytics → Abnormal authentication pattern flagged on the account | -10 (Identity risk raised) | STEP-UP | — |
| M7 | who ∈ {emp, admin, exec, contractor, insider, attacker}; behaviour any of {stolen} | Identity Intelligence | sa / sea / switches / industrial / sdwan / client / @dst | Identity analytics → Valid password presented from an unfamiliar context: high-risk sign-in | -25 (Credential risk) | STEP-UP | — |
| M8 | who ∈ {emp, admin, exec, contractor, insider, attacker}; location ∈ {travel} | Identity Intelligence | sa / sea / switches / industrial / sdwan / client / @dst | Sign-in context → Location is inconsistent with the account’s recent activity | -20 (Impossible travel) | STEP-UP | — |
| M9 | who ∈ {emp, admin, exec, contractor, insider, attacker}; behaviour any of {offhours} | Identity Intelligence | sa / sea / switches / industrial / sdwan / client / @dst | Access pattern → Access time is outside the identity’s normal pattern | -8 (Unusual time of access) | — | — |
| M11 | who ∈ {emp, admin, exec, contractor, insider, attacker}; behaviour any of {aitm} | Identity Intelligence | sa / sea / switches / industrial / sdwan / client / @dst | Compromised session check → The same active session is in use from a second address and browser: flagged as a stolen, replayed session cookie | -25 (Compromised session) | STEP-UP | ciics, talosq2 |
| M1 | who ∈ {emp, exec, contractor, insider}; behaviour none of {mfa_fail, fatigue, stolen, aitm} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | User authentication → User verified with phishing-resistant MFA | +10 (MFA passed) | — | — |
| M1b | who ∈ {emp, admin, exec, contractor, insider, attacker}; behaviour all of {stolen, mfa_ok} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | User authentication → MFA challenge completed | +5 (MFA passed) | — | — |
| M2 | who ∈ {admin}; behaviour any of {mfa_ok}; behaviour none of {stolen} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | Privileged authentication → Administrator verified with fresh phishing-resistant MFA | +10 (MFA passed) | — | — |
| M3 | who ∈ {admin}; behaviour none of {mfa_ok, mfa_fail, fatigue, aitm} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | Privileged session → Privileged access requires fresh strong authentication | -5 (Fresh authentication required) | STEP-UP | — |
| M4 | who ∈ {emp, admin, exec, contractor, insider, attacker}; behaviour any of {mfa_fail} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | User authentication → MFA not completed; no session issued | -30 (MFA failed) | BLOCK | — |
| M5 | who ∈ {emp, admin, exec, contractor, insider, attacker}; behaviour any of {fatigue} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | Push-bombing resistance → Verified Duo Push needs a code from the sign-in screen, so repeated prompts cannot be approved blindly; sign-in refused | -25 (MFA fatigue pattern) | BLOCK | — |
| M12 | who ∈ {emp, admin, exec, contractor, insider, attacker}; behaviour any of {aitm} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | Session theft protection → Duo Passport keeps no session cookie in the sign-in flow; proof of sign-in is bound to the user’s own device, so the replay from another device is refused | -20 (Replayed session refused) | BLOCK | duoph, talosq2 |
| M10 | who ∈ {attacker}; behaviour none of {stolen, aitm} | Duo | sa / sea / switches / industrial / sdwan / client / @dst | User authentication → No valid identity presented | -20 (Unauthenticated request) | BLOCK | — |
| S1 | who ∈ {contractor}; destination ∈ {dcapp, cloudapp}; path includes {sa} | Secure Access | sa | Zero trust access → Access granted to the one approved application, not to the network | — | ALLOW WITH LIMITS | sasedg, ztud |
| S1b | who ∈ {contractor}; destination ∈ {dcapp, cloudapp}; path includes {switches, industrial, sdwan}; path lacks {sa} | ISE | switches / industrial / sdwan | Contractor segmentation → Contractor segment permits only the approved application | — | ALLOW WITH LIMITS | — |
| S2 | who ∈ {contractor}; destination ∈ {eastwest, intai}; path includes {sa} | Secure Access | sa | Zero trust access → Requested resource is not among the contractor’s granted applications | -15 (Out-of-scope request) | BLOCK | ztud |
| S2b | who ∈ {contractor}; destination ∈ {eastwest, intai}; path includes {switches, industrial, sdwan}; path lacks {sa} | ISE | switches / industrial / sdwan | Contractor segmentation → Requested resource is outside the contractor segment | -15 (Out-of-scope request) | BLOCK | — |
| S3 | path includes {sea} | Secure Equipment Access | sea | Remote equipment access → Least-privilege session to the named asset only, after MFA or SSO, an access manager’s approval and within a scheduled time window | — | ALLOW WITH LIMITS | isdg, cvds |
| S4 | behaviour any of {priv}; path includes {sa} | Secure Access | sa | Least-privilege access → Requested privilege exceeds what the identity’s role allows | -15 (Excess privilege request) | BLOCK | — |
| S5 | behaviour any of {priv}; path includes {nexus}; path lacks {sa} | Secure Workload | nexus | Microsegmentation policy → Flow is outside the workload’s allowed communication policy | -15 (Excess privilege request) | BLOCK | — |
| S6 | behaviour any of {priv}; path lacks {sa, nexus} | Identity Intelligence | switches / industrial / sdwan / @dst | Privilege analytics → Privilege request exceeds the role and is flagged as risky | -15 (Excess privilege request) | BLOCK | — |
| X1 | who ∈ {attacker}; behaviour none of {exploit}; path includes {fw} | Firewall (with Talos) | fw | Inbound threat prevention → Unsolicited inbound connection denied; known attack patterns blocked using Talos intelligence | -25 (Hostile inbound traffic) | BLOCK | — |
| X2 | who ∈ {attacker}; path includes {waap} | WAAP | waap | Application and API protection → Malicious requests and automated-client patterns filtered in front of the application | -25 (Application attack pattern) | BLOCK | — |
| X3 | who ∈ {attacker}; path includes {mcd} | Multicloud Defense | mcd | Cloud ingress protection → Inbound attack blocked at the cloud gateway | -20 (Hostile inbound traffic) | BLOCK | — |
| X4 | who ∈ {attacker}; path includes {nexus} | Hypershield | nexus | Vulnerability shielding (illustrative) → A compensating control shields the exposed workload from exploitation | -20 (Exploit attempt) | BLOCK | — |
| XP1 | behaviour any of {exploit}; destination ∉ {ot}; path includes {fw} | Firewall (with Talos) | fw | Intrusion prevention → Exploit attempt for a known vulnerability matches a Snort rule published by Talos; the connection is dropped | -25 (Exploit attempt) | BLOCK | talosfmc, talosq3, isdg |
| XP2 | destination ∈ {ot}; behaviour any of {exploit}; path includes {fw} | Firewall (with Cyber Vision and Talos) | fw | Virtual patching → Cyber Vision lists the controller’s known vulnerabilities; the matching intrusion prevention policy is enabled on the firewall at the IT/OT boundary and drops the exploit | -25 (Exploit attempt) | BLOCK | isdg |
| XP3 | behaviour any of {exploit}; path includes {mcd} | Multicloud Defense (with Talos) | mcd | Cloud intrusion prevention → Exploit attempt matches a Talos rule in the gateway’s intrusion profile and is denied | -20 (Exploit attempt) | BLOCK | mcdug |
| XP4 | behaviour any of {exploit}; who ∉ {attacker}; destination ∉ {ot}; path includes {nexus} | Hypershield | nexus | Vulnerability shielding (illustrative) → A compensating control shields the exposed workload from exploitation | -20 (Exploit attempt) | BLOCK | — |
| XP5 | behaviour any of {exploit}; path includes {industrial} | Cyber Vision (with Talos) | industrial | OT intrusion detection → Cyber Vision’s Snort intrusion detection engine matches the exploit against Talos rules and raises an alert | -20 (Exploit attempt) | — | cvds |
| T1a | device ∈ {compromised}; behaviour none of {scan, ransom, exfil} | Secure Endpoint | @src | Endpoint detection → Malware detected on the device; host isolated from the network | -45 (Malware on device) | CONTAIN | bpsdg |
| T1b | device ∈ {compromised}; behaviour any of {scan, exfil} | Secure Endpoint | @src | Endpoint detection → Malicious activity observed on the device; telemetry raised | -30 (Malware on device) | — | — |
| T8 | device ∈ {mgd, stale, mobile, compromised}; behaviour any of {ransom} | Secure Endpoint | @src | Endpoint detection and response → Ransomware behaviour detected; host isolated | -45 (Ransomware behaviour) | CONTAIN | bpsdg |
| T2 | behaviour any of {scan}; path includes {switches, nexus} | Network Analytics | switches / nexus | Network behaviour analytics → Scanning and lateral-movement pattern detected from this host | -25 (Lateral-movement behaviour) | — | ztnc |
| T5 | behaviour any of {scan}; path includes {industrial} | Cyber Vision | industrial | OT threat detection → Abnormal scanning traffic seen by the sensor in the industrial network | -20 (Lateral-movement behaviour) | — | — |
| T3 | behaviour any of {scan}; who ∉ {attacker}; device ∉ {server}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Containment → Adaptive Network Control quarantine sent to ISE over pxGrid; a Change of Authorization moves the endpoint to a quarantine security group | -15 (Endpoint quarantined) | CONTAIN | ztnc, sda |
| T4 | behaviour any of {scan}; path includes {sa}; path lacks {switches, industrial, sdwan} | Secure Access | sa | Zero trust access → Only the granted application is reachable; there is no network path to scan | -15 (Lateral-movement behaviour) | BLOCK | — |
| T6 | behaviour any of {scan, ransom}; path includes {nexus} | Secure Workload | nexus | Microsegmentation → Flow to other workloads denied outside the allowed policy | -10 (Segment boundary hit) | BLOCK | — |
| T7 | behaviour any of {scan, exfil}; path includes {mcd} | Multicloud Defense | mcd | Cloud east-west and egress control → Lateral-movement or exfiltration traffic blocked at the cloud gateway | -15 (Malicious cloud traffic) | BLOCK | — |
| T11 | behaviour any of {exfil}; path includes {switches, nexus} | Network Analytics | switches / nexus | Encrypted traffic analytics → Exfiltration pattern identified in encrypted traffic without decryption | -25 (Exfiltration behaviour) | — | ztnc |
| T12 | behaviour any of {exfil}; path includes {sa} | Secure Access | sa | DNS and internet egress control → Covert channel to the external destination blocked | -15 (Exfiltration behaviour) | BLOCK | — |
| T13 | behaviour any of {exfil}; who ∉ {attacker}; path includes {fw} | Firewall | fw | Encrypted Visibility Engine → Malicious encrypted flow identified and blocked without decryption | -15 (Exfiltration behaviour) | BLOCK | snra |
| T14 | behaviour any of {anomaly}; path includes {industrial} | Cyber Vision | industrial | OT behaviour baseline → Communication deviates from the asset’s recorded behaviour | -25 (OT anomaly) | — | isdg, cvds |
| W9 | destination ∈ {web_safe, web_risky, web_mal}; behaviour any of {anomaly}; path includes {sa} | Secure Access | switches / industrial / sdwan | DNS-layer security → Lookup of an unknown internet host flagged and the connection denied before it is made | -10 (Suspicious destination) | BLOCK | — |
| T15 | behaviour any of {anomaly}; path includes {switches} | Network Analytics | switches | Behavioural analytics → Device traffic no longer matches its expected behaviour | -20 (IoT anomaly) | — | — |
| T16 | behaviour any of {anomaly}; path includes {switches, industrial, sdwan} | ISE | switches / industrial / sdwan | Containment → Device no longer matches its profile; an Adaptive Network Control quarantine and a Change of Authorization move it to a quarantine security group | -20 (Profile mismatch) | CONTAIN | ztnc, sda, isdg |
| E1 | behaviour any of {phish} | Email Threat Defense | @src | Email threat detection → Phishing message identified and remediated from the mailbox after delivery | -5 (Phishing email) | — | bpsdg |
| W2 | destination ∈ {web_mal}; path includes {sa} | Secure Access | sa | Secure internet access → DNS-layer and web security: known malicious destination denied before a connection is made | -20 (Malicious destination) | BLOCK | — |
| W2p | behaviour any of {phish}; path includes {sa} | Secure Access | sa | Secure internet access → Phishing destination denied by threat policy | -15 (Phishing link clicked) | BLOCK | — |
| W2f | destination ∈ {saas, shadow, web_safe, web_risky, web_mal, ai, pubai, mail}; behaviour any of {malfile}; path includes {sa} | Secure Access | sa | Secure internet access → Malicious download denied by threat policy | -15 (Malicious download) | BLOCK | — |
| W3 | destination ∈ {web_mal}; path includes {fw}; path lacks {sa} | Firewall (with Talos) | fw | Egress threat prevention → Outbound connection to a known malicious destination blocked using Talos intelligence | -20 (Malicious destination) | BLOCK | — |
| W4 | destination ∈ {web_risky}; path includes {sa} | Secure Access | sa | Web category policy → Risky category: page opened through Remote Browser Isolation, away from the device | -5 (Risky web category) | ALLOW WITH LIMITS | — |
| W5 | destination ∈ {shadow}; path includes {sa} | Secure Access | sa | Shadow IT control (CASB) → Unsanctioned application identified by the cloud access security broker; use restricted | -10 (Unsanctioned application) | ALLOW WITH LIMITS | — |
| W6 | destination ∈ {shadow, web_safe, web_risky, web_mal, pubai}; behaviour any of {upload}; path includes {sa} | Secure Access | sa | Data Loss Prevention → Sensitive upload to an unapproved destination denied by the data loss prevention policy | -15 (Sensitive data upload) | BLOCK | sasedg |
| W7 | destination ∈ {saas, ai}; behaviour any of {upload}; path includes {sa} | Secure Access | sa | Data movement policy → Upload to a sanctioned application evaluated and logged | -5 (Sensitive data upload) | — | — |
| W8 | who ∈ {insider}; behaviour any of {upload}; path includes {switches, nexus} | Network Analytics | switches / nexus | Insider-threat analytics → Unusually large data movement by this user detected | -20 (Bulk data movement) | ALLOW WITH LIMITS | — |
| A1 | destination ∈ {ai}; path includes {sa} | Secure Access | sa | AI access policy → Approved AI application permitted for this user | — | — | — |
| A2 | destination ∈ {pubai}; path includes {sa} | Secure Access | sa | Shadow AI control (CASB) → Unapproved generative AI application detected and blocked | -10 (Unapproved AI tool) | BLOCK | — |
| A3 | destination ∈ {ai, pubai}; behaviour any of {aipaste}; path includes {sa} | Secure Access | sa | AI Access data-loss control → Confidential data detected in the prompt to a third-party AI app; prompt not sent | -15 (Sensitive data in prompt) | BLOCK | — |
| A4 | destination ∈ {intai}; behaviour any of {aipaste} | AI Defense | @dst | AI data-leakage guardrail → Sensitive content in the prompt flagged and logged | -5 (Sensitive data in prompt) | ALLOW WITH LIMITS | — |
| A5 | destination ∈ {intai}; behaviour any of {inject} | AI Defense | @dst | AI runtime guardrail → Prompt-injection pattern detected; request rejected | -25 (Prompt injection attempt) | BLOCK | — |
| A7 | destination ∈ {intai}; behaviour any of {agentic} | AI Defense | @dst | Agent runtime protection → Tool call inspected in the agent’s MCP traffic: the tool is outside the allowlist and the call is blocked | -25 (Unsafe agent action) | BLOCK | aidds |
| A6 | destination ∈ {intai}; behaviour none of {inject, aipaste, agentic} | AI Defense | @dst | AI runtime protection → Model interaction covered by runtime guardrails | — | — | — |
| B1 | path includes {wireless} | Wi-Fi 7 | wireless | Air link → WPA3-protected wireless association | — | — | — |
| B2 | path includes {client} | Secure Client | client | Device tunnel → Secure Client, the unified client for Secure Access, opens the VPN / zero trust access session | — | — | sasedg |
| B3 | who ∉ {guest}; path includes {sdwan} | Secure Routers · SD-WAN | sdwan | WAN transport → Traffic carried in the encrypted, segmented SD-WAN overlay | — | — | sdwandg |
| B3g | who ∈ {guest}; path includes {sdwan} | Secure Routers · SD-WAN | sdwan | Local internet breakout → Guest traffic leaves through the router’s own internet uplink, outside the Secure Access tunnels | — | — | ub, ubl |
| W3r | destination ∈ {web_mal}; path includes {sdwan}; path lacks {sa} | Secure Routers · SD-WAN | sdwan | Threat protection → Content filtering and threat protection on the secure router block a known malicious destination at the local breakout | -20 (Malicious destination) | BLOCK | ubl |
| W3f | destination ∈ {saas, shadow, web_safe, web_risky, web_mal, ai, pubai, mail}; behaviour any of {malfile, phish}; path includes {sdwan}; path lacks {sa} | Secure Routers · SD-WAN | sdwan | Threat protection → Threat protection on the secure router blocks the malicious download or phishing link at the local breakout | -15 (Malicious download) | BLOCK | ubl |
| B4 | path includes {sa} | Secure Access | sa | User-to-app policy → Session evaluated against identity, device and destination policy at the cloud edge | — | — | sasedg |
| B5 | who ∉ {attacker}; path includes {fw} | Firewall | fw | Traffic inspection → Flow inspected; encrypted traffic assessed without decryption | — | — | — |
| B6 | path includes {mcd} | Multicloud Defense | mcd | Cloud gateway → Ingress, egress and east-west policy applied in the cloud network | — | — | — |
| B7 | path includes {nexus} | Hypershield | nexus | Workload-edge segmentation → Flow checked against segmentation policy on the smart switch | — | — | n9300 |
| B8 | destination ∈ {dcapp, eastwest, intai}; path includes {nexus} | Secure Workload | nexus | Workload policy → Flow matches the workload’s allowed communication policy | — | — | — |
| B9 | path includes {industrial} | Cyber Vision | industrial | OT visibility → Asset and its communications inventoried by the embedded sensor | — | — | isdg, cvds |
| B10 | destination ∈ {mail} | Email Threat Defense | @dst | Mail protection → Messages scanned for threats before they reach the mailbox | — | — | — |
| O1 | behaviour any of {slow} | ThousandEyes | wireless / switches / sdwan / client / @src | Owned-network path → Access and WAN segments measured from the user’s vantage point: healthy | — | — | — |
| O2 | behaviour any of {slow}; path includes {sa} | ThousandEyes | sa | Access-flow correlation → Digital experience correlated with the Secure Access session | — | — | sasedg |
| O3 | behaviour any of {slow} | ThousandEyes | after path | Fault localisation → Degradation located on a network segment the organisation does not own | — | — | — |
| F1 | device ∈ {mgd, stale, mobile, compromised}; behaviour any of {malfile} | Secure Endpoint | after path | Endpoint file protection → Malicious file blocked and quarantined on the device | -15 (Malicious download) | BLOCK | — |
| E2 | who ∈ {emp, admin, exec, contractor, insider, attacker}; behaviour any of {phish} | Duo | after path | Phishing-resistant authentication → A captured password cannot be replayed without the phishing-resistant factor | — | — | — |
| T9 | location ∈ {hq, branch, factory}; behaviour any of {ransom}; device ∉ {server} | ISE | after path | Containment → Adaptive Network Control quarantine sent to ISE over pxGrid; a Change of Authorization moves the endpoint to a quarantine security group | -10 (Endpoint quarantined) | CONTAIN | ztnc, sda |
| T10 | behaviour any of {ransom} | Hypershield | after path | Segment boundary → Stateful segmentation near workloads keeps the outbreak inside one segment | — | — | n9300 |
| R1 | device ∈ {mgd, stale, mobile, compromised}; behaviour any of {rmm} | Secure Endpoint | after path | Behavioural protection (illustrative) → After the remote-control session starts, scripted commands and a newly installed remote-management agent match attack patterns on the device | -20 (Remote-control abuse) | — | epds, talosq3 |
| Z1 | always; needs earlier telemetry | XDR | after path | Cross-domain correlation → Telemetry correlated into one prioritised incident with guided response | -5 (Incident opened) | — | bpsdg |
| Z2 | behaviour any of {scan, ransom, exfil, rmm}; who ∉ {attacker}; path lacks {industrial}; needs earlier telemetry | XDR (with Secure Endpoint) | after path | Response action → Host isolation requested in Secure Endpoint from the incident, manually or by an automation workflow | — | CONTAIN | bpsdg |
| Z2-rmm | behaviour any of {rmm}; path includes {industrial}; needs earlier telemetry | XDR (with Secure Endpoint) | after path | Response action → Host isolation requested in Secure Endpoint from the incident, manually or by an automation workflow | — | CONTAIN | bpsdg |
| Z2-ot | behaviour any of {scan, anomaly}; who ∉ {attacker}; path includes {industrial}; needs earlier telemetry | XDR (with ISE) | after path | Response workflow → Cyber Vision reports the incident to XDR; a workflow assigns a security group tag in ISE that stops the asset communicating | — | CONTAIN | cvxdr |
| Z2-otx | location ∈ {factory}; behaviour any of {exploit}; behaviour none of {ransom}; device ∉ {compromised}; path includes {industrial}; needs earlier telemetry | XDR (with ISE) | after path | Response workflow → Cyber Vision reports the intrusion event to XDR; a workflow assigns a security group tag in ISE that stops the source communicating | — | CONTAIN | cvxdr |
| Z2-otxc | device ∈ {compromised}; location ∈ {factory}; behaviour all of {exploit, exfil}; behaviour none of {ransom, scan}; path includes {industrial}; needs earlier telemetry | XDR (with ISE) | after path | Response workflow → Cyber Vision reports the intrusion event to XDR; a workflow assigns a security group tag in ISE that stops the source communicating | — | CONTAIN | cvxdr |
| Z3 | behaviour any of {ransom}; needs earlier telemetry | XDR | after path | Recovery → Affected host can be restored from a last-known-good snapshot | — | — | — |
| SP1 | always | Splunk Platform | after path | Data platform → Logs and events from the connected Cisco sources are ingested, searchable and retained | — | — | — |
| SP2 | always | Enterprise Security | after path | SIEM detection → Events correlated and prioritised with risk-based alerting, mapped to MITRE ATT&CK | — | — | — |
| SP3 | always | Splunk SOAR | after path | Response automation → Playbook automates enrichment, case creation and response tasks for the analyst | — | — | — |
| SP8 | behaviour any of {scan, ransom, exfil, anomaly}; who ∉ {attacker} | Splunk SOAR | after path | Automated response action → Playbook acts on connected Cisco products: quarantine through ISE, host isolation through Secure Endpoint, or a block on the firewall | — | CONTAIN | — |
| SP4 | behaviour any of {phish, malfile} | Attack Analyzer (with Talos) | after path | Automated threat analysis → Suspected link or file followed through its attack chain to a verdict, using Talos intelligence | — | — | — |
| SP5 | behaviour any of {slow} | Observability Cloud | after path | Full-stack observability → Application, infrastructure and user-experience telemetry reviewed alongside the ThousandEyes network view | — | — | — |
| SP6 | destination ∈ {dcapp, cloudapp}; behaviour any of {slow} | AppDynamics | after path | Application-layer view → Application performance combined with network-path data to separate app faults from network faults | — | — | — |
| SP7 | behaviour any of {slow} | ITSI | after path | Service health → Related alerts grouped into one episode with a service health score for the affected service | — | — | — |
| O4 | behaviour any of {push} | Security Cloud Control | after path | Policy authoring → Security intent authored in Security Cloud Control for the enforcement points it manages | — | — | — |
| O5-fw | behaviour any of {push} | Firewall | after path | Policy distribution → Enforcement point receives the policy from Security Cloud Control | — | — | — |
| O5-mcd | behaviour any of {push} | Multicloud Defense | after path | Policy distribution → Enforcement point receives the policy from Security Cloud Control | — | — | — |
| O5-hs | behaviour any of {push} | Hypershield | after path | Policy distribution → Enforcement point receives the policy from Security Cloud Control | — | — | — |
| O5-sa | behaviour any of {push} | Secure Access | after path | Policy distribution → Enforcement point receives the policy from Security Cloud Control | — | — | — |
| O5-wl | behaviour any of {push} | Secure Workload | after path | Policy distribution → Enforcement point receives the policy from Security Cloud Control | — | — | — |
| O5-aid | behaviour any of {push} | AI Defense | after path | Policy distribution → Enforcement point receives the policy from Security Cloud Control | — | — | — |
| O5-sdwan | behaviour any of {push} | Secure Routers · SD-WAN | after path | Policy distribution → Router firewall policy received from Security Cloud Control; SD-WAN overlay policy stays in Catalyst SD-WAN Manager (or the Meraki dashboard for a Meraki MX) | — | — | sdwandg, ub |

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
| beh | who ∈ {iot, ot, aiagent, guest} | not {mfa_ok, mfa_fail, fatigue, stolen, aitm} | No interactive sign-in for this identity. |
| beh | who ∈ {iot, ot, aiagent} | not {phish, malfile} | Needs a human user. |
| beh | device ∈ {byod, claptop, headless, server} | not {rmm} | Modelled on a device the organisation manages and its help desk supports. |
| beh | destination ∈ {saas, shadow, web_safe, web_risky, web_mal, ai, pubai, mail} | not {exploit} | Modelled against a system the organisation runs: a private app, an internal server, the internal AI model or an OT controller. |
| beh | destination ∈ {dcapp, cloudapp, saas, shadow, web_safe, web_risky, web_mal, eastwest, ot, mail} | not {aipaste, inject, agentic} | Needs an AI destination. |
| beh | destination ∈ {ai, pubai} | not {inject} | Prompt injection is modelled against an AI app the organisation runs; choose the internal AI model. |
| beh | destination ∈ {ai, pubai} | not {agentic} | Agent tool calls are modelled against an AI agent the organisation runs; choose the internal AI model. |
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
| 31 | Phishing proxy steals a session, attacker replays it | attacker · byod · internet · saas · [stolen, aitm] | BLOCK |
| 32 | Fake help-desk call, user starts a remote session | emp · mgd · hq · eastwest · [rmm, scan] | CONTAIN |
| 33 | Ransomware crew disables the endpoint agent, steals data, then encrypts | emp · compromised · hq · web_risky · [exfil, ransom] · without Secure Endpoint | CONTAIN |
| 34 | Exploit of an internet-facing system with a known CVE | attacker · byod · internet · dcapp · [exploit] | BLOCK |
| 35 | Vendor laptop launches a known PLC exploit | contractor · claptop · hq · ot · [exploit] | BLOCK |
| 36 | Poisoned tool steers an internal AI agent | aiagent · server · hq · intai · [agentic] | BLOCK |
| 37 | Stolen vendor login tries remote access to a factory machine | attacker · byod · travel · ot · [mfa_fail, stolen] | BLOCK |
| 38 | Agency collaboration: managed laptop at home → sanctioned SaaS, MFA passed | emp · mgd · home · saas · [mfa_ok] | ALLOW |
| 39 | Community broadband: branch sensor talks to an internal server | iot · headless · branch · eastwest · [anomaly] | CONTAIN |
| 40 | Transportation infrastructure: mobile worker on public Wi-Fi → private app, MFA passed | emp · mobile · public · dcapp · [mfa_ok] | ALLOW |
| 41 | Enterprise solution delivery: branch user, a private cloud app is slow | emp · mgd · branch · cloudapp · [slow] | ALLOW |
| 42 | Critical infrastructure resiliency: employee at HQ → an internal server | emp · mgd · hq · eastwest · [norm] | ALLOW |
| 43 | Connected justice: executive at home → sanctioned SaaS, MFA passed | exec · mgd · home · saas · [mfa_ok] | ALLOW |
| 44 | Public safety and emergency response: mobile worker on public Wi-Fi → sanctioned SaaS, MFA passed | emp · mobile · public · saas · [mfa_ok] | ALLOW |
| 45 | Operations centers: administrator at HQ → an internal server | admin · mgd · hq · eastwest · [norm] | STEP-UP |
| 46 | Trusted Internet connections: branch user opens a safe site vs a malicious site | emp · mgd · branch · web_safe · [norm] | ALLOW vs BLOCK |
| 47 | Patient engagement: employee at HQ, sanctioned SaaS is slow | emp · mgd · hq · saas · [slow] | ALLOW |
| 48 | Remote patient room monitoring: campus sensor behaves unlike its profile | iot · headless · hq · eastwest · [anomaly] | CONTAIN |
| 49 | Mobile digital experiences: mobile worker at a branch → private app, MFA passed | emp · mobile · branch · dcapp · [mfa_ok] | ALLOW |
| 50 | Clinical communications: mobile worker at home → sanctioned SaaS, MFA passed | emp · mobile · home · saas · [mfa_ok] | ALLOW |
| 51 | Digital experiences and wayfinding: campus sensor reaches a private cloud app | iot · headless · hq · cloudapp · [norm] | BLOCK |
| 52 | Claims automation: employee pastes data into an internal AI model | emp · mgd · hq · intai · [aipaste] | ALLOW WITH LIMITS |
| 53 | Care environment safety: branch sensor talks to a risky internet host | iot · headless · branch · web_risky · [anomaly] | CONTAIN |
| 54 | Smart and sustainable hospitals: branch sensor talks to an internal server | iot · headless · branch · eastwest · [norm] | ALLOW WITH LIMITS |
| 55 | AI-assisted design: workload in the data center → a private cloud app | aiagent · server · hq · cloudapp · [norm] | ALLOW |
| 56 | Machine vision: factory sensor behaves unlike its profile | iot · headless · factory · eastwest · [anomaly] | CONTAIN |
| 57 | Predictive maintenance: worker on the factory floor, an internal server is slow | emp · mgd · factory · eastwest · [slow] | ALLOW |
| 58 | Quality inspection: factory sensor reaches an OT controller, unlike its profile | iot · headless · factory · ot · [anomaly] | CONTAIN |
| 59 | Advanced warehouse operations: factory OT device behaves unlike its profile | ot · headless · factory · eastwest · [anomaly] | CONTAIN |
| 60 | Industrial mobility: factory sensor talks to an internal server | iot · headless · factory · eastwest · [norm] | ALLOW WITH LIMITS |
| 61 | Software-defined automation: factory OT device talks to an internal server | ot · headless · factory · eastwest · [norm] | ALLOW WITH LIMITS |
| 62 | Energy control: factory sensor reaches a private app in the data center | iot · headless · factory · dcapp · [anomaly] | CONTAIN |
| 63 | Inventory management (factory): factory sensor reaches a private cloud app | iot · headless · factory · cloudapp · [norm] | BLOCK |
| 64 | Data collection: factory sensor talks to a risky internet host | iot · headless · factory · web_risky · [anomaly] | CONTAIN |
| 65 | Worker upskilling: managed laptop at home → private app, MFA passed | emp · mgd · home · dcapp · [mfa_ok] | ALLOW |
| 66 | Workforce augmentation: factory sensor reaches sanctioned SaaS, unlike its profile | iot · headless · factory · saas · [anomaly] | CONTAIN |
| 67 | Loss prevention: insider at a branch uploads data outside working hours | insider · mgd · branch · dcapp · [offhours, upload] | ALLOW WITH LIMITS |
| 68 | Omnichannel visibility: worker at home, a private cloud app is slow | emp · mgd · home · cloudapp · [slow] | ALLOW |
| 69 | Supply chain visibility: branch user, an internal server is slow | emp · mgd · branch · eastwest · [slow] | ALLOW |
| 70 | Associate engagement: executive on public Wi-Fi → private app, MFA passed | exec · mobile · public · dcapp · [mfa_ok] | ALLOW |
| 71 | Digital merchandising: insider pastes data into an internal AI model | insider · mgd · hq · intai · [aipaste] | ALLOW WITH LIMITS |
| 72 | Hologram store associate: employee at home uses the approved AI assistant | emp · mgd · home · ai · [norm] | ALLOW |
| 73 | Intelligent contact center: branch user uses the approved AI assistant | emp · mgd · branch · ai · [norm] | ALLOW |
| 74 | Mobile engagement: mobile worker at home → private app, MFA passed | emp · mobile · home · dcapp · [mfa_ok] | ALLOW |
| 75 | Demand forecasting: mobile worker at a branch, a private cloud app is slow | emp · mobile · branch · cloudapp · [slow] | ALLOW |
| 76 | Drive-thru optimization: worker on public Wi-Fi, sanctioned SaaS is slow | emp · mgd · public · saas · [slow] | ALLOW |
| 77 | Intelligent fulfillment: administrator at a branch, a private cloud app is slow | admin · mgd · branch · cloudapp · [slow] | STEP-UP |
| 78 | Inventory management (store): branch user, a private app in the data center is slow | emp · mgd · branch · dcapp · [slow] | ALLOW |
| 79 | Wireless and video analytics: branch sensor reaches a private app, unlike its profile | iot · headless · branch · dcapp · [anomaly] | CONTAIN |
| 80 | Digital engagement and contact center: mobile worker at home uses the approved AI assistant | emp · mobile · home · ai · [norm] | ALLOW |
| 81 | Virtual and collaboration workflows: worker on public Wi-Fi → sanctioned SaaS, MFA passed | emp · mgd · public · saas · [mfa_ok] | ALLOW |
| 82 | Branch analytics: worker at home, sanctioned SaaS is slow | emp · mgd · home · saas · [slow] | ALLOW |
| 83 | Unified financial operations: administrator pushes policy for a private cloud app | admin · mgd · hq · cloudapp · [mfa_ok, push] | ALLOW |
| 84 | Secure communications compliance: personal laptop at home → private app, MFA passed | emp · byod · home · dcapp · [mfa_ok] | ALLOW WITH LIMITS |
| 85 | Algorithmic trading automation: employee at HQ, a private cloud app is slow | emp · mgd · hq · cloudapp · [slow] | ALLOW |
| 86 | Legacy infrastructure modernization: out-of-date laptop at HQ → a private cloud app | emp · stale · hq · cloudapp · [norm] | ALLOW WITH LIMITS |
| 87 | Claims, underwriting and document processing: branch user pastes data into an internal AI model | emp · mgd · branch · intai · [aipaste] | ALLOW WITH LIMITS |
| 88 | Teaching and faculty collaboration: managed laptop at home → private cloud app, MFA passed | emp · mgd · home · cloudapp · [mfa_ok] | ALLOW |
| 89 | Esports and entertainment: mobile worker at HQ → a private cloud app | emp · mobile · hq · cloudapp · [norm] | ALLOW |
| 90 | Personalized residential experiences: campus sensor reaches sanctioned SaaS | iot · headless · hq · saas · [norm] | ALLOW WITH LIMITS |
| 91 | Hybrid teaching: out-of-date laptop at home → sanctioned SaaS, MFA passed | emp · stale · home · saas · [mfa_ok] | ALLOW WITH LIMITS |
| 92 | Communications: administrator at home → sanctioned SaaS, MFA passed | admin · mgd · home · saas · [mfa_ok] | ALLOW |
| 93 | Administrative efficiency: worker on public Wi-Fi → private app, MFA passed | emp · mgd · public · dcapp · [mfa_ok] | ALLOW |
| 94 | Community broadband and equitable access: branch sensor opens a safe website | iot · headless · branch · web_safe · [norm] | ALLOW WITH LIMITS |
| 95 | Smart and sustainable buildings: campus sensor reaches a private app | iot · headless · hq · dcapp · [norm] | BLOCK |
| 96 | Hybrid cloud management: worker on public Wi-Fi, a private cloud app is slow | emp · mgd · public · cloudapp · [slow] | ALLOW |
| 97 | Physical safety: campus sensor opens a safe website, unlike its profile | iot · headless · hq · web_safe · [anomaly] | CONTAIN |
| 98 | Remote research and collaboration: mobile worker at home → private cloud app, MFA passed | emp · mobile · home · cloudapp · [mfa_ok] | ALLOW |
| 99 | Research and academic computing: workload in the data center → the internal AI model | aiagent · server · hq · intai · [norm] | ALLOW |

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

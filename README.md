# Secure Networking Academy

A self-paced, gamified learning platform that teaches partner account executives how to explain and pitch
**Cisco Secure Networking**. It follows the story in the Cisco dCloud *Secure Networking* collection.

## Run it
No build step and no backend. Open `index.html` in a browser, or host the folder on any static host (for example GitHub Pages).
Progress is saved in the browser (`localStorage`), so it stays on that device.

## The path
1. Why Secure Networking? 2. The Reference Design 3. Identity: the common language (ISE, SGT)
4. Campus & Branch (healthcare IoT) 5. Securing the User (Zero Trust, SASE) 6. Unified Assurance & Cloud Control
7. Data Center & Cloud (three enforcement scenarios) 8. Securing AI (AI Defense) 9. Pitch It (demo selection)
→ Final customer-meeting challenge → printable certificate.

Each module: story → simple cards (with a "go deeper" toggle for technical buyers) → interactive diagram →
ready-to-say pitch script → quiz (multiple choice, true/false, ordering).

Extras: **Demo Playbook** (which dCloud demo for which conversation), **Pitch Lab** (generates a tailored opener), **Glossary** flashcards.

## Rewards
XP, levels (Newcomer → Trusted Advisor), 1–3 stars per module (70/85/100%), answer combos, daily streak, 8 badges, confetti.
XP for any given question is awarded once, so replaying can't be farmed.

## Editing content
All course material is data in `content.js` (`MODULES`, `DEMOS`, `GLOSSARY`). Each module lists its `sources`,
and fast-moving topics carry a `verify` note shown in the module.

## Accuracy notes
- Story and demo catalog come from the dCloud collection document; product facts were cross-checked against Cisco's Design Zone,
  newsroom, blogs and data sheets (linked in each module).
- The reference-design **image** from the dCloud page was not available when this was built; the five domains and three deployment
  models come from Cisco's Secure Network Reference Architecture page. Compare with the current image.
- Availability of Cloud Control / AI Canvas, Hypershield, Access Manager and SGT support in cloud products is changing quickly.
  Confirm with Cisco before quoting dates or capabilities to customers.
- This is an independent learning aid, not an official Cisco product or certification.

## Also in this repo
[`living-network/`](living-network/) — Living Network, a standalone interactive 3D explainer of how Cisco networking and security
products work together (scenario builder, five lenses, 111 presets). Open `living-network/index.html`. See its README for sources and the rule table.

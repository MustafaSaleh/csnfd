# Living Network checked against Cisco Validated Designs

Checked on 12 November 2026 against the Cisco Validated index
(https://www.cisco.com/site/us/en/solutions/cisco-validated/index.html) and the design, deployment and architecture
guides it leads to. Every statement below names its source page and the "Updated" date printed on that page.
Where a page was long and only part of it could be read verbatim, the item says "verify wording".

**Status, 12 November 2026.** Sections 2 to 5 are applied in the tool, except the items listed in the README backlog
under "From the Cisco Validated Design check". The long guides that were only partly read are listed there too, under
"Long guides and PDFs to read in full later". The README section "Cisco Validated Design check" lists what changed.

**Headline.** Nothing the tool shows is contradicted by a CVD. The CVDs do three things for it: they confirm most of
the rule table with a stronger source than a product page, they settle five of the README's "not verified" items, and
they show nine relationships the scene does not draw yet. Three rule credits should move to a different product.

---

## 1. Which Cisco Validated documents apply

The index itself has no "Security" category and no Hybrid Mesh Firewall or Hypershield CVD. Security sits inside
"Campus and branch" (SASE/SSE, Zero Trust) and the featured Secure Networking Architecture document.

| Document | Updated | What it settles for the tool |
|---|---|---|
| Introduction to the Cisco Secure Networking Architecture — https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/Intro-Cisco-Secure-Network-Architecture.html | 22 Oct 2026 | The official layer model and which product sits in which layer. Names "Security in Cloud Control", "Secure Access DNS", "ISE Rapid Threat Containment and Adaptive Network Control", "Splunk SOAR", "AI Canvas", "Cisco Live Protect". Does **not** name Umbrella, Hypershield, Smart Switches, Silicon One, Nexus One, Email Threat Defense, Secure Equipment Access, Industrial Threat Defense or Wi-Fi 7. No product-to-product flows. |
| Cisco Secure Network SD-Access Deployment Guide — https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/Cisco-Secure-Networking-SD-Access-Deployment-Guide.html | 21 Oct 2026 | Campus hops, WLC placement, ISE roles, Secure Network Analytics to ISE quarantine over pxGrid, Wi-Fi 7 and WPA3. IOS XE 17.18.2, ISE 3.5, SNA 7.6, Catalyst Center 3.2.x. |
| Cisco Secure Networking Cloud-Managed Campus Deployment Guide — https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/Cisco-Secure-Networking-Cloud-Managed-Deployment-Guide.html | 19 Oct 2026 | ISE to Meraki Adaptive Policy over pxGrid, Secure Access tunnels from Meraki MX, ThousandEyes agents, SNA to XDR, ThousandEyes to XDR, Secure Firewall for "mesh firewalling". |
| Cisco Cloud Control Architecture and Operations Technical Whitepaper — https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/Cisco-Cloud-Control-Technical-Whitepaper.html | 10 Nov 2026 | What Cisco Cloud Control is and how "Security Cloud Control" relates to it. ISE and Duo integration mechanisms. |
| Cisco Unified Branch Design Guide — https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/cisco_unified_branch_design_guide.html and Large Branch Deployment Guide — https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/cisco-unified-branch-large-branch-deployment-guide.html | 3 and 9 Nov 2026 | Branch path, Secure Access SIA tunnels, ISE 802.1X/MAB with SGT, guest DIA, Splunk Add-on for Cisco Meraki, XDR from the Meraki dashboard, ThousandEyes agents on the secure router. |
| Cisco Common Policy Integration Guide — https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/catalyst-center/cisco-validated-solution-profiles/common-policy-integration-guide.html | 15 Jan 2026 | ISE as the context hub: SGTs to Catalyst Center, SD-WAN Manager, FMC and ACI; cloud connectors; SXP to SD-Access borders. |
| Zero Trust: Network and Cloud Security Design Guide — https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/zt-network-cloud-dg.html | 9 Mar 2023 | Full SNA to ISE ANC quarantine flow; ISE SGTs to Secure Firewall via pxGrid and SXP; SNA detection in encrypted flows. |
| Zero Trust: User and Device Security Design Guide — https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/zt-user-device-dg.html | 11 Apr 2023 | Duo device trust for managed vs unmanaged devices, out-of-date device handling, Secure Endpoint blocking compromised endpoints, ISE Posture module of Secure Client. Umbrella era. |
| Cisco Breach Protection Suite Design Guide — https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/breach-protection-suite-dg.html | 22 Nov 2023 | What XDR ingests and what it can do in response (host isolation in Secure Endpoint, email quarantine in Email Threat Defense). |
| Cisco SASE Design Guide (SSE with Secure Access) — https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/sase-design-guide.html | 15 Sep 2025 | Secure Client ZTA module, VPNaaS, clientless ZTA proxy, posture via the ISE posture module, branch IPsec tunnels, ThousandEyes module and Experience Insights, Umbrella migration. |
| Cisco SASE and SSE Architecture Guide — https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/sase-sse-ag.html | 23 Jan 2025 | SSE definition; Secure Access mapped to DNS, web, CASB, DLP, RBI, firewall, application segmentation (appendix, verify wording). |
| Cisco Secure Firewall Threat Defense SD-WAN Design and Deployment Guide — https://www.cisco.com/c/en/us/td/docs/security/secure-firewall/cvd/secure-firewall-sdwan-deployment-guide.html | 30 Sep 2025 | Firewall builds the branch tunnel to Secure Access; FMC integrates with Security Cloud Control. |
| Cisco Catalyst SD-WAN Design Guide — https://www.cisco.com/c/en/us/td/docs/solutions/CVD/SDWAN/cisco-sdwan-design-guide.html | 21 Aug 2024 | SD-WAN Manager owns SD-WAN policy; embedded firewall, IPS, URL filtering; VPN/VRF segmentation. Still Umbrella-era for SIG. |
| Campus LAN and Wireless LAN Design Guide — https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/cisco-campus-lan-wlan-design-guide.html | 4 May 2020 | Access, distribution, core tiers and when a core is needed; WLC placement. Old (Wi-Fi 6, DNA Center). |
| Industrial Security Solution Overview — https://www.cisco.com/c/en/us/products/collateral/security/industrial-security-cvd-so.html | 12 Feb 2026 | Zones and conduits, firewall at Level 3, Cyber Vision feeds ISE and firewall rules, XDR ribbon, Splunk OT add-on. |
| Cyber Vision data sheet — https://www.cisco.com/c/en/us/products/collateral/security/cyber-vision/cyber-vision-ds.html and the ISE, Secure Firewall and XDR "working together" briefs | 14 Apr 2026; 16 Aug 2024; 14 Nov 2024; 24 Jun 2024 | pxGrid to ISE with automatic SGT, FMC dynamic objects via CSDAC, XDR workflows that set an SGT in ISE, SEA included in Cyber Vision, sensor platforms. |
| Cisco Hybrid Mesh Firewall At-a-Glance — https://www.cisco.com/c/en/us/solutions/collateral/security/hybrid-mesh-firewall/hybrid-mesh-firewall-aag.html | 12 Jun 2026 | Enforcement point types; "Policy is orchestrated by Cisco Cloud Control"; Splunk telemetry; Cloud Protection Suite as the path. No product names. |
| Cisco N9300 Series Smart Switches with Cisco Hypershield At-a-Glance (PDF) — https://www.cisco.com/c/en/us/products/collateral/switches/9300-series-smart-switches/n9300-series-smart-switch-aag.pdf | document C45-4916751-04, 08/26 | "Cisco Hypershield defines the policy. Cisco 9300 Series Smart Switches enforce it." Stateful L3/L4 segmentation; Security Cloud Control or on-prem controller; availability caveat. |
| Multicloud Defense Architecture Guide — https://www.cisco.com/c/en/us/products/collateral/security/multicloud-defense/multicloud-defense-ag.html | 15 Mar 2024 | Ingress reverse proxy, egress and east-west forward proxy. Managed through Cisco Defense Orchestrator (older name). No WAF mention. |
| Zero Trust Access from Cisco At a Glance — https://www.cisco.com/c/en/us/products/collateral/security/secure-access/zero-trust-access-aag.html | 9 Dec 2025 | "comprised of capabilities from Cisco Secure Access, Cisco Duo, Cisco Identity Services Engine (ISE) and Cisco ThousandEyes"; "Dynamic risk-based access". |
| Secure Access help: Integrate ISE, Integrate Catalyst SD-WAN, Integrate Cisco Identity Intelligence, Push Security Events — under https://www.cisco.com/c/en/us/td/docs/security/secure-access/secure-access-help/CiscoSecureAccessHelp/secure-access-integrations-intro/ | 8 Nov 2026 | ISE SGTs and SD-WAN VPN IDs as Secure Access policy sources; Identity Intelligence trust levels visible in Secure Access; security events pushed to Splunk. |

Not on cisco.com as a CVD: Hybrid Mesh Firewall, Hypershield, Secure Workload, Multicloud Defense, AI Defense, Nexus One,
Splunk with Nexus Dashboard (the data center design zone has none of these). The Industrial Security Design Guide 3.1
is a 10 MB+ PDF (https://www.cisco.com/c/dam/en/us/td/docs/Technology/Industrial-Security-3-1-DG.pdf) that could not
be read here; the solution overview and data sheet were used instead.

---

## 2. The README's open questions, answered from the CVDs

| README item | What the CVD says | Suggested change | Source |
|---|---|---|---|
| **Campus core / distribution hop** (review item 14) | SD-Access: endpoint → fabric edge (C9300/C9350/C9400) → intermediate nodes (C9500X) → co-located border and control plane (C9500) → fusion nodes (C9500, "NYC-Core") → "upstream network, Internet edge, and data center". WLC is an external CW9800M HA pair. Classic campus: "A hierarchical LAN design includes the following three layers" and a core is used when three or more distributions interconnect. | Keep the generic hop. Rename its caption to "Campus distribution / core (SD-Access border and fusion nodes)" and cite the SD-Access guide. Keep the "WLC not shown" note; the guide uses a dedicated 9800 pair. | SD-Access Deployment Guide (21 Oct 2026); Campus LAN and WLAN DG (4 May 2020) |
| **Umbrella removed, Secure Access in its place** (item 19) | The 2025 SASE Design Guide is built on Secure Access and says of the Roaming Security module: "Because this module is also used by Cisco Umbrella customers, migration from Umbrella to Secure Access can be simplified." The 2026 Unified Branch guides use Secure Access SIA only. The Secure Networking Architecture CVD names "Secure Access DNS" and never names Umbrella. Older guides (Catalyst SD-WAN DG 2024, SASE with Meraki 2021, ZT User and Device 2023) still use Umbrella. | Keep the decision. Add the SASE DG migration sentence as the source of the Secure Access description, and note that pre-2025 CVDs still show Umbrella. | SASE DG (15 Sep 2025); Unified Branch DG (3 Nov 2026); Intro CVD (22 Oct 2026) |
| **XDR quarantine through ISE** (item 38; line drawn, action not claimed) | Breach Protection Suite DG: "the quarantine mechanisms of integrated products can be activated directly from Cisco XDR, either manually or via automation." The worked action is host isolation: "request that the selected hosts be isolated in Cisco Secure Endpoint." An ISE action is not described there. The XDR and Cyber Vision brief does describe one, for OT: "An example would be to assign a security group tag to an OT asset in Cisco ISE that would ultimately prevent this asset from communicating on the network." | Rule **Z2** (XDR "Automated response → Containment action") should say what is documented: host isolation through Secure Endpoint (campus and remote) and, for the OT scenarios (presets 11 and the factory paths), an SGT change in ISE launched from a Cyber Vision/XDR workflow. Keep the generic "XDR quarantines any endpoint through ISE" out. | Breach Protection Suite DG (22 Nov 2023); XDR and Cyber Vision brief (24 Jun 2024) |
| **ISE quarantine mechanism** (item 12, rules T3, T9, T16) | ZT Network and Cloud DG: "Secure Network Analytics communicates the action to ISE over the pxGrid channel." "ISE then sends a CoA request to the appropriate access switch, which forces a reauthentication of the host." "matched to an ANC quarantine rule within the ISE Authorization policy." Result is Deny Access or "a Quarantine SGT can be assigned to still permit some restricted access." SD-Access guide: "Adaptive Network Control can use pxGrid to apply a quarantine authorization at the fabric edge" and the quarantine rule is authored in ISE (SGT 255 "Quarantined_Systems"). | Confirmed. Add "over pxGrid, enforced by Change of Authorization, placing the endpoint in a Quarantine SGT" to T3, T9 and T16 and cite both guides. Note that the CVD flow is **analyst-initiated** from Secure Network Analytics ("SOC analysts can respond to Secure Network Analytics alerts"); automation is through XDR or SOAR playbooks. Rename "Automated containment" to "Containment" unless the scenario includes XDR/SOAR. | ZT Network and Cloud DG (9 Mar 2023); SD-Access Deployment Guide (21 Oct 2026) |
| **Which client does posture** (item 11, rule P3) | "ISE Posture is a module you can choose to install as an additional security component of the Cisco Secure Client product." SASE DG: "advanced device posture assessment via the Secure Firewall posture module or Identity Services Engine (ISE) posture module." | Confirmed as written. Add both sources. For the Secure Access path (P2/P4 at hop `sa`), the posture check is the ISE posture module of Secure Client, not Duo Device Health; Duo Device Health applies at the Duo sign-in. | ZT User and Device DG (11 Apr 2023); SASE DG (15 Sep 2025) |
| **Verified Duo Push** (rule M5) | Not in any CVD. The 2023 Zero Trust guide configures "only Duo Push". | No CVD source. Keep the current note that it rests on the Duo documentation. | ZT User and Device DG |
| **Secure Access CASB, DLP, RBI, clientless** (rules W4, W5, W6, A2, S1) | SASE DG (verbatim): "Secure Web Gateway (SWG) and Data Loss Prevention (DLP)", FWaaS with IPS, SSL decryption, clientless "Zero Trust Access (ZTA) proxy built into Cisco Secure Access" for "HTTP(S), SSH, and RDP", and "At the time of publication, this solution integrates with the Chrome Enterprise Browser." SASE/SSE AG appendix maps Secure Access to DNS, Web, CASB, DLP, RBI, Firewall, Application Segmentation (verify wording). | Add the SASE DG as the source for W6 (DLP), S1/S2 (clientless contractor access, "posture is more limited in this scenario") and B2. Keep the data sheet as the source for CASB and RBI, with the architecture guide as a second reference. | SASE DG (15 Sep 2025); SASE/SSE AG (23 Jan 2025) |
| **Secure Access ↔ Splunk** (backlog: "no public page found") | Secure Access help, "Push Security Events": Secure Access publishes security events "for Splunk" in JSON; event types DNS, HTTP, Firewall, IPS, DLP, ZTNA and RAVPN (summary of the page, verify wording). | **Draw the line** Secure Access → Splunk Platform and add Secure Access to the Splunk layer feeds. Source: the Push Security Events page. | Secure Access help (8 Nov 2026) |
| **XDR ↔ Secure Access** | Still not stated in any CVD or on the Secure Access integrations index. | Leave undrawn. | Secure Access integrations index (8 Nov 2026) |
| **ThousandEyes ↔ ITSI** | Not stated anywhere read. | Leave undrawn. | — |
| **AgenticOps / AI Canvas** (item 4) | The Secure Networking Architecture CVD has a layer named "Unified Management and Agentic Operations" listing Cisco Cloud Control, AI Canvas, Cisco AI Assistant, Deep Network Model and Splunk Agentic SOC. The Cloud Control whitepaper describes "Assistant", "Canvas" and "Studio" and never uses "AgenticOps". | Rename the node "Agentic Operations (AI Canvas)" or keep "AgenticOps" and cite the CVD layer name. This is a better source than the product page. | Intro CVD (22 Oct 2026); Cloud Control whitepaper (10 Nov 2026) |
| **Security Cloud Control naming and scope** (item 30) | Cloud Control whitepaper: "Security Cloud Control provides the security management tenant" (a linked tenant inside Cisco Cloud Control; Secure Access assets reach Cloud Control through it). Intro CVD lists "Security in Cloud Control" in the Respond layer. Hybrid Mesh Firewall AAG: "Policy is orchestrated by Cisco Cloud Control". N9300 AAG: "Hypershield on-premises controller or Cisco Security Cloud Control". Secure Firewall SD-WAN DG: "Integrates your Management Center with Security Cloud Control". Catalyst SD-WAN DG: "SD-WAN Manager offers centralized fault, configuration, accounting, performance, and security management." Common Policy guide: ISE sends SGTs to SD-WAN Manager. | Replace the panel note with: "Security Cloud Control is the security management tenant inside Cisco Cloud Control (Cloud Control whitepaper). SD-WAN policy, including the router's security policy, is managed in Catalyst SD-WAN Manager; in cloud-managed branches the secure router is a Meraki MX whose firewall rules live in the Meraki dashboard (Unified Branch guide)." Rule O5-sdwan is consistent; cite the SD-WAN DG. | Cloud Control whitepaper (10 Nov 2026); Intro CVD; HMF AAG (12 Jun 2026); N9300 AAG (08/26); Unified Branch DG (3 Nov 2026) |
| **Hypershield on N9300** (items 25–26, rules B7, X4, T10) | N9300 AAG: "Cisco Hypershield defines the policy. Cisco 9300 Series Smart Switches enforce it."; "stateful L3/L4 segmentation"; protects "VMs, containers, and bare-metal storage and agentless systems"; "Capabilities, licensing, scale, and availability depend on the applicable software release and subscription." The Intro CVD lists "Cisco Live Protect" under Secure Infrastructure but does not tie it to Hypershield or the N9300. | B7 and T10 are supported; cite the AAG. X4 ("compensating control shields the exposed workload") has no CVD support for the N9300; keep it but label it "Hypershield / Live Protect capability, availability varies" and keep the product page as source. | N9300 AAG (08/26); Intro CVD (22 Oct 2026) |
| **Secure Equipment Access** (item 3, rule S3) | "Cisco Secure Equipment Access is now part of Cisco Cyber Vision." Data sheet: least-privilege policies "based on identities and contexts, such as robust authentication via MFA or SSO, time schedules, remote access protocols being used, remote user posture check"; "Remote users never have access to the entire IP network"; "the Cyber Vision sensor can simultaneously run a ZTNA gateway agent". Approval workflow and session recording are **not** on the page or data sheet. | Reword S3 to "Least-privilege session to the named asset, with MFA or SSO, time schedule and posture checks" and drop "approval workflow and session recording" unless a page is found that states them. | SEA product page; Cyber Vision DS (14 Apr 2026) |
| **Trust level wording** (item 45) | Intro CVD: "Authorization becomes a living decision rather than a one-time login event." Zero Trust Access AAG: "Dynamic risk-based access: Continuously adjusts access based on user behavior, device posture, and network conditions." Identity Intelligence integration: "user trust levels will become visible in Secure Access" (trust level per user). | Use both sentences in the trust-lens caption. Identity Intelligence does expose a per-user trust level, so the panel can say "the closest real signal is the Identity Intelligence trust level shown in Secure Access and Duo". | Intro CVD; ZTA AAG (9 Dec 2025); Secure Access help (8 Nov 2026) |
| **Breach Protection Suite tiers** (item 7) | The suite design guide has no tier table and defers to cisco.com/go/breach-protection. | No change. | Breach Protection Suite DG |
| **XDR sources** (item 37) | Breach Protection DG sets up Secure Endpoint, Secure Malware Analytics, Email Threat Defense, Secure Network Analytics, Umbrella and Secure Client Network Visibility Module ("automatically send logs to Cisco XDR via an encrypted HTTPS connection"). Cloud-managed CVD: SNA to XDR (three alarm types), ThousandEyes "returning data to Cisco XDR". Unified Branch: Meraki dashboard "Data is now flowing to XDR". | Add Meraki ↔ XDR and ThousandEyes ↔ XDR (see section 3). Cite the Breach Protection DG for Secure Client ↔ XDR. | Breach Protection DG; Cloud-Managed CVD (19 Oct 2026); Unified Branch LB (9 Nov 2026) |

---

## 3. Relationships the CVDs state that the scene does not draw

Each is a public statement on cisco.com and fits the tool's "stated relationship" rule.

| A | B | Statement | Source |
|---|---|---|---|
| ISE | Meraki dashboard | "Verify that the SGTs created in Cisco ISE synchronize successfully into the Cisco Meraki Dashboard Adaptive Policy environment through pxGrid integration." | Cloud-Managed Campus DG (19 Oct 2026) |
| ISE | Secure Routers / SD-WAN | "SGTs are sent to SD-WAN Manager (formerly vManage) for policy configuration. IP-SGT mappings are sent to SD-WAN Controller (formerly vSmart)." | Common Policy Integration Guide (15 Jan 2026) |
| ISE | Nexus (ACI) | "a secure connection is built between Cisco ISE and Cisco APIC"; EPGs/ESGs are synchronised to SGTs. | Common Policy Integration Guide (15 Jan 2026) |
| ISE | Secure Access | ISE SGTs become Secure Access source resources via pxGrid Cloud; "shares the network context (ISE SGTs and SD-WAN VPN IDs) with Cisco Secure Access". (Line exists; add this source.) | Secure Access help, Integrate ISE (8 Nov 2026) |
| Secure Routers / SD-WAN | Secure Access | SSE policy group in SD-WAN Manager; VPN ID context carried in the IPsec metadata; "Catalyst SD-WAN Service VPN IDs" used as sources in Internet Access rules. (Line exists; add this source and the SASE DG tunnel statement.) | Secure Access help, Integrate Catalyst SD-WAN (8 Nov 2026); SASE DG (15 Sep 2025) |
| Secure Firewall | Secure Access | Threat Defense builds the branch IPsec tunnel to Secure Access for secure internet access; "Cisco solution is Cisco Secure Access." | Secure Firewall TD SD-WAN DG (30 Sep 2025) |
| Secure Firewall | Network Analytics | Firewall sends per-session NetFlow and IPS/malware events through Telemetry Broker to Secure Network Analytics; SNA is "supplementing it with firewall log data". | ZT Network and Cloud DG (9 Mar 2023); Breach Protection DG (22 Nov 2023) |
| Secure Access | Splunk Platform | Security events pushed "for Splunk" (DNS, HTTP, Firewall, IPS, DLP, ZTNA, RAVPN). | Secure Access help, Push Security Events (8 Nov 2026) |
| ThousandEyes | XDR | "Select the domain to be used for returning data to Cisco XDR." | Cloud-Managed Campus DG (19 Oct 2026) |
| Meraki dashboard | XDR | "The XDR integration to the Meraki Dashboard is performed once but is then enabled on a network-by-network basis." "Data is now flowing to XDR." | Unified Branch Large Branch DG (9 Nov 2026) |
| ThousandEyes | Secure Access | "Deploying the Cisco Secure Client ThousandEyes module on user endpoints and integrating it with Secure Access"; "configure Experience Insights in Cisco Secure Access". (Line exists; add this source.) | SASE DG (15 Sep 2025) |
| XDR | Email Threat Defense | "use the integration between Cisco XDR and Cisco Secure Email Threat Defense to quarantine emails with this subject line." (Line exists; it is a response action, not only ingest.) | Breach Protection DG (22 Nov 2023) |
| Identity Intelligence | Secure Access | "user trust levels will become visible in Secure Access". (Line exists; add source.) | Secure Access help (8 Nov 2026) |
| Cyber Vision | ISE | "Cisco ISE is enriched with OT asset profiles and zone information from Cyber Vision using pxGrid."; "Each OT device automatically gets assigned a Security Group Tag (SGT)". (Line exists; add source.) | ISE and Cyber Vision brief (16 Aug 2024) |
| Cyber Vision | Secure Firewall | "FMC pulls asset group information from Cyber Vision using the Cisco Secure Dynamic Attributes Connector (CSDAC)."; "Each Cyber Vision group becomes a dynamic object in FMC". (Line exists; add source.) | Secure Firewall and Cyber Vision brief (14 Nov 2024) |

Stronger sources for lines already drawn: ISE ↔ Firewall (ZT Network and Cloud DG: "SXP is used to distribute Destination
SGTs to the Secure Firewall from ISE"; "Secure Firewall can act on the Source and Destination SGT criteria in its Access
Control Policy"), ISE ↔ Network Analytics (same guide and the SD-Access guide), ISE ↔ Smart Switches and Wi-Fi (SD-Access
guide: "ISE also assigns scalable group tags that provide identity and role context to the fabric"), Secure Client ↔ XDR
(Breach Protection DG, NVM), Secure Client ↔ Secure Access (SASE DG: ZTA module, AnyConnect VPN module, ThousandEyes
module), ThousandEyes ↔ Meraki (Unified Branch: "ThousandEyes must be enabled on a network-by-network basis"), Meraki ↔
Splunk (Unified Branch: "Splunk Add-on for Cisco Meraki").

---

## 4. Rule credits that should move

| Rule | Today | CVD position | Fix |
|---|---|---|---|
| **N7** Cyber Vision, "Zones and conduits → No conduit is defined from this OT zone to the internet", BLOCK | Cyber Vision blocks | Cyber Vision defines zones; enforcement is by ISE ("Policies defined in ISE are enforced through dynamic assignment of VLANs, dACLs, or SGTs/Cisco TrustSec") or by Secure Firewall ("Cisco Secure Firewall deployed in Level 3 can terminate OT VLANs to enforce zone and conduit segmentation"; FMC dynamic objects from Cyber Vision groups). | Keep Cyber Vision as the checkpoint that *detects* the out-of-zone flow (telemetry, no verdict) and credit the BLOCK to Secure Firewall at the industrial boundary (or ISE on the industrial switch), "enforcing the zone defined in Cyber Vision". Sources: Industrial Security SO (12 Feb 2026), ISE and Cyber Vision brief, Secure Firewall and Cyber Vision brief. |
| **S3** Secure Equipment Access, "approval workflow and session recording" | Claims two features | Not on the SEA page or Cyber Vision data sheet. The data sheet states MFA/SSO, time schedules, protocol limits, posture check, least privilege, "never have access to the entire IP network". | Reword to what the data sheet states. |
| **Z2** XDR, "Automated response → Containment action triggered to stop lateral movement", CONTAIN | Generic containment | Documented actions: isolate host in Secure Endpoint; quarantine email in Email Threat Defense; set an SGT in ISE for an OT asset via a Cyber Vision/XDR workflow. | Split: Z2a (device ∈ managed/compromised) "host isolated through Secure Endpoint"; Z2b (path includes industrial) "SGT assigned in ISE through an XDR workflow". Cite the Breach Protection DG and the XDR and Cyber Vision brief. |
| **T3 / T16** ISE "Automated containment" | "Automated" | CVD flow is initiated by an analyst from Secure Network Analytics; automation needs XDR/SOAR. | Say "Containment (analyst-triggered from Secure Network Analytics, or by an XDR or SOAR playbook)". With the Splunk layer on, SP8 already covers the playbook case. |
| **P4** Duo, out-of-date device → ALLOW WITH LIMITS | Limited access | ZT User and Device DG: "Users will be warned if their browser is out of date and prevented from access if their browser is out of date by 1 month or more." Global policy also requires "Duo Device Health and Cisco Secure Endpoint installed" and "Allow Cisco Secure Endpoint to block compromised endpoints." | Verdict is fine as illustrative. Reword the result to "warned; blocked once the device is too far out of date" and cite the guide. For a compromised device at the Duo hop, add that Duo blocks when Secure Endpoint reports a compromise (supports T1a). |
| **P5** Duo, unmanaged device → ALLOW WITH LIMITS | Limited | ZT User and Device DG: the unmanaged contractor is "considered untrusted"; Duo "is still able to check certain variables" (browser version, location); the design denies the contractor the public SaaS app and allows one private app. | Keep. Cite the guide; it is exactly presets 4, 6 and 7. |
| **N3** guest → Secure Access path | Guest internet traffic goes through Secure Access at HQ/branch | Unified Branch: guest VLAN uses local internet breakout (DIA) and is excluded from the Secure Access tunnels; Secure Access carries "most traffic" but "Guest and Default VLAN traffic" break out locally. | For `who ∈ {guest}` route internet traffic `sdwan → @dest` (DIA) instead of `sdwan → sa → @dest`, and say so in the caption. Cite the Unified Branch guides. |

---

## 5. Topology views: what the CVDs would change

- **Zero Trust Access**: the AAG defines it as "capabilities from Cisco Secure Access, Cisco Duo, Cisco Identity Services
  Engine (ISE) and Cisco ThousandEyes". Add ThousandEyes to the `zta` node list. Identity Intelligence and Secure Client
  are not in the AAG definition; keep them, but say the four named products are the official set.
- **Secure campus and branch**: the SD-Access CVD's management plane is Catalyst Center (policy administration point) with
  ISE; the cloud-managed CVD's is the Meraki dashboard; Cisco Cloud Control sits above both as "an operating and
  investigation layer" (whitepaper). Catalyst Center is out of the tool's scope; add one sentence to the blurb so the
  campus view does not imply the Meraki dashboard manages an SD-Access fabric.
- **SASE**: add Secure Firewall (branch tunnel source, Secure Firewall TD SD-WAN DG) and the Common Policy flow
  (ISE SGTs into SD-WAN Manager and into Secure Access rules).
- **Hybrid Mesh Firewall**: no CVD exists. The AAG names only enforcement-point *types* and "Cisco Cloud Control" as the
  orchestrator. Keep the product names from the solution page, and add the AAG sentence on Cloud Control and the
  N9300 AAG for the Smart Switch node.
- **Data center and cloud**: the data center design zone has no security CVD at all. Say so in the blurb ("no Cisco
  Validated Design covers this view yet; sources are product pages and at-a-glance documents").
- **Industrial**: add the Level 3 firewall statement and the sensor platform list (IE3400, IE3500, IE9300, IR1100,
  IR1800, IR8300, Catalyst 9300) to the Industrial network node.
- **Detection and response**: add Meraki dashboard and ThousandEyes as XDR sources (section 3).
- **Splunk for security operations**: add Secure Access as a feed (Push Security Events) and Meraki (already drawn).

---

## 6. Still not covered by any Cisco Validated document

Keep these hedged exactly as the README does now:

- Verified Duo Push (M5) and Duo risk-based authentication: Duo documentation only.
- XDR quarantine of an IT endpoint through ISE: not described; only the OT SGT example.
- ThousandEyes ↔ ITSI; XDR ↔ Secure Access.
- Hypershield vulnerability shielding (X4) on the N9300; Hypershield availability by capability.
- Multicloud Defense WAF (the architecture guide does not mention WAF); WAAP in front of Multicloud Defense.
- Secure Workload ↔ Multicloud Defense; Hypershield ↔ Secure Workload.
- AI Defense runtime guardrails (A4–A6) and Secure Access AI Access (A2, A3): product pages and data sheet only; the
  SASE DG does not mention AI Access.
- Secure Equipment Access approval workflow and session recording.
- Any "trust score" number.

---

## 7. Suggested README edits

1. Under "How verdicts are produced", add: "Rules marked CVD are stated in a Cisco Validated Design (section list in
   CVD-REVIEW.md); the rest rest on cisco.com product pages and data sheets."
2. In "Not verified", strike the Secure Access ↔ Splunk line and the AgenticOps line, and replace with the sources above.
3. In "Expert review results", add a row "CVD check, 12 November 2026" pointing at this file.
4. Update the "verified on" sentence to name the three October–November 2026 CVDs that were read, since they are newer
   than the 10 November product-page pass for several products.

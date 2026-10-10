/* Course content. Everything here is data: edit this file to change the course.
 *
 * Source of truth for the story: "Secure Networking — Cisco dCloud Sessions" (the collection page).
 * Facts were cross-checked against Cisco public sources listed per module (`sources`).
 * Anything that is fast-moving carries a `verify` note: re-check before quoting dates/availability to a customer.
 */

const MODULES = [
  /* ───────────────────────── 1 ───────────────────────── */
  {
    id: "why",
    emoji: "🌍",
    title: "Why Secure Networking?",
    tagline: "The one-minute story every customer needs to hear first.",
    story:
      "Your customer's network used to be a road with a toll booth at the end. Today users are everywhere, devices have no screens, apps live in many clouds, and AI agents act on their own. A toll booth cannot protect that. Secure Networking puts security inside the network itself.",
    cards: [
      {
        title: "The one-sentence definition",
        simple:
          "Secure Networking is a network design where advanced security and deep visibility are built into the network, to protect the confidentiality, integrity and availability of data and resources.",
        deep:
          "Confidentiality = only the right people/things see data. Integrity = data isn't altered. Availability = things keep working (digital resilience). Cisco's framing: this delivers digital resilience across the future-proofed workplace and the AI-ready data center.",
      },
      {
        title: "Three traits to remember",
        simple:
          "AI-native. Identity- and threat-aware. Hyper-distributed and deeply embedded. Say these three and you have the architecture in one breath.",
        deep:
          "AI-native: AI assists operations and security, and the network also has to be safe for AI. Identity & threat-aware: policy follows who/what the user or device is, and reacts to threats. Hyper-distributed & deeply embedded: enforcement lives everywhere traffic flows (switches, routers, firewalls, cloud), not only at the perimeter.",
      },
      {
        title: "Where it sits in 'One Cisco'",
        simple:
          "Secure Networking is how Cisco securely connects everything inside and across data centers and workplaces: campus, branch and remote work. It is a foundation of the One Cisco outcomes and a key competitive differentiator.",
        deep:
          "Competitive angle: many vendors sell networking or security. Cisco can show both, on one identity and policy model, managed from one place. That integrated story is the differentiator you will keep coming back to.",
      },
    ],
    explore: {
      title: "Tap each customer outcome: what they say, what you say",
      layers: [
        {
          name: "Five customer outcomes",
          nodes: [
            { id: "o1", label: "Simplify operations", short: "Lower overhead cost",
              detail: "Customer says: \"My team is drowning in consoles and tickets.\" One cloud-managed experience, shared inventory and AI-assisted workflows mean fewer tools and fewer hands-on steps.",
              say: "We cut the number of places your team has to look, and let AI handle the repetitive work." },
            { id: "o2", label: "Business continuity", short: "Without compromise",
              detail: "Customer says: \"Security can't slow the business or cause outages.\" Security is built into the network, with assurance that spots problems before users call.",
              say: "Protection that doesn't get in the way of uptime." },
            { id: "o3", label: "Consistent access everywhere", short: "Secure, anywhere",
              detail: "Customer says: \"Remote users and branches get a different experience.\" Same identity-based policy for campus, branch, remote and cloud.",
              say: "One policy that follows the person or device, wherever they connect." },
            { id: "o4", label: "Reduce risk & stay compliant", short: "Risk + compliance",
              detail: "Customer says: \"Auditors keep asking who can reach what.\" Segmentation by identity limits blast radius and makes 'who can reach what' answerable.",
              say: "If something is compromised, it can't move sideways, and you can prove it." },
            { id: "o5", label: "Adopt & secure Agentic AI", short: "With confidence",
              detail: "Customer says: \"The business wants AI, security says no.\" Discover AI assets, validate models, protect them at runtime, and segment the infrastructure that runs them.",
              say: "Say yes to AI, with guardrails you can show the board." },
          ],
        },
      ],
    },
    pitch: {
      audience: "Any audience, 20 seconds",
      line:
        "\"Cisco builds security into the network itself, so every user, device, app and AI workload gets the same protection wherever they are. That means simpler operations, fewer gaps, and the confidence to adopt AI.\"",
    },
    quiz: [
      { t: "mc", q: "Which best describes Secure Networking?",
        options: ["A firewall appliance at the network edge", "A network design with security and visibility fused into the network", "A VPN client for remote workers", "A SIEM product"],
        answer: 1, why: "It is a design approach: security and deep visibility are built into the network, not bolted on at the edge." },
      { t: "mc", q: "Which trio matches the three traits of the architecture?",
        options: ["Fast, cheap, reliable", "AI-native, identity & threat-aware, hyper-distributed & deeply embedded", "Cloud, edge, core", "Wired, wireless, WAN"],
        answer: 1, why: "These three traits are the headline of the architecture. Memorize them." },
      { t: "tf", q: "True or false: Secure Networking only covers the campus.",
        answer: false, why: "False. It connects everything within and across data centers and workplaces: campus, branch, remote work, data center and cloud." },
      { t: "mc", q: "A CIO says: \"The business wants AI but my security team is nervous.\" Which customer outcome do you lead with?",
        options: ["Simplify operations", "Adopt and secure Agentic AI with confidence", "Business continuity", "Reduce hardware cost"],
        answer: 1, why: "Match the outcome to the pain. This is the AI outcome." },
      { t: "order", q: "Put this 3-step opener in a sensible order.",
        items: ["Ask about their biggest worry (access, risk, AI, operations)", "Match it to one of the five outcomes", "Show how identity-based, built-in security delivers it"],
        why: "Discover the pain, map it to an outcome, then explain the how. Never start with the product list." },
    ],
    sources: [
      { t: "Cisco dCloud: Secure Networking collection (your reference document)", u: "https://content.ciscodcloud.com/us/en/home/solutions/secure-networking.html" },
      { t: "Cisco Newsroom: Secure network architecture for workplace AI", u: "https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2025/m06/cisco-unveils-secure-network-architecture-to-accelerate-workplace-ai-transformation.html" },
    ],
  },

  /* ───────────────────────── 2 ───────────────────────── */
  {
    id: "design",
    emoji: "🧭",
    title: "The Reference Design",
    tagline: "The map of the whole architecture: five domains, three ways to run it.",
    story:
      "Now that the customer cares, show them the map. Cisco's Secure Network Reference Architecture (SNRA) is a validated design for campus, branch, hybrid and distributed enterprises. It has five domains and one core principle: identity context flows everywhere.",
    cards: [
      {
        title: "Five domains",
        simple:
          "1) Secure network infrastructure. 2) Scalable segmentation. 3) Zero Trust access + Hybrid Mesh Firewall. 4) Unified management and agentic operations. 5) Extended integration.",
        deep:
          "1 = resilient wired, wireless, routing, WAN and cloud connectivity. 2 = macro- and micro-segmentation using VRFs, overlays and security groups. 3 = identity-driven least-privilege access, with enforcement distributed across campus, branch, cloud and remote. 4 = centralized visibility, assurance, analytics, automation and AI-assisted workflows. 5 = coordination with observability, IT ops and third-party platforms.",
      },
      {
        title: "The core principle",
        simple:
          "Identity context flows from access, into segmentation, into enforcement, into telemetry and analytics. Cisco ISE is the primary source of that identity.",
        deep:
          "Why it matters: when every layer understands 'who or what is this', you stop writing rules by IP address and VLAN. Policies become short, readable and consistent.",
      },
      {
        title: "Three deployment models, one design",
        simple:
          "Cloud-managed (simplicity, fast onboarding), on-premises (local control and governance), or programmable (API and automation). The principles and outcomes are the same in all three.",
        deep:
          "Practical pitch: you don't have to rip and replace. A customer can run Meraki-managed branches and Catalyst Center-managed campuses and still follow the same architecture.",
      },
    ],
    explore: {
      title: "Explore the reference design, layer by layer",
      layers: [
        {
          name: "Five architecture domains",
          nodes: [
            { id: "d1", label: "Secure Network Infrastructure", short: "Wired, wireless, WAN, cloud",
              detail: "The resilient foundation: switches, access points, routers and cloud connectivity. Cisco Unified Branch and Wi-Fi 7 sit here.",
              say: "Start with a network that is already built to enforce security." },
            { id: "d2", label: "Scalable Segmentation", short: "Macro + micro",
              detail: "Macro-segmentation separates big zones (VRFs/virtual networks). Micro-segmentation uses security group tags to control who talks to whom inside a zone.",
              say: "Limit the blast radius so one bad device can't reach everything." },
            { id: "d3", label: "Zero Trust Access + Hybrid Mesh Firewall", short: "Identity-driven, distributed",
              detail: "Least-privilege access by identity, enforced by firewalls and policy points spread across campus, branch, cloud and remote.",
              say: "Never trust, always verify, in every location." },
            { id: "d4", label: "Unified Management & Agentic Ops", short: "One view, AI helps",
              detail: "Cisco Cloud Control, Meraki Dashboard, Catalyst Center, SD-WAN Manager and ThousandEyes give visibility and automation, with AI Assistant and AI Canvas for agentic operations.",
              say: "Fewer consoles, faster answers." },
            { id: "d5", label: "Extended Integration", short: "Ecosystem",
              detail: "Share context with observability, IT operations and third-party security platforms (for example Splunk, SIEM and ITSM tools).",
              say: "Works with the tools you already own." },
          ],
        },
        {
          name: "Three deployment models",
          nodes: [
            { id: "m1", label: "Cloud-managed", short: "SaaS",
              detail: "Rapid onboarding, centralized visibility and SaaS lifecycle management (Meraki Dashboard).",
              say: "Best when the customer wants simplicity and speed." },
            { id: "m2", label: "On-premises", short: "Local control",
              detail: "Localized control, governance alignment and customized workflows (Catalyst Center).",
              say: "Best when governance or data residency calls for local control." },
            { id: "m3", label: "Programmable", short: "APIs",
              detail: "Infrastructure automation, API-driven operations and DevOps/NetOps integration.",
              say: "Best for teams that automate everything." },
          ],
        },
      ],
    },
    pitch: {
      audience: "CIO / network architect",
      line:
        "\"Cisco's reference architecture is validated, so you are not inventing the design. It has five domains, and identity flows through all of them. You pick how to run it: cloud-managed, on-prem or programmable, with the same outcomes.\"",
    },
    quiz: [
      { t: "mc", q: "What is the 'core principle' of the reference architecture?",
        options: ["Everything must be in the cloud", "Identity context flows from access into segmentation, enforcement and analytics", "All traffic is routed through one central firewall", "Hardware is replaced every three years"],
        answer: 1, why: "Identity context (via ISE) flows through every layer so policy is consistent." },
      { t: "mc", q: "Which is NOT one of the five domains?",
        options: ["Scalable Network Segmentation", "Extended Integration", "Unified Management and Agentic Operations", "Printer Fleet Management"],
        answer: 3, why: "The five domains are infrastructure, segmentation, Zero Trust + Hybrid Mesh Firewall, unified management/agentic ops, and extended integration." },
      { t: "mc", q: "A customer has strict governance rules and wants local control. Which deployment model fits best?",
        options: ["Cloud-managed", "On-premises", "Programmable only", "None of them"],
        answer: 1, why: "On-premises gives localized control and governance alignment. The architecture's principles stay the same." },
      { t: "tf", q: "True or false: choosing a different deployment model changes the architectural principles.",
        answer: false, why: "False. Principles, policy framework and outcomes stay consistent across all three models." },
      { t: "mc", q: "A customer says: \"We already have Catalyst switches. Do we have to start over?\" Best answer?",
        options: ["Yes, the architecture requires all-new hardware", "No. The same architecture works with on-prem Catalyst Center, cloud-managed Meraki, or both together", "Only if they buy a new firewall", "Only in the cloud"],
        answer: 1, why: "Three deployment models, one design. You can bring the existing estate into the story." },
    ],
    sources: [
      { t: "Cisco Design Zone: Introduction to the Cisco Secure Networking Architecture", u: "https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/Intro-Cisco-Secure-Network-Architecture.html" },
      { t: "Cisco Newsroom (Nov 2025): Supercharges secure enterprise network architecture", u: "https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2025/m11/cisco-supercharges-its-secure-enterprise-network-architecture-for-the-ai-era.html" },
    ],
    verify: "The reference-design image on the dCloud page was not available when this module was written. The five domains and three models come from Cisco's Design Zone page. Compare with the current image before presenting.",
  },

  /* ───────────────────────── 3 ───────────────────────── */
  {
    id: "identity",
    emoji: "🪪",
    title: "Identity: The Common Language",
    tagline: "How one tag lets campus, branch, data center and cloud follow the same rules.",
    story:
      "Policies written with IP addresses break whenever the network changes. Cisco's answer is to write policy around who or what the user or device is, and let the network carry that identity everywhere.",
    cards: [
      {
        title: "ISE: the identity brain",
        simple:
          "Cisco Identity Services Engine (ISE) decides who or what is connecting, what it is, and what it may access. It is the primary source of identity context in the architecture.",
        deep:
          "ISE handles authentication, authorization, device profiling and posture. It shares identity and device context with many Cisco and third-party solutions through pxGrid.",
      },
      {
        title: "SGT: a name tag for traffic",
        simple:
          "A Security Group Tag (SGT) is a label such as 'Doctors', 'Medical-Devices' or 'Vendors'. Rules say which labels may talk to which, no IP addresses needed.",
        deep:
          "An SGT is a 16-bit identifier tied to a security group, typically based on business role. Because rules decouple from IP and VLAN design, they survive topology changes. This is Cisco TrustSec / group-based policy.",
      },
      {
        title: "Classify → Propagate → Enforce",
        simple:
          "Three steps: the network classifies (assigns a tag), propagates it (carries it along), then enforces it (allows or blocks) at the right point.",
        deep:
          "Propagation can be inline in the packet or via SXP, a TCP-based protocol that carries IP-to-SGT mappings. Enforcement can happen on switches, routers, firewalls and other policy points.",
      },
      {
        title: "Macro vs micro-segmentation",
        simple:
          "Macro = separate big neighbourhoods (virtual networks/VRFs). Micro = rules between groups inside a neighbourhood (SGTs).",
        deep:
          "Design guidance: use a virtual network for hard isolation (for example PCI or guest); use SGT policy for finer 'who talks to whom' control inside a network. Catalyst Center can automate the group policy and push it to ISE.",
      },
    ],
    explore: {
      title: "Follow one identity through the network",
      layers: [
        {
          name: "1 · Classify",
          nodes: [
            { id: "c1", label: "ISE authenticates", short: "Who/what is this?",
              detail: "A nurse's laptop or an infusion pump connects. ISE authenticates it, profiles the device type and checks posture.",
              say: "The network knows exactly what just connected." },
            { id: "c2", label: "Tag assigned", short: "SGT",
              detail: "ISE assigns an SGT, for example 'Medical-Devices', based on the identity and policy.",
              say: "Every user and device gets a name tag." },
          ],
        },
        {
          name: "2 · Propagate",
          nodes: [
            { id: "p1", label: "Inline tagging", short: "In the packet",
              detail: "On supported hardware the tag travels in the packet header across the network.",
              say: "The identity travels with the traffic." },
            { id: "p2", label: "SXP", short: "Tag exchange",
              detail: "Where hardware can't carry tags inline, the Security Group Tag Exchange Protocol shares IP-to-SGT mappings.",
              say: "Even older parts of the network can take part." },
          ],
        },
        {
          name: "3 · Enforce",
          nodes: [
            { id: "e1", label: "Campus switch", short: "Access layer",
              detail: "Switches can allow or deny traffic between groups close to the source.",
              say: "Block bad paths at the first hop." },
            { id: "e2", label: "Data center firewall", short: "FTD",
              detail: "Secure Firewall Threat Defense can enforce identity-based policy using SGTs on data center firewalls. The dCloud data center demo focuses on this.",
              say: "The same label is understood at the data center door." },
            { id: "e3", label: "SD-WAN & Secure Access", short: "Branch + remote",
              detail: "Catalyst SD-WAN and Secure Access are additional enforcement points in the dCloud 'users, devices and things to data center' scenario, managed through Security Cloud Control.",
              say: "Branches and remote users follow the same tags." },
          ],
        },
      ],
    },
    pitch: {
      audience: "CISO / security architect",
      line:
        "\"We write the policy once, around who or what the user or device is. ISE tags it and the tag follows the traffic through campus, branch, data center and cloud. When the network changes, your rules don't break.\"",
    },
    quiz: [
      { t: "mc", q: "What does ISE contribute to the architecture?",
        options: ["Wireless radio planning", "Identity context: authentication, profiling, posture and policy", "Backup storage", "Packet capture"],
        answer: 1, why: "ISE is the primary source of identity context." },
      { t: "mc", q: "What is an SGT?",
        options: ["A type of VPN", "A label for a security group, used to write policy without IP addresses", "A Wi-Fi standard", "A firewall model"],
        answer: 1, why: "A Security Group Tag is a name tag attached to users/devices so policy follows identity." },
      { t: "order", q: "Put the TrustSec stages in order.",
        items: ["Classify (assign the tag)", "Propagate (carry the tag)", "Enforce (allow/deny)"],
        why: "Classify → propagate → enforce." },
      { t: "mc", q: "You need hard isolation of a guest network, and fine control between roles inside the corporate network. What combination fits?",
        options: ["SGTs for both", "A virtual network (macro) for guests and SGTs (micro) inside corporate", "Only more VLANs", "Only a bigger firewall"],
        answer: 1, why: "Macro-segmentation for hard isolation, micro-segmentation with SGTs for role-based control inside." },
      { t: "tf", q: "True or false: with SGT-based policy, your security rules must be rewritten whenever you renumber IP subnets.",
        answer: false, why: "False. SGT policy is decoupled from IP and VLAN design, so topology changes don't force a rewrite." },
    ],
    sources: [
      { t: "Cisco Community: SD-Access Segmentation Design Guide", u: "https://community.cisco.com/t5/networking-knowledge-base/sd-access-segmentation-design-guide/ta-p/4935734" },
      { t: "Cisco Blogs: Scalable group policy with TrustSec", u: "https://blogs.cisco.com/networking/enabling-scalable-group-policy-with-trustsec-across-networks-to-provide-more-reliability-and-determinism" },
      { t: "Cisco ISE Solution Overview", u: "https://www.cisco.com/c/en/us/products/collateral/security/identity-services-engine/identity-ser-engine-so.html" },
    ],
    verify: "SGT support differs by product and release (for example in cloud workload and multicloud products). Check the current feature matrix before promising SGT enforcement on a specific platform.",
  },

  /* ───────────────────────── 4 ───────────────────────── */
  {
    id: "campus",
    emoji: "🏥",
    title: "Campus & Branch",
    tagline: "The healthcare IoT story: secure onboarding and vendor access.",
    story:
      "A hospital adds a new wing. Hundreds of medical devices need a network, and an equipment vendor needs remote access. Cisco's quick-start demo shows creating a new IoT network for medical devices and enabling a remote-access policy for vendors, with no heroics.",
    cards: [
      {
        title: "Meraki and Catalyst: two ways to run the network",
        simple:
          "Meraki Dashboard is cloud-managed. Catalyst Center is on-premises automation and assurance. They are different management models for the same architecture.",
        deep:
          "Cisco has announced work to unify them: a Global Overview in Meraki Dashboard gives a single view of Catalyst Center-managed networks, and AI Assistant workflows span Meraki, Catalyst Center, SD-WAN Manager, ISE and Nexus.",
      },
      {
        title: "Access Manager",
        simple:
          "A SaaS identity-based access control inside the Meraki Dashboard, powered by Cisco ISE, so smaller teams get adaptive, identity-based access without running ISE themselves.",
        deep:
          "Announced Nov 2025 as generally available in Q4 2025: adaptive segmentation by identity and posture.",
      },
      {
        title: "Unified Branch",
        simple:
          "Validated designs and automation toolkits so a new branch goes live fast, with secure routers and Wi-Fi 7 access points.",
        deep:
          "Announced hardware included 8200/8400 Series Secure Routers and Wi-Fi 7 access points. Pitch value: speed of rollout, consistent security at every site.",
      },
      {
        title: "Why healthcare IoT is the perfect story",
        simple:
          "Medical devices often can't run security software, and vendors need remote access. Tag the devices, segment them, give vendors least-privilege access, and watch it all.",
        deep:
          "The dCloud demos add XDR and Splunk: detections and operational data flow to the SOC and IT operations teams. Splunk use cases include consistent, secure access everywhere and simplified operations with lower overhead.",
      },
    ],
    explore: {
      title: "Build the hospital IoT network, one step at a time",
      layers: [
        {
          name: "The use-case steps",
          nodes: [
            { id: "h1", label: "Create the IoT network", short: "Onboard devices",
              detail: "Create a dedicated network/segment for medical devices from the cloud dashboard. Devices are profiled and tagged on connection.",
              say: "New wing, new devices, live in minutes, not months." },
            { id: "h2", label: "Segment medical devices", short: "Contain risk",
              detail: "Policy lets devices talk only to what they need (for example clinical servers) and nothing else.",
              say: "If a pump is compromised, it can't reach patient records." },
            { id: "h3", label: "Vendor remote access", short: "Least privilege",
              detail: "The vendor gets time- and scope-limited access to specific devices, enforced by identity, not a wide-open VPN.",
              say: "Give the vendor a key to one door, not the whole building." },
            { id: "h4", label: "See and respond", short: "XDR + Splunk",
              detail: "XDR correlates threats across domains, and Splunk brings network and security data into one place for the SOC and IT operations.",
              say: "Every step is visible and auditable." },
          ],
        },
      ],
    },
    pitch: {
      audience: "Hospital CIO / network lead",
      line:
        "\"Add a wing and onboard a hundred devices without a project plan. Medical devices are tagged and contained automatically, vendors get access to exactly one thing, and your SOC sees all of it. Same architecture, simpler operations.\"",
    },
    quiz: [
      { t: "mc", q: "How would you describe Meraki Dashboard vs Catalyst Center?",
        options: ["Meraki is on-prem, Catalyst is cloud", "Meraki is cloud-managed, Catalyst Center is on-prem automation and assurance", "They are the same product", "Both are firewalls"],
        answer: 1, why: "Different management models of the same architecture." },
      { t: "mc", q: "Why is IoT in healthcare a strong Secure Networking story?",
        options: ["Medical devices can't be connected", "Devices often can't run security agents, so the network must identify, segment and monitor them", "Hospitals don't need security", "It needs no identity"],
        answer: 1, why: "When the device can't protect itself, the network must." },
      { t: "mc", q: "A medical equipment vendor needs remote access. What do you propose?",
        options: ["A shared VPN password", "Identity-based, least-privilege, scoped access to just their devices", "Open the firewall for their IP", "Deny access entirely"],
        answer: 1, why: "Scoped, identity-based, auditable access." },
      { t: "mc", q: "What is Access Manager?",
        options: ["A badge printer", "A SaaS identity-based access control in Meraki Dashboard, powered by ISE", "A hardware appliance", "A Wi-Fi 6 access point"],
        answer: 1, why: "It brings ISE-powered, identity-based access into Meraki Dashboard." },
      { t: "order", q: "Order the healthcare IoT story.",
        items: ["Create the IoT network and onboard devices", "Segment the devices by tag", "Give the vendor scoped remote access", "Monitor with XDR and Splunk"],
        why: "Onboard → segment → controlled access → visibility." },
    ],
    sources: [
      { t: "Cisco Newsroom (Nov 2025): Secure network architecture for the AI era", u: "https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2025/m11/cisco-supercharges-its-secure-enterprise-network-architecture-for-the-ai-era.html" },
      { t: "dCloud guided demo: Secure Campus and Branch for Healthcare with XDR and Splunk", u: "https://dcloud2.cisco.com/instantdemo/navattic-secure-campus-branch-networking-healthcare-xdr-splunk-guided" },
      { t: "dCloud guided demo: Enabling Secure IoT", u: "https://dcloud2.cisco.com/instantdemo/navattic-secure-networking-iot-microdemo" },
    ],
    verify: "Availability dates (Access Manager, cloud-managed fabric, Global Overview) are from the Nov 2025 announcement. Confirm current status in Cisco release notes.",
  },

  /* ───────────────────────── 5 ───────────────────────── */
  {
    id: "user",
    emoji: "🛡️",
    title: "Securing the User",
    tagline: "Zero Trust access, SASE and Hybrid Mesh Firewall.",
    story:
      "Users now work from the office, home, café and branch. The Instant Demo's second scenario, 'Securing the User', shows how identity-based access follows people wherever they connect.",
    cards: [
      {
        title: "Zero Trust in plain words",
        simple:
          "Never trust by location. Verify who the user is and the health of the device, then give the least access needed, every time.",
        deep:
          "In the architecture: identity-driven, least-privilege access with policy distributed across campus, branch, cloud, remote and application environments.",
      },
      {
        title: "Cisco Secure Access",
        simple:
          "Cloud-delivered security for users connecting to the internet, SaaS and private apps, including Zero Trust access. It gives remote users the same protection as people in the office.",
        deep:
          "Secure Access is Cisco's Security Service Edge (SSE) solution. Cisco's announcements say all Cisco SD-WAN offerings, including Meraki, integrate with Secure Access for unified identity-based policy.",
      },
      {
        title: "SASE = SD-WAN + SSE",
        simple:
          "SASE joins the WAN (SD-WAN) with cloud security (SSE) so branch and remote traffic is connected and secured as one service.",
        deep:
          "Customer-friendly line: \"Your branch and your remote workers use the same front door and the same rules.\"",
      },
      {
        title: "Hybrid Mesh Firewall",
        simple:
          "Firewall enforcement is no longer one box at the edge. It's spread across campus, branch, data center, cloud and workloads, managed with a single policy.",
        deep:
          "Hybrid Mesh Firewall is a domain in Cisco's reference architecture. Security Cloud Control manages enforcement points such as Secure Firewall Threat Defense.",
      },
    ],
    explore: {
      title: "Where is the user, and who enforces?",
      layers: [
        {
          name: "User locations",
          nodes: [
            { id: "u1", label: "In the office", short: "Campus",
              detail: "Identity from ISE, enforced at the switch/AP and campus firewall.",
              say: "The network itself verifies and tags you." },
            { id: "u2", label: "At a branch", short: "SD-WAN",
              detail: "SD-WAN carries traffic, and enforcement uses the same identity policy. With Secure Access integration, internet and SaaS traffic is protected in the cloud.",
              say: "A small site gets enterprise-grade protection." },
            { id: "u3", label: "Working remotely", short: "Secure Access",
              detail: "Secure Access provides Zero Trust access to private apps and protects internet/SaaS traffic.",
              say: "No more 'VPN or nothing'." },
          ],
        },
        {
          name: "Where policy is managed",
          nodes: [
            { id: "u4", label: "Security Cloud Control", short: "Enforcement-point manager",
              detail: "Manage policy for firewalls and other enforcement points from the cloud. Not the same as Cisco Cloud Control (the unified operations platform).",
              say: "One place to push policy to many enforcement points." },
          ],
        },
      ],
    },
    pitch: {
      audience: "CISO",
      line:
        "\"Whether the user is at a desk, in a branch or at home, they are verified by identity and get least-privilege access under the same policy. Secure Access covers the cloud side, and the network covers the rest.\"",
    },
    quiz: [
      { t: "mc", q: "Zero Trust means:",
        options: ["Trust everything inside the office", "Verify identity and device health, grant least privilege, every time", "Block all remote access", "Use passwords only"],
        answer: 1, why: "Never trust by location." },
      { t: "mc", q: "SASE combines which two things?",
        options: ["Wi-Fi and Bluetooth", "SD-WAN and cloud security (SSE)", "Firewalls and printers", "ISE and ThousandEyes"],
        answer: 1, why: "SASE = WAN connectivity + cloud-delivered security." },
      { t: "mc", q: "A customer says their remote users get weaker protection than office users. Best pitch?",
        options: ["Ask them to come to the office", "Secure Access with the same identity-based policy as campus and branch", "Buy more VPN licenses", "Nothing can be done"],
        answer: 1, why: "Consistent and secure access everywhere is outcome #3." },
      { t: "tf", q: "True or false: Hybrid Mesh Firewall means firewall enforcement is distributed across many places, managed centrally.",
        answer: true, why: "True. Enforcement lives in campus, branch, cloud and workload environments, with unified policy management." },
    ],
    sources: [
      { t: "Cisco Design Zone: Secure Networking Architecture", u: "https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/Intro-Cisco-Secure-Network-Architecture.html" },
      { t: "Cisco Newsroom (Nov 2025)", u: "https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2025/m11/cisco-supercharges-its-secure-enterprise-network-architecture-for-the-ai-era.html" },
      { t: "Security in Cisco Cloud Control: At a Glance", u: "https://www.cisco.com/c/en/us/products/collateral/security/security-cloud-control-aag.html" },
    ],
  },

  /* ───────────────────────── 6 ───────────────────────── */
  {
    id: "assurance",
    emoji: "🤖",
    title: "Unified Assurance & Cloud Control",
    tagline: "One place to see, understand and act, with AI helping.",
    story:
      "Security is only as good as your ability to see problems. This is the third Instant Demo scenario, 'Unified Assurance', and the home of Cisco Cloud Control, AI Assistant and AI Canvas.",
    cards: [
      {
        title: "Cisco Cloud Control",
        simple:
          "A unified platform that brings Cisco domains into one operations environment: shared inventory, topology, actions, identity, AI Assistant, AI Canvas and workflows. It complements the dashboards teams already use.",
        deep:
          "Announced at Cisco Live in June 2026 as the foundation for Cisco's AgenticOps model: one login across networking, security, compute, observability and collaboration, built so humans and AI agents work from the same data.",
      },
      {
        title: "Do not mix these up",
        simple:
          "Cisco Cloud Control is the unified operations platform. Security Cloud Control is the firewall/workload/multicloud policy management layer (formerly Cisco Defense Orchestrator). Different things, similar names.",
        deep:
          "In the dCloud collection: the Secure Networking campus demos are Cloud Control demos; the data center scenarios use Security Cloud Control for firewall, workload and multicloud enforcement. Security capabilities also appear inside Cloud Control.",
      },
      {
        title: "AI Assistant vs AI Canvas",
        simple:
          "AI Assistant: ask in plain language and get prioritized issues and next steps. AI Canvas: a shared visual workspace where people and AI agents investigate across domains together.",
        deep:
          "Canvas includes a reasoning mode where the operator reviews and approves a troubleshooting plan before agents act. Human-in-the-loop is the key reassurance for cautious customers.",
      },
      {
        title: "ThousandEyes and Splunk",
        simple:
          "ThousandEyes shows the path from user to app across networks you don't own. Splunk makes machine data searchable for security and IT ops. Together with the network they close the loop on 'is it the network, the app or an attack?'",
        deep:
          "The Network Platform and Assurance launchpad demo covers Meraki, Catalyst Center and ThousandEyes under Cloud Control.",
      },
    ],
    explore: {
      title: "Three Cloud Control experiences from the guided demo",
      layers: [
        {
          name: "Choose an experience",
          nodes: [
            { id: "a1", label: "Tenant Admin", short: "Roles, tenants, shared inventory",
              detail: "Review user roles, linked tenants, shared inventory and topology, and cross-launch into products.",
              say: "One identity, one inventory, then jump into any product." },
            { id: "a2", label: "Actions & AI Assistant", short: "Prioritized issues",
              detail: "Investigate prioritized issues, correlated alerts and recommended next steps in natural language.",
              say: "Ask in plain English, get the next best action." },
            { id: "a3", label: "AI Canvas", short: "Shared workspace",
              detail: "Bring cross-product evidence and remediation guidance together in a shared visual workspace for people and agents.",
              say: "Network, security and app teams solve it together, in one place." },
          ],
        },
        {
          name: "Which demo?",
          nodes: [
            { id: "a4", label: "Launchpad", short: "Meraki + Catalyst + ThousandEyes",
              detail: "Use the Network Platform and Assurance Launchpad when the story stays within Meraki, Catalyst Center and ThousandEyes.",
              say: "Start here for most network-led conversations." },
            { id: "a5", label: "AgenticOps in Action", short: "More domains",
              detail: "Use when the demonstration spans additional Cisco product domains beyond those three.",
              say: "Use for broader, cross-portfolio stories." },
          ],
        },
      ],
    },
    pitch: {
      audience: "IT operations lead / CIO",
      line:
        "\"Cloud Control gives your teams one place to see what's wrong, ask for help in plain language, and work with AI agents. You stay in control, because you approve the plan before any agent acts.\"",
    },
    quiz: [
      { t: "mc", q: "Which statement is correct?",
        options: ["Cloud Control and Security Cloud Control are the same product", "Cisco Cloud Control is the unified operations platform; Security Cloud Control manages firewall/workload/multicloud enforcement", "Security Cloud Control is a Wi-Fi tool", "Cloud Control is only for firewalls"],
        answer: 1, why: "A very common mix-up. The names are close but the roles differ." },
      { t: "mc", q: "A cautious customer worries about AI making changes on its own. What do you say?",
        options: ["Don't worry about it", "In AI Canvas the operator can review and approve the plan before agents run", "AI never makes changes", "Turn off AI"],
        answer: 1, why: "Human-in-the-loop approval is built into the workflow." },
      { t: "mc", q: "Which demo do you use if the story spans domains beyond Meraki, Catalyst Center and ThousandEyes?",
        options: ["Network Platform and Assurance Launchpad", "AgenticOps in Action", "Enabling Secure IoT", "Healthcare Data Center guided demo"],
        answer: 1, why: "AgenticOps in Action covers additional Cisco domains." },
      { t: "mc", q: "Which pairing is right?",
        options: ["AI Assistant: natural-language help. AI Canvas: shared visual workspace for investigation", "AI Assistant: firewall. AI Canvas: Wi-Fi", "AI Assistant: billing. AI Canvas: licensing", "They are identical"],
        answer: 0, why: "Assistant = ask and act. Canvas = collaborate and investigate." },
      { t: "tf", q: "True or false: ThousandEyes provides visibility into paths across networks you don't own, such as the internet and SaaS.",
        answer: true, why: "True: end-to-end visibility across enterprise networks, internet, cloud and SaaS." },
    ],
    sources: [
      { t: "Cisco Newsroom (June 2026): Agentic platform for operating and defending IT infrastructure", u: "https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2026/m06/cisco-unveils-agentic-platform-for-operating-and-defending-critical-it-infrastructure.html" },
      { t: "Cisco Blogs: Inside Cisco Cloud Control", u: "https://blogs.cisco.com/ai/inside-cisco-cloud-control-building-the-ai-native-platform-of-record-for-cross-domain-operations" },
      { t: "Cisco Blogs: AI Canvas is here", u: "https://blogs.cisco.com/ai/ai-canvas-controlled-availability" },
      { t: "Cisco Cloud Control release notes", u: "https://www.cisco.com/c/en/us/td/docs/ai/cisco-cloud-control/release-notes/cisco-cloud-control-release-notes.html" },
      { t: "Interactive demo: Cisco Cloud Control", u: "https://cisco.navattic.com/cisco-cloud-control" },
    ],
    verify: "Sources differ on availability: Cisco blogs describe AI Canvas as controlled availability (US commercial), while an analyst report says it has moved further. Check the release notes for current status and region before quoting availability.",
  },

  /* ───────────────────────── 7 ───────────────────────── */
  {
    id: "dc",
    emoji: "🏢",
    title: "Data Center & Cloud",
    tagline: "Same identity, same rules: enforcing from user to workload.",
    story:
      "Campus identity must not stop at the data center door. The Data Center demo profile has three scenarios that extend the same identity-based policy to the data center, inside it (east-west), and to the cloud.",
    cards: [
      {
        title: "Scenario 1: Users, devices and things → data center",
        simple:
          "Secure access to data center apps with a common identity framework. Security Cloud Control shows several enforcement points: Secure Firewall Threat Defense (FTD), Secure Access and Catalyst SD-WAN, with SGTs enforced on data center firewalls.",
        deep:
          "Talking point: common identity and consistent enforcement points across campus and data center.",
      },
      {
        title: "Scenario 2: East-west application enforcement",
        simple:
          "Most breaches spread sideways between servers. This scenario shows granular protection for traffic inside the data center, using Secure Workload for flow-level enforcement.",
        deep:
          "Talking points: application-tier protection, flow-level enforcement, SGT-based security and deep visibility into application dependencies.",
      },
      {
        title: "Scenario 3: Users, devices and things → cloud",
        simple:
          "The same policy for cloud workloads: Multicloud Defense and FTDv in AWS, with Secure Workload extending into the cloud context. The point: enforcement that is independent of the cloud provider.",
        deep:
          "Talking point: cloud service provider (CSP) independent, so security is consistent regardless of platform.",
      },
      {
        title: "Hypershield: enforcement built into the fabric",
        simple:
          "Hypershield is Cisco's AI-native, distributed enforcement layer. It puts security enforcement in the data center fabric, including smart switches, and is managed through Cloud Control.",
        deep:
          "It extends Hybrid Mesh Firewall with distributed network enforcement. It is not part of the dCloud scenarios above, so present it as the direction of travel and confirm product status first.",
      },
    ],
    explore: {
      title: "Follow the traffic: user → data center → cloud",
      layers: [
        {
          name: "North-south (into the data center)",
          nodes: [
            { id: "x1", label: "Secure Firewall (FTD)", short: "Identity-based enforcement",
              detail: "Data center firewalls enforce policy using SGTs, so the campus identity is respected.",
              say: "Your campus rules extend to the data center." },
          ],
        },
        {
          name: "East-west (inside)",
          nodes: [
            { id: "x2", label: "Secure Workload", short: "Flow-level enforcement",
              detail: "Maps application dependencies and enforces segmentation between app tiers and workloads.",
              say: "Stop lateral movement between servers." },
            { id: "x3", label: "Hypershield", short: "In the fabric",
              detail: "Distributed enforcement built into the infrastructure, such as smart switches. Verify current status.",
              say: "Security moves closer to the workload." },
          ],
        },
        {
          name: "Cloud",
          nodes: [
            { id: "x4", label: "Multicloud Defense", short: "CSP-independent",
              detail: "Cloud-native enforcement across providers. The dCloud demo shows it alongside FTDv in AWS.",
              say: "Same protection, any cloud." },
          ],
        },
        {
          name: "One control point",
          nodes: [
            { id: "x5", label: "Security Cloud Control", short: "Manage it all",
              detail: "The management layer used in the data center demos for firewall, workload and multicloud enforcement.",
              say: "One console for many enforcement points." },
          ],
        },
      ],
    },
    pitch: {
      audience: "Data center architect / CISO",
      line:
        "\"Your campus identity doesn't stop at the data center door. The same tags drive firewall rules, workload segmentation and cloud enforcement, independent of cloud provider, and you manage it from one place.\"",
    },
    quiz: [
      { t: "mc", q: "Which scenario focuses on lateral movement between servers?",
        options: ["Users to data center", "East/West application enforcement", "Users to cloud", "Guest Wi-Fi"],
        answer: 1, why: "East-west = traffic inside the data center." },
      { t: "mc", q: "'CSP independent' means:",
        options: ["It only works on one cloud", "Security stays consistent no matter which cloud provider is used", "It needs no cloud", "It replaces the cloud provider"],
        answer: 1, why: "Consistent security across cloud platforms." },
      { t: "mc", q: "Which product does the east-west scenario use for flow-level enforcement?",
        options: ["Secure Workload", "Meraki MR", "ThousandEyes", "Access Manager"],
        answer: 0, why: "Secure Workload provides application visibility and flow-level enforcement." },
      { t: "mc", q: "Which management layer is used in the data center scenarios?",
        options: ["Security Cloud Control", "Wi-Fi Planner", "Webex", "Packet Tracer"],
        answer: 0, why: "Security Cloud Control manages the firewall, workload and multicloud enforcement." },
      { t: "tf", q: "True or false: Hypershield is one of the three dCloud data center scenarios.",
        answer: false, why: "False. The scenarios cover users→DC, east-west, and users→cloud. Hypershield is part of the broader architecture direction." },
    ],
    sources: [
      { t: "dCloud: Cisco Secure Networking: Data Center (3 guided scenarios)", u: "https://dcloud2.cisco.com/content/profile/secure-networking-datacenter" },
      { t: "Cisco Hypershield overview", u: "https://www.cisco.com/c/en/us/products/collateral/security/hypershield/hypershield-so.html" },
      { t: "Cisco Security Reference Architecture", u: "https://www.cisco.com/site/us/en/products/security/cisco-security-reference-architecture/index.html" },
    ],
    verify: "Hypershield and SGT support in cloud products are evolving. Confirm current capability and availability before committing to a customer.",
  },

  /* ───────────────────────── 8 ───────────────────────── */
  {
    id: "ai",
    emoji: "🧠",
    title: "Securing AI",
    tagline: "Adopt agentic AI with confidence, using AI Defense.",
    story:
      "Customers want AI, and AI is a new attack surface. The healthcare data center guided demo shows protecting AI models, shielding vulnerabilities and segmenting the infrastructure that runs AI.",
    cards: [
      {
        title: "Two sides of AI",
        simple:
          "AI for operations (AI Assistant, AI Canvas) and security for AI (protecting models, apps and agents). The second one is what customers are anxious about.",
        deep:
          "Customer outcome #5: adopt and secure agentic AI with confidence.",
      },
      {
        title: "Cisco AI Defense: four jobs",
        simple:
          "Discover AI assets (including unsanctioned ones), validate models (automated red-teaming), protect at runtime (guardrails on prompts and responses), and manage AI supply-chain risk.",
        deep:
          "Per Cisco: validation tests 200+ threat subcategories and maps to standards such as OWASP Top 10 for LLMs and MITRE ATLAS. Runtime protection targets prompt injection, data leakage and denial of service. Supply-chain scanning of models and MCP servers is listed for the Advantage tier. Deploys as SaaS or customer-controlled environments.",
      },
      {
        title: "The network's role",
        simple:
          "AI models run on data center infrastructure. Segmentation limits who and what can reach them, and shields known vulnerabilities, even before a patch.",
        deep:
          "The demo's three themes: AI model protection, vulnerability shielding and segmentation, managed through Security Cloud Control. AI Defense also integrates with Multicloud Defense.",
      },
    ],
    explore: {
      title: "Protect the AI lifecycle",
      layers: [
        {
          name: "AI Defense capabilities",
          nodes: [
            { id: "i1", label: "Discover", short: "AI Cloud Visibility",
              detail: "Find AI models, apps, agents and MCP servers across cloud environments, including shadow AI.",
              say: "You can't protect what you can't see." },
            { id: "i2", label: "Validate", short: "Red-team",
              detail: "Automated testing for jailbreaks, prompt injection, data privacy issues and safety violations, and it generates guardrails.",
              say: "Test the model before attackers do." },
            { id: "i3", label: "Protect", short: "Runtime guardrails",
              detail: "Inspect prompts and responses in real time to block injection, data leakage and misuse.",
              say: "Guardrails that work while the model is live." },
            { id: "i4", label: "Supply chain", short: "Scan",
              detail: "Scan model files, repositories and MCP servers before they enter development (Advantage tier).",
              say: "Know what you're building on." },
          ],
        },
        {
          name: "Network side",
          nodes: [
            { id: "i5", label: "Segmentation", short: "Isolate AI workloads",
              detail: "Use identity-based segmentation so only approved users and services reach AI infrastructure.",
              say: "Limit who can even talk to the model." },
            { id: "i6", label: "Vulnerability shielding", short: "Before patching",
              detail: "Enforcement points can shield known vulnerabilities while patching is scheduled. The demo shows this via Security Cloud Control.",
              say: "Reduce risk while you patch on your schedule." },
          ],
        },
      ],
    },
    pitch: {
      audience: "CISO / head of AI",
      line:
        "\"You can say yes to AI. Cisco finds your AI assets, tests models before launch, adds runtime guardrails, and the network isolates the infrastructure underneath. One architecture, one story for the board.\"",
    },
    quiz: [
      { t: "mc", q: "Which is NOT one of the AI Defense capabilities described by Cisco?",
        options: ["Discover AI assets", "Validate models", "Runtime protection", "Printing management"],
        answer: 3, why: "AI Defense covers discovery, validation, runtime protection and supply chain." },
      { t: "mc", q: "'Shadow AI' discovery means:",
        options: ["Finding unsanctioned AI assets in the environment", "Dimming dashboards", "Deleting models", "Training models faster"],
        answer: 0, why: "AI Cloud Visibility finds AI assets including unsanctioned ones." },
      { t: "mc", q: "What are the three themes of the healthcare data center guided demo?",
        options: ["AI model protection, vulnerability shielding, segmentation", "Wi-Fi, switching, routing", "Backup, DR, archive", "Billing, ticketing, chat"],
        answer: 0, why: "These are the demo's three themes." },
      { t: "tf", q: "True or false: AI Defense only works if the customer sends all data to Cisco.",
        answer: false, why: "False. Cisco describes SaaS and customer-controlled deployment options where only management-plane metadata is sent." },
    ],
    sources: [
      { t: "Cisco AI Defense solution overview", u: "https://www.cisco.com/c/en/us/products/collateral/security/ai-defense/ai-defense-so.html" },
      { t: "Cisco AI Defense data sheet", u: "https://www.cisco.com/c/en/us/products/collateral/security/ai-defense/ai-defense-ds.html" },
      { t: "dCloud guided demo: Securing your Healthcare Data Center with Security Cloud Control and AI Defense", u: "https://dcloud2.cisco.com/content/instantdemo/navattic-securing-healthcare-data-cloud-control-ai-defense-guided" },
    ],
    verify: "AI Defense packaging tiers and supported platforms change often. Check the data sheet for what is in each tier.",
  },

  /* ───────────────────────── 9 ───────────────────────── */
  {
    id: "pitch",
    emoji: "🎤",
    title: "Pitch It: Demos & Conversations",
    tagline: "Pick the right demo, ask the right question, tell the right story.",
    story:
      "You know the architecture. The last skill is choosing what to show and when. The dCloud collection gives you three demo types and three stages: Quick Start, Sales Enablement and Practical Experience.",
    cards: [
      {
        title: "Three demo types",
        simple:
          "Guided = pre-recorded click-through, never fails. Instant = live, always-on, read-only exploration. Scheduled = dedicated live environment booked for a date and time.",
        deep:
          "The dCloud page groups content into Quick Start (start conversations), Sales Enablement (deeper conversations) and Practical Experience (technical deep dive and hands-on learning).",
      },
      {
        title: "The right demo for the moment",
        simple:
          "First meeting: a Guided demo. Deeper architecture conversation: the Secure Networking Instant Demo. Technical proof: the Solution Demo (Cloud-Managed Campus Networking for the AI Era).",
        deep:
          "The Instant Demo has three self-contained scenarios: Campus Networking Landscape, Securing the User and Unified Assurance. It's read-only and live.",
      },
      {
        title: "The 3-question opener",
        simple:
          "1) What are you trying to enable (AI, new sites, remote work)? 2) What worries you most (risk, complexity, compliance)? 3) How do your teams work today (cloud, on-prem, scripts)?",
        deep:
          "Map answers to outcomes, then to a domain, then to a demo. This is the whole sales motion in one line.",
      },
    ],
    explore: {
      title: "Pick the demo",
      layers: [
        {
          name: "Quick Start (Guided)",
          nodes: [
            { id: "g1", label: "Healthcare IoT + XDR + Splunk", short: "Campus & branch",
              detail: "Zero-config click-through. Create an IoT network for medical devices and enable vendor remote access.", say: "Use for hospital and IoT conversations." },
            { id: "g2", label: "AIgent of Change", short: "General",
              detail: "Scalable messaging of the Secure Networking architecture, available any time.", say: "Use when you need a demo fast." },
            { id: "g3", label: "Data Center (3 scenarios)", short: "Data center & cloud",
              detail: "Users→DC, east-west, users→cloud enforcement with Security Cloud Control.", say: "Use for DC and cloud conversations." },
          ],
        },
        {
          name: "Sales Enablement (Instant)",
          nodes: [
            { id: "g4", label: "Cisco Secure Networking", short: "Read-only live",
              detail: "Scenarios: Campus Networking Landscape, Securing the User, Unified Assurance.", say: "Use for in-depth architecture conversations." },
          ],
        },
        {
          name: "Practical Experience (Solution)",
          nodes: [
            { id: "g5", label: "Cloud-Managed Campus for the AI Era", short: "Deep dive",
              detail: "Show how Meraki and Cisco work better together; scheduled option gives hands-on learning.", say: "Use for technical proof." },
          ],
        },
      ],
    },
    pitch: {
      audience: "Your next customer",
      line: "Use the Pitch Lab (menu) to generate a tailored opener for any audience and outcome.",
    },
    quiz: [
      { t: "mc", q: "You have 15 minutes with a CIO and no time for setup. Which demo?",
        options: ["A Scheduled demo", "A Guided demo", "Building a lab", "None"],
        answer: 1, why: "Guided demos are zero-config, click-through, and 'stress-free presenting'." },
      { t: "mc", q: "The customer wants to explore the live architecture themselves. Which?",
        options: ["Guided", "Instant", "A slide deck", "A white paper"],
        answer: 1, why: "Instant demos are live, always-on and user-driven." },
      { t: "mc", q: "Which demo has the scenarios 'Campus Networking Landscape, Securing the User, Unified Assurance'?",
        options: ["Cisco Secure Networking Instant Demo", "AIgent of Change", "Data Center profile", "Enabling Secure IoT"],
        answer: 0, why: "That's the Cisco Secure Networking Instant Demo." },
      { t: "order", q: "Order the sales motion.",
        items: ["Ask discovery questions", "Map pain to an outcome", "Map outcome to a domain", "Choose the demo and show it"],
        why: "Discover → outcome → domain → demo." },
      { t: "mc", q: "A customer's pain is lateral movement inside their data center. Which message and demo?",
        options: ["Wi-Fi 7 and AIgent of Change", "East-west enforcement with Secure Workload (Data Center, East/West scenario)", "AI Canvas only", "Enabling Secure IoT"],
        answer: 1, why: "Match the pain to the scenario." },
    ],
    sources: [
      { t: "Cisco dCloud: Secure Networking collection", u: "https://content.ciscodcloud.com/us/en/home/solutions/secure-networking.html" },
      { t: "Instant Demo: Cisco Secure Networking", u: "https://dcloud2.cisco.com/instantdemo/uncover-secure-networking-architecture" },
    ],
  },
];

/* Demo catalog for the Playbook page (taken from the reference document). */
const DEMOS = [
  { name: "Cisco Cloud Control Interactive Demos", cat: "Cloud Control", stage: "Priority", type: "Guided", when: "Simple scenario walkthrough: Tenant Admin, Actions & AI Assistant, AI Canvas.", url: "https://cisco.navattic.com/cisco-cloud-control" },
  { name: "Cisco Network Platform and Assurance Launchpad", cat: "Cloud Control", stage: "Priority", type: "Instant", when: "Story stays within Meraki, Catalyst Center and ThousandEyes. Read-only.", url: "https://dcloud2.cisco.com/content/profile/cisco-network-platform-and-assurance-launchpad" },
  { name: "Cisco Cloud Control: AgenticOps in Action", cat: "Cloud Control", stage: "Priority", type: "Instant", when: "Story spans more Cisco domains than Meraki, Catalyst Center and ThousandEyes.", url: "https://dcloud2.cisco.com/content/instantdemo/agenticops-with-cisco-cloud-control" },
  { name: "Secure Campus and Branch Networking for Healthcare with XDR and Splunk", cat: "Campus & Branch", stage: "Quick Start", type: "Guided", when: "Healthcare IoT: new medical-device network and vendor remote access.", url: "https://dcloud2.cisco.com/instantdemo/navattic-secure-campus-branch-networking-healthcare-xdr-splunk-guided" },
  { name: "Cisco Secure Networking", cat: "Campus & Branch · Data Center · Observability", stage: "Sales Enablement", type: "Instant", when: "In-depth architecture conversation. Three scenarios: Campus Networking Landscape, Securing the User, Unified Assurance.", url: "https://dcloud2.cisco.com/instantdemo/uncover-secure-networking-architecture" },
  { name: "Cloud-Managed Campus Networking for the AI Era", cat: "Campus & Branch", stage: "Practical Experience", type: "Solution", when: "Technical deep dive; proves Meraki and Cisco work better together. Scheduled option for hands-on.", url: "https://dcloud2.cisco.com/content/profile/cloud-managed-campus-network-ai-era" },
  { name: "Secure Networking — Enabling Secure IoT", cat: "Campus & Branch", stage: "Quick Start", type: "Guided", when: "Zero-config, One Cisco message and platform value for IoT.", url: "https://dcloud2.cisco.com/instantdemo/navattic-secure-networking-iot-microdemo" },
  { name: "AIgent of Change: Secure Networking Demo", cat: "Campus & Branch", stage: "Quick Start", type: "Guided", when: "Fast, no-setup demo of the architecture and AI-ready modernization.", url: "https://dcloud2.cisco.com/content/profile/aigent-of-change-secure-networking" },
  { name: "Securing your Healthcare Data Center with Security Cloud Control and AI Defense", cat: "Data Center", stage: "Quick Start", type: "Guided", when: "AI model protection, vulnerability shielding and segmentation.", url: "https://dcloud2.cisco.com/content/instantdemo/navattic-securing-healthcare-data-cloud-control-ai-defense-guided" },
  { name: "Cisco Secure Networking — Data Center", cat: "Data Center", stage: "Quick Start", type: "Guided", when: "Profile with three scenarios across data center and cloud.", url: "https://dcloud2.cisco.com/content/profile/secure-networking-datacenter" },
  { name: "· Users, Devices, and Things to Data Center Enforcement", cat: "Data Center", stage: "Quick Start", type: "Guided", when: "Common identity; SGT enforcement on DC firewalls; FTD, Secure Access, Catalyst SD-WAN.", url: "https://dcloud2.cisco.com/content/instantdemo/navattic-secure-network-users-devices-things-datacenter-enforcement-guided" },
  { name: "· East/West Application Enforcement", cat: "Data Center", stage: "Quick Start", type: "Guided", when: "Lateral movement; Secure Workload flow-level enforcement.", url: "https://dcloud2.cisco.com/content/instantdemo/navattic-secure-network-east-west-app-enforcement-guided" },
  { name: "· Users, Devices, and Things to Cloud Enforcement", cat: "Data Center", stage: "Quick Start", type: "Guided", when: "CSP-independent enforcement: Multicloud Defense, FTDv in AWS, Secure Workload.", url: "https://dcloud2.cisco.com/content/instantdemo/navattic-secure-network-users-devices-things-cloud-enforcement-guided" },
];

const GLOSSARY = [
  ["Secure Networking", "Network design with security and deep visibility built in, to protect confidentiality, integrity and availability."],
  ["SNRA", "Secure Network Reference Architecture: Cisco's validated design for campus, branch, hybrid and distributed enterprises."],
  ["ISE", "Identity Services Engine: authentication, authorization, profiling, posture. The primary source of identity context."],
  ["SGT", "Security Group Tag: a label on users/devices so policy is written by role, not IP address."],
  ["TrustSec", "Cisco's group-based policy approach: classify, propagate, enforce."],
  ["SXP", "Security Group Tag Exchange Protocol: shares IP-to-SGT mappings where inline tagging isn't possible."],
  ["Macro-segmentation", "Separating large zones, such as virtual networks/VRFs."],
  ["Micro-segmentation", "Controlling traffic between groups inside a zone, for example with SGTs."],
  ["Meraki Dashboard", "Cloud-managed networking and security management."],
  ["Catalyst Center", "On-premises LAN automation, assurance and operations."],
  ["Access Manager", "SaaS identity-based access control in Meraki Dashboard, powered by ISE."],
  ["Cisco Cloud Control", "Unified operations platform: shared inventory, AI Assistant, AI Canvas, workflows."],
  ["Security Cloud Control", "Cloud management for firewalls, workload and multicloud enforcement (formerly Cisco Defense Orchestrator). Not the same as Cloud Control."],
  ["AI Assistant", "Natural-language help for operations: prioritized issues and next steps."],
  ["AI Canvas", "Shared visual workspace where people and AI agents investigate and act."],
  ["AgenticOps", "Operating model in which AI agents work with humans on IT operations."],
  ["Secure Access", "Cisco's cloud-delivered security service edge: Zero Trust access and protection for users."],
  ["SASE / SSE", "SASE = SD-WAN + security service edge (SSE) as one service."],
  ["Hybrid Mesh Firewall", "Firewall enforcement distributed across campus, branch, cloud and workloads with unified management."],
  ["FTD", "Secure Firewall Threat Defense."],
  ["Secure Workload", "Application visibility and workload segmentation, including east-west flow enforcement."],
  ["Multicloud Defense", "Cloud-native security enforcement across cloud providers."],
  ["Hypershield", "AI-native, distributed enforcement built into the infrastructure fabric."],
  ["AI Defense", "Security for AI models, apps and agents: discover, validate, protect, supply chain."],
  ["ThousandEyes", "End-to-end digital experience and path visibility across networks, internet and SaaS."],
  ["XDR", "Extended detection and response: correlates threats across domains."],
  ["Splunk", "Platform for searching and analyzing machine data for security and IT operations."],
];

# 03 — PMS, Proptech and AI Landscape for an AI-first Operating Layer at Asset Living

Research date: 2026-11-21. Scope: the technology an AI-first "operating system" must sit on top of and compete with. Company profile, competitors/economics and pain points are covered in sibling documents.

## How to read this document

Every material statement carries one of four labels:

| Label | Meaning |
|---|---|
| **[C]** Confirmed | Stated in a primary source (the company's own site, a filing, a court/regulator document, a dated press release from the party concerned) that I fetched or that a search surfaced verbatim. |
| **[V]** Vendor claim | Comes from vendor marketing or a vendor press release. Treat numbers as unaudited. |
| **[I]** Inference | My reasoning from the evidence. Not stated anywhere. |
| **[U]** Unverified | Reported by a secondary source, an aggregator, or with conflicting versions; I could not confirm it. |

Method caveats that apply throughout:

- Several vendor sites (yardi.com, globenewswire.com, businesswire.com) returned HTTP 403 to direct fetches. For those, facts come from search-result extracts of the same pages. URLs are given so they can be checked by hand.
- Supergood, Propexo, Rentvine and Funnel are cited for integration facts. Each sells an alternative to the thing it describes, so its characterisations of incumbent restrictiveness are interested testimony.
- No PMS vendor publishes a fee schedule for its integration program. All dollar figures for interface fees are secondary.

---

## Executive summary

1. **Asset Living is a three-PMS shop, by its own description.** Its services page says "Experts in Yardi, RealPage, Entrata, and a suite of property management systems", offers "client-tailored technology stacks" and claims a "PMS-agnostic data architecture" [C] ([assetliving.com/property-management/services](https://assetliving.com/property-management/services)). The premise of the prototype (PMS as plumbing, one layer on top) matches how the company already describes itself.
2. **EliseAI is the incumbent AI layer at Asset Living, and it is expanding.** Partnership announced 2025-09-16 across leasing, collections and resident communications [C] ([Asset Living blog](https://www.assetliving.com/blogs/asset-living-advances-operational-excellence-with-eliseai-partnership)). EliseAI raised $350M at a $4B valuation on 2026-09-29 and launched "Apollo", a single agent across its platform, on 2026-09-03 ([Fortune](https://fortune.com/2026/09/29/elise-ai-4-billion-valuation-funding-round-housing-unicorn-andreessen-bessemer/), [Commercial Observer](https://commercialobserver.com/2026/09/eliseai-ai-agent-apollo/)). Any prototype has to answer "why not just more Elise?"
3. **Every major PMS shipped agents in 2025-26 and each now has its own "AI operating system" story:** Yardi Virtuoso, RealPage Lumina, Entrata OXP / Entrata Pro, AppFolio Realm-X, MRI Agora, ResMan/Inhabit, Rent Manager Orion. Each one stops at its own vendor boundary.
4. **The integration picture changed materially in mid-2026.** Yardi and RealPage both opened governed, licensed MCP access for third-party AI assistants (Yardi Virtuoso Connector for Claude, 2026-06-16; RealPage Lumina Connect, 2026-08-10). The classic API programs remain gated, paid and partner-only.
5. **The white space is cross-PMS orchestration for a third-party manager, plus the Owners and Back Office pillars.** No vendor found covers a manager running Yardi + RealPage + Entrata with one agentic layer, one owner-facing surface and one audit trail.
6. **Regulatory constraints are real but uneven.** Federal fair-housing AI guidance was withdrawn in 2025, while state and city rules on algorithmic rent pricing multiplied and private suits under them began in July-August 2026. Asset Living is itself a named defendant in the RealPage class action (2023 complaint).

---

## Part A — Asset Living's technology stack (public evidence)

### A.1 Summary table

| Domain | System / vendor | Status | Evidence |
|---|---|---|---|
| PMS (conventional) | Yardi (Voyager implied), RealPage (OneSite), Entrata | **[C]** multi-PMS | Own site: "Experts in Yardi, RealPage, Entrata, and a suite of property management systems" ([services page](https://assetliving.com/property-management/services)). Job postings: Systems Support Specialist supports "our RealPage, Entrata, and/or Yardi property management systems" ([Built In](https://builtin.com/job/systems-support-specialist/7291470)); Director, Systems requires "enterprise property management systems (Entrata, RealPage, Yardi)" and directs "implementations, migrations, upgrades, and integrations across multiple property management platforms" ([Built In](https://builtin.com/job/director-systems/8101988)); Marketing Systems Associate: "Yardi, Onesite, Entrata" ([Built In](https://builtin.com/job/marketing-systems-associate/7435775)). |
| PMS (affordable) | RealPage OneSite Tax Credit / Affordable; Yardi Affordable | **[C]** | Affordable compliance postings ask for "Yardi Affordable and/or Real Page software" ([Built In](https://builtin.com/job/affordable-compliance-manager/7238590)); others name RealPage OneSite Tax Credit ([Greenhouse listing](https://job-boards.greenhouse.io/assetliving/jobs/5430117004)). |
| PMS (student) | Entrata Student | **[C] historic, [I] current** | Asset Campus Housing adopted Entrata Student and helped develop it, 2014-02-18, 115+ properties and 60,000+ beds at the time ([PRWeb](https://www.prweb.com/releases/2014/02/prweb11586261.htm)). Asset Living executives still appear in Entrata student webinars ([Entrata](https://www.entrata.com/resource/where-student-housing-meets-multifamily-webinar)). No current confirmation that the student portfolio is still predominantly on Entrata. |
| Other PMS (AppFolio, ResMan, MRI, Rent Manager) | "a suite of property management systems" | **[I]** | Likely present at owner-dictated properties and via acquisitions. No named evidence found. |
| AI leasing / resident comms | EliseAI: LeasingAI, VoiceAI, Maintenance, Delinquency, Renewals; piloting Lease Audits and AI-Guided Tours | **[C]** | [Asset Living blog, 2025-09-16](https://www.assetliving.com/blogs/asset-living-advances-operational-excellence-with-eliseai-partnership); [EliseAI customer story](https://eliseai.com/customer-stories/how-asset-living-revamped-lead-nurturing-and-delinquency-management-with-eliseai). Earlier student deployment: [EliseAI student case study PDF](https://info.eliseai.com/hubfs/AssetLiving_%20LeasingAI_StudentHousing_CaseStudy_0623.pdf). Deployment breadth (how many of ~450k units are live) is not stated. |
| CRM | EliseAI CRM and Knock (RealPage) | **[I]** from job posting | "Experience with industry-related CRMs – Elise AI, Knock, etc." ([Built In](https://builtin.com/job/marketing-systems-associate/7435775)). Entrata and Yardi CRM modules presumably used where those PMSs run. |
| Legacy leasing bots | "ACE" virtual leasing assistant powered by LeaseHawk (39 communities, 2022); BetterBot | **[C] historic** | [ACE case study](https://assetliving.com/case-studies/asset-living-ace-tm-virtual-leasing-assistant-powered-by-leasehawk); [case studies index](https://assetliving.com/resources/case-studies). Current status after the EliseAI rollout is unknown. |
| Resident onboarding | Moved | **[V]** | Moved announced a partnership to automate resident onboarding ([moved.com](https://moved.com/?p=28725)). |
| Student roommate matching | RoomSync (exclusive partner) | **[V]** | [RoomSync](https://roomsync.com/post/roomsync-partners-with-asset-living-for-nationwide-roommate-matching-solution). |
| Smart building / access | SKBM Smart Technology, preferred partner for smart-building projects (July 2025). SKBM is a vendor-agnostic aggregator, so device brands vary by property | **[C]** | [PR Newswire](https://www.prnewswire.com/news-releases/skbm-smart-technology-and-asset-living-forge-strategic-smart-building-partnership-302493381.html). |
| Managed Wi-Fi | Pavlov Media, preferred national partner (2025) | **[C]** | [Pavlov Media](https://pavlovmedia.com/?p=6792). |
| Amenity services | Valet Living national preferred partner (2022) | **[C]** | [PR Newswire](https://prnewswire.com/news-releases/valet-living-and-asset-living-announce-national-preferred-partnership-agreement-bringing-amenity-services-to-multifamily-housing-communities-nationwide-301573149.html). |
| Vendor credentialing | NetVendor | **[I]** | "Vendor Enrollment" link on the services page points to netvendor.net ([services page](https://assetliving.com/property-management/services)). |
| Marketing / websites | Poetic (in-house agency, acquired Dec 2020); "over 1,200 multifamily websites" | **[C]** | [Asset Living blog](https://www.assetliving.com/blogs/asset-living-acquires-poetic-digital); [services page](https://assetliving.com/property-management/services). |
| BI / data | In-house data team; "PMS-agnostic data architecture"; "interactive owner portals ... with drill-through capabilities and export tools"; automated reports | **[C] that it exists, [U] which tools** | [services page](https://assetliving.com/property-management/services). SVP Data Strategy & Automation (Codie Riggs, promoted 2025-03-28) ([Asset Living blog](https://assetliving.com/blogs/asset-living-promotes-codie-riggs-to-senior-vice-president-data-strategy-automation)). A "Data Engineering and Science Lead" role asks for ETL, SQL, Python and cloud data solutions ([Built In](https://builtin.com/job/data-engineering-and-science-lead/3341107)). No warehouse or BI product is named anywhere I found. |
| Revenue management | RealPage revenue management (LRO historically) | **[U]** product; **[C]** litigation exposure | A 2012 LRO implementation is listed in a third-party customer database ([Apps Run The World](https://www.appsruntheworld.com/customers-database/customers/view/asset-living-united-states)), low confidence. Asset Living, LLC is a named defendant in the January 2023 RealPage class complaint ([complaint PDF](https://www.saverilawfirm.com/hubfs/0001%20-%202023-01-23%20Complaint.pdf?hsLang=en)). Which pricing tool runs where today is owner-dependent and not public. |
| Accounting / AP | PMS-native ledgers; "centralized AP operating practices" | **[C]** practice, **[U]** tooling | [services page](https://assetliving.com/property-management/services). AP postings describe invoice entry for ~15 properties per specialist and do not name an AP automation product ([Greenhouse](https://job-boards.greenhouse.io/assetliving/jobs/5302473004)). |
| Screening, payments | Not found | **[U]** | Probably PMS-native per property (Yardi ScreeningWorks/RentCafe payments, RealPage, Entrata) [I]. |
| IT service desk | Freshservice | **[I]** | "using Freshservice or similar ticketing platforms" ([Built In](https://builtin.com/job/marketing-systems-associate/7435775)). |
| Recruiting | Greenhouse ATS; "AI-driven" recruiting technology (vendor unnamed) | **[C]** / **[V]** | [Greenhouse board](https://job-boards.greenhouse.io/assetliving/jobs/5669682004); [services page](https://assetliving.com/property-management/services). |
| Productivity | Microsoft 365, Google Workspace | **[I]** | Listed in the Property IT VP announcement ([Asset Living blog, 2026-05-26](https://www.assetliving.com/blogs/asset-living-promotes-lucas-bigham-to-vice-president-property-it)). |
| Insurance program | Lockton | **[C]** | [services page](https://assetliving.com/property-management/services). |

### A.2 AI and automation posture

- **[C]** A "phased AI adoption roadmap" exists inside Property IT. The VP Property IT (promoted 2026-05-26) says: "My goal is to continue advancing our AI strategy to drive operational efficiency and reduce reactive work" ([Asset Living blog](https://www.assetliving.com/blogs/asset-living-promotes-lucas-bigham-to-vice-president-property-it)).
- **[C]** A data/automation executive role exists: SVP Data Strategy & Automation, focused on "driving efficiency through automation, empowering teams with actionable insights" ([Asset Living blog](https://assetliving.com/blogs/asset-living-promotes-codie-riggs-to-senior-vice-president-data-strategy-automation)).
- **[C]** A Chief Transformation Officer is listed on the leadership page ([Cory Hitte](https://www.assetliving.com/leadership/cory-hitte)). A new COO was appointed 2026-07-08 ([Asset Living blog](https://www.assetliving.com/blogs/asset-living-appoints-industry-veteran-marti-burrows-as-chief-operating-officer)).
- **[V]** EliseAI results at Asset Living: +591 bps on-time rent payments, +278 bps occupancy since the start of 2025, ~85% of transactional communications automated, 72-78 hours of monthly capacity per community (the page gives both figures) ([EliseAI customer story](https://eliseai.com/customer-stories/how-asset-living-revamped-lead-nurturing-and-delinquency-management-with-eliseai)). No independent verification.
- **[U]** A third-party tracker lists a 2026 evaluation of the Floatbot chatbot platform ([Apps Run The World](https://www.appsruntheworld.com/customers-database/customers/view/asset-living-united-states)). Low confidence; the same page lists implausible items.
- **[I]** I found no announced in-house AI product, no named RPA platform, and no named data warehouse. The "owner portal" and "PMS-agnostic data architecture" are the closest in-house assets and are the natural attachment point for a new layer.

### A.3 What this means

- **[I]** Asset Living already runs a de facto layer above the PMS for one pillar (Residents/leasing, via EliseAI) and a reporting layer for another (Owners, via its BI/owner portal). Operations and Back Office appear to live mostly inside each PMS.
- **[I]** In third-party management the PMS licence, database and pricing tool are frequently the owner's choice. That makes integration rights a per-owner question, which no single vendor program resolves.

---

## Part B — Systems of record and integration reality

### B.1 Market position

I could not find a defensible, sourced market-share table. Aggregator figures exist (for example Yardi 22.4%, RealPage 15.2%, Entrata 12.9%) but cite no method ([Gitnux](https://gitnux.org/property-management-software-industry-statistics/)) **[U]**. Qualitative positions:

| System | Position | Data domains held |
|---|---|---|
| **Yardi Voyager** (+ RentCafe, CRM IQ, Breeze for small portfolios) | Privately held; the dominant accounting-grade system of record for institutional owners [I]. Agents require Voyager 8 and are not available in Breeze ([Yardi Virtuoso page](https://www.yardi.com/virtuoso/)) [V]. | GL/AP/AR, rent roll, leases, residents, work orders, job cost/capex, budgets, owner/investor reporting; RentCafe for marketing, leasing, portal, payments ([apis.io listing of Yardi interfaces](https://apis.io/providers/yardi/)). |
| **RealPage OneSite** (+ Knock CRM, LOFT resident app, AI Revenue Management, Buildium/Propertyware for SMB) | Owned by Thoma Bravo. Strong in conventional and affordable; acquired Knock in 2022 ([Multifamily Dive](https://www.multifamilydive.com/news/realpage-acquires-knock-crm/633287/)). Claims "more than 20 million units of operational data" [V] ([RealPage](https://www.realpage.com/news/realpage-introduces-lumina-ai-suite/)). | Leasing and rents, residents, ledgers, affordable compliance, facilities, spend/procurement, screening, pricing. |
| **Entrata** | Single-platform PMS, strongest in student and growing in conventional; ~2.5 million units [V] ([GlobeNewswire, 2026-06-07](https://www.globenewswire.com/news-release/2026/06/07/3307751/0/en/Entrata-Collaborates-with-OpenAI-to-Define-the-Future-of-Autonomous-Property-Management.html)). | Resident PII, leases, payments, ledgers, maintenance, utilities, marketing/websites, accounting. |
| **AppFolio** | Public; SMB to mid-market, moving upmarket; Plus/Max plan tiers. | Accounting, leasing, maintenance, resident comms, investment management. |
| **ResMan** (Inhabit) | Mid-market conventional and affordable; part of Inhabit. | Accounting, leasing, affordable compliance, reporting. |
| **MRI Software** | Residential, affordable and commercial; "open and connected" positioning. | Accounting, leasing, affordable/HUD compliance, commercial lease data. |
| **Rent Manager** (LCS) | Smaller and mixed portfolios; highly customisable. | Accounting, leasing, maintenance, telephony (rmVoIP). |
| **Student-specific** | Entrata Student, Yardi Student Housing Suite, RealPage Student; StarRez for on-campus/institutional housing ([Yardi](https://www.yardi.com/market/student-housing/), [G2 comparison](https://www.g2.com/compare/entrata-vs-starrez)). No market-share data found [U]. | By-the-bed leasing, roommate matching, guarantors, academic-year turn. |
| **Affordable-specific** | Yardi Affordable, RealPage OneSite Affordable/Tax Credit, MRI affordable products. Asset Living postings name the first two [C]. | Certifications, income/asset verification, LIHTC/HUD/HOME compliance, waitlists. |

### B.2 Integration reality by system

**Yardi**

- **[C]** No public API. Access is through the Standard Interface Partnership Program: a separate Data Exchange Agreement and an annual licence fee per interface type, sometimes transactional; vendor must be two years old with three active Voyager clients ([Yardi interfaces page](https://yardi.com/services/interfaces), summarised at [apis.io](https://apis.io/providers/yardi/)).
- **[U]** The fee is widely reported at about $25,000 per interface per year ([Supergood report card](https://supergood.ai/api-report-card/yardi-voyager); [Propexo knowledge base](https://propexo-knowledge-base.help.usepylon.com/articles/6920009722-how-many-yardi-interfaces-can-i-access)). Yardi does not publish it.
- **[U]** Rent payments, tenant screening and renters insurance are reported as carved out of the partner program and reserved for Yardi modules ([Supergood](https://supergood.ai/api-report-card/yardi-voyager)).
- **[C]** Named interfaces: Common Data (properties, units, tenants, chart of accounts), Billing and Payments (resident transactions), Service Requests (work orders), Vendor Invoicing (invoices, POs, payables), Job Cost; plus the RentCafe API ([apis.io](https://apis.io/providers/yardi/)). SOAP-era, no webhooks; many integrations fall back to nightly SFTP flat files ([Supergood](https://supergood.ai/api-report-card/yardi-voyager)) [U on the last point].
- **[V]** Five egress paths as of August 2026: scheduled ETL file exports; SOAP/REST interfaces; **Yardi Replicate** (change-data-capture of raw Voyager tables to Snowflake/AWS/Azure, requires Yardi Private Cloud and separate licence); **Yardi Data Connect** (curated semantic model to Power BI); and the **Virtuoso MCP connector** ([Propexo, 2026-08-14](https://propexo.com/blog/legacy-pms-data-integration/)).
- **[C]** Recent opening: Yardi added a **Virtuoso Connector for Claude** on 2026-06-16, authenticating through Yardi so data access follows existing user permissions, available as part of Virtuoso Enterprise ([Yardi press release](https://www.yardi.com/news/press-releases/yardi-adds-virtuoso-connector-for-claude-to-its-ai-platform/)); a Yardi Matrix connector followed 2026-06-17 ([Yardi](https://www.yardi.com/news/press-releases/yardi-publishes-second-connector-bringing-yardi-matrix-to-claude/)). A Yardi blog headline dated 2026-10-30 says connectors now work with Claude, Copilot and ChatGPT ([Yardi blog](https://yardi.com/blog)) [U, headline only]. Read versus write scope and the tool list are not public.

**RealPage**

- **[C]** Access runs through RealPage Exchange. Two tracks: **Registered Vendor** (free, lighter approval, limited APIs, some SFTP) and **AppPartner** (paid, stricter approval, fuller APIs). No file or document upload through the API ([Propexo RealPage notes](https://docs.propexo.com/pms-guidance/real-page/important-notes); [RealPage Registered Vendor spec](https://www.realpage.com/lp/online-data-exchange-migration/assets/Registered_Vendor_Technical_Specifications.pdf)).
- **[C]** Certification review per integration and per-client enablement via the Integration Marketplace ([RealPage, 2024-01-15](https://www.realpage.com/news/realpage-announces-the-evolution-of-realpage-exchange/)). Fees are not published [U].
- **[V]** RealPage claims 800+ integrated applications and nearly one billion API transactions per month ([RealPage Exchange](https://www.realpage.com/exchange/)).
- **[C]** Recent opening: **Lumina Connect**, announced 2026-08-10. **Lumina Data Cloud** gives zero-copy, read-only access in Snowflake, Databricks, Microsoft Fabric and Google Cloud. **Lumina Model Connect** exposes governed data models to AI agents over MCP, with ChatGPT first and Claude and Copilot planned. Both are licensed add-ons ([RealPage](https://www.realpage.com/news/realpage-introduces-lumina-ai-suite/); [Propexo](https://propexo.com/blog/legacy-pms-data-integration/)). Both are described as read paths; I found no write path for third-party agents.
- **[C]** Constraint specific to RealPage: the DOJ final judgment (proposed 2025-11-24, approved by the court May 2026) limits how RealPage sources and shares nonpublic landlord data ([Federal Register](https://www.federalregister.gov/documents/2025/12/05/2025-21966/united-states-of-america-et-al-v-realpage-inc-et-al-proposed-final-judgment-and-competitive-impact); [Law360](https://www.law360.com/real-estate-authority/articles/2479431)).

**Entrata**

- **[C]** Modernised API gateway rolled out with a new Partner Program; the legacy gateway was deprecated 2025-04-15 ([Entrata API docs](https://docs.entrata.com/api-documentation)). Enhanced API Program announced 2024-04-04 ([Entrata](https://www.entrata.com/press/entrata-introduces-enchanced-api-program-commitment-to-building-best-partner-ecosystem-in-the-industry)).
- **[U]** RPC-style POSTs with OAuth 2.0; partner approval, no self-serve; IP allowlisting; coverage limited to specific endpoints ([Supergood](https://supergood.ai/api-report-card/entrata); [apis.io](https://apis.io/providers/entrata/)).
- **[U]** Fees: sources conflict. Trade commentary says Entrata began charging for API access that used to be free ([Multifamily NEXT](https://multifamilynext.com/hidden-api-fees-the-integration-tax-nobody-warned-you-about/)); Propexo says the fee depends on expected call volume ([Propexo](https://docs.propexo.com/pms-guidance/entrata/approval-qa-process)). No published schedule. Webhook support is claimed in secondary commentary and not confirmed.
- **[I]** No evidence of an Entrata MCP connector for third-party assistants. Entrata Pro (October 2026) lets operators "use leading frontier and open-source models" inside Entrata, which is a bring-the-model-in posture, the opposite of Yardi's and RealPage's connectors ([Entrata Pro release](https://www.financialcontent.com/article/gnwcq-2026-10-6-entrata-pro-puts-ai-to-work-without-leaving-the-operating-system)).

**AppFolio**

- **[U]** Stack partner program: partner application, security questionnaire, paid marketplace listing; read-only for Plus customers and read/write for Max; payments, screening and insurance excluded ([Propexo](https://docs.propexo.com/pms-guidance/appfolio/integration-and-partnership); [Rentvine](https://www.rentvine.com/blog/appfolio-api-restrictions) — a competitor).
- **[C]** Realm-X Connector for Claude announced 2026-06-16 as a "secure agent-to-agent connector" where Claude triggers multi-step workflows under AppFolio guardrails; included in all plans as of 2026-09-29 ([AppFolio, June](https://www.appfolio.com/newsroom/appfolio-deepens-agentic-ai-across-leasing-accounting-and-resident-operations); [AppFolio, September](https://www.appfolio.com/newsroom/appfolios-most-powerful-ai-yet-now-standard-for-every-customer)). This is the only incumbent connector I found that is explicitly described as executing workflows, not just reading.

**ResMan, MRI, Rent Manager**

- **ResMan:** partner application, approval and "a minimal fee" [V] ([ResMan](https://www.myresman.com/partner-with-resman/)). A community MCP server exists ([mcpservers.org](https://mcpservers.org/servers/cotlet-dev-integrations-resman-api-mcp-server)) [U as to quality].
- **MRI:** Partner Connect program with required certification; the public program documents date from 2018-2021 ([MRI program guide](https://www.mrisoftware.com/wp-content/uploads/2021/09/PartnerConnect_ProgramGuide_External_01.04.2021.pdf)). Current fees not found [U].
- **Rent Manager:** Integrations Program of 175+ providers; annual fee reported at $3,000 plus a second fee ([Propexo](https://docs.propexo.com/pms-guidance/rent-manager/approval-qa-process)) [U]. An MCP Connector for Claude and ChatGPT is reported on its pricing page with no launch announcement found ([Peter Lohmann timeline](https://www.peterlohmann.com/blog/ai-property-management-timeline/)) [U].

### B.3 Integration-feasibility table

Ratings are my judgement [I] for a layer operated on behalf of Asset Living, which is a licensed user (or acts for the owner-licensee) of each system.

| PMS | Read: bulk / analytical | Read: operational | Write-back | Events | AI-agent path | Program cost and gating | Feasibility |
|---|---|---|---|---|---|---|---|
| **Yardi Voyager** | Good if licensed: Data Connect (Power BI), Replicate (CDC to cloud warehouse), scheduled ETL exports | Interface program (SOAP/REST), nightly files common | Limited and per-interface (service requests, vendor invoices, resident transactions); payments/screening reportedly excluded [U] | No webhooks; CDC via Replicate | Virtuoso Connector (MCP) for Claude, reported also Copilot/ChatGPT; requires Virtuoso Enterprise and Voyager 8 | Partner-only; per-interface annual fee (~$25k reported [U]); 2 yrs + 3 clients | **Medium.** Strong read through the operator's own licences; write is the hard part |
| **RealPage OneSite** | Good if licensed: Lumina Data Cloud zero-copy to Snowflake/Databricks/Fabric/GCP (read-only) | RealPage Exchange APIs, per-client enablement | AppPartner tier only; no document upload | Not documented | Lumina Model Connect (MCP), ChatGPT first; read-oriented | Registered Vendor free/limited; AppPartner paid, certified | **Medium.** Read is now well served; write needs AppPartner |
| **Entrata** | API pulls; Entrata's own BI/analytics | Modern gateway, RPC-style; endpoint-limited [U] | Supported for selected objects (leads, work orders, payments via API) [U on coverage] | Claimed, unconfirmed | None for outside assistants; Entrata Pro brings models inside | Partner approval; volume-based fee [U] | **Medium.** Most API-like of the big three, least open to outside agents |
| **AppFolio** | Report/API exports | Stack API | Max plan only [U] | Not confirmed | Realm-X Connector for Claude executes workflows under guardrails; all plans | Partner application, paid | **Medium-high** where present |
| **ResMan** | API + ReportsPro | Partner API | Partner API | Not confirmed | Community MCP only | Approval + minimal fee | **Medium** |
| **MRI** | API + Agora data | Partner Connect | Certified integrations | Not confirmed | Agora Orchestrator is first-party | Certification required | **Medium** |
| **Rent Manager** | Web API | Web API | Web API | Not confirmed | MCP Connector reported [U] | ~$3k/yr reported [U] | **Medium-high** but low relevance to Asset Living |

### B.4 Middleware and fallbacks

| Option | What it is | Notes |
|---|---|---|
| **Propexo** | Unified read/write API across Yardi, RealPage, Entrata, AppFolio, ResMan, MRI, Rent Manager and CRMs such as Funnel and Knock; "Propexo Connect" loads PMS data into a customer warehouse | YC W23; $5.03M Series A 2025-09-17, ~$9.2M total ([CB Insights](https://www.cbinsights.com/company/rentdrop/financials)) [U]. Still depends on each PMS's partner program underneath. Write coverage per system is not documented publicly. |
| **Vendor data products** | Yardi Data Connect / Replicate; RealPage Lumina Data Cloud | Licensed by the operator; read-only; "every path stops at its own vendor's boundary" ([Propexo](https://propexo.com/blog/legacy-pms-data-integration/)). |
| **Vendor MCP connectors** | Yardi Virtuoso Connector, RealPage Model Connect, AppFolio Realm-X Connector | New in 2026. Permission-scoped to the signed-in user. The cheapest way to demonstrate cross-PMS reasoning without a partner agreement [I]. |
| **Own warehouse / BI layer** | Scheduled report exports and SFTP into a warehouse | Asset Living already claims this ("PMS-agnostic data architecture") [C]. Batch latency; no write. |
| **Unofficial API / RPA** | Supergood ("APIs for software that doesn't have APIs"), UI automation | Works where no API exists; fragile, and site terms may prohibit it ([Supergood](https://supergood.ai/docs/category/property-management)). Fallback only. |
| **Generic iPaaS (Zapier-style)** | Not found for the big three | I found no first-party Zapier-class connector for Voyager, OneSite or Entrata [U]. Not a serious path at this scale [I]. |
| **Other unified APIs** | Truto and similar | Vendor blog describes architecture for Yardi/RealPage ([Truto](https://truto.one/blog/overcoming-legacy-api-constraints-when-integrating-with-yardi-and-realpage/)). Not evaluated. |

---

## Part C — Incumbent AI moves

| Vendor | Product | Timeline | What is actually available | Notes |
|---|---|---|---|---|
| **Yardi** | **Virtuoso**: Assistant, Agents, Marketplace, Composer (no-code agent builder), Connectors, Virtuoso Enterprise | Assistant launched 2025-09-09 ([Yardi](https://www.yardi.com/news/press-releases/yardi-virtuoso-launches-in-app-assistant-to-deliver-support-and-insights/)); agents, Marketplace and Composer 2025-09-11 ([Yardi](https://www.yardi.com/news/press-releases/yardi-launches-virtuoso-ai-agents-to-deploy-ai-powered-workflows/)); multifamily agents "for every role" 2026-06-15 ([Yardi](https://www.yardi.com/news/press-releases/yardi-delivers-ai-agents-for-every-multifamily-role-and-workflow/)); Claude connector 2026-06-16 | Yardi says agents across leasing, resident services, maintenance and accounting are offered "today"; premium agents cover invoice approvals, lease audits and month-end close; inspection agents analyse video walkthroughs [V]. Requires Voyager 8; not in Breeze. | No formal "GA" statement found; rollout is staged. Customer counts not published. |
| **RealPage** | **Lumina** AI Workforce, then **Lumina AI Suite** (Workforce, Ascent, Atlas, Connect) | Previewed June 2025; five agents (Leasing, Resident, Operations, Facilities, Finance) launched 2025-08-12, embedded in OneSite, Knock and LOFT ([RealPage](https://www.realpage.com/news/realpage-unveils-next-generation-ai-workforce-at-realworld-2025/)); Suite announced 2026-08-10 with two new agents (Analytics, Spend) ([RealPage](https://www.realpage.com/news/realpage-introduces-lumina-ai-suite/)) | In production per RealPage: AI Leasing Agent at 175+ management companies; Operations Agent doing lease audits [V]. No GA dates for Ascent, Atlas, Connect or the two new agents. | Co-developed with OpenAI [V]. |
| **Entrata** | **ELI+**, **Homebody RXP**, **OXP**, **Entrata Pro** | Colleen AI acquired 2024-06-20 ([Entrata](https://www.entrata.com/blog/colleen-ai-announcement)); ELI+ suites 2024-09-27; Homebody RXP 2025-05-06 ([Entrata](https://www.entrata.com/press/entrata-launches-homebody-rxp-and-expands-leasing-ai-to-enhance-resident-and-prospect-experience)); AI maintenance 2025-06-11; OXP debut 2026-03-10; "first agentic PMS with 100+ embedded agents" 2026-03-23/24 ([Entrata](https://www.entrata.com/press/entrata-introduces-the-multifamily-industrys-first-agentic-property-management-system-with-100-embedded-ai-agents)); OpenAI collaboration 2026-06-07 ([Entrata](https://www.entrata.com/press/entrata-collaborates-with-openai)); Entrata Pro tier 2026-10-06 with ELI Console, Agent Studio, ELI+ Orchestrator, AI Admin audit trail, and "Forge" model ([release](https://www.financialcontent.com/article/gnwcq-2026-10-6-entrata-pro-puts-ai-to-work-without-leaving-the-operating-system)) | ELI+ leasing, payments and renewals are sold today; student renewals are "on the roadmap" ([Entrata ELI page](https://www.entrata.com/platforms/eli/)). Entrata Pro availability and pricing are not stated. | The most aggressive "autonomous property management" positioning. "100+ agents" is a count of embedded functions, unaudited [V]. |
| **AppFolio** | **Realm-X** Assistant, Flows, Performers | Performers (Leasing, Maintenance) 2025-06-11 at Apartmentalize ([GlobeNewswire](https://www.globenewswire.com/news-release/2025/06/11/3097558/36405/en/AppFolio-Unveils-AI-Agents-to-Transform-Performance-in-Real-Estate.html)); Performance Platform October 2025; Accounting Performer, Resident Messenger GA and Claude connector 2026-06-16; new Realm-X in all plans 2026-09-29 | Leasing Performer GA for email/text; Resident Messenger GA; Accounting Performer "newly announced"; Receptionist Performer launched September 2026 [V]. | Only incumbent that names Anthropic's Claude as an agent-to-agent partner. |
| **MRI** | **Agora** Intelligence and Orchestrator | Launched 2026-06-25 ([MRI](https://www.mrisoftware.com/news/mri-software-launches-agora-intelligence-and-agora-orchestrator-delivering-ai-powered-recommendations-and-workflow-execution-for-real-estate/)) | Agentic workflows with governance and audit trail [V]. | Depth in residential not verified. |
| **ResMan / Inhabit** | ReportsPro AI ("ROI" agent), Leasing Assistant, Maintenance Assistant, Invoice AI; "Hybrid Intelligence" (AI plus human agents) | April 2026 ResMania; OPTECH October 2026 ([PR Newswire](https://www.prnewswire.com/news-releases/inhabit-unveils-new-ai-innovations-deeper-integrations-and-scalability-enhancements-at-optech-2026-302942721.html)) | Shipping per vendor [V]. | |
| **Rent Manager** | **Orion AI**: report analysis, call summaries, audit-trail analysis, smart voicemails | 2026 release notes ([Rent Manager](https://www.rentmanager.com/icymi-rent-manager-release-notes-recap-january-march-2026/)) | Shipping per vendor [V]. | |

Reading across the incumbents:

- **[C]** Trade press describes three stances: Yardi and RealPage as systems of record that also open to outside tools; Entrata as fully agentic inside one platform; AppFolio as an integrated performance platform ([Propmodo, 2026-06-03](https://propmodo.com/how-proptechs-biggest-platforms-are-taking-different-approaches-to-ai-agents/)).
- **[C]** The same article reports that firms buy AI licences and adoption stalls within 90 days, and that vendors naming specific agent functions and measurable outcomes see higher adoption.
- **[I]** None of these helps an operator whose portfolio spans several of them. A regional manager with 12 Yardi properties, 9 OneSite properties and 6 Entrata properties gets three assistants, three audit trails and three definitions of "delinquency".

---

## Part D — Point solutions and AI-native players

### D.1 Pillar-by-pillar vendor map

| Pillar | Vendor | What it does | Traction / funding | Large-operator evidence | Gaps |
|---|---|---|---|---|---|
| **Residents** | **EliseAI** | Leasing, voice, renewals, delinquency, maintenance intake, lease audits, AI-guided tours, CRM; "Apollo" single agent across the Elise platform (2026-09-03) | $350M at $4B, 2026-09-29; $200M+ ARR; "one in six US apartment units" [V] ([Fortune](https://fortune.com/2026/09/29/elise-ai-4-billion-valuation-funding-round-housing-unicorn-andreessen-bessemer/); [MFE](https://www.multifamilyexecutive.com/technology/agentic-ai-major-deals-latest-moves-multifamily-proptech)) | **Asset Living** [C] | Apollo acts only inside the Elise platform and inherits user permissions ([Commercial Observer](https://commercialobserver.com/2026/09/eliseai-ai-agent-apollo/)). No accounting, AP, owner reporting. |
| Residents | **Funnel** | Renter-centric CRM, "Fenix AI" across the renter lifecycle, "Funnel Fabric" to connect third-party systems | Last known round $32M Series B2, Oct 2023 ([Commercial Observer](https://commercialobserver.com/2023/10/funnel-leasing-series-b-funding/)); total raised disputed [U] | ZRS Management (110,000 units, Jan 2026), Cortland, Camden [U, aggregator] ([aiforproptech](https://aiforproptech.com/companies/funnel/)) | Front office only. |
| Residents | **Knock** (RealPage) | CRM and centralised leasing front office | Acquired by RealPage 2022 ([Multifamily Dive](https://www.multifamilydive.com/news/realpage-acquires-knock-crm/633287/)) | Named in an Asset Living job posting [I] | Now a RealPage module. |
| Residents | **Zuma** (Venn) | Agentic leasing, renewals, collections | Acquired by Venn for $50M, 2026-09-22 ([Commercial Observer](https://commercialobserver.com/2026/09/venn-zuma-proptech/)) | — | Absorbed into Venn. |
| Residents | **BetterBot** | Chat/SMS/email/voice leasing AI; native CRM launched Sept 2026 ([MFE](https://www.multifamilyexecutive.com/technology/agentic-ai-major-deals-latest-moves-multifamily-proptech)) | Funding not found [U] | Asset Living case study (legacy) [C] | Front office only. |
| Residents | **Colleen AI** (Entrata) | AI collections/resident comms; now the base of ELI+ | Acquired 2024-06-20 | — | Entrata-only. |
| Residents | **Hy.ly** | Marketing automation / AI leasing assistant | Could not verify current status or ownership [U] | — | — |
| Residents | **LeaseHawk** | Call tracking and "ACE" voice/chat assistant | — | Asset Living, 39 communities in 2022 [C] | Likely displaced by EliseAI [I]. |
| Residents | **Snappt** | Document-fraud detection, income verification, expanding to ID and rent verification | PitchBook lists a $50M round Aug 2025; totals conflict [U]; company says EBITDA-profitable Q3 2026 [V] ([Snappt](https://snappt.com/blog/snappt-path-to-profitability/)) | AppFolio partnership 2026 | Screening step only. |
| Residents | **Flex** | Split rent payments / rent-timing credit | ~1.5M customers claimed; valuation figures conflict ($1.2B-$1.8B) [U] ([Forge](https://forgeglobal.com/flex_ipo/)) | — | Fintech add-on. |
| Residents | **Stake** | Renter cash-back/loyalty | $8M, March 2026; acquired UMoveFree; 550,000+ homes [V] ([PR Newswire](https://www.prnewswire.com/news-releases/stake-closes-8m-in-new-financing-acquires-umovefree-302710472.html)) | — | Retention incentive only. |
| Residents | **Venn** | Resident experience platform, "company brain" built per client | $140M+ raised; 270+ owners/operators; Bozzuto, Related, Kairoi named [V] ([Commercial Observer](https://commercialobserver.com/2026/09/venn-zuma-proptech/)) | Bozzuto, Related | Relation to PMS and back office not described. |
| **Operations** | **HappyCo** | Inspections, maintenance, turns, due diligence; "JoyAI" | Investment from Lone View Capital, Sept 2026 ([MFE](https://www.multifamilyexecutive.com/technology/agentic-ai-major-deals-latest-moves-multifamily-proptech)); earlier ~$74-84M raised [U] | — | Facilities only. |
| Operations | **Lessen** | Outsourced/centralised maintenance and turns (Lessen360), vendor network of 30,000+ [V]; "Aiden" AI; Lessen Pro (Oct 2026) | No 2026 funding news found ([Lessen press](https://www.lessen.com/resource-type/press)) | — | Services-heavy model. |
| Operations | **SmartRent** | Smart locks, access, self-guided tours, IoT | Public; 941,977 units deployed at 2026-09-30 [C] ([Q3 2026 results](https://finance.yahoo.com/markets/stocks/articles/smartrent-reports-third-quarter-2026-130000172.html)) | — | Hardware layer. Asset Living routes smart-building projects through SKBM [C]. |
| Operations | **Vendoroo** | AI maintenance coordinator and front desk | 500+ property management companies claimed [V]; joined Rent Manager program April 2026 ([Business Wire](https://www.businesswire.com/news/home/20260427364445/en/Vendoroo-Joins-the-Rent-Manager-Integrations-Program-to-Bring-AI-Powered-Front-Desk-and-Maintenance-Operations-to-Rent-Manager-Customers)) | SMB / single-family focus [I] | Not enterprise multifamily. |
| Operations | **Uniti AI** | "Orchestration layer" of agents above PMS/CRM for leasing, service, maintenance, payments, collections, renewals | $12M Series A (Pathlight, MetaProp), July 2026; 15+ PMS/CRM integrations [V] ([Business Wire](https://www.businesswire.com/news/home/20260721358977/en/Uniti-Raises-$12M-Series-A-to-Build-the-Agentic-AI-Layer-for-Global-Real-Estate-Operators)) | None named; strongest in self-storage, manufactured housing, senior living | Communications-centric; no back office or owner surface. |
| **Back Office** | **AvidXchange** | AP automation and payments, strong in real estate | Taken private by TPG with Corpay for $2.2B (announced May 2025, completed) ([TPG](https://www.tpg.com/news-and-insights/avidxchange-agrees-to-be-acquired-by-tpg-in-partnership-with-corpay-for-2-2-billion)) | Embedded AppFolio payments March 2026 [U] | AP only. |
| Back Office | **Nexus** (Bottomline) | NexusPayables: AP automation for real estate | Acquired by Bottomline, Sept 2022 ([Thoma Bravo](https://www.thomabravo.com/press-releases/bottomline-acquires-nexus-systems)) | — | AP only. |
| Back Office | **Conservice** | Utility billing and expense management | No AI announcement found [U] | — | Utilities only. |
| Back Office | **PMS-native** | Yardi premium agents (invoice approval, lease audit, month-end close); RealPage Finance and Spend agents; AppFolio Accounting Performer; ResMan Invoice AI | See Part C | — | Each works on its own ledger only. |
| **Owners** | **Leni** | AI analytics and variance commentary for asset managers | Funding not verified [U] ([Leni](https://leni.co/help-articles/ai-asset-management/)) | — | Owner-side analytics; does not run the manager's workflow. |
| Owners | **QTR Analytics**, **Haven** | Reads the monthly financial package, flags variances, drafts owner reports | Early-stage [U] ([QTR](https://qtranalytics.com/); [Haven](https://www.usehaven.ai/post/ai-and-owner-reporting-guide-property-managers)) | — | Read-only on exports. |
| Owners | **RealPage Lumina Atlas / Ascent**, **Yardi Matrix connector**, **ApartmentIQ** | Institutional and market intelligence | ApartmentIQ raised $25M ([AI for CRE Collective](https://aiforcrecollective.com/stories/apartmentiq-raises-25m-to-expand-multifamily-ai)) [U] | — | Vendor- or market-data-bound. |

Vendors named in the brief or in common use that I could not research properly: Hy.ly, Radix, Revolution RE, Cherre (now referenced inside RealPage's Lumina architecture [V]), Lobby AI, Travtus, ResiDesk, Surface AI. Treat their absence from the table as a research gap, not as evidence that they are irrelevant.

### D.2 "AI operating layer on top of the PMS" entrants

| Entrant | Claim | Reality check |
|---|---|---|
| **EliseAI (Apollo + CRM)** | One agentic teammate across the platform, from leasing agent to executive | Closest to the concept in Residents. Bounded by the Elise platform. Analysts frame the PMS vendors as its main structural threat ([Sacra](https://sacra.com/c/eliseai)) [U]. |
| **Funnel (Fabric)** | Connects third-party systems and knowledge bases under one renter-lifecycle AI | Front office. |
| **Venn** | Bespoke "company brain" per operator | Resident experience origin; back office not evidenced. |
| **Uniti AI** | Agent layer above 15+ PMS/CRM systems | Mostly outside conventional multifamily. |
| **Yardi / RealPage / AppFolio MCP connectors** | Bring Claude/ChatGPT to the system of record | Single-vendor; the operator must do the cross-system work. |
| **Vessla** (Stockholm, $3.3M pre-seed), **reltix** (EUR 3M, operates as a manager) | AI layer / AI-native manager | European, early ([TFN](https://techfundingnews.com/vessla-raises-3m-seedcamp-ai-operating-system-property-management/)). |

### D.3 White space

All of the following are my inference from the map above.

1. **Cross-PMS orchestration for a third-party manager.** Every incumbent agent is single-ledger. Every AI-native is single-pillar. A manager with three PMSs and 500+ owner clients has no product that normalises "work" across them.
2. **Owners pillar.** Existing tools are either the manager's static BI portal or owner-side analytics reading exports. Nobody offers an owner-facing conversational surface with governed, per-owner data entitlements, variance narratives traced to GL rows, and the ability to ask the manager's system for an action (approve a capex request, query a delinquency). For a third-party manager, this is the client-retention surface.
3. **Back office across ledgers.** Invoice coding, accrual support, bank reconciliation exceptions, month-end close checklists and lease-audit findings are being automated inside each PMS. A property accountant covering properties on two systems still works two queues. A cross-ledger exceptions queue is not offered by anyone found.
4. **Management-company work that no PMS owns:** property onboarding and takeover (migrations between PMSs when ownership changes), owner-specific reporting formats and approval matrices, management-agreement compliance, fee calculation, regional-manager oversight.
5. **A neutral governance plane.** Each vendor ships its own audit trail (Entrata AI Admin, MRI Orchestrator, RealPage "governed"). An operator using several has no single record of what AI did, on whose authority, under which owner's policy.
6. **Student and affordable specifics.** By-the-bed renewals are still on Entrata's roadmap; affordable certifications are document-heavy and compliance-bound. Both are under-served by the conventional-first AI vendors.

---

## Part E — Constraints an AI layer must respect

| Area | Current state | Design consequence |
|---|---|---|
| **Fair housing and AI communications** | HUD withdrew a batch of guidance effective 2025-09-17, including the 2024 notices on AI/algorithms in advertising and screening, and on 2026-01-14 proposed removing its disparate-impact regulations; the Fair Housing Act itself is unchanged and disparate-impact claims remain available under *Inclusive Communities*; state and local laws still recognise them ([NAA](https://naahq.org/news/federal-regulatory-changes-seek)). One source disputes whether the screening notice was on the withdrawal list [U]. | Federal guidance receded; liability did not. Leasing agents need consistent answers across protected classes, no steering, logged transcripts, fair-housing test suites, and a human path for accommodation requests. |
| **FCRA / screening** | A screening score is a consumer report; adverse action notices are required when one is used ([FTC guidance for landlords](https://www.ftc.gov/business-guidance/resources/using-consumer-reports-what-landlords-need-know)). *Louis v. SafeRent*: $2.3M settlement, score barred for voucher holders, third-party validation of any new score ([Bloomberg Law](https://news.bloomberglaw.com/ip-law/saferents-2-3-million-deal-in-ai-screening-tool-suit-approved)). FTC proposed a $2.25M FCRA settlement with a tenant-screening company in July 2026 ([Orrick](https://infobytes.orrick.com/2026-07-17/ftc-announces-proposed-2-25m-settlement-with-tenant-screening-company-over-alleged-fcra-violations/)). | The layer should orchestrate licensed screening providers and never generate its own approve/deny score. Keep the decision with a human or a documented rule set, and generate adverse-action notices. |
| **Algorithmic rent pricing** | DOJ v. RealPage final judgment approved May 2026, restricting use and sharing of nonpublic landlord data ([Federal Register](https://www.federalregister.gov/documents/2025/12/05/2025-21966/united-states-of-america-et-al-v-realpage-inc-et-al-proposed-final-judgment-and-competitive-impact); [Law360](https://www.law360.com/real-estate-authority/articles/2479431)). Monitor term is reported as three years by one source and seven by another [U]. Class settlements total nearly $360M across two batches; claims continue against non-settling defendants ([Multifamily Dive, 2026-11-03](https://www.multifamilydive.com/news/realpage-rent-pricing-case-360m-renters/873553/)). State laws: California AB 325 (effective 2026-01-01), New York (enacted 2025-10-16), Connecticut, New Jersey (effective 2027-07-01) ([Davis Polk](https://www.davispolk.com/insights/client-update/new-laws-regulating-algorithmic-pricing-enacted-new-york-and-california); [Squire Patton Boggs](https://www.squirepattonboggs.com/insights/publications/state-legislation-increasingly-targets-pricing-technologies/)). City ordinances in San Francisco, San Diego, Berkeley, Santa Ana, Philadelphia, Minneapolis, Providence, Jersey City, Hoboken, Seattle, King County, Spokane, Portland, with Rockville from 2027; first private suits filed July-August 2026 against Greystar, UDR, Essex, Willow Bridge ([Morgan Lewis](https://www.morganlewis.com/pubs/2026/08/algorithmic-rent-pricing-litigation-expands-under-new-state-and-local-laws)). | Highest-risk area for a multi-owner manager. A layer that sees rents across competing owners must not let one owner's nonpublic data inform another's pricing. Hard tenant isolation per owner, no cross-owner pricing features, jurisdiction-aware feature flags, and pricing recommendations that are advisory with recorded human acceptance. Some ordinances reach "algorithmic" coordination generally, not only nonpublic data. |
| **TCPA (calls and texts)** | FCC ruled 2024-02-08 that AI-generated voices are "artificial" under the TCPA, so prior consent rules apply ([FCC](https://www.fcc.gov/document/fcc-makes-ai-generated-voices-robocalls-illegal)). Revised consent-revocation rules adopted 2026-09-30 take effect **2026-11-25**: category-specific opt-outs for informational messages, optional exclusive opt-out method if disclosed ([Crowell](https://www.crowell.com/en/insights/client-alerts/fcc-officially-adopts-amendments-to-tcpa-rules); [CommLaw Group](https://commlawgroup.com/2026/fccs-new-tcpa-consent-revocation-rules-on-category-specific-opt-outs/)). | Central consent ledger per contact, per channel, per message category (marketing vs informational), honoured by every agent regardless of which PMS the resident lives in. Voice agents need consent for outbound AI calls. |
| **State AI laws** | Colorado's AI Act was repealed and replaced by SB 26-189 (signed 2026-05-14), narrowed and delayed to 2027-01-01, with enforcement stayed by a federal court ([Eckert Seamans](https://www.eckertseamans.com/legal-updates/colorado-repeals-and-replaces-its-landmark-ai-statute-what-businesses-need-to-know); [Troutman](https://www.troutmanprivacy.com/2026/04/colorado-attorney-general-delays-enforcement-of-colorado-ai-act/)). California CPPA automated-decision rules apply to "significant decisions" from 2027-01-01 ([CPPA](https://www.cppa.ca.gov/announcements/2025/20250923.html)); whether housing is a listed category was not confirmed in my sources [U]. Texas TRAIGA effective 2026-01-01, AG enforcement, penalties $10k-$200k per violation, no private right of action ([Norton Rose Fulbright](https://www.nortonrosefulbright.com/en-us/knowledge/publications/c6c60e0c/the-texas-responsible-ai-governance-act)). California requires bot disclosure where a person could be misled ([HLC](https://hlc.com/en/publications/california-imposes-new-human-requirements-for-ai-customer-service)) [U on bill number]. A December 2025 federal executive order seeks to pre-empt state AI laws and was invoked against Colorado. | Disclose AI in every resident-facing channel. Treat leasing approval, renewal non-offer, eviction referral and fee decisions as consequential: human review, notice, appeal path, logged rationale. Asset Living is Texas-based, so TRAIGA applies directly. |
| **Privacy / PII** | Resident SSNs, income documents, bank data and screening reports sit in the PMS. Industry survey: 63.6% of AI vendors do not disclose third-party AI subprocessors [V] ([Entrata](https://www.entrata.com/blog/the-trust-gap-in-proptech)). EliseAI survey: data privacy/compliance is the top AI blocker (39%), integration second (35%) [V] ([EliseAI](https://eliseai.com/resources/the-2026-state-of-ai-in-us-multifamily)). | Minimise what leaves the PMS; field-level redaction before model calls; no training on client data; disclosed subprocessors; per-owner data residency and retention. |
| **SOC 2 and owner due diligence** | SOC 2 Type II is a due-diligence baseline in multifamily proptech and is commonly requested, though I found no source showing it is contractually mandated by institutional owners [U] ([HappyCo](https://happy.co/resources/why-soc2-type-ii-certification-matters-in-multifamily); [EisnerAmper](https://www.eisneramper.com/insights/real-estate/soc-audits-real-estate-technology-0426/)). Grant Thornton notes firms "can't audit what their AI is doing or why" ([Grant Thornton](https://grantthornton.com/insights/articles/real-estate/2026/multifamily-ai-growth-starts-with-governance)). | Plan for SOC 2 Type II, SSO/SCIM, role-based access mirroring PMS permissions, exportable AI audit trail. The incumbents now advertise all of these. |
| **Human in the loop** | Every incumbent now markets approval rules and supervision: AppFolio "human supervision applies to agentic actions"; Entrata Agent Studio "approval rules"; VTS pairs agents with human verification; Yardi's and EliseAI's agents inherit the user's permissions (sources in Part C). | Approval tiers by action type and dollar value; reversible actions by default; nothing posts to a ledger, changes a rent, sends a legal notice or denies an applicant without a named human approver. |

---

## Implications for an AI-first operating layer

### Architecture

1. **Treat connectivity as a tiered portfolio, per PMS and per owner.** In descending order of preference: (a) the operator's or owner's own licensed data products (Yardi Data Connect/Replicate, RealPage Lumina Data Cloud) for bulk read; (b) vendor MCP connectors for governed, permission-scoped interactive access; (c) certified partner APIs, directly or through a unified API such as Propexo, for write-back; (d) scheduled report exports into the existing warehouse; (e) UI automation only as a declared, fragile last resort.
2. **Build on Asset Living's existing "PMS-agnostic data architecture" instead of replacing it.** The canonical model (property, unit, lease, resident, charge, payment, work order, invoice, GL account, owner entity) already exists there in some form. The new layer adds actions, agents and an owner-facing surface on top.
3. **Read broadly, write narrowly.** Write-back is where every vendor program is most restrictive. Start with writes that are routinely permitted (guest cards, work orders, notes, invoice submissions into the PMS's own approval workflow) and leave ledger posting and rent changes to the PMS with a human approver.
4. **Make the PMS's own agents tools, not rivals.** Where Yardi, RealPage or AppFolio expose an agent or connector, the orchestration layer should call it. That is the path the vendors are opening, and it keeps the layer inside each vendor's guardrails.
5. **Owner-level tenancy is a first-class constraint.** Each owner's data, policies, approval matrix and pricing must be isolated. This is both an antitrust control and the feature owners will ask about first.
6. **One governance plane:** a single consent ledger (TCPA), a single AI action log with approver identity, a jurisdiction rules engine (pricing ordinances, AI disclosure, screening rules), and fair-housing evaluation suites run against every resident-facing agent.
7. **For the demo, use synthetic data shaped like three PMSs.** Real connectivity cannot be obtained without partner agreements. A convincing demo shows the same question answered and the same action taken across a mock Yardi property, a mock OneSite property and a mock Entrata property, with visible provenance back to the source system.

### Positioning

1. **Do not pitch against EliseAI on leasing.** It is installed, growing, well funded and has published Asset Living results. Position the layer as the place where Elise's conversations, each PMS's ledger and the owner's expectations meet. Treat Elise as a source and an actuator in the Residents pillar.
2. **Lead with what a third-party manager uniquely needs and no vendor sells:** one view and one work queue across PMSs, and an Owners pillar that turns reporting into a client-retention product.
3. **Back Office is the least contested pillar among AI-natives and the most contested among PMS vendors.** The defensible wedge is cross-ledger exceptions, close management and owner-specific reporting, not invoice OCR.
4. **Expect the objection "the PMS vendors are doing this."** The answer is that each does it inside one boundary, and Asset Living's stated strategy is client-tailored stacks. The 2026 MCP openings make a neutral layer more feasible than it was a year ago.
5. **Lead with governance.** The incumbents have converged on permissions inheritance, approval rules and audit trails. A layer without them will not pass owner due diligence.
6. **Stay out of rent-setting.** Given Asset Living's position as a named defendant and the spread of ordinances, pricing should be shown as read-only insight with explicit per-owner isolation, or omitted from the demo.

---

## Gaps / unverified

**Asset Living**

- Share of units on each PMS. Only the three names are confirmed.
- Whether the student portfolio is still on Entrata (confirmed 2014 only).
- Which revenue-management product is used today and where; whether Asset Living has settled in the RealPage class action. It is not named in the coverage of either settlement batch that I read ([Bisnow](https://www.bisnow.com/news/national/multifamily/27-firms-strike-deal-in-rent-fixing-class-action-as-realpage-and-others-fight-on-131230); [Multifamily Dive](https://www.multifamilydive.com/news/realpage-rent-pricing-case-360m-renters/873553/)), and the full settling-defendant list was not checked.
- BI/warehouse tooling, AP automation product, screening and payments providers, resident app. None are named publicly.
- How much of the portfolio is live on EliseAI, and whether LeaseHawk ACE, BetterBot and Knock are still in use.
- Resident portal URLs per property were not sampled; doing so would give direct evidence of PMS mix.
- LinkedIn skills data was not accessible.
- The meaning of "TOPS"-prefixed roles on the careers board (possibly a centralised or floating support team).

**PMS integration**

- All interface and partner fees. The Yardi ~$25k per interface figure is secondary; RealPage AppPartner, Entrata, AppFolio and MRI fees are unpublished.
- Whether Entrata's modern gateway supports webhooks and a sandbox.
- Read versus write scope, tool lists and pricing of the Yardi Virtuoso Connector and RealPage Lumina Model Connect. Whether Claude support for RealPage has shipped.
- Whether an operator can use these connectors under a third-party manager arrangement where the owner holds the PMS licence.
- Rent Manager's MCP connector (reported, no announcement found).
- Sourced PMS market-share figures.

**Incumbent AI**

- General-availability status and pricing of Entrata Pro, RealPage Ascent/Atlas/Connect, Yardi premium agents, AppFolio Accounting Performer.
- Real adoption of any incumbent agent beyond vendor counts.
- I could not fetch yardi.com, globenewswire.com or businesswire.com pages directly; details came through search extracts.

**Point solutions**

- Hy.ly status; funding for BetterBot, Leni, Haven, Vendoroo, Lessen; reconciled figures for Funnel, Snappt, Flex and HappyCo, where sources conflict.
- Not researched: Radix, Revolution RE, Lobby AI, Travtus, ResiDesk, Surface AI, and owner-side platforms such as Juniper Square.
- Thesis Driven and the 20for20 report were not retrieved; conference coverage of NMHC OPTECH 2026 was limited to vendor releases.

**Regulatory**

- Whether HUD's 2024 AI tenant-screening notice was among the withdrawn documents (sources conflict).
- RealPage monitor term (three versus seven years) and exact final-judgment terms; status of state attorney-general cases other than North Carolina's.
- A reported New York injunction (2026-09-29) and a California "COMPETE Act" (AB 1776) come from a single blog and are not relied on here ([The Innovation Attorney](https://theinnovationattorney.substack.com/p/ai-algorithmic-pricing-bans)).
- Whether housing is an enumerated "significant decision" under California's ADMT rules; the California chatbot-disclosure bill number.
- Status of the December 2025 federal pre-emption executive order beyond its use in the Colorado case.
- This section is a research summary and has not been reviewed by counsel.

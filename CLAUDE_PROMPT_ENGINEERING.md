# Conversation: Asset Living build exercise

Darren and Claude (Claude Code). This is the conversation as written: Darren's requests and Claude's replies. Claude's reasoning, the commands it ran, their output, and the research agents' own reports are left out.

---

## 1. Darren

I'll be creating a working demo prototype for the property management company Asset Living headquartered in Houston. The brief is to prototype and demo one module of a larger AI-first
tool suite that helps to reduce customer churn, release human capacity and allow them to scale with optimized manager-to-door and revenue-per-door efficiency. I will supply the brief
to help us build this, but first, lets thoroughly research the company, gaining an understanding of their business model, competitors, vision/mission and anything else you deem to be
useful to allow us to build a world-class ai-first property management AI tool suite. Think of it as an operating system that will sit on top of existing PMS systems, moving them to
become the invisible plumbing and the system of record, single source of truth, while this AI-first platform that sits on top, becomes the new intelligence layer and the new UI that
most of the company interfaces with. Keeping in mind the structure of Residents/Operations/Back Office/Owners. Lets organize this repo into the following way:

./interview_demo/
./reference/
./research/

I'd also like you to spin up multiple agents to do this research, and also have an agent create a brand guide html file, using the theme/style/colors from their website:
https://www.assetliving.com/about/leadership ... use Tailwind CSS

### Claude

The three folders are created and six agents are now running in the background; nothing has come back yet.

| Agent | Output file |
|---|---|
| Company profile: history, ownership, scale, verticals, business model, acquisitions, leadership, mission and values, recent news | `research/01_company_profile.md` |
| Competitors and industry economics: Greystar, Willow Bridge, RPM and others, fee structures, staffing ratios, owner and resident churn | `research/02_competitors_and_market_economics.md` |
| PMS and proptech landscape: Asset Living's stack, Yardi/RealPage/Entrata integration reality, incumbent AI moves, white space by pillar, compliance constraints | `research/03_pms_proptech_ai_landscape.md` |
| Pain points: resident, employee and owner experience, legal and press issues, where staff time goes | `research/04_pain_points_and_churn_signals.md` |
| AI use cases across Residents / Operations / Back Office / Owners: value evidence, reference architecture, metrics, ranked demo candidates | `research/05_ai_operating_layer_use_cases.md` |
| Brand guide built in Tailwind from tokens extracted from assetliving.com | `reference/brand_guide.html` |

Each research file is asked to cite a source for every material fact, separate verified facts from vendor claims and inference, and end with a list of what could not be verified.

When they finish I'll check the outputs and give you a consolidated summary of the findings. You can send the brief whenever you're ready; it doesn't need to wait for the research.

### Claude

The company profile is back (`research/01_company_profile.md`); the other five agents are still running.

The findings that matter most for the build:

- **Scale:** 446,427 units on the 2026 NMHC list, No. 2 behind Greystar. Nearly all of the 2026 jump came from absorbing FPI Management (about 165K units), a deal that was never announced and is inferred from strong circumstantial evidence.
- **Organic growth looks flat:** the count went from 291,322 to 288,665 units between the 2024 and 2025 lists, before FPI. That is the agent's reading of two figures, but it supports the churn thesis in your brief.
- **Ownership may be changing:** Reuters reported in June 2026 that New Mountain Capital agreed to buy the company from Roark Capital for more than $2B. Asset Living said the report "contains inaccuracies", and no closing was confirmed.
- **AI is already in production:** EliseAI covers leasing, delinquency, maintenance, renewals and voice (announced September 2025). The Residents pillar is therefore the most crowded place to demo.
- **Multi-PMS is confirmed:** they run Yardi, RealPage and Entrata and describe their data architecture as "PMS-agnostic", which fits the layer-on-top concept. Centralized roles cover only about 35K units, under 10% of the portfolio.
- **Who owns technology:** there is no CTO or CIO on the leadership page. Cory Hitte, Chief Transformation Officer, owns technology, shared services and the "AI & Innovation roadmap". A new COO, Marti Burrows, joined in July 2026 from Nuveen, so she brings an owner-side view.
- **Back office has already cited AI for cuts:** 105 former FPI roles in accounting, HR and recruiting were eliminated, with "AI and specialized external partners" given as the reason.

Not verifiable from public sources: revenue and margins, actual fee rates and client retention, whether the New Mountain deal closed, and what their "proprietary technology suite" contains. These are worth raising in your meetings.

I'll give you the consolidated summary once the remaining five finish.

### Claude

The technology landscape report is in (`research/03_pms_proptech_ai_landscape.md`); four agents are still running.

What it adds for the build:

- **The Owners pillar is nearly empty.** Residents is crowded (EliseAI, Funnel, Venn and others), and Operations and Back Office each have established point solutions. Only a few early startups serve owners, and nobody does cross-PMS orchestration for a third-party manager.
- **Every PMS vendor shipped its own agents in 2025–26**, but each stops at its own boundary. A manager running Yardi, RealPage and Entrata side by side is exactly the case they don't solve.
- **Integration opened up in mid-2026.** Yardi released an MCP connector for Claude and RealPage announced zero-copy data sharing plus MCP; Entrata is going the other way and keeping models inside its platform. Classic API access is still gated by partner programs, and write-back is the most restricted part.
- **The demo should use synthetic data** shaped like Yardi, OneSite and Entrata, since real connectivity needs partner agreements. The strongest thing to show is the same question and action working across all three, with provenance.
- **Keep rent pricing out of the demo, or read-only.** Asset Living is a named defendant in the 2023 RealPage class complaint, and several states and cities now restrict algorithmic pricing.
- **Treat EliseAI as a component, not a competitor.** It is their installed resident-facing AI, so the platform should orchestrate around it.

The agent could not establish what share of units sits on each PMS, or what Asset Living uses for BI, AP and revenue management. Its regulatory section has had no legal review.

Consolidated summary to follow when the remaining four finish.

### Claude

The brand guide is done: `reference/brand_guide.html`. It was built from the site's real stylesheet and logo files, but it has not been opened in a browser yet — only parsed for broken markup. Three research agents are still running.

- **Palette:** cream `#f8f6f3`, deep blue `#154571` and dark navy `#0c1827` carry the site, with white as the fourth surface. The accents are grey-blue `#a5bac9`, sky blue `#3ea0c7`, orange `#f6a800` and green `#93d500`, all used sparingly.
- **Fonts are licensed:** headings are Freight Display Pro (Adobe Fonts) and body text is Gilroy (commercial). The guide substitutes Source Serif 4 and Figtree from Google Fonts, with the real fonts listed first in the Tailwind stacks so they take over if you license them.
- **Shape and style:** square corners everywhere (radius 0 on buttons, cards, inputs and images), near-flat shadows, and one italic word per headline as the signature move.
- **Contrast limits:** the sky blue and orange fail AA for normal text on white, so they are accents only.
- **Product-UI extensions are proposed, not from the site:** the success, warning, danger and info colours, status pills, data table, KPI tiles and the dashboard mock. They are labelled as such in the guide.

The Tailwind config block in the guide is written to be copied straight into the prototype. The guide needs an internet connection for the Tailwind CDN, Google Fonts and the remote logo.

### Claude

The use-case report is in (`research/05_ai_operating_layer_use_cases.md`); the competitors and pain-points agents are still running.

**Its recommended demo module is owner reporting with narrative variance plus portfolio Q&A.** It is read-only, works on synthetic data, shows several PMSs behind one view, and ties directly to owner churn. The agent's full ranking:

1. Owner reporting with narrative variance and portfolio Q&A
2. Regional manager portfolio copilot (exception-based management)
3. Owner-health and churn-risk radar, best as a second act to the first
4. Property takeover and onboarding agent
5. Resident retention radar, positioned as orchestration above EliseAI

It advises against leading with AI leasing or chat (already bought), pricing (legal objections), affordable recertification (thin evidence, severe error cost) or AP and close (dull to watch).

Other points that should shape the pitch:

- **The incentive problem:** site payroll is owner-paid, so on-site savings flow to owners while the manager funds the technology. Staffing is fixed per property in management agreements. The capacity story lands best at the regional and corporate layers the manager pays for.
- **The ROI needs two ledgers:** on the agent's illustrative assumptions for 450,000 units, the manager's own case is tight (about $23.7M benefit against a $20M placeholder cost), while the owner NOI benefit is about $119M. These are assumptions, not Asset Living data.
- **Evidence is thinnest where the concept is most differentiated:** no published operator results exist for AI owner reporting, portfolio Q&A, owner-churn scoring or a regional copilot. The white space is real, but there are no proof points to cite.
- **Write-back is contested:** RealPage paused new EliseAI activations in October 2026 over API scope. The design should be read-heavy and use sanctioned write paths only.
- **For financial narrative, the model should never generate a number.** Every figure should click through to transactions, and the demo should include an approval step and a deliberate refusal.

This report lists three things as unverified that the technology landscape report did source: the multi-PMS setup, MCP connectors from PMS vendors, and court approval of the DOJ–RealPage settlement. I'll reconcile those in the consolidated summary.

### Claude

The pain-points report is in (`research/04_pain_points_and_churn_signals.md`), with one agent (competitors and economics) still running. This one is partial: its web-search budget ran out before it covered Reddit, ApartmentRatings, Google and Yelp reviews, and the Glassdoor and Indeed figures come from search summaries only.

- **Unanswered escalations are the best-evidenced problem.** The BBB rates Asset Living F, with 403 complaints in three years and 354 of them (88%) unanswered. Property-level reviews are much better (7.0/10 on VeryApt), so experience varies widely by site team.
- **The complaint is the mishandled transaction, not the rent.** In rough order of frequency: unreturned calls and emails, deposits and move-out charges, billing and fees, maintenance closed without a fix, then turbulence after a management takeover.
- **Back-of-house work is manual and untouched by EliseAI.** Assistant managers reconcile receivables daily and process deposit refunds; regional managers write monthly variance evaluations; operations specialists build the weekly, monthly and quarterly property reports.
- **Employees cite too many systems** (Yardi, MRI, OneSite and Entrata are all named), long hours during student turn, and late vendor payments. Glassdoor is about 3.5/5; property managers rate it 3.1.
- **The legal picture is modest.** The agent found a handful of individual tenant suits and no attorney-general action, certified class action or data-breach notice. One website's claim of AG investigations in Texas and Georgia had no primary support and should not be repeated.
- **Owner-side evidence is thin.** There is no public data on client retention and no owner on record complaining about reporting.

**This report disagrees with the use-case report on what to demo.** It ranks a resident case-resolution layer first — no escalation goes unanswered, with cross-system context, human-approved replies and owner-visible open cases. It puts owner reporting last, as the best theoretical lever on owner churn but the least evidenced. The use-case report ranked owner reporting first. Your brief should settle most of that, and I'll set out the trade-off in the consolidated summary once the last agent reports.

### Claude

All six agents have finished and the outputs are in `research/` and `reference/`. Two of the reports are thinner than planned: the competitors and pain-points agents ran out of web-search budget, so some of their figures come from search summaries and are tagged that way in the files. I have not read the files end to end or opened the brand guide in a browser; what follows is drawn from the agents' reports.

#### The picture across all five reports

- **Asset Living is No. 2 by size but its growth is acquired.** It has 446,427 units against Greystar's 1,014,091. Nearly all of the 2025 jump came from absorbing FPI Management; before that the count was flat (291,322 to 288,665).
- **Owner churn is the industry's visible problem.** Contracts are reported as typically 30-day cancellable, and peers lost 7,000–14,000 units each in 2025. No public figure exists for Asset Living's own client retention.
- **It is the most diversified of the top four.** Affordable is about 137K units (No. 1 nationally) and student is the largest third-party book, alongside conventional, senior and build-to-rent. Greystar, Willow Bridge and RPM are 89–97% conventional.
- **Leasing AI is commoditised.** Asset Living, RPM and Avenue5 all run EliseAI, so another resident chatbot would not differentiate.
- **Centralization is early.** Centralized roles cover about 35K units, roughly 8% of the portfolio; vendor-reported peer figures are 18–32%, though definitions differ.
- **The multi-PMS premise holds.** Their own services page names Yardi, RealPage and Entrata and claims a "PMS-agnostic data architecture". The share of units on each is unknown.
- **The economics favour the owner, not the manager.** Base fees are roughly 2.5–3% of collections, and site payroll is charged to the property. On-site savings therefore go to owners, and each owner must agree to staffing changes.
- **The open ground is consistent across reports:** cross-PMS orchestration, an owner-facing surface, owner-churn early warning, and regional and back-office capacity that the manager itself pays for.

#### Which module to demo

The reports split, and your brief should decide it.

| | Owner reporting and portfolio Q&A | Resident case-resolution layer |
|---|---|---|
| Backed by | Use-case and competitor reports | Pain-points report |
| Evidence of pain | Thin: no owner on record complaining about reporting | Strong: 88% of BBB complaints unanswered |
| Competition | Nearly empty | Adjacent to EliseAI's installed footprint |
| Demo risk | Low: read-only, synthetic data | Higher: needs write actions and resident messaging |
| Tie to brief | Owner churn, regional capacity | Resident churn, reputation |

My lean is owner reporting and portfolio Q&A, with the unanswered-escalation backlog surfaced inside it as an owner-visible risk signal. That uses the best-evidenced pain without competing with EliseAI.

#### Conflicts and gaps to keep in mind

- **Student scale conflicts:** the company claims 115K+ beds; the NMHC list shows 50,849 student units. Beds and units are different measures, and nobody reconciled them.
- **RealPage litigation:** one report says Asset Living is a named defendant in the January 2023 class complaint; another could not confirm it. Whether it has settled is unknown.
- **Ownership:** the reported sale to New Mountain Capital for more than $2B is unconfirmed, and Asset Living disputed the report.
- **Nothing public on the numbers that matter most for the value case:** revenue, margins, fee rates, client retention, doors per manager and regional-manager span. These are discovery questions for your meetings.
- **Resident review coverage is incomplete:** Reddit, Google, Yelp and ApartmentRatings were not covered.
- **The regulatory material has had no legal review.**

Send the brief when you're ready and I'll work from it together with these files.

---

## 2. Darren

I've added the brief: ./reference/

1. read and understand the brief thoroughly adding your thoughts to ./reference/claude_thoughts.md
2. create a new file outlining which Scenario you would choose and why (Choosing the scenario.md). Rank the scenarios in a table, thinking through things such as estimated dev time, estimated resources needed, value created potential, number of people affected or number of people who would benefit from this (company impact) 
3. create a CLAUDE.md referencing the research you have done (keep it succinct to save on context size)

### Claude

I've read the brief and am profiling the data pack sheet by sheet (transitions and AP invoices done; variance, close tracker and RFP sheets next) before writing the three files.

### Claude

Data profiling is finished; writing the three files now.

### Claude

All three files are written. I read the brief in full and profiled every sheet of the data pack, so the findings in them are computed from the workbook, not skimmed.

#### My scenario pick: A, Property Transitions

| Rank | Scenario | Demo build | Direct users at scale | ROI |
|---|---|---|---|---|
| 1 | A — Transitions | 2–3 days | Tens | High but per takeover |
| 2 | B — Month-end close | 2–3 days | Hundreds (about 390 accountants) | High and monthly |
| 3 | C — RFP response | 1–1.5 days | Tens | About $0.7M a year for this RFP, hard to attribute |

Build times, user counts and ROI are my estimates.

Why A:
- **It sits on the growth engine.** Asset Living grows by absorbing other managers' portfolios, and the panel includes New Mountain Capital — which also confirms the ownership change the research could only report as unconfirmed.
- **It needs no PMS access.** Files come in and load files go out, so it avoids the write-access restriction the research flagged.
- **The data rewards it most.** Nothing on the checklist is overdue yet, but six vendor notice deadlines have already passed ($10,178 a month possibly locked in). Bank accounts are due in 16 days at all nine properties, and six have not been started.

A has the fewest daily users, so if you weigh "people affected" most heavily, B wins. B also has the single best hard-dollar find: $56,019 of duplicate invoices, including a $43,218 roofing invoice approved twice.

#### Things in the brief and data worth knowing now

- **The return deadline and reviewer contact are unfilled placeholders** in the brief ("[one week, including a weekend]", "[Agilyti contact]"). Confirm the date with the recruiter.
- **The data is pinned to October 16, 2026**, so the prototype should treat that as today.
- **The rent roll covers only 3 of the 9 incoming properties.** I treat the missing six as a finding, 46 days from takeover.
- **Two accountants appear in both A and B.** They own all 23 open transition accounting tasks and also close 18 properties in the same weeks. That could be an artefact of the synthetic names; if deliberate, it is a strong "we hadn't thought of that" point.

`CLAUDE.md` is about 45 lines: the repo layout, an index of the research files with when to read each, the handful of facts that constrain the build, and working rules for the prototype.

Tell me which scenario you want and I'll start the build; if it's A, the scope and "deliberately not built" list are at the end of the scenario file.

Files, from the repo root:
- `reference/claude_thoughts.md`
- `reference/Choosing the scenario.md`
- `CLAUDE.md`

---

## 3. Darren

Great!
I have some notes from my interview with Asset Living:

- The current setup: a very large property accounting operation. That's several hundred dedicated offshore staff plus an onshore team, handling bills, payments and the financial reports sent to property owners.
- The problem: acquisitions brought in three property management systems (RealPage, Yardi and Entrada), and each has its own accounting workflow. There's a lot of manual work, such as translating data between systems and doing bank reconciliations.
- The obvious benefit is efficiency and time savings, with potential headcount reduction (Capacity released as their PE owner said).
- The bigger benefit is keeping clients. Poor accounting makes owners leave faster than anything else. Late financials, transactions put under the wrong accounts, or a surprise true-up after an owner has already taken a distribution all make owners lose trust. Then they start looking closely at leasing and everything else. If retention improves a couple of percent... that's where you start getting into millions.
- But I recall, that cutting headcount is great, but cutting errors and keeping clients is worth even more.

Based on this, does it change your recommendation?

### Claude

Yes, it changes it: I'd now build Scenario B, Month-End Close.

My case for A rested on public evidence that owner churn starts at takeover, and the research itself rated the owner-side evidence as thin. A first-hand statement from the company that accounting errors lose clients fastest outranks that. It also confirms the user base is several hundred people, larger than I had estimated.

The three things said that make owners leave are all visible in the data pack:

| What makes owners leave | What the data pack shows |
|---|---|
| Late financials | 36 close steps late on day 6, including 12 bank reconciliations; one accountant holds 31 of them; owner reports are due on day 8 |
| Wrong accounts | 10 invoices coded against the vendor's normal account, including repairs and a unit turn coded as capital |
| Surprise true-up | $56,019 of duplicate invoices; seven pending invoices at 5–20 times the vendor norm, not yet in actuals; a utility line 48% under budget with no bills received |

My two earlier objections to B weaken with this framing:
- **Thin variance data:** an honest "cannot explain; this looks like a missing bill" becomes the feature, because the missing bill is next month's true-up.
- **Crowded invoice-review market:** the pitch is now an owner-trust check before the report goes out, not invoice processing.

**What I'd build:**
1. An exception queue that catches errors before invoices are paid or posted.
2. A close-slip view showing which owner reports will miss day 8, and why.
3. A variance commentary drafter that says so when the data can't explain a line.
4. A true-up risk score per owner report, giving the manager a "safe to send / hold" call. This is the extra idea.

Open the demo on errors caught before the owner saw them, with hours saved second.

**Limits to be candid about:**
- **No PMS or bank data in the pack for B.** The cross-system translation and bank reconciliation pain from your interview can't be demonstrated on real rows. I'd show the design for it and say it is untested.
- **The retention figure is my estimate.** Two percent of 446K units at the research's inferred fee is roughly $4–5M a year. It supports "millions" as an order of magnitude, but it is not Asset Living's number.

I updated `reference/Choosing the scenario.md` with the revision on top and the original A analysis kept below it, and added the interview points to `CLAUDE.md`. I did not save your notes as a separate file. Say the word and I'll start the B build.

---

## 4. Darren

Before doing the main Scenario B build, first create a SaaS template design using the reference/brand_guide.html 
Left menu with Asset Living logo followed by  " | OS"
Show what the modules could look like in the left menu with future items grayed out:
RESIDENTS
OPERATIONS
BACK OFFICE
OWNERS & GROWTH

Make it look like a world-class SaaS layout platform

Serve is via a light-weight http server on port 8888

### Claude

The template is written and the server is started; I'm taking a headless screenshot to check how it renders.

### Claude

The template is live at **http://localhost:8888** (replace `localhost` with the machine's address if you're viewing from another computer). I checked it in a headless browser at desktop and phone widths and it renders cleanly.

- **Sidebar:** the real Asset Living logo followed by "| OS", then the four module groups. Back Office is marked Live with Month-End Close active and its five sub-pages; everything else is greyed out with a "Soon" tag.
- **Future modules shown:**
  - Residents: Leasing & Tours, Resident Service Desk, Renewals & Retention, Collections
  - Operations: Property Transitions, Maintenance & Turns, Vendors & Contracts, Regional Copilot
  - Back Office: Bank Reconciliation, Lease Audit
  - Owners & Growth: Owner Reporting, Owner Health, Portfolio Q&A, RFPs & Proposals
- **Systems of record panel:** at the bottom of the sidebar, showing the demo data pack as the live source and Yardi, RealPage and Entrata as "Not connected". That keeps the layer-above-the-PMS story visible while staying honest about the demo.
- **Main area:** a Close Overview page with the close calendar, four headline tiles, a "Needs a person today" worklist and late steps by accountant.
- **Brand:** tokens come straight from the brand guide: navy sidebar, cream canvas, white cards, square corners, serif headings with one italic word, and the orange accent for active states.

Things that are not real yet:
- **The figures are fixed.** They are true values from my profiling of the data pack, but nothing is calculated live; the page footer says so.
- **Four of the five sub-pages are placeholder slots.** AP Review, Variance Commentary, Close Tracker and Report Readiness switch the title and show a description of what will go there.
- **Home, Ask OS, Export, the search box and the period selector do nothing.**

The page needs an internet connection for Tailwind and the fonts; the logo is stored locally. The server is a plain Python one running in this session, so it stops when the session ends. To restart it:

```
cd interview_demo/asset-os && python3 -m http.server 8888
```

The files are in `interview_demo/asset-os/` (`index.html` plus the logo in `img/`).

---

## 5. Darren

Great!
Start the main Scenario B build

### Claude

The calculation script works against the data pack (43 exceptions, 16 variance items, a close forecast and a send/hold call per property). Now writing the server and the five screens.

### Claude

The old template server is stopped (that "failed" notice is just me replacing it). Starting the new server and checking each screen in a headless browser.

### Claude

Server endpoints work; I'm checking the last three screenshots (tracker, the exception detail panel, and an explained variance) before writing the README.

### Claude

The Scenario B prototype is built and running at **http://localhost:8888**. It works against the data pack, with every figure calculated by code from its rows. I checked each screen in a headless browser and tested the save and usage-log endpoints, but did not click through decisions, approvals or CSV exports in a real browser.

#### What it does

- **Close Overview:** the manager's landing page, with a ranked "needs a person today" list.
- **AP Review:** 43 exceptions from 437 invoice lines. Each opens a panel with the reason, the rows side by side, a proposed action and a decision button.
- **Variance Commentary:** a draft for each line over 10%, the evidence, and the questions to ask. A draft that says "NEEDS INPUT" cannot be approved until someone replaces that sentence.
- **Close Tracker:** a forecast of which owner reports will miss day 8, capacity by accountant, and a grid of every property and step.
- **Report Readiness:** a send / review / hold call per owner report (the true-up idea), with the reasons and the money that could move.
- **Method & Limits:** the rules, assumptions, the not-built list and the usage log.

#### What it found

- **Duplicates:** 7 pairs worth $56,019. Three are hidden by a dropped `INV-` prefix, so an exact-match check would miss them.
- **Wrong accounts hide variances:** 10 invoices are coded to an account the vendor doesn't normally use. Correcting them would push 10 more budget lines past the 10% threshold. This rests on an assumption the data pack can't confirm (that an approved invoice sits in the actual for its coded category), and the screen says so.
- **Only 1 of the 6 variances over 10% can be explained from the data.** The other five drafts say so plainly. The tracker marks commentary complete on all six with the field empty.
- **Reshuffling won't save the close:** 7 owner reports are forecast to miss day 8 even after rebalancing. The team is about 47 steps short with 17 spare. The forecast is a simple pace projection, labelled as such.
- **Report readiness:** 10 of 38 reports are safe to send, 8 need review and 20 are on hold.
- **Unverifiable approvals:** 50 approved invoices over $10,000 ($1.04M) have no record of who approved them.

#### Limits to know before you demo

- **No language model runs.** Commentary wording is composed by rules. I added an optional "tighten wording" call to Claude that rejects any rewrite containing a figure not in the draft, but it is untested because this machine has no Anthropic credentials. For a role with "AI Enablement" in the title, expect the panel to ask about this.
- **Nothing is written anywhere real.** Decisions are recorded locally and exported as CSV.
- **No cross-PMS or bank reconciliation handling.** The data pack has no fields for either, so the pain you heard in interview is addressed only in the README's handover notes.
- **Twenty holds may read as harsh.** A $141.67 duplicate puts a report on hold under the current rule; the thresholds are constants at the top of `js/engine.js` if you want to soften it.

To restart the server later: `cd interview_demo/asset-os && python3 tools/serve.py 127.0.0.1 8888`. It stops when this session ends. "Clear all decisions" on the Method & Limits screen resets it before a demo run.

#### Decision for you

Do you want the Claude rewrite live for the demo? It needs you to run `ant auth login` or set `ANTHROPIC_API_KEY`, after which I'd test it properly. Without it, the honest framing is "deterministic numbers, rule-composed drafts, model optional".

Everything is in `interview_demo/asset-os/`; `README.md` there is the one the brief asks for (what it is, how it's put together, assumptions, not-built list).

---

## 6. Darren

This is meant as a static html demo "simulating" an AI-First platform, so simulated AI features are fine for this demo purpose. It's showing what can be possible.
Please do one final audit and review with the Brief and html file, ensuring we meet the brief

### Claude

Python Playwright is installed, so I can do a real click-through test now.

### Claude

Click-through passed on both the server and straight from disk, with no page errors. Fixing one rounding mismatch, then updating the README, adding the build log and packaging a zip.

### Claude

The audit is done: the prototype meets the brief on everything that can be built, and three items are left that only you can do. I made several changes during the audit and then clicked through every feature in a real browser, both served and opened straight from disk, with no page errors.

#### What I changed

- **It is now a true static page.** `index.html` opens directly from disk or from any static host. The Python server is optional and only adds file-based saving.
- **Simulated AI is now visible:**
  - **Ask OS** (top bar, sidebar, or Ctrl/⌘+K) answers five questions about the close, including "What can't you tell me?". Anything else gets an honest "not in this demo".
  - **A drafted message** in every exception panel (to the vendor, Regional Manager, owner or coder), with a copy button.
  - **"Rewrite for the owner"** on commentary, followed by a check that the rewrite adds no figure the draft didn't have.
  - **A "Before you logged in" strip** on the overview showing the work already done.
- **Simulation is labelled.** The page footer, the Ask OS panel, the Method & Limits screen and the README all say the wording is composed from calculated figures and no model is called.
- **Removed the untested live-model call.**
- **Fixed a typing bug:** the commentary box lost focus mid-edit.
- **Added to the deliverables:** a "With another week" list on the Method screen, a rewritten README, a build log, and a zip.

#### Against the brief

| Brief asks for | Status |
|---|---|
| One scenario, for a named user | Met: Scenario B, Property Accounting Manager and staff accountants |
| Runs against the data pack; a user could act on it Monday | Met: worklists, decisions, drafted messages, CSV exports |
| AP review, honest variance drafter, close-slip view | Met: all three, plus the report readiness call |
| Uses the two policy notes ($10,000 approval, 10% variance) | Met |
| Finds what's wrong in the data and handles it honestly | Met: 5 of 6 variances say "cannot explain", with the questions to ask |
| An idea they hadn't thought of | Met: send/hold call per report, variances hidden by miscoding, next month's staffing collision |
| Clear about limits and assumptions | Met: Method & Limits screen and README |
| Access to the build plus a short README | Met: folder and zip |
| Build log or transcripts (optional) | Met: `BUILD_LOG.md`; times are approximate from file timestamps |
| Narrated 5–10 minute video | Yours to record |
| How long you spent and where the time went | Yours to state; the log covers only this working session |
| Return date and recipient | Still placeholders in the brief; confirm with the recruiter |

#### Remaining weak spots

- **Twenty of 38 reports show "Hold".** That is the rule working as written, but a panel may read it as alarmist. The thresholds are constants at the top of `js/engine.js`.
- **The "hidden variance" finding rests on an assumption** the data pack can't confirm (that an approved invoice sits in the actual for its coded category). The screen says so; be ready to say it aloud.
- **No cross-PMS or bank reconciliation handling**, because the pack has no fields for either. This is the pain you heard in interview, so name it yourself under "what I chose not to build".
- **Ask OS matches typed questions by keyword.** In a live demo, click the suggested questions.

The server is running at http://localhost:8888 for this session; state is cleared and ready for a recording run.

Files, from the repo root:
- `interview_demo/asset-os/index.html`
- `interview_demo/asset-os/README.md`
- `demo.zip`

---

## 7. Darren

Great!
please save our conversation to CLAUDE_PROMPT_ENGINEERING.md

### Claude

Saved to `CLAUDE_PROMPT_ENGINEERING.md`.

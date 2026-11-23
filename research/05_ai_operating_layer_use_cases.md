# 05 — AI Operating Layer: Use Cases, Evidence, Architecture, Metrics and Demo Guidance

Research date: 2026-11-21. Scope: the solution side of an AI-first operating layer that sits above existing property management systems (PMS) for a large third-party manager. Company profile, competitors, vendor landscape and Asset Living's specific pain points are covered in sibling documents.

## How to read this document

Three kinds of content are kept apart:

- **Sourced evidence** carries an inline URL and date, and a label: **[Operator]** (said by the operator itself, e.g. on an earnings call), **[Vendor]** (claimed by a vendor, including vendor-published customer case studies), **[Analyst]** (consultancy, trade-press or research estimate), **[Regulatory]**.
- **Verification level**: **(F)** = I opened the page this session and the figure was on it. **(S)** = the figure came from a search-result summary; the page itself was not opened or could not be opened. Treat (S) items as leads to confirm before quoting them to a client.
- **Design recommendations and assumptions** are mine. They appear under headings marked "Design" or "Assumption" and have no URL. Build-difficulty and demo-ability ratings in the catalogue are my judgement, not sourced.

Headline cautions that shape everything below:

1. Almost all quantified results for AI in multifamily come from vendors or vendor-published customer stories. Independent, controlled measurement is close to non-existent. The best non-vendor evidence is REIT earnings-call disclosure, and REITs own their assets and control their operating model, which a third-party manager does not.
2. Evidence is strong for the Residents pillar, moderate for Operations, thin for Back Office in a property-management setting, and very thin for the Owners pillar. The Owners pillar is where the concept is most differentiated and where published proof is weakest.
3. Asset Living already announced a portfolio-wide EliseAI partnership (leasing, delinquency, maintenance, renewals, voice) in September 2025. A demo that re-does AI leasing competes with something they have already bought.

---

## 1. Context that changes the design (sourced)

**Asset Living already has resident-facing AI.** Asset Living announced a partnership with EliseAI covering LeasingAI, Delinquency, Maintenance, Renewals and VoiceAI across "over 450,000 units" [Operator/Vendor press release, 2025-09-16, (S)] https://www.businesswire.com/news/home/20250916742919/en. EliseAI's case study on Asset Living claims a 591 bps increase in on-time rent payments, a 278 bps occupancy increase since the start of 2025, 85% of transactional communications automated, almost 50% of inquiries arriving after hours, and 72 to 78.2 monthly hours of capacity per community (the page gives both numbers), and says Asset Living is piloting Lease Audits and AI-Guided Tours. The same page gives roughly 13,000 associates and 500+ clients [Vendor, data labelled Q3 2025, (F)] https://eliseai.com/customer-stories/how-asset-living-revamped-lead-nurturing-and-delinquency-management-with-eliseai. Asset Living also announced a centralized business-intelligence platform in February 2024 [Operator, (S)] https://www.assetliving.com/blogs/asset-living-unveils-centralized-business-intelligence-platform-pioneering-data-driven-property-management.

**The PMS vendors are contesting the "invisible plumbing" thesis.** All three major PMS vendors now sell their own agent layers and position AI as built into the system of record:

- Yardi launched Virtuoso AI Agents (Marketplace and a no-code Composer) in September 2025 and announced agents "for every multifamily role and workflow" on 2026-06-15 [Vendor, (S); the press-release page returned 403 when fetched] https://www.yardi.com/news/press-releases/yardi-delivers-ai-agents-for-every-multifamily-role-and-workflow/.
- Entrata announced an "agentic property management system with 100+ embedded AI agents" and OXP Studio for governing agents and onsite teams in March 2026, and an OpenAI collaboration in June 2026 [Vendor, (S)] https://www.globenewswire.com/news-release/2026/03/24/3261761/0/en/Entrata-Introduces-the-Multifamily-Industry-s-First-Agentic-Property-Management-System-with-100-Embedded-AI-Agents.html.
- RealPage launched the Lumina AI Workforce (Leasing, Resident, Finance, Operations, Facilities agents) in 2025 and says its AI Leasing Agent runs at more than 175 management companies [Vendor, (S)] https://www.realpage.com/news/realpage-unveils-next-generation-ai-workforce-at-realworld-2025/.

**PMS vendors can and do gate agentic access.** On 2026-10-08 RealPage paused new EliseAI integration activations, saying EliseAI's "Apollo" agent (announced 2026-09-03, "a single AI agent capable of performing any task in the Elise platform") had not been submitted for review and operated beyond the agreed API scope. Existing integrations kept running. A temporary arrangement restoring new integrations was confirmed on 2026-11-12, with disagreements still open [Trade press, published 2026-10-12, updated 2026-11-12, (F)] https://www.multifamilydive.com/news/elise-realpage-multifamily-artificial-intelligence/832762/. A consultant quoted there said an agent working across a system of record raises questions about permissions, audit trails and liability. Days later RealPage announced a front-office integration with Funnel, with RealPage data as "source of truth" inside Funnel's workflow; RealPage's CEO conceded Funnel's platform "is simply better at that than ours is right now" [Trade press, 2026-10-13, (F)] https://www.multifamilydive.com/news/front-office-artificial-intelligence-property-management-system/832898/.

**Third-party managers face a structural incentive problem.** RealPage's CEO put it this way: managers pay for technology but savings at the property level flow to the owner, so "they can't invest too much if that only means that there is less costs at the property level" [Vendor executive quoted in trade press, 2026-08-26, (F)] https://propmodo.com/?p=181320. A 20for20 study of 14 third-party managers found property management agreements (PMAs) assign staff to specific properties, owners approve operating-model changes one property at a time, and centralization requires the manager to charge clients directly for shared services [Analyst, 2025-09-25, (F)] https://naahq.org/news/centralization-harder-third-party-managers-some-are-doing-it-anyway.

**Design implication (mine).** The defensible position for a manager-owned layer is the work no single PMS vendor or point solution covers: cross-PMS portfolio intelligence, the owner relationship, the manager's own back office and regional management, and orchestration of the point tools already bought. The PMS stays the system of record; point AI such as EliseAI stays the resident conversation engine. I could not verify how many different PMS platforms Asset Living operates on across its clients; the multi-PMS premise is common for third-party managers but is an assumption here.

---

## 2. Use-case catalogue

Ratings are my judgement. **Build**: 1 = straightforward, 5 = very hard (integration, regulatory or accuracy risk). **Demo**: 1 = hard to make land in a demo, 5 = lands immediately with synthetic data.

"System holding the data" uses generic categories: PMS (Yardi Voyager, RealPage OneSite, Entrata and others), CRM (PMS-native or Funnel, Knock, EliseCRM), conversational AI (EliseAI and similar), maintenance (PMS work orders, HappyCo and similar), screening and fraud vendors, payments, GL/accounting (usually the PMS), AP automation (Yardi Payscan, RealPage/Entrata equivalents, AvidXchange and similar), HRIS/ATS/LMS, BI warehouse, reputation tools, document store.

Autonomy shorthand used below: **Auto** = agent acts without approval inside policy. **HITL** = human approves before the action takes effect.

### 2.1 Residents

**R1. AI leasing and tour scheduling**
- Job: answer every inquiry in seconds, qualify, book a tour, follow up until lease or loss.
- Users: prospects; leasing staff and centralized leasing pods.
- Data: availability and pricing (PMS), lead history (CRM), calendars, listings (ILS feeds), policies (knowledge base).
- Auto: reply on all channels, book and reschedule tours, follow-up cadences, cross-sell sister communities. HITL: concessions outside policy, exceptions, anything touching protected-class topics, accommodation requests.
- Outcome: response time, lead-to-tour, tour-to-lease, lead-to-lease, after-hours capture, cost per lease.
- Build 3 (commodity; buy rather than build). Demo 3 (familiar to this audience; low differentiation).
- Design note: integrate the incumbent tool and surface its results in the layer; do not rebuild.

**R2. Application and screening support**
- Job: get a complete, verified application to a decision quickly and consistently.
- Users: applicants, guarantors, leasing staff, compliance.
- Data: application (PMS/CRM), screening and income/ID verification results (screening vendor), criteria (policy).
- Auto: chase missing documents, explain status, pre-check completeness, flag document anomalies for review. HITL: every approve/deny/conditional decision; adverse-action notices; any deviation from written criteria.
- Outcome: application completion time, completion rate, fraud catch rate, approval-to-lease time.
- Build 4 (Fair Housing Act and FCRA exposure). Demo 2.
- Constraint: HUD's May 2024 guidance says screening that relies on algorithms or AI must comply with the Fair Housing Act [Regulatory, 2024-05, (S)] https://archives.hud.gov/news/2024/pr24-098.cfm. A $2.3M settlement required SafeRent to stop scoring voucher holders [Trade press, 2024, (S)] https://www.eweek.com/fr/news/ai-landlord-tool-settles-discrimination-lawsuit/. Keep the agent on logistics, not on decisions.

**R3. Move-in orchestration**
- Job: every move-in arrives to a ready unit with utilities, insurance, keys and payments done.
- Users: new residents, leasing, maintenance, centralized admin.
- Data: lease and ledger (PMS), make-ready status (maintenance), renters insurance, utility transfer, access control.
- Auto: checklist tracking, reminders, document collection, day-of instructions, 7- and 30-day check-ins. HITL: move-in date changes, waived fees, releasing keys when a prerequisite is missing.
- Outcome: move-in readiness rate, day-1 work orders, 30-day satisfaction, early-term delinquency.
- Build 3. Demo 3.
- Evidence note: a UDR technology executive said a bad move-in experience is the number one driver of poor renewals [Operator statement at vendor forum, 2026-04-07, (F)] https://funnelleasing.com/panel-recap-udrs-next-generation-of-centralization/.

**R4. 24/7 resident service across SMS, voice, email and app**
- Job: resolve routine resident questions and requests at any hour, hand off cleanly when a human is needed.
- Users: residents; site teams; centralized resident-services pods.
- Data: ledger, lease, work orders (PMS), community policies, conversation history (CRM/conversational AI).
- Auto: balance and policy questions, amenity bookings, package and access questions, status updates. HITL: fee waivers, lease changes, disputes, complaints about staff, anything legal, health or safety.
- Outcome: containment rate, first-response time, hours returned to site staff, CSAT.
- Build 3 (buy). Demo 3.
- Counter-evidence to design around: in a HappyCo-commissioned survey of about 300 renters, 82% preferred a human first for urgent maintenance; comfort with AI was 67% for general questions, 53% for routine maintenance, 36% for rent and billing; residents with access to human support were 11 points more likely to renew [Vendor-commissioned survey, published 2025-12-11, (F)] https://www.multifamilyexecutive.com/technology/happyco-study-reveals-where-ai-helps-and-falls-short-maintenance.

**R5. Maintenance intake and triage**
- Job: turn a vague report into a correctly categorised, prioritised, access-cleared work order, or a resident self-fix.
- Users: residents, maintenance supervisors, technicians.
- Data: work-order history and unit assets (PMS/maintenance), photos and video, troubleshooting knowledge.
- Auto: structured intake, photo capture, troubleshooting for simple issues, priority and skill tagging, permission-to-enter, status updates. HITL: emergency classification overrides, habitability issues, anything with injury, mould, gas, fire or flood goes straight to a human with the agent only gathering facts.
- Outcome: first-time-fix rate, time to completion, avoided dispatches, after-hours emergency accuracy.
- Build 3. Demo 4 (photo to diagnosis is visual).

**R6. Renewal and retention-risk prediction with proactive intervention**
- Job: know months ahead who is likely to leave and why, and act while it can still change the outcome.
- Users: property managers, regional managers, centralized renewal pods.
- Data: lease dates and rent (PMS), work-order history and reopen rates (maintenance), sentiment (surveys, reviews, conversation transcripts), payment behaviour, renewal-offer history.
- Auto: risk scoring with reasons, drafting personalised outreach, scheduling service-recovery tasks, sending standard renewal offers within the approved pricing matrix. HITL: any incentive, rent exception, transfer offer; the renewal price itself (see pricing constraints in O6).
- Outcome: renewal rate, turnover rate, notice-to-vacate lead time, turn cost avoided.
- Build 4 (needs joined data across systems; prediction quality is hard to prove quickly). Demo 4.
- Evidence note: an operator view quoted in trade press is that models "are best used to flag trends and prioritize outreach" [Trade press, 2025-2026, (S)] https://www.multihousingnews.com/for-operators-resident-retention-is-an-noi-strategy/.

**R7. Delinquency outreach and payment plans**
- Job: collect earlier with less staff time and fewer filings, within local law.
- Users: residents, property managers, collections specialists.
- Data: ledger and payment history (PMS/payments), local notice rules (legal knowledge base), payment-plan policy.
- Auto: reminders, balance explanations, payment links, offering pre-approved plan templates, logging promises to pay. HITL: non-standard plans, fee waivers, statutory notices, referral to legal, any contact once an eviction is filed.
- Outcome: delinquency rate, percentage collected by day N, days-earlier payment, bad debt, filings avoided.
- Build 3 (buy; legal rules vary by jurisdiction). Demo 3.

**R8. Sentiment and reputation management**
- Job: detect dissatisfaction early at resident and property level, and respond to public reviews consistently.
- Users: marketing, property managers, regional managers.
- Data: review sites, surveys, conversation transcripts, work-order feedback.
- Auto: classify themes, link reviews to underlying tickets, draft responses, alert on spikes. HITL: publishing responses to negative or legally sensitive reviews; anything naming staff.
- Outcome: review rating, response time and rate, theme trends, link to renewal intent.
- Build 2. Demo 4.

**R9. Student housing specifics**
- Job: run a by-the-bed, academic-year leasing cycle with parents, guarantors, roommates and a compressed turn.
- Users: students, parents and guarantors, site teams, turn coordinators.
- Data: bed-level inventory and individual leases (student PMS module, e.g. Entrata or Yardi student), guarantor documents, roommate preferences, turn schedule.
- Auto: parallel student and parent conversation threads with consistent answers, guarantor packet chasing, roommate-matching suggestions from stated preferences, pre-lease pace tracking against prior year, move-out and move-in scheduling by time slot. HITL: roommate assignments and conflict moves, guarantor waivers, damage charge allocation between roommates.
- Outcome: pre-lease velocity versus prior year, guarantor completion time, turn completed on time, post-turn damage disputes.
- Build 4. Demo 4 (the August turn compressed into a few days is a vivid story).
- Evidence: Redstone (35,000 units, about half student) reported 30% of student leads arriving after 1:00 a.m., 33% higher lease conversion at communities with central teams, and a centralized team generating about $20,000 a month as a profit center [Operator at vendor forum, 2025-05-07, (F)] https://funnelleasing.com/today-in-operations-centralization-in-action/. Landmark Properties' AI assistant reportedly handled 8,338 new leases in 2024 at about 15% lead-to-lease [Vendor case study, (S)] https://www.eliseai.com/resources/landmark-properties-ai-success-story. I found no published evidence on AI for guarantor handling or roommate matching.

### 2.2 Operations

**O1. Maintenance dispatch and vendor coordination**
- Job: get the right technician or vendor to the right job with the right parts, and close the loop.
- Users: maintenance supervisors, technicians, vendors, property managers.
- Data: work orders, technician skills and schedules, unit asset history (PMS/maintenance), vendor contracts and rates (AP/vendor system), COI status.
- Auto: assign and sequence in-house work, propose vendor for out-of-scope jobs, request quotes, schedule access, chase completion and photos, match invoice to work order. HITL: vendor spend above a threshold, non-preferred vendors, capital items, anything lacking a valid COI.
- Outcome: completion time, technician utilisation, vendor spend per unit, repeat work orders.
- Build 4. Demo 3.
- Evidence is cautious: operators quoted in August 2026 described AI in maintenance as early stage. Greystar: "still in the early stages"; RPM Living had not selected a platform; CAPREIT said ROI is hard to calculate because operators lack data [Operator, 2026-08-21, (F)] https://www.multifamilydive.com/news/multifamily-operators-ai-apartment-maintenance/828275/.

**O2. Make-ready and turn management**
- Job: minimise vacant days between move-out and move-in at controlled cost.
- Users: property managers, maintenance supervisors, turn vendors, regional managers.
- Data: notices and move-in dates (PMS), inspection results, turn task boards, vendor schedules, turn cost budget (GL).
- Auto: build the turn plan at notice, pre-order standard scopes, sequence trades, update ready dates and feed availability, flag slipping turns. HITL: scope upgrades, damage charges to departing residents, spend above budget.
- Outcome: average days vacant, turn cost per unit, on-time ready rate, days from ready to occupied.
- Build 3. Demo 4 (a board of units moving from notice to ready is easy to grasp).

**O3. Inspections**
- Job: capture unit and property condition consistently and turn findings into work, charges and capital plans.
- Users: technicians, property managers, regional managers, asset managers, owners.
- Data: photo and video (inspection app), unit asset register, prior inspections, lease terms on damage.
- Auto: transcribe and classify findings from photos or video walkthroughs, compare with move-in condition, draft work orders and damage estimates. HITL: resident charges, life-safety findings, capital recommendations to owners.
- Outcome: inspection time per unit, findings converted to work orders, deposit dispute rate.
- Build 4 (computer-vision accuracy). Demo 5 (video in, itemised report out).
- Evidence: Yardi says it now offers inspection agents that analyse video walkthroughs to identify repairs [Vendor, 2026-06-15, (S)] https://www.yardi.com/news/press-releases/yardi-delivers-ai-agents-for-every-multifamily-role-and-workflow/. No outcome data found.

**O4. Centralized or podded staffing and task routing**
- Job: route every task to the cheapest competent resource (agent, central specialist, pod, site) and balance workload.
- Users: centralized operations leaders, pod leads, site teams.
- Data: task streams from every system, staff rosters and skills (HRIS/workforce), property groupings, service-level targets, PMA constraints on what may be centralized per owner.
- Auto: classify and route tasks, set due dates, reassign on absence, measure queue health. HITL: changing a property's operating model, changes that affect PMA-defined staffing, performance actions.
- Outcome: tasks per FTE, overdue-task rate, units per site FTE, coverage hours.
- Build 4 (the hard part is organisational, and owner-by-owner permissions). Demo 3.
- Evidence: UDR reported an 11% increase in task completion and a 25% reduction in overdue tasks after structured, AI-supported workflows [Operator at vendor forum, 2026-04-07, (F)] https://funnelleasing.com/panel-recap-udrs-next-generation-of-centralization/.

**O5. Regional manager "portfolio copilot" with exception-based management**
- Job: let one regional manager oversee more properties by replacing report-reading with a ranked list of exceptions and recommended actions.
- Users: regional managers, regional vice presidents, operations executives.
- Data: everything, joined: occupancy, exposure, leasing funnel, delinquency, work orders, turns, budget versus actual, staffing gaps, reviews, owner commitments (PMS, CRM, GL, HRIS, BI).
- Auto: overnight scan of every property against thresholds and peers, root-cause drill-down, drafted action plans, drafted notes to site managers and owners, follow-up tracking. HITL: any action that changes price, spend, staffing or owner communication.
- Outcome: properties per regional manager, time from issue onset to action, share of week spent on-site versus in reports, variance to budget.
- Build 4 (data joins across systems; trust in the ranking). Demo 5.
- Evidence: I found no published operator results for a regional-manager copilot. This is a design hypothesis supported only by adjacent evidence.

**O6. Pricing and renewal recommendations**
- Job: set new-lease and renewal rents that balance occupancy and rate, with a defensible audit trail.
- Users: revenue managers, property managers, asset managers, owners.
- Data: own-portfolio leasing velocity, exposure, lease expirations and trade-out history (PMS); public listing data.
- Auto: produce recommendations with reasons, simulate scenarios, monitor outcomes. HITL: every price decision is a human decision; the system records who accepted, changed or rejected and why.
- Outcome: effective rent growth, blended lease trade-out, exposure, days vacant.
- Build 4. Demo 2 (legally sensitive; easy for an executive audience to raise objections).
- **Legal constraints that must shape the design:**
  - DOJ's proposed settlement with RealPage (November 2025, subject to court approval): no use of competitors' nonpublic data in runtime recommendations, nonpublic training data at least 12 months old, no geographic modelling narrower than state level, removal or redesign of features that limited price decreases or aligned competitors, a court-appointed monitor, seven-year term [Trade press and DOJ, 2025-11-25, (S)] https://www.npr.org/2025/11/25/g-s1-99331/realpage-rent-algorithm-limits-settlement and https://www.justice.gov/opa/pr/justice-department-requires-realpage-end-sharing-competitively-sensitive-information-and.
  - New York added algorithmic rent-setting provisions to the Donnelly Act (A1417-B) and California amended the Cartwright Act to regulate common pricing algorithms; RealPage has sued over the New York law [Law-firm commentary, 2025-12-04, (S)] https://clsbluesky.law.columbia.edu/2025/12/04/paul-weiss-discusses-dojs-algorithmic-pricing-settlement/. Several cities have also passed bans; I did not verify the current list or effective dates.
  - Design rule (mine): a third-party manager serves competing owners in the same submarket, so the layer must never pool one owner's nonpublic data into recommendations for another owner. Enforce owner-level data partitioning in the pricing feature by construction, use only that owner's data plus public data, never auto-accept, and never design features that discourage decreases. Get antitrust counsel sign-off before this module is shown as anything more than a governed wrapper around the client's chosen revenue-management tool.

**O7. Affordable housing compliance (LIHTC and HUD recertifications)**
- Job: complete income certifications and recertifications on time with files that pass audit.
- Users: compliance specialists, site managers, residents, state agency and investor auditors.
- Data: household composition, income and asset documents, rent and utility-allowance limits, certification history (affordable PMS module, document store), verification services.
- Auto: recertification calendar and resident outreach, document collection, extraction and income calculation draft, file completeness audit against the program checklist, flagging discrepancies. HITL: every Tenant Income Certification is reviewed and signed by a qualified person; eligibility determinations; anything submitted to an agency.
- Outcome: on-time recert rate, hours per file, audit findings per file, units out of compliance.
- Build 5 (program rules, HOTMA changes, consequences of error include credit recapture). Demo 4 (messy pay stubs in, calculated worksheet and gap list out).
- Evidence is thin: an accounting-firm article says AI is strongest at reading income documents, drafting TICs, auditing files and maintaining calendars, and warns against treating AI outputs as conclusions [Analyst, 2026, (S)] https://www.claconnect.com/en/resources/articles/26/ai-in-hud-lihtc. An NCSHA presentation describes manual verification as taking up to an hour of staff time and nearly a month per verification [Industry body, date not confirmed, (S)] https://www.ncsha.org/wp-content/uploads/Keeping-Up-with-Compliance-Tech-Presentation.pdf. No quantified operator result found.

**O8. Onboarding, training and SOP knowledge assistant**
- Job: get new site staff productive fast and give everyone an instant, cited answer to "how do we do this here, for this owner".
- Users: all site and regional staff, trainers, HR.
- Data: SOPs and policy manuals (document store, LMS), owner-specific requirements from PMAs, PMS how-to content, state and local rules.
- Auto: answer with citations, walk a user through a procedure in the PMS, detect repeated questions and flag SOP gaps. HITL: SOP changes; answers on legal or Fair Housing questions route to a human or return the policy text verbatim.
- Outcome: time to productivity, help-desk and regional-manager interruptions, policy exceptions, training completion.
- Build 2. Demo 4.
- Context: onsite turnover was reported at 29.2% over 12 months versus 14.2% for corporate roles [Industry survey via NAA, 2025, (S)] https://naahq.org/news/why-employee-retention-challenges-go-deeper-wages. Vendor survey: AppFolio users reported saving 12.5 hours a week with Realm-X on communications, reporting and training [Vendor survey, August 2025, (S)] https://www.appfolio.com/newsroom/appfolio-ai-agents.

### 2.3 Back Office

**B1. Invoice and AP processing**
- Job: code, match, approve and pay invoices accurately across thousands of entities with different charts of accounts and approval rules.
- Users: AP clerks, property managers (approvers), property accountants, vendors.
- Data: invoices (email, portal), POs and contracts, work orders (PMS/maintenance), vendor master, GL and budgets (PMS), owner approval matrices (PMA).
- Auto: capture, GL coding, duplicate detection, three-way match, routing, vendor query replies. HITL: approvals per the owner's matrix, new vendors, bank-detail changes (fraud control), exceptions.
- Outcome: cost per invoice, cycle time, touchless rate, exception rate, duplicate payments, late fees.
- Build 3. Demo 3.

**B2. Bank reconciliation and month-end close**
- Job: close each property's books on time with fewer manual reconciliations and a clean review trail.
- Users: property accountants, controllers, owner reporting teams.
- Data: bank feeds, GL, sub-ledgers, accrual schedules (PMS/GL), close checklist.
- Auto: transaction matching, proposed reconciling items, recurring accrual drafts, checklist tracking, flux flags. HITL: all journal entries are posted by an accountant; unusual items; sign-off.
- Outcome: days to close, reconciling items aged over 30 days, entries per accountant, properties per accountant.
- Build 4. Demo 2.

**B3. Budget-versus-actual variance commentary**
- Job: explain every material variance in plain language, tied to the transactions that caused it.
- Users: property accountants, property and regional managers, asset managers, owners.
- Data: GL actuals, budget, prior year, invoice and work-order detail, occupancy and leasing data (PMS).
- Auto: compute variances deterministically, trace to drivers, draft commentary with links to source transactions, ask the property manager targeted questions where data cannot explain. HITL: manager and accountant approve commentary before it leaves the building.
- Outcome: hours per report, on-time delivery, owner follow-up questions per report, restatements.
- Build 3. Demo 5.

**B4. Lease audit and abstraction**
- Job: confirm that what was signed matches what is being billed, and catch leakage.
- Users: compliance and audit teams, property managers, takeover teams.
- Data: executed lease documents and addenda (document store), lease charges and ledger (PMS), concession and fee policy.
- Auto: extract terms, compare to PMS charges, flag missing signatures, wrong rent, unbilled fees, expired concessions, missing insurance. HITL: ledger corrections and any resident back-billing.
- Outcome: files audited per hour, discrepancy rate, recovered revenue, audit pass rate.
- Build 3. Demo 4.
- Note: EliseAI says Asset Living is piloting its Lease Audits product [Vendor, 2025-2026, (F)] https://eliseai.com/customer-stories/how-asset-living-revamped-lead-nurturing-and-delinquency-management-with-eliseai.

**B5. Utility billing**
- Job: pay utility invoices correctly and recover the right share from residents.
- Users: utility analysts, AP, property managers.
- Data: utility invoices, meter or allocation data, occupancy (PMS), lease utility addenda, local billing rules.
- Auto: invoice capture and anomaly detection (leaks, rate errors, vacant-unit usage), allocation runs, resident bill questions. HITL: allocation method changes, credits, disputes.
- Outcome: recovery rate, anomalies caught, billing disputes, vacant-unit cost.
- Build 3 (often outsourced to a utility-billing vendor). Demo 2.
- Evidence is weak and vendor-sourced; one consultancy's recovery-uplift figures were internally inconsistent [Analyst, 2026, (S)] https://www.theaiconsultingnetwork.com/blog/ai-cre-utility-bill-management-rubs-recovery-2026.

**B6. Collections and legal workflow**
- Job: move delinquent accounts through notices, filings and post-move-out collections correctly per jurisdiction.
- Users: collections specialists, property managers, eviction counsel, collection agencies.
- Data: ledger (PMS), notice templates and jurisdiction rules, court dates, attorney communications, final account statements.
- Auto: prepare notice packets, assemble ledgers and documents for counsel, track deadlines, draft final account statements. HITL: serving any notice, filing, settlement, write-off, agency referral.
- Outcome: days from default to resolution, filing accuracy, dismissed cases, recovery rate on former-resident debt.
- Build 4. Demo 2.

**B7. HR and recruiting**
- Job: fill site roles faster and keep them filled.
- Users: recruiters, hiring managers, candidates, HR business partners.
- Data: requisitions and applicants (ATS), HRIS, scheduling, performance and tenure data.
- Auto: sourcing and scheduling, candidate Q&A, interview kits, onboarding paperwork chasing, attrition-risk signals at property level. HITL: every screening, hiring, pay and termination decision.
- Outcome: time to fill, 90-day attrition, vacancy days per role, recruiter requisition load.
- Build 3 (employment-law exposure on automated screening). Demo 2.
- Context: 466,100 property, real estate and community association managers in the US as of 2024 (BLS, via Bisnow) [Trade press, 2026-07-31, (F)] https://www.bisnow.com/national/news/ai/ai-adoption-jeopardizes-half-a-million-property-management-jobs-135656.

**B8. Property takeover, onboarding and offboarding**
- Job: when an owner hires the manager (or leaves), move the property's data, people, vendors and resident relationships between managers and PMS instances in days rather than weeks, with the first rent cycle and first owner report correct.
- Users: transition team, property accountants, IT/PMS administrators, new site staff, the owner's asset manager.
- Data: outgoing manager's rent roll, ledgers, lease files, trial balance, vendor list, open work orders, delinquency and legal status (exports, PDFs, spreadsheets in inconsistent formats); target PMS setup; PMA terms.
- Auto: ingest whatever arrives, map to the canonical model, reconcile rent roll to ledger to lease files, produce a discrepancy list, generate PMS load files, draft resident and vendor notices, build the takeover checklist and track it. HITL: sign-off on opening balances, security-deposit liability, mapping of chart of accounts, loads into the PMS, every resident and owner communication.
- Outcome: days from award to go-live, discrepancies found before first rent run, first-month owner-report accuracy, transition labour hours, time until the property is "steady state".
- Build 5 (messy inputs, each PMS has different load mechanics, write access is the constraint). Demo 4.
- Evidence: thin. General guidance notes that data in the outgoing manager's software belongs to that manager and cooperation is not guaranteed, and that data quality is the main driver of migration delay [Vendor and trade guidance, various dates, (S)] https://www.multifamilyexecutive.com/property-management/smooth-operators-6-tips-for-handling-property-management-transitions_o. No published AI results for takeovers found. For a manager whose portfolio grew from about 70,000 to over 450,000 units in roughly five years (vendor case study above), the volume of takeovers makes this a core process, not an edge case.

**B9. Vendor compliance (COIs)**
- Job: no vendor works or gets paid without valid insurance and required documents.
- Users: procurement and risk, AP, property managers, vendors.
- Data: COIs, W-9s, licences (vendor-compliance system), owner insurance requirements (PMA), vendor master (PMS).
- Auto: read certificates, check limits and endorsements against each owner's requirements, chase renewals, block dispatch and payment when lapsed. HITL: waivers, non-standard coverage, new high-risk trades.
- Outcome: compliant-vendor rate, lapsed-coverage exposure days, hours per certificate.
- Build 2. Demo 3.
- Evidence: I found no published non-compliance baseline, only vendor pricing ranges.

### 2.4 Owners

**W1. Automated monthly owner reports with narrative variance explanations**
- Job: deliver each owner's monthly package on time, in that owner's format, with commentary an asset manager trusts.
- Users: owner reporting team, property accountants, regional managers; owners' asset managers as readers.
- Data: financial statements and GL detail (PMS), operating KPIs, leasing and delinquency (PMS/CRM), capital projects, market context (public data), each owner's template and thresholds (PMA and client file).
- Auto: assemble the package, compute KPIs deterministically, draft narrative with drill-through to transactions, check against last month's commitments, flag where a human explanation is needed. HITL: regional manager and accountant approve; nothing reaches an owner unreviewed.
- Outcome: report cycle time, on-time rate, hours per package, owner follow-up questions, corrections after issue.
- Build 3. Demo 5.
- Evidence: thin and vendor-led. An accounting firm lists "first-draft variance commentary" among four tasks where AI reliably produces results in property accounting, alongside invoice coding, lease abstraction and recovery reconciliation prep [Analyst, 2026-10-28, (F)] https://www.eisneramper.com/insights/real-estate/ai-property-accounting-data-governance-automation-1026/.

**W2. Natural-language Q&A across a portfolio**
- Job: answer an owner's or executive's question in seconds, with numbers that tie to the books.
- Users: owners' asset managers, the manager's client-services leads and executives.
- Data: canonical model over PMS/GL/CRM data, scoped strictly to that owner's entities.
- Auto: translate the question into governed queries over a semantic layer, return the figure, the definition used, the period and a link to detail; say "I can't answer that from the data" when it cannot. HITL: none for read-only answers inside the owner's scope; forecasts and opinions are labelled as such or routed to the client lead.
- Outcome: questions answered without staff time, response time, ad hoc report requests avoided.
- Build 4 (accuracy and entitlement are everything). Demo 5.

**W3. Proactive alerts and asset-level risk flags**
- Job: the owner hears about a problem from the manager first, with a plan attached.
- Users: client-services leads, regional managers; owners.
- Data: same as O5, plus insurance claims, legal matters, capital and compliance deadlines, debt covenants if the owner shares them.
- Auto: detect threshold and trend breaches, assemble context and a proposed plan. HITL: the client lead decides what is sent and when; legal and insurance matters always reviewed.
- Outcome: share of issues owner heard from manager first, time from onset to disclosure, escalations.
- Build 3. Demo 4.

**W4. Owner-health and churn-risk scoring for the client relationship**
- Job: know which client relationships are at risk and why, early enough to act.
- Users: executives, client-services and business-development leads, regional vice presidents.
- Data: property performance versus budget and versus the owner's underwriting, report timeliness and corrections, response times to owner emails, escalations, site staff turnover and vacancies, open audit findings, contract dates and termination terms (PMA), owner's disposition activity, relationship notes (CRM, email metadata).
- Auto: score each client and property, explain the drivers, propose a save plan, track commitments made to the owner. HITL: all outreach and commercial concessions.
- Outcome: owner (unit-weighted) churn, share of at-risk relationships with an active plan, controllable versus uncontrollable loss split.
- Build 4 (labels are sparse: few churn events, many caused by asset sales). Demo 5 for an executive audience.
- Evidence: none found for institutional third-party management. Churn benchmarks I found relate to small residential managers (8 to 15% of owners per year in one industry source) and are not transferable [Vendor blog, 2026, (S)] https://www.hostaway.com/glossary/owner-churn/.

**W5. Budget season support**
- Job: build hundreds or thousands of property budgets with consistent assumptions and less spreadsheet labour.
- Users: property and regional managers, accountants, asset managers.
- Data: trailing actuals, contracts and known rate changes, staffing plan, tax and insurance, capital plan, owner guidance.
- Auto: draft a baseline budget with line-level rationale, flag outliers versus peers, track owner comments and versions, load approved budgets to the PMS. HITL: all assumptions and the final budget.
- Outcome: hours per budget, revision cycles, budget accuracy the following year.
- Build 3. Demo 3 (seasonal relevance: strongest August to November).

**W6. New-business, RFP and due-diligence support**
- Job: respond to RFPs and support owners' acquisitions with evidence from the manager's own portfolio.
- Users: business development, executives, due-diligence teams, the owner's acquisitions team.
- Data: prior RFP responses, performance track record by market and asset type, staffing plans, lease-file audits and rent rolls for target assets.
- Auto: draft RFP answers from the approved library and live performance data, build a proposed staffing and budget plan, run lease-file and rent-roll audits on target assets. HITL: all pricing, commitments and submitted content.
- Outcome: RFP turnaround, win rate, due-diligence days.
- Build 2 for RFP drafting, 4 for due diligence. Demo 3.

**W7. Transparency portal**
- Job: give owners a live, trustworthy window into their assets without creating support load.
- Users: owners and their asset managers.
- Data: the same governed model as W1 to W3, entitlement by owner entity.
- Auto: live KPIs, document vault, action log showing what the manager did about each issue, Q&A (W2). HITL: what is exposed in real time versus after close is a policy decision; unreviewed financials should be labelled preliminary.
- Outcome: portal adoption, ad hoc requests, owner satisfaction, retention.
- Build 3. Demo 4.
- Design caution: real-time transparency exposes bad news before the manager has a plan. Pair every exposed exception with its action status.

---

## 3. Evidence of value

### 3.1 Public REIT disclosures (best available non-vendor evidence)

| Source | Finding | Label | URL and date |
|---|---|---|---|
| Equity Residential, Q4 2025 call | First round of centralization, automation and AI in leasing produced a 15% reduction in on-site payroll. Further AI and automation over 18 months expected to cut on-site payroll another 5 to 10% over several years and lower repair and maintenance expense | Operator (F) | https://www.multifamilydive.com/news/equity-residential-2025-earnings-q4/811880/ (2026-02-10) |
| Equity Residential | Headcount down 20% from 2020 to 2025, cited to an investor presentation dated 2026-02-27 | Operator via trade press (F, secondary) | https://www.bisnow.com/national/news/ai/eliseai-property-management-job-cuts-135059 (2026-06-22) |
| Equity Residential, Q2 2025 call | AI leasing application pilots reduced application completion time by over 50% | Operator (S) | https://ng.investing.com/news/transcripts/earnings-call-transcript-equity-residential-q2-2025-beats-eps-forecast-stock-rises-93CH-2044504 (2025) |
| Equity Residential | AI assistant handled about 600,000 inquiries, sent 2 million responses and booked over 80,000 appointments in 2023 | Operator (F) | https://multifamilydive.com/news/equity-residential-avalonbay-udr-artificial-intelligence-centralization-leasing/725923 (2024-09-03) |
| AvalonBay | 60% of the way to a target of $80M annual incremental NOI from operating initiatives; a further $7M expected in 2026 | Operator (F) | https://www.multifamilyexecutive.com/technology/avalonbay-turning-tech-centralization-and-ai-operating-gains (2026-04-13) |
| AvalonBay | Neighborhood model groups up to five properties or 1,500 units under one manager and service team. Payroll growth for 2024 expected at about 1% against merit increases near 4%, attributed to fewer on-site positions | Operator (F) | https://multifamilydive.com/news/equity-residential-avalonbay-udr-artificial-intelligence-centralization-leasing/725923 (2024-09-03) |
| UDR | More than 30 properties with no staff on site (2024). After AI-supported workflows: 36% of tours booked through AI workflows, 24% through voice AI, 36% after hours; 11% more tasks completed; 25% fewer overdue tasks; 14.9% of residents lease at a different community than first inquired | Operator (F; second item at a vendor forum) | https://multifamilydive.com/news/equity-residential-avalonbay-udr-artificial-intelligence-centralization-leasing/725923 (2024-09-03); https://funnelleasing.com/panel-recap-udrs-next-generation-of-centralization/ (2026-04-07) |
| UDR | Customer Experience Project: annualized turnover improved by more than 4% since 2023, about $3.5M incremental NOI (scope unclear); Q2 2026 same-store expense growth 2.6% | Operator (S) | https://s206.q4cdn.com/293289095/files/doc_financials/2026/q2/UDR-2Q26-Earnings-Call-Transcript.pdf (2026-07-28) |

Not found: quantified centralization or AI disclosures for MAA, Camden or Essex.

Transferability caveat (mine): REITs own their properties, cluster them geographically and decide their own staffing. A third-party manager needs owner consent property by property (section 1).

### 3.2 Operator-reported results (often delivered on vendor stages)

| Operator | Finding | Label | URL and date |
|---|---|---|---|
| Greystar | Automated delinquency notices saved up to 10 hours per person per week in centralized teams; payments arrived an average of six days earlier | Operator at vendor forum (F) | https://funnelleasing.com/today-in-operations-centralization-in-action/ (2025-05-07) |
| Pacific Urban Investors (23,000+ units) | Delinquency fell from 3.8% to 2.6% (Dec 2024 to Feb 2025 versus prior year) | Operator at vendor forum (F) | same |
| Redstone (35,000 units, about half student) | 33% higher lease conversion and 12% higher lead-to-tour at centrally supported communities; 6.5% lift in lease conversion for AI-scheduled tours; central team is a roughly $20,000-a-month profit center | Operator at vendor forum (F) | same |
| Bozzuto | Pilot properties with a leasing and maintenance chatbot saved an average of 32 hours of work time (period not stated in what I saw) | Operator via trade press (S) | https://www.bisnow.com/news/chicago/multifamily/how-ai-is-reshaping-chicago-multifamily-operations-131886 (date not confirmed) |
| Campbell Communities | Neglected leads fell from 5% to under 1%; on pace to double conversion | Operator on vendor blog (F) | https://www.entrata.com/blog/real-results-and-the-future-of-leasing-with-eli-from-entrata (2025-11-17) |
| A $2B public REIT (unnamed) | Month-end close finishes two days after month end, down from 10, after standardising portfolio data before automating | Analyst case (F) | https://www.eisneramper.com/insights/real-estate/ai-property-accounting-data-governance-automation-1026/ (2026-10-28) |
| Greystar, CAPREIT, RPM Living | AI in maintenance is early; no quantified results; "AI can't complete repairs or turn an apartment" | Operator (F) | https://www.multifamilydive.com/news/multifamily-operators-ai-apartment-maintenance/828275/ (2026-08-21) |
| BH (third-party manager) | Ran its centralized model at cost for nearly a year before data could demonstrate value | Analyst study (S) | https://funnelleasing.com/bh-rkw-playbook-third-party-centralization-apartmentalize-2025/ (2025) |

### 3.3 Vendor claims (treat as directional)

| Vendor | Claim | URL and date |
|---|---|---|
| EliseAI on Asset Living | 591 bps more on-time payments; 278 bps occupancy gain since start of 2025; 85% of transactional communications automated; 72 to 78.2 monthly hours of capacity per community (F) | https://eliseai.com/customer-stories/how-asset-living-revamped-lead-nurturing-and-delinquency-management-with-eliseai (Q3 2025 data) |
| EliseAI case studies | Delinquency reductions of 20 to 60 bps (Ardizzone 20, Juniper 39, Worcester 50, SRG 60, Landmark 60); lead-to-lease around 5% at several operators and about 15% at Landmark (S) | https://eliseai.com/customer-stories/improved-collections-and-staffing-efficiency-at-juniper-investment-group-with-eliseai and sibling pages (2024 to 2025) |
| EliseAI | Operators centralizing both leasing and admin averaged $380 NOI per unit per year (leasing alone $165, admin alone $160), from internal benchmarks with no control group; Villa Serena $731 per unit per year, 43% from payroll (F) | https://eliseai.com/blog/2025-centralization-year-in-review (2025-12-18) |
| EliseAI playbook | AI can cut leasing and administrative hours by 40%, yield 10 to 20% payroll savings and handle about 60% of leasing work (F, via trade press) | https://www.bisnow.com/national/news/ai/eliseai-property-management-job-cuts-135059 (2026-06-22) |
| EliseAI on S2 | 40% decrease in median work-order completion time; 17 hours a week saved per community (S) | https://eliseai.com/customer-stories/how-s2-empowers-their-techs-and-completes-work-orders-faster-with-eliseais-maintenance-app |
| EliseAI on CAF Management | Centralized staffing ratio of 1 to 1,454 units (definition of the role not verified) (S) | https://eliseai.com/customer-stories/how-caf-management-uses-eliseai-to-power-a-centralized-operating-model (2025) |
| Funnel on Greystar | 3.5 million messages in 2025 with 62% containment; 94,000 tours scheduled across 1,400 properties (S) | https://funnelleasing.com/panel-recap-from-reactive-ai-to-truly-agentic-systems/ (2026) |
| AppFolio | Realm-X users report saving 12.5 hours a week (survey, Aug 2025); other AppFolio material says 10 and 9.1; Flows users show 73% higher lead-to-showing than non-users (not a controlled comparison) (S) | https://www.appfolio.com/newsroom/appfolio-ai-agents (2025) |
| Renew | Retention up nearly 3 points at one owner; renewal decisions 30 days faster (S) | https://www.bisnow.com/studio-b/national/multifamily/multifamily-operators-retention-renew-studiob-133151 (sponsored content) |
| Yardi | KETTLER saw an 86% decrease in invoice processing time with Smart AP; Virtuoso Assistant handled 600,000+ chats since January 2026 (S; exact page not confirmed) | https://www.yardi.com/news/press-releases/yardi-delivers-ai-agents-for-every-multifamily-role-and-workflow/ (2026-06-15) |
| Nurture Boss / Flair | 52.93% of leasing calls unanswered across 1,100+ communities and 20,000+ rated calls in a secret-shop study (S) | https://info.nurtureboss.io/hubfs/The%20Multifamily%20Revenue%20Gap%202026%20%E2%80%94%20Nurture%20Boss.pdf (2026) |

### 3.4 Analyst estimates, benchmarks and surveys

| Source | Finding | Label | URL and date |
|---|---|---|---|
| McKinsey | Generative AI could create $110B to $180B or more in value for real estate; many firms struggle to scale use cases | Analyst (S) | https://www.mckinsey.com/industries/real-estate/our-insights/generative-ai-can-change-real-estate-but-the-industry-must-change-to-reap-the-benefits (2023) |
| JLL Global Real Estate Technology Survey | About 90% of companies piloting AI; only 5% achieved all programme goals; 47% achieved two or three | Analyst (S) | https://www.jll.com/en-us/newsroom/real-estates-ai-reality-check-companies-piloting-only-achieved-all-ai-goals (2025-10-28) |
| McKinsey, "Seizing the agentic AI advantage" | More than 80% of companies report no material earnings contribution from gen AI; about 90% of function-specific use cases stuck in pilot | Analyst (S) | https://www.mckinsey.com/capabilities/quantumblack/our-insights/seizing-the-agentic-ai-advantage (2025-06) |
| MIT Project NANDA, "The GenAI Divide" | 95% of organisations getting zero measurable return; budgets favour visible front-office functions over higher-ROI back office; external partnerships about twice as successful as internal builds. Interview-based; methodology has been criticised | Analyst (S) | https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/ (2025-08-18) |
| Ardent Partners AP Metrics That Matter 2025 (via secondary sources) | Best-in-class AP about $2.78 per invoice and 3.1 days; all-company average reported variously as $9.40, $10.89 or $12.88 and 9.2 to 17.4 days; exception rate about 9% best-in-class versus 22% others. Cross-industry, not property management | Analyst (S, secondary sources disagree) | https://www.wexinc.com/resources/blog/what-does-it-cost-to-process-an-invoice-ap-benchmarks-every-finance-team-should-know/ ; https://tipalti.com/resources/learn/cost-per-invoice/ (2025) |
| APQC (via secondary) | Median monthly close about 6 calendar days; top quartile 4.8 or fewer; bottom quartile 10 or more. Older data, cross-industry | Analyst (S) | https://www.cfo.com/news/metric-of-the-month-cycle-time-for-monthly-close/ (2018 data) |
| MIT/Stanford study | AI associated with monthly close 7.5 days faster, at accounting firms (not real estate) | Academic via press (S) | https://finance.yahoo.com/news/ai-cuts-monthly-financial-close-145916388.html (date not confirmed) |
| NAA (via trade press) | A 225-unit property with 40% turnover spends over $160,000 a year on turns; another piece cites about $4,000 per move-out | Industry body via trade press (S) | https://www.multihousingnews.com/for-operators-resident-retention-is-an-noi-strategy/ (2025-2026) |
| NAA best practice / RealPage | Traditional staffing rule of roughly one office and one maintenance employee per 100 units; NAA's income and expense survey has shown about one FTE per 45 units | Industry body (S) | https://www.naahq.org/sites/default/files/naa_bestpractices_satffing.pdf ; https://realpage.com/blog/cut-costs-not-quality (dates not confirmed) |
| 20for20 via NAA | Since 2013 the average NMHC Top 50 manager grew nearly 80% while the average Top 50 owner shrank almost 15%; five of 14 managers offer centralized services to every client | Analyst (F) | https://naahq.org/news/centralization-harder-third-party-managers-some-are-doing-it-anyway (2025-09-25) |
| HappyCo-commissioned survey | 82% want a human first for urgent maintenance; residents with human support 11 points more likely to renew | Vendor-commissioned (F) | https://www.multifamilyexecutive.com/technology/happyco-study-reveals-where-ai-helps-and-falls-short-maintenance (2025-12-11) |
| Propmodo review of lead-conversion research | Most widely repeated leasing statistics (50% of calls unanswered, 2.5 days to respond to a missed call, conversion decay after an hour) have no named primary source | Trade press (F) | https://propmodo.com/what-the-research-on-lead-conversion-tells-us-about-ais-role-in-leasing/ (2026-08-12) |

### 3.5 Where the evidence is thin (stated explicitly)

- **Owners pillar**: no published operator results for AI owner reporting, portfolio Q&A, owner alerts or owner-churn scoring in third-party multifamily management. Value here must be argued from first principles and proven in a pilot.
- **Regional-manager copilot and exception-based management**: no quantified results found.
- **Takeover and offboarding**: no AI results found.
- **Affordable compliance**: qualitative only.
- **Maintenance**: one vendor case; operators themselves describe it as early.
- **Renewal lift from prediction**: vendor claims of about 3 points; one counter-signal that AI-first service correlates with lower renewal.
- **Staffing ratios at third-party managers**: no audited before-and-after figures found.
- **Back-office AP and close**: benchmarks are cross-industry, and the secondary sources for Ardent disagree with each other.

---

## 4. Reference architecture: intelligence layer over systems of record

### 4.1 The pattern (design recommendation)

```
 Role-based experiences
   Resident channels | Site and pod workbench | Regional copilot | Back-office queues | Owner portal
        |                    |                       |                    |                 |
 --------------------------- Approval inbox and action log (shared) ---------------------------
        |
 Agent orchestration
   Workflow engine (durable, resumable) -> agents with narrow tool sets -> policy engine
   (autonomy tiers, spend and comms limits, owner-specific rules from PMAs) -> evaluation harness
        |
 Knowledge and semantics
   Canonical data model / property graph  |  Governed metric layer (one definition per KPI)
   Document index (leases, PMAs, SOPs, invoices) with citations  |  Entity resolution
        |
 Event stream and operational store
   Change events from every source, normalised; replayable; freshness tracked per source
        |
 Connectors (read)                               Write-back adapters (governed)
   Vendor APIs, scheduled exports and reports,     Sanctioned PMS APIs where available, vendor
   webhooks, email and document ingestion          load files, queued human-executed tasks
        |                                                   |
 Systems of record: PMS and GL (Yardi, RealPage, Entrata ...), CRM, conversational AI,
 maintenance, screening, payments, AP, HRIS, reputation, utilities, document stores
```

Components and the choices that matter:

1. **Connectors and sync.** Expect a mix per PMS: partner APIs, scheduled report exports, and files. Record freshness per object and show it in the UI; an answer based on last night's extract should say so.
2. **Canonical model or property graph.** Core entities: Owner client, Ownership entity, Fund, Property, Building, Unit (and Bed for student), Lease, Household, Resident, Guarantor, Prospect, Application, Charge, Payment, Ledger, Work order, Asset, Inspection, Turn, Vendor, Invoice, PO, GL account, Budget line, Journal entry, Employee, Position, Task, Conversation, Review, PMA (with staffing, approval and reporting terms), Compliance programme and Certification. Keep the source system's identifier and a mapping on every record. Map each owner's chart of accounts to a standard chart; this is where most finance automation fails (see lessons).
3. **Governed metric layer.** One definition per KPI (occupancy, exposure, delinquency, trade-out, NOI), versioned, with owner-specific variants where PMAs differ. Agents call metrics; they do not write ad hoc SQL against raw tables for anything that will be shown as a number.
4. **Event stream.** Every change becomes an event (lease signed, invoice received, work order reopened, variance threshold crossed). Agents subscribe to events, which is what makes exception-based management possible.
5. **Agent orchestration with tools.** Prefer deterministic workflows with model calls at defined steps, and reserve open-ended agents for investigation tasks. Give each agent the smallest tool set that does the job. Run long processes (a takeover, a recert, a month-end close) on a durable workflow engine so they survive restarts and wait for humans.
6. **Human-in-the-loop approvals.** Three autonomy tiers: (a) inform and draft, (b) act within policy and report, (c) act only on approval. Tier assignment is per action type, per owner, and can be raised as measured accuracy earns it. Approvals arrive in one inbox with the evidence, the proposed action and the consequence of each option.
7. **Audit trail.** Every agent action stores inputs, retrieved sources, model and prompt version, output, approver and resulting write. It must be exportable per owner, because owners and their auditors will ask.
8. **Role-based UI and entitlements.** Row-level security by owner entity is non-negotiable; a manager serves competing owners. Pricing-related features need hard partitioning (see O6).
9. **Write-back.** Treat write-back as the scarce resource. Rank every use case by what it needs to write. Where no sanctioned API exists, generate a vendor-format load file or a pre-filled task for a human to execute in the PMS, and record it. Do not automate the PMS user interface without the vendor's agreement; the October 2026 RealPage action against EliseAI was about exactly this kind of scope question.
10. **Evaluation and monitoring.** A test set per use case (for example 200 labelled invoices, 100 lease files, 50 months of known variances), run on every prompt, model or schema change. Track accuracy, override rate and time saved in production.

### 4.2 Evidence on the pattern and its constraints (sourced)

- **PMS access is partner-gated.** Yardi's interface programme provides API access tied to an approved interface; some standard interfaces are read-only and others, such as maintenance, permit creating and updating work orders; its RentCafe API terms allow termination without cause on 30 days' notice [Vendor terms, (S)] https://resources.yardi.com/?p=18614. A third-party review describes the API as SOAP/XML with no documentation access before partner approval [Vendor review with a commercial interest, (S)] https://supergood.ai/api-report-card/yardi-systems. RealPage says it has roughly 800 integrated applications and nearly one billion API transactions a month, and vets and certifies third-party applications [Vendor via trade press, 2026-10-13, (F)] https://www.multifamilydive.com/news/front-office-artificial-intelligence-property-management-system/832898/.
- **The data belongs to the customer, but the access path belongs to the vendor.** RealPage's CEO: "It is the customer's data", while pausing a partner's new activations [Trade press, 2026-10-12, (F)] https://www.multifamilydive.com/news/elise-realpage-multifamily-artificial-intelligence/832762/. An operator-side advantage follows: a manager integrating its own data under its own licences is in a different contractual position from a third-party vendor, but this needs checking contract by contract, and for many properties the PMS licence is the owner's, not the manager's. Not verified for Asset Living.
- **"You have to have a source of truth."** Consultant Josh Siddon on the RealPage and Funnel arrangement, where RealPage data is the source of truth inside Funnel's front-office workflow [Trade press, 2026-10-13, (F)] same URL as above. This is the same pattern at vendor level: experience layer above, ledger below.
- **Shared schema over dashboards.** RealPage's CEO argues agents need a shared data schema and that integrations matter more than interfaces; he also says it is "really hard to do it as a midsized company" [Vendor executive, 2026-08-26, (F)] https://propmodo.com/?p=181320.
- **Operators run many tools.** A 2023 NMHC and RealFoundations report found operators typically use 10 to 20 solution providers [Analyst, 2023, cited secondarily, (F)] https://www.theaiconsultingnetwork.com/blog/realpage-eliseai-integration-pause-multifamily-operators-2026.

### 4.3 Analogues from other industries

| Analogue | What was layered on what | Lesson | Source |
|---|---|---|---|
| Ambient AI scribes over Epic and other EHRs | AI listens to the visit, drafts the note; the clinician reviews, edits and files it into the EHR, which remains the legal record | Draft-then-approve earns trust and adoption. Benefits concentrate among heavy users. Results are real but smaller than vendor claims: one cohort study found less time in the EHR and in notes; a longer multi-site study found about 0.5 extra visits a week and no significant difference in after-hours EHR time | [Academic, 2025-2026, (S)] https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2839929 ; https://www.eurekalert.org/news-releases/1122192 |
| Engagement layers over core banking ("hollow the core") | Digital channels and orchestration over mainframe cores, exposing core functions as APIs and moving processes out one at a time until the core is mainly a ledger | Layering is the normal path because core replacement is too risky; most banks keep the core. The failure mode is patchwork layers that never fix the underlying data and process | [Analyst and vendor, (S)] https://www.mckinsey.com/industries/financial-services/our-insights/should-us-banks-be-moving-to-next-generation-core-banking-platforms ; https://www.backbase.com/blog/what-does-it-mean-to-hollow-out-my-banks-core |
| Palantir Foundry Ontology over ERPs | A semantic object layer over source systems; users take "Actions" that are governed, can require approval, and write back to source systems through webhooks; scenarios allow what-if before any write | Model the business as objects and actions, not tables and screens. Make every write a named, permissioned, audited action. Keep the source system authoritative | [Vendor documentation, (S)] https://www.palantir.com/docs/foundry/architecture-center/ontology-system ; https://www.palantir.com/docs/foundry/ontology/why-ontology |
| Front-office platforms over the PMS in multifamily itself | Funnel runs renter workflows with RealPage as source of truth | The pattern already exists in this industry; PMS vendors will partner with layers that respect their controls and resist those that do not | [Trade press, 2026-10-13, (F)] https://www.multifamilydive.com/news/front-office-artificial-intelligence-property-management-system/832898/ |
| Klarna customer service | AI assistant took two-thirds of chats in month one; by May 2025 the CEO said cost had been "a too predominant evaluation factor", quality fell, and human agents were being added back (Klarna disputes the "reversal" framing) | Optimising an AI service layer for cost alone damages the experience that retention depends on | [Trade press, 2025-05, (S)] https://www.customerexperiencedive.com/news/klarna-reinvests-human-talent-customer-service-AI/747586/ |

### 4.4 Failure modes and mitigations

| Failure mode | Evidence | Mitigation (design recommendation) |
|---|---|---|
| **Data quality and inconsistent setup** | "Most stalled implementations fail on data conditions rather than technology": chart-of-accounts drift, lease terms trapped in documents, inconsistent property and unit setup [Analyst, 2026-10-28, (F)] https://www.eisneramper.com/insights/real-estate/ai-property-accounting-data-governance-automation-1026/. JLL cites data quality, infrastructure and change management as why maturity stays low [Analyst, 2025-10-28, (S)] https://www.jll.com/en-us/newsroom/real-estates-ai-reality-check-companies-piloting-only-achieved-all-ai-goals | Standard chart mapping per owner; data-quality score per property shown in the UI; pick one process, fix its data, then automate. Use the takeover process (B8) as the point where data gets cleaned |
| **Write-back restrictions and integration leverage** | RealPage pause on EliseAI; Funnel reportedly tied CRM access to a non-replication promise in late 2025 [Trade press and analyst blog, 2026-10, (F)] https://www.multifamilydive.com/news/elise-realpage-multifamily-artificial-intelligence/832762/ ; https://www.theaiconsultingnetwork.com/blog/realpage-eliseai-integration-pause-multifamily-operators-2026 | Design read-heavy, write-light. Sanctioned APIs only. A manual fallback for every automated write. Engage PMS vendors early as a customer. Contract terms for integration continuity and data export |
| **Change management and owner consent** | PMAs fix staffing to properties; owners decide one property at a time; BH ran centralization at cost for nearly a year [Analyst, 2025-09-25, (F)] https://naahq.org/news/centralization-harder-third-party-managers-some-are-doing-it-anyway | Start with functions the manager already controls (regional management, corporate back office, owner reporting). Encode per-owner permissions in the policy engine. Price centralized services explicitly |
| **Hallucination in financial reporting** | Deloitte Australia partially refunded a A$440,000 government report containing fabricated references and a made-up court quote; a GPT-4o tool chain was disclosed afterward [Trade press, 2025-10-07, (S)] https://fortune.com/2025/10/07/deloitte-ai-australia-government-report-hallucinations-technology-290000-refund/ | The model never produces a number. Figures come from the metric layer; the model writes sentences around values it is handed and cites transactions. Automated check that every number in the text equals a governed value. Mandatory accountant sign-off. Label drafts |
| **Liability for what the agent says** | A tribunal held Air Canada liable for its chatbot's wrong advice and rejected the argument that the bot was a separate entity [Tribunal decision via ABA, 2024-02-14, (S)] https://www.americanbar.org/groups/business_law/resources/business-law-today/2024-february/bc-tribunal-confirms-companies-remain-liable-information-provided-ai-chatbot/ | Resident-facing agents answer from approved policy and ledger data only, quote rather than paraphrase on fees and legal terms, and escalate when unsure |
| **Fair housing and consumer-protection exposure** | HUD guidance on AI in screening and advertising [Regulatory, 2024-05, (S)] https://archives.hud.gov/news/2024/pr24-098.cfm. FCC ruled AI-generated voices are "artificial" under the TCPA, so consent rules apply to AI voice calls [Regulatory, 2024-02-08, (S)] https://www.fcc.gov/document/fcc-makes-ai-generated-voices-robocalls-illegal | No agent decisions on applicants. Consistent-treatment testing across protected classes. Consent capture before outbound AI voice or text. Counsel review. Current status of the 2024 HUD guidance should be re-checked |
| **Algorithmic pricing liability** | DOJ and RealPage settlement; state laws (section 2, O6) | Owner-level partitioning, public data only beyond the owner's own, human decision recorded |
| **Trust and service quality** | 82% want a human first in urgent maintenance; AI-primary properties show lower renewal intent [Vendor-commissioned, 2025-12-11, (F)] https://www.multifamilyexecutive.com/technology/happyco-study-reveals-where-ai-helps-and-falls-short-maintenance. Klarna (above) | Always-available human path. Measure retention and satisfaction, not only containment. Show staff the agent's reasoning and let them correct it |
| **Pilot purgatory** | JLL: 5% achieved all goals. McKinsey: about 90% of function-specific use cases stuck in pilot [Analyst, 2025, (S)] https://www.mckinsey.com/capabilities/quantumblack/our-insights/seizing-the-agentic-ai-advantage | Fewer, deeper use cases with a named owner and a baseline measured before launch |
| **Incentive mismatch** | Savings accrue to owners; managers fund the technology [Trade press, 2026-08-26, (F)] https://propmodo.com/?p=181320 | Build the ROI case on the manager's own P&L first (section 5.2) |

---

## 5. Metrics framework

Everything in this section is my proposed framework unless a URL is attached.

### 5.1 Definitions

**Manager-to-door ratio.** One number hides too much; report a family, always stating numerator and denominator.

| Metric | Definition | Notes |
|---|---|---|
| Doors per site FTE | Managed units / on-site FTE (office and maintenance separately and combined) | Site payroll is normally an owner-paid pass-through. Convert beds to unit equivalents for student and disclose the rule |
| Doors per regional manager | Managed units / regional (multi-site) managers; also properties per regional manager | Usually manager-borne cost; the cleanest "manager-to-door" measure for the copilot |
| Doors per corporate FTE | Managed units / corporate and shared-service FTE (accounting, compliance, HR, IT, marketing, client services) | Split by function, e.g. properties per property accountant |
| Doors per total FTE | Managed units / all FTE | Derived public data point: about 450,000 units and about 13,000 associates implies roughly 35 units per associate at Asset Living (my arithmetic from figures on a vendor page) https://eliseai.com/customer-stories/how-asset-living-revamped-lead-nurturing-and-delinquency-management-with-eliseai. Compare the traditional rule of about one office and one maintenance employee per 100 units (section 3.4) |
| Mix-adjusted doors per FTE | Each of the above, weighted by vertical and property size | Student, affordable and small properties need more labour per door; unadjusted comparisons mislead |

Rules: use average units under management in the period; count FTE not headcount; include contract and offshore labour as FTE equivalents; report open positions separately so vacancies do not masquerade as efficiency.

**Revenue per door (the manager's revenue, not the property's).**

- Fee revenue per door = (base management fees + incentive fees) / average managed units.
- Total revenue per door = fee revenue + ancillary and service revenue retained by the manager (centralized-service fees, construction and renovation management, technology fees, other programmes) / average managed units.
- Contribution per door = total revenue per door minus manager-borne cost to serve per door (regional, corporate and shared-service labour, technology, unreimbursed costs).
- Report by owner, vertical and vintage of the contract. Contribution per door by client is the number that tells you which relationships to defend.

**Owner churn.**

- Unit-weighted gross churn = units lost in period / units managed at start of period.
- Split every loss by cause: (a) asset sold and the buyer changed manager, (b) owner moved the asset to another manager or in-house with no sale, (c) manager resigned the account. Only (b) and part of (a) are controllable service churn.
- Logo churn = owner clients lost entirely / clients at start. Also track partial churn (owner removes some assets).
- Net unit retention = (start units − lost units + units added by existing clients) / start units. Above 100% means existing owners are growing with you.
- Leading indicators (inputs to W4): report timeliness and corrections, owner response-time SLA, variance to budget and to the owner's underwriting, site vacancy and staff turnover, escalations, audit findings.

**Resident retention.**

- Renewal rate = leases renewed / leases expiring in period (state whether month-to-month counts as renewed).
- Turnover rate = move-outs / average occupied units, annualised.
- Controllable move-out share = move-outs for reasons the operator can influence (service, price, condition) / all move-outs; requires reason coding.
- Student: same-bed and same-property renewal rate per academic year, plus pre-lease pace versus prior year.
- Affordable: retention is typically higher; track on-time recertification and compliance-driven move-outs instead.
- Guardrail metrics alongside: resident satisfaction, review rating, complaint rate.

**Capacity released.**

- Hours released = Σ over tasks (baseline minutes per task − assisted minutes per task) × volume. Baseline by time study or system timestamps before launch, not by survey.
- Convert to FTE equivalents at productive hours per FTE (state the number used).
- Then classify what happened to it, because released is not realised:
  - **Banked**: positions not backfilled, overtime or contractor spend reduced.
  - **Absorbed**: units added without adding roles (growth capacity).
  - **Redeployed**: time moved to named higher-value work, with an outcome metric.
  - **Unrealised**: none of the above. Report it honestly.
- An accounting-firm observation supports reporting it this way: returns "show up as team capacity, not headcount reduction" [Analyst, 2026-10-28, (F)] https://www.eisneramper.com/insights/real-estate/ai-property-accounting-data-governance-automation-1026/.

### 5.2 Illustrative ROI model structure

**Every input below is an assumption for illustration, not a fact about Asset Living or any operator.** Replace each with actuals. The structure matters more than the numbers.

The model has two ledgers, because a third-party manager's benefits and its owners' benefits are different money.

**Assumptions (all illustrative)**

| ID | Assumption | Value | Basis |
|---|---|---|---|
| A1 | Managed units | 450,000 | Round figure of the order publicly cited for Asset Living |
| A2 | Average effective rent per unit per month | $1,450 | Assumption |
| A3 | Base management fee as % of collected revenue | 2.75% | Assumption; not verified |
| A4 | Gross unit churn per year | 12% | Assumption |
| A5 | Share of churn that is controllable | 35% | Assumption |
| A6 | Manager-borne FTE (regional, corporate, shared services) | 1,000 | Assumption (1 per 450 units) |
| A7 | Loaded cost per manager-borne FTE | $95,000 | Assumption |
| A8 | Owner-paid site payroll per unit per year | $1,500 | Assumption |
| A9 | Share of units whose owners permit operating-model change | 30% | Assumption |
| A10 | Cost per unit turn | $4,000 | Order of magnitude cited in trade press (section 3.4) |
| A11 | Platform cost per year, build and run | $20M | Placeholder |

**Derived base figures**

- Gross potential rent = A1 × A2 × 12 = 450,000 × $1,450 × 12 = $7.83B.
- Base fee revenue = $7.83B × 2.75% = about $215M, or about $478 per door per year (ignores vacancy and collection loss; refine with actuals).
- Manager-borne labour = A6 × A7 = $95M.
- Owner-paid site payroll = A1 × A8 = $675M.

**Ledger 1: manager P&L**

| Lever | Formula | Illustrative scenario | Result |
|---|---|---|---|
| Owner churn avoided | A1 × A4 × A5 × relative reduction × fee per door | Controllable churn cut by 20% | 450,000 × 12% × 35% × 20% = 3,780 units; × $478 = about $1.8M a year, recurring and cumulative, plus avoided offboarding and replacement sales cost |
| Capacity released in manager-borne roles | A6 × A7 × share of time released × share realised | 20% released, half realised | $95M × 20% × 50% = $9.5M |
| Growth absorbed without added overhead | New units × manager-borne cost per door avoided | 40,000 units added with half the usual overhead | Cost per door = $95M / 450,000 = $211; 40,000 × $211 × 50% = $4.2M |
| Fee uplift from owner revenue gains | Owner revenue gain × A3 | See ledger 2 | $62M × 2.75% = about $1.7M |
| Centralized and technology service fees | Units opted in × fee per unit per month × 12 | 30% of units at $4 a month | 135,000 × $48 = $6.5M (requires owner agreement and PMA changes) |
| Win-rate effect | Additional units won × contribution per door | Not modelled; no evidence base | — |
| Less platform cost | A11 | | ($20M) |

Illustrative manager total before platform cost: about $23.7M; after: about $3.7M in this scenario. The point of showing this honestly: on a manager's own P&L the case is tight unless capacity is actually realised, growth is actually absorbed, or owners pay for the service. The sensitivity that matters most is the share of released capacity that is realised.

**Ledger 2: owner NOI (the value the manager can show clients)**

| Lever | Formula | Illustrative scenario | Result |
|---|---|---|---|
| Site payroll efficiency | A1 × A9 × A8 × % reduction | 10% on permitted units (for scale: EQR reported 15% on its owned portfolio, section 3.1) | 135,000 × $1,500 × 10% = $20M |
| Delinquency and bad debt | GPR × bps improvement | 30 bps (vendor case studies claim 20 to 60 bps, section 3.3) | $7.83B × 0.30% = $23.5M |
| Occupancy | GPR × bps improvement | 50 bps | $7.83B × 0.50% = $39M |
| Turnover avoided | A1 × point reduction in turnover × A10 | 2 points | 9,000 turns × $4,000 = $36M |
| Total owner NOI effect | Sum | | about $119M, or about $264 per unit per year |

Revenue-type gains used for the fee uplift above: delinquency plus occupancy = about $62M. For comparison only, EliseAI's own benchmark claims $380 per unit per year for operators centralizing leasing and admin (vendor, no control group; section 3.3). Do not present ledger 2 as incremental to results clients already attribute to tools they have bought.

**How to use the model**

1. Measure baselines before any launch (time studies, ratio family, churn by cause).
2. Run ledger 1 and ledger 2 separately; never add them.
3. Show three cases (conservative, base, stretch) and the single-variable sensitivities for A5, A9, realised-capacity share and platform cost.
4. Attribute carefully: compare treated and untreated properties or regions over the same period where possible; year-over-year alone will credit the platform with market moves.

---

## 6. Demo guidance

### 6.1 Reasoning (mine)

- The audience is executives of a third-party manager. Their own P&L moves with owner retention, growth capacity and manager-borne labour, not with site payroll (section 1).
- They already bought resident-facing AI. A leasing chatbot demo invites "we have that".
- The PMS vendors are all announcing agents inside one PMS. The gap none of them fills is the manager's cross-owner, cross-PMS view and the owner relationship.
- Synthetic data is easiest to make convincing for financial and portfolio views, and hardest for anything that needs real voice or SMS traffic or real PMS write-back.
- The weakest public evidence is in the Owners pillar. A demo there is the most novel but must carry its own proof: traceable numbers and visible controls.

### 6.2 Ranked top five

Scores are 1 to 5, my judgement.

| Rank | Use case | Business impact | Wow | Feasible with synthetic data | Owner-churn tie | Capacity tie |
|---|---|---|---|---|---|---|
| 1 | Owner reporting with narrative variance, plus portfolio Q&A (W1, W2, B3) | 5 | 5 | 5 | 5 | 4 |
| 2 | Regional manager portfolio copilot, exception-based (O5) | 5 | 5 | 4 | 4 | 5 |
| 3 | Owner-health and churn-risk radar (W4, W3) | 5 | 4 | 4 | 5 | 2 |
| 4 | Property takeover and onboarding agent (B8, B4) | 4 | 4 | 4 | 3 | 5 |
| 5 | Resident retention radar with proactive intervention (R6, R8) | 4 | 4 | 4 | 3 | 3 |

**1. Owner reporting and portfolio Q&A.** Recommended single-module demo.

Why: it is the artefact owners judge the manager by every month, it consumes skilled labour across accounting and regional management, it needs read access only, and it shows the whole architecture in one flow (multi-PMS data, governed metrics, agent, approval, audit, owner portal). It is the natural home for the "PMS becomes plumbing" claim, because the owner sees one consistent report regardless of which PMS each property runs on.

A convincing demo shows:
- A synthetic client with 12 to 20 properties across at least two PMS back ends and two verticals, with one standardised chart of accounts and visible source labels.
- Month-end arrives; the package is assembled in the owner's own template in under a minute.
- A variance paragraph such as repairs and maintenance over budget, where each number is clickable down to the invoices and work orders behind it, and the narrative names the cause (for example three HVAC replacements in one building).
- The agent asking the property manager one targeted question it could not answer from data, and incorporating the reply.
- The approval step: accountant and regional manager edit and approve; the audit log records who changed what.
- A deliberate trap: ask the Q&A something the data cannot support and show it declining, and show the automatic check that every number in the narrative equals a governed metric.
- The owner's side: the asset manager asks "which of my properties are behind on renewals and what are you doing about it?" and gets figures plus the manager's action log.
- Close with the measured before and after: hours per package and days after month end. Use the client's real baseline if they will share it; otherwise label the comparison as illustrative.

**2. Regional manager portfolio copilot.**

Why: the clearest expression of "manager-to-door" at the layer the manager pays for. Risk: without real data, the ranking of exceptions can look arbitrary.

A convincing demo shows:
- A Monday-morning brief for one regional manager over 10 to 12 properties: five ranked exceptions, each with the evidence, the likely cause, peer comparison and a drafted action.
- One exception worked end to end, for example exposure rising at a property because turns are slipping because a vendor lapsed its COI; the copilot proposes reassigning the turn vendor and drafts the note to the site manager and the heads-up to the owner.
- Approve with one click; show the task landing in the site team's queue and, for a PMS write, the sanctioned path (API call or generated load file or human task), not a pretend magic write.
- What it did not surface and why (everything within tolerance), and how thresholds differ by owner.
- The ratio story: properties per regional manager today versus what the time released would support, labelled as a scenario.

**3. Owner-health and churn-risk radar.**

Why: the only use case that addresses owner churn directly, and executives have nothing like it. Risk: the score can look invented, since there is no published evidence base and churn labels are sparse.

A convincing demo shows:
- The client book ranked by revenue at risk, with unit-weighted exposure and contract dates.
- For one at-risk client, transparent drivers rather than a black-box score: two late reports, a restated financial, a property 400 bps under budgeted occupancy, an unfilled manager role for 60 days, slow replies to the asset manager.
- A drafted save plan with owners, dates and the commitments tracked afterward.
- Honest framing: this is a rules-plus-signals model to be calibrated on the company's own loss history, and losses from asset sales are separated from service losses.
- Best shown as the second act of demo 1, not alone.

**4. Property takeover and onboarding agent.**

Why: specific to third-party management, central to scaling by acquisition of contracts, labour-intensive, and the first 90 days set the tone of an owner relationship. Risk: less visual, and write-back to the PMS is the hard part in real life.

A convincing demo shows:
- A messy inbound package from an outgoing manager: a rent roll in Excel, ledgers as PDF, a folder of scanned leases, a trial balance in a different chart of accounts.
- The agent mapping it to the canonical model and producing a discrepancy list: rent on the roll that differs from the lease, security deposits that do not tie to the liability account, concessions with no addendum, missing guarantor documents.
- Generated load files for the target PMS, held for human sign-off, with opening balances reconciled.
- The takeover checklist with resident and vendor notices drafted, and a countdown to first rent run.
- A measured contrast of person-days, labelled illustrative unless the client supplies its own figure.

**5. Resident retention radar with proactive intervention.**

Why: addresses resident churn and shows signal fusion across systems that a single point tool cannot do. Risk: overlaps with tools already purchased; position it as orchestration above them. Prediction accuracy cannot be proven in a demo.

A convincing demo shows:
- A property view of leases expiring in 120 days, ranked by risk, each with reasons drawn from different systems: two reopened work orders, a negative survey, a late-payment pattern, a rent increase above the resident's history.
- A proposed intervention per resident: service recovery first, then a renewal conversation by a human; the offer itself comes from the approved pricing matrix and is a human decision.
- The human path kept visible, citing the finding that residents with access to human support were 11 points more likely to renew (section 3.4).
- Student variant: the same view by bed, with parent contact and pre-lease pace against prior year.

### 6.3 Not recommended as the lead demo

- **AI leasing and resident chat (R1, R4, R7)**: already bought; commoditised; three PMS vendors and several specialists demo it constantly.
- **Pricing recommendations (O6)**: legal exposure invites objections that derail the session.
- **Affordable recertification (O7)**: high pain and visually strong, but error consequences are severe and evidence is thin. Good second-phase candidate with a compliance expert in the room.
- **AP and month-end close (B1, B2)**: valuable, but unexciting to watch, and PMS-native tools already claim it.

### 6.4 Demo credibility rules (design recommendations)

1. Label synthetic data as synthetic. Never show a real owner's or resident's name.
2. Show two PMS sources behind one view; that is the thesis.
3. Show a refusal and a correction, not only successes.
4. Show the approval and the audit log every time something leaves the building or writes to a system.
5. Show freshness ("data as of") on every number.
6. Do not show an autonomous write into a PMS that could not be done through a sanctioned path today.
7. Quote evidence with its label. Say "vendor-claimed" out loud where it is.
8. End on the metric the audience owns: properties per regional manager, hours per owner package, unit-weighted owner retention.

---

## 7. Gaps / unverified

**Not verified or not found**

1. How many PMS platforms Asset Living runs across its client base, and whether the PMS licences are held by the manager or by owners. The multi-PMS premise is assumed.
2. Asset Living's management fee rates, margins, owner churn, staffing ratios by role, report cycle times and close calendar. None are public as far as I found. The "about 35 units per associate" figure is my arithmetic from numbers on a vendor page.
3. Any published operator result for AI owner reporting, portfolio Q&A, owner-churn scoring, a regional-manager copilot, or AI-assisted property takeovers in third-party multifamily. I found none.
4. Quantified AI results in LIHTC or HUD compliance, student-housing guarantor handling or roommate matching, vendor COI compliance baselines, and utility-billing recovery. Only qualitative or vendor material.
5. Centralization or AI disclosures from MAA, Camden and Essex. Searches returned nothing usable.
6. The original Ardent Partners 2025 report and current APQC close benchmarks. Secondary sources disagree on the Ardent averages ($9.40, $10.89, $12.88); APQC data is members-only and the public figures date from 2018.
7. The primary sources for commonly repeated leasing statistics (about 50% of calls unanswered, 2.5 days to respond). Propmodo's own review cites no source for them; the only sourced figure is a vendor secret-shop study.
8. Current list, scope and effective dates of state and city laws on algorithmic rent-setting, and whether the DOJ and RealPage settlement has received final court approval. I confirmed only that New York and California acted and that RealPage is litigating the New York law, via law-firm commentary.
9. Current status of HUD's May 2024 AI guidance under the present administration.
10. Whether any PMS vendor supports open agent protocols (for example MCP) for third-party agents. No confirmation found.
11. Exact wording and scope of UDR's $3.5M NOI and turnover figures, EQR's Q2 2025 application-time statement, Bozzuto's 32-hour figure, and the KETTLER 86% figure. These came from search summaries; the underlying pages were not opened or returned errors.
12. The Sacra and Thesis Driven analyses of the "operating layer" contest are paywalled; I could not read them. Thesis Driven is credited by Multifamily Dive with first reporting RealPage's customer letter.

**Pages that could not be fetched (403 or 404)**: Yardi's 2026-06-15 press release, Entrata's March 2026 press release (both Entrata's site and GlobeNewswire), Multi-Housing News' centralization feature, CoStar's centralization article.

**Conflicts noted**

- EliseAI's Asset Living page gives both 72 and 78.2 monthly hours of capacity, and both 445,000+ and 450,000+ units.
- AvalonBay's $80M target: a third-party tracker says "by end of 2025", which conflicts with company statements (about 60% achieved at end of 2025, $7M more in 2026, $80M a later-horizon target).
- AppFolio's hours-saved figure appears as 12.5, 10 and 9.1 hours a week in different AppFolio materials.
- Onsite staff turnover is reported as 29.2% in one survey and 33 to 45% in secondary sources.

**Method limits**

- Most multifamily AI results are vendor-published with no control group, no stated sample selection and no independent audit. Operator statements were frequently made at vendor-hosted events.
- REIT results come from owner-operators with dense, self-controlled portfolios and should be discounted for a fee manager that needs owner consent.
- Build-difficulty and demo-ability ratings, the architecture, the metric definitions, the ROI assumptions and the demo ranking are my judgement and are not sourced.

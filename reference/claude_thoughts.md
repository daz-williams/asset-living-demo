# Claude's thoughts on the brief

Written 2026-11-21 after reading the brief (`Asset Living - VP Biz Ops AI Enablement - Build Exercise_updated 3.docx`) and profiling every sheet of the data pack. Figures below were computed from the data pack; anything marked *(my estimate)* or *(my reading)* is not.

## 1. What the exercise is really testing

The role is **VP, Business Operations & AI Enablement**. The brief says the job is to "take a real business problem, build something that works against real data, and put it in front of the people who will use it in days, not quarters". The exercise is a sample of that job, so the build is judged as much on operating judgment as on software.

- **The panel is Asset Living plus New Mountain Capital.** That confirms the ownership change the research could only report as unconfirmed. A private-equity owner will listen for manager-level margin, speed of absorbing new doors, and owner retention.
- **The six scoring dimensions** are business relevance, it works, judgment about scope, analytical rigor, ambition/creativity/energy, and candor. Two of the six (rigor and candor) are about honesty with messy data, so what the tool refuses to do matters as much as what it does.
- **"A user could act on it Monday morning"** is the bar. The output should be a worklist, a drafted email or a load file — something to act on, not a dashboard to admire.
- **No deck, no memo.** The deliverables are a 5–10 minute narrated video, access to the build with a short README, and optionally transcripts or a build log.
- **They will not install anything.** It only has to run on your machine, live, over screen share. That removes most of the deployment work.
- **"Ambition counts, and so does choosing the right problem."** Scenario choice is itself scored, and the demo questions start with "why you picked this scenario".

## 2. Things in the brief that are easy to miss

- **The date is pinned.** The data is "as of Friday, October 16, 2026". The prototype should treat that as today; the real calendar date would make every deadline look blown.
- **Scenario B has a wording mismatch.** The brief says "business day 6 of the September close"; the README says "business day 6 of the October close calendar". Both mean the September books being closed in October, but it is worth stating as an assumption.
- **Scenario A's rent roll covers 3 of the 9 properties.** The other six have not arrived. With 46 days to takeover that is a finding, not a gap in the pack.
- **The brief has unfilled placeholders** ("[one week, including a weekend]", "[Agilyti contact]"). The return date needs confirming with the recruiter.
- **The demo questions are a checklist for the build:** what surprised you in the data, what doesn't work yet, what you'd do with another week, how you'd hand it to the technology team, how you'd know anyone is using it, and what you chose not to build. Usage telemetry and a "not built" list should be designed in from the start.

## 3. What I found in the data

### Scenario A — Property Transitions

**A1 Rent roll (255 rows, 3 properties)**
- **Three formats in one export.** Each property writes units, statuses, dates and money differently: `1101` / `Apt 1101` / `#1101`; `Occupied` / `Occ` / `O` and `VR` / `VNR`; US dates, ISO dates and true date cells; Cedar Crossing stores every dollar value as text like `$1,865.00`.
- **3 units appear twice with two different residents** (Cedar Crossing Apt 3203, Pinehurst #3102 and #3202). In one pair the rent differs ($1,576 vs $729.40); in another one row carries a $3,654.87 balance and the other $0.
- **5 occupied units have no resident name.**
- **4 leases end before they start.**
- **6 leases are at roughly half of market rent.** One is annotated "Staff unit?"; the rest are unexplained (employee units, concessions or errors).
- **129 of 237 occupied units (54%) have a lease end date already past** on October 16. They are either month-to-month or the export is stale; either way it changes renewal workload and revenue risk on day one.
- **5 units on "Notice" carry no resident or lease data at all**, so the move-out dates are unknown.
- **$73,207 of resident balances across 61 units**, with four Willow Bend units above $6,500 each. Inherited delinquency should be agreed with the owner before takeover.
- **Deposits are inconsistent:** 64 units hold a deposit equal to a full month's market rent, the rest a flat $250–$500. The deposit liability must reconcile to the bank transfer.

**A2 Transition checklist (126 tasks: 14 per property × 9)**
- **Nothing is overdue yet.** Every due date falls between November 1 and November 30, so the risk is entirely forward-looking. A tool that only reports overdue items would show an all-clear.
- **Status:** 70 not started, 26 in progress, 26 complete, 4 blocked. 90 of 126 are on the critical path.
- **The 4 blocked tasks have not been touched for 10–16 days** and all wait on outside parties (prior manager, carrier, owner signatory).
- **4 tasks have no owner**, two of them critical: migrating resident ledgers at Pinehurst and opening bank accounts at Mission Trails.
- **Bank accounts are due November 1** at all nine properties: 6 not started, 1 in progress, 1 complete, and 1 blocked on an owner signatory who is out of office. The vendor contract review is due the same day at all nine.
- **A cross-sheet contradiction:** the Elm Street vendor task is blocked because the "prior manager hasn't sent contracts; see vendor tab", yet the vendor tab lists seven Elm Street contracts.

**A3 Vendor contracts (49 contracts, $92,905 a month)**
- **6 auto-renewing contracts have already passed their notice deadline** (VC-5002, 5011, 5013, 5023, 5026, 5032). Together they are $10,178 a month that may now be locked in for another term.
- **3 certificates of insurance expired in June 2026** and the vendors are still on site.
- **24 of 49 contracts are not assignable** to a new manager, so each needs a new agreement or a replacement vendor before December 1.
- **Several terms end before takeover with no auto-renew**, including elevator maintenance at two properties and fire/life safety at one. Those are safety and compliance gaps on day one.
- **Duplicate services with outlier prices:** Elm Street has two landscapers ($2,900 and $3,100); Lakeline Vista has two pool contracts with the same vendor at $2,900 and $3,100, against $620–$1,270 everywhere else. These four are the last four contract IDs and look appended.

### Scenario B — Month-End Close

**B2 AP invoices (437 lines, $2.21M; 29 pending worth $254K)**
- **7 duplicate pairs worth $56,019.** Four share an invoice number exactly; three more match on vendor, property, amount and date but one copy drops the `INV-` prefix. The largest is a $43,218.63 roofing invoice approved twice by two different coders.
- **4 approved invoices ($5,678) are for two properties off-boarded on August 31**, dated September.
- **58 invoices exceed $10,000.** Policy requires Regional Manager approval, but the register has no field showing who approved, so 50 "Approved" lines cannot be verified. That is a control gap in the data itself.
- **7 pending invoices are 5–20 times the vendor's usual amount** (for example $35,296 for common-area cleaning against a $1,788 median). They read like keying errors or bundled work, and each is over $10,000.
- **10 lines are coded to a GL account that does not match the vendor's pattern** (gas to general repairs, landscaping to electric, an HVAC repair to capital appliances, a unit turn to capital flooring).
- **12 invoices are dated August** and 101 were received in October, which raises period and accrual questions.

**B3 Budget vs actual (266 rows: 38 properties × 7 categories)**
- **Only 6 lines breach the 10% policy threshold**, and the commentary column is empty on every row.
- **The close tracker marks variance commentary "Complete" for 29 properties, including all six that need it.** The tracker cannot be trusted as a statement of what is done.
- **AP does not reconcile to actuals.** In 63 of the 165 property-category cells that have invoices, the invoices total more than the booked actual. Pending invoices explain little of it: counting approved invoices alone, 57 cells still exceed the actual. Either the actuals are understated or the register includes items booked elsewhere, and the pack does not say which. If the seven pending outliers are real, several more lines will breach 10% once posted.
- **Some variances cannot be explained from the pack.** Payroll at Campus Edge is 31% over with no payroll detail supplied; utilities at Lantern Square are 48% under with no utility invoices at all, which suggests a missing bill, not a saving.
- **Capital spend is $1.03M of the register and has no budget rows.**

**B4 Close tracker (304 rows: 38 properties × 8 steps)**
- **36 steps are late and 9 are due today.** One accountant, J. Ramirez, holds 31 of the 36 late steps across 9 properties.
- **12 bank reconciliations are late.** That is the first step, so everything downstream on those properties is at risk for the day-8 owner report.
- **3 steps are recorded as completed on day 7 when today is day 6.**
- **Workload is uneven:** K. Brooks carries 12 properties; M. Chen carries 5.

### Scenario C — Business Development

- **The answer library contradicts current data.**

  | Library claim (last updated) | Current data |
  |---|---|
  | Portfolio occupancy 96.8% (2023) | 94.1% unit-weighted |
  | Delinquency "below 1% of GPR" (2023) | 2.45% |
  | Days to turn "7 portfolio-wide" (2024) | 11.4 |
  | Resident satisfaction 4.6 (2023) | 4.13 |

- **The DFW proof points are now the worst performers.** The library cites Sunset Ridge and Oak Hollow for "top-quartile NOI growth"; they are at −7.6% and −7.7% NOI against budget with 87.5% occupancy.
- **Snippets contradict each other:** takeovers in 30 days vs a 60-day playbook (the RFP asks for a 90-day plan); reports by business day 15 vs day 8; a 3.0% fee vs a 2.5–3.25% range.
- **Two snippets are liabilities.** One names YieldStar for revenue management, which is the product at the centre of the algorithmic-pricing litigation. Another says "every site team uses Yardi", but one Kestrel property runs RealPage.
- **Our comparable set is weak.** Asset's five DFW/Austin conventional properties were built 1985–1997; Kestrel's were built 2004–2021. Our occupancy there (91.9%) is no better than Kestrel's, and our turn time (15.7 days) is not better either. We are clearly better on delinquency (2.1% vs 4.1–5.1%) and resident satisfaction (4.2 vs 3.3–3.7).
- **The performance sheet has survivorship bias:** the two off-boarded properties are missing from it.
- **7 properties show a "managed since" date earlier than the year they were built.**
- **Question 3 asks for a market comparison and the pack contains no market data.** An honest tool has to say so.

### Across scenarios

- **Two people appear in both A and B.** K. Brooks and S. Alvarez own all 23 open accounting tasks on the transition (every one critical path, due November 1–17) and also close 18 properties between them. November's close lands in the same window. This could be a quirk of how the synthetic names were generated, but if it is deliberate it is the "people who know where the bodies are buried" capacity collision the brief hints at.

## 4. How the research bears on the brief

- **Takeovers are how Asset Living grows.** Organic unit growth was flat before the FPI absorption, and the press pattern of complaints clusters around management takeovers. Scenario A sits on the company's growth engine and its best-evidenced source of early owner and resident dissatisfaction.
- **Corporate functions are on the manager's own P&L.** Site payroll is passed through to owners, but transitions, property accounting and business development are not. All three scenarios therefore target cost the manager actually bears, which matters to New Mountain.
- **Owner reporting is the least-contested AI space**, which favours Scenario B's variance commentary. Invoice processing, however, is where PMS vendors and AP specialists already compete.
- **Nothing here needs PMS write access.** A is file-in, load-file-out; B and C are read-only. That matches the research finding that write-back is the most restricted part of every PMS.
- **Rent pricing should stay out.** Scenario C's Question 4 touches it; the answer should describe process and avoid naming a pricing algorithm.

## 5. Design principles I would hold to, whichever scenario

1. **Deterministic code does the arithmetic; the model does language.** Every number shown traces to a row in the data pack. The model never produces a figure.
2. **Say "I can't explain this" out loud.** The brief asks for it twice. Unknowns are a first-class output with the question a human needs to ask.
3. **Lead with the worklist.** Open on "what needs a human today", ranked by consequence and days remaining.
4. **Keep the human approval visible.** Drafts of emails and load files are proposed, never sent.
5. **Show the mess, then the cleaned result, then what was left alone.** That is the rigor and candor story in one screen.
6. **Stay in the Asset Living brand** using `reference/brand_guide.html`.

## 6. Open questions and assumptions

- The return deadline and the reviewer contact are placeholders in the brief.
- Whether the panel expects a hosted link. The brief says a repo or zip is fine, so I would not spend time on hosting unless it is nearly free.
- Whether to use a live model call in the demo. A live call is more convincing but can fail on screen share; caching the last good response is the safe middle.
- I assume the overlap of staff names across scenarios is meaningful. If it is an artefact, the capacity-collision idea still holds as a design point but not as a finding.

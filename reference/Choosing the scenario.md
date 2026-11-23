# Choosing the scenario

**Current recommendation (revised 2026-11-21 after the interview notes): Scenario B — Month-End Close ("Close faster, catch more").** The revision and its reasons are in the next section. The original analysis, which recommended A, is kept below it unchanged as the record of how the choice was made before the interview.

## Revision after the interview

### What the interview said

- Property accounting is a very large operation: several hundred dedicated offshore staff plus an onshore team, covering bills, payments and owner financial reports.
- Acquisitions left three PMSs (RealPage, Yardi, Entrata), each with its own accounting workflow. Much of the work is manual: translating data between systems and bank reconciliations.
- Efficiency and released capacity are the obvious benefit.
- The bigger benefit is keeping clients. Poor accounting makes owners leave faster than anything else: late financials, transactions under the wrong accounts, or a surprise true-up after an owner has taken a distribution. From the Asset Living interviews I read between the lines that a couple of percent better retention is worth millions, and cutting errors and keeping clients is worth more than cutting headcount.

### Why this moves the recommendation from A to B

1. **The buyer has named the problem.** My case for A rested on public evidence that owner churn starts at takeover, and the research itself rated owner-side evidence as thin. A first-hand statement that accounting errors lose clients fastest outranks it.
2. **The user base is larger than I assumed.** Several hundred offshore staff plus onshore confirms the "hundreds" estimate and makes B's capacity case concrete.
3. **The three failure modes listed are all visible in the data pack.**

   | What makes owners leave | What the data pack shows |
   |---|---|
   | Late financials | 36 close steps late on day 6, including 12 bank reconciliations; one accountant holds 31 of them; owner reports are due on day 8 |
   | Transactions under the wrong accounts | 10 invoices coded against the vendor's normal account, including repairs coded as capital and a unit turn coded as capital flooring |
   | Surprise true-up after a distribution | $56,019 of duplicate invoices; $5,678 billed to off-boarded properties; seven pending invoices 5–20 times the vendor norm and not yet in actuals; a utility line 48% under budget with no bills received |

4. **My two objections to B weaken.**
   - *"The variance data is thin."* Reframed around trust, an honest "cannot explain; this looks like a missing bill" is the feature, because the missing bill is next month's true-up.
   - *"Invoice review is contested."* The pitch is no longer invoice processing. It is an owner-trust check that runs before the report goes out, across whichever PMS the property sits on. Vendors' own agents stop at their system boundary.
5. **The "catch more" half of the title now leads.** Open the demo on errors caught before the owner saw them; treat hours saved as the second benefit.

### Rough size of the retention prize (my estimate)

Two percent of 446K units is about 8,900 units. At the research's estimated base fee of roughly $465–$555 per unit per year, that is about $4–5M of fee revenue a year. This uses public unit counts and an inferred fee, not Asset Living's numbers; it is only there to show that "millions" is the right order of magnitude.

### What I would build for B

In priority order, for a 2–3 day build:

1. **Pre-payment and pre-posting exception queue.** Duplicates (including the ones hidden by a dropped `INV-` prefix), invoices for off-boarded properties, amount outliers, miscoded lines, and invoices over $10,000 whose Regional Manager approval cannot be evidenced. Each item states why it was flagged and what to do.
2. **Close-slip view for the manager.** Which owner reports will miss day 8, why, and what to move today: late bank reconciliations first, the overloaded accountant, and steps marked complete that the data contradicts.
3. **Variance commentary drafter.** First drafts for the six lines over 10%, each sentence tied to invoice rows, with an explicit "cannot explain from the data" and the question to ask where that is the truth.
4. **The extra idea: a true-up risk score per owner report.** Before a report is released, list what could later reverse it: unposted pending invoices, expected bills that have not arrived, suspected duplicates and capital-versus-expense miscodes. It gives the manager a "safe to send / hold" call per property, which is the thing Asset Living said costs clients.

### Limits to be candid about

- **The pack has no PMS field and no bank data for Scenario B.** The cross-system translation and bank reconciliation pain from the interview cannot be demonstrated on real rows. I would show the design for it (one normalised invoice and ledger schema with a source-system tag) and say plainly that it is untested.
- **The interview is one person's view.** It is the best evidence available, but worth confirming that the Property Accounting Manager's daily pain matches it.
- **Invoices exceed booked actuals in 63 of 165 property-category cells** and the pack does not explain why. The tool should surface that as an open question, not resolve it.

### What carries over from A

- The finding that the two accountants owning all 23 open transition accounting tasks also close 18 properties in the same weeks. It belongs in the close-slip view as a capacity warning.
- Transitions stays the natural second module, and is worth naming under "what I'd do next".

---

## Original analysis (before the interview)

**Original recommendation: Scenario A — Property Transitions ("Day one without drama").** Scenario B is a close second and the better choice if you want the largest user base. Scenario C is the fastest to build and the weakest fit for this role and panel.

Dev time, resources, ROI and headcount figures below are my estimates unless a source is given. Data-pack figures were computed from the workbook; see `claude_thoughts.md` for the full findings.

## Ranking

| | **A — Transitions** | **B — Month-end close** | **C — RFP response** |
|---|---|---|---|
| **Overall rank** | **1** | **2** | **3** |
| Primary users | Director of Transitions, incoming regional manager | Property Accounting Manager, staff accountants | VP Business Development, proposal team |
| Demo build time (working prototype) | 2–3 focused days | 2–3 focused days | 1–1.5 focused days |
| Build difficulty | Medium: three messy inputs, mostly rules plus a little language work | Medium: rules for AP and close; commentary is limited by thin data | Low: mostly drafting, plus a claim checker |
| Resources to reach a pilot | 1–2 engineers, 6–10 weeks. File-in, load-file-out, so no PMS partner agreement is needed | 2–3 engineers, 10–16 weeks. Needs read access to ledgers and AP in each PMS | 1 engineer, 4–6 weeks. Needs a performance data feed and a content owner |
| Integration dependency | Lowest | Highest | Low |
| People directly using it at company scale | Tens (transitions team plus about 10 functional leads per takeover) | Hundreds (about 390 accountants if the pack's 7.6 properties per accountant holds across roughly 3,000 properties) | Tens (BD and proposal staff) |
| People who benefit | Every new owner, every incoming site team and every resident at takeover | Every owner, every month | BD team; indirectly the whole company through growth |
| ROI potential | High but lumpy: protects the revenue of every new contract in its first 90 days and scales with acquisition pace | High and recurring: capacity on the manager's own payroll, every month | Moderate and hard to attribute: this RFP is worth roughly $0.7M a year in fees |
| Hard dollars visible in the data pack | $10,178 a month of contracts already past their notice deadline; $73,207 of inherited resident balances; 3 expired insurance certificates | $56,019 of duplicate invoices; $5,678 billed to off-boarded properties | 4 headline claims in the library that current data contradicts |
| Fit with the company's growth story | Strongest: growth has come from takeovers and the FPI absorption | Strong: owner reporting is the owner-retention lever | Moderate: organic growth has been flat, so winning RFPs matters |
| Existing vendor competition | Little | Heavy for invoice processing; light for variance commentary | Generic AI drafting tools are everywhere |
| Chance of a "we hadn't thought of that" moment | High | Medium | Medium |
| Main risk | Small direct user base; real exports vary more than three formats | "AP is dull to watch"; only 6 variances to explain and half cannot be explained from the pack | Looks like a chatbot wrapper; our comparables are weak, so an honest tool undercuts the pitch |

## Why A

1. **It sits on the growth engine.** The research shows Asset Living's unit growth has come from absorbing other managers' portfolios, most recently about 165K units from FPI. New Mountain Capital is on the panel, and for an owner buying a roll-up, the speed and safety of absorbing new doors is the value-creation lever.
2. **It is where owner churn starts.** The press and complaint evidence clusters around management takeovers: new fees, missed renewals, unanswered residents. A contract that starts badly is the one most likely to be cancelled on 30 days' notice.
3. **It proves the platform thesis in miniature.** Taking another system's export in its own format and turning it into clean, loadable data is exactly what an intelligence layer above the PMS has to do. The same intake works whether the destination is Yardi, RealPage or Entrata.
4. **It needs no one's permission.** Files come in and load files go out. There is no dependency on PMS partner programs or write access, which the research identified as the hardest constraint.
5. **The data rewards rigor most.** Three sheets, each with planted problems, plus contradictions between them. The headline finding is forward-looking: nothing is overdue today, yet six notice deadlines have already passed and bank accounts are due in 16 days with an owner signatory out of office.
6. **The cost is the manager's own.** Transition labour is not passed through to owners, so time saved improves Asset Living's margin directly.
7. **Few vendors are here.** The research found leasing and invoice processing crowded and takeover orchestration nearly empty.

## Where A is weaker, stated plainly

- **Fewest daily users.** B touches roughly ten times as many people every month. If the panel weighs "number of people affected" most heavily, B wins.
- **Value is episodic.** It pays off per takeover, not per month.
- **Three formats is not the real world.** Production intake will meet PDFs, scanned rent rolls and dozens of export layouts. The demo should say so.

## Why not B

B has the best recurring economics and the $56K duplicate-payment find is a strong opening. Two things hold it back as a demo:

- **The data cannot support the most interesting feature.** Only 6 lines breach the 10% threshold, and for at least two of them (payroll, and a utility line with no invoices) the pack contains nothing to explain the variance. An honest commentary drafter would mostly say "cannot explain", which is the right behaviour but a thin 15 minutes.
- **Invoice review is contested ground.** PMS vendors and AP specialists already sell it, so the panel is more likely to ask "why not buy this?"

## Why not C

It is the quickest build and the stale-library findings are sharp. But it exercises the least operational understanding, the direct user base is the smallest, and a drafting tool is the easiest thing for a panel to dismiss as generic. The honest answer on comparables is also awkward: in DFW our occupancy and turn time are no better than Kestrel's current manager.

## What I would build for A

Scope for a 2–3 day build, in priority order:

1. **Rent-roll intake.** Standardise the three formats into one schema, show every change made, and hold back the rows that need a human (duplicate units, missing residents, impossible dates, half-rent leases) with the specific question to ask the prior manager. Output a clean load file plus an exceptions file.
2. **Vendor contract triage.** Sort all 49 contracts into keep, renegotiate, replace and act-now, with the deadline that drives each decision.
3. **Command centre.** One screen for the Director: what needs attention today, ranked by days remaining and consequence, with a drafted escalation email for each blocked or unowned critical task.
4. **The extra idea: a day-one risk forecast.** Because nothing is overdue yet, score each property on how likely it is to reach December 1 unready, from task dependencies, blocked items, missing rent rolls and owner workload. Include the capacity collision: the two accountants who own all 23 open transition accounting tasks are also closing 18 properties in the same weeks.

**Deliberately not built:** live PMS connections, automatic sending of emails, document reading of the contracts themselves, and anything touching rent pricing.

## If you prefer B

The build order would be AP exception queue first (duplicates, off-boarded properties, outliers, miscodes, unverifiable approvals), then the close-slip view, then variance commentary with explicit "cannot explain" outputs. I can re-scope if you choose it.

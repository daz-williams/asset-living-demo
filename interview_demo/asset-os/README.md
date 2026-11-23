# Close Assistant

**Scenario B: Month-End Close · Darren Williams**

A working prototype for the Property Accounting Manager on BD6 of the September close. It reads the data pack, finds the invoices that need a person before they're paid or posted, drafts the owner commentary, and works out close status from the evidence instead of trusting what was typed into the tracker.

The tool advises. It never pays, posts or approves anything, and it never changes the source data.

It sits inside a platform shell, "Asset Living OS", that shows where this one build fits in a bigger picture. Only the Close Assistant is built. The gray items in the menu are planned, are not linked, and are not part of this demo.

## Open it

Unzip the folder and double-click **`index.html`**.

- No install, server, database or login. It runs in the browser (Chrome, Edge, Safari or Firefox).
- The data pack is built in, so it opens straight to the Accounting Manager's morning briefing.
- It works offline. The web fonts need a connection; without one, the page falls back to standard fonts.
- To point it at another copy of the data pack: `python3 tools/embed_data_pack.py path/to/pack.xlsx`. Tabs are found by their prefix (B0 to B4) and columns by their header names, so a renamed tab or reordered column still loads.

## What works, and what is a concept

| Part | Status |
| --- | --- |
| Close Assistant: briefing, AP review, commentary, close status, outputs | Works, against the data pack |
| Ask panel (the **Ask** button, top right) | Simulated assistant. The answers are composed in code from the checks' live results, not written by a language model |
| Executive view | Works. It reads the Close Assistant's real results by region |
| Payables: invoice intake | Simulated screen. The stopped invoices and their reasons are the Close Assistant's real results, replayed as if each invoice were arriving. Receiving, reading the invoice document and posting to the PMS are not built, although the screen shows them as pipeline steps |
| How the OS fits | A diagram of the direction. No data |
| The gray modules in the menu | Not built, not linked |

## The walkthrough

Before a demo, click **Reset the demo** on the Outputs tab. Decisions are kept in the browser, so a rehearsal carries over otherwise.

1. **Briefing.** The morning view for BD6 (Friday, October 16). Owner reports are due BD8 (Tuesday, October 20). 9 owner reports will miss BD8 at the current pace, 16 more need fixes first, and $61,697 should be held before the next payment run. Below it are today's actions, in order.
2. **The tracker vs. the evidence.** The tracker says 183 steps are complete. The data supports 163. AP cutoff is marked done at 9 properties that still have August invoices. Commentary is marked done at 6 properties where it's required and none is written, and at 7 where an earlier step is still open. 3 steps are marked complete on BD7, but today is BD6.
3. **AP review.** 45 of 437 invoices need a person. Start with the top card: a $43,218.63 roof repair at Aggie Commons entered twice, coded by two different accountants. Click **Hold payment**.
4. **Governance.** Open the $35,295.66 Sparkle Commercial Cleaning invoice, which is 20 times that vendor's usual bill. Click **Seen the invoice: amount is right**. Because it's over $10,000, it waits for a second reviewer. Click your name at the bottom of the sidebar and switch user to S. Alvarez, who coded it: the card is locked. Switch to Controller and confirm.
5. **Commentary.** Harbor Pointe Contract Services looks 38% over budget. $2,822 of it is an August grounds invoice. Without it, the category is $222 under budget. The draft says so, and the badge shows every figure matches the data. But **Approve** is locked: the commentary rests on that invoice, and nobody has decided it yet. Click **Open line 388 in AP review**, then **Move to August**. Go back to Commentary and approve it. The other five can't be explained from the data, so the tool states the figures, drafts a question for the accountant, and locks approval until a person enters the cause.
6. **Close status.** Harbor Pointe has moved from "Needs fixes first" to "On track" because of those two decisions. Bank reconciliation is late at 12 properties across 4 accountants, and it is the only step late outside J. Ramirez's properties, which points to a shared cause, not one person. J. Ramirez is 31 steps behind across 9 properties, including all 7 in the Southeast. The suggested rebalance moves 3 properties to people who are caught up and have room, and shows what each move adds to that person. That still leaves 5 reports late, so the card also says what it would take to get all 38 out: 31 steps, about 3 accountant-days, found either by stretching the team (K. Brooks takes four more properties, S. Alvarez one) or by bringing in help. If neither is possible, those 5 owners should hear today.
7. **Ask.** Click **Ask** (top right) and try "Why is Lantern Square at risk?", "line 282" or one of the suggested questions. The answers come from the checks' results and change as decisions are made, and the panel shows whether every figure in the answer is in those results.
8. **Outputs.** Download the annotated workbook, copy the morning email to the Accounting Manager, and see the approval requests drafted for each Regional Manager. Every decision is in the audit trail.
9. **Where this goes.** Open **Payables** in the menu. The same 45 invoices, shown as they would look at intake: on average they would have been caught 25 days sooner than at close. Every invoice is also checked against a suggested GL code. The suggestion and its confidence only show where it differs from the keyed code: 10 invoices, the same 10 as the coding flags.

## What it found in the September data

| Check | Found | Amount |
| --- | --- | --- |
| Likely duplicate payments (4 exact, 3 with the invoice number keyed two ways) | 7 | $56,019 |
| Charges to properties off-boarded on 08/31/2026 | 4 | $5,678 |
| Over $10,000 and not approved | 8 | $200,286 |
| ...of which at least 5 times the vendor's usual invoice | 6 | $159,234 |
| GL code doesn't match the description (2 cross capital and operating) | 10 | $21,193 |
| August invoices in September's register | 12 | $28,460 |
| Possible splits under the $10,000 limit (2 pairs) | 4 | $27,380 |
| Categories more than 10% off budget, needing commentary | 6 | |
| Close steps marked complete that the data contradicts | 20 | |
| Properties where bank reconciliation is late (4 accountants) | 12 | |
| Steps marked complete while an earlier step is still open | 39 | |

Two things in the data worth saying out loud:

- **The possible splits are prompts, not findings.** Jackson & Wade billed Lake Nona Crossing $4,738.30 and $5,314.21 on consecutive days, $10,052.51 together. Metro Water billed Cypress Creek Homes twice on one day, which may simply be two meters. The tool asks; a person answers.
- **Payroll is not all in the payroll system.** 18 temp labor invoices are coded to Payroll in AP. None are at Campus Edge, so they don't explain its 31% payroll variance, and the drafted question says so.

## How it works

- **Every number is calculated in code** (`js/engine.js`). The checks are plain rules anyone in accounting can read, listed on the **Ontology & rules** tab. The same input always gives the same answer, and each flag traces to a rule.
- **The five tabs are linked into one picture.** An invoice belongs to a property and a GL account; GL accounts roll up to categories; a property and category make a budget line; a property has eight close steps owned by one accountant. So an invoice problem shows up as evidence against a close step, and against an owner report.
- **Commentary is drafted from the facts only.** A variance counts as explained only when a specific flagged invoice closes the gap, and it can't be approved until a person has decided that invoice. Otherwise the draft states the figures and stops, and it can't be approved until a person enters the cause.
- **Two checks on every draft.** A number check: each figure must appear in the data. A cause check: a draft for an unexplained variance can't state a reason ("because", "due to", "driven by"...). The person's own explanation goes in a separate box and is recorded as theirs.
- **Coding confidence is calculated, not invented.** The suggested GL code for an invoice is the one most often used on the other invoices with the same description, and the confidence is that share. Below 90%, or with fewer than three invoices to go on, it goes to a person. This month none do, because the data pack has only 19 descriptions and each is used a dozen times or more. Real invoices would be far more varied.
- **Finance owns the thresholds.** The approval limit, commentary threshold and unusual-amount rule can be changed on the **Ontology & rules** tab, and every check re-runs.

## Where the AI is, and isn't

This is a simulated prototype. Nothing in it calls a language model, and nothing is sent anywhere.

- **The checks are rules, not a model.** That is deliberate. An accountant has to be able to see why an invoice was flagged, get the same answer tomorrow, and defend it to an auditor.
- **The Ask panel is simulated.** Its answers are composed in `js/chat.js` from the checks' current results. It recognizes properties, invoices, vendors, accountants, regions and a set of common questions, and says so when it has no answer. In production a language model would write the answers from the same results (the `context()` object in that file is what it would be given), and the same figure check would run on what it wrote.
- **"Suggest another wording" is a second template**, not a model. It passes the same number and cause checks as any draft.
- **Invoice intake is simulated** on top of the real flags. Reading the invoice document is where a model would do work the rules can't.
- **The prototype itself was built with AI assistance.**

## AI safety

For a finance team, safety means the system can't move money and can't put a made-up number in front of an owner. The prototype is built around that:

- **It advises and never acts.** Nothing is paid, posted, approved or changed in the source data. A person does that in the PMS.
- **A person approves everything that leaves.** No commentary reaches an owner, and no flag is cleared, without a named reviewer.
- **Nobody clears their own work**, and clearing anything over $10,000 needs a second reviewer.
- **Every figure in a draft must be in the data.** A draft that fails the number check can't be approved.
- **No invented causes.** A draft for a variance the data can't explain may not state a reason. The tool asks a named person instead.
- **Rules for numbers, a model only for words.** Each flag traces to a rule an accountant can read, and the same input always gives the same answer.
- **It says what it doesn't know.** Unusual amounts, possible splits and unexplained variances are raised as questions, not findings.

In production the same rules apply to the language model: it is given only the checks' results, it has no ability to post or pay, and its output goes through the same number and cause checks before a person sees it.

## Governance

- The tool never pays, posts or approves. Holding a payment or sending an approval request is recorded, and a person does the rest in the PMS.
- You can't clear a flag on an invoice you coded.
- Clearing a flag over $10,000 needs a second reviewer. Conservative actions (hold, send for approval) take effect at once.
- "Not an issue" needs a reason.
- Commentary can't be approved ahead of the invoice decision it rests on.
- Every decision, approval and threshold change is in the audit trail, with who and when.
- The workbook comes back annotated, not amended: "Review:" columns are added beside the original ones and every original cell is unchanged.

## Regression test

`js/answer-key.js` holds the expected results, generated by `tools/answer_key.py`. That script applies the same rules as the app, written a second time in Python. The app compares itself with it on the **Ontology & rules** tab: 53 of 53 caught, 0 missed, 0 false alarms.

That proves the checks still find what they found. It is not a measure of accuracy: a rule that is wrong in one is wrong in both. It doesn't cover the split check. Real accuracy needs a pilot, where the tool runs alongside the team for a close and is scored against what the accountants actually find.

To run the same test outside the browser:

```bash
npm install --prefix tools xlsx@0.18.5
node tools/test_engine.js
```

## Assumptions and limits

- **Who approved.** "Approved" in the register doesn't say who approved. 50 invoices over $10,000 are marked Approved; production would confirm the approver was the Regional Manager.
- **Register vs. ledger.** The invoice register doesn't reconcile to the budget-vs-actual tab: it is within 10% of the posted actual on only 11 of 228 budget lines. So a register total is never used to explain a variance. Only a specific flagged invoice is, which is why one of the six variances is explained and five are not. Even that one assumes the August invoice is inside the posted actual, which is why a person has to decide it first.
- **The calendar.** The README tab gives the data as of Friday, October 16, and the tracker says BD6. Read together, BD6 is October 16, AP cutoff (BD3) was October 13 and owner reports are due Tuesday, October 20. The latest received date in the register is October 12, before cutoff, which supports this reading. Weekends are skipped; holidays aren't known.
- **Paid or not.** The data doesn't say whether an Approved invoice has been paid. "Hold" assumes it hasn't; if it has, the action is a recovery from the vendor.
- **No invoice documents.** The tool can flag a $35,000 cleaning bill but can't tell a keying error from a real project. Reading the documents is the next step.
- **Pace and room.** Pace is the steps each accountant has finished per business day this close. It shows who is behind, not why. The rebalance judges who has room by each person's best day this close, applied to the rest of today and the two days after. That is a rate they have shown, not a promise they can repeat it. K. Brooks (12 properties, 2,851 units) isn't asked, because that is already an above-average load.
- **Step order.** Commentary marked done while an earlier step is open is treated as contradicted. The 39 out-of-sequence steps are reported as a count only: some close steps can fairly run in parallel.
- **The cause check is a word list.** It catches the usual phrasing, not every way of implying a reason. A person still approves every commentary.
- **The Ask panel is scripted.** It answers the questions it was built for and says so otherwise. It explains and drafts; it takes no action.
- **Decisions are kept in this browser** (local storage), so a refresh keeps the review. **Reset the demo** on the Outputs tab clears it.
- **Regional Manager names** aren't in the data, so approval requests are addressed by region.

## In production

1. Read from the PMSs and the data platform instead of a workbook, and run every morning of the close, not once.
2. Move the checks to intake, so a problem is stopped the day the invoice arrives (the Payables concept screen).
3. Save decisions to a database, post approved changes back to the PMS, and send the morning email on a schedule.
4. Read the invoice documents, so an unusual amount can be checked against the source.
5. Put a language model behind the Ask panel and the commentary wording, on a server with the company's own key, given only the checks' results and held to the same figure check.
6. Log every model call: what it was given, what it returned, which model version ran, what the checks made of it, and what it cost. That log sits beside the audit trail of people's decisions, so any figure an owner sees can be traced back to its source.
7. Track cost per close. Rules do the bulk checking for free and the model is only called for documents and wording, so cost follows the exceptions, not the volume. Rough estimate at current list prices: about one cent to read an invoice on a mid-size model, so around $10 per 1,000 invoices, and well under $1 per 1,000 on a small one.
8. Shadow mode first: one close alongside the team, scored on caught, missed and false alarms.

## Project layout

```
index.html                 The app. Open this.
js/engine.js               Reading the workbook, every check, commentary drafts, number and cause checks, scoring
js/app.js                  The Close Assistant screens, decisions, audit trail and outputs (plain JavaScript, no framework)
js/shell.js                The platform shell: sidebar, executive view, Payables intake concept, "How the OS fits"
js/chat.js                 The Ask panel: the simulated answers, the suggested questions, the figure check
js/data-pack.js            The data pack, unchanged, embedded so the app opens with no upload
js/answer-key.js           Expected results for the regression test
js/vendor/                 SheetJS 0.18.5 (reads and writes .xlsx in the browser), with its license
css/app.css                Compiled Tailwind CSS
img/                       The Asset Living logo
data/                      The data pack
tailwind/                  Tailwind source. To rebuild after editing: cd tailwind && npm install && npm run build
tools/answer_key.py        Builds the expected results from the data pack
tools/embed_data_pack.py   Rebuilds js/data-pack.js from a workbook
tools/test_engine.js       Runs the regression test in Node
tools/serve.py             Optional local web server with caching off, for editing: python3 tools/serve.py
```

## Notes

- **Branding.** Colors come from assetliving.com's CSS. The site's fonts are licensed, so the prototype uses Plus Jakarta Sans as a stand-in. The header uses the Asset Living logo from assetliving.com (`img/asset-logo-light.svg`).
- **SheetJS.** Version 0.18.5 is the last on npm. It has known issues when parsing untrusted files, which is acceptable for a demo that reads the exercise data pack. Production would use the current release from SheetJS or read files on the server.
- **Data.** All data is synthetic, from the exercise data pack.

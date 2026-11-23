# Asset Living build exercise: Close Assistant

**Scenario B, Month-End Close ("Close faster, catch more") · Darren Williams**

A working prototype for the Property Accounting Manager and their staff accountants on business day 6 of the September close. It reads the data pack, finds the invoices that need a person before they are paid or posted, drafts the owner commentary and says so when it can't explain a variance, and works out close status from the evidence instead of trusting what was typed into the tracker.

## Start here

| | |
|---|---|
| **Watch** | [Narrated video of the prototype running against the data pack](https://drive.google.com/file/d/1kbSy5CCM-8WikX90NN380D41KiRWy3p7/view) (Google Drive, no account needed) |
| **Run** | [`demo.zip`](demo.zip): unzip it and double-click `asset-os/index.html` |
| **Read** | [`interview_demo/asset-os/README.md`](interview_demo/asset-os/README.md): the full README, with the walkthrough, findings, assumptions and limits |

The demo needs no install, server, database or login. It runs in the browser, works offline, and has the data pack built in.

## What it caught in the September data

| Check | Found | Amount |
| --- | --- | --- |
| Likely duplicate payments (4 exact, 3 with the invoice number keyed two ways) | 7 | $56,019 |
| Charges to properties off-boarded on 08/31/2026 | 4 | $5,678 |
| Over $10,000 and not approved | 8 | $200,286 |
| GL code doesn't match the description | 10 | $21,193 |
| August invoices in September's register | 12 | $28,460 |
| Possible splits under the $10,000 limit (raised as questions, not findings) | 4 | $27,380 |
| Categories more than 10% off budget, needing commentary | 6 | |
| Close steps marked complete that the data contradicts | 20 | |

In total, 45 of 437 invoices need a person. 9 owner reports will miss business day 8 at the current pace and 16 more need fixes first. Only one of the six variances can be explained from the data; for the other five the tool states the figures, drafts a question for the accountant, and locks approval until a person enters the cause.

## Why this scenario

In my interview I heard that poor accounting loses owners faster than anything else: late financials, postings to the wrong account, and surprise true-ups after a distribution. All three are visible in the Scenario B data, and property accounting is the largest group of users of the three scenarios. My first analysis favoured Scenario A; the reasoning for both, and why I changed, is in [`reference/Choosing the scenario.md`](reference/Choosing%20the%20scenario.md).

## How it's put together

- **Code calculates every number.** The checks are plain rules in `js/engine.js` that an accountant can read. The same input always gives the same answer, and each flag traces to a rule and a data-pack row.
- **The AI is simulated.** Nothing in the prototype calls a language model. The drafts and the Ask panel are composed in code from the checks' results. The README says where a model would go in production and what would hold it to the figures.
- **It advises and never acts.** Nothing is paid, posted or approved, and the source data is never changed. The workbook comes back annotated, with every original cell untouched.
- **It is one static page**: plain JavaScript, Tailwind CSS, and SheetJS to read and write the workbook. A second implementation of the rules in Python (`tools/answer_key.py`) is the regression test: 53 of 53 caught, 0 missed, 0 false alarms.

Assumptions, limits, what is simulated, what I chose not to build and what production would need are all set out in the [full README](interview_demo/asset-os/README.md).

## Time spent

Around two full days (counting hours back to back), in this order:

1. Researching the company, its market, its technology stack and where AI could help (`research/`).
2. Reading the brief, profiling every tab of the data pack, and choosing the scenario (`reference/`).
3. A first build of Scenario B, then an audit of it against the brief: (`interview_demo/asset-os/`)
4. Interative rebuild process: checks that run in the browser, review governance, the regression test, the platform shell and the Ask panel.
5. Recording the video.

## Tools used

- **Claude Code** (Anthropic's Claude) for the research, the data profiling and the build. I directed and reviewed it; it wrote the code and the research files.
- The research was done by several Claude agents working in parallel. Each research file labels what is verified, what is vendor-claimed and what is inferred.
- [`CLAUDE_PROMPT_ENGINEERING.md`](CLAUDE_PROMPT_ENGINEERING.md) is the transcript of the first two days of that conversation: my requests and Claude's replies. [`CLAUDE.md`](CLAUDE.md) is the standing instruction file Claude Code reads at the start of every session.

## What's in this repo

I've included everything, so you can see the working as well as the result.

```
README.md                      This file
demo.zip                       The prototype, ready to unzip and open
CLAUDE.md                      Standing instructions and project facts for Claude Code
CLAUDE_PROMPT_ENGINEERING.md   Transcript of the research, scenario choice and first build
interview_demo/asset-os/       The prototype's source (the same files as demo.zip) and its README
reference/                     The brief, the data pack, my data findings, the scenario choice, the brand guide
research/                      Five research files on the company, market, technology, pain points and AI use cases
videos/                        Local recordings of the demo
```

All data in the prototype is synthetic, from the exercise data pack.

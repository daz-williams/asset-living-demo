# 04 — Asset Living: pain points and churn signals (voice of resident, employee and owner)

Research date: 2026-11-21. All web sources accessed on that date unless stated.

## How to read this document

- **Evidence** = something a cited source says. **Inference** = my reading of what the evidence implies. They are labelled separately throughout.
- **Selection bias is severe in this material.** Asset Living is described as managing roughly 445,000-450,000 units across 2,700+ communities ([EliseAI customer story](https://eliseai.com/customer-stories/how-asset-living-revamped-lead-nurturing-and-delinquency-management-with-eliseai); [Asset Living multifamily page](https://www.assetliving.com/property-management/multi-family)). A few hundred complaints over three years is a tiny fraction of residents, and people who post to BBB, PissedConsumer or Glassdoor are disproportionately unhappy. Review data tells us *what goes wrong when things go wrong*, not *how often things go wrong*.
- A third-party manager executes the owner's budget. Deferred maintenance, fee schedules, utility bill-backs and rent increases are frequently owner decisions that residents attribute to the manager. Several incidents below (Arcata, Oklahoma City) have that character.
- **Source access limits.** Glassdoor, Indeed, Comparably, Justia, most job boards and several news sites returned HTTP 403 to direct fetches. Figures from those sites come from search-engine result summaries and are marked "(via search summary)". The session's web-search budget ran out before I could finish Reddit, ApartmentRatings, Google-review and student-parent searches; see "Gaps / unverified".
- Per instructions, no names of individual reviewers or non-executive employees are reproduced. Court captions are given because they are the public case names.

---

## 1. Resident experience

### 1.1 Headline numbers (with dates)

| Source | Figure | As of | Link |
|---|---|---|---|
| BBB (Houston HQ profile) | Rating **F**; not accredited | 2026-11-21 | [BBB profile](https://www.bbb.org/us/tx/houston/profile/property-management/asset-living-0915-60000366) |
| BBB | **403** complaints in last 3 years; **114** in last 12 months | 2026-11-21 | [BBB complaints](https://www.bbb.org/us/tx/houston/profile/apartments/asset-living-0915-60000366/complaints) |
| BBB | Stated reasons for the F: "Failure to respond to 354 complaint(s)" and "403 complaint(s) filed" | 2026-11-21 | [BBB profile](https://www.bbb.org/us/tx/houston/profile/property-management/asset-living-0915-60000366) |
| BBB | Complaint status: 354 unanswered, 33 answered, 14 resolved, 2 unresolved | 2026-11-21 | [BBB complaints](https://www.bbb.org/us/tx/houston/profile/apartments/asset-living-0915-60000366/complaints) |
| BBB customer reviews | **1.09 / 5** from 55 reviews | 2026-11-21 | [BBB reviews](https://www.bbb.org/us/tx/houston/profile/apartments/asset-living-0915-60000366/customer-reviews) |
| PissedConsumer | 1.0 / 5 from 7 reviews (Jul-Oct 2026) | page updated 2026-11-02 | [PissedConsumer](https://www.pissedconsumer.com/asset-living/RT-F.html) |
| VeryApt (aggregates property-level reviews) | **7.0 / 10** management, 7.3 building, 124 reviews across 25 listings | reviews dated 2024-2025 | [VeryApt](https://www.veryapt.com/m1796-asset-living) |

Notes: search-engine snapshots of the same BBB page showed 344, 388, 401 and 436 three-year complaints at different crawl dates, so the count moves; 403 is what the page showed on the research date. The BBB profile aggregates HQ and "corporate-owned locations" and lists former names (Asset Plus, Asset Campus Housing) and individual communities as alternate names.

**Inference.** The most actionable number in the table is not the complaint count, it is the **88% unanswered rate** (354 of 403). That is a process failure at the corporate escalation layer, not a property-condition problem, and it is the stated cause of the F rating. The contrast with VeryApt (7.0/10 where residents rate their actual building) is consistent with normal-to-decent on-site experience at many communities and a weak safety net when a case escalates past the site.

### 1.2 Complaint categories and relative frequency

BBB's own coding of the 403 complaints ([source](https://www.bbb.org/us/tx/houston/profile/apartments/asset-living-0915-60000366/complaints)):

| BBB type | Count | Share |
|---|---|---|
| Service or repair issues | 136 | 34% |
| "Product issues" (in the sample I read, these were mostly deposit/refund disputes) | 121 | 30% |
| Billing issues | 75 | 19% |
| Order issues | 33 | 8% |
| Customer service issues | 25 | 6% |
| Facilities, sales/advertising, delivery | 13 | 3% |

I hand-coded a small sample of 28 recent items (10 BBB complaints dated 2026-10-05 to 2026-10-22, 10 BBB reviews dated 2026-08-26 to 2026-11-13, 8 PissedConsumer entries dated 2026-07-14 to 2026-10-28). This is a convenience sample of the most recent posts, not a statistical one; BBB pages beyond the first would not render for me.

| Theme | Primary theme in ~N of 28 | Qualitative frequency | Representative excerpt (source) |
|---|---|---|---|
| **Communication / unreturned calls and emails** | 2 as primary, but present as a secondary theme in more than half | **Very high — the cross-cutting theme** | "Not one call back, not one reply, nothing." ([BBB review, 2026-11-13](https://www.bbb.org/us/tx/houston/profile/apartments/asset-living-0915-60000366/customer-reviews)); "They do not reply to emails or voicemails." ([PissedConsumer](https://www.pissedconsumer.com/asset-living/RT-F.html)) |
| **Security deposit, holding/application deposit, move-out charges** | ~8 | **High** | "I have still not received my security deposit refund" ([BBB complaint, 2026-10-15](https://www.bbb.org/us/tx/houston/profile/apartments/asset-living-0915-60000366/complaints)); "they charged me for $163+ but didnt provide any detail" ([BBB review, 2026-08-29](https://www.bbb.org/us/tx/houston/profile/apartments/asset-living-0915-60000366/customer-reviews)) |
| **Billing, fees, utilities (incl. third-party utility billing, insurance fees, concessions not applied)** | ~7 | **High** | "our $212.50/month rent concession stopped being applied in September" ([BBB complaint, 2026-10-09](https://www.bbb.org/us/tx/houston/profile/apartments/asset-living-0915-60000366/complaints)); "Deceptive pricing, beware." ([BBB review, 2026-08-26](https://www.bbb.org/us/tx/houston/profile/apartments/asset-living-0915-60000366/customer-reviews)) |
| **Maintenance responsiveness / work orders closed unresolved** | ~5 primary; BBB's own top category (34%) | **High** | "Work orders have been closed without the problem being resolved" ([BBB complaint, 2026-10-05](https://www.bbb.org/us/tx/houston/profile/apartments/asset-living-0915-60000366/complaints)); "Slow on maintenance." ([VeryApt, 2025-11-03](https://www.veryapt.com/m1796-asset-living)) |
| **Pests / cleanliness** | ~3 | Medium | "There are cockroaches living in both the oven and refrigerator." ([BBB complaint, 2026-10-22](https://www.bbb.org/us/tx/houston/profile/apartments/asset-living-0915-60000366/complaints)) |
| **Safety / access control (gates, doors, garages, package theft)** | ~3 | Medium | "Building doors are frequently left unsecured" ([BBB review, 2026-09-30](https://www.bbb.org/us/tx/houston/profile/apartments/asset-living-0915-60000366/customer-reviews)); "nearly 50 cars were broken into" ([VeryApt, 2025-11-26](https://www.veryapt.com/m1796-asset-living)) |
| **Problems immediately after a management takeover** (lost lease, concession dropped, new utility billing, portal change) | ~3-4 | Medium, but **high severity** and tied to Asset Living's growth model | "We are unable to access our accounts or independently verify and pay our bills" ([BBB complaint, 2026-10-14](https://www.bbb.org/us/tx/houston/profile/apartments/asset-living-0915-60000366/complaints)) |
| **Lease termination, buyout fees, collections** | ~2 | Low-medium | "sent me to collections and refuse to acknowledge the issue" ([BBB complaint, 2026-10-13](https://www.bbb.org/us/tx/houston/profile/apartments/asset-living-0915-60000366/complaints)) |
| **Renewals / rent increases** | 0 primary; 1-2 secondary (incl. a renewal conditioned on a paid rent-reporting opt-in) | Low in complaint data | "Being forced to opt in on rent payment reporting" ([PissedConsumer, 2026-09-14](https://www.pissedconsumer.com/asset-living/RT-F.html)) |
| **Staff turnover at the site** | 0 primary; mentioned in passing | Low in complaint data | "the entire office has turned over" ([VeryApt, 2025-11-04](https://www.veryapt.com/m1796-asset-living)) |
| **Move-in readiness (student housing turn, delayed openings)** | 0 in this sample; appears in news (section 4.3) | Episodic, seasonal, high severity when it happens | See 4.3 |

**Inference on frequency.** In complaint channels, the order is roughly: (1) nobody responds, (2) money disputes at the edges of the lease (application/holding deposits, move-in pricing, utility and add-on fees, move-out charges and deposit refunds), (3) maintenance not completed or closed without a fix, (4) pests and safety, (5) takeover turbulence. Rent increases themselves are rarely the complaint; the unexplained or mishandled *transaction* is.

**Why this matters for churn (industry evidence, not Asset Living-specific).** AppFolio's 2026 Renter Preferences Report (3,002 renters, fielded 2026-01-26 to 2026-02-04) found maintenance correlated more strongly with overall satisfaction than any other factor, and maintenance-satisfied renters were 81% more likely to renew ([AppFolio](https://www.appfolio.com/blog/what-renters-want-after-free-rent-concessions-end)). A Zego survey reported via Bisnow lists poor maintenance, safety concerns, poor upkeep and poor management communication among residents' stated reasons for not renewing, after location and price ([Bisnow](https://www.bisnow.com/news/national/multifamily/multifamily-culture-jll-studiob-131749); I read this via search summary only).

### 1.3 What residents praise

- **Fast, friendly maintenance at specific communities.** "the service people came by same-day or next day to fix it" and "Management and maintenance are very responsive." ([VeryApt, Oct-Nov 2025](https://www.veryapt.com/m1796-asset-living)).
- **Location, amenities, social events, feeling safe** at well-run properties: "regular social events provide ample opportunities to connect with others." ([VeryApt, 2025-12-01](https://www.veryapt.com/m1796-asset-living)).
- Even on PissedConsumer, one reviewer conceded "Rent is decent and if you ask to fix small problems they get done." ([PissedConsumer](https://www.pissedconsumer.com/asset-living/RT-F.html)).
- Asset Living's own marketing cites "65% Resident Retention" and a "sub-24-hour work order completion rate" at one case-study property ([Asset Living multifamily page](https://www.assetliving.com/property-management/multi-family)). These are unaudited company claims with no stated period or method.

**Inference.** Experience is highly variable by property and by on-site team. Praise attaches to named site teams; complaints attach to "corporate" and to the periods when the site team is absent, new, or has just changed.

---

## 2. Employee experience

### 2.1 Ratings (with dates)

| Source | Figure | As of | Link / access |
|---|---|---|---|
| Glassdoor | **3.5 / 5**, ~1,300-1,364 ratings, 63% recommend | search snapshots, 2026 | [Glassdoor](https://www.glassdoor.com/Reviews/Asset-Living-Reviews-E647866.htm) (via search summary; direct fetch 403) |
| Glassdoor, Property Manager title only | **3.1 / 5** from 70 reviews; work-life balance 2.7 | search snapshot, 2026 | [Glassdoor PM reviews](https://www.glassdoor.com/Reviews/Asset-Living-Property-Manager-Reviews-EI_IE647866.0,12_KO13,29.htm) (via search summary) |
| Indeed | **2.7 / 5**; work wellbeing score 61 | reviews through Aug-Sep 2026 | [Indeed](https://www.indeed.com/cmp/Asset-Plus/reviews) (via search summary; 403) |
| Comparably | Culture 41/100 ("F"), eNPS -100 — **but from only 3 employees / 33 ratings; not meaningful** | 2026 | [Comparably](https://www.comparably.com/companies/asset-living) (via search summary; 403) |
| Breakroom | 6.3 / 10 from 75 frontline employees | undated snapshot | [Breakroom](https://www.breakroom.cc/en-us/employers/asset-living) (via search summary; 403) |
| RepVue | 3.2 / 5 overall | undated snapshot | [RepVue](https://www.repvue.com/companies/AssetLiving) (via search summary) |

A 3.5 Glassdoor score is unremarkable for a large property manager; the lower Indeed score likely reflects a more frontline, hourly reviewer mix. I could not benchmark against Greystar, RPM or Cushman & Wakefield in this session.

### 2.2 Themes

All Glassdoor/Indeed excerpts below are from search-result summaries of the review pages, not from pages I could open, so treat wording as approximately quoted.

| Theme | Evidence | Strength |
|---|---|---|
| **Too many systems to keep updated** | A former property manager praised Entrata as user-friendly but cited "too many systems/websites/programs to monitor and keep updated"; another review says staff use many different PMS platforms; an accounting reviewer described working "in 2 different systems" ([Glassdoor PM reviews](https://www.glassdoor.com/Reviews/Asset-Living-Property-Manager-Reviews-EI_IE647866.0,12_KO13,29.htm)). A 2026 Indeed review said processes meant to make onsite operations easier often make routine responsibilities more complicated and time-consuming ([Indeed](https://www.indeed.com/cmp/Asset-Plus/reviews)). | Medium-high. Consistent with the company's own positioning as "PMS-agnostic" with "client-tailored technology stacks" ([Asset Living services](https://www.assetliving.com/property-management/services)) — i.e. the system varies by owner. |
| **Workload, especially student "turn"** | "required hours during 'turn' over summer are well over 55 a week"; staff "work a RIDICULOUS amount of hours during Turn"; site staff "stretched thin and underpaid" (regional manager reviewer); "never enough hours in the day" ([Glassdoor](https://www.glassdoor.com/Reviews/Employee-Review-Asset-Living-E647866-RVW34966433.htm)). | Medium-high for student; medium for conventional. |
| **Thin or inconsistent support from above** | "minimal support from upper management"; "corporate management is very un-organized, tells us things last minute"; upper management "puts a lot of pressure on small team managers" ([Indeed](https://www.indeed.com/cmp/Asset-Plus/reviews); [Glassdoor](https://www.glassdoor.com/Reviews/Employee-Review-Asset-Living-E647866-RVW84849893.htm)). Counter-evidence: a regional manager on an industry forum reported responsive corporate support and "no complaints" ([Multifamily Insiders thread, c. mid-2025](https://www.multifamilyinsiders.com/apartment-ideas/the-front-lines/27187-hello-our-current-management-company-is-dissolving-and-asset-living-will-be-taking-over)). | Medium. Explicitly "depends on upper leadership" and varies by state per the same forum thread. |
| **Vendor invoices not paid on time** | A 2024 property-manager review is titled "Great Company But Do not Pay bills" ([Glassdoor](https://www.glassdoor.com/Reviews/Employee-Review-Asset-Living-RVW84042808.htm)). A forum poster described resending vendor invoices repeatedly, with vendors cutting the property off for non-payment ([Multifamily Insiders](https://www.multifamilyinsiders.com/apartment-ideas/the-front-lines/27187-hello-our-current-management-company-is-dissolving-and-asset-living-will-be-taking-over)). | Low-medium (two independent anecdotes). Notable because Asset Living markets centralized AP as reducing on-site workload ([services page](https://www.assetliving.com/property-management/services)), and a late-2026 Senior Accountant posting refers to a "newly implemented ERP" ([Greenhouse](https://job-boards.greenhouse.io/assetliving/jobs/6267305004)). |
| **Staffing gaps and turnover** | A 2020 review said the company "grew too fast and can't keep up with staffing properties properly"; another cited "high turnover everywhere you look" ([Glassdoor](https://www.glassdoor.com/Reviews/Asset-Living-Property-Manager-Reviews-EI_IE647866.0,12_KO13,29.htm)). Structural corroboration: Asset Living runs **TOPS**, an "internal talent agency" of floating managers, leasing and facilities specialists deployed for "staffing gaps, vacancies, new acquisitions, performance problems" on 1-30 day assignments ([TOPS Senior Community Manager Specialist](https://job-boards.greenhouse.io/assetliving/jobs/6228541004); [TOPS Leasing Specialist](https://job-boards.greenhouse.io/assetliving/jobs/6228437004)). | Medium. Industry baseline: onsite turnover 29.2% in 2025, 33.4% at firms with 450+ employees ([NAA citing RCLCO, 2026-04-01](https://naahq.org/news/why-employee-retention-challenges-go-deeper-wages)). I found no Asset Living-specific turnover figure. |
| **Compensation and benefits** | Complaints of low hourly pay, no or low 401(k) match, limited parental leave ([Glassdoor "401k match" reviews](https://www.glassdoor.com/Reviews/Asset-Living-401k-match-Reviews-EI_IE647866.0,12_KH13,23.htm)). Counter-evidence: a forum poster said "pay is good" ([Multifamily Insiders](https://www.multifamilyinsiders.com/apartment-ideas/the-front-lines/27187-hello-our-current-management-company-is-dissolving-and-asset-living-will-be-taking-over)). Posted pay: Assistant Community Manager $21-23/hr in Luling, TX ([SimplyHired](https://www.simplyhired.com/job/UWcvepqL2fFUNF0oXbEESSFyMV5a_tch6qSsXrvSBJhaG_5ylSeC8w)); Leasing Consultant $19-24/hr in Colorado (via search summary of job boards). | Medium. |
| **Training** | Little explicit complaint found. The company has "Performance Manager" training roles open ([Greenhouse board](https://job-boards.greenhouse.io/assetliving)). | Not established. |
| **Positives** | "lots of room for growth, easy promotion opportunities"; flexibility and work-life balance (8-year employee, June 2026); "adequate PTO"; supportive direct managers and VPs ([Glassdoor](https://www.glassdoor.com/Reviews/Asset-Living-Reviews-E647866.htm); [Indeed](https://www.indeed.com/cmp/Asset-Plus/reviews)). | Medium-high — growth opportunity is the most repeated positive. |

**Not found:** any public figure for doors per on-site employee, properties per regional manager, or doors per property accountant at Asset Living. Expired postings (via search summary) describe a Property Accountant managing "a portfolio of 5-10 properties" and an AP Specialist processing invoices for "approximately 15" properties; the original Greenhouse URLs now redirect to the board index, so I could not confirm.

---

## 3. Owner / client experience

### 3.1 What Asset Living promises owners

- "Delivery of accurate, timely, and transparent financial reporting"; "Complete transparency, real-time visibility" with owner portals, drill-through and export; a "PMS-agnostic" data architecture and "client-tailored technology stacks"; centralized accounts payable to reduce on-site workload; centralization used to "optimize property NOI" ([services page](https://www.assetliving.com/property-management/services)).
- "Gain insight from ongoing property reports, tailored for your asset"; "65% Resident Retention"; takeover capability, e.g. "seamlessly transitioned 74 properties inclusive of 42,000 beds over a 45-day period" in 2016 ([multifamily page](https://www.assetliving.com/property-management/multi-family)).
- Student: "97% pre-leased" annually; No. 1 third-party student manager per Student Housing Business ([student page](https://www.assetliving.com/property-management/student)).
- No published reporting cadence or SLA on either page.

### 3.2 Why owners choose Asset Living (company-published case studies; unaudited)

The recurring story is **takeover of an under-performing asset from a prior manager**:

- Glen Heights (Pretium, BTR, Salisbury MD, 2024): taken over when the "prior management team was non-responsive", delinquency $157K and maintenance deferred; occupancy 75% to 94%, delinquency to under $5K ([case study](https://www.assetliving.com/case-studies/glen-heights-pretium)).
- Country Club Place (Barvin): occupancy 10% at takeover with one of five buildings habitable, later 98% ([case study](https://assetliving.com/case-studies/country-club-place-barvin-group)).
- Hub and Montage (Greenlaw): occupancy up 5-10 points, delinquency down 50% ([case study](https://assetliving.com/case-studies/hub-and-montage)).
- Zimmer student portfolio: average pre-lease 98.42% versus 92.12% under the prior manager ([case study](https://assetliving.com/case-studies/zimmer-development-group)).
- Vendor-published: Apartment List says owner-facing performance reporting improved and cites 25x ROI across five metros in 2025 ([Apartment List, 2026-01-29](https://www.apartmentlist.com/rental-management/asset-living-case-study)).

**Inference.** Owners hire Asset Living for the same reasons they fire others: responsiveness, delinquency control, occupancy, deferred maintenance. Asset Living's own sales narrative therefore defines the standard it will be judged against, and the resident complaint data in section 1 ("non-responsive", deferred maintenance) uses the same vocabulary its case studies use about the managers it replaced.

### 3.3 Why owners leave — public evidence is thin

- **One owner-versus-manager lawsuit.** *QPG Fountain Apartments LLC d/b/a Summit East Ridge v. First Communities Management, Inc. and Asset Living, LLC*, No. 1:24-cv-00321 (E.D. Tenn., Chattanooga), filed 2024-09-23; defendants moved to dismiss on 2024-11-08 ([Justia docket](https://dockets.justia.com/docket/tennessee/tnedce/1:2024cv00321/116366); [CourtListener opinion page](https://www.courtlistener.com/opinion/10866117/qpg-fountain-apartments-llc-dba-summit-east-ridge-v-first-communities/); both via search summary — pages would not load). **I could not read the complaint, so the claims and the outcome are unverified.** The plaintiff is a property-owning entity suing its (former) manager, which is the relevant signal. The property was reported sold for $10.225M in mid-2026 ([Chattanoogan.com, 2026-06-25](https://www.chattanoogan.com/2026/6/25/520321/Chattanooga-s-Million-Dollar-Homes.aspx), via search summary).
- **One anecdote of an owner moving to a competitor.** An industry-forum poster said their owners ended the Asset Living relationship and moved to RPM Living, keeping the site staff; the poster called Asset Living "a fine company" ([Multifamily Insiders](https://www.multifamilyinsiders.com/apartment-ideas/the-front-lines/27187-hello-our-current-management-company-is-dissolving-and-asset-living-will-be-taking-over)). Single, anonymous, undated beyond "about 1 year 4 months ago".
- **Trade-press transitions are almost all inbound.** Examples: BMC Investments' 14-property Denver portfolio via acquisition of BMC's management division ([Multi-Housing News](https://www.multihousingnews.com/asset-living-acquires-bmc-property-management-division/)); Industry Tallahassee, 248 units ([Multifamily & Affordable Housing Business](https://multifamilyaffordablehousing.com/asset-living-takes-over-management-of-industry-tallahassee-in-tallahassee-florida/)); Avila Apartments, Pasadena ([Asset Living, 2026-09-16](https://www.assetliving.com/blogs/asset-living-expands-multifamily-portfolio-with-the-addition-of-avila-apartments)); Nightingale, Redmond WA ([Asset Living, 2026-09-18](https://www.assetliving.com/blogs/asset-living-expands-multifamily-portfolio-with-the-addition-of-nightingale)). Outbound losses are not press-released by anyone, so their absence proves nothing.
- **General industry reasons owners switch (not Asset Living-specific, and weakly sourced):** late or missing reports and unanswered questions, falling cash flow/occupancy, neglected maintenance ([Multifamily Insiders blog, 2014](https://www.multifamilyinsiders.com/multifamily-blogs/when-to-fire-your-third-party-property-management-company)); "responsiveness and transparency" as the top improvement areas in Buildium's 2026 survey of small-portfolio owners ([Buildium](https://www.buildium.com/blog/how-rental-owners-evaluate-a-property-managers-performance/), via search summary). I found no rigorous institutional-owner survey.

**Inference.** There is no public data on Asset Living's client retention. The plausible owner-churn mechanisms, in order of how well this research supports them, are: (1) reputational and legal drag from unanswered resident escalations and takeover turbulence at *the owner's* asset; (2) staffing instability at the site; (3) AP/vendor-payment friction; (4) reporting quality and speed — which is the industry's classic reason but for which I found **no Asset Living-specific evidence either way**.

---

## 4. Legal, regulatory and press issues

Read this section conservatively. Allegations are not findings. Asset Living's scale means some litigation is statistically inevitable. I found **no** attorney-general enforcement action, consent decree, HUD charge, certified class action, or data-breach notification naming Asset Living. Absence from my searches is not proof of absence.

### 4.1 Court cases located

| Case | Court / number | Dates | What it is | Status and caveats |
|---|---|---|---|---|
| *Haubenreiser v. Asset Living* | Colorado Court of Appeals, No. 25CA0172; on appeal from Denver District Court No. 23CV759 | Opinion 2025-12-24 (unpublished) | Tenant suit arising from a tenancy at a Denver complex. Per search summaries of the opinion, a jury awarded the plaintiff $21,518 and $15,000 on two claims and found **for Asset Living on retaliation**; the appeal was dismissed. A footnote notes the manager is Echelon Property Group, LLC d/b/a Asset Living. | [Justia](https://law.justia.com/cases/colorado/court-of-appeals/2025/25ca0172.html); [Counsel Stack](https://law.counselstack.com/opinion/haubenreiser-v-asset-living-coloctapp-2025). I could not open the opinion (403/429). A secondary site labels the two awards as breach of contract and breach of warranty of habitability and says the dismissal was for briefing violations ([Lawfold](https://lawfold.com/asset-living-lawsuit/)) — unverified. This is a jury verdict in an individual case, not a systemic finding. |
| *Miller et al. v. Asset Living, LLC et al.* | U.S. District Court, D. Colo., No. 1:24-cv-02687 | Filed 2024-09-27; partial dismissal 2026-03-12 | Pro se tenants (same Denver property; related to state case 23CV759) against Asset Living, an on-site employee and the property owner. On 2026-03-12 the court adopted a magistrate recommendation and dismissed the ADA and Denver Municipal Code claims with prejudice and two other claims without prejudice. | [govinfo](https://www.govinfo.gov/app/details/USCOURTS-cod-1_24-cv-02687/USCOURTS-cod-1_24-cv-02687-1); [PacerMonitor](https://www.pacermonitor.com/public/case/55254865/Miller_et_al_v_Asset_Living,_LLC_et_al). Per PacerMonitor, Fair Housing Act, Colorado Anti-Discrimination Act, habitability and retaliation claims remain pending; one plaintiff and one defendant were terminated in 2025. **Allegations only; no findings against Asset Living on the remaining claims.** Verify on PACER before relying on status. |
| *Parish v. Asset Living, LLC* | U.S. District Court, W.D. Tex., No. 1:25-cv-01135 | Filed July 2025 | Docket lists Asset Living "d/b/a Ekos City Heights". A secondary site describes it as a Telephone Consumer Protection Act case with a notice of settlement filed 2025-12-31 and a dismissal-papers deadline of 2026-03-06. | [Justia docket](https://dockets.justia.com/docket/texas/txwdce/1:2025cv01135/1172855938) (existence and filing month, via search summary); TCPA characterisation and settlement notice from [Lawfold](https://lawfold.com/asset-living-lawsuit/) only — **not verified against the docket**. Whether it was pleaded as a class action: unknown. Relevance to this project: outbound texting/calling consent is exactly the surface an AI communications layer touches. |
| *QPG Fountain Apartments LLC v. First Communities Management, Inc. and Asset Living, LLC* | U.S. District Court, E.D. Tenn., No. 1:24-cv-00321 | Filed 2024-09-23; motion to dismiss 2024-11-08 | Property owner suing its manager(s). See 3.3. | Claims and outcome **unverified**. |

### 4.2 Investigations and solicitations (not lawsuits)

- **Nebraska application-deposit investigation.** On 2026-11-12 the plaintiffs' firm Migliaccio & Rathod LLP announced it is investigating whether prospective renters at Nebraska communities "associated with Lund Living and Asset Living" improperly lost deposits after deciding not to sign a lease; the page says the companies maintain their application agreements authorised the forfeitures ([firm page](https://classlawdc.com/2026/11/12/lund-living-and-asset-living-apartment-deposit-investigation/)). This is an attorney solicitation. **No lawsuit is stated to have been filed** and I found no regulator involvement. BBB responses on the Lund profile describe a policy that the application deposit is non-refundable if the lease is not signed within three days of approval ([BBB, Lund Company](https://www.bbb.org/us/ne/omaha/profile/real-estate/lund-company-0714-104002666/complaints), via search summary).
- **Claimed attorney-general investigations.** A consumer-law content site states that state AG investigations are "active in Texas and Georgia" ([Lawfold](https://lawfold.com/asset-living-lawsuit/)). It cites no source and I found **no** AG press release, filing or news report to support it. A BBB complainant quoted a Texas AG complaint reference number ([BBB complaints](https://www.bbb.org/us/tx/houston/profile/apartments/asset-living-0915-60000366/complaints), via search summary), which shows only that an individual filed a consumer complaint. **Treat the "AG investigation" claim as unverified.**
- **RealPage rent-setting litigation.** My search of the DOJ and state AG RealPage complaints returned no mention of Asset Living as a defendant ([DOJ/Federal Register, 2025-12-05](https://www.federalregister.gov/documents/2025/12/05/2025-21966/united-states-of-america-et-al-v-realpage-inc-et-al-proposed-final-judgment-and-competitive-impact)). I did not check the private multidistrict class action's defendant list.
- **Data incidents.** No breach notification or ransomware report naming Asset Living found.
- **Employment litigation (FLSA/EEOC).** None found.

### 4.3 Local news

| Date | Place / property | What was reported | Company response | Source and caveat |
|---|---|---|---|---|
| 2026-07-10 and 2026-09-25 | Arcata, CA — Woodridge Apartments (126 units); bought May 2026 by Ridge Capital Investors, which hired Asset Living | After the takeover: move to a payment system with added fees; utilities newly billed through a third-party biller using a shared-cost formula; renewals promised but not sent, leaving some tenants month-to-month; leases with errors; unanswered calls/emails and an often-unstaffed office; a lost cashier's check. Police confirmed being called to a tenants' barbecue described as "unauthorized" and found no violation. A reported early-morning incident involving an alleged attempt to open a unit door was not substantiated by police; the employee involved denied it. Tenants' union organising followed. | Asset Living "did not respond to multiple requests for comment" | [Lost Coast Outpost, 2026-07-10](https://lostcoastoutpost.com/2026/jul/10/13-billion-bay-area-investment-firm-bought-arcata/); [Lost Coast Outpost, 2026-09-25](https://lostcoastoutpost.com/2026/sep/25/were-living-literal-nightmare-after-second-largest/). Tenant sources are anonymous. No code-enforcement finding reported. Utility bill-backs and repositioning are owner strategy. |
| 2023-09-18 (updated 2023-09-25) | Oklahoma City — The Alora (about 850 units) | 41 complaints to the city since new ownership in 2021, 30 of them in the prior five months; code enforcement documented violations in August 2023 and declared the property compliant by mid-September. Asset Living had **just replaced** the prior manager; a management statement blamed the prior manager. | Statement from "management", not explicitly attributed to Asset Living | [The Oklahoman via Yahoo](https://www.yahoo.com/news/public-eye-why-havent-owners-105515534.html). The problems largely pre-date Asset Living; included as an example of the distressed-takeover situations it inherits. |
| 2023-07-31 | Gainesville, FL — Ufora (new-build student housing near UF), managed by Asset Living | Residents notified in July that the building would not be ready for the 2023-08-05 move-in; offered paid hotel stays or $600/week. Leasing line unanswered. | Asset Living said it "will reach back out for a statement" | [WCJB](https://www.wcjb.com/2023/08/01/luxury-student-apartment-complex-not-open-august-move-in/); follow-up coverage [WUFT, 2023-09-18](https://www.wuft.org/news/2023/09/18/hundreds-of-students-forced-to-live-in-temporary-hotel-rooms-possibly-left-homeless-after-delay-in-promised-housing/) (not read in full). Construction delay is a developer issue; the manager owns the communication. |
| c. 2024 (exact date not confirmed) | Greensboro, NC — The Letterman (student) | Students reported unfinished units, broken lights and missing items at move-in, largely unresolved a week later. | Asset Living said it would get back with an explanation | [WFMY News 2](https://www.wfmynews2.com/article/life/college-students-have-move-in-issues-with-letterman-greensboro-apartments/83-95f7253c-61fd-48b7-ad74-e15140fdf979) (via search summary; 403). |
| 2021 | Houston — a student-oriented building | Roommates reportedly still charged rent after leaving over alleged mold; an Asset Living VP disputed the mold claims. | Disputed | [Houston Chronicle](https://www.houstonchronicle.com/business/article/A-tenants-union-gains-strength-in-aftermath-of-16297854.php) (via search summary; paywalled). |
| 2017 | San Marcos, TX — The Pointe (student) | Repeated move-in delays; students housed in hotels or paid $75/day; the company said compensation averaged over $100/day. | Statement given | [KVUE](https://www.kvue.com/article/news/local/texas-state-students-set-up-in-hotels-after-complex-continuously-delays-move-in/269-484141944) (via search summary; 403). Involves predecessor brand Asset Campus Housing; the summary describes it as owner, which I could not check. Old. |

**Explicitly excluded:** August 2026 delayed student move-ins at Perla (Tallahassee) and Haven on Geddes (Ann Arbor) appeared in my searches, but no source I saw names Asset Living as manager of either. Do not attribute them to Asset Living without checking.

**Inference.** The pattern across 4.2 and 4.3 is not "bad buildings". It is (a) **takeovers** where billing method, fees, portals, leases and concessions change at once and nobody answers questions, and (b) **student move-in** events where the physical problem is someone else's but the communication failure is the manager's. Both are bursty, document-heavy, communication-heavy episodes — which is where an AI layer has leverage.

---

## 5. Where staff time actually goes (role by role)

### 5.1 Important context: Asset Living already has AI at the front of the funnel

A vendor case study states Asset Living uses EliseAI's LeasingAI, Maintenance, Delinquency, VoiceAI and Renewals products; that this "automates 85% of transactional communications across the resident lifecycle"; adds roughly 72-78 hours of monthly capacity per community (the page gives both figures); produced a 591 bps improvement in on-time payment and a 278 bps occupancy gain since early 2025; and that lease audits and AI-guided tours are planned next ([EliseAI customer story, data labelled Q2/Q3 2025](https://eliseai.com/customer-stories/how-asset-living-revamped-lead-nurturing-and-delinquency-management-with-eliseai)). The same page says processes that worked at 70,000 units "strained" at 450,000+. It does not say how many communities are live, and it is vendor marketing.

**Inference.** Prospect follow-up, payment reminders, work-order intake and basic renewal nudges are at least partly covered. A demo that is "an AI leasing/resident chatbot" would duplicate an incumbent. The uncovered ground is the **back-of-house and exception work** below.

### 5.2 Industry time-use baseline

- NAA's "Performance Ecosystem" pulse report (sponsored by AppFolio; article dated 2025-12-10; sample size not stated in the article): property management professionals spend **42% of the week on routine operational work** such as data entry and paperwork and **24% on reactive tasks**; **67% use three or more software logins per day**; 60% believe consolidating tools would improve performance ([AppFolio summary](https://www.appfolio.com/blog/naa-top-challenges-2025)).
- Onsite turnover of 29.2% (33.4% at large firms) means a meaningful share of every team is always new ([NAA/RCLCO](https://naahq.org/news/why-employee-retention-challenges-go-deeper-wages)).
- I did not find a rigorous role-level time-and-motion study. Percentages are not available by role; the "AI-absorbable work" column below is my inference from duty lists.

### 5.3 Role-by-role

| Role | Duties per Asset Living postings (evidence) | Repetitive, high-volume work an AI layer could absorb (inference) | Likely already touched by EliseAI? |
|---|---|---|---|
| **Leasing consultant** | "All aspects of leasing, marketing, and maintaining positive resident relations"; handle leads, appointments, tours, "all necessary follow-up"; respond to leads within 24 hours; complete all leasing paperwork before move-in; keep prospect/traffic logs current; market surveys; assist with lease audits, unit walks and turn (Asset Living postings via job-board search summaries; [TOPS Leasing Specialist](https://job-boards.greenhouse.io/assetliving/jobs/6228437004)) | Lease-file completeness checks and audit prep; market-survey/comp collection; traffic-log hygiene; move-in packet assembly; turn checklists | Lead response and follow-up: yes. Paperwork, audits, surveys: no (lease audits "planned"). |
| **Assistant community manager** | Record all payments; "reconcile receivables daily"; track delinquency, send late notices, contact residents and guarantors, file evictions; post charges including utility bill-backs; month-end closing and reporting; audit resident files; **"walk units after move-outs, post move-out charges, issue statements, and process deposit refunds"** ([ACM posting, Luling TX](https://www.simplyhired.com/job/UWcvepqL2fFUNF0oXbEESSFyMV5a_tch6qSsXrvSBJhaG_5ylSeC8w)) | **Move-out reconciliation and deposit disposition** (inspection to itemised statement to refund, against state deadlines); ledger exception review; bill-back posting checks; guarantor outreach; eviction packet prep; month-end checklists | Payment reminders: yes. Move-out/deposit accounting, ledger audit, month-end: no evidence. |
| **Community / property manager** | Runs daily operations under the Regional Manager; hires, trains and manages staff; fair housing and safety compliance; rent collection, deposit reconciliation, invoice processing, financial reporting, budgets; reviews and approves resident files, leases and renewals; daily property walks; tracks service-request turnaround ([TOPS Senior Community Manager Specialist](https://job-boards.greenhouse.io/assetliving/jobs/6228541004); Community Manager postings via search summary) | Weekly/monthly owner and regional reporting; variance explanations; invoice coding and approval queues; renewal offer prep; **escalated complaint handling and follow-through**; handoff notes when managers change (TOPS explicitly manages "handoffs") | Minimal. |
| **Maintenance supervisor / technician** | Schedule work orders; daily inspections; "maintain accurate records regarding service requests, EPA/OSHA standards, preventative maintenance, apartment make-ready status, work in progress"; walk units to confirm make-ready and work-order completion; direct vendors (Asset Living posting via [CareerBuilder](https://www.careerbuilder.com/job-details/maintenance-supervisor-roy-ut--a5f09b53-c217-49ca-8b20-09b627066745), search summary) | Work-order triage and scheduling; **closure verification** (residents report orders "closed without the problem being resolved"); make-ready board tracking; parts/vendor follow-up; preventative-maintenance logs | Intake and resident updates: yes. Verification, make-ready and turn planning: no evidence. |
| **Regional manager** | Oversees a portfolio off-site, 25-50% travel; "provide monthly written evaluations of significantly over-budget income and expense items"; build annual budgets and forecasts; "approve timely receipt, reconciliation, and coding of vendor invoices"; ensure "ownership financial reports are accurate" and closeout is on time; approve timesheets and salary requests; handle resident complaints; inspections and make-ready walkthroughs ([Regional Manager, Orlando](https://job-boards.greenhouse.io/assetliving/jobs/6237472004)). Portfolio size not stated. | **Monthly variance narratives** and owner-call prep; cross-property KPI exception surfacing; invoice-approval triage; inspection write-ups; complaint escalation tracking; staffing-gap early warning | No evidence. |
| **Operations specialist / portfolio performance specialist** (regional support) | "Prepare property reports weekly, monthly, and quarterly"; collect and review historical income/expense data; "communicate with clients to explain property performance"; gather rent comparables; answer and direct resident calls at corporate level ([Operations Specialist, Denver/SLC, $65-75K](https://job-boards.greenhouse.io/assetliving/jobs/6219312004)). Resident file and insurance audits; respond to resident account issues; market surveys for acquisitions; HR/financial/admin reports ([Portfolio Performance Specialist, removed Nov 2025](https://builtin.com/job/portfolio-performance-specialist/7417134)) | Almost the entire role is assembling recurring reports, comps and audit samples, and fielding escalated resident calls — a human integration layer between systems | No evidence. |
| **Property accountant / senior accountant** | Journal entries, balance-sheet reconciliations; "prepare monthly financial reporting packages ... including performing variance analysis"; improve month-end close and coordination between property and corporate accounting; "newly implemented ERP" ([Senior Accountant, Addison TX](https://job-boards.greenhouse.io/assetliving/jobs/6267305004)). Expired posting: portfolio of 5-10 properties, bank recs, cash management (via search summary; unconfirmed) | Reconciliation matching; first-draft variance commentary; owner-package assembly in each client's format; close-checklist chasing | No evidence. |
| **Accounts payable** | Enter and process invoices for ~15 properties; verify invoices; "research to resolve statements, credits, problem invoices, and disputes" (expired posting via search summary; unconfirmed). AP admin role: mail, check printing, scanning invoices (same caveat) | Invoice capture and coding; duplicate/missing-invoice detection; vendor statement reconciliation; proactive vendor status replies | No evidence. Employee anecdotes of unpaid vendor bills (section 2.2) suggest live pain. |
| **Centralized collections / resident account administrator** | "Lead the delinquency and eviction process, including issuing notices, coordinating legal filings"; "all current and past resident communication regarding delinquency, Deposit Accounting, and dispossessory proceedings for all assigned properties" (postings via search summary; originals returned HTTP 410) | Notice generation by jurisdiction; filing packet prep; former-resident balance and deposit queries | Reminders: yes. Legal workflow and deposit accounting: no evidence. |
| **Affordable compliance specialist** | **Not retrieved** — the postings I found returned 404. Asset Living is hiring heavily in affordable (five Regional Manager, Affordable Housing and two RVP, Affordable roles open on [the board](https://job-boards.greenhouse.io/assetliving) on 2026-11-21) | Generic to the role (not from an Asset Living posting): tenant income certification file review, recertification tracking, agency report prep | Unknown. |
| **Client services / asset reporting** | No dedicated posting found. The function appears spread across Regional Managers, Operations Specialists and property accountants (above). | Owner-facing narrative, ad hoc owner questions, portfolio roll-ups across different PMS platforms | No evidence. |

Named systems in postings: Yardi ([Portfolio Performance Specialist](https://builtin.com/job/portfolio-performance-specialist/7417134)), MRI and OneSite ([Operations Specialist](https://job-boards.greenhouse.io/assetliving/jobs/6219312004)), Entrata (employee review, section 2.2). TOPS floaters must "quickly adapt to each new team's operations, software, and expectations" ([TOPS Leasing Specialist](https://job-boards.greenhouse.io/assetliving/jobs/6228437004)).

**Inference.** Multiple PMS platforms across clients is a structural fact of the business, not a temporary mess. It makes every cross-property task (reporting, audits, floater onboarding, takeovers) a manual integration job. This is the strongest argument for an operating layer *above* the PMS, and it is supported by the company's own "PMS-agnostic" positioning.

---

## 6. Synthesis: ranked pain points

Impact scores are my judgement (H/M/L) on (a) resident churn, (b) owner churn, (c) human capacity. Confidence refers to how well the pain is evidenced *at Asset Living specifically*.

| # | Pain point | (a) Resident | (b) Owner | (c) Capacity | Supporting evidence | Confidence |
|---|---|---|---|---|---|---|
| 1 | **Escalations go unanswered** — no reliable owner of a resident case once it leaves the site | H | M-H | M | 354 of 403 BBB complaints unanswered and BBB cites this as the reason for the F (2026-11-21); "unreturned calls/emails" is a secondary theme in most sampled complaints; Asset Living did not respond to press in Arcata; Operations Specialists "answer and direct resident calls at the corporate level" | **High** that the pattern exists in public channels. Medium on true prevalence (selection bias; some complaints may be handled off-platform). |
| 2 | **Move-out charges, security deposits and application/holding deposits** — slow, unexplained or disputed | M (the resident is already leaving) but H for reviews and reputation | M (legal and reputational exposure sits with the owner too) | H (manual: walk unit, post charges, issue statement, process refund) | About 8 of 28 sampled complaints; 121 BBB "product issues"; Nebraska deposit solicitation (2026-11-12); ACM duty list; dedicated "Deposit Accounting" roles; student turn compresses thousands of move-outs into two weeks | **Medium-high** |
| 3 | **Management-takeover turbulence** — portals, fees, utilities, concessions, leases and staff all change at once | H | H (first 90 days define the owner relationship; takeovers are how Asset Living grows) | H (TOPS floaters, lost leases, re-keyed data) | Arcata 2026; BBB complaints 2026-10-09 and 2026-10-14; Alora 2023; "entire office has turned over" review; 70K to 450K units in about five years | **Medium** — a handful of vivid cases; mechanism is very plausible; no base rate. |
| 4 | **Maintenance follow-through** — slow repairs and work orders closed without a fix | H (strongest renewal driver in industry surveys) | M-H | M | BBB's largest category (136, 34%); "closed without the problem being resolved"; AppFolio 2026 (81% more likely to renew when satisfied). Counter: strong praise at some sites; EliseAI Maintenance already deployed for intake | **Medium-high** on existence; **low** on how much remains unsolved after the existing AI deployment. |
| 5 | **Fee, utility and billing transparency** — third-party utility billing, add-on fees, concessions dropping off, pricing at move-in | M-H | M | M (dispute handling) | About 7 of 28 sampled; 75 BBB billing complaints; Arcata utilities; rent-reporting opt-in complaint. Much of this is owner policy; the manager's controllable part is explanation and accuracy | **Medium** |
| 6 | **Fragmented systems and manual, recurring reporting** | L (indirect) | H (in theory — reporting quality is the classic reason owners switch) | H | "too many systems/websites/programs"; "2 different systems"; NAA: 42% routine + 24% reactive, 67% use 3+ logins; RM "monthly written evaluations"; Operations Specialist weekly/monthly/quarterly reports; PMS varies by client | **Medium** on capacity drain. **Low** on owner dissatisfaction — I found no owner complaining about Asset Living's reporting. |
| 7 | **On-site staffing instability** | M-H | M-H | H | TOPS floating pool exists to cover "staffing gaps, vacancies"; industry 29-33% onsite turnover; review themes of thin staffing; unstaffed office in Arcata | **Medium** — structural indicators are strong; no Asset Living turnover number. |
| 8 | **Student turn and move-in readiness** | H (but concentrated in a few weeks; parents amplify) | H for student owners | H (55+ hour weeks) | Glassdoor turn-hours reviews; Ufora 2023, Letterman c. 2024, The Pointe 2017; student is the flagship division | **Medium** — seasonal, episodic; news cases are few and partly developer-caused. |
| 9 | **Accounts payable / vendor payment friction** | L-M (vendors stop work, so maintenance slows) | M | M-H | Two independent employee anecdotes; "newly implemented ERP"; centralized AP is a marketed feature | **Low-medium** |
| 10 | **Outbound-communication and fair-housing compliance exposure** | L | M | L | TCPA suit (W.D. Tex., reportedly settled); pending FHA/CADA claims in D. Colo. (allegations); Fair Housing knowledge required in every posting | **Low** as a pain point; **high** as a design constraint for any AI that messages residents. |

---

## Implications for which module to demo

These are inferences for discussion, not conclusions.

1. **Do not demo a leasing or resident chatbot.** EliseAI is reportedly already deployed across leasing, maintenance intake, delinquency, voice and renewals. The demo should sit on top of, or behind, that layer.

2. **Strongest single candidate: a resident case-resolution layer ("no escalation goes unanswered").**
   - Directly targets pain #1, the best-evidenced Asset Living-specific problem, and touches #2, #4 and #5 because those are what the unanswered cases are about.
   - Demo shape: ingest a complaint from any channel (BBB, email to corporate, review site, voicemail transcript); pull the resident ledger, work-order history and lease terms from the PMS; classify, assign an owner, draft a factual response for human approval, set an SLA clock, and show a regional or owner-level view of open cases by property.
   - Outcome story is concrete and checkable: unanswered-complaint rate, time to first response, public rating. It also gives owners a visible artefact ("here are the open resident cases at your asset and what we are doing").
   - Risk: it can look like "customer service tooling" rather than an operating layer unless it shows cross-system reasoning.

3. **Strong alternative with clearer capacity ROI: move-out and deposit disposition copilot.**
   - Targets pain #2; heavy in student turn (#8); has state-by-state statutory deadlines, which makes "AI keeps us compliant and fast" easy to explain.
   - Demo shape: inspection photos and notes to itemised, lease-referenced charge statement to refund or balance letter to deadline tracker by state, with a human approval step and a dispute-response draft.
   - Good fit for "releasing human capacity" because the ACM duty list shows it is fully manual today. Weaker direct link to *retention* since the resident is leaving, but strong link to reviews, legal exposure and the next resident's leasing decision.

4. **Most strategically aligned with growth, hardest to demo: takeover / transition copilot.**
   - Targets pain #3 and protects both resident and owner in the first 90 days. Demo shape: reconcile the incoming rent roll against leases (concessions, deposits, utilities terms), flag every resident whose terms change, generate resident-specific transition notices and FAQs, and produce an owner-facing day-30 readiness report.
   - Evidence base is vivid but small. It needs realistic messy input data to be convincing.

5. **Owner reporting / variance-narrative copilot is the best *theoretical* owner-churn lever but the least evidenced here.** The duties are real (RM monthly written variance evaluations; weekly/monthly/quarterly reports; multiple PMS), so the capacity story holds. But I found no public sign that owners are unhappy with Asset Living's reporting. If chosen, frame it as releasing regional-manager capacity and raising manager-to-door ratios, and validate the owner-pain assumption in discovery first.

6. **Design constraints whichever module is chosen:**
   - Human approval on anything sent to a resident; consent and opt-out handling for texts and calls (TCPA exposure); consistent treatment and audit trails (fair housing).
   - Must work across Yardi, Entrata, OneSite/RealPage and MRI, because the PMS is the client's choice.
   - Keep owner-policy decisions (fees, bill-backs, rent) clearly separate from manager execution in the UI — the evidence shows residents and press conflate them, and owners will be sensitive to it.
   - Useful for floaters and new hires: staffing instability means the "user" is often someone in their first week at that property.

---

## Gaps / unverified

**Could not access or complete**

- **Web-search budget exhausted** before I could run further searches. Not done: Reddit (general, r/PropertyManagement, student subreddits), parent Facebook-group-style complaints, ApartmentRatings, Google reviews and Yelp for individual communities, ConsumerAffairs and Trustpilot. Searches that did run returned **no Reddit threads at all**, which reflects search indexing, not an absence of discussion. I found no Trustpilot, ConsumerAffairs or Yelp company profile, but did not check exhaustively.
- **Glassdoor, Indeed, Comparably, Breakroom**: direct fetches returned 403. All ratings and review excerpts from these are via search-result summaries; counts, dates and wording are approximate. Sub-ratings (management, pay, culture) and rating trends over time were not obtained.
- **BBB**: only the first page of complaints and of reviews rendered. Theme frequencies rest on BBB's own type coding plus a 28-item recent convenience sample. BBB's "product issues" category is ambiguous; my reading that it is mostly deposit/refund disputes is based on that small sample.
- **Property-level Google ratings** were not sampled, so I cannot say what share of Asset Living communities are well or poorly rated. This is the largest hole in the resident picture and would be the best counterweight to complaint-channel bias.
- **Job descriptions**: Community Manager, Leasing Consultant, Maintenance Supervisor, Property Accountant, AP Specialist, Centralized Collections and Resident Account Administrator duties come partly or wholly from search summaries of job-board copies (originals 403/404/410). **No Asset Living compliance-specialist or client-services/asset-reporting posting was retrieved.**

**Legal items not verified against primary documents**

- *Haubenreiser*: verdict amounts and disposition come from search summaries of the opinion; claim labels and the reason for dismissal come from a secondary site only.
- *Miller*: remaining-claims status comes from PacerMonitor, whose "last checked" date was internally inconsistent. Check PACER.
- *Parish*: TCPA characterisation, settlement notice and whether it was a putative class action are from a secondary site only.
- *QPG Fountain Apartments*: **claims, ruling on the motion to dismiss and outcome unknown.** I believe First Communities Management was acquired by Asset Living around 2022, but that is from memory and was not verified in this session.
- "Attorney-general investigations active in Texas and Georgia" (Lawfold): **unsupported by any primary source I could find.** Do not repeat as fact.
- Nebraska deposit matter: attorney solicitation only; the corporate relationship between Lund and Asset Living was not confirmed here (Lund's website appears to carry Asset Living branding per search results).
- RealPage private class action defendant list: not checked.
- No search was run on state court dockets (e.g. Harris County), HUD fair-housing charge databases, CFPB complaints, or state AG consumer-complaint databases.

**Not found at all**

- Any public figure for Asset Living client (owner) retention or churn, or any named owner publicly explaining a decision to leave.
- Doors per on-site employee, properties per regional manager, units per accountant, or internal turnover rates.
- Any data-breach or security-incident notice naming Asset Living.
- Any wage-and-hour or EEOC action naming Asset Living.
- A rigorous role-level time-use study for multifamily on-site staff; the NAA/AppFolio figures are self-reported, vendor-sponsored and not role-specific.
- The Zego 2026 Resident Experience Management Report PDF downloaded but could not be parsed; its findings are cited only via secondary coverage.

**News attributions to double-check before using in front of the client**

- Greensboro (The Letterman), Houston (2021) and San Marcos (2017) items were read via search summaries only.
- Perla (Tallahassee) and Haven on Geddes (Ann Arbor) 2026 move-in delays are **not** attributed to Asset Living by any source I saw.
- In Arcata and Oklahoma City, significant parts of the reported problems trace to ownership decisions or to the prior manager.

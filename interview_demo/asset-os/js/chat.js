/*
 * Ask panel: questions about this close, answered from the checks' results.
 *
 * This is a simulated assistant. The checks (js/engine.js) work out every number, and the answers
 * are composed in this file from those results, so they stay true as decisions are made. Nothing
 * is sent anywhere. In production a language model would write the answers from the same results
 * (context() below is what it would be given), and the same figure check would run on its answer.
 */
(function () {
  "use strict";
  var E = window.CloseEngine, money = E.money;
  function $(s) { return document.querySelector(s); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function M() { return window.CloseModule; }

  var open = false, busy = false, thread = [];   // thread: { role, text, check }
  var SHORT = { "Bank reconciliation": "bank_rec", "AP cutoff & accruals": "ap_cutoff", "Rent/AR reconciliation": "rent_ar", "Payroll allocation": "payroll", "Prepaid & deposit roll": "prepaids", "Variance commentary": "commentary", "Owner report draft": "report_draft", "Owner report final": "report_final" };
  var EVIDENCE = { done: "complete", conflict: "marked complete but the data disagrees", late: "late", due: "due today", not_due: "not due yet" };

  // ---------------------------------------------------------------- what the assistant is given

  // The results of the checks, as data. This is everything the assistant knows about the close.
  function context() {
    var C = M(), R = C.R, s = R.summary, st = C.state, cal = s.calendar;
    var decisionOf = function (it) {
      var d = st.decisions[it.id];
      return !d ? "open" : (d.state === "second" ? "waiting for a second reviewer: " : "") + (C.choiceText[d.choice] || d.choice) + " by " + d.by + (d.reason ? " (" + d.reason + ")" : "");
    };
    return {
      close: { period: s.period.label, today: "BD" + s.asOfBD + (cal.asOfDate ? ", " + E.longDate(cal.asOfDate) : ""), owner_reports_due: "BD" + s.ownerReportDay + (cal.dueDate ? ", " + E.longDate(cal.dueDate) : ""), business_days_left_including_today: s.daysLeft },
      policy: { approval_limit: R.cfg.approvalLimit, commentary_required_beyond_percent: Math.round(R.cfg.varianceThreshold * 100), unusual_amount_multiple_of_vendor_usual: R.cfg.outlierMultiple },
      coding: { suggested: R.coding.suggested, average_confidence_percent: Math.round(R.coding.average * 100), differ_from_keyed: R.coding.differ, low_confidence: R.coding.low, threshold_percent: Math.round(R.coding.threshold * 100) },
      register: { invoices: s.invoices, total: Math.round(s.invoiceTotal), flagged: R.items.length, note: "Only flagged invoices are listed below. The rest raised no flag." },
      owner_reports: {
        will_miss_deadline: R.close.properties.filter(function (p) { return p.forecast === "will_slip"; }).length,
        need_fixes_first: R.close.properties.filter(function (p) { return p.forecast === "at_risk"; }).length,
        on_track: R.close.properties.filter(function (p) { return p.forecast === "on_track" || p.forecast === "ready"; }).length
      },
      tracker_vs_evidence: { steps_marked_complete: s.typedComplete, steps_the_data_supports: s.evidenceComplete, steps_contradicted: s.contradictions, steps_marked_complete_ahead_of_an_open_earlier_step: s.late.outOfSequence },
      late_steps: { total: s.late.total, by_step: s.late.byStep.map(function (x) { return { step: x.step, late: x.count, accountants: x.accountants, late_outside_the_accountant_who_is_behind: x.outside }; }) },
      to_hold_before_payment: { invoices: s.hold.count, amount: Math.round(s.hold.amount), what: "likely duplicates and charges to off-boarded properties" },
      flags_by_type: Object.keys(s.byType).map(function (t) { return { type: C.types[t].long, invoices: s.byType[t].count, amount: Math.round(s.byType[t].amount) }; }),
      team: R.close.team.map(function (a) {
        return { accountant: a.name, properties: a.properties.length, units: a.units, steps_done: a.done, steps_late: a.late, steps_due_today: a.dueToday, steps_left: a.remaining, pace_per_day: Math.round(a.pace * 10) / 10, best_day_steps: a.bestDay, behind: a.overloaded, finishes_by_deadline_at_current_pace: a.overloaded ? a.finishBy : a.remaining, holds_every_property_in: a.wholeRegions.map(function (w) { return w.region; }) };
      }),
      suggested_rebalance: {
        moves: R.close.moves.map(function (m) { return { property: m.property.name, from: m.from, to: m.to, steps: m.steps, late_steps: m.late, receiver_steps_left_after: m.toRemaining + m.steps, receiver_room_by_deadline: m.toRoom }; }),
        still_late_even_with_moves: R.close.stuck.map(function (p) { return p.name; }),
        not_asked: R.close.skipped.map(function (k) { return k.name + " (above-average load)"; }),
        basis: "A move goes only to someone caught up, at or below the average load, with room at their best day's rate. The manager decides.",
        to_get_every_report_out: { properties_still_late: R.close.take.properties, steps_left_on_them: R.close.take.steps, accountant_days: R.close.take.accountantDays ? Math.ceil(R.close.take.accountantDays) : null, team_usual_best_day_steps: R.close.take.typicalBestDay, stretch: R.close.take.stretch.map(function (x) { return { property: x.property.name, to: x.to, steps: x.steps }; }) }
      },
      properties: R.close.properties.map(function (p) {
        var steps = {};
        p.steps.forEach(function (x) { steps[SHORT[x.step] || x.step] = EVIDENCE[x.evidence]; });
        return { id: p.id, name: p.name, region: p.region, accountant: p.accountant, forecast: C.forecasts[p.forecast][0], why: p.reasons, steps: steps };
      }),
      flagged_invoices: R.items.map(function (it) {
        var i = it.invoice;
        return { line: i.line, invoice_no: i.invoiceNo, vendor: i.vendor, property: i.property, region: it.region, amount: i.amount, gl: i.gl, description: i.description, dated: E.usDate(i.invoiceDate), received: E.usDate(i.receivedDate), approval_status: i.approval, coded_by: i.codedBy, priority: it.severity,
          issues: it.issues.map(function (x) { return { type: C.types[x.type].label, found: x.title, detail: x.detail, suggested: x.action }; }), decision: decisionOf(it) };
      }),
      variances_needing_commentary: R.variances.map(function (v) {
        var acc = st.commentary[v.id];
        return { property: v.property, category: v.category, accountant: v.accountant, budget: v.budget, actual: v.actual, difference: Math.round(Math.abs(v.diff)), percent: Math.round(Math.abs(v.pct) * 100), direction: v.diff > 0 ? "over" : "under",
          status: v.status === "explained" ? "explained by a flagged invoice" : "the data can't explain it", finding: v.headline, draft_commentary: acc ? acc.text : v.draft, question_for_the_accountant: v.question, approved: acc ? "yes, by " + acc.by : "no" };
      }),
      limits: [
        "The invoice register does not reconcile to the posted actuals (within 10% on " + s.registerTies.within + " of " + s.registerTies.of + " budget lines), so a register total is never used to explain a variance.",
        "There are no invoice documents. An unusual amount could be a keying error or a real project; only the document can tell.",
        "\"Approved\" doesn't say who approved, and the data doesn't say whether an invoice has been paid.",
        "A possible split is a prompt to ask, not a finding.",
        "The tool advises. It has not paid, posted, approved or changed anything."
      ]
    };
  }

  // ---------------------------------------------------------------- the answers

  /*
   * Simulated assistant. In this prototype the answers are composed here, in code, from the
   * checks' current results, so they stay true as decisions are made. In production a language
   * model would write them from the same results (the context() object above is what it would
   * be given), and the figure check below would run on what it wrote.
   */
  function plural(n, one, many) { return n + " " + (n === 1 ? one : (many || one + "s")); }
  function list(a) { return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
  function norm(x) { return String(x).toLowerCase().replace(/\(.*?\)/g, "").replace(/^the\s+/, "").replace(/[^a-z0-9& ]/g, " ").replace(/\s+/g, " ").trim(); }
  function isOpen(it) { var d = M().state.decisions[it.id]; return !d || d.state !== "done"; }
  function has(it, t) { return it.types.indexOf(t) >= 0; }
  // Totals the assistant adds up itself are noted, so the figure check knows where they came from.
  var worked = [];
  function amt(a) { var v = E.sum(a, function (it) { return it.atStake; }); worked.push(v); return v; }
  function invLine(it) { var i = it.invoice; return "line " + i.line + ", " + i.vendor + " at " + i.property + ", " + money(i.amount, true); }

  function aInvoice(it) {
    var i = it.invoice, C = M(), d = C.state.decisions[it.id];
    return "Line " + i.line + " is " + i.invoiceNo + " from " + i.vendor + " for " + i.property + ": " + i.description.toLowerCase() + ", " + money(i.amount, true) + ", dated " + E.usDate(i.invoiceDate) + ", coded by " + i.codedBy + ".\n" +
      it.issues.map(function (x) { return "- " + x.title + ". " + x.detail + " Suggested: " + x.action; }).join("\n") + "\n" +
      (d ? "Decision so far: " + (d.state === "second" ? "waiting for a second reviewer. " : "") + C.choiceText[d.choice] + ", by " + d.by + "." : "No decision has been recorded yet.");
  }
  function aProperty(p) {
    var R = M().R, f = M().forecasts[p.forecast][0];
    var mine = R.items.filter(function (it) { return it.invoice.propertyId === p.id && isOpen(it); });
    var out = p.name + " (" + p.region + ", " + p.accountant + ") is \"" + f + "\".";
    if (!p.reasons.length) out += " Nothing is open against it: no late steps, no contradicted steps and no high-priority invoices.";
    else out += "\n" + p.reasons.map(function (r) { return "- " + r; }).join("\n");
    if (mine.length) out += "\nOpen flagged invoices: " + mine.map(function (it) { return "line " + it.invoice.line + " (" + it.invoice.vendor + ", " + money(it.invoice.amount) + ", " + it.types.map(function (t) { return M().types[t].label.toLowerCase(); }).join(" and ") + ")"; }).join("; ") + ".";
    if (p.moveTo) out += "\nThe suggested rebalance moves it to " + p.moveTo + ".";
    return out;
  }
  function aVariance(v) {
    var acc = M().state.commentary[v.id];
    var out = v.property + " " + v.category + " is " + money(v.actual) + " against a " + money(v.budget) + " budget, " + E.pct(v.pct) + " " + (v.diff > 0 ? "over" : "under") + ".";
    if (v.status === "explained") out += " " + v.effects.map(function (e) { return money(Math.abs(e.amount)) + " of it is " + e.why + " (line " + e.line + ")"; }).join("; ") + ". Without that it would be " + money(Math.abs(v.adjusted - v.budget)) + " " + (v.adjusted > v.budget ? "over" : "under") + " budget. Someone has to decide that invoice before the commentary can go to the owner.";
    else out += " The data can't explain it, and I won't guess. " + (v.invoices.length ? "The register holds " + money(v.register) + " of invoices for this line against " + money(v.actual) + " posted, and no flagged invoice closes the gap." : "There are no " + v.category.toLowerCase() + " invoices for this property in the register.") + "\nThe question drafted for " + v.accountant + ": \"" + v.question + "\"";
    return out + (acc ? "\nCommentary was approved by " + acc.by + "." : "");
  }
  function aPerson(a) {
    var R = M().R, s = R.summary;
    var out = a.name + " has " + plural(a.properties.length, "property", "properties") + " (" + a.units.toLocaleString("en-US") + " units): " + a.done + " steps done, " + a.late + " late, " + a.dueToday + " due today, " + a.remaining + " left.";
    if (a.overloaded) {
      out += " At the current pace about " + a.finishBy + " of those " + a.remaining + " get done by BD" + s.ownerReportDay + ".";
      var mv = R.close.moves.filter(function (m) { return m.from === a.name; });
      if (mv.length) out += "\nSuggested moves:\n" + mv.map(function (m) { return "- " + m.property.name + " to " + m.to + " (" + m.steps + " steps, " + m.late + " late)"; }).join("\n");
      if (a.wholeRegions.length) out += "\n" + a.name + " holds every " + a.wholeRegions.map(function (w) { return w.region; }).join(" and ") + " property, so check for a regional cause before treating it as one person's problem.";
    } else {
      out += " Caught up. Best day this close: " + a.bestDay + " steps.";
      var got = R.close.moves.filter(function (m) { return m.to === a.name; });
      if (got.length) out += " The suggested rebalance would add " + got.map(function (m) { return m.property.name + " (" + m.steps + " steps)"; }).join(" and ") + ", taking " + a.name + " to " + (got[0].toRemaining + got[0].steps) + " steps left against room for about " + got[0].toRoom + ".";
      if (R.close.skipped.some(function (k) { return k.name === a.name; })) out += " Not asked to take more: that is already an above-average load.";
    }
    return out;
  }
  function aRegion(name) {
    var R = M().R, ps = R.close.properties.filter(function (p) { return p.region === name; });
    var slip = ps.filter(function (p) { return p.forecast === "will_slip"; }), risk = ps.filter(function (p) { return p.forecast === "at_risk"; });
    var its = R.items.filter(function (it) { return it.region === name && isOpen(it); });
    return name + " has " + plural(ps.length, "property", "properties") + ": " + slip.length + " will miss BD" + R.summary.ownerReportDay + ", " + risk.length + " need fixes first and " + (ps.length - slip.length - risk.length) + " on track." +
      (slip.length ? "\nWill miss: " + list(slip.map(function (p) { return p.name; })) + "." : "") +
      (its.length ? "\n" + plural(its.length, "flagged invoice") + " open, " + money(amt(its)) + ". The largest is " + invLine(its[0]) + "." : "\nNo flagged invoices are open.");
  }

  function answer(q) {
    var C = M(), R = C.R, s = R.summary, st = C.state, t = " " + norm(q) + " ";
    var props = R.close.properties, team = R.close.team, open = R.items.filter(isOpen);
    var of = function (type) { return open.filter(function (it) { return has(it, type); }); };
    var hold = open.filter(function (it) { return has(it, "duplicate") || has(it, "offboarded"); });
    var slip = props.filter(function (p) { return p.forecast === "will_slip"; }), risk = props.filter(function (p) { return p.forecast === "at_risk"; });
    var behind = team.filter(function (a) { return a.overloaded; }), top = s.late.top;
    var vOpen = R.variances.filter(function (v) { return !st.commentary[v.id]; });
    var due = "BD" + s.ownerReportDay;
    var says = function (re) { return re.test(t); };

    // Something specific: an invoice, a property, a vendor, a person, a region.
    var m = t.match(/\bline\s*#?\s*(\d+)/) || t.match(/\binv\s*(\d{4,})/);
    if (m) {
      var it = R.items.find(function (x) { return String(x.invoice.line) === m[1] || x.invoice.invoiceNo.replace(/\D/g, "") === m[1]; });
      return it ? aInvoice(it) : "Line " + m[1] + " raised no flag. Only the " + R.items.length + " flagged invoices need a person.";
    }
    var p = props.filter(function (x) { return t.indexOf(" " + norm(x.name) + " ") >= 0; }).sort(function (a, b) { return b.name.length - a.name.length; })[0];
    var vendors = {}; R.items.forEach(function (x) { vendors[x.invoice.vendor] = 1; });
    var vendor = Object.keys(vendors).filter(function (v) { return t.indexOf(" " + norm(v) + " ") >= 0 || t.indexOf(" " + norm(v).split(" ").slice(0, 2).join(" ") + " ") >= 0 || (norm(v).split(" ")[0].length > 4 && t.indexOf(" " + norm(v).split(" ")[0] + " ") >= 0); })[0];
    if (vendor) {
      var vi = R.items.filter(function (x) { return x.invoice.vendor === vendor && (!p || x.invoice.propertyId === p.id); });
      if (vi.length === 1) return aInvoice(vi[0]);
      if (vi.length) return plural(vi.length, "flagged invoice") + " from " + vendor + ", " + money(amt(vi)) + ":\n" + vi.map(function (x) { return "- Line " + x.invoice.line + ", " + x.invoice.property + ", " + money(x.invoice.amount, true) + ": " + x.issues[0].title; }).join("\n");
    }
    if (p) {
      var pv = R.variances.filter(function (v) { return v.propertyId === p.id; });
      var named = pv.filter(function (v) { return t.indexOf(" " + norm(v.category) + " ") >= 0; })[0];
      if (named || (pv.length && says(/explain|variance|commentary|budget/))) return aVariance(named || pv[0]);
      return aProperty(p);
    }
    var person = team.filter(function (a) { return t.indexOf(" " + norm(a.name).split(" ").pop() + " ") >= 0; })[0];
    if (person && !says(/controller|owner/)) {
      if (says(/move|what happens|rebalanc/) && person.overloaded) return aRebalance();
      return aPerson(person);
    }
    var regions = {}; props.forEach(function (x) { regions[x.region] = 1; });
    var region = Object.keys(regions).filter(function (r) { return t.indexOf(" " + norm(r) + " ") >= 0; })[0];
    if (region) return aRegion(region);

    function aRebalance() {
      if (!R.close.moves.length) return "No rebalance is suggested: nobody is behind pace.";
      var stuck = R.close.stuck;
      return "The suggested moves:\n" + R.close.moves.map(function (mv) { return "- " + mv.property.name + " from " + mv.from + " to " + mv.to + ": " + mv.steps + " steps. " + mv.to + " goes to " + (mv.toRemaining + mv.steps) + " steps left against room for about " + mv.toRoom + "."; }).join("\n") +
        "\nRoom is judged by each person's best day this close, so it is an estimate, not a promise." +
        (stuck.length ? "\nEven with the moves, " + list(stuck.map(function (x) { return x.name; })) + " " + (stuck.length > 1 ? "are" : "is") + " likely to be late. Those owners should hear today." : "") +
        (R.close.skipped.length ? "\n" + R.close.skipped.map(function (k) { return k.name; }).join(" and ") + " isn't asked: already an above-average load." : "");
    }

    // Drafts.
    if (says(/controller|two line|update for/) && !says(/decision/)) return "Draft for the Controller:\n\n" + s.period.short + " close, BD" + s.asOfBD + ": " + slip.length + " owner reports will miss " + due + " at the current pace" + (behind.length ? ", all " + behind.map(function (a) { return a.name; }).join(" and ") + "'s" : "") + ", and " + risk.length + " more need fixes first. " + money(amt(hold)) + " is on hold before the next payment run (" + of("duplicate").length + " likely duplicates, " + of("offboarded").length + " charges to off-boarded properties)." +
      (top && top.accountants.length > 1 ? " " + top.step + " is late at " + top.count + " properties across " + top.accountants.length + " accountants, which looks like a shared blocker." : "");
    if (says(/owner/) && says(/note|draft|late|tell/)) {
      var late = R.close.stuck.length ? R.close.stuck : slip;
      return "Draft, one per owner. Applies to " + list(late.map(function (x) { return x.name; })) + ":\n\nYour " + s.period.label + " report is due " + (s.calendar.dueDate ? E.longDate(s.calendar.dueDate) : due) + ". It will be late. We are still completing the month-end reconciliations for your property and would rather send you numbers we stand behind than send them on time. I will confirm a delivery date by end of day tomorrow.\n\nI have left the reason general. The data shows the steps are late, not why.";
    }
    if (says(/decision/)) {
      var done = R.items.filter(function (x) { return !isOpen(x); }), ap = R.variances.filter(function (v) { return st.commentary[v.id]; });
      if (!done.length && !ap.length) return "No decisions have been recorded yet. " + plural(R.items.length, "flagged invoice") + " and " + plural(R.variances.length, "commentary", "commentaries") + " are open.";
      return plural(done.length, "invoice decision") + " and " + plural(ap.length, "commentary approval") + " so far:\n" + done.map(function (x) { var d = st.decisions[x.id]; return "- Line " + x.invoice.line + ", " + x.invoice.vendor + ", " + money(x.invoice.amount, true) + ": " + C.choiceText[d.choice] + ", by " + d.by + (d.second ? " and " + d.second.by : ""); }).concat(ap.map(function (v) { return "- " + v.property + " " + v.category + " commentary approved by " + st.commentary[v.id].by; })).join("\n");
    }
    if (says(/regional manager/)) {
      var ap2 = of("approval"), byR = {};
      ap2.forEach(function (x) { (byR[x.region] = byR[x.region] || []).push(x); });
      return plural(ap2.length, "invoice") + " over " + money(R.cfg.approvalLimit) + ", " + money(amt(ap2)) + ", " + (ap2.length === 1 ? "is" : "are") + " waiting on a Regional Manager. Start with the ones that are far above what the vendor usually bills:\n" + Object.keys(byR).sort().map(function (r) { return "- " + r + ": " + byR[r].map(function (x) { return x.invoice.vendor + " at " + x.invoice.property + ", " + money(x.invoice.amount) + (has(x, "outlier") ? " (unusual)" : ""); }).join("; "); }).join("\n");
    }

    // The close.
    if (says(/first|priorit|this morning|do today|start/) && !says(/region/)) {
      var a = [];
      if (hold.length) a.push("Hold " + plural(hold.length, "payment") + ", " + money(amt(hold)) + ", before the next payment run. Money that leaves is hard to get back, so this comes first.");
      if (of("outlier").length) a.push("Get someone to look at the " + plural(of("outlier").length, "unusual invoice") + ", " + money(amt(of("outlier"))) + ", before a Regional Manager approves them.");
      if (behind.length) a.push("Decide on the rebalance for " + behind.map(function (x) { return x.name; }).join(" and ") + ". Every hour it waits costs steps before " + due + ".");
      if (top && top.accountants.length > 1) a.push("Find out why " + top.step.toLowerCase() + " is late at " + top.count + " properties across " + top.accountants.length + " accountants.");
      if (vOpen.length) a.push("Send the " + plural(vOpen.filter(function (v) { return v.status !== "explained"; }).length, "drafted question") + " to the accountants, so the answers are back before commentary is due.");
      return a.length ? "In this order:\n" + a.map(function (x) { return "- " + x; }).join("\n") + "\nCoding fixes and the August invoices matter for the owner reports, but nothing is lost if they wait until this afternoon." : "Nothing is left to act on. Every flag has a decision.";
    }
    if (says(/three sentences|summar|overview|where do we stand/)) return slip.length + " owner reports will miss " + due + " at the current pace, " + risk.length + " more need fixes first and " + (props.length - slip.length - risk.length) + " are on track. " + money(amt(hold)) + " should be held before the next payment run, and " + money(amt(of("approval"))) + " is waiting on Regional Manager approval. The tracker shows " + s.typedComplete + " steps complete, but the data supports " + s.evidenceComplete + ".";
    if (says(/dollar risk|biggest risk|exposure|most money/)) { var big = open[0]; return "By dollars: " + money(amt(of("approval"))) + " in " + plural(of("approval").length, "invoice") + " over the limit and not approved, " + of("outlier").length + " of them unusual for the vendor. Then " + money(amt(hold)) + " to hold as likely duplicates or off-boarded charges." + (big ? " The single largest open item is " + invLine(big) + ": " + big.issues[0].title.toLowerCase() + "." : ""); }
    if (says(/region needs|which region/)) {
      var rs = Object.keys(regions).map(function (r) { var ps = props.filter(function (x) { return x.region === r; }); return { r: r, n: ps.length, slip: ps.filter(function (x) { return x.forecast === "will_slip"; }).length, risk: ps.filter(function (x) { return x.forecast === "at_risk"; }).length }; }).sort(function (x, y) { return y.slip - x.slip || y.risk - x.risk; });
      return rs[0].r + " first: " + rs[0].slip + " of its " + rs[0].n + " owner reports will miss " + due + (rs[0].risk ? " and " + rs[0].risk + " more need fixes" : "") + ". Then " + rs.slice(1, 3).map(function (x) { return x.r + " (" + x.slip + " will miss, " + x.risk + " need fixes)"; }).join(" and ") + ".";
    }
    if (says(/bank|stuck|shared|bottleneck/)) {
      if (!top) return "No steps are late.";
      return s.late.total + " steps are late. " + top.step + " accounts for " + top.count + ", across " + top.accountants.length + " accountants (" + list(top.accountants) + ")." + (s.late.outside && s.late.outside === top.outside ? " It is the only step that is late outside " + s.late.behind.join(" and ") + "'s properties." : "") + (top.accountants.length > 1 ? " One step late for several people points to a shared cause, such as bank statements or bank access, not to one person. The data shows it is late, not why." : "") + "\nBy step:\n" + s.late.byStep.map(function (x) { return "- " + x.step + ": " + x.count + " late"; }).join("\n");
    }
    if (says(/miss|slip|why will|late report/)) {
      if (!slip.length) return "No owner report is forecast to miss " + due + ".";
      return slip.length + " reports will miss " + due + " because they all sit with " + list(behind.map(function (x) { return x.name; })) + ". " + behind.map(function (x) { return x.name + " has finished " + x.done + " steps in " + s.asOfBD + " business days and has " + x.remaining + " left; at that pace about " + x.finishBy + " get done by " + due + "."; }).join(" ") + "\nThe properties: " + list(slip.map(function (x) { return x.name; })) + ".\nThe data shows who is behind, not why.";
    }
    if (says(/what would it take|take to|all 38|every report|more hands|extra hands|bring in help|temp /)) {
      var tk = R.close.take;
      if (!tk.properties) return "Nothing more is needed: no report is forecast late after the suggested moves.";
      var byWho = {};
      tk.stretch.forEach(function (x) { (byWho[x.to] = byWho[x.to] || []).push(x.property.name); });
      return "After the suggested moves, " + plural(tk.properties, "property", "properties") + " would still be late, with " + tk.steps + " steps left between them. That is about " + plural(Math.ceil(tk.accountantDays), "accountant-day") + " of work at the team's usual best-day rate (" + tk.typicalBestDay + " steps).\n- Stretch the team: " + (Object.keys(byWho).length ? Object.keys(byWho).map(function (n) { return n + " takes " + list(byWho[n]); }).join("; ") + ". On paper that " + (tk.uncovered.length ? "still leaves " + list(tk.uncovered.map(function (x) { return x.name; })) + " late" : "covers all of them, with no slack") + ", and it leans on people already carrying the most." : "no one has room at their best day's rate.") + "\n- Bring in help: about " + plural(Math.ceil(tk.accountantDays), "accountant-day") + " from another team or a temp, starting today.\nIf neither is possible, those owners should hear today.";
    }
    if (says(/confiden|auto ?cod|suggested gl|suggest.* code/)) return "Every one of the " + R.coding.suggested + " invoices gets a suggested GL code, from how the other invoices with the same description are coded. Average confidence is " + Math.round(R.coding.average * 100) + "%. " + R.coding.differ + " suggestions differ from the code that was keyed, and those are the coding flags in AP review. " + (R.coding.low ? R.coding.low + " fall below the " + Math.round(R.coding.threshold * 100) + "% threshold and go to a person." : "None fall below the " + Math.round(R.coding.threshold * 100) + "% threshold this month.");
    if (says(/move|rebalanc|room|who can help/)) return aRebalance();
    if (says(/tracker|evidence|contradict/)) return "The tracker shows " + s.typedComplete + " steps complete. The data supports " + s.evidenceComplete + ". " + s.contradictions + " are contradicted: AP cutoff marked done with August invoices still in the register, commentary marked done where it is required and not written or where an earlier step is open, and steps dated complete on a day that hasn't happened yet.";

    // Invoices.
    if (says(/how does|how do you/) && says(/duplicate/)) return "Two invoices are treated as likely duplicates when the vendor and amount are the same and the invoice numbers match once \"INV-\" and punctuation are ignored. That last part matters: " + R.items.filter(function (x) { return has(x, "duplicate") && !x.issues[0].exact; }).length + " of the " + s.byType.duplicate.count + " found were keyed two ways, like \"89455\" and \"INV-89455\", which an exact match misses.";
    if (says(/keying|unusual|outlier/)) { var o = of("outlier"); return o.length ? plural(o.length, "invoice") + " " + (o.length > 1 ? "are" : "is") + " far above what the vendor usually bills:\n" + o.map(function (x) { var u = x.issues.find(function (y) { return y.type === "outlier"; }); return "- " + x.invoice.vendor + " at " + x.invoice.property + ": " + money(x.invoice.amount, true) + " against a usual " + money(u.median) + ", about " + Math.round(u.multiple) + " times"; }).join("\n") + "\nA keying error and a real one-off project look the same in this data. Only the invoice document can tell them apart." : "No unusual amounts are open."; }
    if (says(/duplicate/)) { var d2 = of("duplicate"); return d2.length ? plural(d2.length, "likely duplicate") + ", " + money(amt(d2)) + ":\n" + d2.map(function (x) { return "- Line " + x.invoice.line + ", " + x.invoice.vendor + " at " + x.invoice.property + ", " + money(x.invoice.amount, true) + " (copy of line " + x.issues[0].related[0] + ")"; }).join("\n") : "No duplicates are open."; }
    if (says(/split/)) { var sp = of("split"); return sp.length ? plural(sp.length, "invoice") + ", " + money(amt(sp)) + ", may be split under the " + money(R.cfg.approvalLimit) + " limit:\n" + sp.map(function (x) { return "- Line " + x.invoice.line + ", " + x.invoice.vendor + " at " + x.invoice.property + ", " + money(x.invoice.amount, true); }).join("\n") + "\nThis is a prompt to ask, not a finding. Two bills on one day can be two meters." : "No possible splits are open."; }
    if (says(/off ?board/)) { var ob = of("offboarded"); return ob.length ? plural(ob.length, "charge") + ", " + money(amt(ob)) + ", to properties that are no longer managed:\n" + ob.map(function (x) { return "- Line " + x.invoice.line + ", " + x.invoice.vendor + " at " + x.invoice.property + ", " + money(x.invoice.amount, true); }).join("\n") : "No off-boarded charges are open."; }
    if (says(/coding|gl code|miscod|recode/)) { var mc = of("miscoded"); return mc.length ? plural(mc.length, "invoice") + ", " + money(amt(mc)) + ", " + (mc.length > 1 ? "are" : "is") + " coded differently from how the same description is usually coded:\n" + mc.slice(0, 6).map(function (x) { return "- Line " + x.invoice.line + ": " + x.issues.find(function (y) { return y.type === "miscoded"; }).title.toLowerCase() + ", " + money(x.invoice.amount, true); }).join("\n") + (mc.length > 6 ? "\n- and " + (mc.length - 6) + " more" : "") : "No coding flags are open."; }
    if (says(/august|prior period|cutoff/)) { var pp = of("prior_period"); return pp.length ? plural(pp.length, "invoice") + " dated in " + R.model.priorMonth + ", " + money(amt(pp)) + ", " + (pp.length > 1 ? "are" : "is") + " in " + s.period.short + "'s register. For each one the question is whether it was accrued in " + R.model.priorMonth + ": if it was, reverse it here; if not, it stays and the commentary should say so." : "No prior-period invoices are open."; }
    if (says(/can wait|after bd|not urgent/)) { var med = open.filter(function (x) { return x.severity !== "high"; }); return plural(med.length, "flagged invoice") + ", " + money(amt(med)) + ", " + (med.length === 1 ? "is" : "are") + " medium priority: mostly coding, " + R.model.priorMonth + " invoices and possible splits. None of them pays out wrongly if it waits a day. But coding and prior-period fixes change the owner report, so they can't wait past the draft on BD" + (s.ownerReportDay - 1) + "."; }
    if (says(/hold/)) return hold.length ? "Hold " + plural(hold.length, "payment") + ", " + money(amt(hold)) + ": " + of("duplicate").length + " likely duplicates and " + of("offboarded").length + " charges to off-boarded properties. The largest is " + invLine(hold[0]) + "." : "Nothing is left to hold.";
    if (says(/matter most|most important|which flag/)) return "The " + plural(R.items.filter(function (x) { return x.severity === "high" && isOpen(x); }).length, "high-priority flag") + ", in dollar order. Top three:\n" + open.slice(0, 3).map(function (x) { return "- " + invLine(x) + ": " + x.issues[0].title.toLowerCase(); }).join("\n");

    // Commentary.
    if (says(/site team|need from|from whom|who do i ask/)) { var un = vOpen.filter(function (v) { return v.status !== "explained"; }); return un.length ? plural(un.length, "variance") + " need a cause from a person:\n" + un.map(function (v) { return "- " + v.accountant + ": " + v.property + " " + v.category + ", " + E.pct(v.pct) + " " + (v.diff > 0 ? "over" : "under"); }).join("\n") + "\nA question is drafted for each one on the Commentary tab." : "Nothing is outstanding from the site teams."; }
    if (says(/worr|biggest variance|largest variance/)) { var w = R.variances.slice().sort(function (x, y) { return Math.abs(y.diff) - Math.abs(x.diff); })[0]; return w ? "By dollars, " + aVariance(w) : "No variances need commentary."; }
    if (says(/ready to approve|commentary|variance/) && !says(/register/)) return plural(R.variances.length, "category", "categories") + " need commentary; " + (R.variances.length - vOpen.length) + " approved so far.\n" + R.variances.map(function (v) { return "- " + v.property + " " + v.category + " (" + E.pct(v.pct) + " " + (v.diff > 0 ? "over" : "under") + "): " + (st.commentary[v.id] ? "approved" : v.status === "explained" ? "accounted for by a flagged invoice; decide that invoice, then approve" : "the data can't explain it; needs a cause from " + v.accountant); }).join("\n");

    // The tool itself, and intake.
    if (says(/can t|cannot|limit|not tell|doesn t know/) && !says(/intake|document/)) return "Things this data can't tell me:\n- Whether an unusual amount is a keying error or a real project. There are no invoice documents.\n- Who approved an invoice marked Approved, or whether it has been paid.\n- Why a step is late. I can see that it is.\n- The cause of a variance the invoices don't explain. I draft the question and a person answers it.";
    if (says(/register/)) return "The invoice register doesn't reconcile to the posted actuals: it is within 10% of the posted figure on only " + s.registerTies.within + " of " + s.registerTies.of + " budget lines. So a register total is never used to explain a variance. Only a specific flagged invoice is, which is why most variances come back as \"can't explain\" with a question attached.";
    if (says(/cheapest|sat|how long|sooner|intake|document/)) {
      var cal = s.calendar.asOfDate, w2 = R.items.filter(function (x) { return x.invoice.receivedDate && cal; }).map(function (x) { return Math.round((new Date(cal) - new Date(x.invoice.receivedDate)) / 86400000); });
      var avg = w2.length ? Math.round(E.sum(w2) / w2.length) : null;
      if (says(/document/)) return "Without reading the invoice itself, intake can't confirm the amount on an unusual bill, the service dates behind a prior-period invoice, or whether two bills on one day are one job. It can still stop duplicates, off-boarded properties, coding exceptions and anything over the approval limit, because those only need the register fields.";
      if (says(/cheapest/)) return "The " + s.byType.duplicate.count + " duplicates and " + s.byType.offboarded.count + " off-boarded charges, " + money(s.hold.amount) + " together. They need no judgment: the invoice number has been seen before, or the property left the portfolio. Stopping them at the door means nobody has to recover a payment later.";
      return "The " + R.items.length + " flagged invoices sat an average of " + avg + " days between arriving and being caught at close on BD" + s.asOfBD + ". At intake each would have stopped on the day it arrived.";
    }

    return "I can answer from this close's results: a property, an invoice (try \"line 282\"), a vendor, an accountant or a region, or questions like \"what should I do first?\", \"why will reports miss " + due + "?\" or \"which commentary is ready to approve?\". I don't have anything in the results that answers that one.";
  }

  // ---------------------------------------------------------------- suggested questions

  function where() {
    var parts = location.hash.replace(/^#\/?/, "").split("/");
    var pg = parts[0] || "close";
    return pg === "close" ? "close/" + (M().state.tab || "briefing") : pg;
  }
  var PAGE_NAME = { "close/briefing": "the morning briefing", "close/ap": "AP review", "close/commentary": "variance commentary", "close/close": "close status", "close/outputs": "outputs", "close/how": "how it works", home: "the executive view", payables: "invoice intake", platform: "how the OS fits" };

  function suggestions() {
    var R = M().R, s = R.summary, w = where();
    var slip = R.close.properties.filter(function (p) { return p.forecast === "will_slip"; }).length;
    var behind = R.close.team.filter(function (a) { return a.overloaded; })[0];
    var risky = R.close.properties.filter(function (p) { return p.forecast === "at_risk"; })[0];
    var topItem = R.items[0], unexplained = R.variances.filter(function (v) { return v.status !== "explained"; })[0];
    var top = s.late.top;
    var by = {
      "close/briefing": ["What should I do first this morning, and why?", "Why will " + slip + " owner reports miss BD" + s.ownerReportDay + "?", "Draft a two-line update for the Controller."],
      "close/ap": [topItem ? "Explain the " + topItem.invoice.vendor + " flag at " + topItem.invoice.property + "." : "Which flags matter most?", "Which flagged invoices could be keying errors?", "Which of these can wait until after BD" + s.ownerReportDay + "?"],
      "close/commentary": [unexplained ? "Why can't " + unexplained.property + " " + unexplained.category + " be explained?" : "Which commentary is ready to approve?", "What do I need from the site teams, and from whom?", "Which variance worries you most?"],
      "close/close": [risky ? "Why is " + risky.name + " at risk?" : "Which properties are at risk?", top ? "Is " + top.step.toLowerCase() + " a shared problem or one person's?" : "Where is the close stuck?", behind ? "What would it take to get every report out by BD" + s.ownerReportDay + "?" : "Who has room to help?"],
      "close/outputs": ["Draft a note to the owners whose reports will be late.", "Summarize today's decisions for the Controller.", "What should the Regional Managers look at first?"],
      "close/how": ["What can't this tool tell me?", "How does the duplicate check work?", "Why doesn't the invoice register explain most variances?"],
      home: ["Which region needs attention first?", "Give me the close in three sentences.", "What is the biggest dollar risk today?"],
      payables: ["Which of these would have been cheapest to stop at intake?", "How confident is the automatic coding?", "What can't be checked at intake without the invoice document?"],
      platform: ["Give me the close in three sentences.", "What is the biggest dollar risk today?", "What should I do first this morning?"]
    };
    return by[w] || by["close/briefing"];
  }

  // ---------------------------------------------------------------- the panel

  function fmt(text) {
    return esc(text).split("\n").map(function (line) {
      var l = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      if (/^\s*[-•]\s+/.test(l)) return '<div class="flex gap-2"><span aria-hidden="true">•</span><span>' + l.replace(/^\s*[-•]\s+/, "") + "</span></div>";
      return l.trim() ? "<p>" + l + "</p>" : "";
    }).join("");
  }

  function bubble(m) {
    if (m.role === "user") return '<div class="flex justify-end"><div class="max-w-[85%] rounded-2xl rounded-br-sm bg-al-deep text-white px-3.5 py-2 text-sm">' + esc(m.text) + "</div></div>";
    var c = m.check, note = "";
    if (c && c.checked && !m.typing) note = c.ok
      ? '<div class="mt-1.5 text-xs text-al-good font-semibold">All ' + c.checked + " figures match the close results</div>"
      : '<div class="mt-1.5 text-xs text-al-amber"><span class="font-semibold">Not in the results as written: ' + esc(c.unknown.join(", ")) + ".</span> Check it before you use it.</div>";
    return '<div class="max-w-[92%]"><div class="rounded-2xl rounded-bl-sm bg-al-cream border border-al-sand px-3.5 py-2.5 text-sm space-y-2">' + fmt(m.typing ? m.shown : m.text) + "</div>" + note + "</div>";
  }

  function render() {
    var C = M(), el = $("#chat");
    if (!el || !C || !C.R) return;
    el.innerHTML = '<div class="flex items-center justify-between gap-3 px-4 h-14 sm:h-16 shrink-0 border-b border-al-sand"><div><div class="font-semibold text-al-deep">Ask about this close</div><div class="text-xs text-al-navy/60">Answers from the close results</div></div>' +
      '<div class="flex items-center gap-1">' + (thread.length ? '<button type="button" data-chat-clear class="text-xs px-2 py-1 rounded-md text-al-navy/60 hover:bg-al-light">Clear</button>' : "") +
      '<button type="button" data-chat-close aria-label="Close the panel" class="p-2 rounded-md hover:bg-al-light"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div></div>' +
      '<div id="chat-log" class="flex-1 overflow-y-auto p-4 space-y-3">' +
      (thread.length ? thread.map(bubble).join("") : '<p class="text-sm text-al-navy/70">Ask about anything on this screen: a property, an invoice, a person, or what to do next.</p>') +
      (busy === "thinking" ? '<div class="inline-flex gap-1 rounded-2xl rounded-bl-sm bg-al-cream border border-al-sand px-3.5 py-3" aria-label="Working"><span class="w-1.5 h-1.5 rounded-full bg-al-greyblue animate-pulse"></span><span class="w-1.5 h-1.5 rounded-full bg-al-greyblue animate-pulse"></span><span class="w-1.5 h-1.5 rounded-full bg-al-greyblue animate-pulse"></span></div>' : "") + "</div>" +
      '<div class="border-t border-al-sand p-3 space-y-2">' +
      '<div class="text-[11px] uppercase tracking-widest text-al-navy/50">Suggested for ' + esc(PAGE_NAME[where()] || "this page") + "</div>" +
      '<div class="flex flex-wrap gap-1.5">' + suggestions().map(function (q) { return '<button type="button" data-chat-q="' + esc(q) + '"' + (busy ? " disabled" : "") + ' class="text-left text-xs px-2.5 py-1.5 rounded-full border border-al-deep/30 text-al-deep hover:bg-al-cream disabled:opacity-40">' + esc(q) + "</button>"; }).join("") + "</div>" +
      '<form data-chat-form class="flex gap-2 pt-1"><input name="q" autocomplete="off" class="flex-1 min-w-0 border border-al-sand px-2.5 py-2 text-sm" placeholder="Ask about this close"' + (busy ? " disabled" : "") + '><button class="px-3 py-2 text-sm font-semibold rounded-md bg-al-deep text-white hover:bg-al-navy disabled:opacity-40"' + (busy ? " disabled" : "") + ">Ask</button></form></div>";
    var log = $("#chat-log");
    if (log) log.scrollTop = log.scrollHeight;
  }

  function touch() { return !!(window.matchMedia && matchMedia("(pointer: coarse)").matches); }
  function toggle(on) {
    open = on;
    var el = $("#chat");
    // Slides in from the right; "invisible" (applied after the slide-out) keeps it out of the tab order when closed.
    el.classList.toggle("translate-x-full", !on);
    el.classList.toggle("invisible", !on);
    // On wide screens the page makes room for the panel instead of sitting under it.
    $("#main").classList.toggle("xl:pr-[26rem]", on);
    $("#chat-btn").setAttribute("aria-expanded", String(on));
    document.body.classList.toggle("chat-open", on);   // on a phone the panel fills the screen
    // No autofocus on a touch screen: the keyboard would cover the suggested questions.
    if (on) { render(); var inp = $("#chat [name=q]"); if (inp && !touch()) inp.focus(); }
  }

  // ---------------------------------------------------------------- asking

  // An answer plus its figure check: every number must be in the results, or a total worked out from them.
  function reply(q) {
    var text;
    worked = [];
    try { text = answer(q); } catch (e) { text = "I couldn't work that one out from the results."; console.error(e); }
    return { text: text, check: E.groundingCheck(text, { results: context(), question: q, worked: worked }) };
  }

  function ask(q) {
    q = String(q || "").trim();
    if (!q || busy) return;
    thread.push({ role: "user", text: q });
    busy = "thinking"; render();
    setTimeout(function () {
      var r = reply(q), text = r.text;
      var msg = { role: "assistant", text: text, check: r.check, typing: true, shown: "" };
      thread.push(msg); busy = "typing";
      var words = text.split(/(\s+)/), k = 0;
      var timer = setInterval(function () {
        k = Math.min(words.length, k + 4);
        msg.shown = words.slice(0, k).join("");
        if (k >= words.length) { clearInterval(timer); msg.typing = false; busy = false; }
        render();
        if (!busy && !touch()) { var inp = $("#chat [name=q]"); if (inp) inp.focus(); }
      }, 30);
    }, 650);
  }

  // ---------------------------------------------------------------- events

  $("#chat-btn").addEventListener("click", function () { toggle(!open); });
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-chat-q], [data-chat-close], [data-chat-clear]");
    if (!t) return;
    if (t.dataset.chatQ) ask(t.dataset.chatQ);
    else if (t.dataset.chatClose !== undefined) toggle(false);
    else { thread = []; render(); }
  });
  document.addEventListener("submit", function (e) {
    var f = e.target;
    if (f.dataset.chatForm !== undefined) { e.preventDefault(); var q = f.q.value; f.q.value = ""; ask(q); }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) toggle(false); });
  // Keep the suggested questions in step with the screen. Leave the panel alone while someone is typing in it.
  function refresh() { if (open && !busy && !(document.activeElement && document.activeElement.closest && document.activeElement.closest("#chat"))) render(); }
  document.addEventListener("close:render", refresh);
  window.addEventListener("hashchange", function () { setTimeout(refresh, 0); });

  window.CloseChat = { reply: reply, suggestions: suggestions };
})();

/*
 * Close Assistant: the screens.
 *
 * Plain JavaScript, no framework. The checks live in engine.js; this file draws the
 * review screens, records each decision with who made it and when, and builds the
 * outputs (annotated workbook, morning email, approval requests).
 *
 * The tool advises. It never pays, posts or approves anything, and it never changes
 * the source data.
 */
(function () {
  "use strict";

  var E = window.CloseEngine;
  var X = window.XLSX;
  var money = E.money, pct = E.pct, usDate = E.usDate, sum = E.sum;

  var REVIEWERS = [
    { name: "Accounting Manager", role: "Manager" },
    { name: "Controller", role: "Controller" },
    { name: "K. Brooks", role: "Staff Accountant" },
    { name: "J. Ramirez", role: "Staff Accountant" },
    { name: "M. Chen", role: "Staff Accountant" },
    { name: "P. Okafor", role: "Staff Accountant" },
    { name: "S. Alvarez", role: "Staff Accountant" }
  ];
  var TYPE = {
    duplicate: { label: "Duplicate", long: "Likely duplicates" },
    offboarded: { label: "Off-boarded", long: "Property no longer managed" },
    approval: { label: "Needs approval", long: "Over the limit, not approved" },
    outlier: { label: "Unusual amount", long: "Unusual amounts" },
    miscoded: { label: "Coding", long: "GL coding" },
    prior_period: { label: "Prior period", long: "Prior-period invoices" },
    split: { label: "Possible split", long: "Possible splits under the limit" },
    reference: { label: "Master data", long: "Unknown property or GL code" }
  };
  // Clearing a flag is the risky direction, so over the limit it needs a second person.
  var CLEARING = { dismiss: true, keep: true, check_ok: true };

  var state = {
    tab: "briefing", reviewer: "Accounting Manager", settings: {}, decisions: {}, commentary: {}, questions: {}, log: [],
    apFilter: { type: "all", status: "open", who: "all", q: "" }, pending: null, drafts: {}, answers: {}
  };
  var bytes, workbook, model, R, packId, fileName;

  // An explained variance rests on flagged invoices. Until a person has decided them, the
  // commentary can't go to the owner.
  function pendingFor(v) {
    var seen = {}, out = [];
    (v.effects || []).forEach(function (e) {
      if (seen[e.line]) return; seen[e.line] = 1;
      var it = R.items.find(function (x) { return x.line === e.line; }), d = it && state.decisions[it.id];
      if (it && (!d || d.state !== "done")) out.push(it);
    });
    return out;
  }

  // ---------------------------------------------------------------- helpers

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function plural(n, one, many) { return n + " " + (n === 1 ? one : (many || one + "s")); }
  function $(sel) { return document.querySelector(sel); }
  function nowISO() { return new Date().toISOString(); }
  function stamp(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }) + " " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.remove("hidden");
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { t.classList.add("hidden"); }, 2600);
  }
  function copyText(text, btn) {
    function done() { if (btn) { var o = btn.textContent; btn.textContent = "Copied"; setTimeout(function () { btn.textContent = o; }, 1400); } }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { toast("Select the text and copy it."); }
      ta.remove();
    }
  }
  function download(name, text, type) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: type || "text/plain" }));
    a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  // Browser storage is a convenience so a refresh keeps the review. It can be unavailable.
  function save() {
    try { localStorage.setItem("close-assistant:" + packId, JSON.stringify({ decisions: state.decisions, commentary: state.commentary, questions: state.questions, log: state.log, settings: state.settings, reviewer: state.reviewer, answers: state.answers })); } catch (e) { /* not available */ }
  }
  function restore() {
    try {
      var s = JSON.parse(localStorage.getItem("close-assistant:" + packId) || "null");
      if (s) ["decisions", "commentary", "questions", "log", "settings", "answers"].forEach(function (k) { if (s[k]) state[k] = s[k]; });
      if (s && s.reviewer) state.reviewer = s.reviewer;
    } catch (e) { /* not available */ }
  }

  function log(what, detail, ref) {
    state.log.push({ at: nowISO(), who: state.reviewer, what: what, detail: detail || "", ref: ref || "" });
  }

  // ---------------------------------------------------------------- loading

  function load(buf, name) {
    var wb = X.read(buf, { type: "array", cellDates: false });
    var m = E.readWorkbook(X, wb);
    bytes = buf; workbook = wb; model = m; fileName = name;
    packId = name + ":" + m.invoices.length + ":" + Math.round(sum(m.invoices, function (i) { return i.amount; }));
    state.decisions = {}; state.commentary = {}; state.questions = {}; state.log = []; state.settings = {}; state.drafts = {}; state.answers = {};
    restore();
    run();
  }

  function run() {
    var resolved = R ? R.items.filter(function (it) { var d = state.decisions[it.id]; return d && d.state === "done"; }).map(function (it) { return it.line; }) : [];
    var commentary = {};
    Object.keys(state.commentary).forEach(function (k) { commentary[k] = state.commentary[k].text; });
    R = E.analyze(model, Object.assign({}, state.settings, { resolved: resolved, commentary: commentary }));
    // A second pass picks up decisions on the fresh item list (first run has no R yet).
    if (!resolved.length && Object.keys(state.decisions).length) {
      resolved = R.items.filter(function (it) { var d = state.decisions[it.id]; return d && d.state === "done"; }).map(function (it) { return it.line; });
      R = E.analyze(model, Object.assign({}, state.settings, { resolved: resolved, commentary: commentary }));
    }
    render();
  }

  function openItems() { return R.items.filter(function (it) { var d = state.decisions[it.id]; return !d || d.state !== "done"; }); }
  function itemState(it) { var d = state.decisions[it.id]; return !d ? "open" : d.state; }

  // ---------------------------------------------------------------- shared bits

  var BTN = "inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  var BTN_PRIMARY = BTN + " bg-al-deep text-white hover:bg-al-navy";
  var BTN_SECONDARY = BTN + " border border-al-deep text-al-deep bg-al-surface hover:bg-al-cream";
  var BTN_QUIET = BTN + " text-al-deep hover:bg-al-sand";
  var CARD = "bg-al-surface border border-al-sand rounded-xl shadow-sm overflow-hidden";

  function pill(text, tone) {
    var t = {
      high: "bg-al-red/10 text-al-red", medium: "bg-al-orange/20 text-al-amber", low: "bg-al-light text-al-navy/70",
      good: "bg-al-green/25 text-al-good", info: "bg-al-blue/15 text-al-deep", dark: "bg-al-deep text-white", muted: "bg-al-light text-al-navy/60"
    }[tone || "muted"];
    return '<span class="inline-flex items-center px-2 py-0.5 text-xs font-semibold whitespace-nowrap rounded-full ' + t + '">' + esc(text) + "</span>";
  }
  function stat(value, label, tone) {
    var c = { red: "text-al-red", amber: "text-al-amber", good: "text-al-good", deep: "text-al-deep" }[tone || "deep"];
    return '<div class="min-w-0"><div class="font-display text-2xl sm:text-4xl ' + c + '">' + esc(value) + '</div><div class="text-sm text-al-navy/70 mt-1">' + label + "</div></div>";
  }
  function sectionTitle(title, sub) {
    return '<div class="mb-5"><h1 class="font-display text-2xl sm:text-3xl text-al-deep">' + esc(title) + "</h1>" + (sub ? '<p class="text-al-navy/70 mt-1 max-w-3xl">' + sub + "</p>" : "") + "</div>";
  }
  // Bring an item into view inside a row that scrolls sideways (tabs and filter chips on a phone).
  function reveal(box, el) {
    if (!box || !el) return;
    var b = box.getBoundingClientRect(), r = el.getBoundingClientRect();
    if (r.left < b.left + 8 || r.right > b.right - 8) box.scrollLeft += r.left - b.left - (b.width - r.width) / 2;
  }
  function goto(tab, filter) {
    state.tab = tab;
    if (filter) Object.assign(state.apFilter, filter);
    render();
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- briefing

  function viewBriefing() {
    var s = R.summary, c = R.close, open = openItems();
    var openOf = function (t) { return open.filter(function (it) { return it.types.indexOf(t) >= 0; }); };
    var hold = open.filter(function (it) { return it.types.indexOf("duplicate") >= 0 || it.types.indexOf("offboarded") >= 0; });
    var approval = openOf("approval"), unusual = approval.filter(function (it) { return it.types.indexOf("outlier") >= 0; });
    var outliers = openOf("outlier"), coding = openOf("miscoded"), prior = openOf("prior_period");
    var capex = coding.filter(function (it) { return it.issues.some(function (x) { return x.fromCategory === "CapEx" || x.toCategory === "CapEx"; }); });
    var slip = c.properties.filter(function (p) { return p.forecast === "will_slip"; });
    var risk = c.properties.filter(function (p) { return p.forecast === "at_risk"; });
    var ok = c.properties.length - slip.length - risk.length;
    var over = c.team.filter(function (a) { return a.overloaded; });
    var vNeed = R.variances.filter(function (v) { return !state.commentary[v.id]; });
    var vBooking = vNeed.filter(function (v) { return v.status === "explained" && v.effects.length; });
    var cutoffConf = c.contradictions.filter(function (x) { return /ap cutoff/i.test(x.step); });
    var commConf = c.contradictions.filter(function (x) { return /variance commentary/i.test(x.step) && x.variances; });
    var dateConf = c.contradictions.filter(function (x) { return /but today is/.test(x.note); });
    var depConf = c.contradictions.filter(function (x) { return x.dependsOpen; });
    var splits = openOf("split"), late = s.late, top = late.top;
    var decided = R.items.length - open.length;

    var actions = [];
    if (hold.length) actions.push({ t: "Hold " + plural(hold.length, "payment") + " before the next payment run (" + money(sum(hold, function (i) { return i.atStake; })) + ")", d: openOf("duplicate").length + " likely duplicates and " + openOf("offboarded").length + " charges to properties we no longer manage.", go: ["ap", { type: "hold", status: "open" }] });
    if (outliers.length) actions.push({ t: "Look at " + plural(outliers.length, "unusual invoice") + " before anyone approves " + (outliers.length > 1 ? "them" : "it") + " (" + money(sum(outliers, function (i) { return i.atStake; })) + ")", d: unusual.length + " of the " + approval.length + " invoices waiting on Regional Manager approval are at least " + R.cfg.outlierMultiple + " times what that vendor usually bills.", go: ["ap", { type: "outlier", status: "open" }] });
    if (over.length) actions.push({ t: "Rebalance " + over.map(function (a) { return a.name; }).join(" and ") + "'s properties", d: over.map(function (a) { return a.name + " has " + a.late + " steps late across " + a.properties.length + " properties. At the current pace about " + a.finishBy + " of the " + a.remaining + " remaining steps get done by BD" + s.ownerReportDay + "."; }).join(" "), go: ["close"] });
    if (top && top.accountants.length > 1) actions.push({ t: "Unblock " + top.step.toLowerCase() + ": late at " + plural(top.count, "property", "properties") + " across " + top.accountants.length + " accountants", d: (late.outside && late.outside === top.outside ? "It is the only step that is late outside " + late.behind.join(" and ") + "'s properties (" + plural(top.outside, "property", "properties") + ", " + plural(top.outsideAccountants.length, "accountant") + "). " : "") + "A step that is late for several people points to a shared cause, such as bank statements or bank access, not to one person.", go: ["close"] });
    if (vNeed.length) actions.push({ t: "Approve owner commentary for " + plural(vNeed.length, "category", "categories"), d: "Drafts are ready. " + (vBooking.length ? vBooking.length + " " + (vBooking.length > 1 ? "are" : "is") + " accounted for by a flagged invoice; " : "") + (vNeed.length - vBooking.length) + " need an answer from the site team first. Questions are drafted.", go: ["commentary"] });
    if (coding.length) actions.push({ t: "Fix " + plural(coding.length, "GL code") + " (" + money(sum(coding, function (i) { return i.atStake; })) + ")", d: capex.length ? capex.length + " move cost between capital and operating, which changes NOI on the owner report." : "Each moves cost to the right line of the owner report.", go: ["ap", { type: "miscoded", status: "open" }] });
    if (prior.length) actions.push({ t: "Clear " + plural(prior.length, R.model.priorMonth + " invoice") + " out of " + R.model.period.short, d: "AP cutoff is marked done at " + plural(prior.filter(function (it) { return it.issues.some(function (x) { return x.cutoffMarkedDone; }); }).length, "property", "properties") + " that still have one.", go: ["ap", { type: "prior_period", status: "open" }] });
    if (splits.length) actions.push({ t: "Ask about " + plural(splits.length, "invoice") + " that may be split under the " + money(R.cfg.approvalLimit) + " limit (" + money(sum(splits, function (i) { return i.atStake; })) + ")", d: "The same vendor billed the same property more than once within " + R.cfg.splitDays + " days. Each invoice is under the limit; together they are over it. It may be legitimate. Someone should ask.", go: ["ap", { type: "split", status: "open" }] });

    return '' +
      '<div class="grid lg:grid-cols-3 gap-6">' +
      '<div class="lg:col-span-2 min-w-0">' +
      '<p class="text-sm uppercase tracking-widest text-al-blue font-semibold">Morning briefing' + (s.calendar.asOfDate ? " · " + esc(E.longDate(s.calendar.asOfDate)) : "") + "</p>" +
      '<h1 class="font-display text-2xl sm:text-4xl text-al-deep mt-2 leading-tight text-balance">' + esc(s.period.label) + " close, BD" + s.asOfBD + " of " + s.ownerReportDay + "</h1>" +
      '<p class="sm:text-lg text-al-navy/70 mt-2">Owner reports are due BD' + s.ownerReportDay + (s.calendar.dueDate ? ", " + esc(E.longDate(s.calendar.dueDate)) : "") + ". That's " + plural(c.daysLeft, "business day") + ", including today.</p>" +
      '<div class="' + CARD + ' mt-6 p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">' +
      stat(slip.length, "owner reports will miss BD" + s.ownerReportDay + " at the current pace", "red") +
      stat(risk.length, "more need fixes before they go", "amber") +
      stat(ok, "on track", "good") +
      stat(money(sum(hold, function (i) { return i.atStake; })), "to hold before payment", "red") +
      "</div>" +
      '<h2 class="font-display text-2xl text-al-deep mt-8 mb-3">Today\'s actions</h2>' +
      (actions.length ? '<ol class="space-y-3">' + actions.map(function (a, i) {
        return '<li class="' + CARD + ' p-4 flex gap-3 sm:gap-4 items-start"><span class="font-display text-2xl text-al-blue w-6 shrink-0">' + (i + 1) + '</span><div class="flex-1 min-w-0 sm:flex sm:items-start sm:gap-4"><div class="flex-1 min-w-0"><div class="font-semibold">' + esc(a.t) + '</div><div class="text-sm text-al-navy/70 mt-1">' + esc(a.d) + '</div></div><button class="' + BTN_SECONDARY + ' shrink-0 mt-3 sm:mt-0" data-go="' + a.go[0] + '" data-filter=\'' + esc(JSON.stringify(a.go[1] || null)) + "'>Open</button></div></li>";
      }).join("") + "</ol>" : '<div class="' + CARD + ' p-5">Nothing left to act on. Every flag has a decision.</div>') +
      "</div>" +
      '<aside class="space-y-6 min-w-0">' +
      '<div class="bg-al-deep text-white p-5 rounded-xl">' +
      '<div class="text-xs uppercase tracking-widest text-al-greyblue">The tracker vs. the evidence</div>' +
      '<div class="mt-3 flex items-baseline gap-3"><span class="font-display text-4xl">' + s.typedComplete + '</span><span class="text-sm text-al-greyblue">steps marked complete</span></div>' +
      '<div class="mt-1 flex items-baseline gap-3"><span class="font-display text-4xl text-al-orange">' + s.evidenceComplete + '</span><span class="text-sm text-al-greyblue">the data supports</span></div>' +
      '<ul class="mt-4 space-y-2 text-sm">' +
      (cutoffConf.length ? "<li>AP cutoff is marked done at " + plural(cutoffConf.length, "property", "properties") + " that still have " + esc(R.model.priorMonth) + " invoices in " + esc(R.model.period.short) + ".</li>" : "") +
      (commConf.length ? "<li>Commentary is marked done at " + plural(commConf.length, "property", "properties") + " where it's required and none is written.</li>" : "") +
      (dateConf.length ? "<li>" + plural(dateConf.length, "step") + " " + (dateConf.length > 1 ? "are" : "is") + " marked complete on BD7. Today is BD" + s.asOfBD + ".</li>" : "") +
      (depConf.length ? "<li>Commentary is marked done at " + plural(depConf.length, "property", "properties") + " where an earlier step, such as the bank reconciliation, is still open.</li>" : "") +
      "</ul>" +
      '<button class="' + BTN + ' mt-4 bg-al-surface text-al-deep hover:bg-al-cream" data-go="close">See close status</button>' +
      "</div>" +
      '<div class="' + CARD + ' p-5">' +
      '<div class="text-xs uppercase tracking-widest text-al-navy/60">Review progress</div>' +
      progress("Invoices decided", decided, R.items.length) +
      progress("Commentary approved", R.variances.length - vNeed.length, R.variances.length) +
      '<p class="text-sm text-al-navy/70 mt-4">Checked ' + plural(s.invoices, "invoice") + " (" + money(s.invoiceTotal) + "), " + plural(R.model.budget.length, "budget line") + " and " + plural(R.model.close.length, "close step") + ". " + plural(R.items.length, "invoice") + " need a person.</p>" +
      '<button class="' + BTN_QUIET + ' mt-3 -ml-3" data-go="outputs">Morning email and annotated workbook</button>' +
      "</div>" +
      "</aside>" +
      "</div>";
  }

  function progress(label, n, of) {
    var w = of ? Math.round(n / of * 100) : 0;
    return '<div class="mt-3"><div class="flex justify-between text-sm"><span>' + esc(label) + '</span><span class="font-semibold">' + n + " of " + of + '</span></div><div class="h-2 bg-al-light mt-1"><div class="h-2 bg-al-green" style="width:' + w + '%"></div></div></div>';
  }

  // ---------------------------------------------------------------- AP review

  function choicesFor(it) {
    var out = [], seen = {};
    function add(c, label, primary) { if (!seen[c]) { seen[c] = 1; out.push({ c: c, label: label, primary: primary }); } }
    it.issues.forEach(function (x) {
      if (x.decision === "hold") add("hold", "Hold payment", true);
      if (x.decision === "check") { add("hold_doc", "Hold until someone sees the invoice", true); add("check_ok", "Seen the invoice: amount is right"); }
      if (x.decision === "request") add("request", "Send to Regional Manager", false);
      if (x.decision === "recode") add("recode", "Recode to " + x.suggestedGL, true);
      if (x.decision === "move") { add("move", "Move to " + R.model.priorMonth, true); add("keep", "Keep in " + R.model.period.short + " (not accrued)"); }
    });
    if (!out.some(function (o) { return o.primary; }) && out.length) out[0].primary = true;
    add("dismiss", "Not an issue");
    return out;
  }
  var CHOICE_TEXT = {
    hold: "Payment held", hold_doc: "Held until the invoice is seen", check_ok: "Invoice seen, amount confirmed", request: "Sent to Regional Manager for approval",
    recode: "Recode approved", move: "Moving to the prior period", keep: "Kept in this period", dismiss: "Not an issue"
  };

  function apMatches(it) {
    var f = state.apFilter, st = itemState(it);
    if (f.type === "hold" && !(it.types.indexOf("duplicate") >= 0 || it.types.indexOf("offboarded") >= 0)) return false;
    if (f.type !== "all" && f.type !== "hold" && it.types.indexOf(f.type) < 0) return false;
    if (f.status === "open" && st === "done") return false;
    if (f.status === "second" && st !== "second") return false;
    if (f.status === "done" && st !== "done") return false;
    if (f.who !== "all" && it.invoice.codedBy !== f.who) return false;
    if (f.q) {
      var q = f.q.toLowerCase(), i = it.invoice;
      if ([i.invoiceNo, i.vendor, i.property, i.description, String(i.line), i.propertyId].join(" ").toLowerCase().indexOf(q) < 0) return false;
    }
    return true;
  }

  function viewAP() {
    var f = state.apFilter, items = R.items.filter(apMatches);
    var counts = {};
    R.items.forEach(function (it) { it.types.forEach(function (t) { counts[t] = (counts[t] || 0) + 1; }); });
    var holdCount = R.items.filter(function (it) { return it.types.indexOf("duplicate") >= 0 || it.types.indexOf("offboarded") >= 0; }).length;
    var types = [["all", "Everything", R.items.length], ["hold", "To hold", holdCount]].concat(Object.keys(TYPE).filter(function (t) { return counts[t]; }).map(function (t) { return [t, TYPE[t].long, counts[t]]; }));
    var second = R.items.filter(function (it) { return itemState(it) === "second"; }).length;
    var coders = Array.from(new Set(R.items.map(function (it) { return it.invoice.codedBy; }))).sort();
    // Beside the queue on a wide screen; under it on a phone, so the invoices come first.
    var rules = '<div class="font-semibold text-al-navy mb-1">The rules</div><ul class="list-disc pl-4 space-y-1"><li>You can\'t clear a flag on an invoice you coded.</li><li>Clearing a flag over ' + money(R.cfg.approvalLimit) + " needs a second reviewer.</li><li>\"Not an issue\" needs a reason.</li><li>Every decision goes in the audit trail.</li><li>Nothing here pays, posts or approves anything.</li></ul>";

    return sectionTitle("AP review", "The invoices that need a person before they're paid or posted. " + plural(R.items.length, "invoice") + " of " + R.summary.invoices + " were flagged. Each card says what was found, why it matters and what to do. A person decides.") +
      '<div class="grid lg:grid-cols-4 gap-6">' +
      '<aside class="space-y-4 lg:space-y-5 min-w-0">' +
      '<div class="' + CARD + ' p-3 lg:p-4"><div class="text-xs uppercase tracking-widest text-al-navy/60 mb-2">What was found</div><div id="ap-types" class="flex lg:block gap-2 lg:space-y-1 overflow-x-auto no-scrollbar -mx-3 px-3 lg:mx-0 lg:px-0">' +
      types.map(function (t) {
        var on = f.type === t[0];
        return '<button' + (on ? ' aria-pressed="true"' : "") + ' class="shrink-0 lg:w-full flex justify-between items-center gap-2 px-3 lg:px-2 py-1.5 text-sm text-left whitespace-nowrap rounded-full lg:rounded-none border lg:border-0 ' + (on ? "bg-al-deep text-white border-transparent" : "border-al-sand hover:bg-al-cream") + '" data-filter-type="' + t[0] + '"><span>' + esc(t[1]) + '</span><span class="font-semibold">' + t[2] + "</span></button>";
      }).join("") + "</div></div>" +
      '<div class="' + CARD + ' p-3 lg:p-4 grid grid-cols-2 gap-3 lg:block lg:space-y-3">' +
      '<label class="block min-w-0 text-xs uppercase tracking-widest text-al-navy/60">Status<select class="mt-1 w-full border border-al-sand bg-al-surface px-2 py-1.5 text-sm normal-case tracking-normal" data-filter-status>' +
      [["open", "Needs a decision"], ["second", "Waiting for a second reviewer (" + second + ")"], ["done", "Decided"], ["all", "All"]].map(function (o) { return '<option value="' + o[0] + '"' + (f.status === o[0] ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + "</select></label>" +
      '<label class="block min-w-0 text-xs uppercase tracking-widest text-al-navy/60">Coded by<select class="mt-1 w-full border border-al-sand bg-al-surface px-2 py-1.5 text-sm normal-case tracking-normal" data-filter-who><option value="all">Anyone</option>' +
      coders.map(function (c) { return '<option' + (f.who === c ? " selected" : "") + ">" + esc(c) + "</option>"; }).join("") + "</select></label>" +
      '<label class="block col-span-2 text-xs uppercase tracking-widest text-al-navy/60">Search<input class="mt-1 w-full border border-al-sand px-2 py-1.5 text-sm normal-case tracking-normal" placeholder="Vendor, property, invoice #" value="' + esc(f.q) + '" data-filter-q></label>' +
      "</div>" +
      '<div class="hidden lg:block text-sm text-al-navy/70 ' + CARD + ' p-4">' + rules + "</div>" +
      "</aside>" +
      '<div class="lg:col-span-3 space-y-4 min-w-0" id="ap-list">' +
      '<div class="text-sm text-al-navy/70">Showing ' + plural(items.length, "invoice") + " · " + money(sum(items, function (i) { return i.atStake; })) + "</div>" +
      (items.length ? items.map(apCard).join("") : '<div class="' + CARD + ' p-6 text-al-navy/70">Nothing matches. Try another filter.</div>') +
      '<div class="lg:hidden text-sm text-al-navy/70 ' + CARD + ' p-4">' + rules + "</div>" +
      "</div></div>";
  }

  function apCard(it) {
    var i = it.invoice, d = state.decisions[it.id], st = itemState(it);
    var coder = state.reviewer === i.codedBy;
    var html = '<article class="' + CARD + " " + (st === "done" ? "opacity-70" : "") + '" id="card-' + it.id + '">' +
      '<div class="p-4 sm:p-5 sm:flex gap-3 items-start justify-between border-b border-al-sand">' +
      '<div class="min-w-0"><div class="flex flex-wrap gap-1.5 mb-2">' + pill(it.severity === "high" ? "High priority" : "Medium", it.severity) + it.types.map(function (t) { return pill(TYPE[t].label, "info"); }).join(" ") + "</div>" +
      '<div class="font-semibold text-lg leading-snug">' + esc(i.vendor) + ' <span class="text-al-navy/50 font-normal">·</span> ' + esc(i.property) + "</div>" +
      '<div class="text-sm text-al-navy/70">Line ' + i.line + " · " + esc(i.invoiceNo) + " · " + esc(i.description) + " · GL " + esc(i.gl) + " · dated " + usDate(i.invoiceDate) + " · " + esc(i.approval) + " · coded by " + esc(i.codedBy) + "</div></div>" +
      '<div class="mt-2 sm:mt-0 flex flex-wrap items-baseline gap-x-3 sm:block sm:text-right shrink-0"><div class="font-display text-2xl text-al-deep">' + money(i.amount, true) + "</div>" + (it.needsSecondReviewer ? '<div class="text-xs text-al-navy/60">Over ' + money(R.cfg.approvalLimit) + ": two people to clear</div>" : "") + "</div></div>" +
      '<div class="p-4 sm:p-5 space-y-4">' +
      it.issues.map(function (x) {
        var extra = "";
        if (x.type === "duplicate") extra = dupTable(it, x);
        return '<div><div class="font-semibold">' + esc(x.title) + '</div><p class="text-sm mt-1">' + esc(x.detail) + "</p>" + extra + '<p class="text-sm mt-1 text-al-deep"><span class="font-semibold">Suggested:</span> ' + esc(x.action) + "</p></div>";
      }).join("") + "</div>";

    html += '<div class="px-4 sm:px-5 py-3 bg-al-cream/60 border-t border-al-sand">';
    if (st === "done") {
      html += '<div class="flex flex-wrap items-center gap-3 justify-between"><div class="text-sm">' + pill(CHOICE_TEXT[d.choice] || d.choice, d.choice === "dismiss" || CLEARING[d.choice] ? "muted" : "good") + " <span class=\"ml-1\">by " + esc(d.by) + (d.second ? " and " + esc(d.second.by) : "") + ", " + stamp(d.second ? d.second.at : d.at) + "</span>" + (d.reason ? '<div class="text-al-navy/70 mt-1">Reason: ' + esc(d.reason) + "</div>" : "") + '</div><button class="' + BTN_QUIET + '" data-reopen="' + it.id + '">Reopen</button></div>';
    } else if (st === "second") {
      var same = d.by === state.reviewer;
      html += '<div class="flex flex-wrap items-center gap-3 justify-between"><div class="text-sm">' + pill("Waiting for a second reviewer", "medium") + ' <span class="ml-1">' + esc(d.by) + " chose \"" + esc(CHOICE_TEXT[d.choice]) + '"' + (d.reason ? ": " + esc(d.reason) : "") + "</span></div>" +
        '<div class="flex flex-wrap gap-2">' + (same || coder ? '<span class="text-sm text-al-navy/70">' + (coder ? "You coded this invoice, so someone else has to confirm." : "Someone other than you has to confirm. Switch user from your name in the sidebar.") + "</span>" : '<button class="' + BTN_PRIMARY + '" data-confirm="' + it.id + '">Confirm</button><button class="' + BTN_SECONDARY + '" data-reject="' + it.id + '">Send back</button>') + "</div></div>";
    } else if (coder) {
      html += '<div class="text-sm">' + pill("Locked for you", "medium") + " <span class=\"ml-1\">You coded this invoice, so someone else has to review it. Switch user from your name in the sidebar to see it as the manager.</span></div>";
    } else if (state.pending && state.pending.id === it.id) {
      html += '<form class="flex flex-wrap gap-2 items-end" data-reason-form="' + it.id + '"><label class="flex-1 min-w-full sm:min-w-[16rem] text-sm font-semibold">Why is this not an issue?<input name="reason" required minlength="5" class="mt-1 w-full border border-al-sand px-2 py-1.5 font-normal" placeholder="e.g. Two separate roof jobs; both invoices seen"></label><button class="' + BTN_PRIMARY + '">Record decision</button><button type="button" class="' + BTN_QUIET + '" data-cancel>Cancel</button></form>';
    } else {
      html += '<div class="flex flex-wrap gap-2">' + choicesFor(it).map(function (c) {
        return '<button class="' + (c.primary ? BTN_PRIMARY : BTN_SECONDARY) + '" data-decide="' + it.id + '" data-choice="' + c.c + '">' + esc(c.label) + "</button>";
      }).join("") + "</div>";
    }
    return html + "</div></article>";
  }

  function dupTable(it, x) {
    var other = R.model.invoices.find(function (i) { return i.line === x.related[0]; });
    if (!other) return "";
    var rows = [other, it.invoice];
    return '<div class="overflow-x-auto mt-2"><table class="text-sm w-full min-w-[34rem] whitespace-nowrap"><thead><tr class="text-left text-xs uppercase tracking-wider text-al-navy/60"><th class="py-1 pr-3">Line</th><th class="pr-3">Invoice #</th><th class="pr-3">Property</th><th class="pr-3">Dated</th><th class="pr-3">Received</th><th class="pr-3">Coded by</th><th class="text-right">Amount</th></tr></thead><tbody>' +
      rows.map(function (r, k) {
        return '<tr class="border-t border-al-sand ' + (k ? "bg-al-red/5" : "") + '"><td class="py-1 pr-3">' + r.line + '</td><td class="pr-3 font-mono">' + esc(r.invoiceNo) + '</td><td class="pr-3">' + esc(r.property) + '</td><td class="pr-3">' + usDate(r.invoiceDate) + '</td><td class="pr-3">' + usDate(r.receivedDate) + '</td><td class="pr-3">' + esc(r.codedBy) + '</td><td class="text-right">' + money(r.amount, true) + "</td></tr>";
      }).join("") + "</tbody></table></div>";
  }

  function decide(id, choice, reason) {
    var it = R.items.find(function (x) { return x.id === id; });
    if (!it || state.reviewer === it.invoice.codedBy) return;
    var needsTwo = it.needsSecondReviewer && CLEARING[choice];
    state.decisions[id] = { choice: choice, by: state.reviewer, at: nowISO(), reason: reason || "", state: needsTwo ? "second" : "done" };
    log(CHOICE_TEXT[choice], (reason ? "Reason: " + reason + ". " : "") + (needsTwo ? "Waiting for a second reviewer." : ""), "Line " + it.line + " " + it.invoice.invoiceNo + " " + it.invoice.vendor + " " + money(it.invoice.amount, true));
    state.pending = null;
    save(); run();
    toast(needsTwo ? "Recorded. A second reviewer has to confirm." : "Decision recorded.");
  }

  // ---------------------------------------------------------------- commentary

  function viewCommentary() {
    return sectionTitle("Variance commentary", "Policy: commentary is required for any category more than " + pct(R.cfg.varianceThreshold) + " off budget. " + plural(R.variances.length, "category", "categories") + " qualify. For each one the tool checks the invoices behind the number, drafts the owner commentary from those facts only, and says plainly when the data can't explain it.") +
      '<div class="space-y-5">' + R.variances.slice().sort(function (a, b) { return (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) || Math.abs(b.diff) - Math.abs(a.diff); }).map(varCard).join("") + "</div>";
  }

  var STATUS_ORDER = { explained: 0, unexplained: 1 };
  var STATUS = { explained: ["Explained", "good"], unexplained: ["Can't explain from the data", "high"] };
  // An unexplained variance can't be approved until a person has entered the cause.
  var MIN_ANSWER = 15;
  function answerOf(id) { return (state.answers[id] || "").trim(); }

  function varCard(v) {
    var acc = state.commentary[v.id];
    var text = state.drafts[v.id] != null ? state.drafts[v.id] : (acc ? acc.text : v.draft);
    var g = E.groundingCheck(text, v.facts);
    var q = state.questions[v.id];
    var st = STATUS[v.status];
    var needsAnswer = v.status !== "explained";
    // The data can't explain this one, so the draft may state figures but not a reason.
    var cause = needsAnswer ? E.causeCheck(text) : { ok: true, phrases: [] };
    var pending = acc ? [] : pendingFor(v);
    var canApprove = g.ok && cause.ok && !pending.length && (!needsAnswer || answerOf(v.id).length >= MIN_ANSWER);
    var bar = Math.min(100, Math.round(Math.abs(v.pct) * 100 / 1.5));
    return '<article class="' + CARD + '" id="' + v.id + '">' +
      '<div class="p-4 sm:p-5 border-b border-al-sand grid md:grid-cols-5 gap-4 items-start">' +
      '<div class="md:col-span-2"><div class="flex flex-wrap gap-1.5 mb-2">' + pill(st[0], st[1]) + (acc ? pill("Approved for owner report", "good") : "") + '</div><div class="font-semibold text-lg">' + esc(v.property) + " · " + esc(v.category) + '</div><div class="text-sm text-al-navy/70">' + esc(v.region) + " · " + esc(v.accountant) + '</div><div class="mt-2 font-semibold text-al-deep">' + esc(v.headline) + "</div></div>" +
      '<div class="md:col-span-3 grid grid-cols-3 gap-3 text-sm">' +
      '<div><div class="text-al-navy/60">Budget</div><div class="font-display text-xl">' + money(v.budget) + "</div></div>" +
      '<div><div class="text-al-navy/60">Actual</div><div class="font-display text-xl">' + money(v.actual) + "</div></div>" +
      '<div><div class="text-al-navy/60">Off budget</div><div class="font-display text-xl ' + (v.diff > 0 ? "text-al-red" : "text-al-amber") + '">' + (v.diff > 0 ? "+" : "-") + pct(v.pct) + "</div></div>" +
      '<div class="col-span-3 h-2 bg-al-light"><div class="h-2 ' + (v.diff > 0 ? "bg-al-red/70" : "bg-al-orange") + '" style="width:' + bar + '%"></div></div>' +
      "</div></div>" +
      '<div class="grid md:grid-cols-2">' +
      '<div class="p-4 sm:p-5 md:border-r border-al-sand text-sm space-y-3">' +
      '<div class="font-semibold">What the data shows</div>' +
      (v.invoices.length ? '<table class="w-full"><tbody>' + v.invoices.map(function (i) {
        var it = R.items.find(function (x) { return x.line === i.line; });
        return '<tr class="border-t border-al-sand"><td class="py-1 pr-2">' + esc(i.vendor) + '<div class="text-xs text-al-navy/60">' + esc(i.description) + " · " + usDate(i.invoiceDate) + (it ? " · " + it.types.map(function (t) { return TYPE[t].label; }).join(", ") : "") + '</div></td><td class="text-right align-top py-1">' + money(i.amount) + "</td></tr>";
      }).join("") + '<tr class="border-t border-al-navy/30 font-semibold"><td class="py-1">In the invoice register</td><td class="text-right">' + money(v.register) + "</td></tr></tbody></table>" : '<p>No ' + esc(v.category.toLowerCase()) + " invoices for this property in the register.</p>") +
      (v.status !== "explained" && v.invoices.length ? '<p class="text-al-navy/70">The register and the ledger don\'t tie here (' + money(v.register) + " against " + money(v.actual) + " posted). Across this data pack the register is within 10% of the posted figure on only " + R.summary.registerTies.within + " of " + R.summary.registerTies.of + " budget lines, so a register total is not treated as an explanation.</p>" : "") +
      (v.effects.length ? "<p>" + v.effects.map(function (e) { return money(Math.abs(e.amount)) + " is " + esc(e.why) + " (line " + e.line + ")."; }).join(" ") + " Corrected, the category is " + money(Math.abs(v.adjusted - v.budget)) + " " + (v.adjusted > v.budget ? "over" : "under") + " budget.</p>" : "") +
      "</div>" +
      '<div class="p-4 sm:p-5 space-y-3">' +
      '<div class="flex flex-wrap items-center justify-between gap-2"><span class="font-semibold text-sm">Draft owner commentary</span>' + (g.ok ? pill("All " + g.checked + " figures match the data", "good") : pill("Check: " + g.unknown.join(", ") + " not in the data", "high")) + "</div>" +
      (cause.ok ? "" : '<p class="text-xs text-al-red">This draft gives a reason ("' + esc(cause.phrases.join('", "')) + '") that the data doesn\'t support. Take it out of the draft. The confirmed cause goes in the box below, in the reviewer\'s name.</p>') +
      '<textarea class="w-full border border-al-sand p-2 text-sm h-32" data-draft="' + v.id + '"' + (acc ? " readonly" : "") + ">" + esc(text) + "</textarea>" +
      (needsAnswer && !acc ? '<label class="block text-sm"><span class="font-semibold">What drove it</span> <span class="text-al-navy/60">(from the accountant or site team; required before approval)</span><textarea class="w-full border border-al-amber/60 p-2 text-sm h-20 mt-1" data-answer="' + v.id + '" placeholder="The tool can\'t supply this. Enter the confirmed cause, in words the owner will read.">' + esc(state.answers[v.id] || "") + "</textarea></label>" : "") +
      '<div class="flex flex-wrap gap-2">' +
      (acc ? '<span class="text-sm">Approved by ' + esc(acc.by) + ", " + stamp(acc.at) + '</span><button class="' + BTN_QUIET + '" data-unapprove="' + v.id + '">Reopen</button>'
        : '<button class="' + BTN_PRIMARY + '" data-approve="' + v.id + '"' + (canApprove ? "" : " disabled") + ">Approve for owner report</button>" +
        '<button class="' + BTN_SECONDARY + '" data-ai="' + v.id + '">Suggest another wording</button>' +
        (state.drafts[v.id] != null ? '<button class="' + BTN_QUIET + '" data-reset-draft="' + v.id + '">Reset</button>' : "")) +
      "</div>" +
      (pending.length ? '<div class="text-xs text-al-amber"><p>Approval is locked until ' + (pending.length > 1 ? "these invoices are" : "this invoice is") + " decided in AP review: " + pending.map(function (it) { return "line " + it.line + " (" + esc(it.invoice.vendor) + ", " + money(it.invoice.amount) + ")"; }).join(", ") + '. The commentary rests on it, so it can\'t go to the owner first.</p><button class="' + BTN_SECONDARY + ' mt-2" data-go="ap" data-filter=\'' + esc(JSON.stringify({ q: pending[0].invoice.invoiceNo, status: "all" })) + "'>Open line " + pending[0].line + " in AP review</button></div>" : "") +
      (v.status !== "explained" && !acc ? '<p class="text-xs text-al-amber">Approval is locked until the cause is entered. The cause is recorded as the reviewer\'s words, not the tool\'s, and the close step stays open until then.</p>' : "") +
      (v.question ? '<div class="border-t border-al-sand pt-3"><div class="flex flex-wrap items-center justify-between gap-2"><span class="font-semibold text-sm">Question for ' + esc(v.accountant) + "</span>" + (q ? pill("Sent by " + q.by, "good") : "") + '</div><p class="text-sm mt-1">' + esc(v.question) + '</p><div class="flex gap-2 mt-2"><button class="' + BTN_SECONDARY + '" data-copy-q="' + v.id + '">Copy</button>' + (q ? "" : '<button class="' + BTN_QUIET + '" data-sent-q="' + v.id + '">Mark as sent</button>') + "</div></div>" : "") +
      "</div></div></article>";
  }

  // Another wording of the same facts. It goes through the same number and cause checks as any draft.
  function altDraft(v) {
    var dir = v.diff > 0 ? "over" : "under";
    var text = v.category + " was " + money(v.actual) + " in " + R.model.period.short + ", " + money(Math.abs(v.diff)) + " (" + pct(v.pct) + ") " + dir + " the " + money(v.budget) + " budget.";
    if (v.status === "explained" && v.effects.length) {
      var net = v.adjusted - v.budget;
      text += " That includes " + v.effects.map(function (e) { return money(Math.abs(e.amount)) + " for " + e.why; }).join(" and ") + ". Without " + (v.effects.length > 1 ? "them" : "it") + ", " + v.category + " would be " + money(Math.abs(net)) + " " + (net > 0 ? "over" : "under") + " budget.";
    }
    return text;
  }
  function aiDraft(id, btn) {
    var v = R.variances.find(function (x) { return x.id === id; });
    btn.disabled = true; btn.textContent = "Drafting...";
    setTimeout(function () {
      var text = altDraft(v), g = E.groundingCheck(text, v.facts);
      state.drafts[id] = text;
      log("Redrafted commentary", g.ok ? "All figures matched the data." : "Figures not in the data: " + g.unknown.join(", ") + ".", v.property + " " + v.category);
      save(); render();
      toast("New wording drafted. It passed the checks.");
    }, 700);
  }

  // ---------------------------------------------------------------- close status

  var EV = {
    done: ["bg-al-green", "Complete, and the data agrees"],
    conflict: ["bg-al-orange", "Marked complete, but the data disagrees"],
    late: ["bg-al-red", "Late"],
    due: ["bg-al-blue", "Due today"],
    not_due: ["bg-al-light border border-al-sand", "Not due yet"]
  };
  var FORECAST = { will_slip: ["Will miss BD8", "high"], at_risk: ["Needs fixes first", "medium"], on_track: ["On track", "good"], ready: ["Ready", "good"] };
  var SHORT = { "Bank reconciliation": "Bank", "AP cutoff & accruals": "AP cutoff", "Rent/AR reconciliation": "Rent/AR", "Payroll allocation": "Payroll", "Prepaid & deposit roll": "Prepaids", "Variance commentary": "Commentary", "Owner report draft": "Draft", "Owner report final": "Final" };

  function viewClose() {
    var c = R.close, s = R.summary;
    var steps = c.properties[0] ? c.properties[0].steps.map(function (x) { return x.step; }) : [];
    var groups = { will_slip: [], at_risk: [], on_track: [], ready: [] };
    c.properties.forEach(function (p) { groups[p.forecast].push(p); });
    var over = c.team.filter(function (a) { return a.overloaded; });

    return sectionTitle("Close status", "Status worked out from the evidence, not typed in. The tracker says what people marked; this checks it against the invoices, the commentary and today's date, then forecasts who will make BD" + R.cfg.ownerReportDay + ".") +
      '<div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">' +
      '<div class="' + CARD + ' p-4">' + stat(s.typedComplete + " vs " + s.evidenceComplete, "steps marked complete vs. supported by the data") + "</div>" +
      '<div class="' + CARD + ' p-4">' + stat(groups.will_slip.length, "will miss BD" + R.cfg.ownerReportDay + " at the current pace", "red") + "</div>" +
      '<div class="' + CARD + ' p-4">' + stat(groups.at_risk.length, "need fixes before the report goes", "amber") + "</div>" +
      '<div class="' + CARD + ' p-4">' + stat(groups.on_track.length + groups.ready.length, "on track", "good") + "</div>" +
      "</div>" +
      (over.length ? rebalanceCard(over) : "") +
      stuckCard() +
      '<div class="' + CARD + ' mt-6"><div class="p-4 sm:p-5 border-b border-al-sand flex flex-wrap gap-4 justify-between items-center"><h2 class="font-display text-2xl text-al-deep">BD' + R.cfg.ownerReportDay + ' forecast by property</h2><div class="flex flex-wrap gap-x-3 gap-y-1.5 text-xs">' +
      Object.keys(EV).map(function (k) { return '<span class="inline-flex items-center gap-1"><span class="w-3 h-3 shrink-0 inline-block ' + EV[k][0] + '"></span>' + EV[k][1] + "</span>"; }).join("") + "</div></div>" +
      // A phone gets one block per property; the wide grid starts at the md width.
      '<ul class="md:hidden divide-y divide-al-sand">' + c.properties.map(propertyBlock).join("") + "</ul>" +
      '<div class="hidden md:block overflow-x-auto"><table class="w-full text-sm min-w-[56rem]"><thead><tr class="text-left text-xs uppercase tracking-wider text-al-navy/60 border-b border-al-sand"><th class="p-3">Property</th><th class="p-3">Accountant</th>' +
      steps.map(function (x) { return '<th class="p-1 text-center font-semibold">' + esc(SHORT[x] || x) + "</th>"; }).join("") + '<th class="p-3">Forecast</th><th class="p-3 w-1/3">Why</th></tr></thead><tbody>' +
      c.properties.map(function (p) {
        return '<tr class="border-b border-al-sand align-top"><td class="p-3 font-semibold">' + esc(p.name) + '</td><td class="p-3 whitespace-nowrap">' + esc(p.accountant) + (p.moveTo ? '<div class="text-xs text-al-deep">Suggest: ' + esc(p.moveTo) + "</div>" : "") + "</td>" +
          p.steps.map(function (x) {
            var tip = x.step + ": tracker says " + x.typed + (x.completed ? " (BD" + x.completed + ")" : "") + ". " + (x.note || EV[x.evidence][1] + ".");
            return '<td class="p-1 text-center"><span title="' + esc(tip) + '" class="inline-block w-6 h-6 ' + EV[x.evidence][0] + '">' + (x.evidence === "conflict" ? '<span class="text-xs font-bold text-al-night leading-6">!</span>' : "") + "</span></td>";
          }).join("") +
          '<td class="p-3">' + pill(FORECAST[p.forecast][0], FORECAST[p.forecast][1]) + '</td><td class="p-3 text-al-navy/80">' + (p.reasons.length ? '<ul class="space-y-1">' + p.reasons.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul>" : "Nothing open.") + "</td></tr>";
      }).join("") + "</tbody></table></div></div>" +
      teamCard();
  }

  // The forecast for one property, laid out for a narrow screen: the eight steps as a strip.
  var STEP_TINY = { "Bank reconciliation": "Bank", "AP cutoff & accruals": "AP", "Rent/AR reconciliation": "AR", "Payroll allocation": "Pay", "Prepaid & deposit roll": "Prep", "Variance commentary": "Comm", "Owner report draft": "Draft", "Owner report final": "Final" };
  function propertyBlock(p) {
    return '<li class="p-4"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><div class="font-semibold">' + esc(p.name) + '</div><div class="text-sm text-al-navy/70">' + esc(p.accountant) + (p.moveTo ? ' <span class="text-al-deep">· Suggest: ' + esc(p.moveTo) + "</span>" : "") + "</div></div>" + pill(FORECAST[p.forecast][0], FORECAST[p.forecast][1]) + "</div>" +
      '<div class="grid grid-cols-8 gap-1 mt-3">' + p.steps.map(function (x) {
        return '<div class="text-center min-w-0"><span role="img" aria-label="' + esc(x.step + ": " + EV[x.evidence][1]) + '" class="block h-6 ' + EV[x.evidence][0] + '">' + (x.evidence === "conflict" ? '<span class="text-xs font-bold text-al-night leading-6">!</span>' : "") + '</span><span class="block text-[10px] leading-tight text-al-navy/60 mt-1" aria-hidden="true">' + esc(STEP_TINY[x.step] || "") + "</span></div>";
      }).join("") + "</div>" +
      (p.reasons.length ? '<ul class="mt-3 space-y-1 text-sm text-al-navy/80">' + p.reasons.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul>" : "") + "</li>";
  }

  function rebalanceCard(over) {
    var c = R.close;
    return over.map(function (a) {
      var moves = c.moves.filter(function (m) { return m.from === a.name; });
      var kept = a.properties.filter(function (p) { return !p.moveTo && p.remaining; });
      var keep = kept.filter(function (p) { return p.keepAfterMoves; });
      var stuck = kept.filter(function (p) { return !p.keepAfterMoves; });
      return '<div class="bg-al-deep text-white p-5 sm:p-6 rounded-xl">' +
        '<div class="text-xs uppercase tracking-widest text-al-greyblue">Suggested rebalance · the manager decides</div>' +
        '<h2 class="font-display text-xl sm:text-2xl mt-2">' + esc(a.name) + " is " + a.late + " steps behind across " + a.properties.length + " properties.</h2>" +
        '<p class="text-al-greyblue mt-2 max-w-3xl">' + esc(a.name) + " has finished " + a.done + " steps in " + R.model.asOfBD + " business days, about " + a.pace.toFixed(1) + " a day. At that pace about " + a.finishBy + " of the " + a.remaining + " steps left get done by BD" + R.cfg.ownerReportDay + ". No one else is behind pace.</p>" +
        '<p class="text-al-greyblue mt-2 max-w-3xl">This is a pace signal, not a verdict on workload: ' + esc(a.name) + " carries " + a.properties.length + " properties and " + a.units.toLocaleString("en-US") + " units, which is not the team's largest load." +
        (a.wholeRegions.length ? " " + esc(a.name) + " holds " + a.wholeRegions.map(function (w) { return "all " + w.count + " " + esc(w.region) + " properties"; }).join(" and ") + ", so that whole region's owner reports are at risk. Check for a regional cause (bank access, a site team, a system) before treating it as one person's problem." : "") + "</p>" +
        '<div class="grid md:grid-cols-3 gap-4 mt-5 text-sm">' +
        '<div class="bg-white/10 p-4"><div class="font-semibold mb-2">Move to someone caught up (' + moves.length + ")</div><ul class=\"space-y-1\">" + moves.map(function (m) { return "<li>" + esc(m.property.name) + " to <strong>" + esc(m.to) + "</strong> <span class=\"text-al-greyblue\">(" + m.steps + " steps, " + m.late + " late). " + esc(m.to) + " goes from " + m.toProperties + " to " + (m.toProperties + 1) + " properties and " + m.toRemaining + " to " + (m.toRemaining + m.steps) + " steps left, against room for about " + m.toRoom + " by BD" + R.cfg.ownerReportDay + " (best day this close: " + m.toBestDay + " steps).</span></li>"; }).join("") + "</ul>" +
        (c.noRoom.length ? '<p class="text-al-greyblue mt-2">Not asked: ' + c.noRoom.map(function (k) { return esc(k.name) + ", caught up but without room for another property at their best day's rate"; }).join("; ") + ".</p>" : "") +
        (c.skipped.length ? '<p class="text-al-greyblue mt-2">Not asked: ' + c.skipped.map(function (k) { return esc(k.name) + ", caught up but already carrying an above-average load (" + k.properties + " properties, " + k.units.toLocaleString("en-US") + " units)"; }).join("; ") + ".</p>" : "") + "</div>" +
        '<div class="bg-white/10 p-4"><div class="font-semibold mb-2">' + esc(a.name) + " keeps and can finish (" + keep.length + ")</div><ul class=\"space-y-1\">" + (keep.length ? keep.map(function (p) { return "<li>" + esc(p.name) + ' <span class="text-al-greyblue">(' + p.remaining + " steps)</span></li>"; }).join("") : "<li>None at the current pace.</li>") + "</ul></div>" +
        '<div class="bg-al-orange/25 p-4"><div class="font-semibold mb-2">Still late: tell these owners today (' + stuck.length + ")</div><ul class=\"space-y-1\">" + stuck.map(function (p) { return "<li>" + esc(p.name) + ' <span class="text-al-greyblue">(' + p.remaining + " steps)</span></li>"; }).join("") + "</ul></div>" +
        "</div>" +
        takeBlock(a) +
        '<p class="text-xs text-al-greyblue mt-4">A move is only suggested to someone who is caught up, carries no more than the team average load, and has room for it. Room is measured by that person\'s best day this close (the most steps they finished in one business day), applied to the rest of today and the business days left. Average pace isn\'t used for this, because someone who is caught up ran out of due work, not capacity. It is still an estimate: each move shows what it adds, and the manager judges whether it fits. Moving more, adding overtime or bringing in help changes the last column. Nothing is reassigned until the manager does it.</p>' +
        '<button class="' + BTN + ' mt-3 bg-al-surface text-al-deep hover:bg-al-cream" data-copy-rebalance="' + esc(a.name) + '">Copy a note to the team</button>' +
        "</div>";
    }).join("");
  }

  // Late steps by step: one person behind is a workload question, one step late for several people is a shared blocker.
  function stuckCard() {
    var late = R.summary.late, top = late.top;
    if (!top) return "";
    var max = top.count;
    return '<div class="' + CARD + ' mt-6"><div class="p-4 sm:p-5 border-b border-al-sand"><h2 class="font-display text-2xl text-al-deep">Where the close is stuck</h2><p class="text-sm text-al-navy/70 mt-1">' + plural(late.total, "step") + " " + (late.total > 1 ? "are" : "is") + " late. " +
      (top.accountants.length > 1 ? esc(top.step) + " is late at " + plural(top.count, "property", "properties") + " across " + top.accountants.length + " accountants" + (late.outside && late.outside === top.outside ? ", and it is the only step late outside " + esc(late.behind.join(" and ")) + "'s properties" : "") + ". That points to a shared cause, such as bank statements or bank access, not to one person. " : "") +
      (late.outOfSequence ? plural(late.outOfSequence, "step") + " " + (late.outOfSequence > 1 ? "are" : "is") + " marked complete while an earlier step at the same property is still open." : "") + "</p></div>" +
      '<div class="p-4 sm:p-5 space-y-2 text-sm">' + late.byStep.map(function (x) {
        return '<div class="grid grid-cols-12 gap-x-3 gap-y-1 items-center"><div class="col-span-6 sm:col-span-3 font-semibold">' + esc(x.step) + '</div><div class="col-span-6 sm:col-span-3 sm:order-last text-right sm:text-left text-al-navy/70">' + x.count + " late · " + (x.accountants.length > 1 ? x.accountants.length + " accountants" : esc(x.accountants[0])) + '</div><div class="col-span-12 sm:col-span-6"><div class="h-2 bg-al-light"><div class="h-2 ' + (x.accountants.length > 1 ? "bg-al-red/70" : "bg-al-orange") + '" style="width:' + Math.round(x.count / max * 100) + '%"></div></div></div></div>';
      }).join("") + "</div></div>";
  }

  // What it would take to get every report out by the deadline, not only the ones the first moves save.
  function takeBlock() {
    var c = R.close, t = c.take, due = "BD" + R.cfg.ownerReportDay;
    if (!t || !t.properties) return "";
    var by = {};
    t.stretch.forEach(function (x) { (by[x.to] = by[x.to] || []).push(x); });
    var names = function (a) { return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; };
    var people = Object.keys(by).map(function (n) {
      var who = c.team.find(function (x) { return x.name === n; }), got = c.moves.filter(function (m) { return m.to === n; }).length;
      var before = who.properties.length + got, steps = sum(by[n], function (x) { return x.steps; });
      return "<li><strong>" + esc(n) + "</strong> takes " + esc(names(by[n].map(function (x) { return x.property.name; }))) + ' <span class="text-al-greyblue">(' + steps + " steps), going from " + before + " to " + (before + by[n].length) + " properties.</span></li>";
    });
    var days = t.accountantDays ? Math.ceil(t.accountantDays) : null;
    return '<div class="bg-white/10 p-4 mt-4 text-sm"><div class="font-semibold">What it would take to get all ' + c.properties.length + " reports out by " + due + "</div>" +
      '<p class="text-al-greyblue mt-1">The ' + plural(t.properties, "property", "properties") + " still late " + (t.properties > 1 ? "have " : "has ") + t.steps + " steps left" + (days ? ", about " + plural(days, "accountant-day") + " of work at the team's usual best-day rate (" + t.typicalBestDay + " steps)" : "") + ". Two ways to find that:</p>" +
      '<div class="grid md:grid-cols-2 gap-4 mt-3"><div><div class="font-semibold mb-1">Stretch the team</div>' +
      (people.length ? '<ul class="space-y-1">' + people.join("") + "</ul>" + '<p class="text-al-greyblue mt-2">' + (t.uncovered.length ? "That still leaves " + esc(names(t.uncovered.map(function (p) { return p.name; }))) + " late." : "On paper that covers all of them, with no slack left. It asks the most of people already carrying the heaviest loads.") + "</p>" : '<p class="text-al-greyblue">No one on the team has room for these at their best day\'s rate.</p>') + "</div>" +
      '<div><div class="font-semibold mb-1">Bring in help</div><p class="text-al-greyblue">' + (days ? "About " + plural(days, "accountant-day") + " from another team or a temp, starting today, on " + esc(names(R.close.stuck.map(function (p) { return p.name; }))) + "." : "Help from another team or a temp, starting today.") + " If neither is possible, tell those owners today.</p></div></div></div>";
  }

  function rebalanceNote(name) {
    var c = R.close, a = c.team.find(function (x) { return x.name === name; });
    var moves = c.moves.filter(function (m) { return m.from === name; });
    var stuck = a.properties.filter(function (p) { return !p.moveTo && p.remaining && !p.keepAfterMoves; });
    return "Team,\n\nTo get " + R.model.period.short + " owner reports out by BD" + R.cfg.ownerReportDay + ", I'd like to move some of " + name + "'s properties today:\n\n" +
      moves.map(function (m) { return "- " + m.property.name + " to " + m.to + " (" + m.steps + " steps left, " + m.late + " late)"; }).join("\n") +
      "\n\n" + name + " keeps the rest. " + (stuck.length ? "Even with these moves, " + stuck.map(function (p) { return p.name; }).join(", ") + (stuck.length > 1 ? " are" : " is") + " likely to be late, so I'll let " + (stuck.length > 1 ? "those owners" : "that owner") + " know today.\n\n" : "\n\n") +
      "Please reply if you can't take one on.\n\nThanks";
  }

  function teamCard() {
    return '<div class="' + CARD + ' mt-6"><div class="p-4 sm:p-5 border-b border-al-sand"><h2 class="font-display text-2xl text-al-deep">Team workload</h2><p class="text-sm text-al-navy/70 mt-1">Pace is the steps each person has actually finished per business day this close. It only predicts anything for someone who is behind; someone caught up has been limited by the work, not their capacity. Best day is the most steps that person finished in one business day, and is what the rebalance uses to judge who has room.</p></div>' +
      '<div class="overflow-x-auto"><table class="w-full text-sm min-w-[40rem]"><thead><tr class="text-left text-xs uppercase tracking-wider text-al-navy/60 border-b border-al-sand"><th class="p-3">Accountant</th><th class="p-3 text-right">Properties</th><th class="p-3 text-right">Units</th><th class="p-3 text-right">Steps done</th><th class="p-3 text-right">Late</th><th class="p-3 text-right">Due today</th><th class="p-3 text-right">Left</th><th class="p-3 text-right">Pace a day</th><th class="p-3 text-right">Best day</th><th class="p-3">Outlook</th></tr></thead><tbody>' +
      R.close.team.map(function (a) {
        return '<tr class="border-b border-al-sand"><td class="p-3 font-semibold">' + esc(a.name) + '</td><td class="p-3 text-right">' + a.properties.length + '</td><td class="p-3 text-right">' + a.units.toLocaleString("en-US") + '</td><td class="p-3 text-right">' + a.done + '</td><td class="p-3 text-right ' + (a.late > 2 ? "text-al-red font-semibold" : "") + '">' + a.late + '</td><td class="p-3 text-right">' + a.dueToday + '</td><td class="p-3 text-right">' + a.remaining + '</td><td class="p-3 text-right">' + a.pace.toFixed(1) + '</td><td class="p-3 text-right">' + a.bestDay + '</td><td class="p-3">' + (a.overloaded ? pill("Behind: about " + a.finishBy + " of " + a.remaining + " steps by BD" + R.cfg.ownerReportDay, "high") : pill("Caught up", "good")) + "</td></tr>";
      }).join("") + "</tbody></table></div></div>";
  }

  // ---------------------------------------------------------------- outputs

  function morningEmail() {
    var s = R.summary, c = R.close, open = openItems();
    var hold = open.filter(function (it) { return it.types.indexOf("duplicate") >= 0 || it.types.indexOf("offboarded") >= 0; });
    var approval = open.filter(function (it) { return it.types.indexOf("approval") >= 0; });
    var unusual = approval.filter(function (it) { return it.types.indexOf("outlier") >= 0; });
    var slip = c.properties.filter(function (p) { return p.forecast === "will_slip"; });
    var risk = c.properties.filter(function (p) { return p.forecast === "at_risk"; });
    var ok = c.properties.length - slip.length - risk.length;
    var over = c.team.filter(function (a) { return a.overloaded; });
    var vNeed = R.variances.filter(function (v) { return !state.commentary[v.id]; });
    var vBooking = vNeed.filter(function (v) { return v.status === "explained" && v.effects.length; });
    var cut = c.contradictions.filter(function (x) { return /ap cutoff/i.test(x.step); }).length;
    var comm = c.contradictions.filter(function (x) { return /variance commentary/i.test(x.step) && x.variances; }).length;
    var subject = s.period.short + " close, BD" + s.asOfBD + ": " + slip.length + " owner reports will miss BD" + s.ownerReportDay + ", " + money(sum(hold, function (i) { return i.atStake; })) + " to hold";
    var L = [];
    L.push("Good morning,", "", "Where the " + s.period.label + " close stands on BD" + s.asOfBD + ". Owner reports are due BD" + s.ownerReportDay + ".", "");
    L.push("OWNER REPORTS");
    L.push("- " + slip.length + " will miss BD" + s.ownerReportDay + " at the current pace." + (over.length ? " All are " + over.map(function (a) { return a.name; }).join(" and ") + "'s (" + sum(over, function (a) { return a.late; }) + " steps late). Suggested: move " + c.moves.length + " properties to people who are caught up." : ""));
    L.push("- " + risk.length + " more need fixes before the report goes out.");
    L.push("- " + ok + " are on track.", "");
    L.push("BEFORE THE NEXT PAYMENT RUN");
    if (hold.length) L.push("- Hold " + plural(hold.length, "payment") + ", " + money(sum(hold, function (i) { return i.atStake; })) + ": " + hold.filter(function (it) { return it.types.indexOf("duplicate") >= 0; }).length + " likely duplicates and " + hold.filter(function (it) { return it.types.indexOf("offboarded") >= 0; }).length + " charges to properties we no longer manage.");
    if (approval.length) L.push("- " + plural(approval.length, "invoice") + " over " + money(R.cfg.approvalLimit) + " " + (approval.length > 1 ? "are" : "is") + " waiting on Regional Manager approval (" + money(sum(approval, function (i) { return i.atStake; })) + "). " + (unusual.length ? unusual.length + " " + (unusual.length > 1 ? "are" : "is") + " at least " + R.cfg.outlierMultiple + " times what that vendor usually bills, so someone should see the invoice before approving." : ""));
    if (!hold.length && !approval.length) L.push("- Nothing to hold.");
    L.push("");
    L.push("OWNER COMMENTARY");
    L.push(vNeed.length ? "- " + plural(vNeed.length, "category", "categories") + " still need approved commentary. Drafts are ready. " + (vBooking.length ? vBooking.length + " " + (vBooking.length > 1 ? "are" : "is") + " accounted for by a flagged invoice; " : "") + (vNeed.length - vBooking.length) + " need an answer from the site team." : "- All required commentary is approved.");
    L.push("");
    L.push("THE TRACKER VS. THE EVIDENCE");
    L.push("- The tracker shows " + s.typedComplete + " steps complete. The data supports " + s.evidenceComplete + ".");
    if (cut) L.push("- AP cutoff is marked done at " + plural(cut, "property", "properties") + " that still have " + R.model.priorMonth + " invoices in " + s.period.short + ".");
    if (comm) L.push("- Commentary is marked done at " + plural(comm, "property", "properties") + " where it's required and none is written.");
    var top = s.late.top;
    if (top && top.accountants.length > 1) L.push("", "WHERE IT'S STUCK", "- " + top.step + " is late at " + plural(top.count, "property", "properties") + " across " + top.accountants.length + " accountants. Worth checking for a shared cause (bank statements, bank access) before treating it as workload.");
    var sp = open.filter(function (it) { return it.types.indexOf("split") >= 0; });
    if (sp.length) L.push("", "WORTH A QUESTION", "- " + plural(sp.length, "invoice") + " (" + money(sum(sp, function (i) { return i.atStake; })) + ") may be split under the " + money(R.cfg.approvalLimit) + " approval limit: same vendor, same property, days apart.");
    L.push("");
    L.push("Review so far: " + (R.items.length - open.length) + " of " + R.items.length + " flagged invoices decided, " + (R.variances.length - vNeed.length) + " of " + R.variances.length + " commentaries approved.", "", "Close Assistant", "(Advises only. Nothing has been paid, posted or changed.)");
    return { subject: subject, body: L.join("\n") };
  }

  function approvalEmails() {
    var open = openItems().filter(function (it) { return it.types.indexOf("approval") >= 0 && !(state.decisions[it.id] && state.decisions[it.id].choice === "request"); });
    var all = R.items.filter(function (it) { return it.types.indexOf("approval") >= 0; });
    var byRegion = {};
    all.forEach(function (it) { (byRegion[it.region] = byRegion[it.region] || []).push(it); });
    return Object.keys(byRegion).sort().map(function (region) {
      var list = byRegion[region];
      var body = "Hi,\n\n" + (list.length > 1 ? "These invoices are" : "This invoice is") + " over " + money(R.cfg.approvalLimit) + " and need" + (list.length > 1 ? "" : "s") + " your approval before payment:\n\n" +
        list.map(function (it) {
          var i = it.invoice, o = it.issues.find(function (x) { return x.type === "outlier"; });
          return "- " + i.property + ": " + i.vendor + ", " + i.description.toLowerCase() + ", " + money(i.amount, true) + " (" + i.invoiceNo + ", dated " + usDate(i.invoiceDate) + ")" + (o ? ". Note: about " + Math.round(o.multiple) + " times this vendor's usual invoice of " + money(o.median) + ". Please look at the invoice itself before approving." : "");
        }).join("\n") + "\n\nThanks";
      return { region: region, count: list.length, amount: sum(list, function (it) { return it.atStake; }), subject: plural(list.length, "invoice") + " over " + money(R.cfg.approvalLimit) + " for your approval (" + R.model.period.short + " close)", body: body, pending: list.filter(function (it) { return open.indexOf(it) >= 0; }).length };
    });
  }

  function viewOutputs() {
    var em = morningEmail();
    var appr = approvalEmails();
    return sectionTitle("Outputs", "What leaves the tool. The source data is never changed: the workbook comes back with columns added beside the original ones, and every decision is in the audit trail.") +
      '<div class="grid lg:grid-cols-2 gap-6">' +
      '<div class="' + CARD + ' p-5"><h2 class="font-display text-2xl text-al-deep">Annotated workbook</h2><p class="text-sm mt-2">The data pack, back in the format the team already uses. Original tabs and values untouched. Added beside them:</p>' +
      '<ul class="text-sm list-disc pl-5 mt-2 space-y-1"><li><strong>' + esc(R.model.sheets.B2) + ":</strong> issues, why, suggested action, decision and who made it.</li><li><strong>" + esc(R.model.sheets.B3) + ":</strong> whether commentary is required, explanation status and the drafted commentary. The original commentary column is left as it was.</li><li><strong>" + esc(R.model.sheets.B4) + ":</strong> what the evidence says, why, and the BD" + R.cfg.ownerReportDay + " forecast.</li><li><strong>New tabs:</strong> Review Summary and Review Log.</li></ul>" +
      '<button class="' + BTN_PRIMARY + ' mt-4" data-export>Download annotated workbook (.xlsx)</button></div>' +
      '<div class="' + CARD + ' p-5"><h2 class="font-display text-2xl text-al-deep">Audit trail</h2><p class="text-sm mt-2">' + plural(state.log.length, "entry", "entries") + '. Who decided what, when and why.</p>' +
      '<div class="max-h-60 overflow-y-auto mt-3 border border-al-sand">' + (state.log.length ? '<table class="w-full text-xs"><tbody>' + state.log.slice().reverse().map(function (l) { return '<tr class="border-b border-al-sand align-top"><td class="p-2 whitespace-nowrap text-al-navy/60">' + stamp(l.at) + '</td><td class="p-2 whitespace-nowrap font-semibold">' + esc(l.who) + '</td><td class="p-2">' + esc(l.what) + (l.ref ? '<div class="text-al-navy/60">' + esc(l.ref) + "</div>" : "") + (l.detail ? '<div class="text-al-navy/60">' + esc(l.detail) + "</div>" : "") + "</td></tr>"; }).join("") + "</tbody></table>" : '<p class="p-3 text-sm text-al-navy/60">No decisions yet.</p>') + "</div>" +
      '<div class="flex flex-wrap gap-2 mt-3"><button class="' + BTN_SECONDARY + '" data-log-csv' + (state.log.length ? "" : " disabled") + '>Download as CSV</button><button class="' + BTN_QUIET + '" data-reset>Reset the demo</button></div></div>' +
      "</div>" +
      '<div class="' + CARD + ' p-5 mt-6"><div class="flex flex-wrap justify-between gap-3 items-start"><div><h2 class="font-display text-2xl text-al-deep">Morning email to the Accounting Manager</h2><p class="text-sm text-al-navy/70 mt-1">Rebuilt from the current state every time this page opens, so it reflects decisions already made.</p></div><div class="flex flex-wrap gap-2"><button class="' + BTN_SECONDARY + '" data-copy-email>Copy</button><a class="' + BTN_PRIMARY + '" href="mailto:?subject=' + encodeURIComponent(em.subject) + "&body=" + encodeURIComponent(em.body) + '">Open in email</a></div></div>' +
      '<div class="mt-4 border border-al-sand bg-al-cream/50"><div class="px-4 py-2 border-b border-al-sand text-sm"><span class="text-al-navy/60">Subject:</span> <strong>' + esc(em.subject) + '</strong></div><pre class="p-4 text-sm whitespace-pre-wrap break-words font-sans">' + esc(em.body) + "</pre></div></div>" +
      '<div class="mt-6"><h2 class="font-display text-2xl text-al-deep mb-1">Approval requests for Regional Managers</h2><p class="text-sm text-al-navy/70 mb-4">Drafted, not sent. The tool doesn\'t know the Regional Managers\' names or emails, so each draft is addressed by region.</p><div class="grid md:grid-cols-2 gap-4">' +
      appr.map(function (a, k) {
        return '<div class="' + CARD + ' p-4"><div class="flex justify-between items-start gap-2"><div><div class="font-semibold">' + esc(a.region) + " Regional Manager</div><div class=\"text-sm text-al-navy/70\">" + plural(a.count, "invoice") + " · " + money(a.amount) + "</div></div><button class=\"" + BTN_SECONDARY + '" data-copy-appr="' + k + '">Copy</button></div><div class="text-sm mt-2"><span class="text-al-navy/60">Subject:</span> ' + esc(a.subject) + '</div><pre class="mt-2 text-xs whitespace-pre-wrap break-words font-sans bg-al-cream/50 border border-al-sand p-3">' + esc(a.body) + "</pre></div>";
      }).join("") + "</div></div>";
  }

  function addColumns(ws, table, headers, valuesFor) {
    var range = X.utils.decode_range(ws["!ref"]);
    var c0 = range.e.c + 1, r0 = range.s.r;
    X.utils.sheet_add_aoa(ws, [headers], { origin: { r: r0 + table.headerRow, c: c0 } });
    table.rows.forEach(function (row) {
      var vals = valuesFor(row);
      if (vals) X.utils.sheet_add_aoa(ws, [vals], { origin: { r: r0 + row._row, c: c0 } });
    });
    var cols = ws["!cols"] || [];
    headers.forEach(function (h, k) { cols[c0 + k] = { wch: k === 1 || k === 2 ? 60 : 24 }; });
    ws["!cols"] = cols;
  }

  function exportWorkbook() {
    // Keep number formats so dates stay dates and money stays money in the returned file.
    var wb = X.read(bytes, { type: "array", cellNF: true, cellStyles: true });
    var T = R.model.tables;
    var byLine = {};
    R.items.forEach(function (it) { byLine[it.line] = it; });
    var invByRow = {};
    R.model.invoices.forEach(function (i) { invByRow[i._row] = i; });
    addColumns(wb.Sheets[T.B2.name], T.B2, ["Review: Issues", "Review: Why", "Review: Suggested action", "Review: Decision", "Review: Decided by"], function (row) {
      var i = invByRow[row._row], it = i && byLine[i.line];
      if (!it) return ["", "", "", "", ""];
      var d = state.decisions[it.id];
      return [it.types.map(function (t) { return TYPE[t].label; }).join("; "), it.issues.map(function (x) { return x.detail; }).join(" "), it.issues.map(function (x) { return x.action; }).join(" "),
      d ? (d.state === "second" ? "Waiting for second reviewer: " : "") + CHOICE_TEXT[d.choice] + (d.reason ? " (" + d.reason + ")" : "") : "Open",
      d ? d.by + (d.second ? " and " + d.second.by : "") + ", " + stamp(d.second ? d.second.at : d.at) : ""];
    });
    var vByRow = {};
    R.variances.forEach(function (v) { vByRow[v._row] = v; });
    addColumns(wb.Sheets[T.B3.name], T.B3, ["Review: Commentary required", "Review: Drafted commentary", "Review: Question for the site", "Review: Explanation status", "Review: Approved by"], function (row) {
      var v = vByRow[row._row];
      if (!v) return ["No", "", "", "", ""];
      var acc = state.commentary[v.id];
      return ["Yes (" + (v.diff > 0 ? "+" : "-") + pct(v.pct) + ")", acc ? acc.text : (state.drafts[v.id] || v.draft), v.question, STATUS[v.status][0], acc ? acc.by + ", " + stamp(acc.at) : "Not approved"];
    });
    var stepByRow = {};
    R.close.properties.forEach(function (p) { p.steps.forEach(function (x) { stepByRow[x._row] = { s: x, p: p }; }); });
    addColumns(wb.Sheets[T.B4.name], T.B4, ["Review: Evidence says", "Review: Why", "Review: BD" + R.cfg.ownerReportDay + " forecast"], function (row) {
      var o = stepByRow[row._row];
      if (!o) return null;
      return [EV[o.s.evidence][1], o.s.note, FORECAST[o.p.forecast][0]];
    });
    var s = R.summary, em = morningEmail();
    var summary = [["Close Assistant review", ""], ["Data pack", fileName], ["Period", s.period.label], ["As of", "BD" + s.asOfBD + (s.calendar.asOfDate ? " (" + E.longDate(s.calendar.asOfDate) + ")" : "")], ["Exported", stamp(nowISO()) + " by " + state.reviewer], ["", ""],
    ["Invoices checked", s.invoices], ["Invoices flagged", R.items.length], ["Invoices decided", R.items.length - openItems().length]];
    Object.keys(TYPE).forEach(function (t) { if (s.byType[t]) summary.push([TYPE[t].long, s.byType[t].count + " (" + money(s.byType[t].amount) + ")"]); });
    summary.push(["Categories needing commentary", R.variances.length], ["Steps marked complete", s.typedComplete], ["Steps the data supports", s.evidenceComplete], ["Owner reports at risk", s.reportsAtRisk], ["", ""], ["Morning email", em.subject], ["", em.body], ["", ""],
      ["How to read this file", "Columns starting \"Review:\" were added by the Close Assistant. Every other cell is exactly as received. Nothing was paid, posted or approved."]);
    var ws1 = X.utils.aoa_to_sheet(summary); ws1["!cols"] = [{ wch: 34 }, { wch: 110 }];
    X.utils.book_append_sheet(wb, ws1, "Review Summary");
    var ws2 = X.utils.aoa_to_sheet([["When", "Who", "What", "Item", "Detail"]].concat(state.log.map(function (l) { return [stamp(l.at), l.who, l.what, l.ref, l.detail]; })));
    ws2["!cols"] = [{ wch: 20 }, { wch: 20 }, { wch: 36 }, { wch: 50 }, { wch: 60 }];
    X.utils.book_append_sheet(wb, ws2, "Review Log");
    X.writeFile(wb, "Data Pack " + s.period.short + " close reviewed BD" + s.asOfBD + ".xlsx");
    log("Downloaded the annotated workbook", "", "");
    save();
  }

  // ---------------------------------------------------------------- how it works

  function viewHow() {
    var cfg = R.cfg, sc = E.score(R, window.ANSWER_KEY || {});
    var checks = [
      ["Duplicate payments", "Same vendor and amount, and the same invoice number once \"INV-\" and punctuation are ignored. That catches \"89455\" and \"INV-89455\"."],
      ["Off-boarded properties", "Any invoice dated after a property's off-boarding date."],
      ["GL coding", "Learns the usual GL code for each description from the register itself (at least " + Math.round(cfg.codingShare * 100) + "% of 3 or more invoices), then flags the exceptions. No hand-made mapping."],
      ["Prior-period invoices", "Dated before " + R.model.period.short + " but in " + R.model.period.short + "'s register. Cross-checked against the AP cutoff step."],
      ["Approval policy", "Over " + money(cfg.approvalLimit) + " and not approved."],
      ["Possible splits", "Two or more invoices from one vendor to one property, each at or under " + money(cfg.approvalLimit) + ", dated within " + cfg.splitDays + " days, that together go over it. A prompt to ask, not a finding: separate jobs or meters look the same."],
      ["Unusual amounts", "At least " + cfg.outlierMultiple + " times the vendor's usual (middle) invoice and at least " + money(cfg.outlierFloor) + "."],
      ["Variance commentary", "Every category more than " + pct(cfg.varianceThreshold) + " off budget. It is \"explained\" only when a specific flagged invoice closes the gap, and it can't be approved until a person has decided that invoice. Otherwise the tool says it can't explain it, drafts the question, and locks approval until a person enters the cause. Every figure in a draft must be in the data, and a draft for an unexplained variance can't state a reason."],
      ["Close status from evidence", "A step marked complete is checked against the data: August invoices still sitting in the register, required commentary not written, a completion date in the future, or commentary marked done while an earlier step is still open."],
      ["Where the close is stuck", "Late steps counted by step. One person behind is a workload question; one step late for several people is a shared blocker."],
      ["BD" + cfg.ownerReportDay + " forecast", "Each accountant's actual pace this close, applied to the steps they have left. A move is only suggested to someone with room for it at their best day's rate."]
    ];
    var objects = [
      ["Property", "B0", "Region, status, off-boarding date"], ["Invoice", "B2", "Vendor, amount, dates, coded by, approval"], ["GL account", "B1", "Name and category"],
      ["Budget line", "B3", "Property and category, budget and actual"], ["Close step", "B4", "Property, accountant, due and done"], ["Accountant", "B2, B4", "Who coded it, who owns the close"], ["Vendor", "B2", "Usual invoice size"], ["Regional Manager", "B0 region", "Approves over the limit (name not in data)"]
    ];
    var links = ["An invoice belongs to a property and is coded to a GL account.", "A GL account rolls up to a category; a property and category make a budget line.", "So every budget line can be traced to the invoices behind it.", "A property has eight close steps, owned by one accountant.", "So an invoice problem shows up as evidence against a close step, and against a BD" + cfg.ownerReportDay + " owner report."];

    return sectionTitle("Ontology & rules", "Plain rules, run in your browser against the data pack. Every number is calculated in code, so the same input always gives the same answer and each flag can be traced to a rule. The assistant is used for words: wording commentary and answering questions about this close in the Ask panel. Its figures are checked against the data.") +
      '<div class="grid lg:grid-cols-2 gap-6">' +
      '<div class="' + CARD + ' p-5"><h2 class="font-display text-2xl text-al-deep">What it does, and never does</h2><div class="grid sm:grid-cols-2 gap-4 mt-3 text-sm"><div><div class="font-semibold text-al-good mb-1">Does</div><ul class="list-disc pl-4 space-y-1"><li>Finds the invoices that need a person</li><li>Explains each one and suggests an action</li><li>Drafts commentary, questions and emails</li><li>Checks the tracker against the evidence</li><li>Records every decision</li></ul></div><div><div class="font-semibold text-al-red mb-1">Never</div><ul class="list-disc pl-4 space-y-1"><li>Pays, posts or approves anything</li><li>Changes the source data</li><li>Lets someone clear their own work</li><li>Clears a flag over ' + money(cfg.approvalLimit) + " with one person</li><li>Writes a number that isn't in the data</li></ul></div></div></div>" +
      '<div class="' + CARD + ' p-5"><h2 class="font-display text-2xl text-al-deep">Regression test</h2><p class="text-sm mt-2">The expected results (tools/answer_key.py) were written from the same rules as the checks, so this only proves the checks still find what they found. It is not a measure of accuracy, and it doesn\'t cover the split check. Real accuracy needs a pilot: one close alongside the team, scored against what the accountants actually find.</p>' +
      '<div class="flex flex-wrap gap-x-6 gap-y-3 mt-4">' + stat(sc.caught + " of " + sc.expected, "caught", "good") + stat(sc.missed, "missed", sc.missed ? "red" : "deep") + stat(sc.falseAlarms, "false alarms", sc.falseAlarms ? "amber" : "deep") + "</div>" +
      '<table class="w-full text-sm mt-4"><tbody>' + sc.rows.map(function (r) { return '<tr class="border-t border-al-sand"><td class="py-1">' + esc(r.label) + '</td><td class="text-right">' + r.caught + " / " + r.expected + "</td><td class=\"text-right text-al-navy/60\">" + (r.missed.length ? "missed " + r.missed.join(", ") : "") + (r.falseAlarms.length ? " extra " + r.falseAlarms.join(", ") : "") + "</td></tr>"; }).join("") + "</tbody></table></div>" +
      "</div>" +
      '<div class="' + CARD + ' p-5 mt-6"><h2 class="font-display text-2xl text-al-deep">The ontology</h2><p class="text-sm text-al-navy/70 mt-1">The five tabs are linked into one picture, so a problem in one place shows up wherever it matters.</p>' +
      '<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">' + objects.map(function (o) { return '<div class="border border-al-deep/30 p-3"><div class="font-semibold text-al-deep">' + esc(o[0]) + '</div><div class="text-xs text-al-blue font-semibold">' + esc(o[1]) + '</div><div class="text-xs text-al-navy/70 mt-1">' + esc(o[2]) + "</div></div>"; }).join("") + "</div>" +
      '<ol class="list-decimal pl-5 mt-4 text-sm space-y-1">' + links.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ol></div>" +
      '<div class="grid lg:grid-cols-2 gap-6 mt-6">' +
      '<div class="' + CARD + ' p-5"><h2 class="font-display text-2xl text-al-deep">The checks</h2><dl class="mt-3 text-sm space-y-3">' + checks.map(function (c) { return '<div><dt class="font-semibold">' + esc(c[0]) + "</dt><dd class=\"text-al-navy/80\">" + esc(c[1]) + "</dd></div>"; }).join("") + "</dl></div>" +
      '<div class="space-y-6">' +
      '<form class="' + CARD + ' p-5" data-settings><h2 class="font-display text-2xl text-al-deep">Thresholds</h2><p class="text-sm text-al-navy/70 mt-1">Finance owns these. Change one and every check re-runs.</p><div class="grid sm:grid-cols-2 gap-3 mt-3 text-sm">' +
      setting("approvalLimit", "Approval limit ($)", cfg.approvalLimit, 500) + setting("varianceThreshold", "Commentary threshold (%)", Math.round(cfg.varianceThreshold * 100), 1) +
      setting("outlierMultiple", "Unusual: times vendor's usual", cfg.outlierMultiple, 1) + setting("outlierFloor", "Unusual: at least ($)", cfg.outlierFloor, 500) +
      '</div><div class="flex flex-wrap gap-2 mt-4"><button class="' + BTN_PRIMARY + '">Re-run checks</button><button type="button" class="' + BTN_QUIET + '" data-default-settings>Back to policy defaults</button></div></form>' +
      '<div class="' + CARD + ' p-5 text-sm"><h2 class="font-display text-2xl text-al-deep">Assumptions and limits</h2><ul class="list-disc pl-4 mt-2 space-y-1">' +
      "<li>\"Approved\" in the register doesn't say who approved. " + plural(R.summary.approvedOverLimit, "invoice") + " over " + money(cfg.approvalLimit) + " are marked Approved; production would confirm the approver was the Regional Manager.</li>" +
      "<li>The invoice register doesn't reconcile to the budget-vs-actual tab: the register is within 10% of the posted actual on only " + R.summary.registerTies.within + " of " + R.summary.registerTies.of + " budget lines. So a register total is never used to explain a variance; only a specific flagged item is.</li>" +
      (R.summary.calendar.asOfDate ? "<li>The calendar: the README tab gives the data as of " + esc(E.longDate(R.summary.calendar.asOfDate)) + " and the tracker says BD" + R.summary.asOfBD + ". Read together, BD" + R.summary.asOfBD + " is that date, AP cutoff (BD" + R.summary.calendar.cutoffBD + ") was " + esc(E.longDate(R.summary.calendar.cutoffDate)) + " and owner reports are due " + esc(E.longDate(R.summary.calendar.dueDate)) + ". The latest received date in the register is " + usDate(R.summary.calendar.lastReceived) + (R.summary.calendar.receivedAfterCutoff ? "; " + R.summary.calendar.receivedAfterCutoff + " invoices arrived after cutoff" : ", before cutoff, which supports this reading") + ". Weekends are skipped; holidays aren't known.</li>" : "<li>The data pack gives no calendar date for today, so business days are not dated.</li>") +
      "<li>Whether an Approved invoice has already been paid isn't in the data. \"Hold\" assumes it hasn't; if it has, the action is a recovery from the vendor.</li>" +
      "<li>No invoice documents are included, so the tool can flag a $35,000 cleaning bill but can't tell a keying error from a real project.</li>" +
      "<li>Pace is steps finished per business day. It shows who is behind, not why. The rebalance judges room by each person's best day this close, which is a rate they have shown, not a promise they can repeat it.</li>" +
      "<li>The number check covers figures. The cause check is a word list (\"because\", \"due to\", \"driven by\"...), so it catches the usual phrasing, not every way of implying a reason. A person still approves every commentary.</li>" +
      "<li>A possible split is a prompt to ask. Two water bills on one day may be two meters.</li>" +
      "<li>Decisions are kept in this browser only. Production would save them to a database and post approved changes back to the PMS.</li></ul></div>" +
      "</div></div>";
  }
  function setting(k, label, v, step) {
    return '<label class="block font-semibold">' + esc(label) + '<input type="number" min="0" step="' + step + '" name="' + k + '" value="' + v + '" class="mt-1 w-full border border-al-sand px-2 py-1.5 font-normal"></label>';
  }

  // ---------------------------------------------------------------- frame

  var TABS = [["briefing", "Briefing"], ["ap", "AP review"], ["commentary", "Commentary"], ["close", "Close status"], ["outputs", "Outputs"], ["how", "Ontology & rules"]];

  function render() {
    var open = openItems().length, vNeed = R.variances.filter(function (v) { return !state.commentary[v.id]; }).length;
    var badge = { ap: open, commentary: vNeed, close: R.summary.reportsAtRisk };
    $("#tabs").innerHTML = TABS.map(function (t) {
      var on = state.tab === t[0];
      return '<button class="px-1 mr-6 py-3 text-sm font-semibold whitespace-nowrap border-b-2 ' + (on ? "border-al-deep text-al-deep" : "border-transparent text-al-navy/60 hover:text-al-navy") + '" data-tab="' + t[0] + '">' + t[1] + (badge[t[0]] ? ' <span class="ml-1 px-1.5 py-0.5 text-xs rounded-full ' + (on ? "bg-al-deep text-white" : "bg-al-light text-al-navy/70") + '">' + badge[t[0]] + "</span>" : "") + "</button>";
    }).join("");
    if ($("#period")) $("#period").textContent = R.model.period.label + " close · BD" + R.model.asOfBD + " of " + R.cfg.ownerReportDay;
    var me = REVIEWERS.find(function (r) { return r.name === state.reviewer; }) || REVIEWERS[0];
    $("#user-name").textContent = me.name;
    $("#user-role").textContent = roleLabel(me);
    $("#user-list").innerHTML = REVIEWERS.map(function (r) {
      var on = r.name === state.reviewer;
      return '<button type="button" data-user="' + esc(r.name) + '" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left ' + (on ? "bg-al-cream" : "hover:bg-al-cream") + '"><span class="w-9 h-9 shrink-0 rounded-full ' + (on ? "bg-al-deep" : "bg-al-blue") + ' text-white font-bold flex items-center justify-center text-sm" aria-hidden="true">' + esc(r.name.split(/[\s.]+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase()) + '</span><span class="min-w-0 flex-1"><span class="block text-sm font-semibold text-al-navy">' + esc(r.name) + '</span><span class="block text-xs text-al-navy/60">' + esc(roleLabel(r)) + "</span></span>" + (on ? '<span class="text-xs font-semibold text-al-good">Signed in</span>' : "") + "</button>";
    }).join("");
    var v = { briefing: viewBriefing, ap: viewAP, commentary: viewCommentary, close: viewClose, outputs: viewOutputs, how: viewHow }[state.tab];
    $("#view").innerHTML = v();
    reveal($("#tabs"), $('#tabs [data-tab="' + state.tab + '"]'));
    reveal($("#ap-types"), $('#ap-types [aria-pressed="true"]'));
    // The platform shell (js/shell.js) reads the module's results for the executive view.
    window.CloseModule = { R: R, state: state, goto: goto, reviewers: REVIEWERS, types: TYPE, forecasts: FORECAST, choiceText: CHOICE_TEXT, rerender: render };
    document.dispatchEvent(new CustomEvent("close:render"));
  }

  // ---------------------------------------------------------------- events

  document.addEventListener("click", function (e) {
    var t = e.target.closest("button, a");
    if (!t) return;
    var d = t.dataset;
    if (t.id === "user-btn") { userModal(true); return; }
    if (d.userClose !== undefined) { userModal(false); return; }
    if (d.user) { state.reviewer = d.user; state.pending = null; save(); userModal(false); render(); toast("Signed in as " + d.user + "."); return; }
    if (d.tab) { goto(d.tab); return; }
    if (d.go) { var f = d.filter && d.filter !== "null" ? JSON.parse(d.filter) : null; if (d.go === "ap") state.apFilter = Object.assign({ type: "all", status: "open", who: "all", q: "" }, f || {}); goto(d.go); return; }
    if (d.filterType) { state.apFilter.type = d.filterType; render(); return; }
    if (d.decide) {
      if (d.choice === "dismiss") { state.pending = { id: d.decide }; render(); var inp = document.querySelector('[data-reason-form="' + d.decide + '"] input'); if (inp) inp.focus(); return; }
      decide(d.decide, d.choice); return;
    }
    if (d.cancel !== undefined) { state.pending = null; render(); return; }
    if (d.confirm || d.reject) {
      var id = d.confirm || d.reject, dec = state.decisions[id], it = R.items.find(function (x) { return x.id === id; });
      if (!dec || dec.by === state.reviewer || state.reviewer === it.invoice.codedBy) return;
      if (d.confirm) { dec.state = "done"; dec.second = { by: state.reviewer, at: nowISO() }; log("Confirmed: " + CHOICE_TEXT[dec.choice], "First reviewer: " + dec.by + ".", "Line " + it.line + " " + it.invoice.invoiceNo + " " + it.invoice.vendor); toast("Confirmed by a second reviewer."); }
      else { delete state.decisions[id]; log("Sent back: " + CHOICE_TEXT[dec.choice], "First reviewer: " + dec.by + ". Reopened for review.", "Line " + it.line + " " + it.invoice.invoiceNo + " " + it.invoice.vendor); toast("Sent back. The flag is open again."); }
      save(); run(); return;
    }
    if (d.reopen) { var it2 = R.items.find(function (x) { return x.id === d.reopen; }); delete state.decisions[d.reopen]; log("Reopened", "", "Line " + it2.line + " " + it2.invoice.invoiceNo + " " + it2.invoice.vendor); save(); run(); return; }
    if (d.approve) {
      var v = R.variances.find(function (x) { return x.id === d.approve; });
      var text = (document.querySelector('[data-draft="' + d.approve + '"]') || {}).value || v.draft;
      var g = E.groundingCheck(text, v.facts);
      if (!g.ok) { toast("These figures aren't in the data: " + g.unknown.join(", ")); return; }
      if (pendingFor(v).length) { toast("Decide the flagged invoice in AP review first."); return; }
      var answer = "", added = [];
      if (v.status !== "explained") {
        if (!E.causeCheck(text).ok) { toast("The draft gives a reason the data doesn't support. Put the confirmed cause in the box below."); return; }
        answer = answerOf(v.id);
        if (answer.length < MIN_ANSWER) { toast("Enter what drove the variance first. A placeholder can't go to the owner."); return; }
        // Figures in the answer come from a person, not the data pack. Allowed, but recorded as such.
        added = E.groundingCheck(answer, v.facts).unknown;
        text = text.trim() + " " + answer;
      }
      state.commentary[v.id] = { text: text, by: state.reviewer, at: nowISO(), answer: answer };
      delete state.drafts[v.id]; delete state.answers[v.id];
      log("Approved owner commentary", text + (answer ? " [Cause entered by " + state.reviewer + (added.length ? "; figures not in the data pack: " + added.join(", ") : "") + "]" : ""), v.property + " " + v.category);
      save(); run(); toast("Approved. The close status updates."); return;
    }
    if (d.unapprove) { var v2 = R.variances.find(function (x) { return x.id === d.unapprove; }); delete state.commentary[d.unapprove]; log("Reopened commentary", "", v2.property + " " + v2.category); save(); run(); return; }
    if (d.resetDraft) { delete state.drafts[d.resetDraft]; save(); render(); return; }
    if (d.ai) { aiDraft(d.ai, t); return; }
    if (d.copyQ) { copyText(R.variances.find(function (x) { return x.id === d.copyQ; }).question, t); return; }
    if (d.sentQ) { var v3 = R.variances.find(function (x) { return x.id === d.sentQ; }); state.questions[d.sentQ] = { by: state.reviewer, at: nowISO() }; log("Question sent to " + v3.accountant, v3.question, v3.property + " " + v3.category); save(); render(); return; }
    if (d.copyRebalance) { copyText(rebalanceNote(d.copyRebalance), t); return; }
    if (d.copyEmail !== undefined) { var em = morningEmail(); copyText("Subject: " + em.subject + "\n\n" + em.body, t); return; }
    if (d.copyAppr !== undefined) { var a = approvalEmails()[Number(d.copyAppr)]; copyText("Subject: " + a.subject + "\n\n" + a.body, t); return; }
    if (d.export !== undefined) { try { exportWorkbook(); toast("Workbook downloaded."); } catch (err) { toast("Export failed: " + err.message); } return; }
    if (d.logCsv !== undefined) {
      var rows = [["When", "Who", "What", "Item", "Detail"]].concat(state.log.map(function (l) { return [stamp(l.at), l.who, l.what, l.ref, l.detail]; }));
      download("close-assistant-audit-trail.csv", rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(","); }).join("\n"), "text/csv");
      return;
    }
    if (d.reset !== undefined) {
      if (!t.dataset.armed) { t.dataset.armed = "1"; t.textContent = "Click again to clear every decision"; setTimeout(function () { if (t.isConnected) { delete t.dataset.armed; t.textContent = "Reset the demo"; } }, 3000); return; }
      state.decisions = {}; state.commentary = {}; state.questions = {}; state.log = []; state.drafts = {}; state.answers = {}; save(); run(); toast("Cleared. Back to the start."); return;
    }
    if (d.defaultSettings !== undefined) { state.settings = {}; log("Thresholds reset to policy defaults"); save(); run(); return; }
  });

  document.addEventListener("submit", function (e) {
    var f = e.target;
    if (f.dataset.reasonForm) {
      e.preventDefault();
      var reason = f.reason.value.trim();
      if (reason.length < 5) { toast("Give a reason."); return; }
      decide(f.dataset.reasonForm, "dismiss", reason);
    }
    if (f.dataset.settings !== undefined) {
      e.preventDefault();
      var n = function (k) { return Number(f[k].value); };
      state.settings = { approvalLimit: n("approvalLimit"), varianceThreshold: n("varianceThreshold") / 100, outlierMultiple: n("outlierMultiple"), outlierFloor: n("outlierFloor") };
      log("Changed thresholds", JSON.stringify(state.settings));
      save(); run(); toast("Checks re-run with the new thresholds.");
    }
  });

  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t.dataset.filterStatus !== undefined) { state.apFilter.status = t.value; render(); }
    if (t.dataset.filterWho !== undefined) { state.apFilter.who = t.value; render(); }
    if (t.id === "file" && t.files[0]) {
      var file = t.files[0], reader = new FileReader();
      reader.onload = function () {
        try { R = null; load(new Uint8Array(reader.result), file.name); state.tab = "briefing"; render(); toast("Loaded " + file.name + "."); }
        catch (err) { toast(err.message); boot(); }
      };
      reader.readAsArrayBuffer(file);
      t.value = "";
    }
  });

  document.addEventListener("input", function (e) {
    var t = e.target;
    if (t.dataset.filterQ !== undefined) {
      state.apFilter.q = t.value;
      clearTimeout(t._t);
      t._t = setTimeout(function () { var pos = t.selectionStart; render(); var n = document.querySelector("[data-filter-q]"); if (n) { n.focus(); n.setSelectionRange(pos, pos); } }, 250);
    }
    if (t.dataset.answer) {
      state.answers[t.dataset.answer] = t.value;
      var ab = document.querySelector('[data-approve="' + t.dataset.answer + '"]');
      var av = R.variances.find(function (x) { return x.id === t.dataset.answer; });
      var ad = document.querySelector('[data-draft="' + t.dataset.answer + '"]');
      if (ab && av) ab.disabled = !(answerOf(av.id).length >= MIN_ANSWER && E.groundingCheck(ad ? ad.value : av.draft, av.facts).ok && E.causeCheck(ad ? ad.value : av.draft).ok && !pendingFor(av).length);
      clearTimeout(t._s); t._s = setTimeout(save, 400);
    }
    if (t.dataset.draft) {
      state.drafts[t.dataset.draft] = t.value;
      clearTimeout(t._t);
      t._t = setTimeout(function () {
        var id = t.dataset.draft, pos = t.selectionStart;
        render();
        var n = document.querySelector('[data-draft="' + id + '"]'); if (n) { n.focus(); n.setSelectionRange(pos, pos); }
      }, 600);
    }
  });

  function roleLabel(r) { return r.role === "Manager" ? "Property Accounting" : r.role === "Controller" ? "Finance" : r.role; }
  function userModal(on) {
    var m = $("#user-modal");
    m.classList.toggle("hidden", !on); m.classList.toggle("flex", on);
  }
  document.addEventListener("click", function (e) { if (e.target.dataset && e.target.dataset.userClose !== undefined) userModal(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") userModal(false); });

  function boot() {
    var bin = atob(window.DATA_PACK.base64), buf = new Uint8Array(bin.length);
    for (var k = 0; k < bin.length; k++) buf[k] = bin.charCodeAt(k);
    R = null;
    load(buf, window.DATA_PACK.name);
  }

  try { boot(); }
  catch (err) { $("#view").innerHTML = '<div class="bg-al-surface border border-al-red p-6"><h1 class="font-display text-2xl text-al-red">Couldn\'t load the data pack</h1><p class="mt-2">' + esc(err.message) + "</p></div>"; console.error(err); }
})();

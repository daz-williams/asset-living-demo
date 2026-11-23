/*
 * Asset Living OS: the platform shell (concept).
 *
 * The Close Assistant (js/app.js) is the one working module, and the app opens on it. This file
 * adds the platform around it: the sidebar, an executive view that reads the module's real
 * results, a concept screen for Payables intake that replays the same results, and a page
 * showing how the OS fits together.
 *
 * Nothing here invents data. Modules that are not built are listed in gray and go nowhere.
 */
(function () {
  "use strict";
  var E = window.CloseEngine, money = E.money;
  function $(s) { return document.querySelector(s); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function sum(a, f) { return a.reduce(function (t, x) { return t + f(x); }, 0); }
  function plural(n, one, many) { return n + " " + (n === 1 ? one : (many || one + "s")); }

  var ICON = {
    home: '<path d="M4 5h7v7H4zM13 5h7v4h-7zM13 11h7v8h-7zM4 14h7v5H4z"/>',
    close: '<path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/>',
    bank: '<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
    report: '<path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>',
    wrench: '<path d="M15 4a5 5 0 0 0-4.6 6.9L3 18.3 5.7 21l7.4-7.4A5 5 0 0 0 20 9l-3 3-3-1-1-3 3-3a5 5 0 0 0-1-1z"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5"/>'
  };
  function icon(k) { return '<svg class="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[k] + "</svg>"; }

  /*
   * Four business functions, each with four modules. Only Accounting has a working build, the
   * Close Assistant. Payables has a concept screen. Everything else is listed to show the wider
   * picture: gray, not linked, not part of this demo.
   */
  var FUNCTIONS = [
    { id: "residents", name: "Residents", icon: "users", color: "#3ea0c7" },
    { id: "operations", name: "Operations", icon: "wrench", color: "#93d500" },
    { id: "backoffice", name: "Back office", icon: "close", color: "#f6a800" },
    { id: "owners", name: "Owners and growth", icon: "target", color: "#a5bac9" }
  ];
  var MODULES = [
    { id: "leasing", fn: "residents", name: "Leasing", line: "Lead to lease" },
    { id: "resident-service", fn: "residents", name: "Resident service", line: "24/7 assistant" },
    { id: "renewals", fn: "residents", name: "Renewals", line: "Predict who stays" },
    { id: "collections", fn: "residents", name: "Collections", line: "Payments and plans" },

    { id: "maintenance", fn: "operations", name: "Maintenance", line: "Triage to closeout" },
    { id: "unit-turns", fn: "operations", name: "Unit turns", line: "Vacant to ready" },
    { id: "inspections", fn: "operations", name: "Inspections", line: "Photo-based checks" },
    { id: "capital-planning", fn: "operations", name: "Capital planning", line: "Building health" },

    { id: "payables", fn: "backoffice", name: "Payables", build: "Invoice intake", line: "Invoices to paid", status: "concept" },
    { id: "close", fn: "backoffice", name: "Accounting", build: "Close Assistant", line: "Close in days", status: "live" },
    { id: "compliance", fn: "backoffice", name: "Compliance", line: "Audit-ready files" },
    { id: "people-it", fn: "backoffice", name: "People and IT", line: "Hiring, help desk" },

    { id: "owner-portal", fn: "owners", name: "Owner portal", line: "Answers on demand" },
    { id: "new-business", fn: "owners", name: "New business", line: "Proposals and wins" },
    { id: "acquisitions", fn: "owners", name: "Acquisitions", line: "Integrate in weeks" },
    { id: "procurement", fn: "owners", name: "Procurement", line: "Vendors and spend" }
  ];
  function linked(m) { return m.status === "live" || m.status === "concept"; }
  MODULES.forEach(function (m) {
    m.status = m.status || "planned";
    m.group = FUNCTIONS.find(function (f) { return f.id === m.fn; }).name;
  });
  var STATUS = {
    live: ["Live", "bg-al-green text-al-night", "bg-al-green/25 text-al-good"],
    concept: ["Concept", "border border-white/40 text-white/80", "bg-al-blue/15 text-al-deep"],
    planned: ["Planned", "border border-white/25 text-white/60", "bg-al-light text-al-navy/60"]
  };
  var PAGES = { home: "Executive view", platform: "How the OS fits" };
  var CARD = "bg-al-surface border border-al-sand rounded-xl shadow-sm";
  var BTN = "inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors";

  var page = "close";
  var intakeAll = false;

  // ---------------------------------------------------------------- sidebar and top bar

  function navItem(id, label, ic) {
    var on = page === id;
    return '<a href="#/' + id + '" class="flex items-center gap-3 px-3 py-2 rounded-md ' + (on ? "bg-white/10 text-white font-semibold" : "text-white/70 hover:bg-white/5 hover:text-white") + '"' + (on ? ' aria-current="page"' : "") + ">" +
      icon(ic) + '<span class="flex-1 min-w-0 truncate">' + esc(label) + "</span></a>";
  }
  function navLabel(t) { return '<div class="px-3 pt-5 pb-1.5 text-[11px] uppercase tracking-widest text-white/40">' + esc(t) + "</div>"; }

  // Which business functions are open. Remembered in this browser; the function holding the
  // current page is always open.
  var openFns = { backoffice: true };
  try { openFns = JSON.parse(localStorage.getItem("asset-os:menu") || "null") || openFns; } catch (e) { /* not available */ }
  function saveMenu() { try { localStorage.setItem("asset-os:menu", JSON.stringify(openFns)); } catch (e) { /* not available */ } }

  function moduleItem(m) {
    var on = page === m.id, live = m.status === "live";
    var label = '<span class="flex-1 min-w-0 truncate">' + esc(m.name) + "</span>";
    // Not built: plain gray text, no link, so nobody clicks into an empty page mid-demo.
    if (!linked(m)) return '<span aria-disabled="true" title="Planned. Not part of this demo." class="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-md text-white/30 cursor-default select-none">' + label + "</span>";
    return '<a href="#/' + m.id + '" title="' + esc(m.name + ": " + m.line) + '" class="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-md ' + (on ? "bg-white/10 text-white font-semibold" : live ? "text-white hover:bg-white/5" : "text-white/80 hover:bg-white/5 hover:text-white") + '"' + (on ? ' aria-current="page"' : "") + ">" + label +
      '<span class="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ' + STATUS[m.status][1] + '">' + STATUS[m.status][0] + "</span></a>";
  }

  function fnGroup(f) {
    var mods = MODULES.filter(function (m) { return m.fn === f.id; });
    var holdsPage = mods.some(function (m) { return m.id === page; });
    var open = !!openFns[f.id] || holdsPage;
    var live = mods.filter(function (m) { return m.status === "live"; }).length;
    return '<div class="mt-1.5">' +
      '<button type="button" data-fn="' + f.id + '" aria-expanded="' + open + '" aria-controls="fn-' + f.id + '" class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-left bg-white/[0.06] hover:bg-white/10 border-l-[3px]" style="border-color:' + f.color + '">' +
      '<span style="color:' + f.color + '">' + icon(f.icon) + "</span>" +
      '<span class="flex-1 min-w-0 truncate text-[12px] uppercase tracking-widest font-bold ' + (holdsPage ? "text-white" : "text-white/85") + '">' + esc(f.name) + "</span>" +
      (live ? '<span class="w-2 h-2 rounded-full bg-al-green" title="' + live + ' live"></span>' : "") +
      '<span class="text-[11px] text-white/40">' + mods.length + "</span>" +
      '<svg class="w-4 h-4 text-white/50 transition-transform ' + (open ? "rotate-90" : "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>' +
      "</button>" +
      '<div id="fn-' + f.id + '" class="mt-1 ml-[18px] pl-2 border-l border-white/10 space-y-0.5' + (open ? "" : " hidden") + '">' + mods.map(moduleItem).join("") + "</div></div>";
  }

  function renderNav() {
    var allOpen = FUNCTIONS.every(function (f) { return openFns[f.id]; });
    var html = navItem("home", "Executive view", "home") +
      '<div class="flex items-center justify-between px-3 pt-5 pb-1"><span class="text-[11px] uppercase tracking-widest text-white/40">Modules</span><button type="button" data-fn-all class="text-[11px] text-white/50 hover:text-white">' + (allOpen ? "Collapse all" : "Expand all") + "</button></div>" +
      FUNCTIONS.map(fnGroup).join("") +
      navLabel("Platform") + navItem("platform", "How the OS fits", "layers");
    $("#nav").innerHTML = html;

    var m = MODULES.find(function (x) { return x.id === page; });
    // On a phone only the current page shows; the path leading to it appears from the sm width up.
    var trail = ["Asset Living OS"].concat(m ? [m.group].concat(m.build ? [m.name, m.build] : [m.name]) : [PAGES[page]]);
    var here = trail.pop();
    $("#crumb").innerHTML = '<span class="hidden sm:inline">' + trail.map(function (t) { return '<span class="text-al-navy/50">' + esc(t) + '</span> <span class="mx-1.5 text-al-navy/30">/</span> '; }).join("") + "</span>" +
      '<span class="font-semibold text-al-navy">' + esc(here) + "</span>";
    document.title = "Asset Living OS - " + (m ? (m.build || m.name) : PAGES[page]);

    var who = (window.CloseModule && window.CloseModule.state.reviewer) || "";
    $("#avatar").textContent = who.split(/[\s.]+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase();
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-fn], [data-fn-all]");
    if (!b) return;
    if (b.dataset.fn) openFns[b.dataset.fn] = b.getAttribute("aria-expanded") !== "true";
    else { var all = FUNCTIONS.every(function (f) { return openFns[f.id]; }); FUNCTIONS.forEach(function (f) { openFns[f.id] = !all; }); }
    saveMenu(); renderNav();
  });

  // ---------------------------------------------------------------- executive view

  function kpi(value, label, tone, sub) {
    var c = { red: "text-al-red", amber: "text-al-amber", good: "text-al-good", deep: "text-al-deep" }[tone || "deep"];
    return '<div class="' + CARD + ' p-4 sm:p-5"><div class="text-sm text-al-navy/60">' + label + '</div><div class="font-display text-2xl sm:text-3xl mt-1 ' + c + '">' + esc(value) + "</div>" + (sub ? '<div class="text-xs text-al-navy/60 mt-1">' + sub + "</div>" : "") + "</div>";
  }

  function viewHome() {
    var C = window.CloseModule;
    if (!C || !C.R) return '<div class="' + CARD + ' p-6">The Close Assistant has no data loaded.</div>';
    var R = C.R, s = R.summary, cal = s.calendar;
    var isOpen = function (it) { var d = C.state.decisions[it.id]; return !d || d.state !== "done"; };
    var open = R.items.filter(isOpen);
    var has = function (it, t) { return it.types.indexOf(t) >= 0; };
    var hold = open.filter(function (it) { return has(it, "duplicate") || has(it, "offboarded"); });
    var appr = open.filter(function (it) { return has(it, "approval"); });
    var props = R.close.properties;
    var slip = props.filter(function (p) { return p.forecast === "will_slip"; }).length;
    var risk = props.filter(function (p) { return p.forecast === "at_risk"; }).length;
    var amount = function (a) { return sum(a, function (it) { return it.atStake; }); };

    var regions = {};
    props.forEach(function (p) {
      var r = regions[p.region] = regions[p.region] || { name: p.region, n: 0, slip: 0, risk: 0, ok: 0, flagged: 0, count: 0 };
      r.n++;
      if (p.forecast === "will_slip") r.slip++; else if (p.forecast === "at_risk") r.risk++; else r.ok++;
    });
    open.forEach(function (it) { var r = regions[it.region]; if (r) { r.flagged += it.atStake; r.count++; } });
    var rows = Object.keys(regions).map(function (k) { return regions[k]; }).sort(function (a, b) { return b.slip - a.slip || b.risk - a.risk || b.flagged - a.flagged; });
    function bar(r) {
      var seg = function (n, cls) { return n ? '<span class="h-2 ' + cls + '" style="width:' + (n / r.n * 100) + '%"></span>' : ""; };
      return '<div class="flex w-28 rounded-full overflow-hidden bg-al-light" role="img" aria-label="' + r.slip + " will miss, " + r.risk + " need fixes, " + r.ok + ' on track">' + seg(r.slip, "bg-al-red") + seg(r.risk, "bg-al-orange") + seg(r.ok, "bg-al-green") + "</div>";
    }

    return '<div class="mb-6"><p class="text-sm uppercase tracking-widest text-al-blue font-semibold">Executive view' + (cal.asOfDate ? " · " + esc(E.longDate(cal.asOfDate)) : "") + "</p>" +
      '<h1 class="font-display text-2xl sm:text-3xl text-al-deep mt-1">What needs attention today</h1>' +
      '<p class="text-al-navy/70 mt-1 max-w-3xl">One view across every module, so issues surface here before an owner raises them.</p></div>' +

      '<div class="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">' +
      kpi(slip, "Owner reports that will miss BD" + s.ownerReportDay, "red", risk + " more need fixes first; " + (props.length - slip - risk) + " on track") +
      kpi(money(amount(hold)), "To hold before payment", "red", plural(hold.length, "invoice") + ": duplicates and off-boarded properties") +
      kpi(money(amount(appr)), "Waiting on Regional Manager approval", "amber", plural(appr.length, "invoice") + " over " + money(R.cfg.approvalLimit)) +
      kpi(s.typedComplete + " vs " + s.evidenceComplete, "Close steps marked complete vs. supported", "deep", plural(s.contradictions, "step") + " the data contradicts") +
      "</div>" +

      '<div class="grid xl:grid-cols-3 gap-6 mt-6">' +
      '<div class="' + CARD + ' xl:col-span-2 overflow-hidden min-w-0"><div class="p-5 border-b border-al-sand flex flex-wrap items-center justify-between gap-2"><div><h2 class="font-display text-xl text-al-deep">Owner reports by region</h2><p class="text-sm text-al-navy/60">' + esc(s.period.label) + " close, due BD" + s.ownerReportDay + (cal.dueDate ? " (" + esc(E.longDate(cal.dueDate)) + ")" : "") + '. From the Close Assistant.</p></div><a href="#/close/close" class="' + BTN + ' border border-al-deep text-al-deep hover:bg-al-cream">Open close status</a></div>' +
      '<div class="overflow-x-auto"><table class="w-full text-sm min-w-[36rem]"><thead><tr class="text-left text-xs uppercase tracking-wider text-al-navy/50 border-b border-al-sand"><th class="px-5 py-2.5">Region</th><th class="py-2.5 text-right">Properties</th><th class="px-4 py-2.5">Forecast</th><th class="py-2.5 text-right">Will miss</th><th class="py-2.5 text-right">Need fixes</th><th class="px-5 py-2.5 text-right">Flagged invoices open</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr class="border-b border-al-sand last:border-0"><td class="px-5 py-3 font-semibold">' + esc(r.name) + '</td><td class="py-3 text-right">' + r.n + '</td><td class="px-4 py-3">' + bar(r) + '</td><td class="py-3 text-right ' + (r.slip ? "text-al-red font-semibold" : "text-al-navy/40") + '">' + r.slip + '</td><td class="py-3 text-right ' + (r.risk ? "text-al-amber font-semibold" : "text-al-navy/40") + '">' + r.risk + '</td><td class="px-5 py-3 text-right">' + (r.count ? money(r.flagged) + ' <span class="text-al-navy/50">(' + r.count + ")</span>" : '<span class="text-al-navy/40">None</span>') + "</td></tr>";
      }).join("") + "</tbody></table></div></div>" +

      '<div class="' + CARD + ' p-5"><h2 class="font-display text-xl text-al-deep">Start here</h2><ol class="mt-3 space-y-3 text-sm">' +
      [["close/briefing", "Morning briefing", "Today's actions for the Accounting Manager, in order."],
       ["close/ap", plural(open.length, "invoice") + " need a person", "Before they are paid or posted."],
       ["close/commentary", plural(R.variances.filter(function (v) { return !C.state.commentary[v.id]; }).length, "category", "categories") + " need owner commentary", "More than " + E.pct(R.cfg.varianceThreshold) + " off budget."],
       ["close/close", plural(slip + risk, "owner report") + " at risk", "Who will miss BD" + s.ownerReportDay + ", and why."]
      ].map(function (a) { return '<li><a href="#/' + a[0] + '" class="group flex items-start justify-between gap-3 p-3 -m-1 rounded-lg hover:bg-al-cream"><span><span class="font-semibold text-al-deep group-hover:underline">' + esc(a[1]) + '</span><span class="block text-al-navy/60">' + esc(a[2]) + '</span></span><span class="text-al-navy/40 mt-0.5" aria-hidden="true">&rsaquo;</span></a></li>'; }).join("") +
      "</ol></div></div>" +

      '<h2 class="font-display text-xl text-al-deep mt-8 mb-3">Modules</h2>' +
      '<div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">' + FUNCTIONS.map(function (f) {
        return '<div class="' + CARD + ' p-5 border-t-[3px]" style="border-top-color:' + f.color + '"><div class="flex items-center gap-2 text-al-deep">' + icon(f.icon) + '<span class="text-xs uppercase tracking-widest font-bold">' + esc(f.name) + '</span></div><ul class="mt-3 space-y-1 text-sm">' +
          MODULES.filter(function (m) { return m.fn === f.id; }).map(function (m) {
            var liveM = m.status === "live";
            if (!linked(m)) return '<li class="flex items-center justify-between gap-2 px-2 py-1.5 -mx-2 text-al-navy/35 cursor-default"><span>' + esc(m.name) + ' <span class="text-xs">' + esc(m.line) + "</span></span></li>";
            return '<li><a href="#/' + m.id + '" class="flex items-center justify-between gap-2 px-2 py-1.5 -mx-2 rounded-md hover:bg-al-cream"><span class="' + (liveM ? "font-semibold text-al-navy" : "text-al-navy/80") + '">' + esc(m.name) + ' <span class="text-xs font-normal text-al-navy/40">' + esc(m.line) + '</span></span><span class="text-xs font-semibold px-2 py-0.5 rounded-full ' + STATUS[m.status][2] + '">' + STATUS[m.status][0] + "</span></a></li>";
          }).join("") + "</ul></div>";
      }).join("") + "</div>";
  }

  // ---------------------------------------------------------------- payables intake (concept)

  /*
   * The Close Assistant finds problems at month-end, after they are in the books. This screen
   * shows the same invoices as they would look at the door: the same checks, run on the day each
   * invoice arrives. It replays the real results. Reading the invoice document and posting to
   * the PMS are not built, and the screen says so.
   */
  var INTAKE_STAGE = { duplicate: "match", offboarded: "match", reference: "match", miscoded: "code", prior_period: "policy", approval: "policy", outlier: "policy", split: "policy" };
  var STAGE_ORDER = ["match", "code", "policy"];
  function days(a, b) { return Math.round((new Date(b + "T00:00:00Z") - new Date(a + "T00:00:00Z")) / 86400000); }

  function viewIntake() {
    var C = window.CloseModule;
    if (!C || !C.R) return '<div class="' + CARD + ' p-6">No data loaded.</div>';
    var R = C.R, s = R.summary, T = C.types, asOf = s.calendar.asOfDate, G = R.coding;
    // GL code as keyed, shown quietly. The suggestion and its confidence appear only when it
    // disagrees with what was keyed, or when confidence is too low to code without a person.
    function codeCell(i) {
      var g = G.byLine[i.line], acct = R.model.accounts.find(function (a) { return a.code === i.gl; });
      var keyed = '<div class="whitespace-nowrap text-al-navy/60">' + esc(i.gl) + " " + esc(acct ? acct.name : "") + "</div>";
      if (!g || !g.gl || (g.agrees && !g.low)) return keyed;
      var pc = Math.round(g.confidence * 100);
      return keyed + '<div class="text-xs text-al-amber font-semibold mt-1 whitespace-nowrap" title="' + esc(pc + "% of the " + g.basedOn + " other invoices with this description use " + g.gl) + '">' +
        (g.agrees ? "Low confidence (" + pc + "%): needs a person" : "Suggest " + esc(g.gl) + " " + esc(g.name) + " · " + pc + "% confident") + "</div>";
    }
    var byLine = {};
    R.items.forEach(function (it) { byLine[it.line] = it; });
    var stageOf = function (it) { return STAGE_ORDER.find(function (st) { return it.types.some(function (t) { return INTAKE_STAGE[t] === st; }); }); };
    var count = { match: 0, code: 0, policy: 0 };
    R.items.forEach(function (it) { count[stageOf(it)]++; });
    var stopped = R.items.length, clean = s.invoices - stopped;
    var stoppedAmount = sum(R.items, function (it) { return it.atStake; });
    var waits = asOf ? R.items.filter(function (it) { return it.invoice.receivedDate; }).map(function (it) { return days(it.invoice.receivedDate, asOf); }) : [];
    var avgWait = waits.length ? Math.round(sum(waits, function (x) { return x; }) / waits.length) : null;

    var stages = [
      ["Receive", "Email, vendor portal or scan, into one inbox.", s.invoices + " received"],
      ["Read", "Vendor, invoice number, amount, service dates and lines, read from the invoice.", s.invoices + " read"],
      ["Match", "Vendor, property and invoice number against master data and everything already received.", count.match + " stopped"],
      ["Code", "GL code suggested from how this kind of invoice is usually coded, with a confidence score.", count.code + " stopped"],
      ["Policy", "Service month against the open period, the approval limit, unusual amounts and possible splits.", count.policy + " stopped"],
      ["Route and post", "Clean invoices post straight through. Exceptions go to a named person with the reason.", clean + " posted · " + stopped + " to review"]
    ];

    var rows = R.model.invoices.slice().sort(function (a, b) {
      var fa = byLine[a.line] ? 0 : 1, fb = byLine[b.line] ? 0 : 1;
      return fa - fb || (a.receivedDate < b.receivedDate ? 1 : a.receivedDate > b.receivedDate ? -1 : a.line - b.line);
    });
    var shown = intakeAll ? rows : rows.slice(0, stopped);
    var chip = function (text, cls) { return '<span class="inline-flex items-center px-2 py-0.5 text-xs font-semibold whitespace-nowrap rounded-full ' + cls + '">' + esc(text) + "</span>"; };

    return '<h1 class="font-display text-2xl sm:text-3xl text-al-deep">Invoice intake</h1>' +
      '<p class="text-al-navy/70 mt-1 max-w-3xl">Every invoice is checked on the day it arrives. Clean invoices post straight through. Exceptions go to a person, with the reason.</p>' +

      '<div class="grid grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4 mt-6">' +
      kpi(s.invoices, "Invoices received", "deep", money(s.invoiceTotal) + " in " + esc(s.period.label)) +
      kpi(clean, "Straight through", "good", Math.round(clean / s.invoices * 100) + "% needed no one") +
      kpi(stopped, "Stopped for a person", "amber", money(stoppedAmount) + ", each with a reason") +
      kpi(Math.round(G.average * 100) + "%", "Average coding confidence", "deep", G.suggested + " coded automatically; " + G.differ + " differ from the keyed code" + (G.low ? "; " + G.low + " low confidence" : "")) +
      (avgWait != null ? kpi(avgWait + " days", "Caught sooner than at month-end", "deep", "Average across the " + stopped + " stopped invoices") : "") +
      "</div>" +

      '<h2 class="font-display text-xl text-al-deep mt-8 mb-3">The pipeline</h2>' +
      '<div class="grid sm:grid-cols-2 xl:grid-cols-6 gap-3">' + stages.map(function (st, k) {
        return '<div class="rounded-xl p-4 text-sm bg-al-surface border border-al-sand shadow-sm"><span class="text-xs uppercase tracking-widest font-bold text-al-deep">' + (k + 1) + ". " + esc(st[0]) + '</span><p class="mt-2 text-al-navy/70">' + esc(st[1]) + '</p><p class="mt-3 text-xs font-semibold ' + (/stopped|review/.test(st[2]) ? "text-al-amber" : "text-al-good") + '">' + esc(st[2]) + "</p></div>";
      }).join("") + "</div>" +

      '<div class="' + CARD + ' mt-8 overflow-hidden"><div class="p-5 border-b border-al-sand flex flex-wrap items-center justify-between gap-3"><div><h2 class="font-display text-xl text-al-deep">Intake queue</h2><p class="text-sm text-al-navy/60">' + (intakeAll ? "All " + s.invoices + " invoices. Stopped ones first." : stopped + " stopped for a person. " + clean + " went straight through.") + '</p></div><button type="button" data-intake-all class="' + BTN + ' border border-al-deep text-al-deep hover:bg-al-cream">' + (intakeAll ? "Show only stopped" : "Show all " + s.invoices) + "</button></div>" +
      '<div class="overflow-x-auto"><table class="w-full text-sm min-w-[64rem]"><thead><tr class="text-left text-xs uppercase tracking-wider text-al-navy/50 border-b border-al-sand"><th class="px-5 py-2.5">Received</th><th class="py-2.5">Vendor</th><th class="py-2.5">Property</th><th class="py-2.5">For</th><th class="py-2.5 text-right">Amount</th><th class="px-4 py-2.5">GL code</th><th class="px-4 py-2.5">At intake</th><th class="px-5 py-2.5"></th></tr></thead><tbody>' +
      shown.map(function (i) {
        var it = byLine[i.line];
        return '<tr class="border-b border-al-sand last:border-0 align-top ' + (it ? "" : "text-al-navy/50") + '"><td class="px-5 py-2.5 whitespace-nowrap">' + esc(E.usDate(i.receivedDate)) + '</td><td class="py-2.5 pr-3">' + esc(i.vendor) + '<div class="text-xs text-al-navy/50">' + esc(i.invoiceNo) + '</div></td><td class="py-2.5 pr-3">' + esc(i.property) + '</td><td class="py-2.5 pr-3">' + esc(i.description) + '</td><td class="py-2.5 text-right whitespace-nowrap">' + money(i.amount, true) + '</td><td class="px-4 py-2.5">' + codeCell(i) + '</td><td class="px-4 py-2.5">' +
          (it ? '<div class="flex flex-wrap gap-1">' + it.types.map(function (t) { return chip(T[t].label, it.severity === "high" ? "bg-al-red/10 text-al-red" : "bg-al-orange/20 text-al-amber"); }).join("") + '</div><div class="text-xs text-al-navy/60 mt-1">' + esc(it.issues[0].title) + "</div>" : chip("Straight through", "bg-al-light text-al-navy/50")) +
          '</td><td class="px-5 py-2.5 text-right whitespace-nowrap">' + (it ? '<a class="text-al-deep font-semibold hover:underline" href="#/close/ap" data-intake-open="' + esc(i.invoiceNo) + '">Open in AP review</a>' : "") + "</td></tr>";
      }).join("") + "</tbody></table></div></div>";
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-intake-all], [data-intake-open]");
    if (!t) return;
    if (t.dataset.intakeOpen) { Object.assign(window.CloseModule.state.apFilter, { type: "all", status: "all", who: "all", q: t.dataset.intakeOpen }); window.CloseModule.goto("ap"); return; }
    intakeAll = !intakeAll;
    $("#shell-view").innerHTML = viewIntake();
  });

  // ---------------------------------------------------------------- how the OS fits

  function viewPlatform() {
    function layer(label, note, items, tone) {
      return '<div class="grid md:grid-cols-5 gap-3 items-stretch"><div class="md:col-span-1 flex flex-col justify-center"><div class="text-xs uppercase tracking-widest text-al-navy/50">' + label + '</div><div class="text-xs text-al-navy/60 mt-1">' + note + '</div></div><div class="md:col-span-4 grid grid-cols-2 sm:grid-cols-3 gap-2">' +
        items.map(function (i) {
          var built = i[1] === "built", cls = tone === "dark" ? "bg-al-navy text-white" : tone === "plain" ? "bg-al-surface border border-al-sand" : built ? "bg-al-deep text-white" : "bg-al-surface border border-dashed border-al-navy/30 text-al-navy/70";
          return '<div class="rounded-lg px-3 py-3 text-sm ' + cls + '"><div class="font-semibold">' + esc(i[0]) + "</div>" + (i[2] ? '<div class="text-xs mt-0.5 ' + (built || tone === "dark" ? "text-white/70" : "text-al-navy/50") + '">' + esc(i[2]) + "</div>" : "") + "</div>";
        }).join("") + "</div></div>";
    }
    var arrow = '<div class="md:pl-[20%] text-center text-al-navy/30 text-xs leading-none py-1" aria-hidden="true">&#9650;&nbsp;&nbsp;&#9660;</div>';
    function stage(title, tone, items) {
      return '<div class="' + CARD + ' p-5"><span class="text-xs font-semibold px-2 py-0.5 rounded-full ' + tone + '">' + title + '</span><ul class="mt-3 space-y-3 text-sm">' + items.map(function (i) { return '<li><div class="font-semibold">' + esc(i[0]) + '</div><div class="text-al-navy/60">' + esc(i[1]) + "</div></li>"; }).join("") + "</ul></div>";
    }
    return '<div class="mb-6"><h1 class="font-display text-2xl sm:text-3xl text-al-deep">How the OS fits</h1><p class="text-al-navy/70 mt-1 max-w-3xl">Asset Living OS sits on top of the property management systems. They stay the systems of record: read from and written back to, never replaced. Each module is built on one shared core, so every build makes the next one faster.</p></div>' +
      '<div class="' + CARD + ' p-5 sm:p-6 space-y-1">' +
      layer("People", "Who each layer serves", [["Executives", "", "One view of what needs attention"], ["Accounting team", "", "Exceptions, not data entry"], ["Owners", "", "Accurate packages, no surprises"]], "plain") + arrow +
      layer("Modules", "Sixteen modules in four functions", FUNCTIONS.map(function (f) { var ms = MODULES.filter(function (m) { return m.fn === f.id; }), lv = ms.filter(function (m) { return m.status === "live"; }); return [f.name, lv.length ? "built" : "", ms.map(function (m) { return m.name; }).join(", ") + (lv.length ? ". Live: " + lv.map(function (m) { return m.build || m.name; }).join(", ") : "")]; }).concat([["Executive view", "built", "Reads every module"]])) + arrow +
      layer("Shared core", "Built once, used by every module", [["Linked data model", "built", "Property, invoice, GL, budget line, close step"], ["Exception checks", "built", "Plain rules, every number in code"], ["Review queue", "built", "Reasons, second reviewer, no self-clearing"], ["Audit trail", "built", "Who decided what, and when"], ["Document AI", "", "Read the invoice itself"], ["Matching and mapping memory", "", "Bank to ledger; owner charts of accounts"]]) + arrow +
      layer("Systems of record", "Read from and written back to, never replaced", [["RealPage", "", ""], ["Yardi", "", ""], ["Entrata", "", ""]], "dark") +
      "</div>" +
      '<h2 class="font-display text-xl text-al-deep mt-8 mb-3">The sequence</h2>' +
      '<div class="grid md:grid-cols-3 gap-4">' +
      stage("Now", "bg-al-green/25 text-al-good", [["Accounting: Close Assistant", "Built first: it recurs every month for every property, and it creates the data model, checks, review flow and audit trail."], ["Executive view", "One view of what needs attention, across modules."]]) +
      stage("Next", "bg-al-orange/20 text-al-amber", [["Acquisitions", "The same checks and review queue, pointed at rent rolls, takeover tasks and vendor contracts."], ["New business", "The same \"flag what you can't support\" rule, pointed at proposal claims."]]) +
      stage("Later", "bg-al-light text-al-navy/60", [["Payables and the Owner portal", "Checks move to the day an invoice arrives. Needs document AI, bank feeds and PMS write-back."], ["Residents and Operations", "Leasing, maintenance and unit turns reuse the same core on new data."]]) +
      "</div>";
  }

  // ---------------------------------------------------------------- routing

  var TABS = ["briefing", "ap", "commentary", "close", "outputs", "how"];

  function show() {
    var isClose = page === "close";
    $("#module-close").style.display = isClose ? "" : "none";
    var sv = $("#shell-view");
    sv.classList.toggle("hidden", isClose);
    if (!isClose) {
      sv.innerHTML = page === "home" ? viewHome() : page === "platform" ? viewPlatform() : viewIntake();
    }
    renderNav();
  }

  function route() {
    var parts = location.hash.replace(/^#\/?/, "").split("/");
    // The app opens on the working module. Modules that are not built have no page.
    var id = parts[0] || "close";
    if (!PAGES[id] && !MODULES.some(function (m) { return m.id === id && linked(m); })) id = "close";
    var changed = id !== page;
    page = id;
    if (id === "close" && parts[1] && TABS.indexOf(parts[1]) >= 0 && window.CloseModule && window.CloseModule.state.tab !== parts[1]) window.CloseModule.goto(parts[1]);
    show();
    if (changed) window.scrollTo(0, 0);
    menu(false);   // close the menu on small screens
  }

  // Keep the address in step with the module's own tabs, so a refresh returns to the same place.
  document.addEventListener("close:render", function () {
    if (page === "close" && window.CloseModule) {
      var want = "#/close/" + window.CloseModule.state.tab;
      if (location.hash !== want) history.replaceState(null, "", want);
    }
    if (page === "home") $("#shell-view").innerHTML = viewHome();
    if (page === "payables") $("#shell-view").innerHTML = viewIntake();
    renderNav();
  });
  window.addEventListener("hashchange", route);
  // Below the desktop width the sidebar is a slide-over menu.
  function menu(open) {
    var sb = $("#sidebar");
    sb.classList.toggle("hidden", !open);
    ["fixed", "inset-y-0", "left-0", "flex", "shadow-2xl"].forEach(function (c) { sb.classList.toggle(c, open); });
    $("#menu-backdrop").classList.toggle("hidden", !open);
    document.body.classList.toggle("menu-open", open);   // stops the page scrolling behind the menu
    $("#menu-btn").setAttribute("aria-expanded", String(open));
  }
  $("#menu-btn").addEventListener("click", function () { menu($("#sidebar").classList.contains("hidden")); });
  $("#menu-close").addEventListener("click", function () { menu(false); });
  $("#menu-backdrop").addEventListener("click", function () { menu(false); });
  $("#user-btn").addEventListener("click", function () { menu(false); });   // the switch-user dialog takes over
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") menu(false); });

  // ---------------------------------------------------------------- light and dark mode

  // Light by default, whatever the device is set to. Dark is opt-in; the pick is remembered in this browser.
  // index.html applies it before first paint. The colours themselves are in tailwind/input.css.
  function theme(dark) {
    document.documentElement.classList.toggle("dark", dark);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? "#131e2d" : "#ffffff";
    var label = "Switch to " + (dark ? "light" : "dark") + " mode", b = $("#theme-btn");
    b.setAttribute("aria-label", label); b.title = label;
  }
  function isDark() { return document.documentElement.classList.contains("dark"); }
  $("#theme-btn").addEventListener("click", function () {
    theme(!isDark());
    try { localStorage.setItem("asset-os:theme", isDark() ? "dark" : "light"); } catch (e) { /* not available */ }
  });
  theme(isDark());

  route();
})();

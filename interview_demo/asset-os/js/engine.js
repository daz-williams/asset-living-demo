/*
 * Close Assistant: the checks.
 *
 * Reads the data pack, links the records together (property, invoice, GL account,
 * budget line, close step, accountant) and runs every check. Every number is
 * calculated here, in plain JavaScript, in the browser. Nothing is sent anywhere,
 * and nothing in the source data is changed.
 *
 * Works in the browser (window.CloseEngine) and in Node (module.exports) so the
 * same code can be regression-tested against the answer key.
 */
(function (root) {
  "use strict";

  // Finance owns these. They can be changed on the "Ontology & rules" tab.
  var DEFAULTS = {
    approvalLimit: 10000,     // policy: invoices over this need Regional Manager approval
    varianceThreshold: 0.10,  // policy: commentary required beyond this
    outlierMultiple: 5,       // flag an invoice this many times the vendor's usual amount
    outlierFloor: 10000,      // ...and at least this large
    codingShare: 0.75,        // a description's usual GL code must cover this share of its invoices
    ownerReportDay: 8,        // owner reports are due on this business day
    splitDays: 3,             // invoices this close together can look like one job billed in parts
    codingConfidence: 0.9     // a suggested GL code below this confidence goes to a person
  };

  var STEP_ORDER = [
    "Bank reconciliation", "AP cutoff & accruals", "Rent/AR reconciliation", "Payroll allocation",
    "Prepaid & deposit roll", "Variance commentary", "Owner report draft", "Owner report final"
  ];

  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"];
  var MON3 = MONTHS.map(function (m) { return m.slice(0, 3).toLowerCase(); });

  // ---------------------------------------------------------------- formatting

  function money(v, cents) {
    var n = Number(v) || 0;
    var s = Math.abs(n).toLocaleString("en-US", {
      minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0
    });
    return (n < 0 ? "-$" : "$") + s;
  }
  function pct(v) { return Math.round(Math.abs(v) * 100) + "%"; }
  function usDate(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    return p[1] + "/" + p[2] + "/" + p[0];
  }
  function median(a) {
    var s = a.slice().sort(function (x, y) { return x - y; });
    var m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  }
  function sum(a, f) { return a.reduce(function (t, x) { return t + (f ? f(x) : x); }, 0); }
  function article(word) { return /^[aeiou]/i.test(word) ? "an" : "a"; }
  function round2(v) { return Math.round(v * 100) / 100; }
  function daysBetween(a, b) { return Math.round((new Date(b + "T00:00:00Z") - new Date(a + "T00:00:00Z")) / 86400000); }
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  // Move n business days from a date. Weekends are skipped; holidays are not known (stated as a limit).
  function addBD(iso, n) {
    var d = new Date(iso + "T00:00:00Z"), step = n < 0 ? -1 : 1;
    n = Math.abs(n);
    while (n > 0) { d.setUTCDate(d.getUTCDate() + step); var w = d.getUTCDay(); if (w !== 0 && w !== 6) n--; }
    return d.toISOString().slice(0, 10);
  }
  function plainDays(n) { return n === 0 ? "the same day" : n === 1 ? "a day of each other" : n + " days"; }
  function longDate(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T00:00:00Z");
    return DAYS[d.getUTCDay()] + ", " + MONTHS[d.getUTCMonth()] + " " + d.getUTCDate();
  }

  // ---------------------------------------------------------------- reading

  function toISO(v) {
    if (v == null || v === "") return null;
    if (typeof v === "number") { // Excel serial date
      var d = new Date(Math.round((v - 25569) * 86400000));
      return d.toISOString().slice(0, 10);
    }
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    var s = String(v).trim();
    var m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return m[1] + "-" + m[2] + "-" + m[3];
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if (m) {
      var y = m[3].length === 2 ? "20" + m[3] : m[3];
      return y + "-" + ("0" + m[1]).slice(-2) + "-" + ("0" + m[2]).slice(-2);
    }
    return null;
  }
  function toNum(v) {
    if (typeof v === "number") return v;
    if (v == null || v === "") return null;
    var n = Number(String(v).replace(/[$,\s]/g, "").replace(/^\((.*)\)$/, "-$1"));
    return isNaN(n) ? null : n;
  }
  function toText(v) { return v == null ? "" : String(v).trim(); }
  function toCode(v) { return toText(v).replace(/\.0+$/, ""); }
  function toBD(v) {
    var m = toText(v).match(/(\d+)/);
    return m ? Number(m[1]) : null;
  }

  /*
   * Read the workbook into one linked model. Tabs are found by their prefix (B0 to B4)
   * and columns by their header names, so a renamed tab or reordered column still loads.
   */
  function readWorkbook(XLSX, wb) {
    function sheet(prefix) {
      var name = wb.SheetNames.find(function (n) { return n.trim().toUpperCase().indexOf(prefix) === 0; });
      if (!name) throw new Error('This file has no "' + prefix + '" tab. Load the Build Exercise data pack.');
      return { name: name, rows: XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, raw: true, defval: null, blankrows: true }) };
    }
    function table(prefix, spec) {
      var s = sheet(prefix);
      var hi = s.rows.findIndex(function (r) { return r.filter(function (v) { return v != null && v !== ""; }).length >= 3; });
      if (hi < 0) throw new Error('The "' + s.name + '" tab is empty.');
      var headers = s.rows[hi].map(function (h) { return toText(h).toLowerCase(); });
      var idx = {};
      Object.keys(spec).forEach(function (k) {
        // Exact name first, then "starts with", then "contains" (e.g. "Sep-26 Actual ($)").
        var tests = [function (h, a) { return h === a || h.replace(/\s*\(.*\)$/, "") === a; }, function (h, a) { return h.indexOf(a) === 0; }, function (h, a) { return h.indexOf(a) >= 0; }];
        var i = -1;
        tests.some(function (t) { i = headers.findIndex(function (h) { return spec[k].some(function (a) { return t(h, a); }); }); return i >= 0; });
        if (i < 0) throw new Error('The "' + s.name + '" tab is missing a "' + spec[k][0] + '" column.');
        idx[k] = i;
      });
      var first = Object.keys(spec)[0];
      var rows = [];
      for (var r = hi + 1; r < s.rows.length; r++) {
        var row = s.rows[r] || [];
        if (row[idx[first]] == null || row[idx[first]] === "") continue;
        var o = { _row: r };
        Object.keys(idx).forEach(function (k) { o[k] = row[idx[k]]; });
        rows.push(o);
      }
      return { name: s.name, headerRow: hi, width: headers.length, headers: s.rows[hi], rows: rows };
    }

    var t0 = table("B0", { id: ["property id"], name: ["property"], segment: ["segment"], market: ["market"], region: ["region"], units: ["units"], status: ["status"] });
    var t1 = table("B1", { code: ["gl code"], name: ["account name"], category: ["category"] });
    var t2 = table("B2", { line: ["line"], invoiceNo: ["invoice #", "invoice no", "invoice number"], vendor: ["vendor"], propertyId: ["property id"], property: ["property"], gl: ["gl code"], description: ["description"], amount: ["amount"], invoiceDate: ["invoice date"], receivedDate: ["received"], approval: ["approval"], codedBy: ["coded by"] });
    var t3 = table("B3", { propertyId: ["property id"], property: ["property"], region: ["region"], category: ["category"], budget: ["budget", "sep-26 budget"], actual: ["actual"], commentary: ["variance commentary", "commentary"] });
    // The budget columns are named after the month, e.g. "Sep-26 Budget ($)".
    var t4 = table("B4", { propertyId: ["property id"], property: ["property"], region: ["region"], accountant: ["staff accountant", "accountant"], step: ["close step"], due: ["due"], completed: ["completed"], status: ["status"] });

    var model = { sheets: { B0: t0.name, B1: t1.name, B2: t2.name, B3: t3.name, B4: t4.name }, tables: { B0: t0, B1: t1, B2: t2, B3: t3, B4: t4 }, warnings: [] };

    model.properties = t0.rows.map(function (r) {
      var status = toText(r.status);
      var off = status.toLowerCase().indexOf("off-board") === 0;
      return { id: toText(r.id), name: toText(r.name), segment: toText(r.segment), market: toText(r.market), region: toText(r.region), units: toNum(r.units), status: status, offboarded: off, offboardDate: off ? toISO((status.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/) || [])[1]) : null };
    });
    model.accounts = t1.rows.map(function (r) { return { code: toCode(r.code), name: toText(r.name), category: toText(r.category) }; });
    model.invoices = t2.rows.map(function (r) {
      return { line: toNum(r.line), invoiceNo: toText(r.invoiceNo), vendor: toText(r.vendor), propertyId: toText(r.propertyId), property: toText(r.property), gl: toCode(r.gl), description: toText(r.description), amount: toNum(r.amount) || 0, invoiceDate: toISO(r.invoiceDate), receivedDate: toISO(r.receivedDate), approval: toText(r.approval), codedBy: toText(r.codedBy), _row: r._row };
    });
    model.budget = t3.rows.map(function (r) {
      return { propertyId: toText(r.propertyId), property: toText(r.property), region: toText(r.region), category: toText(r.category), budget: toNum(r.budget) || 0, actual: toNum(r.actual) || 0, commentary: toText(r.commentary), _row: r._row };
    });
    model.close = t4.rows.map(function (r) {
      return { propertyId: toText(r.propertyId), property: toText(r.property), region: toText(r.region), accountant: toText(r.accountant), step: toText(r.step), due: toBD(r.due), completed: toBD(r.completed), status: toText(r.status), _row: r._row };
    });

    // Today's business day comes from the tracker's status header, e.g. "Status (as of BD6)".
    var statusHeader = toText(t4.headers.find(function (h) { return /status/i.test(toText(h)); }));
    model.asOfBD = toBD((statusHeader.match(/BD\s*\d+/i) || [""])[0]) || 6;

    // The close month comes from the invoice tab name ("Sep-26"); failing that, the most common invoice month.
    var m = t2.name.match(/([A-Za-z]{3})[- ](\d{2})/);
    var year, month;
    if (m && MON3.indexOf(m[1].toLowerCase()) >= 0) { month = MON3.indexOf(m[1].toLowerCase()) + 1; year = 2000 + Number(m[2]); }
    else {
      var counts = {};
      model.invoices.forEach(function (i) { if (i.invoiceDate) { var k = i.invoiceDate.slice(0, 7); counts[k] = (counts[k] || 0) + 1; } });
      var top = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0] || "2026-09";
      year = Number(top.slice(0, 4)); month = Number(top.slice(5, 7));
    }
    model.period = { year: year, month: month, label: MONTHS[month - 1] + " " + year, short: MONTHS[month - 1], start: year + "-" + ("0" + month).slice(-2) + "-01" };
    model.priorMonth = MONTHS[(month + 10) % 12];

    // The calendar date behind "today" comes from the README tab ("Data as of: Friday, October 16, 2026").
    // Read together with "as of BD6", it dates every business day of the close.
    model.asOfDate = null;
    var readme = wb.SheetNames.find(function (n) { return /readme/i.test(n); });
    if (readme) {
      XLSX.utils.sheet_to_json(wb.Sheets[readme], { header: 1, raw: false, defval: "" }).some(function (r) {
        var line = r.join(" ");
        var d = line.match(/data as of:?\s*(?:[A-Za-z]+,\s*)?([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/i);
        if (d && MON3.indexOf(d[1].slice(0, 3).toLowerCase()) >= 0) {
          model.asOfDate = d[3] + "-" + ("0" + (MON3.indexOf(d[1].slice(0, 3).toLowerCase()) + 1)).slice(-2) + "-" + ("0" + d[2]).slice(-2);
          return true;
        }
        d = line.match(/data as of:?\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/i);
        if (d) { model.asOfDate = toISO(d[1]); return true; }
        return false;
      });
    }
    return model;
  }

  // ---------------------------------------------------------------- the checks

  function analyze(model, opts) {
    var cfg = Object.assign({}, DEFAULTS, opts || {});
    var props = {}, accounts = {}, accountantOf = {};
    model.properties.forEach(function (p) { props[p.id] = p; });
    model.accounts.forEach(function (a) { accounts[a.code] = a; });
    model.close.forEach(function (s) { accountantOf[s.propertyId] = s.accountant; });
    var categoryOf = function (gl) { return accounts[gl] ? accounts[gl].category : null; };
    var glName = function (gl) { return accounts[gl] ? accounts[gl].name : "unknown account"; };

    var items = {};   // one review item per invoice, holding every issue found on it
    function issue(inv, type, data) {
      var it = items[inv.line];
      if (!it) {
        var p = props[inv.propertyId] || {};
        it = items[inv.line] = { id: "L" + inv.line, line: inv.line, invoice: inv, region: p.region || "", accountant: accountantOf[inv.propertyId] || "", issues: [] };
      }
      data.type = type;
      it.issues.push(data);
      return data;
    }

    var inv = model.invoices;

    // Master data: every invoice should point at a real property and GL account.
    inv.forEach(function (i) {
      if (!props[i.propertyId]) issue(i, "reference", { severity: "medium", title: "Unknown property", detail: 'Property ID "' + i.propertyId + '" is not in the property list.', action: "Fix the property before it posts." });
      if (!accounts[i.gl]) issue(i, "reference", { severity: "medium", title: "Unknown GL code", detail: 'GL code "' + i.gl + '" is not in the chart of accounts.', action: "Fix the GL code before it posts." });
    });

    // 1. Duplicates: same vendor and amount, and the same invoice number once "INV-" and punctuation are ignored.
    var seen = {};
    inv.forEach(function (i) {
      var k = i.vendor.toLowerCase() + "|" + round2(i.amount) + "|" + i.invoiceNo.replace(/\D/g, "");
      var first = seen[k];
      if (!first) { seen[k] = i; return; }
      var exact = first.invoiceNo === i.invoiceNo;
      var detail = exact
        ? "Same vendor, amount and invoice number (" + i.invoiceNo + ") as line " + first.line + "."
        : 'Same vendor and amount as line ' + first.line + '. The invoice number was keyed two ways: "' + first.invoiceNo + '" and "' + i.invoiceNo + '", so an exact-match check misses it.';
      if (first.codedBy !== i.codedBy) detail += " Coded by two different people (" + first.codedBy + " and " + i.codedBy + "), so neither would have seen the other.";
      if (first.propertyId !== i.propertyId) detail += " Charged to a different property (" + first.property + ").";
      issue(i, "duplicate", { severity: "high", title: "Likely duplicate of line " + first.line, detail: detail, action: "Hold payment on this copy. Keep line " + first.line + ".", decision: "hold", related: [first.line], exact: exact, atStake: i.amount });
    });

    // 2. Charges to properties that were off-boarded before the invoice date.
    inv.forEach(function (i) {
      var p = props[i.propertyId];
      if (p && p.offboarded && (!p.offboardDate || !i.invoiceDate || i.invoiceDate > p.offboardDate)) {
        issue(i, "offboarded", { severity: "high", title: "Property no longer managed", detail: p.name + " was off-boarded on " + usDate(p.offboardDate) + ". This invoice is dated " + usDate(i.invoiceDate) + ".", action: "Hold. Confirm whether the work was ordered before handover. If so, it goes to the former owner, not this close.", decision: "hold", atStake: i.amount });
      }
    });

    // 3. Coding: learn the usual GL code for each description from the register itself,
    //    then flag invoices coded somewhere else.
    var byDesc = {};
    inv.forEach(function (i) { (byDesc[i.description.toLowerCase()] = byDesc[i.description.toLowerCase()] || []).push(i); });
    var usual = {};
    Object.keys(byDesc).forEach(function (d) {
      var c = {};
      byDesc[d].forEach(function (i) { c[i.gl] = (c[i.gl] || 0) + 1; });
      var top = Object.keys(c).sort(function (a, b) { return c[b] - c[a]; })[0];
      if (byDesc[d].length >= 3 && c[top] / byDesc[d].length >= cfg.codingShare) usual[d] = { gl: top, share: c[top] / byDesc[d].length, n: byDesc[d].length };
    });
    inv.forEach(function (i) {
      var u = usual[i.description.toLowerCase()];
      if (!u || u.gl === i.gl) return;
      var from = categoryOf(i.gl), to = categoryOf(u.gl);
      var detail = '"' + i.description + '" is coded to ' + i.gl + " " + glName(i.gl) + ". " + Math.round(u.share * 100) + "% of the " + u.n + " invoices with this description use " + u.gl + " " + glName(u.gl) + ".";
      if (from !== to) {
        detail += " This moves " + money(i.amount) + " from " + (from || "unknown") + " to " + (to || "unknown") + ".";
        if (from === "CapEx" || to === "CapEx") detail += " One side is capital, so it also changes NOI on the owner report.";
      }
      issue(i, "miscoded", { severity: (from === "CapEx" || to === "CapEx") ? "high" : "medium", title: "Coded to " + glName(i.gl) + ", reads like " + glName(u.gl), detail: detail, action: "Recode to " + u.gl + " " + glName(u.gl) + ".", decision: "recode", suggestedGL: u.gl, fromCategory: from, toCategory: to, atStake: i.amount });
    });

    // GL code suggestion for every invoice, as intake would make it: the code most often used on
    // the OTHER invoices with the same description, and how often. Leaving the invoice itself out
    // keeps the confidence honest. Low confidence, or too little history, goes to a person.
    var coding = { byLine: {} };
    inv.forEach(function (i) {
      var others = byDesc[i.description.toLowerCase()].filter(function (o) { return o !== i; }), c = {};
      others.forEach(function (o) { c[o.gl] = (c[o.gl] || 0) + 1; });
      var best = Object.keys(c).sort(function (a, b) { return c[b] - c[a]; })[0] || null;
      var conf = best ? c[best] / others.length : 0;
      coding.byLine[i.line] = { gl: best, name: best ? glName(best) : "", confidence: conf, basedOn: others.length, agrees: best === i.gl, low: others.length < 3 || conf < cfg.codingConfidence };
    });
    var codingAll = Object.keys(coding.byLine).map(function (k) { return coding.byLine[k]; });
    coding.suggested = codingAll.filter(function (x) { return x.gl; }).length;
    coding.average = codingAll.length ? sum(codingAll, function (x) { return x.confidence; }) / codingAll.length : 0;
    coding.differ = codingAll.filter(function (x) { return x.gl && !x.agrees; }).length;
    coding.low = codingAll.filter(function (x) { return x.low; }).length;
    coding.threshold = cfg.codingConfidence;

    // 4. Prior period: dated before this month but sitting in this month's register.
    var cutoffDone = {};
    model.close.forEach(function (s) { if (/ap cutoff/i.test(s.step) && /complete/i.test(s.status)) cutoffDone[s.propertyId] = s; });
    inv.forEach(function (i) {
      if (!i.invoiceDate || i.invoiceDate >= model.period.start) return;
      var detail = "Dated " + usDate(i.invoiceDate) + ", received " + usDate(i.receivedDate) + ". It is " + article(model.priorMonth) + " " + model.priorMonth + " cost in " + model.period.short + "'s books.";
      var s = cutoffDone[i.propertyId];
      if (s) detail += " AP cutoff for " + i.property + " is marked Complete (BD" + s.completed + ").";
      issue(i, "prior_period", { severity: "medium", title: model.priorMonth + " invoice in " + model.period.short, detail: detail, action: "Check whether it was accrued in " + model.priorMonth + ". If it was, reverse it here. If not, keep it and say so in the commentary.", decision: "move", atStake: i.amount, cutoffMarkedDone: !!s });
    });

    // 5. Policy: over the approval limit and not approved yet.
    inv.forEach(function (i) {
      if (i.amount > cfg.approvalLimit && !/^approved/i.test(i.approval)) {
        var p = props[i.propertyId] || {};
        issue(i, "approval", { severity: "high", title: "Over " + money(cfg.approvalLimit) + ", not approved", detail: "Policy: invoices over " + money(cfg.approvalLimit) + " need Regional Manager approval before they are paid. Status is " + (i.approval || "blank") + ".", action: "Send to the " + (p.region || "") + " Regional Manager. Don't pay until approved.", decision: "request", atStake: i.amount });
      }
    });

    // 5b. Possible splits: invoices from one vendor to one property, each at or under the approval
    //     limit and dated within a few days of each other, that together go over it.
    //     Duplicate copies are left out: they are already flagged as duplicates.
    var byVendorProp = {};
    inv.forEach(function (i) {
      if (!i.invoiceDate || i.amount > cfg.approvalLimit) return;
      if (items[i.line] && items[i.line].issues.some(function (x) { return x.type === "duplicate"; })) return;
      var k = i.vendor + "|" + i.propertyId;
      (byVendorProp[k] = byVendorProp[k] || []).push(i);
    });
    Object.keys(byVendorProp).forEach(function (k) {
      var a = byVendorProp[k].sort(function (x, y) { return x.invoiceDate < y.invoiceDate ? -1 : x.invoiceDate > y.invoiceDate ? 1 : x.line - y.line; });
      for (var s0 = 0; s0 < a.length; s0++) {
        var group = a.filter(function (i, n) { return n >= s0 && daysBetween(a[s0].invoiceDate, i.invoiceDate) <= cfg.splitDays; });
        var total = round2(sum(group, function (i) { return i.amount; }));
        if (group.length < 2 || total <= cfg.approvalLimit) continue;
        group.forEach(function (i) {
          var others = group.filter(function (o) { return o !== i; });
          var p = props[i.propertyId] || {};
          issue(i, "split", { severity: "medium", title: "Possible split under the " + money(cfg.approvalLimit) + " limit",
            detail: i.vendor + " billed " + i.property + " " + group.length + " times within " + plainDays(daysBetween(group[0].invoiceDate, group[group.length - 1].invoiceDate)) + ": this invoice and " + others.map(function (o) { return "line " + o.line + " (" + money(o.amount, true) + ", dated " + usDate(o.invoiceDate) + ")"; }).join(", ") + ". Each is under the limit. Together they come to " + money(total, true) + ", which would need Regional Manager approval. It may be separate jobs, or separate meters or accounts. The data can't tell.",
            action: "Ask whether this is one job billed in parts. If it is, send it to the " + (p.region || "") + " Regional Manager with the other invoice.", decision: "request", related: others.map(function (o) { return o.line; }), groupTotal: total, atStake: i.amount });
        });
        s0 += group.length - 1;
      }
    });

    // 6. Amounts far above what the vendor usually bills.
    var byVendor = {};
    inv.forEach(function (i) { (byVendor[i.vendor] = byVendor[i.vendor] || []).push(i.amount); });
    inv.forEach(function (i) {
      var a = byVendor[i.vendor];
      if (a.length < 3) return;
      var med = median(a), x = i.amount / med;
      if (i.amount >= cfg.outlierFloor && x >= cfg.outlierMultiple) {
        issue(i, "outlier", { severity: "high", title: Math.round(x) + "x this vendor's usual invoice", detail: money(i.amount, true) + " against a usual " + money(med) + " (the middle of " + a.length + " " + i.vendor + " invoices). A keying error and a one-off project look the same here. Only the invoice document can tell.", action: "Look at the invoice before anyone approves it.", decision: "check", median: med, multiple: x, atStake: i.amount });
      }
    });

    var list = Object.keys(items).map(function (k) { return items[k]; });
    var rank = { high: 0, medium: 1, low: 2 };
    list.forEach(function (it) {
      it.severity = it.issues.reduce(function (s, x) { return rank[x.severity] < rank[s] ? x.severity : s; }, "low");
      it.types = it.issues.map(function (x) { return x.type; });
      it.atStake = it.invoice.amount;
      it.needsSecondReviewer = it.invoice.amount > cfg.approvalLimit;
    });
    list.sort(function (a, b) { return rank[a.severity] - rank[b.severity] || b.atStake - a.atStake; });

    // ------------------------------------------------------------ variance commentary
    var variances = [];
    model.budget.forEach(function (b) {
      if (!b.budget) return;
      var diff = b.actual - b.budget, p = diff / b.budget;
      if (Math.abs(p) <= cfg.varianceThreshold) return;
      var mine = inv.filter(function (i) { return i.propertyId === b.propertyId && categoryOf(i.gl) === b.category; });
      var register = round2(sum(mine, function (i) { return i.amount; }));
      var effects = [];
      mine.forEach(function (i) {
        var it = items[i.line];
        if (!it) return;
        it.issues.forEach(function (x) {
          if (x.type === "prior_period") effects.push({ line: i.line, amount: -i.amount, why: article(model.priorMonth) + " " + model.priorMonth + " invoice from " + i.vendor + " (" + i.description.toLowerCase() + ")", kind: x.type });
          if (x.type === "duplicate") effects.push({ line: i.line, amount: -i.amount, why: "a duplicate " + i.vendor + " invoice", kind: x.type });
          if (x.type === "miscoded" && x.toCategory !== b.category) effects.push({ line: i.line, amount: -i.amount, why: article(i.description) + " " + i.description.toLowerCase() + " invoice that belongs in " + x.toCategory, kind: x.type });
        });
      });
      // Invoices miscoded out of this category elsewhere at the same property belong back in it.
      inv.forEach(function (i) {
        if (i.propertyId !== b.propertyId || !items[i.line]) return;
        items[i.line].issues.forEach(function (x) {
          if (x.type === "miscoded" && x.toCategory === b.category && x.fromCategory !== b.category) effects.push({ line: i.line, amount: i.amount, why: article(i.description) + " " + i.description.toLowerCase() + " invoice coded to " + x.fromCategory, kind: x.type });
        });
      });
      var adjusted = round2(b.actual + sum(effects, function (e) { return e.amount; }));
      var adjustedPct = (adjusted - b.budget) / b.budget;
      var gap = round2(b.actual - register);
      // Two states only. A variance is explained when a specific flagged booking issue closes the gap.
      // The register rarely ties to the ledger in this data (see summary.registerTies), so a
      // register total on its own is not treated as an explanation.
      var status = (effects.length && Math.abs(adjustedPct) <= cfg.varianceThreshold) ? "explained" : "unexplained";
      var v = {
        id: "V-" + b.propertyId + "-" + b.category.replace(/\W+/g, ""), propertyId: b.propertyId, property: b.property, region: b.region, category: b.category,
        budget: b.budget, actual: b.actual, diff: diff, pct: p, accountant: accountantOf[b.propertyId] || "", invoices: mine, register: register, gap: gap,
        effects: effects, adjusted: adjusted, adjustedPct: adjustedPct, status: status, commentary: b.commentary, _row: b._row
      };
      draftCommentary(v, model);
      variances.push(v);
    });
    variances.sort(function (a, b) { return Math.abs(b.diff) - Math.abs(a.diff); });

    // ------------------------------------------------------------ close status from evidence
    var asOf = model.asOfBD, daysLeft = cfg.ownerReportDay - asOf + 1;
    // Decisions made in the review screen feed back in: a resolved invoice or an approved
    // commentary clears the evidence against that close step.
    var resolved = {};
    (cfg.resolved || []).forEach(function (l) { resolved[l] = true; });
    var accepted = cfg.commentary || {};
    variances.forEach(function (v) { v.accepted = accepted[v.id] || ""; });
    var openByProp = {};
    list.filter(function (it) { return !resolved[it.line]; }).forEach(function (it) { (openByProp[it.invoice.propertyId] = openByProp[it.invoice.propertyId] || []).push(it); });
    var varByProp = {};
    variances.forEach(function (v) { (varByProp[v.propertyId] = varByProp[v.propertyId] || []).push(v); });

    // What each property's tracker says per step, so a step can be checked against the ones before it.
    var typedByProp = {};
    model.close.forEach(function (s) { (typedByProp[s.propertyId] = typedByProp[s.propertyId] || {})[s.step] = /complete/i.test(s.status); });
    var commentaryAt = STEP_ORDER.indexOf("Variance commentary");

    var byProp = {};
    model.close.forEach(function (s) {
      var p = byProp[s.propertyId] = byProp[s.propertyId] || { id: s.propertyId, name: s.property, region: s.region, accountant: s.accountant, steps: [] };
      var e = { step: s.step, due: s.due, completed: s.completed, typed: s.status, evidence: "", note: "", _row: s._row };
      var typedDone = /complete/i.test(s.status);
      if (typedDone && s.completed && s.completed > asOf) { e.evidence = "conflict"; e.note = "Marked complete on BD" + s.completed + ", but today is BD" + asOf + "."; }
      if (typedDone && /ap cutoff/i.test(s.step)) {
        var pp = (openByProp[s.propertyId] || []).filter(function (it) { return it.types.indexOf("prior_period") >= 0; });
        if (pp.length) { e.evidence = "conflict"; e.note = (e.note ? e.note + " " : "") + pp.length + " " + model.priorMonth + " invoice" + (pp.length > 1 ? "s are" : " is") + " still in " + model.period.short + "'s register (" + money(sum(pp, function (it) { return it.atStake; })) + ")."; e.lines = pp.map(function (it) { return it.line; }); }
      }
      if (typedDone && /variance commentary/i.test(s.step)) {
        var need = (varByProp[s.propertyId] || []).filter(function (v) { return !v.commentary && !v.accepted; });
        if (need.length) { e.evidence = "conflict"; e.note = (e.note ? e.note + " " : "") + "Commentary is required for " + need.map(function (v) { return v.category + " (" + (v.diff > 0 ? "+" : "-") + pct(v.pct) + ")"; }).join(", ") + " and none is written."; e.variances = need.map(function (v) { return v.id; }); }
      }
      // Commentary explains the month's numbers, so it can't be finished while an earlier step is open.
      if (typedDone && /variance commentary/i.test(s.step)) {
        var openBefore = STEP_ORDER.slice(0, commentaryAt).filter(function (n) { return typedByProp[s.propertyId][n] === false; });
        if (openBefore.length) { e.evidence = "conflict"; e.note = (e.note ? e.note + " " : "") + "Marked complete while " + openBefore.join(", ") + " " + (openBefore.length > 1 ? "are" : "is") + " still open, so the numbers it explains aren't final."; e.dependsOpen = openBefore; }
      }
      if (!e.evidence) e.evidence = typedDone ? "done" : /late/i.test(s.status) ? "late" : /due today/i.test(s.status) ? "due" : "not_due";
      p.steps.push(e);
    });
    var closeProps = Object.keys(byProp).map(function (k) { return byProp[k]; });
    closeProps.forEach(function (p) {
      p.steps.sort(function (a, b) { return STEP_ORDER.indexOf(a.step) - STEP_ORDER.indexOf(b.step); });
      p.remaining = p.steps.filter(function (s) { return s.evidence !== "done"; }).length;
      p.late = p.steps.filter(function (s) { return s.evidence === "late"; }).length;
      p.conflicts = p.steps.filter(function (s) { return s.evidence === "conflict"; });
      p.openHigh = (openByProp[p.id] || []).filter(function (it) { return it.severity === "high"; });
    });

    // Steps each accountant finished on each business day so far (future-dated completions don't count).
    var doneOn = {};
    model.close.forEach(function (s) {
      if (!/complete/i.test(s.status) || !s.completed || s.completed > asOf) return;
      var d = doneOn[s.accountant] = doneOn[s.accountant] || {};
      d[s.completed] = (d[s.completed] || 0) + 1;
    });

    // Pace: steps each accountant has actually finished per business day so far.
    var people = {};
    closeProps.forEach(function (p) {
      var a = people[p.accountant] = people[p.accountant] || { name: p.accountant, properties: [], units: 0, done: 0, late: 0, dueToday: 0, remaining: 0 };
      a.properties.push(p);
      a.units += (props[p.id] && props[p.id].units) || 0;
      p.steps.forEach(function (s) {
        if (s.evidence === "done") a.done++;
        if (s.evidence === "late") a.late++;
        if (s.evidence === "due") a.dueToday++;
      });
      a.remaining += p.remaining;
    });
    var team = Object.keys(people).map(function (k) { return people[k]; });
    team.forEach(function (a) {
      a.pace = a.done / asOf;                       // steps actually finished per business day so far
      a.overdue = a.late + a.dueToday;
      // Pace only predicts anything for someone who is behind. Someone who is caught up
      // has been limited by the work available, not by their capacity.
      a.behind = a.overdue > a.pace;
      a.daysNeeded = a.behind ? (a.pace ? a.remaining / a.pace : Infinity) : null;
      a.overloaded = a.behind && a.daysNeeded > daysLeft;
      a.capacity = a.pace * daysLeft;
      // Room to take on more. Average pace understates someone who is caught up: they ran out of
      // due work, not capacity. Their best day this close is a rate they have actually shown.
      // Room = what is left of today at that rate, plus the full business days after today.
      var days = doneOn[a.name] || {};
      a.bestDay = Object.keys(days).reduce(function (m, d) { return Math.max(m, days[d]); }, 0);
      a.doneToday = days[asOf] || 0;
      a.room = Math.max(0, a.bestDay - a.doneToday) + a.bestDay * Math.max(0, cfg.ownerReportDay - asOf);
      a.headroom = a.room - a.remaining;
      a.finishBy = Math.min(a.remaining, Math.floor(a.capacity));   // steps done by the deadline at this pace
      // Regions where this person holds every property. If they are behind, the whole region is,
      // which may point to a regional cause and not a workload one.
      var mineByRegion = {};
      a.properties.forEach(function (p) { mineByRegion[p.region] = (mineByRegion[p.region] || 0) + 1; });
      a.wholeRegions = Object.keys(mineByRegion).filter(function (r) {
        return mineByRegion[r] >= 2 && mineByRegion[r] === closeProps.filter(function (p) { return p.region === r; }).length;
      }).map(function (r) { return { region: r, count: mineByRegion[r] }; });
    });
    var avgUnits = team.length ? sum(team, function (a) { return a.units; }) / team.length : 0;
    var avgProps = team.length ? closeProps.length / team.length : 0;
    team.sort(function (a, b) { return (b.daysNeeded || 0) - (a.daysNeeded || 0) || b.overdue - a.overdue; });

    // Suggested rebalance. A helper has to be caught up, carry no more than the team's average
    // load, and have room for the property's remaining steps at their best day's rate (stated on
    // screen). Someone already carrying an above-average load is not asked. The manager decides;
    // nothing is reassigned here.
    var moves = [], stuck = [], skipped = [], noRoom = [];
    var heavy = function (a) { return avgUnits ? a.units > avgUnits : a.properties.length > avgProps; };
    team.filter(function (a) { return !a.behind && heavy(a); }).forEach(function (a) { skipped.push({ name: a.name, properties: a.properties.length, units: a.units }); });
    var helpers = team.filter(function (a) { return !a.behind && !heavy(a); }).sort(function (x, y) { return x.remaining - y.remaining; });
    team.filter(function (a) { return a.overloaded; }).forEach(function (a) {
      var queue = a.properties.filter(function (p) { return p.remaining; })
        .sort(function (x, y) { return y.late - x.late || y.remaining - x.remaining; });
      helpers.forEach(function (h) {
        if (h.taken || !queue.length) return;
        var at = queue.findIndex(function (q) { return q.remaining <= h.headroom; });
        if (at < 0) { noRoom.push({ name: h.name, headroom: h.headroom }); return; }
        var p = queue.splice(at, 1)[0];
        h.taken = true;
        p.moveTo = h.name;
        moves.push({ property: p, from: a.name, to: h.name, steps: p.remaining, late: p.late, toProperties: h.properties.length, toRemaining: h.remaining, toRoom: h.room, toBestDay: h.bestDay });
      });
      // What the overloaded accountant can still finish at their own pace.
      var canDo = Math.floor(a.capacity);
      queue.slice().sort(function (x, y) { return x.remaining - y.remaining; }).forEach(function (p) {
        if (p.remaining <= canDo) { canDo -= p.remaining; p.keepAfterMoves = true; }
        else stuck.push(p);
      });
      a.keeps = queue.length;
    });

    // What it would take to get every report out: the steps on the properties that are still late
    // after the suggested moves, and whether the room left on the team covers them. This stretch
    // includes people the first pass didn't ask because their load is already above average.
    var spare = {};
    team.filter(function (a) { return !a.behind; }).forEach(function (a) { spare[a.name] = a.headroom; });
    moves.forEach(function (m) { spare[m.to] -= m.steps; });
    var stretch = [], uncovered = [];
    stuck.slice().sort(function (x, y) { return y.remaining - x.remaining; }).forEach(function (p) {
      var who = Object.keys(spare).sort(function (x, y) { return spare[y] - spare[x]; })[0];
      if (who && spare[who] >= p.remaining) { spare[who] -= p.remaining; stretch.push({ property: p, to: who, steps: p.remaining }); }
      else uncovered.push(p);
    });
    var bestDays = team.filter(function (a) { return !a.behind && a.bestDay; }).map(function (a) { return a.bestDay; });
    var typicalDay = bestDays.length ? median(bestDays) : 0, stuckSteps = sum(stuck, function (p) { return p.remaining; });
    var take = { properties: stuck.length, steps: stuckSteps, typicalBestDay: typicalDay, accountantDays: typicalDay ? stuckSteps / typicalDay : null, stretch: stretch, uncovered: uncovered };

    closeProps.forEach(function (p) {
      var a = people[p.accountant];
      p.reasons = [];
      if (a.overloaded && p.remaining) {
        var why = "At the current pace " + p.accountant + " finishes about " + a.finishBy + " of " + a.remaining + " remaining steps by BD" + cfg.ownerReportDay + ".";
        if (p.moveTo) why += " Makes BD" + cfg.ownerReportDay + " only if moved to " + p.moveTo + ".";
        else if (p.keepAfterMoves) why += " Makes BD" + cfg.ownerReportDay + " if the other suggested moves happen.";
        else why += " Late even with the suggested moves: tell the owner today.";
        p.reasons.push(why);
      }
      if (p.late) p.reasons.push(p.late + " step" + (p.late > 1 ? "s" : "") + " late.");
      p.conflicts.forEach(function (s) { p.reasons.push(s.step + ": " + s.note); });
      if (p.openHigh.length) p.reasons.push(p.openHigh.length + " high-priority invoice" + (p.openHigh.length > 1 ? "s" : "") + " open (" + money(sum(p.openHigh, function (it) { return it.atStake; })) + ").");
      if (a.overloaded && p.remaining) p.forecast = "will_slip";
      else if (p.reasons.length) p.forecast = "at_risk";
      else p.forecast = p.remaining ? "on_track" : "ready";
    });
    var fr = { will_slip: 0, at_risk: 1, on_track: 2, ready: 3 };
    closeProps.sort(function (a, b) { return fr[a.forecast] - fr[b.forecast] || b.reasons.length - a.reasons.length || a.id.localeCompare(b.id); });

    var allSteps = [].concat.apply([], closeProps.map(function (p) { return p.steps.map(function (s) { s.property = p; return s; }); }));
    var contradictions = allSteps.filter(function (s) { return s.evidence === "conflict"; });

    // Where the close is stuck: late steps by step, and whether they sit with one person or many.
    var behindNames = team.filter(function (a) { return a.overloaded; }).map(function (a) { return a.name; });
    var lateByStep = STEP_ORDER.map(function (n) {
      var l = allSteps.filter(function (s) { return s.step === n && s.evidence === "late"; });
      var uniq = function (f) { var o = {}; l.forEach(function (s) { o[f(s)] = 1; }); return Object.keys(o); };
      var outside = l.filter(function (s) { return behindNames.indexOf(s.property.accountant) < 0; });
      var o2 = {}; outside.forEach(function (s) { o2[s.property.accountant] = 1; });
      return { step: n, count: l.length, accountants: uniq(function (s) { return s.property.accountant; }), properties: l.map(function (s) { return s.property.name; }), outside: outside.length, outsideAccountants: Object.keys(o2) };
    }).filter(function (x) { return x.count; }).sort(function (a, b) { return b.count - a.count; });
    var lateOutside = sum(lateByStep, function (x) { return x.outside; });
    // Steps marked complete while an earlier step at the same property is not.
    var outOfSequence = 0;
    closeProps.forEach(function (p) {
      var open = false;
      p.steps.forEach(function (s) { var done = /complete/i.test(s.typed); if (!done) open = true; else if (open) outOfSequence++; });
    });
    var late = { total: sum(lateByStep, function (x) { return x.count; }), byStep: lateByStep, top: lateByStep[0] || null, outside: lateOutside, behind: behindNames, outOfSequence: outOfSequence };

    // ------------------------------------------------------------ summary
    var byType = {};
    list.forEach(function (it) { it.issues.forEach(function (x) { var t = byType[x.type] = byType[x.type] || { count: 0, amount: 0, lines: [] }; t.count++; t.amount += it.atStake; t.lines.push(it.line); }); });
    // How often the register ties to the ledger: budget lines in categories the register covers
    // where the register total is within 10% of the posted actual.
    var regCats = {}, regBy = {};
    inv.forEach(function (i) { var c = categoryOf(i.gl); regCats[c] = true; var k = i.propertyId + "|" + c; regBy[k] = (regBy[k] || 0) + i.amount; });
    var tieLines = model.budget.filter(function (b) { return regCats[b.category] && b.actual; });
    var ties = tieLines.filter(function (b) { return Math.abs((regBy[b.propertyId + "|" + b.category] || 0) - b.actual) <= 0.1 * Math.abs(b.actual); }).length;
    // The calendar: BD dates from the README's as-of date.
    var bdDate = function (n) { return model.asOfDate ? addBD(model.asOfDate, n - asOf) : null; };
    var cutoffStep = model.close.find(function (s) { return /ap cutoff/i.test(s.step) && s.due; });
    var cutoffBD = cutoffStep ? cutoffStep.due : null, cutoffDate = cutoffBD ? bdDate(cutoffBD) : null;
    var received = inv.map(function (i) { return i.receivedDate; }).filter(Boolean).sort();
    var calendar = { asOfDate: model.asOfDate, dueDate: bdDate(cfg.ownerReportDay), cutoffBD: cutoffBD, cutoffDate: cutoffDate, bdDate: bdDate,
      lastReceived: received[received.length - 1] || null,
      receivedAfterAsOf: model.asOfDate ? received.filter(function (d) { return d > model.asOfDate; }).length : 0,
      receivedAfterCutoff: cutoffDate ? received.filter(function (d) { return d > cutoffDate; }).length : 0 };
    var holdLines = list.filter(function (it) { return it.types.indexOf("duplicate") >= 0 || it.types.indexOf("offboarded") >= 0; });
    var summary = {
      period: model.period, asOfBD: asOf, daysLeft: daysLeft, ownerReportDay: cfg.ownerReportDay,
      invoices: inv.length, invoiceTotal: sum(inv, function (i) { return i.amount; }), properties: closeProps.length,
      items: list.length, high: list.filter(function (it) { return it.severity === "high"; }).length,
      byType: byType, hold: { count: holdLines.length, amount: sum(holdLines, function (it) { return it.atStake; }) },
      reportsAtRisk: closeProps.filter(function (p) { return p.forecast === "will_slip" || p.forecast === "at_risk"; }).length,
      willSlip: closeProps.filter(function (p) { return p.forecast === "will_slip"; }).length,
      typedComplete: allSteps.filter(function (s) { return /complete/i.test(s.typed); }).length,
      evidenceComplete: allSteps.filter(function (s) { return s.evidence === "done"; }).length,
      contradictions: contradictions.length, late: late,
      register: { total: sum(inv, function (i) { return i.amount; }) },
      registerTies: { within: ties, of: tieLines.length }, calendar: calendar,
      approvedOverLimit: inv.filter(function (i) { return i.amount > cfg.approvalLimit && /^approved/i.test(i.approval); }).length
    };

    return { cfg: cfg, model: model, items: list, variances: variances, close: { properties: closeProps, team: team, moves: moves, stuck: stuck, skipped: skipped, noRoom: noRoom, take: take, contradictions: contradictions, daysLeft: daysLeft }, summary: summary, usualCoding: usual, coding: coding };
  }

  // ---------------------------------------------------------------- commentary

  /*
   * Draft the owner commentary from the facts only. When the data can't explain a
   * variance, the draft says so and a question for the accountant is drafted instead
   * of a made-up reason.
   */
  function draftCommentary(v, model) {
    var dir = v.diff > 0 ? "over" : "under";
    var open = v.category + " came in at " + money(v.actual) + " against a " + money(v.budget) + " budget (" + money(Math.abs(v.diff)) + ", " + pct(v.pct) + " " + dir + ").";
    var draft, question = "";
    if (v.status === "explained" && v.effects.length) {
      var net = v.adjusted - v.budget;
      draft = open + " " + v.effects.map(function (e) { return money(Math.abs(e.amount)) + " of this is " + e.why; }).join("; ") + ". Excluding " + (v.effects.length > 1 ? "these" : "it") + ", " + v.category + " is " + money(Math.abs(net)) + " " + (net > 0 ? "over" : "under") + " budget.";
      // The draft states what the data shows and stops. Whether the books change depends on a
      // decision a person still has to make on the flagged invoice (for example, was it accrued
      // in the prior month?), so the commentary can't be approved until that decision is recorded.
      var timing = v.effects.every(function (e) { return e.kind === "prior_period"; });
      v.headline = timing
        ? "Timing: " + article(model.priorMonth) + " " + model.priorMonth + " invoice accounts for it. Confirm the " + model.priorMonth + " accrual before this goes to the owner."
        : "A flagged booking item accounts for it. Decide that invoice before this goes to the owner.";
    } else {
      // Not explained: the draft states the figures and stops. A person supplies the cause
      // before it can be approved, and the tool drafts the question to ask.
      draft = open;
      var lead = v.property + " " + v.category + " is " + money(v.actual) + " against a " + money(v.budget) + " budget (" + pct(v.pct) + " " + dir + ").";
      if (/payroll/i.test(v.category) && !v.invoices.length) {
        var temp = model.invoices.filter(function (i) { return accountsCategory(model, i.gl) === v.category; });
        var kinds = {}; temp.forEach(function (i) { kinds[i.description.toLowerCase()] = 1; });
        v.categoryInvoicesAllProperties = temp.length;
        question = lead + " Site payroll comes from the payroll system, not AP. " + (temp.length ? "The only payroll-coded invoices in the register are " + temp.length + " for " + Object.keys(kinds).join(", ") + ", and none are for this property, so" : "So") + " the invoice register can't explain it. Can you share what drove it (overtime, new hires, a bonus or a timing difference)?";
        v.headline = "Can't explain from the invoice register.";
      } else if (!v.invoices.length && v.diff < 0) {
        question = lead + " There are no " + v.category.toLowerCase() + " invoices in " + model.period.short + "'s register. Has a bill not arrived yet? If so, it needs accruing before we call this a saving.";
        v.headline = "Can't explain from the data. Possibly a missing bill.";
      } else if (!v.invoices.length) {
        question = lead + " There are no " + v.category.toLowerCase() + " invoices in " + model.period.short + "'s register. What was posted, and from where?";
        v.headline = "Can't explain from the invoice register.";
      } else {
        question = lead + " The invoice register doesn't explain it: it holds " + money(v.register) + " of invoices for this line against " + money(v.actual) + " posted, and no flagged booking issue closes the gap. What drove the variance?";
        v.headline = "The invoice register doesn't explain it.";
      }
    }
    v.draft = draft;
    v.question = question;
    v.facts = commentaryFacts(v, model);
  }

  function accountsCategory(model, gl) {
    var a = model.accounts.find(function (x) { return x.code === gl; });
    return a ? a.category : null;
  }

  // The only facts a commentary may use. The AI draft is checked against these.
  function commentaryFacts(v, model) {
    return {
      property: v.property, category: v.category, month: model.period.label,
      budget: v.budget, actual: v.actual, difference: round2(Math.abs(v.diff)), percent_off_budget: Math.round(Math.abs(v.pct) * 100), direction: v.diff > 0 ? "over" : "under",
      invoices_in_register: v.invoices.map(function (i) { return { vendor: i.vendor, description: i.description, amount: i.amount, invoice_date: usDate(i.invoiceDate) }; }),
      register_total: v.register, not_in_register: v.gap, category_invoices_all_properties: v.categoryInvoicesAllProperties || 0,
      booking_issues: v.effects.map(function (e) { return { amount: Math.abs(e.amount), what: e.why }; }),
      adjusted_actual: v.adjusted, adjusted_difference: round2(Math.abs(v.adjusted - v.budget)), adjusted_direction: v.adjusted > v.budget ? "over" : "under",
      explanation_status: v.status
    };
  }

  /*
   * Number check: every number in a draft must come from the facts.
   * Dollar figures may be rounded to the dollar; percentages to the whole percent.
   * Nothing else is rounded, so "2 leaks" doesn't pass because a 1 or a 3 is in the data.
   * It checks figures only. Wording is covered separately by causeCheck below.
   */
  function groundingCheck(text, facts) {
    var allowed = [];
    (function walk(o) {
      if (o == null) return;
      if (typeof o === "number") { allowed.push(Math.abs(o)); return; }
      if (typeof o === "string") { (o.match(/\d[\d,]*\.?\d*/g) || []).forEach(function (n) { allowed.push(Number(n.replace(/,/g, ""))); }); return; }
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (typeof o === "object") Object.keys(o).forEach(function (k) { walk(o[k]); });
    })(facts);
    var found = text.match(/\$?\d[\d,]*(\.\d+)?%?/g) || [];
    var unknown = found.filter(function (tok) {
      var n = Number(tok.replace(/[$,%]/g, ""));
      if (isNaN(n)) return false;
      var isPct = tok.indexOf("%") >= 0;
      return !allowed.some(function (a) { return Math.abs(a - n) < 0.005 || Math.abs(Math.round(a) - n) < 0.005 || (isPct && Math.abs(a - n) <= 0.5); });
    });
    return { ok: unknown.length === 0, checked: found.length, unknown: unknown };
  }

  // ---------------------------------------------------------------- scoring

  /*
   * Cause check: when the data can't explain a variance, the draft may state figures but not a
   * reason. This looks for wording that asserts one ("because", "due to", "driven by"...).
   * It is a word list, so it catches the usual phrasing, not every way of implying a cause.
   * The person's own explanation goes in a separate box and is recorded as theirs.
   */
  var CAUSE_WORDS = /\b(because|due to|driven by|caused by|as a result of|owing to|thanks to|attributable to|attributed to|resulting from|results? from|stems? from|stemming from|on account of|explained by)\b/gi;
  function causeCheck(text) {
    var found = {};
    (String(text || "").match(CAUSE_WORDS) || []).forEach(function (w) { found[w.toLowerCase()] = 1; });
    return { ok: !Object.keys(found).length, phrases: Object.keys(found) };
  }

  // Score the checks against the answer key: caught, missed and false alarms. The key was written
  // from the same rules, so this is a regression test, not a measure of accuracy.
  function score(result, key) {
    var rows = [];
    var labels = { duplicate: "Duplicate payments", offboarded: "Off-boarded properties", miscoded: "GL miscoding", prior_period: "Prior-period invoices", approval: "Over limit, not approved", outlier: "Unusual amounts", variance: "Variances needing commentary" };
    Object.keys(labels).forEach(function (t) {
      var expected = (key[t] || []).map(String);
      var got = t === "variance"
        ? result.variances.map(function (v) { return v.propertyId + "|" + v.category; })
        : (result.summary.byType[t] ? result.summary.byType[t].lines.map(String) : []);
      var caught = expected.filter(function (x) { return got.indexOf(x) >= 0; });
      rows.push({ type: t, label: labels[t], expected: expected.length, caught: caught.length, missed: expected.filter(function (x) { return got.indexOf(x) < 0; }), falseAlarms: got.filter(function (x) { return expected.indexOf(x) < 0; }) });
    });
    var exp = sum(rows, function (r) { return r.expected; }), c = sum(rows, function (r) { return r.caught; }), fa = sum(rows, function (r) { return r.falseAlarms.length; });
    return { rows: rows, expected: exp, caught: c, missed: exp - c, falseAlarms: fa };
  }

  var api = { DEFAULTS: DEFAULTS, readWorkbook: readWorkbook, analyze: analyze, groundingCheck: groundingCheck, causeCheck: causeCheck, score: score, money: money, pct: pct, usDate: usDate, longDate: longDate, addBD: addBD, sum: sum };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.CloseEngine = api;
})(this);

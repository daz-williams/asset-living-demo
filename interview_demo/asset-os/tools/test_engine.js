/*
 * Regression test: runs the same checks the browser runs and compares them with the expected
 * results in js/answer-key.js, which were written from the same rules.
 * Setup once:  npm install --prefix tools xlsx@0.18.5
 * Run:         node tools/test_engine.js
 */
const fs = require("fs");
const path = require("path");
const XLSX = require(path.join(__dirname, "node_modules", "xlsx"));
const E = require("../js/engine.js");

const root = path.join(__dirname, "..");
global.window = {};
eval(fs.readFileSync(path.join(root, "js", "answer-key.js"), "utf8"));
const pack = path.join(root, "data", "Asset_Living_Build_Exercise_-_Data_Pack.xlsx");
const result = E.analyze(E.readWorkbook(XLSX, XLSX.read(fs.readFileSync(pack), { type: "buffer" })));
const score = E.score(result, window.ANSWER_KEY);

let failed = false;
for (const r of score.rows) {
  const ok = !r.missed.length && !r.falseAlarms.length;
  if (!ok) failed = true;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.label}: ${r.caught}/${r.expected}` + (r.missed.length ? `  missed ${r.missed}` : "") + (r.falseAlarms.length ? `  extra ${r.falseAlarms}` : ""));
}
for (const v of result.variances) {
  const g = E.groundingCheck(v.draft + " " + v.question, v.facts);
  if (!g.ok) failed = true;
  console.log(`${g.ok ? "PASS" : "FAIL"}  Commentary numbers grounded: ${v.property} ${v.category}` + (g.ok ? "" : `  ${g.unknown}`));
}
const bad = E.groundingCheck("Utilities were $99,999 over budget.", result.variances[0].facts);
console.log(`${bad.ok ? "FAIL" : "PASS"}  Grounding check rejects an invented number`);
if (bad.ok) failed = true;
console.log(`\n${score.caught} of ${score.expected} caught, ${score.missed} missed, ${score.falseAlarms} false alarms.`);
process.exit(failed ? 1 : 0);

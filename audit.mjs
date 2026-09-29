import fs from "node:fs";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const fail = [];
const pass = [];

function check(name, condition, detail = "") {
  if (condition) pass.push({name,detail});
  else fail.push({name,detail});
}

const jsFiles = [
  "app.js",
  "question-bank.js",
  "question-templates.js",
  "question-templates-multiple.js",
  "question-variants.js",
  "mock-generator.js",
  "exam-engine.js",
  "mock-exam-ui.js",
  "official-theory.js",
  "official-theory-ui.js"
];

for (const file of jsFiles) {
  try {
    execFileSync(process.execPath, ["--check", file], {stdio:"pipe"});
    pass.push({name:"Syntax: " + file});
  } catch (error) {
    fail.push({name:"Syntax: " + file, detail:error.stderr?.toString() || error.message});
  }
}

const index = fs.readFileSync("index.html","utf8");
const engine = fs.readFileSync("exam-engine.js","utf8");

for (const script of [
  "question-bank.js",
  "question-templates.js",
  "question-templates-multiple.js",
  "question-variants.js",
  "mock-generator.js",
  "exam-engine.js",
  "mock-exam-ui.js",
  "official-theory.js",
  "official-theory-ui.js"
]) {
  check("Loaded in index: " + script, index.includes(script));
}

check("Old generic Study/Exam layer is not loaded", !index.includes("study-exam.js"));
check("Certification styles are loaded", index.includes("exam-engine.css"));
check("SCENARIO label rendered", engine.includes("SCENARIO:"));
check("QUESTION label rendered", engine.includes("QUESTION:"));
check("Study Mode exists", engine.includes('mode === "study"'));
check("Exam Mode exists", engine.includes('mode === "exam"'));
check("Distractor-specific feedback", engine.includes("wrongReasonEN") && engine.includes("distractor-reason"));
check("Correct answer shown", engine.includes("Correct answer:") && engine.includes("Respuesta correcta:"));
check("Decision rule shown in Study Mode", engine.includes("Decision rule:") && engine.includes("Regla de decisión:"));
check("Internal concept review link", engine.includes('href="#concept-review"'));
check("Official documentation link", engine.includes("q.doc.url"));
check("Two profiles", engine.includes('localStorage.getItem("ccarf-profile")') && engine.includes('data-profile="partner"'));
check("Per-profile lesson completion", engine.includes('key("completed")'));
check("Per-profile question history", engine.includes('key("question-stats")'));
check("Per-profile mode", engine.includes('"ccarf-mode-" + profile'));
check("Random unseen lesson rotation", engine.includes("const unseen = list.filter"));
check("Generic quick-check removed at runtime", engine.includes('document.querySelector(".exam-box")?.closest(".section")'));

const mockUi = fs.readFileSync("mock-exam-ui.js","utf8");
check("Mock 60 launcher exists", mockUi.includes("Mock 60"));
check("Mock uses 120-minute timer", mockUi.includes("120*60*1000"));
check("Mock defers review until finish", mockUi.includes("finishExam") && mockUi.includes("Mock Review"));
check("Mock supports flag for review", mockUi.includes("flagged") && mockUi.includes("mockFlagBtn"));
check("Mock can generate a new random version", mockUi.includes("mockNewVersion") && mockUi.includes("startNewExam"));


const theoryUi = fs.readFileSync("official-theory-ui.js","utf8");
check("Official theory stylesheet loaded", index.includes("official-theory.css"));
check("Official theory data loaded", index.includes("official-theory.js"));
check("Official theory renderer loaded", index.includes("official-theory-ui.js"));
check("Theory rendered before exam engine", index.indexOf("official-theory-ui.js") < index.indexOf("exam-engine.js"));
check("Theory source boundary label exists", theoryUi.includes("100%") && theoryUi.includes("official Anthropic"));
check("Theory links back to official documentation", theoryUi.includes("official-source-pill"));

const storage = new Map();
const localStorage = {
  getItem:k => storage.has(k) ? storage.get(k) : null,
  setItem:(k,v) => storage.set(k,String(v)),
  removeItem:k => storage.delete(k)
};
const sandbox = {window:{},localStorage,console,Date,Math};
vm.createContext(sandbox);

for (const file of [
  "question-bank.js",
  "question-templates.js",
  "question-templates-multiple.js",
  "question-variants.js",
  "mock-generator.js"
]) {
  vm.runInContext(fs.readFileSync(file,"utf8"),sandbox,{filename:file});
}


vm.runInContext(fs.readFileSync("official-theory.js","utf8"),sandbox,{filename:"official-theory.js"});
const theory = sandbox.window.CCARF_OFFICIAL_THEORY || {};
const theoryLessonIds = [
  "foundations",
  "d1-loop",
  "d1-orchestration",
  "d1-enforcement",
  "d2-tools",
  "d2-mcp",
  "d3-code",
  "d3-workflow",
  "d4-prompt",
  "d4-structured",
  "d5-context"
];
check("Official theory covers all technical lessons", theoryLessonIds.every(id => theory[id]));
for (const id of theoryLessonIds) {
  const entry = theory[id];
  check("Theory has >=3 sections: " + id, Array.isArray(entry?.sections) && entry.sections.length >= 3, "sections=" + (entry?.sections?.length || 0));
  check("Theory is bilingual: " + id, Boolean(entry?.leadES && entry?.leadEN && entry.sections.every(s => s.titleES && s.titleEN && s.bodyES?.length && s.bodyEN?.length)));
}
const theorySources = Object.values(theory).flatMap(entry => entry.sections || []).flatMap(section => section.sources || []);
const allowedHosts = ["www.anthropic.com","anthropic.com","platform.claude.com","code.claude.com"];
const invalidTheorySources = theorySources.filter(source => {
  try { return !allowedHosts.includes(new URL(source[1]).hostname); } catch { return true; }
});
check("All theory sources are official Anthropic domains", invalidTheorySources.length === 0, "invalid=" + invalidTheorySources.map(x => x[1]).join(","));
check("Theory contains substantial source-backed depth", theorySources.length >= 20, "source links=" + theorySources.length);

const bank = sandbox.window.CCARF_QUESTION_BANK || [];
const meta = sandbox.window.CCARF_BANK_META || {};
const scenarios = sandbox.window.CCARF_SCENARIOS || {};

check("Expanded bank has at least 200 questions", bank.length >= 200, "count=" + bank.length);
check("At least 30 template families", (meta.templateFamilies || 0) >= 30, "families=" + meta.templateFamilies);
check("Six scenario definitions", Object.keys(scenarios).length === 6);

const scenarioIds = [
  "customer-support",
  "code-generation",
  "multi-agent-research",
  "developer-productivity",
  "claude-code-ci",
  "structured-extraction"
];

for (const scenarioId of scenarioIds) {
  const count = bank.filter(q => q.scenarioId === scenarioId).length;
  check("Scenario bank >= 30: " + scenarioId, count >= 30, "count=" + count);
}

const malformed = bank.filter(q =>
  !q.id || !q.scenarioId || !q.domain || !q.questionEN || !q.questionES ||
  !Array.isArray(q.options) || q.options.length !== 4 ||
  q.options.some(o => !o.en || !o.es) ||
  !Array.isArray(q.correct) || !q.correct.length ||
  !Array.isArray(q.wrongReasonEN) || q.wrongReasonEN.length !== 4 ||
  !Array.isArray(q.wrongReasonES) || q.wrongReasonES.length !== 4 ||
  !q.rationaleEN || !q.rationaleES || !q.ruleEN || !q.ruleES ||
  !q.doc || !q.doc.url
);
check("Every question satisfies the bilingual 4-option schema", malformed.length === 0, "malformed=" + malformed.slice(0,5).map(q=>q.id).join(","));

check("Single-response questions exist", bank.some(q => q.type === "single"));
check("Multiple-response questions exist", bank.filter(q => q.type === "multiple").length >= 20, "multiple=" + bank.filter(q=>q.type==="multiple").length);

const generator = sandbox.window.CCARF_EXAM_GENERATOR;
check("Mock generator exposed", Boolean(generator && generator.generate));

if (generator && generator.generate) {
  const exam1 = generator.generate({profile:"audit",count:60,seed:"audit-version-1",scenarioCount:4,remember:false});
  const exam2 = generator.generate({profile:"audit",count:60,seed:"audit-version-2",scenarioCount:4,remember:false});

  check("Generated exam has 60 questions", exam1.questions.length === 60);
  check("Generated exam uses 4 scenarios", exam1.scenarioIds.length === 4);
  check("Generated exam has unique question IDs", new Set(exam1.questions.map(q=>q.id)).size === 60);
  check("Generated exam includes multiple-response questions", exam1.questions.filter(q=>q.type==="multiple").length >= 6);
  check("Generated exam covers all five domains", ["D1","D2","D3","D4","D5"].every(d => exam1.questions.some(q=>q.domain===d)));
  check("Different seeds create different versions", exam1.questions.map(q=>q.id).join("|") !== exam2.questions.map(q=>q.id).join("|"));
  check("Option shuffling preserves four choices", exam1.questions.every(q=>q.options.length===4 && q.correct.every(i=>i>=0 && i<4)));
}

console.log("\nCCAR-F Auditor\n==============");
for (const item of pass) console.log("PASS  " + item.name + (item.detail ? " — " + item.detail : ""));
for (const item of fail) console.log("FAIL  " + item.name + (item.detail ? " — " + item.detail : ""));

console.log("\nSummary: " + pass.length + " PASS / " + fail.length + " FAIL");
if (fail.length) process.exit(1);

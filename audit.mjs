import fs from "node:fs";
import { execFileSync } from "node:child_process";

const fail = [];
const pass = [];

function check(name, condition, detail = "") {
  if (condition) pass.push({ name, detail });
  else fail.push({ name, detail });
}

for (const file of ["app.js", "question-bank.js", "exam-engine.js"]) {
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
    pass.push({ name: "Syntax: " + file });
  } catch (error) {
    fail.push({ name: "Syntax: " + file, detail: error.stderr?.toString() || error.message });
  }
}

const index = fs.readFileSync("index.html", "utf8");
const bankSrc = fs.readFileSync("question-bank.js", "utf8");
const engine = fs.readFileSync("exam-engine.js", "utf8");

check("Question bank is loaded", index.includes("question-bank.js"));
check("Exam engine is loaded", index.includes("exam-engine.js"));
check("Old generic Study/Exam layer is not loaded", !index.includes("study-exam.js"));
check("Certification styles are loaded", index.includes("exam-engine.css"));

const scenarioIds = [
  "customer-support",
  "code-generation",
  "multi-agent-research",
  "developer-productivity",
  "claude-code-ci",
  "structured-extraction"
];
for (const scenario of scenarioIds) {
  check("Scenario present: " + scenario, bankSrc.includes('scenarioId:"' + scenario + '"'));
}

check("Single-response support", bankSrc.includes('type:"single"') && engine.includes('type === "multiple" ? "checkbox" : "radio"'));
check("Multiple-response support", bankSrc.includes('type:"multiple"') && engine.includes("selectCount"));
check("Four-option format represented", (bankSrc.match(/options:\[/g) || []).length >= 6);
check("SCENARIO label rendered", engine.includes("SCENARIO:"));
check("QUESTION label rendered", engine.includes("QUESTION:"));
check("Study Mode exists", engine.includes('mode === "study"'));
check("Exam Mode exists", engine.includes('mode === "exam"'));
check("Distractor-specific feedback", engine.includes("wrongReasonEN") && engine.includes("distractor-reason"));
check("Correct answer shown", engine.includes("Correct answer:") && engine.includes("Respuesta correcta:"));
check("Decision rule shown in Study Mode", engine.includes("Decision rule:") && engine.includes("Regla de decisión:"));
check("Internal concept review link", engine.includes('href="#concept-review"'));
check("Official documentation link", engine.includes("q.doc.url"));
check("Two profiles", engine.includes('profile = localStorage.getItem("ccarf-profile")') && engine.includes('data-profile="partner"'));
check("Per-profile lesson completion", engine.includes('key("completed")'));
check("Per-profile question history", engine.includes('key("question-stats")'));
check("Per-profile mode", engine.includes('"ccarf-mode-" + profile'));
check("Generic quick-check removed at runtime", engine.includes('document.querySelector(".exam-box")?.closest(".section")'));

console.log("\nCCAR-F Auditor\n==============");
for (const item of pass) console.log("PASS  " + item.name);
for (const item of fail) console.log("FAIL  " + item.name + (item.detail ? " — " + item.detail : ""));

console.log("\nSummary: " + pass.length + " PASS / " + fail.length + " FAIL");
if (fail.length) process.exit(1);

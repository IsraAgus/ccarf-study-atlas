# Question engine architecture

This branch adds a certification-style question engine based on the supplied practice screenshots.

## Format
- Persistent `SCENARIO:` block.
- Explicit `QUESTION:` stem.
- Four plausible options.
- Single-response and multiple-response questions.
- Study Mode with distractor-specific diagnosis and concept/docs review links.
- Exam Mode with intentionally shorter feedback.
- Per-profile question history for **Tú** / **Pareja**.

## Expanded bank
The bank combines:
- hand-authored base questions;
- reusable conceptual question families;
- scenario variants across all six study scenarios;
- dedicated multiple-response families.

The generated pool contains **200+ questions**. Every generated question retains:
- bilingual EN/ES wording;
- four options;
- answer key;
- distractor-specific feedback;
- rationale;
- decision rule;
- official Anthropic documentation link.

## Random exam versions
`mock-generator.js` exposes `window.CCARF_EXAM_GENERATOR.generate()`.

A generated mock:
- defaults to 60 questions;
- selects 4 scenario contexts;
- uses a seeded PRNG so a version can be reproduced;
- approximates the domain blueprint distribution;
- avoids duplicate question IDs;
- caps repetition from the same conceptual family;
- prefers questions the active learner has not seen in prior generated exams;
- shuffles option order while remapping the answer key;
- targets a mix of single-response and multiple-response questions.

Example in the browser console:

```js
const exam = CCARF_EXAM_GENERATOR.generate({
  profile: "you",
  seed: "practice-01"
});

console.log(exam.versionId);
console.log(exam.distribution);
console.log(exam.questions.length); // 60
```

Use a different seed for another reproducible version. Omit `seed` to generate a new random version.

## Source policy
- Supplied screenshots define **assessment format and style**.
- Passed-candidate notes define **exam traps and decision heuristics**.
- Official Anthropic documentation defines **current technical behavior**.

## Validation
`audit.mjs` executes the bank and generator in CI. It validates:
- JavaScript syntax;
- required scripts loaded;
- 200+ total questions;
- at least 30 questions in each scenario;
- bilingual four-option question schema;
- both single and multiple response formats;
- a real 60-question mock with unique IDs;
- four selected scenarios;
- all five domains represented;
- multiple-response coverage;
- different seeds creating different versions.

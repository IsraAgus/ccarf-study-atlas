# CCAR-F Study Atlas Auditor

This repository treats assessment behavior as a release contract.

## Blocking criteria

A practice release must provide:
- Certification-style `SCENARIO:` + `QUESTION:` structure.
- Four plausible options.
- Single-response and multiple-response questions.
- Coverage across all six official scenario families used by the study plan.
- Study Mode with distractor-specific reasoning, correct answer, decision rule, lesson review link, and official Anthropic documentation link.
- Exam Mode with intentionally reduced feedback: why the selected answer was wrong and which answer was correct.
- Separate learner state for **Tú** and **Pareja**.
- No generic quick-check component as the primary assessment UI.

## Source policy

- Supplied screenshots define the **assessment format and style**.
- Passed-candidate notes define **exam traps and decision heuristics**.
- Official Anthropic documentation defines **current technical behavior**.

## CI

`audit.mjs` validates blocking implementation requirements and JavaScript syntax.

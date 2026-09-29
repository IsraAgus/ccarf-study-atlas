# Question engine architecture

This branch adds a certification-style question engine based on the supplied practice screenshots.

## Format
- Persistent SCENARIO block
- Explicit QUESTION block
- Four plausible options
- Single-response and multiple-response questions
- Study Mode with distractor-specific diagnosis and concept/docs review links
- Exam Mode with intentionally shorter feedback
- Per-profile question statistics for Tú / Pareja

## Data
Questions live in `question-bank.js` and reference lesson IDs in the existing Atlas.

## Source policy
The screenshots define **format/style only**. Technical correctness must be validated against current official Anthropic documentation. Candidate notes remain the exam-trap/decision-pattern layer.

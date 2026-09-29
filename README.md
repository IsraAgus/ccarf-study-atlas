# CCAR-F Study Atlas

Static bilingual study site for **Claude Certified Architect — Foundations**.

## Deploy to Vercel

### Option A — GitHub + Vercel (recommended)
1. Create a new GitHub repository.
2. Upload all files from this folder to the repository root.
3. In Vercel, choose **Add New → Project → Import Git Repository**.
4. Select the repo.
5. Framework preset: **Other** (or let Vercel auto-detect the static site).
6. Build command: leave empty.
7. Output directory: leave empty.
8. Deploy.

### Option B — Vercel CLI
```bash
npm i -g vercel
cd ccarf-study-site
vercel
```

## Study features
- Spanish / English / bilingual mode.
- Separate per-topic progress for **You / Partner** saved in `localStorage`.
- **Study Mode**: explains the reasoning error, root cause, correct answer, decision rule, and links back to the concept + official Anthropic docs.
- **Exam Mode**: minimal post-answer feedback; when wrong, shows why the choice failed and which option was correct.
- 25-minute focus timer.
- Candidate-insight vs official-documentation badges.
- Exam traps and mental rules.
- Quick-check questions with answer explanation.
- Visual SVG explanation for every lesson.
- Responsive layout for phones/tablets/laptops.

## How to add a lesson
Edit `app.js` and append a lesson object to the `lessons` array. Add its SVG under `assets/` and reference it through the `image` field.

## Source model
- **Passed-candidate notes:** exam patterns, distractors, and decision heuristics supplied privately by the learner.
- **Anthropic official docs:** technical definitions and current behavior. The site links directly to the official pages.

This is study material, not an official Anthropic product.


## Practice-mode behavior

### Study Mode
Use this while learning. Wrong answers are treated as diagnostic signals: the site explains the specific reasoning failure, surfaces the core decision rule, shows the correct option, and provides both an internal review link and the relevant official Anthropic documentation. Explanations are intentionally concise in structure but not artificially shortened when technical depth is needed.

### Exam Mode
Use this for assessment. It avoids remediation links and extended teaching. A correct answer receives only confirmation; an incorrect answer receives the reason the selected option failed and the correct option.

### Profiles
`You` and `Partner` keep separate mastery, quiz history, and active mode in browser local storage, allowing two learners to share the same deployed site without overwriting each other's progress.

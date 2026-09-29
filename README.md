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
- Per-topic progress saved in `localStorage`.
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

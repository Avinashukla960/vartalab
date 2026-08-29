# VARTALAB — Build your English. Practise with confidence. See your progress.

A complete, polished, student-focused English-learning web platform.
**shadcn/ui-inspired design · black/white/zinc theme · mobile-first · zero setup · no build tools.**

> 🎯 Built for a hackathon demo. Everything runs in your browser —
> no backend, no real login system, no payment, no real AI. Progress is saved in
> `localStorage` as **"Demo Student — Aarav Sharma"**.

---

## 🔐 The flow (as requested)

1. **Landing** — anyone who visits lands on `index.html` (the main page).
2. **Sign in** — the navbar "Sign in" button (and every CTA) leads to `login.html`.
3. **Demo credentials** — prefilled on the login card:
   - Email: `demo@vartalab.com` · Password: `demo1234` (or click **Autofill**)
4. **Dashboard** — after signing in you land on `learn.html`, the student dashboard.
   App pages are protected: visiting them while logged out redirects to the login screen.

## 🚀 Run it

Just open **`index.html`** in any modern browser (double-click works —
no server, no install).

Or serve the folder for the full experience:
```bash
cd vartalab
python3 -m http.server 8080
# then open http://localhost:8080
```

## 📁 Structure

```
vartalab/
├── index.html        Landing page (hero, pillars, how-it-works, previews)
├── login.html        Sign in — demo credentials (demo@vartalab.com / demo1234)
├── diagnostic.html   Onboarding diagnostic (goal → level → 3 questions → path)
├── learn.html        Learn dashboard (progress ring, weak areas, skills)
├── lesson.html       ⭐ Lesson/Quiz screen (instant feedback, XP, rating)
├── videos.html       Video cards (real YouTube links) + quiz buttons
├── papers.html       Question papers, filterable, sample view + attempt
├── assessments.html  Timed mock tests (timer, no instant feedback)
├── flashcards.html   Flip cards (click / space / arrows)
├── arena.html        IELTS Arena (live countdown, mini-contest, rating)
├── leaderboard.html  Global / Weekly / Monthly tabs + podium + "You"
├── profile.html      Badges, skills, contest history, share & privacy
├── colab.html        Communities, sessions, discussion feed
├── actlab.html       Events (debates, movie night, mock interviews…)
├── about.html        Mission, pillars, terms/privacy, contact form
├── css/style.css     Self-sufficient design system (works offline)
└── js/
    ├── data.js       ALL app data (lessons, users, videos, papers…)
    └── app.js        Shared engine: nav, storage, toasts, confetti, timers
```

## ✨ Feature notes

- **Design system**: shadcn/ui-inspired — zinc-950 background, white foreground,
  white/10 borders, white primary buttons, Inter type. Tailwind via CDN for
  utilities + `css/style.css` that looks the same even offline.
- **Auth flow**: `login.html` validates the demo credentials, stores a session in
  `localStorage`, then opens the dashboard. "Log out" lives in the profile page
  and the mobile menu. App pages redirect to login when no session exists.
- **State**: `localStorage` keeps rating, completed lessons, weak areas,
  diagnostic result, contest attempts and streaks across pages.
- **Rating & XP**: lesson/assessment/contest completions change your rating
  (shown in the navbar), fire toasts and confetti on success.
- **Countdowns**: arena contest countdown ticks live to Sunday 6 PM;
  assessment/contest timers count down and auto-submit at 0:00.
- **Mobile**: hamburger drawer, stacked grids, no horizontal scroll (tested at 360px).
- **Disclaimer**: IELTS Arena is a *practice* contest, not an official IELTS exam.

## 🧪 Validation

All pages were runtime-tested (linkedom + Node):
- 28 inline scripts + `js/data.js` + `js/app.js` — zero syntax errors
- 14 pages initialise without errors
- Core flows pass end-to-end: lesson → +12 rating · diagnostic → path ·
  assessment → result · arena → contest → rating · flashcards · leaderboard tabs

# ⬇️ COPY EVERYTHING BELOW THIS LINE AND PASTE INTO YOUR AI AGENT ⬇️

You are a senior full-stack frontend engineer. Build a complete, polished, student-focused English-learning web platform called **VARTALAB** as a single runnable static web app. It must be a **modern, attractive, DARK-THEME** responsive website that looks great on both mobile and desktop.

## TECH STACK (strict)
- Plain **HTML + CSS + JavaScript** (vanilla). NO build tools, NO npm, NO bundler. Must run by double-clicking an HTML file (open directly, no install, no dev server).
- **Tailwind CSS via CDN** (`<script src="https://cdn.tailwindcss.com"></script>`) for all styling.
- Configure a custom design system with `tailwind.config` inside the page (custom colors, fonts).
- **System font stack OR a Google Font** (e.g. "Inter", "Poppins") — but provide a system-font fallback so it still looks fine offline.
- All data lives in a single `js/data.js` file (NOT hard-coded into HTML). Pages read from it.
- Progress/state persistence via **`localStorage`** (student rating, completed lessons, weak areas, diagnostic result, contest attempt).
- **Icons**: use Lucide icons via CDN or inline SVG.
- NO real backend, NO login, NO payment, NO real AI. Use mock/sample data and a "logged in as Demo Student" concept.

## DESIGN THEME — DARK & MODERN (critical)
- **Dark background** (e.g. `#0b0f1a` / slate-950) with soft dark cards (`#151b2b`) and subtle borders.
- **Primary accent**: a vivid indigo/violet (e.g. `#6d5cff`) and a second accent teal/emerald (`#22d3ee` or `#10b981`) for success.
- Generous spacing, rounded cards (12–16px), soft shadows, subtle gradients, smooth transitions and micro-animations.
- Strong visual hierarchy, clean yet student-friendly. NOT corporate, NOT a children's app. Do not copy Duolingo's mascot look.
- **Mobile-first**: no horizontal scroll, works at ~360px width. Check every screen on mobile and desktop.
- Subtle gamification: progress bars, badges, ranks, points, streak. Use a small "toast" animation whenever rating/XP increases.
- Every screen needs a **consistent top navbar** (works on mobile with a hamburger menu) and a footer.

## SHOULD EMBED / ADD these visual touches
- Animated hero with a gradient glow, floating "+rating" / streak chips.
- Smooth page transitions.
- Confetti or a "Level Up" toast when a lesson/quiz is completed.
- Nice empty/loading/error states (the app must never show broken UI).
- YouTube video cards with a real thumbnail.

## DATA MODEL (js/data.js) — pre-seed with realistic sample data
```js
const DB = {
  currentUser: { id:"demo", name:"Aarav Sharma", avatar:"😀", goal:"IELTS",
    selfLevel:"B1+", rating:1620, highestRating:1642, streak:14, rank:231,
    badges:[{name:"7-Day Streak", earned:true},{name:"Top 10%", earned:true},
            {name:"First Contest", earned:true},{name:"Grammar Master", earned:false}],
    skills:{Tense:72, Articles:40, Prepositions:60, Vocabulary:55} },

  leaderboard: [ // global weekly, ~12 fake users, currentUser included
    {name:"Diya Nair", rating:1712},
    {name:"Kabir Mehta", rating:1690},
    // ...more
    {name:"Aarav Sharma", rating:1620, isMe:true},
  ],

  lessons: [ // at least 3 full lessons; lesson 1 is the star
    { id:1, title:"Present Perfect Tense", skill:"Tense", difficulty:"Easy", xp:30,
      explanation:"We use the present perfect for actions that happened at an unspecified time...",
      examples:["I have eaten lunch.","She has visited Paris."],
      questions:[
        { q:"She ____ her homework already.", options:["finished","has finished","finishes","is finishing"],
          correct:1, explain:"'has finished' is correct — an action completed at an unspecified time." },
        // ...4 to 6 total questions
      ] },
    // ...more lessons on Articles, Prepositions
  ],

  videos: [ // 4–6 educational YouTube video cards
    { id:1, title:"Present Perfect Explained (10 min)", skill:"Tense",
      duration:"10:24", youtubeId:"VIDEO_ID", channel:"..." },
    // ...more
  ],

  papers: [ // 5–6 question-paper cards, filterable by exam
    { id:1, title:"IELTS Writing Task 2 — Practice", exam:"IELTS", type:"Writing",
      questions:30, time:"60 min" },
    { id:2, title:"Class 12 Board English Sample Paper", exam:"Board", type:"Mixed", questions:40 },
    // ...more
  ],

  assessments: [ // mock tests
    { id:1, title:"Tense Mastery — Mock Test", skill:"Tense", questions:10, time:"10 min", pass:70 },
  ],

  flashcards: [ {front:"Present Perfect used for?", back:"Actions at an unspecified past time"},
    // ...~8 cards
  ],

  contests: [ { id:1, title:"Weekly Grammar Sprint", skill:"Mixed", totalQuestions:20,
      duration:"15 min", entries:342, startTime:"Sunday 6 PM" } ],

  pastContests: [ /* 2–3 with results */ ],
};
```

## PAGES / SCREENS TO BUILD (all linked via a shared navbar)

1. **Home (`index.html`)**
   - Hero: big headline using the copy: "Build your English. Practise with confidence. See your progress."
   - Primary CTA "Start Learning / Take Diagnostic" + secondary "Explore IELTS Arena".
   - 3 product pillar cards: **Learn · CO-LAB · ACT-LAB**.
   - A "How it works" strip (short, 3-step on mobile / 7-step grid on desktop).
   - A small leaderboard preview, a contest preview, community preview.
   - Footer: About, Contact, Terms, Privacy.

2. **Onboarding / Diagnostic** — 5 questions: primary goal (IELTS / Interview / Higher studies / General / Speaking / Writing), self-level, then 3 grammar questions of increasing difficulty. On submit → show result: "Recommended path: Level B1+ · Focus on Tenses & Articles" → button to Learn. Save to localStorage.

3. **Learn Dashboard** — greeting, overall progress ring/bar, current goal, recommended next lesson, weak areas (from skills in data.js), grid of grammar categories, "Continue Learning" and "Practice Again" buttons.

4. **Lesson / Quiz screen ⭐ (the star — build this best)**
   - Title, skill badge, difficulty, XP.
   - Short explanation, 2 examples.
   - Then 3–5 questions ONE at a time: click option → instant green(correct)/red(wrong) feedback + a "why" explanation + progress bar. Buttons: Next / Retry.
   - End: "Lesson complete! +XP, rating +12" with confetti → buttons to Leaderboard.
   - Track wrong answers → update weak areas in localStorage.

5. **Videos page** — thumbnail cards (YouTube embed on click) with skill tag + duration; a "Watch → Take quiz" button under each.

6. **Papers page** — card grid with filter buttons: ALL / IELTS / Interview / Board / General. Each has title, type, question count, time, and a "View" (opens a sample paper) or "Attempt" (goes to assessment) button.

7. **Assessments page** — list of mock tests. Start → timer counts down → questions one-by-one with NO instant feedback (feels like a real exam) → submit → result screen with score, %, weak topics that feed back into "recommended lessons/videos".

8. **Flashcards** — a flip card (click to flip: front = question, back = definition + example).

9. **IELTS Arena** — upcoming contest card with a LIVE ticking countdown, duration, question count, "Participate" button → mini-contest (timer, one question at a time, no instant feedback, "Q1/3" progress) → result screen (score, rank, "rating +18 → 1638", skill breakdown, percentile). Add a clear disclaimer: "Practice contest, not an official IELTS exam." Show past contests list.

10. **Leaderboard** — tabs: Global / Weekly / Monthly. Ranked list with avatars + rating + points, a crown for top 3, and **"You" highlighted** at a competitive rank.

11. **Profile** — avatar, name, current & highest rating, rank/percentile, achievement badges grid (earned vs locked), skill progress bars, contest history, share-profile button, privacy toggle (public/private).

12. **CO-LAB** — list of communities (filterable by goal/level/topic) with join buttons, session cards, discussion feed mocks. (Keep it light.)

13. **ACT-LAB** — upcoming events list (movie discussion, debate, dialogue, poetry, interview practice, competitions, speaking activities) with date/time, online/offline tag, host, "Register" button. (Keep it light.)

14. **About / Contact** — product explanation, mission, 3 pillars, a contact form (mock, no backend).

## BEHAVIOR REQUIREMENTS
- "Logged in as Demo Student" — a small card/badge always visible; name + avatar appear on leaderboard & profile.
- Clicking through the whole flow must work end-to-end (Home → Diagnostic → Learn → Lesson → Arena → contest → Result → Leaderboard → Profile) with localStorage persisting progress/rating across pages.
- Timer components must actually work. Countdown must tick live.
- All buttons must do something (even if it navigates to a mock screen). No dead clicks.
- Mobile: hamburger menu, stacked cards, no overflow. Desktop: responsive grid.

## DELIVERABLE
- A complete, working static web app (one folder with `index.html` + other `.html` pages + `js/data.js`, `js/app.js`, lesson/quiz logic, and `css/style.css` if needed).
- Clean, commented code.
- It must open and run by directly opening `index.html` in a browser, with no setup.

Build it now, complete and polished. This is for a hackathon demo — make every screen look professional and the whole flow feel like a real product.

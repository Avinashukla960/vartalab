/* ============================================================
   VARTALAB — Data store (all app data lives here, per spec)
   Pages read from this single file. No data is hard-coded in HTML.
   ============================================================ */

const DB = {
  /* ---------- Current (demo) user ---------- */
  currentUser: {
    id: "demo",
    name: "Aarav Sharma",
    avatar: "😀",
    goal: "IELTS",
    selfLevel: "B1+",
    rating: 1620,
    highestRating: 1642,
    streak: 14,
    rank: 231,
    percentile: 82,
    profilePublic: true,
    badges: [
      { name: "7-Day Streak", icon: "🔥", desc: "Practised 7 days in a row", earned: true },
      { name: "Top 10%", icon: "🏆", desc: "Reached the top 10% on a contest", earned: true },
      { name: "First Contest", icon: "🎯", desc: "Entered your first arena contest", earned: true },
      { name: "Grammar Master", icon: "🧠", desc: "Score 90%+ in a grammar mock", earned: false },
      { name: "First Blood", icon: "⚡", desc: "Complete your first lesson", earned: true },
      { name: "Vocabulary Vault", icon: "📚", desc: "Review 50 flashcards", earned: false },
      { name: "Marathoner", icon: "🏃", desc: "30-day practice streak", earned: false },
      { name: "Speaking Star", icon: "🎤", desc: "Attend 3 ACT-LAB events", earned: false },
      { name: "Paper Chaser", icon: "📝", desc: "Attempt 5 question papers", earned: true },
      { name: "CO-LAB Creator", icon: "💬", desc: "Start a discussion thread", earned: false },
    ],
    skills: { Tense: 72, Articles: 40, Prepositions: 60, Vocabulary: 55 },
    // progress state (mirrored to localStorage by app.js)
    completedLessons: [],
    weakAreas: [],
    diagnostic: null,
    contestAttempt: null,
    lastAssessment: null,
  },

  /* ---------- Global weekly leaderboard (~12 users incl. currentUser) ---------- */
  leaderboard: [
    { name: "Diya Nair", avatar: "🦊", rating: 1712 },
    { name: "Kabir Mehta", avatar: "🐯", rating: 1690 },
    { name: "Riya Patel", avatar: "🦋", rating: 1678 },
    { name: "Aditya Rao", avatar: "🦅", rating: 1664 },
    { name: "Sneha Iyer", avatar: "🦢", rating: 1651 },
    { name: "Vikram Singh", avatar: "🐺", rating: 1643 },
    { name: "Ananya Gupta", avatar: "🌻", rating: 1631 },
    { name: "Aarav Sharma", avatar: "😀", rating: 1620, isMe: true },
    { name: "Ishaan Verma", avatar: "🐼", rating: 1612 },
    { name: "Meera Kulkarni", avatar: "🌸", rating: 1598 },
    { name: "Rohan Desai", avatar: "🦁", rating: 1585 },
    { name: "Priya Nambiar", avatar: "🕊️", rating: 1571 },
    { name: "Arjun Menon", avatar: "🦉", rating: 1560 },
    { name: "Tara Bose", avatar: "🐰", rating: 1549 },
  ],

  /* ---------- Lessons ---------- */
  lessons: [
    /* ---- Lesson 1 (star lesson) ---- */
    {
      id: 1,
      title: "Present Perfect Tense",
      skill: "Tense",
      difficulty: "Easy",
      xp: 30,
      explanation:
        "We use the present perfect (have/has + past participle) for actions that happened at an unspecified time in the past, or that started in the past and continue now. If the time is specific (yesterday, last week, in 2019), use the past simple instead.",
      examples: ["I have eaten lunch.", "She has visited Paris twice."],
      questions: [
        {
          q: "She ____ her homework already.",
          options: ["finished", "has finished", "finishes", "is finishing"],
          correct: 1,
          explain: "'has finished' is correct — an action completed at an unspecified time, with 'already' signalling the present perfect.",
        },
        {
          q: "They ____ to Jaipur twice this year.",
          options: ["went", "have been", "are going", "go"],
          correct: 1,
          explain: "'have been' — the trip happened at an unspecified time this year and the experience is still relevant now.",
        },
        {
          q: "I ____ my keys. I can't find them anywhere!",
          options: ["lose", "lost", "have lost", "am losing"],
          correct: 2,
          explain: "'have lost' — the result (missing keys) matters right now, so we use the present perfect.",
        },
        {
          q: "____ you ever ____ to the Taj Mahal?",
          options: ["Did…go", "Have…been", "Do…go", "Are…going"],
          correct: 1,
          explain: "'Have…been' — 'ever' asks about experience at any time in your life, which is the present perfect.",
        },
        {
          q: "Which sentence is correct?",
          options: [
            "She has seen that movie yesterday.",
            "She saw that movie yesterday.",
            "She has saw that movie yesterday.",
            "She is seeing that movie yesterday.",
          ],
          correct: 1,
          explain: "'She saw… yesterday' — 'yesterday' is a specific past time, so the past simple is required.",
        },
      ],
    },

    /* ---- Lesson 2 ---- */
    {
      id: 2,
      title: "Articles: A, An & The",
      skill: "Articles",
      difficulty: "Easy",
      xp: 25,
      explanation:
        "'A' and 'an' are indefinite articles for singular countable nouns — 'an' before a vowel SOUND (an hour, an MBA). 'The' is definite: we use it when both speaker and listener know which thing we mean.",
      examples: ["She is an engineer.", "The sun rises in the east."],
      questions: [
        {
          q: "He wants to be ____ astronaut one day.",
          options: ["a", "an", "the", "no article"],
          correct: 1,
          explain: "'an astronaut' — 'astronaut' starts with a vowel sound, so we use 'an'.",
        },
        {
          q: "I bought ____ new phone yesterday.",
          options: ["a", "an", "the", "no article"],
          correct: 0,
          explain: "'a new phone' — the phone is mentioned for the first time and 'new' starts with a consonant sound.",
        },
        {
          q: "____ Ganga is a holy river.",
          options: ["A", "An", "The", "No article"],
          correct: 2,
          explain: "'The Ganga' — we use 'the' with rivers, oceans, and mountain ranges.",
        },
        {
          q: "Which sentence is correct?",
          options: [
            "I saw a man. The man was carrying an umbrella.",
            "I saw the man. A man was carrying an umbrella.",
            "I saw a man. A man was carrying an umbrella.",
            "I saw the man. The man was carrying the umbrella.",
          ],
          correct: 0,
          explain: "First mention uses 'a'; the second mention of the same man uses 'the' — that's the classic a→the pattern.",
        },
        {
          q: "She plays ____ piano beautifully.",
          options: ["a", "an", "the", "no article"],
          correct: 2,
          explain: "'the piano' — we use 'the' with musical instruments: play the guitar, play the piano.",
        },
      ],
    },

    /* ---- Lesson 3 ---- */
    {
      id: 3,
      title: "Prepositions of Place",
      skill: "Prepositions",
      difficulty: "Medium",
      xp: 35,
      explanation:
        "Use 'in' for enclosed spaces and countries, 'on' for surfaces and public transport, 'at' for points and specific addresses. Compare: in Mumbai, on the table, at the bus stop.",
      examples: ["The keys are on the table.", "She lives at 21 MG Road in Indore."],
      questions: [
        {
          q: "The meeting is ____ 3 PM ____ Monday.",
          options: ["at / on", "on / at", "in / on", "at / in"],
          correct: 0,
          explain: "'at' for clock time, 'on' for days of the week.",
        },
        {
          q: "There's a beautiful painting ____ the wall.",
          options: ["in", "on", "at", "into"],
          correct: 1,
          explain: "'on the wall' — a painting hangs on a vertical surface.",
        },
        {
          q: "She arrived ____ Indore last night.",
          options: ["at", "on", "in", "to"],
          correct: 2,
          explain: "'in Indore' — we use 'in' with cities and large areas. (Note: 'arrive at' is for small places, 'arrive in' for cities.)",
        },
        {
          q: "He is waiting ____ the bus stop.",
          options: ["in", "on", "at", "to"],
          correct: 2,
          explain: "'at the bus stop' — 'at' marks a specific point or station.",
        },
        {
          q: "Choose the correct sentence:",
          options: [
            "I'm going in a train to Delhi.",
            "I'm going on a train to Delhi.",
            "I'm going at a train to Delhi.",
            "I'm going to a train to Delhi.",
          ],
          correct: 1,
          explain: "'on a train' — we use 'on' for public transport (train, bus, plane, ship).",
        },
      ],
    },
  ],

  /* ---------- Video cards (real YouTube videos, verified) ---------- */
  videos: [
    { id: 1, title: "Present Perfect vs Past Simple", skill: "Tense", duration: "13:09", youtubeId: "AM3RydRXn_g", channel: "engVid" },
    { id: 2, title: "Simple Past vs Present Perfect Explained", skill: "Tense", duration: "08:15", youtubeId: "Fvws1GraBtk", channel: "Learn English Lab" },
    { id: 3, title: "Present Perfect or Past Perfect?", skill: "Tense", duration: "21:23", youtubeId: "4absOFROemA", channel: "Aleena Rais Live" },
    { id: 4, title: "How to Use Articles: A, An & The", skill: "Articles", duration: "26:03", youtubeId: "E_o6jKrZsg8", channel: "mmmEnglish" },
    { id: 5, title: "Articles A, An & The — Full Lesson", skill: "Articles", duration: "09:58", youtubeId: "Cc5i5jnqM4g", channel: "Learnex" },
    { id: 6, title: "IELTS Speaking Mock Test — Band 9", skill: "Speaking", duration: "14:32", youtubeId: "Sgwl1MLWSPw", channel: "IELTS Advantage" },
    { id: 7, title: "IELTS Speaking Full Test: Parts 1, 2 & 3", skill: "Speaking", duration: "12:05", youtubeId: "pBrFbXB7EAg", channel: "IELTS Official" },
    { id: 8, title: "Prepositions of Place: in, on, at & more", skill: "Prepositions", duration: "26:48", youtubeId: "7pjZ3dkcg3M", channel: "Arnel's Everyday English" },
    { id: 9, title: "English Vocabulary Masterclass: 250 Words", skill: "Vocabulary", duration: "47:16", youtubeId: "S9wJ2TJdiq0", channel: "Speak English With Vanessa" },
  ],

  /* ---------- Question papers (filterable by exam) ---------- */
  papers: [
    { id: 1, title: "IELTS Writing Task 2 — Practice Set", exam: "IELTS", type: "Writing", questions: 30, time: "60 min" },
    { id: 2, title: "Class 12 Board English Sample Paper", exam: "Board", type: "Mixed", questions: 40, time: "90 min" },
    { id: 3, title: "Interview English — Quick Fire Questions", exam: "Interview", type: "Speaking", questions: 20, time: "25 min" },
    { id: 4, title: "General Everyday Grammar Pack", exam: "General", type: "Mixed", questions: 25, time: "30 min" },
    { id: 5, title: "IELTS Reading — Skimming Drill", exam: "IELTS", type: "Reading", questions: 28, time: "45 min" },
    { id: 6, title: "Board Essay & Letter Writing Set", exam: "Board", type: "Writing", questions: 12, time: "50 min" },
    { id: 7, title: "Group Discussion Vocabulary Builder", exam: "Interview", type: "Vocabulary", questions: 18, time: "20 min" },
    { id: 8, title: "Everyday Conversations — Roleplay Pack", exam: "General", type: "Speaking", questions: 22, time: "30 min" },
  ],

  /* ---------- Assessments (mock tests with timers) ---------- */
  assessments: [
    {
      id: 1, title: "Tense Mastery — Mock Test", skill: "Tense", questions: 10, time: "10 min", pass: 70,
      qs: [
        { q: "By next year, she ____ here for ten years.", options: ["works", "will have worked", "worked", "is working"], correct: 1, skill: "Tense" },
        { q: "When I arrived, the movie ____.", options: ["already started", "had already started", "has already started", "starts"], correct: 1, skill: "Tense" },
        { q: "Look! It ____ outside.", options: ["rains", "is raining", "has rained", "rained"], correct: 1, skill: "Tense" },
        { q: "I ____ this book three times already.", options: ["read", "have read", "am reading", "was reading"], correct: 1, skill: "Tense" },
        { q: "They ____ football every Sunday.", options: ["play", "are playing", "played", "have played"], correct: 0, skill: "Tense" },
        { q: "She ____ her keys before leaving.", options: ["has locked", "locked", "locks", "will lock"], correct: 1, skill: "Tense" },
        { q: "We ____ dinner when the phone rang.", options: ["have", "had", "were having", "are having"], correct: 2, skill: "Tense" },
        { q: "He ____ in Mumbai since 2018.", options: ["lives", "is living", "has lived", "lived"], correct: 2, skill: "Tense" },
        { q: "By the time you arrive, I ____ the report.", options: ["finish", "will finish", "will have finished", "finished"], correct: 2, skill: "Tense" },
        { q: "The train ____ at 6 AM tomorrow.", options: ["leaves", "left", "has left", "was leaving"], correct: 0, skill: "Tense" },
      ],
    },
    {
      id: 2, title: "Articles & Prepositions — Quick Test", skill: "Articles", questions: 10, time: "10 min", pass: 70,
      qs: [
        { q: "She is ____ honest person.", options: ["a", "an", "the", "no article"], correct: 1, skill: "Articles" },
        { q: "____ Himalayas are the tallest mountains.", options: ["A", "An", "The", "No article"], correct: 2, skill: "Articles" },
        { q: "I go to ____ bed at 11 PM.", options: ["a", "an", "the", "no article"], correct: 3, skill: "Articles" },
        { q: "He is ____ best player on the team.", options: ["a", "an", "the", "no article"], correct: 2, skill: "Articles" },
        { q: "My birthday is ____ June.", options: ["in", "on", "at", "by"], correct: 0, skill: "Prepositions" },
        { q: "Let's meet ____ noon.", options: ["in", "on", "at", "to"], correct: 2, skill: "Prepositions" },
        { q: "She is good ____ maths.", options: ["in", "on", "at", "for"], correct: 2, skill: "Prepositions" },
        { q: "The cat jumped ____ the table.", options: ["in", "on", "at", "above"], correct: 1, skill: "Prepositions" },
        { q: "I'm interested ____ learning Spanish.", options: ["of", "in", "on", "at"], correct: 1, skill: "Prepositions" },
        { q: "We arrived ____ the airport early.", options: ["in", "on", "at", "to"], correct: 2, skill: "Prepositions" },
      ],
    },
    {
      id: 3, title: "Vocabulary Booster — Mock Test", skill: "Vocabulary", questions: 10, time: "10 min", pass: 70,
      qs: [
        { q: "Choose the closest synonym of 'abundant':", options: ["scarce", "plentiful", "average", "empty"], correct: 1, skill: "Vocabulary" },
        { q: "'Punctual' means:", options: ["always late", "on time", "lazy", "talkative"], correct: 1, skill: "Vocabulary" },
        { q: "Opposite of 'ancient':", options: ["old", "modern", "broken", "rare"], correct: 1, skill: "Vocabulary" },
        { q: "'Reluctant' most nearly means:", options: ["eager", "unwilling", "angry", "confused"], correct: 1, skill: "Vocabulary" },
        { q: "A 'fragile' object is:", options: ["strong", "easily broken", "very heavy", "brand new"], correct: 1, skill: "Vocabulary" },
        { q: "Synonyms of 'humble' include:", options: ["proud", "modest", "arrogant", "loud"], correct: 1, skill: "Vocabulary" },
        { q: "'To enhance' means to:", options: ["reduce", "improve", "remove", "ignore"], correct: 1, skill: "Vocabulary" },
        { q: "A 'brief' summary is:", options: ["long", "short", "detailed", "confusing"], correct: 1, skill: "Vocabulary" },
        { q: "Choose the word closest to 'transparent':", options: ["opaque", "clear", "dark", "solid"], correct: 1, skill: "Vocabulary" },
        { q: "'Diligent' workers are:", options: ["lazy", "hardworking", "careless", "slow"], correct: 1, skill: "Vocabulary" },
      ],
    },
  ],

  /* ---------- Flashcards ---------- */
  flashcards: [
    { front: "When do we use the Present Perfect?", back: "For actions at an unspecified past time, or actions that started in the past and continue now. Example: I have lived here since 2020." },
    { front: "A, AN or THE before a noun?", back: "A/An = not specific, first mention. The = specific or already mentioned. Example: I saw a dog. The dog was barking." },
    { front: "IN, ON or AT for time?", back: "IN = months/years (in June). ON = days/dates (on Monday). AT = clock time (at 5 PM)." },
    { front: "What is a collocation?", back: "Words that naturally go together. Example: make a decision, do homework, heavy rain — not 'do a decision'." },
    { front: "IN, ON or AT for place?", back: "IN = enclosed/cities (in a box, in Indore). ON = surfaces/transport (on the table, on a bus). AT = points (at the station)." },
    { front: "How do we form the past participle of regular verbs?", back: "Add -ed to the base verb. Example: walk → walked, play → played. Irregular verbs change: go → gone, see → seen." },
    { front: "What is a dependent preposition?", back: "A preposition fixed to a word. Example: interested IN, good AT, afraid OF, depend ON." },
    { front: "What does 'nevertheless' mean?", back: "'In spite of that' — a formal connector. Example: The test was hard; nevertheless, she passed." },
    { front: "What are articles for?", back: "They tell us whether a noun is specific (the) or general/one-of-many (a/an). Zero article = general plural or uncountable." },
    { front: "What is 'since' vs 'for'?", back: "SINCE = starting point (since 2019). FOR = duration (for five years). Both often pair with the present perfect." },
    { front: "What does 'ambiguous' mean?", back: "Open to more than one interpretation; unclear. Example: His answer was ambiguous, so we asked again." },
    { front: "What is a phrasal verb?", back: "A verb + particle with a special meaning. Example: give up = quit, look after = take care of, run into = meet by chance." },
  ],

  /* ---------- Contest (live) & past contests ---------- */
  contests: [
    {
      id: 1,
      title: "Weekly Grammar Sprint",
      skill: "Mixed",
      totalQuestions: 20,
      duration: "15 min",
      entries: 342,
      startTime: "Sunday 6 PM",
      contestDay: 0, // 0 = Sunday (JS getDay)
      contestHour: 18,
      contestMinute: 0,
      ratingReward: 18,
    },
  ],

  pastContests: [
    { id: 9, title: "Tense Throwdown — Week 11", date: "17 Aug 2026", score: 6, total: 8, ratingGain: 14, rank: 38, entries: 412 },
    { id: 8, title: "Vocabulary Battle — Week 10", date: "10 Aug 2026", score: 7, total: 10, ratingGain: 16, rank: 29, entries: 385 },
    { id: 7, title: "Article Arena — Week 9", date: "3 Aug 2026", score: 5, total: 8, ratingGain: 10, rank: 51, entries: 298 },
  ],

  /* ---------- CO-LAB communities ---------- */
  communities: [
    { id: 1, name: "IELTS Aspirants — India", goal: "IELTS", level: "B1–C1", members: 1240, topic: "Speaking", desc: "Daily speaking prompts, band-9 answer breakdowns and peer feedback.", icon: "🎓" },
    { id: 2, name: "Interview Warriors", goal: "Interview", level: "B1–B2", members: 860, topic: "Speaking", desc: "Mock HR & technical interview practice with instant feedback.", icon: "💼" },
    { id: 3, name: "Board English Crushers", goal: "Higher studies", level: "A2–B1", members: 1530, topic: "Writing", desc: "Board paper walkthroughs, essays and letter-writing marathons.", icon: "📝" },
    { id: 4, name: "Grammar Fixers", goal: "General", level: "A2–C1", members: 2210, topic: "Grammar", desc: "One grammar rule a day. Doubts solved within hours.", icon: "🧩" },
    { id: 5, name: "Speak Fluent Circles", goal: "Speaking", level: "B1–C1", members: 980, topic: "Speaking", desc: "Voice-note discussions, accent practice and fluency sprints.", icon: "🗣️" },
    { id: 6, name: "Word Wizards", goal: "Writing", level: "A2–B2", members: 1750, topic: "Vocabulary", desc: "A word of the day, vocabulary games and story challenges.", icon: "✨" },
  ],

  sessions: [
    { id: 1, title: "Band-9 IELTS Speaking Demo", community: "IELTS Aspirants — India", time: "Today · 7:30 PM", host: "Ananya G.", seats: 18, left: 5, online: true },
    { id: 2, title: "Group Discussion: Work-Life Balance", community: "Interview Warriors", time: "Sat · 5:00 PM", host: "Rohan D.", seats: 12, left: 3, online: true },
    { id: 3, title: "Essay Writing Clinic", community: "Board English Crushers", time: "Sun · 11:00 AM", host: "Meera K.", seats: 25, left: 14, online: true },
    { id: 4, title: "Grammar Doubt Hour", community: "Grammar Fixers", time: "Fri · 6:00 PM", host: "Vikram S.", seats: 30, left: 22, online: true },
  ],

  feed: [
    { id: 1, author: "Sneha Iyer", avatar: "🦢", community: "IELTS Aspirants — India", time: "12 min ago", text: "Just scored 7.5 in my mock speaking test after 3 weeks of daily prompts! The examiner said my fluency improved a lot. Keep practising, everyone! 💪", likes: 34, replies: 8 },
    { id: 2, author: "Ishaan Verma", avatar: "🐼", community: "Grammar Fixers", time: "48 min ago", text: "Quick doubt: 'I have visited Jaipur in 2023' — correct or not? I keep mixing present perfect and past simple.", likes: 12, replies: 15 },
    { id: 3, author: "Meera Kulkarni", avatar: "🌸", community: "Board English Crushers", time: "2 hr ago", text: "Shared my Class 12 essay template for the board exam — link in the community files. Feel free to use and improve it! 📝", likes: 47, replies: 11 },
  ],

  /* ---------- ACT-LAB events ---------- */
  events: [
    { id: 1, title: "Movie Night: 'The Pursuit of Happyness'", type: "Movie discussion", date: "31 Aug", time: "7:00 PM", mode: "Online", host: "Ananya G.", seats: 40, desc: "Watch together, then discuss vocabulary, dialogues and character analysis." },
    { id: 2, title: "Debate Night: 'AI will replace teachers'", type: "Debate", date: "2 Sep", time: "6:30 PM", mode: "Offline · Indore", host: "Kabir M.", seats: 24, desc: "Structured debate with speaking-time limits and a judges' panel." },
    { id: 3, title: "Daily Dialogue Practice", type: "Dialogue", date: "3 Sep", time: "8:00 AM", mode: "Online", host: "Riya P.", seats: 20, desc: "15-minute scripted dialogues followed by role-swap practice." },
    { id: 4, title: "Open Mic Poetry Evening", type: "Poetry", date: "5 Sep", time: "7:00 PM", mode: "Offline · Indore", host: "Tara B.", seats: 30, desc: "Recite your favourite poem or your own. All levels welcome." },
    { id: 5, title: "Mock Interview Sprint", type: "Interview practice", date: "6 Sep", time: "5:00 PM", mode: "Online", host: "Vikram S.", seats: 12, desc: "8-minute mock interviews with instant feedback on fluency & clarity." },
    { id: 6, title: "Speaking Competition: 'My City'", type: "Competition", date: "8 Sep", time: "6:00 PM", mode: "Offline · Indore", host: "ACT-LAB Team", seats: 50, desc: "3-minute speeches with prizes for the top 3 speakers." },
  ],

  /* ---------- Onboarding options ---------- */
  goals: ["IELTS", "Interview", "Higher studies", "General", "Speaking", "Writing"],
  levels: ["A1", "A2", "B1", "B1+", "B2", "C1"],
};

/* Export (compatible with both <script> include and ES module import) */
if (typeof module !== "undefined" && module.exports) module.exports = { DB };
if (typeof window !== "undefined") window.DB = DB;

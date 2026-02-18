// ═══════════════════════════════════════════════════════
// Real-Life RPG — All Game Content Data
// ═══════════════════════════════════════════════════════

const CONTENT = {

  // ── App Meta ──────────────────────────────────────────
  appName: "Real-Life RPG",
  taglines: [
    "Level Up Your Real Life.",
    "Your Life Is The Game.",
    "Grind XP. Defeat Distractions.",
    "From Beginner to Legend."
  ],

  // ── Welcome Screen ───────────────────────────────────
  welcome: {
    title: "Welcome Back, Hero.",
    subtitle: "Your journey continues.",
    button: "Enter Game Mode"
  },

  // ── Character Creation ───────────────────────────────
  creation: {
    title: "Create Your Hero",
    subtitle: "Every legend starts at Level 1.",
    beginButton: "Begin Journey"
  },

  // ── Classes ──────────────────────────────────────────
  classes: {
    scholar: {
      id: "scholar",
      name: "Scholar",
      icon: "📚",
      quote: "Knowledge is your weapon.",
      bonus: "+20% XP from study sessions.",
      bonusStat: "intelligence",
      multiplier: { study: 1.2 }
    },
    coder: {
      id: "coder",
      name: "Coder",
      icon: "💻",
      quote: "You build worlds with logic.",
      bonus: "+Intelligence from coding tasks.",
      bonusStat: "intelligence",
      multiplier: { coding: 1.3 }
    },
    warrior: {
      id: "warrior",
      name: "Warrior",
      icon: "💪",
      quote: "Strength through discipline.",
      bonus: "+Strength from workouts.",
      bonusStat: "strength",
      multiplier: { workout: 1.3 }
    },
    monk: {
      id: "monk",
      name: "Monk",
      icon: "🧘",
      quote: "Focus is power.",
      bonus: "Reduced distraction penalties.",
      bonusStat: "focus",
      multiplier: { distraction: 0.5 }
    }
  },

  // ── Stats ────────────────────────────────────────────
  stats: {
    energy:       { icon: "❤️", name: "Energy",       desc: "Represents your daily stamina. Low energy = lower performance.", color: "#ff4757" },
    intelligence: { icon: "🧠", name: "Intelligence", desc: "Increases when you study or code.", color: "#3742fa" },
    strength:     { icon: "💪", name: "Strength",     desc: "Increases from workouts and physical activity.", color: "#ff6348" },
    focus:        { icon: "🎯", name: "Focus",        desc: "Determines resistance to distractions.", color: "#2ed573" },
    discipline:   { icon: "⚡", name: "Discipline",   desc: "Increases when you resist temptation.", color: "#ffa502" }
  },

  // ── Quests ───────────────────────────────────────────
  questStart: "New quests have arrived. The grind begins.",
  questComplete: "Quest Complete! XP Earned.",

  questPool: [
    { id: "study60",       text: "Study for 60 minutes",              xp: 60,  category: "study",   statBoost: { intelligence: 5 } },
    { id: "codeChallenge", text: "Complete one coding challenge",     xp: 40,  category: "coding",  statBoost: { intelligence: 3 } },
    { id: "read15",        text: "Read 15 pages",                     xp: 30,  category: "study",   statBoost: { intelligence: 2, focus: 1 } },
    { id: "exercise30",    text: "Exercise for 30 minutes",           xp: 20,  category: "workout", statBoost: { strength: 5, energy: 3 } },
    { id: "noDistract2h",  text: "Avoid distractions for 2 hours",   xp: 50,  category: "focus",   statBoost: { focus: 4, discipline: 3 } },
    { id: "meditate15",    text: "Meditate for 15 minutes",           xp: 25,  category: "focus",   statBoost: { focus: 3, discipline: 2 } },
    { id: "journal",       text: "Write in your journal",             xp: 20,  category: "study",   statBoost: { intelligence: 1, focus: 2 } },
    { id: "codeProject",   text: "Work on a project for 45 minutes", xp: 50,  category: "coding",  statBoost: { intelligence: 4 } },
    { id: "pushups50",     text: "Do 50 push-ups",                    xp: 15,  category: "workout", statBoost: { strength: 3 } },
    { id: "earlyWake",     text: "Wake up before 7 AM",               xp: 30,  category: "focus",   statBoost: { discipline: 4, energy: 2 } }
  ],

  // ── Distraction Monster ──────────────────────────────
  distraction: {
    appear:  "A Distraction Monster has appeared!",
    victory: "Victory! Discipline increased.",
    defeat:  "The monster attacks! Energy decreased.",
    monsterNames: [
      "Scroll Demon", "Tab Hydra", "Notification Wraith",
      "Procrastination Golem", "Binge-Watch Specter"
    ]
  },

  // ── Level Up ─────────────────────────────────────────
  levelUp: {
    title: "LEVEL UP!",
    message: "You are growing stronger. The path to mastery continues.",
    rewards: ["+5 Intelligence", "+3 Focus", "Skill Point Unlocked"]
  },

  // ── Skills ───────────────────────────────────────────
  skills: {
    studyMastery:    { name: "Study Mastery",    desc: "Increases study XP by 10%.",                  icon: "📖", cost: 1 },
    focusShield:     { name: "Focus Shield",     desc: "Reduces distraction damage.",                 icon: "🛡️", cost: 1 },
    ironDiscipline:  { name: "Iron Discipline",  desc: "Energy does not drop for minor distractions.", icon: "⚔️", cost: 2 },
    codingGenius:    { name: "Coding Genius",    desc: "Gain bonus Intelligence from projects.",      icon: "🧬", cost: 2 }
  },

  // ── Boss Battle ──────────────────────────────────────
  boss: {
    warning:     "⚠ A Boss Approaches: Final Exam",
    intro:       "This challenge tests your preparation.",
    prepared:    "You strike with knowledge. The boss weakens!",
    victory:     "Exam Defeated. You are victorious.",
    notPrepared: "The boss overpowers you. Train harder next time."
  },

  // ── Achievements ─────────────────────────────────────
  achievements: [
    { id: "streak7",       text: "7-Day Study Streak Unlocked!",      icon: "🔥" },
    { id: "codingWarrior",  text: "Coding Warrior Achievement Earned!", icon: "⚔️" },
    { id: "distractSlayer", text: "Distraction Slayer Badge!",         icon: "🛡️" },
    { id: "xp100",         text: "100 XP Milestone Reached!",          icon: "⭐" },
    { id: "legend",        text: "Legend Rank Achieved!",              icon: "👑" }
  ],

  // ── World Map Zones ──────────────────────────────────
  zones: [
    { id: "beginner",   name: "Beginner Village",    desc: "Every hero begins here.",             levelReq: 1,  icon: "🏠" },
    { id: "focus",      name: "Focus Forest",        desc: "Only disciplined minds survive.",     levelReq: 3,  icon: "🌳" },
    { id: "discipline", name: "Discipline Desert",   desc: "The grind tests your endurance.",     levelReq: 6,  icon: "🏜️" },
    { id: "mastery",    name: "Mastery Mountain",     desc: "Few reach this peak.",                levelReq: 10, icon: "⛰️" },
    { id: "legend",     name: "Legend Kingdom",       desc: "You are no longer a beginner.",       levelReq: 15, icon: "👑" }
  ],

  // ── Motivational Messages ────────────────────────────
  motivational: [
    "Small actions build great legends.",
    "Grind now, shine later.",
    "Discipline beats motivation.",
    "Level up or stay average.",
    "You are building your future.",
    "The grind is the glory.",
    "Champions are built in silence.",
    "Your future self is watching."
  ],

  // ── End of Day Summary ───────────────────────────────
  summary: {
    title: "Daily Performance Report",
    message: "Here's how you performed today.",
    finalLine: "Consistency creates champions."
  },

  // ── Sound Cues ───────────────────────────────────────
  soundCues: {
    xpGain:      "+XP!",
    levelUp:     "Power Increased!",
    monsterAppear: "Warning!",
    bossBattle:  "Prepare Yourself!"
  }

};

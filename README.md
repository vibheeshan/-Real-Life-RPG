# 🎮 Real-Life RPG

> *Level Up Your Real Life.*

Real-Life RPG transforms daily habits into a gamified adventure. Users gain experience points, level up, unlock skills, and defeat real-world challenges like exams and distractions.

Instead of tracking productivity, the application converts life progress into a dynamic RPG system powered by behavior-based mechanics. **It turns growth into gameplay.**

---

## 🖥 Screenshots

Coming soon...

---

## ⚙️ Tools & Platforms Used

| Tool / Platform | Purpose |
|----------------|---------|
| **Antigravity** | AI-powered development assistant |
| **ElectronJS** | Desktop application framework |
| **JavaScript** | Core application logic & game mechanics |
| **HTML & CSS** | UI structure & premium dark RPG styling |
| **GitHub** | Code management & version control |

---

## 🎮 Features

- **4 Character Classes** — Scholar, Coder, Warrior, Monk — each with unique bonuses
- **5 Stats System** — Energy, Intelligence, Strength, Focus, Discipline
- **Daily Quest Board** — Randomly generated quests from a pool of 10
- **Distraction Monsters** — Fight or surrender to random distractions
- **Boss Battles** — Exam mode with preparation-based combat
- **Skill Tree** — 4 unlockable skills that modify gameplay
- **World Map** — 5-zone progression from Beginner Village to Legend Kingdom
- **Level System** — XP-based leveling with stat rewards and skill points
- **Achievements** — Streak tracking, milestone badges
- **Day Summary** — Visual performance report with XP breakdown
- **Auto-Save** — Full localStorage persistence across sessions

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/real-life-rpg.git
cd real-life-rpg

# Install dependencies
npm install

# Run the desktop app
npm start
```

### Development Mode

```bash
npm run dev
```

Opens the app with DevTools for debugging.

---

## 📁 Project Structure

```
real-life-rpg/
├── main.js             # Electron main process
├── index.html          # Single-page app (all screens)
├── package.json        # Dependencies & scripts
├── .gitignore          # Git ignore rules
├── css/
│   └── styles.css      # Full design system & styles
├── js/
│   ├── app.js          # Main app controller
│   ├── gameState.js    # State management + localStorage
│   ├── content.js      # All game text content
│   ├── quests.js       # Quest system
│   ├── combat.js       # Distraction & boss combat
│   └── skillTree.js    # Skill tree logic
└── assets/
    └── (images)
```

---

## 🧮 Game Mechanics

| Mechanic | Formula |
|----------|---------|
| XP to next level | `level × 100` |
| Level-up rewards | +5 INT, +3 FOC, +1 Skill Point |
| Class bonus | Multiplier on category XP (e.g. Scholar: ×1.2 study) |
| Boss threshold | `60 + (level × 5)` — sum of INT + FOC + DISC must exceed |
| Stat cap | 100 per stat |

---

## 📜 License

MIT License — feel free to use and modify.

---

> *"Consistency creates champions."*

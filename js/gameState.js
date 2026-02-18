// ═══════════════════════════════════════════════════════
// Real-Life RPG — Game State Management
// ═══════════════════════════════════════════════════════

const STORAGE_KEY = "realLifeRPG_save";

const DEFAULT_STATE = {
    name: "",
    playerClass: null,
    level: 1,
    xp: 0,
    xpToNext: 100,
    skillPoints: 0,
    stats: {
        energy: 80,
        intelligence: 10,
        strength: 10,
        focus: 10,
        discipline: 10
    },
    skills: {
        studyMastery: false,
        focusShield: false,
        ironDiscipline: false,
        codingGenius: false
    },
    completedQuests: [],
    todayQuests: [],
    todayCompleted: [],
    achievements: [],
    currentZone: 0,
    dayStats: {
        study: 0,
        coding: 0,
        workout: 0,
        focus: 0,
        distractionLoss: 0
    },
    totalXP: 0,
    distractionsDefeated: 0,
    studyStreak: 0,
    lastPlayDate: null,
    bossDefeated: false,
    created: false
};

class GameState {
    constructor() {
        this.state = this.load();
        this.listeners = [];
    }

    // ── Persistence ────────────────────────────────────
    load() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return { ...JSON.parse(JSON.stringify(DEFAULT_STATE)), ...parsed };
            }
        } catch (e) {
            console.warn("Failed to load save:", e);
        }
        return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }

    save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        } catch (e) {
            console.warn("Failed to save:", e);
        }
        this.notify();
    }

    reset() {
        this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        localStorage.removeItem(STORAGE_KEY);
        this.notify();
    }

    // ── Observers ──────────────────────────────────────
    onChange(fn) {
        this.listeners.push(fn);
    }

    notify() {
        this.listeners.forEach(fn => fn(this.state));
    }

    // ── Character Creation ─────────────────────────────
    createCharacter(name, playerClass) {
        this.state.name = name;
        this.state.playerClass = playerClass;
        this.state.created = true;
        this.state.lastPlayDate = new Date().toDateString();

        // Apply class starting bonus
        const classData = CONTENT.classes[playerClass];
        if (classData && classData.bonusStat) {
            this.state.stats[classData.bonusStat] += 5;
        }
        this.save();
    }

    // ── XP & Leveling ─────────────────────────────────
    addXP(amount, category) {
        // Apply class multiplier
        const classData = CONTENT.classes[this.state.playerClass];
        let finalXP = amount;
        if (classData && classData.multiplier && classData.multiplier[category]) {
            finalXP = Math.round(amount * classData.multiplier[category]);
        }

        // Apply skill bonuses
        if (this.state.skills.studyMastery && category === "study") {
            finalXP = Math.round(finalXP * 1.1);
        }
        if (this.state.skills.codingGenius && category === "coding") {
            finalXP = Math.round(finalXP * 1.15);
        }

        this.state.xp += finalXP;
        this.state.totalXP += finalXP;

        // Track day stats
        if (this.state.dayStats[category] !== undefined) {
            this.state.dayStats[category] += finalXP;
        }

        // Check for level up
        let leveledUp = false;
        while (this.state.xp >= this.state.xpToNext) {
            this.state.xp -= this.state.xpToNext;
            this.state.level++;
            this.state.xpToNext = this.state.level * 100;
            this.state.skillPoints++;
            // Level-up stat boosts
            this.state.stats.intelligence += 5;
            this.state.stats.focus += 3;
            leveledUp = true;
        }

        // Update zone based on level
        this.updateZone();
        this.checkAchievements();
        this.save();

        return { xpGained: finalXP, leveledUp };
    }

    // ── Stats ──────────────────────────────────────────
    modifyStat(stat, amount) {
        if (this.state.stats[stat] !== undefined) {
            this.state.stats[stat] = Math.max(0, Math.min(100, this.state.stats[stat] + amount));
            this.save();
        }
    }

    applyStatBoosts(boosts) {
        for (const [stat, value] of Object.entries(boosts)) {
            this.modifyStat(stat, value);
        }
    }

    // ── Quests ─────────────────────────────────────────
    generateDailyQuests() {
        const pool = [...CONTENT.questPool];
        const shuffled = pool.sort(() => Math.random() - 0.5);
        this.state.todayQuests = shuffled.slice(0, 5).map(q => q.id);
        this.state.todayCompleted = [];
        this.save();
    }

    completeQuest(questId) {
        if (this.state.todayCompleted.includes(questId)) return null;

        const quest = CONTENT.questPool.find(q => q.id === questId);
        if (!quest) return null;

        this.state.todayCompleted.push(questId);
        this.state.completedQuests.push(questId);

        // Apply stat boosts
        if (quest.statBoost) {
            this.applyStatBoosts(quest.statBoost);
        }

        // Add XP
        const result = this.addXP(quest.xp, quest.category);
        return result;
    }

    // ── Distraction Combat ─────────────────────────────
    fightDistraction(fled) {
        if (fled) {
            // Player resisted the distraction
            let disciplineGain = 3;
            this.state.distractionsDefeated++;
            this.modifyStat("discipline", disciplineGain);
            this.modifyStat("focus", 1);
            this.checkAchievements();
            this.save();
            return { victory: true, disciplineGain };
        } else {
            // Player gave in
            let energyLoss = 10;
            let focusLoss = 5;

            // Monk class reduces distraction penalties
            const classData = CONTENT.classes[this.state.playerClass];
            if (classData && classData.multiplier && classData.multiplier.distraction) {
                energyLoss = Math.round(energyLoss * classData.multiplier.distraction);
                focusLoss = Math.round(focusLoss * classData.multiplier.distraction);
            }

            // Focus Shield skill
            if (this.state.skills.focusShield) {
                energyLoss = Math.round(energyLoss * 0.7);
                focusLoss = Math.round(focusLoss * 0.7);
            }

            // Iron Discipline skill
            if (this.state.skills.ironDiscipline && energyLoss <= 5) {
                energyLoss = 0;
            }

            this.modifyStat("energy", -energyLoss);
            this.modifyStat("focus", -focusLoss);
            this.state.dayStats.distractionLoss += energyLoss;
            this.save();
            return { victory: false, energyLoss, focusLoss };
        }
    }

    // ── Boss Battle ────────────────────────────────────
    attemptBoss() {
        const preparation = this.state.stats.intelligence + this.state.stats.focus + this.state.stats.discipline;
        const threshold = 60 + (this.state.level * 5);
        const success = preparation >= threshold;

        if (success) {
            this.state.bossDefeated = true;
            this.addXP(200, "study");
            this.modifyStat("intelligence", 10);
            this.modifyStat("discipline", 5);
        } else {
            this.modifyStat("energy", -20);
        }
        this.save();
        return { success, preparation, threshold };
    }

    // ── Skills ─────────────────────────────────────────
    unlockSkill(skillId) {
        const skill = CONTENT.skills[skillId];
        if (!skill) return false;
        if (this.state.skills[skillId]) return false;
        if (this.state.skillPoints < skill.cost) return false;

        this.state.skillPoints -= skill.cost;
        this.state.skills[skillId] = true;
        this.save();
        return true;
    }

    // ── Zone Progression ───────────────────────────────
    updateZone() {
        const zones = CONTENT.zones;
        for (let i = zones.length - 1; i >= 0; i--) {
            if (this.state.level >= zones[i].levelReq) {
                this.state.currentZone = i;
                break;
            }
        }
    }

    // ── Achievements ───────────────────────────────────
    checkAchievements() {
        const earned = this.state.achievements;
        if (!earned.includes("xp100") && this.state.totalXP >= 100) {
            earned.push("xp100");
        }
        if (!earned.includes("distractSlayer") && this.state.distractionsDefeated >= 5) {
            earned.push("distractSlayer");
        }
        if (!earned.includes("codingWarrior") && this.state.completedQuests.filter(q => {
            const quest = CONTENT.questPool.find(qp => qp.id === q);
            return quest && quest.category === "coding";
        }).length >= 5) {
            earned.push("codingWarrior");
        }
        if (!earned.includes("legend") && this.state.level >= 15) {
            earned.push("legend");
        }
    }

    // ── Day Management ─────────────────────────────────
    checkNewDay() {
        const today = new Date().toDateString();
        if (this.state.lastPlayDate !== today) {
            // Reset daily stats
            this.state.dayStats = { study: 0, coding: 0, workout: 0, focus: 0, distractionLoss: 0 };
            this.state.stats.energy = Math.min(100, this.state.stats.energy + 30); // Rest restores energy
            this.state.lastPlayDate = today;
            this.generateDailyQuests();
            this.save();
            return true;
        }
        return false;
    }

    // ── Getters ────────────────────────────────────────
    get isNewPlayer() { return !this.state.created; }
    get xpProgress() { return this.state.xpToNext > 0 ? (this.state.xp / this.state.xpToNext) * 100 : 0; }
}

const gameState = new GameState();

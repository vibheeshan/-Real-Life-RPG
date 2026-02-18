// ═══════════════════════════════════════════════════════
// Real-Life RPG — Combat System (Distractions + Boss)
// ═══════════════════════════════════════════════════════

class CombatSystem {
    constructor(gameState) {
        this.gs = gameState;
    }

    // ── Distraction Monster ────────────────────────────
    getRandomMonster() {
        const names = CONTENT.distraction.monsterNames;
        return names[Math.floor(Math.random() * names.length)];
    }

    flee() {
        return this.gs.fightDistraction(true);
    }

    surrender() {
        return this.gs.fightDistraction(false);
    }

    // ── Boss Battle ────────────────────────────────────
    getBossInfo() {
        const s = this.gs.state.stats;
        const preparation = s.intelligence + s.focus + s.discipline;
        const threshold = 60 + (this.gs.state.level * 5);
        return {
            preparation,
            threshold,
            ready: preparation >= threshold,
            bossHP: 100,
            playerPower: Math.min(100, Math.round((preparation / threshold) * 100))
        };
    }

    attackBoss() {
        return this.gs.attemptBoss();
    }
}

const combatSystem = new CombatSystem(gameState);

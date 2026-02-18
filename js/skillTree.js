// ═══════════════════════════════════════════════════════
// Real-Life RPG — Skill Tree System
// ═══════════════════════════════════════════════════════

class SkillTree {
    constructor(gameState) {
        this.gs = gameState;
    }

    getSkills() {
        return Object.entries(CONTENT.skills).map(([id, skill]) => ({
            id,
            ...skill,
            unlocked: this.gs.state.skills[id] || false,
            canAfford: this.gs.state.skillPoints >= skill.cost
        }));
    }

    unlock(skillId) {
        return this.gs.unlockSkill(skillId);
    }

    get availablePoints() {
        return this.gs.state.skillPoints;
    }
}

const skillTree = new SkillTree(gameState);

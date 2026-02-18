// ═══════════════════════════════════════════════════════
// Real-Life RPG — Quest System
// ═══════════════════════════════════════════════════════

class QuestSystem {
    constructor(gameState) {
        this.gs = gameState;
    }

    getTodayQuests() {
        return this.gs.state.todayQuests.map(id => {
            const quest = CONTENT.questPool.find(q => q.id === id);
            return {
                ...quest,
                completed: this.gs.state.todayCompleted.includes(id)
            };
        });
    }

    completeQuest(questId) {
        return this.gs.completeQuest(questId);
    }

    get completedCount() {
        return this.gs.state.todayCompleted.length;
    }

    get totalCount() {
        return this.gs.state.todayQuests.length;
    }

    get allComplete() {
        return this.completedCount >= this.totalCount && this.totalCount > 0;
    }
}

const questSystem = new QuestSystem(gameState);

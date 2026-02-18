// ═══════════════════════════════════════════════════════
// Real-Life RPG — Main App Controller
// ═══════════════════════════════════════════════════════

class App {
    constructor() {
        this.currentScreen = 'welcome';
        this.screenHistory = [];
        this.selectedClass = null;
        this.init();
    }

    // ── Init ─────────────────────────────────────────────
    init() {
        this.createParticles();
        this.setupWelcome();
        this.buildClassGrid();

        // Listen for state changes
        gameState.onChange(() => this.refreshCurrentScreen());
    }

    // ── Particles ────────────────────────────────────────
    createParticles() {
        const bgLayer = document.getElementById('bg-layer');
        const colors = ['rgba(240,192,64,0.3)', 'rgba(79,143,255,0.25)', 'rgba(165,94,234,0.2)', 'rgba(46,204,113,0.2)'];
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 4 + 1;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            p.style.animationDuration = (Math.random() * 15 + 10) + 's';
            p.style.animationDelay = (Math.random() * 10) + 's';
            bgLayer.appendChild(p);
        }
    }

    // ── Screen Management ────────────────────────────────
    showScreen(name) {
        if (this.currentScreen === name) return;

        // Push to history for back navigation
        this.screenHistory.push(this.currentScreen);

        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => s.classList.remove('active'));

        const target = document.getElementById(name + '-screen');
        if (target) {
            target.classList.add('active');
            this.currentScreen = name;
        }

        // Show/hide back button
        const backBtn = document.getElementById('nav-back');
        if (name === 'welcome' || name === 'creation') {
            backBtn.classList.remove('visible');
        } else if (name === 'dashboard') {
            backBtn.classList.remove('visible');
        } else {
            backBtn.classList.add('visible');
        }

        this.refreshCurrentScreen();
    }

    goBack() {
        if (this.screenHistory.length > 0) {
            const prev = this.screenHistory.pop();
            const screens = document.querySelectorAll('.screen');
            screens.forEach(s => s.classList.remove('active'));
            const target = document.getElementById(prev + '-screen');
            if (target) {
                target.classList.add('active');
                this.currentScreen = prev;
            }
            // Update back button
            if (prev === 'dashboard' || prev === 'welcome' || prev === 'creation') {
                document.getElementById('nav-back').classList.remove('visible');
            }
            this.refreshCurrentScreen();
        }
    }

    refreshCurrentScreen() {
        switch (this.currentScreen) {
            case 'dashboard': this.renderDashboard(); break;
            case 'skilltree': this.renderSkillTree(); break;
            case 'worldmap': this.renderWorldMap(); break;
            case 'boss': this.renderBoss(); break;
            case 'summary': this.renderSummary(); break;
        }
    }

    // ── Welcome Screen ──────────────────────────────────
    setupWelcome() {
        if (!gameState.isNewPlayer) {
            const s = gameState.state;
            document.getElementById('welcome-player-info').style.display = 'flex';
            document.getElementById('welcome-player-name').textContent = s.name + ' — ' + CONTENT.classes[s.playerClass].name;
            document.getElementById('welcome-player-level').textContent = 'Level ' + s.level;
            document.getElementById('welcome-btn').textContent = 'Continue Journey';
        }
    }

    startGame() {
        if (gameState.isNewPlayer) {
            this.showScreen('creation');
        } else {
            gameState.checkNewDay();
            if (gameState.state.todayQuests.length === 0) {
                gameState.generateDailyQuests();
            }
            this.showScreen('dashboard');
        }
    }

    // ── Character Creation ──────────────────────────────
    buildClassGrid() {
        const grid = document.getElementById('class-grid');
        grid.innerHTML = '';
        for (const [id, cls] of Object.entries(CONTENT.classes)) {
            const card = document.createElement('div');
            card.className = 'class-card';
            card.dataset.classId = id;
            card.innerHTML = `
        <span class="class-icon">${cls.icon}</span>
        <div class="class-name">${cls.name}</div>
        <div class="class-quote">"${cls.quote}"</div>
        <div class="class-bonus">${cls.bonus}</div>
      `;
            card.addEventListener('click', () => this.selectClass(id));
            grid.appendChild(card);
        }
    }

    selectClass(classId) {
        this.selectedClass = classId;
        // Update visual selection
        document.querySelectorAll('.class-card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`.class-card[data-class-id="${classId}"]`).classList.add('selected');

        // Enable button
        const btn = document.getElementById('create-btn');
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
    }

    createCharacter() {
        const name = document.getElementById('hero-name').value.trim();
        if (!name) {
            this.showToast('Enter your hero name!', 'warning');
            document.getElementById('hero-name').focus();
            return;
        }
        if (!this.selectedClass) {
            this.showToast('Choose a class!', 'warning');
            return;
        }

        gameState.createCharacter(name, this.selectedClass);
        gameState.generateDailyQuests();
        this.showToast('Hero created! Your journey begins.', 'success');
        setTimeout(() => this.showScreen('dashboard'), 600);
    }

    // ── Dashboard ───────────────────────────────────────
    renderDashboard() {
        const s = gameState.state;
        const cls = CONTENT.classes[s.playerClass];

        // Avatar & meta
        document.getElementById('dash-avatar').textContent = cls ? cls.icon : '⚔️';
        document.getElementById('dash-name').textContent = s.name;
        document.getElementById('dash-level').textContent = 'LVL ' + s.level;
        document.getElementById('dash-xp-fill').style.width = gameState.xpProgress + '%';
        document.getElementById('dash-xp-current').textContent = s.xp + ' XP';
        document.getElementById('dash-xp-next').textContent = s.xpToNext + ' XP';

        // Stats
        this.renderStats();

        // Quests
        this.renderQuests();

        // Motivational message
        const msgs = CONTENT.motivational;
        document.getElementById('motivational-msg').textContent = '"' + msgs[Math.floor(Math.random() * msgs.length)] + '"';
    }

    renderStats() {
        const container = document.getElementById('stats-list');
        container.innerHTML = '';
        const s = gameState.state.stats;

        for (const [key, info] of Object.entries(CONTENT.stats)) {
            const value = s[key] || 0;
            const row = document.createElement('div');
            row.className = 'stat-bar-container';
            row.innerHTML = `
        <span class="stat-icon">${info.icon}</span>
        <span class="stat-label">${info.name}</span>
        <div class="stat-bar-track">
          <div class="stat-bar-fill" style="width: ${value}%; background: ${info.color};"></div>
        </div>
        <span class="stat-value">${value}</span>
      `;
            container.appendChild(row);
        }
    }

    renderQuests() {
        const container = document.getElementById('quest-list');
        container.innerHTML = '';
        const quests = questSystem.getTodayQuests();

        if (quests.length === 0) {
            container.innerHTML = '<p class="subtitle" style="text-align:center; padding: 20px;">No quests yet. Starting a new day…</p>';
            return;
        }

        quests.forEach(q => {
            const item = document.createElement('div');
            item.className = 'quest-item' + (q.completed ? ' completed' : '');
            item.innerHTML = `
        <div class="quest-check">${q.completed ? '✓' : ''}</div>
        <span class="quest-text">${q.text}</span>
        <span class="quest-xp">+${q.xp} XP</span>
      `;
            if (!q.completed) {
                item.addEventListener('click', () => this.completeQuest(q.id));
            }
            container.appendChild(item);
        });
    }

    completeQuest(questId) {
        const result = questSystem.completeQuest(questId);
        if (result) {
            this.showToast(`Quest Complete! +${result.xpGained} XP`, 'xp');
            if (result.leveledUp) {
                setTimeout(() => this.showLevelUp(), 800);
            }
            this.renderDashboard();
        }
    }

    // ── Skill Tree ──────────────────────────────────────
    renderSkillTree() {
        const container = document.getElementById('skill-tree-grid');
        container.innerHTML = '';
        const skills = skillTree.getSkills();

        document.getElementById('skill-points-badge').textContent = skillTree.availablePoints + ' Skill Points';

        skills.forEach(sk => {
            const node = document.createElement('div');
            let stateClass = 'locked';
            if (sk.unlocked) stateClass = 'unlocked';
            else if (sk.canAfford) stateClass = 'affordable';

            node.className = `skill-node ${stateClass}`;
            node.innerHTML = `
        <div class="skill-icon">${sk.icon}</div>
        <div class="skill-name">${sk.name}</div>
        <div class="skill-desc">${sk.desc}</div>
        <div class="skill-cost">${sk.unlocked ? 'Unlocked' : sk.cost + ' point' + (sk.cost > 1 ? 's' : '')}</div>
      `;

            if (!sk.unlocked && sk.canAfford) {
                node.addEventListener('click', () => {
                    if (skillTree.unlock(sk.id)) {
                        this.showToast(`${sk.name} unlocked!`, 'success');
                        this.renderSkillTree();
                    }
                });
            }

            container.appendChild(node);
        });
    }

    // ── World Map ───────────────────────────────────────
    renderWorldMap() {
        const container = document.getElementById('world-map-path');
        container.innerHTML = '';
        const currentZone = gameState.state.currentZone;
        const playerLevel = gameState.state.level;

        CONTENT.zones.forEach((zone, i) => {
            const node = document.createElement('div');
            let stateClass = '';
            if (i === currentZone) stateClass = 'current';
            else if (i < currentZone) stateClass = 'completed';
            else stateClass = 'locked';

            node.className = `zone-node ${stateClass}`;
            node.innerHTML = `
        <div class="zone-icon-wrap">${zone.icon}</div>
        <div class="zone-info">
          <div class="zone-name">${zone.name}</div>
          <div class="zone-desc">${zone.desc}</div>
          <div class="zone-level-req">Requires Level ${zone.levelReq}${playerLevel >= zone.levelReq ? ' ✓' : ''}</div>
        </div>
      `;
            container.appendChild(node);
        });
    }

    // ── Boss Battle ─────────────────────────────────────
    renderBoss() {
        const info = combatSystem.getBossInfo();
        document.getElementById('boss-player-power').textContent = info.playerPower;
        document.getElementById('boss-hp-text').textContent = info.bossHP;
        document.getElementById('boss-readiness').textContent = info.ready ? 'READY' : 'NOT READY';
        document.getElementById('boss-readiness').style.color = info.ready ? 'var(--emerald)' : 'var(--crimson)';
        document.getElementById('boss-hp-fill').style.width = '100%';

        // Reset result area
        document.getElementById('boss-result-area').innerHTML = '';
        document.getElementById('battle-actions').style.display = 'flex';

        // If already defeated, show that
        if (gameState.state.bossDefeated) {
            document.getElementById('battle-actions').style.display = 'none';
            document.getElementById('boss-result-area').innerHTML = `
        <div class="glass-card" style="text-align: center; margin-top: var(--space-lg);">
          <p style="font-size: 1.2rem; color: var(--emerald); font-weight: 700;">🏆 Boss Already Defeated!</p>
          <p class="subtitle" style="margin-top: var(--space-sm);">You have proven your strength.</p>
        </div>
      `;
        }
    }

    attackBoss() {
        const result = combatSystem.attackBoss();

        // Animate HP bar
        if (result.success) {
            document.getElementById('boss-hp-fill').style.width = '0%';
        }

        // Show result after animation
        setTimeout(() => {
            document.getElementById('battle-actions').style.display = 'none';
            const area = document.getElementById('boss-result-area');

            if (result.success) {
                area.innerHTML = `
          <div class="glass-card glass-card-gold" style="text-align: center; margin-top: var(--space-lg); animation: scaleIn 0.5s ease;">
            <h2 class="heading-2" style="margin-bottom: var(--space-sm);">🏆 Victory!</h2>
            <p style="color: var(--emerald); font-size: 1.1rem; font-weight: 600;">${CONTENT.boss.victory}</p>
            <p class="subtitle" style="margin-top: var(--space-sm);">+200 XP, +10 Intelligence, +5 Discipline</p>
            <button class="btn-primary" style="margin-top: var(--space-lg);" onclick="app.showScreen('dashboard')">Return</button>
          </div>
        `;
                this.showToast('Boss Defeated! +200 XP', 'xp');
            } else {
                area.innerHTML = `
          <div class="glass-card" style="text-align: center; margin-top: var(--space-lg); border-color: rgba(255,71,87,0.3); animation: scaleIn 0.5s ease;">
            <h2 class="heading-2" style="color: var(--crimson); margin-bottom: var(--space-sm);">💀 Defeat</h2>
            <p style="color: var(--text-secondary); font-size: 1rem;">${CONTENT.boss.notPrepared}</p>
            <p class="subtitle" style="margin-top: var(--space-sm); color: var(--crimson);">-20 Energy</p>
            <button class="btn-secondary" style="margin-top: var(--space-lg);" onclick="app.showScreen('dashboard')">Retreat</button>
          </div>
        `;
                this.showToast('Boss overpowered you!', 'warning');
            }
        }, 1200);
    }

    // ── Day Summary ─────────────────────────────────────
    renderSummary() {
        const ds = gameState.state.dayStats;
        const total = ds.study + ds.coding + ds.workout + ds.focus;

        // Chart
        const chart = document.getElementById('summary-chart');
        const categories = [
            { label: 'Study', value: ds.study, color: 'var(--blue)' },
            { label: 'Coding', value: ds.coding, color: 'var(--purple)' },
            { label: 'Workout', value: ds.workout, color: 'var(--emerald)' },
            { label: 'Focus', value: ds.focus, color: 'var(--gold)' }
        ];

        const maxVal = Math.max(...categories.map(c => c.value), 1);
        chart.innerHTML = categories.map(c => `
      <div class="chart-bar-wrap">
        <div class="chart-bar-value">${c.value}</div>
        <div class="chart-bar" style="height: ${Math.max((c.value / maxVal) * 80, 4)}px; background: ${c.color};"></div>
        <div class="chart-bar-label">${c.label}</div>
      </div>
    `).join('');

        // Breakdown
        const breakdown = document.getElementById('summary-breakdown');
        breakdown.innerHTML = `
      <div class="summary-row">
        <span class="category">📚 Study</span>
        <span class="xp-value positive">+${ds.study} XP</span>
      </div>
      <div class="summary-row">
        <span class="category">💻 Coding</span>
        <span class="xp-value positive">+${ds.coding} XP</span>
      </div>
      <div class="summary-row">
        <span class="category">💪 Workout</span>
        <span class="xp-value positive">+${ds.workout} XP</span>
      </div>
      <div class="summary-row">
        <span class="category">🎯 Focus</span>
        <span class="xp-value positive">+${ds.focus} XP</span>
      </div>
      <div class="summary-row">
        <span class="category">👹 Distraction Loss</span>
        <span class="xp-value negative">-${ds.distractionLoss} Energy</span>
      </div>
      <div class="summary-row" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: var(--space-md); margin-top: var(--space-sm);">
        <span class="category" style="color: var(--gold); font-weight: 700;">⭐ Total XP Today</span>
        <span class="xp-value positive" style="font-size: 1.1rem;">+${total} XP</span>
      </div>
    `;

        // Update message
        document.getElementById('summary-msg').textContent = `You gained ${total} XP today.`;
    }

    // ── Distraction System ──────────────────────────────
    triggerDistraction() {
        const monsterName = combatSystem.getRandomMonster();
        document.getElementById('monster-name').textContent = monsterName;
        document.getElementById('distraction-overlay').classList.add('active');
        this.showToast(CONTENT.soundCues.monsterAppear, 'warning');
    }

    fleeDistraction() {
        const result = combatSystem.flee();
        document.getElementById('distraction-overlay').classList.remove('active');
        this.showToast(`${CONTENT.distraction.victory} +${result.disciplineGain} Discipline`, 'success');
        this.renderDashboard();
    }

    surrenderDistraction() {
        const result = combatSystem.surrender();
        document.getElementById('distraction-overlay').classList.remove('active');
        this.showToast(`${CONTENT.distraction.defeat} -${result.energyLoss} Energy`, 'warning');
        this.renderDashboard();
    }

    // ── Level Up Overlay ────────────────────────────────
    showLevelUp() {
        document.getElementById('levelup-level').textContent = 'Level ' + gameState.state.level;
        document.getElementById('levelup-overlay').classList.add('active');
        this.showToast(CONTENT.soundCues.levelUp, 'xp');
    }

    dismissLevelUp() {
        document.getElementById('levelup-overlay').classList.remove('active');
        this.renderDashboard();
    }

    // ── Toast System ────────────────────────────────────
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // ── Reset ───────────────────────────────────────────
    resetGame() {
        if (confirm('Reset all progress? This cannot be undone.')) {
            gameState.reset();
            this.selectedClass = null;
            // Reset creation form
            document.getElementById('hero-name').value = '';
            document.querySelectorAll('.class-card').forEach(c => c.classList.remove('selected'));
            const btn = document.getElementById('create-btn');
            btn.style.opacity = '0.4';
            btn.style.pointerEvents = 'none';
            // Reset welcome
            document.getElementById('welcome-player-info').style.display = 'none';
            document.getElementById('welcome-btn').textContent = 'Enter Game Mode';
            // Go to welcome
            this.screenHistory = [];
            const screens = document.querySelectorAll('.screen');
            screens.forEach(s => s.classList.remove('active'));
            document.getElementById('welcome-screen').classList.add('active');
            this.currentScreen = 'welcome';
            document.getElementById('nav-back').classList.remove('visible');
            this.showToast('Game reset.', 'warning');
        }
    }
}

// ── Initialize ──────────────────────────────────────────
const app = new App();

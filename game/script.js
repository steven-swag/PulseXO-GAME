/**
 * Neon Tic-Tac-Toe - Complete Game Logic
 * Features: PvP, PvC (3 difficulties), Scoreboard, localStorage, Sound, Animations
 */

// ============================================
// GAME STATE & CONFIGURATION
// ============================================
const GameState = {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    gameMode: 'pvp', // 'pvp' or 'pvc'
    difficulty: 'medium', // 'easy', 'medium', 'hard'
    scores: { X: 0, O: 0, draws: 0 },
    gameActive: false,
    isComputerTurn: false,
    soundEnabled: true,
    musicEnabled: false,
    animationsEnabled: true,
    winningCombination: null
};

// Winning combinations
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// DOM Elements
const elements = {
    screens: {
        start: document.getElementById('start-screen'),
        game: document.getElementById('game-screen'),
        gameOver: document.getElementById('game-over-screen'),
        settings: document.getElementById('settings-panel')
    },
    modeBtns: document.querySelectorAll('.mode-btn'),
    difficultyBtns: document.querySelectorAll('.difficulty-btn'),
    difficultySelection: document.getElementById('difficulty-selection'),
    cells: document.querySelectorAll('.cell'),
    gameBoard: document.getElementById('game-board'),
    winningLine: document.getElementById('winning-line'),
    turnPlayer: document.getElementById('turn-player'),
    modeIndicator: document.getElementById('mode-indicator'),
    xWins: document.getElementById('x-wins'),
    oWins: document.getElementById('o-wins'),
    draws: document.getElementById('draws'),
    restartBtn: document.getElementById('restart-btn'),
    newGameBtn: document.getElementById('new-game-btn'),
    playAgainBtn: document.getElementById('play-again-btn'),
    mainMenuBtn: document.getElementById('main-menu-btn'),
    backBtn: document.getElementById('back-btn'),
    settingsBtn: document.getElementById('settings-btn'),
    closeSettings: document.getElementById('close-settings'),
    soundToggle: document.getElementById('sound-toggle'),
    musicToggle: document.getElementById('music-toggle'),
    animationsToggle: document.getElementById('animations-toggle'),
    gameOverTitle: document.getElementById('game-over-title'),
    gameOverMessage: document.getElementById('game-over-message'),
    finalScores: document.getElementById('final-scores'),
    resultAnimation: document.getElementById('result-animation'),
    clickSound: document.getElementById('click-sound'),
    winSound: document.getElementById('win-sound'),
    drawSound: document.getElementById('draw-sound')
};

// ============================================
// SOUND SYSTEM
// ============================================
const SoundSystem = {
    context: null,
    masterVolume: 0.3,

    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    },

    playTone(frequency, duration, type = 'sine', volume = 0.1, delay = 0) {
        if (!GameState.soundEnabled || !this.context) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.context.currentTime + delay);

        gainNode.gain.setValueAtTime(0, this.context.currentTime + delay);
        gainNode.gain.linearRampToValueAtTime(volume * this.masterVolume, this.context.currentTime + delay + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + delay + duration);

        oscillator.start(this.context.currentTime + delay);
        oscillator.stop(this.context.currentTime + delay + duration);
    },

    playClick() {
        this.playTone(800, 0.1, 'square', 0.08);
        this.playTone(1000, 0.05, 'square', 0.04, 0.05);
    },

    playWin() {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((note, i) => {
            this.playTone(note, 0.2, 'sine', 0.1, i * 0.1);
        });
        // Final chord
        setTimeout(() => {
            [523.25, 659.25, 783.99].forEach(note => {
                this.playTone(note, 0.5, 'sine', 0.08, 0);
            });
        }, 400);
    },

    playDraw() {
        this.playTone(300, 0.3, 'sawtooth', 0.06);
        this.playTone(250, 0.3, 'sawtooth', 0.06, 0.15);
        this.playTone(200, 0.4, 'sawtooth', 0.06, 0.3);
    },

    playHover() {
        this.playTone(1200, 0.03, 'sine', 0.02);
    },

    playError() {
        this.playTone(200, 0.15, 'square', 0.08);
        this.playTone(150, 0.15, 'square', 0.08, 0.05);
    },

    resumeContext() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }
};

// ============================================
// PARTICLE SYSTEM (Win Celebration)
// ============================================
const ParticleSystem = {
    colors: ['#00d4ff', '#b300ff', '#ff006e', '#00ff88', '#ff6b00', '#ffffff'],

    createBurst(x, y, count = 30) {
        if (!GameState.animationsEnabled) return;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const velocity = 100 + Math.random() * 150;
            const size = 6 + Math.random() * 10;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];

            particle.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
                --tx: ${Math.cos(angle) * velocity}px;
                --ty: ${Math.sin(angle) * velocity}px;
            `;

            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(var(--tx), var(--ty)) scale(0)`, opacity: 0 }
            ], {
                duration: 800 + Math.random() * 400,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => particle.remove();

            document.body.appendChild(particle);
        }
    }
};

// ============================================
// AI SYSTEM (3 Difficulty Levels)
// ============================================
const AI = {
    // Easy: Random moves
    getEasyMove(board) {
        const available = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
        return available[Math.floor(Math.random() * available.length)];
    },

    // Medium: Block wins, take wins, otherwise random
    getMediumMove(board) {
        // Check for winning move
        const winMove = this.findWinningMove(board, 'O');
        if (winMove !== -1) return winMove;

        // Block player's winning move
        const blockMove = this.findWinningMove(board, 'X');
        if (blockMove !== -1) return blockMove;

        // Take center if available
        if (board[4] === null) return 4;

        // Take corners
        const corners = [0, 2, 6, 8].filter(i => board[i] === null);
        if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

        // Take edges
        const edges = [1, 3, 5, 7].filter(i => board[i] === null);
        return edges[Math.floor(Math.random() * edges.length)];
    },

    // Hard: Minimax algorithm (unbeatable)
    getHardMove(board) {
        let bestScore = -Infinity;
        let bestMove = -1;

        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                const score = this.minimax(board, 0, false, -Infinity, Infinity);
                board[i] = null;

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    },

    minimax(board, depth, isMaximizing, alpha, beta) {
        const winner = this.checkWinner(board);
        if (winner === 'O') return 10 - depth;
        if (winner === 'X') return depth - 10;
        if (board.every(cell => cell !== null)) return 0;

        if (isMaximizing) {
            let maxScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = 'O';
                    const score = this.minimax(board, depth + 1, false, alpha, beta);
                    board[i] = null;
                    maxScore = Math.max(maxScore, score);
                    alpha = Math.max(alpha, score);
                    if (beta <= alpha) break;
                }
            }
            return maxScore;
        } else {
            let minScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = 'X';
                    const score = this.minimax(board, depth + 1, true, alpha, beta);
                    board[i] = null;
                    minScore = Math.min(minScore, score);
                    beta = Math.min(beta, score);
                    if (beta <= alpha) break;
                }
            }
            return minScore;
        }
    },

    findWinningMove(board, player) {
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = player;
                const isWin = this.checkWinner(board) === player;
                board[i] = null;
                if (isWin) return i;
            }
        }
        return -1;
    },

    checkWinner(board) {
        for (const combo of WINNING_COMBINATIONS) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    },

    getMove(board) {
        switch (GameState.difficulty) {
            case 'easy': return this.getEasyMove(board);
            case 'medium': return this.getMediumMove(board);
            case 'hard': return this.getHardMove(board);
            default: return this.getMediumMove(board);
        }
    }
};

// ============================================
// STORAGE SYSTEM
// ============================================
const Storage = {
    KEY: 'neon-tic-tac-toe-scores',

    load() {
        try {
            const data = localStorage.getItem(this.KEY);
            if (data) {
                const parsed = JSON.parse(data);
                GameState.scores = { ...GameState.scores, ...parsed.scores };
                GameState.soundEnabled = parsed.soundEnabled !== false;
                GameState.musicEnabled = parsed.musicEnabled === true;
                GameState.animationsEnabled = parsed.animationsEnabled !== false;
                GameState.difficulty = parsed.difficulty || 'medium';

                // Update UI toggles
                elements.soundToggle.checked = GameState.soundEnabled;
                elements.musicToggle.checked = GameState.musicEnabled;
                elements.animationsToggle.checked = GameState.animationsEnabled;
            }
        } catch (e) {
            console.warn('Failed to load settings:', e);
        }
        this.updateScoreDisplay();
    },

    save() {
        try {
            const data = {
                scores: GameState.scores,
                soundEnabled: GameState.soundEnabled,
                musicEnabled: GameState.musicEnabled,
                animationsEnabled: GameState.animationsEnabled,
                difficulty: GameState.difficulty
            };
            localStorage.setItem(this.KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save settings:', e);
        }
    },

    updateScoreDisplay() {
        elements.xWins.textContent = GameState.scores.X;
        elements.oWins.textContent = GameState.scores.O;
        elements.draws.textContent = GameState.scores.draws;
    }
};

// ============================================
// UI MANAGEMENT
// ============================================
const UI = {
    showScreen(screenName) {
        Object.values(elements.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        elements.screens[screenName].classList.add('active');
    },

    showSettings() {
        elements.settings.classList.add('visible');
    },

    hideSettings() {
        elements.settings.classList.remove('visible');
    },

    updateTurnDisplay() {
        elements.turnPlayer.textContent = GameState.currentPlayer;
        elements.turnPlayer.className = 'turn-player ' + GameState.currentPlayer.toLowerCase();
    },

    updateModeIndicator() {
        const modeText = GameState.gameMode === 'pvp' ? 'Player vs Player' : `Player vs Computer (${GameState.difficulty.charAt(0).toUpperCase() + GameState.difficulty.slice(1)})`;
        elements.modeIndicator.textContent = modeText;
    },

    renderBoard() {
        elements.cells.forEach((cell, index) => {
            const value = GameState.board[index];
            cell.textContent = value || '';
            cell.className = 'cell';
            if (value) {
                cell.classList.add(value.toLowerCase(), 'occupied');
                if (GameState.animationsEnabled) {
                    cell.style.animation = 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    setTimeout(() => cell.style.animation = '', 300);
                }
            } else {
                cell.classList.remove('occupied');
            }
        });
    },

    highlightWinningCells(combination) {
        combination.forEach(index => {
            elements.cells[index].classList.add('winning');
        });
    },

    showWinningLine(combination) {
        const line = elements.winningLine;
        const cellRect = elements.cells[0].getBoundingClientRect();
        const boardRect = elements.gameBoard.getBoundingClientRect();

        // Calculate line position based on combination
        const positions = this.getLinePosition(combination, cellRect, boardRect);
        line.style.width = `${positions.length}px`;
        line.style.left = `${positions.x}px`;
        line.style.top = `${positions.y}px`;
        line.style.transform = `rotate(${positions.angle}deg)`;
        line.classList.add('visible');
    },

    getLinePosition(combination, cellRect, boardRect) {
        const cellSize = cellRect.width;
        const gap = 8; // CSS gap
        const centers = combination.map(i => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            return {
                x: col * (cellSize + gap) + cellSize / 2,
                y: row * (cellSize + gap) + cellSize / 2
            };
        });

        const start = centers[0];
        const end = centers[2];
        const length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) + cellSize;
        const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
        const x = start.x - cellSize / 2;
        const y = start.y - 2; // Center vertically on cell

        return { x, y, length, angle };
    },

    hideWinningLine() {
        elements.winningLine.classList.remove('visible');
        elements.winningLine.style.width = '0';
    },

    clearWinningHighlight() {
        elements.cells.forEach(cell => cell.classList.remove('winning'));
    },

    showGameOver(winner) {
        this.hideWinningLine();
        this.clearWinningHighlight();

        const resultAnim = elements.resultAnimation;
        resultAnim.className = 'result-animation';

        if (winner === 'draw') {
            elements.gameOverTitle.textContent = "It's a Draw!";
            elements.gameOverMessage.textContent = "Great game! Neither player could secure victory.";
            resultAnim.classList.add('draw');
            SoundSystem.playDraw();
        } else {
            elements.gameOverTitle.textContent = `Player ${winner} Wins!`;
            elements.gameOverMessage.textContent = `Congratulations! Player ${winner} claimed victory!`;
            resultAnim.classList.add('win');
            SoundSystem.playWin();

            // Particle burst from center of board
            const boardRect = elements.gameBoard.getBoundingClientRect();
            ParticleSystem.createBurst(
                boardRect.left + boardRect.width / 2,
                boardRect.top + boardRect.height / 2,
                40
            );
        }

        // Update final scores
        elements.finalScores.innerHTML = `
            <div class="final-score-item">
                <span class="final-score-label">Player X</span>
                <span class="final-score-value x">${GameState.scores.X}</span>
            </div>
            <div class="final-score-item">
                <span class="final-score-label">Draws</span>
                <span class="final-score-value draw">${GameState.scores.draws}</span>
            </div>
            <div class="final-score-item">
                <span class="final-score-label">Player O</span>
                <span class="final-score-value o">${GameState.scores.O}</span>
            </div>
        `;

        setTimeout(() => {
            this.showScreen('gameOver');
        }, 500);
    },

    setCellHover(index, player) {
        if (GameState.board[index] === null && GameState.gameActive && !GameState.isComputerTurn) {
            elements.cells[index].textContent = player;
            elements.cells[index].classList.add('hover-preview');
            elements.cells[index].style.color = player === 'X' ? 'rgba(0, 212, 255, 0.3)' : 'rgba(255, 0, 110, 0.3)';
        }
    },

    clearCellHover(index) {
        if (GameState.board[index] === null) {
            elements.cells[index].textContent = '';
            elements.cells[index].classList.remove('hover-preview');
            elements.cells[index].style.color = '';
        }
    }
};

// ============================================
// GAME LOGIC
// ============================================
const Game = {
    init() {
        SoundSystem.init();
        Storage.load();
        this.bindEvents();
        this.resetGame();
        UI.showScreen('start');
    },

    bindEvents() {
        // Mode selection
        elements.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.selectMode(btn.dataset.mode));
            btn.addEventListener('mouseenter', () => SoundSystem.playHover());
        });

        // Difficulty selection
        elements.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => this.selectDifficulty(btn.dataset.difficulty));
            btn.addEventListener('mouseenter', () => SoundSystem.playHover());
        });

        // Cell clicks
        elements.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
            cell.addEventListener('mouseenter', () => this.handleCellHover(index, true));
            cell.addEventListener('mouseleave', () => this.handleCellHover(index, false));
            cell.addEventListener('focus', () => this.handleCellHover(index, true));
            cell.addEventListener('blur', () => this.handleCellHover(index, false));
        });

        // Control buttons
        elements.restartBtn.addEventListener('click', () => this.restartGame());
        elements.newGameBtn.addEventListener('click', () => UI.showScreen('start'));
        elements.playAgainBtn.addEventListener('click', () => this.restartGame());
        elements.mainMenuBtn.addEventListener('click', () => UI.showScreen('start'));
        elements.backBtn.addEventListener('click', () => UI.showScreen('start'));

        // Settings
        elements.settingsBtn.addEventListener('click', () => UI.showSettings());
        elements.closeSettings.addEventListener('click', () => UI.hideSettings());

        // Settings toggles
        elements.soundToggle.addEventListener('change', (e) => {
            GameState.soundEnabled = e.target.checked;
            Storage.save();
            if (GameState.soundEnabled) SoundSystem.playClick();
        });

        elements.musicToggle.addEventListener('change', (e) => {
            GameState.musicEnabled = e.target.checked;
            Storage.save();
        });

        elements.animationsToggle.addEventListener('change', (e) => {
            GameState.animationsEnabled = e.target.checked;
            Storage.save();
        });

        // Close settings on outside click
        elements.settings.addEventListener('click', (e) => {
            if (e.target === elements.settings) UI.hideSettings();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));

        // Resume audio context on user interaction
        document.addEventListener('click', () => SoundSystem.resumeContext(), { once: true });
        document.addEventListener('keydown', () => SoundSystem.resumeContext(), { once: true });
    },

    handleKeydown(e) {
        if (!GameState.gameActive || GameState.isComputerTurn) return;

        const keyMap = {
            '1': 0, '2': 1, '3': 2,
            '4': 3, '5': 4, '6': 5,
            '7': 6, '8': 7, '9': 8,
            'ArrowUp': -3, 'ArrowDown': 3,
            'ArrowLeft': -1, 'ArrowRight': 1,
            'Enter': 'select', ' ': 'select'
        };

        const focusedCell = document.activeElement;
        const cellIndex = Array.from(elements.cells).indexOf(focusedCell);

        if (keyMap[e.key] !== undefined) {
            e.preventDefault();
            if (typeof keyMap[e.key] === 'number') {
                let newIndex;
                if (e.key >= '1' && e.key <= '9') {
                    newIndex = keyMap[e.key];
                } else if (cellIndex >= 0) {
                    newIndex = cellIndex + keyMap[e.key];
                    // Handle grid wrapping
                    const row = Math.floor(cellIndex / 3);
                    const col = cellIndex % 3;
                    if (e.key === 'ArrowLeft') newIndex = row * 3 + (col - 1 + 3) % 3;
                    if (e.key === 'ArrowRight') newIndex = row * 3 + (col + 1) % 3;
                    if (e.key === 'ArrowUp') newIndex = ((row - 1 + 3) % 3) * 3 + col;
                    if (e.key === 'ArrowDown') newIndex = ((row + 1) % 3) * 3 + col;
                }
                if (newIndex >= 0 && newIndex < 9) {
                    elements.cells[newIndex].focus();
                }
            } else if (keyMap[e.key] === 'select' && cellIndex >= 0) {
                this.handleCellClick(cellIndex);
            }
        }

        if (e.key === 'Escape') {
            UI.hideSettings();
            if (elements.screens.game.classList.contains('active')) {
                UI.showScreen('start');
            }
        }

        if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            this.restartGame();
        }
    },

    handleCellHover(index, isHover) {
        if (GameState.board[index] === null && GameState.gameActive && !GameState.isComputerTurn) {
            if (isHover) {
                UI.setCellHover(index, GameState.currentPlayer);
            } else {
                UI.clearCellHover(index);
            }
        }
    },

    selectMode(mode) {
        GameState.gameMode = mode;
        SoundSystem.playClick();

        if (mode === 'pvc') {
            elements.difficultySelection.classList.remove('hidden');
            elements.difficultySelection.style.animation = 'slideInUp 0.4s ease-out';
        } else {
            elements.difficultySelection.classList.add('hidden');
            this.startGame();
        }
    },

    selectDifficulty(difficulty) {
        GameState.difficulty = difficulty;
        SoundSystem.playClick();

        // Update button states
        elements.difficultyBtns.forEach(btn => {
            btn.style.borderColor = btn.dataset.difficulty === difficulty ? 'var(--neon-purple)' : 'var(--border-color)';
            btn.style.boxShadow = btn.dataset.difficulty === difficulty ? 'var(--glow-purple)' : 'none';
        });

        Storage.save();
        this.startGame();
    },

    startGame() {
        this.resetGame();
        UI.updateModeIndicator();
        UI.showScreen('game');
    },

    resetGame() {
        GameState.board = Array(9).fill(null);
        GameState.currentPlayer = 'X';
        GameState.gameActive = true;
        GameState.isComputerTurn = false;
        GameState.winningCombination = null;

        UI.renderBoard();
        UI.updateTurnDisplay();
        UI.hideWinningLine();
        UI.clearWinningHighlight();
        UI.showScreen('game');

        // If PvC and computer is O, make first move after a delay
        if (GameState.gameMode === 'pvc' && GameState.currentPlayer === 'O') {
            GameState.isComputerTurn = true;
            setTimeout(() => this.makeComputerMove(), 800);
        }
    },

    restartGame() {
        SoundSystem.playClick();
        this.resetGame();
    },

    handleCellClick(index) {
        if (!GameState.gameActive || GameState.board[index] !== null || GameState.isComputerTurn) {
            if (GameState.board[index] !== null) SoundSystem.playError();
            return;
        }

        this.makeMove(index);

        // Check for win/draw
        if (this.checkGameEnd()) return;

        // Switch player
        GameState.currentPlayer = GameState.currentPlayer === 'X' ? 'O' : 'X';
        UI.updateTurnDisplay();

        // Computer's turn in PvC mode
        if (GameState.gameMode === 'pvc' && GameState.currentPlayer === 'O' && GameState.gameActive) {
            GameState.isComputerTurn = true;
            setTimeout(() => this.makeComputerMove(), 600 + Math.random() * 400);
        }
    },

    makeMove(index) {
        GameState.board[index] = GameState.currentPlayer;
        UI.renderBoard();
        SoundSystem.playClick();
    },

    makeComputerMove() {
        if (!GameState.gameActive) return;

        const move = AI.getMove(GameState.board);
        if (move !== -1) {
            this.makeMove(move);

            if (this.checkGameEnd()) return;

            GameState.currentPlayer = 'X';
            GameState.isComputerTurn = false;
            UI.updateTurnDisplay();
        }
    },

    checkGameEnd() {
        const winner = this.checkWinner();
        if (winner) {
            GameState.gameActive = false;
            GameState.winningCombination = winner.combination;
            GameState.scores[winner.player]++;
            Storage.updateScoreDisplay();
            Storage.save();
            UI.highlightWinningCells(winner.combination);
            UI.showWinningLine(winner.combination);
            UI.showGameOver(winner.player);
            return true;
        }

        if (GameState.board.every(cell => cell !== null)) {
            GameState.gameActive = false;
            GameState.scores.draws++;
            Storage.updateScoreDisplay();
            Storage.save();
            UI.showGameOver('draw');
            return true;
        }

        return false;
    },

    checkWinner() {
        for (const combination of WINNING_COMBINATIONS) {
            const [a, b, c] = combination;
            if (GameState.board[a] && GameState.board[a] === GameState.board[b] && GameState.board[a] === GameState.board[c]) {
                return { player: GameState.board[a], combination };
            }
        }
        return null;
    }
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});

// Handle visibility change to pause/resume
document.addEventListener('visibilitychange', () => {
    if (document.hidden && SoundSystem.context) {
        SoundSystem.context.suspend();
    } else if (SoundSystem.context) {
        SoundSystem.resumeContext();
    }
});

// Export for debugging (optional)
window.NeonTicTacToe = { Game, GameState, AI, SoundSystem, ParticleSystem, Storage, UI };
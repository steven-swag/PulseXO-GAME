# Neon Tic-Tac-Toe 🎮

A modern, beautiful Tic-Tac-Toe game with a dark neon gaming theme. Built with vanilla HTML, CSS, and JavaScript — no frameworks required!

## ✨ Features

### Core Gameplay
- **3×3 Interactive Board** - Smooth, responsive grid with hover effects
- **Two Game Modes:**
  - **Player vs Player** - Local multiplayer on the same device
  - **Player vs Computer** - Battle against AI with 3 difficulty levels
- **Win Detection** - Automatically detects all 8 winning combinations
- **Draw Detection** - Recognizes when the board is full with no winner
- **Winning Highlight** - Winning line animates across the winning cells
- **Turn Indicator** - Clear display of whose turn it is (X or O)
- **Scoreboard** - Tracks X wins, O wins, and draws persistently

### AI Difficulty Levels
| Difficulty | Description | Strategy |
|------------|-------------|----------|
| 😊 **Easy** | Random moves | Pure randomness - good for beginners |
| 😎 **Medium** | Smart moves | Blocks wins, takes wins, prefers center/corners |
| 🧠 **Hard** | Unbeatable | Minimax algorithm with alpha-beta pruning |

### Visual & Audio Polish
- **Dark Gaming Theme** - Deep blacks with neon blue/purple/pink accents
- **Smooth Animations** - Scale-in, slide-up, glow pulses, particle bursts
- **Sound Effects** - Web Audio API generated tones (click, win, draw, hover)
- **Neon Glow Effects** - Dynamic shadows and flickering text
- **Animated Background** - Subtle grid pattern with radial gradients
- **Particle Celebration** - Burst effect on victory

### Quality of Life
- **Settings Panel** - Toggle sound, music, and animations
- **localStorage Persistence** - Scores and settings survive browser restarts
- **Start Screen & Game Over Screen** - Polished UI flow
- **Restart / New Game Buttons** - Quick reset options
- **Keyboard Navigation** - Full keyboard support (1-9, arrows, Enter)
- **Accessibility** - ARIA labels, focus states, reduced motion support
- **Responsive Design** - Works on mobile, tablet, and desktop

## 🚀 How to Run

### Option 1: Double-Click (Easiest)
1. Navigate to the `game` folder in File Explorer
2. Double-click `index.html`
3. The game opens in your default browser

### Option 2: VS Code Live Server (Recommended)
1. Open the `game` folder in VS Code
2. Install the "Live Server" extension if you haven't
3. Right-click `index.html` → "Open with Live Server"
4. Game opens at `http://127.0.0.1:5500` with auto-reload on changes

### Option 3: Any HTTP Server
```bash
# Python 3
cd game
python -m http.server 8000

# Node.js (http-server)
npx http-server game

# PHP
php -S localhost:8000 -t game
```
Then open `http://localhost:8000` in your browser.

> **Note:** Opening `index.html` directly via `file://` protocol works for this game since it doesn't use ES modules or fetch requests. However, a local server is recommended for best compatibility.

## 🎮 How to Play

### Player vs Player
1. Click **"Player vs Player"** on the start screen
2. Players take turns clicking empty cells
3. First to get 3 in a row (horizontal, vertical, diagonal) wins!
4. Click **"Restart Game"** to play again, or **"New Game"** to change modes

### Player vs Computer
1. Click **"Player vs Computer"**
2. Select difficulty: **Easy**, **Medium**, or **Hard**
3. You play as **X**, computer plays as **O**
4. Try to beat the AI! (Hard mode is mathematically unbeatable)

### Keyboard Controls
| Key | Action |
|-----|--------|
| `1`-`9` | Select cell (numpad layout) |
| `Arrow Keys` | Navigate between cells |
| `Enter` / `Space` | Place mark on focused cell |
| `Escape` | Return to main menu / Close settings |
| `Ctrl+R` | Restart current game |

### Settings
Click the **⚙️ Settings** button on the start screen to toggle:
- **Sound Effects** - Click, win, draw, and hover sounds
- **Background Music** - (Placeholder for future music)
- **Animations** - Disable for reduced motion preference

## 📁 Project Structure

```
game/
├── index.html      # Main HTML structure
├── style.css       # Complete styling (dark neon theme, animations)
├── script.js       # Game logic (state, AI, sound, particles, storage)
└── README.md       # This file
```

## 🛠 Technical Details

### No Dependencies
- Pure vanilla JavaScript (ES6+)
- No build step required
- No external libraries or CDN links
- Works offline after first load

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome for Android)

### Key Algorithms
- **Minimax with Alpha-Beta Pruning** - Optimal AI for Hard difficulty
- **Web Audio API** - Procedural sound generation (no audio files needed)
- **CSS Custom Properties** - Easy theming via CSS variables
- **localStorage API** - Persistent settings and scores

### Performance
- ~15KB total (HTML + CSS + JS)
- 60fps animations via CSS transforms
- Minimal DOM manipulation
- Efficient event delegation

## 🎨 Customization

### Colors (CSS Variables in `style.css`)
```css
:root {
    --neon-blue: #00d4ff;
    --neon-purple: #b300ff;
    --neon-pink: #ff006e;
    --neon-green: #00ff88;
    --neon-orange: #ff6b00;
    --bg-primary: #0a0a12;
    /* ... more variables */
}
```

### AI Difficulty Tuning
Modify `AI.getMediumMove()` in `script.js` to adjust Medium behavior.

### Sound Frequencies
Adjust `SoundSystem.playTone()` parameters in `script.js` for different sound profiles.

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No sound | Click anywhere on page first (browser autoplay policy) |
| Animations lag | Disable animations in Settings |
| Scores not saving | Enable localStorage in browser settings |
| Layout broken | Hard refresh (Ctrl+Shift+R) or clear cache |
| Keyboard not working | Click the game board first to focus |

## 📄 License

MIT License - Feel free to use, modify, and distribute!

## 🤝 Credits

Built with ❤️ using vanilla web technologies.
Inspired by classic Tic-Tac-Toe with a modern neon aesthetic.

---

**Enjoy the game!** 🎮✨
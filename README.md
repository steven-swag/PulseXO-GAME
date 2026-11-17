<img width="732" height="882" alt="image" src="https://github.com/user-attachments/assets/9666f09a-4812-4db9-a9ce-d0677d04dd50" />
<img width="1133" height="775" alt="Screenshot 2026-11-17 205220" src="https://github.com/user-attachments/assets/1cca0507-2b1c-4058-9b6c-4ad30baad4f5" />
<img width="767" height="886" alt="Screenshot 2026-11-17 205233" src="https://github.com/user-attachments/assets/8c09a688-9054-4a7e-847c-185938f6a732" />


# NetPulse Devices API 🎮

A multi-purpose repository containing the **NetPulse Devices API** and a **Neon Tic-Tac-Toe** game built with vanilla web technologies.

---

## 📦 Project Structure

```
netpulse-devices-api/
├── game/                    # Neon Tic-Tac-Toe Game
│   ├── index.html           # Main HTML structure
│   ├── style.css            # Complete styling (dark neon theme, animations)
│   ├── script.js            # Game logic (state, AI, sound, particles, storage)
│   └── README.md            # Game-specific documentation
└── README.md                # This file
```

---

## 🎮 Neon Tic-Tac-Toe Game

A modern, beautiful Tic-Tac-Toe game with a dark neon gaming theme. Built with vanilla HTML, CSS, and JavaScript — no frameworks required!

### ✨ Features

- **Two Game Modes**: Player vs Player & Player vs Computer
- **3 AI Difficulty Levels**: Easy (random), Medium (smart), Hard (unbeatable Minimax)
- **Dark Neon Theme**: Deep blacks with neon blue/purple/pink accents
- **Sound Effects**: Web Audio API generated tones (no audio files needed)
- **Particle Celebrations**: Burst effects on victory
- **Persistent Scores**: localStorage saves scores & settings
- **Full Keyboard Support**: Play entirely with keyboard (1-9, arrows, Enter)
- **Accessibility**: ARIA labels, focus states, reduced motion support
- **Responsive Design**: Works on mobile, tablet, and desktop

### 🚀 Quick Start

```bash
# Navigate to game directory
cd game

# Option 1: Double-click index.html in File Explorer

# Option 2: VS Code Live Server (recommended)
# Right-click index.html → "Open with Live Server"

# Option 3: Any HTTP server
python -m http.server 8000
# Then open http://localhost:8000/game
```

### 📖 Full Game Documentation

See **[game/README.md](game/README.md)** for comprehensive documentation including:
- Detailed feature breakdown
- AI algorithm explanations
- Customization guide (colors, sounds, AI tuning)
- Troubleshooting table
- Technical architecture

---

## 🔧 Development

### Game Development Stack
- **HTML5** - Semantic structure with accessibility attributes
- **CSS3** - Custom properties, Grid/Flexbox, animations, media queries
- **Vanilla JavaScript (ES6+)** - Modules pattern, Web Audio API, localStorage

### Key Algorithms
- **Minimax with Alpha-Beta Pruning** - Optimal AI for Hard difficulty
- **Web Audio API** - Procedural sound synthesis
- **CSS Custom Properties** - Dynamic theming

### Performance
- ~15KB total (HTML + CSS + JS)
- 60fps animations via CSS transforms
- No dependencies, no build step
- Works offline after first load

---

## 📄 License

MIT License - Feel free to use, modify, and distribute!

---

## 🤝 Credits

Built with ❤️ using vanilla web technologies.

**Game**: Neon Tic-Tac-Toe — Classic gameplay with a modern neon aesthetic.  
**API**: NetPulse Devices — (Documentation coming soon)

---

*Last updated: November 2026*

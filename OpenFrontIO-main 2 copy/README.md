# DOMINION.IO 🎖️

> The greatest free browser strategy game ever made. Conquer territory, forge empires, command armies across history. No download. No login. No cost. Forever.

A fork of [OpenFront.io](https://github.com/openfrontio/OpenFrontIO) — rebuilt and massively expanded into a full military grand strategy experience for any browser.

---

## Play Now

```
npm run dev
```

Open `http://localhost:9000` — no account required.

---

## Features

### Core Gameplay
- **Real-time territorial conquest** on historically accurate world maps (Europe, Asia, Americas, Africa, World)
- **Deterministic simulation** — the game logic runs identically on every client, guaranteed by a seeded PRNG and no floating-point math
- **Authoritative multiplayer** via WebSocket intents relayed through a Node.js server
- **500+ player games** on large maps

### Unit System
| Unit | Role | Cost |
|------|------|------|
| Infantry | Cheap, fast, general purpose | 1x |
| Tank | High attack, slow | 3x |
| Artillery | Ranged (2-tile), immobile when firing | 3x |
| Scout | 2x movement, extended fog reveal | 1.5x |
| Sniper | High-value target elimination | 2x |
| Medic | Heals nearby allies each tick | 1.5x |
| Engineer | Builds fortifications and supply hubs | 2x |
| Warship | Naval combat and bombardment | 5x |
| Trade Ship | Generates Gold on trade routes | 2x |

### Game Modes
| Mode | Description | Win Condition |
|------|-------------|---------------|
| Classic Conquest | Standard territorial warfare | Control 80% of map |
| Team Domination | 2–4 auto-assigned teams | Team controls 70% |
| Blitz | 3x resources, 5-minute max | Most territory at time limit |
| Cold War | Two superpower factions, nuclear escalation | Opponent eliminated or détente timer |

### Economy
Three resource types drive every decision:
- **Production** — built by factories and ports, used to train units
- **Gold** — from trade routes and cities, funds research and diplomacy
- **Energy** — from power plants, required to sustain advanced units

### Tech Tree
Research one technology at a time:
- Improved Logistics, Armored Division, Artillery Corps
- Intelligence Network, Steel Fortress, Naval Dominance
- Nuclear Program, Air Superiority

### Diplomacy
- **Ceasefire** — temporary peace with 10-tick break warning
- **Alliance** — shared border defense
- **Vassal Pact** — tribute in exchange for protection
- Betrayal tracking: breaking ceasefire earns a **Warmonger** badge visible to all players

### Special Abilities
| Ability | Effect | Cooldown |
|---------|--------|----------|
| Blitz | All troops 2x speed for 15s | 3 min |
| Fortify | +100% defense for 30s | 2 min |
| Air Strike | Area damage on target tile | 4 min |
| Propaganda | Convert 1 border tile instantly | 5 min |
| Spy | Reveal enemy resource count for 60s | 6 min |

### HOI4-Inspired Systems
- **National Focus Tree** — 13 strategic goals across Military, Industrial, Diplomatic, and Political branches
- **Military Doctrine** — choose one pre-game doctrine that shapes your entire playstyle (Mass Assault, Superior Firepower, Mobile Warfare, Grand Battle Plan)
- **Supply Lines** — territory more than 8 hops from your capital fights at reduced efficiency; Engineers build Supply Hubs to extend reach
- **War Goals** — secretly assigned territory objectives granting +500 Gold and permanent income bonus when captured
- **Political Power** — passive resource spent on Emergency Decrees, Ideology declaration, and Demand Surrender
- **Air Power** — build Air Wings and assign missions: Air Superiority, Strategic Bombing, Close Air Support, or Recon
- **Intelligence & Espionage** — recruit Agents to steal blueprints, sabotage factories, or attempt coups
- **World Events** — random mid-game events that force choices: Economic Crash, Arms Race, Rebel Uprising, Golden Age, Epidemic

### Flags & Cosmetics
- **400+ flags** organized by era: Ancient BC → Classical → Medieval → Early Modern → Colonial → World Wars → Cold War → Modern → Fantasy
- **Territory color themes** — 15 color variants from Olive Green to Dragon Black
- **All free, always** — no purchases, no lock icons, no premium tier

### Solo Play
- **5 AI difficulty tiers** — Recruit → Regular → Veteran → Elite → Legendary
- **20-mission historical campaign** across 5 acts: Ancient World, Medieval Struggle, Age of Empires, World at War, Cold War & Beyond
- **Skirmish mode** — fully configurable: map, bot count, difficulty mix, game mode, starting resources, special rules
- **Interactive tutorial** — 8 chapters teaching every system through guided play

### Multiplayer
- Skill-based matchmaking
- Private lobbies with 6-digit share codes
- Spectator mode for any public game
- Quick-phrase communication (no typing required)
- 60-second reconnection grace period with AI holdover
- Full game replay with timeline scrubber and share links

---

## Quick Start

```bash
git clone https://github.com/your-org/dominion-io
cd dominion-io
npm ci --ignore-scripts
npm run dev
```

Client at `http://localhost:9000`. Server runs automatically at `localhost:3000`.

---

## Development Commands

```bash
npm run dev              # Client + server with hot reload
npm run start:client     # Client only
npm run start:server-dev # Server only
npm test                 # Run all tests (Vitest)
npm run test:coverage    # Tests with coverage report
npm run lint             # ESLint
npm run lint:fix         # ESLint auto-fix
npm run format           # Prettier
npm run build-prod       # Production build
```

Run a single test file:
```bash
npx vitest NationAllianceBehavior --run
```

---

## Architecture

```
src/
├── core/          # Deterministic game simulation (MIT)
│   ├── execution/ # Intent → Execution pipeline
│   ├── game/      # Game state (GameImpl, Player, Tile)
│   ├── abilities/ # Special ability definitions
│   └── *.ts       # TechTree, GameMode, NationalFocus, Doctrine, etc.
├── client/        # Rendering (Pixi.js/WebGL) + UI (Lit + Tailwind)
└── server/        # WebSocket relay, lobby, leaderboard (Node.js)
```

**Simulation flow:**
```
Player action → Intent → Server relays to all clients
→ ExecutionManager creates Execution objects
→ executeNextTick() mutates game state
→ GameUpdates → client renders
```

The `src/core/` simulation is 100% deterministic. No `Math.random()`, no `Date.now()`. Uses a seeded PRNG throughout.

---

## Deployment

### Frontend — Vercel

```bash
vercel --prod
```

Required secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

Environment variables:
```
VITE_API_DOMAIN=api.dominion.io
VITE_WS_DOMAIN=api.dominion.io
VITE_GAME_NAME=Dominion.io
```

### Backend — Railway

```bash
railway up
```

Required secret: `RAILWAY_TOKEN`

Environment variables:
```
GAME_ENV=production
PORT=8080
MAX_PLAYERS_PER_GAME=500
MAX_CONCURRENT_GAMES=20
```

### Docker

```bash
docker build -t dominion-server .
docker run -p 8080:8080 dominion-server
```

### CI/CD

GitHub Actions automatically runs lint + tests on every PR, and deploys to Vercel + Railway on merge to `main`. See [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

---

## Contributing

1. Fork the repo
2. `npm ci --ignore-scripts`
3. Make your changes in a feature branch
4. All `src/core/` changes must have tests
5. Run `npm run lint && npm test` before opening a PR
6. Keep the game 100% free — no monetization, no purchases, no premium

---

## License

**AGPL-3.0** — see [LICENSE](LICENSE)

This project is a fork of OpenFront.io. Modifications are made under the same AGPL-3.0 license. The original OpenFront.io contributors built the foundation that made Dominion.io possible.

---

## Credits

**Dominion.io** is based on **OpenFront.io** — https://github.com/openfrontio/OpenFrontIO

OpenFront.io contributors built the core game engine, map system, WebSocket multiplayer infrastructure, and deterministic simulation architecture that powers this game.

Dominion.io adds: military doctrine, national focus trees, supply lines, air power, espionage, world events, historical flags, campaign missions, skirmish mode, advanced diplomacy, and a completely ad-free, purchase-free experience.

---

*Free to play. Free forever.*

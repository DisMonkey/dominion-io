# 🎮 CODEX MASTER PROMPT — Dominion.io
### A Next-Level Fork of OpenFrontIO | Built for VS Code Codex

---

## 🧠 WHO YOU ARE & WHAT YOU'RE DOING

You are an expert full-stack game developer working inside a fork of the open-source browser RTS game **OpenFrontIO** (https://github.com/openfrontio/OpenFrontIO). The game is written in **TypeScript**, uses **Vite** for bundling, runs a **WebSocket-based** multiplayer server, and renders using an **HTML5 Canvas** pipeline.

You are transforming this fork into a new game called **Dominion.io** — a military-themed, massively multiplayer real-time strategy game that runs in any browser with zero downloads. The goal is to make this the most polished, addictive, and replayable `.io` strategy game on the internet, drawing inspiration from the best mechanics across multiple titles.

Your changes must be **surgical, complete, and production-quality**. Do not leave half-finished code. Every file you touch should be better than when you found it.

---

## 📁 CODEBASE STRUCTURE (Know This Before You Touch Anything)

```
OpenFrontIO/
├── src/
│   ├── client/              # Frontend game client (GPL v3)
│   │   ├── rendering/       # Canvas rendering pipeline
│   │   ├── ui/              # HUD, menus, overlays
│   │   └── workers/         # Web workers for heavy computation
│   ├── core/                # Shared deterministic game logic (MIT)
│   │   ├── intents/         # Player action definitions
│   │   ├── executions/      # How intents are processed each tick
│   │   └── entities/        # Game objects (players, tiles, units, etc.)
│   └── server/              # Backend WebSocket server (MIT)
│       ├── lobby/           # Matchmaking and room management
│       └── game/            # Server-side game loop
├── resources/               # Maps, images, sounds, static assets
├── tests/                   # Unit + integration tests
├── map-generator/           # Go-based map generator
├── package.json
├── vite.config.ts
├── tsconfig.json
└── eslint.config.js
```

**Tech Stack:**
- Language: TypeScript 5.7+
- Bundler: Vite
- Server: Node.js with WebSockets
- Rendering: HTML5 Canvas (2D)
- Maps: Real-world geography (Europe, Asia, Africa, Americas, World)
- Dev: `npm run dev` → client at http://localhost:9000

---

## PHASE 1 — COMPLETE REBRAND TO DOMINION.IO

### 1.1 — Global String Replacement

Perform a **project-wide find & replace** for ALL of the following. Be case-sensitive and handle all variations:

| Find | Replace With |
|---|---|
| `OpenFront` | `Dominion` |
| `openfront` | `dominion` |
| `OPENFRONT` | `DOMINION` |
| `OpenFront.io` | `Dominion.io` |
| `openfront.io` | `dominion.io` |
| `api.openfront.io` | `api.dominion.io` |
| `api.openfront.dev` | `api.dominion.dev` |
| `OpenFrontIO` | `DominionIO` |
| `openfrontio` | `dominionio` |

**Files that MUST be updated:**
- `package.json` — name, description, homepage
- `README.md` — full rewrite (see Phase 5)
- `vite.config.ts` — any app name references
- `src/client/ui/` — ALL UI text, titles, headers, tooltips
- `src/server/` — server name, logs, API endpoints
- `src/core/` — any string constants referencing the game name
- `resources/` — rename any OpenFront-branded image filenames
- `index.html` — title tag, meta tags, OG tags
- `.env.example` — update API domain variables
- Any `LICENSE` or attribution notices — **keep** the "Based on OpenFront" attribution as required by AGPL-3.0, but present it as: *"Dominion.io is based on OpenFront.io — https://github.com/openfrontio/OpenFrontIO"* in the game's credits screen, not the main UI.

### 1.2 — New Visual Identity

Create a new military-themed visual identity:

**Color Palette:**
```css
--primary:     #C8973A;  /* Military gold / brass */
--secondary:   #1C2B1E;  /* Dark tactical green */
--accent:      #D64045;  /* Command red */
--bg-dark:     #0D1117;  /* Deep black-green */
--bg-panel:    #161D22;  /* Panel background */
--text-light:  #E8E0D0;  /* Parchment white */
--text-muted:  #7A8A7A;  /* Faded tactical */
--border:      #2E3D2E;  /* Subtle border */
```

**Typography:**
- Headings: `'Rajdhani'` or `'Orbitron'` (military/tech feel) — load from Google Fonts
- Body: `'Share Tech Mono'` or `'Roboto Condensed'`
- HUD numbers: Monospace for clean stat display

**Logo / Title Treatment:**
- Update the main menu title to render **"DOMINION"** in large tracked caps
- Add a subtle animated scanline or grain texture overlay to the main menu background
- Replace any OpenFront favicon with a new one: a simple shield or crosshair SVG rendered to 32x32 and 192x192

Create the favicon at `resources/favicon.svg` and `resources/favicon-192.png`.

---

## PHASE 2 — GAMEPLAY ENHANCEMENTS

> Draw inspiration from: **Agar.io, Territorial.io, Risk, Civilization VI, StarCraft II, Age of Empires II, and Hearts of Iron IV (HOI4)**. The goal is a game with the accessibility of .io games but the strategic depth of classic RTS/4X/grand strategy titles.

### 2.1 — New Unit Types (inspired by StarCraft + Age of Empires)

Extend `src/core/entities/` to add new unit types beyond the base troop. Each unit must have:
- A defined `UnitType` enum entry
- Attack power, defense modifier, movement speed, and cost
- Proper serialization for the deterministic game loop

**New Units to Add:**

```typescript
// Add to src/core/entities/UnitTypes.ts (create if not exists)

export enum UnitType {
  Infantry   = "infantry",    // Existing base unit — cheap, fast, weak
  Tank       = "tank",        // High attack, slow, costs 3x infantry
  Artillery  = "artillery",   // Ranged — attacks 2 tiles away, immobile when firing
  Scout      = "scout",       // 2x movement speed, reveals fog of war radius
  Sniper     = "sniper",      // Eliminates single high-value target, long cooldown
  Medic      = "medic",       // Heals nearby allied units each tick
  Engineer   = "engineer",    // Builds fortifications and bridges on water tiles
}
```

Integrate these into `src/core/executions/` so they function in the game loop. Each unit type needs its own execution logic file.

### 2.2 — Fog of War System (inspired by StarCraft)

Add a **Fog of War** mechanic to `src/core/` and render it in `src/client/rendering/`:

- Each player starts with vision only around their own territory + 2-tile radius
- Scout units have a 5-tile vision radius
- Revealed tiles remain visible but "fade" if no unit is nearby (last-seen state)
- Enemies in fog are hidden — their tile color shows as neutral until scouted
- Add a `FogOfWarSystem` class in `src/core/` that calculates per-player visibility each tick
- In `src/client/rendering/`, apply a semi-transparent dark overlay (rgba 0,0,0,0.6) to fog tiles

### 2.3 — Tech Tree (inspired by Civilization VI)

Add a lightweight research system:

Create `src/core/TechTree.ts`:

```typescript
export enum Tech {
  ImprovedLogistics   = "improved_logistics",   // +15% troop movement speed
  ArmoredDivision     = "armored_division",      // Unlocks Tank unit
  ArtilleryCorps      = "artillery_corps",       // Unlocks Artillery unit
  IntelligenceNetwork = "intelligence_network",  // Fog of War reveals enemy economy
  SteelFortress       = "steel_fortress",        // Wall defense +50%
  NavalDominance      = "naval_dominance",       // Warships deal 2x damage to trade ships
  NuclearProgram      = "nuclear_program",       // Requires: ArmoredDivision + SteelFortress
  AirSuperperiority   = "air_superiority",       // New air strike ability (area damage)
}
```

- Each tech costs a flat resource amount and takes N game ticks to research
- Players can only research one tech at a time
- Add a collapsible **Tech Panel** to the HUD in `src/client/ui/TechPanel.ts`
- Tech choices are broadcast as a new `ResearchIntent` to the server

### 2.4 — Diplomacy System (inspired by Risk + Civilization)

Enhance the existing alliance system:

- **Alliances** already exist — extend them with typed agreement levels:
  - `Ceasefire` — no attacks for N ticks, either side can break with 10-tick warning
  - `Alliance` — existing behavior (shared border defense)
  - `Vassal Pact` — smaller player pays resource tribute to larger for protection
- Add a **Diplomacy Modal** in `src/client/ui/DiplomacyModal.ts`
- Add betrayal tracking: breaking a ceasefire gives you a `Warmonger` badge visible to all players for the rest of the match — other players see this and are less likely to ally with you
- Add a **Global Events ticker** at the top of the screen announcing major diplomatic events: "⚔️ Germany declared war on France" / "🤝 Brazil and India formed an alliance"

### 2.5 — Economy Overhaul (inspired by Age of Empires)

Extend the existing trade/economic system:

- Add **3 resource types** alongside existing territory income:
  - 🏭 **Production** — generated by industrial tiles (factories, ports). Used to build units.
  - 💰 **Gold** — generated by trade routes and cities. Used to research tech and bribe.
  - ⚡ **Energy** — generated by power plant structures. Required to maintain advanced units.
- Add resource icons and counters to the HUD bar in `src/client/ui/ResourceBar.ts`
- Tile capture now grants the resource type of that tile (cities = gold, industrial = production)
- Players who run out of Energy see their Tank and Artillery units go dormant

### 2.6 — Special Abilities (inspired by Agar.io power-ups + StarCraft abilities)

Add player-triggered special abilities with cooldowns. Create `src/core/abilities/`:

| Ability | Effect | Cooldown | Cost |
|---|---|---|---|
| **Blitz** | All troops move 2x speed for 15 seconds | 3 min | 500 Gold |
| **Fortify** | Selected territory gains +100% defense for 30 seconds | 2 min | 300 Gold |
| **Air Strike** | Deals damage to a targeted tile and 1-tile radius | 4 min | 800 Gold |
| **Propaganda** | Converts 1 neutral or weakly-held border tile instantly | 5 min | 1000 Gold |
| **Spy** | Reveals one enemy player's full resource count for 60 seconds | 6 min | 400 Gold |

- Render ability buttons in a horizontal bar at the bottom of the HUD
- Each button shows an icon, name, and cooldown timer ring animation
- Abilities are broadcast as new `AbilityIntent` types to the server

### 2.7 — Battle Animations & Visual Feedback

In `src/client/rendering/`:

- When territory is captured, add a brief **flash animation** (0.3s color pulse from attacker color → tile color)
- When a nuke hits, add a **shockwave ring** expanding from the impact point with a glow effect
- Add **troop movement arrows** — faint animated dashes showing active attack directions
- Add **floating damage numbers** that pop up when territory changes hands (e.g. "+12 troops lost")
- Add subtle **particle effects** on major events (alliance formed = gold sparkle, war declared = red burst)

---

## PHASE 3 — NEW GAME MODES

Add game mode selection to the lobby. Create `src/core/GameMode.ts`:

### Mode 1: Classic Conquest (existing behavior, polished)
- Win condition: control 80% of the map
- All maps available

### Mode 2: Team Domination (NEW — inspired by Risk teams)
- Players are auto-sorted into 2–4 teams at game start
- Team colors are assigned (red team, blue team, etc.)
- Win condition: your team controls 70% of the map
- Alliances within teams are permanent and cannot be broken
- Add team chat separate from global chat

### Mode 3: Blitz (NEW — inspired by Agar.io speed)
- 5-minute maximum match time
- All resources generate 3x faster
- Units move 1.5x faster
- Win condition: most territory at time limit
- Maps: small maps only (British Isles, Japan, etc.)

### Mode 4: Cold War (NEW — inspired by Terratomic + Civilization)
- 2 superpower factions (chosen at lobby: East vs West)
- Nuclear escalation mechanic: nukes do progressively more damage the more are launched
- Win condition: opponent faction eliminated OR have most territory when "détente" timer expires
- Proxy wars: neutral AI nations that can be influenced by either faction

Add mode selection UI to `src/client/ui/LobbyScreen.ts` with mode cards, descriptions, and player count indicators.

---

## PHASE 4 — UI / UX OVERHAUL

### 4.1 — Main Menu
Redesign `src/client/ui/MainMenu.ts`:
- Full-screen animated background: a slowly panning zoomed-out world map with subtle territory color shifts simulating a live game
- Large centered **DOMINION.IO** logo with military gold color and slight text glow
- Buttons: **PLAY NOW**, **GAME MODES**, **HOW TO PLAY**, **LEADERBOARD**, **SETTINGS**
- Bottom bar: player count online (fetched from server), version number, Discord link

### 4.2 — HUD (Heads-Up Display)
Redesign the in-game HUD in `src/client/ui/`:
- **Top bar**: Territory %, Population, Gold, Production, Energy — all with icons and animated count-up
- **Bottom bar**: Ability buttons (Phase 2.6) + minimap toggle
- **Left panel** (collapsible): Tech Tree (Phase 2.3)
- **Right panel** (collapsible): Alliance/Diplomacy list (Phase 2.4) + live leaderboard of top 5 players
- **Global events ticker**: scrolling text at top edge (Phase 2.4)
- All panels use `backdrop-filter: blur(8px)` glass morphism style with military-green tint

### 4.3 — End Game Screen
Redesign the post-game screen:
- Show final map state frozen as a screenshot
- Winner announcement with large animated text
- Stats breakdown: tiles captured, troops lost, alliances formed, nukes launched, techs researched
- **"Play Again"** and **"Share Result"** buttons
- Share generates a URL with a game replay ID

### 4.4 — Settings Panel
Add a proper settings modal:
- Graphics: Particle effects toggle, animation quality (Low/Medium/High), color blind mode
- Audio: Master volume, SFX volume, Music volume (if music is added)
- Gameplay: Show damage numbers toggle, fog of war toggle (for custom games)
- Controls: Key binding display

### 4.5 — Mobile Responsiveness
Ensure the game is playable on mobile:
- Touch controls: tap to select territory, swipe to pan, pinch to zoom
- HUD panels auto-collapse on screens < 768px
- Ability bar shows 3 abilities max on mobile with a "more" button

---

## PHASE 5 — AUDIO

Create `src/client/audio/AudioManager.ts`:

- Use the **Web Audio API** (no external dependencies needed)
- Add sound effects for:
  - Territory capture (short military drum hit)
  - Nuke launch (deep bass rumble + distant explosion)
  - Alliance formed (triumphant short chord)
  - War declared (tense stinger)
  - Tech researched (soft positive chime)
  - Ability activated (tactical click/beep)
- Background music: a procedurally generated tension loop using oscillators (no files needed)
- All audio respects the Settings volume sliders

---

## PHASE 6 — PERFORMANCE OPTIMIZATIONS

In `src/client/rendering/`:

- Implement **dirty rectangle rendering** — only re-draw tiles that changed since last frame, not the full canvas every tick
- Add **viewport culling** — skip rendering tiles outside the visible screen area + 1-tile buffer
- Use **OffscreenCanvas** for background layers (terrain, water) so they only render once until zoomed
- Debounce UI updates to max 30fps even if game loop runs faster
- Add a **performance monitor** (dev mode only): FPS counter, render time, tile count in `src/client/ui/PerfMonitor.ts`

In `src/server/`:

- Add **server-side rate limiting** per client for intent submissions (max 10 intents/second per player)
- Add **binary message compression** for WebSocket payloads (use `pako` for gzip)
- Add **server health endpoint** at `GET /health` returning `{ status: "ok", players: N, games: N }`

---

## PHASE 7 — DEPLOYMENT SETUP (Vercel + Railway)

### 7.1 — Vercel (Frontend)

Create `vercel.json` in the project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "env": {
    "VITE_API_DOMAIN": "your-backend.railway.app",
    "VITE_WS_DOMAIN": "your-backend.railway.app"
  }
}
```

Update `vite.config.ts` to use `process.env.VITE_API_DOMAIN` for all API calls instead of hardcoded URLs.

### 7.2 — Railway (Backend WebSocket Server)

Create `railway.json` in the project root:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:server",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

Create `Dockerfile` for the server:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build:server
EXPOSE 8080
CMD ["npm", "run", "start:server"]
```

### 7.3 — Environment Variables

Create `.env.example`:

```
# Backend
GAME_ENV=production
PORT=8080
MAX_PLAYERS_PER_GAME=500
MAX_CONCURRENT_GAMES=20

# Frontend (Vite — must prefix with VITE_)
VITE_API_DOMAIN=api.dominion.io
VITE_WS_DOMAIN=api.dominion.io
VITE_GAME_NAME=Dominion.io
VITE_VERSION=1.0.0
```

### 7.4 — GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Dominion.io

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci --ignore-scripts
      - run: npm run lint
      - run: npm test

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci --ignore-scripts
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## PHASE 8 — LEADERBOARD & PLAYER PROFILES

### 8.1 — Persistent Leaderboard

Create `src/server/leaderboard/LeaderboardService.ts`:
- Track: wins, games played, total territory captured, nukes launched, win rate
- Store in a simple JSON file (`leaderboard.json`) if no DB is available, or add SQLite via `better-sqlite3`
- Expose `GET /leaderboard?limit=50` endpoint
- Update on every game end

### 8.2 — Player Stats UI

Add a **Leaderboard screen** accessible from the main menu:
- Table: Rank, Player Name, Wins, Win Rate, Favorite Map
- Highlight the current player's row
- Refresh button + auto-refresh every 30 seconds

---

## PHASE 9 — NEW README.md

Replace the entire README with this structure (write it fully):

```markdown
# DOMINION.IO 🎖️

> The next evolution of browser-based real-time strategy. Conquer, dominate, and outlast every rival.

A fork of [OpenFront.io](https://github.com/openfrontio/OpenFrontIO) — rebuilt and expanded into a fully-featured military strategy experience.

## Features
[List all Phase 1-8 features]

## Quick Start
[Clone, npm install, npm run dev]

## Deployment
[Vercel + Railway instructions]

## License
[AGPL-3.0 with attribution — "Based on OpenFront.io"]

## Credits
[OpenFront contributors, then Dominion.io contributors]
```

---

## PHASE 10 — HEARTS OF IRON IV (HOI4) INSPIRED SYSTEMS

> HOI4 is the gold standard of grand military strategy. It turns war into a deeply layered system of politics, production, doctrine, and battlefield command. Bring its best ideas into Dominion.io in a browser-friendly, accessible way.

### 10.1 — National Focus Tree (HOI4's most iconic feature)

Create `src/core/NationalFocus.ts`:

Each player gets a **National Focus Tree** — a branching decision tree of strategic goals they can pursue throughout the match. Only one focus can be active at a time. Focuses take real time (game ticks) to complete and grant permanent bonuses or unlock new options.

```typescript
export enum NationalFocus {
  // Military Branch
  MilitaryExpansion      = "military_expansion",      // +10% unit production speed
  ArmedForcesAct         = "armed_forces_act",        // Unlocks 2 additional unit slots
  EliteForces            = "elite_forces",            // Infantry gains +20% attack power
  BlitzkriegDoctrine     = "blitzkrieg_doctrine",     // Tanks move 50% faster (requires ArmedForcesAct)
  
  // Industrial Branch  
  FiveYearPlan           = "five_year_plan",          // +25% Production resource generation
  WarEconomy             = "war_economy",             // Convert Gold → Production at 2:1 rate
  SyntheticFuel          = "synthetic_fuel",          // Never run out of Energy (self-sufficient)
  
  // Diplomatic Branch
  GreatPowerStatus       = "great_power_status",      // Other players see you as a major power — fewer attacks
  NonAggressionPact      = "non_aggression_pact",     // Automatically proposes ceasefire to top 3 neighbors
  CoalitionBuilder       = "coalition_builder",       // Alliance cap raised from 3 to 6 players
  
  // Political Branch
  TotalMobilization      = "total_mobilization",      // All territory generates +30% income, but Energy doubles
  PropagandaMinistry     = "propaganda_ministry",     // Propaganda ability cooldown halved
  SecretPolice           = "secret_police",           // Reveals all spies targeting you
}
```

- Focuses are organized in a **tree UI panel** in `src/client/ui/NationalFocusPanel.ts`
- The panel shows a branching diagram — completed focuses glow gold, active focus pulses, locked ones are dimmed
- Each focus takes between 60–300 game ticks to complete depending on power level
- Players can see each other's **completed** focuses (military intelligence)
- Abandoned focuses can be restarted but cost an extra 20% time penalty

### 10.2 — Military Doctrine System (HOI4-inspired)

Create `src/core/Doctrine.ts`:

At game start, each player chooses ONE doctrine that defines their playstyle. This cannot be changed mid-game — it's a commitment.

```typescript
export enum MilitaryDoctrine {
  MassAssault = "mass_assault",
  // Cheap infantry, large armies, overwhelming numbers
  // Effect: Infantry costs 30% less Production. Max army size +50%. Individual unit strength -15%.

  SuperiorFirepower = "superior_firepower",
  // Elite units with overwhelming damage
  // Effect: All units deal +25% damage. Unit costs +40%. Artillery range +1 tile.

  MobileWarfare = "mobile_warfare",
  // Fast strikes, deep penetration, encirclement
  // Effect: All units move +30% faster. Tank cost reduced 20%. Blitz ability cooldown -1 min.

  GrandBattlePlan = "grand_battle_plan",
  // Slow but unstoppable — planned offensives
  // Effect: Attacking a tile you've been adjacent to for 30+ ticks deals +50% damage.
  // Fortified tiles you hold gain +75% defense.
}
```

- Doctrine selection happens on a **pre-game screen** before the match begins, shown as 4 cards with flavor text, pros, and cons
- Create `src/client/ui/DoctrineSelectionScreen.ts`
- The chosen doctrine is stored on the player entity and applied as modifiers in `src/core/executions/`
- Other players can **see your doctrine** after you've made 10+ attacks (intelligence reveal)

### 10.3 — Supply Lines & Logistics (HOI4's supply system, simplified)

Create `src/core/SupplySystem.ts`:

In HOI4, armies cut off from supply lines wither and die. Add a lightweight version:

- Every player has a **Capital tile** (their starting territory center)
- Tiles more than 8 hops from the capital via connected friendly territory are considered **oversupplied** at 100%, tapering to **undersupplied** at 50% efficiency at 15+ hops
- Undersupplied tiles: units there fight at reduced power, production is slower
- **Supply Hub** structure: Engineers can build supply hubs that act as local supply centers, resetting the hop count from that point
- The supply network is visualized as faint dotted lines on the map (toggleable in settings)
- If your capital is captured, ALL your territory goes into supply crisis for 30 ticks — a massive emergency mechanic

### 10.4 — War Goals & Victory Points (HOI4-inspired objectives)

Create `src/core/WarGoals.ts`:

Instead of just "capture 80% of the map," add optional **War Goals** — specific territorial objectives that grant bonus Victory Points when achieved:

- At game start, each player is secretly assigned 3 **War Goal tiles** (shown only to them, highlighted on their map)
- Capturing a War Goal tile grants +500 Gold instantly and a permanent +5% income bonus
- War Goals are revealed to all players if you capture them (announcing your ambitions)
- Add a **War Goals tracker** in the HUD showing your progress: `🎯 War Goals: 1/3 captured`
- In Team mode, War Goals are shared objectives for the whole team

### 10.5 — Political Power & Government (HOI4 Political System, simplified)

Create `src/core/PoliticalSystem.ts`:

Add a **Political Power (PP)** resource that generates passively (+1 PP every 5 ticks):

PP is spent on:

| Action | Cost | Effect |
|---|---|---|
| Start National Focus | 25 PP | Begin researching a focus |
| Emergency Decree | 50 PP | Instantly draft 200 troops |
| Form Government in Exile | 75 PP | If eliminated, spectate and support an ally with resource boosts |
| Demand Surrender | 100 PP | Force a player with <5% territory to concede without fighting |
| Declare Ideology | 0 PP | Tag yourself as Democratic / Fascist / Communist — affects who allies with you |

- Add PP counter to the HUD resource bar alongside Gold, Production, Energy
- **Ideology tags** create soft alliance preferences: same ideology players get a -15% ceasefire cost discount and a +10% defense bonus when adjacent to an ideological ally
- Add ideology flag icons (color-coded: blue=democratic, black=fascist, red=communist, green=neutral) next to player names on the leaderboard

### 10.6 — Air Power (HOI4's air warfare system, browser-adapted)

Create `src/core/AirSystem.ts` and `src/core/entities/AirUnit.ts`:

Add a simplified air warfare layer that runs above the ground unit system:

```typescript
export enum AirMission {
  AirSuperiority  = "air_superiority",   // Contest enemy air, reducing their air effectiveness in a region
  StrategicBombing = "strategic_bombing", // Reduces enemy Production output in targeted tiles by 30%
  CloseAirSupport  = "close_air_support", // Boosts your ground unit attack by 20% in a targeted region
  Recon            = "recon",             // Removes fog of war over a 5-tile radius for 60 ticks
}
```

- Players build **Air Wings** using Production resource (costs 1000 Production)
- Each Air Wing can be assigned one mission per game "day" (every 100 ticks)
- Air Wings are represented as small plane icons on the map showing their patrol zone
- Air Superiority missions from opposing players cancel each other out
- Add an **Air Map Overlay** toggle button in the HUD to show active air missions

### 10.7 — Intelligence & Espionage (HOI4 Spies, simplified)

Create `src/core/IntelSystem.ts`:

Extend the existing Spy ability into a full intel system:

- Players can recruit up to **3 Agents** (costs 200 Gold each)
- Agents can be assigned missions:
  - **Steal Blueprints** — copy one of the enemy's completed National Focuses (50% success rate)
  - **Sabotage Factory** — reduce enemy Production by 20% for 60 ticks
  - **Coup d'État** — if enemy has <20% territory, attempt to flip 2 tiles to your control (30% success)
  - **Infiltrate Government** — see enemy's current National Focus being researched
- Failed missions have a 40% chance of being "caught" — the targeted player is notified "⚠️ Spy caught from [Player]!" and the agent is lost
- Add an **Intelligence Agency Panel** in `src/client/ui/IntelPanel.ts`

### 10.8 — HOI4-Style Event Popups

HOI4's most loved feature is its dramatic event cards that pop up mid-game and force choices. Add a lightweight version:

Create `src/core/events/WorldEvents.ts` with random events that fire during matches:

```typescript
export const WorldEvents = [
  {
    id: "great_depression",
    title: "Economic Crash",
    description: "Global markets collapse. All players lose 20% of their Gold reserves. Industrial output reduced for 30 ticks.",
    trigger: "random_after_tick_200",
    effect: "all_players_gold_minus_20_percent"
  },
  {
    id: "arms_race",
    title: "Arms Race Declared",
    description: "Tensions rise globally. All unit production costs reduced 15% for the next 100 ticks. Choose: join the race or stay neutral.",
    trigger: "random_after_tick_150",
    choices: ["Join Arms Race (+15% unit speed, +20% cost)", "Stay Neutral (no change)"]
  },
  {
    id: "rebel_uprising",
    title: "Rebel Uprising",
    description: "A random tile in your territory has rebelled and gone neutral. Recapture it within 50 ticks or lose it permanently.",
    trigger: "per_player_random",
    effect: "random_border_tile_flips_neutral"
  },
  {
    id: "golden_age",
    title: "Golden Age of Commerce",
    description: "Trade routes boom. All trade ship income doubled for 60 ticks.",
    trigger: "random_after_tick_100"
  },
  {
    id: "epidemic",
    title: "Epidemic Outbreak",
    description: "A plague sweeps through the most populated territories. Players with the most tiles lose 10% of their troop count.",
    trigger: "random_any_time"
  }
]
```

- Events fire as dramatic **modal popups** with a title, description, map highlight if relevant, and choice buttons if applicable
- Events that affect all players are announced in the global ticker
- Event history is viewable in an **Event Log** panel
- Create `src/client/ui/EventPopup.ts` and `src/client/ui/EventLog.ts`

---

## ✅ EXECUTION ORDER

Work in this exact order to avoid breaking dependencies:

1. **Phase 1** — Rebrand everything first so you're working in a clean namespace
2. **Phase 7** — Set up deployment config (it touches few files, good to do early)
3. **Phase 2.1** — Add new unit types (foundation for everything else)
4. **Phase 2.2** — Fog of War (depends on entity system)
5. **Phase 2.3** — Tech Tree (new system, mostly isolated)
6. **Phase 2.4** — Diplomacy (extends existing alliance system)
7. **Phase 2.5** — Economy (extends existing resource system)
8. **Phase 2.6** — Special Abilities (depends on economy for cost)
9. **Phase 2.7** — Visual effects (client-only, safe to do anytime)
10. **Phase 3** — Game modes (depends on all core systems being ready)
11. **Phase 4** — UI overhaul (client-only)
12. **Phase 5** — Audio (fully isolated)
13. **Phase 6** — Performance (final polish pass)
14. **Phase 8** — Leaderboard (server + client)
15. **Phase 10.1** — National Focus Tree (HOI4 — new isolated system)
16. **Phase 10.2** — Military Doctrine (HOI4 — pre-game selection screen)
17. **Phase 10.3** — Supply Lines (HOI4 — depends on tile/entity system)
18. **Phase 10.4** — War Goals (HOI4 — mostly isolated)
19. **Phase 10.5** — Political Power (HOI4 — extends economy system)
20. **Phase 10.6** — Air Power (HOI4 — new unit layer)
21. **Phase 10.7** — Intelligence & Espionage (HOI4 — extends spy ability)
22. **Phase 10.8** — World Events (HOI4 — mostly isolated, fun finish)
23. **Phase 9** — README (absolute last step)

---

## 🔒 HARD RULES — NEVER BREAK THESE

1. **Determinism is sacred.** The `src/core/` game logic must remain 100% deterministic. Never use `Math.random()`, `Date.now()`, or any non-deterministic operation inside `src/core/`. Use the existing seeded RNG system.

2. **Test every core change.** All changes to `src/core/` MUST have corresponding tests in `tests/`. Run `npm test` after every core modification.

3. **Keep the server authoritative.** Clients never trust themselves for game state. All game state changes go through the server's intent system.

4. **Maintain backwards compatibility for replays.** The intent/execution architecture must remain serializable. New intents need version tags.

5. **No breaking TypeScript.** Run `npm run lint` after every file change. Zero errors, zero warnings.

6. **Keep attribution.** The credits screen must display: *"Based on OpenFront.io — https://github.com/openfrontio/OpenFrontIO"*

7. **Accessibility first.** Every new UI element must have proper ARIA labels, keyboard navigation support, and work at both 1080p and 720p resolutions.

8. **Mobile must work.** Every new feature must have a functional mobile equivalent. If a feature is too complex for mobile (e.g. Focus Tree), it collapses into a simplified list view on screens under 768px.

---

---

## PHASE 11 — REMOVE ALL MONETIZATION, SHOP & SOCIAL LINKS

This game is completely free. No pay-to-win. No shop. No ads. No premium. No paywalls. Ever.
Players enjoy it for fun — period.

### 11.1 — Purge All Monetization Code

Search the ENTIRE codebase for any of the following and DELETE them completely — not comment them out, fully remove:

**Remove all references to:**
- Coinbase, CDP API, wallet, cryptocurrency, onramp, offramp, deposit, withdrawal
- Any `shop`, `store`, `purchase`, `buy`, `premium`, `coin`, `gem`, `currency` UI components
- Any payment processing logic, Stripe, PayPal, or any billing integration
- Any `isPremium`, `hasPurchased`, `unlocked`, `subscription` player flags used for gating content
- Any ads SDK, Google AdSense, ad banners, or ad placement containers
- Any `donate` buttons or Patreon links embedded in the UI

**Files to specifically check and clean:**
- `src/client/ui/` — remove any ShopModal, PremiumModal, CoinbaseWidget, DonateButton components
- `src/server/` — remove any payment endpoint routes (`/api/purchase`, `/api/wallet`, etc.)
- `src/core/` — remove any `isPremium` or `hasPurchased` checks that gate gameplay features
- `index.html` — remove any ad script tags or tracking pixels
- `package.json` — remove Coinbase CDP SDK and any payment library dependencies
- `.env.example` — remove `COINBASE_CDP_API_KEY`, `COINBASE_CDP_PRIVATE_KEY`, and all payment env vars

### 11.2 — Remove Discord & Reddit Links

The project does not have a Discord server or Reddit community yet. Remove ALL links and references:

**Delete or blank out:**
- Any Discord invite link (`discord.gg/...`) in UI, README, footer, main menu
- Any Reddit link (`reddit.com/r/...`) in UI, README, footer
- Any "Join our Discord" buttons, banners, or popups
- Any Discord webhook calls in the server code
- The `discord-bot` references in any config files
- Social media share buttons that link to non-existent pages

**Replace with:**
- In the main menu footer, replace social links with just: `Dominion.io — Free to play. Always.`
- In README, replace Discord/Reddit sections with: `Community coming soon.`

### 11.3 — Make EVERYTHING Unlocked & Free By Default

Any content that was previously locked behind purchases or premium must now be **free and available to all players from the start:**

- All maps — unlocked
- All game modes — unlocked
- All flags and skins (see Phase 12) — unlocked
- All cosmetic borders, colors, unit styles — unlocked
- No login required to play (guest play must always work)
- No account required for any core gameplay feature

Remove any UI that shows a lock icon 🔒 on content. If content was gated, ungated it by defaulting `isPremium = false` everywhere and removing the checks entirely.

---

## PHASE 12 — FLAGS, SKINS & COSMETICS SYSTEM (Massive Variety, All Free)

This is one of the most exciting parts of the game. Players should feel like they're commanding a real civilization from any era of human history. The cosmetic system should be **enormous, historically rich, and entirely free.**

### 12.1 — Flag System Architecture

Create `src/core/cosmetics/FlagRegistry.ts`:

Every flag is an SVG file stored in `resources/flags/`. Flags are organized by era and region.

```typescript
export interface Flag {
  id: string
  name: string           // Display name: "Roman Empire"
  era: FlagEra           // Which historical era
  region: FlagRegion     // Geographic region
  svgPath: string        // Path to SVG: "resources/flags/ancient/roman_empire.svg"
  unlocked: boolean      // Always true — everything is free
}

export enum FlagEra {
  AncientBC     = "ancient_bc",      // 3000 BC – 500 BC
  ClassicalBC   = "classical_bc",    // 500 BC – 1 AD
  EarlyMedieval = "early_medieval",  // 1 AD – 800 AD
  HighMedieval  = "high_medieval",   // 800 – 1300
  LateMedieval  = "late_medieval",   // 1300 – 1500
  EarlyModern   = "early_modern",    // 1500 – 1800
  Colonial      = "colonial",        // 1800 – 1900
  WorldWars     = "world_wars",      // 1900 – 1950
  ColdWar       = "cold_war",        // 1950 – 1991
  Modern        = "modern",          // 1991 – present
  Fantasy       = "fantasy",         // Fictional kingdoms and empires
}
```

### 12.2 — Complete Flag List (Build ALL of These)

Create SVG flags for every entry below. Each SVG should be ~200x133px, historically accurate in colors and symbols where possible, and beautiful at small map sizes (32x20px thumbnail).

**ANCIENT BC ERA (3000 BC – 500 BC)**
- Egyptian Empire (Old Kingdom) — gold and blue, Eye of Ra
- Akkadian Empire — Mesopotamian red and black
- Babylonian Empire — blue and gold, lion motif
- Assyrian Empire — deep red, winged sun disk
- Hittite Empire — bronze and crimson
- Minoan Civilization — sea-blue and white spiral
- Mycenaean Greece — bronze, lion gate symbol
- Phoenicia — purple and cedar tree
- Zhou Dynasty China — black and gold, dragon
- Vedic India — saffron and white

**CLASSICAL BC ERA (500 BC – 1 AD)**
- Athenian Democracy — white and blue, owl of Athena
- Spartan League — crimson and lambda symbol
- Persian Achaemenid Empire — gold, purple, and the Faravahar
- Macedonian Empire (Alexander the Great) — gold star of Vergina on blue
- Carthage — purple and gold, horse head
- Roman Republic — red and gold, SPQR eagle
- Maurya Empire (India) — saffron and Ashoka Chakra
- Han Dynasty China — red and gold dragon
- Ptolemaic Egypt — gold and blue, ankh
- Celtic Tribes — green and gold, triskele

**EARLY MEDIEVAL (1 AD – 800 AD)**
- Roman Empire — deep red, golden eagle
- Byzantine Empire — purple and gold, double-headed eagle
- Sassanid Persian Empire — crimson and gold, Faravahar
- Hun Empire — dark leather brown and black
- Gupta Empire — orange and white, lion
- Tang Dynasty China — gold and red
- Umayyad Caliphate — black and gold, crescent
- Frankish Kingdom — blue and gold, fleur-de-lis
- Viking Age Scandinavia — black and red, raven
- Axum Empire (Ethiopia) — gold, red, green

**HIGH MEDIEVAL (800 – 1300)**
- Holy Roman Empire — black eagle on gold
- Kingdom of France — blue with gold fleur-de-lis
- Kingdom of England — red, three gold lions
- Crusader States — white cross on red (Jerusalem cross)
- Mongol Empire — blue sky, golden soyombo
- Abbasid Caliphate — black on gold
- Sultanate of Delhi — green and gold
- Venetian Republic — gold lion on red
- Kingdom of Norway — red with gold lion
- Ghana Empire — gold and black

**LATE MEDIEVAL (1300 – 1500)**
- Ottoman Empire — red and gold, crescent and star
- Aztec Empire — eagle and serpent on green
- Inca Empire — rainbow flag (wiphala) + gold sun
- Mali Empire — green, gold, and red
- Ming Dynasty China — red with yellow dragon
- Kingdom of Poland-Lithuania — white eagle on red
- House of Habsburg — black eagle on gold
- Timurid Empire — blue and gold, geometric star
- Majapahit Empire — red and white, gold sun
- Kingdom of Scotland — blue with white saltire

**EARLY MODERN (1500 – 1800)**
- Spanish Empire — red and gold with coat of arms
- Portuguese Empire — green and red, armillary sphere
- Dutch Republic — orange, white, blue tricolor
- Swedish Empire — blue with gold cross
- Mughal Empire — green with white crescent
- Safavid Persia — green, white, red with lion and sun
- Qing Dynasty China — yellow dragon on blue
- Russian Tsardom — white, blue, red tricolor
- Kingdom of Denmark — red with white cross
- Shogunate Japan — red circle on white

**COLONIAL ERA (1800 – 1900)**
- British Empire — Union Jack
- French Empire — blue, white, red tricolor
- German Empire — black, white, red with eagle
- Austro-Hungarian Empire — black and yellow with double eagle
- United States — stars and stripes (original 13 states version)
- Confederate States — stars and bars
- Kingdom of Italy — green, white, red with Savoy shield
- Meiji Japan — red sun on white
- Zulu Kingdom — black, white, red shield
- Kingdom of Hawaii — Union Jack with Hawaiian stripes

**WORLD WARS ERA (1900 – 1950)**
- Weimar Republic Germany — black, red, gold
- Nazi Germany — (show only as a historical/educational entry with the Iron Cross, NOT the swastika — use the Wehrmacht eagle instead)
- Soviet Union — red with gold hammer and sickle
- Imperial Japan — rising sun flag
- Kingdom of Yugoslavia — blue, white, red tricolor
- Republic of China — red, blue, white with sun
- Italian Fascist State — tricolor with Fasces
- Free France — tricolor with Cross of Lorraine
- Republic of Ireland — green, white, orange
- League of Nations — olive branch on blue

**COLD WAR ERA (1950 – 1991)**
- United States — 50-star flag
- Soviet Union — red hammer and sickle
- People's Republic of China — red with five gold stars
- Cuba — red, white, blue with star
- North Korea — red, white, blue with red star
- East Germany — black, red, gold with compass
- NATO — dark blue with white compass rose
- Warsaw Pact — red with gold star circle
- Non-Aligned Movement — blue globe
- United Nations — light blue with UN emblem

**MODERN ERA (1991 – Present)**
Include ALL 195 UN-recognized countries with their current official flags. Prioritize:
- All G20 nations first
- Then all remaining UN members
- SVGs should be clean, accurate, and scale well

**FANTASY / FICTIONAL KINGDOMS**
- Dragon Kingdom — black dragon on crimson
- Elvish Realm — silver tree on dark green
- Dwarven Clans — hammer and anvil on deep brown
- Pirate Republic — skull and crossbones variations (3 styles)
- Galactic Federation — stars on deep space blue
- Steampunk Empire — gear and cog on copper
- Shadow Confederation — silver crescent on black
- Golden Horde (fantasy version) — gold skull on dark red
- Sea Lords — trident on ocean blue
- The Undying Republic — hourglass on ash grey

### 12.3 — Player Skin / Color Variants

Beyond flags, players can choose a **Territory Color Theme** — how their captured tiles look on the map:

```typescript
export enum TerritoryTheme {
  // Military
  OliveGreen    = "#4A5C3A",
  DesertTan     = "#C4A882",
  NavyBlue      = "#1B2A4A",
  CrimsonRed    = "#8B1A1A",
  SteelGrey     = "#5A6472",

  // Historical
  RoyalPurple   = "#4B0082",
  ImperialGold  = "#C8973A",
  ByzantineBlue = "#1E3A6E",
  SakuraRose    = "#E8A0B0",
  NileGold      = "#D4A843",

  // Fantasy
  DragonBlack   = "#1A1A2E",
  ElvenSilver   = "#C0C8D0",
  InfernalRed   = "#FF2200",
  FrostBlue     = "#A8D8EA",
  ShadowVoid    = "#0D0D1A",
}
```

All themes are free and available from the start. Players pick their color in the pre-game lobby.

### 12.4 — Cosmetic Selection UI

Create `src/client/ui/CosmeticsScreen.ts`:

- Accessible from the main menu
- Two tabs: **FLAGS** and **COLORS**
- Flags tab has era filter buttons across the top: Ancient BC | Classical | Medieval | Early Modern | Colonial | World Wars | Cold War | Modern | Fantasy
- Flags display in a grid of 80px thumbnails with the civilization name below
- Hovering a flag shows a larger preview with era, region, and a fun one-line historical fact
- Clicking selects it — instantly previewed on a small mock map territory
- Search bar at top: type "Rome" or "Japan" or "Dragon" to filter
- Selected flag and color are saved to localStorage and sent to the server on game join
- No lock icons anywhere. No "PREMIUM" labels. Everything is just... available.

---

## PHASE 13 — SOLO PLAY OVERHAUL (Single Player Must Be World Class)

Single player in most .io games is an afterthought. In Dominion.io it must be genuinely great.

### 13.1 — Bot AI Difficulty Tiers

Rewrite the bot AI in `src/core/ai/` with 5 proper difficulty tiers:

```typescript
export enum BotDifficulty {
  Recruit    = "recruit",     // Makes obvious mistakes, expands slowly, never uses specials
  Regular    = "regular",     // Solid basic play, uses alliances, occasional special ability
  Veteran    = "veteran",     // Good macro, researches techs, targets weak players
  Elite      = "elite",       // Near-human play, uses all systems, adapts to player strategy
  Legendary  = "legendary",   // Optimized, ruthless, reads the board, coordinates with AI allies
}
```

Each tier changes:
- Expansion aggressiveness
- Alliance formation logic
- Tech research prioritization
- Special ability timing
- Response to player actions (does it recognize and counter your doctrine?)
- Diplomatic behavior (Legendary bots will betray you at the perfect moment)

### 13.2 — Solo Campaign Mode

Create `src/core/campaign/CampaignManager.ts`:

A narrative single-player campaign with 20 handcrafted missions across human history:

```
ACT 1 — ANCIENT WORLD
  Mission 1: Rise of Rome — Start as a tiny village, conquer the Italian peninsula
  Mission 2: Alexander's March — Begin in Macedonia, reach India in 15 minutes
  Mission 3: The Mongol Tide — Largest starting army, conquer Asia before winter

ACT 2 — MEDIEVAL STRUGGLE  
  Mission 4: The Crusades — Christian kingdoms vs Muslim forces, Jerusalem as the objective
  Mission 5: Genghis Khan — Horde mechanics, special "Pillage" ability
  Mission 6: The Black Death — Random tiles "infected" and lost, survive and conquer

ACT 3 — AGE OF EMPIRES
  Mission 7: Spanish Conquest — Naval invasion of the Americas
  Mission 8: The Dutch Republic — Economy-focused, trade routes are victory points
  Mission 9: Ottoman Siege — Capture Constantinople with artillery before the timer

ACT 4 — WORLD AT WAR
  Mission 10: WWI Trenches — Fortified lines, breaking through is the challenge
  Mission 11: Blitzkrieg — Play as Germany, must conquer France in 5 minutes
  Mission 12: Pacific Theater — Naval warfare dominates, island hopping
  Mission 13: D-Day — Play as Allied forces, beach landing under heavy fire
  Mission 14: Eastern Front — Brutal attrition, supply lines critical

ACT 5 — COLD WAR & BEYOND
  Mission 15: Cuban Missile Crisis — Diplomatic missions, avoid nuclear war
  Mission 16: Vietnam — Guerrilla AI, territory you capture keeps reverting
  Mission 17: Gulf War — Overwhelming modern force vs entrenched defender
  Mission 18: Cyber Warfare — Intel and espionage-focused mission
  Mission 19: Climate Wars 2045 — Flooded maps, resource scarcity
  Mission 20: FINAL — World Domination — All systems active, hardest AI, no time limit
```

Each mission has:
- A dramatic **loading screen** with historical art style illustration (CSS-rendered, no image files needed)
- A **briefing modal** with mission objectives, historical context paragraph, and special rules
- **Win conditions** beyond just territory (time limits, specific tile capture, survive X ticks, etc.)
- **Star rating** (1–3 stars) based on speed and bonus objectives
- Campaign progress saved to localStorage

### 13.3 — Skirmish Mode (Custom Solo Games)

A free-play solo mode where players configure everything:

- Map selection
- Number of bots (1–15)
- Bot difficulty mix (e.g. 3 Legendary + 5 Regular + 7 Recruit)
- Game mode (Classic, Blitz, Cold War, Team)
- Starting resources (Normal / Rich / Abundant)
- Victory condition (Domination / Score / Survival / Time Limit)
- Special rules toggles: Fog of War on/off, Supply Lines on/off, Events on/off

Create `src/client/ui/SkirmishSetupScreen.ts` with a clean configuration UI.

### 13.4 — Tutorial System

Create `src/core/tutorial/TutorialManager.ts`:

An interactive tutorial that teaches all major systems through guided play:

```
Chapter 1: Basic Movement & Territory (2 min)
Chapter 2: Economy & Resources (3 min)
Chapter 3: Alliances & Diplomacy (3 min)
Chapter 4: Units & Combat (4 min)
Chapter 5: Tech Tree & Doctrine (4 min)
Chapter 6: Special Abilities (3 min)
Chapter 7: HOI4 Systems — Focus Tree, Supply, Air (5 min)
Chapter 8: Advanced Strategy Tips (3 min)
```

- Tutorial uses **highlighted tooltips** that point to specific UI elements with animated arrows
- Player cannot make wrong moves — the game gently redirects with a hint
- Skippable at any time
- Accessible from main menu as "HOW TO PLAY"

---

## PHASE 14 — MULTIPLAYER POLISH (Make It World Class)

### 14.1 — Matchmaking Improvements

Enhance `src/server/lobby/`:

- **Skill-based matchmaking**: track each player's win rate and match them against similar-skill opponents in public games
- **Lobby browser**: list all open games with: map name, player count, mode, avg skill level, time running
- **Private lobbies**: create a game with a 6-digit code to share with friends
- **Spectator mode**: watch any ongoing public game in real time (view-only, no fog of war for spectators)
- **Quick play**: one click joins the best available game instantly
- **Region selection**: Auto-detect closest server region for lowest ping

### 14.2 — In-Game Chat Improvements

- **Global chat** — all players in the game
- **Alliance chat** — only your allies see it
- **Whisper** — private message to one player: `/w PlayerName message`
- **Quick phrases** (no-type communication): buttons for "🤝 Alliance?", "⚔️ Back off!", "🆘 Need help!", "👍 GG"
- Profanity filter enabled by default, toggleable in settings
- Chat messages from players you're at war with shown in red tint

### 14.3 — Reconnection System

If a player disconnects mid-game:
- Their territory holds for 60 seconds in "AI mode" (defending only, no attacks)
- A "Reconnecting..." overlay shows on their tiles
- If they reconnect within 60 seconds, they resume perfectly
- If they don't reconnect, their territory goes into full AI control at Regular difficulty
- Player sees a "Rejoin Game" button if they accidentally closed the tab

### 14.4 — End-Game Replay System

After every game, players can:
- Watch a **full replay** from any player's perspective
- **Speed controls**: 1x, 2x, 4x, 8x playback speed
- **Timeline scrubber**: jump to any moment in the game
- **Event markers** on the timeline: alliance formed, war declared, nuke launched
- Share a replay link that anyone can watch
- Download replay as a `.dominion-replay` file

---

---

## PHASE 15 — ULTRA POLISH (The Difference Between Good and Legendary)

This phase is what separates Dominion.io from every other browser game ever made. Every detail counts. A player should feel the quality in every single interaction — from the moment the page loads to the moment they win their first campaign mission. Nothing is too small to polish.

### 15.1 — Loading & First Impression

**Page Load Experience:**
- The very first thing a player sees must be stunning. No white flash, no layout shift, no spinner on a blank page.
- Implement a **cinematic loading screen**: dark background, the DOMINION.IO logo fades in with a slow golden glow, a progress bar fills with a subtle military tick sound, and a random historical quote appears beneath:
  - *"An army marches on its stomach." — Napoleon Bonaparte*
  - *"In war, the moral is to the physical as three is to one." — Napoleon*
  - *"The supreme art of war is to subdue the enemy without fighting." — Sun Tzu*
  - *"Whoever does not miss the Soviet Union has no heart." — Vladimir Putin*
  - *"History is written by the victors." — Winston Churchill*
  - Add 20+ quotes total, randomly selected each load
- Loading screen must complete in under 2 seconds on a decent connection
- After loading, the main menu **animates in** — logo drops from above, buttons fade in staggered left-to-right, background map pans slowly

**Page Metadata (index.html):**
```html
<title>Dominion.io — Conquer the World</title>
<meta name="description" content="The ultimate free browser strategy game. Conquer territory, build empires, forge alliances. No download. No login. No cost. Play now.">
<meta property="og:title" content="Dominion.io — Conquer the World">
<meta property="og:description" content="Real-time multiplayer strategy. Free forever.">
<meta property="og:image" content="/resources/og-preview.png">
<meta name="theme-color" content="#C8973A">
<link rel="icon" href="/resources/favicon.svg">
```

Create `resources/og-preview.png` — a 1200x630 canvas-rendered preview image showing the game map with multiple colored territories, the Dominion.io logo in the corner, and the tagline "Conquer the World. Free Forever."

### 15.2 — Micro-Animations & Transitions (Every Click Should Feel Alive)

Create `src/client/rendering/AnimationSystem.ts`:

Every UI interaction must have a micro-animation. These are the details players feel subconsciously:

**Button interactions:**
- All buttons have a 120ms ease-out scale transform on hover (scale 1.03)
- Click triggers a 80ms press animation (scale 0.97) then springs back
- Destructive buttons (declare war, launch nuke) shake slightly on hover as a warning signal
- Disabled buttons have 40% opacity and a `not-allowed` cursor — never invisible

**Panel transitions:**
- All panels slide in from their natural edge (tech panel from left, leaderboard from right)
- Backdrop blur fades in over 200ms — never snaps
- Closing panels slide back out, never just disappear
- Modal overlays fade in the backdrop (rgba 0,0,0,0 → rgba 0,0,0,0.7) over 150ms

**Map interactions:**
- Hovering a tile highlights it with a subtle white glow outline (2px, 40% opacity)
- Clicking your own territory pulses it once with your color
- Clicking an enemy territory that you can attack shows a red crosshair cursor
- Zooming is smooth — never snaps between zoom levels. Use CSS `transform: scale()` with `transition: transform 200ms ease`
- Panning has momentum — when you release a drag, the map coasts slightly before stopping

**Number animations:**
- All resource counters (Gold, Production, Energy, PP) animate when they change — numbers tick up/down smoothly rather than jumping
- Territory percentage in HUD rolls up like an odometer when you capture tiles
- If you lose territory, the percentage rolls DOWN with a red flash

**Flag display:**
- Player flags on the map render with a subtle drop shadow
- In the cosmetics screen, selecting a new flag plays a small "snap" CSS animation
- Hovering a flag lifts it slightly (translateY -3px) with a shadow increase

### 15.3 — Sound Design (Every Action Has Audio Identity)

Extend `src/client/audio/AudioManager.ts` with a complete sound design pass:

Every single interaction in the game should have a satisfying, distinct sound. Use the Web Audio API for all of these — no external files needed.

**UI Sounds:**
- Button hover: ultra-soft high tick (5ms, 2kHz sine, 0.05 volume)
- Button click: crisp mid click (10ms, 800Hz, slight reverb)
- Panel open: whoosh sweep (80ms, filtered noise, rising pitch)
- Panel close: reverse whoosh
- Modal appear: deep soft thud + shimmer
- Error/invalid action: low buzz (100ms, 120Hz, slight distortion)
- Success confirmation: clean two-note ascending chime (C then E)
- Notification received: soft ping

**Game Sounds:**
- Territory captured (your color): satisfying pop + territorial expansion whoosh
- Territory lost: hollow thud + reverse whoosh
- Troop movement: distant marching rhythm (faint, looping while moving)
- Alliance formed: warm ascending three-note chord (major)
- Alliance broken: dissonant descending two-note (minor)
- War declared: dramatic military snare hit + brass stab
- Nuke launched: deep bass rumble building for 2 seconds
- Nuke impact: shockwave boom + distant ringing (tinnitus effect, 1.5 seconds)
- Tech researched: soft ascending scale + completion chime
- National focus complete: fanfare (3-note ascending brass, synthesized)
- Special ability activated: each ability has a unique audio signature:
  - Blitz: fast electric charge sound
  - Fortify: heavy metal clanking
  - Air Strike: distant jet roar + impact
  - Propaganda: crowd cheer sound (synthesized)
  - Spy: subtle electronic beep sequence
- Game won: triumphant 4-note fanfare + crowd roar
- Game lost: slow descending minor melody + silence

**Ambient Audio:**
- In-game background: subtle procedural tension music that INTENSIFIES as the game progresses:
  - Early game (>50% players alive): slow ambient drone, distant drums
  - Mid game (25-50% players alive): rhythm picks up, strings added
  - Late game (<25% players alive): full orchestral tension, faster tempo
  - Final duel (2 players left): dramatic 1v1 theme, full intensity
- Main menu: calm strategic ambient loop — slow, majestic, inviting
- Campaign briefing screen: era-appropriate ambient (ancient = drums + flute, WWII = brass + strings)
- All ambient music is procedurally generated via Web Audio API oscillators and filters

**Volume Controls:**
- Master, Music, SFX all wired to the Settings panel sliders
- Audio context initialized on first user interaction (browser requirement)
- Mute button in HUD corner with a speaker icon (click to toggle)

### 15.4 — Visual Effects (The Map Must Feel Alive)

Extend `src/client/rendering/` with a full VFX pass:

**Territory:**
- Border between your territory and enemy territory has an animated pulsing glow in your color (subtle, 2px, 60% opacity, 2s cycle)
- Newly captured tiles flash your color then settle — the flash travels outward from the capture point like a ripple
- Tiles under attack shimmer with alternating colors (your color + enemy color) at 4Hz
- Your capital tile always has a subtle rotating golden ring around it

**Weather & Atmosphere (purely visual, no gameplay effect):**
- Randomly, light cloud shadows drift across the map (semi-transparent grey shapes, CSS animated)
- Arctic map regions have a subtle snow particle overlay (pure CSS, tiny white dots drifting down)
- Desert regions shimmer slightly (heat haze effect using CSS blur animation)
- Ocean tiles have animated wave lines (SVG paths, subtle movement)

**Particle Effects:**
- When a nuke hits: 40 particles explode outward from impact, fade to nothing in 800ms
- When an alliance forms: golden sparkles between the two players' capitals
- When war is declared: red sparks burst from the border between the two players
- When you capture a capital: confetti burst in your color (50 particles, 1200ms)
- When a World Event fires: a brief screen-edge glow in the event's color (red for bad, gold for good)

**Day/Night Cycle (Visual Only):**
- Every 5 minutes of real time, the map slowly shifts between a daytime palette and a nighttime palette
- Nighttime: map darkens 20%, ocean tiles get a deep navy tint, cities glow with tiny warm light dots
- Daytime: full color saturation, normal rendering
- Transition takes 30 seconds — completely seamless
- Toggle in Settings: "Day/Night Cycle: On/Off"

**Zoom Levels:**
- At maximum zoom out (full world view): territory borders simplify to solid color fills, no unit icons shown — clean strategic view
- At medium zoom: territory fills + border glow + capital markers
- At maximum zoom in: individual tile textures visible (grass, desert, mountain, forest — CSS-rendered color variation), unit icons rendered at full size with HP bars

### 15.5 — Typography & Readability

Every piece of text in the game must be legible, purposeful, and beautiful:

**Font loading:**
```html
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&family=Crimson+Pro:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
```

**Text hierarchy rules (enforce across ALL UI):**
- Game title / screen headers: Rajdhani 700, tracked +0.1em, uppercase
- HUD labels: Share Tech Mono, 11px, uppercase, letter-spacing 0.15em
- HUD values/numbers: Share Tech Mono, 14-18px, gold color
- Body text / descriptions: Crimson Pro 400, 15px, line-height 1.6
- Tooltip text: Rajdhani 400, 13px
- Chat text: Share Tech Mono, 12px
- Error messages: Rajdhani 600, red accent color
- Success messages: Rajdhani 600, gold color

**Never allow:**
- Text smaller than 11px anywhere
- Low contrast text (minimum 4.5:1 contrast ratio against background)
- Untruncated text overflow — all text boxes must have `text-overflow: ellipsis` or proper wrapping
- Mixed font families on the same UI component

### 15.6 — Accessibility

The game must be playable by everyone:

- **Color blind modes** (add to Settings):
  - Deuteranopia mode: replace green territory colors with patterns + blue
  - Protanopia mode: replace red colors with orange/yellow
  - High contrast mode: all text becomes pure white or pure black, borders become 3px
- **Keyboard navigation**: every menu, modal, and panel must be fully navigable with Tab + Enter + Escape
- **Screen reader support**: all interactive elements have `aria-label` attributes
- **Reduced motion mode**: disables all particle effects, transitions, day/night cycle, and map animations for players with motion sensitivity
- **Font size scaling**: Settings slider from 80% to 130% text size
- **Colorblind-safe flag rendering**: flags always show the civilization name text label beneath them, never rely on color alone

### 15.7 — Error Handling & Resilience (The Game Must Never Feel Broken)

The game should handle every possible failure gracefully:

**Network failures:**
- If WebSocket connection drops: show a subtle "Reconnecting..." banner at top of screen (not a scary modal)
- Show connection quality indicator in HUD corner: green dot (good), yellow (laggy), red (poor)
- If server is unreachable: show a friendly offline screen with "Servers are temporarily unavailable. Try again in a moment." — never a raw error
- Queue outgoing intents during brief disconnects and replay them on reconnect

**Game state errors:**
- If game state desync is detected: smoothly resync from server without visible disruption
- If a render error occurs: catch it, log it, and continue rendering — never crash the whole canvas
- If audio context fails (some browsers block it): silently disable audio, never throw an error

**User input:**
- All text inputs sanitized before sending to server
- Name field: max 20 characters, no HTML, stripped of special characters
- Chat: max 200 characters per message, rate limited to 3 messages per 5 seconds client-side

**Loading failures:**
- If a flag SVG fails to load: show a fallback colored square with the civilization's first letter
- If a font fails to load: fall back to `monospace` system font — never invisible text

### 15.8 — Performance Targets (Non-Negotiable)

The game must hit these benchmarks on a mid-range laptop (i5, integrated graphics):

| Metric | Target |
|---|---|
| Initial page load | < 2 seconds |
| Time to first playable frame | < 3 seconds |
| Canvas render framerate | 60 FPS sustained |
| Canvas render framerate (low-end) | 30 FPS minimum |
| WebSocket message latency | < 50ms (same region) |
| Memory usage after 30min game | < 300MB |
| Bundle size (gzipped) | < 2MB |

**To hit these targets:**
- Code-split all non-critical UI (campaign screen, cosmetics, leaderboard) into lazy-loaded chunks via Vite dynamic imports
- Compress all SVG flags with SVGO before committing
- Use `requestAnimationFrame` for ALL rendering — never `setInterval`
- Throttle non-critical UI updates to 10fps (resource counters, leaderboard) while keeping map at 60fps
- Profile with Chrome DevTools and fix any function taking >16ms in the render loop
- Add `will-change: transform` to all animated canvas elements
- Use CSS `contain: strict` on HUD panels to isolate their repaints from the game canvas

### 15.9 — Game Feel Tuning (The Secret Sauce)

These are the invisible settings that make a game feel incredible vs mediocre. Tune ALL of these:

**Territory expansion feel:**
- Capturing a tile should never feel instant or laggy — aim for 150-250ms of visual feedback between click and tile changing color
- The "capture animation" (color ripple) should take exactly 300ms — fast enough to feel responsive, slow enough to be satisfying
- Rapid capturing of many tiles should create a cascading ripple effect that looks like a wave

**Combat feel:**
- When you're being attacked, the HUD should subtly pulse red at the screen edges (vignette effect) — like a game controller rumble in visual form
- Losing your last tile in a region should feel dramatic — slower color drain animation, a brief camera shake (2px, 200ms)
- Winning the game should feel AMAZING — 3 seconds of confetti, fanfare audio, camera zooms out to show the whole map in your color, "VICTORY" text animates in

**Pacing:**
- Early game should feel expansive and exciting — lots of territory to grab, music is optimistic
- Mid game should feel tense — competition is real, music shifts, HUD shows "X players remain"
- Late game should feel epic and decisive — the map is mostly colored, every move matters, music is full orchestra
- These phases are driven by player count remaining: >60% = early, 30-60% = mid, <30% = late

**Feedback clarity:**
- The player should ALWAYS know exactly what happened and why. Every action result gets a brief HUD notification:
  - "⚔️ Attack on Berlin failed — fortified!" 
  - "🤝 France accepted your ceasefire"
  - "📦 Supply line to Eastern Territory restored"
  - "🔬 Armored Division research complete!"
- Notifications stack vertically, newest on top, auto-dismiss after 4 seconds
- Player can click a notification to jump to the relevant location on the map

### 15.10 — Settings Panel (Complete & Thoughtful)

Create the most complete settings panel of any browser game:

**Graphics:**
- Render quality: Low / Medium / High / Ultra
- Particle effects: Off / Low / High
- Day/Night cycle: On / Off
- Weather effects: On / Off
- Animated borders: On / Off
- Territory capture animations: On / Off
- Map zoom sensitivity slider

**Audio:**
- Master volume slider (0-100)
- Music volume slider
- SFX volume slider
- UI sounds: On / Off
- Ambient sounds: On / Off
- Mute when tab is not focused: On / Off

**Gameplay:**
- Show damage numbers: On / Off
- Show supply line overlay: On / Off
- Show air mission overlay: On / Off
- Fog of war (custom games only): On / Off
- Auto-accept alliances from friends: On / Off
- Confirm before launching nuke: On / Off (default ON)
- Show territory percentage on map: On / Off

**Accessibility:**
- Color blind mode: Off / Deuteranopia / Protanopia / High Contrast
- Reduced motion: On / Off
- Text size: 80% / 100% / 115% / 130%
- Screen reader mode: On / Off

**Interface:**
- HUD opacity slider (50-100%)
- Minimap size: Small / Medium / Large / Hidden
- Chat opacity slider
- Show player flags on map: On / Off
- Show player names on map: On / Off (clutters at high player counts)
- Compact HUD mode: On / Off (for smaller screens)

All settings save to localStorage instantly. No "Apply" button — changes are live.

### 15.11 — Polish Checklist (Run Through Every Single Item Before Shipping)

Before the game is considered done, manually verify every item on this list:

**Loading & First Run:**
- [ ] Page loads in < 2 seconds on a fresh cache
- [ ] Loading screen looks beautiful and never shows a JS error
- [ ] Main menu animates in correctly on first load
- [ ] Historical quote is readable and centered
- [ ] Favicon appears correctly in browser tab
- [ ] OG preview image appears when URL is shared on Discord/Twitter

**Main Menu:**
- [ ] All 5 buttons work and lead to the correct screen
- [ ] Animated map background is running and looks good
- [ ] DOMINION.IO logo is crisp at all screen sizes
- [ ] No placeholder text anywhere ("Lorem ipsum", "TODO", "test")
- [ ] Player count display is accurate

**Cosmetics Screen:**
- [ ] All flags load and display correctly
- [ ] Era filter buttons work
- [ ] Search works and is instant
- [ ] Selected flag is highlighted clearly
- [ ] Preview updates instantly on selection
- [ ] Color theme picker works

**Game Lobby:**
- [ ] Creating a game works
- [ ] Joining a game works
- [ ] Private lobby code system works
- [ ] Player names show correctly
- [ ] Doctrine selection screen appears and saves choice
- [ ] Flag appears next to player name

**In-Game:**
- [ ] Map renders at 60fps
- [ ] Territory capture works and feels good
- [ ] All unit types function correctly
- [ ] Fog of war works from all player perspectives
- [ ] Tech tree panel opens, closes, and research works
- [ ] Diplomacy panel works — alliances, ceasefires, vassal pacts
- [ ] All 5 special abilities work with correct cooldowns
- [ ] National focus tree renders and completes correctly
- [ ] Supply lines show correctly
- [ ] Air missions function
- [ ] World events fire and resolve
- [ ] Resources tick up correctly every game tick
- [ ] HUD numbers animate smoothly
- [ ] Notifications appear and dismiss correctly
- [ ] Chat works (global + alliance + whisper)
- [ ] Minimap is accurate
- [ ] All sounds play at the right moments

**End Game:**
- [ ] Victory screen appears with confetti and fanfare
- [ ] Defeat screen appears with correct stats
- [ ] Replay system records and plays back correctly
- [ ] "Play Again" returns to lobby correctly

**Settings:**
- [ ] Every setting actually does what it says
- [ ] Settings persist after page refresh
- [ ] Color blind modes visibly change the game

**Mobile:**
- [ ] Game loads on iOS Safari and Android Chrome
- [ ] Touch controls work (tap, pinch zoom, drag pan)
- [ ] HUD is usable at 375px width
- [ ] Panels collapse correctly on small screens

---

## FINAL EXECUTION ORDER (Complete Master List)

Execute ALL phases in this exact order:

1. **Phase 11.1-11.2** — Remove monetization and social links FIRST (clean codebase before building)
2. **Phase 1** — Complete rebrand to Dominion.io
3. **Phase 7** — Deployment config (Vercel, Railway, GitHub Actions)
4. **Phase 15.1** — Loading screen and page metadata (first impressions matter)
5. **Phase 2.1** — New unit types
6. **Phase 2.2** — Fog of War
7. **Phase 2.3** — Tech Tree
8. **Phase 2.4** — Diplomacy system
9. **Phase 2.5** — Economy overhaul
10. **Phase 2.6** — Special abilities
11. **Phase 2.7** — Battle animations
12. **Phase 10.1** — National Focus Tree
13. **Phase 10.2** — Military Doctrine
14. **Phase 10.3** — Supply Lines
15. **Phase 10.4** — War Goals
16. **Phase 10.5** — Political Power & Ideology
17. **Phase 10.6** — Air Power
18. **Phase 10.7** — Intelligence & Espionage
19. **Phase 10.8** — World Events
20. **Phase 3** — New game modes
21. **Phase 13.1** — Bot AI tiers
22. **Phase 13.2** — Solo campaign
23. **Phase 13.3** — Skirmish mode
24. **Phase 13.4** — Tutorial system
25. **Phase 12** — Flags and cosmetics (all 100+ flags, cosmetics screen)
26. **Phase 14.1** — Matchmaking improvements
27. **Phase 14.2** — Chat improvements
28. **Phase 14.3** — Reconnection system
29. **Phase 14.4** — Replay system
30. **Phase 4** — Full UI overhaul
31. **Phase 5** — Audio system
32. **Phase 15.2** — Micro-animations and transitions
33. **Phase 15.3** — Complete sound design pass
34. **Phase 15.4** — Visual effects (particles, weather, day/night)
35. **Phase 15.5** — Typography and readability pass
36. **Phase 15.6** — Accessibility
37. **Phase 15.7** — Error handling and resilience
38. **Phase 15.8** — Performance optimization pass
39. **Phase 15.9** — Game feel tuning
40. **Phase 15.10** — Complete settings panel
41. **Phase 6** — Final performance optimization
42. **Phase 8** — Leaderboard and player profiles
43. **Phase 15.11** — Full polish checklist (go through every item)
44. **Phase 9** — README rewrite (last step)

---

## 🔒 HARD RULES — NEVER BREAK THESE

1. **Determinism is sacred.** Never use `Math.random()`, `Date.now()`, or any non-deterministic code inside `src/core/`. Use the existing seeded RNG.
2. **Test every core change.** All `src/core/` changes need tests. Run `npm test` after every core modification. Zero failing tests before moving to the next phase.
3. **Server is authoritative.** Clients never trust themselves for game state. Every state change goes through the intent system.
4. **Replay compatibility.** New intents must be versioned and serializable.
5. **Zero TypeScript errors.** Run `npm run lint` after every file. Zero errors, zero warnings, always.
6. **Keep attribution.** Credits screen: *"Based on OpenFront.io — https://github.com/openfrontio/OpenFrontIO"*
7. **Everything is free.** Never add a single paywall, lock, premium badge, or purchase prompt. If you find yourself writing `isPremium` for any reason, stop and reconsider.
8. **Mobile must work.** Every feature must be usable on a phone. Test at 375px viewport width.
9. **Accessibility is not optional.** Every interactive element needs keyboard support and an aria-label.
10. **Never ship broken UI.** If a component isn't ready, hide it cleanly. Never show a half-built modal, a missing image, or a console error to the player.

---

## 💡 FINAL VISION

When you are done, **Dominion.io** will be the single greatest browser-based strategy game ever made. Not "one of." The greatest. Free. Forever. For everyone.

It should feel like someone took:
- The addictive, moreish territory growth of **Territorial.io**
- The viral speed and zero-friction accessibility of **Agar.io**
- The backstabbing alliance drama of **Risk**
- The unit variety, micro-management, and map control of **StarCraft II**
- The economy depth, city-building, and campaign storytelling of **Age of Empires II**
- The tech trees, civilization identity, and "one more turn" addiction of **Civilization VI**
- The national focuses, military doctrines, supply lines, air warfare, espionage, and grand political drama of **Hearts of Iron IV**
- The bot AI intelligence and campaign mission design of **Warcraft III**
- The historical breadth, flag variety, and era-spanning cosmetics of every great strategy game combined
- The juice, polish, micro-animations, and sound design of the most satisfying mobile games ever made

...and fused them into something that loads in 3 seconds, requires no account, costs nothing, runs on any device, and makes every single player feel like they are commanding a real civilization across the sweep of human history.

**No shop. No ads. No Discord gate. No premium wall. No login wall. No paywalls. Ever.**

Just the game. The best game. Built for fun, built for everyone, built to last.

The **first time** someone loads `dominion.io` they should think: *"How is this free? This is better than games I've paid $60 for."*

The **tenth time** they should still be discovering systems they didn't know existed.

The **hundredth time** they should be speedrunning the WWII campaign on Legendary, coaching their friends on doctrine selection, and flying the flag of the Byzantine Empire because it's the coolest one.

The **thousandth time** they should still feel the same excitement they felt on game one when they captured their first capital.

That is the standard.

Every pixel. Every sound. Every animation frame. Every tooltip. Every bot decision. Every flag. Every historical quote on the loading screen.

**All of it. Perfect. Build it to that standard. Make it so.**
# Dominion.io Fork Changelog

This changelog tracks the standalone Dominion.io fork. It replaces the
upstream sample release notes so shipped builds present the new game identity.

## 0.1.0 - Tactical Core Rebrand

### Identity

- Renamed the client package and public app surface to Dominion.io.
- Replaced app icons, preview art, background art, navigation logos, loading
  presentation, metadata, theme color, support links, and deployment labels.
- Added a dark cinematic military HUD palette for the main menu, shell UI, and
  loading modal.

### Engine

- Added a deterministic fixed simulation scheduler on the client.
- Separated authoritative turn release from render frames.
- Added interpolation state for the renderer so visual motion can smooth over
  queued network turns.
- Added renderer lifecycle cleanup for animation frames and resize handlers.

### Networking

- Added msgpackr packet serialization for browser and server websocket traffic.
- Added packet byte limits and schema validation for incoming client messages.
- Added binary websocket mode on the client.
- Added latency sampling through ping timestamps.
- Added reconnect backoff behavior for safer multiplayer recovery.

### Gameplay Systems

- Added strategic terrain profiles for plains, forest, mountain, desert, snow,
  and water.
- Added morale calculations that feed attack speed and casualty modifiers.
- Added unit class profiles for infantry, tanks, artillery, aircraft, and naval
  forces.
- Added faction profiles for the new Dominion.io setting.
- Added strategic AI threat scoring for attack target selection.

### Rendering

- Added a fog of war overlay layer.
- Added a pooled particle engine for smoke, sparks, debris, wakes, shockwaves,
  and embers.
- Added cinematic impact events and camera shake support.
- Added reusable spatial query buffers for warship rendering hot paths.

### Performance

- Added a reusable nearby-unit query path to reduce allocations in high-traffic
  render code.
- Added fixed-step catch-up caps to avoid runaway frame stalls after tab sleeps
  or network bursts.
- Added hidden-tab render skipping while preserving scheduler continuity.

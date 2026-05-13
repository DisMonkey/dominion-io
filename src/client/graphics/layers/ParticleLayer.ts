import { EventBus } from "../../../core/EventBus";
import { Cell, UnitType } from "../../../core/game/Game";
import { GameUpdateType } from "../../../core/game/GameUpdates";
import { GameView, UnitView } from "../../../core/game/GameView";
import { CameraShakeEvent, TransformHandler } from "../TransformHandler";
import { ParticlePool } from "../particles/ParticlePool";
import { Layer } from "./Layer";

const MAX_PARTICLES = 1800;
const IMPACT_PARTICLE_CAP = 56;
const TRAIL_EMIT_INTERVAL_TICKS = 2;

function jitter(seed: number): number {
  const s = Math.sin(seed * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

export class CinematicImpactEvent {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly intensity: number,
    public readonly radius: number,
  ) {}
}

export class ParticleLayer implements Layer {
  private readonly particles = new ParticlePool(MAX_PARTICLES);
  private lastFrameMs = 0;
  private lastTrailTick = -1;
  private trailParticlesThisTick = 0;

  constructor(
    private readonly game: GameView,
    private readonly eventBus: EventBus,
    private readonly transformHandler: TransformHandler,
  ) {}

  shouldTransform(): boolean {
    return true;
  }

  init(): void {
    this.eventBus.on(CinematicImpactEvent, (event) => {
      this.spawnImpact(event.x, event.y, event.intensity, event.radius);
    });
  }

  tick(): void {
    if (!this.fxEnabled()) {
      this.particles.clear();
      return;
    }

    const updates = this.game.updatesSinceLastTick();
    const unitUpdates = updates?.[GameUpdateType.Unit] ?? [];
    for (const update of unitUpdates) {
      const unit = this.game.unit(update.id);
      if (unit === undefined) {
        continue;
      }
      this.onUnitUpdate(unit);
    }
  }

  renderLayer(context: CanvasRenderingContext2D): void {
    if (!this.fxEnabled()) {
      return;
    }

    const nowMs = performance.now();
    const deltaMs =
      this.lastFrameMs === 0
        ? 16.667
        : Math.min(50, Math.max(0, nowMs - this.lastFrameMs));
    this.lastFrameMs = nowMs;

    if (this.particles.activeCount() === 0) {
      return;
    }

    context.globalCompositeOperation = "lighter";
    this.particles.render(deltaMs, context);
    context.globalCompositeOperation = "source-over";
  }

  private fxEnabled(): boolean {
    return this.game.config().userSettings()?.fxLayer() ?? true;
  }

  private onUnitUpdate(unit: UnitView): void {
    if (unit.isActive()) {
      this.maybeSpawnTrail(unit);
      return;
    }

    if (!unit.reachedTarget() && unit.type() !== UnitType.Train) {
      return;
    }

    const x = this.game.x(unit.lastTile());
    const y = this.game.y(unit.lastTile());
    switch (unit.type()) {
      case UnitType.AtomBomb:
      case UnitType.MIRVWarhead:
        this.eventBus.emit(new CinematicImpactEvent(x, y, 1.8, 72));
        break;
      case UnitType.HydrogenBomb:
        this.eventBus.emit(new CinematicImpactEvent(x, y, 2.7, 128));
        break;
      case UnitType.Warship:
        this.eventBus.emit(new CinematicImpactEvent(x, y, 0.8, 24));
        break;
      case UnitType.Shell:
      case UnitType.SAMMissile:
        this.eventBus.emit(new CinematicImpactEvent(x, y, 0.45, 14));
        break;
      case UnitType.City:
      case UnitType.DefensePost:
      case UnitType.Factory:
      case UnitType.MissileSilo:
      case UnitType.Port:
      case UnitType.SAMLauncher:
        this.eventBus.emit(new CinematicImpactEvent(x, y, 0.65, 20));
        break;
    }
  }

  private maybeSpawnTrail(unit: UnitView): void {
    const type = unit.type();
    if (
      type !== UnitType.Warship &&
      type !== UnitType.TransportShip &&
      type !== UnitType.TradeShip &&
      type !== UnitType.Shell &&
      type !== UnitType.SAMMissile
    ) {
      return;
    }

    const tick = this.game.ticks();
    if (tick % TRAIL_EMIT_INTERVAL_TICKS !== 0) {
      return;
    }
    if (tick !== this.lastTrailTick) {
      this.lastTrailTick = tick;
      this.trailParticlesThisTick = 0;
    }
    if (this.trailParticlesThisTick >= 64) {
      return;
    }

    const x = this.game.x(unit.tile());
    const y = this.game.y(unit.tile());
    const seed = unit.id() * 97 + tick;

    if (
      type === UnitType.Warship ||
      type === UnitType.TransportShip ||
      type === UnitType.TradeShip
    ) {
      this.particles.spawn({
        x,
        y,
        vx: (jitter(seed) - 0.5) * 0.16,
        vy: (jitter(seed + 1) - 0.5) * 0.16,
        radius: 1.2,
        growth: 0.08,
        lifeMs: 540,
        color: "#79d7ff",
        alpha: 0.18,
        kind: "wake",
        drag: 0.992,
      });
      this.trailParticlesThisTick++;
      return;
    }

    this.particles.spawn({
      x,
      y,
      vx: (jitter(seed) - 0.5) * 0.1,
      vy: (jitter(seed + 1) - 0.5) * 0.1,
      radius: 0.7,
      growth: 0.05,
      lifeMs: 360,
      color: "#ffce78",
      alpha: 0.35,
      kind: "spark",
      drag: 0.98,
    });
    this.trailParticlesThisTick++;
  }

  private spawnImpact(
    x: number,
    y: number,
    intensity: number,
    radius: number,
  ): void {
    if (!this.transformHandler.isOnScreen(new Cell(x, y))) {
      return;
    }
    this.eventBus.emit(
      new CameraShakeEvent(
        Math.min(14, 3.5 * intensity),
        Math.min(900, 220 + radius * 3),
      ),
    );

    const particleCount = Math.min(
      IMPACT_PARTICLE_CAP,
      Math.max(8, Math.floor(radius * intensity * 0.55)),
    );
    const seedBase = this.game.ticks() * 131 + x * 17 + y;

    this.particles.spawn({
      x,
      y,
      vx: 0,
      vy: 0,
      radius: Math.max(4, radius * 0.15),
      growth: Math.max(0.25, radius * 0.018),
      lifeMs: 460 + radius * 2,
      color: "#8ee9ff",
      alpha: Math.min(0.9, 0.28 + intensity * 0.14),
      kind: "shock",
      drag: 1,
    });

    for (let i = 0; i < particleCount; i++) {
      const a = jitter(seedBase + i) * Math.PI * 2;
      const speed = (0.18 + jitter(seedBase + i + 31) * 0.75) * intensity;
      const kindRoll = jitter(seedBase + i + 61);
      const kind =
        kindRoll > 0.72 ? "smoke" : kindRoll > 0.36 ? "ember" : "debris";
      const color =
        kind === "smoke" ? "#9aa6b7" : kind === "ember" ? "#ff7a3d" : "#ffe7a8";

      this.particles.spawn({
        x,
        y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        radius: 0.8 + jitter(seedBase + i + 91) * 1.8,
        growth: kind === "smoke" ? 0.05 : -0.006,
        lifeMs: kind === "smoke" ? 1100 + radius * 3 : 520 + radius,
        color,
        alpha: kind === "smoke" ? 0.18 : 0.62,
        kind,
        drag: kind === "smoke" ? 0.992 : 0.965,
      });
    }
  }
}

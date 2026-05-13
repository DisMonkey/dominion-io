import { Turn } from "../../core/Schemas";

export interface FixedSimulationSchedulerStats {
  queuedTurns: number;
  fixedStepMs: number;
  interpolationAlpha: number;
  catchUpTurnsThisFrame: number;
}

export interface FixedSimulationSchedulerOptions {
  fixedStepMs: number;
  targetBufferedTurns?: number;
  maxCatchUpTurnsPerFrame?: number;
  maxFrameDeltaMs?: number;
  onTurn: (turn: Turn) => void;
  onFrame?: (stats: FixedSimulationSchedulerStats) => void;
}

export class FixedSimulationScheduler {
  private readonly queue: Turn[] = [];
  private readonly fixedStepMs: number;
  private readonly targetBufferedTurns: number;
  private readonly maxCatchUpTurnsPerFrame: number;
  private readonly maxFrameDeltaMs: number;

  private rafID: number | null = null;
  private running = false;
  private nextReleaseAtMs = 0;
  private lastFrameAtMs = 0;
  private lastReleaseAtMs = 0;

  constructor(private readonly options: FixedSimulationSchedulerOptions) {
    this.fixedStepMs = Math.max(1, options.fixedStepMs);
    this.targetBufferedTurns = options.targetBufferedTurns ?? 1;
    this.maxCatchUpTurnsPerFrame = Math.max(
      1,
      options.maxCatchUpTurnsPerFrame ?? 6,
    );
    this.maxFrameDeltaMs = Math.max(
      this.fixedStepMs,
      options.maxFrameDeltaMs ?? 250,
    );
  }

  start(): void {
    if (this.running) {
      return;
    }
    this.running = true;
    const now = performance.now();
    this.lastFrameAtMs = now;
    this.lastReleaseAtMs = now;
    this.nextReleaseAtMs = now;
    this.rafID = requestAnimationFrame((time) => this.frame(time));
  }

  stop(): void {
    this.running = false;
    if (this.rafID !== null) {
      cancelAnimationFrame(this.rafID);
      this.rafID = null;
    }
    this.queue.length = 0;
  }

  enqueue(turn: Turn): void {
    this.queue.push(turn);
    if (this.running && this.queue.length === 1) {
      this.nextReleaseAtMs = Math.min(this.nextReleaseAtMs, performance.now());
    }
  }

  queuedTurns(): number {
    return this.queue.length;
  }

  private frame(nowMs: number): void {
    if (!this.running) {
      return;
    }

    const frameDeltaMs = Math.min(
      this.maxFrameDeltaMs,
      Math.max(0, nowMs - this.lastFrameAtMs),
    );
    this.lastFrameAtMs = nowMs;

    let catchUpTurnsThisFrame = 0;
    if (this.queue.length > this.targetBufferedTurns) {
      catchUpTurnsThisFrame = this.releaseCatchUpTurns();
    }

    if (this.queue.length > 0 && nowMs >= this.nextReleaseAtMs) {
      this.releaseOne(nowMs);
      this.nextReleaseAtMs = nowMs + this.fixedStepMs;
    }

    const interpolationAlpha = this.computeInterpolationAlpha(nowMs);
    this.options.onFrame?.({
      queuedTurns: this.queue.length,
      fixedStepMs: this.fixedStepMs,
      interpolationAlpha,
      catchUpTurnsThisFrame,
    });

    this.rafID = requestAnimationFrame((time) => this.frame(time));

    if (frameDeltaMs >= this.maxFrameDeltaMs && this.queue.length > 0) {
      this.nextReleaseAtMs = Math.min(this.nextReleaseAtMs, performance.now());
    }
  }

  private releaseCatchUpTurns(): number {
    let released = 0;
    while (
      this.queue.length > this.targetBufferedTurns &&
      released < this.maxCatchUpTurnsPerFrame
    ) {
      this.releaseOne(performance.now());
      released++;
    }
    return released;
  }

  private releaseOne(nowMs: number): void {
    const turn = this.queue.shift();
    if (turn === undefined) {
      return;
    }
    this.lastReleaseAtMs = nowMs;
    this.options.onTurn(turn);
  }

  private computeInterpolationAlpha(nowMs: number): number {
    const elapsed = nowMs - this.lastReleaseAtMs;
    return Math.max(0, Math.min(1, elapsed / this.fixedStepMs));
  }
}

export type ParticleKind =
  | "spark"
  | "smoke"
  | "debris"
  | "shock"
  | "wake"
  | "ember";

export interface ParticleSpawnOptions {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  growth: number;
  lifeMs: number;
  color: string;
  alpha: number;
  kind: ParticleKind;
  drag?: number;
}

class PooledParticle {
  active = false;
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  radius = 1;
  growth = 0;
  ageMs = 0;
  lifeMs = 1;
  alpha = 1;
  color = "#ffffff";
  kind: ParticleKind = "spark";
  drag = 0.985;

  reset(options: ParticleSpawnOptions): void {
    this.active = true;
    this.x = options.x;
    this.y = options.y;
    this.vx = options.vx;
    this.vy = options.vy;
    this.radius = options.radius;
    this.growth = options.growth;
    this.ageMs = 0;
    this.lifeMs = Math.max(1, options.lifeMs);
    this.alpha = options.alpha;
    this.color = options.color;
    this.kind = options.kind;
    this.drag = options.drag ?? 0.985;
  }

  tick(deltaMs: number): boolean {
    this.ageMs += deltaMs;
    if (this.ageMs >= this.lifeMs) {
      this.active = false;
      return false;
    }

    const deltaScale = deltaMs / 16.667;
    this.x += this.vx * deltaScale;
    this.y += this.vy * deltaScale;
    this.vx *= Math.pow(this.drag, deltaScale);
    this.vy *= Math.pow(this.drag, deltaScale);
    this.radius = Math.max(0, this.radius + this.growth * deltaScale);
    return true;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const t = this.ageMs / this.lifeMs;
    const alpha = this.alpha * (1 - t);
    if (alpha <= 0.01 || this.radius <= 0) {
      return;
    }

    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;

    switch (this.kind) {
      case "smoke":
        ctx.beginPath();
        ctx.ellipse(
          this.x,
          this.y,
          this.radius * 1.6,
          this.radius,
          t * Math.PI,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        break;
      case "shock":
        ctx.globalAlpha = alpha * 0.7;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = Math.max(0.5, 1.5 * (1 - t));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case "debris":
        ctx.fillRect(
          this.x - this.radius * 0.5,
          this.y - this.radius * 0.5,
          this.radius,
          this.radius,
        );
        break;
      case "wake":
        ctx.globalAlpha = alpha * 0.55;
        ctx.beginPath();
        ctx.ellipse(
          this.x,
          this.y,
          this.radius * 1.8,
          this.radius * 0.6,
          Math.atan2(this.vy, this.vx),
          0,
          Math.PI * 2,
        );
        ctx.fill();
        break;
      case "ember":
      case "spark":
      default:
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  }
}

export class ParticlePool {
  private particles: PooledParticle[] = [];
  private cursor = 0;
  private activeCountValue = 0;

  constructor(private readonly maxParticles: number) {
    for (let i = 0; i < maxParticles; i++) {
      this.particles.push(new PooledParticle());
    }
  }

  spawn(options: ParticleSpawnOptions): boolean {
    for (let attempts = 0; attempts < this.particles.length; attempts++) {
      const index = (this.cursor + attempts) % this.particles.length;
      const particle = this.particles[index];
      if (!particle.active) {
        particle.reset(options);
        this.cursor = (index + 1) % this.particles.length;
        this.activeCountValue++;
        return true;
      }
    }
    return false;
  }

  clear(): void {
    for (const particle of this.particles) {
      particle.active = false;
    }
    this.activeCountValue = 0;
    this.cursor = 0;
  }

  activeCount(): number {
    return this.activeCountValue;
  }

  render(deltaMs: number, ctx: CanvasRenderingContext2D): void {
    if (this.activeCountValue === 0) {
      return;
    }

    ctx.save();
    for (const particle of this.particles) {
      if (!particle.active) {
        continue;
      }
      if (!particle.tick(deltaMs)) {
        this.activeCountValue--;
        continue;
      }
      particle.draw(ctx);
    }
    ctx.restore();
  }
}

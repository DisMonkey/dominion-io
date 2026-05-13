import { Execution, Game, Player } from "../game/Game";
import { Tech } from "../TechTree";

export class ResearchExecution implements Execution {
  private active = true;
  private mg: Game;

  constructor(
    private readonly player: Player,
    private readonly tech: Tech,
  ) {}

  init(mg: Game): void {
    this.mg = mg;
  }

  tick(): void {
    this.player.startResearch(this.tech, this.mg.ticks());
    this.active = false;
  }

  isActive(): boolean {
    return this.active;
  }

  activeDuringSpawnPhase(): boolean {
    return false;
  }
}

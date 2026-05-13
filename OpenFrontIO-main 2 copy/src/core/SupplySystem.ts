import { Game, Player } from "./game/Game";
import { TileRef } from "./game/GameMap";

export interface SupplyReport {
  tile: TileRef;
  distance: number;
  efficiency: number;
}

export class SupplySystem {
  constructor(private readonly game: Game) {}

  reportFor(
    player: Player,
    capital: TileRef,
    hubs: readonly TileRef[],
  ): SupplyReport[] {
    const sources = [capital, ...hubs];
    const reports: SupplyReport[] = [];
    for (const tile of player.tiles()) {
      const distance = Math.min(
        ...sources.map((source) => this.friendlyDistance(player, source, tile)),
      );
      reports.push({
        tile,
        distance,
        efficiency: this.efficiencyForDistance(distance),
      });
    }
    return reports.sort((a, b) => a.tile - b.tile);
  }

  efficiencyForDistance(distance: number): number {
    if (!Number.isFinite(distance)) return 0.5;
    if (distance <= 8) return 1;
    if (distance >= 15) return 0.5;
    return 1 - ((distance - 8) / 7) * 0.5;
  }

  private friendlyDistance(
    player: Player,
    source: TileRef,
    target: TileRef,
  ): number {
    if (source === target) return 0;
    const visited = new Set<TileRef>([source]);
    let frontier = [source];
    let distance = 0;
    while (frontier.length > 0 && distance <= 15) {
      distance++;
      const next: TileRef[] = [];
      for (const tile of frontier) {
        for (const neighbor of this.game.neighbors(tile)) {
          if (visited.has(neighbor) || this.game.owner(neighbor) !== player) {
            continue;
          }
          if (neighbor === target) {
            return distance;
          }
          visited.add(neighbor);
          next.push(neighbor);
        }
      }
      frontier = next;
    }
    return Infinity;
  }
}

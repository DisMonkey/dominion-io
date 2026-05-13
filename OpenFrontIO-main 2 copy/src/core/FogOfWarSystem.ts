import { Game, Player, PlayerID, UnitType } from "./game/Game";
import { TileRef } from "./game/GameMap";

export enum FogVisibility {
  Hidden = 0,
  Revealed = 1,
  Visible = 2,
}

const TERRITORY_VISION_RADIUS = 2;
const DEFAULT_SCOUT_VISION_RADIUS = 5;

export class FogOfWarSystem {
  private readonly visibilityByPlayer = new Map<PlayerID, Uint8Array>();

  constructor(private readonly game: Game) {}

  updatePlayer(player: Player): Uint8Array {
    const visibility = this.ensurePlayerVisibility(player);

    for (let tile = 0; tile < visibility.length; tile++) {
      if (visibility[tile] === FogVisibility.Visible) {
        visibility[tile] = FogVisibility.Revealed;
      }
    }

    for (const tile of player.tiles()) {
      this.revealArea(visibility, tile, TERRITORY_VISION_RADIUS);
    }

    for (const scout of player.units(UnitType.Scout)) {
      const radius = scout.info().visionRadius ?? DEFAULT_SCOUT_VISION_RADIUS;
      this.revealArea(visibility, scout.tile(), radius);
    }

    return visibility;
  }

  updateAll(): void {
    for (const player of this.game.players()) {
      this.updatePlayer(player);
    }
  }

  visibilityFor(player: Player): Uint8Array {
    return this.ensurePlayerVisibility(player);
  }

  tileVisibility(player: Player, tile: TileRef): FogVisibility {
    return this.ensurePlayerVisibility(player)[tile] ?? FogVisibility.Hidden;
  }

  isVisible(player: Player, tile: TileRef): boolean {
    return this.tileVisibility(player, tile) === FogVisibility.Visible;
  }

  isRevealed(player: Player, tile: TileRef): boolean {
    return this.tileVisibility(player, tile) !== FogVisibility.Hidden;
  }

  shouldHideEnemyTile(player: Player, tile: TileRef): boolean {
    const owner = this.game.owner(tile);
    return (
      owner.isPlayer() && owner !== player && !this.isVisible(player, tile)
    );
  }

  private ensurePlayerVisibility(player: Player): Uint8Array {
    const existing = this.visibilityByPlayer.get(player.id());
    if (existing !== undefined) {
      return existing;
    }
    const visibility = new Uint8Array(this.game.width() * this.game.height());
    this.visibilityByPlayer.set(player.id(), visibility);
    return visibility;
  }

  private revealArea(
    visibility: Uint8Array,
    center: TileRef,
    radius: number,
  ): void {
    for (const tile of this.game.circleSearch(center, radius)) {
      visibility[tile] = FogVisibility.Visible;
    }
  }
}

import { UnitType } from "../../../core/game/Game";
import { TileRef } from "../../../core/game/GameMap";
import { GameView } from "../../../core/game/GameView";
import { TransformHandler } from "../TransformHandler";
import { Layer } from "./Layer";

const TERRITORY_VISION_RADIUS = 2;
const SCOUT_VISION_RADIUS = 5;
const REBUILD_INTERVAL_TICKS = 20;
const UNSEEN_ALPHA = 153;
const EXPLORED_ALPHA = 96;

export class FogOfWarLayer implements Layer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private imageData: ImageData;
  private explored: Uint8Array;
  private visible: Uint8Array;
  private brushOffsets: Array<{ dx: number; dy: number }> = [];
  private lastFullRebuildTick = -Infinity;
  private hasVisiblePlayer = false;

  constructor(
    private game: GameView,
    private transformHandler: TransformHandler,
  ) {
    this.buildBrush();
  }

  shouldTransform(): boolean {
    return true;
  }

  getTickIntervalMs(): number {
    return 125;
  }

  init(): void {
    this.redraw();
  }

  redraw(): void {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.game.width();
    this.canvas.height = this.game.height();
    const context = this.canvas.getContext("2d");
    if (context === null) throw new Error("2d context not supported");
    this.context = context;
    this.imageData = context.createImageData(
      this.canvas.width,
      this.canvas.height,
    );
    this.explored = new Uint8Array(this.game.width() * this.game.height());
    this.visible = new Uint8Array(this.game.width() * this.game.height());
    this.fullRebuild();
  }

  tick(): void {
    const myPlayer = this.game.myPlayer();
    if (!myPlayer || this.game.inSpawnPhase()) {
      if (this.hasVisiblePlayer) {
        this.hasVisiblePlayer = false;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      return;
    }

    this.hasVisiblePlayer = true;
    const tick = this.game.ticks();
    if (tick - this.lastFullRebuildTick >= REBUILD_INTERVAL_TICKS) {
      this.fullRebuild();
      return;
    }

    let changed = false;
    const mySmallID = myPlayer.smallID();
    for (const tile of this.game.recentlyUpdatedTiles()) {
      if (this.game.ownerID(tile) === mySmallID) {
        this.revealAround(tile, TERRITORY_VISION_RADIUS);
        changed = true;
      }
    }

    if (changed) {
      this.paintFog();
    }
  }

  renderLayer(context: CanvasRenderingContext2D): void {
    if (!this.hasVisiblePlayer) {
      return;
    }

    const mapW = this.game.width();
    const mapH = this.game.height();
    const [topLeft, bottomRight] = this.transformHandler.screenBoundingRect();
    const left = Math.max(0, Math.floor(topLeft.x));
    const top = Math.max(0, Math.floor(topLeft.y));
    const right = Math.min(mapW, Math.ceil(bottomRight.x));
    const bottom = Math.min(mapH, Math.ceil(bottomRight.y));
    const width = Math.max(0, right - left);
    const height = Math.max(0, bottom - top);
    if (width === 0 || height === 0) {
      return;
    }

    context.drawImage(
      this.canvas,
      left,
      top,
      width,
      height,
      -mapW / 2 + left,
      -mapH / 2 + top,
      width,
      height,
    );
  }

  private fullRebuild(): void {
    const myPlayer = this.game.myPlayer();
    this.visible.fill(0);
    this.lastFullRebuildTick = this.game.ticks();

    if (!myPlayer || this.game.inSpawnPhase()) {
      this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.hasVisiblePlayer = false;
      return;
    }

    const mySmallID = myPlayer.smallID();
    this.game.forEachTile((tile) => {
      if (this.game.ownerID(tile) === mySmallID) {
        this.revealAround(tile, TERRITORY_VISION_RADIUS);
      }
    });
    for (const scout of myPlayer.units(UnitType.Scout)) {
      this.revealAround(scout.tile(), SCOUT_VISION_RADIUS);
    }
    this.hasVisiblePlayer = true;
    this.paintFog();
  }

  private revealAround(tile: TileRef, radius: number): void {
    const centerX = this.game.x(tile);
    const centerY = this.game.y(tile);
    const radiusSquared = radius * radius;

    for (const offset of this.brushOffsets) {
      if (offset.dx * offset.dx + offset.dy * offset.dy > radiusSquared) {
        continue;
      }
      const x = centerX + offset.dx;
      const y = centerY + offset.dy;
      if (!this.game.isValidCoord(x, y)) {
        continue;
      }
      const ref = this.game.ref(x, y);
      this.visible[ref] = 1;
      this.explored[ref] = 1;
    }
  }

  private paintFog(): void {
    const data = this.imageData.data;
    for (let tile = 0; tile < this.visible.length; tile++) {
      const offset = tile * 4;
      data[offset] = 1;
      data[offset + 1] = 6;
      data[offset + 2] = 14;
      data[offset + 3] = this.visible[tile]
        ? 0
        : this.explored[tile]
          ? EXPLORED_ALPHA
          : UNSEEN_ALPHA;
    }
    this.context.putImageData(this.imageData, 0, 0);
  }

  private buildBrush(): void {
    const radiusSquared = SCOUT_VISION_RADIUS * SCOUT_VISION_RADIUS;
    for (let dy = -SCOUT_VISION_RADIUS; dy <= SCOUT_VISION_RADIUS; dy++) {
      for (let dx = -SCOUT_VISION_RADIUS; dx <= SCOUT_VISION_RADIUS; dx++) {
        if (dx * dx + dy * dy <= radiusSquared) {
          this.brushOffsets.push({ dx, dy });
        }
      }
    }
  }
}

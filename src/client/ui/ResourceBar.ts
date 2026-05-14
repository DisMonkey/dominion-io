import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { UnitType } from "../../core/game/Game";
import { GameView } from "../../core/game/GameView";

@customElement("dominion-resource-bar")
export class ResourceBar extends LitElement {
  @property({ attribute: false }) game: GameView | null = null;

  private _interval: ReturnType<typeof setInterval> | null = null;

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this._interval = setInterval(() => this.requestUpdate(), 500);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  render() {
    const player = this.game?.myPlayer();
    if (!player || !player.isAlive()) return html``;

    const gold = Number(player.gold());
    const troops = player.troops();
    const tiles = player.numTilesOwned();
    const factories = player
      .units(UnitType.Factory)
      .filter((u) => !u.isUnderConstruction()).length;
    const cities = player
      .units(UnitType.City)
      .filter((u) => !u.isUnderConstruction()).length;

    const fmt = (n: number) =>
      n >= 1_000_000
        ? `${(n / 1_000_000).toFixed(1)}M`
        : n >= 1_000
          ? `${(n / 1_000).toFixed(1)}K`
          : `${n}`;

    const item = (icon: string, label: string, value: string) => html`
      <div
        class="flex items-center gap-1.5 px-2 py-1 rounded bg-black/50 border border-white/10 text-white tabular-nums text-xs leading-none"
        title=${label}
      >
        <span class="text-[11px]">${icon}</span>
        <span class="font-mono">${value}</span>
      </div>
    `;

    return html`
      <div
        class="flex flex-wrap items-center gap-1 pointer-events-none"
        aria-label="Resources"
      >
        ${item("⌖", "Territory", fmt(tiles))}
        ${item("⚔️", "Troops", fmt(troops))}
        ${item("¤", "Gold", fmt(gold))}
        ${item("🏭", "Factories", `${factories}`)}
        ${item("🏙️", "Cities", `${cities}`)}
      </div>
    `;
  }
}

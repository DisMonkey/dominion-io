import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { GameView } from "../../../core/game/GameView";
import { crazyGamesSDK } from "../../CrazyGamesSDK";
import { Layer } from "./Layer";

@customElement("in-game-promo")
export class InGamePromo extends LitElement implements Layer {
  public game: GameView;

  private cornerAdShown: boolean = false;

  createRenderRoot() {
    return this;
  }

  init() {}

  tick() {
    if (!this.game.inSpawnPhase() && !this.cornerAdShown) {
      this.cornerAdShown = true;
      this.showAd();
    }
  }

  private showAd(): void {
    if (!crazyGamesSDK.isOnCrazyGames()) return;
    if (window.innerWidth < 1100) return;
    if (window.innerHeight < 750) return;
    this.showCrazyGamesAd();
  }

  private showCrazyGamesAd(): void {
    if (!crazyGamesSDK.isReady()) return;
    this.requestUpdate();
    this.updateComplete.then(() => {
      crazyGamesSDK.createBottomLeftAd();
    });
  }

  public hideAd(): void {
    if (crazyGamesSDK.isOnCrazyGames()) {
      crazyGamesSDK.clearBottomLeftAd();
    }
    this.requestUpdate();
  }

  shouldTransform(): boolean {
    return false;
  }

  render() {
    return html``;
  }
}

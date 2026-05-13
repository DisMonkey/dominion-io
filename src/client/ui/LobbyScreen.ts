import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { DominionGameModeDefinitions } from "../../core/GameMode";

@customElement("dominion-lobby-screen")
export class LobbyScreen extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <section class="grid gap-3 md:grid-cols-2" aria-label="Game modes">
        ${Object.values(DominionGameModeDefinitions).map(
          (mode) => html`
            <button
              class="rounded border border-dominion-border bg-dominion-bg-panel/85 p-4 text-left text-dominion-text-light hover:border-malibu-blue focus:outline-none focus:ring"
              aria-label=${`Select ${mode.title}`}
            >
              <h3 class="text-lg font-bold uppercase tracking-widest">
                ${mode.title}
              </h3>
              <p class="text-sm text-dominion-text-muted">
                ${mode.winCondition}
              </p>
            </button>
          `,
        )}
      </section>
    `;
  }
}

import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { assetUrl } from "../../core/AssetUrls";
import "./CosmeticsScreen";

@customElement("dominion-main-menu")
export class MainMenu extends LitElement {
  @property({ type: Number }) onlinePlayers = 0;
  @property() version = "v1.0.0";
  @state() private showCosmetics = false;

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <main
        class="relative grid min-h-screen place-items-center overflow-hidden bg-dominion-bg-dark text-dominion-text-light"
        aria-label="Dominion.io main menu"
      >
        <div
          class="absolute inset-0 bg-cover bg-center opacity-40"
          style="background-image:url('${assetUrl(
            "images/DominionBackground.svg",
          )}')"
        ></div>
        <section
          class="relative z-10 grid w-full max-w-xl gap-5 px-4 text-center"
        >
          <img
            class="mx-auto h-28 w-auto"
            src=${assetUrl("images/DominionLogo.svg")}
            alt="Dominion.io"
          />
          <nav class="grid gap-2" aria-label="Main actions">
            ${[
              "PLAY NOW",
              "GAME MODES",
              "HOW TO PLAY",
              "LEADERBOARD",
              "SETTINGS",
            ].map(
              (label) => html`
                <button
                  class="rounded border border-dominion-border bg-dominion-bg-panel/85 px-5 py-3 font-bold tracking-widest hover:border-malibu-blue focus:outline-none focus:ring"
                >
                  ${label}
                </button>
              `,
            )}
            <button
              class="rounded border border-dominion-border bg-dominion-bg-panel/85 px-5 py-3 font-bold tracking-widest hover:border-malibu-blue focus:outline-none focus:ring"
              aria-label="Open cosmetics screen"
              @click=${() => {
                this.showCosmetics = true;
              }}
            >
              COSMETICS
            </button>
          </nav>
          <footer
            class="flex flex-wrap justify-center gap-4 text-sm text-dominion-text-muted"
          >
            <span>${this.onlinePlayers.toLocaleString()} online</span>
            <span>${this.version}</span>
            <span>Dominion.io — Free to play. Always.</span>
            <a
              class="hover:text-dominion-text-light text-xs"
              href="https://github.com/openfrontio/OpenFrontIO"
              target="_blank"
              rel="noopener"
            >
              Based on OpenFront.io
            </a>
          </footer>
        </section>
      </main>

      ${this.showCosmetics
        ? html`
            <div
              class="fixed inset-0 z-50 flex flex-col bg-dominion-bg-dark"
              role="dialog"
              aria-modal="true"
              aria-label="Cosmetics"
            >
              <div class="flex items-center border-b border-dominion-border px-4 py-2">
                <button
                  class="mr-4 rounded border border-dominion-border px-3 py-1 text-sm text-dominion-text-muted hover:text-dominion-text-light focus:outline-none focus:ring"
                  aria-label="Close cosmetics"
                  @click=${() => {
                    this.showCosmetics = false;
                  }}
                >
                  ← Back
                </button>
              </div>
              <div class="flex-1 overflow-hidden">
                <dominion-cosmetics-screen
                  class="flex h-full flex-col"
                ></dominion-cosmetics-screen>
              </div>
            </div>
          `
        : nothing}
    `;
  }
}

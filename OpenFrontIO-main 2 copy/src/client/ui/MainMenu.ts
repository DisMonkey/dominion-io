import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { assetUrl } from "../../core/AssetUrls";
import "./CosmeticsScreen";
import "./LeaderboardScreen";
import "./SettingsPanel";
import type { LeaderboardRow } from "./LeaderboardScreen";

type ActivePanel = "cosmetics" | "leaderboard" | "settings" | null;

@customElement("dominion-main-menu")
export class MainMenu extends LitElement {
  @property({ type: Number }) onlinePlayers = 0;
  @property() version = "v1.0.0";
  @state() private activePanel: ActivePanel = null;
  @state() private leaderboardRows: LeaderboardRow[] = [];
  @state() private leaderboardLoading = false;

  createRenderRoot() {
    return this;
  }

  private openPanel(panel: ActivePanel) {
    this.activePanel = panel;
    if (panel === "leaderboard") {
      void this.fetchLeaderboard();
    }
  }

  private closePanel() {
    this.activePanel = null;
  }

  private async fetchLeaderboard() {
    this.leaderboardLoading = true;
    try {
      const res = await fetch("/api/leaderboard?limit=50");
      if (res.ok) {
        const data = (await res.json()) as { players: LeaderboardRow[] };
        this.leaderboardRows = data.players ?? [];
      }
    } catch {
      // silently fail — show empty state
    } finally {
      this.leaderboardLoading = false;
    }
  }

  render() {
    return html`
      <main
        class="relative grid min-h-screen place-items-center overflow-hidden bg-dominion-bg-dark text-dominion-text-light"
        aria-label="Dominion.io main menu"
      >
        <!-- Animated scanline overlay -->
        <div
          class="pointer-events-none absolute inset-0 z-0 opacity-5"
          style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)"
        ></div>
        <!-- Background map -->
        <div
          class="absolute inset-0 bg-cover bg-center opacity-30"
          style="background-image:url('${assetUrl(
            "images/DominionBackground.svg",
          )}')"
        ></div>

        <section
          class="relative z-10 grid w-full max-w-sm gap-4 px-4 text-center sm:max-w-xl sm:gap-5"
        >
          <img
            class="mx-auto h-20 w-auto sm:h-28"
            src=${assetUrl("images/DominionLogo.svg")}
            alt="Dominion.io"
          />

          <nav class="grid gap-2" aria-label="Main actions">
            ${this.renderMenuButton("PLAY NOW", "play-now-button", () =>
              this.dispatchEvent(new CustomEvent("play-now", { bubbles: true })),
            )}
            ${this.renderMenuButton("GAME MODES", "game-modes-button", () =>
              this.dispatchEvent(
                new CustomEvent("game-modes", { bubbles: true }),
              ),
            )}
            ${this.renderMenuButton("HOW TO PLAY", "how-to-play-button", () =>
              this.dispatchEvent(
                new CustomEvent("how-to-play", { bubbles: true }),
              ),
            )}
            ${this.renderMenuButton("LEADERBOARD", "leaderboard-button", () =>
              this.openPanel("leaderboard"),
            )}
            ${this.renderMenuButton("COSMETICS", "cosmetics-button", () =>
              this.openPanel("cosmetics"),
            )}
            ${this.renderMenuButton("SETTINGS", "settings-button", () =>
              this.openPanel("settings"),
            )}
          </nav>

          <footer
            class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-dominion-text-muted sm:text-sm"
          >
            <span>${this.onlinePlayers.toLocaleString()} online</span>
            <span>${this.version}</span>
            <span>Free to play. Always.</span>
            <a
              class="underline hover:text-dominion-text-light"
              href="https://github.com/openfrontio/OpenFrontIO"
              target="_blank"
              rel="noopener"
            >
              Based on OpenFront.io
            </a>
          </footer>
        </section>
      </main>

      ${this.activePanel ? this.renderOverlay() : nothing}
    `;
  }

  private renderMenuButton(
    label: string,
    id: string,
    onClick: () => void,
  ) {
    return html`
      <button
        id=${id}
        class="w-full rounded border border-dominion-border bg-dominion-bg-panel/85 px-5 py-3 text-sm font-bold tracking-widest transition-colors hover:border-malibu-blue hover:text-malibu-blue focus:outline-none focus:ring focus:ring-malibu-blue sm:text-base"
        @click=${onClick}
      >
        ${label}
      </button>
    `;
  }

  private renderOverlay() {
    const titles: Record<NonNullable<ActivePanel>, string> = {
      cosmetics: "Cosmetics",
      leaderboard: "Leaderboard",
      settings: "Settings",
    };

    return html`
      <div
        class="fixed inset-0 z-50 flex flex-col bg-dominion-bg-dark"
        role="dialog"
        aria-modal="true"
        aria-label=${titles[this.activePanel!]}
      >
        <!-- Back bar -->
        <div
          class="flex items-center gap-3 border-b border-dominion-border px-4 py-3"
        >
          <button
            class="rounded border border-dominion-border px-3 py-1 text-sm text-dominion-text-muted transition-colors hover:border-malibu-blue hover:text-dominion-text-light focus:outline-none focus:ring"
            aria-label="Back to main menu"
            @click=${this.closePanel}
          >
            ← Back
          </button>
          <h2
            class="font-display text-lg font-bold uppercase tracking-widest text-malibu-blue"
          >
            ${titles[this.activePanel!]}
          </h2>
        </div>

        <!-- Panel content -->
        <div class="flex-1 overflow-hidden">
          ${this.activePanel === "cosmetics"
            ? html`<dominion-cosmetics-screen
                class="flex h-full flex-col"
              ></dominion-cosmetics-screen>`
            : nothing}
          ${this.activePanel === "leaderboard"
            ? html`<div class="h-full overflow-y-auto p-4">
                ${this.leaderboardLoading
                  ? html`<p class="text-center text-dominion-text-muted py-12">
                      Loading…
                    </p>`
                  : this.leaderboardRows.length === 0
                    ? html`<p class="text-center text-dominion-text-muted py-12">
                        No data yet. Play some games!
                      </p>`
                    : html`<dominion-leaderboard-screen
                        .rows=${this.leaderboardRows}
                        class="block"
                      ></dominion-leaderboard-screen>`}
                <div class="mt-4 text-center">
                  <button
                    class="rounded border border-dominion-border px-4 py-2 text-sm text-dominion-text-muted hover:border-malibu-blue hover:text-dominion-text-light focus:outline-none focus:ring"
                    aria-label="Refresh leaderboard"
                    @click=${() => void this.fetchLeaderboard()}
                  >
                    ↻ Refresh
                  </button>
                </div>
              </div>`
            : nothing}
          ${this.activePanel === "settings"
            ? html`<div class="h-full overflow-y-auto p-4">
                <dominion-settings-panel
                  class="block"
                ></dominion-settings-panel>
              </div>`
            : nothing}
        </div>
      </div>
    `;
  }
}

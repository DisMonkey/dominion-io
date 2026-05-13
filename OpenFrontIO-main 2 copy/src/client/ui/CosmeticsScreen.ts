import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  ERA_LABELS,
  FLAG_ERAS_IN_ORDER,
  FlagDefinition,
  FlagEra,
  HistoricalFlags,
  TerritoryThemes,
  flagsByEra,
  searchFlags,
} from "../../core/cosmetics/FlagRegistry";
import { assetUrl } from "../../core/AssetUrls";

@customElement("dominion-cosmetics-screen")
export class CosmeticsScreen extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property({ type: String }) selectedFlagId: string | null = null;
  @property({ type: String }) selectedThemeId: string | null = null;

  @state() private activeTab: "flags" | "colors" = "flags";
  @state() private activeEra: FlagEra | "all" = "all";
  @state() private searchQuery = "";
  @state() private previewFlag: FlagDefinition | null = null;

  private get displayedFlags(): FlagDefinition[] {
    if (this.searchQuery.trim()) {
      return searchFlags(this.searchQuery);
    }
    if (this.activeEra === "all") return HistoricalFlags;
    return flagsByEra(this.activeEra);
  }

  private selectFlag(flag: FlagDefinition) {
    this.selectedFlagId = flag.id;
    localStorage.setItem("dominion_flag", `flag:${flag.id}`);
    this.dispatchEvent(
      new CustomEvent("flag-selected", { detail: flag, bubbles: true }),
    );
  }

  private selectTheme(themeId: string) {
    this.selectedThemeId = themeId;
    localStorage.setItem("dominion_territory_theme", themeId);
    this.dispatchEvent(
      new CustomEvent("theme-selected", {
        detail: { themeId },
        bubbles: true,
      }),
    );
  }

  render() {
    return html`
      <div
        class="flex flex-col h-full bg-dominion-bg-dark text-dominion-text-light"
        role="main"
        aria-label="Cosmetics selection"
      >
        <!-- Header -->
        <header
          class="flex items-center justify-between border-b border-dominion-border px-6 py-4"
        >
          <h1
            class="font-display text-2xl font-bold uppercase tracking-widest text-malibu-blue"
          >
            Cosmetics
          </h1>
          <p class="text-sm text-dominion-text-muted">
            Everything free. Always.
          </p>
        </header>

        <!-- Tab Bar -->
        <div
          class="flex border-b border-dominion-border"
          role="tablist"
          aria-label="Cosmetics categories"
        >
          ${(["flags", "colors"] as const).map(
            (tab) => html`
              <button
                role="tab"
                aria-selected=${this.activeTab === tab}
                class=${`px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors focus:outline-none focus:ring
                  ${
                    this.activeTab === tab
                      ? "border-b-2 border-malibu-blue text-malibu-blue"
                      : "text-dominion-text-muted hover:text-dominion-text-light"
                  }`}
                @click=${() => {
                  this.activeTab = tab;
                }}
              >
                ${tab === "flags" ? "🏴 Flags" : "🎨 Territory Colors"}
              </button>
            `,
          )}
        </div>

        <!-- FLAGS TAB -->
        ${this.activeTab === "flags" ? this.renderFlagsTab() : nothing}

        <!-- COLORS TAB -->
        ${this.activeTab === "colors" ? this.renderColorsTab() : nothing}
      </div>
    `;
  }

  private renderFlagsTab() {
    return html`
      <div class="flex flex-col flex-1 overflow-hidden">
        <!-- Era filter + Search -->
        <div
          class="flex flex-wrap gap-2 border-b border-dominion-border px-4 py-3"
        >
          <input
            type="search"
            placeholder="Search flags…"
            aria-label="Search flags"
            class="flex-1 min-w-40 rounded border border-dominion-border bg-dominion-bg-panel px-3 py-1.5 text-sm text-dominion-text-light placeholder-dominion-text-muted focus:border-malibu-blue focus:outline-none"
            .value=${this.searchQuery}
            @input=${(e: Event) => {
              this.searchQuery = (e.target as HTMLInputElement).value;
              this.activeEra = "all";
            }}
          />
          <div class="flex flex-wrap gap-1" role="group" aria-label="Era filter">
            <button
              class=${`rounded px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring
                ${this.activeEra === "all" ? "bg-malibu-blue text-dominion-bg-dark" : "border border-dominion-border text-dominion-text-muted hover:text-dominion-text-light"}`}
              aria-pressed=${this.activeEra === "all"}
              @click=${() => {
                this.activeEra = "all";
                this.searchQuery = "";
              }}
            >
              All
            </button>
            ${FLAG_ERAS_IN_ORDER.map(
              (era) => html`
                <button
                  class=${`rounded px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring
                    ${this.activeEra === era ? "bg-malibu-blue text-dominion-bg-dark" : "border border-dominion-border text-dominion-text-muted hover:text-dominion-text-light"}`}
                  aria-pressed=${this.activeEra === era}
                  @click=${() => {
                    this.activeEra = era;
                    this.searchQuery = "";
                  }}
                >
                  ${ERA_LABELS[era]}
                </button>
              `,
            )}
          </div>
        </div>

        <div class="flex flex-1 overflow-hidden">
          <!-- Flag Grid -->
          <div
            class="flex-1 overflow-y-auto p-4"
            role="listbox"
            aria-label="Available flags"
          >
            ${this.displayedFlags.length === 0
              ? html`<p class="text-center text-dominion-text-muted py-12">
                  No flags found for "${this.searchQuery}"
                </p>`
              : html`
                  <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    ${this.displayedFlags.map((flag) => this.renderFlagCard(flag))}
                  </div>
                `}
          </div>

          <!-- Preview Panel -->
          ${this.previewFlag
            ? html`
                <aside
                  class="hidden md:flex w-56 flex-col border-l border-dominion-border p-4 gap-4"
                  aria-label="Flag preview"
                >
                  <div
                    class="aspect-[3/2] w-full rounded border border-dominion-border overflow-hidden bg-dominion-bg-panel"
                  >
                    <img
                      src=${assetUrl(this.previewFlag.svgPath)}
                      alt=${this.previewFlag.name}
                      class="w-full h-full object-cover"
                      onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
                    />
                    <div
                      class="hidden w-full h-full items-center justify-center text-4xl"
                    >
                      🏴
                    </div>
                  </div>
                  <h3 class="font-bold text-sm text-dominion-text-light">
                    ${this.previewFlag.name}
                  </h3>
                  <p class="text-xs text-dominion-text-muted">
                    ${ERA_LABELS[this.previewFlag.era]}
                  </p>
                  ${this.previewFlag.historicalFact
                    ? html`<p
                        class="text-xs text-dominion-text-muted italic border-t border-dominion-border pt-3"
                      >
                        "${this.previewFlag.historicalFact}"
                      </p>`
                    : nothing}
                  <button
                    class="mt-auto rounded border border-malibu-blue bg-malibu-blue/10 px-4 py-2 text-sm font-bold text-malibu-blue hover:bg-malibu-blue hover:text-dominion-bg-dark focus:outline-none focus:ring transition-colors"
                    @click=${() =>
                      this.previewFlag && this.selectFlag(this.previewFlag)}
                    aria-label=${`Select ${this.previewFlag.name} flag`}
                  >
                    ${this.selectedFlagId === this.previewFlag.id
                      ? "✓ Selected"
                      : "Select Flag"}
                  </button>
                </aside>
              `
            : nothing}
        </div>
      </div>
    `;
  }

  private renderFlagCard(flag: FlagDefinition) {
    const isSelected = this.selectedFlagId === flag.id;
    const isPreviewed = this.previewFlag?.id === flag.id;

    return html`
      <button
        role="option"
        aria-selected=${isSelected}
        aria-label=${flag.name}
        class=${`relative flex flex-col items-center gap-1.5 rounded border p-2 transition-all focus:outline-none focus:ring
          ${isSelected ? "border-malibu-blue bg-malibu-blue/10" : ""}
          ${isPreviewed && !isSelected ? "border-white/30 bg-white/5" : ""}
          ${!isSelected && !isPreviewed ? "border-dominion-border hover:border-white/30 hover:bg-white/5" : ""}`}
        @click=${() => this.selectFlag(flag)}
        @mouseenter=${() => {
          this.previewFlag = flag;
        }}
      >
        ${isSelected
          ? html`<span
              class="absolute top-1 right-1 text-malibu-blue text-xs leading-none"
              >✓</span
            >`
          : nothing}
        <div
          class="w-full aspect-[3/2] rounded overflow-hidden bg-dominion-bg-panel border border-white/10"
        >
          <img
            src=${assetUrl(flag.svgPath)}
            alt=${flag.name}
            class="w-full h-full object-cover"
            loading="lazy"
            onerror="this.parentElement.innerHTML='<div style=&quot;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;&quot;>🏴</div>'"
          />
        </div>
        <span class="text-center text-xs text-dominion-text-muted leading-tight line-clamp-2">
          ${flag.name}
        </span>
      </button>
    `;
  }

  private renderColorsTab() {
    return html`
      <div class="flex-1 overflow-y-auto p-6">
        <p class="text-sm text-dominion-text-muted mb-6">
          Choose how your territory looks on the map.
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          ${TerritoryThemes.map(
            (theme) => html`
              <button
                role="option"
                aria-selected=${this.selectedThemeId === theme.id}
                aria-label=${`Select ${theme.name} territory color`}
                class=${`flex flex-col items-center gap-2 rounded border p-3 transition-all focus:outline-none focus:ring
                  ${
                    this.selectedThemeId === theme.id
                      ? "border-malibu-blue bg-malibu-blue/10"
                      : "border-dominion-border hover:border-white/30 hover:bg-white/5"
                  }`}
                @click=${() => this.selectTheme(theme.id)}
              >
                <div
                  class="w-16 h-10 rounded border border-white/20 shadow-lg"
                  style="background-color: ${theme.color}"
                  aria-hidden="true"
                ></div>
                <span class="text-xs text-dominion-text-muted text-center">
                  ${theme.name}
                </span>
                ${this.selectedThemeId === theme.id
                  ? html`<span class="text-xs text-malibu-blue font-bold">✓ Active</span>`
                  : nothing}
              </button>
            `,
          )}
        </div>
      </div>
    `;
  }
}

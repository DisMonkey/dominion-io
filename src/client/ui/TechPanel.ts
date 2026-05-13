import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { TechDefinitions } from "../../core/TechTree";

@customElement("dominion-tech-panel")
export class TechPanel extends LitElement {
  @state() private collapsed = true;

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <aside
        class="rounded border border-dominion-border bg-dominion-bg-panel/85 p-3 text-dominion-text-light backdrop-blur-md"
        aria-label="Tech tree"
      >
        <button
          class="w-full text-left font-semibold uppercase tracking-widest text-malibu-blue"
          aria-expanded=${String(!this.collapsed)}
          @click=${() => (this.collapsed = !this.collapsed)}
        >
          Tech Tree
        </button>
        <div class=${this.collapsed ? "hidden" : "grid gap-2 pt-3"}>
          ${Object.values(TechDefinitions).map(
            (tech) => html`
              <button
                class="rounded border border-white/10 p-2 text-left hover:border-malibu-blue focus:outline-none focus:ring"
                aria-label=${`Research ${tech.tech}`}
              >
                <div class="font-semibold">${tech.tech.replace(/_/g, " ")}</div>
                <div class="text-sm text-dominion-text-muted">
                  ${tech.description}
                </div>
              </button>
            `,
          )}
        </div>
      </aside>
    `;
  }
}

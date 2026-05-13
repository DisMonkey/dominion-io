import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AbilityDefinitions } from "../../core/abilities/Abilities";

@customElement("dominion-ability-bar")
export class AbilityBar extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <nav
        class="flex max-w-full gap-2 overflow-x-auto rounded border border-dominion-border bg-dominion-bg-panel/85 p-2 backdrop-blur-md"
        aria-label="Abilities"
      >
        ${Object.values(AbilityDefinitions).map(
          (ability) => html`
            <button
              class="min-w-24 rounded border border-white/10 px-3 py-2 text-dominion-text-light hover:border-malibu-blue focus:outline-none focus:ring"
              aria-label=${`Activate ${ability.type}`}
            >
              <span class="block text-sm font-semibold uppercase">
                ${ability.type.replace(/_/g, " ")}
              </span>
              <span class="text-xs text-dominion-text-muted">
                ${Math.round(ability.cooldownTicks / 10)}s
              </span>
            </button>
          `,
        )}
      </nav>
    `;
  }
}

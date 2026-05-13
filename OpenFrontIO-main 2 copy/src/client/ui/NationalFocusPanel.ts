import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { NationalFocusDefinitions } from "../../core/NationalFocus";

@customElement("dominion-national-focus-panel")
export class NationalFocusPanel extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <section
        class="grid gap-2 rounded border border-dominion-border bg-dominion-bg-panel/85 p-3 text-dominion-text-light backdrop-blur-md md:grid-cols-2"
        aria-label="National focus tree"
      >
        ${Object.values(NationalFocusDefinitions).map(
          (focus) => html`
            <button
              class="rounded border border-white/10 p-2 text-left hover:border-malibu-blue focus:outline-none focus:ring"
              aria-label=${`Start ${focus.focus}`}
            >
              <span class="block text-xs uppercase text-malibu-blue">
                ${focus.branch}
              </span>
              <span class="font-semibold"
                >${focus.focus.replace(/_/g, " ")}</span
              >
              <span class="block text-sm text-dominion-text-muted">
                ${focus.effect}
              </span>
            </button>
          `,
        )}
      </section>
    `;
  }
}

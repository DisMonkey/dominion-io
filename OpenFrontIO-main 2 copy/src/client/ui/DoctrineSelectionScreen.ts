import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { DoctrineDefinitions } from "../../core/Doctrine";

@customElement("dominion-doctrine-selection")
export class DoctrineSelectionScreen extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <section class="grid gap-3 md:grid-cols-4" aria-label="Military doctrine">
        ${Object.entries(DoctrineDefinitions).map(
          ([doctrine, modifiers]) => html`
            <button
              class="rounded border border-dominion-border bg-dominion-bg-panel/85 p-4 text-left text-dominion-text-light hover:border-malibu-blue focus:outline-none focus:ring"
              aria-label=${`Choose ${doctrine}`}
            >
              <h3 class="font-bold uppercase tracking-widest">
                ${doctrine.replace(/_/g, " ")}
              </h3>
              <p class="mt-2 text-sm text-dominion-text-muted">
                ${Object.entries(modifiers)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(" · ")}
              </p>
            </button>
          `,
        )}
      </section>
    `;
  }
}

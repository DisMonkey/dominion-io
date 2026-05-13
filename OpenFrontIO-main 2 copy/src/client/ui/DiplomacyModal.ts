import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { DiplomaticAgreementLevel } from "../../core/Diplomacy";

@customElement("dominion-diplomacy-modal")
export class DiplomacyModal extends LitElement {
  @property({ type: Boolean }) open = false;

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <dialog
        class="rounded border border-dominion-border bg-dominion-bg-panel p-4 text-dominion-text-light"
        ?open=${this.open}
        aria-label="Diplomacy"
      >
        <h2 class="mb-3 text-xl font-bold uppercase tracking-widest">
          Diplomacy
        </h2>
        <div class="grid gap-2">
          ${Object.values(DiplomaticAgreementLevel).map(
            (level) => html`
              <button
                class="rounded border border-white/10 px-3 py-2 text-left hover:border-malibu-blue focus:outline-none focus:ring"
              >
                ${level.replace(/_/g, " ")}
              </button>
            `,
          )}
        </div>
      </dialog>
    `;
  }
}

import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("dominion-event-popup")
export class EventPopup extends LitElement {
  @property() title = "";
  @property() description = "";
  @property({ type: Array }) choices: string[] = [];

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <dialog
        open
        class="rounded border border-dominion-border bg-dominion-bg-panel p-5 text-dominion-text-light shadow-xl"
        aria-label=${this.title || "World event"}
      >
        <h2
          class="text-2xl font-bold uppercase tracking-widest text-malibu-blue"
        >
          ${this.title}
        </h2>
        <p class="my-3 text-dominion-text-muted">${this.description}</p>
        <div class="flex flex-wrap gap-2">
          ${this.choices.map(
            (choice) => html`
              <button class="rounded border border-white/10 px-3 py-2">
                ${choice}
              </button>
            `,
          )}
        </div>
      </dialog>
    `;
  }
}

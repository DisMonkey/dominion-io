import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("dominion-event-log")
export class EventLog extends LitElement {
  @property({ type: Array }) events: string[] = [];

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <section
        class="rounded border border-dominion-border bg-dominion-bg-panel/85 p-3 text-dominion-text-light"
        aria-label="Event log"
      >
        <h2 class="mb-2 font-bold uppercase tracking-widest text-malibu-blue">
          Event Log
        </h2>
        <ol class="grid gap-1 text-sm text-dominion-text-muted">
          ${this.events.map((event) => html`<li>${event}</li>`)}
        </ol>
      </section>
    `;
  }
}

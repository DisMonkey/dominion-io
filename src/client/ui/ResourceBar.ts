import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("dominion-resource-bar")
export class ResourceBar extends LitElement {
  @property({ type: Number }) territory = 0;
  @property({ type: Number }) population = 0;
  @property({ type: Number }) gold = 0;
  @property({ type: Number }) production = 0;
  @property({ type: Number }) energy = 0;
  @property({ type: Number }) politicalPower = 0;

  createRenderRoot() {
    return this;
  }

  render() {
    const item = (icon: string, label: string, value: number) => html`
      <div
        class="flex items-center gap-2 px-3 py-2 rounded border border-dominion-border bg-dominion-bg-panel/80 tabular-nums"
        aria-label=${label}
      >
        <span aria-hidden="true">${icon}</span>
        <span>${value.toLocaleString()}</span>
      </div>
    `;
    return html`
      <section
        class="flex flex-wrap items-center gap-2 text-dominion-text-light"
        aria-label="Resources"
      >
        ${item("⌖", "Territory", this.territory)}
        ${item("👥", "Population", this.population)}
        ${item("¤", "Gold", this.gold)}
        ${item("▣", "Production", this.production)}
        ${item("⚡", "Energy", this.energy)}
        ${item("PP", "Political Power", this.politicalPower)}
      </section>
    `;
  }
}

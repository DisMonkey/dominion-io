import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AgentMission } from "../../core/IntelSystem";

@customElement("dominion-intel-panel")
export class IntelPanel extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <aside
        class="rounded border border-dominion-border bg-dominion-bg-panel/85 p-3 text-dominion-text-light"
        aria-label="Intelligence agency"
      >
        <h2 class="mb-2 font-bold uppercase tracking-widest text-malibu-blue">
          Intelligence
        </h2>
        <div class="grid gap-2">
          ${Object.values(AgentMission).map(
            (mission) => html`
              <button
                class="rounded border border-white/10 px-3 py-2 text-left hover:border-malibu-blue focus:outline-none focus:ring"
              >
                ${mission.replace(/_/g, " ")}
              </button>
            `,
          )}
        </div>
      </aside>
    `;
  }
}

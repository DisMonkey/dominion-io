import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("dominion-settings-panel")
export class SettingsPanel extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <form
        class="grid gap-4 rounded border border-dominion-border bg-dominion-bg-panel p-4 text-dominion-text-light"
        aria-label="Settings"
      >
        <fieldset class="grid gap-2">
          <legend class="font-bold uppercase tracking-widest text-malibu-blue">
            Graphics
          </legend>
          <label><input type="checkbox" checked /> Particle effects</label>
          <label>
            Animation quality
            <select
              class="ml-2 rounded bg-dominion-bg-dark text-dominion-text-light"
            >
              <option>Low</option>
              <option selected>Medium</option>
              <option>High</option>
            </select>
          </label>
          <label><input type="checkbox" /> Color blind mode</label>
        </fieldset>
        <fieldset class="grid gap-2">
          <legend class="font-bold uppercase tracking-widest text-malibu-blue">
            Audio
          </legend>
          <label
            >Master <input type="range" min="0" max="100" value="70"
          /></label>
          <label>SFX <input type="range" min="0" max="100" value="80" /></label>
          <label
            >Music <input type="range" min="0" max="100" value="25"
          /></label>
        </fieldset>
        <fieldset class="grid gap-2">
          <legend class="font-bold uppercase tracking-widest text-malibu-blue">
            Gameplay
          </legend>
          <label><input type="checkbox" checked /> Damage numbers</label>
          <label><input type="checkbox" checked /> Fog of war</label>
        </fieldset>
      </form>
    `;
  }
}

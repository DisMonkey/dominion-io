import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("dominion-perf-monitor")
export class PerfMonitor extends LitElement {
  @property({ type: Number }) fps = 0;
  @property({ type: Number }) renderMs = 0;
  @property({ type: Number }) tileCount = 0;

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <output
        class="fixed left-2 top-2 z-50 rounded bg-black/70 px-2 py-1 font-mono text-xs text-dominion-text-light"
        aria-label="Performance monitor"
      >
        ${this.fps.toFixed(0)} FPS · ${this.renderMs.toFixed(1)} ms ·
        ${this.tileCount.toLocaleString()} tiles
      </output>
    `;
  }
}

import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { translateText } from "./Utils";

@customElement("game-starting-modal")
export class GameStartingModal extends LitElement {
  @state()
  isVisible = false;

  createRenderRoot() {
    return this;
  }

  render() {
    const isVisible = this.isVisible;
    return html`
      <div
        class="fixed inset-0 bg-slate-950/60 backdrop-blur-[6px] z-[9998] transition-all duration-300 ${isVisible
          ? "opacity-100 visible"
          : "opacity-0 invisible"}"
      ></div>
      <div
        class="fixed top-1/2 left-1/2 bg-slate-950/88 backdrop-blur-xl border border-cyan-300/20 p-6 rounded-xl z-[9999] shadow-[0_0_60px_rgba(40,224,185,0.18)] text-white w-[400px] max-w-[calc(100vw-2rem)] text-center transition-all duration-300 -translate-x-1/2 ${isVisible
          ? "opacity-100 visible -translate-y-1/2"
          : "opacity-0 invisible -translate-y-[48%]"}"
      >
        <div
          class="text-base font-medium tracking-wider uppercase text-cyan-200/60 mb-3"
        >
          DOMINION
        </div>
        <a
          href="https://github.com/dominion-io/dominion-io/blob/main/CREDITS.md"
          target="_blank"
          rel="noopener noreferrer"
          class="block mb-4 text-lg font-medium tracking-wider uppercase text-malibu-blue no-underline transition-colors duration-200 hover:text-aquarius"
          >${translateText("game_starting_modal.credits")}</a
        >
        <p class="text-base text-white/40 mb-4">
          ${translateText("game_starting_modal.code_license")}
        </p>
        <p
          class="text-xl font-medium tracking-wider text-white bg-cyan-300/8 border border-cyan-300/15 px-4 py-3 rounded-lg"
        >
          ${translateText("game_starting_modal.title")}
        </p>
      </div>
    `;
  }

  show() {
    this.isVisible = true;
    this.requestUpdate();
  }

  hide() {
    this.isVisible = false;
    this.requestUpdate();
  }
}

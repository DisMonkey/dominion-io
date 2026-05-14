import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { assetUrl } from "../../core/AssetUrls";

@customElement("page-footer")
export class Footer extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <footer
        class="[.in-game_&]:hidden bg-zinc-900/90 backdrop-blur-md flex flex-col items-center justify-center gap-1 pt-1 pb-3 text-white/50 w-full border-t border-white/10 shrink-0 relative z-50"
      >
        <div
          class="flex items-center justify-center gap-4 lg:gap-6 pt-2 w-full relative"
        >
          <lang-selector
            class="absolute right-4 top-0 sm:top-[10px]"
          ></lang-selector>
          <span class="text-xs text-white/50">
            Created by <span class="text-[#C8973A] font-semibold">DisMonkey</span>
            · Built with
            <a
              href="https://claude.ai/code"
              target="_blank"
              rel="noopener noreferrer"
              class="text-white/50 hover:text-white transition-colors underline underline-offset-2"
            >Claude Code</a>
            · Based on
            <a
              href="https://github.com/openfrontio/OpenFrontIO"
              target="_blank"
              rel="noopener noreferrer"
              class="text-white/50 hover:text-white transition-colors underline underline-offset-2"
            >OpenFront.io</a>
          </span>
        </div>
        <div
          class="text-xs mt-1 lg:mt-2 flex items-center justify-center gap-4 px-4"
        >
          <a
            href="/terms-of-service.html"
            data-i18n="main.terms_of_service"
            target="_blank"
            class="hover:text-white transition-colors"
          ></a>
          <span data-i18n="main.copyright"></span>
          <a
            href="/privacy-policy.html"
            data-i18n="main.privacy_policy"
            target="_blank"
            class="hover:text-white transition-colors"
          ></a>
        </div>
      </footer>
    `;
  }
}

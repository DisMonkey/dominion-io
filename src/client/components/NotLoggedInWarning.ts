import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UserMeResponse } from "../../core/ApiSchemas";
import { hasLinkedAccount } from "../Api";

@customElement("not-logged-in-warning")
export class NotLoggedInWarning extends LitElement {
  @state() private linked = false;

  private _onUserMe = (event: CustomEvent<UserMeResponse | false>) => {
    this.linked = hasLinkedAccount(event.detail);
  };

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener(
      "userMeResponse",
      this._onUserMe as EventListener,
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener(
      "userMeResponse",
      this._onUserMe as EventListener,
    );
  }

  render() {
    if (this.linked) return html``;

    return html`<div class="no-crazygames flex items-center">
      <button
        class="text-xs transition-colors duration-200 cursor-pointer"
        style="color:#C8973A80;background:none;border:none;padding:0;"
        @mouseenter=${(e: Event) => { (e.currentTarget as HTMLElement).style.color = '#C8973A'; }}
        @mouseleave=${(e: Event) => { (e.currentTarget as HTMLElement).style.color = '#C8973A80'; }}
        @click=${() => {
          window.showPage?.("page-account");
        }}
      >
        Sign in with Google to save progress
      </button>
    </div>`;
  }
}

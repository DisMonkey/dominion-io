import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("dominion-about-modal")
export class AboutModal extends LitElement {
  @state() private _open = false;
  @state() private _visible = false;

  private _boundOpen = () => this.openModal();
  private _boundKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this._open) this.closeModal();
  };

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("open-about-modal", this._boundOpen);
    document.addEventListener("keydown", this._boundKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("open-about-modal", this._boundOpen);
    document.removeEventListener("keydown", this._boundKeydown);
  }

  openModal() {
    this._open = true;
    requestAnimationFrame(() => {
      this._visible = true;
    });
  }

  closeModal() {
    this._visible = false;
    setTimeout(() => {
      this._open = false;
    }, 250);
  }

  render() {
    if (!this._open) return nothing;

    return html`
      <!-- Backdrop -->
      <div
        style="
          position:fixed;inset:0;z-index:99990;
          background:rgba(0,0,0,0.75);
          backdrop-filter:blur(4px);
          transition:opacity 0.25s ease;
          opacity:${this._visible ? 1 : 0};
        "
        @click=${this.closeModal}
      ></div>

      <!-- Modal -->
      <div
        role="dialog"
        aria-modal="true"
        aria-label="About Dominion.io"
        style="
          position:fixed;inset:0;z-index:99991;
          display:flex;align-items:center;justify-content:center;
          padding:1rem;
          pointer-events:none;
        "
      >
        <div
          style="
            pointer-events:all;
            background:#0D1117;
            border:1px solid rgba(200,151,58,0.3);
            border-radius:8px;
            max-width:28rem;
            width:100%;
            max-height:90vh;
            overflow-y:auto;
            padding:2rem 1.75rem;
            font-family:Rajdhani,Arial,sans-serif;
            position:relative;
            transition:opacity 0.25s ease, transform 0.25s ease;
            opacity:${this._visible ? 1 : 0};
            transform:${this._visible ? "scale(1)" : "scale(0.95)"};
          "
        >
          <!-- Close button -->
          <button
            @click=${this.closeModal}
            aria-label="Close"
            style="
              position:absolute;top:1rem;right:1rem;
              background:transparent;border:none;
              color:rgba(232,224,208,0.4);font-size:1.25rem;
              cursor:pointer;line-height:1;padding:0.25rem 0.5rem;
              transition:color 0.2s;
            "
            onmouseover="this.style.color='rgba(232,224,208,0.9)'"
            onmouseout="this.style.color='rgba(232,224,208,0.4)'"
          >✕</button>

          <!-- Shield logo + title -->
          <div style="text-align:center;margin-bottom:1.5rem;">
            <svg
              width="48" height="48"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              style="display:inline-block;margin-bottom:0.75rem;"
              aria-hidden="true"
            >
              <path
                d="M50 5L90 22V50C90 72 73 88 50 97C27 88 10 72 10 50V22L50 5Z"
                fill="#161D22" stroke="#C8973A" stroke-width="4"
              />
              <circle cx="50" cy="50" r="20" stroke="#C8973A" stroke-width="3" fill="none"/>
              <circle cx="50" cy="50" r="6" fill="#D64045"/>
              <line x1="50" y1="30" x2="50" y2="70" stroke="#C8973A" stroke-width="2"/>
              <line x1="30" y1="50" x2="70" y2="50" stroke="#C8973A" stroke-width="2"/>
            </svg>

            <div style="font-size:2rem;font-weight:800;letter-spacing:0.12em;color:#E8E0D0;line-height:1;">
              DOMINION<span style="color:#C8973A;">.IO</span>
            </div>
            <div style="font-size:0.75rem;color:#C8973A;letter-spacing:0.15em;margin-top:0.25rem;font-family:'Share Tech Mono',monospace;">
              v1.0.0
            </div>

            <div style="margin-top:0.75rem;font-size:0.85rem;color:rgba(232,224,208,0.6);font-style:italic;line-height:1.5;">
              "The greatest free browser strategy game ever made."
            </div>
          </div>

          ${this._divider()}

          <!-- Created by -->
          <div style="margin-bottom:1.25rem;">
            <div style="font-size:0.65rem;letter-spacing:0.18em;color:#C8973A;text-transform:uppercase;margin-bottom:0.4rem;font-family:'Share Tech Mono',monospace;">
              Created By
            </div>
            <div style="font-size:1.5rem;font-weight:700;color:#C8973A;letter-spacing:0.05em;">
              DisMonkey
            </div>
          </div>

          <!-- Built with AI -->
          <div style="margin-bottom:1.25rem;">
            <div style="font-size:0.65rem;letter-spacing:0.18em;color:#C8973A;text-transform:uppercase;margin-bottom:0.4rem;font-family:'Share Tech Mono',monospace;">
              Built with AI Assistance
            </div>
            <div style="color:rgba(232,224,208,0.85);font-size:0.95rem;">
              Claude Code by Anthropic
            </div>
          </div>

          ${this._divider()}

          <!-- Based on -->
          <div style="margin-bottom:1.25rem;">
            <div style="font-size:0.65rem;letter-spacing:0.18em;color:#C8973A;text-transform:uppercase;margin-bottom:0.4rem;font-family:'Share Tech Mono',monospace;">
              Based On
            </div>
            <div style="color:rgba(232,224,208,0.85);font-size:0.95rem;line-height:1.6;">
              OpenFront.io<br/>
              <a
                href="https://github.com/openfrontio/OpenFrontIO"
                target="_blank"
                rel="noopener noreferrer"
                style="color:#C8973A;text-decoration:underline;font-size:0.85rem;font-family:'Share Tech Mono',monospace;"
              >github.com/openfrontio/OpenFrontIO</a><br/>
              <span style="font-size:0.8rem;color:rgba(232,224,208,0.5);">Licensed under AGPL-3.0</span>
            </div>
          </div>

          <!-- Special thanks -->
          <div style="margin-bottom:1.25rem;">
            <div style="font-size:0.65rem;letter-spacing:0.18em;color:#C8973A;text-transform:uppercase;margin-bottom:0.4rem;font-family:'Share Tech Mono',monospace;">
              Special Thanks
            </div>
            <div style="color:rgba(232,224,208,0.75);font-size:0.9rem;line-height:1.8;">
              OpenFront.io contributors<br/>
              Anthropic for Claude Code<br/>
              All the historical empires that inspired this game
            </div>
          </div>

          ${this._divider()}

          <!-- Tech stack -->
          <div style="margin-bottom:1.5rem;">
            <div style="font-size:0.65rem;letter-spacing:0.18em;color:#C8973A;text-transform:uppercase;margin-bottom:0.4rem;font-family:'Share Tech Mono',monospace;">
              Tech Stack
            </div>
            <div style="color:rgba(232,224,208,0.75);font-size:0.85rem;line-height:1.8;font-family:'Share Tech Mono',monospace;">
              Frontend: TypeScript + Vite<br/>
              Backend: Node.js<br/>
              Hosting: Cloudflare Pages + Render<br/>
              Maps: Real-world geography
            </div>
          </div>

          ${this._divider()}

          <!-- Quote -->
          <div style="text-align:center;padding-top:0.25rem;">
            <p style="font-size:0.8rem;color:rgba(232,224,208,0.6);font-style:italic;line-height:1.5;">
              "An army marches on its stomach."
            </p>
            <p style="font-size:0.72rem;color:#C8973A;letter-spacing:0.1em;margin-top:0.25rem;font-family:'Share Tech Mono',monospace;">
              — Napoleon Bonaparte
            </p>
          </div>
        </div>
      </div>
    `;
  }

  private _divider() {
    return html`<div style="border-top:1px solid rgba(200,151,58,0.2);margin:1.25rem 0;"></div>`;
  }
}

declare global {
  interface WindowEventMap {
    "open-about-modal": Event;
  }
}

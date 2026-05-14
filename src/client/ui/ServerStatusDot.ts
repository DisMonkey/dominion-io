import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  serverStatus,
  type ServerStatusInfo,
  type ServerStatusState,
} from "../services/ServerStatus";

@customElement("dominion-server-status-dot")
export class ServerStatusDot extends LitElement {
  @state() private _state: ServerStatusState = serverStatus.info.state;
  @state() private _players = serverStatus.info.players;

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    serverStatus.addEventListener("change", this._onStatusChange);
    // Sync immediately in case state changed before mount
    const { state, players } = serverStatus.info;
    this._state = state;
    this._players = players;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    serverStatus.removeEventListener("change", this._onStatusChange);
  }

  private _onStatusChange = (e: Event) => {
    const { state, players } = (e as CustomEvent<ServerStatusInfo>).detail;
    this._state = state;
    this._players = players;
  };

  render() {
    const configs: Record<
      ServerStatusState,
      { color: string; pulse: boolean; label: string }
    > = {
      checking: {
        color: "bg-yellow-400",
        pulse: true,
        label: "Connecting to server…",
      },
      waking: {
        color: "bg-yellow-400",
        pulse: true,
        label: "Server waking up — may take up to 60s",
      },
      online: {
        color: "bg-green-400",
        pulse: false,
        label: `Online · ${this._players} player${this._players !== 1 ? "s" : ""}`,
      },
      offline: {
        color: "bg-red-500",
        pulse: false,
        label: "Server offline · Solo only",
      },
    };

    const { color, pulse, label } = configs[this._state];

    return html`
      <div
        class="flex items-center gap-1.5 text-xs text-white/50 select-none"
        title="${label}"
        aria-label="${label}"
        aria-live="polite"
      >
        <span class="relative flex h-2 w-2 shrink-0">
          ${pulse
            ? html`<span
                class="animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75"
              ></span>`
            : nothing}
          <span
            class="relative inline-flex rounded-full h-2 w-2 ${color}"
          ></span>
        </span>
        <span class="hidden sm:inline whitespace-nowrap">${label}</span>
      </div>
    `;
  }
}


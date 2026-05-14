import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  serverStatus,
  type ServerStatusInfo,
} from "../services/ServerStatus";

const QUOTES: { text: string; author: string }[] = [
  {
    text: "The supreme art of war is to subdue the enemy without fighting.",
    author: "Sun Tzu",
  },
  {
    text: "In preparing for battle, I have always found that plans are useless, but planning is indispensable.",
    author: "Dwight D. Eisenhower",
  },
  {
    text: "Every battle is won before it is ever fought.",
    author: "Sun Tzu",
  },
  {
    text: "No plan survives contact with the enemy.",
    author: "Helmuth von Moltke",
  },
  {
    text: "Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.",
    author: "Sun Tzu",
  },
  {
    text: "An army marches on its stomach.",
    author: "Napoleon Bonaparte",
  },
  {
    text: "Know your enemy and know yourself — in a hundred battles, you will never be defeated.",
    author: "Sun Tzu",
  },
  {
    text: "The object of war is not to die for your country, but to make the other fellow die for his.",
    author: "George S. Patton",
  },
];

const STATUS_MESSAGES = [
  "Deploying Command Uplink...",
  "Establishing secure connection...",
  "Syncing battle data...",
  "Routing through command network...",
  "Authenticating battlefield access...",
];

@customElement("dominion-wakeup-screen")
export class WakeupScreen extends LitElement {
  @state() private _visible = false;
  @state() private _fadingOut = false;
  @state() private _showConnected = false;
  @state() private _offline = false;
  @state() private _quoteIndex = 0;
  @state() private _msgIndex = 0;
  @state() private _players = 0;

  private _quoteTimer: ReturnType<typeof setInterval> | null = null;
  private _msgTimer: ReturnType<typeof setInterval> | null = null;
  private _connectedTimer: ReturnType<typeof setTimeout> | null = null;

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    serverStatus.addEventListener("change", this._onStatusChange);
    serverStatus.addEventListener("connected", this._onConnected);

    // Reflect current state in case we connected after it changed
    const { state, players } = serverStatus.info;
    this._players = players;
    if (state === "waking") {
      this._offline = false;
      this._show();
    } else if (state === "offline") {
      this._offline = true;
      this._show();
    }
    // If already online, stay hidden
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    serverStatus.removeEventListener("change", this._onStatusChange);
    serverStatus.removeEventListener("connected", this._onConnected);
    this._stopTimers();
  }

  private _onStatusChange = (e: Event) => {
    const { state, players } = (e as CustomEvent<ServerStatusInfo>).detail;
    this._players = players;
    if (state === "waking" && !this._visible && !this._fadingOut) {
      this._offline = false;
      this._show();
    } else if (state === "offline") {
      this._offline = true;
      if (!this._visible) this._show();
    }
  };

  private _onConnected = (e: Event) => {
    const { players } = (e as CustomEvent<ServerStatusInfo>).detail;
    this._players = players;
    this._offline = false;

    if (!this._visible) return; // Was never shown — skip flash

    this._showConnected = true;
    this._connectedTimer = setTimeout(() => {
      this._showConnected = false;
      this._fadeOut();
    }, 1_500);
  };

  private _show() {
    this._visible = true;
    this._fadingOut = false;
    this._quoteIndex = Math.floor(Math.random() * QUOTES.length);
    this._msgIndex = 0;
    this._stopTimers();
    this._quoteTimer = setInterval(() => {
      this._quoteIndex = (this._quoteIndex + 1) % QUOTES.length;
    }, 3_000);
    this._msgTimer = setInterval(() => {
      this._msgIndex = (this._msgIndex + 1) % STATUS_MESSAGES.length;
    }, 3_000);
  }

  private _fadeOut() {
    this._fadingOut = true;
    setTimeout(() => {
      this._visible = false;
      this._fadingOut = false;
      this._stopTimers();
    }, 600);
  }

  private _stopTimers() {
    if (this._quoteTimer !== null) {
      clearInterval(this._quoteTimer);
      this._quoteTimer = null;
    }
    if (this._msgTimer !== null) {
      clearInterval(this._msgTimer);
      this._msgTimer = null;
    }
    if (this._connectedTimer !== null) {
      clearTimeout(this._connectedTimer);
      this._connectedTimer = null;
    }
  }

  private _playSolo() {
    window.showPage?.("page-single-player");
    this._fadeOut();
  }

  render() {
    if (!this._visible) return nothing;

    const quote = QUOTES[this._quoteIndex];
    const msg = STATUS_MESSAGES[this._msgIndex];

    return html`
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Connecting to server"
        style="
          position:fixed;inset:0;z-index:99998;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          gap:1.5rem;padding:1.5rem;
          background:#0d1117;
          font-family:Rajdhani,Arial,sans-serif;
          transition:opacity 0.6s ease;
          opacity:${this._fadingOut ? 0 : 1};
        "
      >
        <!-- Connected flash -->
        ${this._showConnected
          ? html`
              <div
                style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:10;pointer-events:none;"
              >
                <div
                  style="font-size:1.5rem;font-weight:700;color:#4ade80;letter-spacing:0.2em;animation:wakeup-pulse 0.5s ease-in-out infinite alternate;"
                >
                  ✓ Connected!
                </div>
              </div>
            `
          : nothing}

        <!-- Logo -->
        <svg
          width="200"
          height="50"
          viewBox="0 0 540 108"
          xmlns="http://www.w3.org/2000/svg"
          style="max-width:80vw;height:auto;"
          aria-label="Dominion.io"
        >
          <rect width="540" height="108" rx="8" fill="#0D1117" />
          <path
            d="M56 12L96 28V54C96 75 81 92 56 100C31 92 16 75 16 54V28L56 12Z"
            fill="#161D22"
            stroke="#C8973A"
            stroke-width="3"
          />
          <circle cx="56" cy="56" r="19" stroke="#C8973A" stroke-width="3" />
          <circle cx="56" cy="56" r="5" fill="#D64045" />
          <text x="122" y="69" font-family="Rajdhani,Arial,sans-serif">
            <tspan
              fill="#E8E0D0"
              font-size="48"
              font-weight="800"
              letter-spacing="6"
              >DOMINION</tspan
            ><tspan fill="#C8973A" font-size="36" font-weight="700" letter-spacing="2"
              >.IO</tspan
            >
          </text>
        </svg>

        <!-- Historical quote -->
        <div
          style="max-width:28rem;text-align:center;padding:0 1rem;min-height:5rem;display:flex;flex-direction:column;justify-content:center;gap:0.35rem;"
        >
          <p
            style="font-size:0.875rem;color:rgba(232,224,208,0.75);font-style:italic;line-height:1.5;"
          >
            "${quote.text}"
          </p>
          <p
            style="font-size:0.75rem;color:#c8973a;letter-spacing:0.1em;font-family:'Share Tech Mono',monospace;"
          >
            — ${quote.author}
          </p>
        </div>

        ${this._offline
          ? html`
              <!-- Offline state -->
              <div
                style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;text-align:center;"
              >
                <div style="font-size:1.75rem;color:#f87171;">⊗</div>
                <p style="color:rgba(232,224,208,0.8);font-size:0.9rem;">
                  Servers are resting. Solo mode is always available!
                </p>
                <p
                  style="color:#4b5563;font-size:0.75rem;font-family:'Share Tech Mono',monospace;"
                >
                  Retrying automatically in the background…
                </p>
              </div>
            `
          : html`
              <!-- Waking / loading state -->
              <div
                style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"
              >
                <p
                  style="color:#c8973a;font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;font-family:'Share Tech Mono',monospace;"
                >
                  ${msg}
                </p>
                <!-- Animated loading bar -->
                <div
                  style="width:15rem;max-width:80vw;height:3px;background:#1e2530;border-radius:999px;overflow:hidden;"
                >
                  <div
                    style="height:100%;background:linear-gradient(90deg,#C8973A,#D64045);border-radius:999px;animation:wakeup-load 1.8s ease-in-out infinite;"
                  ></div>
                </div>
              </div>
            `}

        <!-- Info text -->
        <p
          style="color:#4b5563;font-size:0.72rem;text-align:center;max-width:18rem;line-height:1.5;"
        >
          First connection may take up to 60 seconds — free servers wake from
          sleep
        </p>

        <!-- Play solo button -->
        <button
          @click=${this._playSolo}
          style="
            margin-top:0.25rem;padding:0.5rem 1.5rem;
            border-radius:4px;border:1px solid rgba(200,151,58,0.5);
            background:transparent;color:#c8973a;
            font-size:0.8rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;
            cursor:pointer;transition:border-color 0.2s,background 0.2s;
            font-family:Rajdhani,Arial,sans-serif;
          "
          onmouseover="this.style.borderColor='#c8973a';this.style.background='rgba(200,151,58,0.1)'"
          onmouseout="this.style.borderColor='rgba(200,151,58,0.5)';this.style.background='transparent'"
        >
          ▶ Play Solo Instead
        </button>

        <style>
          @keyframes wakeup-load {
            0% {
              width: 0%;
              margin-left: 0;
            }
            50% {
              width: 60%;
              margin-left: 20%;
            }
            100% {
              width: 0%;
              margin-left: 100%;
            }
          }
          @keyframes wakeup-pulse {
            from {
              opacity: 0.8;
            }
            to {
              opacity: 1;
            }
          }
        </style>
      </div>
    `;
  }
}

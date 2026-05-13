import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface GameNotification {
  id: number;
  type: NotificationType;
  message: string;
  timestamp: number;
}

const TYPE_CLASSES: Record<NotificationType, string> = {
  info: "border-dominion-border bg-dominion-bg-panel text-dominion-text-light",
  success: "border-green-500/40 bg-green-500/10 text-green-300",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  error: "border-red-500/40 bg-red-500/10 text-red-300",
};

const DISMISS_AFTER_MS = 4000;

let nextId = 1;

@customElement("dominion-notification-system")
export class NotificationSystem extends LitElement {
  @state() private notifications: GameNotification[] = [];

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("dominion-notify", this.handleNotify);
  }

  disconnectedCallback() {
    window.removeEventListener("dominion-notify", this.handleNotify);
    super.disconnectedCallback();
  }

  private handleNotify = (e: Event) => {
    const { message, type = "info" } = (e as CustomEvent<{
      message: string;
      type?: NotificationType;
    }>).detail;
    this.addNotification(message, type);
  };

  addNotification(message: string, type: NotificationType = "info") {
    const id = nextId++;
    this.notifications = [
      { id, type, message, timestamp: Date.now() },
      ...this.notifications,
    ].slice(0, 6);
    setTimeout(() => this.dismiss(id), DISMISS_AFTER_MS);
  }

  private dismiss(id: number) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }

  render() {
    if (this.notifications.length === 0) return nothing;

    return html`
      <div
        class="pointer-events-none fixed right-4 top-4 z-[9000] flex flex-col gap-2"
        aria-live="polite"
        aria-label="Game notifications"
      >
        ${this.notifications.map(
          (n) => html`
            <div
              class="pointer-events-auto flex items-start gap-3 rounded border px-4 py-3 text-sm shadow-lg backdrop-blur-sm transition-all ${TYPE_CLASSES[n.type]}"
              role="status"
              aria-label=${n.message}
            >
              <span class="flex-1 leading-snug">${n.message}</span>
              <button
                class="shrink-0 text-xs opacity-60 hover:opacity-100 focus:outline-none"
                aria-label="Dismiss notification"
                @click=${() => this.dismiss(n.id)}
              >
                ✕
              </button>
            </div>
          `,
        )}
      </div>
    `;
  }
}

export function notify(
  message: string,
  type: NotificationType = "info",
): void {
  window.dispatchEvent(
    new CustomEvent("dominion-notify", { detail: { message, type } }),
  );
}

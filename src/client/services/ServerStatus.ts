export type ServerStatusState = "checking" | "waking" | "online" | "offline";

export interface ServerStatusInfo {
  state: ServerStatusState;
  players: number;
  games: number;
}

const _serverBase = (() => {
  const d = process?.env?.WEBSOCKET_URL;
  return d ? `https://${d}` : "";
})();

class ServerStatusService extends EventTarget {
  private _state: ServerStatusState = "checking";
  private _players = 0;
  private _games = 0;

  constructor() {
    super();
    this._start();
  }

  private _start() {
    this._poll();

    // Check every 10s (also acts as keep-alive for Render)
    setInterval(() => this._poll(), 10_000);

    // Dedicated keep-alive every 4 minutes for players sitting on the menu
    setInterval(() => this._ping(), 4 * 60_000);

    // After 3s with no reply, transition to waking to show the overlay
    setTimeout(() => {
      if (this._state === "checking") {
        this._transition("waking");
      }
    }, 3_000);

    // After 90s with no reply, declare offline
    setTimeout(() => {
      if (this._state === "checking" || this._state === "waking") {
        this._transition("offline");
      }
    }, 90_000);
  }

  private async _poll() {
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 8_000);
      const res = await fetch(`${_serverBase}/health`, { signal: ctrl.signal });
      clearTimeout(tid);
      if (res.ok) {
        const data: { players?: number; games?: number } = await res
          .json()
          .catch(() => ({}));
        this._players = data.players ?? 0;
        this._games = data.games ?? 0;
        const prev = this._state;
        if (prev !== "online") {
          this._transition("online");
        } else {
          // Already online — just refresh player count
          this.dispatchEvent(
            new CustomEvent<ServerStatusInfo>("change", { detail: this.info }),
          );
        }
      }
    } catch {
      if (this._state === "online") {
        this._transition("waking");
      }
    }
  }

  private async _ping() {
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 5_000);
      await fetch(`${_serverBase}/health`, { signal: ctrl.signal });
      clearTimeout(tid);
    } catch {
      // Silent — this is just a keep-alive
    }
  }

  private _transition(next: ServerStatusState) {
    const prev = this._state;
    this._state = next;
    this.dispatchEvent(
      new CustomEvent<ServerStatusInfo>("change", { detail: this.info }),
    );
    if (
      next === "online" &&
      (prev === "waking" || prev === "checking" || prev === "offline")
    ) {
      this.dispatchEvent(
        new CustomEvent<ServerStatusInfo>("connected", { detail: this.info }),
      );
    }
  }

  get info(): ServerStatusInfo {
    return {
      state: this._state,
      players: this._players,
      games: this._games,
    };
  }
}

// Singleton — starts polling immediately on import
export const serverStatus = new ServerStatusService();

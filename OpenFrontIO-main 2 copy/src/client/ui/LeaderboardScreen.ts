import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

export interface LeaderboardRow {
  rank: number;
  playerName: string;
  wins: number;
  winRate: number;
  favoriteMap?: string;
}

@customElement("dominion-leaderboard-screen")
export class LeaderboardScreen extends LitElement {
  @property({ type: Array }) rows: LeaderboardRow[] = [];

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <section class="text-dominion-text-light" aria-label="Leaderboard">
        <table class="w-full border-collapse text-left">
          <thead class="text-dominion-text-muted">
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Wins</th>
              <th>Win Rate</th>
              <th>Favorite Map</th>
            </tr>
          </thead>
          <tbody>
            ${this.rows.map(
              (row) => html`
                <tr class="border-t border-dominion-border">
                  <td>${row.rank}</td>
                  <td>${row.playerName}</td>
                  <td>${row.wins}</td>
                  <td>${Math.round(row.winRate * 100)}%</td>
                  <td>${row.favoriteMap ?? "Unknown"}</td>
                </tr>
              `,
            )}
          </tbody>
        </table>
      </section>
    `;
  }
}

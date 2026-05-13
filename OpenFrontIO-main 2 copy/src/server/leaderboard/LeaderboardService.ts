import fs from "fs/promises";
import path from "path";

export interface LeaderboardEntry {
  playerName: string;
  wins: number;
  gamesPlayed: number;
  totalTerritoryCaptured: number;
  nukesLaunched: number;
  favoriteMap?: string;
}

export interface RankedLeaderboardEntry extends LeaderboardEntry {
  rank: number;
  winRate: number;
}

export class LeaderboardService {
  constructor(
    private readonly filePath = path.join(process.cwd(), "leaderboard.json"),
  ) {}

  async top(limit: number): Promise<RankedLeaderboardEntry[]> {
    const entries = await this.readEntries();
    return entries
      .sort((a, b) => b.wins - a.wins || b.gamesPlayed - a.gamesPlayed)
      .slice(0, limit)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
        winRate: entry.gamesPlayed === 0 ? 0 : entry.wins / entry.gamesPlayed,
      }));
  }

  async recordGameEnd(entry: LeaderboardEntry): Promise<void> {
    const entries = await this.readEntries();
    const existing = entries.find(
      (item) => item.playerName === entry.playerName,
    );
    if (existing === undefined) {
      entries.push(entry);
    } else {
      existing.wins += entry.wins;
      existing.gamesPlayed += entry.gamesPlayed;
      existing.totalTerritoryCaptured += entry.totalTerritoryCaptured;
      existing.nukesLaunched += entry.nukesLaunched;
      existing.favoriteMap = entry.favoriteMap ?? existing.favoriteMap;
    }
    await fs.writeFile(this.filePath, JSON.stringify(entries, null, 2));
  }

  private async readEntries(): Promise<LeaderboardEntry[]> {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      const parsed = JSON.parse(data) as LeaderboardEntry[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }
}

import { Difficulty } from "./game/Game";

export enum BotDifficulty {
  Recruit = "recruit",
  Regular = "regular",
  Veteran = "veteran",
  Elite = "elite",
  Legendary = "legendary",
}

export const BOT_DIFFICULTY_LABELS: Record<BotDifficulty, string> = {
  [BotDifficulty.Recruit]: "Recruit",
  [BotDifficulty.Regular]: "Regular",
  [BotDifficulty.Veteran]: "Veteran",
  [BotDifficulty.Elite]: "Elite",
  [BotDifficulty.Legendary]: "Legendary",
};

export const BOT_DIFFICULTY_DESCRIPTIONS: Record<BotDifficulty, string> = {
  [BotDifficulty.Recruit]:
    "Makes obvious mistakes, expands slowly, never uses special abilities.",
  [BotDifficulty.Regular]:
    "Solid basic play. Uses alliances. Occasionally activates special abilities.",
  [BotDifficulty.Veteran]:
    "Good macro strategy. Researches techs. Targets weak players.",
  [BotDifficulty.Elite]:
    "Near-human play. Uses all game systems. Adapts to your strategy.",
  [BotDifficulty.Legendary]:
    "Optimized, ruthless, reads the board. Will betray you at the perfect moment.",
};

export function botDifficultyToCoreDifficulty(
  tier: BotDifficulty,
): Difficulty {
  switch (tier) {
    case BotDifficulty.Recruit:
      return Difficulty.Easy;
    case BotDifficulty.Regular:
      return Difficulty.Easy;
    case BotDifficulty.Veteran:
      return Difficulty.Medium;
    case BotDifficulty.Elite:
      return Difficulty.Hard;
    case BotDifficulty.Legendary:
      return Difficulty.Impossible;
  }
}

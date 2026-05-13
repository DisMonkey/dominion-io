import { PlayerID } from "./game/Game";
import { TileRef } from "./game/GameMap";

export interface WarGoal {
  playerId: PlayerID;
  tile: TileRef;
  capturedAtTick?: number;
}

export function warGoalReward(capturedGoals: number): {
  gold: bigint;
  incomeBonusPercent: number;
} {
  return {
    gold: 500n,
    incomeBonusPercent: capturedGoals * 5,
  };
}

export function warGoalProgress(goals: readonly WarGoal[]): {
  captured: number;
  total: number;
} {
  return {
    captured: goals.filter((goal) => goal.capturedAtTick !== undefined).length,
    total: goals.length,
  };
}
